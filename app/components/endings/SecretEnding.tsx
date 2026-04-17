'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './SecretEnding.module.css';
import { recordEnding } from '../../storage/statistics';
import { useI18n } from '../../i18n';
import type { TextSpeed } from '../../types';
import { scaleTextSpeedDelay } from '../textSpeed';

interface SecretEndingProps {
  onDismissAction: () => void;
  commandCount?: number;
  detectionLevel?: number;
  textSpeed?: TextSpeed;
}

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
  'In January 1996, I was a military intelligence analyst.',
  'Stationed at Base Aérea de Guarulhos.',
  '',
  'When the call came about Varginha, I was one of the first',
  'to process the initial reports. I saw the photographs.',
  'I read the field notes. I watched the videos.',
  '',
  'And I saw what they did to the witnesses.',
  '',
  '───────────────────────────────────────────────────────────',
  '',
  'Sergeant Marco Duarte. Officer João Marcos.',
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

export default function SecretEnding({
  onDismissAction,
  commandCount = 0,
  detectionLevel = 100,
  textSpeed = 'normal',
}: SecretEndingProps) {
  const { t, translateRuntimeText } = useI18n();
  const [phase, setPhase] = useState<'static' | 'reveal' | 'message' | 'final'>('static');
  const [textLines, setTextLines] = useState<string[]>([]);
  const hasRecordedEnding = useRef(false);
  const restartButtonRef = useRef<HTMLButtonElement>(null);

  // Record the secret ending in statistics
  useEffect(() => {
    if (hasRecordedEnding.current) return;
    hasRecordedEnding.current = true;
    recordEnding('secret', commandCount, detectionLevel);
  }, [commandCount, detectionLevel]);

  // Static phase
  useEffect(() => {
    const timer = setTimeout(() => setPhase('reveal'), scaleTextSpeedDelay(2500, textSpeed));
    return () => clearTimeout(timer);
  }, [textSpeed]);

  // Reveal phase
  useEffect(() => {
    if (phase !== 'reveal') return;
    const timer = setTimeout(() => setPhase('message'), scaleTextSpeedDelay(2000, textSpeed));
    return () => clearTimeout(timer);
  }, [phase, textSpeed]);

  // Message phase - type out text
  useEffect(() => {
    if (phase !== 'message') return;

    let lineIndex = 0;
    let finalTimeout: ReturnType<typeof setTimeout> | null = null;

    const interval = setInterval(() => {
      if (lineIndex >= SECRET_TEXT.length) {
        clearInterval(interval);
        finalTimeout = setTimeout(() => setPhase('final'), scaleTextSpeedDelay(2000, textSpeed));
        return;
      }

      const nextLine = SECRET_TEXT[lineIndex];
      if (typeof nextLine === 'string') {
        setTextLines(prev => [...prev, nextLine]);
      }
      lineIndex++;
    }, scaleTextSpeedDelay(250, textSpeed));

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
      aria-label={translateRuntimeText('THE WHOLE TRUTH')}
    >
      <div className={styles.scanlines} />

      {phase === 'static' && (
        <div className={styles.staticContent}>
          <div className={styles.staticNoise} />
          <div className={styles.staticText}>{translateRuntimeText('DECRYPTING CLASSIFIED FILE...')}</div>
        </div>
      )}

      {phase === 'reveal' && (
        <div className={styles.revealContent}>
          <div className={styles.revealIcon}>👁️</div>
          <div className={styles.revealText}>{translateRuntimeText('IDENTITY CONFIRMED')}</div>
          <div className={styles.revealSub}>UFO74 = C.E.F.</div>
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
                  : line === 'THE WHOLE TRUTH'
                    ? styles.title
                    : line.startsWith('My name') || line.startsWith('My real name')
                      ? styles.revealLine
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
          <div className={styles.secretBadge}>{t('ending.secretUnlocked')}</div>
          <button
            ref={restartButtonRef}
            className={styles.restartButton}
            onClick={onDismissAction}
            aria-label={translateRuntimeText('Return to terminal')}
          >
            {t('ending.returnToTerminal')}
          </button>
        </div>
      )}
    </div>
  );
}
