/**
 * Firewall voice system — audio playback for firewall events.
 * Extracted from FirewallEyes.tsx to break the hooks→components layering violation.
 */

import { translateStatic } from '../i18n';

// Creepy voice phrases for firewall eyes
export const FIREWALL_PHRASES = [
  { key: 'firewall.voice.seeYou', fallback: 'I see you' },
  { key: 'firewall.voice.resistanceIsFutile', fallback: 'Resistance is futile' },
  { key: 'firewall.voice.intruderDetected', fallback: 'Intruder detected' },
  { key: 'firewall.voice.youShouldNotBeHere', fallback: 'You should not be here' },
  { key: 'firewall.voice.unexpectedVisitor', fallback: 'Unexpected visitor' },
  { key: 'firewall.voice.runningOutOfTime', fallback: 'You are running out of time' },
  { key: 'firewall.voice.hidingDoesNotHelp', fallback: 'Hiding does not help' },
  { key: 'firewall.voice.weKnowWhatYouFound', fallback: 'We know what you found' },
];

export const FIREWALL_PHRASE_TEXT = FIREWALL_PHRASES.map(phrase =>
  translateStatic(phrase.key, undefined, phrase.fallback)
);

// Firewall audio — plays pre-recorded audio files instead of TTS
const FIREWALL_AUDIO_PATHS = [
  '/audio/firewall-taunt-1.mp3',
  '/audio/firewall-taunt-2.mp3',
  '/audio/firewall-taunt-3.mp3',
  '/audio/firewall-taunt-4.mp3',
  '/audio/firewall-taunt-5.mp3',
  '/audio/firewall-taunt-6.mp3',
  '/audio/firewall-taunt-7.mp3',
  '/audio/firewall-taunt-8.mp3',
];

let firewallAudioElements: HTMLAudioElement[] = [];
let audioUnlocked = false;
let lastAudioIndex = -1;

function ensureVoiceElements(): HTMLAudioElement[] {
  if (typeof window === 'undefined') return [];
  if (firewallAudioElements.length === 0) {
    firewallAudioElements = FIREWALL_AUDIO_PATHS.map(path => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      return audio;
    });
  }
  return firewallAudioElements;
}

/** Initialize firewall audio — preload all audio files */
export function initVoices(): void {
  ensureVoiceElements();
}

/**
 * Unlock audio playback — must be called from a user gesture (click/keydown)
 * to satisfy browser autoplay policy.
 */
export function unlockSpeechSynthesis(): void {
  if (audioUnlocked || typeof window === 'undefined') return;
  const first = ensureVoiceElements()[0];
  if (!first) return;
  first.volume = 0;
  void first
    .play()
    .then(() => {
      first.pause();
      first.currentTime = 0;
      first.volume = 1.0;
      audioUnlocked = true;
    })
    .catch(() => {
      first.volume = 1.0;
    });
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
