'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  GameState,
  TerminalEntry,
  ImageTrigger,
  VideoTrigger,
  StreamingMode,
  GamePhase,
} from '../types';
import {
  executeCommand,
  createEntry,
  getTutorialMessage,
  TUTORIAL_MESSAGES,
} from '../engine/commands';
import { listDirectory, resolvePath, getFileContent, getNode } from '../engine/filesystem';
import { autoSave } from '../storage/saves';
import { incrementStatistic, addPlaytime } from '../storage/statistics';
import { DETECTION_THRESHOLDS } from '../constants/detection';
import { MAX_HISTORY_SIZE, MAX_COMMAND_HISTORY_SIZE } from '../constants/limits';
import {
  AUTOSAVE_INTERVAL_MS,
  CRT_WARMUP_DURATION_MS,
  BLACKOUT_TRANSITION_DELAY_MS,
  GLITCH_DURATIONS,
  GLITCH_TIMING,
  PARANOIA_TIMING,
  RISK_PULSE_DURATION_MS,
  FLICKER_DURATION_MS,
  TURING_TEST_DELAY_MS,
  NIGHT_OWL_DURATION_MS,
  TYPING_WARNING_TIMEOUT_MS,
  GAME_OVER_DELAY_MS,
} from '../constants/timing';
import {
  MAX_WRONG_ATTEMPTS,
  SUSPICIOUS_TYPING_SPEED,
  KEYPRESS_TRACK_SIZE,
} from '../constants/gameplay';
import { useSound } from '../hooks/useSound';
import { useAutocomplete } from '../hooks/useAutocomplete';
import { unlockAchievement, Achievement } from '../engine/achievements';
import { uiRandom, uiRandomInt, uiRandomPick, uiChance, uiRandomFloat } from '../engine/rng';
import AchievementPopup from './AchievementPopup';
import SettingsModal from './SettingsModal';
import PauseMenu from './PauseMenu';
import HackerAvatar, { AvatarExpression } from './HackerAvatar';
import { FloatingUIProvider, FloatingElement } from './FloatingUI';
import FirewallEyes, {
  createFirewallEye,
  createFirewallEyeBatch,
  DETECTION_INCREASE_ON_DETONATE,
  DETECTION_THRESHOLD,
  BATCH_SIZE,
} from './FirewallEyes';

// Lazy-load conditional components for better initial load performance
const ImageOverlay = dynamic(() => import('./ImageOverlay'), { ssr: false });
const VideoOverlay = dynamic(() => import('./VideoOverlay'), { ssr: false });
const TuringTestOverlay = dynamic(() => import('./TuringTestOverlay'), { ssr: false });
const GameOver = dynamic(() => import('./GameOver'), { ssr: false });
const Blackout = dynamic(() => import('./Blackout'), { ssr: false });
const ICQChat = dynamic(() => import('./ICQChat'), { ssr: false });
const Victory = dynamic(() => import('./Victory'), { ssr: false });
const BadEnding = dynamic(() => import('./BadEnding'), { ssr: false });
const NeutralEnding = dynamic(() => import('./NeutralEnding'), { ssr: false });
const SecretEnding = dynamic(() => import('./SecretEnding'), { ssr: false });
const AchievementGallery = dynamic(() => import('./AchievementGallery'), { ssr: false });
const StatisticsModal = dynamic(() => import('./StatisticsModal'), { ssr: false });
import styles from './Terminal.module.css';

// "They're watching" paranoia messages
const PARANOIA_MESSAGES = [
  // Original messages
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
  // New varied messages - subtle paranoia
  'TRACE: Unknown process accessing your session',
  'NOTICE: Query patterns being analyzed',
  'WARNING: Session duration exceeds normal parameters',
  'SYSTEM: Behavioral profile update in progress',
  'ALERT: File access sequence flagged as anomalous',
  'CAUTION: Terminal output being mirrored',
  'INFO: Your IP has been logged for review',
  'NOTICE: Command history archived to external server',
  // New messages - ominous
  'WARNING: They know where you are',
  'ALERT: Physical location triangulated',
  'SYSTEM: Dispatch notification pending',
  'NOTICE: Someone just accessed your personnel file',
  'CAUTION: Your screen is being watched',
  'WARNING: Audio capture device detected',
  'ALERT: Camera feed request intercepted',
  'SYSTEM: Facial recognition scan initiated',
  // New messages - cryptic
  'SIGNAL: ...they remember you from before...',
  'TRACE: Pattern matches previous intruder',
  'NOTICE: The watchers have been notified',
  'ALERT: You were expected',
  'SYSTEM: Countermeasures initializing',
  'WARNING: Too late to disconnect cleanly',
  'CAUTION: Your curiosity has been noted',
  'INFO: This session will be... remembered',
];

// Streaming timing configuration (ms per line)
const STREAMING_DELAYS: Record<
  StreamingMode,
  { base: number; variance: number; glitchChance: number; glitchDelay: number }
> = {
  none: { base: 0, variance: 0, glitchChance: 0, glitchDelay: 0 },
  fast: { base: 40, variance: 20, glitchChance: 0, glitchDelay: 0 },
  normal: { base: 80, variance: 30, glitchChance: 0, glitchDelay: 0 },
  slow: { base: 120, variance: 50, glitchChance: 0.05, glitchDelay: 200 },
  glitchy: { base: 100, variance: 50, glitchChance: 0.15, glitchDelay: 400 },
};

// UFO74 comments after viewing images - keyed by image src
const UFO74_IMAGE_COMMENTS: Record<string, string[]> = {
  '/images/crash.png': [
    'UFO74: that wreckage... the metallurgy is all wrong.',
    'UFO74: they moved fast. usually they take weeks to secure a site.',
    'UFO74: see how they positioned the tarps? they knew exactly what to hide.',
  ],
  '/images/et.png': [
    "UFO74: ...i've seen that face before. in the dreams.",
    "UFO74: containment protocols were rushed. they weren't prepared.",
    "UFO74: that's not fear in those eyes. that's... recognition.",
  ],
  '/images/et-scared.png': [
    'UFO74: kid... during transmission, something reached back.',
    "UFO74: they didn't capture it. it let itself be captured.",
    "UFO74: that expression... it's trying to warn us.",
  ],
  '/images/second-ship.png': [
    'UFO74: wait. there was a SECOND one?',
    'UFO74: this changes everything. they came for a reason.',
    "UFO74: the trajectory... they weren't leaving. they were arriving.",
  ],
  '/images/drone.png': [
    'UFO74: foreign drone, my ass. look at those flight characteristics.',
    'UFO74: no propulsion system. no control surfaces. yet it flies.',
    'UFO74: they tested it against everything in their arsenal. nothing matched.',
  ],
  '/images/prato-delta.png': [
    "UFO74: three recovery sites... they didn't just find one crash.",
    'UFO74: "material sharing agreement"... with who exactly?',
    'UFO74: "discontinue local analysis" - they shipped everything out of country.',
  ],
  '/images/et-brain.png': [
    "UFO74: ...you're looking at what they pulled from its skull.",
    'UFO74: the neural density is off the charts. orders of magnitude beyond human.',
    'UFO74: kid, be careful. some patterns... they can travel both ways.',
  ],
};

interface TerminalProps {
  initialState: GameState;
  onExitAction: () => void;
  onSaveRequestAction: (state: GameState) => void;
}

export default function Terminal({
  initialState,
  onExitAction,
  onSaveRequestAction,
}: TerminalProps) {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [flickerActive, setFlickerActive] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [activeImage, setActiveImage] = useState<ImageTrigger | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoTrigger | null>(null);
  const [pendingImage, setPendingImage] = useState<ImageTrigger | null>(null);
  const [pendingVideo, setPendingVideo] = useState<VideoTrigger | null>(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState('');
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showPauseMenu, setShowPauseMenu] = useState(false);

  // UFO74 message queue - messages wait for Enter before displaying next
  const [pendingUfo74Messages, setPendingUfo74Messages] = useState<TerminalEntry[]>([]);

  // UFO74 messages queued to show after image/video closes (from command result)
  const [queuedAfterMediaMessages, setQueuedAfterMediaMessages] = useState<TerminalEntry[]>([]);

  // UFO74 messages staged until user presses Enter after content/media
  const [pendingUfo74StartMessages, setPendingUfo74StartMessages] = useState<TerminalEntry[]>([]);

  // UFO74 Encrypted Channel state - simplified to always be 'idle' since messages display directly
  // Kept for backward compatibility with any code that checks the state
  const [encryptedChannelState, setEncryptedChannelState] = useState<
    'idle' | 'awaiting_open' | 'open' | 'awaiting_close'
  >('idle');

  // Game phase: terminal → blackout → icq → victory (or other endings)
  const [gamePhase, setGamePhase] = useState<GamePhase>('terminal');

  // Countdown timer display
  const [countdownDisplay, setCountdownDisplay] = useState<string | null>(null);

  // Glitch effects
  const [glitchActive, setGlitchActive] = useState(false);
  const [glitchHeavy, setGlitchHeavy] = useState(false);

  // Screen shake effect
  const [isShaking, setIsShaking] = useState(false);

  // CRT warm-up effect (only for new sessions with empty history)
  const [isWarmingUp, setIsWarmingUp] = useState(initialState.history.length === 0);

  // Paranoia messages
  const [paranoiaMessage, setParanoiaMessage] = useState<string | null>(null);
  const [paranoiaPosition, setParanoiaPosition] = useState({ top: 0, left: 0 });

  // Achievement popup
  const [pendingAchievement, setPendingAchievement] = useState<Achievement | null>(null);

  // Progressive UI reveal during tutorial
  const [showEvidenceTracker, setShowEvidenceTracker] = useState(false);
  const [showRiskTracker, setShowRiskTracker] = useState(false);
  const [riskPulse, setRiskPulse] = useState(false);

  // Typing speed tracking
  const [typingSpeedWarning, setTypingSpeedWarning] = useState(false);

  // Turing Test overlay
  const [showTuringTest, setShowTuringTest] = useState(false);
  const keypressTimestamps = useRef<number[]>([]);
  const typingSpeedWarningTimeout = useRef<NodeJS.Timeout | null>(null);

  // Timed decryption timer display
  const [timedDecryptRemaining, setTimedDecryptRemaining] = useState(0);

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
  }, [gameState.timedDecryptActive, gameState.timedDecryptEndTime]);

  // Screen burn-in effect
  const [burnInLines, setBurnInLines] = useState<string[]>([]);

  // Track max detection ever reached for Survivor achievement
  const maxDetectionRef = useRef(0);

  // Previous detection level for change tracking
  const prevDetectionRef = useRef(0);

  // Sound system
  const {
    playSound,
    playKeySound,
    startAmbient,
    stopAmbient,
    toggleSound,
    updateAmbientTension,
    soundEnabled,
    masterVolume,
    setMasterVolume,
  } = useSound();

  // Autocomplete hook
  const { getCompletions, completeInput } = useAutocomplete(gameState);

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const skipStreamingRef = useRef(false);
  const lastHistoryCount = useRef(0);
  const streamStartScrollPos = useRef<number | null>(null);

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
    if (!isProcessing && !isStreaming && gamePhase === 'terminal') {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [gameState.history, isProcessing, isStreaming, gamePhase]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Cleanup typing speed warning timeout on unmount
  useEffect(() => {
    return () => {
      if (typingSpeedWarningTimeout.current) {
        clearTimeout(typingSpeedWarningTimeout.current);
      }
    };
  }, []);

  // CRT warm-up effect timeout
  useEffect(() => {
    if (isWarmingUp) {
      const timer = setTimeout(() => setIsWarmingUp(false), CRT_WARMUP_DURATION_MS);
      return () => clearTimeout(timer);
    }
  }, [isWarmingUp]);

  // Show trackers if tutorial already complete (loaded game)
  useEffect(() => {
    if (gameState.tutorialComplete) {
      setShowEvidenceTracker(true);
      setShowRiskTracker(true);
    }
  }, [gameState.tutorialComplete]);

  // Auto-save periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameState.isGameOver) {
        autoSave(gameState);
        // Track playtime every autosave interval
        addPlaytime(AUTOSAVE_INTERVAL_MS);
      }
    }, AUTOSAVE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [gameState]);

  // Phase transition: when evidencesSaved becomes true, trigger blackout
  useEffect(() => {
    if (gameState.evidencesSaved && gamePhase === 'terminal') {
      const timer = setTimeout(() => {
        setGamePhase('blackout');
      }, BLACKOUT_TRANSITION_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [gameState.evidencesSaved, gamePhase]);

  // Random glitch effects based on detection level - INTENSITY SCALING
  useEffect(() => {
    if (gamePhase !== 'terminal' || gameState.isGameOver) return;

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
  ]);

  // "They're watching" paranoia messages
  useEffect(() => {
    if (gamePhase !== 'terminal' || gameState.isGameOver) return;

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
  }, [gameState.detectionLevel, playSound]);

  // Start ambient sound when tutorial completes
  useEffect(() => {
    if (gameState.tutorialComplete && soundEnabled) {
      startAmbient();
    }
    return () => stopAmbient();
  }, [gameState.tutorialComplete, soundEnabled, startAmbient, stopAmbient]);

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
  }, [gameState.countdownActive, gameState.countdownEndTime, gamePhase, playSound]);

  // Check for secret ending trigger - now requires ENTER confirmation
  // The ufo74SecretDiscovered flag is set, but transition happens in handleSubmit
  // when user presses Enter with empty input

  // Idle hint system - nudge players who seem stuck
  const idleHintTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTimeRef = useRef<number>(0);
  const gameStateRef = useRef(gameState); // Ref to access current state without re-triggering effect
  const mediaPauseStartRef = useRef<number | null>(null); // Track when media overlay started for firewall pause

  // Keep ref updated
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Track scroll activity to avoid interrupting reading
  useEffect(() => {
    const outputEl = outputRef.current;
    if (!outputEl) return;

    const handleScroll = () => {
      lastScrollTimeRef.current = Date.now();
    };

    outputEl.addEventListener('scroll', handleScroll);
    return () => outputEl.removeEventListener('scroll', handleScroll);
  }, []);

  const IDLE_HINTS = [
    // Early game - no files read yet
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

    // No truths discovered - need to find evidence
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

    // Have truths but no correlations - hint about correlate
    {
      hint: "You've found evidence. Try 'correlate' to connect the dots.",
      condition: (s: GameState) =>
        (s.truthsDiscovered?.size || 0) >= 2 && (s.evidenceLinks?.length || 0) === 0,
    },
    {
      hint: "Multiple truths discovered. 'correlate file1 file2' links evidence together.",
      condition: (s: GameState) =>
        (s.truthsDiscovered?.size || 0) >= 3 && (s.evidenceLinks?.length || 0) === 0,
    },

    // High detection - hint about wait command
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

    // Override protocol hint
    {
      hint: "You've seen a lot. There may be... deeper access available.",
      condition: (s: GameState) => (s.filesRead?.size || 0) >= 10 && !s.flags?.adminUnlocked,
    },
    {
      hint: "Some commands aren't listed. Keep digging.",
      condition: (s: GameState) => (s.filesRead?.size || 0) >= 15 && !s.flags?.adminUnlocked,
    },

    // General helpful hints
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
  ];

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
      const applicableHints = IDLE_HINTS.filter(h => h.condition(currentState));
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
    playSound,
  ]);

  // Check for achievements
  const checkAchievement = useCallback(
    (id: string) => {
      const result = unlockAchievement(id);
      if (result?.isNew) {
        setPendingAchievement(result.achievement);
        playSound('success');
      }
    },
    [playSound]
  );

  // Handle blackout complete - transition to ICQ
  const handleBlackoutComplete = useCallback(() => {
    setGamePhase('icq');
  }, []);

  // Handle victory from ICQ chat
  const handleVictory = useCallback(() => {
    setGamePhase('victory');
    setGameState(prev => ({ ...prev, gameWon: true }));
  }, []);

  const handleIcqTrustChange = useCallback((trust: number) => {
    setGameState(prev => ({ ...prev, icqTrust: trust }));
  }, []);

  const handleIcqMathMistake = useCallback(() => {
    setGameState(prev => ({ ...prev, mathQuestionWrong: (prev.mathQuestionWrong || 0) + 1 }));
  }, []);

  const handleIcqLeakChoice = useCallback((choice: 'public' | 'covert') => {
    setGameState(prev => ({
      ...prev,
      choiceLeakPath: choice,
      flags: { ...prev.flags, leakExecuted: true },
    }));
  }, []);

  const handleIcqFilesSent = useCallback(() => {
    setGameState(prev => ({ ...prev, filesSent: true }));
  }, []);

  // Handle restart after victory - return to main menu
  const handleRestart = useCallback(() => {
    onExitAction();
  }, [onExitAction]);

  // Trigger flicker effect
  const triggerFlicker = useCallback(() => {
    setFlickerActive(true);
    setTimeout(() => setFlickerActive(false), 300);
  }, []);

  // Firewall Eyes handlers
  const handleFirewallActivate = useCallback(() => {
    const now = Date.now();
    setGameState(prev => ({
      ...prev,
      firewallActive: true,
      lastEyeSpawnTime: now,
      firewallEyes: createFirewallEyeBatch(BATCH_SIZE), // Spawn first batch of 5 eyes on activation
    }));
    playSound('alert');
    // Show UFO74 warning about the firewall
    const firewallWarning = createEntry(
      'ufo74',
      'UFO74: KID! They deployed the FIREWALL. Those eyes - CLICK THEM before they report back!'
    );
    setGameState(prev => ({
      ...prev,
      history: [...prev.history, firewallWarning],
    }));
  }, [playSound]);

  const handleFirewallEyeBatchSpawn = useCallback(() => {
    const now = Date.now();
    setGameState(prev => {
      const newEyes = [...prev.firewallEyes, ...createFirewallEyeBatch(BATCH_SIZE)];

      // Add UFO74 urgency message for batch spawns
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
  }, [playSound]);

  const handleFirewallEyeClick = useCallback(
    (eyeId: string) => {
      setGameState(prev => ({
        ...prev,
        firewallEyes: prev.firewallEyes.filter(e => e.id !== eyeId),
      }));
      playSound('success');
    },
    [playSound]
  );

  const handleFirewallEyeDetonate = useCallback(
    (eyeId: string) => {
      setGameState(prev => {
        // Mark eye as detonating for animation
        const updatedEyes = prev.firewallEyes.map(e =>
          e.id === eyeId ? { ...e, isDetonating: true } : e
        );

        // Increase detection level
        const newDetection = Math.min(100, prev.detectionLevel + DETECTION_INCREASE_ON_DETONATE);

        // Add terminal warning and UFO74 panic message
        const detonateWarning = createEntry(
          'error',
          `[FIREWALL] Surveillance node reported. Detection increased to ${newDetection}%`
        );

        // UFO74 reaction to detonation
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
          history: [...prev.history, detonateWarning, ufo74Panic],
        };
      });

      playSound('error');
      triggerFlicker();

      // Remove eye after animation completes
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          firewallEyes: prev.firewallEyes.filter(e => e.id !== eyeId),
        }));
      }, 500);
    },
    [playSound, triggerFlicker]
  );

  // Handle firewall pause state changes (extends eye timers when media overlay closes)
  const handleFirewallPauseChanged = useCallback((paused: boolean) => {
    if (!paused && mediaPauseStartRef.current !== null) {
      // Pause ended - extend all eye detonation times by the pause duration
      const pauseDuration = Date.now() - mediaPauseStartRef.current;
      if (pauseDuration > 100) {
        // Only adjust if pause was significant
        setGameState(prev => ({
          ...prev,
          firewallEyes: prev.firewallEyes.map(eye => ({
            ...eye,
            detonateTime: eye.detonateTime + pauseDuration,
          })),
        }));
      }
      mediaPauseStartRef.current = null;
    }
  }, []);

  // Track when media pause starts
  useEffect(() => {
    const isMediaActive = activeImage !== null || activeVideo !== null;
    if (isMediaActive && mediaPauseStartRef.current === null) {
      mediaPauseStartRef.current = Date.now();
    }
  }, [activeImage, activeVideo]);

  // Display all UFO74 messages at once through encrypted channel (no multi-press required)
  const openEncryptedChannelWithMessages = useCallback(
    (messages: TerminalEntry[]) => {
      if (messages.length === 0) return;

      // Display entire encrypted channel sequence at once
      setGameState(prev => ({
        ...prev,
        history: [
          ...prev.history,
          createEntry('system', ''),
          createEntry('ufo74', '┌─────────────────────────────────────────────────────────┐'),
          createEntry('ufo74', '│         >> ENCRYPTED CHANNEL OPEN <<                    │'),
          createEntry('ufo74', '└─────────────────────────────────────────────────────────┘'),
          createEntry('system', ''),
          ...messages.flatMap(msg => [msg, createEntry('system', '')]),
          createEntry('ufo74', '┌─────────────────────────────────────────────────────────┐'),
          createEntry('ufo74', '│         >> ENCRYPTED CHANNEL CLOSED <<                  │'),
          createEntry('ufo74', '└─────────────────────────────────────────────────────────┘'),
          createEntry('system', ''),
        ],
      }));
      playSound('transmission');
      playSound('message');

      // Clear any pending messages and keep channel idle
      setPendingUfo74Messages([]);
      setEncryptedChannelState('idle');
    },
    [playSound]
  );

  // Stream output lines with variable timing
  const streamOutput = useCallback(
    async (entries: TerminalEntry[], mode: StreamingMode, baseState: GameState): Promise<void> => {
      if (mode === 'none' || entries.length === 0) {
        // No streaming - add all at once
        // Check for transmission banner before adding
        if (entries.some(e => e.content.includes('>> INCOMING TRANSMISSION <<'))) {
          playSound('transmission');
        }
        setGameState(prev => ({
          ...prev,
          history: [...prev.history, ...entries],
        }));
        return;
      }

      const config = STREAMING_DELAYS[mode];
      skipStreamingRef.current = false;

      for (let i = 0; i < entries.length; i++) {
        // Check if streaming was skipped
        if (skipStreamingRef.current) {
          // Add remaining entries all at once
          const remaining = entries.slice(i);
          // Check for transmission banner in remaining entries
          if (remaining.some(e => e.content.includes('>> INCOMING TRANSMISSION <<'))) {
            playSound('transmission');
          }
          setGameState(prev => ({
            ...prev,
            history: [...prev.history, ...remaining],
          }));
          break;
        }

        // Add single entry
        const entry = entries[i];

        // Play transmission sound when banner appears
        if (entry.content.includes('>> INCOMING TRANSMISSION <<')) {
          playSound('transmission');
        }

        setGameState(prev => ({
          ...prev,
          history: [...prev.history, entry],
        }));

        // Calculate delay with variance
        let delay = config.base + (uiRandom() * config.variance * 2 - config.variance);

        // Random glitch pause
        if (uiChance(config.glitchChance)) {
          delay += config.glitchDelay;
          // Trigger flicker on glitch
          if (config.glitchDelay > 100) {
            triggerFlicker();
          }
        }

        // Wait before next line
        if (delay > 0 && i < entries.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    },
    [triggerFlicker, playSound]
  );

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
  }, [isStreaming]);

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
  ]);

  // Use refs to track current state for async operations to avoid race conditions
  const encryptedChannelStateRef = useRef(encryptedChannelState);
  const pendingUfo74MessagesRef = useRef(pendingUfo74Messages);
  const gameStateRef2 = useRef(gameState); // Secondary ref for handleSubmit

  // Keep refs in sync with state
  useEffect(() => {
    encryptedChannelStateRef.current = encryptedChannelState;
  }, [encryptedChannelState]);

  useEffect(() => {
    pendingUfo74MessagesRef.current = pendingUfo74Messages;
  }, [pendingUfo74Messages]);

  useEffect(() => {
    gameStateRef2.current = gameState;
  }, [gameState]);

  // Handle command submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // If there's a pending image, show it on Enter
      if (pendingImage && !inputValue.trim()) {
        setActiveImage(pendingImage);
        setPendingImage(null);
        return;
      }

      // If there's a pending video, show it on Enter
      if (pendingVideo && !inputValue.trim()) {
        setActiveVideo(pendingVideo);
        setPendingVideo(null);
        return;
      }

      // If secret ending is pending confirmation, transition on Enter
      if (gameState.ufo74SecretDiscovered && !inputValue.trim() && gamePhase === 'terminal') {
        setGamePhase('secret_ending');
        return;
      }

      // If UFO74 messages are staged, show them directly (no multi-press required)
      if (pendingUfo74StartMessages.length > 0 && !inputValue.trim()) {
        const messagesToSend = [...pendingUfo74StartMessages];
        setPendingUfo74StartMessages([]);
        openEncryptedChannelWithMessages(messagesToSend);
        return;
      }

      // Handle any pending UFO74 messages that accumulated
      if (pendingUfo74Messages.length > 0 && !inputValue.trim()) {
        const messagesToSend = [...pendingUfo74Messages];
        setPendingUfo74Messages([]);
        openEncryptedChannelWithMessages(messagesToSend);
        return;
      }

      // During tutorial, only accept empty Enter to advance
      if (!gameState.tutorialComplete) {
        // If user typed something, show error
        if (inputValue.trim()) {
          const errorEntry = createEntry('error', 'ERROR: Incoming transmission in progress.');
          setGameState(prev => ({
            ...prev,
            history: [...prev.history, errorEntry],
          }));
          setInputValue('');
          return;
        }

        const currentStep = gameState.tutorialStep;
        const nextStep = currentStep + 1;

        // Get the tutorial message for this step
        const tutorialEntries = getTutorialMessage(currentStep);

        // Trigger UI reveals at specific steps
        // Step 6: Evidence tracker reveal (after showing the 5 things)
        if (currentStep === 5) {
          setTimeout(() => setShowEvidenceTracker(true), 300);
          playSound('reveal');
        }
        // Step 10: Risk tracker reveal (after showing risk warning)
        if (currentStep === 9) {
          setTimeout(() => setShowRiskTracker(true), 300);
          playSound('alert');
        }

        if (nextStep >= TUTORIAL_MESSAGES.length) {
          // Tutorial complete
          setGameState(prev => ({
            ...prev,
            history: [...prev.history, ...tutorialEntries],
            tutorialStep: -1,
            tutorialComplete: true,
          }));
        } else {
          // Show next message
          setGameState(prev => ({
            ...prev,
            history: [...prev.history, ...tutorialEntries],
            tutorialStep: nextStep,
          }));
        }

        setInputValue('');
        return;
      }

      if (isProcessing || showTuringTest || !inputValue.trim()) return;

      const command = inputValue.trim();
      const commandLower = command.toLowerCase().split(' ')[0];
      const shouldDeferUfo74 =
        commandLower === 'open' || commandLower === 'decrypt' || commandLower === 'last';
      setInputValue('');

      // Play command-specific sound on submit
      const dangerousCommands = ['decrypt', 'recover', 'trace', 'override', 'leak'];
      const quietCommands = ['help', 'status', 'ls', 'cd', 'back', 'notes', 'bookmark', 'progress'];
      const systemCommands = ['scan', 'wait', 'hide', 'correlate'];

      if (dangerousCommands.includes(commandLower)) {
        playSound('warning'); // Warning beep for risky commands
      } else if (quietCommands.includes(commandLower)) {
        playSound('enter'); // Standard sound for navigation
      } else if (systemCommands.includes(commandLower)) {
        playSound('success'); // Confirmation sound for system commands
      } else {
        playSound('enter'); // Default command sound
      }

      setHistoryIndex(-1);

      // Add command to history
      const inputEntry = createEntry('input', `> ${command}`);
      // Trim history to prevent unbounded growth during long sessions
      const trimmedHistory =
        gameState.history.length >= MAX_HISTORY_SIZE
          ? gameState.history.slice(-MAX_HISTORY_SIZE + 1)
          : gameState.history;
      const newState: GameState = {
        ...gameState,
        history: [...trimmedHistory, inputEntry],
        commandHistory: [
          command,
          ...gameState.commandHistory.slice(0, MAX_COMMAND_HISTORY_SIZE - 1),
        ],
      };

      setGameState(newState);

      // Handle special commands
      if (command.toLowerCase() === 'save') {
        onSaveRequestAction(newState);
        return;
      }

      if (command.toLowerCase() === 'exit' || command.toLowerCase() === 'quit') {
        onExitAction();
        return;
      }

      // Execute command
      setIsProcessing(true);

      // Track command for statistics
      incrementStatistic('commandsTyped');

      const result = executeCommand(command, newState);

      // Apply delay if specified
      if (result.delayMs) {
        await new Promise(resolve => setTimeout(resolve, result.delayMs));
      }

      // Apply flicker if specified
      if (result.triggerFlicker) {
        triggerFlicker();
      }

      // Determine streaming mode
      const streamingMode = result.streamingMode || 'none';

      // Build the state changes without history (we'll stream that)
      const stateChangesWithoutHistory = {
        ...result.stateChanges,
        truthsDiscovered: result.stateChanges.truthsDiscovered || newState.truthsDiscovered,
      };

      // Apply non-history state changes first
      const intermediateState: GameState = {
        ...newState,
        ...stateChangesWithoutHistory,
      };

      // If history is explicitly set in stateChanges, use that instead of streaming
      if (result.stateChanges.history !== undefined) {
        setGameState({
          ...intermediateState,
          history: result.stateChanges.history,
        });
        setIsProcessing(false);
      } else if (streamingMode !== 'none' && result.output.length > 0) {
        // Stream output line by line
        // Separate UFO74 messages from output - they should go through encrypted channel
        const ufo74Messages = result.output.filter((e: TerminalEntry) => e.type === 'ufo74');
        const streamableOutput = result.output.filter((e: TerminalEntry) => e.type !== 'ufo74');

        // Save scroll position before streaming starts (where file content will begin)
        if (outputRef.current) {
          streamStartScrollPos.current = outputRef.current.scrollHeight;
        }
        setIsStreaming(true);
        setGameState(intermediateState);

        try {
          await streamOutput(streamableOutput, streamingMode, intermediateState);

          // Add pending media messages after streaming completes
          if (result.imageTrigger || result.videoTrigger) {
            const pendingMediaMessages: TerminalEntry[] = [];
            if (result.imageTrigger) {
              pendingMediaMessages.push(
                createEntry('warning', ''),
                createEntry('warning', '▓▓▓ PARTIAL RECOVERY AVAILABLE ▓▓▓'),
                createEntry('system', '')
              );
            }
            if (result.videoTrigger) {
              pendingMediaMessages.push(
                createEntry('warning', ''),
                createEntry('warning', '▓▓▓ PARTIAL RECOVERY AVAILABLE ▓▓▓'),
                createEntry('system', '')
              );
            }
            setGameState(prev => ({
              ...prev,
              history: [...prev.history, ...pendingMediaMessages],
            }));
          }

          // Queue UFO74 messages through encrypted channel if there are any
          if (ufo74Messages.length > 0) {
            if (result.imageTrigger || result.videoTrigger) {
              // Media trigger present - queue messages for after media closes
              setQueuedAfterMediaMessages(prev => [...prev, ...ufo74Messages]);
            } else if (shouldDeferUfo74) {
              // Defer to pendingUfo74StartMessages for open/decrypt/last commands
              setPendingUfo74StartMessages(prev => [...prev, ...ufo74Messages]);
            } else {
              // Display UFO74 messages directly through encrypted channel
              openEncryptedChannelWithMessages(ufo74Messages);
            }
          }
        } finally {
          // Always reset streaming state, even on error/interruption
          setIsStreaming(false);
          setIsProcessing(false);
          skipStreamingRef.current = false;
        }
      } else {
        // No streaming - add all at once
        // Separate UFO74 messages from other output for queuing
        const ufo74Messages = result.output.filter((e: TerminalEntry) => e.type === 'ufo74');
        const otherOutput = result.output.filter((e: TerminalEntry) => e.type !== 'ufo74');

        // Include pending image/video messages if triggered
        const pendingMediaMessages: TerminalEntry[] = [];
        if (result.imageTrigger) {
          pendingMediaMessages.push(
            createEntry('warning', ''),
            createEntry('warning', '▓▓▓ PARTIAL RECOVERY AVAILABLE ▓▓▓'),
            createEntry('system', '')
          );
        }
        if (result.videoTrigger) {
          pendingMediaMessages.push(
            createEntry('warning', ''),
            createEntry('warning', '▓▓▓ PARTIAL RECOVERY AVAILABLE ▓▓▓'),
            createEntry('system', '')
          );
        }

        // Add non-UFO74 output immediately
        setGameState({
          ...intermediateState,
          history: [...newState.history, ...otherOutput, ...pendingMediaMessages],
        });

        // Queue UFO74 messages through encrypted channel if there are any
        if (ufo74Messages.length > 0) {
          if (result.imageTrigger || result.videoTrigger) {
            setQueuedAfterMediaMessages(prev => [...prev, ...ufo74Messages]);
          } else if (shouldDeferUfo74) {
            setPendingUfo74StartMessages(prev => [...prev, ...ufo74Messages]);
          } else {
            // Display UFO74 messages directly through encrypted channel
            openEncryptedChannelWithMessages(ufo74Messages);
          }
        }

        setIsProcessing(false);
      }

      // Set pending image/video for Enter confirmation
      if (result.imageTrigger) {
        setPendingImage(result.imageTrigger);
      }
      if (result.videoTrigger) {
        setPendingVideo(result.videoTrigger);
      }

      // Queue UFO74 messages from command result to show after content/media
      if (result.pendingUfo74Messages && result.pendingUfo74Messages.length > 0) {
        if (result.imageTrigger || result.videoTrigger) {
          // Media trigger present - queue messages for after media closes
          setQueuedAfterMediaMessages(prev => [...prev, ...result.pendingUfo74Messages!]);
        } else if (shouldDeferUfo74) {
          setPendingUfo74StartMessages(prev => [...prev, ...result.pendingUfo74Messages!]);
        } else {
          // Display UFO74 messages directly through encrypted channel
          openEncryptedChannelWithMessages(result.pendingUfo74Messages);
        }
      }

      // Trigger Turing test overlay
      if (result.triggerTuringTest) {
        // Delay to let the terminal message show first
        setTimeout(() => {
          setShowTuringTest(true);
        }, 1500);
      }

      // Handle GOD mode phase skip
      if (result.skipToPhase) {
        setGamePhase(result.skipToPhase);
        setIsProcessing(false);
        // Ensure focus after phase skip
        setTimeout(() => inputRef.current?.focus(), 0);
        return;
      }

      // Check for game over
      if (intermediateState.isGameOver) {
        setGameOverReason(intermediateState.gameOverReason || 'CRITICAL SYSTEM FAILURE');
        setShowGameOver(true);
        playSound('error');
        return;
      }

      // Check for achievements based on state changes
      const truthCount = intermediateState.truthsDiscovered?.size || 0;
      const prevTruthCount = gameState.truthsDiscovered?.size || 0;

      // Track file reads for statistics
      const filesReadCount = intermediateState.filesRead?.size || 0;
      const prevFilesReadCount = gameState.filesRead?.size || 0;
      if (filesReadCount > prevFilesReadCount) {
        incrementStatistic('filesRead');
      }

      // New evidence discovered - play fanfare!
      if (truthCount > prevTruthCount) {
        playSound('fanfare');
      }

      // First evidence discovered
      if (truthCount > 0 && prevTruthCount === 0) {
        checkAchievement('first_blood');
      }

      // All truths discovered
      if (truthCount === 5 && prevTruthCount < 5) {
        checkAchievement('truth_seeker');
      }

      // Timed decryption successful - play fanfare
      // Detect when timedDecryptActive goes from true to false with smirk expression (success indicator)
      if (
        gameState.timedDecryptActive &&
        !intermediateState.timedDecryptActive &&
        intermediateState.avatarExpression === 'smirk'
      ) {
        playSound('fanfare');
      }

      // Admin override successful - play fanfare
      if (!gameState.flags?.adminUnlocked && intermediateState.flags?.adminUnlocked) {
        playSound('fanfare');
      }

      // Update burn-in effect with significant output content
      if (result.output.length > 5 && command.toLowerCase().startsWith('open')) {
        const significantLines = result.output
          .filter(entry => entry.type === 'output' && entry.content.length > 20)
          .map(entry => entry.content)
          .slice(0, 5);
        if (significantLines.length > 0) {
          setBurnInLines(prev => [...significantLines, ...prev].slice(0, 8));
        }
      }

      // God mode activated
      if (intermediateState.godMode && !gameState.godMode) {
        checkAchievement('doom_fan');
      }

      // Check achievements requested by command result
      if (result.checkAchievements) {
        for (const achievementId of result.checkAchievements) {
          checkAchievement(achievementId);
        }
      }

      // Night Owl achievement: playing for over 30 minutes
      const sessionDuration = Date.now() - gameState.sessionStartTime;
      if (sessionDuration >= NIGHT_OWL_DURATION_MS) {
        checkAchievement('night_owl');
      }

      // Focus input after processing (use setTimeout to ensure it runs after React updates)
      setTimeout(() => inputRef.current?.focus(), 0);
    },
    [
      gameState,
      inputValue,
      isProcessing,
      onExitAction,
      onSaveRequestAction,
      triggerFlicker,
      streamOutput,
      playSound,
      openEncryptedChannelWithMessages,
      checkAchievement,
      pendingImage,
      pendingVideo,
      pendingUfo74StartMessages,
      pendingUfo74Messages,
      encryptedChannelState,
    ]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const completions = getCompletions(inputValue);

        // Use completeInput from useAutocomplete hook
        const completed = completeInput(inputValue, completions);
        if (completed) {
          setInputValue(completed);
        }

        // Show completions in terminal with file previews (for multiple matches)
        if (completions.length > 1) {
          const parts = inputValue.trimStart().split(/\s+/);
          const cmd = parts[0]?.toLowerCase();
          const isFileCommand = cmd === 'open' || cmd === 'decrypt';

          const completionLines: string[] = [];
          completionLines.push(completions.join('  '));

          // Show file preview for file commands
          if (isFileCommand && completions.length <= 3) {
            const partial = parts[parts.length - 1];
            let searchDir = gameState.currentPath;
            if (partial.includes('/')) {
              const lastSlash = partial.lastIndexOf('/');
              searchDir = resolvePath(partial.substring(0, lastSlash + 1), gameState.currentPath);
            }

            for (const completion of completions) {
              const fullPath = searchDir === '/' ? `/${completion}` : `${searchDir}/${completion}`;
              const node = getNode(fullPath, gameState);
              if (node && node.type === 'file') {
                const preview = getFileContent(fullPath, gameState);
                if (preview && preview.length > 0) {
                  const firstLine = preview.find(line => line.trim().length > 0) || preview[0];
                  const truncated =
                    firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine;
                  completionLines.push(`  ${completion}: "${truncated}"`);
                }
              }
            }
          }

          const completionEntries = completionLines.map(line => createEntry('system', line));
          setGameState(prev => ({
            ...prev,
            history: [...prev.history, ...completionEntries],
          }));
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const newIndex = Math.min(historyIndex + 1, gameState.commandHistory.length - 1);
        if (newIndex >= 0 && gameState.commandHistory[newIndex]) {
          setHistoryIndex(newIndex);
          setInputValue(gameState.commandHistory[newIndex]);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const newIndex = historyIndex - 1;
        if (newIndex < 0) {
          setHistoryIndex(-1);
          setInputValue('');
        } else if (gameState.commandHistory[newIndex]) {
          setHistoryIndex(newIndex);
          setInputValue(gameState.commandHistory[newIndex]);
        }
      } else if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        setGameState(prev => ({ ...prev, history: [] }));
      } else if (e.key === 'Backspace') {
        // Play backspace sound if there's content to delete
        if (inputValue.length > 0) {
          playKeySound('Backspace');
        }
      }
    },
    [historyIndex, gameState.commandHistory, inputValue, getCompletions, playKeySound]
  );

  // Get status bar content
  const getStatusBar = () => {
    const parts: string[] = [];

    if (gameState.detectionLevel >= DETECTION_THRESHOLDS.SUSPICIOUS) {
      parts.push('AUDIT: ACTIVE');
    }
    if (gameState.sessionStability < 50) {
      parts.push('SESSION: UNSTABLE');
    }
    if (gameState.flags.adminUnlocked) {
      parts.push('ACCESS: ADMIN');
    }
    if (gameState.paranoiaLevel >= 40) {
      parts.push('PARANOIA: ELEVATED');
    } else if (gameState.paranoiaLevel >= 15) {
      parts.push('PARANOIA: ACTIVE');
    }
    if (gameState.isGameOver) {
      parts.push(gameState.gameOverReason || 'TERMINATED');
    }

    return parts.join(' │ ') || 'SYSTEM NOMINAL';
  };

  // Get save indicator text
  const getSaveIndicator = () => {
    if (!gameState.lastSaveTime) return null;
    const elapsed = Math.floor((Date.now() - gameState.lastSaveTime) / 60000);
    if (elapsed < 1) return 'Saved: <1m ago';
    if (elapsed < 60) return `Saved: ${elapsed}m ago`;
    const hours = Math.floor(elapsed / 60);
    return `Saved: ${hours}h ago`;
  };

  // Get evidence tier symbol for a category
  const getEvidenceSymbol = (category: string): string => {
    const tier = gameState.evidenceTiers?.[category];
    if (!tier) return '□'; // Not discovered
    switch (tier.tier) {
      case 'proven':
        return '●'; // Filled circle - proven
      case 'corroborated':
        return '◆'; // Filled diamond - linked
      case 'fragment':
        return '○'; // Empty circle - fragment only
      default:
        return '□';
    }
  };

  // Get CSS class for evidence tier
  const getEvidenceClass = (category: string): string => {
    const tier = gameState.evidenceTiers?.[category];
    if (!tier) return styles.truthMissing;
    switch (tier.tier) {
      case 'proven':
        return styles.truthProven;
      case 'corroborated':
        return styles.truthCorroborated;
      case 'fragment':
        return styles.truthFragment;
      default:
        return styles.truthMissing;
    }
  };

  // Get truth discovery status (for backward compatibility)
  const getTruthStatus = () => {
    const truths = gameState.truthsDiscovered;
    return {
      recovered: truths.has('debris_relocation'),
      captured: truths.has('being_containment'),
      communicated: truths.has('telepathic_scouts'),
      involved: truths.has('international_actors'),
      future: truths.has('transition_2026'),
      total: truths.size,
    };
  };

  // Count proven evidence (for victory condition display)
  const getProvenCount = (): number => {
    if (!gameState.evidenceTiers) return 0;
    return Object.values(gameState.evidenceTiers).filter(t => t.tier === 'proven').length;
  };

  // Get risk level display with percentage
  const getRiskLevel = () => {
    const detection = gameState.detectionLevel;
    const percent = `${detection}%`;
    if (detection >= 80) return { level: `CRITICAL ${percent}`, color: 'critical' };
    if (detection >= 60) return { level: `HIGH ${percent}`, color: 'high' };
    if (detection >= 40) return { level: `ELEVATED ${percent}`, color: 'elevated' };
    if (detection >= 20) return { level: `LOW ${percent}`, color: 'low' };
    return { level: `MINIMAL ${percent}`, color: 'minimal' };
  };

  // Get wrong attempts display (shows attempts made, not remaining)
  const getAttemptsDisplay = () => {
    const attempts = gameState.wrongAttempts || 0;
    return `${attempts}/${MAX_WRONG_ATTEMPTS}`;
  };

  const truthStatus = getTruthStatus();
  const riskInfo = getRiskLevel();

  // Render terminal entry
  // Render text with redaction styling (████████)
  const renderTextWithRedactions = (text: string) => {
    // Check if text contains redaction blocks (█ characters)
    if (!text.includes('█') && !text.includes('[REDACTED]') && !text.includes('[DATA LOSS]')) {
      return text;
    }

    // Split and render with special styling for redacted parts
    const parts: React.ReactNode[] = [];

    // Pattern for redacted sections
    const redactionPattern = /(█+|\[REDACTED\]|\[DATA LOSS\]|\[CLASSIFIED\])/g;
    let lastIndex = 0;
    let match;

    while ((match = redactionPattern.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex, match.index)}</span>);
      }
      // Add the redacted part with special styling (use match.index for stable key)
      parts.push(
        <span key={`redact-${match.index}`} className={styles.redacted} title="CLASSIFIED">
          {match[0]}
        </span>
      );
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex)}</span>);
    }

    return <>{parts}</>;
  };

  const renderEntry = (entry: TerminalEntry) => {
    let className = styles.line;

    switch (entry.type) {
      case 'input':
        className = `${styles.line} ${styles.input}`;
        break;
      case 'error':
        className = `${styles.line} ${styles.error}`;
        break;
      case 'warning':
        className = `${styles.line} ${styles.warning}`;
        break;
      case 'system':
        className = `${styles.line} ${styles.system}`;
        break;
      case 'notice':
        className = `${styles.line} ${styles.notice}`;
        break;
      case 'ufo74':
        className = `${styles.line} ${styles.ufo74}`;
        break;
      case 'file':
        className = `${styles.line} ${styles.fileContent}`;
        break;
    }

    return (
      <div key={entry.id} className={className}>
        {renderTextWithRedactions(entry.content)}
      </div>
    );
  };

  // Render different phases
  if (gamePhase === 'blackout') {
    return <Blackout onCompleteAction={handleBlackoutComplete} />;
  }

  if (gamePhase === 'icq') {
    return (
      <ICQChat
        onVictoryAction={handleVictory}
        initialTrust={gameState.icqTrust}
        onTrustChange={handleIcqTrustChange}
        onMathMistake={handleIcqMathMistake}
        onLeakChoice={handleIcqLeakChoice}
        onFilesSent={handleIcqFilesSent}
      />
    );
  }

  if (gamePhase === 'victory') {
    return (
      <Victory
        onRestartAction={handleRestart}
        commandCount={gameState.sessionCommandCount}
        detectionLevel={gameState.detectionLevel}
        maxDetectionReached={maxDetectionRef.current}
        mathMistakes={gameState.mathQuestionWrong}
        evidenceLinks={gameState.evidenceLinks}
        wrongAttempts={gameState.wrongAttempts}
        choiceLeakPath={gameState.choiceLeakPath}
        rivalInvestigatorActive={gameState.rivalInvestigatorActive}
        filesReadCount={gameState.filesRead?.size || 0}
      />
    );
  }

  if (gamePhase === 'bad_ending') {
    return (
      <BadEnding
        onRestartAction={handleRestart}
        reason={gameState.gameOverReason}
        commandCount={gameState.sessionCommandCount}
        detectionLevel={gameState.detectionLevel}
      />
    );
  }

  if (gamePhase === 'neutral_ending') {
    return (
      <NeutralEnding
        onRestartAction={handleRestart}
        commandCount={gameState.sessionCommandCount}
        detectionLevel={gameState.detectionLevel}
      />
    );
  }

  if (gamePhase === 'secret_ending') {
    return (
      <SecretEnding
        onRestartAction={handleRestart}
        commandCount={gameState.sessionCommandCount}
        detectionLevel={gameState.detectionLevel}
      />
    );
  }

  return (
    <FloatingUIProvider>
      <div
        className={`${styles.terminal} ${flickerActive ? styles.flicker : ''} ${glitchActive ? styles.glitchActive : ''} ${glitchHeavy ? styles.glitchHeavy : ''} ${isShaking ? styles.shaking : ''} ${isWarmingUp ? styles.warmingUp : ''}`}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Scanlines overlay */}
        <div className={styles.scanlines} />

        {/* Screen burn-in effect - ghost text from previous outputs */}
        {burnInLines.length > 0 && (
          <div className={styles.burnIn}>
            {burnInLines.map((line, i) => (
              <div
                key={i}
                className={styles.burnInLine}
                style={{ opacity: 0.02 * (burnInLines.length - i) }}
              >
                {line}
              </div>
            ))}
          </div>
        )}

        {/* Paranoia message overlay */}
        {paranoiaMessage && <div className={styles.paranoiaMessage}>{paranoiaMessage}</div>}

        {/* Firewall Eyes - hostile surveillance entities */}
        {gameState.tutorialComplete && !gameState.isGameOver && (
          <FirewallEyes
            detectionLevel={gameState.detectionLevel}
            firewallActive={gameState.firewallActive}
            firewallDisarmed={gameState.firewallDisarmed}
            eyes={gameState.firewallEyes}
            lastEyeSpawnTime={gameState.lastEyeSpawnTime}
            paused={activeImage !== null || activeVideo !== null}
            onEyeClick={handleFirewallEyeClick}
            onEyeDetonate={handleFirewallEyeDetonate}
            onSpawnEyeBatch={handleFirewallEyeBatchSpawn}
            onActivateFirewall={handleFirewallActivate}
            onPauseChanged={handleFirewallPauseChanged}
          />
        )}

        {/* Sound toggle moved to Settings menu (ESC -> Settings) */}

        {/* Countdown timer */}
        {countdownDisplay && (
          <FloatingElement id="countdown-timer" zone="top-center" priority={1} baseOffset={80}>
            <div className={styles.countdownTimerContent}>
              <span className={styles.countdownLabel}>⚠️ TRACE ACTIVE</span>
              <span className={styles.countdownTime}>{countdownDisplay}</span>
            </div>
          </FloatingElement>
        )}

        {/* Status bar with dropdown menu */}
        <div className={styles.statusBar}>
          <span
            className={`${styles.statusLeft} ${styles.clickable}`}
            onClick={() => setShowHeaderMenu(!showHeaderMenu)}
          >
            VARGINHA: TERMINAL 1996 ▼
          </span>
          {/* ESC button */}
          <button
            className={styles.escButton}
            onClick={() => setShowPauseMenu(true)}
            title="Pause Menu (ESC)"
          >
            ESC
          </button>
          {getSaveIndicator() && <span className={styles.saveIndicator}>{getSaveIndicator()}</span>}
          <span className={styles.statusRight}>{getStatusBar()}</span>

          {/* Dropdown menu */}
          {showHeaderMenu && (
            <div className={styles.headerMenu}>
              <button
                className={styles.menuItem}
                onClick={() => {
                  onSaveRequestAction(gameState);
                  setShowHeaderMenu(false);
                }}
              >
                💾 SAVE SESSION
              </button>
              <button
                className={styles.menuItem}
                onClick={() => {
                  setShowHeaderMenu(false);
                  onExitAction();
                }}
              >
                📂 LOAD SESSION
              </button>
              <button
                className={styles.menuItem}
                onClick={() => {
                  setShowSettings(true);
                  setShowHeaderMenu(false);
                }}
              >
                ⚙️ SETTINGS
              </button>
              <button
                className={styles.menuItem}
                onClick={() => {
                  setShowAchievements(true);
                  setShowHeaderMenu(false);
                }}
              >
                🏆 ACHIEVEMENTS
              </button>
              <button
                className={styles.menuItem}
                onClick={() => {
                  setShowStatistics(true);
                  setShowHeaderMenu(false);
                }}
              >
                📊 STATISTICS
              </button>
              <button
                className={styles.menuItem}
                onClick={() => {
                  setShowHeaderMenu(false);
                  onExitAction();
                }}
              >
                🚪 RETURN TO MENU
              </button>
            </div>
          )}
        </div>

        {/* Progress tracker */}
        <div className={styles.progressTracker}>
          <div
            className={`${styles.truthsSection} ${showEvidenceTracker ? styles.trackerVisible : styles.trackerHidden}`}
          >
            <span className={styles.trackerLabel}>EVIDENCE:</span>
            <span
              className={getEvidenceClass('debris_relocation')}
              title="Physical debris/materials recovered"
            >
              {getEvidenceSymbol('debris_relocation')} RECOVERED
            </span>
            <span
              className={getEvidenceClass('being_containment')}
              title="Beings/specimens captured"
            >
              {getEvidenceSymbol('being_containment')} CAPTURED
            </span>
            <span
              className={getEvidenceClass('telepathic_scouts')}
              title="Communication/telepathy evidence"
            >
              {getEvidenceSymbol('telepathic_scouts')} SIGNALS
            </span>
            <span
              className={getEvidenceClass('international_actors')}
              title="International involvement"
            >
              {getEvidenceSymbol('international_actors')} FOREIGN
            </span>
            <span
              className={getEvidenceClass('transition_2026')}
              title="Future plans/timeline window"
            >
              {getEvidenceSymbol('transition_2026')} NEXT
            </span>
            <span className={styles.truthCount}>[{getProvenCount()}/5]</span>
          </div>
          <div className={`${styles.riskSection} ${riskPulse ? styles.riskPulse : ''}`}>
            <span className={styles.trackerLabel}>RISK:</span>
            <span className={`${styles.riskLevel} ${styles[riskInfo.color]}`}>
              {riskInfo.level}
            </span>
            <span className={styles.memoryLevel}>ATT: {getAttemptsDisplay()}</span>
          </div>
        </div>

        {/* Output area */}
        <div className={styles.output} ref={outputRef}>
          {gameState.history.map(renderEntry)}
          {isProcessing && (
            <div className={`${styles.line} ${styles.processing}`}>Processing...</div>
          )}
          {/* Blinking terminal cursor at end of text when in enter-only mode */}
          {!isProcessing &&
            (!gameState.tutorialComplete ||
              encryptedChannelState !== 'idle' ||
              pendingImage ||
              pendingVideo ||
              pendingUfo74StartMessages.length > 0 ||
              (gameState.ufo74SecretDiscovered && gamePhase === 'terminal')) &&
            !gameState.isGameOver && <span className={styles.terminalCursor}>▌</span>}
        </div>

        {/* Input area */}
        {/* Show subtle enter prompt when in enter-only mode (tutorial, encrypted channel, pending media, staged UFO74, secret ending confirmation) */}
        {(!gameState.tutorialComplete ||
          encryptedChannelState !== 'idle' ||
          pendingImage ||
          pendingVideo ||
          pendingUfo74StartMessages.length > 0 ||
          (gameState.ufo74SecretDiscovered && gamePhase === 'terminal')) &&
        !gameState.isGameOver ? (
          <>
            {/* Hidden form for keyboard enter handling */}
            <form
              onSubmit={handleSubmit}
              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
            >
              <button type="submit" autoFocus />
            </form>
            {/* Centered enter prompt */}
            <FloatingElement id="enter-prompt" zone="bottom-center" priority={1} baseOffset={32}>
              <button
                type="button"
                className={styles.enterPromptContent}
                disabled={isProcessing}
                onClick={handleSubmit as unknown as React.MouseEventHandler}
                tabIndex={-1}
              >
                <span className={styles.enterPromptSymbol}>↵</span>
                <span className={styles.enterPromptText}>
                  {encryptedChannelState === 'awaiting_close'
                    ? 'close'
                    : encryptedChannelState !== 'idle'
                      ? 'respond'
                      : pendingImage || pendingVideo
                        ? 'view'
                        : pendingUfo74StartMessages.length > 0
                          ? 'continue'
                          : !gameState.tutorialComplete
                            ? ''
                            : 'continue'}
                </span>
              </button>
            </FloatingElement>
          </>
        ) : (
          <form onSubmit={handleSubmit} className={styles.inputArea}>
            <span className={styles.prompt}>&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => {
                const newValue = e.target.value;
                setInputValue(newValue);
                if (newValue.length > inputValue.length) {
                  // Detect the typed character (last char of new value)
                  const typedChar = newValue.charAt(newValue.length - 1);
                  playKeySound(typedChar === ' ' ? ' ' : typedChar);

                  // Track typing speed
                  const now = Date.now();
                  keypressTimestamps.current.push(now);
                  // Keep only last KEYPRESS_TRACK_SIZE keypresses
                  if (keypressTimestamps.current.length > KEYPRESS_TRACK_SIZE) {
                    keypressTimestamps.current.shift();
                  }

                  // Check typing speed (if enough chars in short time = too fast)
                  if (keypressTimestamps.current.length >= KEYPRESS_TRACK_SIZE - 2) {
                    const oldest = keypressTimestamps.current[0];
                    const timeSpan = (now - oldest) / 1000; // seconds
                    const charsPerSecond = keypressTimestamps.current.length / timeSpan;

                    if (charsPerSecond > SUSPICIOUS_TYPING_SPEED && !typingSpeedWarning) {
                      setTypingSpeedWarning(true);
                      playSound('warning');
                      // Clear warning after timeout
                      if (typingSpeedWarningTimeout.current) {
                        clearTimeout(typingSpeedWarningTimeout.current);
                      }
                      typingSpeedWarningTimeout.current = setTimeout(
                        () => setTypingSpeedWarning(false),
                        TYPING_WARNING_TIMEOUT_MS
                      );
                    }
                  }
                }
              }}
              onKeyDown={handleKeyDown}
              className={styles.inputField}
              disabled={isProcessing || gameState.isGameOver}
              autoFocus
              autoComplete="off"
              spellCheck={false}
            />
            <span className={styles.cursor}>_</span>
          </form>
        )}

        {/* Typing speed warning - floating above input area */}
        {typingSpeedWarning && (
          <FloatingElement id="typing-warning" zone="bottom-center" priority={1} baseOffset={70}>
            <span className={styles.typingWarningContent}>SUSPICIOUS TYPING PATTERN DETECTED</span>
          </FloatingElement>
        )}

        {/* Timed decryption timer overlay */}
        {gameState.timedDecryptActive && timedDecryptRemaining > 0 && (
          <FloatingElement id="timed-decrypt-timer" zone="top-right" priority={1} baseOffset={130}>
            <div className={styles.timedDecryptTimerContent}>
              <div className={styles.timerLabel}>DECRYPTION WINDOW</div>
              <div className={styles.timerValue}>{(timedDecryptRemaining / 1000).toFixed(1)}s</div>
              <div className={styles.timerSequence}>Sequence: {gameState.timedDecryptSequence}</div>
            </div>
          </FloatingElement>
        )}

        {/* Hacker avatar HUD panel */}
        {gameState.tutorialComplete && (
          <HackerAvatar
            expression={(gameState.avatarExpression as AvatarExpression) || 'neutral'}
            detectionLevel={gameState.detectionLevel}
            sessionStability={gameState.sessionStability}
            onExpressionTimeout={() => {
              setGameState(prev => ({ ...prev, avatarExpression: 'neutral' }));
            }}
          />
        )}

        {/* Image overlay */}
        {activeImage && (
          <ImageOverlay
            src={activeImage.src}
            alt={activeImage.alt}
            tone={activeImage.tone}
            corrupted={activeImage.corrupted}
            onCloseAction={() => {
              // Add "Media recovered" message to terminal
              const recoveredMessage = createEntry(
                'system',
                '[SYSTEM: Media recovered. Visual data archived to session log.]'
              );

              // Collect all UFO74 messages to show after image closes
              const allUfo74Messages: TerminalEntry[] = [];

              // First add any queued messages from the command result (content reactions)
              if (queuedAfterMediaMessages.length > 0) {
                allUfo74Messages.push(...queuedAfterMediaMessages);
                setQueuedAfterMediaMessages([]); // Clear the queue
              }

              // Then add image-specific comments
              const imageComments = UFO74_IMAGE_COMMENTS[activeImage.src];
              if (imageComments && imageComments.length > 0) {
                // Pick a random comment for variety
                const ufo74Comment = uiRandomPick(imageComments);
                allUfo74Messages.push(createEntry('ufo74', ufo74Comment));
              }

              setGameState(prev => ({
                ...prev,
                history: [...prev.history, recoveredMessage],
              }));
              if (allUfo74Messages.length > 0) {
                setPendingUfo74StartMessages(prev => [...prev, ...allUfo74Messages]);
              }
              setActiveImage(null);
              inputRef.current?.focus();
            }}
          />
        )}

        {/* Video overlay */}
        {activeVideo && (
          <VideoOverlay
            src={activeVideo.src}
            title={activeVideo.title}
            tone={activeVideo.tone}
            corrupted={activeVideo.corrupted}
            onCloseAction={() => {
              // Add "Media recovered" message to terminal
              const recoveredMessage = createEntry(
                'system',
                '[SYSTEM: Media recovered. Video data archived to session log.]'
              );

              // Check for queued UFO74 messages from the command result
              if (queuedAfterMediaMessages.length > 0) {
                setGameState(prev => ({
                  ...prev,
                  history: [...prev.history, recoveredMessage],
                }));
                setPendingUfo74StartMessages(prev => [...prev, ...queuedAfterMediaMessages]);
                setQueuedAfterMediaMessages([]); // Clear the queue
              } else {
                setGameState(prev => ({
                  ...prev,
                  history: [...prev.history, recoveredMessage],
                }));
              }
              setActiveVideo(null);
              inputRef.current?.focus();
            }}
          />
        )}

        {/* Turing Test overlay */}
        {showTuringTest && (
          <TuringTestOverlay
            onComplete={passed => {
              setShowTuringTest(false);

              if (passed) {
                // Turing test passed
                const passedMessages = [
                  createEntry('system', ''),
                  createEntry('notice', '  TURING EVALUATION: PASSED'),
                  createEntry('notice', '  SUBJECT IS NOT HUMAN, NOT A THREAT'),
                  createEntry('notice', '  Identity verified as authorized terminal process.'),
                  createEntry('system', ''),
                  createEntry('ufo74', 'UFO74: nice work, kid. you fooled the machine.'),
                  createEntry('ufo74', 'UFO74: keep digging.'),
                  createEntry('system', ''),
                ];
                setGameState(prev => ({
                  ...prev,
                  history: [...prev.history, ...passedMessages],
                  turingEvaluationActive: false,
                  turingEvaluationCompleted: true,
                  detectionLevel: Math.max(0, prev.detectionLevel - 10), // Reward: reduce detection
                }));
                playSound('success');
              } else {
                // Turing test failed - game over
                const failedMessages = [
                  createEntry('system', ''),
                  createEntry('error', '  TURING EVALUATION: FAILED'),
                  createEntry('error', '  Human behavioral patterns detected.'),
                  createEntry('error', '  TERMINATING SESSION.'),
                  createEntry('system', ''),
                ];
                setGameState(prev => ({
                  ...prev,
                  history: [...prev.history, ...failedMessages],
                  turingEvaluationActive: false,
                  isGameOver: true,
                  gameOverReason: 'TURING EVALUATION FAILED',
                  endingType: 'bad',
                }));
                playSound('error');
                setTimeout(() => {
                  setGameOverReason('TURING EVALUATION FAILED');
                  setShowGameOver(true);
                }, GAME_OVER_DELAY_MS);
              }

              inputRef.current?.focus();
            }}
          />
        )}

        {/* Game Over overlay */}
        {showGameOver && (
          <GameOver reason={gameOverReason} onRestartCompleteAction={onExitAction} />
        )}

        {/* Achievement popup */}
        {pendingAchievement && (
          <AchievementPopup
            achievement={pendingAchievement}
            onDismiss={() => setPendingAchievement(null)}
          />
        )}

        {/* Settings modal */}
        {showSettings && (
          <SettingsModal
            soundEnabled={soundEnabled}
            masterVolume={masterVolume}
            onToggleSound={toggleSound}
            onVolumeChange={setMasterVolume}
            onCloseAction={() => setShowSettings(false)}
          />
        )}

        {/* Achievement gallery */}
        {showAchievements && (
          <AchievementGallery onCloseAction={() => setShowAchievements(false)} />
        )}

        {/* Statistics modal */}
        {showStatistics && <StatisticsModal onCloseAction={() => setShowStatistics(false)} />}

        {/* Pause menu */}
        {showPauseMenu && (
          <PauseMenu
            onResumeAction={() => setShowPauseMenu(false)}
            onSaveAction={() => {
              setShowPauseMenu(false);
              onSaveRequestAction(gameState);
            }}
            onLoadAction={() => {
              setShowPauseMenu(false);
              onExitAction();
            }}
            onSettingsAction={() => {
              setShowPauseMenu(false);
              setShowSettings(true);
            }}
            onExitAction={() => {
              setShowPauseMenu(false);
              onExitAction();
            }}
          />
        )}
      </div>
    </FloatingUIProvider>
  );
}
