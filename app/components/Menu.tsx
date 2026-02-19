'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SaveSlot, FlickerIntensity, FontSize } from '../types';
import { getSaveSlots, deleteSave } from '../storage/saves';
import { useOptions, DEFAULT_OPTIONS } from '../hooks/useOptions';
import styles from './Menu.module.css';

interface MenuProps {
  onNewGameAction: () => void;
  onLoadGameAction: (slotId: string) => void;
}

type Screen = 'main' | 'load' | 'credits' | 'options';

export default function Menu({ onNewGameAction, onLoadGameAction }: MenuProps) {
  const [screen, setScreen] = useState<Screen>('main');
  const [saves, setSaves] = useState<SaveSlot[]>([]);
  const [flickerActive, setFlickerActive] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Options state
  const { options, setOption, resetOptions, isLoaded } = useOptions();

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
      // Main menu has 4 items now: NEW GAME, LOAD GAME, OPTIONS, CREDITS
      const maxIndex =
        screen === 'main' ? 3 : screen === 'load' ? (saves.length > 0 ? saves.length : 0) : screen === 'options' ? 8 : 0;

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
            else if (selectedIndex === 2) setScreen('options');
            else if (selectedIndex === 3) setScreen('credits');
          } else if (screen === 'load') {
            if (saves.length > 0 && selectedIndex < saves.length) {
              onLoadGameAction(saves[selectedIndex].id);
            } else if (selectedIndex === saves.length || saves.length === 0) {
              setScreen('main');
            }
          } else if (screen === 'credits') {
            setScreen('main');
          } else if (screen === 'options') {
            // Options screen - Back button is last
            if (selectedIndex === 8) {
              setScreen('main');
            }
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
          onClick={() => setScreen('options')}
          onMouseEnter={() => setSelectedIndex(2)}
        >
          {selectedIndex === 2 ? '▶ ' : '  '}[ OPTIONS ]
        </button>

        <button
          className={`${styles.menuButton} ${selectedIndex === 3 ? styles.selected : ''}`}
          onClick={() => setScreen('credits')}
          onMouseEnter={() => setSelectedIndex(3)}
        >
          {selectedIndex === 3 ? '▶ ' : '  '}[ CREDITS ]
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
          <div className={styles.creditLabel}>CREATED BY</div>
          <div className={styles.creditValue}>Tulio Soria & Arthur Ramos</div>
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

        <div className={styles.creditSection}>
          <div className={styles.creditValue}>© 2026 Tulio Soria & Arthur Ramos. All rights reserved.</div>
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

  const renderOptions = () => {
    const flickerOptions: FlickerIntensity[] = ['low', 'medium', 'high'];
    const fontSizeOptions: FontSize[] = ['small', 'medium', 'large'];

    return (
      <div className={styles.menuContent}>
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>OPTIONS</h2>
          <div className={styles.titleLine}>═══════════════════════════════════</div>
        </div>

        <div className={styles.optionsContainer}>
          {/* AUDIO SECTION */}
          <div className={styles.optionSection}>
            <div className={styles.optionSectionTitle}>[ AUDIO ]</div>

            {/* Master Volume Slider */}
            <div
              className={`${styles.optionRow} ${selectedIndex === 0 ? styles.selected : ''}`}
              onMouseEnter={() => setSelectedIndex(0)}
            >
              <span className={styles.optionLabel}>Master Volume</span>
              <div className={styles.sliderContainer}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={options.masterVolume}
                  onChange={e => setOption('masterVolume', parseInt(e.target.value))}
                  className={styles.slider}
                />
                <span className={styles.sliderValue}>{options.masterVolume}%</span>
              </div>
            </div>

            {/* Ambient Sound Toggle */}
            <div
              className={`${styles.optionRow} ${selectedIndex === 1 ? styles.selected : ''}`}
              onMouseEnter={() => setSelectedIndex(1)}
              onClick={() => setOption('ambientSoundEnabled', !options.ambientSoundEnabled)}
            >
              <span className={styles.optionLabel}>Ambient Sound</span>
              <span className={styles.optionToggle}>
                [ {options.ambientSoundEnabled ? 'ON ' : 'OFF'} ]
              </span>
            </div>

            {/* Sound Effects Toggle */}
            <div
              className={`${styles.optionRow} ${selectedIndex === 2 ? styles.selected : ''}`}
              onMouseEnter={() => setSelectedIndex(2)}
              onClick={() => setOption('soundEffectsEnabled', !options.soundEffectsEnabled)}
            >
              <span className={styles.optionLabel}>Sound Effects</span>
              <span className={styles.optionToggle}>
                [ {options.soundEffectsEnabled ? 'ON ' : 'OFF'} ]
              </span>
            </div>

            {/* Turing Voice Toggle */}
            <div
              className={`${styles.optionRow} ${selectedIndex === 3 ? styles.selected : ''}`}
              onMouseEnter={() => setSelectedIndex(3)}
              onClick={() => setOption('turingVoiceEnabled', !options.turingVoiceEnabled)}
            >
              <span className={styles.optionLabel}>Turing Test Voice</span>
              <span className={styles.optionToggle}>
                [ {options.turingVoiceEnabled ? 'ON ' : 'OFF'} ]
              </span>
            </div>
          </div>

          {/* VISUAL SECTION */}
          <div className={styles.optionSection}>
            <div className={styles.optionSectionTitle}>[ VISUAL ]</div>

            {/* CRT Effects Toggle */}
            <div
              className={`${styles.optionRow} ${selectedIndex === 4 ? styles.selected : ''}`}
              onMouseEnter={() => setSelectedIndex(4)}
              onClick={() => setOption('crtEffectsEnabled', !options.crtEffectsEnabled)}
            >
              <span className={styles.optionLabel}>CRT Effects</span>
              <span className={styles.optionToggle}>
                [ {options.crtEffectsEnabled ? 'ON ' : 'OFF'} ]
              </span>
            </div>

            {/* Screen Flicker Toggle */}
            <div
              className={`${styles.optionRow} ${selectedIndex === 5 ? styles.selected : ''}`}
              onMouseEnter={() => setSelectedIndex(5)}
              onClick={() => setOption('screenFlickerEnabled', !options.screenFlickerEnabled)}
            >
              <span className={styles.optionLabel}>Screen Flicker</span>
              <span className={styles.optionToggle}>
                [ {options.screenFlickerEnabled ? 'ON ' : 'OFF'} ]
              </span>
            </div>

            {/* Flicker Intensity Select (only when flicker is on) */}
            <div
              className={`${styles.optionRow} ${selectedIndex === 6 ? styles.selected : ''} ${!options.screenFlickerEnabled ? styles.optionDisabled : ''}`}
              onMouseEnter={() => setSelectedIndex(6)}
              onClick={() => {
                if (options.screenFlickerEnabled) {
                  const currentIdx = flickerOptions.indexOf(options.flickerIntensity);
                  const nextIdx = (currentIdx + 1) % flickerOptions.length;
                  setOption('flickerIntensity', flickerOptions[nextIdx]);
                }
              }}
            >
              <span className={styles.optionLabel}>Flicker Intensity</span>
              <span className={styles.optionSelect}>
                {'< '}{options.flickerIntensity.toUpperCase()}{' >'}
              </span>
            </div>

            {/* Font Size Select */}
            <div
              className={`${styles.optionRow} ${selectedIndex === 7 ? styles.selected : ''}`}
              onMouseEnter={() => setSelectedIndex(7)}
              onClick={() => {
                const currentIdx = fontSizeOptions.indexOf(options.fontSize);
                const nextIdx = (currentIdx + 1) % fontSizeOptions.length;
                setOption('fontSize', fontSizeOptions[nextIdx]);
              }}
            >
              <span className={styles.optionLabel}>Font Size</span>
              <span className={styles.optionSelect}>
                {'< '}{options.fontSize.toUpperCase()}{' >'}
              </span>
            </div>
          </div>
        </div>

        <button
          className={`${styles.backButton} ${selectedIndex === 8 ? styles.selected : ''}`}
          onClick={() => setScreen('main')}
          onMouseEnter={() => setSelectedIndex(8)}
        >
          {selectedIndex === 8 ? '▶ ' : '  '}[ BACK ]
        </button>
        <div className={styles.keyHint}>↑↓ Navigate • Enter/Click Toggle • Esc Back</div>
      </div>
    );
  };

  return (
    <div className={`${styles.menu} ${flickerActive ? styles.flicker : ''}`}>
      {/* Scanlines */}
      <div className={styles.scanlines} />

      {/* CRT glow effect */}
      <div className={styles.glow} />

      {screen === 'main' && renderMainMenu()}
      {screen === 'load' && renderLoadScreen()}
      {screen === 'credits' && renderCredits()}
      {screen === 'options' && renderOptions()}
    </div>
  );
}
