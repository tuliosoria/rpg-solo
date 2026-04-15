import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAutocomplete } from '../useAutocomplete';
import { DEFAULT_GAME_STATE, GameState } from '../../types';

const createTestState = (overrides: Partial<GameState> = {}): GameState =>
  ({
    ...DEFAULT_GAME_STATE,
    seed: 12345,
    rngState: 12345,
    sessionStartTime: Date.now(),
    tutorialStep: -1,
    tutorialComplete: true,
    ...overrides,
  }) as GameState;

describe('useAutocomplete', () => {
  it('includes all player-facing guidance commands in command completion', () => {
    const { result } = renderHook(() => useAutocomplete(createTestState()));

    const completions = result.current.getCompletions('');

    expect(completions).toEqual(
      expect.arrayContaining(['search', 'hint', 'wait', 'hide', 'morse', 'unsave'])
    );
  });

  it('completes file arguments for save and unsave commands', () => {
    const { result } = renderHook(() =>
      useAutocomplete(
        createTestState({
          currentPath: '/ops/assessments',
        })
      )
    );

    expect(result.current.getCompletions('save fo')).toContain('foreign_drone_assessment.txt');
    expect(result.current.getCompletions('unsave fo')).toContain('foreign_drone_assessment.txt');
  });
});
