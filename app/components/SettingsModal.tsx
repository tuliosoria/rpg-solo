'use client';

import React from 'react';
import styles from './SettingsModal.module.css';

interface SettingsModalProps {
  soundEnabled: boolean;
  masterVolume: number;
  onToggleSound: () => void;
  onVolumeChange: (volume: number) => void;
  onCloseAction: () => void;
}

export default function SettingsModal({ 
  soundEnabled, 
  masterVolume, 
  onToggleSound, 
  onVolumeChange,
  onCloseAction 
}: SettingsModalProps) {
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
                onChange={(e) => onVolumeChange(parseInt(e.target.value) / 100)}
                className={styles.slider}
                disabled={!soundEnabled}
              />
              <span className={styles.volumeValue}>{Math.round(masterVolume * 100)}%</span>
            </div>
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
          <button 
            className={styles.closeButton}
            onClick={onCloseAction}
          >
            [ CLOSE ]
          </button>
        </div>
      </div>
    </div>
  );
}
