'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useI18n } from '../../i18n';
import type { TextSpeed } from '../../types';
import styles from './OnboardingCards.module.css';

interface OnboardingCardsProps {
  textSpeed: TextSpeed;
  onComplete: () => void;
}

interface OnboardingCard {
  title: string;
  body: string;
}

const TYPING_DELAY_MS: Record<TextSpeed, number> = {
  slow: 14,
  normal: 8,
  fast: 4,
  instant: 0,
};

function getCardLength(card: OnboardingCard): number {
  return card.title.length + card.body.length;
}

export default function OnboardingCards({ textSpeed, onComplete }: OnboardingCardsProps) {
  const { t } = useI18n();
  const cards = useMemo<OnboardingCard[]>(
    () => [
      {
        title: t('onboarding.card1.title'),
        body: t('onboarding.card1.body'),
      },
      {
        title: t('onboarding.card2.title'),
        body: t('onboarding.card2.body'),
      },
      {
        title: t('onboarding.card3.title'),
        body: t('onboarding.card3.body'),
      },
      {
        title: t('onboarding.card4.title'),
        body: t('onboarding.card4.body'),
      },
      {
        title: t('onboarding.card5.title'),
        body: t('onboarding.card5.body'),
      },
    ],
    [t]
  );

  const [cardIndex, setCardIndex] = useState(0);
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
      advance();
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [advance]);

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={t('onboarding.aria')}>
      <div className={styles.scanlines} />
      <div className={styles.vignette} />

      <div className={styles.card}>
        <div className={styles.title}>{currentCard.title.slice(0, titleChars)}</div>
        <div className={styles.body}>{currentCard.body.slice(0, bodyChars)}</div>
      </div>

      <div className={styles.footer}>
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
