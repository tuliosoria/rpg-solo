'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../../i18n';
import type { TextSpeed } from '../../types';
import StaticNoise from '../StaticNoise';
import styles from './OnboardingCards.module.css';

interface OnboardingCardsProps {
  textSpeed: TextSpeed;
  onComplete: () => void;
  onSkip: () => void;
  onCardLoad: () => void;
}

interface OnboardingCard {
  title: string;
  bodySegments: OnboardingBodySegment[];
}

interface OnboardingBodySegment {
  text: string;
  isCommand: boolean;
}

const TYPING_DELAY_MS: Record<TextSpeed, number> = {
  slow: 14,
  normal: 8,
  fast: 4,
  instant: 0,
};

function parseBodySegments(body: string): OnboardingBodySegment[] {
  const segments: OnboardingBodySegment[] = [];
  const markerPattern = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;

  for (const match of body.matchAll(markerPattern)) {
    const [fullMatch, commandText] = match;
    const matchIndex = match.index ?? 0;

    if (matchIndex > lastIndex) {
      segments.push({
        text: body.slice(lastIndex, matchIndex),
        isCommand: false,
      });
    }

    segments.push({
      text: commandText,
      isCommand: true,
    });

    lastIndex = matchIndex + fullMatch.length;
  }

  if (lastIndex < body.length) {
    segments.push({
      text: body.slice(lastIndex),
      isCommand: false,
    });
  }

  return segments;
}

function getBodyLength(segments: OnboardingBodySegment[]): number {
  return segments.reduce((total, segment) => total + segment.text.length, 0);
}

function getCardLength(card: OnboardingCard): number {
  return card.title.length + getBodyLength(card.bodySegments);
}

function renderVisibleBody(
  segments: OnboardingBodySegment[],
  visibleChars: number
): React.ReactNode[] {
  let remainingChars = visibleChars;

  return segments.flatMap((segment, index) => {
    if (remainingChars <= 0) {
      return [];
    }

    const visibleText = segment.text.slice(0, remainingChars);
    remainingChars -= visibleText.length;

    if (!visibleText) {
      return [];
    }

    if (segment.isCommand) {
      return (
        <strong key={`command-${index}`} className={styles.command}>
          {visibleText}
        </strong>
      );
    }

    return <React.Fragment key={`text-${index}`}>{visibleText}</React.Fragment>;
  });
}

export default function OnboardingCards({
  textSpeed,
  onComplete,
  onSkip,
  onCardLoad,
}: OnboardingCardsProps) {
  const { t } = useI18n();
  const cards = useMemo<OnboardingCard[]>(
    () => [
      {
        title: t('onboarding.card1.title'),
         bodySegments: parseBodySegments(t('onboarding.card1.body')),
       },
       {
         title: t('onboarding.card2.title'),
         bodySegments: parseBodySegments(t('onboarding.card2.body')),
       },
       {
         title: t('onboarding.card3.title'),
         bodySegments: parseBodySegments(t('onboarding.card3.body')),
       },
       {
         title: t('onboarding.card4.title'),
         bodySegments: parseBodySegments(t('onboarding.card4.body')),
       },
       {
         title: t('onboarding.card5.title'),
         bodySegments: parseBodySegments(t('onboarding.card5.body')),
       },
    ],
    [t]
  );

  const [cardIndex, setCardIndex] = useState(0);
  const lastSoundCardIndexRef = useRef<number | null>(null);
  const [visibleChars, setVisibleChars] = useState(() =>
    textSpeed === 'instant' ? getCardLength(cards[0]) : 0
  );

  const currentCard = cards[cardIndex];
  const totalChars = getCardLength(currentCard);
  const titleChars = Math.min(visibleChars, currentCard.title.length);
  const bodyChars = Math.max(0, visibleChars - currentCard.title.length);
  const isFullyRevealed = visibleChars >= totalChars;
  const promptKey =
    cardIndex === cards.length - 1 ? 'onboarding.prompt.connect' : 'onboarding.prompt.continue';

  useEffect(() => {
    setVisibleChars(textSpeed === 'instant' ? totalChars : 0);
  }, [cardIndex, textSpeed, totalChars]);

  useEffect(() => {
    if (lastSoundCardIndexRef.current === cardIndex) return;
    lastSoundCardIndexRef.current = cardIndex;
    onCardLoad();
  }, [cardIndex, onCardLoad]);

  useEffect(() => {
    if (textSpeed === 'instant' || isFullyRevealed) return;

    const timeoutId = window.setTimeout(() => {
      setVisibleChars(value => Math.min(value + 1, totalChars));
    }, TYPING_DELAY_MS[textSpeed]);

    return () => window.clearTimeout(timeoutId);
  }, [isFullyRevealed, textSpeed, totalChars, visibleChars]);

  const advance = useCallback(() => {
    if (!isFullyRevealed) {
      setVisibleChars(totalChars);
      return;
    }

    if (cardIndex === cards.length - 1) {
      onComplete();
      return;
    }

    const nextIndex = cardIndex + 1;
    setCardIndex(nextIndex);
    setVisibleChars(textSpeed === 'instant' ? getCardLength(cards[nextIndex]) : 0);
  }, [cardIndex, cards, isFullyRevealed, onComplete, textSpeed, totalChars]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (event.key === 'Escape') {
        onSkip();
        return;
      }

      advance();
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [advance, onSkip]);

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={t('onboarding.aria')}>
      <div className={styles.scanlines} />
      <div className={styles.noiseLayer}>
        <StaticNoise intensity={0.2} alienVisible={false} />
      </div>
      <div className={styles.noiseDrift} />
      <div className={styles.interferenceBand} />
      <div className={styles.vignette} />

      <div className={styles.card}>
        <div className={styles.title}>{currentCard.title.slice(0, titleChars)}</div>
        <div className={styles.body}>{renderVisibleBody(currentCard.bodySegments, bodyChars)}</div>
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.skipPrompt}
          onMouseDown={event => event.preventDefault()}
          onClick={onSkip}
        >
          {t('onboarding.prompt.skip')}
        </button>

        {isFullyRevealed ? (
          <button
            type="button"
            className={styles.prompt}
            onMouseDown={event => event.preventDefault()}
            onClick={advance}
          >
            <span>{t(promptKey)}</span>
            <span className={styles.cursor}>█</span>
          </button>
        ) : (
          <div className={styles.typing}>
            <span className={styles.cursor}>█</span>
          </div>
        )}
      </div>
    </div>
  );
}
