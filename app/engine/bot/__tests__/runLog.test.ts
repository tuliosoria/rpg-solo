import { describe, it, expect } from 'vitest';
import { executeCommand } from '../../commands';
import { decideNextCommand } from '../strategy';
import { createBotMemory, settleBotTurn, BotRunLogEntry, BOT_EXPECTED_MAX_DETECTION_JUMP } from '../types';
import { buildRunSummary } from '../report';
import { DEFAULT_GAME_STATE, GameState } from '../../../types';
import { BotLevel } from '../types';

/**
 * Replays a bot run the way useBotRunner does — submit a command, then close
 * the previous turn out once the state has moved — so the anomaly logic is
 * exercised against real command results rather than hand-built fixtures.
 */
function runWithLog(level: BotLevel, seed = 12345): { log: BotRunLogEntry[]; state: GameState; reason: string } {
  let state: GameState = {
    ...DEFAULT_GAME_STATE, tutorialComplete: true, seed,
    filesRead: new Set<string>(), savedFiles: new Set<string>(),
  } as GameState;
  let memory = createBotMemory();
  const log: BotRunLogEntry[] = [];
  let open: { entry: BotRunLogEntry; before: { wrongAttempts: number; leakProgress: number; leakGenerated: boolean } } | null = null;
  let reason = 'unterminated';

  const settle = () => {
    if (!open) return;
    settleBotTurn(open.entry, {
      detectionLevel: state.detectionLevel,
      filesRead: state.filesRead.size,
      savedFiles: state.savedFiles.size,
      wrongAttempts: state.wrongAttempts,
      leakProgress: state.leakSequenceProgress,
      leakGenerated: Boolean(state.leakSequenceGenerated),
      gameWon: Boolean(state.gameWon),
      isGameOver: Boolean(state.isGameOver),
      gameOverReason: state.gameOverReason,
    }, open.before);
    open = null;
  };

  for (let i = 0; i < 600; i++) {
    settle();
    const { decision, memory: next } = decideNextCommand(state, memory, level, seed);
    memory = next;
    if (decision.kind === 'done') { reason = decision.reason; break; }
    const input = decision.kind === 'enter' ? '' : decision.text;
    const entry: BotRunLogEntry = {
      turn: memory.turnsTaken, command: input || '(enter)',
      detectionBefore: state.detectionLevel, detectionAfter: state.detectionLevel,
      filesReadBefore: state.filesRead.size, savedBefore: state.savedFiles.size,
      filesReadAfter: state.filesRead.size, savedAfter: state.savedFiles.size,
    };
    log.push(entry);
    open = { entry, before: { wrongAttempts: state.wrongAttempts, leakProgress: state.leakSequenceProgress, leakGenerated: Boolean(state.leakSequenceGenerated) } };
    const result = executeCommand(input, state);
    state = { ...state, ...result.stateChanges } as GameState;
  }
  settle();
  return { log, state, reason };
}

describe('bot run log', () => {
  it('records what each turn actually did, not the state before it ran', () => {
    const { log } = runWithLog('novice');
    const reads = log.filter(e => e.command.startsWith('open '));
    expect(reads.length).toBeGreaterThan(0);
    // Every open advances filesRead and costs some detection; before the fix
    // both "after" fields were copies of the pre-command reading.
    for (const e of reads) {
      expect(e.filesReadAfter).toBe(e.filesReadBefore + 1);
    }
    expect(reads.some(e => e.detectionAfter > e.detectionBefore)).toBe(true);
  });

  it('reports a clean expert run as clean', () => {
    const { log, state } = runWithLog('pro');
    expect(state.gameWon).toBe(true);
    const anomalies = log.filter(e => e.anomaly);
    expect(anomalies.map(e => `${e.command}: ${e.anomaly}`)).toEqual([]);
  });

  it('flags a rejected command', () => {
    const entry: BotRunLogEntry = {
      turn: 3, command: 'opne file', detectionBefore: 10, detectionAfter: 10,
      filesReadBefore: 2, savedBefore: 1, filesReadAfter: 2, savedAfter: 1,
    };
    settleBotTurn(entry,
      { detectionLevel: 12, filesRead: 2, savedFiles: 1, wrongAttempts: 4, leakProgress: 0, leakGenerated: false, gameWon: false, isGameOver: false },
      { wrongAttempts: 3, leakProgress: 0, leakGenerated: false });
    expect(entry.anomaly).toContain('command rejected');
    expect(entry.detectionAfter).toBe(12);
  });

  it('flags a detection spike past what any bot command costs', () => {
    const entry: BotRunLogEntry = {
      turn: 4, command: 'open /trap.txt', detectionBefore: 20, detectionAfter: 20,
      filesReadBefore: 5, savedBefore: 2, filesReadAfter: 5, savedAfter: 2,
    };
    settleBotTurn(entry,
      { detectionLevel: 20 + BOT_EXPECTED_MAX_DETECTION_JUMP + 1, filesRead: 6, savedFiles: 2, wrongAttempts: 0, leakProgress: 0, leakGenerated: false, gameWon: false, isGameOver: false },
      { wrongAttempts: 0, leakProgress: 0, leakGenerated: false });
    expect(entry.anomaly).toContain('detection +16%');
  });

  it('does not flag the admin override, the one large increase it makes on purpose', () => {
    const entry: BotRunLogEntry = {
      turn: 2, command: 'override protocol COLHEITA', detectionBefore: 1, detectionAfter: 1,
      filesReadBefore: 1, savedBefore: 0, filesReadAfter: 1, savedAfter: 0,
    };
    settleBotTurn(entry,
      { detectionLevel: 16, filesRead: 1, savedFiles: 0, wrongAttempts: 0, leakProgress: 0, leakGenerated: false, gameWon: false, isGameOver: false },
      { wrongAttempts: 0, leakProgress: 0, leakGenerated: false });
    expect(entry.anomaly).toBeUndefined();
  });

  it('flags a turn that changed nothing', () => {
    const entry: BotRunLogEntry = {
      turn: 9, command: 'open /gone.txt', detectionBefore: 30, detectionAfter: 30,
      filesReadBefore: 8, savedBefore: 4, filesReadAfter: 8, savedAfter: 4,
    };
    settleBotTurn(entry,
      { detectionLevel: 30, filesRead: 8, savedFiles: 4, wrongAttempts: 0, leakProgress: 0, leakGenerated: false, gameWon: false, isGameOver: false },
      { wrongAttempts: 0, leakProgress: 0, leakGenerated: false });
    expect(entry.anomaly).toContain('turn changed nothing');
  });

  it('names why a run stopped instead of just saying it stopped', () => {
    const { log, state, reason } = runWithLog('dummy');
    const text = buildRunSummary(log, { active: false, level: 'dummy', seed: 1, maxTurns: 400, delayMs: 10 }, state, reason)
      .map(e => e.content).join('\n');
    expect(reason).toBe('no productive action');
    expect(text).toContain('stopped — no productive action');
  });
});
