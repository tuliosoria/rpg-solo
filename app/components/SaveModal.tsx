'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { GameState } from '../types';
import { saveGame } from '../storage/saves';
import { useI18n } from '../i18n';
import styles from './SaveModal.module.css';

interface SaveModalProps {
  gameState: GameState;
  onCloseAction: () => void;
  onSavedAction: () => void;
}

export default function SaveModal({ gameState, onCloseAction, onSavedAction }: SaveModalProps) {
  const { language, t } = useI18n();
  const [slotName, setSlotName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

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

  const handleSave = useCallback(() => {
    setSaving(true);
    setSaveError(null);
    const locale = language === 'pt-BR' ? 'pt-BR' : language === 'es' ? 'es' : 'en-US';
    const name = slotName.trim() || t('save.defaultName', { value: new Date().toLocaleString(locale) });
    const savedSlot = saveGame(gameState, name);
    setSaving(false);
    if (!savedSlot) {
      setSaveError(
        t(
          'save.error.failed',
          undefined,
          'SAVE FAILED — Storage unavailable. Free some space or try a different browser mode.'
        )
      );
      return;
    }
    onSavedAction();
  }, [gameState, language, onSavedAction, slotName, t]);

  return (
    <div className={styles.overlay} onClick={onCloseAction} role="dialog" aria-modal="true" aria-labelledby="savemodal-title">
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="savemodal-title">{t('save.title')}</h2>
          <div className={styles.line}>═══════════════════════════</div>
        </div>

        <div className={styles.content}>
          <label className={styles.label}>{t('save.nameLabel')}</label>
          <input
            type="text"
            value={slotName}
            onChange={e => {
              setSlotName(e.target.value);
              if (saveError) {
                setSaveError(null);
              }
            }}
            placeholder={t('save.defaultName', {
              value: new Date().toLocaleString(
                language === 'pt-BR' ? 'pt-BR' : language === 'es' ? 'es' : 'en-US'
              ),
            })}
            className={styles.input}
            autoFocus
          />

          <div className={styles.info}>
            <div>{t('save.path')}: {gameState.currentPath}</div>
            <div>
              {t('save.progress')}: {gameState.evidenceCount || 0}/5 {t('save.progressSuffix')}
            </div>
          </div>
          {saveError && (
            <div className={styles.error} role="alert">
              {saveError}
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button
            className={styles.saveButton}
            tabIndex={-1}
            onMouseDown={e => e.preventDefault()}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? t('save.button.saving') : t('save.button.idle')}
          </button>
          <button
            className={styles.cancelButton}
            tabIndex={-1}
            onMouseDown={e => e.preventDefault()}
            onClick={onCloseAction}
          >
            {t('save.button.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}
