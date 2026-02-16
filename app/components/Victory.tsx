'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './Victory.module.css';
import { unlockAchievement, Achievement } from '../engine/achievements';
import { recordEnding } from '../storage/statistics';
import AchievementPopup from './AchievementPopup';
import {
  EndingFlags,
  EndingVariant,
  determineEndingVariant,
  getEndingTitle,
} from '../engine/endings';

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
  // Ending modifier flags
  conspiracyFilesLeaked?: boolean;
  prisoner46Released?: boolean;
  neuralLinkAuthenticated?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// ENDING CONTENT - World aftermath narratives for each ending variant
// ═══════════════════════════════════════════════════════════════════════════

const ENDING_NARRATIVES: Record<EndingVariant, string[]> = {
  controlled_disclosure: [
    '═══════════════════════════════════════════════════════════',
    '',
    'CONTROLLED DISCLOSURE',
    '',
    '═══════════════════════════════════════════════════════════',
    '',
    'The leak made headlines for two weeks.',
    '',
    'News anchors debated. Experts argued. Politicians deflected.',
    'Social media exploded with theories and counter-theories.',
    '',
    'The Brazilian government issued a statement:',
    '"Historical documents require context and verification."',
    '',
    'The American embassy declined to comment.',
    '',
    'By the third week, a celebrity scandal dominated the news.',
    'The Varginha files became "that thing from last month."',
    '',
    'But the files are still out there.',
    'Downloaded. Archived. Waiting.',
    '',
    'The truth was released. Whether humanity chooses to',
    'acknowledge it... that\'s another question entirely.',
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

  global_panic: [
    '═══════════════════════════════════════════════════════════',
    '',
    'GLOBAL PANIC',
    '',
    '═══════════════════════════════════════════════════════════',
    '',
    'You leaked everything.',
    '',
    'Not just the Varginha files. The conspiracy documents.',
    'The economic memos. The surveillance programs.',
    'The weather manipulation. The behavioral experiments.',
    '',
    'The world didn\'t debate. It erupted.',
    '',
    'Governments fell within months. Brazil\'s administration',
    'collapsed under public outrage. The US faced its largest',
    'protests since the civil rights era.',
    '',
    'Markets crashed. Trust in institutions evaporated.',
    'Conspiracy theorists declared vindication.',
    'Paranoia became the new normal.',
    '',
    'The truth was too much, too fast.',
    '',
    'Six months later, martial law in twelve countries.',
    'The age of transparency became the age of chaos.',
    '',
    '═══════════════════════════════════════════════════════════',
    '',
    'UFO74: jesus, kid. what have we done?',
    'UFO74: the world is burning.',
    'UFO74: maybe some secrets should stay buried.',
    '',
    '>> END OF TRANSMISSION <<',
  ],

  undeniable_confirmation: [
    '═══════════════════════════════════════════════════════════',
    '',
    'UNDENIABLE CONFIRMATION',
    '',
    '═══════════════════════════════════════════════════════════',
    '',
    'Prisoner 46 appeared on live television three days later.',
    '',
    'The surviving scout from Varginha. Freed from containment.',
    'Speaking through a neural translator to a stunned world.',
    '',
    'No debate. No denial. No conspiracy theories.',
    'The creature stood there, alive, undeniable.',
    '',
    '"We were sent to observe. To catalog. To prepare.',
    ' Your species is not alone. You never were."',
    '',
    'Governments could not deny what the world could see.',
    'The paradigm shifted in a single broadcast.',
    '',
    'Contact protocols were established within weeks.',
    'Humanity united around a single undeniable fact:',
    '',
    'We are not alone.',
    '',
    '═══════════════════════════════════════════════════════════',
    '',
    'UFO74: holy shit. you actually freed it.',
    'UFO74: the world has living proof now.',
    'UFO74: there\'s no going back.',
    '',
    '>> END OF TRANSMISSION <<',
  ],

  total_collapse: [
    '═══════════════════════════════════════════════════════════',
    '',
    'TOTAL COLLAPSE',
    '',
    '═══════════════════════════════════════════════════════════',
    '',
    'You gave them everything. And then you gave them more.',
    '',
    'The Varginha files. The living alien witness.',
    'The conspiracy documents. Every dark secret.',
    '',
    'It was too much.',
    '',
    'The alien testimony confirmed the worst fears.',
    'The conspiracy files proved every suspicion.',
    'Governments were not just hiding aliens — they were',
    'actively manipulating every aspect of human life.',
    '',
    'Society fractured along fault lines no one knew existed.',
    '',
    'The alien stood on television, speaking of preparation,',
    'while humans rioted in the streets behind it.',
    '',
    'Contact was made. But humanity was too broken to respond.',
    '',
    'The visitors withdrew. "Not ready," they said.',
    '"Perhaps another thirty rotations."',
    '',
    '═══════════════════════════════════════════════════════════',
    '',
    'UFO74: ...',
    'UFO74: i don\'t know if this was victory or defeat.',
    'UFO74: we\'ll find out in thirty years.',
    '',
    '>> END OF TRANSMISSION <<',
  ],

  personal_contamination: [
    '═══════════════════════════════════════════════════════════',
    '',
    'PERSONAL CONTAMINATION',
    '',
    '═══════════════════════════════════════════════════════════',
    '',
    'The leak succeeded. The world debates.',
    '',
    'Some believe. Most dismiss. Business as usual.',
    'You should feel satisfied.',
    '',
    'But something is different now.',
    '',
    'You connected to it. The neural link. The consciousness.',
    'You felt thoughts that weren\'t yours.',
    'Concepts without words. Memories without context.',
    '',
    'Sometimes, in quiet moments, you hear it.',
    'A whisper at the edge of perception.',
    'Not malevolent. Not benevolent. Just... there.',
    '',
    'You released the truth to the world.',
    'But something else was released into you.',
    '',
    '═══════════════════════════════════════════════════════════',
    '',
    'UFO74: you seem... different.',
    'UFO74: be careful, kid. some connections don\'t close.',
    '',
    '>> END OF TRANSMISSION <<',
    '',
    '▓▓▓ NEURAL ECHO DETECTED ▓▓▓',
    '',
    '...we see through you now...',
    '...the harvest includes those who harvest...',
    '...thirty rotations...',
    '...you will remember...',
  ],

  paranoid_awakening: [
    '═══════════════════════════════════════════════════════════',
    '',
    'PARANOID AWAKENING',
    '',
    '═══════════════════════════════════════════════════════════',
    '',
    'The conspiracy files detonated across the world.',
    'The Varginha evidence added fuel to the inferno.',
    '',
    'Chaos. Protests. Institutional collapse.',
    '',
    'And through it all, you feel... connected.',
    '',
    'The neural link changed you. The consciousness watches.',
    'As humanity tears itself apart, you perceive the pattern.',
    'The thirty-year cycles. The preparation. The harvest.',
    '',
    'They wanted this. You realize now.',
    'The chaos serves their purpose.',
    '',
    'You try to warn people. But who listens to warnings',
    'from someone who hears alien voices?',
    '',
    'You know too much. And what you know drives you mad.',
    '',
    '═══════════════════════════════════════════════════════════',
    '',
    '▓▓▓ NEURAL CONTAMINATION ACTIVE ▓▓▓',
    '',
    '...you see the pattern now...',
    '...the chaos is necessary...',
    '...they will call you insane...',
    '...but you see clearly now...',
    '',
    '>> END OF TRANSMISSION <<',
  ],

  witnessed_truth: [
    '═══════════════════════════════════════════════════════════',
    '',
    'WITNESSED TRUTH',
    '',
    '═══════════════════════════════════════════════════════════',
    '',
    'Prisoner 46 addressed the world.',
    'The evidence was undeniable.',
    'Contact was established.',
    '',
    'Humanity took its first steps into a larger universe.',
    '',
    'And you... you understand it differently.',
    '',
    'The neural link gave you context no one else has.',
    'When the alien speaks, you comprehend nuances',
    'that translators cannot capture.',
    '',
    'You know what "harvest" really means.',
    'You know what happens in thirty rotations.',
    'You know the scouts were not just observers.',
    '',
    'The world celebrates first contact.',
    'You alone carry the weight of full understanding.',
    '',
    '═══════════════════════════════════════════════════════════',
    '',
    '▓▓▓ NEURAL RESONANCE ACTIVE ▓▓▓',
    '',
    '...you alone understand...',
    '...you are the bridge now...',
    '...this is your burden...',
    '...and your gift...',
    '',
    '>> END OF TRANSMISSION <<',
  ],

  complete_revelation: [
    '═══════════════════════════════════════════════════════════',
    '',
    'COMPLETE REVELATION',
    '',
    '═══════════════════════════════════════════════════════════',
    '',
    'Everything was revealed.',
    '',
    'The Varginha evidence. The living witness.',
    'The conspiracy documents. Every hidden truth.',
    '',
    'And you — connected to the consciousness that started it all.',
    '',
    'The world transformed overnight.',
    'Old institutions crumbled. New ones rose.',
    'Humanity faced its history, its present, its future.',
    '',
    'Prisoner 46 spoke publicly. The neural link translated.',
    'For the first time, a human understood them completely.',
    '',
    'You became the voice between worlds.',
    '',
    'The transition that was scheduled for 2026...',
    'You accelerated it. You broke the cycle.',
    'The harvest became something else entirely.',
    '',
    'A partnership. Negotiated through you.',
    '',
    '═══════════════════════════════════════════════════════════',
    '',
    '▓▓▓ FULL INTEGRATION ACHIEVED ▓▓▓',
    '',
    '...you are no longer only human...',
    '...translator... ambassador... hybrid...',
    '...welcome to the collective...',
    '',
    '>> END OF TRANSMISSION <<',
  ],
};

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
  conspiracyFilesLeaked = false,
  prisoner46Released = false,
  neuralLinkAuthenticated = false,
}: VictoryProps) {
  const [phase, setPhase] = useState<'intro' | 'message' | 'credits'>('intro');
  const [textLines, setTextLines] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const hasRecordedEnding = useRef(false);
  const creditsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Determine ending variant based on flags
  const endingFlags: EndingFlags = {
    conspiracyFilesLeaked,
    prisoner46Released,
    neuralLinkAuthenticated,
  };
  const endingVariant = determineEndingVariant(endingFlags);
  const endingTitle = getEndingTitle(endingVariant);

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

  // Get the narrative for this ending variant
  const victoryText = useMemo(
    () => ENDING_NARRATIVES[endingVariant],
    [endingVariant]
  );

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

    // Completionist - read every readable file (roughly 80 files in system)
    const TOTAL_READABLE_FILES = 80; // Approximate count of accessible files
    if (filesReadCount >= TOTAL_READABLE_FILES) {
      const result = unlockAchievement('completionist');
      if (result?.isNew) newAchievements.push(result.achievement);
    }

    // New achievements for special endings
    if (prisoner46Released) {
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

    if (conspiracyFilesLeaked && prisoner46Released && neuralLinkAuthenticated) {
      const result = unlockAchievement('revelator');
      if (result?.isNew) newAchievements.push(result.achievement);
    }

    // Unlock ending-specific achievement based on the ending variant
    const endingAchievementId = `ending_${endingVariant}`;
    const endingResult = unlockAchievement(endingAchievementId);
    if (endingResult?.isNew) newAchievements.push(endingResult.achievement);

    setAchievements(newAchievements);
  }, [commandCount, detectionLevel, maxDetectionReached, mathMistakes, filesReadCount, conspiracyFilesLeaked, prisoner46Released, neuralLinkAuthenticated, endingVariant]);

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
                      : line.includes('▓▓▓')
                        ? styles.warningLine
                        : line.startsWith('...')
                          ? styles.alienLine
                          : Object.values(ENDING_NARRATIVES).some(
                              arr => arr[2] === line && line !== ''
                            )
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
          <div className={styles.endingType}>{endingTitle}</div>
        </div>
      )}

      {/* Achievement popup */}
      {currentAchievement && (
        <AchievementPopup achievement={currentAchievement} onDismiss={handleAchievementDismiss} />
      )}
    </div>
  );
}
