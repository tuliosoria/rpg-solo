'use client';

/**
 * useSound - Synthesized Audio System
 *
 * Provides oscillator-based sound effects without external audio files:
 * - Keypress and UI feedback sounds
 * - Ambient tension drone that responds to detection level
 * - Dramatic reveals, alerts, and the victory fanfare
 *
 * All sounds are generated using Web Audio API oscillators and noise buffers.
 *
 * @module hooks/useSound
 */

import { useCallback, useRef, useEffect, useState } from 'react';
import { DEFAULT_OPTIONS, OPTIONS_CHANGED_EVENT, persistOptions, readStoredOptions } from './useOptions';

/**
 * Available sound effect types.
 */
export type SoundType =
  | 'keypress'
  | 'enter'
  | 'error'
  | 'warning'
  | 'success'
  | 'alert'
  | 'glitch'
  | 'ambient'
  | 'static'
  | 'message'
  | 'reveal'
  | 'typing'
  | 'transmission'
  | 'creepy' // Unsettling avatar entrance
  | 'omen' // Sparse, low-volume unease cue
  | 'fanfare' // Zelda-like celebration sound
  | 'hover' // Menu hover blip
  | 'morse'; // Morse code transmission beeps

// Sound configuration
interface SoundConfig {
  volume: number;
  loop?: boolean;
  variations?: number;
}

const SOUND_CONFIG: Record<SoundType, SoundConfig> = {
  keypress: { volume: 0.15, variations: 3 },
  enter: { volume: 0.25 },
  error: { volume: 0.4 },
  warning: { volume: 0.35 },
  success: { volume: 0.3 },
  alert: { volume: 0.5 },
  glitch: { volume: 0.25 },
  ambient: { volume: 0.08, loop: true },
  static: { volume: 0.12 },
  message: { volume: 0.3 }, // UFO74 message received
  reveal: { volume: 0.4 }, // Important discovery
  typing: { volume: 0.08 }, // Stream typing sound
  transmission: { volume: 0.35 }, // UFO74 transmission banner
  creepy: { volume: 0.45 }, // Unsettling avatar entrance
  omen: { volume: 0.1 }, // Brief whisper/static pulse for subtle dread
  fanfare: { volume: 0.5 }, // Zelda-like celebration
  hover: { volume: 0.12 }, // Menu hover blip
  morse: { volume: 0.4 }, // Morse code transmission beeps
};

// Generate oscillator-based sounds (no external files needed)
const createOscillatorSound = (
  audioContext: AudioContext,
  type: OscillatorType,
  frequency: number,
  duration: number,
  volume: number,
  detune: number = 0
): void => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.detune.setValueAtTime(detune, audioContext.currentTime);

  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
};

// Create noise buffer for static/glitch sounds
const createNoiseBuffer = (audioContext: AudioContext, duration: number): AudioBuffer => {
  const bufferSize = audioContext.sampleRate * duration;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  return buffer;
};

// ═══════════════════════════════════════════════════════════════════════════
// AMBIENT MUSIC — Risk-based MP3 tracks. The track changes based on the
// current detection/risk level to escalate tension dynamically.
//   Music 0 = low risk (0–29%)
//   Music 1 = moderate risk (30–69%)
//   Music 2 = high risk (70%+)
// ═══════════════════════════════════════════════════════════════════════════

const MUSIC_TRACKS: Record<number, string> = {
  0: '/audio/music/music-0.mp3',
  1: '/audio/music/music-1.mp3',
  2: '/audio/music/music-2.mp3',
};

function getMusicTier(risk: number): number {
  if (risk >= 70) return 2;
  if (risk >= 30) return 1;
  return 0;
}

/** Base volume for music (before masterVolume multiplier). Keep low so the
 *  white-noise ambient drone remains audible. */
const MUSIC_BASE_VOLUME = 0.07;

// Preload music tracks on module load (browser only)
if (typeof window !== 'undefined') {
  const preloadTracks = () => {
    Object.values(MUSIC_TRACKS).forEach(track => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'audio';
      link.href = track;
      document.head.appendChild(link);
    });
  };

  if ('requestIdleCallback' in window) {
    (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(preloadTracks);
  } else {
    setTimeout(preloadTracks, 1000);
  }
}

/**
 * Hook providing synthesized audio effects for the terminal.
 * @returns Object with playSound, playKeySound, ambient controls, and volume settings
 */
export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const ambientSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const ambientFilterRef = useRef<BiquadFilterNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const ambientTensionLevelRef = useRef(0);
  const ambientDisturbanceRef = useRef(0);
  // Ambient music refs
  const musicElementRef = useRef<HTMLAudioElement | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);
  const musicSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const musicTrackIndexRef = useRef(0); // current music tier (0/1/2)
  const [soundEnabled, setSoundEnabled] = useState(DEFAULT_OPTIONS.soundEffectsEnabled);
  const [ambientEnabled, setAmbientEnabled] = useState(DEFAULT_OPTIONS.ambientSoundEnabled);
  const [musicEnabled, setMusicEnabled] = useState(DEFAULT_OPTIONS.musicEnabled);
  const [turingVoiceEnabled, setTuringVoiceEnabled] = useState(DEFAULT_OPTIONS.turingVoiceEnabled);
  const [masterVolume, setMasterVolumeState] = useState(DEFAULT_OPTIONS.masterVolume / 100);

  const syncAudioOptions = useCallback(() => {
    const storedOptions = readStoredOptions();
    setSoundEnabled(storedOptions.soundEffectsEnabled);
    setAmbientEnabled(storedOptions.ambientSoundEnabled);
    setMusicEnabled(storedOptions.musicEnabled);
    setTuringVoiceEnabled(storedOptions.turingVoiceEnabled);
    setMasterVolumeState(storedOptions.masterVolume / 100);
  }, []);

  useEffect(() => {
    syncAudioOptions();

    if (typeof window === 'undefined') {
      return;
    }

    const handleStorageSync = () => syncAudioOptions();
    window.addEventListener('storage', handleStorageSync);
    window.addEventListener(OPTIONS_CHANGED_EVENT, handleStorageSync);

    return () => {
      window.removeEventListener('storage', handleStorageSync);
      window.removeEventListener(OPTIONS_CHANGED_EVENT, handleStorageSync);
    };
  }, [syncAudioOptions]);

  // Initialize audio context on first interaction
  const initAudio = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
      }
    }
    return audioContextRef.current;
  }, []);

  const syncAmbientProfile = useCallback(
    (rampSeconds: number) => {
      const audioContext = audioContextRef.current;
      const filter = ambientFilterRef.current;
      const gain = ambientGainRef.current;

      if (!audioContext || !filter || !gain) return;

      const detectionRatio = Math.max(0, Math.min(1, ambientTensionLevelRef.current / 100));
      const disturbance = Math.max(0, Math.min(1, ambientDisturbanceRef.current));
      const baseVolume = SOUND_CONFIG.ambient.volume * masterVolume;
      const normalVolume = baseVolume + detectionRatio * (baseVolume * 1.5);
      const targetTime = audioContext.currentTime + Math.max(rampSeconds, 0.01);

      // Let more high-frequency hiss through and raise the resonance when the
      // silhouette appears, then settle back to the base tension profile.
      const frequency = 200 + detectionRatio * 600 + disturbance * 2200;
      const q = 1 + detectionRatio * 7 + disturbance * 12;
      const volume = normalVolume * (1 + disturbance * 0.65);

      filter.frequency.cancelScheduledValues?.(audioContext.currentTime);
      filter.Q.cancelScheduledValues?.(audioContext.currentTime);
      gain.gain.cancelScheduledValues?.(audioContext.currentTime);

      filter.frequency.linearRampToValueAtTime(frequency, targetTime);
      filter.Q.linearRampToValueAtTime(q, targetTime);
      gain.gain.linearRampToValueAtTime(volume, targetTime);
    },
    [masterVolume]
  );

  // Play a key-specific sound with pitch variation based on key type
  const playKeySound = useCallback(
    (key: string) => {
      if (!soundEnabled) return;

      const audioContext = initAudio();
      if (!audioContext) return;

      if (audioContext.state === 'suspended') {
        void audioContext.resume().catch(() => {});
      }

      const config = SOUND_CONFIG.keypress;
      const volume = config.volume * masterVolume;
      const variation = Math.random() * 200 - 100;

      if (key === ' ') {
        // Space: lower pitch
        createOscillatorSound(
          audioContext,
          'square',
          600 + variation,
          0.025,
          volume * 0.3,
          variation
        );
        createOscillatorSound(audioContext, 'triangle', 150 + variation / 2, 0.035, volume * 0.5);
      } else if (key === 'Backspace') {
        // Backspace: higher pitch
        createOscillatorSound(
          audioContext,
          'square',
          1000 + variation,
          0.015,
          volume * 0.25,
          variation
        );
        createOscillatorSound(audioContext, 'triangle', 300 + variation / 2, 0.025, volume * 0.4);
      } else {
        // Regular letters: standard keypress
        createOscillatorSound(
          audioContext,
          'square',
          800 + variation,
          0.02,
          volume * 0.3,
          variation
        );
        createOscillatorSound(audioContext, 'triangle', 200 + variation / 2, 0.03, volume * 0.5);
      }
    },
    [soundEnabled, masterVolume, initAudio]
  );

  // Play a synthesized sound
  const playSound = useCallback(
    (type: SoundType) => {
      if (!soundEnabled) return;

      const audioContext = initAudio();
      if (!audioContext) return;

      if (audioContext.state === 'suspended') {
        void audioContext.resume().catch(() => {});
      }

      const config = SOUND_CONFIG[type];
      const volume = config.volume * masterVolume;

      switch (type) {
        case 'keypress': {
          const variation = Math.random() * 200 - 100;
          createOscillatorSound(
            audioContext,
            'square',
            800 + variation,
            0.02,
            volume * 0.3,
            variation
          );
          createOscillatorSound(audioContext, 'triangle', 200 + variation / 2, 0.03, volume * 0.5);
          break;
        }

        case 'enter': {
          createOscillatorSound(audioContext, 'square', 600, 0.03, volume * 0.4);
          createOscillatorSound(audioContext, 'triangle', 150, 0.05, volume * 0.6);
          break;
        }

        case 'error': {
          createOscillatorSound(audioContext, 'sawtooth', 150, 0.15, volume);
          createOscillatorSound(audioContext, 'square', 100, 0.2, volume * 0.5, 50);
          break;
        }

        case 'warning': {
          createOscillatorSound(audioContext, 'sine', 880, 0.1, volume);
          setTimeout(() => {
            if (audioContextRef.current) {
              createOscillatorSound(audioContextRef.current, 'sine', 660, 0.1, volume);
            }
          }, 120);
          break;
        }

        case 'success': {
          createOscillatorSound(audioContext, 'sine', 523, 0.1, volume * 0.7);
          setTimeout(() => {
            if (audioContextRef.current) {
              createOscillatorSound(audioContextRef.current, 'sine', 659, 0.1, volume * 0.7);
            }
          }, 80);
          setTimeout(() => {
            if (audioContextRef.current) {
              createOscillatorSound(audioContextRef.current, 'sine', 784, 0.15, volume);
            }
          }, 160);
          break;
        }

        case 'alert': {
          for (let i = 0; i < 3; i++) {
            setTimeout(() => {
              if (audioContextRef.current) {
                createOscillatorSound(audioContextRef.current, 'square', 440, 0.08, volume);
              }
            }, i * 150);
          }
          break;
        }

        case 'glitch': {
          const noiseBuffer = createNoiseBuffer(audioContext, 0.1);
          const noiseSource = audioContext.createBufferSource();
          const noiseGain = audioContext.createGain();
          const filter = audioContext.createBiquadFilter();

          noiseSource.buffer = noiseBuffer;
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1000 + Math.random() * 2000, audioContext.currentTime);
          filter.Q.setValueAtTime(5, audioContext.currentTime);

          noiseGain.gain.setValueAtTime(volume, audioContext.currentTime);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);

          noiseSource.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(audioContext.destination);

          noiseSource.start();
          break;
        }

        case 'static': {
          const noiseBuffer = createNoiseBuffer(audioContext, 0.2);
          const noiseSource = audioContext.createBufferSource();
          const noiseGain = audioContext.createGain();

          noiseSource.buffer = noiseBuffer;
          noiseGain.gain.setValueAtTime(volume * 0.3, audioContext.currentTime);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);

          noiseSource.connect(noiseGain);
          noiseGain.connect(audioContext.destination);

          noiseSource.start();
          break;
        }

        case 'ambient': {
          // Handled by startAmbient
          break;
        }

        case 'message': {
          // UFO74 message - soft ascending chime
          createOscillatorSound(audioContext, 'sine', 523, 0.08, volume * 0.6);
          setTimeout(() => {
            if (audioContextRef.current) {
              createOscillatorSound(audioContextRef.current, 'sine', 659, 0.1, volume * 0.5);
            }
          }, 80);
          setTimeout(() => {
            if (audioContextRef.current) {
              createOscillatorSound(audioContextRef.current, 'sine', 784, 0.15, volume * 0.4);
            }
          }, 160);
          break;
        }

        case 'reveal': {
          // Important discovery - dramatic reveal
          createOscillatorSound(audioContext, 'sine', 262, 0.3, volume * 0.4);
          createOscillatorSound(audioContext, 'sine', 330, 0.3, volume * 0.3);
          createOscillatorSound(audioContext, 'sine', 392, 0.3, volume * 0.3);
          setTimeout(() => {
            if (audioContextRef.current) {
              createOscillatorSound(audioContextRef.current, 'sine', 523, 0.4, volume * 0.5);
            }
          }, 200);
          break;
        }

        case 'typing': {
          // Soft typing sound for streaming
          const variation = Math.random() * 100 - 50;
          createOscillatorSound(audioContext, 'triangle', 300 + variation, 0.01, volume * 0.2);
          break;
        }

        case 'transmission': {
          // Sci-fi chirp sequence for UFO74 transmissions
          createOscillatorSound(audioContext, 'sine', 800, 0.08, volume * 0.7);
          setTimeout(() => {
            if (audioContextRef.current) {
              createOscillatorSound(audioContextRef.current, 'sine', 1200, 0.08, volume * 0.6);
            }
          }, 100);
          setTimeout(() => {
            if (audioContextRef.current) {
              createOscillatorSound(audioContextRef.current, 'sine', 600, 0.12, volume * 0.5);
            }
          }, 200);
          break;
        }

        case 'creepy': {
          // CRT TV turning on: static burst → high-pitch whine → hum settle
          const t = audioContext.currentTime;

          // 1. Initial static burst — white noise snap (TV tube igniting)
          const noiseBuffer = createNoiseBuffer(audioContext, 0.35);
          const noiseSrc = audioContext.createBufferSource();
          const noiseGain = audioContext.createGain();
          const noiseFilter = audioContext.createBiquadFilter();
          noiseSrc.buffer = noiseBuffer;
          noiseFilter.type = 'bandpass';
          noiseFilter.frequency.setValueAtTime(3000, t);
          noiseFilter.frequency.exponentialRampToValueAtTime(800, t + 0.3);
          noiseFilter.Q.value = 0.8;
          noiseGain.gain.setValueAtTime(volume * 0.7, t);
          noiseGain.gain.linearRampToValueAtTime(volume * 0.4, t + 0.08);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
          noiseSrc.connect(noiseFilter);
          noiseFilter.connect(noiseGain);
          noiseGain.connect(audioContext.destination);
          noiseSrc.start(t);
          noiseSrc.stop(t + 0.35);

          // 2. High-pitch CRT whine — sine sweep from very high down to flyback freq
          const whineOsc = audioContext.createOscillator();
          const whineGain = audioContext.createGain();
          whineOsc.type = 'sine';
          whineOsc.frequency.setValueAtTime(12000, t + 0.05);
          whineOsc.frequency.exponentialRampToValueAtTime(15700, t + 0.3);
          whineOsc.frequency.setValueAtTime(15700, t + 0.6);
          whineOsc.frequency.exponentialRampToValueAtTime(15600, t + 1.5);
          whineGain.gain.setValueAtTime(0, t + 0.05);
          whineGain.gain.linearRampToValueAtTime(volume * 0.12, t + 0.15);
          whineGain.gain.setValueAtTime(volume * 0.12, t + 0.6);
          whineGain.gain.exponentialRampToValueAtTime(volume * 0.04, t + 1.2);
          whineGain.gain.exponentialRampToValueAtTime(0.001, t + 1.8);
          whineOsc.connect(whineGain);
          whineGain.connect(audioContext.destination);
          whineOsc.start(t + 0.05);
          whineOsc.stop(t + 1.8);

          // 3. Low electrical hum — 60Hz buzz settling in (transformer hum)
          const humOsc = audioContext.createOscillator();
          const humGain = audioContext.createGain();
          humOsc.type = 'sawtooth';
          humOsc.frequency.value = 60;
          humGain.gain.setValueAtTime(0, t + 0.1);
          humGain.gain.linearRampToValueAtTime(volume * 0.2, t + 0.4);
          humGain.gain.setValueAtTime(volume * 0.2, t + 0.8);
          humGain.gain.exponentialRampToValueAtTime(0.001, t + 1.6);
          humOsc.connect(humGain);
          humGain.connect(audioContext.destination);
          humOsc.start(t + 0.1);
          humOsc.stop(t + 1.6);

          // 4. Degauss thump — low percussive hit when the tube magnetizes
          const thumpOsc = audioContext.createOscillator();
          const thumpGain = audioContext.createGain();
          thumpOsc.type = 'sine';
          thumpOsc.frequency.setValueAtTime(80, t + 0.02);
          thumpOsc.frequency.exponentialRampToValueAtTime(30, t + 0.2);
          thumpGain.gain.setValueAtTime(volume * 0.6, t + 0.02);
          thumpGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
          thumpOsc.connect(thumpGain);
          thumpGain.connect(audioContext.destination);
          thumpOsc.start(t + 0.02);
          thumpOsc.stop(t + 0.25);
          break;
        }

        case 'omen': {
          // Very sparse "something is slightly wrong" cue:
          // a soft filtered static breath plus a faint descending tone.
          const t = audioContext.currentTime;

          const noiseBuffer = createNoiseBuffer(audioContext, 0.16);
          const noiseSource = audioContext.createBufferSource();
          const noiseGain = audioContext.createGain();
          const noiseFilter = audioContext.createBiquadFilter();

          noiseSource.buffer = noiseBuffer;
          noiseFilter.type = 'bandpass';
          noiseFilter.frequency.setValueAtTime(1400, t);
          noiseFilter.Q.setValueAtTime(1.8, t);
          noiseGain.gain.setValueAtTime(0.0001, t);
          noiseGain.gain.linearRampToValueAtTime(volume * 0.35, t + 0.03);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

          noiseSource.connect(noiseFilter);
          noiseFilter.connect(noiseGain);
          noiseGain.connect(audioContext.destination);
          noiseSource.start(t);
          noiseSource.stop(t + 0.16);

          const osc = audioContext.createOscillator();
          const oscGain = audioContext.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(360, t);
          oscGain.gain.setValueAtTime(0.0001, t);
          oscGain.gain.linearRampToValueAtTime(volume * 0.22, t + 0.025);
          oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
          osc.connect(oscGain);
          oscGain.connect(audioContext.destination);
          osc.start(t);
          osc.stop(t + 0.24);
          break;
        }

        case 'fanfare': {
          // Zelda-like item get fanfare: Ta-ra-ra-ra-ta-ta-ta-ram!
          // Notes: E5, E5, E5, E5, C5, D5, E5 with triumphant ending
          const notes = [
            { freq: 659, duration: 0.1 }, // E5
            { freq: 659, duration: 0.1 }, // E5
            { freq: 659, duration: 0.1 }, // E5
            { freq: 659, duration: 0.15 }, // E5 (slightly longer)
            { freq: 523, duration: 0.1 }, // C5
            { freq: 587, duration: 0.1 }, // D5
            { freq: 659, duration: 0.4 }, // E5 (final long note)
          ];

          let delay = 0;
          notes.forEach(note => {
            setTimeout(() => {
              if (audioContextRef.current) {
                // Main tone
                createOscillatorSound(
                  audioContextRef.current,
                  'sine',
                  note.freq,
                  note.duration,
                  volume * 0.6
                );
                // Harmonic layer for richness
                createOscillatorSound(
                  audioContextRef.current,
                  'triangle',
                  note.freq * 0.5,
                  note.duration,
                  volume * 0.3
                );
                // Sparkle layer
                createOscillatorSound(
                  audioContextRef.current,
                  'sine',
                  note.freq * 2,
                  note.duration * 0.5,
                  volume * 0.15
                );
              }
            }, delay * 1000);
            delay += note.duration;
          });
          break;
        }

        case 'hover': {
          // Short, soft blip for menu hover — retro terminal tick
          createOscillatorSound(audioContext, 'sine', 1200, 0.025, volume * 0.5);
          createOscillatorSound(audioContext, 'triangle', 600, 0.015, volume * 0.3);
          break;
        }

        case 'morse': {
          // Play COLHEITA in morse code: -.-. --- .-.. .... . .. - .-
          // Uses 700Hz sine tone, timing based on standard morse ratios
          const MORSE_FREQ = 700;
          const DOT = 0.06; // dot duration in seconds
          const DASH = DOT * 3;
          const SYMBOL_GAP = DOT; // gap between symbols within a letter
          const LETTER_GAP = DOT * 3; // gap between letters

          // COLHEITA morse sequences: each letter is an array of dot/dash durations
          const morseLetters: number[][] = [
            [DASH, DOT, DASH, DOT],     // C: -.-.
            [DASH, DASH, DASH],          // O: ---
            [DOT, DASH, DOT, DOT],       // L: .-..
            [DOT, DOT, DOT, DOT],        // H: ....
            [DOT],                        // E: .
            [DOT, DOT],                   // I: ..
            [DASH],                       // T: -
            [DOT, DASH],                  // A: .-
          ];

          let morseDelay = 0.15; // initial pause

          morseLetters.forEach((letter, letterIdx) => {
            letter.forEach(symbolDuration => {
              const d = morseDelay;
              setTimeout(() => {
                if (audioContextRef.current) {
                  const ctx = audioContextRef.current;
                  const t = ctx.currentTime;

                  // Main tone
                  const osc = ctx.createOscillator();
                  const gain = ctx.createGain();
                  osc.type = 'sine';
                  osc.frequency.setValueAtTime(MORSE_FREQ, t);

                  // Soft envelope to avoid clicks
                  gain.gain.setValueAtTime(0, t);
                  gain.gain.linearRampToValueAtTime(volume * 0.7, t + 0.005);
                  gain.gain.setValueAtTime(volume * 0.7, t + symbolDuration - 0.005);
                  gain.gain.linearRampToValueAtTime(0, t + symbolDuration);

                  osc.connect(gain);
                  gain.connect(ctx.destination);
                  osc.start(t);
                  osc.stop(t + symbolDuration);

                  // Harmonic layer for richness (slight detuned upper octave)
                  const osc2 = ctx.createOscillator();
                  const gain2 = ctx.createGain();
                  osc2.type = 'sine';
                  osc2.frequency.setValueAtTime(MORSE_FREQ * 2, t);
                  gain2.gain.setValueAtTime(0, t);
                  gain2.gain.linearRampToValueAtTime(volume * 0.15, t + 0.005);
                  gain2.gain.setValueAtTime(volume * 0.15, t + symbolDuration - 0.005);
                  gain2.gain.linearRampToValueAtTime(0, t + symbolDuration);
                  osc2.connect(gain2);
                  gain2.connect(ctx.destination);
                  osc2.start(t);
                  osc2.stop(t + symbolDuration);
                }
              }, d * 1000);

              morseDelay += symbolDuration + SYMBOL_GAP;
            });
            // Add letter gap (minus the last symbol gap already added)
            morseDelay += LETTER_GAP - SYMBOL_GAP;
            // Add a bit more gap after the 4th letter for drama
            if (letterIdx === 3) morseDelay += DOT * 2;
          });
          break;
        }
      }
    },
    [soundEnabled, masterVolume, initAudio]
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // AMBIENT MUSIC — file-based MP3 playback via <audio> + Web Audio routing
  // Must be defined BEFORE startAmbient since it's called from there.
  // ═══════════════════════════════════════════════════════════════════════════

  const startMusic = useCallback(() => {
    if (!musicEnabled || musicElementRef.current) return;

    const audioContext = initAudio();
    if (!audioContext) return;

    try {
      // Start with low-risk track (tier 0)
      musicTrackIndexRef.current = 0;

      const audio = new Audio(MUSIC_TRACKS[musicTrackIndexRef.current]);
      audio.crossOrigin = 'anonymous';
      audio.loop = true;
      audio.volume = 1; // volume controlled via GainNode

      // Route through Web Audio so masterVolume affects it
      const source = audioContext.createMediaElementSource(audio);
      const gain = audioContext.createGain();
      gain.gain.setValueAtTime(MUSIC_BASE_VOLUME * masterVolume, audioContext.currentTime);
      source.connect(gain);
      gain.connect(audioContext.destination);

      musicElementRef.current = audio;
      musicSourceRef.current = source;
      musicGainRef.current = gain;

      void audio.play().catch(() => {});
    } catch {
      // Audio/MediaElementSource not available (e.g. test environment)
    }
  }, [musicEnabled, masterVolume, initAudio]);

  // Switch music track when risk tier changes
  const updateMusicForRisk = useCallback((risk: number) => {
    const tier = getMusicTier(risk);
    if (tier === musicTrackIndexRef.current) return;
    musicTrackIndexRef.current = tier;

    if (musicElementRef.current) {
      musicElementRef.current.src = MUSIC_TRACKS[tier];
      musicElementRef.current.loop = true;
      void musicElementRef.current.play().catch(() => {});
    }
  }, []);

  const stopMusic = useCallback(() => {
    if (musicElementRef.current) {
      musicElementRef.current.pause();
      musicElementRef.current.src = '';
      musicElementRef.current = null;
    }
    if (musicSourceRef.current) {
      try { musicSourceRef.current.disconnect(); } catch { /* noop */ }
      musicSourceRef.current = null;
    }
    musicGainRef.current = null;
  }, []);

  // Keep music gain in sync with masterVolume changes
  useEffect(() => {
    if (musicGainRef.current && audioContextRef.current) {
      musicGainRef.current.gain.linearRampToValueAtTime(
        MUSIC_BASE_VOLUME * masterVolume,
        audioContextRef.current.currentTime + 0.3
      );
    }
  }, [masterVolume]);

  useEffect(() => {
    syncAmbientProfile(0.15);
  }, [masterVolume, syncAmbientProfile]);

  // Start ambient background drone
  const startAmbient = useCallback(() => {
    if (!ambientEnabled || ambientSourceRef.current) return;

    const audioContext = initAudio();
    if (!audioContext) return;

    // Create noise-based ambient
    const noiseBuffer = createNoiseBuffer(audioContext, 2);
    const noiseSource = audioContext.createBufferSource();
    const noiseGain = audioContext.createGain();
    const noiseFilter = audioContext.createBiquadFilter();

    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(300, audioContext.currentTime); // Start at calm frequency
    noiseFilter.Q.setValueAtTime(2, audioContext.currentTime); // Subtle resonance
    noiseGain.gain.setValueAtTime(
      SOUND_CONFIG.ambient.volume * masterVolume,
      audioContext.currentTime
    );

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioContext.destination);

    noiseSource.start();
    ambientSourceRef.current = noiseSource;
    ambientFilterRef.current = noiseFilter;
    ambientGainRef.current = noiseGain;
    syncAmbientProfile(0.01);

    startMusic();
  }, [ambientEnabled, masterVolume, initAudio, startMusic, syncAmbientProfile]);

  // Update ambient tension based on detection level
  // Lower detection = calm low-frequency hum
  // Higher detection = more intense, higher-pitched, louder drone
  const updateAmbientTension = useCallback(
    (detectionLevel: number) => {
      ambientTensionLevelRef.current = Math.max(0, Math.min(100, detectionLevel));
      syncAmbientProfile(0.5);
    },
    [syncAmbientProfile]
  );

  const setAmbientDisturbance = useCallback(
    (level: number) => {
      const clampedLevel = Math.max(0, Math.min(1, level));
      const previousLevel = ambientDisturbanceRef.current;
      ambientDisturbanceRef.current = clampedLevel;

      if (previousLevel === clampedLevel) return;

      syncAmbientProfile(clampedLevel > previousLevel ? 0.12 : 0.3);
    },
    [syncAmbientProfile]
  );

  // Stop ambient noise drone
  const stopAmbient = useCallback(() => {
    if (ambientSourceRef.current) {
      try {
        ambientSourceRef.current.stop();
      } catch {
        // Already stopped
      }
      ambientSourceRef.current = null;
    }
    ambientFilterRef.current = null;
    ambientGainRef.current = null;
  }, []);

  useEffect(() => {
    if (!ambientEnabled) {
      stopAmbient();
    }
  }, [ambientEnabled, stopAmbient]);

  useEffect(() => {
    if (!musicEnabled) {
      stopMusic();
    }
  }, [musicEnabled, stopMusic]);

  // Toggle sound on/off
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const next = !prev;
      persistOptions({
        ...readStoredOptions(),
        soundEffectsEnabled: next,
      });
      return next;
    });
  }, []);

  // Toggle music on/off
  const toggleMusic = useCallback(() => {
    setMusicEnabled(prev => {
      const next = !prev;
      persistOptions({
        ...readStoredOptions(),
        musicEnabled: next,
      });
      return next;
    });
  }, []);

  const setMasterVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    setMasterVolumeState(clampedVolume);
    persistOptions({
      ...readStoredOptions(),
      masterVolume: Math.round(clampedVolume * 100),
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAmbient();
      stopMusic();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [stopAmbient, stopMusic]);

  // Set music playback rate (for Turing Test intensity effect)
  const setMusicPlaybackRate = useCallback((rate: number) => {
    if (musicElementRef.current) {
      musicElementRef.current.playbackRate = rate;
    }
  }, []);

  // Speak text using Web Speech API (for Firewall voice)
  const speak = useCallback((text: string, options?: { rate?: number; pitch?: number }) => {
    if (!turingVoiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options?.rate ?? 0.8; // Slow, menacing
    utterance.pitch = options?.pitch ?? 0.5; // Deep voice
    utterance.volume = masterVolume;
    
    speechSynthesis.speak(utterance);
  }, [turingVoiceEnabled, masterVolume]);

  return {
    playSound,
    playKeySound,
    startAmbient,
    stopAmbient,
    toggleSound,
    updateAmbientTension,
    setAmbientDisturbance,
    setMusicPlaybackRate,
    updateMusicForRisk,
    speak,
    soundEnabled,
    musicEnabled,
    masterVolume,
    setMasterVolume,
    toggleMusic,
  };
}
