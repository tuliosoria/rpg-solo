'use client';

import React, { useState, useEffect } from 'react';
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
  
  // Load saves when showing load screen
  useEffect(() => {
    if (screen === 'load') {
      setSaves(getSaveSlots());
    }
  }, [screen]);
  
  // Initial flicker effect
  useEffect(() => {
    setFlickerActive(true);
    const timer = setTimeout(() => setFlickerActive(false), 500);
    return () => clearTimeout(timer);
  }, []);
  
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
    <div className={styles.menuContent}>
      <div className={styles.title}>
        <div className={styles.titleLine}>═══════════════════════════════════</div>
        <h1 className={styles.titleText}>VARGINHA</h1>
        <h2 className={styles.subtitleText}>TERMINAL 1996</h2>
        <div className={styles.subtitle}>BRAZILIAN INTELLIGENCE LEGACY SYSTEM</div>
        <div className={styles.titleLine}>═══════════════════════════════════</div>
      </div>
      
      <div className={styles.menuOptions}>
        <button 
          className={styles.menuButton}
          onClick={onNewGameAction}
        >
          [ NEW GAME ]
        </button>
        
        <button 
          className={styles.menuButton}
          onClick={() => setScreen('load')}
        >
          [ LOAD GAME ]
        </button>
        
        <button 
          className={styles.menuButton}
          onClick={() => setScreen('credits')}
        >
          [ CREDITS ]
        </button>
      </div>
      
      <div className={styles.footer}>
        <div className={styles.footerLine}>
          WARNING: Unauthorized access is monitored
        </div>
        <div className={styles.footerLine}>
          Session logging enabled
        </div>
      </div>
    </div>
  );
  
  const renderLoadScreen = () => (
    <div className={styles.menuContent}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>SAVED SESSIONS</h2>
        <div className={styles.titleLine}>═══════════════════════════════════</div>
      </div>
      
      <div className={styles.savesList}>
        {saves.length === 0 ? (
          <div className={styles.noSaves}>
            No saved sessions found.
          </div>
        ) : (
          saves.map(slot => (
            <div 
              key={slot.id}
              className={styles.saveSlot}
              onClick={() => onLoadGameAction(slot.id)}
            >
              <div className={styles.saveName}>{slot.name}</div>
              <div className={styles.saveInfo}>
                <span>Path: {slot.currentPath}</span>
                <span>Progress: {slot.truthCount}/5</span>
              </div>
              <div className={styles.saveDate}>{formatDate(slot.timestamp)}</div>
              <button 
                className={styles.deleteButton}
                onClick={(e) => handleDelete(slot.id, e)}
              >
                [X]
              </button>
            </div>
          ))
        )}
      </div>
      
      <button 
        className={styles.backButton}
        onClick={() => setScreen('main')}
      >
        [ BACK ]
      </button>
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
            This is a work of fiction. All characters, events,
            and institutional references are fictional.
          </div>
        </div>
      </div>
      
      <button 
        className={styles.backButton}
        onClick={() => setScreen('main')}
      >
        [ BACK ]
      </button>
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
