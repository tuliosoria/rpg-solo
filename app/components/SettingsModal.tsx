'use client';

import React, { useEffect, useState, useCallback, memo } from 'react';
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
          <h2>SETTINGS</h2>
          <div className={styles.line}>═══════════════════════════</div>
        </div>

        <div className={styles.content}>
          {/* Sound Toggle */}
          <div className={styles.setting}>
            <label className={styles.label}>Sound Effects</label>
            <button
              className={`${styles.toggle} ${soundEnabled ? styles.toggleOn : styles.toggleOff}`}
              onClick={onToggleSound}
            >
              {soundEnabled ? '[ ON ]' : '[ OFF ]'}
            </button>
          </div>

          {/* Volume Slider */}
          <div className={styles.setting}>
            <label className={styles.label}>Master Volume</label>
            <div className={styles.sliderContainer}>
              <input
                type="range"
                min="0"
                max="100"
                value={masterVolume * 100}
                onChange={e => onVolumeChange(parseInt(e.target.value) / 100)}
                className={styles.slider}
                disabled={!soundEnabled}
              />
              <span className={styles.volumeValue}>{Math.round(masterVolume * 100)}%</span>
            </div>
          </div>

          {/* CRT Effects Toggle */}
          <div className={styles.setting}>
            <label className={styles.label}>CRT Effects</label>
            <button
              className={`${styles.toggle} ${crtEnabled ? styles.toggleOn : styles.toggleOff}`}
              onClick={toggleCrt}
            >
              {crtEnabled ? '[ ON ]' : '[ OFF ]'}
            </button>
            <span className={styles.hint}>Scanlines & glow</span>
          </div>

          {/* Info */}
          <div className={styles.info}>
            <div className={styles.infoLine}>Keyboard Shortcuts:</div>
            <div className={styles.shortcut}>↑/↓ — Command history</div>
            <div className={styles.shortcut}>Tab — Autocomplete</div>
            <div className={styles.shortcut}>Esc — Close overlays</div>
            <div className={styles.shortcut}>Space/Enter — Skip streaming</div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.closeButton} onClick={onCloseAction}>
            [ CLOSE ]
          </button>
        </div>
      </div>
    </div>
  );
});
