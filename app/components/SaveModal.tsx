'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { GameState } from '../types';
import { saveGame } from '../storage/saves';
import styles from './SaveModal.module.css';

interface SaveModalProps {
  gameState: GameState;
  onCloseAction: () => void;
  onSavedAction: () => void;
}

export default function SaveModal({ gameState, onCloseAction, onSavedAction }: SaveModalProps) {
  const [slotName, setSlotName] = useState('');
  const [saving, setSaving] = useState(false);

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
    const name = slotName.trim() || `Session ${new Date().toLocaleString()}`;
    saveGame(gameState, name);
    setSaving(false);
    onSavedAction();
  }, [gameState, slotName, onSavedAction]);

  return (
    <div className={styles.overlay} onClick={onCloseAction}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>SAVE SESSION</h2>
          <div className={styles.line}>═══════════════════════════</div>
        </div>

        <div className={styles.content}>
          <label className={styles.label}>Session Name (optional):</label>
          <input
            type="text"
            value={slotName}
            onChange={e => setSlotName(e.target.value)}
            placeholder={`Session ${new Date().toLocaleString()}`}
            className={styles.input}
            autoFocus
          />

          <div className={styles.info}>
            <div>Current Path: {gameState.currentPath}</div>
            <div>Progress: {gameState.truthsDiscovered.size}/5 truths</div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.saveButton}
            tabIndex={-1}
            onMouseDown={e => e.preventDefault()}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'SAVING...' : '[ SAVE ]'}
          </button>
          <button
            className={styles.cancelButton}
            tabIndex={-1}
            onMouseDown={e => e.preventDefault()}
            onClick={onCloseAction}
          >
            [ CANCEL ]
          </button>
        </div>
      </div>
    </div>
  );
}
