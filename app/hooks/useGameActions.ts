'use client';

import { useCallback } from 'react';
import { createEntry } from '../engine/commands';
import type { GamePhase, GameState } from '../types';
import type { SoundType } from './useSound';
import {
  createFirewallEyeBatch,
  DETECTION_INCREASE_ON_DETONATE,
  getFirewallEyeBatchSize,
  speakFirewallVoice,
} from '../components/FirewallEyes';

interface UseGameActionsOptions {
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  setGamePhase: React.Dispatch<React.SetStateAction<GamePhase>>;
  onExitAction: () => void;
  playSound: (sound: SoundType) => void;
  triggerFlicker: () => void;
}

export function useGameActions({
  setGameState,
  setGamePhase,
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
    const now = Date.now();
    setGameState(prev => {
      const batchSize = getFirewallEyeBatchSize(prev.detectionLevel);
      return {
        ...prev,
        firewallActive: true,
        lastEyeSpawnTime: now,
        firewallEyes: createFirewallEyeBatch(batchSize),
      };
    });
    playSound('alert');
    const firewallWarning = createEntry(
      'ufo74',
      'UFO74: KID! They deployed the FIREWALL. Those eyes - CLICK THEM before they report back!'
    );
    setGameState(prev => ({
      ...prev,
      history: [...prev.history, firewallWarning],
    }));
  }, [playSound, setGameState]);

  const handleFirewallEyeBatchSpawn = useCallback(() => {
    const now = Date.now();
    setGameState(prev => {
      const batchSize = getFirewallEyeBatchSize(prev.detectionLevel);
      const newEyes = [...prev.firewallEyes, ...createFirewallEyeBatch(batchSize)];

      const urgencyMessage = prev.flags.neuralLinkAuthenticated
        ? createEntry(
            'ufo74',
            'UFO74: MORE EYES! The neural link might disable the firewall - try "link disarm"!'
          )
        : createEntry(
            'ufo74',
            'UFO74: Another wave! Keep clicking those eyes - we need more time!'
          );

      return {
        ...prev,
        firewallEyes: newEyes,
        lastEyeSpawnTime: now,
        history: [...prev.history, urgencyMessage],
      };
    });
    playSound('warning');
    speakFirewallVoice();
  }, [playSound, setGameState]);

  const handleFirewallEyeClick = useCallback(
    (eyeId: string) => {
      setGameState(prev => ({
        ...prev,
        firewallEyes: prev.firewallEyes.filter(e => e.id !== eyeId),
      }));
      playSound('success');
    },
    [playSound, setGameState]
  );

  const handleFirewallEyeDetonate = useCallback(
    (eyeId: string) => {
      setGameState(prev => {
        const updatedEyes = prev.firewallEyes.map(e =>
          e.id === eyeId ? { ...e, isDetonating: true } : e
        );

        const newDetection = Math.min(100, prev.detectionLevel + DETECTION_INCREASE_ON_DETONATE);

        const detonateWarning = createEntry(
          'error',
          `[FIREWALL] Surveillance node reported. Detection increased to ${newDetection}%`
        );

        const ufo74Panic =
          newDetection >= 80
            ? createEntry('ufo74', "UFO74: THEY KNOW! They're tracing us RIGHT NOW!")
            : newDetection >= 60
              ? createEntry('ufo74', 'UFO74: That one got through! Be faster, kid!')
              : createEntry('ufo74', 'UFO74: Damn! You missed one. Stay focused!');

        return {
          ...prev,
          firewallEyes: updatedEyes,
          detectionLevel: newDetection,
          avatarExpression: 'scared',
          history: [...prev.history, detonateWarning, ufo74Panic],
        };
      });

      playSound('error');
      triggerFlicker();

      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          firewallEyes: prev.firewallEyes.filter(e => e.id !== eyeId),
        }));
      }, 500);
    },
    [playSound, setGameState, triggerFlicker]
  );

  return {
    handleBlackoutComplete,
    handleVictory,
    handleIcqTrustChange,
    handleIcqMathMistake,
    handleIcqLeakChoice,
    handleIcqFilesSent,
    handleRestart,
    handleFirewallActivate,
    handleFirewallEyeBatchSpawn,
    handleFirewallEyeClick,
    handleFirewallEyeDetonate,
  };
}
