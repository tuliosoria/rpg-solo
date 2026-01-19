'use client';

import React, { useState, useEffect } from 'react';
import styles from './Victory.module.css';

interface VictoryProps {
  onRestartAction: () => void;
}

export default function Victory({ onRestartAction }: VictoryProps) {
  const [phase, setPhase] = useState<'intro' | 'message' | 'credits'>('intro');
  const [textLines, setTextLines] = useState<string[]>([]);
  
  const VICTORY_TEXT = [
    '═══════════════════════════════════════════════════════════',
    '',
    'MISSION COMPLETE',
    '',
    '═══════════════════════════════════════════════════════════',
    '',
    'The evidence of the Varginha Incident has been preserved.',
    '',
    'A curious teenager saved the files to a floppy disk,',
    'hidden in his room somewhere in Brazil.',
    '',
    'The governments tried to erase everything.',
    'The system was purged.',
    'The connections were severed.',
    '',
    'But the truth survived.',
    '',
    'Perhaps one day, when it is safe,',
    'these files will come to light.',
    '',
    'Until then, they wait.',
    '',
    '═══════════════════════════════════════════════════════════',
    '',
    'UFO74: you did it, hackerkid.',
    'UFO74: i need to disappear now. they are close.',
    'UFO74: but it was worth it.',
    '',
    'UFO74: take care. and remember...',
    'UFO74: the truth is out there.',
    '',
    '>> END OF TRANSMISSION <<',
  ];
  
  // Intro phase
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('message');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  
  // Show text lines
  useEffect(() => {
    if (phase !== 'message') return;
    
    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex >= VICTORY_TEXT.length) {
        clearInterval(interval);
        setTimeout(() => setPhase('credits'), 2000);
        return;
      }
      
      setTextLines(prev => [...prev, VICTORY_TEXT[lineIndex]]);
      lineIndex++;
    }, 300);
    
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);
  
  return (
    <div className={styles.container}>
      <div className={styles.scanlines} />
      
      {phase === 'intro' && (
        <div className={styles.introContent}>
          <div className={styles.introTitle}>🌟</div>
        </div>
      )}
      
      {(phase === 'message' || phase === 'credits') && (
        <div className={styles.messageContent}>
          {textLines.map((line, index) => (
            <div 
              key={index} 
              className={
                line.startsWith('═') ? styles.divider :
                line.startsWith('UFO74:') ? styles.ufoLine :
                line.startsWith('>>') ? styles.systemLine :
                line === 'MISSION COMPLETE' ? styles.title :
                styles.textLine
              }
            >
              {line}
            </div>
          ))}
        </div>
      )}
      
      {phase === 'credits' && (
        <div className={styles.credits}>
          <button 
            className={styles.restartButton}
            onClick={onRestartAction}
          >
            [ PLAY AGAIN ]
          </button>
          <div className={styles.creditText}>
            VARGINHA: TERMINAL 1996
          </div>
        </div>
      )}
    </div>
  );
}
