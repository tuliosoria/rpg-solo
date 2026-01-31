'use client';

import React, { useState, useCallback, useEffect, memo, useMemo } from 'react';
import styles from './PauseMenu.module.css';

interface PauseMenuProps {
  onResumeAction: () => void;
  onSaveAction: () => void;
  onLoadAction: () => void;
  onSettingsAction: () => void;
  onExitAction: () => void;
}

export default memo(function PauseMenu({
  onResumeAction,
  onSaveAction,
  onLoadAction,
  onSettingsAction,
  onExitAction,
}: PauseMenuProps) {
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const menuItems = useMemo(
    () =>
      showExitConfirm
        ? ['confirm_exit', 'cancel_exit']
        : ['resume', 'save', 'load', 'settings', 'exit'],
    [showExitConfirm]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : menuItems.length - 1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev < menuItems.length - 1 ? prev + 1 : 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (showExitConfirm) {
            if (selectedIndex === 0) onExitAction();
            else setShowExitConfirm(false);
          } else {
            switch (menuItems[selectedIndex]) {
              case 'resume':
                onResumeAction();
                break;
              case 'save':
                onSaveAction();
                break;
              case 'load':
                onLoadAction();
                break;
              case 'settings':
                onSettingsAction();
                break;
              case 'exit':
                setShowExitConfirm(true);
                setSelectedIndex(1);
                break;
            }
          }
          break;
        case 'Escape':
          e.preventDefault();
          if (showExitConfirm) {
            setShowExitConfirm(false);
            setSelectedIndex(4);
          } else {
            onResumeAction();
          }
          break;
      }
    },
    [
      menuItems,
      selectedIndex,
      showExitConfirm,
      onResumeAction,
      onSaveAction,
      onLoadAction,
      onSettingsAction,
      onExitAction,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleExitClick = () => {
    setShowExitConfirm(true);
    setSelectedIndex(1); // Default to "No" for safety
  };

  if (showExitConfirm) {
    return (
      <div className={styles.overlay}>
        <div className={styles.menu} onClick={e => e.stopPropagation()}>
          <div className={styles.header}>
            <h2>EXIT TO MENU?</h2>
            <div className={styles.line}>═══════════════════════════</div>
          </div>

          <div className={styles.warning}>Unsaved progress will be lost.</div>

          <div className={styles.options}>
            <button
              className={`${styles.menuButton} ${styles.exitButton} ${selectedIndex === 0 ? styles.selected : ''}`}
              onClick={onExitAction}
              onMouseEnter={() => setSelectedIndex(0)}
            >
              {selectedIndex === 0 ? '▶ ' : '  '}YES, EXIT
            </button>
            <button
              className={`${styles.menuButton} ${selectedIndex === 1 ? styles.selected : ''}`}
              onClick={() => setShowExitConfirm(false)}
              onMouseEnter={() => setSelectedIndex(1)}
            >
              {selectedIndex === 1 ? '▶ ' : '  '}NO, CONTINUE
            </button>
          </div>

          <div className={styles.hint}>↑↓ Navigate • Enter Select • Esc Cancel</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={onResumeAction}>
      <div className={styles.menu} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>PAUSED</h2>
          <div className={styles.line}>═══════════════════════════</div>
        </div>

        <div className={styles.options}>
          <button
            className={`${styles.menuButton} ${selectedIndex === 0 ? styles.selected : ''}`}
            onClick={onResumeAction}
            onMouseEnter={() => setSelectedIndex(0)}
          >
            {selectedIndex === 0 ? '▶ ' : '  '}RESUME GAME
          </button>
          <button
            className={`${styles.menuButton} ${selectedIndex === 1 ? styles.selected : ''}`}
            onClick={onSaveAction}
            onMouseEnter={() => setSelectedIndex(1)}
          >
            {selectedIndex === 1 ? '▶ ' : '  '}SAVE SESSION
          </button>
          <button
            className={`${styles.menuButton} ${selectedIndex === 2 ? styles.selected : ''}`}
            onClick={onLoadAction}
            onMouseEnter={() => setSelectedIndex(2)}
          >
            {selectedIndex === 2 ? '▶ ' : '  '}LOAD SESSION
          </button>
          <button
            className={`${styles.menuButton} ${selectedIndex === 3 ? styles.selected : ''}`}
            onClick={onSettingsAction}
            onMouseEnter={() => setSelectedIndex(3)}
          >
            {selectedIndex === 3 ? '▶ ' : '  '}SETTINGS
          </button>
          <button
            className={`${styles.menuButton} ${styles.exitButton} ${selectedIndex === 4 ? styles.selected : ''}`}
            onClick={handleExitClick}
            onMouseEnter={() => setSelectedIndex(4)}
          >
            {selectedIndex === 4 ? '▶ ' : '  '}EXIT TO MENU
          </button>
        </div>

        <div className={styles.hint}>↑↓ Navigate • Enter Select • Esc Resume</div>
      </div>
    </div>
  );
});
