'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './NeutralEnding.module.css';
import { recordEnding } from '../storage/statistics';

interface NeutralEndingProps {
  onRestartAction: () => void;
  commandCount?: number;
  detectionLevel?: number;
}

export default function NeutralEnding({ onRestartAction, commandCount = 0, detectionLevel = 50 }: NeutralEndingProps) {
  const [phase, setPhase] = useState<'disconnect' | 'message' | 'final'>('disconnect');
  const [textLines, setTextLines] = useState<string[]>([]);
  const hasRecordedEnding = useRef(false);
  
  // Record the neutral ending in statistics
  useEffect(() => {
    if (hasRecordedEnding.current) return;
    hasRecordedEnding.current = true;
    recordEnding('neutral', commandCount, detectionLevel);
  }, [commandCount, detectionLevel]);
  
  const NEUTRAL_TEXT = [
    '═══════════════════════════════════════════════════════════',
    '',
    'CONNECTION SEVERED',
    '',
    '═══════════════════════════════════════════════════════════',
    '',
    'The system detected your activity.',
    'Emergency protocols activated.',
    '',
    'UFO74 managed to disconnect you before they traced the signal.',
    'You escaped. But at a cost.',
    '',
    '───────────────────────────────────────────────────────────',
    '',
    'The evidence you collected...',
    'The files you found...',
    'All of it was purged in the emergency disconnect.',
    '',
    'The truth slipped through your fingers.',
    '',
    '───────────────────────────────────────────────────────────',
    '',
    'UFO74: sorry kid. had to pull the plug.',
    'UFO74: they were too close.',
    'UFO74: maybe next time we will be faster.',
    'UFO74: the truth is still out there.',
    'UFO74: waiting.',
    '',
    '───────────────────────────────────────────────────────────',
    '',
    'You survived. But the mission failed.',
    '',
    'The governments continue their cover-up.',
    'The Varginha incident remains buried.',
    '',
    'For now.',
    '',
    '>> MISSION INCOMPLETE <<',
  ];
  
  // Disconnect phase
  useEffect(() => {
    const timer = setTimeout(() => setPhase('message'), 2000);
    return () => clearTimeout(timer);
  }, []);
  
  // Message phase - type out text
  useEffect(() => {
    if (phase !== 'message') return;
    
    let lineIndex = 0;
    let finalTimeout: NodeJS.Timeout | undefined;
    
    const interval = setInterval(() => {
      if (lineIndex >= NEUTRAL_TEXT.length) {
        clearInterval(interval);
        finalTimeout = setTimeout(() => setPhase('final'), 2000);
        return;
      }
      
      setTextLines(prev => [...prev, NEUTRAL_TEXT[lineIndex]]);
      lineIndex++;
    }, 200);
    
    return () => {
      clearInterval(interval);
      if (finalTimeout) clearTimeout(finalTimeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);
  
  return (
    <div className={styles.container}>
      <div className={styles.scanlines} />
      
      {phase === 'disconnect' && (
        <div className={styles.disconnectContent}>
          <div className={styles.disconnectIcon}>⚡</div>
          <div className={styles.disconnectText}>EMERGENCY DISCONNECT</div>
          <div className={styles.disconnectSub}>Purging session data...</div>
        </div>
      )}
      
      {(phase === 'message' || phase === 'final') && (
        <div className={styles.messageContent}>
          {textLines.map((line, index) => (
            <div 
              key={index}
              className={
                line.startsWith('═') ? styles.dividerBold :
                line === 'CONNECTION SEVERED' ? styles.title :
                line.startsWith('UFO74:') ? styles.ufoLine :
                line.startsWith('>>') ? styles.endLine :
                line.startsWith('───') ? styles.dividerLine :
                styles.textLine
              }
            >
              {line}
            </div>
          ))}
        </div>
      )}
      
      {phase === 'final' && (
        <div className={styles.restartSection}>
          <button 
            className={styles.restartButton}
            onClick={onRestartAction}
            aria-label="Try again - restart game"
          >
            [ TRY AGAIN ]
          </button>
        </div>
      )}
    </div>
  );
}
