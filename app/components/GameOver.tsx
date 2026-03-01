'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CheckpointSlot } from '../types';
import { getLatestCheckpoint } from '../storage/saves';
import { uiChance, uiRandomFloat } from '../engine/rng';
import { useI18n } from '../i18n';
import styles from './GameOver.module.css';

interface GameOverProps {
  reason: string;
  onMainMenuAction: () => void;
  onLoadCheckpointAction: (slotId: string) => void;
}

export default function GameOver({
  reason,
  onMainMenuAction,
  onLoadCheckpointAction,
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

  // Load checkpoints when component mounts
  useEffect(() => {
    setLatestCheckpoint(getLatestCheckpoint());
  }, []);

  // Phase transitions
  useEffect(() => {
    // Initial flicker
    flickerTimerRef.current = setTimeout(() => setFlickering(false), 500);

    // Show error for 3 seconds, then start restart sequence
    errorTimerRef.current = setTimeout(() => {
      setPhase('restarting');
    }, 3000);

    return () => {
      if (flickerTimerRef.current) {
        clearTimeout(flickerTimerRef.current);
      }
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, []);

  // Progress bar animation
  useEffect(() => {
    if (phase !== 'restarting') return;

    const duration = 3000; // 3 seconds for restart animation
    const interval = 50;
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
        flickerResetTimerRef.current = setTimeout(() => setFlickering(false), 150);
      }
    }, 800);

    return () => {
      clearInterval(timer);
      clearInterval(pauseTimer);
      if (flickerResetTimerRef.current) {
        clearTimeout(flickerResetTimerRef.current);
      }
    };
  }, [phase]);

  // Keyboard navigation for options phase
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (phase !== 'options') return;

      const hasCheckpoint = latestCheckpoint !== null;
      const maxIndex = hasCheckpoint ? 1 : 0; // 0 = Load Checkpoint (if available), 1 = Main Menu

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : maxIndex));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev < maxIndex ? prev + 1 : 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (hasCheckpoint && selectedIndex === 0) {
            onLoadCheckpointAction(latestCheckpoint.id);
          } else {
            onMainMenuAction();
          }
          break;
      }
    },
    [phase, selectedIndex, latestCheckpoint, onLoadCheckpointAction, onMainMenuAction]
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
    <div className={`${styles.container} ${flickering ? styles.flickering : ''}`}>
      {/* Scanlines */}
      <div className={styles.scanlines} />

      {/* Error phase */}
      {phase === 'error' && (
        <div className={styles.errorContent}>
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
        <div className={styles.restartContent}>
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
              {latestCheckpoint && (
                <button
                  className={`${styles.optionButton} ${selectedIndex === 0 ? styles.selected : ''}`}
                  onClick={() => onLoadCheckpointAction(latestCheckpoint.id)}
                  onMouseEnter={() => setSelectedIndex(0)}
                >
                  {selectedIndex === 0 ? '▶ ' : '  '}{t('gameOver.options.loadCheckpoint')}
                  <div className={styles.checkpointInfo}>
                    {formatCheckpointInfo(latestCheckpoint)}
                  </div>
                </button>
              )}

              <button
                className={`${styles.optionButton} ${selectedIndex === (latestCheckpoint ? 1 : 0) ? styles.selected : ''}`}
                onClick={onMainMenuAction}
                onMouseEnter={() => setSelectedIndex(latestCheckpoint ? 1 : 0)}
              >
                {selectedIndex === (latestCheckpoint ? 1 : 0) ? '▶ ' : '  '}
                {t('gameOver.options.mainMenu')}
              </button>
            </div>

            <div className={styles.keyHint}>{t('gameOver.options.keyHint')}</div>
          </div>
        </div>
      )}
    </div>
  );
}
