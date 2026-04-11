'use client';

import { useCallback, useRef } from 'react';
import { createEntry } from '../engine/commands';
import type { GamePhase, GameState } from '../types';
import type { SoundType } from './useSound';
import { DETECTION_THRESHOLDS } from '../constants/detection';
import {
  createFirewallEyeBatch,
  DETECTION_INCREASE_ON_DETONATE,
  getFirewallEyeBatchSize,
  MAX_CONCURRENT_FIREWALL_EYES,
  speakFirewallVoice,
} from '../components/FirewallEyes';

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
    const now = Date.now();
    setGameState(prev => {
      const batchSize = Math.min(
        getFirewallEyeBatchSize(prev.detectionLevel),
        MAX_CONCURRENT_FIREWALL_EYES
      );
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
    let spawned = false;

    setGameState(prev => {
      const availableSlots = Math.max(
        0,
        MAX_CONCURRENT_FIREWALL_EYES - prev.firewallEyes.length
      );
      const batchSize = Math.min(getFirewallEyeBatchSize(prev.detectionLevel), availableSlots);
      if (batchSize === 0) {
        return prev;
      }

      spawned = true;
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

    if (!spawned) {
      return;
    }

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

  // Batch detonation: accumulate eye IDs and flush together
  const pendingDetonationsRef = useRef<string[]>([]);
  const detonationFlushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flushDetonations = useCallback(() => {
    detonationFlushTimerRef.current = null;
    const eyeIds = pendingDetonationsRef.current.splice(0);
    if (eyeIds.length === 0) return;

    const missCount = eyeIds.length;
    let shouldTriggerTuringTest = false;
    let shouldShowGameOver = false;

    setGameState(prev => {
      const updatedEyes = prev.firewallEyes.map(e =>
        eyeIds.includes(e.id) ? { ...e, isDetonating: true } : e
      );

      const totalIncrease = DETECTION_INCREASE_ON_DETONATE * missCount;
      const newDetection = Math.min(100, prev.detectionLevel + totalIncrease);

      const crossedTuringThreshold =
        prev.detectionLevel < DETECTION_THRESHOLDS.TURING_TRIGGER &&
        newDetection >= DETECTION_THRESHOLDS.TURING_TRIGGER;

      const willTriggerTuringTest =
        crossedTuringThreshold &&
        prev.tutorialComplete &&
        (prev.evidenceCount || 0) >= 1 &&
        !prev.turingEvaluationActive &&
        !prev.turingEvaluationCompleted &&
        !prev.singularEventsTriggered?.has('turing_evaluation');
      shouldTriggerTuringTest = willTriggerTuringTest;

      // Check for game over: detection reached 100% from eye detonation
      const isGameOver =
        prev.tutorialComplete &&
        newDetection >= 100 &&
        !prev.isGameOver &&
        !prev.evidencesSaved;
      shouldShowGameOver = isGameOver;

      const detonateWarning = createEntry(
        'error',
        `[FIREWALL] ${missCount} surveillance node${missCount > 1 ? 's' : ''} reported. Detection increased to ${newDetection}%`
      );

      const missWord = missCount === 1 ? 'one' : missCount === 2 ? 'two' : missCount === 3 ? 'three' : String(missCount);
      let ufo74Panic;
      if (willTriggerTuringTest) {
        ufo74Panic = createEntry('ufo74', 'UFO74: NO! Detection hit 50% — they\'re initiating Turing eval!');
      } else if (newDetection >= 80) {
        ufo74Panic = createEntry('ufo74', "UFO74: THEY KNOW! They're tracing us RIGHT NOW!");
      } else if (newDetection >= 60) {
        ufo74Panic = createEntry('ufo74', `UFO74: That one got through! Be faster, kid!`);
      } else if (missCount === 1) {
        ufo74Panic = createEntry('ufo74', 'UFO74: Damn! You missed one. Stay focused!');
      } else {
        ufo74Panic = createEntry('ufo74', `UFO74: Damn! You missed ${missWord} eyes. Stay focused.`);
      }

      const newSingularEvents = willTriggerTuringTest
        ? new Set([...(prev.singularEventsTriggered || []), 'turing_evaluation'])
        : prev.singularEventsTriggered;

      return {
        ...prev,
        firewallEyes: updatedEyes,
        detectionLevel: newDetection,
        avatarExpression: 'scared',
        history: isGameOver
          ? [
              ...prev.history,
              detonateWarning,
              createEntry('error', ''),
              createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
              createEntry('error', ''),
              createEntry('error', '  INTRUSION DETECTED'),
              createEntry('error', ''),
              createEntry('error', '  Your connection has been traced.'),
              createEntry('error', '  Security protocols have been dispatched.'),
              createEntry('error', ''),
              createEntry('error', '  >> SESSION TERMINATED <<'),
              createEntry('error', ''),
              createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
              createEntry('error', ''),
            ]
          : [...prev.history, detonateWarning, ufo74Panic],
        isGameOver: isGameOver ? true : prev.isGameOver,
        gameOverReason: isGameOver ? 'INTRUSION DETECTED - TRACED' : prev.gameOverReason,
        turingEvaluationActive: willTriggerTuringTest ? true : prev.turingEvaluationActive,
        singularEventsTriggered: newSingularEvents,
      };
    });

    if (shouldTriggerTuringTest) {
      window.setTimeout(() => {
        setShowTuringTest(true);
      }, 1500);
    }

    if (shouldShowGameOver) {
      window.setTimeout(() => {
        setGameOverReason('INTRUSION DETECTED - TRACED');
        setShowGameOver(true);
      }, 100);
    }

    playSound('error');
    triggerFlicker();

    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        firewallEyes: prev.firewallEyes.filter(e => !eyeIds.includes(e.id)),
      }));
    }, 500);
  }, [playSound, setGameState, setShowTuringTest, setShowGameOver, setGameOverReason, triggerFlicker]);

  const handleFirewallEyeDetonate = useCallback(
    (eyeId: string) => {
      pendingDetonationsRef.current.push(eyeId);
      // Debounce: flush after 100ms to batch simultaneous detonations
      if (!detonationFlushTimerRef.current) {
        detonationFlushTimerRef.current = setTimeout(flushDetonations, 100);
      }
    },
    [flushDetonations]
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
