export type BotLevel = 'dummy' | 'novice' | 'pro';

export type BotDecision =
  | { kind: 'command'; text: string }
  | { kind: 'enter' }
  | { kind: 'done'; reason: string };

export interface BotRunConfig {
  active: boolean;
  level: BotLevel;
  seed: number;
  maxTurns: number;
  delayMs: number;
}

export interface BotMemory {
  turnsTaken: number;
  lastDecision: string | null;
  noProgressStreak: number;
  overrideAttempted: boolean;
  lastProgressSignature: string;
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
  anomaly?: string;
}

export function createBotMemory(): BotMemory {
  return {
    turnsTaken: 0,
    lastDecision: null,
    noProgressStreak: 0,
    overrideAttempted: false,
    lastProgressSignature: '',
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
    leakProgress: number;
    leakGenerated: boolean;
    gameWon: boolean;
    isGameOver: boolean;
    gameOverReason?: string;
  },
  before: { wrongAttempts: number; leakProgress: number; leakGenerated: boolean }
): void {
  entry.detectionAfter = after.detectionLevel;
  entry.filesReadAfter = after.filesRead;
  entry.savedAfter = after.savedFiles;

  const reasons: string[] = [];

  // The bot only issues commands it believes are valid, so a rejected one means
  // the strategy and the parser disagree — the single most useful signal here.
  if (after.wrongAttempts > before.wrongAttempts) {
    reasons.push(`command rejected (invalid attempts ${before.wrongAttempts} → ${after.wrongAttempts})`);
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
    // The turn that wins the run moves nothing else: the final `leak` flips
    // gameWon and leaves every counter where it was.
    after.gameWon ||
    after.isGameOver;
  if (!movedSomething) {
    reasons.push('turn changed nothing');
  }

  if (after.isGameOver) {
    reasons.push(`game over — ${after.gameOverReason || 'unknown'}`);
  }

  if (reasons.length > 0) entry.anomaly = reasons.join('; ');
}
