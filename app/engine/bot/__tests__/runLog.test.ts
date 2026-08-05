import { describe, it, expect } from 'vitest';
import { executeCommand } from '../../commands';
import { decideNextCommand } from '../strategy';
import {
  createBotMemory,
  settleBotTurn,
  BotRunLogEntry,
  BOT_EXPECTED_MAX_DETECTION_JUMP,
} from '../types';
import { buildRunSummary } from '../report';
import { DEFAULT_GAME_STATE, GameState } from '../../../types';
import { BotLevel } from '../types';

/**
 * Replays a bot run the way useBotRunner does — submit a command, then close
 * the previous turn out once the state has moved — so the anomaly logic is
 * exercised against real command results rather than hand-built fixtures.
 */
function runWithLog(
  level: BotLevel,
  seed = 12345
): { log: BotRunLogEntry[]; state: GameState; reason: string } {
  let state: GameState = {
    ...DEFAULT_GAME_STATE,
    tutorialComplete: true,
    seed,
    filesRead: new Set<string>(),
    savedFiles: new Set<string>(),
  } as GameState;
  let memory = createBotMemory();
  const log: BotRunLogEntry[] = [];
  let open: {
    entry: BotRunLogEntry;
    before: {
      wrongAttempts: number;
      legacyAlertCounter: number;
      leakProgress: number;
      leakGenerated: boolean;
    };
  } | null = null;
  let reason = 'unterminated';

  const settle = () => {
    if (!open) return;
    settleBotTurn(
      open.entry,
      {
        detectionLevel: state.detectionLevel,
        filesRead: state.filesRead.size,
        savedFiles: state.savedFiles.size,
        wrongAttempts: state.wrongAttempts,
        legacyAlertCounter: state.legacyAlertCounter,
        leakProgress: state.leakSequenceProgress,
        leakGenerated: Boolean(state.leakSequenceGenerated),
        gameWon: Boolean(state.gameWon),
        isGameOver: Boolean(state.isGameOver),
        gameOverReason: state.gameOverReason,
      },
      open.before
    );
    open = null;
  };

  for (let i = 0; i < 600; i++) {
    settle();
    const { decision, memory: next } = decideNextCommand(state, memory, level, seed);
    memory = next;
    if (decision.kind === 'done') {
      reason = decision.reason;
      break;
    }
    const input = decision.kind === 'enter' ? '' : decision.text;
    const entry: BotRunLogEntry = {
      turn: memory.turnsTaken,
      command: input || '(enter)',
      detectionBefore: state.detectionLevel,
      detectionAfter: state.detectionLevel,
      filesReadBefore: state.filesRead.size,
      savedBefore: state.savedFiles.size,
      filesReadAfter: state.filesRead.size,
      savedAfter: state.savedFiles.size,
    };
    log.push(entry);
    open = {
      entry,
      before: {
        wrongAttempts: state.wrongAttempts,
        legacyAlertCounter: state.legacyAlertCounter,
        leakProgress: state.leakSequenceProgress,
        leakGenerated: Boolean(state.leakSequenceGenerated),
      },
    };
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
      turn: 3,
      command: 'opne file',
      detectionBefore: 10,
      detectionAfter: 10,
      filesReadBefore: 2,
      savedBefore: 1,
      filesReadAfter: 2,
      savedAfter: 1,
    };
    settleBotTurn(
      entry,
      {
        detectionLevel: 12,
        filesRead: 2,
        savedFiles: 1,
        wrongAttempts: 4,
        legacyAlertCounter: 0,
        leakProgress: 0,
        leakGenerated: false,
        gameWon: false,
        isGameOver: false,
      },
      { wrongAttempts: 3, legacyAlertCounter: 0, leakProgress: 0, leakGenerated: false }
    );
    expect(entry.anomaly).toContain('command rejected');
    expect(entry.detectionAfter).toBe(12);
  });

  /**
   * The engine charges an unparseable command to `legacyAlertCounter` — that is
   * the counter the 8-strike lockout reads — and leaves `wrongAttempts` alone.
   * Watching only `wrongAttempts` meant this check, described as the single most
   * useful signal the harness has, had never once fired on a command the parser
   * genuinely did not understand.
   */
  it('flags a command the parser did not understand at all', () => {
    const entry: BotRunLogEntry = {
      turn: 3,
      command: 'xyzzy',
      detectionBefore: 10,
      detectionAfter: 10,
      filesReadBefore: 2,
      savedBefore: 1,
      filesReadAfter: 2,
      savedAfter: 1,
    };
    settleBotTurn(
      entry,
      {
        detectionLevel: 12,
        filesRead: 2,
        savedFiles: 1,
        wrongAttempts: 0,
        legacyAlertCounter: 1,
        leakProgress: 0,
        leakGenerated: false,
        gameWon: false,
        isGameOver: false,
      },
      { wrongAttempts: 0, legacyAlertCounter: 0, leakProgress: 0, leakGenerated: false }
    );
    expect(entry.anomaly).toContain('command rejected');
  });

  /**
   * ...but the two probes that exist to drive the "did you mean" path can only
   * do so by being refused, and `invalid-threshold` types gibberish eight times
   * on purpose. Teaching the harness to notice rejection without this would add
   * a permanent anomaly to every `chaos` run and eight to that scenario.
   */
  it('exempts a turn that expects to be refused', () => {
    const entry: BotRunLogEntry = {
      turn: 3,
      command: 'xyzzy',
      detectionBefore: 10,
      detectionAfter: 10,
      filesReadBefore: 2,
      savedBefore: 1,
      filesReadAfter: 2,
      savedAfter: 1,
      probe: true,
      expectRejected: true,
    };
    settleBotTurn(
      entry,
      {
        detectionLevel: 12,
        filesRead: 2,
        savedFiles: 1,
        wrongAttempts: 0,
        legacyAlertCounter: 1,
        leakProgress: 0,
        leakGenerated: false,
        gameWon: false,
        isGameOver: false,
      },
      { wrongAttempts: 0, legacyAlertCounter: 0, leakProgress: 0, leakGenerated: false }
    );
    expect(entry.anomaly).toBeUndefined();
  });

  /**
   * `purge-protocol` spends its last eight turns on a read-only command chosen
   * precisely because it costs nothing but the countdown. Every one of those
   * turns was reported as "turn changed nothing" — eight false alarms on the
   * scenario most likely to be read closely.
   */
  it('does not flag a turn that only burns the purge countdown', () => {
    const entry: BotRunLogEntry = {
      turn: 64,
      command: 'progress',
      detectionBefore: 95,
      detectionAfter: 95,
      filesReadBefore: 62,
      savedBefore: 0,
      filesReadAfter: 62,
      savedAfter: 0,
    };
    settleBotTurn(
      entry,
      {
        detectionLevel: 95,
        filesRead: 62,
        savedFiles: 0,
        wrongAttempts: 0,
        legacyAlertCounter: 0,
        leakProgress: 0,
        leakGenerated: false,
        gameWon: false,
        isGameOver: false,
        doomCountdown: 7,
      },
      {
        wrongAttempts: 0,
        legacyAlertCounter: 0,
        leakProgress: 0,
        leakGenerated: false,
        doomCountdown: 8,
      }
    );
    expect(entry.anomaly).toBeUndefined();
  });

  it('flags a detection spike past what any bot command costs', () => {
    const entry: BotRunLogEntry = {
      turn: 4,
      command: 'open /trap.txt',
      detectionBefore: 20,
      detectionAfter: 20,
      filesReadBefore: 5,
      savedBefore: 2,
      filesReadAfter: 5,
      savedAfter: 2,
    };
    settleBotTurn(
      entry,
      {
        detectionLevel: 20 + BOT_EXPECTED_MAX_DETECTION_JUMP + 1,
        filesRead: 6,
        savedFiles: 2,
        wrongAttempts: 0,
        legacyAlertCounter: 0,
        leakProgress: 0,
        leakGenerated: false,
        gameWon: false,
        isGameOver: false,
      },
      { wrongAttempts: 0, legacyAlertCounter: 0, leakProgress: 0, leakGenerated: false }
    );
    expect(entry.anomaly).toContain('detection +16%');
  });

  it('does not flag the admin override, the one large increase it makes on purpose', () => {
    const entry: BotRunLogEntry = {
      turn: 2,
      command: 'override protocol COLHEITA',
      detectionBefore: 1,
      detectionAfter: 1,
      filesReadBefore: 1,
      savedBefore: 0,
      filesReadAfter: 1,
      savedAfter: 0,
    };
    settleBotTurn(
      entry,
      {
        detectionLevel: 16,
        filesRead: 1,
        savedFiles: 0,
        wrongAttempts: 0,
        legacyAlertCounter: 0,
        leakProgress: 0,
        leakGenerated: false,
        gameWon: false,
        isGameOver: false,
      },
      { wrongAttempts: 0, legacyAlertCounter: 0, leakProgress: 0, leakGenerated: false }
    );
    expect(entry.anomaly).toBeUndefined();
  });

  it('names why a run stopped instead of just saying it stopped', () => {
    const { log, state, reason } = runWithLog('dummy');
    const text = buildRunSummary(
      log,
      { active: false, level: 'dummy', seed: 1, maxTurns: 400, delayMs: 10 },
      state,
      reason
    )
      .map(e => e.content)
      .join('\n');
    expect(reason).toBe('no productive action');
    expect(text).toContain('stopped — no productive action');
  });

  /**
   * `tree` warns first and fires second. The warning turn moves no counter the
   * log watches, so it was reported as a turn that did nothing — a false
   * finding on the one command most likely to be under investigation, and the
   * first thing a `tree-firewall` run printed next to its PASS.
   */
  it('does not flag the turn that arms a confirmation gate', () => {
    const entry: BotRunLogEntry = {
      turn: 3,
      command: 'tree',
      detectionBefore: 16,
      detectionAfter: 16,
      filesReadBefore: 1,
      savedBefore: 0,
      filesReadAfter: 1,
      savedAfter: 0,
    };
    settleBotTurn(
      entry,
      {
        detectionLevel: 16,
        filesRead: 1,
        savedFiles: 0,
        wrongAttempts: 0,
        legacyAlertCounter: 0,
        leakProgress: 0,
        leakGenerated: false,
        gameWon: false,
        isGameOver: false,
        pendingTreeConfirm: true,
      },
      {
        wrongAttempts: 0,
        legacyAlertCounter: 0,
        leakProgress: 0,
        leakGenerated: false,
        pendingTreeConfirm: false,
      }
    );
    expect(entry.anomaly).toBeUndefined();
  });

  it('still flags a turn that changed nothing when no gate moved either', () => {
    const entry: BotRunLogEntry = {
      turn: 9,
      command: 'open /gone.txt',
      detectionBefore: 30,
      detectionAfter: 30,
      filesReadBefore: 8,
      savedBefore: 4,
      filesReadAfter: 8,
      savedAfter: 4,
    };
    settleBotTurn(
      entry,
      {
        detectionLevel: 30,
        filesRead: 8,
        savedFiles: 4,
        wrongAttempts: 0,
        legacyAlertCounter: 0,
        leakProgress: 0,
        leakGenerated: false,
        gameWon: false,
        isGameOver: false,
        pendingTreeConfirm: false,
      },
      {
        wrongAttempts: 0,
        legacyAlertCounter: 0,
        leakProgress: 0,
        leakGenerated: false,
        pendingTreeConfirm: false,
      }
    );
    expect(entry.anomaly).toContain('turn changed nothing');
  });

  /**
   * A scenario whose whole point is bouncing off a limit must not print a
   * "turn changed nothing" anomaly beside its PASS — that is how people learn
   * to skim the anomaly list, which is the harness's only real output.
   */
  it('exempts a scenario step that expects to change nothing', () => {
    const entry: BotRunLogEntry = {
      turn: 25,
      command: 'save extra.txt',
      detectionBefore: 30,
      detectionAfter: 30,
      filesReadBefore: 12,
      savedBefore: 10,
      filesReadAfter: 12,
      savedAfter: 10,
      probe: true,
    };
    settleBotTurn(
      entry,
      {
        detectionLevel: 30,
        filesRead: 12,
        savedFiles: 10,
        wrongAttempts: 0,
        legacyAlertCounter: 0,
        leakProgress: 0,
        leakGenerated: false,
        gameWon: false,
        isGameOver: false,
      },
      { wrongAttempts: 0, legacyAlertCounter: 0, leakProgress: 0, leakGenerated: false }
    );
    expect(entry.anomaly).toBeUndefined();
  });

  it('marks the refused eleventh save as an expected no-op', () => {
    // The strategy has to be the one that says so — the log entry only carries
    // what the decision told it.
    const goal = { kind: 'scenario' as const, scenario: 'dossier-full' as const };
    let state: GameState = {
      ...DEFAULT_GAME_STATE,
      tutorialComplete: true,
      seed: 1,
      rngState: 1,
      filesRead: new Set<string>(),
      savedFiles: new Set<string>(),
    } as GameState;
    let memory = createBotMemory();
    let sawExpectedNoOp = false;
    for (let i = 0; i < 200; i++) {
      const { decision, memory: next } = decideNextCommand(state, memory, 'novice', 1, goal);
      memory = next;
      if (decision.kind === 'done') break;
      if (decision.kind === 'command' && decision.probe) {
        expect(decision.text.startsWith('save ')).toBe(true);
        sawExpectedNoOp = true;
      }
      const input = decision.kind === 'enter' ? '' : decision.text;
      state = { ...state, ...executeCommand(input, state).stateChanges } as GameState;
    }
    expect(sawExpectedNoOp).toBe(true);
  });

  /**
   * The scenario is named "unsave and swap a file in", and for as long as the
   * dossier-filling branch ran ahead of the swap flags it did no such thing:
   * `unsave` dropped the count to 9, the fill branch matched again, and the run
   * re-saved the file it had just removed.
   */
  it('really swaps a different file into the dossier', () => {
    const goal = { kind: 'scenario' as const, scenario: 'dossier-full' as const };
    let state: GameState = {
      ...DEFAULT_GAME_STATE,
      tutorialComplete: true,
      seed: 1,
      rngState: 1,
      filesRead: new Set<string>(),
      savedFiles: new Set<string>(),
    } as GameState;
    let memory = createBotMemory();
    let unsaved: string | null = null;
    let resaved: string | null = null;

    for (let i = 0; i < 200; i++) {
      const { decision, memory: next } = decideNextCommand(state, memory, 'novice', 1, goal);
      memory = next;
      if (decision.kind === 'done') break;
      const input = decision.kind === 'enter' ? '' : decision.text;
      if (input.startsWith('unsave ')) unsaved = input.slice('unsave '.length);
      else if (unsaved && input.startsWith('save ')) resaved = input.slice('save '.length);
      state = { ...state, ...executeCommand(input, state).stateChanges } as GameState;
    }

    expect(unsaved).not.toBeNull();
    expect(resaved).not.toBeNull();
    expect(resaved).not.toBe(unsaved);
    // And the swap actually landed, rather than bouncing off a full dossier.
    expect(state.savedFiles.size).toBe(10);
    expect([...state.savedFiles].some(p => p.endsWith(`/${resaved}`))).toBe(true);
    expect([...state.savedFiles].some(p => p.endsWith(`/${unsaved}`))).toBe(false);
  });
});
