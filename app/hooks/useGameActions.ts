'use client';

import { useCallback } from 'react';
import { createEntryI18n } from '../engine/commands/utils';
import type { GamePhase, GameState } from '../types';
import type { SoundType } from './useSound';
import { appendToHistory } from '../lib/appendToHistory';

interface UseGameActionsOptions {
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  setGamePhase: React.Dispatch<React.SetStateAction<GamePhase>>;
  onExitAction: () => void;
  playSound: (sound: SoundType) => void;
}

export function useGameActions({
  setGameState,
  setGamePhase,
  onExitAction,
  playSound,
}: UseGameActionsOptions) {
  const handleBlackoutComplete = useCallback(() => {
    setGamePhase('victory');
    setGameState(prev => ({
      ...prev,
      gameWon: true,
      isGameOver: false,
      gameOverReason: undefined,
    }));
  }, [setGamePhase, setGameState]);

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
    setGameState(prev => ({
      ...prev,
      firewallActive: true,
    }));
    playSound('alert');
    const firewallWarning = createEntryI18n(
      'ufo74',
      'hooks.gameActions.firewallWarning',
      'UFO74: ...the firewall sees us. his watchers are here. We have to find the evidences soon!'
    );
    setGameState(prev => ({
      ...prev,
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
