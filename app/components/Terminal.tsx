'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, TerminalEntry, ImageTrigger, VideoTrigger, StreamingMode, GamePhase } from '../types';
import { executeCommand, createEntry, getTutorialMessage, TUTORIAL_MESSAGES } from '../engine/commands';
import { listDirectory, resolvePath } from '../engine/filesystem';
import { autoSave } from '../storage/saves';
import { useSound } from '../hooks/useSound';
import { unlockAchievement, Achievement } from '../engine/achievements';
import ImageOverlay from './ImageOverlay';
import VideoOverlay from './VideoOverlay';
import GameOver from './GameOver';
import Blackout from './Blackout';
import ICQChat from './ICQChat';
import Victory from './Victory';
import AchievementPopup from './AchievementPopup';
import styles from './Terminal.module.css';

// Available commands for auto-completion
const COMMANDS = ['help', 'status', 'ls', 'cd', 'open', 'decrypt', 'recover', 'trace', 'chat', 'clear', 'save', 'exit', 'override', 'run'];
const COMMANDS_WITH_FILE_ARGS = ['cd', 'open', 'decrypt', 'recover', 'run'];

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
  
  // Game phase: terminal → blackout → icq → victory
  const [gamePhase, setGamePhase] = useState<GamePhase>('terminal');
  
  // Glitch effects
  const [glitchActive, setGlitchActive] = useState(false);
  const [glitchHeavy, setGlitchHeavy] = useState(false);
  
  // Paranoia messages
  const [paranoiaMessage, setParanoiaMessage] = useState<string | null>(null);
  const [paranoiaPosition, setParanoiaPosition] = useState({ top: 0, left: 0 });
  
  // Achievement popup
  const [pendingAchievement, setPendingAchievement] = useState<Achievement | null>(null);
  
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
  
  // Scroll to bottom when history changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [gameState.history]);
  
  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
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
  
  // Random glitch effects based on detection level
  useEffect(() => {
    if (gamePhase !== 'terminal' || gameState.isGameOver) return;
    
    const detection = gameState.detectionLevel;
    // Higher detection = more frequent glitches
    // At 20%: ~1% chance per interval, at 80%: ~15% chance
    const glitchChance = detection > 20 ? (detection - 20) * 0.25 : 0;
    
    const interval = setInterval(() => {
      if (Math.random() * 100 < glitchChance) {
        if (detection >= 60) {
          // Heavy glitch at high detection
          setGlitchHeavy(true);
          playSound('glitch');
          setTimeout(() => setGlitchHeavy(false), 500);
        } else {
          // Light glitch
          setGlitchActive(true);
          playSound('static');
          setTimeout(() => setGlitchActive(false), 300);
        }
      }
    }, 3000);
    
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
    const timerId = setTimeout(() => {
      const message = PARANOIA_MESSAGES[Math.floor(Math.random() * PARANOIA_MESSAGES.length)];
      const top = 100 + Math.random() * (window.innerHeight - 200);
      const left = 50 + Math.random() * (window.innerWidth - 400);
      
      setParanoiaPosition({ top, left });
      setParanoiaMessage(message);
      playSound('warning');
      
      // Clear after animation
      setTimeout(() => setParanoiaMessage(null), 3000);
    }, delay);
    
    return () => clearTimeout(timerId);
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
    setInputValue('');
    playSound('enter'); // Sound on command submit
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
    
    // God mode activated
    if (intermediateState.godMode && !gameState.godMode) {
      checkAchievement('doom_fan');
    }
    
    // Focus input after processing
    inputRef.current?.focus();
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
        
        // Show completions in terminal
        const completionEntry = createEntry('system', completions.join('  '));
        setGameState(prev => ({
          ...prev,
          history: [...prev.history, completionEntry]
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
    }
    
    return (
      <div key={entry.id} className={className}>
        {entry.content}
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
  
  return (
    <div 
      className={`${styles.terminal} ${flickerActive ? styles.flicker : ''} ${glitchActive ? styles.glitchActive : ''} ${glitchHeavy ? styles.glitchHeavy : ''}`}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Scanlines overlay */}
      <div className={styles.scanlines} />
      
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
      
      {/* Status bar */}
      <div className={styles.statusBar}>
        <span className={styles.statusLeft}>VARGINHA: TERMINAL 1996</span>
        <span className={styles.statusRight}>{getStatusBar()}</span>
      </div>
      
      {/* Progress tracker */}
      <div className={styles.progressTracker}>
        <div className={styles.truthsSection}>
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
        <div className={styles.riskSection}>
          <span className={styles.trackerLabel}>RISK:</span>
          <div className={styles.riskBar}>
            <div 
              className={`${styles.riskFill} ${styles[riskInfo.color]}`} 
              style={{ width: `${gameState.detectionLevel}%` }}
            />
          </div>
          <span className={`${styles.riskLevel} ${styles[riskInfo.color]}`}>
            {riskInfo.level}
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
            setInputValue(e.target.value);
            if (e.target.value.length > inputValue.length) {
              playSound('keypress');
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
      </form>
      
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
