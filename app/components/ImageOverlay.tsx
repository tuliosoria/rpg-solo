'use client';

import React, { useEffect, useState } from 'react';
import styles from './ImageOverlay.module.css';
import { uiChance, uiRandomInt } from '../engine/rng';

interface ImageOverlayProps {
  src: string;
  alt: string;
  tone: 'clinical' | 'surveillance';
  onCloseAction: () => void;
  corrupted?: boolean;
  durationMs?: number;
}

export default function ImageOverlay({
  src,
  alt,
  tone,
  onCloseAction,
  corrupted = false,
  durationMs = 8000,
}: ImageOverlayProps) {
  const [visible, setVisible] = useState(false);
  const [flickering, setFlickering] = useState(true);
  const [initialShock, setInitialShock] = useState(true);

  useEffect(() => {
    // SUDDEN appearance - immediate flash then image
    // This creates a "shock" moment
    const shockTimeout = setTimeout(() => {
      setInitialShock(false);
    }, 50);

    // Image appears quickly after initial flash
    const flickerTimeout = setTimeout(() => {
      setFlickering(false);
      setVisible(true);
    }, 150);

    // Random flicker during display - more aggressive
    const flickerInterval = setInterval(() => {
      if (uiChance(0.2)) {
        setFlickering(true);
        setTimeout(() => setFlickering(false), 50 + uiRandomInt(0, 100));
      }
    }, 1500);

    // Auto-close after duration for shock effect
    const autoClose = setTimeout(() => {
      onCloseAction();
    }, durationMs);

    return () => {
      clearTimeout(shockTimeout);
      clearTimeout(flickerTimeout);
      clearInterval(flickerInterval);
      clearTimeout(autoClose);
    };
  }, [onCloseAction, durationMs]);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        onCloseAction();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCloseAction]);

  return (
    <div
      className={`${styles.overlay} ${flickering ? styles.flickering : ''} ${initialShock ? styles.initialShock : ''}`}
      onClick={onCloseAction}
    >
      {/* Scanlines */}
      <div className={styles.scanlines} />

      {/* CRT glow */}
      <div
        className={`${styles.glow} ${tone === 'clinical' ? styles.greenGlow : styles.amberGlow}`}
      />

      <div className={styles.container}>
        {/* Header - minimal, no decoration */}
        <div className={styles.header}>
          <span className={styles.headerText}>
            {corrupted ? '▓▓▓ PARTIAL RECOVERY ▓▓▓' : '═══ RECOVERED VISUAL DATA ═══'}
          </span>
        </div>

        {/* Image frame */}
        <div className={`${styles.imageFrame} ${corrupted ? styles.corrupted : ''}`}>
          <div
            className={`${styles.imageWrapper} ${tone === 'clinical' ? styles.greenTone : styles.amberTone}`}
          >
            {visible && <img src={src} alt={alt} className={styles.image} />}
            {/* Noise overlay */}
            <div className={styles.noise} />
          </div>

          {corrupted && (
            <div className={styles.corruptionOverlay}>
              <div className={styles.corruptionLine} style={{ top: '23%' }} />
              <div className={styles.corruptionLine} style={{ top: '67%' }} />
            </div>
          )}
        </div>

        {/* Footer - removed, let image speak for itself */}

        {/* Minimal metadata */}
        <div className={styles.metadata}>
          <div>CLASSIFICATION: RESTRICTED</div>
          <div className={styles.hint}>[Any key to dismiss]</div>
        </div>
      </div>
    </div>
  );
}
