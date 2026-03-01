'use client';

import React, { useEffect, useState, useCallback, memo } from 'react';
import { useI18n } from '../i18n';
import styles from './SettingsModal.module.css';

interface SettingsModalProps {
  soundEnabled: boolean;
  masterVolume: number;
  onToggleSound: () => void;
  onVolumeChange: (volume: number) => void;
  onCloseAction: () => void;
}

export default memo(function SettingsModal({
  soundEnabled,
  masterVolume,
  onToggleSound,
  onVolumeChange,
  onCloseAction,
}: SettingsModalProps) {
  const { language, setLanguage, t } = useI18n();
  // CRT effects state - stored in localStorage
  const [crtEnabled, setCrtEnabled] = useState(true);

  // Load CRT preference on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem('varginha_crt_enabled');
        if (stored !== null) {
          const enabled = stored === 'true';
          setCrtEnabled(enabled);
          document.body.classList.toggle('no-crt', !enabled);
        }
      }
    } catch {
      // localStorage may be unavailable
    }
  }, []);

  // Handle ESC key to close modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseAction();
      }
    },
    [onCloseAction]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const toggleCrt = () => {
    const newValue = !crtEnabled;
    setCrtEnabled(newValue);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('varginha_crt_enabled', String(newValue));
      }
    } catch {
      // localStorage may be unavailable
    }
    document.body.classList.toggle('no-crt', !newValue);
  };

  return (
    <div className={styles.overlay} onClick={onCloseAction}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{t('settings.title')}</h2>
          <div className={styles.line}>═══════════════════════════</div>
        </div>

        <div className={styles.content}>
          {/* Sound Toggle */}
          <div className={styles.setting}>
            <label className={styles.label}>{t('settings.soundEffects')}</label>
            <button
              className={`${styles.toggle} ${soundEnabled ? styles.toggleOn : styles.toggleOff}`}
              tabIndex={-1}
              onMouseDown={e => e.preventDefault()}
              onClick={onToggleSound}
            >
              {soundEnabled
                ? `[ ${t('options.value.on')} ]`
                : `[ ${t('options.value.off')} ]`}
            </button>
          </div>

          {/* Volume Slider */}
          <div className={styles.setting}>
            <label className={styles.label}>{t('settings.masterVolume')}</label>
            <div className={styles.sliderContainer}>
              <input
                type="range"
                min="0"
                max="100"
                value={masterVolume * 100}
                onChange={e => onVolumeChange(parseInt(e.target.value) / 100)}
                className={styles.slider}
                tabIndex={-1}
                disabled={!soundEnabled}
              />
              <span className={styles.volumeValue}>{Math.round(masterVolume * 100)}%</span>
            </div>
          </div>

          {/* CRT Effects Toggle */}
          <div className={styles.setting}>
            <label className={styles.label}>{t('settings.crtEffects')}</label>
            <button
              className={`${styles.toggle} ${crtEnabled ? styles.toggleOn : styles.toggleOff}`}
              tabIndex={-1}
              onMouseDown={e => e.preventDefault()}
              onClick={toggleCrt}
            >
              {crtEnabled
                ? `[ ${t('options.value.on')} ]`
                : `[ ${t('options.value.off')} ]`}
            </button>
            <span className={styles.hint}>{t('settings.crtHint')}</span>
          </div>

          {/* Language Select */}
          <div className={styles.setting}>
            <label className={styles.label}>{t('settings.language')}</label>
            <button
              className={styles.toggle}
              tabIndex={-1}
              onMouseDown={e => e.preventDefault()}
              onClick={() => {
                const ordered = ['en', 'pt-BR', 'es'] as const;
                const currentIndex = ordered.indexOf(language);
                const nextIndex = (currentIndex + 1) % ordered.length;
                setLanguage(ordered[nextIndex]);
              }}
            >
              {language === 'en'
                ? t('language.en')
                : language === 'pt-BR'
                  ? t('language.pt-BR')
                  : t('language.es')}
            </button>
          </div>

          {/* Info */}
          <div className={styles.info}>
            <div className={styles.infoLine}>{t('settings.info.shortcuts')}</div>
            <div className={styles.shortcut}>{t('settings.shortcut.history')}</div>
            <div className={styles.shortcut}>{t('settings.shortcut.autocomplete')}</div>
            <div className={styles.shortcut}>{t('settings.shortcut.close')}</div>
            <div className={styles.shortcut}>{t('settings.shortcut.skip')}</div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.closeButton}
            tabIndex={-1}
            onMouseDown={e => e.preventDefault()}
            onClick={onCloseAction}
          >
            {t('settings.close')}
          </button>
        </div>
      </div>
    </div>
  );
});
