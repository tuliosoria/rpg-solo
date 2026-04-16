'use client';

import { useCallback, type MutableRefObject } from 'react';
import { createEntryI18n } from '../engine/commands/utils';
import type { GamePhase, GameState } from '../types';
import type { SoundType } from './useSound';
import { appendToHistory } from '../lib/appendToHistory';
import { determineEnding } from '../engine/endings';

interface UseGameActionsOptions {
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  setGamePhase: React.Dispatch<React.SetStateAction<GamePhase>>;
  gameStateRef: MutableRefObject<GameState>;
  onExitAction: () => void;
  playSound: (sound: SoundType) => void;
}

export function useGameActions({
  setGameState,
  setGamePhase,
  gameStateRef,
  onExitAction,
  playSound,
}: UseGameActionsOptions) {
  const handleBlackoutComplete = useCallback(() => {
    // Evaluate the player's dossier and determine the correct ending
    // All 12 dossier endings render through Victory.tsx which has the ENDINGS system
    const currentState = gameStateRef.current;
    const endingId = determineEnding(currentState.savedFiles);

    setGamePhase('victory');
    setGameState(prev => ({
      ...prev,
      gameWon: true,
      isGameOver: false,
      gameOverReason: undefined,
      endingType: 'good',
      endingId,
    }));
  }, [setGamePhase, setGameState, gameStateRef]);

  const handleVictory = useCallback(() => {
    setGamePhase('victory');
    setGameState(prev => ({
      ...prev,
      gameWon: true,
      endingType: 'good',
    }));
  }, [setGamePhase, setGameState]);

  const handleRestart = useCallback(() => {
    onExitAction();
  }, [onExitAction]);

  const handleFirewallActivate = useCallback(() => {
    playSound('alert');
    const firewallWarning = createEntryI18n(
      'ufo74',
      'hooks.gameActions.firewallWarning',
      'UFO74: ...the firewall sees us. his watchers are here. We have to find the evidences soon!'
    );
    setGameState(prev => ({
      ...prev,
      firewallActive: true,
      history: appendToHistory(prev.history, firewallWarning),
    }));
  }, [playSound, setGameState]);

  return {
    handleBlackoutComplete,
    handleVictory,
    handleRestart,
    handleFirewallActivate,
  };
}
