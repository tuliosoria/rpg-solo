'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './NeutralEnding.module.css';
import { recordEnding } from '../storage/statistics';
import { useI18n } from '../i18n';
import type { TextSpeed } from '../types';
import { scaleTextSpeedDelay } from './textSpeed';

interface NeutralEndingProps {
  onRestartAction: () => void;
  commandCount?: number;
  detectionLevel?: number;
  textSpeed?: TextSpeed;
}

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

export default function NeutralEnding({
  onRestartAction,
  commandCount = 0,
  detectionLevel = 50,
  textSpeed = 'normal',
}: NeutralEndingProps) {
  const { t, translateRuntimeText } = useI18n();
  const [phase, setPhase] = useState<'disconnect' | 'message' | 'final'>('disconnect');
  const [textLines, setTextLines] = useState<string[]>([]);
  const hasRecordedEnding = useRef(false);
  const restartButtonRef = useRef<HTMLButtonElement>(null);

  // Record the neutral ending in statistics
  useEffect(() => {
    if (hasRecordedEnding.current) return;
    hasRecordedEnding.current = true;
    recordEnding('neutral', commandCount, detectionLevel);
  }, [commandCount, detectionLevel]);

  // Disconnect phase
  useEffect(() => {
    const timer = setTimeout(() => setPhase('message'), scaleTextSpeedDelay(2000, textSpeed));
    return () => clearTimeout(timer);
  }, [textSpeed]);

  // Message phase - type out text
  useEffect(() => {
    if (phase !== 'message') return;

    let lineIndex = 0;
    let finalTimeout: ReturnType<typeof setTimeout> | null = null;

    const interval = setInterval(() => {
      if (lineIndex >= NEUTRAL_TEXT.length) {
        clearInterval(interval);
        finalTimeout = setTimeout(() => setPhase('final'), scaleTextSpeedDelay(2000, textSpeed));
        return;
      }

      const nextLine = NEUTRAL_TEXT[lineIndex];
      if (typeof nextLine === 'string') {
        setTextLines(prev => [...prev, nextLine]);
      }
      lineIndex++;
    }, scaleTextSpeedDelay(200, textSpeed));

    return () => {
      clearInterval(interval);
      if (finalTimeout) clearTimeout(finalTimeout);
    };
  }, [phase, textSpeed]);

  useEffect(() => {
    if (phase === 'final') {
      restartButtonRef.current?.focus();
    }
  }, [phase]);

  return (
    <div
      className={styles.container}
      role="dialog"
      aria-modal="true"
      aria-label={translateRuntimeText('CONNECTION SEVERED')}
    >
      <div className={styles.scanlines} />

      {phase === 'disconnect' && (
        <div className={styles.disconnectContent}>
          <div className={styles.disconnectIcon}>⚡</div>
          <div className={styles.disconnectText}>{translateRuntimeText('EMERGENCY DISCONNECT')}</div>
          <div className={styles.disconnectSub}>{translateRuntimeText('Purging session data...')}</div>
        </div>
      )}

      {(phase === 'message' || phase === 'final') && (
        <div className={styles.messageContent} role="status" aria-live="polite">
          {textLines.map((line, index) => (
            <div
              key={index}
              className={
                line.startsWith('═')
                  ? styles.dividerBold
                  : line === 'CONNECTION SEVERED'
                    ? styles.title
                    : line.startsWith('UFO74:')
                      ? styles.ufoLine
                      : line.startsWith('>>')
                        ? styles.endLine
                        : line.startsWith('───')
                          ? styles.dividerLine
                          : styles.textLine
              }
            >
              {translateRuntimeText(line)}
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
