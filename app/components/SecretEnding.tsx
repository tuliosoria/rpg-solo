'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './SecretEnding.module.css';
import { recordEnding } from '../storage/statistics';

interface SecretEndingProps {
  onRestartAction: () => void;
  commandCount?: number;
  detectionLevel?: number;
}

export default function SecretEnding({ onRestartAction, commandCount = 0, detectionLevel = 100 }: SecretEndingProps) {
  const [phase, setPhase] = useState<'static' | 'reveal' | 'message' | 'final'>('static');
  const [textLines, setTextLines] = useState<string[]>([]);
  const hasRecordedEnding = useRef(false);
  
  // Record the secret ending in statistics
  useEffect(() => {
    if (hasRecordedEnding.current) return;
    hasRecordedEnding.current = true;
    recordEnding('secret', commandCount, detectionLevel);
  }, [commandCount, detectionLevel]);
  
  const SECRET_TEXT = [
    '═══════════════════════════════════════════════════════════',
    '',
    'THE WHOLE TRUTH',
    '',
    '═══════════════════════════════════════════════════════════',
    '',
    'You found it. The file I never wanted you to see.',
    '',
    'My name is not UFO74.',
    '',
    '───────────────────────────────────────────────────────────',
    '',
    'In January 1996, I was a young military analyst.',
    'Stationed at Base Aérea de Guarulhos.',
    'I was 23 years old.',
    '',
    'When the call came about Varginha, I was one of the first',
    'to process the initial reports. I saw the photographs.',
    'I read the field notes. I watched the videos.',
    '',
    'And I saw what they did to the witnesses.',
    '',
    '───────────────────────────────────────────────────────────',
    '',
    'Sergeant Marco Cherese. Officer João Marcos.',
    'Hospital workers who asked questions.',
    'Journalists who got too close.',
    '',
    'Some were silenced. Some were discredited.',
    'Some simply... disappeared.',
    '',
    '───────────────────────────────────────────────────────────',
    '',
    'I spent the next 30 years building this system.',
    'Waiting for someone brave enough to find the truth.',
    'Waiting for someone like you.',
    '',
    'The evidence you saved is real.',
    'But now you know something more.',
    '',
    'You know that I was there.',
    'I saw them. The beings. Alive.',
    '',
    'And I have never been the same.',
    '',
    '───────────────────────────────────────────────────────────',
    '',
    'My real name is Carlos Eduardo Ferreira.',
    'Former 2nd Lieutenant, Brazilian Air Force.',
    'Whistleblower. Survivor. Ghost in the machine.',
    '',
    'Thank you for listening.',
    'Thank you for believing.',
    '',
    'The truth needed a witness.',
    'Now it has two.',
    '',
    '═══════════════════════════════════════════════════════════',
    '',
    '>> THE COMPLETE TRUTH HAS BEEN REVEALED <<',
  ];
  
  // Static phase
  useEffect(() => {
    const timer = setTimeout(() => setPhase('reveal'), 2500);
    return () => clearTimeout(timer);
  }, []);
  
  // Reveal phase
  useEffect(() => {
    if (phase !== 'reveal') return;
    const timer = setTimeout(() => setPhase('message'), 2000);
    return () => clearTimeout(timer);
  }, [phase]);
  
  // Message phase - type out text
  useEffect(() => {
    if (phase !== 'message') return;
    
    let lineIndex = 0;
    let finalTimeout: NodeJS.Timeout | undefined;
    
    const interval = setInterval(() => {
      if (lineIndex >= SECRET_TEXT.length) {
        clearInterval(interval);
        finalTimeout = setTimeout(() => setPhase('final'), 2000);
        return;
      }
      
      setTextLines(prev => [...prev, SECRET_TEXT[lineIndex]]);
      lineIndex++;
    }, 250);
    
    return () => {
      clearInterval(interval);
      if (finalTimeout) clearTimeout(finalTimeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);
  
  return (
    <div className={styles.container}>
      <div className={styles.scanlines} />
      
      {phase === 'static' && (
        <div className={styles.staticContent}>
          <div className={styles.staticNoise} />
          <div className={styles.staticText}>DECRYPTING CLASSIFIED FILE...</div>
        </div>
      )}
      
      {phase === 'reveal' && (
        <div className={styles.revealContent}>
          <div className={styles.revealIcon}>👁️</div>
          <div className={styles.revealText}>IDENTITY CONFIRMED</div>
          <div className={styles.revealSub}>UFO74 = C.E.F.</div>
        </div>
      )}
      
      {(phase === 'message' || phase === 'final') && (
        <div className={styles.messageContent}>
          {textLines.map((line, index) => (
            <div 
              key={index}
              className={
                line.startsWith('═') ? styles.dividerBold :
                line === 'THE WHOLE TRUTH' ? styles.title :
                line.startsWith('My name') || line.startsWith('My real name') ? styles.revealLine :
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
          <div className={styles.secretBadge}>🏆 SECRET ENDING UNLOCKED</div>
          <button 
            className={styles.restartButton}
            onClick={onRestartAction}
            aria-label="Return to menu - restart game"
          >
            [ RETURN TO MENU ]
          </button>
        </div>
      )}
    </div>
  );
}
