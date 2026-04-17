'use client';

import React, { useState, useEffect } from 'react';
import { uiRandomFloat } from '../../engine/rng';
import { useI18n } from '../../i18n';
import styles from './Blackout.module.css';

interface BlackoutProps {
  onCompleteAction: () => void;
}

export default function Blackout({ onCompleteAction }: BlackoutProps) {
  const { translateRuntimeText } = useI18n();
  const [phase, setPhase] = useState<'glitch' | 'loading' | 'fade'>('glitch');
  const [loadProgress, setLoadProgress] = useState(0);

  // Phase 1: Glitch effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('loading');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Phase 2: Loading bar
  useEffect(() => {
    if (phase !== 'loading') return;

    const interval = setInterval(() => {
      setLoadProgress(prev => {
        const next = prev + uiRandomFloat(2, 10);
        if (next >= 100) {
          clearInterval(interval);
          setPhase('fade');
          return 100;
        }
        return next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [phase]);

  // Phase 3: Fade and transition to ending
  useEffect(() => {
    if (phase !== 'fade') return;

    const timer = setTimeout(() => {
      onCompleteAction();
    }, 2000);

    return () => clearTimeout(timer);
  }, [phase, onCompleteAction]);

  return (
    <div className={`${styles.container} ${phase === 'fade' ? styles.fadeOut : ''}`}>
      {/* Scanlines */}
      <div className={styles.scanlines} />

      {/* Glitch Phase */}
      {phase === 'glitch' && (
        <div className={styles.glitchContent}>
          <div className={styles.glitchText}>{translateRuntimeText('▓▓▓ CONNECTION INTERRUPTED ▓▓▓')}</div>
          <div className={styles.glitchSubtext}>{translateRuntimeText('SYSTEM DETECTED UNAUTHORIZED ACCESS')}</div>
          <div className={styles.glitchSubtext}>{translateRuntimeText('INITIATING PURGE PROTOCOL...')}</div>
        </div>
      )}

      {/* Loading Phase */}
      {phase === 'loading' && (
        <div className={styles.loadingContent}>
          <div className={styles.loadingTitle}>{translateRuntimeText('CLEARING SYSTEM CACHE')}</div>
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${Math.min(100, loadProgress)}%` }}
              />
            </div>
            <div className={styles.progressText}>{Math.min(100, Math.floor(loadProgress))}%</div>
          </div>
          <div className={styles.loadingText}>
            {loadProgress < 30 && translateRuntimeText('Removing session logs...')}
            {loadProgress >= 30 && loadProgress < 60 && translateRuntimeText('Erasing access records...')}
            {loadProgress >= 60 && loadProgress < 90 && translateRuntimeText('Destroying active connections...')}
            {loadProgress >= 90 && translateRuntimeText('Finalizing purge...')}
          </div>
        </div>
      )}

      {/* Fade Phase */}
      {phase === 'fade' && (
        <div className={styles.fadeContent}>
          <div className={styles.transferText}>{translateRuntimeText('>> EVALUATING DOSSIER <<')}</div>
        </div>
      )}
    </div>
  );
}
