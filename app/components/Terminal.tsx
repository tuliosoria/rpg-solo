'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, TerminalEntry, ImageTrigger, VideoTrigger, StreamingMode, GamePhase } from '../types';
import { executeCommand, createEntry, getTutorialMessage, TUTORIAL_MESSAGES } from '../engine/commands';
import { listDirectory, resolvePath, getFileContent, getNode } from '../engine/filesystem';
import { autoSave } from '../storage/saves';
import { useSound } from '../hooks/useSound';
import { unlockAchievement, Achievement } from '../engine/achievements';
import ImageOverlay from './ImageOverlay';
import VideoOverlay from './VideoOverlay';
import GameOver from './GameOver';
import Blackout from './Blackout';
import ICQChat from './ICQChat';
import Victory from './Victory';
import BadEnding from './BadEnding';
import NeutralEnding from './NeutralEnding';
import SecretEnding from './SecretEnding';
import AchievementPopup from './AchievementPopup';
import HackerAvatar, { AvatarExpression } from './HackerAvatar';
import styles from './Terminal.module.css';

// Available commands for auto-completion
const COMMANDS = ['help', 'status', 'progress', 'ls', 'cd', 'back', 'open', 'last', 'unread', 'decrypt', 'recover', 'note', 'notes', 'bookmark', 'trace', 'chat', 'clear', 'save', 'exit', 'override', 'run', 'correlate', 'connect', 'map'];
const COMMANDS_WITH_FILE_ARGS = ['cd', 'open', 'decrypt', 'recover', 'run', 'bookmark', 'correlate', 'connect'];

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
const STREAMING_DELAYS: Record<StreamingMode, { base: number; variance: number; glitchChance: number; glitchDelay: number }> = {
  none: { base: 0, variance: 0, glitchChance: 0, glitchDelay: 0 },
  fast: { base: 25, variance: 15, glitchChance: 0, glitchDelay: 0 },
  normal: { base: 50, variance: 25, glitchChance: 0, glitchDelay: 0 },
  slow: { base: 80, variance: 40, glitchChance: 0.05, glitchDelay: 200 },
  glitchy: { base: 60, variance: 40, glitchChance: 0.15, glitchDelay: 400 },
};

interface TerminalProps {
  initialState: GameState;
  onExitAction: () => void;
  onSaveRequestAction: (state: GameState) => void;
}

export default function Terminal({ initialState, onExitAction, onSaveRequestAction }: TerminalProps) {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [flickerActive, setFlickerActive] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [activeImage, setActiveImage] = useState<ImageTrigger | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoTrigger | null>(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState('');
  
  // Game phase: terminal → blackout → icq → victory (or other endings)
  const [gamePhase, setGamePhase] = useState<GamePhase>('terminal');
  
  // Countdown timer display
  const [countdownDisplay, setCountdownDisplay] = useState<string | null>(null);
  
  // Glitch effects
  const [glitchActive, setGlitchActive] = useState(false);
  const [glitchHeavy, setGlitchHeavy] = useState(false);
  
  // Paranoia messages
  const [paranoiaMessage, setParanoiaMessage] = useState<string | null>(null);
  const [paranoiaPosition, setParanoiaPosition] = useState({ top: 0, left: 0 });
  
  // Achievement popup
  const [pendingAchievement, setPendingAchievement] = useState<Achievement | null>(null);
  
  // Progressive UI reveal during tutorial
  const [showEvidenceTracker, setShowEvidenceTracker] = useState(false);
  const [showRiskTracker, setShowRiskTracker] = useState(false);
  
  // Typing speed tracking
  const [typingSpeedWarning, setTypingSpeedWarning] = useState(false);
  const keypressTimestamps = useRef<number[]>([]);
  
  // Timed decryption timer display
  const [timedDecryptRemaining, setTimedDecryptRemaining] = useState(0);
  
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
  const { playSound, startAmbient, stopAmbient, toggleSound, soundEnabled } = useSound();
  
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
          behavior: 'smooth'
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
      }
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [gameState]);
  
  // Phase transition: when evidencesSaved becomes true, trigger blackout
  useEffect(() => {
    if (gameState.evidencesSaved && gamePhase === 'terminal') {
      const timer = setTimeout(() => {
        setGamePhase('blackout');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gameState.evidencesSaved, gamePhase]);
  
  // Random glitch effects based on detection level - INTENSITY SCALING
  useEffect(() => {
    if (gamePhase !== 'terminal' || gameState.isGameOver) return;
    
    const detection = gameState.detectionLevel;
    // Higher detection = more frequent AND more intense glitches
    // Scaled intensity: at 20%: rare light, at 50%: occasional medium, at 80%+: frequent heavy
    const glitchChance = detection > 20 ? (detection - 20) * 0.35 : 0;
    
    // Check interval scales with detection (faster at higher levels)
    const checkInterval = Math.max(1500, 4000 - detection * 25);
    
    const interval = setInterval(() => {
      if (Math.random() * 100 < glitchChance) {
        if (detection >= 80) {
          // Critical glitch - screen shake, heavy effects, sound
          setGlitchHeavy(true);
          playSound('glitch');
          playSound('static');
          setTimeout(() => {
            setGlitchHeavy(false);
            // Double glitch at very high detection
            if (detection >= 90 && Math.random() < 0.5) {
              setTimeout(() => {
                setGlitchHeavy(true);
                playSound('glitch');
                setTimeout(() => setGlitchHeavy(false), 300);
              }, 200);
            }
          }, 600);
        } else if (detection >= 60) {
          // Heavy glitch at high detection
          setGlitchHeavy(true);
          playSound('glitch');
          setTimeout(() => setGlitchHeavy(false), 500);
        } else if (detection >= 40) {
          // Medium glitch - longer duration
          setGlitchActive(true);
          playSound('static');
          setTimeout(() => setGlitchActive(false), 400);
        } else {
          // Light glitch
          setGlitchActive(true);
          playSound('static');
          setTimeout(() => setGlitchActive(false), 200);
        }
      }
    }, checkInterval);
    
    return () => clearInterval(interval);
  }, [gameState.detectionLevel, gameState.isGameOver, gamePhase, playSound]);
  
  // "They're watching" paranoia messages
  useEffect(() => {
    if (gamePhase !== 'terminal' || gameState.isGameOver) return;
    
    const detection = gameState.detectionLevel;
    // Only trigger paranoia at elevated detection (30%+)
    if (detection < 30) return;
    
    // Higher detection = more frequent paranoia (every 20-60s)
    const baseInterval = 60000 - (detection * 400); // 60s at 30%, 28s at 80%
    const variance = 20000;
    
    const delay = baseInterval + Math.random() * variance;
    let innerTimerId: NodeJS.Timeout | undefined;
    
    const timerId = setTimeout(() => {
      const message = PARANOIA_MESSAGES[Math.floor(Math.random() * PARANOIA_MESSAGES.length)];
      // Ensure position stays within viewport bounds
      const maxTop = Math.max(100, window.innerHeight - 100);
      const maxLeft = Math.max(50, window.innerWidth - 350);
      const top = 100 + Math.random() * Math.max(0, maxTop - 100);
      const left = 50 + Math.random() * Math.max(0, maxLeft - 50);
      
      setParanoiaPosition({ top, left });
      setParanoiaMessage(message);
      playSound('warning');
      
      // Clear after animation
      innerTimerId = setTimeout(() => setParanoiaMessage(null), 3000);
    }, delay);
    
    return () => {
      clearTimeout(timerId);
      if (innerTimerId) clearTimeout(innerTimerId);
    };
  }, [gameState.detectionLevel, gameState.isGameOver, gamePhase, playSound]);
  
  // Track detection level changes for sound/visual alerts
  useEffect(() => {
    const prev = prevDetectionRef.current;
    const current = gameState.detectionLevel;
    
    // Track max detection ever reached
    if (current > maxDetectionRef.current) {
      maxDetectionRef.current = current;
    }
    
    if (current > prev) {
      // Detection increased
      if (current >= 80 && prev < 80) {
        playSound('alert');
      } else if (current >= 60 && prev < 60) {
        playSound('warning');
      } else if (current >= 40 && prev < 40) {
        playSound('warning');
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
  
  // Check for secret ending trigger
  useEffect(() => {
    if (gameState.ufo74SecretDiscovered && gamePhase === 'terminal') {
      // Delay to let player see the reveal
      const timer = setTimeout(() => {
        setGamePhase('secret_ending');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gameState.ufo74SecretDiscovered, gamePhase]);
  
  // Idle hint system - nudge players who seem stuck
  const idleHintTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTimeRef = useRef<number>(0);
  const gameStateRef = useRef(gameState); // Ref to access current state without re-triggering effect
  
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
    { hint: "Have you checked /internal?", condition: (s: GameState) => s.currentPath === '/' && !s.filesRead?.has('/internal/session_objectives.txt') },
    { hint: "Try 'open' on a .txt file to read it.", condition: (s: GameState) => (s.filesRead?.size || 0) === 0 },
    { hint: "Use 'ls' to see what's in the current directory.", condition: (s: GameState) => s.sessionCommandCount < 5 },
    { hint: "Some files are ENCRYPTED. You'll need 'decrypt' for those.", condition: (s: GameState) => (s.categoriesRead?.size || 0) >= 2 && (s.truthsDiscovered?.size || 0) < 2 },
    { hint: "Try the 'progress' command to see what you've found.", condition: (s: GameState) => (s.truthsDiscovered?.size || 0) >= 1 },
    { hint: "The /comms directory might have useful intel.", condition: (s: GameState) => !s.currentPath.includes('comms') && !s.filesRead?.has('/comms/radio_intercept_log.txt') },
    { hint: "Don't forget: 'note' saves reminders, 'bookmark' saves files.", condition: (s: GameState) => (s.filesRead?.size || 0) >= 5 && (s.playerNotes?.length || 0) === 0 },
    { hint: "Check 'unread' to see what you haven't opened yet.", condition: (s: GameState) => (s.filesRead?.size || 0) >= 3 },
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
      
      // Find an applicable hint
      const applicableHints = IDLE_HINTS.filter(h => h.condition(currentState));
      if (applicableHints.length === 0) return;
      
      const hint = applicableHints[Math.floor(Math.random() * applicableHints.length)];
      
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
  }, [gameState.history.length, gamePhase, gameState.isGameOver, gameState.tutorialStep, playSound]);
  
  // Check for achievements
  const checkAchievement = useCallback((id: string) => {
    const result = unlockAchievement(id);
    if (result?.isNew) {
      setPendingAchievement(result.achievement);
      playSound('success');
    }
  }, [playSound]);
  
  // Handle blackout complete - transition to ICQ
  const handleBlackoutComplete = useCallback(() => {
    setGamePhase('icq');
  }, []);
  
  // Handle victory from ICQ chat
  const handleVictory = useCallback(() => {
    setGamePhase('victory');
    setGameState(prev => ({ ...prev, gameWon: true }));
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
  
  // Stream output lines with variable timing
  const streamOutput = useCallback(async (
    entries: TerminalEntry[],
    mode: StreamingMode,
    baseState: GameState
  ): Promise<void> => {
    if (mode === 'none' || entries.length === 0) {
      // No streaming - add all at once
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
        setGameState(prev => ({
          ...prev,
          history: [...prev.history, ...remaining],
        }));
        break;
      }
      
      // Add single entry
      const entry = entries[i];
      setGameState(prev => ({
        ...prev,
        history: [...prev.history, entry],
      }));
      
      // Calculate delay with variance
      let delay = config.base + (Math.random() * config.variance * 2 - config.variance);
      
      // Random glitch pause
      if (Math.random() < config.glitchChance) {
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
  }, [triggerFlicker]);
  
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
  
  // Handle command submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // During tutorial, only accept empty Enter to advance
    if (!gameState.tutorialComplete) {
      // If user typed something, show error
      if (inputValue.trim()) {
        const errorEntry = createEntry('error', 'ERROR: Incoming transmission in progress. Press ENTER to continue.');
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
      // Step 9: Risk tracker reveal (after showing risk warning)
      if (currentStep === 8) {
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
    
    if (isProcessing || !inputValue.trim()) return;
    
    const command = inputValue.trim();
    const commandLower = command.toLowerCase().split(' ')[0];
    setInputValue('');
    
    // Play command-specific sound on submit
    const dangerousCommands = ['decrypt', 'recover', 'trace', 'override'];
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
    let newState: GameState = {
      ...gameState,
      history: [...gameState.history, inputEntry],
      commandHistory: [command, ...gameState.commandHistory.slice(0, 49)],
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
      // Save scroll position before streaming starts (where file content will begin)
      if (outputRef.current) {
        streamStartScrollPos.current = outputRef.current.scrollHeight;
      }
      setIsStreaming(true);
      setGameState(intermediateState);
      
      await streamOutput(result.output, streamingMode, intermediateState);
      
      setIsStreaming(false);
      setIsProcessing(false);
    } else {
      // No streaming - add all at once
      setGameState({
        ...intermediateState,
        history: [...newState.history, ...result.output],
      });
      setIsProcessing(false);
    }
    
    // Show image if triggered
    if (result.imageTrigger) {
      setActiveImage(result.imageTrigger);
    }
    
    // Show video if triggered
    if (result.videoTrigger) {
      setActiveVideo(result.videoTrigger);
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
    
    // First evidence discovered
    if (truthCount > 0 && prevTruthCount === 0) {
      checkAchievement('first_blood');
    }
    
    // All truths discovered
    if (truthCount === 5 && prevTruthCount < 5) {
      checkAchievement('truth_seeker');
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
    
    // Focus input after processing (use setTimeout to ensure it runs after React updates)
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [gameState, inputValue, isProcessing, onExitAction, onSaveRequestAction, triggerFlicker, streamOutput, playSound, checkAchievement]);
  
  // Get auto-complete suggestions
  const getCompletions = useCallback((input: string): string[] => {
    const trimmed = input.trimStart();
    const parts = trimmed.split(/\s+/);
    
    if (parts.length <= 1) {
      // Complete command names
      const partial = parts[0].toLowerCase();
      return COMMANDS.filter(cmd => cmd.startsWith(partial));
    }
    
    // Complete file/directory arguments for specific commands
    const cmd = parts[0].toLowerCase();
    if (!COMMANDS_WITH_FILE_ARGS.includes(cmd)) return [];
    
    const partial = parts[parts.length - 1];
    const currentPath = gameState.currentPath;
    
    // Determine the directory to search and the prefix to match
    let searchDir = currentPath;
    let prefix = partial;
    
    if (partial.includes('/')) {
      const lastSlash = partial.lastIndexOf('/');
      const dirPart = partial.substring(0, lastSlash + 1);
      prefix = partial.substring(lastSlash + 1);
      searchDir = resolvePath(dirPart, currentPath);
    }
    
    const entries = listDirectory(searchDir, gameState);
    if (!entries) return [];
    
    // Filter entries that match the prefix
    const matches = entries
      .map(e => e.name.replace(/\/$/, '')) // Remove trailing slash for matching
      .filter(name => name.toLowerCase().startsWith(prefix.toLowerCase()));
    
    // For 'cd', only show directories
    if (cmd === 'cd') {
      const dirEntries = entries.filter(e => e.type === 'dir');
      return dirEntries
        .map(e => e.name.replace(/\/$/, ''))
        .filter(name => name.toLowerCase().startsWith(prefix.toLowerCase()));
    }
    
    return matches;
  }, [gameState]);
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const completions = getCompletions(inputValue);
      
      if (completions.length === 1) {
        // Single match - complete it
        const parts = inputValue.trimStart().split(/\s+/);
        if (parts.length <= 1) {
          // Completing a command
          setInputValue(completions[0] + ' ');
        } else {
          // Completing a file/directory argument
          const cmd = parts[0];
          const partial = parts[parts.length - 1];
          let prefix = '';
          if (partial.includes('/')) {
            prefix = partial.substring(0, partial.lastIndexOf('/') + 1);
          }
          setInputValue(`${cmd} ${prefix}${completions[0]}`);
        }
      } else if (completions.length > 1) {
        // Multiple matches - show them in terminal and complete common prefix
        const commonPrefix = completions.reduce((acc, str) => {
          while (acc && !str.toLowerCase().startsWith(acc.toLowerCase())) {
            acc = acc.slice(0, -1);
          }
          return acc;
        }, completions[0]);
        
        // Update input with common prefix
        const parts = inputValue.trimStart().split(/\s+/);
        if (parts.length <= 1) {
          setInputValue(commonPrefix);
        } else {
          const cmd = parts[0];
          const partial = parts[parts.length - 1];
          let prefix = '';
          if (partial.includes('/')) {
            prefix = partial.substring(0, partial.lastIndexOf('/') + 1);
          }
          setInputValue(`${cmd} ${prefix}${commonPrefix}`);
        }
        
        // Show completions in terminal with file previews
        const parts2 = inputValue.trimStart().split(/\s+/);
        const cmd2 = parts2[0]?.toLowerCase();
        const isFileCommand = cmd2 === 'open' || cmd2 === 'decrypt';
        
        const completionLines: string[] = [];
        completionLines.push(completions.join('  '));
        
        // Show file preview for file commands
        if (isFileCommand && completions.length <= 3) {
          const partial2 = parts2[parts2.length - 1];
          let searchDir2 = gameState.currentPath;
          if (partial2.includes('/')) {
            const lastSlash = partial2.lastIndexOf('/');
            searchDir2 = resolvePath(partial2.substring(0, lastSlash + 1), gameState.currentPath);
          }
          
          for (const completion of completions) {
            const fullPath = searchDir2 === '/' ? `/${completion}` : `${searchDir2}/${completion}`;
            const node = getNode(fullPath, gameState);
            if (node && node.type === 'file') {
              const preview = getFileContent(fullPath, gameState);
              if (preview && preview.length > 0) {
                const firstLine = preview.find(line => line.trim().length > 0) || preview[0];
                const truncated = firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine;
                completionLines.push(`  ${completion}: "${truncated}"`);
              }
            }
          }
        }
        
        const completionEntries = completionLines.map(line => createEntry('system', line));
        setGameState(prev => ({
          ...prev,
          history: [...prev.history, ...completionEntries]
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
    }
  }, [historyIndex, gameState.commandHistory, inputValue, getCompletions]);
  
  // Get status bar content
  const getStatusBar = () => {
    const parts: string[] = [];
    
    if (gameState.detectionLevel >= 50) {
      parts.push('AUDIT: ACTIVE');
    }
    if (gameState.sessionStability < 50) {
      parts.push('SESSION: UNSTABLE');
    }
    if (gameState.flags.adminUnlocked) {
      parts.push('ACCESS: ADMIN');
    }
    if (gameState.isGameOver) {
      parts.push(gameState.gameOverReason || 'TERMINATED');
    }
    
    return parts.join(' │ ') || 'SYSTEM NOMINAL';
  };
  
  // Get truth discovery status
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
  
  // Get risk level display
  const getRiskLevel = () => {
    const detection = gameState.detectionLevel;
    if (detection >= 80) return { level: 'CRITICAL', color: 'critical' };
    if (detection >= 60) return { level: 'HIGH', color: 'high' };
    if (detection >= 40) return { level: 'ELEVATED', color: 'elevated' };
    if (detection >= 20) return { level: 'LOW', color: 'low' };
    return { level: 'MINIMAL', color: 'minimal' };
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
    return <ICQChat onVictoryAction={handleVictory} />;
  }
  
  if (gamePhase === 'victory') {
    return <Victory 
      onRestartAction={handleRestart} 
      commandCount={gameState.sessionCommandCount}
      detectionLevel={gameState.detectionLevel}
      maxDetectionReached={maxDetectionRef.current}
      mathMistakes={gameState.mathQuestionWrong}
    />;
  }
  
  if (gamePhase === 'bad_ending') {
    return <BadEnding 
      onRestartAction={handleRestart}
      reason={gameState.gameOverReason}
    />;
  }
  
  if (gamePhase === 'neutral_ending') {
    return <NeutralEnding onRestartAction={handleRestart} />;
  }
  
  if (gamePhase === 'secret_ending') {
    return <SecretEnding onRestartAction={handleRestart} />;
  }
  
  return (
    <div 
      className={`${styles.terminal} ${flickerActive ? styles.flicker : ''} ${glitchActive ? styles.glitchActive : ''} ${glitchHeavy ? styles.glitchHeavy : ''}`}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Scanlines overlay */}
      <div className={styles.scanlines} />
      
      {/* Screen burn-in effect - ghost text from previous outputs */}
      {burnInLines.length > 0 && (
        <div className={styles.burnIn}>
          {burnInLines.map((line, i) => (
            <div key={i} className={styles.burnInLine} style={{ opacity: 0.02 * (burnInLines.length - i) }}>
              {line}
            </div>
          ))}
        </div>
      )}
      
      {/* Paranoia message overlay */}
      {paranoiaMessage && (
        <div 
          className={styles.paranoiaMessage}
          style={{ top: paranoiaPosition.top, left: paranoiaPosition.left }}
        >
          {paranoiaMessage}
        </div>
      )}
      
      {/* Sound toggle button */}
      <button 
        className={`${styles.soundToggle} ${soundEnabled ? styles.active : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleSound();
        }}
        title={soundEnabled ? 'Sound: ON' : 'Sound: OFF'}
      >
        {soundEnabled ? '🔊' : '🔇'}
      </button>
      
      {/* Countdown timer */}
      {countdownDisplay && (
        <div className={styles.countdownTimer}>
          <span className={styles.countdownLabel}>⚠️ TRACE ACTIVE</span>
          <span className={styles.countdownTime}>{countdownDisplay}</span>
        </div>
      )}
      
      {/* Status bar */}
      <div className={styles.statusBar}>
        <span className={styles.statusLeft}>VARGINHA: TERMINAL 1996</span>
        <span className={styles.statusRight}>{getStatusBar()}</span>
      </div>
      
      {/* Progress tracker */}
      <div className={styles.progressTracker}>
        <div className={`${styles.truthsSection} ${showEvidenceTracker ? styles.trackerVisible : styles.trackerHidden}`}>
          <span className={styles.trackerLabel}>EVIDENCE:</span>
          <span className={truthStatus.recovered ? styles.truthFound : styles.truthMissing} title="Physical debris/materials recovered">
            {truthStatus.recovered ? '■' : '□'} RECOVERED
          </span>
          <span className={truthStatus.captured ? styles.truthFound : styles.truthMissing} title="Beings/specimens captured">
            {truthStatus.captured ? '■' : '□'} CAPTURED
          </span>
          <span className={truthStatus.communicated ? styles.truthFound : styles.truthMissing} title="Communication/telepathy evidence">
            {truthStatus.communicated ? '■' : '□'} SIGNALS
          </span>
          <span className={truthStatus.involved ? styles.truthFound : styles.truthMissing} title="International involvement">
            {truthStatus.involved ? '■' : '□'} FOREIGN
          </span>
          <span className={truthStatus.future ? styles.truthFound : styles.truthMissing} title="Future plans/2026 window">
            {truthStatus.future ? '■' : '□'} 2026
          </span>
          <span className={styles.truthCount}>
            [{truthStatus.total}/5]
          </span>
        </div>
      </div>
      
      {/* Output area */}
      <div className={styles.output} ref={outputRef}>
        {gameState.history.map(renderEntry)}
        {isProcessing && (
          <div className={`${styles.line} ${styles.processing}`}>
            Processing...
          </div>
        )}
      </div>
      
      {/* Input area */}
      <form onSubmit={handleSubmit} className={styles.inputArea}>
        <span className={styles.prompt}>&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            const newValue = e.target.value;
            setInputValue(newValue);
            if (newValue.length > inputValue.length) {
              playSound('keypress');
              
              // Track typing speed
              const now = Date.now();
              keypressTimestamps.current.push(now);
              // Keep only last 10 keypresses
              if (keypressTimestamps.current.length > 10) {
                keypressTimestamps.current.shift();
              }
              
              // Check typing speed (if 10+ chars in last second = too fast)
              if (keypressTimestamps.current.length >= 8) {
                const oldest = keypressTimestamps.current[0];
                const timeSpan = (now - oldest) / 1000; // seconds
                const charsPerSecond = keypressTimestamps.current.length / timeSpan;
                
                if (charsPerSecond > 8 && !typingSpeedWarning) {
                  setTypingSpeedWarning(true);
                  playSound('warning');
                  // Clear warning after 3 seconds
                  setTimeout(() => setTypingSpeedWarning(false), 3000);
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
          placeholder={!gameState.tutorialComplete ? 'Press ENTER to continue...' : ''}
        />
        <span className={styles.cursor}>_</span>
        {typingSpeedWarning && (
          <span className={styles.typingWarning}>SUSPICIOUS TYPING PATTERN DETECTED</span>
        )}
      </form>
      
      {/* Timed decryption timer overlay */}
      {gameState.timedDecryptActive && timedDecryptRemaining > 0 && (
        <div className={styles.timedDecryptTimer}>
          <div className={styles.timerLabel}>DECRYPTION WINDOW</div>
          <div className={styles.timerValue}>
            {(timedDecryptRemaining / 1000).toFixed(1)}s
          </div>
          <div className={styles.timerSequence}>
            Sequence: {gameState.timedDecryptSequence}
          </div>
        </div>
      )}
      
      {/* Hacker avatar HUD panel */}
      {gameState.tutorialComplete && (
        <HackerAvatar 
          expression={gameState.avatarExpression as AvatarExpression || 'neutral'}
          detectionLevel={gameState.detectionLevel}
          sessionStability={gameState.sessionStability}
          onExpressionTimeout={() => {
            setGameState(prev => ({ ...prev, avatarExpression: 'neutral' }));
          }}
        />
      )}
      
      {/* Exit button */}
      <button 
        className={styles.exitButton}
        onClick={onExitAction}
        title="Exit to Menu"
      >
        [ESC]
      </button>
      
      {/* Image overlay */}
      {activeImage && (
        <ImageOverlay
          src={activeImage.src}
          alt={activeImage.alt}
          tone={activeImage.tone}
          corrupted={activeImage.corrupted}
          onCloseAction={() => {
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
            setActiveVideo(null);
            inputRef.current?.focus();
          }}
        />
      )}
      
      {/* Game Over overlay */}
      {showGameOver && (
        <GameOver
          reason={gameOverReason}
          onRestartCompleteAction={onExitAction}
        />
      )}
      
      {/* Achievement popup */}
      {pendingAchievement && (
        <AchievementPopup
          achievement={pendingAchievement}
          onDismiss={() => setPendingAchievement(null)}
        />
      )}
    </div>
  );
}
