import { EndingId } from '../endings';
import { BotScenarioId } from './scenarios';

export type BotLevel = 'dummy' | 'novice' | 'pro' | 'chaos';

/**
 * What a run is trying to reach, layered on top of `BotLevel` (which describes
 * how skilled the player pretending to type is).
 *
 * The two are orthogonal on purpose. A level answers "does the mainline path
 * still work for this kind of player"; a goal answers "is this specific outcome
 * still reachable at all". Before goals existed only one of the twelve endings
 * (`secret_ending`, via `pro`) was ever aimed at, the other eleven were hit by
 * accident or not at all, and no bot had ever seen a game-over screen.
 */
export type BotGoal =
  | { kind: 'default' }
  | { kind: 'ending'; ending: EndingId }
  | { kind: 'scenario'; scenario: BotScenarioId };

export const DEFAULT_BOT_GOAL: BotGoal = { kind: 'default' };

/** Human-readable label for a goal, for the run summary and the boot banner. */
export function describeGoal(goal: BotGoal | undefined): string {
  if (!goal || goal.kind === 'default') return 'default';
  if (goal.kind === 'ending') return `ending:${goal.ending}`;
  return `scenario:${goal.scenario}`;
}

export type BotDecision =
  | {
      kind: 'command';
      text: string;
      /**
       * True when this turn is not expected to move anything — a `chaos`
       * surface probe, or a scenario step that deliberately bounces off a
       * limit. See `BotRunLogEntry.probe`.
       */
      probe?: boolean;
      /**
       * True when the parser is supposed to refuse this turn. See
       * `BotRunLogEntry.expectRejected`.
       */
      expectRejected?: boolean;
    }
  | { kind: 'enter' }
  | { kind: 'done'; reason: string };

export interface BotRunConfig {
  active: boolean;
  level: BotLevel;
  seed: number;
  maxTurns: number;
  delayMs: number;
  /** Omitted for the plain `bot-test <level>` form, which is level-driven. */
  goal?: BotGoal;
}

export interface BotMemory {
  turnsTaken: number;
  lastDecision: string | null;
  noProgressStreak: number;
  overrideAttempted: boolean;
  lastProgressSignature: string;
  /** How many entries of `BOT_PROBE_COMMANDS` the `chaos` level has issued. */
  probesIssued: number;
  /** Scenario commands issued so far; the cursor a scenario driver reads. */
  scenarioStep: number;
  /** Per-run scratch space for scenario drivers. See `BotScenarioContext`. */
  scenarioFlags: Record<string, boolean>;
  /**
   * Files an ending run asked for and could not open. Anything listed here is
   * dropped from the next plan, so one unreachable file re-routes the dossier
   * instead of wedging the run against a door that will not open.
   */
  unavailablePaths: string[];
}

export interface BotRunLogEntry {
  turn: number;
  command: string;
  detectionBefore: number;
  detectionAfter: number;
  /** Counts before the command ran, so a settled turn can tell whether it moved anything. */
  filesReadBefore: number;
  savedBefore: number;
  filesReadAfter: number;
  savedAfter: number;
  /**
   * True when the turn is not expected to move anything: a `chaos` surface
   * probe, or a scenario step that deliberately bounces off a limit. `help`,
   * `map` and `unread` are read-only by design and the 11th save is refused by
   * design, so flagging them buried the real findings under expected noise.
   * Rejection and detection spikes are still flagged on these turns — those are
   * exactly what such a turn is looking for.
   */
  probe?: boolean;
  /**
   * True when the parser is *supposed* to refuse this turn.
   *
   * Rejection is normally the most useful signal the harness has, because the
   * bot only issues commands it believes are valid — so `probe` deliberately
   * does not suppress it. Two probes are the exception: `hlep` and `xyzzy` exist
   * to drive the suggestion path, and being refused is the entire point of
   * typing them. Without a way to say so, teaching the harness to notice
   * rejection at all would have added two permanent anomalies to every `chaos`
   * run, which is how an anomaly list stops being read.
   */
  expectRejected?: boolean;
  anomaly?: string;
}

export function createBotMemory(): BotMemory {
  return {
    turnsTaken: 0,
    lastDecision: null,
    noProgressStreak: 0,
    overrideAttempted: false,
    lastProgressSignature: '',
    probesIssued: 0,
    scenarioStep: 0,
    scenarioFlags: {},
    unavailablePaths: [],
  };
}

export const DEFAULT_BOT_MAX_TURNS = 400;
export const DEFAULT_BOT_DELAY_MS = 3000;

/**
 * Largest single-turn detection increase the bot causes in ordinary play: the
 * admin override, which costs 15. Reads cost 1–3 and saves cost nothing, so
 * anything above this came from something the bot did not expect — a honeypot,
 * a retuned file cost, or a rule it does not know about — and is worth a look.
 */
export const BOT_EXPECTED_MAX_DETECTION_JUMP = 15;

/**
 * Describes what a turn did to the game, so a run can be judged after the fact.
 *
 * The bot issues a command and only learns its effect on the following turn, so
 * these are filled in two stages: the command and the before-reading when it is
 * submitted, the rest once the state has moved. `settleBotTurn` does the second
 * half and is what decides whether a turn was anomalous.
 */
export function settleBotTurn(
  entry: BotRunLogEntry,
  after: {
    detectionLevel: number;
    filesRead: number;
    savedFiles: number;
    wrongAttempts: number;
    /** The counter the engine actually charges a rejected command to. */
    legacyAlertCounter: number;
    leakProgress: number;
    leakGenerated: boolean;
    gameWon: boolean;
    isGameOver: boolean;
    gameOverReason?: string;
    /** Whether `tree`'s confirmation gate is armed. */
    pendingTreeConfirm?: boolean;
    /** Operations left before the purge fires, once the doom branch is armed. */
    doomCountdown?: number;
  },
  before: {
    wrongAttempts: number;
    legacyAlertCounter: number;
    leakProgress: number;
    leakGenerated: boolean;
    pendingTreeConfirm?: boolean;
    doomCountdown?: number;
  }
): void {
  entry.detectionAfter = after.detectionLevel;
  entry.filesReadAfter = after.filesRead;
  entry.savedAfter = after.savedFiles;

  const reasons: string[] = [];

  // The bot only issues commands it believes are valid, so a rejected one means
  // the strategy and the parser disagree — the single most useful signal here.
  //
  // Both counters are read because they are charged by different code paths and
  // only one of them is the engine's actual verdict on "I did not understand
  // that": `createInvalidCommandResult` increments `legacyAlertCounter`, which
  // is what the 8-strike lockout reads, while `wrongAttempts` is bumped by a
  // handful of handlers that understood the command and rejected its argument.
  // Watching `wrongAttempts` alone meant this check had never once fired on a
  // genuinely unparsed command — `xyzzy` and `hlep` move `legacyAlertCounter`
  // and leave `wrongAttempts` untouched, so every `chaos` run reported a clean
  // sheet on the one thing it was built to notice.
  const rejected =
    after.wrongAttempts > before.wrongAttempts ||
    after.legacyAlertCounter > before.legacyAlertCounter;
  if (rejected && !entry.expectRejected) {
    const from = before.wrongAttempts + before.legacyAlertCounter;
    const to = after.wrongAttempts + after.legacyAlertCounter;
    reasons.push(`command rejected (invalid attempts ${from} → ${to})`);
  }

  const jump = after.detectionLevel - entry.detectionBefore;
  if (jump > BOT_EXPECTED_MAX_DETECTION_JUMP) {
    reasons.push(`detection +${jump}% in one turn (expected ≤${BOT_EXPECTED_MAX_DETECTION_JUMP}%)`);
  }

  const movedSomething =
    entry.filesReadAfter !== entry.filesReadBefore ||
    entry.savedAfter !== entry.savedBefore ||
    jump !== 0 ||
    after.leakProgress !== before.leakProgress ||
    after.leakGenerated !== before.leakGenerated ||
    // Arming a confirmation gate is a state change like any other. Without
    // this, the first of `tree`'s two turns — the one that puts the warning on
    // screen — was reported as a turn that did nothing, on the single command
    // most likely to be under investigation.
    Boolean(after.pendingTreeConfirm) !== Boolean(before.pendingTreeConfirm) ||
    // Burning an operation off the purge countdown is progress towards the only
    // outcome that turn is trying to reach. `purge-protocol` spends its last
    // eight turns on a read-only command precisely because it costs nothing but
    // the countdown, and every one of them was reported as "turn changed
    // nothing" — eight false alarms attached to the scenario most likely to be
    // read closely.
    (after.doomCountdown ?? 0) !== (before.doomCountdown ?? 0) ||
    // The turn that wins the run moves nothing else: the final `leak` flips
    // gameWon and leaves every counter where it was.
    after.gameWon ||
    after.isGameOver;
  // Some turns are expected to change nothing: `chaos` probes are read-only,
  // and a scenario step that bounces off a limit is doing its job. Rejection
  // and detection spikes are still flagged on them — those are exactly what
  // such a turn is looking for.
  if (!movedSomething && !entry.probe) {
    reasons.push('turn changed nothing');
  }

  if (after.isGameOver) {
    reasons.push(`game over — ${after.gameOverReason || 'unknown'}`);
  }

  if (reasons.length > 0) entry.anomaly = reasons.join('; ');
}
