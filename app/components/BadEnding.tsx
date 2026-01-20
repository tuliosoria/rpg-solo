'use client';

import React, { useState, useEffect } from 'react';
import styles from './BadEnding.module.css';

interface BadEndingProps {
  onRestartAction: () => void;
  reason?: string;
}

export default function BadEnding({ onRestartAction, reason = 'DETECTION THRESHOLD EXCEEDED' }: BadEndingProps) {
  const [phase, setPhase] = useState<'glitch' | 'lockdown' | 'message' | 'final'>('glitch');
  const [textLines, setTextLines] = useState<string[]>([]);
  
  const LOCKDOWN_TEXT = [
    '╔═══════════════════════════════════════════════════════════╗',
    '║                                                           ║',
    '║              ██  SECURITY LOCKDOWN  ██                    ║',
    '║                                                           ║',
    '╚═══════════════════════════════════════════════════════════╝',
    '',
    `TERMINATION REASON: ${reason}`,
    '',
    '───────────────────────────────────────────────────────────',
    '',
    'SYSTEM: Unauthorized access attempt logged.',
    'SYSTEM: Terminal session terminated.',
    'SYSTEM: User credentials flagged for review.',
    '',
    '───────────────────────────────────────────────────────────',
    '',
    'The screen flickers. Your connection drops.',
    '',
    'Somewhere in a government building, an alarm sounds.',
    'A printer spits out your session logs.',
    'Someone reaches for a phone.',
    '',
    'You were so close to the truth.',
    '',
    'But they were watching.',
    'They are always watching.',
    '',
    '───────────────────────────────────────────────────────────',
    '',
    '>> SESSION TERMINATED <<',
  ];
  
  // Glitch phase
  useEffect(() => {
    const timer = setTimeout(() => setPhase('lockdown'), 2000);
    return () => clearTimeout(timer);
  }, []);
  
  // Lockdown phase
  useEffect(() => {
    if (phase !== 'lockdown') return;
    const timer = setTimeout(() => setPhase('message'), 1500);
    return () => clearTimeout(timer);
  }, [phase]);
  
  // Message phase - type out text
  useEffect(() => {
    if (phase !== 'message') return;
    
    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex >= LOCKDOWN_TEXT.length) {
        clearInterval(interval);
        setTimeout(() => setPhase('final'), 2000);
        return;
      }
      
      setTextLines(prev => [...prev, LOCKDOWN_TEXT[lineIndex]]);
      lineIndex++;
    }, 150);
    
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);
  
  return (
    <div className={`${styles.container} ${phase === 'glitch' ? styles.glitching : ''}`}>
      <div className={styles.scanlines} />
      
      {phase === 'glitch' && (
        <div className={styles.glitchContent}>
          <div className={styles.glitchText}>CONNECTION LOST</div>
        </div>
      )}
      
      {phase === 'lockdown' && (
        <div className={styles.lockdownContent}>
          <div className={styles.lockdownIcon}>🔒</div>
          <div className={styles.lockdownText}>SECURITY LOCKDOWN</div>
        </div>
      )}
      
      {(phase === 'message' || phase === 'final') && (
        <div className={styles.messageContent}>
          {textLines.map((line, index) => (
            <div 
              key={index}
              className={
                line.startsWith('╔') || line.startsWith('╚') || line.startsWith('║') ? styles.boxLine :
                line.startsWith('TERMINATION') ? styles.errorLine :
                line.startsWith('SYSTEM:') ? styles.systemLine :
                line.startsWith('>>') ? styles.terminalLine :
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
          >
            [ TRY AGAIN ]
          </button>
        </div>
      )}
    </div>
  );
}
