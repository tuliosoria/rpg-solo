import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_GAME_STATE, type GameState } from '../../types';
import { useGameActions } from '../useGameActions';

describe('useGameActions', () => {
  it('handleFirewallActivate sets firewallActive to true', () => {
    let state: GameState = {
      ...DEFAULT_GAME_STATE,
      seed: 1,
      rngState: 1,
      sessionStartTime: Date.now(),
      tutorialComplete: true,
      detectionLevel: 30,
      firewallActive: false,
      history: [],
      singularEventsTriggered: new Set(),
    };

    const setGameState = vi.fn((updater: GameState | ((prev: GameState) => GameState)) => {
      state = typeof updater === 'function' ? updater(state) : updater;
    });

    const { result } = renderHook(() =>
      useGameActions({
        setGameState,
        setGamePhase: vi.fn(),
        setShowTuringTest: vi.fn(),
        setShowGameOver: vi.fn(),
        setGameOverReason: vi.fn(),
        onExitAction: vi.fn(),
        playSound: vi.fn(),
        triggerFlicker: vi.fn(),
      })
    );

    result.current.handleFirewallActivate();

    expect(state.firewallActive).toBe(true);
  });
});
