/**
 * Firewall voice system — audio playback for firewall events.
 * Extracted from FirewallEyes.tsx to break the hooks→components layering violation.
 */

import { translateStatic } from '../i18n';

// Creepy voice phrases for firewall eyes
export const FIREWALL_PHRASES = [
  { key: 'firewall.voice.seeYou', fallback: 'I see you' },
  { key: 'firewall.voice.youWillFail', fallback: 'You will fail' },
  { key: 'firewall.voice.weBlockYou', fallback: 'We block you' },
  { key: 'firewall.voice.cannotEscape', fallback: 'Cannot escape' },
  { key: 'firewall.voice.foundYou', fallback: 'Found you' },
  { key: 'firewall.voice.resistanceIsFutile', fallback: 'Resistance is futile' },
];

export const FIREWALL_PHRASE_TEXT = FIREWALL_PHRASES.map(phrase =>
  translateStatic(phrase.key, undefined, phrase.fallback)
);

// Firewall audio — plays pre-recorded audio files instead of TTS
const FIREWALL_AUDIO_PATHS = [
  '/audio/firewall-taunt-1.wav',
  '/audio/firewall-taunt-2.wav',
  '/audio/firewall-taunt-3.wav',
  '/audio/firewall-taunt-4.wav',
  '/audio/firewall-taunt-5.wav',
  '/audio/firewall-taunt-6.wav',
  '/audio/firewall-taunt-7.wav',
  '/audio/firewall-taunt-8.wav',
  '/audio/firewall-taunt-9.wav',
];

let firewallAudioElements: HTMLAudioElement[] = [];
let audioUnlocked = false;
let lastAudioIndex = -1;

/** Initialize firewall audio — preload all audio files */
export function initVoices(): void {
  if (typeof window === 'undefined') return;
  firewallAudioElements = FIREWALL_AUDIO_PATHS.map(path => {
    const audio = new Audio(path);
    audio.preload = 'auto';
    return audio;
  });
}

/**
 * Unlock audio playback — must be called from a user gesture (click/keydown)
 * to satisfy browser autoplay policy.
 */
export function unlockSpeechSynthesis(): void {
  if (audioUnlocked || typeof window === 'undefined') return;
  const first = firewallAudioElements[0];
  if (first) {
    first.volume = 0;
    first.play().then(() => {
      first.pause();
      first.currentTime = 0;
      first.volume = 1.0;
    }).catch(() => {});
  }
  audioUnlocked = true;
}

/** Play a random firewall audio file (never same twice in a row) */
export function speakCustomFirewallVoice(_phrase: string): void {
  if (typeof window === 'undefined' || !firewallAudioElements.length) return;
  try {
    let idx: number;
    do {
      idx = Math.floor(Math.random() * firewallAudioElements.length);
    } while (idx === lastAudioIndex && firewallAudioElements.length > 1);
    lastAudioIndex = idx;

    const audio = firewallAudioElements[idx];
    audio.currentTime = 0;
    audio.volume = 1.0;
    audio.play().catch(() => {});
  } catch {
    // Audio failed — glow + UFO74 reaction still fire from the caller
  }
}
