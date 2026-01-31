'use client';

import React, { useState, useEffect, useRef } from 'react';
import { uiChance, uiRandomFloat } from '../engine/rng';
import styles from './GameOver.module.css';

interface GameOverProps {
  reason: string;
  onRestartCompleteAction: () => void;
}

export default function GameOver({ reason, onRestartCompleteAction }: GameOverProps) {
  const [phase, setPhase] = useState<'error' | 'restarting' | 'done'>('error');
  const [progress, setProgress] = useState(0);
  const [flickering, setFlickering] = useState(true);
  const flickerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flickerResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    const duration = 4000; // 4 seconds for restart
    const interval = 50;
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment + uiRandomFloat(-1, 1); // Slight randomness
        if (next >= 100) {
          clearInterval(timer);
          setPhase('done');
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

  useEffect(() => {
    if (phase !== 'done') return;

    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
    }
    restartTimerRef.current = setTimeout(onRestartCompleteAction, 500);

    return () => {
      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
      }
    };
  }, [phase, onRestartCompleteAction]);

  const renderProgressBar = () => {
    const filled = Math.floor(progress / 2.5); // 40 chars total
    const empty = 40 - filled;
    return `[${'█'.repeat(filled)}${'░'.repeat(Math.max(0, empty))}]`;
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
            <div className={styles.errorTitle}>▓▓▓ CRITICAL SYSTEM FAILURE ▓▓▓</div>
            <div className={styles.errorHeader}>
              ═══════════════════════════════════════════════════════════
            </div>
            <div className={styles.errorReason}>{reason}</div>
            <div className={styles.errorDetails}>
              <div>SESSION TERMINATED</div>
              <div>AUDIT LOG ARCHIVED</div>
              <div>COUNTERMEASURES ENGAGED</div>
            </div>
            <div className={styles.errorFooter}>System restart imminent...</div>
          </div>
        </div>
      )}

      {/* Restarting phase */}
      {(phase === 'restarting' || phase === 'done') && (
        <div className={styles.restartContent}>
          <div className={styles.restartBox}>
            <div className={styles.restartHeader}>TERMINAL SYSTEM RESTART</div>
            <div className={styles.restartStatus}>
              {phase === 'done' ? 'RESTART COMPLETE' : 'REINITIALIZING...'}
            </div>
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>{renderProgressBar()}</div>
              <div className={styles.progressPercent}>{Math.min(100, Math.floor(progress))}%</div>
            </div>
            <div className={styles.restartLog}>
              {progress > 10 && <div>Clearing session cache...</div>}
              {progress > 25 && <div>Resetting access protocols...</div>}
              {progress > 45 && <div>Purging audit trail...</div>}
              {progress > 65 && <div>Reinitializing security layer...</div>}
              {progress > 85 && <div>Restoring default state...</div>}
              {progress >= 100 && <div className={styles.complete}>READY</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
