import { GameState } from '../../types';
import { getAllAccessibleFiles } from '../filesystem';
import { isEvidencePath } from '../evidenceRevelation';
import { OVERRIDE_PASSWORD } from '../overrideSecret';
import { isSecretTarget } from './targets';
import { BotDecision, BotLevel, BotMemory, DEFAULT_BOT_MAX_TURNS } from './types';

const MAX_SAVED = 10;
const DETECTION_HIGH = 60;

// How much of the game each level engages with.
const LEVEL_POLICY: Record<BotLevel, {
  readLimit: number;      // max distinct files to read before moving on
  saveTarget: number;     // saved-file count that triggers the leak
  managesDetection: boolean;
  unlocksAdmin: boolean;
}> = {
  dummy: { readLimit: 4, saveTarget: 5, managesDetection: false, unlocksAdmin: false },
  novice: { readLimit: 999, saveTarget: 10, managesDetection: true, unlocksAdmin: false },
  pro: { readLimit: 999, saveTarget: 10, managesDetection: true, unlocksAdmin: true },
};

function basename(path: string): string {
  return path.split('/').pop() || path;
}

function progressSignature(state: GameState): string {
  const admin = state.flags?.adminUnlocked ? 1 : 0;
  return `${state.filesRead.size}:${state.savedFiles.size}:${state.leakSequenceProgress}:${admin}`;
}

/** Whether this level wants to save this file (and it fits the dossier priority). */
function shouldSave(path: string, level: BotLevel): boolean {
  if (level === 'pro') return isSecretTarget(path) || isEvidencePath(path);
  return isEvidencePath(path);
}

export function decideNextCommand(
  state: GameState,
  memory: BotMemory,
  level: BotLevel,
  _seed: number
): { decision: BotDecision; memory: BotMemory } {
  const policy = LEVEL_POLICY[level];
  const m: BotMemory = { ...memory, turnsTaken: memory.turnsTaken + 1 };

  // Terminal conditions.
  if (state.gameWon || state.isGameOver) {
    return { decision: { kind: 'done', reason: state.gameWon ? 'ending reached' : 'game over' }, memory: m };
  }
  if (m.turnsTaken > DEFAULT_BOT_MAX_TURNS) {
    return { decision: { kind: 'done', reason: 'max turns reached' }, memory: m };
  }

  // No-progress loop detection.
  const sig = progressSignature(state);
  if (sig === m.lastProgressSignature) {
    m.noProgressStreak += 1;
  } else {
    m.noProgressStreak = 0;
    m.lastProgressSignature = sig;
  }
  if (m.noProgressStreak >= 6) {
    return { decision: { kind: 'done', reason: 'no progress (stuck)' }, memory: m };
  }

  const decide = (text: string): { decision: BotDecision; memory: BotMemory } => {
    m.lastDecision = text;
    return { decision: { kind: 'command', text }, memory: m };
  };

  // Detection management (novice/pro).
  if (policy.managesDetection && state.detectionLevel >= DETECTION_HIGH && state.waitUsesRemaining > 0) {
    return decide('wait');
  }

  const accessible = getAllAccessibleFiles(state);
  const savedCount = state.savedFiles.size;

  // pro: unlock admin once, before exhausting reads, to reveal gated files.
  if (policy.unlocksAdmin && !state.flags?.adminUnlocked && !m.overrideAttempted) {
    m.overrideAttempted = true;
    return decide(`override protocol ${OVERRIDE_PASSWORD}`);
  }

  // Save priority: for pro, save secret-target files first so they fit in the dossier.
  const readNotSaved = accessible.filter(
    p => state.filesRead.has(p) && !state.savedFiles.has(p) && shouldSave(p, level)
  );
  if (savedCount < MAX_SAVED && readNotSaved.length > 0) {
    readNotSaved.sort((a, b) => Number(isSecretTarget(b)) - Number(isSecretTarget(a)));
    return decide(`save ${basename(readNotSaved[0])}`);
  }

  // Read unread accessible files (respecting the level's read limit).
  const unread = accessible.filter(p => !state.filesRead.has(p));
  if (unread.length > 0 && state.filesRead.size < policy.readLimit) {
    return decide(`open ${unread[0]}`);
  }

  // Ready to finish: drive the leak sequence.
  if (savedCount >= Math.min(policy.saveTarget, MAX_SAVED)) {
    return driveLeak(state, decide);
  }

  // Nothing productive left but not enough saved — leak with what we have (weak ending) or stop.
  if (savedCount >= 5) {
    return driveLeak(state, decide);
  }
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
