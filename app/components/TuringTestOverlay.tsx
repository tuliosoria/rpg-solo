'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import styles from './TuringTestOverlay.module.css';
import { TURING_QUESTIONS } from '../constants/turing';
import { uiChance, uiRandomInt } from '../engine/rng';

interface TuringTestOverlayProps {
  onComplete: (passed: boolean) => void;
  onCorrectAnswer?: () => void;
}

export default function TuringTestOverlay({ onComplete, onCorrectAnswer }: TuringTestOverlayProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [flickering, setFlickering] = useState(true);

  const currentQuestion = TURING_QUESTIONS[questionIndex];

  // Initial flicker effect
  useEffect(() => {
    const timer = setTimeout(() => setFlickering(false), 200);
    return () => clearTimeout(timer);
  }, []);

  // Random screen flicker
  useEffect(() => {
    const interval = setInterval(() => {
      if (uiChance(0.1)) {
        setFlickering(true);
        setTimeout(() => setFlickering(false), 50 + uiRandomInt(0, 100));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Handle option selection
  const handleSelect = useCallback(
    (letter: string) => {
      if (showFeedback || showResult) return;

      setSelectedOption(letter);
      const option = currentQuestion.options.find(o => o.letter === letter);

      if (option?.isMachine) {
        setCorrectAnswers(prev => prev + 1);
        onCorrectAnswer?.();
      }

      setShowFeedback(true);

      // Move to next question or show result
      setTimeout(() => {
        if (questionIndex < TURING_QUESTIONS.length - 1) {
          setQuestionIndex(prev => prev + 1);
          setSelectedOption(null);
          setShowFeedback(false);
        } else {
          setShowResult(true);
        }
      }, 1500);
    },
    [questionIndex, currentQuestion, showFeedback, showResult, onCorrectAnswer]
  );

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showResult) {
        if (e.key === 'Enter' || e.key === ' ') {
          // Need all 3 correct to pass
          onComplete(correctAnswers === 3);
        }
        return;
      }

      if (showFeedback) return;

      const key = e.key.toUpperCase();
      if (key === 'A' || key === 'B' || key === 'C' || key === '1' || key === '2' || key === '3') {
        const letter = key === '1' ? 'A' : key === '2' ? 'B' : key === '3' ? 'C' : key;
        handleSelect(letter);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSelect, showFeedback, showResult, onComplete, correctAnswers]);

  // Result screen
  if (showResult) {
    const passed = correctAnswers === 3;
    return (
      <div className={`${styles.overlay} ${flickering ? styles.flickering : ''}`}>
        <div className={styles.scanlines} />
        <div className={styles.glow} />

        <div className={styles.container}>
          {/* Turing Test Image */}
          <div className={styles.imageContainer}>
            <Image
              src="/images/turing-test.png"
              alt="Turing Evaluation Result"
              width={150}
              height={150}
              className={styles.turingImage}
              priority
            />
          </div>

          <div className={styles.resultBox}>
            <div className={styles.resultHeader}>
              {passed ? '[ VERIFICATION COMPLETE ]' : '[ VERIFICATION FAILED ]'}
            </div>

            <div className={styles.resultScore}>MACHINE RESPONSES: {correctAnswers}/3</div>

            <div className={passed ? styles.resultPass : styles.resultFail}>
              {passed
                ? 'SUBJECT IS NOT HUMAN, NOT A THREAT'
                : 'IDENTITY REJECTED: HUMAN BEHAVIORAL PATTERNS DETECTED'}
            </div>

            <div className={styles.resultPrompt}>↵</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.overlay} ${flickering ? styles.flickering : ''}`}>
      <div className={styles.scanlines} />
      <div className={styles.glow} />

      <div className={styles.container}>
        {/* Turing Test Image */}
        <div className={styles.imageContainer}>
          <Image
            src="/images/turing-test.png"
            alt="Turing Evaluation Protocol"
            width={200}
            height={200}
            className={styles.turingImage}
            priority
          />
        </div>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLine}>===============================================</div>
          <div className={styles.headerTitle}>SECURITY PROTOCOL: TURING EVALUATION</div>
          <div className={styles.headerLine}>===============================================</div>
        </div>

        {/* Instructions */}
        <div className={styles.instructions}>
          <div>NOTICE: Anomalous access pattern detected.</div>
          <div>You must prove you are an AUTHORIZED TERMINAL PROCESS.</div>
          <div className={styles.instructionHighlight}>
            Select the MACHINE response (cold, logical) to pass.
          </div>
        </div>

        {/* Progress */}
        <div className={styles.progress}>
          QUESTION {questionIndex + 1} of {TURING_QUESTIONS.length}
        </div>

        {/* Question Box */}
        <div className={styles.questionBox}>
          <div className={styles.questionPrompt}>"{currentQuestion.prompt}"</div>

          <div className={styles.options}>
            {currentQuestion.options.map(option => {
              const isSelected = selectedOption === option.letter;
              const showCorrect = showFeedback && option.isMachine;
              const showWrong = showFeedback && isSelected && !option.isMachine;

              return (
                <div
                  key={option.letter}
                  className={`${styles.option} 
                    ${isSelected ? styles.optionSelected : ''} 
                    ${showCorrect ? styles.optionCorrect : ''} 
                    ${showWrong ? styles.optionWrong : ''}`}
                  onClick={() => handleSelect(option.letter)}
                >
                  <span className={styles.optionLetter}>{option.letter}.</span>
                  <span className={styles.optionText}>{option.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={styles.feedback}>
            {currentQuestion.options.find(o => o.letter === selectedOption)?.isMachine
              ? '[ ACCEPTABLE RESPONSE ]'
              : '[ HUMAN PATTERN DETECTED ]'}
          </div>
        )}

        {/* Footer */}
        <div className={styles.footer}>Type A, B, or C to respond</div>
      </div>
    </div>
  );
}
