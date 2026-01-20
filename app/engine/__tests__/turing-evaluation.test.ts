import { describe, it, expect } from 'vitest';
import type { GameState } from '../../types';
import { DEFAULT_GAME_STATE } from '../../types';
import { executeCommand } from '../commands';

const createState = (overrides: Partial<GameState> = {}): GameState => ({
  ...DEFAULT_GAME_STATE,
  seed: 12345,
  rngState: 12345,
  sessionStartTime: Date.now(),
  ...overrides,
});

describe('Turing evaluation', () => {
  it.skip('triggers at mid risk threshold', () => {
    const state = createState({ detectionLevel: 45 });
    const result = executeCommand('help', state);

    expect(result.stateChanges.turingEvaluationActive).toBe(true);
    expect(result.output.some(entry => entry.content.includes('TURING EVALUATION'))).toBe(true);
  });

  it.skip('fails on human response', () => {
    const state = createState({
      detectionLevel: 50,
      turingEvaluationActive: true,
      turingEvaluationIndex: 0,
    });
    const result = executeCommand('A', state);

    expect(result.stateChanges.isGameOver).toBe(true);
    expect(result.stateChanges.gameOverReason).toBe('TURING EVALUATION FAILED');
  });

  it.skip('advances on cold response and completes after final question', () => {
    const state = createState({
      detectionLevel: 50,
      turingEvaluationActive: true,
      turingEvaluationIndex: 2,
    });
    const result = executeCommand('B', state);

    expect(result.stateChanges.turingEvaluationActive).toBe(false);
    expect(result.stateChanges.turingEvaluationCompleted).toBe(true);
  });
});
