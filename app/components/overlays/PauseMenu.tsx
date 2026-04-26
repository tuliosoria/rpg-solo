'use client';

import React, { useState, useCallback, useLayoutEffect, useRef, memo, useMemo } from 'react';
import { useI18n } from '../../i18n';
import { useFocusTrap } from '../../hooks';
import styles from './PauseMenu.module.css';

interface PauseMenuProps {
  onResumeAction: () => void;
  onSaveAction: () => void;
  onLoadAction: () => void;
  onSettingsAction: () => void;
  onExitAction: () => void;
  canLoadAction?: boolean;
}

type ConfirmMode = 'exit' | 'load' | null;

export default memo(function PauseMenu({
  onResumeAction,
  onSaveAction,
  onLoadAction,
  onSettingsAction,
  onExitAction,
  canLoadAction = true,
}: PauseMenuProps) {
  const { t } = useI18n();
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef);
  const [confirmMode, setConfirmMode] = useState<ConfirmMode>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isConfirming = confirmMode !== null;

  const menuItems = useMemo(
    () =>
      isConfirming
        ? ['confirm', 'cancel']
        : canLoadAction
          ? ['resume', 'save', 'load', 'settings', 'exit']
          : ['resume', 'save', 'settings', 'exit'],
    [canLoadAction, isConfirming]
  );

  const restoreMenuSelection = useCallback(
    (mode: Exclude<ConfirmMode, null>) => {
      if (mode === 'load') {
        setSelectedIndex(2);
        return;
      }

      setSelectedIndex(canLoadAction ? 4 : 3);
    },
    [canLoadAction]
  );

  const closeConfirm = useCallback(
    (mode: Exclude<ConfirmMode, null>) => {
      setConfirmMode(null);
      restoreMenuSelection(mode);
    },
    [restoreMenuSelection]
  );

  const openConfirm = useCallback((mode: Exclude<ConfirmMode, null>) => {
    setConfirmMode(mode);
    setSelectedIndex(1); // Default to "No" for safety
  }, []);

  const handleConfirmAction = useCallback(() => {
    if (confirmMode === 'exit') {
      onExitAction();
      return;
    }

    if (confirmMode === 'load') {
      onLoadAction();
    }
  }, [confirmMode, onExitAction, onLoadAction]);

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
          if (confirmMode) {
            if (selectedIndex === 0) {
              handleConfirmAction();
            } else {
              closeConfirm(confirmMode);
            }
          } else {
            switch (menuItems[selectedIndex]) {
              case 'resume':
                onResumeAction();
                break;
              case 'save':
                onSaveAction();
                break;
              case 'load':
                openConfirm('load');
                break;
              case 'settings':
                onSettingsAction();
                break;
              case 'exit':
                openConfirm('exit');
                break;
            }
          }
          break;
        case 'Escape':
          e.preventDefault();
          if (confirmMode) {
            closeConfirm(confirmMode);
          } else {
            onResumeAction();
          }
          break;
      }
    },
    [
      menuItems,
      selectedIndex,
      confirmMode,
      closeConfirm,
      handleConfirmAction,
      onResumeAction,
      onSaveAction,
      onSettingsAction,
      openConfirm,
    ]
  );

  useLayoutEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (confirmMode) {
    const titleKey = confirmMode === 'load' ? 'pause.loadConfirm.title' : 'pause.confirm.title';
    const yesKey = confirmMode === 'load' ? 'pause.loadConfirm.yes' : 'pause.confirm.yes';

    return (
      <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="pausemenu-title">
        <div className={styles.menu} ref={modalRef} onClick={e => e.stopPropagation()}>
          <div className={styles.header}>
            <h2 id="pausemenu-title">{t(titleKey)}</h2>
            <div className={styles.line}>═══════════════════════════</div>
          </div>

          <div className={styles.warning}>{t('pause.confirm.warning')}</div>

          <div className={styles.options}>
            <button
              className={`${styles.menuButton} ${styles.exitButton} ${selectedIndex === 0 ? styles.selected : ''}`}
              tabIndex={0}
              onMouseDown={e => e.preventDefault()}
              onClick={handleConfirmAction}
              onMouseEnter={() => setSelectedIndex(0)}
            >
              {selectedIndex === 0 ? '▶ ' : '  '}
              {t(yesKey)}
            </button>
            <button
              className={`${styles.menuButton} ${selectedIndex === 1 ? styles.selected : ''}`}
              tabIndex={0}
              onMouseDown={e => e.preventDefault()}
              onClick={() => closeConfirm(confirmMode)}
              onMouseEnter={() => setSelectedIndex(1)}
            >
              {selectedIndex === 1 ? '▶ ' : '  '}
              {t('pause.confirm.no')}
            </button>
          </div>

          <div className={styles.hint}>{t('pause.confirm.hint')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={onResumeAction} role="dialog" aria-modal="true" aria-labelledby="pausemenu-title">
      <div className={styles.menu} ref={modalRef} onClick={e => e.stopPropagation()}>
          <div className={styles.header}>
            <h2 id="pausemenu-title">{t('pause.title')}</h2>
            <div className={styles.line}>═══════════════════════════</div>
          </div>

          <div className={styles.objectivePanel}>
            <div className={styles.objectiveTitle}>{t('pause.objectiveTitle')}</div>
            <p>{t('pause.objective')}</p>
          </div>

          <div className={styles.options}>
          <button
            className={`${styles.menuButton} ${selectedIndex === menuItems.indexOf('resume') ? styles.selected : ''}`}
            tabIndex={0}
            onMouseDown={e => e.preventDefault()}
            onClick={onResumeAction}
            onMouseEnter={() => setSelectedIndex(menuItems.indexOf('resume'))}
          >
            {selectedIndex === menuItems.indexOf('resume') ? '▶ ' : '  '}
            {t('pause.resume')}
          </button>
          <button
            className={`${styles.menuButton} ${selectedIndex === menuItems.indexOf('save') ? styles.selected : ''}`}
            tabIndex={0}
            onMouseDown={e => e.preventDefault()}
            onClick={onSaveAction}
            onMouseEnter={() => setSelectedIndex(menuItems.indexOf('save'))}
          >
            {selectedIndex === menuItems.indexOf('save') ? '▶ ' : '  '}
            {t('pause.save')}
          </button>
          {canLoadAction && (
            <button
              className={`${styles.menuButton} ${selectedIndex === menuItems.indexOf('load') ? styles.selected : ''}`}
              tabIndex={0}
              onMouseDown={e => e.preventDefault()}
              onClick={() => openConfirm('load')}
              onMouseEnter={() => setSelectedIndex(menuItems.indexOf('load'))}
            >
              {selectedIndex === menuItems.indexOf('load') ? '▶ ' : '  '}
              {t('pause.load')}
            </button>
          )}
          <button
            className={`${styles.menuButton} ${selectedIndex === menuItems.indexOf('settings') ? styles.selected : ''}`}
            tabIndex={0}
            onMouseDown={e => e.preventDefault()}
            onClick={onSettingsAction}
            onMouseEnter={() => setSelectedIndex(menuItems.indexOf('settings'))}
          >
            {selectedIndex === menuItems.indexOf('settings') ? '▶ ' : '  '}
            {t('pause.settings')}
          </button>
          <button
            className={`${styles.menuButton} ${styles.exitButton} ${selectedIndex === menuItems.indexOf('exit') ? styles.selected : ''}`}
            tabIndex={0}
            onMouseDown={e => e.preventDefault()}
            onClick={() => openConfirm('exit')}
            onMouseEnter={() => setSelectedIndex(menuItems.indexOf('exit'))}
          >
            {selectedIndex === menuItems.indexOf('exit') ? '▶ ' : '  '}
            {t('pause.exit')}
          </button>
        </div>

        <div className={styles.hint}>{t('pause.hint')}</div>
      </div>
    </div>
  );
});
