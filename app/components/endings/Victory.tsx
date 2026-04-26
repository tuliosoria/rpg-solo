'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './Victory.module.css';
import { unlockAchievement, Achievement } from '../../engine/achievements';
import { recordEnding } from '../../storage/statistics';
import AchievementPopup from '../overlays/AchievementPopup';
import { useI18n } from '../../i18n';
import {
  EndingId,
  ENDINGS,
  getEndingTitle,
} from '../../engine/endings';
import type { EndingFlags } from '../../engine/endings';
import type { TextSpeed } from '../../types';

const AOL_TIMINGS: Record<
  TextSpeed,
  { loadingDuration: number; staggerBase: number; dossierDelay: number }
> = {
  slow: { loadingDuration: 3500, staggerBase: 500, dossierDelay: 3000 },
  normal: { loadingDuration: 2500, staggerBase: 350, dossierDelay: 2000 },
  fast: { loadingDuration: 1200, staggerBase: 150, dossierDelay: 1000 },
  instant: { loadingDuration: 0, staggerBase: 0, dossierDelay: 0 },
};

const ENDING_LEAK_PATHS: Record<EndingId, 'public' | 'covert' | 'unknown'> = {
  ridiculed: 'public',
  ufo74_exposed: 'public',
  the_2026_warning: 'covert',
  government_scandal: 'public',
  prisoner_45_freed: 'public',
  harvest_understood: 'covert',
  nothing_changes: 'public',
  incomplete_picture: 'unknown',
  wrong_story: 'public',
  hackerkid_caught: 'covert',
  secret_ending: 'public',
  real_ending: 'public',
};

const ENDING_IMPLIED_FLAGS: Partial<Record<EndingId, Partial<EndingFlags>>> = {
  ridiculed: { conspiracyFilesLeaked: true, neuralLinkAuthenticated: true },
  ufo74_exposed: { conspiracyFilesLeaked: true },
  government_scandal: { conspiracyFilesLeaked: true },
  prisoner_45_freed: { conspiracyFilesLeaked: true, alphaReleased: true },
  nothing_changes: { conspiracyFilesLeaked: true },
  wrong_story: { conspiracyFilesLeaked: true },
  secret_ending: {
    conspiracyFilesLeaked: true,
    alphaReleased: true,
    neuralLinkAuthenticated: true,
  },
  real_ending: { conspiracyFilesLeaked: true },
};

interface VictoryProps {
  onRestartAction: () => void;
  commandCount?: number;
  detectionLevel?: number;
  maxDetectionReached?: number;
  filesReadCount?: number;
  totalReadableFiles?: number;
  endingId?: EndingId;
  endingFlags?: EndingFlags;
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
  filesReadCount = 0,
  totalReadableFiles = 0,
  endingId,
  endingFlags,
  conspiracyFilesLeaked = false,
  alphaReleased = false,
  neuralLinkAuthenticated = false,
  textSpeed = 'normal',
}: VictoryProps) {
  const { t, translateRuntimeText } = useI18n();
  const isInstant = textSpeed === 'instant';
  const [phase, setPhase] = useState<'loading' | 'page' | 'complete'>(
    isInstant ? 'complete' : 'loading'
  );
  const [loadingProgress, setLoadingProgress] = useState(isInstant ? 100 : 0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const hasRecordedEnding = useRef(false);
  const restartButtonRef = useRef<HTMLButtonElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ── Ending music ──
  useEffect(() => {
    try {
      const audio = new Audio('/audio/music/ending-game.mp3');
      audio.loop = true;
      audio.volume = 0.5;
      audioRef.current = audio;
      void audio.play().catch(() => {});
    } catch {
      // Audio not available
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  const resolvedEndingId: EndingId = endingId && endingId in ENDINGS
    ? endingId
    : 'incomplete_picture';
  const impliedEndingFlags = ENDING_IMPLIED_FLAGS[resolvedEndingId] ?? {};
  const resolvedEndingFlags = {
    conspiracyFilesLeaked:
      (endingFlags?.conspiracyFilesLeaked ?? conspiracyFilesLeaked) ||
      impliedEndingFlags.conspiracyFilesLeaked === true,
    alphaReleased:
      (endingFlags?.alphaReleased ?? alphaReleased) || impliedEndingFlags.alphaReleased === true,
    neuralLinkAuthenticated:
      (endingFlags?.neuralLinkAuthenticated ?? neuralLinkAuthenticated) ||
      impliedEndingFlags.neuralLinkAuthenticated === true,
  };
  const {
    conspiracyFilesLeaked: hasLeakedFiles,
    alphaReleased: hasReleasedAlpha,
    neuralLinkAuthenticated: hasNeuralLink,
  } = resolvedEndingFlags;
  const endingTitle = translateRuntimeText(getEndingTitle(resolvedEndingId));

  const ending = ENDINGS[resolvedEndingId];
  const aol = ending?.aol ?? {
    headline: t('ending.aol.fallback.headline'),
    subheadline: t('ending.aol.fallback.subheadline'),
    body: [t('ending.aol.fallback.body')],
    url: 'http://www.aol.com/news/',
    imageAlt: t('ending.aol.fallback.imageAlt'),
    visitorCount: 0,
  };
  const timings = AOL_TIMINGS[textSpeed] ?? AOL_TIMINGS.normal;
  const leakPath = hasLeakedFiles ? 'public' : ENDING_LEAK_PATHS[resolvedEndingId];
  const leakPathLabel = t(`ending.dossier.path.${leakPath}`);
  const browserMenuLabels = [
    t('ending.aol.menu.file'),
    t('ending.aol.menu.edit'),
    t('ending.aol.menu.view'),
    t('ending.aol.menu.go'),
    t('ending.aol.menu.bookmarks'),
    t('ending.aol.menu.options'),
    t('ending.aol.menu.directory'),
    t('ending.aol.menu.help'),
  ];
  const browserNavLabels = [
    `◄ ${t('ending.aol.nav.back')}`,
    `► ${t('ending.aol.nav.forward')}`,
    `⟲ ${t('ending.aol.nav.reload')}`,
    `🏠 ${t('ending.aol.nav.home')}`,
    `🔍 ${t('ending.aol.nav.search')}`,
  ];
  const replaySuggestions = useMemo(() => {
    const suggestions: string[] = [];
    if (!hasLeakedFiles) suggestions.push(t('ending.dossier.replay.public'));
    if (!hasReleasedAlpha) suggestions.push(t('ending.dossier.replay.alpha'));
    if (!hasNeuralLink) suggestions.push(t('ending.dossier.replay.link'));
    suggestions.push(t('ending.dossier.replay.covert'));
    if (suggestions.length === 0 && (hasLeakedFiles || hasReleasedAlpha || hasNeuralLink)) {
      suggestions.push(t('ending.dossier.replay.cleaner'));
    }
    if (suggestions.length === 0) {
      suggestions.push(t('ending.dossier.replay.complete'));
    }
    return suggestions.slice(0, 2);
  }, [hasLeakedFiles, hasNeuralLink, hasReleasedAlpha, t]);

  // ── Achievement system (preserved from original) ──
  useEffect(() => {
    if (hasRecordedEnding.current) return;
    hasRecordedEnding.current = true;
    try {
      recordEnding('good', commandCount, detectionLevel);
    } catch {
      // Statistics recording is non-critical
    }

    const newAchievements: Achievement[] = [];
    try {
      if (commandCount < 50) {
        const result = unlockAchievement('speed_demon');
        if (result?.isNew) newAchievements.push(result.achievement);
      }
      if (detectionLevel < 20) {
        const result = unlockAchievement('ghost');
        if (result?.isNew) newAchievements.push(result.achievement);
      }
      if (maxDetectionReached >= 80) {
        const result = unlockAchievement('survivor');
        if (result?.isNew) newAchievements.push(result.achievement);
      }
      if (totalReadableFiles > 0 && filesReadCount >= totalReadableFiles) {
        const result = unlockAchievement('completionist');
        if (result?.isNew) newAchievements.push(result.achievement);
      }
      if (hasReleasedAlpha) {
        const result = unlockAchievement('liberator');
        if (result?.isNew) newAchievements.push(result.achievement);
      }
      if (hasLeakedFiles) {
        const result = unlockAchievement('whistleblower');
        if (result?.isNew) newAchievements.push(result.achievement);
      }
      if (hasNeuralLink) {
        const result = unlockAchievement('linked');
        if (result?.isNew) newAchievements.push(result.achievement);
      }
      if (hasLeakedFiles && hasReleasedAlpha && hasNeuralLink) {
        const result = unlockAchievement('revelator');
        if (result?.isNew) newAchievements.push(result.achievement);
      }
      const endingAchievementId = `ending_${resolvedEndingId}`;
      const endingResult = unlockAchievement(endingAchievementId);
      if (endingResult?.isNew) newAchievements.push(endingResult.achievement);
    } catch {
      // Achievement unlocking is non-critical
    }

    setAchievements(newAchievements);
  }, [
    commandCount, detectionLevel, maxDetectionReached,
    filesReadCount, totalReadableFiles,
    hasLeakedFiles, hasReleasedAlpha, hasNeuralLink, resolvedEndingId,
  ]);

  useEffect(() => {
    if (achievements.length > 0 && !currentAchievement) {
      setCurrentAchievement(achievements[0]);
    }
  }, [achievements, currentAchievement]);

  const handleAchievementDismiss = () => {
    setAchievements(prev => prev.slice(1));
    setCurrentAchievement(null);
  };

  // ── Loading phase: fake progress bar ──
  useEffect(() => {
    if (phase !== 'loading') return;
    const duration = timings.loadingDuration;
    const steps = 20;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setLoadingProgress(Math.min(100, Math.round((step / steps) * 100)));
      if (step >= steps) {
        clearInterval(timer);
        setPhase('page');
      }
    }, interval);
    return () => clearInterval(timer);
  }, [phase, timings.loadingDuration]);

  // ── Page → complete: wait for stagger animations + dossier delay ──
  useEffect(() => {
    if (phase !== 'page') return;
    const totalStagger = timings.staggerBase * (6 + aol.body.length);
    const timer = setTimeout(() => setPhase('complete'), totalStagger + timings.dossierDelay);
    return () => clearTimeout(timer);
  }, [phase, timings.staggerBase, timings.dossierDelay, aol.body.length]);

  // ── Focus restart button when complete ──
  useEffect(() => {
    if (phase === 'complete') {
      restartButtonRef.current?.focus({ preventScroll: true });
    }
  }, [phase]);

  const staggerDelay = (index: number): React.CSSProperties =>
    isInstant ? {} : { animationDelay: `${index * timings.staggerBase}ms` };

  const sectionClass = isInstant
    ? styles.sectionInstant
    : styles.section;

  return (
    <div className={styles.container} role="dialog" aria-modal="true" aria-label={endingTitle}>
      <div className={styles.browserWindow}>
        {/* ── Title Bar ── */}
        <div className={styles.titleBar} aria-hidden="true">
          <span className={styles.titleBarText}>
            {t('ending.aol.windowTitle')}
          </span>
          <div className={styles.windowControls}>
            <span className={styles.windowBtn}>_</span>
            <span className={styles.windowBtn}>□</span>
            <span className={styles.windowBtn}>✕</span>
          </div>
        </div>

        {/* ── Menu Bar ── */}
        <div className={styles.menuBar} aria-hidden="true">
          {browserMenuLabels.map(label => (
            <span key={label}>{label}</span>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className={styles.toolbar} aria-hidden="true">
          {browserNavLabels.map(label => (
            <span key={label} className={styles.navBtn}>{label}</span>
          ))}
        </div>

        {/* ── Address Bar ── */}
        <div className={styles.addressBar} aria-hidden="true">
          <span className={styles.locationLabel}>{t('ending.aol.locationLabel')}</span>
          <div className={styles.urlField}>{aol.url}</div>
        </div>

        {/* ── Content Area ── */}
        <div className={styles.contentArea}>
          {phase === 'loading' ? (
            <div className={styles.loadingScreen}>
              <div className={styles.loadingText}>
                {t('ending.aol.loading')}
              </div>
              <div className={styles.progressBarTrack}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className={styles.pageContent} role="article">
              {/* Breaking News Banner */}
              <div
                className={`${sectionClass} ${styles.banner}`}
                style={staggerDelay(0)}
                aria-hidden="true"
              >
                <span className={styles.blink}>★★★ {t('ending.aol.breakingNews')} ★★★</span>
              </div>

              {/* Pixel Divider */}
              <hr
                className={`${sectionClass} ${styles.pixelDivider}`}
                style={staggerDelay(1)}
                aria-hidden="true"
              />

              {/* Marquee */}
              <div
                className={`${sectionClass} ${styles.marqueeContainer}`}
                style={staggerDelay(2)}
                aria-hidden="true"
              >
                <div className={styles.marqueeTrack}>
                  <span className={styles.marqueeText}>{translateRuntimeText(aol.subheadline)}</span>
                </div>
              </div>

              {/* Headline */}
              <h1
                className={`${sectionClass} ${styles.headline}`}
                style={staggerDelay(3)}
              >
                {translateRuntimeText(aol.headline)}
              </h1>

              {/* Body Paragraphs */}
              {aol.body.map((paragraph, i) => (
                <p
                  key={i}
                  className={`${sectionClass} ${styles.bodyText}`}
                  style={staggerDelay(4 + i)}
                >
                  {translateRuntimeText(paragraph)}
                </p>
              ))}

              {/* Photo */}
              <div
                className={`${sectionClass} ${aol.imageSrc ? styles.newsPhoto : styles.brokenImage}`}
                style={staggerDelay(4 + aol.body.length)}
              >
                {aol.imageSrc ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={aol.imageSrc}
                      alt={translateRuntimeText(aol.imageAlt)}
                      className={styles.newsPhotoImg}
                    />
                    <div className={styles.imageCaption}>
                      {translateRuntimeText(aol.imageAlt)}
                    </div>
                    <div className={styles.imageCredit}>{t('ending.aol.photoCredit')}</div>
                  </>
                ) : (
                  <>
                    <div className={styles.brokenImageIcon} aria-hidden="true">✕</div>
                    <div className={styles.brokenImageLabel}>{translateRuntimeText(aol.imageAlt)}</div>
                    <div className={styles.imageCredit}>{t('ending.aol.photoCredit')}</div>
                  </>
                )}
              </div>

              {/* UFO74 Wire Footer */}
              <div
                className={`${sectionClass} ${styles.wireFooter}`}
                style={staggerDelay(5 + aol.body.length)}
              >
                <hr className={styles.thinRule} />
                <div className={styles.editorNote}>
                  <em>{t('ending.aol.editorNote')}: {translateRuntimeText(ending?.ufo74_final ?? '')}</em>
                </div>
              </div>

              {/* ── Dossier + Footer (visible in complete phase) ── */}
              {phase === 'complete' && (
                <>
                  <hr className={styles.pixelDivider} />

                  <div className={styles.dossier}>
                    <div className={styles.dossierTitle}>{t('ending.dossier.title')}</div>

                    <dl className={styles.dossierList}>
                      <div className={styles.dossierRow}>
                        <dt>{t('ending.dossier.filesReviewed')}</dt>
                        <dd>{filesReadCount}/{Math.max(totalReadableFiles, filesReadCount)}</dd>
                      </div>
                      <div className={styles.dossierRow}>
                        <dt>{t('ending.dossier.maxDetection')}</dt>
                        <dd>{maxDetectionReached}%</dd>
                      </div>
                      <div className={styles.dossierRow}>
                        <dt>{t('ending.dossier.leakPath')}</dt>
                        <dd>{leakPathLabel}</dd>
                      </div>
                      <div className={styles.dossierRow}>
                        <dt>{t('ending.dossier.blackFiles')}</dt>
                        <dd>
                          {hasLeakedFiles
                            ? t('ending.dossier.blackFiles.leaked')
                            : t('ending.dossier.blackFiles.sealed')}
                        </dd>
                      </div>
                      <div className={styles.dossierRow}>
                        <dt>{t('ending.dossier.alpha')}</dt>
                        <dd>
                          {hasReleasedAlpha
                            ? t('ending.dossier.alpha.released')
                            : t('ending.dossier.alpha.contained')}
                        </dd>
                      </div>
                      <div className={styles.dossierRow}>
                        <dt>{t('ending.dossier.neuralLink')}</dt>
                        <dd>
                          {hasNeuralLink
                            ? t('ending.dossier.neuralLink.authenticated')
                            : t('ending.dossier.neuralLink.unused')}
                        </dd>
                      </div>
                    </dl>

                    <div className={styles.dossierSubtitle}>{t('ending.dossier.replayTitle')}</div>
                    {replaySuggestions.map(suggestion => (
                      <div key={suggestion} className={styles.dossierSuggestion}>
                        {suggestion}
                      </div>
                    ))}
                  </div>

                  {/* Visitor Counter */}
                  <div className={styles.visitorCounter} aria-hidden="true">
                    <span className={styles.counterIcon}>📊</span>
                    {t('ending.aol.visitor', { count: aol.visitorCount.toLocaleString() })}
                  </div>

                  <div className={styles.bestViewed} aria-hidden="true">
                    {t('ending.aol.bestViewed')}
                  </div>

                  <button
                    ref={restartButtonRef}
                    className={styles.restartButton}
                    onClick={onRestartAction}
                  >
                    {t('ending.playAgain')}
                  </button>

                  {/* Game title — intentionally not translated (proper name) */}
                  <div className={styles.creditText}>VARGINHA: TERMINAL 1996</div>
                  <div className={styles.endingType}>{endingTitle}</div>
                </>
              )}
            </div>
          )}
        </div>

        {/* ── Status Bar ── */}
        <div className={styles.statusBar} aria-hidden="true">
          <span>
            {phase === 'loading'
              ? t('ending.aol.transferring', { progress: String(loadingProgress) })
              : t('ending.aol.documentDone')}
          </span>
        </div>
      </div>

      {/* Achievement popup */}
      {currentAchievement && (
        <AchievementPopup achievement={currentAchievement} onDismiss={handleAchievementDismiss} />
      )}
    </div>
  );
}
