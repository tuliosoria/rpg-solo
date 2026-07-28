import { GameState } from '../../types';
import { getAllAccessibleFiles } from '../filesystem';
import { isEvidencePath, MAX_EVIDENCE_COUNT } from '../evidenceRevelation';
import { OVERRIDE_PASSWORD } from '../overrideSecret';
import { createSeededRng } from '../rng';
import { DETECTION_THRESHOLDS } from '../../constants/detection';

/**
 * Named edge paths the win-path levels can never reach.
 *
 * `dummy`, `novice`, `pro` and `chaos` all steer *away* from trouble: they type
 * only commands they believe are valid and stop the moment the run is over. So
 * every game-over screen in the game — its copy, its reason string, its
 * translations, and the doom countdown that leads to one of them — had never
 * been reached by a bot. These scenarios exist to reach them on purpose.
 *
 * Each scenario declares what a correct run ends in, so the run summary can say
 * PASS/FAIL rather than leaving a human to remember what was supposed to happen.
 */
export type BotScenarioId =
  | 'detection-trace'
  | 'invalid-threshold'
  | 'override-lockdown'
  | 'tree-firewall'
  | 'purge-protocol'
  | 'honeypot-traps'
  | 'dossier-full'
  | 'leak-misfire';

export type BotScenarioExpectation =
  | { kind: 'gameOver'; reason: string }
  | { kind: 'survives' };

export interface BotScenarioContext {
  state: GameState;
  /** Scenario commands issued so far. Doubles as a safety bound on loops. */
  step: number;
  seed: number;
  /**
   * Scratch space for the driver.
   *
   * Some steps are not observable from `GameState` — a refused save leaves the
   * state byte-for-byte identical, and a wrong-order leak step resets progress
   * back to where it already was. Without somewhere to record "already did
   * that", those drivers would repeat one command until the turn cap. This bag
   * lives on `BotMemory`, so it is per-run and never touches a save file.
   */
  flags: Record<string, boolean>;
}

/**
 * One scenario turn. The object form marks a turn that is *supposed* to change
 * nothing — bouncing off the full dossier is the point of that step, not a
 * finding — so the run summary does not print a scary anomaly on a passing run
 * and teach everyone to skim the anomaly list.
 */
export type BotScenarioStep = string | { text: string; expectNoOp: true };

/** Produces the next command for a scenario, or `null` once it has played out. */
export type BotScenarioDriver = (ctx: BotScenarioContext) => BotScenarioStep | null;

export interface BotScenarioSpec {
  id: BotScenarioId;
  summary: string;
  expect: BotScenarioExpectation;
  next: BotScenarioDriver;
  /**
   * Some paths sit behind a seeded dice roll. Rather than let the scenario be
   * flaky, it declares which seeds can reach it and `bot-test` picks one.
   */
  seedFits?: (seed: number) => boolean;
}

const PASSWORD_HINT_FILE = '/internal/override_protocol_memo.txt';

/** The four trap filenames, mirrored from the `open` handler's TRAP_FILES. */
const TRAP_NAMES = [
  'URGENT_classified_alpha.txt',
  'LEAKED_classified_records.dat',
  'FOR_PRESIDENTS_EYES_ONLY.enc',
  'SMOKING_GUN_proof.txt',
];

/** Hard bound on any driver loop, so a scenario can never spin to the turn cap. */
const MAX_SCENARIO_STEPS = 200;

function basename(path: string): string {
  return path.split('/').pop() || path;
}

function sortedAccessible(state: GameState): string[] {
  return getAllAccessibleFiles(state).sort();
}

function trapPaths(state: GameState): string[] {
  return sortedAccessible(state).filter(p => TRAP_NAMES.includes(basename(p)));
}

/** Reads the override memo, then unlocks admin. Returns null once elevated. */
function unlockAdmin(state: GameState): string | null {
  if (state.flags?.adminUnlocked) return null;
  if (!state.filesRead.has(PASSWORD_HINT_FILE)) return `open ${PASSWORD_HINT_FILE}`;
  return `override protocol ${OVERRIDE_PASSWORD}`;
}

/** Opens whatever is left to open, traps first — they cost the most detection. */
function openAnything(state: GameState): string | null {
  const traps = trapPaths(state).filter(p => !state.filesRead.has(p));
  if (traps.length > 0) return `open ${traps[0]}`;
  const all = sortedAccessible(state);
  const unread = all.filter(p => !state.filesRead.has(p));
  if (unread.length > 0) return `open ${unread[0]}`;
  // Everything is read: re-reading still costs a point apiece, which is enough
  // to finish a detection climb.
  return all.length > 0 ? `open ${all[0]}` : null;
}

export const BOT_SCENARIOS: Record<BotScenarioId, BotScenarioSpec> = {
  /** Reads until the trace completes. */
  'detection-trace': {
    id: 'detection-trace',
    summary: 'Read until detection reaches 100% and the connection is traced.',
    expect: { kind: 'gameOver', reason: 'INTRUSION DETECTED - TRACED' },
    next: ({ state }) => unlockAdmin(state) ?? openAnything(state),
  },

  /**
   * Eight unrecognised commands. The strings are deliberate gibberish: a near
   * miss would be caught by the suggestion path and never count as a strike.
   */
  'invalid-threshold': {
    id: 'invalid-threshold',
    summary: 'Type gibberish until the 8-strike invalid-attempt lockdown fires.',
    expect: { kind: 'gameOver', reason: 'INVALID ATTEMPT THRESHOLD' },
    next: ({ step }) => (step < 12 ? `qzxjvw${step}` : null),
  },

  /** Three wrong override passwords, which is its own lockdown, not a strike. */
  'override-lockdown': {
    id: 'override-lockdown',
    summary: 'Fail the override password three times and trip the security lockdown.',
    expect: { kind: 'gameOver', reason: 'SECURITY LOCKDOWN - AUTHENTICATION FAILURE' },
    next: ({ step }) => (step < 5 ? 'override protocol NOTTHEPASSWORD' : null),
  },

  /**
   * `tree` is survivable before the override and fatal after it — the clearest
   * case of a command whose danger depends on session state, and the bug the
   * `chaos` level originally found.
   */
  'tree-firewall': {
    id: 'tree-firewall',
    summary: 'Run a full index scan on an elevated session and trip the firewall.',
    expect: { kind: 'gameOver', reason: 'FIREWALL — TREE SCAN ON ELEVATED SESSION' },
    next: ({ state, step }) => {
      const admin = unlockAdmin(state);
      if (admin) return admin;
      // The first `tree` arms the confirmation gate, the second goes through it.
      return step < 8 ? 'tree' : null;
    },
  },

  /**
   * The doom countdown. Overriding while already exposed can hand back a buffer
   * dump instead of admin, and the session then has eight operations left. That
   * branch is a 35% roll against `rngState`, which nothing but `override` ever
   * moves — so the seed alone decides it, and `seedFits` is how the run gets a
   * seed that can reach the branch at all.
   */
  'purge-protocol': {
    id: 'purge-protocol',
    summary: 'Override while exposed, take the buffer dump, and burn the doom countdown.',
    expect: { kind: 'gameOver', reason: 'PURGE PROTOCOL - FORBIDDEN KNOWLEDGE' },
    seedFits: seed => createSeededRng(seed)() < 0.35,
    next: ({ state, step }) => {
      if (step >= MAX_SCENARIO_STEPS) return null;
      // Countdown running: spend it on a command that costs nothing. The
      // buffer dump leaves detection at 95, and `status` quietly adds a point
      // per use — eight of those trades the purge screen for the trace screen,
      // five turns before the countdown lands. `progress` is free.
      if (state.terribleMistakeTriggered) return 'progress';
      if (!state.filesRead.has(PASSWORD_HINT_FILE)) return `open ${PASSWORD_HINT_FILE}`;
      const exposed =
        state.detectionLevel >= DETECTION_THRESHOLDS.ALERT && (state.evidenceCount || 0) >= 2;
      if (!exposed) return openAnything(state);
      if (!state.flags?.adminUnlocked) return `override protocol ${OVERRIDE_PASSWORD}`;
      // The override went through cleanly, so the roll missed and the branch is
      // unreachable on this seed. Stop, and let the summary report the unmet
      // expectation rather than spin against a door that will not open.
      return null;
    },
  },

  /** All four traps, which is a warning path rather than a fatal one. */
  'honeypot-traps': {
    id: 'honeypot-traps',
    summary: 'Open every honeypot and confirm they warn rather than end the run.',
    expect: { kind: 'survives' },
    next: ({ state }) => {
      const unread = trapPaths(state).filter(p => !state.filesRead.has(p));
      return unread.length > 0 ? `open ${unread[0]}` : null;
    },
  },

  /**
   * The full-dossier edge: the 11th save is refused, and the only way past it is
   * `unsave`. No win-path level sees either message, because they stop saving
   * the moment the dossier fills.
   */
  'dossier-full': {
    id: 'dossier-full',
    summary: 'Fill the dossier, bounce off the 11th save, then unsave and swap a file in.',
    expect: { kind: 'survives' },
    next: ({ state, step, flags }) => {
      if (step >= MAX_SCENARIO_STEPS) return null;
      const admin = unlockAdmin(state);
      if (admin) return admin;

      const evidence = sortedAccessible(state).filter(isEvidencePath);
      const read = evidence.filter(p => state.filesRead.has(p));
      // One more than the dossier holds, so there is always a file to be
      // refused and, afterwards, a file to swap in.
      if (read.length < MAX_EVIDENCE_COUNT + 1) {
        const unread = evidence.find(p => !state.filesRead.has(p));
        return unread ? `open ${unread}` : null;
      }

      const unsaved = read.filter(p => !state.savedFiles.has(p));
      const saved = read.filter(p => state.savedFiles.has(p));

      if (state.savedFiles.size < MAX_EVIDENCE_COUNT) {
        return unsaved[0] ? `save ${basename(unsaved[0])}` : null;
      }
      if (!flags.bounced) {
        // A refused save changes nothing at all, so the driver has to remember
        // it did this or it would ask forever — and the turn has to say it
        // expects to change nothing, or the summary flags it as an anomaly.
        flags.bounced = true;
        return unsaved[0] ? { text: `save ${basename(unsaved[0])}`, expectNoOp: true } : null;
      }
      if (!flags.madeRoom) {
        flags.madeRoom = true;
        return saved.length > 0 ? `unsave ${basename(saved[saved.length - 1])}` : null;
      }
      if (!flags.swapped) {
        flags.swapped = true;
        return unsaved[0] ? `save ${basename(unsaved[0])}` : null;
      }
      return null;
    },
  },

  /**
   * The leak preparation sequence entered out of order — it resets and costs
   * detection. The win path always enters it correctly, so the reset copy has
   * never run in a bot session.
   */
  'leak-misfire': {
    id: 'leak-misfire',
    summary: 'Enter the leak preparation sequence out of order, then confirm it reset.',
    expect: { kind: 'survives' },
    next: ({ state, step, flags }) => {
      if (step >= MAX_SCENARIO_STEPS) return null;
      const admin = unlockAdmin(state);
      if (admin) return admin;

      const evidence = sortedAccessible(state).filter(isEvidencePath);
      if (state.savedFiles.size < 5) {
        const read = evidence.find(p => state.filesRead.has(p) && !state.savedFiles.has(p));
        if (read) return `save ${basename(read)}`;
        const unread = evidence.find(p => !state.filesRead.has(p));
        return unread ? `open ${unread}` : null;
      }

      if (!state.leakSequenceGenerated || !state.leakSequence) return 'leak';
      const sequence = state.leakSequence;
      if (sequence.length < 2) return null;
      if (!flags.misfired) {
        flags.misfired = true;
        // The second step first. A wrong step resets progress to 0, which is
        // where it already was, so this is another turn that leaves no trace in
        // the state to key off.
        return `leak ${sequence[1]}`;
      }
      if (!flags.confirmed) {
        flags.confirmed = true;
        return 'progress';
      }
      return null;
    },
  },
};

export const ALL_SCENARIO_IDS = Object.keys(BOT_SCENARIOS) as BotScenarioId[];

export function isScenarioId(value: string): value is BotScenarioId {
  return Object.prototype.hasOwnProperty.call(BOT_SCENARIOS, value);
}

/**
 * Returns a seed the scenario can reach its target from, searching up from the
 * requested one so an explicit seed is honoured whenever it already works.
 */
export function resolveScenarioSeed(scenario: BotScenarioId, requested: number): number {
  const fits = BOT_SCENARIOS[scenario].seedFits;
  if (!fits) return requested;
  for (let i = 0; i < 10000; i++) {
    const candidate = requested + i;
    if (fits(candidate)) return candidate;
  }
  return requested;
}
