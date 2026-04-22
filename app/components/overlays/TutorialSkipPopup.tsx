'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useI18n } from '../../i18n';
import styles from './TutorialSkipPopup.module.css';

interface TutorialSkipPopupProps {
  onSkip: () => void;
  onContinue: () => void;
}

export default function TutorialSkipPopup({
  onSkip,
  onContinue,
}: TutorialSkipPopupProps) {
  const { t } = useI18n();
  const skipBtnRef = useRef<HTMLButtonElement>(null);
  const playBtnRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const key = event.key.toLowerCase();

      if (key === 'y' || key === 's') {
        onSkip();
      } else if (key === 'n' || key === 'escape') {
        onContinue();
      } else if (key === 'arrowleft' || key === 'arrowright' || key === 'tab') {
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
    playBtnRef.current?.focus();

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.popup}>
        <div className={styles.scanlines} />

        <div className={styles.header}>{t('tutorialSkip.header')}</div>

        <div className={styles.body}>
          <p>
            {t('tutorialSkip.line1.prefix')}{' '}
            <span className={styles.highlight}>{t('tutorialSkip.line1.highlight')}</span>?
          </p>
          <p>{t('tutorialSkip.line2')}</p>
          <p>
            {t('tutorialSkip.line3')}
            <span className={styles.cursor}>█</span>
          </p>
        </div>

        <div className={styles.buttons}>
          <button
            ref={skipBtnRef}
            className={styles.btnSkip}
            tabIndex={-1}
            onMouseDown={event => event.preventDefault()}
            onClick={onSkip}
          >
            {t('tutorialSkip.skip')}
          </button>
          <button
            ref={playBtnRef}
            className={styles.btnPlay}
            tabIndex={-1}
            onMouseDown={event => event.preventDefault()}
            onClick={onContinue}
          >
            {t('tutorialSkip.play')}
          </button>
        </div>
      </div>
    </div>
  );
}
