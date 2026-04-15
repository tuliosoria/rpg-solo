import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_GAME_STATE, type GameState } from '../../types';
import { determineEnding } from '../../engine/endings';
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

  it('handleBlackoutComplete resolves the ending from the saved dossier and moves to victory', () => {
    const savedFiles = new Set([
      '/internal/audio_transcript_brief.txt',
      '/internal/jardim_andere_incident.txt',
      '/internal/misc/incident_report_1996_01_VG.txt',
      '/storage/quarantine/bio_container.log',
      '/storage/quarantine/autopsy_alpha.log',
      '/storage/quarantine/witness_statement_raw.txt',
      '/ops/prato/archive/patrol_observation_shift_04.txt',
      '/ops/prato/initial_response_orders.txt',
      '/admin/thirty_year_cycle.txt',
      '/admin/colonization_model.red',
    ]);
    const initialState = createState({
      tutorialComplete: true,
      evidencesSaved: true,
      gameWon: true,
      savedFiles,
    });
    const { result, getState, setGamePhase } = createHook(initialState);

    result.current.handleBlackoutComplete();

    expect(setGamePhase).toHaveBeenCalledWith('victory');
    expect(getState().endingType).toBe('good');
    expect(getState().endingId).toBe(determineEnding(savedFiles));
    expect(getState().gameWon).toBe(true);
    expect(getState().isGameOver).toBe(false);
  });
});
