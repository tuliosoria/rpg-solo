'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import styles from './IntroSequence.module.css';

const INTRO_VIDEO_SRC = new URL('../../videos/intro.mp4', import.meta.url).toString();

interface IntroSequenceProps {
  onCompleteAction: () => void;
}

type Scene = 'video' | 'transition' | 'logo' | 'title' | 'done';

const TRANSITION_MS = 900;
const LOGO_DURATION_MS = 4500;
const TITLE_DURATION_MS = 5500;

export default function IntroSequence({ onCompleteAction }: IntroSequenceProps) {
  const { t } = useI18n();
  const [scene, setScene] = useState<Scene>('video');
  const [transitioning, setTransitioning] = useState(false);
  const completedRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setScene('done');
    onCompleteAction();
  }, [onCompleteAction]);

  const goTo = useCallback((next: Scene) => {
    setTransitioning(true);
    window.setTimeout(() => {
      setScene(next);
      window.setTimeout(() => setTransitioning(false), 80);
    }, TRANSITION_MS);
  }, []);

  // Skip on any key / click
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [finish]);

  // Scene 1 -> Scene 2: when video ends OR fails to load, transition to logo
  const handleVideoEnded = useCallback(() => goTo('logo'), [goTo]);
  const handleVideoError = useCallback(() => goTo('logo'), [goTo]);

  // Scene 2 -> Scene 3
  useEffect(() => {
    if (scene !== 'logo') return;
    const id = window.setTimeout(() => goTo('title'), LOGO_DURATION_MS);
    return () => window.clearTimeout(id);
  }, [scene, goTo]);

  // Scene 3 -> finish
  useEffect(() => {
    if (scene !== 'title') return;
    const id = window.setTimeout(() => {
      setTransitioning(true);
      window.setTimeout(finish, TRANSITION_MS);
    }, TITLE_DURATION_MS);
    return () => window.clearTimeout(id);
  }, [scene, finish]);

  // Try to autoplay video
  useEffect(() => {
    if (scene !== 'video' || !videoRef.current) return;
    videoRef.current.play().catch(() => {
      // Autoplay blocked or media missing -> move on
      goTo('logo');
    });
  }, [scene, goTo]);

  return (
    <div
      className={styles.root}
      onClick={finish}
      role="button"
      tabIndex={0}
      aria-label={t('intro.skip.aria') || 'Skip intro'}
    >
      {scene === 'video' && (
        <div className={styles.videoWrap}>
          <video
            ref={videoRef}
            className={styles.video}
            src={INTRO_VIDEO_SRC}
            muted={false}
            playsInline
            autoPlay
            onEnded={handleVideoEnded}
            onError={handleVideoError}
          />
          <div className={styles.vhsChroma} />
          <div className={styles.vhsScanlines} />
          <div className={styles.vhsNoise} />
          <div className={styles.vhsTracking} />
          <div className={styles.vhsVignette} />
        </div>
      )}

      {scene === 'logo' && (
        <>
          <div className={styles.grain} />
          <div className={styles.logoScene}>
            <div className={styles.logoText}>{t('intro.logo.studio') || 'Simple Man Productions'}</div>
          </div>
        </>
      )}

      {scene === 'title' && (
        <>
          <div className={styles.grain} />
          <div className={styles.crtFlicker} />
          <div className={styles.titleScene}>
            <h1
              className={styles.titleMain}
              data-text={t('intro.title.main') || 'Terminal Varginha'}
            >
              {t('intro.title.main') || 'Terminal Varginha'}
            </h1>
            <div className={styles.titleSub}>
              {t('intro.title.subtitle') || 'The secret will be revealed'}
            </div>
          </div>
          <div className={styles.crtScanlines} />
        </>
      )}

      <div
        className={`${styles.transitionLayer} ${transitioning ? styles.visible : ''}`}
      >
        <div className={styles.transitionStatic} />
      </div>

      {scene !== 'done' && (
        <div className={styles.skipHint}>
          {t('intro.skip.hint') || 'Press any key to skip'}
        </div>
      )}
    </div>
  );
}
