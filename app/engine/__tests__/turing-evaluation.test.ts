import { describe, it, expect } from 'vitest';
import type { GameState } from '../../types';
import { DEFAULT_GAME_STATE } from '../../types';
import { executeCommand } from '../commands';

const createState = (overrides: Partial<GameState> = {}): GameState => ({
  ...DEFAULT_GAME_STATE,
  seed: 12345,
  rngState: 12345,
  sessionStartTime: Date.now(),
  tutorialStep: -1,
  tutorialComplete: true,
  ...overrides,
});

describe('Turing evaluation', () => {
  it('triggers when detection enters the 45-55% range', () => {
    const state = createState({
      detectionLevel: 50,
      evidenceCount: 1,
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
      evidenceCount: 0,
    });
    const result = executeCommand('help', state);

    expect(result.stateChanges.turingEvaluationActive).toBeFalsy();
  });

  it('passes A/B/C input through to normal command processing when active', () => {
    // Inline handler was removed - overlay handles Turing test now
    // A/B/C input should NOT be intercepted by the terminal
    const state = createState({
      detectionLevel: 50,
      turingEvaluationActive: true,
      turingEvaluationIndex: 0,
    });
    const result = executeCommand('A', state);

    // Should NOT trigger game over - input passes through to normal command processing
    expect(result.stateChanges.turingEvaluationActive).toBeUndefined();
    // Command 'A' is treated as an unknown command
    expect(result.output.length).toBeGreaterThan(0);
  });

  it('does not intercept C input when turing evaluation is active', () => {
    const state = createState({
      detectionLevel: 50,
      turingEvaluationActive: true,
      turingEvaluationIndex: 0,
    });
    const result = executeCommand('C', state);

    // Should NOT cause turing failure - overlay handles this now
    expect(result.stateChanges.gameOverReason).toBeUndefined();
  });

  it('does not intercept B input when turing evaluation is active', () => {
    // B was the "correct" machine answer - but inline handler no longer processes it
    const state = createState({
      detectionLevel: 50,
      turingEvaluationActive: true,
      turingEvaluationIndex: 0,
    });
    const result = executeCommand('B', state);

    // Should NOT advance turing evaluation index - overlay handles this now
    expect(result.stateChanges.turingEvaluationIndex).toBeUndefined();
  });

  it('does not complete turing evaluation inline for last question', () => {
    const state = createState({
      detectionLevel: 50,
      turingEvaluationActive: true,
      turingEvaluationIndex: 2, // Last question
    });
    const result = executeCommand('B', state);

    // Overlay handles completion, not inline terminal
    expect(result.stateChanges.turingEvaluationCompleted).toBeUndefined();
  });

  it('does not show pass message inline', () => {
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
    ).toBe(false);
  });

  it('triggers when detection jumps past 45-55% in a single command', () => {
    // This tests the fix for detection jumping from below 45% to above 55% in one command
    const state = createState({
      detectionLevel: 44,
      currentPath: '/tmp',
      evidenceCount: 1,
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
      evidenceCount: 1,
      singularEventsTriggered: new Set(['turing_warning', 'turing_evaluation']),
      turingEvaluationCompleted: true,
    });

    const result = executeCommand('help', state);

    expect(result.triggerTuringTest).toBeUndefined();
    expect(result.stateChanges.turingEvaluationActive).toBeUndefined();
  });

  it('does not intercept invalid input when turing evaluation is active', () => {
    const state = createState({
      detectionLevel: 50,
      turingEvaluationActive: true,
      turingEvaluationIndex: 0,
    });
    const result = executeCommand('X', state);

    // Inline handler removed - X passes through to normal command processing
    // Should NOT show turing-specific INVALID RESPONSE
    expect(result.stateChanges.turingEvaluationActive).toBeUndefined();
    expect(result.stateChanges.isGameOver).toBeUndefined();
  });

  it('does not intercept lowercase input when turing evaluation is active', () => {
    const state = createState({
      detectionLevel: 50,
      turingEvaluationActive: true,
      turingEvaluationIndex: 0,
    });
    const result = executeCommand('b', state);

    // Inline handler removed - 'b' passes through to normal command processing
    expect(result.stateChanges.turingEvaluationIndex).toBeUndefined();
  });
});
