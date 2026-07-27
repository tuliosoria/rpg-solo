/**
 * Firewall voice system — audio playback for firewall events.
 * Extracted from FirewallEyes.tsx to break the hooks→components layering violation.
 */

import { translateStatic } from '../i18n';
import { readStoredOptions } from '../hooks/useOptions';

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

/**
 * Playback level for firewall audio, honouring the player's audio settings.
 *
 * Returns `null` when the taunt should stay silent — either sound effects are
 * switched off or the master volume is at zero. These taunts are jump-scare
 * loud, so ignoring a mute is not a cosmetic bug: a player who deliberately
 * silenced the game still gets shouted at.
 */
function resolveFirewallVolume(): number | null {
  const { soundEffectsEnabled, masterVolume } = readStoredOptions();
  if (!soundEffectsEnabled) return null;

  const level = Math.max(0, Math.min(1, masterVolume / 100));
  return level > 0 ? level : null;
}

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
  // The unlock play is silent by design; leave the element muted afterwards so
  // a stale 1.0 can never leak into a later taunt. Playback volume is resolved
  // per taunt from the player's settings instead.
  first.volume = 0;
  void first
    .play()
    .then(() => {
      first.pause();
      first.currentTime = 0;
      audioUnlocked = true;
    })
    .catch(() => {});
}

/** Play a random firewall audio file (never same twice in a row) */
export function speakCustomFirewallVoice(_phrase: string): void {
  if (typeof window === 'undefined' || !firewallAudioElements.length) return;

  const volume = resolveFirewallVolume();
  if (volume === null) return;

  try {
    let idx: number;
    do {
      idx = Math.floor(Math.random() * firewallAudioElements.length);
    } while (idx === lastAudioIndex && firewallAudioElements.length > 1);
    lastAudioIndex = idx;

    const audio = firewallAudioElements[idx];
    audio.currentTime = 0;
    audio.volume = volume;
    audio.play().catch(() => {});
  } catch {
    // Audio failed — glow + UFO74 reaction still fire from the caller
  }
}
