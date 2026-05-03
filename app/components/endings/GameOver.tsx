'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CheckpointSlot, TextSpeed } from '../../types';
import { getLatestCheckpoint } from '../../storage/saves';
import { uiChance, uiRandomFloat } from '../../engine/rng';
import { useI18n } from '../../i18n';
import styles from './GameOver.module.css';
import { scaleTextSpeedDelay } from '../textSpeed';

interface GameOverProps {
  reason: string;
  onMainMenuAction: () => void;
  onLoadCheckpointAction: (slotId: string) => void;
  onLoadSavedGameAction?: () => void;
  onQuitAction?: () => void;
  textSpeed?: TextSpeed;
}

export default function GameOver({
  reason,
  onMainMenuAction,
  onLoadCheckpointAction,
  onLoadSavedGameAction,
  onQuitAction,
  textSpeed = 'normal',
}: GameOverProps) {
  const { language, t, translateRuntimeText } = useI18n();
  const [phase, setPhase] = useState<'error' | 'restarting' | 'options'>('error');
  const [progress, setProgress] = useState(0);
  const [flickering, setFlickering] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [latestCheckpoint, setLatestCheckpoint] = useState<CheckpointSlot | null>(null);
  const flickerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flickerResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadCheckpointButtonRef = useRef<HTMLButtonElement>(null);
  const loadSavedGameButtonRef = useRef<HTMLButtonElement>(null);
  const exitButtonRef = useRef<HTMLButtonElement>(null);

  // Recovery menu always exposes the same three options. Disabled options stay
  // visible so the menu reads consistently across runs (e.g. when there is no
  // checkpoint yet) and matches the terminal aesthetic.
  const handleQuit = onQuitAction ?? onMainMenuAction;
  const handleLoadSavedGame = onLoadSavedGameAction ?? onMainMenuAction;
  const hasCheckpoint = latestCheckpoint !== null;

  type OptionId = 'lastCheckpoint' | 'loadSavedGame' | 'exit';
  const options = React.useMemo<
    Array<{ id: OptionId; disabled: boolean; activate: () => void }>
  >(
    () => [
      {
        id: 'lastCheckpoint',
        disabled: !hasCheckpoint,
        activate: () => {
          if (latestCheckpoint) {
            onLoadCheckpointAction(latestCheckpoint.id);
          }
        },
      },
      { id: 'loadSavedGame', disabled: false, activate: handleLoadSavedGame },
      { id: 'exit', disabled: false, activate: handleQuit },
    ],
    [hasCheckpoint, latestCheckpoint, onLoadCheckpointAction, handleLoadSavedGame, handleQuit]
  );

  const firstEnabledIndex = options.findIndex(o => !o.disabled);

  // Load checkpoints when component mounts
  useEffect(() => {
    setLatestCheckpoint(getLatestCheckpoint());
  }, []);

  // Phase transitions
  useEffect(() => {
    // Initial flicker
    flickerTimerRef.current = setTimeout(
      () => setFlickering(false),
      scaleTextSpeedDelay(500, textSpeed)
    );

    // Show error for 3 seconds, then start restart sequence
    errorTimerRef.current = setTimeout(() => {
      setPhase('restarting');
    }, scaleTextSpeedDelay(3000, textSpeed));

    return () => {
      if (flickerTimerRef.current) {
        clearTimeout(flickerTimerRef.current);
      }
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, [textSpeed]);

  // Progress bar animation
  useEffect(() => {
    if (phase !== 'restarting') return;

    const duration = scaleTextSpeedDelay(3000, textSpeed);
    const interval = scaleTextSpeedDelay(50, textSpeed);
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment + uiRandomFloat(-1, 1);
        if (next >= 100) {
          clearInterval(timer);
          setPhase('options');
          return 100;
        }
        return next;
      });
    }, interval);

    // Random pauses to simulate system struggle
    const pauseTimer = setInterval(() => {
      if (uiChance(0.2)) {
        setFlickering(true);
        if (flickerResetTimerRef.current) {
          clearTimeout(flickerResetTimerRef.current);
        }
        flickerResetTimerRef.current = setTimeout(
          () => setFlickering(false),
          scaleTextSpeedDelay(150, textSpeed)
        );
      }
    }, scaleTextSpeedDelay(800, textSpeed));

    return () => {
      clearInterval(timer);
      clearInterval(pauseTimer);
      if (flickerResetTimerRef.current) {
        clearTimeout(flickerResetTimerRef.current);
      }
    };
  }, [phase, textSpeed]);

  useEffect(() => {
    if (phase !== 'options') return;

    const refs = [loadCheckpointButtonRef, loadSavedGameButtonRef, exitButtonRef];
    const initial = firstEnabledIndex >= 0 ? firstEnabledIndex : 0;
    setSelectedIndex(initial);
    refs[initial]?.current?.focus();
  }, [firstEnabledIndex, phase]);

  // Keyboard navigation for options phase
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (phase !== 'options') return;

      const enabledIndices = options
        .map((o, i) => (o.disabled ? -1 : i))
        .filter(i => i !== -1);
      if (enabledIndices.length === 0) return;

      const currentEnabledPos = enabledIndices.indexOf(selectedIndex);

      switch (e.key) {
        case 'ArrowUp': {
          e.preventDefault();
          const pos = currentEnabledPos === -1 ? 0 : currentEnabledPos;
          const nextPos = (pos - 1 + enabledIndices.length) % enabledIndices.length;
          setSelectedIndex(enabledIndices[nextPos]);
          break;
        }
        case 'ArrowDown': {
          e.preventDefault();
          const pos = currentEnabledPos === -1 ? -1 : currentEnabledPos;
          const nextPos = (pos + 1) % enabledIndices.length;
          setSelectedIndex(enabledIndices[nextPos]);
          break;
        }
        case 'Enter': {
          e.preventDefault();
          const target = options[selectedIndex];
          if (target && !target.disabled) {
            target.activate();
          }
          break;
        }
      }
    },
    [phase, selectedIndex, options]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const renderProgressBar = () => {
    const filled = Math.floor(progress / 2.5); // 40 chars total
    const empty = 40 - filled;
    return `[${'█'.repeat(filled)}${'░'.repeat(Math.max(0, empty))}]`;
  };

  const formatCheckpointInfo = (checkpoint: CheckpointSlot) => {
    const date = new Date(checkpoint.timestamp);
    const locale = language === 'pt-BR' ? 'pt-BR' : language === 'es' ? 'es' : 'en-US';
    const timeStr = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    return t('gameOver.checkpoint.info', {
      reason: translateRuntimeText(checkpoint.reason),
      truths: checkpoint.truthCount,
      risk: checkpoint.detectionLevel,
      time: timeStr,
    });
  };

  return (
    <div
      className={`${styles.container} ${flickering ? styles.flickering : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={t('gameOver.options.title')}
    >
      {/* Scanlines */}
      <div className={styles.scanlines} />

      {/* Error phase */}
      {phase === 'error' && (
        <div className={styles.errorContent} role="status" aria-live="polite">
          <div className={styles.errorBox}>
            <div className={styles.errorHeader}>
              ═══════════════════════════════════════════════════════════
            </div>
            <div className={styles.errorTitle}>{t('gameOver.error.title')}</div>
            <div className={styles.errorHeader}>
              ═══════════════════════════════════════════════════════════
            </div>
            <div className={styles.errorReason}>{translateRuntimeText(reason)}</div>
            <div className={styles.errorDetails}>
              <div>{t('gameOver.error.sessionTerminated')}</div>
              <div>{t('gameOver.error.auditArchived')}</div>
              <div>{t('gameOver.error.countermeasures')}</div>
            </div>
            <div className={styles.errorFooter}>{t('gameOver.error.restartSoon')}</div>
          </div>
        </div>
      )}

      {/* Restarting phase */}
      {phase === 'restarting' && (
        <div className={styles.restartContent} role="status" aria-live="polite">
          <div className={styles.restartBox}>
            <div className={styles.restartHeader}>{t('gameOver.restart.header')}</div>
            <div className={styles.restartStatus}>{t('gameOver.restart.status')}</div>
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>{renderProgressBar()}</div>
              <div className={styles.progressPercent}>{Math.min(100, Math.floor(progress))}%</div>
            </div>
            <div className={styles.restartLog}>
              {progress > 10 && <div>{t('gameOver.restart.log1')}</div>}
              {progress > 25 && <div>{t('gameOver.restart.log2')}</div>}
              {progress > 45 && <div>{t('gameOver.restart.log3')}</div>}
              {progress > 65 && <div>{t('gameOver.restart.log4')}</div>}
              {progress > 85 && <div>{t('gameOver.restart.log5')}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Options phase - show Load Checkpoint and Main Menu */}
      {phase === 'options' && (
        <div className={styles.optionsContent}>
          <div className={styles.optionsBox}>
            <div className={styles.optionsHeader}>{t('gameOver.options.title')}</div>
            <div className={styles.optionsSubheader}>
              ═══════════════════════════════════════════════════════════
            </div>

            <div className={styles.optionsButtons}>
              <button
                ref={loadCheckpointButtonRef}
                className={`${styles.optionButton} ${selectedIndex === 0 ? styles.selected : ''}`}
                onClick={() => {
                  if (latestCheckpoint) {
                    onLoadCheckpointAction(latestCheckpoint.id);
                  }
                }}
                onMouseEnter={() => {
                  if (hasCheckpoint) setSelectedIndex(0);
                }}
                disabled={!hasCheckpoint}
                aria-disabled={!hasCheckpoint}
              >
                {selectedIndex === 0 ? '▶ ' : '  '}{t('gameOver.options.lastCheckpoint')}
                <div className={styles.checkpointInfo}>
                  {latestCheckpoint
                    ? formatCheckpointInfo(latestCheckpoint)
                    : t('gameOver.options.noCheckpoint')}
                </div>
              </button>

              <button
                ref={loadSavedGameButtonRef}
                className={`${styles.optionButton} ${selectedIndex === 1 ? styles.selected : ''}`}
                onClick={handleLoadSavedGame}
                onMouseEnter={() => setSelectedIndex(1)}
              >
                {selectedIndex === 1 ? '▶ ' : '  '}
                {t('gameOver.options.loadSavedGame')}
              </button>

              <button
                ref={exitButtonRef}
                className={`${styles.optionButton} ${selectedIndex === 2 ? styles.selected : ''}`}
                onClick={handleQuit}
                onMouseEnter={() => setSelectedIndex(2)}
              >
                {selectedIndex === 2 ? '▶ ' : '  '}
                {t('gameOver.options.exit')}
              </button>
            </div>

            <div className={styles.keyHint}>{t('gameOver.options.keyHint')}</div>
          </div>
        </div>
      )}
    </div>
  );
}
