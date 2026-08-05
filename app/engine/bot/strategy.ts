import { GameState } from '../../types';
import { EndingId } from '../endings';
import { getAllAccessibleFiles } from '../filesystem';
import { isEvidencePath } from '../evidenceRevelation';
import { OVERRIDE_PASSWORD } from '../overrideSecret';
import { isSecretTarget, secretCriticalTargets } from './targets';
import { buildEndingDossier } from './endingTargets';
import { BOT_SCENARIOS, BotScenarioId } from './scenarios';
import { BOT_PROBE_COMMANDS, BOT_PROBES_EXPECTING_REJECTION } from './probes';
import {
  BotDecision,
  BotGoal,
  BotLevel,
  BotMemory,
  DEFAULT_BOT_GOAL,
  DEFAULT_BOT_MAX_TURNS,
} from './types';

const MAX_SAVED = 10;

// The designed override-password hint file (a riddle whose answer is COLHEITA),
// accessible before admin is unlocked. A real "attentive player" deduces the
// password from it, so the bot reads this file first rather than knowing the
// password up front — reading it stands in for that deduction.
const PASSWORD_HINT_FILE = '/internal/override_protocol_memo.txt';

// Per-level engagement policy.
//  - dummy:  a clueless player. Never unlocks admin, so only the handful of
//            pre-admin evidence files are reachable; it cannot reach the 10
//            saves a win requires and terminates gracefully.
//  - novice: a competent player. Unlocks admin, saves evidence broadly, and
//            wins a (non-secret) ending.
//  - pro:    an expert. Unlocks admin, prioritises the secret-ending file set,
//            and wins the secret ending.
//  - chaos:  a restless player. Wins like novice, but spends its spare turns
//            poking at the whole command surface — including inputs a careful
//            bot would never type — so a run exercises far more than the
//            happy path.
const LEVEL_POLICY: Record<
  BotLevel,
  {
    unlocksAdmin: boolean;
    saveTarget: number;
    readLimit: number;
    targetsSecret: boolean;
    probes: boolean;
  }
> = {
  dummy: { unlocksAdmin: false, saveTarget: 5, readLimit: 12, targetsSecret: false, probes: false },
  novice: {
    unlocksAdmin: true,
    saveTarget: 10,
    readLimit: 999,
    targetsSecret: false,
    probes: false,
  },
  pro: { unlocksAdmin: true, saveTarget: 10, readLimit: 999, targetsSecret: true, probes: false },
  chaos: { unlocksAdmin: true, saveTarget: 10, readLimit: 999, targetsSecret: false, probes: true },
};

function basename(path: string): string {
  return path.split('/').pop() || path;
}

function progressSignature(state: GameState): string {
  const admin = state.flags?.adminUnlocked ? 1 : 0;
  const gen = state.leakSequenceGenerated ? 1 : 0;
  return `${state.filesRead.size}:${state.savedFiles.size}:${state.leakSequenceProgress}:${admin}:${gen}`;
}

/**
 * The stuck-detector signature for a goal-driven run.
 *
 * "Progress" means something different once the run is aiming at a game-over
 * screen: `invalid-threshold` reads nothing and saves nothing for eight turns
 * straight, and `purge-protocol` spends its last eight turns burning a doom
 * countdown with a read-only command. Both look identical to a wedged run under
 * the dossier-shaped signature above and would be stopped as "stuck" three
 * turns before the thing they exist to reach. These are the counters those runs
 * actually move.
 */
function goalProgressSignature(state: GameState): string {
  return [
    progressSignature(state),
    state.detectionLevel,
    state.legacyAlertCounter,
    state.wrongAttempts,
    state.sessionDoomCountdown,
    state.terribleMistakeTriggered ? 1 : 0,
  ].join(':');
}

/**
 * Stable per-(seed, path) hash used to order files of equal priority.
 *
 * Without this the bot was seed-invariant in everything that mattered: file
 * order came from the filesystem walk, so every seed opened the same files in
 * the same order and `novice` produced `the_2026_warning` on all 24 seeds of a
 * sweep. `determineEnding` reads the *dossier*, so a sweep that always builds
 * the same dossier can only ever exercise one of the twelve endings — the
 * other eleven, and every content path behind them, went unswept.
 *
 * FNV-1a over the path, mixed with the seed. Deterministic, so a reported seed
 * still replays exactly; varied, so different seeds build different dossiers.
 */
function seededOrder(seed: number, path: string): number {
  let hash = (0x811c9dc5 ^ seed) >>> 0;
  for (let i = 0; i < path.length; i++) {
    hash = (hash ^ path.charCodeAt(i)) >>> 0;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash;
}

/** Whether this level wants to read/save the given file at all. */
function wantsFile(path: string, level: BotLevel): boolean {
  if (level === 'pro') return isSecretTarget(path) || isEvidencePath(path);
  return isEvidencePath(path);
}

/**
 * Save/read priority. Higher = handled first. For pro the secret-critical files
 * outrank other secret targets, which outrank plain evidence, so the 4 files the
 * secret ending requires always claim dossier slots before the cap is hit.
 */
function fileRank(path: string, level: BotLevel): number {
  const evidence = isEvidencePath(path) ? 1 : 0;
  if (level !== 'pro') return evidence;
  const name = basename(path);
  if (secretCriticalTargets().includes(name)) return 3;
  if (isSecretTarget(path)) return 2;
  return evidence;
}

/**
 * Orders candidates by priority tier, then by the seeded hash within a tier.
 *
 * `pro` keeps its tiering, so the four secret-critical files still claim the
 * first four dossier slots on every seed and the secret ending stays reachable;
 * only the order of the interchangeable remainder moves.
 */
function orderCandidates(paths: string[], level: BotLevel, seed: number): string[] {
  return [...paths].sort((a, b) => {
    const rank = fileRank(b, level) - fileRank(a, level);
    if (rank !== 0) return rank;
    return seededOrder(seed, a) - seededOrder(seed, b);
  });
}

export function decideNextCommand(
  state: GameState,
  memory: BotMemory,
  level: BotLevel,
  seed: number,
  goal: BotGoal = DEFAULT_BOT_GOAL
): { decision: BotDecision; memory: BotMemory } {
  const policy = LEVEL_POLICY[level];
  const m: BotMemory = { ...memory, turnsTaken: memory.turnsTaken + 1 };

  // Terminal conditions.
  if (state.gameWon || state.isGameOver) {
    return {
      decision: { kind: 'done', reason: state.gameWon ? 'ending reached' : 'game over' },
      memory: m,
    };
  }
  if (m.turnsTaken > DEFAULT_BOT_MAX_TURNS) {
    return { decision: { kind: 'done', reason: 'max turns reached' }, memory: m };
  }

  // No-progress loop detection.
  const sig = goal.kind === 'default' ? progressSignature(state) : goalProgressSignature(state);
  if (sig === m.lastProgressSignature) {
    m.noProgressStreak += 1;
  } else {
    m.noProgressStreak = 0;
    m.lastProgressSignature = sig;
  }
  // Probe turns deliberately change nothing about progress, so the streak has
  // to tolerate a run of them or `chaos` would stop itself as "stuck" while
  // working exactly as designed.
  const stuckLimit = policy.probes ? 6 + BOT_PROBE_COMMANDS.length : 6;
  if (m.noProgressStreak >= stuckLimit) {
    return { decision: { kind: 'done', reason: 'no progress (stuck)' }, memory: m };
  }

  const decide = (
    text: string,
    probe = false,
    expectRejected = false
  ): { decision: BotDecision; memory: BotMemory } => {
    m.lastDecision = text;
    return { decision: { kind: 'command', text, probe, expectRejected }, memory: m };
  };

  if (goal.kind === 'scenario') return decideScenario(state, m, goal.scenario, seed, decide);
  if (goal.kind === 'ending') return decideEnding(state, m, goal.ending, decide);

  // Unlock admin once, EARLY (detection still ~0, no evidence counted) so the
  // clean unlock branch runs rather than the "terrible mistake" doom branch.
  // A real player has to first find the password, so the bot reads the override
  // hint memo before attempting the override instead of knowing it up front.
  if (policy.unlocksAdmin && !state.flags?.adminUnlocked) {
    if (!state.filesRead.has(PASSWORD_HINT_FILE)) {
      return decide(`open ${PASSWORD_HINT_FILE}`);
    }
    if (!m.overrideAttempted) {
      m.overrideAttempted = true;
      return decide(`override protocol ${OVERRIDE_PASSWORD}`);
    }
  }

  // Probe the wider command surface between useful turns. Deferred until admin
  // is unlocked so the probes run against a fully-opened filesystem, and each
  // probe is issued exactly once so the run still terminates.
  if (policy.probes && m.probesIssued < BOT_PROBE_COMMANDS.length) {
    const probe = BOT_PROBE_COMMANDS[m.probesIssued];
    m.probesIssued += 1;
    return decide(probe, true, BOT_PROBES_EXPECTING_REJECTION.has(probe));
  }

  const accessible = getAllAccessibleFiles(state);
  const savedCount = state.savedFiles.size;

  // Save a wanted file we have already read (highest priority first).
  const readNotSaved = orderCandidates(
    accessible.filter(
      p => state.filesRead.has(p) && !state.savedFiles.has(p) && wantsFile(p, level)
    ),
    level,
    seed
  );
  if (savedCount < MAX_SAVED && readNotSaved.length > 0) {
    return decide(`save ${basename(readNotSaved[0])}`);
  }

  // Enough saved to finish: drive the leak sequence BEFORE opening any more
  // files. Once the dossier is full, extra reads only raise detection (and risk
  // honeypots/turing checks) without helping — so leak immediately.
  if (savedCount >= Math.min(policy.saveTarget, MAX_SAVED)) {
    return driveLeak(state, decide);
  }

  // Read a wanted file we have not read yet (highest priority first) so the bot
  // only ever opens files it intends to save — keeping runs short and detection
  // low without relying on the rate-limited `wait` command.
  if (state.filesRead.size < policy.readLimit) {
    const unread = orderCandidates(
      accessible.filter(p => !state.filesRead.has(p) && wantsFile(p, level)),
      level,
      seed
    );
    if (unread.length > 0) {
      return decide(`open ${unread[0]}`);
    }
  }

  // Nothing productive left and not enough to win — stop gracefully.
  return { decision: { kind: 'done', reason: 'no productive action' }, memory: m };
}

/** Drives the multi-step leak preparation sequence using state-readable fields. */
function driveLeak(
  state: GameState,
  decide: (text: string) => { decision: BotDecision; memory: BotMemory }
): { decision: BotDecision; memory: BotMemory } {
  if (!state.leakSequenceGenerated || !state.leakSequence) {
    return decide('leak'); // generates the sequence
  }
  const progress = state.leakSequenceProgress;
  if (progress < state.leakSequence.length) {
    return decide(`leak ${state.leakSequence[progress]}`);
  }
  return decide('leak'); // sequence complete → transmit
}

type Decider = (
  text: string,
  probe?: boolean,
  expectRejected?: boolean
) => { decision: BotDecision; memory: BotMemory };

/**
 * Builds one specific ending.
 *
 * The plan is recomputed from scratch every turn rather than fixed at the start,
 * which is what lets it recover: a file that refuses to open is added to
 * `unavailablePaths` and the next plan simply routes around it. `buildEndingDossier`
 * verifies every padding choice against `determineEnding`, so a re-plan can
 * never quietly settle for a neighbouring ending.
 */
function decideEnding(
  state: GameState,
  m: BotMemory,
  ending: EndingId,
  decide: Decider
): { decision: BotDecision; memory: BotMemory } {
  // The last turn asked for a file that did not arrive. Record it once so the
  // next plan drops it instead of asking again forever.
  const lastOpen = m.lastDecision?.startsWith('open ') ? m.lastDecision.slice(5) : null;
  if (lastOpen && !state.filesRead.has(lastOpen) && !m.unavailablePaths.includes(lastOpen)) {
    m.unavailablePaths = [...m.unavailablePaths, lastOpen];
  }

  // Nearly every recipe reaches for files behind the override, so elevate first
  // and early, while detection is still low enough for the clean unlock branch.
  if (!state.flags?.adminUnlocked) {
    if (!state.filesRead.has(PASSWORD_HINT_FILE)) return decide(`open ${PASSWORD_HINT_FILE}`);
    if (!m.overrideAttempted) {
      m.overrideAttempted = true;
      return decide(`override protocol ${OVERRIDE_PASSWORD}`);
    }
  }

  const unavailable = new Set(m.unavailablePaths);
  const accessible = getAllAccessibleFiles(state).filter(p => !unavailable.has(p));
  const plan = buildEndingDossier(ending, accessible);
  const planned = new Set(plan.paths);

  // Anything saved that the plan does not want has to go, or it eats a slot and
  // changes the story the leak tells. Matters when `bot-test` is typed partway
  // through a session that already has a dossier.
  const strays = [...state.savedFiles].filter(p => !planned.has(p)).sort();
  if (strays.length > 0) return decide(`unsave ${basename(strays[0])}`);

  const readNotSaved = plan.paths.filter(p => state.filesRead.has(p) && !state.savedFiles.has(p));
  if (state.savedFiles.size < MAX_SAVED && readNotSaved.length > 0) {
    return decide(`save ${basename(readNotSaved[0])}`);
  }

  const unread = plan.paths.filter(p => !state.filesRead.has(p));
  if (unread.length > 0) return decide(`open ${unread[0]}`);

  if (state.savedFiles.size >= MAX_SAVED) return driveLeak(state, decide);

  return {
    decision: {
      kind: 'done',
      reason:
        plan.missing.length > 0
          ? `ending ${ending} unreachable — missing ${plan.missing.join(', ')}`
          : `ending ${ending} unreachable — only ${plan.paths.length}/${MAX_SAVED} files planned`,
    },
    memory: m,
  };
}

/** Runs a named scenario script to its end (or to the game over it is aiming at). */
function decideScenario(
  state: GameState,
  m: BotMemory,
  scenario: BotScenarioId,
  seed: number,
  decide: Decider
): { decision: BotDecision; memory: BotMemory } {
  const spec = BOT_SCENARIOS[scenario];
  const flags = { ...m.scenarioFlags };
  const next = spec.next({ state, step: m.scenarioStep, seed, flags });
  m.scenarioFlags = flags;
  if (!next) {
    return {
      decision: { kind: 'done', reason: `scenario ${scenario} script complete` },
      memory: m,
    };
  }
  m.scenarioStep += 1;
  if (typeof next === 'string') return decide(next);
  return decide(next.text, next.expectNoOp, next.expectRejected);
}
