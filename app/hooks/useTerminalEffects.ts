'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { TutorialStateID, type GamePhase, type GameState, type ImageTrigger, type VideoTrigger } from '../types';
import { createEntry } from '../engine/commands';
import { autoSave } from '../storage/saves';
import { addPlaytime } from '../storage/statistics';
import { DETECTION_THRESHOLDS } from '../constants/detection';
import { AUTOSAVE_INTERVAL_MS } from '../constants/timing';
import {
  BLACKOUT_TRANSITION_DELAY_MS,
  CRT_WARMUP_DURATION_MS,
  GLITCH_DURATIONS,
  GLITCH_TIMING,
  PARANOIA_TIMING,
  RISK_PULSE_DURATION_MS,
} from '../constants/timing';
import { uiRandom, uiRandomPick, uiChance } from '../engine/rng';
import { initVoices } from '../components/FirewallEyes';
import type { SoundType } from './useSound';

// "They're watching" paranoia messages
const PARANOIA_MESSAGES = [
  'TRACE DETECTED: External observer connected',
  'WARNING: Packet inspection in progress',
  'NOTICE: Session being monitored',
  'ALERT: Unauthorized access attempt logged',
  'SYSTEM: Someone else is in the system',
  'ANOMALY: Data exfiltration detected',
  'CAUTION: Your keystrokes are being recorded',
  'INFO: Connection routed through unknown node',
  'WARNING: Firewall breach attempt detected',
  'NOTICE: Session flagged for review',
  'ALERT: Third-party listener identified',
  'SYSTEM: Memory dump in progress',
  'TRACE: Unknown process accessing your session',
  'NOTICE: Query patterns being analyzed',
  'WARNING: Session duration exceeds normal parameters',
  'SYSTEM: Behavioral profile update in progress',
  'ALERT: File access sequence flagged as anomalous',
  'CAUTION: Terminal output being mirrored',
  'INFO: Your IP has been logged for review',
  'NOTICE: Command history archived to external server',
  'WARNING: They know where you are',
  'ALERT: Physical location triangulated',
  'SYSTEM: Dispatch notification pending',
  'NOTICE: Someone just accessed your personnel file',
  'CAUTION: Your screen is being watched',
  'WARNING: Audio capture device detected',
  'ALERT: Camera feed request intercepted',
  'SYSTEM: Facial recognition scan initiated',
  'SIGNAL: ...they remember you from before...',
  'TRACE: Pattern matches previous intruder',
  'NOTICE: The watchers have been notified',
  'ALERT: You were expected',
  'SYSTEM: Countermeasures initializing',
  'WARNING: Too late to disconnect cleanly',
  'CAUTION: Your curiosity has been noted',
  'INFO: This session will be... remembered',
];

interface TerminalEffectsRefs {
  outputRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  enterOnlyButtonRef: React.RefObject<HTMLButtonElement | null>;
  gameStateRef: React.MutableRefObject<GameState>;
  streamStartScrollPos: React.MutableRefObject<number | null>;
  typingSpeedWarningTimeout: React.MutableRefObject<NodeJS.Timeout | null>;
  idleHintTimerRef: React.MutableRefObject<NodeJS.Timeout | null>;
  lastScrollTimeRef: React.MutableRefObject<number>;
  firewallPauseStartRef: React.MutableRefObject<number | null>;
  maxDetectionRef: React.MutableRefObject<number>;
  prevDetectionRef: React.MutableRefObject<number>;
  skipStreamingRef: React.MutableRefObject<boolean>;
}

interface UseTerminalEffectsOptions {
  gameState: GameState;
  gamePhase: GamePhase;
  isStreaming: boolean;
  isProcessing: boolean;
  isWarmingUp: boolean;
  showTuringTest: boolean;
  activeImage: ImageTrigger | null;
  activeVideo: VideoTrigger | null;
  showSettings: boolean;
  showAchievements: boolean;
  showStatistics: boolean;
  showPauseMenu: boolean;
  showHeaderMenu: boolean;
  isEnterOnlyMode: boolean;
  isFirewallPaused: boolean;
  suppressPressure: boolean;
  soundEnabled: boolean;
  onEnterPress?: () => void;
  playSound: (sound: SoundType) => void;
  startAmbient: () => void;
  stopAmbient: () => void;
  updateAmbientTension: (level: number) => void;
  setTimedDecryptRemaining: React.Dispatch<React.SetStateAction<number>>;
  setIsWarmingUp: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEvidenceTracker: React.Dispatch<React.SetStateAction<boolean>>;
  setShowRiskTracker: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAttBar: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAvatar: React.Dispatch<React.SetStateAction<boolean>>;
  setAvatarCreepyEntrance: React.Dispatch<React.SetStateAction<boolean>>;
  setGamePhase: React.Dispatch<React.SetStateAction<GamePhase>>;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  setGlitchActive: React.Dispatch<React.SetStateAction<boolean>>;
  setGlitchHeavy: React.Dispatch<React.SetStateAction<boolean>>;
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
  setActiveImage: React.Dispatch<React.SetStateAction<ImageTrigger | null>>;
  setActiveVideo: React.Dispatch<React.SetStateAction<VideoTrigger | null>>;
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
  activeVideo,
  showSettings,
  showAchievements,
  showStatistics,
  showPauseMenu,
  showHeaderMenu,
  isEnterOnlyMode,
  isFirewallPaused,
  suppressPressure,
  soundEnabled,
  onEnterPress,
  playSound,
  startAmbient,
  stopAmbient,
  updateAmbientTension,
  setTimedDecryptRemaining,
  setIsWarmingUp,
  setShowEvidenceTracker,
  setShowRiskTracker,
  setShowAttBar,
  setShowAvatar,
  setAvatarCreepyEntrance,
  setGamePhase,
  setGameState,
  setGlitchActive,
  setGlitchHeavy,
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
  setActiveImage,
  setActiveVideo,
  refs,
}: UseTerminalEffectsOptions) {
  const {
    outputRef,
    inputRef,
    enterOnlyButtonRef,
    gameStateRef,
    streamStartScrollPos,
    typingSpeedWarningTimeout,
    idleHintTimerRef,
    lastScrollTimeRef,
    firewallPauseStartRef,
    maxDetectionRef,
    prevDetectionRef,
    skipStreamingRef,
  } = refs;

  const shouldRestoreFocus =
    gamePhase === 'terminal' &&
    !gameState.isGameOver &&
    !isProcessing &&
    !isStreaming &&
    !showTuringTest &&
    !activeImage &&
    !activeVideo &&
    !showSettings &&
    !showAchievements &&
    !showStatistics &&
    !showPauseMenu &&
    !showHeaderMenu;

  const focusTerminalTarget = useCallback(() => {
    const target = inputRef.current ?? enterOnlyButtonRef.current;
    if (!target) return;
    if (document.activeElement === target) return;
    target.focus();
  }, [enterOnlyButtonRef, inputRef]);

  const focusTerminalInput = useCallback(() => {
    if (!shouldRestoreFocus) return;
    focusTerminalTarget();
  }, [focusTerminalTarget, shouldRestoreFocus]);

  // Apply CRT preference on mount
  useEffect(() => {
    try {
      const crtEnabled = localStorage.getItem('varginha_crt_enabled');
      if (crtEnabled === 'false') {
        document.body.classList.add('no-crt');
      }
    } catch {
      // localStorage not available (SSR or test environment)
    }

    // Initialize voice synthesis early so voices are ready when needed
    initVoices();

    return () => {
      try {
        document.body.classList.remove('no-crt');
      } catch {
        // document not available
      }
    };
  }, []);

  // Update timed decryption countdown
  useEffect(() => {
    if (!gameState.timedDecryptActive || !gameState.timedDecryptEndTime) {
      setTimedDecryptRemaining(0);
      return;
    }

    const updateTimer = () => {
      const remaining = Math.max(0, gameState.timedDecryptEndTime - Date.now());
      setTimedDecryptRemaining(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 100);

    return () => clearInterval(interval);
  }, [gameState.timedDecryptActive, gameState.timedDecryptEndTime, setTimedDecryptRemaining]);

  // Scroll behavior: during streaming scroll to bottom, after streaming scroll to content start
  useEffect(() => {
    if (outputRef.current) {
      if (isStreaming) {
        // During streaming, follow the output to bottom
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      } else if (streamStartScrollPos.current !== null) {
        // Streaming just completed - scroll back to where content started
        outputRef.current.scrollTo({
          top: streamStartScrollPos.current,
          behavior: 'smooth',
        });
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
  useEffect(() => {
    if (!shouldRestoreFocus) return;
    const timeout = window.setTimeout(() => {
      focusTerminalTarget();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [shouldRestoreFocus, isEnterOnlyMode, focusTerminalTarget]);

  // Cleanup typing speed warning timeout on unmount
  useEffect(() => {
    return () => {
      if (typingSpeedWarningTimeout.current) {
        clearTimeout(typingSpeedWarningTimeout.current);
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
  }, [gameState.tutorialComplete, setShowEvidenceTracker, setShowRiskTracker, setShowAttBar, setShowAvatar]);

  // Creepy avatar entrance when the tutorial first shows the "hackerkid" user creation
  useEffect(() => {
    const tutState = gameState.interactiveTutorialState;
    if (
      tutState &&
      tutState.current === TutorialStateID.LS_PROMPT &&
      !gameState.tutorialComplete
    ) {
      // Delay so the player reads the INTRO text first
      const timer = setTimeout(() => {
        setAvatarCreepyEntrance(true);
        setShowAvatar(true);
        // Clear entrance flag after animation completes
        setTimeout(() => setAvatarCreepyEntrance(false), 3000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []); // Only on mount — fresh game start

  // Auto-save periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const currentState = gameStateRef.current;
      if (!currentState.isGameOver) {
        autoSave(currentState);
        // Track playtime every autosave interval
        addPlaytime(AUTOSAVE_INTERVAL_MS);
      }
    }, AUTOSAVE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  // Phase transition: when evidencesSaved becomes true, trigger blackout
  useEffect(() => {
    if (gameState.evidencesSaved && gamePhase === 'terminal') {
      const timer = setTimeout(() => {
        setGamePhase('blackout');
      }, BLACKOUT_TRANSITION_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [gameState.evidencesSaved, gamePhase, setGamePhase]);

  // Random glitch effects based on detection level - INTENSITY SCALING
  useEffect(() => {
    if (gamePhase !== 'terminal' || gameState.isGameOver) return;

    // Suppress glitches during atmosphere phase (no pressure systems)
    if (suppressPressure) return;

    const detection = gameState.detectionLevel;
    const paranoiaBoost = gameState.paranoiaLevel || 0;
    // Higher detection = more frequent AND more intense glitches
    // Scaled intensity: at 20%: rare light, at 50%: occasional medium, at 80%+: frequent heavy
    const glitchChance =
      detection > 20 ? (detection - 20) * 0.35 + paranoiaBoost * 0.15 : paranoiaBoost * 0.15;

    // Check interval scales with detection (faster at higher levels)
    const checkInterval = Math.max(
      GLITCH_TIMING.MIN_INTERVAL_MS,
      GLITCH_TIMING.BASE_INTERVAL_MS -
        detection * GLITCH_TIMING.DETECTION_FACTOR -
        paranoiaBoost * GLITCH_TIMING.VARIANCE_FACTOR
    );

    // Track all active timeouts for cleanup and cancelled flag for nested callbacks
    const activeTimeouts: NodeJS.Timeout[] = [];
    let cancelled = false;

    const interval = setInterval(() => {
      if (cancelled) return;
      if (uiRandom() * 100 < glitchChance) {
        if (detection >= 80) {
          // Critical glitch - screen shake, heavy effects, sound
          setGlitchHeavy(true);
          playSound('glitch');
          playSound('static');
          const t1 = setTimeout(() => {
            if (cancelled) return;
            setGlitchHeavy(false);
            // Double glitch at very high detection
            if (detection >= 90 && uiChance(0.5)) {
              const t2 = setTimeout(() => {
                if (cancelled) return;
                setGlitchHeavy(true);
                playSound('glitch');
                const t3 = setTimeout(() => {
                  if (cancelled) return;
                  setGlitchHeavy(false);
                }, GLITCH_DURATIONS.MEDIUM);
                activeTimeouts.push(t3);
              }, GLITCH_DURATIONS.LIGHT);
              activeTimeouts.push(t2);
            }
          }, GLITCH_DURATIONS.CRITICAL);
          activeTimeouts.push(t1);
        } else if (detection >= 60) {
          // Heavy glitch at high detection
          setGlitchHeavy(true);
          playSound('glitch');
          const t = setTimeout(() => {
            if (cancelled) return;
            setGlitchHeavy(false);
          }, GLITCH_DURATIONS.HEAVY);
          activeTimeouts.push(t);
        } else if (detection >= 40) {
          // Medium glitch - longer duration
          setGlitchActive(true);
          playSound('static');
          const t = setTimeout(() => {
            if (cancelled) return;
            setGlitchActive(false);
          }, GLITCH_DURATIONS.MEDIUM + 100);
          activeTimeouts.push(t);
        } else {
          // Light glitch
          setGlitchActive(true);
          playSound('static');
          const t = setTimeout(() => {
            if (cancelled) return;
            setGlitchActive(false);
          }, GLITCH_DURATIONS.LIGHT);
          activeTimeouts.push(t);
        }
      }
    }, checkInterval);

    return () => {
      cancelled = true;
      clearInterval(interval);
      activeTimeouts.forEach(t => clearTimeout(t));
    };
  }, [
    gameState.detectionLevel,
    gameState.paranoiaLevel,
    gameState.isGameOver,
    gamePhase,
    playSound,
    setGlitchActive,
    setGlitchHeavy,
    suppressPressure,
  ]);

  // "They're watching" paranoia messages
  useEffect(() => {
    if (gamePhase !== 'terminal' || gameState.isGameOver) return;

    // Suppress paranoia during atmosphere phase (no pressure systems)
    if (suppressPressure) return;

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
      setParanoiaMessage(message);
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
    suppressPressure,
  ]);

  // Track detection level changes for sound/visual alerts
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
        setTimeout(() => setIsShaking(false), GLITCH_DURATIONS.SCREEN_SHAKE);
      }
    }

    prevDetectionRef.current = current;
  }, [gameState.detectionLevel, playSound, setIsShaking, setRiskPulse]);

  // Start ambient sound when tutorial completes
  useEffect(() => {
    if (!gameState.tutorialComplete || !soundEnabled || showTuringTest) {
      stopAmbient();
      return;
    }
    startAmbient();
    return () => stopAmbient();
  }, [gameState.tutorialComplete, soundEnabled, showTuringTest, startAmbient, stopAmbient]);

  // Update ambient tension based on detection level
  useEffect(() => {
    if (gameState.tutorialComplete && soundEnabled) {
      updateAmbientTension(gameState.detectionLevel);
    }
  }, [gameState.detectionLevel, gameState.tutorialComplete, soundEnabled, updateAmbientTension]);

  // Countdown timer logic
  useEffect(() => {
    if (!gameState.countdownActive || gamePhase !== 'terminal') {
      setCountdownDisplay(null);
      return;
    }

    const updateCountdown = () => {
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
    playSound,
    setCountdownDisplay,
    setGamePhase,
    setGameState,
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
    (): { hint: string; condition: (s: GameState) => boolean }[] => [
      {
        hint: "Use 'ls' to see what's in the current directory.",
        condition: (s: GameState) => (s.filesRead?.size || 0) === 0,
      },
      {
        hint: "Try 'open' on a .txt file to read it.",
        condition: (s: GameState) => (s.filesRead?.size || 0) === 0,
      },
      {
        hint: "Navigation tip: 'cd' changes directories. Start exploring.",
        condition: (s: GameState) => (s.filesRead?.size || 0) === 0,
      },
      {
        hint: 'You need evidence. Look for files that seem... off.',
        condition: (s: GameState) =>
          (s.truthsDiscovered?.size || 0) === 0 && (s.filesRead?.size || 0) >= 3,
      },
      {
        hint: 'Some documents contradict the official narrative. Find them.',
        condition: (s: GameState) =>
          (s.truthsDiscovered?.size || 0) === 0 && (s.filesRead?.size || 0) >= 5,
      },
      {
        hint: 'Have you checked /internal?',
        condition: (s: GameState) =>
          s.currentPath === '/' && !s.filesRead?.has('/internal/protocols/session_objectives.txt'),
      },
      {
        hint: 'The /comms directory might have useful intel.',
        condition: (s: GameState) =>
          !s.currentPath.includes('comms') && !s.filesRead?.has('/comms/radio_intercept_log.txt'),
      },
      {
        hint: "Detection is high. The 'wait' command lets time pass safely.",
        condition: (s: GameState) => s.detectionLevel > DETECTION_THRESHOLDS.HOSTILITY_MED,
      },
      {
        hint: "They're watching closely. Consider using 'wait' to reduce suspicion.",
        condition: (s: GameState) => s.detectionLevel > DETECTION_THRESHOLDS.ALERT,
      },
      {
        hint: "CAUTION: Detection critical. 'wait' might buy you time.",
        condition: (s: GameState) => s.detectionLevel > DETECTION_THRESHOLDS.HEAVY_GLITCH,
      },
      {
        hint: "You've seen a lot. There may be... deeper access available.",
        condition: (s: GameState) => (s.filesRead?.size || 0) >= 10 && !s.flags?.adminUnlocked,
      },
      {
        hint: "Some commands aren't listed. Keep digging.",
        condition: (s: GameState) => (s.filesRead?.size || 0) >= 15 && !s.flags?.adminUnlocked,
      },
      {
        hint: "Use 'ls' to see what's in the current directory.",
        condition: (s: GameState) => s.sessionCommandCount < 5,
      },
      {
        hint: "Some files are ENCRYPTED. You'll need 'decrypt' for those.",
        condition: (s: GameState) =>
          (s.categoriesRead?.size || 0) >= 2 && (s.truthsDiscovered?.size || 0) < 2,
      },
      {
        hint: "Try the 'progress' command to see what you've found.",
        condition: (s: GameState) => (s.truthsDiscovered?.size || 0) >= 1,
      },
      {
        hint: "Don't forget: 'note' saves reminders, 'bookmark' saves files.",
        condition: (s: GameState) =>
          (s.filesRead?.size || 0) >= 5 && (s.playerNotes?.length || 0) === 0,
      },
      {
        hint: "Check 'unread' to see what you haven't opened yet.",
        condition: (s: GameState) => (s.filesRead?.size || 0) >= 3,
      },
    ],
    []
  );

  useEffect(() => {
    if (gamePhase !== 'terminal' || gameState.isGameOver || gameState.tutorialStep >= 0) return;

    // Reset timer on any activity (history length change indicates command executed)
    if (idleHintTimerRef.current) {
      clearTimeout(idleHintTimerRef.current);
    }

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
      const hintEntry = createEntry('ufo74', `[UFO74] ${hint.hint}`);
      setGameState(prev => ({
        ...prev,
        history: [...prev.history, hintEntry],
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
    gameState.history.length,
    gamePhase,
    gameState.isGameOver,
    gameState.tutorialStep,
    idleHints,
    playSound,
    setGameState,
    gameStateRef,
    idleHintTimerRef,
    lastScrollTimeRef,
  ]);

  // Track when firewall pause starts (media or Turing Test)
  useEffect(() => {
    if (isFirewallPaused && firewallPauseStartRef.current === null) {
      firewallPauseStartRef.current = Date.now();
    }
  }, [isFirewallPaused, firewallPauseStartRef]);

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
        } else if (activeImage || activeVideo) {
          setActiveImage(null);
          setActiveVideo(null);
        } else {
          setShowPauseMenu(prev => !prev);
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
    activeVideo,
    setShowSettings,
    setShowAchievements,
    setShowStatistics,
    setActiveImage,
    setActiveVideo,
    setShowPauseMenu,
    setShowHeaderMenu,
  ]);

  // Handle Enter key in enter-only mode (tutorial intro, encrypted channel, pending media)
  // This is needed because the hidden form button approach is unreliable across browsers
  useEffect(() => {
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
