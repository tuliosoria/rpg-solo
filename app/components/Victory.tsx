'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './Victory.module.css';
import { unlockAchievement, Achievement } from '../engine/achievements';
import { recordEnding } from '../storage/statistics';
import AchievementPopup from './AchievementPopup';
import { useI18n } from '../i18n';
import {
  EndingFlags,
  determineEndingVariant,
  getEndingNarrativeLines,
  getEndingTitle,
} from '../engine/endings';
import type { TextSpeed } from '../types';

const VICTORY_TIMINGS: Record<
  TextSpeed,
  { introDelay: number; lineDelay: number; creditsDelay: number }
> = {
  slow: { introDelay: 2200, lineDelay: 420, creditsDelay: 2600 },
  normal: { introDelay: 1500, lineDelay: 300, creditsDelay: 2000 },
  fast: { introDelay: 900, lineDelay: 180, creditsDelay: 1200 },
  instant: { introDelay: 120, lineDelay: 0, creditsDelay: 300 },
};

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
  evidenceCount?: number;
  filesReadCount?: number;
  totalReadableFiles?: number;
  // Ending modifier flags
  conspiracyFilesLeaked?: boolean;
  alphaReleased?: boolean;
  neuralLinkAuthenticated?: boolean;
  textSpeed?: TextSpeed;
}

export default function Victory({
  onRestartAction,
  commandCount = 999,
  detectionLevel = 50,
  maxDetectionReached = 50,
  mathMistakes = 0,
  evidenceLinks: _evidenceLinks = [],
  wrongAttempts: _wrongAttempts = 0,
  choiceLeakPath: _choiceLeakPath,
  rivalInvestigatorActive: _rivalInvestigatorActive = false,
  evidenceCount = 0,
  filesReadCount = 0,
  totalReadableFiles = 0,
  conspiracyFilesLeaked = false,
  alphaReleased = false,
  neuralLinkAuthenticated = false,
  textSpeed = 'normal',
}: VictoryProps) {
  const { t, translateRuntimeText } = useI18n();
  const [phase, setPhase] = useState<'intro' | 'message' | 'credits'>('intro');
  const [textLines, setTextLines] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const hasRecordedEnding = useRef(false);
  const creditsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Determine ending variant based on flags
  const endingFlags: EndingFlags = {
    conspiracyFilesLeaked,
    alphaReleased,
    neuralLinkAuthenticated,
  };
  const endingVariant = determineEndingVariant(endingFlags);
  const endingTitle = getEndingTitle(endingVariant);

  // Get the narrative for this ending variant
  const victoryText = useMemo(
    () => getEndingNarrativeLines(endingVariant),
    [endingVariant]
  );
  const timings = VICTORY_TIMINGS[textSpeed];
  const leakPathLabel =
    _choiceLeakPath === 'public'
      ? t('ending.dossier.path.public')
      : _choiceLeakPath === 'covert'
        ? t('ending.dossier.path.covert')
        : t('ending.dossier.path.unknown');
  const replaySuggestions = useMemo(() => {
    const suggestions: string[] = [];

    if (!conspiracyFilesLeaked) {
      suggestions.push(t('ending.dossier.replay.public'));
    }
    if (!alphaReleased) {
      suggestions.push(t('ending.dossier.replay.alpha'));
    }
    if (!neuralLinkAuthenticated) {
      suggestions.push(t('ending.dossier.replay.link'));
    }
    if (_choiceLeakPath !== 'covert') {
      suggestions.push(t('ending.dossier.replay.covert'));
    }

    if (suggestions.length === 0 && (conspiracyFilesLeaked || alphaReleased || neuralLinkAuthenticated)) {
      suggestions.push(t('ending.dossier.replay.cleaner'));
    }

    if (suggestions.length === 0) {
      suggestions.push(t('ending.dossier.replay.complete'));
    }

    return suggestions.slice(0, 2);
  }, [alphaReleased, conspiracyFilesLeaked, neuralLinkAuthenticated, _choiceLeakPath, t]);

  // Check for achievements on mount
  useEffect(() => {
    // Prevent duplicate recording if effect runs multiple times
    if (hasRecordedEnding.current) return;
    hasRecordedEnding.current = true;

    // Record the good ending in statistics (with variant info)
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

    // Completionist - read every currently accessible file in the run.
    if (totalReadableFiles > 0 && filesReadCount >= totalReadableFiles) {
      const result = unlockAchievement('completionist');
      if (result?.isNew) newAchievements.push(result.achievement);
    }

    // New achievements for special endings
    if (alphaReleased) {
      const result = unlockAchievement('liberator');
      if (result?.isNew) newAchievements.push(result.achievement);
    }

    if (conspiracyFilesLeaked) {
      const result = unlockAchievement('whistleblower');
      if (result?.isNew) newAchievements.push(result.achievement);
    }

    if (neuralLinkAuthenticated) {
      const result = unlockAchievement('linked');
      if (result?.isNew) newAchievements.push(result.achievement);
    }

    if (conspiracyFilesLeaked && alphaReleased && neuralLinkAuthenticated) {
      const result = unlockAchievement('revelator');
      if (result?.isNew) newAchievements.push(result.achievement);
    }

    // Unlock ending-specific achievement based on the ending variant
    const endingAchievementId = `ending_${endingVariant}`;
    const endingResult = unlockAchievement(endingAchievementId);
    if (endingResult?.isNew) newAchievements.push(endingResult.achievement);

    setAchievements(newAchievements);
  }, [
    commandCount,
    detectionLevel,
    maxDetectionReached,
    mathMistakes,
    filesReadCount,
    totalReadableFiles,
    conspiracyFilesLeaked,
    alphaReleased,
    neuralLinkAuthenticated,
    endingVariant,
  ]);

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
    }, timings.introDelay);
    return () => clearTimeout(timer);
  }, [timings.introDelay]);

  // Show text lines
  useEffect(() => {
    if (phase !== 'message') return;

    setTextLines([]);

    if (timings.lineDelay === 0) {
      setTextLines(victoryText);
      creditsTimerRef.current = setTimeout(() => setPhase('credits'), timings.creditsDelay);
      return () => {
        if (creditsTimerRef.current) {
          clearTimeout(creditsTimerRef.current);
        }
      };
    }

    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex >= victoryText.length) {
        clearInterval(interval);
        if (creditsTimerRef.current) {
          clearTimeout(creditsTimerRef.current);
        }
        creditsTimerRef.current = setTimeout(() => setPhase('credits'), timings.creditsDelay);
        return;
      }

      const nextLine = victoryText[lineIndex];
      if (typeof nextLine === 'string') {
        setTextLines(prev => [...prev, nextLine]);
      }
      lineIndex++;
    }, timings.lineDelay);

    return () => {
      clearInterval(interval);
      if (creditsTimerRef.current) {
        clearTimeout(creditsTimerRef.current);
      }
    };
  }, [phase, timings.creditsDelay, timings.lineDelay, victoryText]);

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
                      : line.includes('▓▓▓')
                        ? styles.warningLine
                        : line.startsWith('...')
                          ? styles.alienLine
                          : line === endingTitle
                            ? styles.title
                            : styles.textLine
              }
            >
              {translateRuntimeText(line)}
            </div>
          ))}
        </div>
      )}

      {phase === 'credits' && (
        <div className={styles.credits}>
          <div className={styles.dossier}>
            <div className={styles.dossierTitle}>{t('ending.dossier.title')}</div>

            <div className={styles.dossierRow}>
              <span>{t('ending.dossier.evidence')}</span>
              <span>{evidenceCount}/10</span>
            </div>
            <div className={styles.dossierRow}>
              <span>{t('ending.dossier.filesReviewed')}</span>
              <span>
                {filesReadCount}/{Math.max(totalReadableFiles, filesReadCount)}
              </span>
            </div>
            <div className={styles.dossierRow}>
              <span>{t('ending.dossier.maxDetection')}</span>
              <span>{maxDetectionReached}%</span>
            </div>
            <div className={styles.dossierRow}>
              <span>{t('ending.dossier.leakPath')}</span>
              <span>{leakPathLabel}</span>
            </div>
            <div className={styles.dossierRow}>
              <span>{t('ending.dossier.blackFiles')}</span>
              <span>
                {conspiracyFilesLeaked
                  ? t('ending.dossier.blackFiles.leaked')
                  : t('ending.dossier.blackFiles.sealed')}
              </span>
            </div>
            <div className={styles.dossierRow}>
              <span>{t('ending.dossier.alpha')}</span>
              <span>
                {alphaReleased
                  ? t('ending.dossier.alpha.released')
                  : t('ending.dossier.alpha.contained')}
              </span>
            </div>
            <div className={styles.dossierRow}>
              <span>{t('ending.dossier.neuralLink')}</span>
              <span>
                {neuralLinkAuthenticated
                  ? t('ending.dossier.neuralLink.authenticated')
                  : t('ending.dossier.neuralLink.unused')}
              </span>
            </div>

            <div className={styles.dossierSubtitle}>{t('ending.dossier.replayTitle')}</div>
            {replaySuggestions.map(suggestion => (
              <div key={suggestion} className={styles.dossierSuggestion}>
                {suggestion}
              </div>
            ))}
          </div>

          <button className={styles.restartButton} onClick={onRestartAction}>
            {t('ending.playAgain')}
          </button>
          <div className={styles.creditText}>VARGINHA: TERMINAL 1996</div>
          <div className={styles.endingType}>{translateRuntimeText(endingTitle)}</div>
        </div>
      )}

      {/* Achievement popup */}
      {currentAchievement && (
        <AchievementPopup achievement={currentAchievement} onDismiss={handleAchievementDismiss} />
      )}
    </div>
  );
}
