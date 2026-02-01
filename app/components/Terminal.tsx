'use client';

import React, { useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { GamePhase, GameState, TerminalEntry } from '../types';
import { createEntry } from '../engine/commands';
import { isTutorialInputState } from '../engine/commands/interactiveTutorial';
import { loadCheckpoint } from '../storage/saves';
import { DETECTION_THRESHOLDS } from '../constants/detection';
import { TYPING_WARNING_TIMEOUT_MS, GAME_OVER_DELAY_MS } from '../constants/timing';
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
import { unlockAchievement, Achievement } from '../engine/achievements';
import { uiRandomPick } from '../engine/rng';
import AchievementPopup from './AchievementPopup';
import SettingsModal from './SettingsModal';
import PauseMenu from './PauseMenu';
import HackerAvatar, { AvatarExpression } from './HackerAvatar';
import { FloatingUIProvider, FloatingElement } from './FloatingUI';
import FirewallEyes from './FirewallEyes';

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

// UFO74 comments after viewing images - keyed by image src
const UFO74_IMAGE_COMMENTS: Record<string, string[]> = {
  '/images/crash.png': [
    'UFO74: that wreckage... wrong metallurgy.',
    'UFO74: they moved fast. knew what to hide.',
  ],
  '/images/et.png': [
    'UFO74: seen that face in dreams.',
    'UFO74: not fear in those eyes. recognition.',
  ],
  '/images/et-scared.png': [
    'UFO74: during transmission, something reached back.',
    'UFO74: let itself be captured.',
  ],
  '/images/second-ship.png': ['UFO74: SECOND one? they were arriving.'],
  '/images/drone.png': ['UFO74: no propulsion. no control surfaces. yet it flies.'],
  '/images/prato-delta.png': ['UFO74: three recovery sites. shipped everything out.'],
  '/images/et-brain.png': [
    'UFO74: neural density off the charts.',
    'UFO74: some patterns travel both ways. careful.',
  ],
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

interface TerminalProps {
  initialState: GameState;
  onExitAction: () => void;
  onSaveRequestAction: (state: GameState) => void;
  onLoadCheckpointAction?: (slotId: string) => void;
}

export default function Terminal({
  initialState,
  onExitAction,
  onSaveRequestAction,
  onLoadCheckpointAction,
}: TerminalProps) {
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
  } = useTerminalState(initialState, initialPhase);
  const keypressTimestamps = useRef<number[]>([]);
  const typingSpeedWarningTimeout = useRef<NodeJS.Timeout | null>(null);
  const idleHintTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTimeRef = useRef<number>(0);
  const firewallPauseStartRef = useRef<number | null>(null);
  const isFirewallPaused =
    activeImage !== null ||
    activeVideo !== null ||
    showTuringTest ||
    gameState.timedDecryptActive ||
    gameState.traceSpikeActive ||
    gameState.countdownActive;

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
  const { getCompletions, completeInput, markTabPressed, consumeTabPressed } = useAutocomplete(gameState);

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const enterOnlyButtonRef = useRef<HTMLButtonElement>(null);
  const gameStateRef = useRef(gameState);
  const isProcessingRef = useRef(false);
  const skipStreamingRef = useRef(false);
  const streamStartScrollPos = useRef<number | null>(null);
  const suppressPressure = shouldSuppressPressure(gameState);

  const isInteractiveTutorialInput =
    !!gameState.interactiveTutorialState &&
    !gameState.tutorialComplete &&
    isTutorialInputState(gameState.interactiveTutorialState.current);
  const isEnterOnlyMode =
    (!gameState.tutorialComplete && !isInteractiveTutorialInput) ||
    encryptedChannelState !== 'idle' ||
    pendingImage ||
    pendingVideo ||
    pendingUfo74StartMessages.length > 0 ||
    (gameState.ufo74SecretDiscovered && gamePhase === 'terminal');

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

  // Trigger flicker effect
  const triggerFlicker = useCallback(() => {
    setFlickerActive(true);
    setTimeout(() => setFlickerActive(false), 300);
  }, []);

  const {
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
  } = useGameActions({
    setGameState,
    setGamePhase,
    onExitAction,
    playSound,
    triggerFlicker,
  });

  // Handle firewall pause state changes (extends timers when overlays close)
  const handleFirewallPauseChanged = useCallback((paused: boolean) => {
    if (!paused && firewallPauseStartRef.current !== null) {
      // Pause ended - extend timers by the pause duration
      const pauseDuration = Date.now() - firewallPauseStartRef.current;
      if (pauseDuration > 100) {
        // Only adjust if pause was significant
        setGameState(prev => ({
          ...prev,
          firewallEyes: prev.firewallEyes.map(eye => ({
            ...eye,
            detonateTime: eye.detonateTime + pauseDuration,
          })),
          lastEyeSpawnTime:
            prev.lastEyeSpawnTime > 0
              ? prev.lastEyeSpawnTime + pauseDuration
              : prev.lastEyeSpawnTime,
        }));
      }
      firewallPauseStartRef.current = null;
    }
  }, []);

  const { handleSubmit, handleKeyDown } = useTerminalInput({
    gameState,
    gamePhase,
    inputValue,
    isProcessing,
    showTuringTest,
    pendingImage,
    pendingVideo,
    pendingUfo74StartMessages,
    pendingUfo74Messages,
    historyIndex,
    setGameState,
    setInputValue,
    setIsProcessing,
    setIsStreaming,
    setHistoryIndex,
    setPendingImage,
    setPendingVideo,
    setActiveImage,
    setActiveVideo,
    setPendingUfo74StartMessages,
    setPendingUfo74Messages,
    setQueuedAfterMediaMessages,
    setShowEvidenceTracker,
    setShowRiskTracker,
    setShowTuringTest,
    setGamePhase,
    setGameOverReason,
    setShowGameOver,
    setBurnInLines,
    setEncryptedChannelState,
    onExitAction,
    onSaveRequestAction,
    playSound,
    playKeySound,
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

  // Get evidence symbol for a category
  const getEvidenceSymbol = (category: string): string => {
    const discovered = gameState.truthsDiscovered?.has(category);
    return discovered ? '●' : '□'; // Filled circle if discovered, empty box if not
  };

  // Get CSS class for evidence
  const getEvidenceClass = (category: string): string => {
    const discovered = gameState.truthsDiscovered?.has(category);
    return discovered ? styles.truthProven : styles.truthMissing;
  };

  // Get discovered count (for victory condition display)
  const getDiscoveredCount = (): number => {
    return gameState.truthsDiscovered?.size || 0;
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

  // Get invalid attempts display (shows attempts made, not remaining)
  // Uses legacyAlertCounter which tracks invalid commands, matching inline "[Invalid attempts: X/8]"
  const getAttemptsDisplay = () => {
    const attempts = gameState.legacyAlertCounter || 0;
    return `${attempts}/${MAX_WRONG_ATTEMPTS}`;
  };

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

  const { focusTerminalInput } = useTerminalEffects({
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
    playSound,
    startAmbient,
    stopAmbient,
    updateAmbientTension,
    setTimedDecryptRemaining,
    setIsWarmingUp,
    setShowEvidenceTracker,
    setShowRiskTracker,
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
    refs: {
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
    },
  });

  return (
    <FloatingUIProvider>
      <div
        className={`${styles.terminal} ${flickerActive ? styles.flicker : ''} ${glitchActive ? styles.glitchActive : ''} ${glitchHeavy ? styles.glitchHeavy : ''} ${isShaking ? styles.shaking : ''} ${isWarmingUp ? styles.warmingUp : ''}`}
        onClick={focusTerminalInput}
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
        {paranoiaMessage && (
          <div
            className={styles.paranoiaMessage}
            style={{ top: paranoiaPosition.top, left: paranoiaPosition.left }}
          >
            {paranoiaMessage}
          </div>
        )}

        {/* Firewall Eyes - hostile surveillance entities (suppressed during atmosphere phase) */}
        {gameState.tutorialComplete && !gameState.isGameOver && !suppressPressure && (
          <FirewallEyes
            detectionLevel={gameState.detectionLevel}
            firewallActive={gameState.firewallActive}
            firewallDisarmed={gameState.firewallDisarmed}
            eyes={gameState.firewallEyes}
            lastEyeSpawnTime={gameState.lastEyeSpawnTime}
            paused={isFirewallPaused}
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
            <div className={styles.headerMenu} id="terminal-header-menu" role="menu">
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
            <span className={styles.truthCount}>[{getDiscoveredCount()}/5]</span>
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
        <div
          className={styles.output}
          ref={outputRef}
          role="log"
          aria-live="polite"
          aria-relevant="additions"
        >
          {gameState.history.map(renderEntry)}
          {isProcessing && (
            <div className={`${styles.line} ${styles.processing}`}>Processing...</div>
          )}
          {/* Blinking terminal cursor at end of text when in enter-only mode */}
          {!isProcessing && isEnterOnlyMode && !gameState.isGameOver && (
            <span className={styles.terminalCursor}>▌</span>
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
              <button ref={enterOnlyButtonRef} type="submit" autoFocus />
            </form>
            {/* Centered enter prompt - inline in flex layout to prevent overlap */}
            <div className={styles.enterPromptArea}>
              <button
                type="button"
                className={styles.enterPromptContent}
                disabled={isProcessing}
                onClick={handleSubmit}
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
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className={styles.inputArea}>
            <span className={styles.prompt}>&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              aria-label="Terminal command input"
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
            {/* Typing speed warning - inline within input area to prevent overlap */}
            {typingSpeedWarning && (
              <span className={styles.typingWarningInline}>SUSPICIOUS TYPING PATTERN DETECTED</span>
            )}
          </form>
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
            onCorrectAnswer={() => playSound('success')}
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
          <GameOver
            reason={gameOverReason}
            onMainMenuAction={onExitAction}
            onLoadCheckpointAction={(slotId) => {
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
