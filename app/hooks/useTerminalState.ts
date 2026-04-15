'use client';

import { useState, useEffect, useRef, useReducer, useCallback } from 'react';
import type { Achievement } from '../engine/achievements';
import type {
  GamePhase,
  GameState,
  ImageTrigger,
  TerminalEntry,
} from '../types';

type EncryptedChannelState = 'idle' | 'awaiting_open' | 'open' | 'awaiting_close';

// ═══════════════════════════════════════════════════════════════════════════
// UI STATE (overlays, modals, visibility toggles)
// ═══════════════════════════════════════════════════════════════════════════

interface UIState {
  showGameOver: boolean;
  gameOverReason: string;
  showHeaderMenu: boolean;
  showSettings: boolean;
  showAchievements: boolean;
  showStatistics: boolean;
  showPauseMenu: boolean;
  showEvidenceTracker: boolean;
  showRiskTracker: boolean;
  showAttBar: boolean;
  showAvatar: boolean;
  avatarCreepyEntrance: boolean;
  showFirewallScare: boolean;
  showTuringTest: boolean;
  riskPulse: boolean;
  typingSpeedWarning: boolean;
  alienSilhouetteVisible: boolean;
}

type UIAction =
  | { type: 'SET_SHOW_GAME_OVER'; payload: boolean }
  | { type: 'SET_GAME_OVER_REASON'; payload: string }
  | { type: 'SET_SHOW_HEADER_MENU'; payload: boolean }
  | { type: 'SET_SHOW_SETTINGS'; payload: boolean }
  | { type: 'SET_SHOW_ACHIEVEMENTS'; payload: boolean }
  | { type: 'SET_SHOW_STATISTICS'; payload: boolean }
  | { type: 'SET_SHOW_PAUSE_MENU'; payload: boolean }
  | { type: 'SET_SHOW_EVIDENCE_TRACKER'; payload: boolean }
  | { type: 'SET_SHOW_RISK_TRACKER'; payload: boolean }
  | { type: 'SET_SHOW_ATT_BAR'; payload: boolean }
  | { type: 'SET_SHOW_AVATAR'; payload: boolean }
  | { type: 'SET_AVATAR_CREEPY_ENTRANCE'; payload: boolean }
  | { type: 'SET_SHOW_FIREWALL_SCARE'; payload: boolean }
  | { type: 'SET_SHOW_TURING_TEST'; payload: boolean }
  | { type: 'SET_RISK_PULSE'; payload: boolean }
  | { type: 'SET_TYPING_SPEED_WARNING'; payload: boolean }
  | { type: 'SET_ALIEN_SILHOUETTE_VISIBLE'; payload: boolean }
  | { type: 'RESET_UI'; payload: UIState };

function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case 'SET_SHOW_GAME_OVER': return { ...state, showGameOver: action.payload };
    case 'SET_GAME_OVER_REASON': return { ...state, gameOverReason: action.payload };
    case 'SET_SHOW_HEADER_MENU': return { ...state, showHeaderMenu: action.payload };
    case 'SET_SHOW_SETTINGS': return { ...state, showSettings: action.payload };
    case 'SET_SHOW_ACHIEVEMENTS': return { ...state, showAchievements: action.payload };
    case 'SET_SHOW_STATISTICS': return { ...state, showStatistics: action.payload };
    case 'SET_SHOW_PAUSE_MENU': return { ...state, showPauseMenu: action.payload };
    case 'SET_SHOW_EVIDENCE_TRACKER': return { ...state, showEvidenceTracker: action.payload };
    case 'SET_SHOW_RISK_TRACKER': return { ...state, showRiskTracker: action.payload };
    case 'SET_SHOW_ATT_BAR': return { ...state, showAttBar: action.payload };
    case 'SET_SHOW_AVATAR': return { ...state, showAvatar: action.payload };
    case 'SET_AVATAR_CREEPY_ENTRANCE': return { ...state, avatarCreepyEntrance: action.payload };
    case 'SET_SHOW_FIREWALL_SCARE': return { ...state, showFirewallScare: action.payload };
    case 'SET_SHOW_TURING_TEST': return { ...state, showTuringTest: action.payload };
    case 'SET_RISK_PULSE': return { ...state, riskPulse: action.payload };
    case 'SET_TYPING_SPEED_WARNING': return { ...state, typingSpeedWarning: action.payload };
    case 'SET_ALIEN_SILHOUETTE_VISIBLE': return { ...state, alienSilhouetteVisible: action.payload };
    case 'RESET_UI': return action.payload;
    default: return state;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// GAME PHASE STATE
// ═══════════════════════════════════════════════════════════════════════════

interface GamePhaseState {
  gamePhase: GamePhase;
  encryptedChannelState: EncryptedChannelState;
  isProcessing: boolean;
  isStreaming: boolean;
  isWarmingUp: boolean;
  isShaking: boolean;
  flickerActive: boolean;
  countdownDisplay: string | null;
  timedDecryptRemaining: number;
  terminalStaticLevel: number;
  burnInLines: string[];
  interferenceBurst: { top: number } | null;
  paranoiaMessage: string | null;
  paranoiaPosition: { top: number; left: number };
}

type GamePhaseAction =
  | { type: 'SET_GAME_PHASE'; payload: GamePhase }
  | { type: 'SET_ENCRYPTED_CHANNEL_STATE'; payload: EncryptedChannelState }
  | { type: 'SET_IS_PROCESSING'; payload: boolean }
  | { type: 'SET_IS_STREAMING'; payload: boolean }
  | { type: 'SET_IS_WARMING_UP'; payload: boolean }
  | { type: 'SET_IS_SHAKING'; payload: boolean }
  | { type: 'SET_FLICKER_ACTIVE'; payload: boolean }
  | { type: 'SET_COUNTDOWN_DISPLAY'; payload: string | null }
  | { type: 'SET_TIMED_DECRYPT_REMAINING'; payload: number }
  | { type: 'SET_TERMINAL_STATIC_LEVEL'; payload: number }
  | { type: 'SET_BURN_IN_LINES'; payload: string[] }
  | { type: 'SET_INTERFERENCE_BURST'; payload: { top: number } | null }
  | { type: 'SET_PARANOIA_MESSAGE'; payload: string | null }
  | { type: 'SET_PARANOIA_POSITION'; payload: { top: number; left: number } }
  | { type: 'RESET_GAME_PHASE'; payload: GamePhaseState };

function gamePhaseReducer(state: GamePhaseState, action: GamePhaseAction): GamePhaseState {
  switch (action.type) {
    case 'SET_GAME_PHASE': return { ...state, gamePhase: action.payload };
    case 'SET_ENCRYPTED_CHANNEL_STATE': return { ...state, encryptedChannelState: action.payload };
    case 'SET_IS_PROCESSING': return { ...state, isProcessing: action.payload };
    case 'SET_IS_STREAMING': return { ...state, isStreaming: action.payload };
    case 'SET_IS_WARMING_UP': return { ...state, isWarmingUp: action.payload };
    case 'SET_IS_SHAKING': return { ...state, isShaking: action.payload };
    case 'SET_FLICKER_ACTIVE': return { ...state, flickerActive: action.payload };
    case 'SET_COUNTDOWN_DISPLAY': return { ...state, countdownDisplay: action.payload };
    case 'SET_TIMED_DECRYPT_REMAINING': return { ...state, timedDecryptRemaining: action.payload };
    case 'SET_TERMINAL_STATIC_LEVEL': return { ...state, terminalStaticLevel: action.payload };
    case 'SET_BURN_IN_LINES': return { ...state, burnInLines: action.payload };
    case 'SET_INTERFERENCE_BURST': return { ...state, interferenceBurst: action.payload };
    case 'SET_PARANOIA_MESSAGE': return { ...state, paranoiaMessage: action.payload };
    case 'SET_PARANOIA_POSITION': return { ...state, paranoiaPosition: action.payload };
    case 'RESET_GAME_PHASE': return action.payload;
    default: return state;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TRACKER / DISPLAY STATE
// ═══════════════════════════════════════════════════════════════════════════

interface TrackerState {
  inputValue: string;
  historyIndex: number;
  activeImage: ImageTrigger | null;
  pendingImage: ImageTrigger | null;
  pendingUfo74Messages: TerminalEntry[];
  queuedAfterMediaMessages: TerminalEntry[];
  pendingUfo74StartMessages: TerminalEntry[];
  pendingAchievement: Achievement | null;
}

type TrackerAction =
  | { type: 'SET_INPUT_VALUE'; payload: string }
  | { type: 'SET_HISTORY_INDEX'; payload: number }
  | { type: 'SET_ACTIVE_IMAGE'; payload: ImageTrigger | null }
  | { type: 'SET_PENDING_IMAGE'; payload: ImageTrigger | null }
  | { type: 'SET_PENDING_UFO74_MESSAGES'; payload: TerminalEntry[] }
  | { type: 'SET_QUEUED_AFTER_MEDIA_MESSAGES'; payload: TerminalEntry[] }
  | { type: 'SET_PENDING_UFO74_START_MESSAGES'; payload: TerminalEntry[] }
  | { type: 'APPEND_PENDING_UFO74_MESSAGES'; payload: TerminalEntry[] }
  | { type: 'APPEND_QUEUED_AFTER_MEDIA_MESSAGES'; payload: TerminalEntry[] }
  | { type: 'APPEND_PENDING_UFO74_START_MESSAGES'; payload: TerminalEntry[] }
  | { type: 'SET_PENDING_ACHIEVEMENT'; payload: Achievement | null }
  | { type: 'RESET_TRACKER'; payload: TrackerState };

function trackerReducer(state: TrackerState, action: TrackerAction): TrackerState {
  switch (action.type) {
    case 'SET_INPUT_VALUE': return { ...state, inputValue: action.payload };
    case 'SET_HISTORY_INDEX': return { ...state, historyIndex: action.payload };
    case 'SET_ACTIVE_IMAGE': return { ...state, activeImage: action.payload };
    case 'SET_PENDING_IMAGE': return { ...state, pendingImage: action.payload };
    case 'SET_PENDING_UFO74_MESSAGES': return { ...state, pendingUfo74Messages: action.payload };
    case 'SET_QUEUED_AFTER_MEDIA_MESSAGES': return { ...state, queuedAfterMediaMessages: action.payload };
    case 'SET_PENDING_UFO74_START_MESSAGES': return { ...state, pendingUfo74StartMessages: action.payload };
    case 'APPEND_PENDING_UFO74_MESSAGES': return { ...state, pendingUfo74Messages: [...state.pendingUfo74Messages, ...action.payload] };
    case 'APPEND_QUEUED_AFTER_MEDIA_MESSAGES': return { ...state, queuedAfterMediaMessages: [...state.queuedAfterMediaMessages, ...action.payload] };
    case 'APPEND_PENDING_UFO74_START_MESSAGES': return { ...state, pendingUfo74StartMessages: [...state.pendingUfo74StartMessages, ...action.payload] };
    case 'SET_PENDING_ACHIEVEMENT': return { ...state, pendingAchievement: action.payload };
    case 'RESET_TRACKER': return action.payload;
    default: return state;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function useTerminalState(initialState: GameState, initialPhase: GamePhase) {
  const [gameState, setGameState] = useState<GameState>(initialState);

  // Track if this is the first render to avoid running sync effect on mount
  const isFirstRender = useRef(true);
  // HomeContent only changes initialState when the active session is replaced
  // (new game, load save, or load checkpoint), so a new object means we should
  // fully reset the terminal even if the checkpoint metadata is unchanged.
  const prevInitialStateRef = useRef(initialState);

  // ── UI State ──────────────────────────────────────────────────────────

  const [uiState, uiDispatch] = useReducer(uiReducer, {
    showGameOver: initialState.isGameOver && initialPhase === 'terminal',
    gameOverReason: initialState.gameOverReason || '',
    showHeaderMenu: false,
    showSettings: false,
    showAchievements: false,
    showStatistics: false,
    showPauseMenu: false,
    showEvidenceTracker: false,
    showRiskTracker: false,
    showAttBar: false,
    showAvatar: false,
    avatarCreepyEntrance: false,
    showFirewallScare: false,
    showTuringTest: initialState.turingEvaluationActive,
    riskPulse: false,
    typingSpeedWarning: false,
    alienSilhouetteVisible: false,
  });

  // Keep a ref to current state so setter callbacks remain stable (no deps on state values)
  const uiStateRef = useRef(uiState);
  uiStateRef.current = uiState;

  // ── Game Phase State ──────────────────────────────────────────────────

  const [phaseState, phaseDispatch] = useReducer(gamePhaseReducer, {
    gamePhase: initialPhase,
    encryptedChannelState: 'idle' as EncryptedChannelState,
    isProcessing: false,
    isStreaming: false,
    isWarmingUp: initialState.history.length === 0,
    isShaking: false,
    flickerActive: false,
    countdownDisplay: null,
    timedDecryptRemaining: 0,
    terminalStaticLevel: 0,
    burnInLines: [],
    interferenceBurst: null,
    paranoiaMessage: null,
    paranoiaPosition: { top: 0, left: 0 },
  });

  const phaseStateRef = useRef(phaseState);
  phaseStateRef.current = phaseState;

  // ── Tracker / Display State ───────────────────────────────────────────

  const [trackerState, trackerDispatch] = useReducer(trackerReducer, {
    inputValue: '',
    historyIndex: -1,
    activeImage: null,
    pendingImage: null,
    pendingUfo74Messages: [],
    queuedAfterMediaMessages: [],
    pendingUfo74StartMessages: [],
    pendingAchievement: null,
  });

  const trackerStateRef = useRef(trackerState);
  trackerStateRef.current = trackerState;

  // ═══════════════════════════════════════════════════════════════════════
  // UI STATE WRAPPER SETTERS
  // Callbacks use uiStateRef so they stay referentially stable like useState setters.
  // ═══════════════════════════════════════════════════════════════════════

  const setShowGameOver = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    uiDispatch({ type: 'SET_SHOW_GAME_OVER', payload: typeof value === 'function' ? value(uiStateRef.current.showGameOver) : value });
  }, []);

  const setGameOverReason = useCallback((value: string | ((prev: string) => string)) => {
    uiDispatch({ type: 'SET_GAME_OVER_REASON', payload: typeof value === 'function' ? value(uiStateRef.current.gameOverReason) : value });
  }, []);

  const setShowHeaderMenu = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    uiDispatch({ type: 'SET_SHOW_HEADER_MENU', payload: typeof value === 'function' ? value(uiStateRef.current.showHeaderMenu) : value });
  }, []);

  const setShowSettings = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    uiDispatch({ type: 'SET_SHOW_SETTINGS', payload: typeof value === 'function' ? value(uiStateRef.current.showSettings) : value });
  }, []);

  const setShowAchievements = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    uiDispatch({ type: 'SET_SHOW_ACHIEVEMENTS', payload: typeof value === 'function' ? value(uiStateRef.current.showAchievements) : value });
  }, []);

  const setShowStatistics = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    uiDispatch({ type: 'SET_SHOW_STATISTICS', payload: typeof value === 'function' ? value(uiStateRef.current.showStatistics) : value });
  }, []);

  const setShowPauseMenu = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    uiDispatch({ type: 'SET_SHOW_PAUSE_MENU', payload: typeof value === 'function' ? value(uiStateRef.current.showPauseMenu) : value });
  }, []);

  const setShowEvidenceTracker = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    uiDispatch({ type: 'SET_SHOW_EVIDENCE_TRACKER', payload: typeof value === 'function' ? value(uiStateRef.current.showEvidenceTracker) : value });
  }, []);

  const setShowRiskTracker = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    uiDispatch({ type: 'SET_SHOW_RISK_TRACKER', payload: typeof value === 'function' ? value(uiStateRef.current.showRiskTracker) : value });
  }, []);

  const setShowAttBar = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    uiDispatch({ type: 'SET_SHOW_ATT_BAR', payload: typeof value === 'function' ? value(uiStateRef.current.showAttBar) : value });
  }, []);

  const setShowAvatar = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    uiDispatch({ type: 'SET_SHOW_AVATAR', payload: typeof value === 'function' ? value(uiStateRef.current.showAvatar) : value });
  }, []);

  const setAvatarCreepyEntrance = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    uiDispatch({ type: 'SET_AVATAR_CREEPY_ENTRANCE', payload: typeof value === 'function' ? value(uiStateRef.current.avatarCreepyEntrance) : value });
  }, []);

  const setShowFirewallScare = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    uiDispatch({ type: 'SET_SHOW_FIREWALL_SCARE', payload: typeof value === 'function' ? value(uiStateRef.current.showFirewallScare) : value });
  }, []);

  const setShowTuringTest = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    uiDispatch({ type: 'SET_SHOW_TURING_TEST', payload: typeof value === 'function' ? value(uiStateRef.current.showTuringTest) : value });
  }, []);

  const setRiskPulse = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    uiDispatch({ type: 'SET_RISK_PULSE', payload: typeof value === 'function' ? value(uiStateRef.current.riskPulse) : value });
  }, []);

  const setTypingSpeedWarning = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    uiDispatch({ type: 'SET_TYPING_SPEED_WARNING', payload: typeof value === 'function' ? value(uiStateRef.current.typingSpeedWarning) : value });
  }, []);

  const setAlienSilhouetteVisible = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    uiDispatch({ type: 'SET_ALIEN_SILHOUETTE_VISIBLE', payload: typeof value === 'function' ? value(uiStateRef.current.alienSilhouetteVisible) : value });
  }, []);

  // ═══════════════════════════════════════════════════════════════════════
  // GAME PHASE STATE WRAPPER SETTERS
  // ═══════════════════════════════════════════════════════════════════════

  const setGamePhase = useCallback((value: GamePhase | ((prev: GamePhase) => GamePhase)) => {
    phaseDispatch({ type: 'SET_GAME_PHASE', payload: typeof value === 'function' ? value(phaseStateRef.current.gamePhase) : value });
  }, []);

  const setEncryptedChannelState = useCallback((value: EncryptedChannelState | ((prev: EncryptedChannelState) => EncryptedChannelState)) => {
    phaseDispatch({ type: 'SET_ENCRYPTED_CHANNEL_STATE', payload: typeof value === 'function' ? value(phaseStateRef.current.encryptedChannelState) : value });
  }, []);

  const setIsProcessing = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    phaseDispatch({ type: 'SET_IS_PROCESSING', payload: typeof value === 'function' ? value(phaseStateRef.current.isProcessing) : value });
  }, []);

  const setIsStreaming = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    phaseDispatch({ type: 'SET_IS_STREAMING', payload: typeof value === 'function' ? value(phaseStateRef.current.isStreaming) : value });
  }, []);

  const setIsWarmingUp = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    phaseDispatch({ type: 'SET_IS_WARMING_UP', payload: typeof value === 'function' ? value(phaseStateRef.current.isWarmingUp) : value });
  }, []);

  const setIsShaking = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    phaseDispatch({ type: 'SET_IS_SHAKING', payload: typeof value === 'function' ? value(phaseStateRef.current.isShaking) : value });
  }, []);

  const setFlickerActive = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    phaseDispatch({ type: 'SET_FLICKER_ACTIVE', payload: typeof value === 'function' ? value(phaseStateRef.current.flickerActive) : value });
  }, []);

  const setCountdownDisplay = useCallback((value: string | null | ((prev: string | null) => string | null)) => {
    phaseDispatch({ type: 'SET_COUNTDOWN_DISPLAY', payload: typeof value === 'function' ? value(phaseStateRef.current.countdownDisplay) : value });
  }, []);

  const setTimedDecryptRemaining = useCallback((value: number | ((prev: number) => number)) => {
    phaseDispatch({ type: 'SET_TIMED_DECRYPT_REMAINING', payload: typeof value === 'function' ? value(phaseStateRef.current.timedDecryptRemaining) : value });
  }, []);

  const setTerminalStaticLevel = useCallback((value: number | ((prev: number) => number)) => {
    phaseDispatch({ type: 'SET_TERMINAL_STATIC_LEVEL', payload: typeof value === 'function' ? value(phaseStateRef.current.terminalStaticLevel) : value });
  }, []);

  const setBurnInLines = useCallback((value: string[] | ((prev: string[]) => string[])) => {
    phaseDispatch({ type: 'SET_BURN_IN_LINES', payload: typeof value === 'function' ? value(phaseStateRef.current.burnInLines) : value });
  }, []);

  const setInterferenceBurst = useCallback((value: { top: number } | null | ((prev: { top: number } | null) => { top: number } | null)) => {
    phaseDispatch({ type: 'SET_INTERFERENCE_BURST', payload: typeof value === 'function' ? value(phaseStateRef.current.interferenceBurst) : value });
  }, []);

  const setParanoiaMessage = useCallback((value: string | null | ((prev: string | null) => string | null)) => {
    phaseDispatch({ type: 'SET_PARANOIA_MESSAGE', payload: typeof value === 'function' ? value(phaseStateRef.current.paranoiaMessage) : value });
  }, []);

  const setParanoiaPosition = useCallback((value: { top: number; left: number } | ((prev: { top: number; left: number }) => { top: number; left: number })) => {
    phaseDispatch({ type: 'SET_PARANOIA_POSITION', payload: typeof value === 'function' ? value(phaseStateRef.current.paranoiaPosition) : value });
  }, []);

  // ═══════════════════════════════════════════════════════════════════════
  // TRACKER / DISPLAY STATE WRAPPER SETTERS
  // ═══════════════════════════════════════════════════════════════════════

  const setInputValue = useCallback((value: string | ((prev: string) => string)) => {
    trackerDispatch({ type: 'SET_INPUT_VALUE', payload: typeof value === 'function' ? value(trackerStateRef.current.inputValue) : value });
  }, []);

  const setHistoryIndex = useCallback((value: number | ((prev: number) => number)) => {
    trackerDispatch({ type: 'SET_HISTORY_INDEX', payload: typeof value === 'function' ? value(trackerStateRef.current.historyIndex) : value });
  }, []);

  const setActiveImage = useCallback((value: ImageTrigger | null | ((prev: ImageTrigger | null) => ImageTrigger | null)) => {
    trackerDispatch({ type: 'SET_ACTIVE_IMAGE', payload: typeof value === 'function' ? value(trackerStateRef.current.activeImage) : value });
  }, []);

  const setPendingImage = useCallback((value: ImageTrigger | null | ((prev: ImageTrigger | null) => ImageTrigger | null)) => {
    trackerDispatch({ type: 'SET_PENDING_IMAGE', payload: typeof value === 'function' ? value(trackerStateRef.current.pendingImage) : value });
  }, []);

  const setPendingUfo74Messages = useCallback((value: TerminalEntry[] | ((prev: TerminalEntry[]) => TerminalEntry[])) => {
    trackerDispatch({ type: 'SET_PENDING_UFO74_MESSAGES', payload: typeof value === 'function' ? value(trackerStateRef.current.pendingUfo74Messages) : value });
  }, []);

  const appendPendingUfo74Messages = useCallback((items: TerminalEntry[]) => {
    trackerDispatch({ type: 'APPEND_PENDING_UFO74_MESSAGES', payload: items });
  }, []);

  const setQueuedAfterMediaMessages = useCallback((value: TerminalEntry[] | ((prev: TerminalEntry[]) => TerminalEntry[])) => {
    trackerDispatch({ type: 'SET_QUEUED_AFTER_MEDIA_MESSAGES', payload: typeof value === 'function' ? value(trackerStateRef.current.queuedAfterMediaMessages) : value });
  }, []);

  const appendQueuedAfterMediaMessages = useCallback((items: TerminalEntry[]) => {
    trackerDispatch({ type: 'APPEND_QUEUED_AFTER_MEDIA_MESSAGES', payload: items });
  }, []);

  const setPendingUfo74StartMessages = useCallback((value: TerminalEntry[] | ((prev: TerminalEntry[]) => TerminalEntry[])) => {
    trackerDispatch({ type: 'SET_PENDING_UFO74_START_MESSAGES', payload: typeof value === 'function' ? value(trackerStateRef.current.pendingUfo74StartMessages) : value });
  }, []);

  const appendPendingUfo74StartMessages = useCallback((items: TerminalEntry[]) => {
    trackerDispatch({ type: 'APPEND_PENDING_UFO74_START_MESSAGES', payload: items });
  }, []);

  const setPendingAchievement = useCallback((value: Achievement | null | ((prev: Achievement | null) => Achievement | null)) => {
    trackerDispatch({ type: 'SET_PENDING_ACHIEVEMENT', payload: typeof value === 'function' ? value(trackerStateRef.current.pendingAchievement) : value });
  }, []);

  // ═══════════════════════════════════════════════════════════════════════
  // SYNC EFFECT (checkpoint load)
  // ═══════════════════════════════════════════════════════════════════════

  // Sync state when a new game state is loaded externally (e.g., checkpoint load).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (initialState !== prevInitialStateRef.current) {
      // Update the internal game state to match the new initial state
      setGameState(initialState);

      // Reset all reducer state to clear stale UI from previous session
      uiDispatch({ type: 'RESET_UI', payload: {
        showGameOver: initialState.isGameOver && initialPhase === 'terminal',
        gameOverReason: initialState.gameOverReason || '',
        showHeaderMenu: false,
        showSettings: false,
        showAchievements: false,
        showStatistics: false,
        showPauseMenu: false,
        showEvidenceTracker: false,
        showRiskTracker: false,
        showAttBar: false,
        showAvatar: false,
        avatarCreepyEntrance: false,
        showFirewallScare: false,
        showTuringTest: initialState.turingEvaluationActive,
        riskPulse: false,
        typingSpeedWarning: false,
        alienSilhouetteVisible: false,
      }});

      phaseDispatch({ type: 'RESET_GAME_PHASE', payload: {
        gamePhase: initialPhase,
        encryptedChannelState: 'idle' as EncryptedChannelState,
        isProcessing: false,
        isStreaming: false,
        isWarmingUp: false,
        isShaking: false,
        flickerActive: false,
        countdownDisplay: null,
        timedDecryptRemaining: 0,
        terminalStaticLevel: 0,
        burnInLines: [],
        interferenceBurst: null,
        paranoiaMessage: null,
        paranoiaPosition: { top: 0, left: 0 },
      }});

      trackerDispatch({ type: 'RESET_TRACKER', payload: {
        inputValue: '',
        historyIndex: -1,
        activeImage: null,
        pendingImage: null,
        pendingUfo74Messages: [],
        queuedAfterMediaMessages: [],
        pendingUfo74StartMessages: [],
        pendingAchievement: null,
      }});

      // Update refs
      prevInitialStateRef.current = initialState;
    }
  }, [initialState, initialPhase]);

  return {
    gameState,
    setGameState,
    inputValue: trackerState.inputValue,
    setInputValue,
    isProcessing: phaseState.isProcessing,
    setIsProcessing,
    isStreaming: phaseState.isStreaming,
    setIsStreaming,
    flickerActive: phaseState.flickerActive,
    setFlickerActive,
    historyIndex: trackerState.historyIndex,
    setHistoryIndex,
    activeImage: trackerState.activeImage,
    setActiveImage,
    pendingImage: trackerState.pendingImage,
    setPendingImage,
    showGameOver: uiState.showGameOver,
    setShowGameOver,
    gameOverReason: uiState.gameOverReason,
    setGameOverReason,
    showHeaderMenu: uiState.showHeaderMenu,
    setShowHeaderMenu,
    showSettings: uiState.showSettings,
    setShowSettings,
    showAchievements: uiState.showAchievements,
    setShowAchievements,
    showStatistics: uiState.showStatistics,
    setShowStatistics,
    showPauseMenu: uiState.showPauseMenu,
    setShowPauseMenu,
    pendingUfo74Messages: trackerState.pendingUfo74Messages,
    setPendingUfo74Messages,
    appendPendingUfo74Messages,
    queuedAfterMediaMessages: trackerState.queuedAfterMediaMessages,
    setQueuedAfterMediaMessages,
    appendQueuedAfterMediaMessages,
    pendingUfo74StartMessages: trackerState.pendingUfo74StartMessages,
    setPendingUfo74StartMessages,
    appendPendingUfo74StartMessages,
    encryptedChannelState: phaseState.encryptedChannelState,
    setEncryptedChannelState,
    gamePhase: phaseState.gamePhase,
    setGamePhase,
    countdownDisplay: phaseState.countdownDisplay,
    setCountdownDisplay,
    isShaking: phaseState.isShaking,
    setIsShaking,
    isWarmingUp: phaseState.isWarmingUp,
    setIsWarmingUp,
    paranoiaMessage: phaseState.paranoiaMessage,
    setParanoiaMessage,
    paranoiaPosition: phaseState.paranoiaPosition,
    setParanoiaPosition,
    pendingAchievement: trackerState.pendingAchievement,
    setPendingAchievement,
    showEvidenceTracker: uiState.showEvidenceTracker,
    setShowEvidenceTracker,
    showRiskTracker: uiState.showRiskTracker,
    setShowRiskTracker,
    showAttBar: uiState.showAttBar,
    setShowAttBar,
    showAvatar: uiState.showAvatar,
    setShowAvatar,
    avatarCreepyEntrance: uiState.avatarCreepyEntrance,
    setAvatarCreepyEntrance,
    showFirewallScare: uiState.showFirewallScare,
    setShowFirewallScare,
    riskPulse: uiState.riskPulse,
    setRiskPulse,
    typingSpeedWarning: uiState.typingSpeedWarning,
    setTypingSpeedWarning,
    showTuringTest: uiState.showTuringTest,
    setShowTuringTest,
    timedDecryptRemaining: phaseState.timedDecryptRemaining,
    setTimedDecryptRemaining,
    burnInLines: phaseState.burnInLines,
    setBurnInLines,
    interferenceBurst: phaseState.interferenceBurst,
    setInterferenceBurst,
    terminalStaticLevel: phaseState.terminalStaticLevel,
    setTerminalStaticLevel,
    alienSilhouetteVisible: uiState.alienSilhouetteVisible,
    setAlienSilhouetteVisible,
  };
}
