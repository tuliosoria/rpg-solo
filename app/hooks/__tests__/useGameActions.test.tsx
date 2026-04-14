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

    return { result, getState: () => state };
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

  it('marks conspiracyFilesLeaked when ICQ public leak follows discovered conspiracy files', () => {
    const { result, getState } = createHook(
      createState({
        conspiracyFilesSeen: new Set(['/internal/misc/economic_transition_memo.txt']),
      })
    );

    result.current.handleIcqLeakChoice('public');

    expect(getState().choiceLeakPath).toBe('public');
    expect(getState().flags.leakExecuted).toBe(true);
    expect(getState().flags.conspiracyFilesLeaked).toBe(true);
  });

  it('keeps conspiracyFilesLeaked false for covert ICQ leaks', () => {
    const { result, getState } = createHook(
      createState({
        conspiracyFilesSeen: new Set(['/internal/misc/economic_transition_memo.txt']),
      })
    );

    result.current.handleIcqLeakChoice('covert');

    expect(getState().choiceLeakPath).toBe('covert');
    expect(getState().flags.leakExecuted).toBe(true);
    expect(getState().flags.conspiracyFilesLeaked).toBe(false);
  });

  it('does not set conspiracyFilesLeaked on public ICQ leaks without conspiracy files', () => {
    const { result, getState } = createHook(createState());

    result.current.handleIcqLeakChoice('public');

    expect(getState().choiceLeakPath).toBe('public');
    expect(getState().flags.leakExecuted).toBe(true);
    expect(getState().flags.conspiracyFilesLeaked).toBe(false);
  });
});
