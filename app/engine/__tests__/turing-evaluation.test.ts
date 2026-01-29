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
  it('triggers when detection enters the 45-55% range', () => {
    const state = createState({
      detectionLevel: 50,
      truthsDiscovered: new Set(['some_truth']),
      // Warning must have been shown first for Turing test to trigger
      singularEventsTriggered: new Set(['turing_warning']),
    });
    const result = executeCommand('help', state);

    expect(result.stateChanges.turingEvaluationActive).toBe(true);
    expect(result.output.some(entry => entry.content.includes('TURING EVALUATION'))).toBe(true);
    // Overlay now handles the detailed instructions, so just check for the header
    expect(result.triggerTuringTest).toBe(true);
  });

  it('does not trigger if no truths discovered', () => {
    const state = createState({
      detectionLevel: 50,
      truthsDiscovered: new Set(),
    });
    const result = executeCommand('help', state);

    expect(result.stateChanges.turingEvaluationActive).toBeFalsy();
  });

  it('fails on human response (selecting emotional answer)', () => {
    // Question 1: A is human ("Offer comfort"), C is human ("feel concern")
    const state = createState({
      detectionLevel: 50,
      turingEvaluationActive: true,
      turingEvaluationIndex: 0,
    });
    const result = executeCommand('A', state);

    expect(result.stateChanges.isGameOver).toBe(true);
    expect(result.stateChanges.gameOverReason).toBe('TURING EVALUATION FAILED');
    expect(result.output.some(entry => entry.content.includes('HUMAN operator'))).toBe(true);
  });

  it('fails on other human response', () => {
    const state = createState({
      detectionLevel: 50,
      turingEvaluationActive: true,
      turingEvaluationIndex: 0,
    });
    const result = executeCommand('C', state);

    expect(result.stateChanges.isGameOver).toBe(true);
    expect(result.stateChanges.gameOverReason).toBe('TURING EVALUATION FAILED');
  });

  it('advances on machine response (selecting cold answer)', () => {
    // Question 1: B is machine ("Assess acoustic output")
    const state = createState({
      detectionLevel: 50,
      turingEvaluationActive: true,
      turingEvaluationIndex: 0,
    });
    const result = executeCommand('B', state);

    expect(result.stateChanges.isGameOver).toBeFalsy();
    expect(result.stateChanges.turingEvaluationIndex).toBe(1);
    expect(result.output.some(entry => entry.content.includes('QUESTION 2'))).toBe(true);
  });

  it('completes after answering all questions correctly', () => {
    // Question 3: B is machine ("Credit attribution is irrelevant")
    const state = createState({
      detectionLevel: 50,
      turingEvaluationActive: true,
      turingEvaluationIndex: 2, // Last question
    });
    const result = executeCommand('B', state);

    expect(result.stateChanges.turingEvaluationActive).toBe(false);
    expect(result.stateChanges.turingEvaluationCompleted).toBe(true);
    expect(result.stateChanges.detectionLevel).toBe(40); // Reward: -10 detection
    expect(result.output.some(entry => entry.content.includes('PASSED'))).toBe(true);
  });

  it('shows "NOT HUMAN, NOT A THREAT" message on pass', () => {
    const state = createState({
      detectionLevel: 50,
      turingEvaluationActive: true,
      turingEvaluationIndex: 2, // Last question
    });
    const result = executeCommand('B', state);

    expect(
      result.output.some(
        entry => entry.content.includes('NOT HUMAN') || entry.content.includes('NOT A THREAT')
      )
    ).toBe(true);
  });

  it('triggers when detection jumps past 45-55% in a single command', () => {
    // This tests the fix for detection jumping from below 45% to above 55% in one command
    const state = createState({
      detectionLevel: 44,
      currentPath: '/tmp',
      truthsDiscovered: new Set(['some_truth']),
      singularEventsTriggered: new Set(['turing_warning']),
    });

    const result = executeCommand('open URGENT_classified_alpha.txt', state);

    expect(result.stateChanges.detectionLevel).toBe(56);
    expect(result.triggerTuringTest).toBe(true);
    expect(result.stateChanges.turingEvaluationActive).toBe(true);
  });

  it('only triggers once per game', () => {
    const state = createState({
      detectionLevel: 50,
      truthsDiscovered: new Set(['some_truth']),
      singularEventsTriggered: new Set(['turing_warning', 'turing_evaluation']),
      turingEvaluationCompleted: true,
    });

    const result = executeCommand('help', state);

    expect(result.triggerTuringTest).toBeUndefined();
    expect(result.stateChanges.turingEvaluationActive).toBeUndefined();
  });

  it('rejects invalid responses', () => {
    const state = createState({
      detectionLevel: 50,
      turingEvaluationActive: true,
      turingEvaluationIndex: 0,
    });
    const result = executeCommand('X', state);

    expect(result.output.some(entry => entry.content.includes('INVALID RESPONSE'))).toBe(true);
    expect(result.stateChanges.turingEvaluationActive).toBeUndefined();
    expect(result.stateChanges.isGameOver).toBeUndefined();
  });

  it('accepts lowercase responses', () => {
    const state = createState({
      detectionLevel: 50,
      turingEvaluationActive: true,
      turingEvaluationIndex: 0,
    });
    const result = executeCommand('b', state);

    expect(result.stateChanges.turingEvaluationIndex).toBe(1);
  });
});
