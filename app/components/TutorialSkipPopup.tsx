'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import styles from './TutorialSkipPopup.module.css';

interface TutorialSkipPopupProps {
  onSkip: () => void;
  onContinue: () => void;
}

export default function TutorialSkipPopup({
  onSkip,
  onContinue,
}: TutorialSkipPopupProps) {
  const skipBtnRef = useRef<HTMLButtonElement>(null);
  const playBtnRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const key = e.key.toLowerCase();

      if (key === 'y' || key === 's') {
        // Y = Yes (skip), S = Sim (Portuguese)
        onSkip();
      } else if (key === 'n' || key === 'escape') {
        onContinue();
      } else if (key === 'arrowleft' || key === 'arrowright' || key === 'tab') {
        // Toggle focus between buttons
        if (document.activeElement === skipBtnRef.current) {
          playBtnRef.current?.focus();
        } else {
          skipBtnRef.current?.focus();
        }
      }
    },
    [onSkip, onContinue]
  );

  useEffect(() => {
    // Focus the "play tutorial" button by default (safer choice)
    playBtnRef.current?.focus();

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.popup}>
        <div className={styles.scanlines} />

        <div className={styles.header}>
          ⌐■-■ SECURITY CHECK ■-■⌐
        </div>

        <div className={styles.body}>
          <p>
            Already a <span className={styles.highlight}>pro hacker</span>?
          </p>
          <p>Know all terminal commands?</p>
          <p>
            Skip the tutorial if you want
            <span className={styles.cursor}>█</span>
          </p>
        </div>

        <div className={styles.buttons}>
          <button
            ref={skipBtnRef}
            className={styles.btnSkip}
            onClick={onSkip}
          >
            [ Y ] SKIP
          </button>
          <button
            ref={playBtnRef}
            className={styles.btnPlay}
            onClick={onContinue}
          >
            [ N ] TUTORIAL
          </button>
        </div>
      </div>
    </div>
  );
}
