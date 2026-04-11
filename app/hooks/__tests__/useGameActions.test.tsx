import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_GAME_STATE, type GameState } from '../../types';
import { useGameActions } from '../useGameActions';

vi.mock('../../components/FirewallEyes', () => ({
  createFirewallEyeBatch: vi.fn(),
  DETECTION_INCREASE_ON_DETONATE: 5,
  getFirewallEyeBatchSize: vi.fn(() => 5),
  MAX_CONCURRENT_FIREWALL_EYES: 10,
  speakFirewallVoice: vi.fn(),
}));

describe('useGameActions', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not award evidence when firewall eyes detonate', () => {
    let state: GameState = {
      ...DEFAULT_GAME_STATE,
      seed: 1,
      rngState: 1,
      sessionStartTime: Date.now(),
      tutorialComplete: true,
      detectionLevel: 30,
      evidenceCount: 0,
      firewallEyes: [
        {
          id: 'eye-1',
          x: 50,
          y: 50,
          spawnTime: Date.now(),
          detonateTime: Date.now() + 1000,
          isDetonating: false,
        },
      ],
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

    act(() => {
      result.current.handleFirewallEyeDetonate('eye-1');
      vi.advanceTimersByTime(100);
    });

    expect(state.avatarExpression).toBe('scared');
    expect(state.evidenceCount).toBe(0);
    expect(state.detectionLevel).toBe(35);
  });
});
