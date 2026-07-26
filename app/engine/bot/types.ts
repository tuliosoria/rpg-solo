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
export const DEFAULT_BOT_DELAY_MS = 900;
