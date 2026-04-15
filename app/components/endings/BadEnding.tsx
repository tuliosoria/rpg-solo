'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './BadEnding.module.css';
import { recordEnding } from '../../storage/statistics';
import { useI18n } from '../../i18n';
import type { TextSpeed } from '../../types';
import { scaleTextSpeedDelay } from '../textSpeed';

interface BadEndingProps {
  onRestartAction: () => void;
  reason?: string;
  commandCount?: number;
  detectionLevel?: number;
  textSpeed?: TextSpeed;
}

export default function BadEnding({
  onRestartAction,
  reason = 'DETECTION THRESHOLD EXCEEDED',
  commandCount = 0,
  detectionLevel = 100,
  textSpeed = 'normal',
}: BadEndingProps) {
  const { t, translateRuntimeText } = useI18n();
  const [phase, setPhase] = useState<'glitch' | 'lockdown' | 'message' | 'final'>('glitch');
  const [textLines, setTextLines] = useState<string[]>([]);
  const hasRecordedEnding = useRef(false);
  const restartButtonRef = useRef<HTMLButtonElement>(null);

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
      `TERMINATION_REASON: ${reason}`,
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
    const timer = setTimeout(() => setPhase('lockdown'), scaleTextSpeedDelay(2000, textSpeed));
    return () => clearTimeout(timer);
  }, [textSpeed]);

  // Lockdown phase
  useEffect(() => {
    if (phase !== 'lockdown') return;
    const timer = setTimeout(() => setPhase('message'), scaleTextSpeedDelay(1500, textSpeed));
    return () => clearTimeout(timer);
  }, [phase, textSpeed]);

  // Message phase - type out text
  useEffect(() => {
    if (phase !== 'message') return;

    let lineIndex = 0;
    let finalTimeout: ReturnType<typeof setTimeout> | null = null;

    const interval = setInterval(() => {
      if (lineIndex >= lockdownText.length) {
        clearInterval(interval);
        finalTimeout = setTimeout(() => setPhase('final'), scaleTextSpeedDelay(2000, textSpeed));
        return;
      }

      const nextLine = lockdownText[lineIndex];
      if (typeof nextLine === 'string') {
        setTextLines(prev => [...prev, nextLine]);
      }
      lineIndex++;
    }, scaleTextSpeedDelay(150, textSpeed));

    return () => {
      clearInterval(interval);
      if (finalTimeout) clearTimeout(finalTimeout);
    };
  }, [phase, lockdownText, textSpeed]);

  useEffect(() => {
    if (phase === 'final') {
      restartButtonRef.current?.focus();
    }
  }, [phase]);

  return (
    <div
      className={`${styles.container} ${phase === 'glitch' ? styles.glitching : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={translateRuntimeText('SECURITY LOCKDOWN')}
    >
      <div className={styles.scanlines} />

      {phase === 'glitch' && (
        <div className={styles.glitchContent}>
          <div className={styles.glitchText}>{translateRuntimeText('CONNECTION LOST')}</div>
        </div>
      )}

      {phase === 'lockdown' && (
        <div className={styles.lockdownContent}>
          <div className={styles.lockdownIcon}>🔒</div>
          <div className={styles.lockdownText}>{translateRuntimeText('SECURITY LOCKDOWN')}</div>
        </div>
      )}

      {(phase === 'message' || phase === 'final') && (
        <div className={styles.messageContent} role="status" aria-live="polite">
          {textLines.map((line, index) => (
            <div
              key={index}
              className={
                line.startsWith('╔') || line.startsWith('╚') || line.startsWith('║')
                  ? styles.boxLine
                  : line.startsWith('TERMINATION_REASON:')
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
              {line.startsWith('TERMINATION_REASON:')
                ? `${translateRuntimeText('TERMINATION REASON:')} ${translateRuntimeText(line.slice('TERMINATION_REASON: '.length))}`
                : translateRuntimeText(line)}
            </div>
          ))}
        </div>
      )}

      {phase === 'final' && (
        <div className={styles.restartSection}>
          <button
            ref={restartButtonRef}
            className={styles.restartButton}
            onClick={onRestartAction}
            aria-label={translateRuntimeText('Try again - restart game')}
          >
            {t('ending.tryAgain')}
          </button>
        </div>
      )}
    </div>
  );
}
