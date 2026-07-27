'use client';

import { useEffect, useRef } from 'react';
import { OPTIONS_CHANGED_EVENT, readStoredOptions } from '../../hooks/useOptions';

interface EndingMusicOptions {
  /** Base volume (0..1) before the master-volume multiplier is applied. */
  baseVolume?: number;
  /** Whether the track should loop. Defaults to true. */
  loop?: boolean;
}

function safePlay(audio: HTMLAudioElement): void {
  try {
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
  } catch {
    // Playback unavailable (autoplay policy, SSR/jsdom) — fail silently.
  }
}

/**
 * Plays an ending track that honours the player's audio settings.
 *
 * Ending screens previously constructed a bare `new Audio()` with a hardcoded
 * volume, which ignored both the `musicEnabled` toggle and `masterVolume`. A
 * player who muted music — or turned the volume down — would still get a track
 * at the emotional climax. This hook routes playback through the stored
 * options and reacts live to option changes, so muting mid-ending stops the
 * music and re-enabling it resumes.
 */
export function useEndingMusic(
  src: string,
  { baseVolume = 0.5, loop = true }: EndingMusicOptions = {}
): void {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let audio: HTMLAudioElement | null = null;
    try {
      audio = new Audio(src);
      audio.loop = loop;
      audioRef.current = audio;
    } catch {
      // Audio constructor unavailable — nothing to wire up.
      return;
    }

    const applyOptions = () => {
      const current = audioRef.current;
      if (!current) return;
      const { musicEnabled, masterVolume } = readStoredOptions();
      if (musicEnabled) {
        const target = baseVolume * (masterVolume / 100);
        current.volume = Math.max(0, Math.min(1, target));
        if (current.paused) {
          safePlay(current);
        }
      } else {
        current.pause();
      }
    };

    applyOptions();
    window.addEventListener(OPTIONS_CHANGED_EVENT, applyOptions);
    window.addEventListener('storage', applyOptions);

    return () => {
      window.removeEventListener(OPTIONS_CHANGED_EVENT, applyOptions);
      window.removeEventListener('storage', applyOptions);
      const current = audioRef.current;
      if (current) {
        current.pause();
        current.src = '';
        audioRef.current = null;
      }
    };
  }, [src, baseVolume, loop]);
}
