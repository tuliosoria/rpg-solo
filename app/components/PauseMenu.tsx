'use client';

import React, { useState, useCallback, useLayoutEffect, memo, useMemo } from 'react';
import { useI18n } from '../i18n';
import styles from './PauseMenu.module.css';

interface PauseMenuProps {
  onResumeAction: () => void;
  onSaveAction: () => void;
  onLoadAction: () => void;
  onSettingsAction: () => void;
  onExitAction: () => void;
  canLoadAction?: boolean;
}

export default memo(function PauseMenu({
  onResumeAction,
  onSaveAction,
  onLoadAction,
  onSettingsAction,
  onExitAction,
  canLoadAction = true,
}: PauseMenuProps) {
  const { t } = useI18n();
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const menuItems = useMemo(
    () =>
      showExitConfirm
        ? ['confirm_exit', 'cancel_exit']
        : canLoadAction
          ? ['resume', 'save', 'load', 'settings', 'exit']
          : ['resume', 'save', 'settings', 'exit'],
    [canLoadAction, showExitConfirm]
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
            setSelectedIndex(canLoadAction ? 4 : 3);
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
      canLoadAction,
      onResumeAction,
      onSaveAction,
      onLoadAction,
      onSettingsAction,
      onExitAction,
    ]
  );

  useLayoutEffect(() => {
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
            <h2>{t('pause.confirm.title')}</h2>
            <div className={styles.line}>═══════════════════════════</div>
          </div>

          <div className={styles.warning}>{t('pause.confirm.warning')}</div>

          <div className={styles.options}>
            <button
              className={`${styles.menuButton} ${styles.exitButton} ${selectedIndex === 0 ? styles.selected : ''}`}
              tabIndex={-1}
              onMouseDown={e => e.preventDefault()}
              onClick={onExitAction}
              onMouseEnter={() => setSelectedIndex(0)}
            >
              {selectedIndex === 0 ? '▶ ' : '  '}{t('pause.confirm.yes')}
            </button>
            <button
              className={`${styles.menuButton} ${selectedIndex === 1 ? styles.selected : ''}`}
              tabIndex={-1}
              onMouseDown={e => e.preventDefault()}
              onClick={() => setShowExitConfirm(false)}
              onMouseEnter={() => setSelectedIndex(1)}
            >
              {selectedIndex === 1 ? '▶ ' : '  '}{t('pause.confirm.no')}
            </button>
          </div>

          <div className={styles.hint}>{t('pause.confirm.hint')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={onResumeAction}>
        <div className={styles.menu} onClick={e => e.stopPropagation()}>
          <div className={styles.header}>
          <h2>{t('pause.title')}</h2>
            <div className={styles.line}>═══════════════════════════</div>
          </div>

        <div className={styles.options}>
            <button
              className={`${styles.menuButton} ${selectedIndex === menuItems.indexOf('resume') ? styles.selected : ''}`}
              tabIndex={-1}
              onMouseDown={e => e.preventDefault()}
              onClick={onResumeAction}
              onMouseEnter={() => setSelectedIndex(menuItems.indexOf('resume'))}
            >
              {selectedIndex === menuItems.indexOf('resume') ? '▶ ' : '  '}{t('pause.resume')}
            </button>
            <button
              className={`${styles.menuButton} ${selectedIndex === menuItems.indexOf('save') ? styles.selected : ''}`}
              tabIndex={-1}
              onMouseDown={e => e.preventDefault()}
              onClick={onSaveAction}
              onMouseEnter={() => setSelectedIndex(menuItems.indexOf('save'))}
            >
              {selectedIndex === menuItems.indexOf('save') ? '▶ ' : '  '}{t('pause.save')}
            </button>
            {canLoadAction && (
              <button
                className={`${styles.menuButton} ${selectedIndex === menuItems.indexOf('load') ? styles.selected : ''}`}
                tabIndex={-1}
                onMouseDown={e => e.preventDefault()}
                onClick={onLoadAction}
                onMouseEnter={() => setSelectedIndex(menuItems.indexOf('load'))}
              >
                {selectedIndex === menuItems.indexOf('load') ? '▶ ' : '  '}{t('pause.load')}
              </button>
            )}
            <button
              className={`${styles.menuButton} ${selectedIndex === menuItems.indexOf('settings') ? styles.selected : ''}`}
              tabIndex={-1}
              onMouseDown={e => e.preventDefault()}
              onClick={onSettingsAction}
              onMouseEnter={() => setSelectedIndex(menuItems.indexOf('settings'))}
            >
              {selectedIndex === menuItems.indexOf('settings') ? '▶ ' : '  '}{t('pause.settings')}
            </button>
            <button
              className={`${styles.menuButton} ${styles.exitButton} ${selectedIndex === menuItems.indexOf('exit') ? styles.selected : ''}`}
              tabIndex={-1}
              onMouseDown={e => e.preventDefault()}
              onClick={handleExitClick}
              onMouseEnter={() => setSelectedIndex(menuItems.indexOf('exit'))}
            >
              {selectedIndex === menuItems.indexOf('exit') ? '▶ ' : '  '}{t('pause.exit')}
            </button>
        </div>

        <div className={styles.hint}>{t('pause.hint')}</div>
      </div>
    </div>
  );
});
