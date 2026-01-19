'use client';

import React, { useState, useEffect } from 'react';
import styles from './Blackout.module.css';

interface BlackoutProps {
  onCompleteAction: () => void;
}

export default function Blackout({ onCompleteAction }: BlackoutProps) {
  const [phase, setPhase] = useState<'glitch' | 'loading' | 'message' | 'fade'>('glitch');
  const [loadProgress, setLoadProgress] = useState(0);
  const [messageLines, setMessageLines] = useState<string[]>([]);
  
  const UFO74_FINAL_MESSAGES = [
    'UFO74: hackerkid... are you still there?',
    '',
    'UFO74: they cut the main connection.',
    'UFO74: i knew this was going to happen.',
    '',
    'UFO74: but listen... the evidence is saved.',
    'UFO74: it persisted outside the system that was wiped.',
    '',
    'UFO74: now you need another way to send this out.',
    '',
    'UFO74: wait... i have an idea.',
    'UFO74: i can "hang" the connection on a civilian computer.',
    'UFO74: its risky but its the only chance.',
    '',
    'UFO74: i found someone online... a teenager on ICQ.',
    'UFO74: im going to transfer you there.',
    '',
    'UFO74: convince them to save the files on physical media.',
    'UFO74: floppy disk, CD, anything.',
    '',
    'UFO74: good luck hackerkid. its all up to you now.',
    '',
    '>> INITIATING CONNECTION TRANSFER <<',
  ];
  
  // Phase 1: Glitch effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('loading');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  
  // Phase 2: Loading bar
  useEffect(() => {
    if (phase !== 'loading') return;
    
    const interval = setInterval(() => {
      setLoadProgress(prev => {
        const next = prev + Math.random() * 8 + 2;
        if (next >= 100) {
          clearInterval(interval);
          setPhase('message');
          return 100;
        }
        return next;
      });
    }, 150);
    
    return () => clearInterval(interval);
  }, [phase]);
  
  // Phase 3: Show messages one by one
  useEffect(() => {
    if (phase !== 'message') return;
    
    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex >= UFO74_FINAL_MESSAGES.length) {
        clearInterval(interval);
        setTimeout(() => setPhase('fade'), 2000);
        return;
      }
      
      setMessageLines(prev => [...prev, UFO74_FINAL_MESSAGES[lineIndex]]);
      lineIndex++;
    }, 400);
    
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);
  
  // Phase 4: Fade and transition
  useEffect(() => {
    if (phase !== 'fade') return;
    
    const timer = setTimeout(() => {
      onCompleteAction();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [phase, onCompleteAction]);
  
  return (
    <div className={`${styles.container} ${phase === 'fade' ? styles.fadeOut : ''}`}>
      {/* Scanlines */}
      <div className={styles.scanlines} />
      
      {/* Glitch Phase */}
      {phase === 'glitch' && (
        <div className={styles.glitchContent}>
          <div className={styles.glitchText}>
            ▓▓▓ CONNECTION INTERRUPTED ▓▓▓
          </div>
          <div className={styles.glitchSubtext}>
            SYSTEM DETECTED UNAUTHORIZED ACCESS
          </div>
          <div className={styles.glitchSubtext}>
            INITIATING PURGE PROTOCOL...
          </div>
        </div>
      )}
      
      {/* Loading Phase */}
      {phase === 'loading' && (
        <div className={styles.loadingContent}>
          <div className={styles.loadingTitle}>
            CLEARING SYSTEM CACHE
          </div>
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${Math.min(100, loadProgress)}%` }}
              />
            </div>
            <div className={styles.progressText}>
              {Math.min(100, Math.floor(loadProgress))}%
            </div>
          </div>
          <div className={styles.loadingText}>
            {loadProgress < 30 && 'Removing session logs...'}
            {loadProgress >= 30 && loadProgress < 60 && 'Erasing access records...'}
            {loadProgress >= 60 && loadProgress < 90 && 'Destroying active connections...'}
            {loadProgress >= 90 && 'Finalizing purge...'}
          </div>
        </div>
      )}
      
      {/* Message Phase */}
      {phase === 'message' && (
        <div className={styles.messageContent}>
          <div className={styles.messageHeader}>
            ┌─────────────────────────────────────────────────────────┐
          </div>
          <div className={styles.messageHeader}>
            │ &gt;&gt; UFO74 &lt;&lt; EMERGENCY TRANSMISSION                    │
          </div>
          <div className={styles.messageHeader}>
            └─────────────────────────────────────────────────────────┘
          </div>
          <div className={styles.messageBody}>
            {messageLines.map((line, index) => (
              <div 
                key={index} 
                className={line.startsWith('UFO74:') ? styles.ufoLine : styles.systemLine}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Fade Phase */}
      {phase === 'fade' && (
        <div className={styles.fadeContent}>
          <div className={styles.transferText}>
            CONNECTING TO ICQ...
          </div>
        </div>
      )}
    </div>
  );
}
