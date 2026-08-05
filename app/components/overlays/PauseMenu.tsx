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
      const target = e.target;
      const nativeInteractiveTarget =
        target instanceof HTMLElement &&
        ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName);

      if (e.key === 'Enter' && nativeInteractiveTarget) {
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          {
            const nextIndex = selectedIndex > 0 ? selectedIndex - 1 : menuItems.length - 1;
            setSelectedIndex(nextIndex);
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          {
            const nextIndex = selectedIndex < menuItems.length - 1 ? selectedIndex + 1 : 0;
            setSelectedIndex(nextIndex);
          }
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

  useLayoutEffect(() => {
    const control = modalRef.current?.querySelectorAll<HTMLButtonElement>('button')[selectedIndex];
    control?.focus({ preventScroll: true });
    if (typeof control?.scrollIntoView === 'function') {
      control.scrollIntoView({ block: 'nearest' });
    }
  }, [confirmMode, selectedIndex]);

  if (confirmMode) {
    const titleKey = confirmMode === 'load' ? 'pause.loadConfirm.title' : 'pause.confirm.title';
    const yesKey = confirmMode === 'load' ? 'pause.loadConfirm.yes' : 'pause.confirm.yes';

    return (
      <div
        className={styles.overlay}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pausemenu-title"
      >
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
              onPointerMove={() => setSelectedIndex(0)}
              onFocus={() => setSelectedIndex(0)}
            >
              {selectedIndex === 0 ? '▶ ' : '  '}
              {t(yesKey)}
            </button>
            <button
              className={`${styles.menuButton} ${selectedIndex === 1 ? styles.selected : ''}`}
              tabIndex={0}
              onMouseDown={e => e.preventDefault()}
              onClick={() => closeConfirm(confirmMode)}
              onPointerMove={() => setSelectedIndex(1)}
              onFocus={() => setSelectedIndex(1)}
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
    <div
      className={styles.overlay}
      onClick={onResumeAction}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pausemenu-title"
    >
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
            onPointerMove={() => setSelectedIndex(menuItems.indexOf('resume'))}
            onFocus={() => setSelectedIndex(menuItems.indexOf('resume'))}
          >
            {selectedIndex === menuItems.indexOf('resume') ? '▶ ' : '  '}
            {t('pause.resume')}
          </button>
          <button
            className={`${styles.menuButton} ${selectedIndex === menuItems.indexOf('save') ? styles.selected : ''}`}
            tabIndex={0}
            onMouseDown={e => e.preventDefault()}
            onClick={onSaveAction}
            onPointerMove={() => setSelectedIndex(menuItems.indexOf('save'))}
            onFocus={() => setSelectedIndex(menuItems.indexOf('save'))}
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
              onPointerMove={() => setSelectedIndex(menuItems.indexOf('load'))}
              onFocus={() => setSelectedIndex(menuItems.indexOf('load'))}
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
            onPointerMove={() => setSelectedIndex(menuItems.indexOf('settings'))}
            onFocus={() => setSelectedIndex(menuItems.indexOf('settings'))}
          >
            {selectedIndex === menuItems.indexOf('settings') ? '▶ ' : '  '}
            {t('pause.settings')}
          </button>
          <button
            className={`${styles.menuButton} ${styles.exitButton} ${selectedIndex === menuItems.indexOf('exit') ? styles.selected : ''}`}
            tabIndex={0}
            onMouseDown={e => e.preventDefault()}
            onClick={() => openConfirm('exit')}
            onPointerMove={() => setSelectedIndex(menuItems.indexOf('exit'))}
            onFocus={() => setSelectedIndex(menuItems.indexOf('exit'))}
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
