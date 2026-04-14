'use client';

import React, { useEffect, useState, useCallback, useRef, memo } from 'react';
import { useI18n } from '../i18n';
import { useFocusTrap } from '../hooks';
import type { TextSpeed } from '../types';
import {
  DEFAULT_OPTIONS,
  applyOptionsToDocument,
  persistOptions,
  readStoredOptions,
} from '../hooks/useOptions';
import styles from './SettingsModal.module.css';

interface SettingsModalProps {
  soundEnabled: boolean;
  masterVolume: number;
  onToggleSound: () => void;
  onVolumeChange: (volume: number) => void;
  onCloseAction: () => void;
  onResetDefaults: () => void;
}

export default memo(function SettingsModal({
  soundEnabled,
  masterVolume,
  onToggleSound,
  onVolumeChange,
  onCloseAction,
  onResetDefaults,
}: SettingsModalProps) {
  const { language, setLanguage, t } = useI18n();
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef);
  const [crtEnabled, setCrtEnabled] = useState(DEFAULT_OPTIONS.crtEffectsEnabled);
  const [textSpeed, setTextSpeed] = useState<TextSpeed>(DEFAULT_OPTIONS.textSpeed);

  // Load CRT preference on mount
  useEffect(() => {
    const storedOptions = readStoredOptions();
    setCrtEnabled(storedOptions.crtEffectsEnabled);
    setTextSpeed(storedOptions.textSpeed);
    applyOptionsToDocument(storedOptions);
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
    const nextOptions = {
      ...readStoredOptions(),
      crtEffectsEnabled: newValue,
    };
    persistOptions(nextOptions);
    applyOptionsToDocument(nextOptions);
  };

  const handleResetDefaults = useCallback(() => {
    const defaults = { ...DEFAULT_OPTIONS };
    setCrtEnabled(defaults.crtEffectsEnabled);
    setTextSpeed(defaults.textSpeed);
    persistOptions(defaults);
    applyOptionsToDocument(defaults);
    onResetDefaults();
  }, [onResetDefaults]);

  const cycleTextSpeed = () => {
    const textSpeedOptions: TextSpeed[] = ['slow', 'normal', 'fast', 'instant'];
    const currentIdx = textSpeedOptions.indexOf(textSpeed);
    const nextSpeed = textSpeedOptions[(currentIdx + 1) % textSpeedOptions.length];
    setTextSpeed(nextSpeed);
    persistOptions({
      ...readStoredOptions(),
      textSpeed: nextSpeed,
    });
  };

  return (
    <div className={styles.overlay} onClick={onCloseAction} role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <div className={styles.modal} ref={modalRef} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="settings-title">{t('settings.title')}</h2>
          <div className={styles.line}>═══════════════════════════</div>
        </div>

        <div className={styles.content}>
          {/* Sound Toggle */}
          <div className={styles.setting}>
            <label className={styles.label}>{t('settings.soundEffects')}</label>
            <button
              className={`${styles.toggle} ${soundEnabled ? styles.toggleOn : styles.toggleOff}`}
              tabIndex={0}
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
                tabIndex={0}
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
              tabIndex={0}
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
              tabIndex={0}
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

          <div className={styles.setting}>
            <label className={styles.label}>{t('settings.textSpeed')}</label>
            <button
              className={styles.toggle}
              tabIndex={0}
              onMouseDown={e => e.preventDefault()}
              onClick={cycleTextSpeed}
            >
              {textSpeed === 'slow'
                ? t('options.value.slow')
                : textSpeed === 'fast'
                  ? t('options.value.fast')
                  : textSpeed === 'instant'
                    ? t('options.value.instant')
                    : t('options.value.normal')}
            </button>
            <span className={styles.hint}>{t('settings.textSpeedHint')}</span>
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
            className={styles.resetButton}
            tabIndex={0}
            onMouseDown={e => e.preventDefault()}
            onClick={handleResetDefaults}
          >
            {t('settings.resetDefaults')}
          </button>
          <button
            className={styles.closeButton}
            tabIndex={0}
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
