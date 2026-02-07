'use client';

import { useState } from 'react';
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
