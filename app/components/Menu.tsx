'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SaveSlot } from '../types';
import { getSaveSlots, deleteSave } from '../storage/saves';
import styles from './Menu.module.css';

interface MenuProps {
  onNewGameAction: () => void;
  onLoadGameAction: (slotId: string) => void;
}

type Screen = 'main' | 'load' | 'credits';

export default function Menu({ onNewGameAction, onLoadGameAction }: MenuProps) {
  const [screen, setScreen] = useState<Screen>('main');
  const [saves, setSaves] = useState<SaveSlot[]>([]);
  const [flickerActive, setFlickerActive] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Refs for menu buttons for focus management
  const mainMenuRef = useRef<HTMLDivElement>(null);
  const loadListRef = useRef<HTMLDivElement>(null);

  // Load saves when showing load screen
  useEffect(() => {
    if (screen === 'load') {
      setSaves(getSaveSlots());
      setSelectedIndex(0);
    }
  }, [screen]);

  // Reset selection when changing screens
  useEffect(() => {
    setSelectedIndex(0);
  }, [screen]);

  // Initial flicker effect
  useEffect(() => {
    setFlickerActive(true);
    const timer = setTimeout(() => setFlickerActive(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const maxIndex =
        screen === 'main' ? 2 : screen === 'load' ? (saves.length > 0 ? saves.length : 0) : 0;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : maxIndex));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev < maxIndex ? prev + 1 : 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (screen === 'main') {
            if (selectedIndex === 0) onNewGameAction();
            else if (selectedIndex === 1) setScreen('load');
            else if (selectedIndex === 2) setScreen('credits');
          } else if (screen === 'load') {
            if (saves.length > 0 && selectedIndex < saves.length) {
              onLoadGameAction(saves[selectedIndex].id);
            } else if (selectedIndex === saves.length || saves.length === 0) {
              setScreen('main');
            }
          } else if (screen === 'credits') {
            setScreen('main');
          }
          break;
        case 'Escape':
          e.preventDefault();
          if (screen !== 'main') {
            setScreen('main');
          }
          break;
      }
    },
    [screen, selectedIndex, saves, onNewGameAction, onLoadGameAction]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleDelete = (slotId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this save?')) {
      deleteSave(slotId);
      setSaves(getSaveSlots());
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const renderMainMenu = () => (
    <div className={styles.menuContent} ref={mainMenuRef}>
      <div className={styles.title}>
        <div className={styles.titleLine}>═══════════════════════════════════</div>
        <h1 className={styles.titleText}>VARGINHA</h1>
        <h2 className={styles.subtitleText}>TERMINAL 1996</h2>
        <div className={styles.subtitle}>BRAZILIAN INTELLIGENCE LEGACY SYSTEM</div>
        <div className={styles.titleLine}>═══════════════════════════════════</div>
      </div>

      <div className={styles.menuOptions}>
        <button
          className={`${styles.menuButton} ${selectedIndex === 0 ? styles.selected : ''}`}
          onClick={onNewGameAction}
          onMouseEnter={() => setSelectedIndex(0)}
        >
          {selectedIndex === 0 ? '▶ ' : '  '}[ NEW GAME ]
        </button>

        <button
          className={`${styles.menuButton} ${selectedIndex === 1 ? styles.selected : ''}`}
          onClick={() => setScreen('load')}
          onMouseEnter={() => setSelectedIndex(1)}
        >
          {selectedIndex === 1 ? '▶ ' : '  '}[ LOAD GAME ]
        </button>

        <button
          className={`${styles.menuButton} ${selectedIndex === 2 ? styles.selected : ''}`}
          onClick={() => setScreen('credits')}
          onMouseEnter={() => setSelectedIndex(2)}
        >
          {selectedIndex === 2 ? '▶ ' : '  '}[ CREDITS ]
        </button>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerLine}>WARNING: Unauthorized access is monitored</div>
        <div className={styles.footerLine}>Session logging enabled</div>
        <div className={styles.keyHint}>↑↓ Navigate • Enter Select</div>
      </div>
    </div>
  );

  const renderLoadScreen = () => (
    <div className={styles.menuContent} ref={loadListRef}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>SAVED SESSIONS</h2>
        <div className={styles.titleLine}>═══════════════════════════════════</div>
      </div>

      <div className={styles.savesList}>
        {saves.length === 0 ? (
          <div className={styles.noSaves}>No saved sessions found.</div>
        ) : (
          saves.map((slot, index) => (
            <div
              key={slot.id}
              className={`${styles.saveSlot} ${selectedIndex === index ? styles.selected : ''}`}
              onClick={() => onLoadGameAction(slot.id)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className={styles.saveSelector}>{selectedIndex === index ? '▶' : ' '}</div>
              <div className={styles.saveContent}>
                <div className={styles.saveName}>{slot.name}</div>
                <div className={styles.saveInfo}>
                  <span>Path: {slot.currentPath}</span>
                  <span>Progress: {slot.truthCount}/5</span>
                  <span
                    className={
                      slot.detectionLevel >= 80
                        ? styles.riskCritical
                        : slot.detectionLevel >= 50
                          ? styles.riskHigh
                          : styles.riskLow
                    }
                  >
                    Risk: {slot.detectionLevel ?? 0}%
                  </span>
                </div>
                <div className={styles.saveDate}>{formatDate(slot.timestamp)}</div>
              </div>
              <button className={styles.deleteButton} onClick={e => handleDelete(slot.id, e)}>
                [X]
              </button>
            </div>
          ))
        )}
      </div>

      <button
        className={`${styles.backButton} ${selectedIndex === saves.length ? styles.selected : ''}`}
        onClick={() => setScreen('main')}
        onMouseEnter={() => setSelectedIndex(saves.length)}
      >
        {selectedIndex === saves.length ? '▶ ' : '  '}[ BACK ]
      </button>
      <div className={styles.keyHint}>↑↓ Navigate • Enter Select • Esc Back</div>
    </div>
  );

  const renderCredits = () => (
    <div className={styles.menuContent}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>CREDITS</h2>
        <div className={styles.titleLine}>═══════════════════════════════════</div>
      </div>

      <div className={styles.credits}>
        <div className={styles.creditSection}>
          <div className={styles.creditLabel}>VARGINHA: TERMINAL 1996</div>
          <div className={styles.creditValue}>A text-based discovery puzzle</div>
        </div>

        <div className={styles.creditSection}>
          <div className={styles.creditLabel}>GENRE</div>
          <div className={styles.creditValue}>Procedural Horror / Ufology / Hard Sci-Fi</div>
        </div>

        <div className={styles.creditSection}>
          <div className={styles.creditLabel}>SETTING</div>
          <div className={styles.creditValue}>Brazilian Intelligence Legacy System, 1996</div>
        </div>

        <div className={styles.creditSection}>
          <div className={styles.creditLabel}>INSPIRED BY</div>
          <div className={styles.creditValue}>The Varginha Incident</div>
        </div>

        <div className={styles.creditSection}>
          <div className={styles.creditLabel}>NOTE</div>
          <div className={styles.creditValue}>
            This is a work of fiction. All characters, events, and institutional references are
            fictional.
          </div>
        </div>
      </div>

      <button
        className={`${styles.backButton} ${styles.selected}`}
        onClick={() => setScreen('main')}
      >
        ▶ [ BACK ]
      </button>
      <div className={styles.keyHint}>Enter or Esc to go back</div>
    </div>
  );

  return (
    <div className={`${styles.menu} ${flickerActive ? styles.flicker : ''}`}>
      {/* Scanlines */}
      <div className={styles.scanlines} />

      {/* CRT glow effect */}
      <div className={styles.glow} />

      {screen === 'main' && renderMainMenu()}
      {screen === 'load' && renderLoadScreen()}
      {screen === 'credits' && renderCredits()}
    </div>
  );
}
