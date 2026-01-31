'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './Victory.module.css';
import { unlockAchievement, Achievement } from '../engine/achievements';
import { recordEnding } from '../storage/statistics';
import AchievementPopup from './AchievementPopup';

interface VictoryProps {
  onRestartAction: () => void;
  commandCount?: number;
  detectionLevel?: number;
  maxDetectionReached?: number;
  mathMistakes?: number;
  evidenceLinks?: Array<[string, string]>;
  wrongAttempts?: number;
  choiceLeakPath?: 'public' | 'covert';
  rivalInvestigatorActive?: boolean;
  filesReadCount?: number;
}

export default function Victory({
  onRestartAction,
  commandCount = 999,
  detectionLevel = 50,
  maxDetectionReached = 50,
  mathMistakes = 0,
  evidenceLinks = [],
  wrongAttempts = 0,
  choiceLeakPath,
  rivalInvestigatorActive = false,
  filesReadCount = 0,
}: VictoryProps) {
  const [phase, setPhase] = useState<'intro' | 'message' | 'credits'>('intro');
  const [textLines, setTextLines] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const hasRecordedEnding = useRef(false);
  const creditsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const linkCount = evidenceLinks.length;
  const linkStatus = linkCount >= 3 ? 'Coherent' : linkCount > 0 ? 'Partial' : 'Absent';
  const attemptsStatus =
    wrongAttempts === 0 ? 'Perfect' : wrongAttempts <= 2 ? 'Minor errors' : 'Close calls';
  const releasePath =
    choiceLeakPath === 'public'
      ? 'Open networks'
      : choiceLeakPath === 'covert'
        ? 'Trusted cells'
        : 'Unspecified';
  const interferenceLine = rivalInvestigatorActive
    ? '  External interference: Rival investigator active'
    : '  External interference: None recorded';

  const victoryText = useMemo(
    () => [
      '═══════════════════════════════════════════════════════════',
      '',
      'MISSION COMPLETE',
      '',
      '═══════════════════════════════════════════════════════════',
      '',
      'The evidence of the Varginha Incident has been preserved.',
      '',
      'A curious teenager saved the files to a floppy disk,',
      'hidden in his room somewhere in Brazil.',
      '',
      'The governments tried to erase everything.',
      'The system was purged.',
      'The connections were severed.',
      '',
      'But the truth survived.',
      '',
      'ADMINISTRATIVE NOTES:',
      `  Correlation status: ${linkStatus} (${linkCount} link${linkCount === 1 ? '' : 's'})`,
      `  Operation status: ${attemptsStatus}`,
      `  Release path: ${releasePath}`,
      interferenceLine,
      '',
      'Perhaps one day, when it is safe,',
      'these files will come to light.',
      '',
      'Until then, they wait.',
      '',
      '═══════════════════════════════════════════════════════════',
      '',
      'UFO74: you did it, hackerkid.',
      'UFO74: i need to disappear now. they are close.',
      'UFO74: but it was worth it.',
      '',
      'UFO74: take care. and remember...',
      'UFO74: the truth is out there.',
      '',
      '>> END OF TRANSMISSION <<',
    ],
    [linkStatus, linkCount, attemptsStatus, releasePath, interferenceLine]
  );

  // Check for achievements on mount
  useEffect(() => {
    // Prevent duplicate recording if effect runs multiple times
    if (hasRecordedEnding.current) return;
    hasRecordedEnding.current = true;

    // Record the good ending in statistics
    recordEnding('good', commandCount, detectionLevel);

    const newAchievements: Achievement[] = [];

    // Speed Demon - under 50 commands
    if (commandCount < 50) {
      const result = unlockAchievement('speed_demon');
      if (result?.isNew) newAchievements.push(result.achievement);
    }

    // Ghost Protocol - low final detection
    if (detectionLevel < 20) {
      const result = unlockAchievement('ghost');
      if (result?.isNew) newAchievements.push(result.achievement);
    }

    // Survivor - won after ever reaching critical detection
    if (maxDetectionReached >= 80) {
      const result = unlockAchievement('survivor');
      if (result?.isNew) newAchievements.push(result.achievement);
    }

    // Mathematician - all math on first try
    if (mathMistakes === 0) {
      const result = unlockAchievement('mathematician');
      if (result?.isNew) newAchievements.push(result.achievement);
    }

    // Completionist - read every readable file (roughly 80 files in system)
    const TOTAL_READABLE_FILES = 80; // Approximate count of accessible files
    if (filesReadCount >= TOTAL_READABLE_FILES) {
      const result = unlockAchievement('completionist');
      if (result?.isNew) newAchievements.push(result.achievement);
    }

    setAchievements(newAchievements);
  }, [commandCount, detectionLevel, maxDetectionReached, mathMistakes, filesReadCount]);

  // Show achievements one by one
  useEffect(() => {
    if (achievements.length > 0 && !currentAchievement) {
      setCurrentAchievement(achievements[0]);
    }
  }, [achievements, currentAchievement]);

  const handleAchievementDismiss = () => {
    setAchievements(prev => prev.slice(1));
    setCurrentAchievement(null);
  };

  // Intro phase
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('message');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Show text lines
  useEffect(() => {
    if (phase !== 'message') return;

    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex >= victoryText.length) {
        clearInterval(interval);
        if (creditsTimerRef.current) {
          clearTimeout(creditsTimerRef.current);
        }
        creditsTimerRef.current = setTimeout(() => setPhase('credits'), 2000);
        return;
      }

      setTextLines(prev => [...prev, victoryText[lineIndex]]);
      lineIndex++;
    }, 300);

    return () => {
      clearInterval(interval);
      if (creditsTimerRef.current) {
        clearTimeout(creditsTimerRef.current);
      }
    };
  }, [phase, victoryText]);

  return (
    <div className={styles.container}>
      <div className={styles.scanlines} />

      {phase === 'intro' && (
        <div className={styles.introContent}>
          <div className={styles.introTitle}>🌟</div>
        </div>
      )}

      {(phase === 'message' || phase === 'credits') && (
        <div className={styles.messageContent}>
          {textLines.map((line, index) => (
            <div
              key={index}
              className={
                line.startsWith('═')
                  ? styles.divider
                  : line.startsWith('UFO74:')
                    ? styles.ufoLine
                    : line.startsWith('>>')
                      ? styles.systemLine
                      : line === 'MISSION COMPLETE'
                        ? styles.title
                        : styles.textLine
              }
            >
              {line}
            </div>
          ))}
        </div>
      )}

      {phase === 'credits' && (
        <div className={styles.credits}>
          <button className={styles.restartButton} onClick={onRestartAction}>
            [ PLAY AGAIN ]
          </button>
          <div className={styles.creditText}>VARGINHA: TERMINAL 1996</div>
        </div>
      )}

      {/* Achievement popup */}
      {currentAchievement && (
        <AchievementPopup achievement={currentAchievement} onDismiss={handleAchievementDismiss} />
      )}
    </div>
  );
}
