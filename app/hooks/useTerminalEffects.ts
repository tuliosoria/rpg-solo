'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import { type GamePhase, type GameState, type ImageTrigger } from '../types';
import { createEntry } from '../engine/commands';
import { createEntryI18n } from '../engine/commands/utils';
import { appendToHistory } from '../lib/appendToHistory';
import { autoSave } from '../storage/saves';
import { addPlaytime } from '../storage/statistics';
import { DETECTION_THRESHOLDS } from '../constants/detection';
import { AUTOSAVE_INTERVAL_MS } from '../constants/timing';
import {
  BLACKOUT_TRANSITION_DELAY_MS,
  CRT_WARMUP_DURATION_MS,
  PARANOIA_TIMING,
  RISK_PULSE_DURATION_MS,
} from '../constants/timing';
import { uiRandom, uiRandomPick } from '../engine/rng';
import { initVoices } from '../lib/firewallVoice';
import { applyOptionsToDocument, readStoredOptions } from './useOptions';
import type { SoundType } from './useSound';
import { useI18n } from '../i18n';

// "They're watching" paranoia messages
interface LocalizedTerminalCopy {
  key: string;
  fallback: string;
}

const PARANOIA_MESSAGES: LocalizedTerminalCopy[] = [
  { key: 'terminal.paranoia.1', fallback: 'TRACE DETECTED: External observer connected' },
  { key: 'terminal.paranoia.2', fallback: 'WARNING: Packet inspection in progress' },
  { key: 'terminal.paranoia.3', fallback: 'NOTICE: Session being monitored' },
  { key: 'terminal.paranoia.4', fallback: 'ALERT: Unauthorized access attempt logged' },
  { key: 'terminal.paranoia.5', fallback: 'SYSTEM: Someone else is in the system' },
  { key: 'terminal.paranoia.6', fallback: 'ANOMALY: Data exfiltration detected' },
  { key: 'terminal.paranoia.7', fallback: 'CAUTION: Your keystrokes are being recorded' },
  { key: 'terminal.paranoia.8', fallback: 'INFO: Connection routed through unknown node' },
  { key: 'terminal.paranoia.9', fallback: 'WARNING: Firewall breach attempt detected' },
  { key: 'terminal.paranoia.10', fallback: 'NOTICE: Session flagged for review' },
  { key: 'terminal.paranoia.11', fallback: 'ALERT: Third-party listener identified' },
  { key: 'terminal.paranoia.12', fallback: 'SYSTEM: Memory dump in progress' },
  { key: 'terminal.paranoia.13', fallback: 'TRACE: Unknown process accessing your session' },
  { key: 'terminal.paranoia.14', fallback: 'NOTICE: Query patterns being analyzed' },
  {
    key: 'terminal.paranoia.15',
    fallback: 'WARNING: Session duration exceeds normal parameters',
  },
  { key: 'terminal.paranoia.16', fallback: 'SYSTEM: Behavioral profile update in progress' },
  {
    key: 'terminal.paranoia.17',
    fallback: 'ALERT: File access sequence flagged as anomalous',
  },
  { key: 'terminal.paranoia.18', fallback: 'CAUTION: Terminal output being mirrored' },
  { key: 'terminal.paranoia.19', fallback: 'INFO: Your IP has been logged for review' },
  {
    key: 'terminal.paranoia.20',
    fallback: 'NOTICE: Command history archived to external server',
  },
  { key: 'terminal.paranoia.21', fallback: 'WARNING: They know where you are' },
  { key: 'terminal.paranoia.22', fallback: 'ALERT: Physical location triangulated' },
  { key: 'terminal.paranoia.23', fallback: 'SYSTEM: Dispatch notification pending' },
  {
    key: 'terminal.paranoia.24',
    fallback: 'NOTICE: Someone just accessed your personnel file',
  },
  { key: 'terminal.paranoia.25', fallback: 'CAUTION: Your screen is being watched' },
  { key: 'terminal.paranoia.26', fallback: 'WARNING: Audio capture device detected' },
  { key: 'terminal.paranoia.27', fallback: 'ALERT: Camera feed request intercepted' },
  { key: 'terminal.paranoia.28', fallback: 'SYSTEM: Facial recognition scan initiated' },
  { key: 'terminal.paranoia.29', fallback: 'SIGNAL: ...they remember you from before...' },
  { key: 'terminal.paranoia.30', fallback: 'TRACE: Pattern matches previous intruder' },
  { key: 'terminal.paranoia.31', fallback: 'NOTICE: The watchers have been notified' },
  { key: 'terminal.paranoia.32', fallback: 'ALERT: You were expected' },
  { key: 'terminal.paranoia.33', fallback: 'SYSTEM: Countermeasures initializing' },
  { key: 'terminal.paranoia.34', fallback: 'WARNING: Too late to disconnect cleanly' },
  { key: 'terminal.paranoia.35', fallback: 'CAUTION: Your curiosity has been noted' },
  { key: 'terminal.paranoia.36', fallback: 'INFO: This session will be... remembered' },
];

const ALIEN_MANIFESTATION_INTERVAL_MS = 30000;

interface TerminalEffectsRefs {
  outputRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  enterOnlyButtonRef: React.RefObject<HTMLButtonElement | null>;
  gameStateRef: React.MutableRefObject<GameState>;
  uiStateRef: React.MutableRefObject<{
    gamePhase: GamePhase;
    showGameOver: boolean;
    showTuringTest: boolean;
    activeImage: ImageTrigger | null;
    pendingImage: ImageTrigger | null;
    hasBlockingPopup: boolean;
  }>;
  streamStartScrollPos: React.MutableRefObject<number | null>;
  typingSpeedWarningTimeout: React.MutableRefObject<NodeJS.Timeout | null>;
  idleHintTimerRef: React.MutableRefObject<NodeJS.Timeout | null>;
  lastScrollTimeRef: React.MutableRefObject<number>;
  timedMechanicPauseStartRef: React.MutableRefObject<number | null>;
  timedMechanicResumeAdjustmentRef: React.MutableRefObject<number>;
  maxDetectionRef: React.MutableRefObject<number>;
  prevDetectionRef: React.MutableRefObject<number>;
  skipStreamingRef: React.MutableRefObject<boolean>;
  turingOverlayTimeoutRef: React.MutableRefObject<number | null>;
}

interface UseTerminalEffectsOptions {
  gameState: GameState;
  gamePhase: GamePhase;
  isStreaming: boolean;
  isProcessing: boolean;
  isWarmingUp: boolean;
  showTuringTest: boolean;
  activeImage: ImageTrigger | null;
  showSettings: boolean;
  showAchievements: boolean;
  showStatistics: boolean;
  showPauseMenu: boolean;
  showHeaderMenu: boolean;
  showTutorialSkip: boolean;
  isEnterOnlyMode: boolean;
  pauseTimedMechanics: boolean;
  suppressPressure: boolean;
  soundEnabled: boolean;
  onEnterPress?: () => void;
  playSound: (sound: SoundType) => void;
  startAmbient: () => void;
  stopAmbient: () => void;
  updateAmbientTension: (level: number) => void;
  updateMusicForRisk: (risk: number) => void;
  setTimedDecryptRemaining: React.Dispatch<React.SetStateAction<number>>;
  setIsWarmingUp: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEvidenceTracker: React.Dispatch<React.SetStateAction<boolean>>;
  setShowRiskTracker: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAttBar: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAvatar: React.Dispatch<React.SetStateAction<boolean>>;
  setAvatarCreepyEntrance: React.Dispatch<React.SetStateAction<boolean>>;
  setGamePhase: React.Dispatch<React.SetStateAction<GamePhase>>;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  setParanoiaPosition: React.Dispatch<React.SetStateAction<{ top: number; left: number }>>;
  setParanoiaMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setRiskPulse: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShaking: React.Dispatch<React.SetStateAction<boolean>>;
  setCountdownDisplay: React.Dispatch<React.SetStateAction<string | null>>;
  setShowSettings: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAchievements: React.Dispatch<React.SetStateAction<boolean>>;
  setShowStatistics: React.Dispatch<React.SetStateAction<boolean>>;
  setShowPauseMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setShowHeaderMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setShowTuringTest: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveImage: React.Dispatch<React.SetStateAction<ImageTrigger | null>>;
  setInterferenceBurst: React.Dispatch<React.SetStateAction<{ top: number } | null>>;
  setTerminalStaticLevel: React.Dispatch<React.SetStateAction<number>>;
  setAlienSilhouetteVisible: React.Dispatch<React.SetStateAction<boolean>>;
  refs: TerminalEffectsRefs;
}

export function useTerminalEffects({
  gameState,
  gamePhase,
  isStreaming,
  isProcessing,
  isWarmingUp,
  showTuringTest,
  activeImage,
  showSettings,
  showAchievements,
  showStatistics,
  showPauseMenu,
  showHeaderMenu,
  showTutorialSkip,
  isEnterOnlyMode,
  pauseTimedMechanics,
  suppressPressure,
  soundEnabled,
  onEnterPress,
  playSound,
  startAmbient,
  stopAmbient,
  updateAmbientTension,
  updateMusicForRisk,
  setTimedDecryptRemaining,
  setIsWarmingUp,
  setShowEvidenceTracker,
  setShowRiskTracker,
  setShowAttBar,
  setShowAvatar,
  setAvatarCreepyEntrance: _setAvatarCreepyEntrance,
  setGamePhase,
  setGameState,
  setParanoiaPosition,
  setParanoiaMessage,
  setRiskPulse,
  setIsShaking,
  setCountdownDisplay,
  setShowSettings,
  setShowAchievements,
  setShowStatistics,
  setShowPauseMenu,
  setShowHeaderMenu,
  setShowTuringTest,
  setActiveImage,
  setInterferenceBurst,
  setTerminalStaticLevel,
  setAlienSilhouetteVisible,
  refs,
}: UseTerminalEffectsOptions) {
  const {
    outputRef,
    inputRef,
    enterOnlyButtonRef,
    gameStateRef,
    uiStateRef,
    streamStartScrollPos,
    typingSpeedWarningTimeout,
    idleHintTimerRef,
    lastScrollTimeRef,
    timedMechanicPauseStartRef,
    timedMechanicResumeAdjustmentRef,
    maxDetectionRef,
    prevDetectionRef,
    skipStreamingRef,
    turingOverlayTimeoutRef,
  } = refs;
  const { t } = useI18n();

  const shouldRestoreFocus =
    gamePhase === 'terminal' &&
    !gameState.isGameOver &&
    !isProcessing &&
    !isStreaming &&
    !showTuringTest &&
    !activeImage &&
    !showSettings &&
    !showAchievements &&
    !showStatistics &&
    !showPauseMenu &&
    !showHeaderMenu &&
    !showTutorialSkip;

  const focusTerminalTarget = useCallback(() => {
    const target = isEnterOnlyMode
      ? (enterOnlyButtonRef.current ?? inputRef.current)
      : (inputRef.current ?? enterOnlyButtonRef.current);
    if (!target) return;
    if (document.activeElement === target) return;
    target.focus();
  }, [enterOnlyButtonRef, inputRef, isEnterOnlyMode]);

  const focusTerminalInput = useCallback(() => {
    if (!shouldRestoreFocus) return;
    focusTerminalTarget();
  }, [focusTerminalTarget, shouldRestoreFocus]);

  // Apply stored visual preferences and initialize voice synthesis on mount
  useEffect(() => {
    applyOptionsToDocument(readStoredOptions());
    initVoices();
  }, []);

  // Update timed decryption countdown
  useEffect(() => {
    if (!gameState.timedDecryptActive || !gameState.timedDecryptEndTime) {
      setTimedDecryptRemaining(0);
      return;
    }

    if (pauseTimedMechanics || timedMechanicPauseStartRef.current !== null) {
      return;
    }

    const updateTimer = () => {
      if (timedMechanicPauseStartRef.current !== null) {
        return;
      }
      const remaining = Math.max(0, gameState.timedDecryptEndTime - Date.now());
      setTimedDecryptRemaining(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 100);

    return () => clearInterval(interval);
  }, [
    gameState.timedDecryptActive,
    gameState.timedDecryptEndTime,
    pauseTimedMechanics,
    setTimedDecryptRemaining,
    timedMechanicPauseStartRef,
    timedMechanicResumeAdjustmentRef,
  ]);

  // Pause timed mechanics while blocking overlays/popups are open.
  useEffect(() => {
    if (!gameState.timedDecryptActive && !gameState.countdownActive) {
      timedMechanicPauseStartRef.current = null;
      timedMechanicResumeAdjustmentRef.current = 0;
      return;
    }

    if (pauseTimedMechanics) {
      if (timedMechanicPauseStartRef.current === null) {
        timedMechanicPauseStartRef.current = Date.now();
      }
      return;
    }

    if (timedMechanicPauseStartRef.current === null) {
      return;
    }

    const pauseDuration = Date.now() - timedMechanicPauseStartRef.current;
    timedMechanicPauseStartRef.current = null;
    timedMechanicResumeAdjustmentRef.current = 0;

    if (pauseDuration <= 0) {
      timedMechanicResumeAdjustmentRef.current = 0;
      return;
    }

    setGameState(prev => {
      let nextState = prev;

      if (prev.timedDecryptActive && prev.timedDecryptEndTime) {
        nextState = {
          ...nextState,
          timedDecryptEndTime: prev.timedDecryptEndTime + pauseDuration,
        };
      }

      if (prev.countdownActive && prev.countdownEndTime) {
        nextState = {
          ...nextState,
          countdownEndTime: prev.countdownEndTime + pauseDuration,
        };
      }

      return nextState;
    });
  }, [
    gameState.countdownActive,
    gameState.timedDecryptActive,
    pauseTimedMechanics,
    setGameState,
    timedMechanicPauseStartRef,
    timedMechanicResumeAdjustmentRef,
  ]);

  // Scroll behavior: during streaming scroll to bottom, after streaming scroll to content start
  useEffect(() => {
    if (outputRef.current) {
      if (isStreaming) {
        // During streaming, follow the output to bottom
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      } else if (streamStartScrollPos.current !== null) {
        // Streaming just completed - scroll back to where content started
        if (typeof outputRef.current.scrollTo === 'function') {
          outputRef.current.scrollTo({
            top: streamStartScrollPos.current,
            behavior: 'smooth',
          });
        } else {
          outputRef.current.scrollTop = streamStartScrollPos.current;
        }
        streamStartScrollPos.current = null;
      } else {
        // Normal operation - scroll to bottom
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    }
    // Restore focus after history update (prevents focus loss after commands)
    if (shouldRestoreFocus) {
      setTimeout(() => focusTerminalInput(), 0);
    }
  }, [
    gameState.history,
    isStreaming,
    gamePhase,
    shouldRestoreFocus,
    focusTerminalInput,
    outputRef,
    streamStartScrollPos,
  ]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  // Restore focus after overlays close or mode changes
  useLayoutEffect(() => {
    if (!shouldRestoreFocus) return;
    const timeout = window.setTimeout(() => {
      focusTerminalTarget();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [shouldRestoreFocus, isEnterOnlyMode, focusTerminalTarget]);

  // Cleanup typing speed warning timeout on unmount
  useEffect(() => {
    const warningTimeout = typingSpeedWarningTimeout.current;
    return () => {
      if (warningTimeout) {
        clearTimeout(warningTimeout);
      }
    };
  }, [typingSpeedWarningTimeout]);

  // CRT warm-up effect timeout
  useEffect(() => {
    if (isWarmingUp) {
      const timer = setTimeout(() => setIsWarmingUp(false), CRT_WARMUP_DURATION_MS);
      return () => clearTimeout(timer);
    }
  }, [isWarmingUp, setIsWarmingUp]);

  // Show trackers if tutorial already complete (loaded game)
  useEffect(() => {
    if (gameState.tutorialComplete) {
      setShowEvidenceTracker(true);
      setShowRiskTracker(true);
      setShowAttBar(true);
      setShowAvatar(true);
    }
  }, [
    gameState.tutorialComplete,
    setShowEvidenceTracker,
    setShowRiskTracker,
    setShowAttBar,
    setShowAvatar,
  ]);

  // Avatar entrance is now triggered by INTRO block 1 in useTerminalInput

  // Auto-save periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const currentState = gameStateRef.current;
      const isActivePlayPhase = gamePhase === 'terminal';
      // Do not autosave during blackout / victory transition: gamePhase isn't persisted
      // and saving a terminal state with evidencesSaved=true would lose the ending on reload.
      if (
        isActivePlayPhase &&
        !currentState.isGameOver &&
        !currentState.gameWon &&
        !currentState.evidencesSaved
      ) {
        const savedAt = autoSave(currentState);
        if (typeof savedAt === 'number') {
          setGameState(prev => ({ ...prev, lastSaveTime: savedAt }));
        }
        // Track playtime every autosave interval
        addPlaytime(AUTOSAVE_INTERVAL_MS);
      }
    }, AUTOSAVE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [gamePhase, gameStateRef, setGameState]);

  // Phase transition: when evidencesSaved becomes true, trigger blackout
  // Victory takes priority over isGameOver: if detection hit 100% on the same command,
  // we still want to show the victory sequence rather than stall in 'terminal'.
  useEffect(() => {
    if (gameState.evidencesSaved && gamePhase === 'terminal') {
      const timer = setTimeout(() => {
        setGamePhase('blackout');
      }, BLACKOUT_TRANSITION_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [gameState.evidencesSaved, gamePhase, setGamePhase]);

  // "They're watching" paranoia messages
  useEffect(() => {
    if (gamePhase !== 'terminal' || gameState.isGameOver) return;

    // Suppress paranoia during atmosphere phase (no pressure systems)
    if (suppressPressure) return;
    if (pauseTimedMechanics) {
      setParanoiaMessage(null);
      return;
    }

    const detection = gameState.detectionLevel;
    const paranoiaBoost = gameState.paranoiaLevel || 0;
    // Only trigger paranoia at elevated detection (30%+) or paranoia spike
    if (detection < 30 && paranoiaBoost < 10) return;

    // Higher detection/paranoia = more frequent paranoia
    const baseInterval =
      PARANOIA_TIMING.BASE_INTERVAL_MS -
      detection * PARANOIA_TIMING.DETECTION_DIVISOR -
      paranoiaBoost * 200;

    const delay =
      Math.max(PARANOIA_TIMING.MIN_INTERVAL_MS, baseInterval) +
      uiRandom() * PARANOIA_TIMING.VARIANCE_MS;
    let innerTimerId: NodeJS.Timeout | undefined;

    const timerId = setTimeout(() => {
      const message = uiRandomPick(PARANOIA_MESSAGES);
      // Ensure position stays within viewport bounds
      const maxTop = Math.max(100, window.innerHeight - 100);
      const maxLeft = Math.max(50, window.innerWidth - 350);
      const top = 100 + uiRandom() * Math.max(0, maxTop - 100);
      const left = 50 + uiRandom() * Math.max(0, maxLeft - 50);

      setParanoiaPosition({ top, left });
      setParanoiaMessage(t(message.key, undefined, message.fallback));
      playSound('warning');

      // Clear after animation
      innerTimerId = setTimeout(
        () => setParanoiaMessage(null),
        PARANOIA_TIMING.DISPLAY_DURATION_MS
      );
    }, delay);

    return () => {
      clearTimeout(timerId);
      if (innerTimerId) clearTimeout(innerTimerId);
    };
  }, [
    gameState.detectionLevel,
    gameState.paranoiaLevel,
    gameState.isGameOver,
    gamePhase,
    playSound,
    setParanoiaMessage,
    setParanoiaPosition,
    pauseTimedMechanics,
    suppressPressure,
    t,
  ]);

  // Track detection level changes for sound/visual alerts AND Turing test trigger
  useEffect(() => {
    const prev = prevDetectionRef.current;
    const current = gameState.detectionLevel;

    // Track max detection ever reached
    if (current > maxDetectionRef.current) {
      maxDetectionRef.current = current;
    }

    if (current > prev) {
      // Detection increased - trigger pulse animation
      setRiskPulse(true);
      setTimeout(() => setRiskPulse(false), RISK_PULSE_DURATION_MS);

      if (current >= 80 && prev < 80) {
        playSound('alert');
      } else if (current >= 60 && prev < 60) {
        playSound('warning');
      } else if (current >= 50 && prev < 50) {
        playSound('warning');
      } else if (current >= 40 && prev < 40) {
        playSound('warning');
      }

      // Trigger screen shake on large detection increase (10+)
      if (current - prev >= 10) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 300);
      }

      // Check if Turing test should trigger (detection crossed 50% threshold)
      // This catches cases where detection increases from any source (including firewall eyes)
      const crossedTuringThreshold =
        prev < DETECTION_THRESHOLDS.TURING_TRIGGER &&
        current >= DETECTION_THRESHOLDS.TURING_TRIGGER;

      if (
        crossedTuringThreshold &&
        gameState.tutorialComplete &&
        !gameState.turingEvaluationActive &&
        !gameState.turingEvaluationCompleted &&
        !gameState.singularEventsTriggered?.has('turing_evaluation') &&
        !showTuringTest &&
        gamePhase === 'terminal'
      ) {
        // Mark as triggered and show the overlay
        setGameState(prevState => ({
          ...prevState,
          turingEvaluationActive: true,
          singularEventsTriggered: new Set([
            ...(prevState.singularEventsTriggered || []),
            'turing_evaluation',
          ]),
          history: appendToHistory(
            prevState.history,
            createEntry('system', ''),
            createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
            createEntryI18n(
              'warning',
              'engine.commands.helpers.security_protocol_turing_evaluation_initiated',
              '        SECURITY PROTOCOL: TURING EVALUATION INITIATED'
            ),
            createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
            createEntry('system', ''),
          ),
        }));

        // Trigger flicker and show Turing test overlay after delay
        if (turingOverlayTimeoutRef.current !== null) {
          window.clearTimeout(turingOverlayTimeoutRef.current);
        }
        turingOverlayTimeoutRef.current = window.setTimeout(() => {
          turingOverlayTimeoutRef.current = null;
          const currentUi = uiStateRef.current;
          const latestState = gameStateRef.current;
          if (
            currentUi.gamePhase !== 'terminal' ||
            currentUi.showGameOver ||
            currentUi.showTuringTest ||
            currentUi.activeImage ||
            currentUi.pendingImage ||
            currentUi.hasBlockingPopup ||
            latestState.isGameOver ||
            latestState.gameWon ||
            !latestState.turingEvaluationActive
          ) {
            return;
          }
          setShowTuringTest(true);
        }, 1500);
      }
    }

    prevDetectionRef.current = current;
  }, [
    gameState.detectionLevel,
    gameState.tutorialComplete,
    gameState.turingEvaluationActive,
    gameState.turingEvaluationCompleted,
    gameState.singularEventsTriggered,
    gamePhase,
    showTuringTest,
    playSound,
    setIsShaking,
    setRiskPulse,
    setGameState,
    setShowTuringTest,
    gameStateRef,
    maxDetectionRef,
    prevDetectionRef,
    turingOverlayTimeoutRef,
    uiStateRef,
  ]);

  useEffect(() => {
    return () => {
      if (turingOverlayTimeoutRef.current !== null) {
        window.clearTimeout(turingOverlayTimeoutRef.current);
      }
    };
  }, [turingOverlayTimeoutRef]);

  // Start ambient sound when tutorial completes
  // Note: We DON'T stop ambient during Turing test - TuringTestOverlay accelerates the music to 1.5x
  useEffect(() => {
    if (!gameState.tutorialComplete || !soundEnabled) {
      stopAmbient();
      return;
    }
    startAmbient();
    return () => stopAmbient();
  }, [gameState.tutorialComplete, soundEnabled, startAmbient, stopAmbient]);

  // Update ambient tension and music track based on detection level
  useEffect(() => {
    if (gameState.tutorialComplete && soundEnabled) {
      updateAmbientTension(gameState.detectionLevel);
      updateMusicForRisk(gameState.detectionLevel);
    }
  }, [gameState.detectionLevel, gameState.tutorialComplete, soundEnabled, updateAmbientTension, updateMusicForRisk]);

  // Countdown timer logic
  useEffect(() => {
    if (!gameState.countdownActive || gamePhase !== 'terminal') {
      setCountdownDisplay(null);
      return;
    }

    if (pauseTimedMechanics || timedMechanicPauseStartRef.current !== null) {
      return;
    }

    const updateCountdown = () => {
      if (timedMechanicPauseStartRef.current !== null) {
        return;
      }
      const remaining = Math.max(0, gameState.countdownEndTime - Date.now());
      const seconds = Math.ceil(remaining / 1000);

      if (seconds <= 0) {
        // Countdown expired - trigger bad ending (caught by system)
        setGamePhase('bad_ending');
        setGameState(prev => ({
          ...prev,
          isGameOver: true,
          gameOverReason: 'TRACE WINDOW EXPIRED',
          endingType: 'bad',
        }));
        setCountdownDisplay(null);
        return;
      }

      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      setCountdownDisplay(`${minutes}:${secs.toString().padStart(2, '0')}`);

      // Warning sounds at thresholds
      if (seconds === 30 || seconds === 10 || seconds <= 5) {
        playSound('alert');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [
    gameState.countdownActive,
    gameState.countdownEndTime,
    gamePhase,
    pauseTimedMechanics,
    playSound,
    setCountdownDisplay,
    setGamePhase,
    setGameState,
    timedMechanicPauseStartRef,
    timedMechanicResumeAdjustmentRef,
  ]);

  // Keep gameState ref updated
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState, gameStateRef]);

  // Track scroll activity to avoid interrupting reading
  useEffect(() => {
    const outputEl = outputRef.current;
    if (!outputEl) return;

    const handleScroll = () => {
      lastScrollTimeRef.current = Date.now();
    };

    outputEl.addEventListener('scroll', handleScroll);
    return () => outputEl.removeEventListener('scroll', handleScroll);
  }, [outputRef, lastScrollTimeRef]);

  const idleHints = useMemo(
    (): Array<LocalizedTerminalCopy & { condition: (s: GameState) => boolean }> => [
      {
        key: 'terminal.idleHint.1',
        fallback: "Use 'ls' to see what's in the current directory.",
        condition: (s: GameState) => (s.filesRead?.size || 0) === 0,
      },
      {
        key: 'terminal.idleHint.2',
        fallback: "Try 'open' on a .txt file to read it.",
        condition: (s: GameState) => (s.filesRead?.size || 0) === 0,
      },
      {
        key: 'terminal.idleHint.3',
        fallback: "Navigation tip: 'cd' changes directories. Start exploring.",
        condition: (s: GameState) => (s.filesRead?.size || 0) === 0,
      },
      {
        key: 'terminal.idleHint.4',
        fallback: 'You need evidence. Look for files that seem... off.',
        condition: (s: GameState) =>
          (s.evidenceCount || 0) === 0 && (s.filesRead?.size || 0) >= 3,
      },
      {
        key: 'terminal.idleHint.5',
        fallback: 'Some documents contradict the official narrative. Find them.',
        condition: (s: GameState) =>
          (s.evidenceCount || 0) === 0 && (s.filesRead?.size || 0) >= 5,
      },
      {
        key: 'terminal.idleHint.6',
        fallback: 'Have you checked /internal?',
        condition: (s: GameState) =>
          s.currentPath === '/' && !s.filesRead?.has('/internal/protocols/session_objectives.txt'),
      },
      {
        key: 'terminal.idleHint.7',
        fallback: 'The /comms directory might have useful intel.',
        condition: (s: GameState) =>
          !s.currentPath.includes('comms') && !s.filesRead?.has('/comms/radio_intercept_log.txt'),
      },
      {
        key: 'terminal.idleHint.8',
        fallback: "Detection is high. The 'wait' command lets time pass safely.",
        condition: (s: GameState) => s.detectionLevel > DETECTION_THRESHOLDS.HOSTILITY_MED,
      },
      {
        key: 'terminal.idleHint.9',
        fallback: "They're watching closely. Consider using 'wait' to reduce suspicion.",
        condition: (s: GameState) => s.detectionLevel > DETECTION_THRESHOLDS.ALERT,
      },
      {
        key: 'terminal.idleHint.10',
        fallback: "CAUTION: Detection critical. 'wait' might buy you time.",
        condition: (s: GameState) => s.detectionLevel > DETECTION_THRESHOLDS.HEAVY_GLITCH,
      },
      {
        key: 'terminal.idleHint.11',
        fallback: "You've seen a lot. There may be... deeper access available.",
        condition: (s: GameState) => (s.filesRead?.size || 0) >= 10 && !s.flags?.adminUnlocked,
      },
      {
        key: 'terminal.idleHint.12',
        fallback: "Some commands aren't listed. Keep digging.",
        condition: (s: GameState) => (s.filesRead?.size || 0) >= 15 && !s.flags?.adminUnlocked,
      },
      {
        key: 'terminal.idleHint.13',
        fallback: "Use 'ls' to see what's in the current directory.",
        condition: (s: GameState) => s.sessionCommandCount < 5,
      },
      {
        key: 'terminal.idleHint.14',
        fallback: 'Some files still carry legacy encryption headers, but recovered text opens directly.',
        condition: (s: GameState) =>
          (s.categoriesRead?.size || 0) >= 2 && (s.evidenceCount || 0) < 2,
      },
      {
        key: 'terminal.idleHint.15',
        fallback: "Try the 'progress' command to see what you've found.",
        condition: (s: GameState) => (s.evidenceCount || 0) >= 1,
      },
      {
        key: 'terminal.idleHint.16',
        fallback: "Don't forget: 'note' saves reminders, 'bookmark' saves files.",
        condition: (s: GameState) =>
          (s.filesRead?.size || 0) >= 5 && (s.playerNotes?.length || 0) === 0,
      },
      {
        key: 'terminal.idleHint.17',
        fallback: "Check 'unread' to see what you haven't opened yet.",
        condition: (s: GameState) => (s.filesRead?.size || 0) >= 3,
      },
    ],
    []
  );

  const lastHistoryEntryType = gameState.history[gameState.history.length - 1]?.type;

  useEffect(() => {
    if (gamePhase !== 'terminal' || gameState.isGameOver || gameState.tutorialStep >= 0) return;

    // Reset timer on any activity (history length change indicates command executed)
    if (idleHintTimerRef.current) {
      clearTimeout(idleHintTimerRef.current);
    }

    // Don't restart timer if the last entry was from UFO74 (prevents stacking idle messages)
    if (lastHistoryEntryType === 'ufo74') return;

    // Set new idle timer (2 minutes)
    idleHintTimerRef.current = setTimeout(() => {
      // Skip if user scrolled recently (within last 30 seconds - they're reading)
      const timeSinceScroll = Date.now() - lastScrollTimeRef.current;
      if (timeSinceScroll < 30000) return;

      const currentState = gameStateRef.current;
      const hintsGiven = currentState.idleHintsGiven || 0;
      if (hintsGiven >= 5) return; // Max 5 idle hints per session

      // Skip if wandering notices have recently been given (avoid double-up)
      const wanderingCount = currentState.wanderingNoticeCount || 0;
      if (wanderingCount > 0) return;

      // Find an applicable hint
      const applicableHints = idleHints.filter(h => h.condition(currentState));
      if (applicableHints.length === 0) return;

      const hint = uiRandomPick(applicableHints);

      // Add UFO74 hint to terminal
      const hintEntry = createEntry(
        'ufo74',
        `[UFO74]: ${t(hint.key, undefined, hint.fallback)}`
      );
      setGameState(prev => ({
        ...prev,
        history: appendToHistory(prev.history, hintEntry),
        idleHintsGiven: (prev.idleHintsGiven || 0) + 1,
        lastActivityTime: Date.now(),
      }));

      playSound('message');
    }, 120000); // 2 minutes

    return () => {
      if (idleHintTimerRef.current) {
        clearTimeout(idleHintTimerRef.current);
      }
    };
  }, [
    gameState.lastActivityTime,
    gamePhase,
    gameState.isGameOver,
    gameState.tutorialStep,
    idleHints,
    playSound,
    setGameState,
    gameStateRef,
    idleHintTimerRef,
    lastHistoryEntryType,
    lastScrollTimeRef,
    t,
  ]);

  // Handle skip streaming (spacebar/enter during streaming)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isStreaming && (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape')) {
        e.preventDefault();
        skipStreamingRef.current = true;
      }
    };

    if (isStreaming) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isStreaming, skipStreamingRef]);

  // Random horizontal interference bursts (every 20-40 seconds)
  useEffect(() => {
    if (gamePhase !== 'terminal' || gameState.isGameOver) return;
    if (suppressPressure) return;

    const scheduleNextBurst = () => {
      // Random interval between 20-40 seconds
      const delay = 20000 + uiRandom() * 20000;
      return setTimeout(() => {
        if (pauseTimedMechanics) return;
        // Pick a random vertical position for the interference line
        const top = Math.floor(uiRandom() * 100);
        setInterferenceBurst({ top });
        // Clear after the animation duration (120ms)
        setTimeout(() => setInterferenceBurst(null), 150);
      }, delay);
    };

    const timerId = scheduleNextBurst();
    // Reschedule periodically
    const interval = setInterval(() => {
      const delay = 20000 + uiRandom() * 20000;
      setTimeout(() => {
        if (pauseTimedMechanics) return;
        const top = Math.floor(uiRandom() * 100);
        setInterferenceBurst({ top });
        setTimeout(() => setInterferenceBurst(null), 150);
      }, delay);
    }, 30000); // Check roughly every 30s

    return () => {
      clearTimeout(timerId);
      clearInterval(interval);
    };
  }, [
    gamePhase,
    gameState.isGameOver,
    pauseTimedMechanics,
    suppressPressure,
    setInterferenceBurst,
  ]);

  // Terminal noise intensity — continuous 0-1 ramp from 70% to 100% detection
  useEffect(() => {
    const detection = gameState.detectionLevel;
    const intensity =
      detection < 70 ? 0 : Math.min(1, 0.08 + ((detection - 70) / 30) * 0.92);
    setTerminalStaticLevel(intensity);
  }, [gameState.detectionLevel, setTerminalStaticLevel]);

  // Alien silhouette in static (appears every 30 seconds while high-risk static is active)
  const isHighRiskStatic = gameState.detectionLevel >= 70;
  useEffect(() => {
    const staticActive = isHighRiskStatic;
    const previewRemaining = Math.max(0, (gameState.alienPreviewUntil ?? 0) - Date.now());
    if (gamePhase !== 'terminal' || gameState.isGameOver) return;
    if (!staticActive && previewRemaining <= 0) {
      setAlienSilhouetteVisible(false);
      return;
    }

    let cancelled = false;
    const activeTimeouts: NodeJS.Timeout[] = [];

    const startManifestation = (durationMs?: number) => {
      if (cancelled || pauseTimedMechanics) return;
      setAlienSilhouetteVisible(true);
      playSound('static');
      const omenTimeout = setTimeout(() => {
        if (!cancelled) playSound('omen');
      }, 1500);
      activeTimeouts.push(omenTimeout);

      const hideDelay = durationMs ?? 5000 + uiRandom() * 3000;
      const hideTimeout = setTimeout(() => {
        if (!cancelled) {
          setAlienSilhouetteVisible(false);
        }
      }, hideDelay);
      activeTimeouts.push(hideTimeout);
      return hideDelay;
    };

    const scheduleAlien = (delayOverride?: number) => {
      const delay = delayOverride ?? ALIEN_MANIFESTATION_INTERVAL_MS;
      const t = setTimeout(() => {
        if (cancelled) return;
        if (pauseTimedMechanics) {
          scheduleAlien(5000);
          return;
        }

        const hideDelay = startManifestation();
        if (hideDelay !== undefined && !cancelled) {
          scheduleAlien(ALIEN_MANIFESTATION_INTERVAL_MS);
        }
      }, delay);
      activeTimeouts.push(t);
    };

    if (previewRemaining > 0) {
      startManifestation(previewRemaining);
      if (staticActive) {
        scheduleAlien(ALIEN_MANIFESTATION_INTERVAL_MS);
      }
    } else if (staticActive) {
      scheduleAlien();
    }

    return () => {
      cancelled = true;
      activeTimeouts.forEach(t => clearTimeout(t));
    };
  }, [
    gamePhase,
    gameState.isGameOver,
    isHighRiskStatic,
    gameState.alienPreviewUntil,
    pauseTimedMechanics,
    playSound,
    setAlienSilhouetteVisible,
  ]);

  // Handle ESC key for pause menu
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isStreaming && gamePhase === 'terminal' && !gameState.isGameOver) {
        e.preventDefault();
        // Close any open modals first, otherwise toggle pause menu
        if (showSettings || showAchievements || showStatistics) {
          setShowSettings(false);
          setShowAchievements(false);
          setShowStatistics(false);
        } else if (activeImage) {
          setActiveImage(null);
        } else if (showPauseMenu) {
          setShowPauseMenu(false);
          setShowHeaderMenu(false);
        } else {
          if (timedMechanicPauseStartRef.current === null) {
            timedMechanicPauseStartRef.current = Date.now();
          }
          setShowPauseMenu(true);
          setShowHeaderMenu(false);
        }
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [
    isStreaming,
    gamePhase,
    gameState.isGameOver,
    showSettings,
    showAchievements,
    showStatistics,
    activeImage,
    showPauseMenu,
    setShowSettings,
    setShowAchievements,
    setShowStatistics,
    setActiveImage,
    setShowPauseMenu,
    setShowHeaderMenu,
    timedMechanicPauseStartRef,
  ]);  // Handle Enter key in enter-only mode (tutorial intro, encrypted channel, pending media)
  // This is needed because the hidden form button approach is unreliable across browsers
  useLayoutEffect(() => {
    if (!isEnterOnlyMode || !onEnterPress) return;
    if (isStreaming || isProcessing || showTuringTest || gameState.isGameOver) return;
    if (showSettings || showAchievements || showStatistics || showPauseMenu) return;
    if (gamePhase !== 'terminal') return;

    const handleEnterKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onEnterPress();
      }
    };

    window.addEventListener('keydown', handleEnterKey);
    return () => window.removeEventListener('keydown', handleEnterKey);
  }, [
    isEnterOnlyMode,
    isStreaming,
    isProcessing,
    showTuringTest,
    gameState.isGameOver,
    showSettings,
    showAchievements,
    showStatistics,
    showPauseMenu,
    gamePhase,
    onEnterPress,
  ]);

  return { focusTerminalInput };
}
