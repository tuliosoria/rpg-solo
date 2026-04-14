'use client';

import React, { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { GamePhase, GameState, TerminalEntry } from '../types';
import { createEntry } from '../engine/commands';
import { isTutorialInputState, TutorialStateID } from '../engine/commands/interactiveTutorial';
import { getEndingFlags } from '../engine/endings';
import { getAllAccessibleFiles, resolvePath } from '../engine/filesystem';

import { getLatestCheckpoint, loadCheckpoint, saveCheckpoint } from '../storage/saves';
import { DETECTION_THRESHOLDS } from '../constants/detection';
import { TYPING_WARNING_TIMEOUT_MS, GAME_OVER_DELAY_MS } from '../constants/timing';
import { useI18n, translateStatic } from '../i18n';
import { OPTIONS_CHANGED_EVENT, readStoredOptions } from '../hooks/useOptions';
import {
  MAX_WRONG_ATTEMPTS,
  SUSPICIOUS_TYPING_SPEED,
  KEYPRESS_TRACK_SIZE,
} from '../constants/gameplay';
import { shouldSuppressPressure } from '../constants/atmosphere';
import {
  useAutocomplete,
  useGameActions,
  useSound,
  useTerminalEffects,
  useTerminalInput,
  useTerminalState,
} from '../hooks';
import { unlockAchievement } from '../engine/achievements';
import { uiRandomPick } from '../engine/rng';
import type { TextSpeed } from '../types';
import AchievementPopup from './AchievementPopup';
import SettingsModal from './SettingsModal';
import PauseMenu from './PauseMenu';
import TutorialSkipPopup from './TutorialSkipPopup';
import HackerAvatar, { AvatarExpression } from './HackerAvatar';
import { FloatingUIProvider, FloatingElement } from './FloatingUI';
import FirewallEyes, { speakCustomFirewallVoice, unlockSpeechSynthesis } from './FirewallEyes';


// Lazy-load conditional components for better initial load performance
const ImageOverlay = dynamic(() => import('./ImageOverlay'), { ssr: false });
const TuringTestOverlay = dynamic(() => import('./TuringTestOverlay'), { ssr: false });
const GameOver = dynamic(() => import('./GameOver'), { ssr: false });
const Blackout = dynamic(() => import('./Blackout'), { ssr: false });
const StaticNoise = dynamic(() => import('./StaticNoise'), { ssr: false });
const ICQChat = dynamic(() => import('./ICQChat'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '100vh',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#88cc44',
        fontFamily: 'monospace',
      }}
    >
      {translateStatic('terminal.loading.icq')}
    </div>
  ),
});
const Victory = dynamic(() => import('./Victory'), { ssr: false });
const BadEnding = dynamic(() => import('./BadEnding'), { ssr: false });
const NeutralEnding = dynamic(() => import('./NeutralEnding'), { ssr: false });
const SecretEnding = dynamic(() => import('./SecretEnding'), { ssr: false });
const AchievementGallery = dynamic(() => import('./AchievementGallery'), { ssr: false });
const StatisticsModal = dynamic(() => import('./StatisticsModal'), { ssr: false });
import styles from './Terminal.module.css';

const UFO74_IMAGE_COMMENT_KEYS: Record<string, string[]> = {
  '/images/crash.webp': [
    'terminal.imageComment.crash1',
    'terminal.imageComment.crash2',
  ],
  '/images/et.webp': [
    'terminal.imageComment.et1',
    'terminal.imageComment.et2',
  ],
  '/images/et-scared.webp': [
    'terminal.imageComment.etScared1',
    'terminal.imageComment.etScared2',
  ],
  '/images/second-ship.webp': ['terminal.imageComment.secondShip1'],
  '/images/drone.webp': ['terminal.imageComment.drone1'],
  '/images/prato-delta.webp': ['terminal.imageComment.pratoDelta1'],
  '/images/et-brain.webp': [
    'terminal.imageComment.etBrain1',
    'terminal.imageComment.etBrain2',
  ],
};

const UFO74_FIREWALL_REACTION_KEYS = [
  'terminal.firewallReaction.1',
  'terminal.firewallReaction.2',
  'terminal.firewallReaction.3',
  'terminal.firewallReaction.4',
  'terminal.firewallReaction.5',
  'terminal.firewallReaction.6',
  'terminal.firewallReaction.7',
] as const;

interface EvidenceVideoAttachment {
  filePath: string;
  fileName: string;
  videoSrc: string;
  videoTitle: string;
}

const JARDIM_ANDERE_INCIDENT_VIDEO_SRC = new URL(
  '../../videos/jardim_andere_incident.mp4',
  import.meta.url
).toString();

const AUTOPSY_VIDEO_SRC = new URL(
  '../../videos/autopsy.mp4',
  import.meta.url
).toString();

const THEY_ARE_ALREADY_HERE_VIDEO_SRC = new URL(
  '../../videos/they-are-already-here.mp4',
  import.meta.url
).toString();

const UFO74_VIDEO_SRC = new URL(
  '../../videos/UFO74.mp4',
  import.meta.url
).toString();

const TRANSPORT_VIDEO_SRC = new URL(
  '../../videos/transport.mp4',
  import.meta.url
).toString();

const TURING_TEST_VIDEO_SRC = new URL(
  '../../videos/turing test.mp4',
  import.meta.url
).toString();

const EVIDENCE_VIDEO_ATTACHMENTS: Record<string, EvidenceVideoAttachment> = {
  '/internal/jardim_andere_incident.txt': {
    filePath: '/internal/jardim_andere_incident.txt',
    fileName: 'jardim_andere_incident.txt',
    videoSrc: JARDIM_ANDERE_INCIDENT_VIDEO_SRC,
    videoTitle: 'jardim_andere_incident.mp4',
  },
  '/storage/assets/logistics_manifest_fragment.txt': {
    filePath: '/storage/assets/logistics_manifest_fragment.txt',
    fileName: 'logistics_manifest_fragment.txt',
    videoSrc: AUTOPSY_VIDEO_SRC,
    videoTitle: 'autopsy.mp4',
  },
  '/admin/energy_extraction_theory.txt': {
    filePath: '/admin/energy_extraction_theory.txt',
    fileName: 'energy_extraction_theory.txt',
    videoSrc: THEY_ARE_ALREADY_HERE_VIDEO_SRC,
    videoTitle: 'they-are-already-here.mp4',
  },
  '/sys/ghost_in_machine.enc': {
    filePath: '/sys/ghost_in_machine.enc',
    fileName: 'ghost_in_machine.enc',
    videoSrc: UFO74_VIDEO_SRC,
    videoTitle: 'UFO74.mp4',
  },
  '/storage/assets/transport_log_96.txt': {
    filePath: '/storage/assets/transport_log_96.txt',
    fileName: 'transport_log_96.txt',
    videoSrc: TRANSPORT_VIDEO_SRC,
    videoTitle: 'transport.mp4',
  },
};

const AFFIRMATIVE_VIDEO_PROMPT_INPUTS = new Set(['y', 'yes', 's', 'sim', 'si', 'sí']);
const NEGATIVE_VIDEO_PROMPT_INPUTS = new Set(['n', 'no', 'nao', 'não']);

export function normalizeVideoPromptChoice(input: string): 'yes' | 'no' | null {
  const normalized = input.trim().toLowerCase();

  if (AFFIRMATIVE_VIDEO_PROMPT_INPUTS.has(normalized)) {
    return 'yes';
  }

  if (NEGATIVE_VIDEO_PROMPT_INPUTS.has(normalized)) {
    return 'no';
  }

  return null;
}

const getEvidenceVideoAttachment = (
  commandInput: string,
  currentPath: string
): EvidenceVideoAttachment | null => {
  // Match file-reading commands that can surface attached media prompts.
  const match = /^(?:open|cat)\s+(\S+)/i.exec(commandInput.trim());
  if (!match) {
    return null;
  }

  const filePath = resolvePath(match[1].trim(), currentPath);
  return EVIDENCE_VIDEO_ATTACHMENTS[filePath] ?? null;
};

const deriveGamePhase = (state: GameState): GamePhase => {
  if (state.endingType === 'bad') return 'bad_ending';
  if (state.endingType === 'neutral') return 'neutral_ending';
  if (state.endingType === 'secret') return 'secret_ending';
  if (state.gameWon || state.endingType === 'good') return 'victory';
  if (state.icqPhase) return 'icq';
  if (state.evidencesSaved) return 'blackout';
  return 'terminal';
};

const isBlankSystemSpacer = (entry: TerminalEntry) =>
  entry.type === 'system' && entry.content.trim().length === 0;

const getNearestNonSpacerEntry = (
  entries: readonly TerminalEntry[],
  startIndex: number,
  direction: -1 | 1
): TerminalEntry | undefined => {
  let index = startIndex + direction;

  while (index >= 0 && index < entries.length) {
    const candidate = entries[index];
    if (!isBlankSystemSpacer(candidate)) {
      return candidate;
    }
    index += direction;
  }

  return undefined;
};

const shouldSuppressUfo74Spacer = (
  entry: TerminalEntry,
  index: number,
  entries: readonly TerminalEntry[]
) =>
  isBlankSystemSpacer(entry) &&
  (getNearestNonSpacerEntry(entries, index, -1)?.type === 'ufo74' ||
    getNearestNonSpacerEntry(entries, index, 1)?.type === 'ufo74');

interface TerminalProps {
  initialState: GameState;
  onExitAction: () => void;
  onSaveRequestAction: (state: GameState) => void;
  onLoadCheckpointAction?: (slotId: string) => void;
}

const BUILD_NUMBER = process.env.NEXT_PUBLIC_BUILD_NUMBER;
const COMMIT_SHA = process.env.NEXT_PUBLIC_COMMIT_SHA || 'unknown';
const HAS_BUILD_METADATA = !!BUILD_NUMBER && /^\d+$/.test(BUILD_NUMBER) && COMMIT_SHA !== 'unknown';
const DEPLOY_VERSION = HAS_BUILD_METADATA ? `v0.${BUILD_NUMBER}.0` : 'dev-local';
const VERSION_TOOLTIP = HAS_BUILD_METADATA ? COMMIT_SHA : 'local build';
const SCREEN_OVERLAY_BOUNDS = { position: 'absolute' as const, inset: 0 };

function shouldShowTutorialSkipPopup(state: GameState): boolean {
  return (
    !state.tutorialComplete &&
    state.tutorialStep === 0 &&
    state.interactiveTutorialState?.current === TutorialStateID.INTRO
  );
}

export default function Terminal({
  initialState,
  onExitAction,
  onSaveRequestAction,
  onLoadCheckpointAction,
}: TerminalProps) {
  const { t, translateRuntimeText } = useI18n();
  const initialPhase = deriveGamePhase(initialState);
  const {
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
    pendingImage,
    setPendingImage,
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
    appendPendingUfo74Messages,
    queuedAfterMediaMessages,
    setQueuedAfterMediaMessages,
    appendQueuedAfterMediaMessages,
    pendingUfo74StartMessages,
    setPendingUfo74StartMessages,
    appendPendingUfo74StartMessages,
    encryptedChannelState,
    setEncryptedChannelState,
    gamePhase,
    setGamePhase,
    countdownDisplay,
    setCountdownDisplay,
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
    evidenceFoundIndicatorKey,
    setEvidenceFoundIndicatorKey,
    interferenceBurst,
    setInterferenceBurst,
    terminalStaticLevel,
    setTerminalStaticLevel,
    alienSilhouetteVisible,
    setAlienSilhouetteVisible,
  } = useTerminalState(initialState, initialPhase);
  const keypressTimestamps = useRef<number[]>([]);
  const typingSpeedWarningTimeout = useRef<NodeJS.Timeout | null>(null);

  // Tutorial skip popup — show only on fresh new games (not loaded saves)
  const [showTutorialSkip, setShowTutorialSkip] = useState(
    shouldShowTutorialSkipPopup(initialState)
  );
  const [pendingEvidenceVideoPrompt, setPendingEvidenceVideoPrompt] =
    useState<EvidenceVideoAttachment | null>(null);
  const [activeEvidenceVideo, setActiveEvidenceVideo] = useState<EvidenceVideoAttachment | null>(
    null
  );
  const [activeTuringVideo, setActiveTuringVideo] = useState(false);
  const pendingEvidenceVideoCheckRef = useRef<{
    attachment: EvidenceVideoAttachment;
  } | null>(null);
  const idleHintTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTimeRef = useRef<number>(0);
  const timedMechanicPauseStartRef = useRef<number | null>(null);
  const timedMechanicResumeAdjustmentRef = useRef(0);
  const turingOverlayTimeoutRef = useRef<number | null>(null);
  const hasBlockingPopup =
    showSettings ||
    showAchievements ||
    showStatistics ||
    showPauseMenu ||
    showHeaderMenu ||
    showTutorialSkip ||
    showGameOver ||
    activeEvidenceVideo !== null ||
    pendingAchievement !== null ||
    showFirewallScare ||
    activeTuringVideo;
  const pauseTimedMechanics =
    activeImage !== null || showTuringTest || hasBlockingPopup;

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
    setAmbientDisturbance,
    soundEnabled,
    masterVolume,
    setMasterVolume,
  } = useSound();
  const [textSpeed, setTextSpeed] = useState<TextSpeed>(() => readStoredOptions().textSpeed);

  useEffect(() => {
    const syncTextSpeed = () => {
      setTextSpeed(readStoredOptions().textSpeed);
    };

    syncTextSpeed();
    window.addEventListener(OPTIONS_CHANGED_EVENT, syncTextSpeed);
    return () => window.removeEventListener(OPTIONS_CHANGED_EVENT, syncTextSpeed);
  }, []);

  // Autocomplete hook
  const { getCompletions, completeInput, markTabPressed, consumeTabPressed } =
    useAutocomplete(gameState);

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const enterOnlyButtonRef = useRef<HTMLButtonElement>(null);
  const headerMenuRef = useRef<HTMLDivElement>(null);
  const gameStateRef = useRef(gameState);
  const uiStateRef = useRef({
    gamePhase,
    showGameOver,
    showTuringTest,
    activeImage,
    pendingImage,
    hasBlockingPopup,
  });
  const isProcessingRef = useRef(false);
  const skipStreamingRef = useRef(false);
  const streamStartScrollPos = useRef<number | null>(null);
  const suppressPressure = shouldSuppressPressure(gameState);

  useEffect(() => {
    setShowTutorialSkip(shouldShowTutorialSkipPopup(initialState));
  }, [initialState]);

  const totalReadableFiles = useMemo(() => getAllAccessibleFiles(gameState).length, [gameState]);

  useEffect(() => {
    uiStateRef.current = {
      gamePhase,
      showGameOver,
      showTuringTest,
      activeImage,
      pendingImage,
      hasBlockingPopup,
    };
  }, [
    activeImage,
    gamePhase,
    hasBlockingPopup,
    pendingImage,
    showGameOver,
    showTuringTest,
  ]);

  const closeEvidenceVideo = useCallback(() => {
    const closingVideo = activeEvidenceVideo;
    setActiveEvidenceVideo(null);
    if (closingVideo?.filePath === '/sys/ghost_in_machine.enc') {
      appendPendingUfo74StartMessages([
        createEntry('ufo74', t('terminal.video.closeComment.identity1')),
        createEntry('ufo74', t('terminal.video.closeComment.identity2')),
      ]);
    } else if (closingVideo?.filePath === '/storage/assets/transport_log_96.txt') {
      appendPendingUfo74StartMessages([
        createEntry('ufo74', t('terminal.video.closeComment.transport1')),
        createEntry('ufo74', t('terminal.video.closeComment.transport2')),
      ]);
    } else if (closingVideo?.filePath === '/internal/jardim_andere_incident.txt' ||
        closingVideo?.filePath === '/storage/assets/logistics_manifest_fragment.txt' ||
        closingVideo?.filePath === '/admin/energy_extraction_theory.txt') {
      appendPendingUfo74StartMessages([
        createEntry('ufo74', t('terminal.video.ufoReaction1')),
        createEntry('ufo74', t('terminal.video.ufoReaction2')),
      ]);
    }
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [activeEvidenceVideo, appendPendingUfo74StartMessages, t]);

  const getEntryContent = useCallback(
    (entry: TerminalEntry): string => {
      if (entry.type === 'input') return entry.content;
      if (entry.i18nKey) {
        return t(entry.i18nKey, entry.i18nValues, entry.content);
      }
      return translateRuntimeText(entry.content);
    },
    [t, translateRuntimeText]
  );

  const visibleHistory = useMemo(
    () =>
      gameState.history
        .filter((entry, index, entries) => !shouldSuppressUfo74Spacer(entry, index, entries)),
    [gameState.history]
  );

  // Auto-scroll to bottom whenever new history entries are added or UI state changes
  useEffect(() => {
    if (outputRef.current) {
      // Double rAF ensures DOM has painted before measuring scrollHeight
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
          }
        });
      });
    }
  }, [
    visibleHistory.length,
    gameState.history.length,
    pendingImage,
    encryptedChannelState,
  ]);

  const isInteractiveTutorialInput =
    !!gameState.interactiveTutorialState &&
    !gameState.tutorialComplete &&
    isTutorialInputState(gameState.interactiveTutorialState.current);
  const isEnterOnlyMode =
    !pendingEvidenceVideoPrompt &&
    ((!gameState.tutorialComplete && !isInteractiveTutorialInput) ||
    encryptedChannelState !== 'idle' ||
    !!pendingImage ||
    pendingUfo74StartMessages.length > 0 ||
    (gameState.ufo74SecretDiscovered && gamePhase === 'terminal'));

  // Handle tutorial skip — replicate full tutorial completion state
  const handleTutorialSkip = useCallback(() => {
    setShowTutorialSkip(false);

    const skipIntroEntries = [
      createEntry('system', ''),
      createEntry('ufo74', t('terminal.tutorialSkip.connected')),
      createEntry('ufo74', t('terminal.tutorialSkip.alreadyKnow')),
      createEntry('ufo74', t('terminal.tutorialSkip.noHandHolding')),
      createEntry('system', ''),
      createEntry('system', t('terminal.tutorialSkip.createProfile')),
      createEntry('system', t('terminal.tutorialSkip.username')),
      createEntry('system', t('terminal.tutorialSkip.accessLevel')),
      createEntry('system', t('terminal.tutorialSkip.statusActive')),
      createEntry('system', ''),
      createEntry('notice', t('terminal.tutorialSkip.userRegistered')),
      createEntry('system', ''),
      createEntry('ufo74', t('terminal.tutorialSkip.objective')),
      createEntry('ufo74', t('terminal.tutorialSkip.help')),
      createEntry('ufo74', t('terminal.tutorialSkip.goodLuck')),
      createEntry('system', ''),
      createEntry('ufo74', t('terminal.tutorialSkip.ellipsis')),
      createEntry('system', ''),
      createEntry('system', t('terminal.tutorialSkip.disconnected')),
      createEntry('system', ''),
    ];

    const newState: GameState = {
      ...gameState,
      history: [...gameState.history, ...skipIntroEntries],
      tutorialStep: -1,
      tutorialComplete: true,
      currentPath: '/',
      interactiveTutorialState: {
        current: TutorialStateID.GAME_ACTIVE,
        inputLocked: false,
        dialogueComplete: true,
        failCount: 0,
        nudgeShown: false,
      },
    };

    setGameState(newState);

    // Reveal all UI trackers
    setShowEvidenceTracker(true);
    setShowRiskTracker(true);
    setShowAttBar(true);
    setShowAvatar(true);

    // Start ambient sound
    startAmbient();

    // Save checkpoint
    saveCheckpoint(newState, t('checkpoint.reason.tutorialSkipped'));
  }, [
    gameState,
    setGameState,
    setShowEvidenceTracker,
    setShowRiskTracker,
    setShowAttBar,
    setShowAvatar,
    startAmbient,
    t,
  ]);

  const handleTutorialContinue = useCallback(() => {
    setShowTutorialSkip(false);
  }, []);

  // Check for achievements
  const checkAchievement = useCallback(
    (id: string) => {
      const result = unlockAchievement(id);
      if (result?.isNew) {
        setPendingAchievement(result.achievement);
        playSound('success');
      }
    },
    [playSound, setPendingAchievement]
  );

  // Trigger flicker effect
  const triggerFlicker = useCallback(() => {
    setFlickerActive(true);
    setTimeout(() => setFlickerActive(false), 300);
  }, [setFlickerActive]);

  const {
    handleBlackoutComplete,
    handleVictory,
    handleIcqTrustChange,
    handleIcqMathMistake,
    handleIcqLeakChoice,
    handleIcqFilesSent,
    handleIcqStateSync,
    handleRestart,
    handleFirewallActivate,
  } = useGameActions({
    setGameState,
    setGamePhase,
    setShowTuringTest,
    setShowGameOver,
    setGameOverReason,
    onExitAction,
    playSound,
    triggerFlicker,
  });

  const onTuringTestTrigger = useCallback(() => {
    setActiveTuringVideo(true);
  }, []);

  const { handleSubmit: baseHandleSubmit, handleKeyDown } = useTerminalInput({
    gameState,
    gamePhase,
    inputValue,
    isProcessing,
    showTuringTest,
    pendingImage,
    pendingUfo74StartMessages,
    pendingUfo74Messages,
    historyIndex,
    textSpeed,
    setGameState,
    setInputValue,
    setIsProcessing,
    setIsStreaming,
    setHistoryIndex,
    setPendingImage,
    setActiveImage,
    setPendingUfo74StartMessages,
    appendPendingUfo74StartMessages,
    setPendingUfo74Messages,
    appendPendingUfo74Messages,
    setQueuedAfterMediaMessages,
    appendQueuedAfterMediaMessages,
    setShowEvidenceTracker,
    setShowRiskTracker,
    setShowAttBar,
    setShowAvatar,
    setAvatarCreepyEntrance,
    setIsShaking,
    setShowFirewallScare,
    setEvidenceFoundIndicatorKey,
    setGamePhase,
    setGameOverReason,
    setShowGameOver,
    setBurnInLines,
    setEncryptedChannelState,
    onTuringTestTrigger,
    onExitAction,
    onSaveRequestAction,
    playSound,
    playKeySound,
    startAmbient,
    triggerFlicker,
    checkAchievement,
    getCompletions,
    completeInput,
    markTabPressed,
    consumeTabPressed,
    refs: {
      outputRef,
      inputRef,
      streamStartScrollPos,
      skipStreamingRef,
      isProcessingRef,
    },
  });

  const lastUfo74ReactionIndexRef = useRef<number>(-1);

  const handleFirewallTaunt = useCallback(() => {
    let idx: number;
    do {
      idx = Math.floor(Math.random() * UFO74_FIREWALL_REACTION_KEYS.length);
    } while (idx === lastUfo74ReactionIndexRef.current && UFO74_FIREWALL_REACTION_KEYS.length > 1);
    lastUfo74ReactionIndexRef.current = idx;

    appendPendingUfo74StartMessages([
      createEntry('ufo74', t(UFO74_FIREWALL_REACTION_KEYS[idx])),
    ]);
  }, [appendPendingUfo74StartMessages, t]);

  const handleSubmit = useCallback(
    async (e?: React.SyntheticEvent) => {
      e?.preventDefault?.();

      // Unlock speech synthesis on first user gesture (browser autoplay policy)
      unlockSpeechSynthesis();

      if (activeEvidenceVideo) {
        return;
      }

      const trimmedInput = inputValue.trim();

      if (pendingEvidenceVideoPrompt) {
        if (!trimmedInput) {
          return;
        }

        const normalizedInput = normalizeVideoPromptChoice(trimmedInput);

        if (normalizedInput === 'yes') {
          setGameState(prev => ({
            ...prev,
            history: [...prev.history, createEntry('input', trimmedInput)],
          }));
          setInputValue('');
          setPendingEvidenceVideoPrompt(null);
          setActiveEvidenceVideo(pendingEvidenceVideoPrompt);
          return;
        }

        if (normalizedInput === 'no') {
          setGameState(prev => ({
            ...prev,
            history: [...prev.history, createEntry('input', trimmedInput)],
          }));
          setInputValue('');
          setPendingEvidenceVideoPrompt(null);
          setTimeout(() => inputRef.current?.focus(), 0);
          return;
        }

        setGameState(prev => ({
          ...prev,
          history: [
            ...prev.history,
            createEntry('input', trimmedInput),
            createEntry('error', t('terminal.video.invalidChoice')),
          ],
        }));
        setInputValue('');
        return;
      }

      const attachment = getEvidenceVideoAttachment(trimmedInput, gameState.currentPath);
      pendingEvidenceVideoCheckRef.current = attachment
        ? { attachment }
        : null;

      await baseHandleSubmit(e);
    },
    [
      activeEvidenceVideo,
      baseHandleSubmit,
      gameState.currentPath,
      inputValue,
      pendingEvidenceVideoPrompt,
      setGameState,
      setInputValue,
      t,
    ]
  );

  // Effects hook - MUST be called before any conditional returns (React rules of hooks)
  const { focusTerminalInput } = useTerminalEffects({
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
    onEnterPress: handleSubmit,
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
    refs: {
      outputRef,
      inputRef,
      enterOnlyButtonRef,
      gameStateRef,
      streamStartScrollPos,
      typingSpeedWarningTimeout,
      idleHintTimerRef,
      lastScrollTimeRef,
      timedMechanicPauseStartRef,
      timedMechanicResumeAdjustmentRef,
      maxDetectionRef,
      prevDetectionRef,
      skipStreamingRef,
      uiStateRef,
      turingOverlayTimeoutRef,
    },
  });

  useEffect(() => {
    const pendingCheck = pendingEvidenceVideoCheckRef.current;

    if (
      !pendingCheck ||
      isProcessing ||
      isStreaming ||
      activeImage !== null ||
      pendingImage !== null ||
      pendingEvidenceVideoPrompt !== null ||
      activeEvidenceVideo !== null
    ) {
      return;
    }

    setGameState(prev => ({
      ...prev,
      history: [
        ...prev.history,
        createEntry('system', ''),
        createEntry('notice', t('terminal.video.prompt')),
      ],
    }));
    setPendingEvidenceVideoPrompt(pendingCheck.attachment);

    pendingEvidenceVideoCheckRef.current = null;
  }, [
    activeEvidenceVideo,
    activeImage,
    isProcessing,
    isStreaming,
    pendingEvidenceVideoPrompt,
    pendingImage,
    setGameState,
    t,
  ]);

  useEffect(() => {
    setAmbientDisturbance(alienSilhouetteVisible ? 1 : 0);
  }, [alienSilhouetteVisible, setAmbientDisturbance]);

  useEffect(() => {
    if (!activeEvidenceVideo) {
      return;
    }

    const handleVideoEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      closeEvidenceVideo();
    };

    window.addEventListener('keydown', handleVideoEscape, true);
    return () => {
      window.removeEventListener('keydown', handleVideoEscape, true);
    };
  }, [activeEvidenceVideo, closeEvidenceVideo]);

  useEffect(() => {
    if (!activeTuringVideo) {
      return;
    }

    const handleTuringVideoEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      setActiveTuringVideo(false);
      setShowTuringTest(true);
    };

    window.addEventListener('keydown', handleTuringVideoEscape, true);
    return () => {
      window.removeEventListener('keydown', handleTuringVideoEscape, true);
    };
  }, [activeTuringVideo, setShowTuringTest]);

  // Click-outside handler for header menu - closes menu and refocuses input
  useEffect(() => {
    if (!showHeaderMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // Check if click is outside the header menu
      if (headerMenuRef.current && !headerMenuRef.current.contains(target)) {
        setShowHeaderMenu(false);
        setTimeout(focusTerminalInput, 0);
      }
    };

    // Delay adding listener to avoid immediate close
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showHeaderMenu, setShowHeaderMenu, focusTerminalInput]);

  useEffect(() => {
    if (!showGameOver && !gameState.isGameOver) return;

    stopAmbient();
    speakCustomFirewallVoice(t('firewall.voice.disconnect'));
  }, [gameState.isGameOver, showGameOver, stopAmbient, t]);

  // Refocus input when tutorial skip popup closes
  const prevShowTutorialSkipRef = useRef(showTutorialSkip);
  useEffect(() => {
    // If popup was just closed (was showing, now not showing), refocus
    if (prevShowTutorialSkipRef.current && !showTutorialSkip) {
      setTimeout(focusTerminalInput, 0);
    }
    prevShowTutorialSkipRef.current = showTutorialSkip;
  }, [showTutorialSkip, focusTerminalInput]);

  // Get status bar content
  const getStatusBar = () => {
    const parts: string[] = [];

    if (gameState.detectionLevel >= DETECTION_THRESHOLDS.SUSPICIOUS) {
      parts.push(t('terminal.status.auditActive'));
    }
    if (gameState.sessionStability < 50) {
      parts.push(t('terminal.status.sessionUnstable'));
    }
    if (gameState.flags.adminUnlocked) {
      parts.push(t('terminal.status.accessAdmin'));
    }
    if (gameState.paranoiaLevel >= 40) {
      parts.push(t('terminal.status.paranoiaElevated'));
    } else if (gameState.paranoiaLevel >= 15) {
      parts.push(t('terminal.status.paranoiaActive'));
    }
    if (gameState.isGameOver) {
      parts.push(translateRuntimeText(gameState.gameOverReason || t('terminal.status.terminated')));
    }

    return parts.join(' │ ') || t('terminal.status.systemNominal');
  };

  // Get save indicator text
  const getSaveIndicator = () => {
    if (!gameState.lastSaveTime) return null;
    const elapsed = Math.floor((Date.now() - gameState.lastSaveTime) / 60000);
    if (elapsed < 1) return t('terminal.save.justNow');
    if (elapsed < 60) return t('terminal.save.minutes', { value: elapsed });
    const hours = Math.floor(elapsed / 60);
    return t('terminal.save.hours', { value: hours });
  };

  // Get risk level display with percentage
  const getRiskLevel = () => {
    const detection = gameState.detectionLevel;
    const percent = `${detection}%`;
    if (detection >= 80)
      return { level: t('terminal.risk.critical', { percent }), color: 'critical' };
    if (detection >= 60) return { level: t('terminal.risk.high', { percent }), color: 'high' };
    if (detection >= 40)
      return { level: t('terminal.risk.elevated', { percent }), color: 'elevated' };
    if (detection >= 20) return { level: t('terminal.risk.low', { percent }), color: 'low' };
    return { level: t('terminal.risk.minimal', { percent }), color: 'minimal' };
  };

  // Get invalid attempts display (shows attempts made, not remaining)
  // Uses legacyAlertCounter which tracks invalid commands, matching inline "[Invalid attempts: X/8]"
  const getAttemptsDisplay = () => {
    const attempts = gameState.legacyAlertCounter || 0;
    return `${attempts}/${MAX_WRONG_ATTEMPTS}`;
  };

  const evidenceFoundCount = gameState.evidenceCount || 0;
  const riskInfo = getRiskLevel();
  const saveIndicator = getSaveIndicator();

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
        <span
          key={`redact-${match.index}`}
          className={styles.redacted}
          title={t('terminal.redaction.classified')}
        >
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

  // Render text with backtick-wrapped commands highlighted green
  const renderCommandHighlights = (text: string) => {
    if (!text.includes('`')) return renderTextWithRedactions(text);

    const parts: React.ReactNode[] = [];
    const cmdPattern = /`([^`]+)`/g;
    let lastIndex = 0;
    let match;

    while ((match = cmdPattern.exec(text)) !== null) {
      // Text before the match
      if (match.index > lastIndex) {
        parts.push(
          <React.Fragment key={`t-${lastIndex}`}>
            {renderTextWithRedactions(text.substring(lastIndex, match.index))}
          </React.Fragment>
        );
      }
      // The command itself — green
      parts.push(
        <span key={`cmd-${match.index}`} className={styles.tutorialCommand}>
          {match[1]}
        </span>
      );
      lastIndex = match.index + match[0].length;
    }

    // Remaining text
    if (lastIndex < text.length) {
      parts.push(
        <React.Fragment key={`t-${lastIndex}`}>
          {renderTextWithRedactions(text.substring(lastIndex))}
        </React.Fragment>
      );
    }

    return <>{parts}</>;
  };

  const renderEntry = (entry: TerminalEntry, nextEntry?: TerminalEntry) => {
    let className = styles.line;
    const entryContent = getEntryContent(entry);

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
        className = `${styles.line} ${styles.ufo74} ${styles.ufo74Flush}`;
        break;
      case 'file':
        className = `${styles.line} ${styles.fileContent}`;
        break;
      case 'dim':
        className = `${styles.line} ${styles.dim}`;
        break;
    }

    if (nextEntry?.type === 'ufo74') {
      className = `${className} ${styles.flushBeforeUfo74}`;
    }

    const isReadListingLine = entry.type === 'output' && /\s\[READ\]/.test(entry.content);

    if (isReadListingLine) {
      className = `${className} ${styles.readLine}`;
    }

    return (
      <div key={entry.id} className={className}>
        {entry.type === 'ufo74'
          ? renderCommandHighlights(entryContent)
          : renderTextWithRedactions(entryContent)}
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
        key={`${gameState.seed}:${gameState.lastSaveTime}`}
        onVictoryAction={handleVictory}
        initialTrust={gameState.icqTrust}
        initialMessages={gameState.icqMessages}
        initialPhase={gameState.icqConversationPhase}
        initialQuestion={gameState.currentMathQuestion}
        initialQuestionWrongAttempts={gameState.icqCurrentWrongAttempts}
        initialFilesSent={gameState.filesSent}
        initialLeakChoice={gameState.choiceLeakPath}
        onTrustChange={handleIcqTrustChange}
        onMathMistake={handleIcqMathMistake}
        onLeakChoice={handleIcqLeakChoice}
        onFilesSent={handleIcqFilesSent}
        onStateChange={handleIcqStateSync}
      />
    );
  }

  if (gamePhase === 'victory') {
    const endingFlags = getEndingFlags(gameState);
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
        evidenceCount={gameState.evidenceCount}
        filesReadCount={gameState.filesRead?.size || 0}
        totalReadableFiles={totalReadableFiles}
        // Multiple endings flags
        conspiracyFilesLeaked={endingFlags.conspiracyFilesLeaked}
        alphaReleased={endingFlags.alphaReleased}
        neuralLinkAuthenticated={endingFlags.neuralLinkAuthenticated}
        textSpeed={textSpeed}
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
      <div className={styles.crtShell}>
        <div className={styles.crtBezel}>
          {/* Bezel patina and old-TV wear live outside the game screen */}
          <div className={styles.scanlines} aria-hidden="true" />
          <div className={styles.dirtyScreen} aria-hidden="true" />
          <div className={styles.vignette} aria-hidden="true" />
          <div className={styles.edgeDecay} aria-hidden="true" />
          <div className={styles.smokeParticles} aria-hidden="true">
            <div className={styles.smokeParticle3} />
            <div className={styles.smokeParticle4} />
            <div className={styles.smokeParticle5} />
          </div>

          <div className={styles.screenViewport}>
            <div className={styles.screenWarp}>
              <div
                className={`${styles.terminal} ${styles.phosphorDrift} ${flickerActive ? styles.flicker : ''} ${isShaking ? styles.shaking : ''} ${isWarmingUp ? styles.warmingUp : ''}`}
                onClick={focusTerminalInput}
              >
                {/* Horizontal interference burst */}
                {interferenceBurst && (
                  <div
                    className={styles.interferenceBurst}
                    style={{ top: `${interferenceBurst.top}%` }}
                  />
                )}

        {/* White noise static overlay + alien face materialization */}
        <StaticNoise
          intensity={terminalStaticLevel}
          alienVisible={alienSilhouetteVisible}
          aria-hidden="true"
        />

        {/* Screen burn-in effect - ghost text from previous outputs */}
        {burnInLines.length > 0 && (
          <div className={styles.burnIn} aria-hidden="true">
            {burnInLines.map((line, i) => (
              <div
                key={i}
                className={styles.burnInLine}
                style={{ opacity: 0.02 * (burnInLines.length - i) }}
              >
                {translateRuntimeText(line)}
              </div>
            ))}
          </div>
        )}

        {/* Paranoia message overlay */}
        {paranoiaMessage && (
          <div
            className={styles.paranoiaMessage}
            style={{ top: paranoiaPosition.top, left: paranoiaPosition.left }}
            role="alert"
            aria-live="assertive"
          >
            {translateRuntimeText(paranoiaMessage)}
          </div>
        )}

        {/* Firewall Eyes - ambient Lovecraftian watchers */}
        {gameState.tutorialComplete && !gameState.isGameOver && (
          <FirewallEyes
            detectionLevel={gameState.detectionLevel}
            firewallActive={gameState.firewallActive}
            firewallDisarmed={gameState.firewallDisarmed}
            onActivateFirewall={handleFirewallActivate}
            onFirewallTaunt={handleFirewallTaunt}
          />
        )}

        {/* Sound toggle moved to Settings menu (ESC -> Settings) */}

        {/* Countdown timer */}
        {countdownDisplay && (
          <FloatingElement id="countdown-timer" zone="top-center" priority={1} baseOffset={80}>
            <div className={styles.countdownTimerContent}>
              <span className={styles.countdownLabel}>{t('terminal.timer.traceActive')}</span>
              <span className={styles.countdownTime}>{countdownDisplay}</span>
            </div>
          </FloatingElement>
        )}

        {/* Status bar with dropdown menu */}
        <div className={styles.statusBar}>
          <span
            className={`${styles.statusLeft} ${styles.clickable}`}
            role="button"
            tabIndex={0}
            aria-expanded={showHeaderMenu}
            aria-controls="terminal-header-menu"
            onClick={() => setShowHeaderMenu(!showHeaderMenu)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowHeaderMenu(prev => !prev);
              }
            }}
          >
            {t('terminal.header.title')}{' '}
            <span className={styles.versionTag} title={VERSION_TOOLTIP}>
              {DEPLOY_VERSION}
            </span>{' '}
            ▼
          </span>
          {/* ESC button */}
          <button
            className={styles.escButton}
            onClick={() => setShowPauseMenu(true)}
            title={t('terminal.pause.title')}
            aria-label={t('terminal.pause.aria')}
          >
            ESC
          </button>
          {saveIndicator && (
            <span aria-live="polite" className={styles.saveIndicator}>
              {saveIndicator}
            </span>
          )}
          <span className={styles.statusRight}>{getStatusBar()}</span>

          {/* Dropdown menu */}
          {showHeaderMenu && (
            <div
              ref={headerMenuRef}
              className={styles.headerMenu}
              id="terminal-header-menu"
              role="menu"
            >
              <button
                className={styles.menuItem}
                tabIndex={-1}
                onMouseDown={e => e.preventDefault()}
                onClick={() => {
                  onSaveRequestAction(gameState);
                  setShowHeaderMenu(false);
                  setTimeout(focusTerminalInput, 0);
                }}
              >
                {t('terminal.menu.save')}
              </button>
              <button
                className={styles.menuItem}
                tabIndex={-1}
                onMouseDown={e => e.preventDefault()}
                onClick={() => {
                  setShowHeaderMenu(false);
                  onExitAction();
                }}
              >
                {t('terminal.menu.return')}
              </button>
              <button
                className={styles.menuItem}
                tabIndex={-1}
                onMouseDown={e => e.preventDefault()}
                onClick={() => {
                  setShowSettings(true);
                  setShowHeaderMenu(false);
                }}
              >
                {t('terminal.menu.settings')}
              </button>
              <button
                className={styles.menuItem}
                tabIndex={-1}
                onMouseDown={e => e.preventDefault()}
                onClick={() => {
                  setShowAchievements(true);
                  setShowHeaderMenu(false);
                  setTimeout(focusTerminalInput, 0);
                }}
              >
                {t('terminal.menu.achievements')}
              </button>
              <button
                className={styles.menuItem}
                tabIndex={-1}
                onMouseDown={e => e.preventDefault()}
                onClick={() => {
                  setShowStatistics(true);
                  setShowHeaderMenu(false);
                  setTimeout(focusTerminalInput, 0);
                }}
              >
                {t('terminal.menu.statistics')}
              </button>
            </div>
          )}
        </div>

        {/* Progress tracker */}
        <div className={styles.progressTracker}>
          <div
            className={`${styles.truthsSection} ${showEvidenceTracker ? styles.trackerVisible : styles.trackerHidden}`}
          >
            <span className={styles.evidenceTrackerTitle}>{t('terminal.tracker.alienFiles')}</span>
            <span className={styles.evidenceTrackerDivider}>—</span>
            <span className={styles.truthCount}>
              {t('terminal.tracker.evidenceFound', { count: evidenceFoundCount, total: 10 })}
            </span>
          </div>
          <div className={`${styles.riskSection} ${riskPulse ? styles.riskPulse : ''}`}>
            <span
              className={`${styles.riskItem} ${showRiskTracker ? styles.trackerVisible : styles.trackerHidden}`}
            >
              <span className={styles.trackerLabel}>{t('terminal.tracker.risk')}</span>
              <span className={`${styles.riskLevel} ${styles[riskInfo.color]}`}>
                {riskInfo.level}
              </span>
            </span>
            <span
              className={`${styles.attItem} ${showAttBar ? styles.trackerVisible : styles.trackerHidden}`}
            >
              <span className={styles.memoryLevel}>
                {t('terminal.tracker.alerts')} {getAttemptsDisplay()}
              </span>
            </span>
          </div>
        </div>

        {/* Output area */}
        <div
          className={styles.output}
          ref={outputRef}
          role="log"
          aria-live="polite"
          aria-relevant="additions"
        >
          {visibleHistory.map((entry, index) => renderEntry(entry, visibleHistory[index + 1]))}
          {isProcessing && (
            <div className={`${styles.line} ${styles.processing}`}>{t('terminal.processing')}</div>
          )}
          {/* Blinking enter prompt at end of text when in enter-only mode */}
          {!isProcessing && isEnterOnlyMode && !gameState.isGameOver && (
            <div className={styles.enterHintInline}>{t('terminal.enter.proceed')}</div>
          )}
        </div>

        {/* Input area */}
        {/* Show subtle enter prompt when in enter-only mode (tutorial, encrypted channel, pending media, staged UFO74, secret ending confirmation) */}
        {isEnterOnlyMode && !gameState.isGameOver ? (
          <>
            {/* Hidden form for keyboard enter handling */}
            <form
              onSubmit={handleSubmit}
              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
            >
              <button ref={enterOnlyButtonRef} type="submit" autoFocus={!showTutorialSkip} />
            </form>
            {/* Centered enter prompt - inline in flex layout to prevent overlap */}
            <div className={styles.enterPromptArea}>
              <button
                type="button"
                className={styles.enterPromptContent}
                disabled={isProcessing}
                onClick={handleSubmit}
                onMouseDown={e => e.preventDefault()}
                tabIndex={-1}
              >
                <span className={styles.enterPromptText}>
                  {encryptedChannelState === 'awaiting_close'
                    ? t('terminal.enter.close')
                    : encryptedChannelState !== 'idle'
                      ? t('terminal.enter.respond')
                      : pendingImage
                        ? t('terminal.enter.view')
                        : t('terminal.enter.continue')}
                </span>
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className={styles.inputArea}>
            <span className={styles.prompt}>&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              aria-label={t('terminal.input.aria')}
              placeholder={t('terminal.input.placeholder')}
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
              disabled={isProcessing || gameState.isGameOver || activeEvidenceVideo !== null}
              autoFocus={!showTutorialSkip}
              autoComplete="off"
              spellCheck={false}
            />
            <span className={styles.cursor}>_</span>
            {/* Typing speed warning - inline within input area to prevent overlap */}
            {typingSpeedWarning && (
              <span className={styles.typingWarningInline}>{t('terminal.typing.warning')}</span>
            )}
          </form>
        )}

        {/* Timed decryption timer overlay */}
        {gameState.timedDecryptActive && timedDecryptRemaining > 0 && (
          <FloatingElement id="timed-decrypt-timer" zone="top-right" priority={1} baseOffset={130}>
            <div className={styles.timedDecryptTimerContent}>
              <div className={styles.timerLabel}>{t('terminal.timer.decryptWindow')}</div>
              <div className={styles.timerValue}>{(timedDecryptRemaining / 1000).toFixed(1)}s</div>
              <div className={styles.timerSequence}>
                {t('terminal.timer.sequence', { value: gameState.timedDecryptSequence ?? '' })}
              </div>
            </div>
          </FloatingElement>
        )}

        {/* Hacker avatar HUD panel */}
        {(showAvatar || gameState.tutorialComplete) && (
          <HackerAvatar
            expression={(gameState.avatarExpression as AvatarExpression) || 'neutral'}
            detectionLevel={gameState.detectionLevel}
            sessionStability={gameState.sessionStability}
            creepyEntrance={avatarCreepyEntrance}
            evidenceFoundIndicatorKey={evidenceFoundIndicatorKey}
            onExpressionTimeout={() => {
              setGameState(prev => ({ ...prev, avatarExpression: 'neutral' }));
            }}
          />
        )}

        {activeEvidenceVideo && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t('videoOverlay.aria', { value: activeEvidenceVideo.videoTitle })}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 2500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              background: 'rgba(0, 0, 0, 0.92)',
            }}
          >
            <div
              style={{
                width: 'min(960px, 100%)',
                maxHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                padding: '1rem',
                background: '#040704',
                border: '1px solid #88cc44',
                boxShadow: '0 0 30px rgba(136, 204, 68, 0.18)',
              }}
            >
              <div
                style={{
                  color: '#88cc44',
                  fontFamily: 'VT323, monospace',
                  fontSize: '1.6rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {t('videoOverlay.attachedTitle', { value: activeEvidenceVideo.videoTitle })}
              </div>
              {/* Video with CRT/terminal overlay */}
              <div style={{ position: 'relative', width: '100%' }}>
                <video
                  key={activeEvidenceVideo.videoSrc}
                  src={activeEvidenceVideo.videoSrc}
                  controls
                  autoPlay
                  playsInline
                  style={{
                    width: '100%',
                    maxHeight: '70vh',
                    background: '#000',
                    filter: 'sepia(100%) saturate(300%) brightness(70%) hue-rotate(70deg)',
                  }}
                />
                {/* Scanlines */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                />
                {/* Green CRT glow */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    boxShadow: 'inset 0 0 60px rgba(0,255,0,0.1)',
                    pointerEvents: 'none',
                    zIndex: 2,
                  }}
                />
                {/* Static noise overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    opacity: 0.06,
                    pointerEvents: 'none',
                    mixBlendMode: 'overlay',
                    zIndex: 3,
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  color: '#88cc44',
                  fontFamily: 'VT323, monospace',
                  fontSize: '1.1rem',
                }}
              >
                <span>{t('videoOverlay.returnHint')}</span>
                <button
                  type="button"
                  onClick={closeEvidenceVideo}
                  style={{
                    border: '1px solid #88cc44',
                    background: 'transparent',
                    color: '#88cc44',
                    padding: '0.35rem 0.85rem',
                    fontFamily: 'VT323, monospace',
                    fontSize: '1.1rem',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  {t('common.close')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Turing test video */}
        {activeTuringVideo && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t('videoOverlay.turingAria')}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 2500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              background: 'rgba(0, 0, 0, 0.92)',
            }}
          >
            <div
              style={{
                width: 'min(960px, 100%)',
                maxHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                padding: '1rem',
                background: '#040704',
                border: '1px solid #88cc44',
                boxShadow: '0 0 30px rgba(136, 204, 68, 0.18)',
              }}
            >
              <div
                style={{
                  color: '#88cc44',
                  fontFamily: 'VT323, monospace',
                  fontSize: '1.6rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {t('videoOverlay.attachedTitle', { value: 'turing_test.mp4' })}
              </div>
              <div style={{ position: 'relative', width: '100%' }}>
                <video
                  key={TURING_TEST_VIDEO_SRC}
                  src={TURING_TEST_VIDEO_SRC}
                  controls
                  autoPlay
                  playsInline
                  onEnded={() => {
                    setActiveTuringVideo(false);
                    setShowTuringTest(true);
                  }}
                  style={{
                    width: '100%',
                    maxHeight: '70vh',
                    background: '#000',
                    filter: 'sepia(100%) saturate(300%) brightness(70%) hue-rotate(70deg)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    boxShadow: 'inset 0 0 60px rgba(0,255,0,0.1)',
                    pointerEvents: 'none',
                    zIndex: 2,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    opacity: 0.06,
                    pointerEvents: 'none',
                    mixBlendMode: 'overlay',
                    zIndex: 3,
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  color: '#88cc44',
                  fontFamily: 'VT323, monospace',
                  fontSize: '1.1rem',
                }}
              >
                <span>{t('videoOverlay.returnHint')}</span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTuringVideo(false);
                    setShowTuringTest(true);
                  }}
                  style={{
                    border: '1px solid #88cc44',
                    background: 'transparent',
                    color: '#88cc44',
                    padding: '0.35rem 0.85rem',
                    fontFamily: 'VT323, monospace',
                    fontSize: '1.1rem',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  {t('common.close')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image overlay */}
        {activeImage && (
          <ImageOverlay
            src={activeImage.src}
            alt={activeImage.alt}
            altKey={activeImage.altKey}
            tone={activeImage.tone}
            corrupted={activeImage.corrupted}
            onCloseAction={() => {
              // Add "Media recovered" message to terminal
              const recoveredMessage = createEntry(
                'system',
                t('terminal.system.mediaRecoveredVisual')
              );

              // Collect all UFO74 messages to show after image closes
              const allUfo74Messages: TerminalEntry[] = [];

              // First add any queued messages from the command result (content reactions)
              if (queuedAfterMediaMessages.length > 0) {
                allUfo74Messages.push(...queuedAfterMediaMessages);
                setQueuedAfterMediaMessages([]); // Clear the queue
              }

              // Then add image-specific comments
              const imageCommentKeys = UFO74_IMAGE_COMMENT_KEYS[activeImage.src];
              if (imageCommentKeys && imageCommentKeys.length > 0) {
                const commentKey = uiRandomPick(imageCommentKeys);
                allUfo74Messages.push(createEntry('ufo74', t(commentKey)));
              }

              setGameState(prev => ({
                ...prev,
                history: [...prev.history, recoveredMessage],
              }));
              if (allUfo74Messages.length > 0) {
                appendPendingUfo74StartMessages(allUfo74Messages);
              }
              setActiveImage(null);
              inputRef.current?.focus();
            }}
          />
        )}

        {/* Firewall Scare overlay */}
        {showFirewallScare && (
          <div
            className={styles.firewallScareOverlay}
            style={SCREEN_OVERLAY_BOUNDS}
            role="alert"
          >
            <div className={styles.firewallScareEye}>
              <div className={styles.firewallScareIris} />
              <div className={styles.firewallScarePupil} />
            </div>
            <div className={styles.firewallScareText}>{t('terminal.firewall.scare')}</div>
          </div>
        )}

        {/* Turing Test overlay */}
        {showTuringTest && (
          <TuringTestOverlay
            onCorrectAnswer={() => playSound('success')}
            onComplete={passed => {
              setShowTuringTest(false);

              if (passed) {
                // Turing test passed
                const passedMessages = [
                  createEntry('system', ''),
                  createEntry('notice', t('terminal.turing.passed.header')),
                  createEntry('notice', t('terminal.turing.passed.line1')),
                  createEntry('notice', t('terminal.turing.passed.line2')),
                  createEntry('system', ''),
                  createEntry('ufo74', t('terminal.turing.passed.ufo1')),
                  createEntry('ufo74', t('terminal.turing.passed.ufo2')),
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
                  createEntry('error', t('terminal.turing.failed.header')),
                  createEntry('error', t('terminal.turing.failed.line1')),
                  createEntry('error', t('terminal.turing.failed.line2')),
                  createEntry('system', ''),
                ];
                setGameState(prev => ({
                  ...prev,
                  history: [...prev.history, ...failedMessages],
                  turingEvaluationActive: false,
                  isGameOver: true,
                  gameOverReason: t('terminal.turing.failed.reason'),
                  endingType: 'bad',
                }));
                playSound('error');
                setTimeout(() => {
                  setGameOverReason(t('terminal.turing.failed.reason'));
                  setShowGameOver(true);
                }, GAME_OVER_DELAY_MS);
              }

              inputRef.current?.focus();
            }}
          />
        )}

        {/* Game Over overlay */}
        {showGameOver && (
          <GameOver
            reason={gameOverReason}
            onMainMenuAction={onExitAction}
            onLoadCheckpointAction={slotId => {
              if (onLoadCheckpointAction) {
                onLoadCheckpointAction(slotId);
              } else {
                // Fallback: load checkpoint inline
                const loadedState = loadCheckpoint(slotId);
                if (loadedState) {
                  setGameState(loadedState);
                  setShowGameOver(false);
                  setGamePhase('terminal');
                }
              }
            }}
          />
        )}

        {/* Achievement popup */}
        {pendingAchievement && (
          <AchievementPopup
            achievement={pendingAchievement}
            onDismiss={() => {
              setPendingAchievement(null);
              setTimeout(focusTerminalInput, 0);
            }}
          />
        )}

        {/* Settings modal */}
        {showSettings && (
          <SettingsModal
            soundEnabled={soundEnabled}
            masterVolume={masterVolume}
            onToggleSound={toggleSound}
            onVolumeChange={setMasterVolume}
            onCloseAction={() => {
              setShowSettings(false);
              setTimeout(focusTerminalInput, 0);
            }}
            onResetDefaults={() => {
              if (!soundEnabled) toggleSound();
              setMasterVolume(1);
            }}
          />
        )}

        {/* Achievement gallery */}
        {showAchievements && (
          <AchievementGallery
            onCloseAction={() => {
              setShowAchievements(false);
              setTimeout(focusTerminalInput, 0);
            }}
          />
        )}

        {/* Statistics modal */}
        {showStatistics && (
          <StatisticsModal
            onCloseAction={() => {
              setShowStatistics(false);
              setTimeout(focusTerminalInput, 0);
            }}
          />
        )}

        {/* Pause menu */}
        {showPauseMenu && (
          <PauseMenu
            canLoadAction={getLatestCheckpoint() !== null}
            onResumeAction={() => {
              setShowPauseMenu(false);
              setTimeout(focusTerminalInput, 0);
            }}
            onSaveAction={() => {
              setShowPauseMenu(false);
              onSaveRequestAction(gameState);
              setTimeout(focusTerminalInput, 0);
            }}
            onLoadAction={() => {
              const latestCheckpoint = getLatestCheckpoint();
              setShowPauseMenu(false);
              if (!latestCheckpoint) {
                setTimeout(focusTerminalInput, 0);
                return;
              }

              if (onLoadCheckpointAction) {
                onLoadCheckpointAction(latestCheckpoint.id);
              } else {
                const loadedState = loadCheckpoint(latestCheckpoint.id);
                if (loadedState) {
                  setGameState({
                    ...loadedState,
                    isGameOver: false,
                    gameOverReason: undefined,
                  });
                  setGamePhase('terminal');
                }
              }
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

                {/* Tutorial skip popup — shown on fresh new game */}
                {showTutorialSkip && (
                  <TutorialSkipPopup onSkip={handleTutorialSkip} onContinue={handleTutorialContinue} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </FloatingUIProvider>
  );
}
