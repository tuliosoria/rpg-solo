'use client';

import { useState, useEffect, useRef } from 'react';
import type { Achievement } from '../engine/achievements';
import type {
  GamePhase,
  GameState,
  ImageTrigger,
  TerminalEntry,
  VideoTrigger,
} from '../types';

type EncryptedChannelState = 'idle' | 'awaiting_open' | 'open' | 'awaiting_close';

export function useTerminalState(initialState: GameState, initialPhase: GamePhase) {
  const [gameState, setGameState] = useState<GameState>(initialState);
  
  // Track if this is the first render to avoid running sync effect on mount
  const isFirstRender = useRef(true);
  // Track the seed to detect when a different game state is passed in (e.g., checkpoint load)
  const prevSeedRef = useRef(initialState.seed);
  const prevLastSaveTimeRef = useRef(initialState.lastSaveTime);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [flickerActive, setFlickerActive] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [activeImage, setActiveImage] = useState<ImageTrigger | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoTrigger | null>(null);
  const [pendingImage, setPendingImage] = useState<ImageTrigger | null>(null);
  const [pendingVideo, setPendingVideo] = useState<VideoTrigger | null>(null);
  const [showGameOver, setShowGameOver] = useState(
    initialState.isGameOver && initialPhase === 'terminal'
  );
  const [gameOverReason, setGameOverReason] = useState(initialState.gameOverReason || '');
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showPauseMenu, setShowPauseMenu] = useState(false);
  const [pendingUfo74Messages, setPendingUfo74Messages] = useState<TerminalEntry[]>([]);
  const [queuedAfterMediaMessages, setQueuedAfterMediaMessages] = useState<TerminalEntry[]>([]);
  const [pendingUfo74StartMessages, setPendingUfo74StartMessages] = useState<TerminalEntry[]>([]);
  const [encryptedChannelState, setEncryptedChannelState] =
    useState<EncryptedChannelState>('idle');
  const [gamePhase, setGamePhase] = useState<GamePhase>(initialPhase);
  const [countdownDisplay, setCountdownDisplay] = useState<string | null>(null);
  const [glitchActive, setGlitchActive] = useState(false);
  const [glitchHeavy, setGlitchHeavy] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isWarmingUp, setIsWarmingUp] = useState(initialState.history.length === 0);
  const [paranoiaMessage, setParanoiaMessage] = useState<string | null>(null);
  const [paranoiaPosition, setParanoiaPosition] = useState({ top: 0, left: 0 });
  const [pendingAchievement, setPendingAchievement] = useState<Achievement | null>(null);
  const [showEvidenceTracker, setShowEvidenceTracker] = useState(false);
  const [showRiskTracker, setShowRiskTracker] = useState(false);
  const [showAttBar, setShowAttBar] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);
  const [avatarCreepyEntrance, setAvatarCreepyEntrance] = useState(false);
  const [showFirewallScare, setShowFirewallScare] = useState(false);
  const [riskPulse, setRiskPulse] = useState(false);
  const [typingSpeedWarning, setTypingSpeedWarning] = useState(false);
  const [showTuringTest, setShowTuringTest] = useState(initialState.turingEvaluationActive);
  const [timedDecryptRemaining, setTimedDecryptRemaining] = useState(0);
  const [burnInLines, setBurnInLines] = useState<string[]>([]);

  // Sync state when a new game state is loaded externally (e.g., checkpoint load)
  // We detect this by checking if the seed or lastSaveTime changed
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    // Detect if this is a different game state (checkpoint load or game load)
    const seedChanged = initialState.seed !== prevSeedRef.current;
    const saveTimeChanged = initialState.lastSaveTime !== prevLastSaveTimeRef.current;
    
    if (seedChanged || saveTimeChanged) {
      // Update the internal game state to match the new initial state
      setGameState(initialState);
      
      // Sync game over state
      setShowGameOver(initialState.isGameOver && initialPhase === 'terminal');
      setGameOverReason(initialState.gameOverReason || '');
      
      // Sync Turing test state
      setShowTuringTest(initialState.turingEvaluationActive);
      
      // Update refs
      prevSeedRef.current = initialState.seed;
      prevLastSaveTimeRef.current = initialState.lastSaveTime;
    }
  }, [initialState, initialPhase]);

  return {
    gameState,
    setGameState,
    inputValue,
    setInputValue,
    isProcessing,
    setIsProcessing,
    isStreaming,
    setIsStreaming,
    flickerActive,
    setFlickerActive,
    historyIndex,
    setHistoryIndex,
    activeImage,
    setActiveImage,
    activeVideo,
    setActiveVideo,
    pendingImage,
    setPendingImage,
    pendingVideo,
    setPendingVideo,
    showGameOver,
    setShowGameOver,
    gameOverReason,
    setGameOverReason,
    showHeaderMenu,
    setShowHeaderMenu,
    showSettings,
    setShowSettings,
    showAchievements,
    setShowAchievements,
    showStatistics,
    setShowStatistics,
    showPauseMenu,
    setShowPauseMenu,
    pendingUfo74Messages,
    setPendingUfo74Messages,
    queuedAfterMediaMessages,
    setQueuedAfterMediaMessages,
    pendingUfo74StartMessages,
    setPendingUfo74StartMessages,
    encryptedChannelState,
    setEncryptedChannelState,
    gamePhase,
    setGamePhase,
    countdownDisplay,
    setCountdownDisplay,
    glitchActive,
    setGlitchActive,
    glitchHeavy,
    setGlitchHeavy,
    isShaking,
    setIsShaking,
    isWarmingUp,
    setIsWarmingUp,
    paranoiaMessage,
    setParanoiaMessage,
    paranoiaPosition,
    setParanoiaPosition,
    pendingAchievement,
    setPendingAchievement,
    showEvidenceTracker,
    setShowEvidenceTracker,
    showRiskTracker,
    setShowRiskTracker,
    showAttBar,
    setShowAttBar,
    showAvatar,
    setShowAvatar,
    avatarCreepyEntrance,
    setAvatarCreepyEntrance,
    showFirewallScare,
    setShowFirewallScare,
    riskPulse,
    setRiskPulse,
    typingSpeedWarning,
    setTypingSpeedWarning,
    showTuringTest,
    setShowTuringTest,
    timedDecryptRemaining,
    setTimedDecryptRemaining,
    burnInLines,
    setBurnInLines,
  };
}
