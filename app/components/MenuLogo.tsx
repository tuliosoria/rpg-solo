'use client';

import React, { useMemo } from 'react';
import { useI18n } from '../i18n';
import styles from './MenuLogo.module.css';

const DIVIDER = '═══════════════════════════════════';

const LINE_BASE_DELAY_MS = 250;
const LINE_STAGGER_MS = 380;
const CHAR_STAGGER_MS = 28;
const CHAR_JITTER_MS = 90;

interface FlickerLineProps {
  text: string;
  className: string;
  startDelayMs: number;
  perChar?: boolean;
}

/**
 * Renders a line of text where each character flickers in with a small
 * randomized delay, mimicking a CRT terminal slowly painting text.
 */
function FlickerLine({ text, className, startDelayMs, perChar = true }: FlickerLineProps) {
  const chars = useMemo(() => {
    if (!perChar) {
      return null;
    }
    return Array.from(text).map((ch, idx) => {
      const jitter = Math.random() * CHAR_JITTER_MS;
      const delay = startDelayMs + idx * CHAR_STAGGER_MS + jitter;
      const isSpace = ch === ' ';
      return (
        <span
          key={`${idx}-${ch}`}
          className={`${styles.char} ${isSpace ? styles.space : ''}`}
          style={{ animationDelay: `${delay.toFixed(0)}ms` }}
          aria-hidden="true"
        >
          {isSpace ? '\u00A0' : ch}
        </span>
      );
    });
  }, [text, startDelayMs, perChar]);

  if (!perChar) {
    return (
      <div
        className={className}
        style={{ animationDelay: `${startDelayMs}ms` }}
      >
        {text}
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{ animationDelay: `${startDelayMs}ms`, opacity: 1 }}
    >
      <span className={styles.srOnly}>{text}</span>
      <span aria-hidden="true">{chars}</span>
    </div>
  );
}

export default function MenuLogo() {
  const { t } = useI18n();

  const titleText = 'VARGINHA';
  const subtitleText = 'TERMINAL 1996';
  const tagline = t('menu.credits.settingValue') || 'Brazilian Intelligence Legacy System, 1996';

  // Schedule lines so they appear with a slight delay between them, like
  // a 1990s terminal painting boot output.
  const dividerTopDelay = LINE_BASE_DELAY_MS;
  const titleDelay = dividerTopDelay + LINE_STAGGER_MS;
  const subtitleDelay = titleDelay + LINE_STAGGER_MS;
  const taglineDelay = subtitleDelay + LINE_STAGGER_MS;
  const dividerBottomDelay = taglineDelay + LINE_STAGGER_MS;

  return (
    <div className={styles.logoFrame} role="banner" aria-label={`${titleText} ${subtitleText}`}>
      <FlickerLine
        text={DIVIDER}
        className={`${styles.line} ${styles.divider}`}
        startDelayMs={dividerTopDelay}
        perChar={false}
      />
      <FlickerLine
        text={titleText.toUpperCase()}
        className={`${styles.line} ${styles.title}`}
        startDelayMs={titleDelay}
      />
      <FlickerLine
        text={subtitleText}
        className={`${styles.line} ${styles.subtitle}`}
        startDelayMs={subtitleDelay}
      />
      <FlickerLine
        text={tagline}
        className={`${styles.line} ${styles.tagline}`}
        startDelayMs={taglineDelay}
      />
      <FlickerLine
        text={DIVIDER}
        className={`${styles.line} ${styles.divider}`}
        startDelayMs={dividerBottomDelay}
        perChar={false}
      />
    </div>
  );
}
