import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_GAME_STATE, type GameState } from '../../types';
import { useGameActions } from '../useGameActions';

describe('useGameActions', () => {
  const createState = (overrides: Partial<GameState> = {}): GameState => ({
    ...DEFAULT_GAME_STATE,
    seed: 1,
    rngState: 1,
    sessionStartTime: Date.now(),
    ...overrides,
  });

  const createHook = (initialState: GameState) => {
    let state = initialState;
    const setGameState = vi.fn((updater: GameState | ((prev: GameState) => GameState)) => {
      state = typeof updater === 'function' ? updater(state) : updater;
    });
    const setGamePhase = vi.fn();
    const gameStateRef = { current: initialState };

    const { result } = renderHook(() =>
      useGameActions({
        setGameState,
        setGamePhase,
        gameStateRef,
        onExitAction: vi.fn(),
        playSound: vi.fn(),
      })
    );

    return { result, getState: () => state, setGamePhase };
  };

  it('handleFirewallActivate sets firewallActive to true', () => {
    const { result, getState } = createHook(
      createState({
        tutorialComplete: true,
        detectionLevel: 30,
        firewallActive: false,
        history: [],
        singularEventsTriggered: new Set(),
      })
    );

    result.current.handleFirewallActivate();

    expect(getState().firewallActive).toBe(true);
  });
});
