'use client';

import React from 'react';
import styles from './PauseMenu.module.css';

interface PauseMenuProps {
  onResumeAction: () => void;
  onSaveAction: () => void;
  onLoadAction: () => void;
  onSettingsAction: () => void;
  onExitAction: () => void;
}

export default function PauseMenu({ 
  onResumeAction, 
  onSaveAction, 
  onLoadAction, 
  onSettingsAction,
  onExitAction 
}: PauseMenuProps) {
  return (
    <div className={styles.overlay} onClick={onResumeAction}>
      <div className={styles.menu} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>PAUSED</h2>
          <div className={styles.line}>═══════════════════════════</div>
        </div>
        
        <div className={styles.options}>
          <button className={styles.menuButton} onClick={onResumeAction}>
            ▶ RESUME GAME
          </button>
          <button className={styles.menuButton} onClick={onSaveAction}>
            💾 SAVE SESSION
          </button>
          <button className={styles.menuButton} onClick={onLoadAction}>
            📂 LOAD SESSION
          </button>
          <button className={styles.menuButton} onClick={onSettingsAction}>
            ⚙️ SETTINGS
          </button>
          <button className={`${styles.menuButton} ${styles.exitButton}`} onClick={onExitAction}>
            🚪 EXIT TO MENU
          </button>
        </div>
        
        <div className={styles.hint}>
          Press ESC to resume
        </div>
      </div>
    </div>
  );
}
