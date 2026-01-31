'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './BadEnding.module.css';
import { recordEnding } from '../storage/statistics';

interface BadEndingProps {
  onRestartAction: () => void;
  reason?: string;
  commandCount?: number;
  detectionLevel?: number;
}

export default function BadEnding({
  onRestartAction,
  reason = 'DETECTION THRESHOLD EXCEEDED',
  commandCount = 0,
  detectionLevel = 100,
}: BadEndingProps) {
  const [phase, setPhase] = useState<'glitch' | 'lockdown' | 'message' | 'final'>('glitch');
  const [textLines, setTextLines] = useState<string[]>([]);
  const hasRecordedEnding = useRef(false);

  // Record the bad ending in statistics
  useEffect(() => {
    if (hasRecordedEnding.current) return;
    hasRecordedEnding.current = true;
    recordEnding('bad', commandCount, detectionLevel);
  }, [commandCount, detectionLevel]);

  const lockdownText = useMemo(
    () => [
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
    ],
    [reason]
  );

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
    let finalTimeout: ReturnType<typeof setTimeout> | null = null;

    const interval = setInterval(() => {
      if (lineIndex >= lockdownText.length) {
        clearInterval(interval);
        finalTimeout = setTimeout(() => setPhase('final'), 2000);
        return;
      }

      setTextLines(prev => [...prev, lockdownText[lineIndex]]);
      lineIndex++;
    }, 150);

    return () => {
      clearInterval(interval);
      if (finalTimeout) clearTimeout(finalTimeout);
    };
  }, [phase, lockdownText]);

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
                line.startsWith('╔') || line.startsWith('╚') || line.startsWith('║')
                  ? styles.boxLine
                  : line.startsWith('TERMINATION')
                    ? styles.errorLine
                    : line.startsWith('SYSTEM:')
                      ? styles.systemLine
                      : line.startsWith('>>')
                        ? styles.terminalLine
                        : line.startsWith('───')
                          ? styles.dividerLine
                          : styles.textLine
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
