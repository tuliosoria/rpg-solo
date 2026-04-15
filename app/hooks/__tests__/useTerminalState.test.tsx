import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DEFAULT_GAME_STATE, GameState } from '../../types';
import { useTerminalState } from '../useTerminalState';

function createGameState(overrides: Partial<GameState> = {}): GameState {
  return {
    ...DEFAULT_GAME_STATE,
    seed: 12345,
    rngState: 12345,
    sessionStartTime: 1,
    tutorialComplete: true,
    tutorialStep: -1,
    ...overrides,
  };
}

describe('useTerminalState', () => {
  it('resets the terminal when the same checkpoint is loaded again through a fresh external state object', () => {
    const checkpointState = createGameState({
      currentPath: '/checkpoint',
      lastSaveTime: 123456,
    });
    const { result, rerender } = renderHook(({ state }) => useTerminalState(state, 'terminal'), {
      initialProps: {
        state: createGameState({ currentPath: '/initial' }),
      },
    });

    act(() => {
      rerender({ state: checkpointState });
    });

    expect(result.current.gameState.currentPath).toBe('/checkpoint');

    act(() => {
      result.current.setGameState(prev => ({ ...prev, currentPath: '/mutated' }));
      result.current.setShowGameOver(true);
      result.current.setShowPauseMenu(true);
    });

    expect(result.current.gameState.currentPath).toBe('/mutated');
    expect(result.current.showGameOver).toBe(true);
    expect(result.current.showPauseMenu).toBe(true);

    act(() => {
      rerender({ state: { ...checkpointState } });
    });

    expect(result.current.gameState.currentPath).toBe('/checkpoint');
    expect(result.current.showGameOver).toBe(false);
    expect(result.current.showPauseMenu).toBe(false);
  });
});
