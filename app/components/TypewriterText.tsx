'use client';

import React, { useState, useEffect, useRef, memo } from 'react';
import styles from './Terminal.module.css';

interface TypewriterTextProps {
  /** Full text to animate character by character */
  text: string;
  /** Base delay in ms per character (default 30) */
  speed?: number;
  /** Called when all characters have been revealed */
  onComplete: () => void;
  /** Called on each character tick — useful for auto-scrolling */
  onTick?: () => void;
  /** Render function that receives the visible portion of text and returns styled React nodes */
  renderContent: (partialText: string) => React.ReactNode;
}

/**
 * Renders text character-by-character with a blinking cursor.
 * Used for UFO74 dialogue to create suspense and tension.
 *
 * Punctuation gets extra pauses for dramatic effect:
 *  - Period/exclamation/question: +100ms
 *  - Comma/semicolon/colon: +50ms
 *  - Ellipsis dots (consecutive): +60ms each
 */
function TypewriterTextComponent({
  text,
  speed = 30,
  onComplete,
  onTick,
  renderContent,
}: TypewriterTextProps) {
  const [visibleChars, setVisibleChars] = useState(0);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const onTickRef = useRef(onTick);

  // Keep refs up to date without causing re-renders
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  // Mark completed when all chars are visible
  useEffect(() => {
    if (visibleChars >= text.length && !completedRef.current) {
      completedRef.current = true;
      onCompleteRef.current();
    }
  }, [visibleChars, text.length]);

  // Character-by-character timer
  useEffect(() => {
    if (completedRef.current || visibleChars >= text.length) return;

    const currentChar = text[visibleChars];

    // Calculate delay with natural variance
    let delay = speed + (Math.random() * 20 - 10);

    // Dramatic pauses on punctuation
    if (currentChar === '.' || currentChar === '!' || currentChar === '?') {
      delay += 100;
    } else if (currentChar === ',' || currentChar === ';' || currentChar === ':') {
      delay += 50;
    } else if (currentChar === '…') {
      delay += 60;
    }

    const timer = setTimeout(() => {
      setVisibleChars(prev => prev + 1);
      onTickRef.current?.();
    }, delay);

    return () => clearTimeout(timer);
  }, [visibleChars, text, speed]);

  const visibleText = text.substring(0, visibleChars);
  const isTyping = visibleChars < text.length;

  return (
    <>
      {renderContent(visibleText)}
      {isTyping && <span className={styles.typewriterCursor}>▌</span>}
    </>
  );
}

// Wrap with memo to prevent unnecessary re-renders
const TypewriterText = memo(TypewriterTextComponent);
export default TypewriterText;

/**
 * Skip the typewriter animation — instantly reveal all text.
 * Call this externally by passing a new `text` prop with full content
 * (the component detects length >= text.length and completes).
 */
export function isTypableUfo74Content(content: string): boolean {
  if (!content || content.trim().length === 0) return false;
  // Box-drawing borders should render instantly
  if (/^[┌│└─]/.test(content)) return false;
  return true;
}
