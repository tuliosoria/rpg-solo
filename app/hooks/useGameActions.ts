'use client';

import { useCallback } from 'react';
import { createEntry } from '../engine/commands';
import type { GamePhase, GameState } from '../types';
import type { SoundType } from './useSound';
import { appendToHistory } from '../lib/appendToHistory';

interface UseGameActionsOptions {
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  setGamePhase: React.Dispatch<React.SetStateAction<GamePhase>>;
  setShowTuringTest: React.Dispatch<React.SetStateAction<boolean>>;
  setShowGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  setGameOverReason: React.Dispatch<React.SetStateAction<string>>;
  onExitAction: () => void;
  playSound: (sound: SoundType) => void;
  triggerFlicker: () => void;
}

export function useGameActions({
  setGameState,
  setGamePhase,
  setShowTuringTest,
  setShowGameOver,
  setGameOverReason,
  onExitAction,
  playSound,
  triggerFlicker,
}: UseGameActionsOptions) {
  const handleBlackoutComplete = useCallback(() => {
    setGamePhase('icq');
    setGameState(prev => ({
      ...prev,
      icqPhase: true,
      // Clear any lingering game-over state so ICQ starts cleanly
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
      icqPhase: false,
    }));
  }, [setGamePhase, setGameState]);

  const handleIcqTrustChange = useCallback(
    (trust: number) => {
      setGameState(prev => ({ ...prev, icqTrust: trust }));
    },
    [setGameState]
  );

  const handleIcqMathMistake = useCallback(() => {
    setGameState(prev => ({ ...prev, mathQuestionWrong: (prev.mathQuestionWrong || 0) + 1 }));
  }, [setGameState]);

  const handleIcqLeakChoice = useCallback(
    (choice: 'public' | 'covert') => {
      setGameState(prev => ({
        ...prev,
        choiceLeakPath: choice,
        flags: { ...prev.flags, leakExecuted: true },
      }));
    },
    [setGameState]
  );

  const handleIcqFilesSent = useCallback(() => {
    setGameState(prev => ({ ...prev, filesSent: true }));
  }, [setGameState]);

  const handleRestart = useCallback(() => {
    onExitAction();
  }, [onExitAction]);

  const handleFirewallActivate = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      firewallActive: true,
    }));
    playSound('alert');
    const firewallWarning = createEntry(
      'ufo74',
      'UFO74: ...they see us. the watchers are here.'
    );
    setGameState(prev => ({
      ...prev,
      history: appendToHistory(prev.history, firewallWarning),
    }));
  }, [playSound, setGameState]);

  return {
    handleBlackoutComplete,
    handleVictory,
    handleIcqTrustChange,
    handleIcqMathMistake,
    handleIcqLeakChoice,
    handleIcqFilesSent,
    handleRestart,
    handleFirewallActivate,
  };
}
