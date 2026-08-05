import { describe, it } from 'vitest';
import { executeCommand } from '../app/engine/commands';
import { decideNextCommand } from '../app/engine/bot/strategy';
import { createBotMemory, settleBotTurn, BotLevel, BotRunLogEntry } from '../app/engine/bot/types';
import { DEFAULT_GAME_STATE, GameState } from '../app/types';
import { determineEnding } from '../app/engine/endings';
import { buildRunSummary } from '../app/engine/bot/report';

function freshState(seed: number): GameState {
  return {
    ...DEFAULT_GAME_STATE,
    tutorialComplete: true,
    seed,
    filesRead: new Set<string>(),
    savedFiles: new Set<string>(),
    savedFilesList: [],
  } as unknown as GameState;
}

function runBot(level: BotLevel, seed: number) {
  let state = freshState(seed);
  let memory = createBotMemory();
  let reason = 'unterminated';
  const log: BotRunLogEntry[] = [];

  for (let i = 0; i < 900; i++) {
    const { decision, memory: nextMemory } = decideNextCommand(state, memory, level, seed);
    memory = nextMemory;
    if (decision.kind === 'done') {
      reason = decision.reason;
      break;
    }
    const input = decision.kind === 'enter' ? '' : decision.text;

    const before = {
      wrongAttempts: state.wrongAttempts ?? 0,
      leakProgress: state.leakSequenceProgress ?? 0,
      leakGenerated: !!state.leakSequenceGenerated,
    };
    const entry: BotRunLogEntry = {
      turn: memory.turnsTaken,
      command: input,
      detectionBefore: state.detectionLevel,
      detectionAfter: state.detectionLevel,
      filesReadBefore: state.filesRead.size,
      savedBefore: state.savedFiles.size,
      filesReadAfter: state.filesRead.size,
      savedAfter: state.savedFiles.size,
    };

    const result = executeCommand(input, state);
    state = { ...state, ...result.stateChanges } as GameState;

    settleBotTurn(
      entry,
      {
        detectionLevel: state.detectionLevel,
        filesRead: state.filesRead.size,
        savedFiles: state.savedFiles.size,
        wrongAttempts: state.wrongAttempts ?? 0,
        leakProgress: state.leakSequenceProgress ?? 0,
        leakGenerated: !!state.leakSequenceGenerated,
        gameWon: !!state.gameWon,
        isGameOver: !!state.isGameOver,
        gameOverReason: state.gameOverReason,
      },
      before
    );
    log.push(entry);
  }

  return { state, memory, reason, log };
}

const SEEDS = [1, 7, 42, 99, 12345, 31337, 777, 2468, 8675309, 1996];

describe('SWEEP: every level × many seeds', () => {
  for (const level of ['dummy', 'novice', 'pro'] as BotLevel[]) {
    it(`${level}`, () => {
      const lines: string[] = [];
      for (const seed of SEEDS) {
        const { state, memory, reason, log } = runBot(level, seed);
        const anomalies = log.filter(e => e.anomaly);
        const ending = state.gameWon ? determineEnding(state.savedFiles) : '-';
        lines.push(
          `${level} seed=${seed} turns=${memory.turnsTaken} read=${state.filesRead.size} saved=${state.savedFiles.size} det=${state.detectionLevel} won=${state.gameWon} over=${state.isGameOver} ending=${ending} reason="${reason}" anomalies=${anomalies.length}`
        );
        for (const a of anomalies) {
          lines.push(`    turn ${a.turn} [${a.command}] -> ${a.anomaly}`);
        }
        // exercise the report builder too
        buildRunSummary(log, { active: false, level, seed, maxTurns: 400, delayMs: 0 }, state, reason);
      }
      console.log('\n' + lines.join('\n'));
    });
  }
});
