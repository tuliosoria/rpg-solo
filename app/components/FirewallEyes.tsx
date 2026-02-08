'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { FirewallEye } from '../types';
import { uiRandom, uiRandomPick } from '../engine/rng';
import styles from './FirewallEyes.module.css';

// Configuration
const EYE_LIFETIME_MS = 8000; // Time before eye detonates (8 seconds)
const EYE_WARNING_MS = 2000; // Time before detonation when eye starts pulsing
const DETECTION_THRESHOLD = 25; // Detection level when firewall activates
const BATCH_SIZE = 5; // Default eyes spawned per batch
const HIGH_RISK_BATCH_SIZE = 10;
const CRITICAL_RISK_BATCH_SIZE = 12;
const FIREWALL_EYE_BATCH_SIZES = {
  BASE: BATCH_SIZE,
  HIGH: HIGH_RISK_BATCH_SIZE,
  CRITICAL: CRITICAL_RISK_BATCH_SIZE,
} as const;
const HIGH_RISK_THRESHOLD = 75;
const CRITICAL_RISK_THRESHOLD = 85;
const FIREWALL_EYE_BATCH_THRESHOLDS = {
  HIGH: HIGH_RISK_THRESHOLD,
  CRITICAL: CRITICAL_RISK_THRESHOLD,
} as const;
const SPAWN_COOLDOWN_MS = 90000; // 90 seconds cooldown between spawns
const DETECTION_INCREASE_ON_DETONATE = 5; // Risk increase when eye detonates

export function getFirewallEyeBatchSize(detectionLevel: number): number {
  if (detectionLevel >= FIREWALL_EYE_BATCH_THRESHOLDS.CRITICAL) {
    return FIREWALL_EYE_BATCH_SIZES.CRITICAL;
  }
  if (detectionLevel >= FIREWALL_EYE_BATCH_THRESHOLDS.HIGH) {
    return FIREWALL_EYE_BATCH_SIZES.HIGH;
  }
  return FIREWALL_EYE_BATCH_SIZES.BASE;
}

interface FirewallEyesProps {
  detectionLevel: number;
  firewallActive: boolean;
  firewallDisarmed: boolean;
  eyes: FirewallEye[];
  lastEyeSpawnTime: number;
  paused: boolean; // Pause timers during image/video overlays
  onEyeClick: (eyeId: string) => void;
  onEyeDetonate: (eyeId: string) => void;
  onSpawnEyeBatch: () => void;
  onActivateFirewall: () => void;
  onPauseChanged?: (paused: boolean) => void; // Callback when pause state changes
}

export default function FirewallEyes({
  detectionLevel,
  firewallActive,
  firewallDisarmed,
  eyes,
  lastEyeSpawnTime,
  paused,
  onEyeClick,
  onEyeDetonate,
  onSpawnEyeBatch,
  onActivateFirewall,
  onPauseChanged,
}: FirewallEyesProps) {
  const detonationTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const spawnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pauseStartTimeRef = useRef<number | null>(null); // Track when pause started for time adjustment

  // Activate firewall when detection reaches threshold (delay if paused)
  useEffect(() => {
    if (!firewallActive && !firewallDisarmed && detectionLevel >= DETECTION_THRESHOLD && !paused) {
      onActivateFirewall();
    }
  }, [detectionLevel, firewallActive, firewallDisarmed, paused, onActivateFirewall]);

  // Track pause state to notify parent for time adjustments
  useEffect(() => {
    if (paused) {
      // Record when pause started
      pauseStartTimeRef.current = Date.now();
    } else if (pauseStartTimeRef.current !== null) {
      // Pause ended - notify parent to adjust eye times
      const pauseDuration = Date.now() - pauseStartTimeRef.current;
      if (onPauseChanged && pauseDuration > 100) {
        onPauseChanged(false); // Signal parent to extend eye detonation times
      }
      pauseStartTimeRef.current = null;
    }
  }, [paused, onPauseChanged]);

  // Spawn eye batch with cooldown timer
  useEffect(() => {
    if (!firewallActive || firewallDisarmed || paused) {
      // Clear spawn timer if firewall is inactive/disarmed/paused
      if (spawnTimerRef.current) {
        clearTimeout(spawnTimerRef.current);
        spawnTimerRef.current = null;
      }
      return;
    }

    // Calculate time until next spawn is allowed
    const now = Date.now();
    const timeSinceLastSpawn = now - lastEyeSpawnTime;
    const timeUntilNextSpawn = Math.max(0, SPAWN_COOLDOWN_MS - timeSinceLastSpawn);

    // Clear any existing spawn timer
    if (spawnTimerRef.current) {
      clearTimeout(spawnTimerRef.current);
    }

    // Set timer for next spawn batch
    spawnTimerRef.current = setTimeout(() => {
      onSpawnEyeBatch();
    }, timeUntilNextSpawn);

    return () => {
      if (spawnTimerRef.current) {
        clearTimeout(spawnTimerRef.current);
      }
    };
  }, [firewallActive, firewallDisarmed, lastEyeSpawnTime, paused, onSpawnEyeBatch]);

  // Set up detonation timers for each eye
  useEffect(() => {
    if (firewallDisarmed || paused) {
      // Clear all timers if firewall is disarmed or paused
      detonationTimersRef.current.forEach(timer => clearTimeout(timer));
      detonationTimersRef.current.clear();
      return;
    }

    const now = Date.now();

    for (const eye of eyes) {
      // Skip if timer already set or eye is detonating
      if (detonationTimersRef.current.has(eye.id) || eye.isDetonating) continue;

      const timeUntilDetonate = eye.detonateTime - now;

      if (timeUntilDetonate <= 0) {
        // Should have already detonated
        onEyeDetonate(eye.id);
      } else {
        // Set timer for detonation
        const timer = setTimeout(() => {
          onEyeDetonate(eye.id);
          detonationTimersRef.current.delete(eye.id);
        }, timeUntilDetonate);

        detonationTimersRef.current.set(eye.id, timer);
      }
    }

    // Cleanup timers for removed eyes only (not all timers)
    detonationTimersRef.current.forEach((timer, id) => {
      if (!eyes.find(e => e.id === id)) {
        clearTimeout(timer);
        detonationTimersRef.current.delete(id);
      }
    });

    // Only cleanup all timers on actual unmount, not on re-renders
    // The ref persists across renders, so we don't want to clear timers
    // every time the eyes array changes
  }, [eyes, firewallDisarmed, paused, onEyeDetonate]);

  // Separate cleanup effect for unmount only
  useEffect(() => {
    const timersRef = detonationTimersRef.current;
    return () => {
      // Cleanup all timers on unmount
      timersRef.forEach(timer => clearTimeout(timer));
      timersRef.clear();
    };
  }, []);

  // Handle click on eye
  const handleEyeClick = useCallback(
    (eyeId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      // Clear the detonation timer
      const timer = detonationTimersRef.current.get(eyeId);
      if (timer) {
        clearTimeout(timer);
        detonationTimersRef.current.delete(eyeId);
      }

      onEyeClick(eyeId);
    },
    [onEyeClick]
  );

  // Don't render if firewall is disarmed or not active
  if (firewallDisarmed || !firewallActive || eyes.length === 0) {
    return null;
  }

  const now = Date.now();

  return (
    <div className={styles.firewallContainer}>
      {eyes.map(eye => {
        const timeUntilDetonate = eye.detonateTime - now;
        const isWarning = timeUntilDetonate <= EYE_WARNING_MS && timeUntilDetonate > 0;
        const isCritical = timeUntilDetonate <= 1000 && timeUntilDetonate > 0;

        return (
          <button
            key={eye.id}
            className={`${styles.eye} ${isWarning ? styles.warning : ''} ${isCritical ? styles.critical : ''} ${eye.isDetonating ? styles.detonating : ''}`}
            style={{
              left: `${eye.x}%`,
              top: `${eye.y}%`,
            }}
            onClick={e => handleEyeClick(eye.id, e)}
            aria-label="Click to neutralize surveillance eye"
            title="CLICK TO NEUTRALIZE"
          >
            <div className={styles.eyeInner}>
              <div className={styles.eyePupil} />
            </div>
            {isWarning && (
              <div className={styles.countdown}>{Math.ceil(timeUntilDetonate / 1000)}</div>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Utility function to create a new eye
export function createFirewallEye(): FirewallEye {
  const now = Date.now();

  // Generate random position avoiding edges and the avatar region (top-right corner)
  // Avatar is at approximately right: 15px, top: 190px, size ~200x280px
  // In percentage terms, avatar occupies roughly x: 80-100%, y: 15-35% of viewport
  let x: number;
  let y: number;
  const maxAttempts = 10;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    x = 10 + uiRandom() * 80; // 10-90% horizontal
    y = 20 + uiRandom() * 60; // 20-80% vertical (avoid header/footer)

    // Check if position overlaps with avatar region (x > 75% and y < 40%)
    const inAvatarZone = x > 75 && y < 40;
    if (!inAvatarZone) {
      break;
    }
    // If we're in avatar zone, regenerate (last attempt uses whatever we got but shifted)
    if (attempt === maxAttempts - 1) {
      x = 10 + uiRandom() * 65; // Force left of avatar region
    }
  }

  const randomSegment = Math.floor(uiRandom() * 36 ** 8)
    .toString(36)
    .padStart(8, '0');

  return {
    id: `eye-${Date.now()}-${randomSegment}`,
    x: x!,
    y: y!,
    spawnTime: now,
    detonateTime: now + EYE_LIFETIME_MS,
    isDetonating: false,
  };
}

// Create a batch of eyes at once
export function createFirewallEyeBatch(count: number = BATCH_SIZE): FirewallEye[] {
  const eyes: FirewallEye[] = [];
  for (let i = 0; i < count; i++) {
    eyes.push(createFirewallEye());
  }
  return eyes;
}

// Creepy voice phrases for firewall eyes
const FIREWALL_PHRASES = [
  'I see you',
  'You will fail',
  'We block you',
  'Cannot escape',
  'Found you',
  'Resistance is futile',
];

// Cache for loaded voices
let cachedVoices: SpeechSynthesisVoice[] = [];
let voicesLoaded = false;

// Initialize voices - must be called early to preload
export function initVoices(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return;
  }

  // Try to get voices immediately
  cachedVoices = speechSynthesis.getVoices();
  if (cachedVoices.length > 0) {
    voicesLoaded = true;
  }

  // Also listen for voiceschanged event (fires when voices are ready)
  speechSynthesis.addEventListener('voiceschanged', () => {
    cachedVoices = speechSynthesis.getVoices();
    voicesLoaded = true;
  });
}

// Speak a creepy robotic voice when firewall eyes spawn
export function speakFirewallVoice(): void {
  speakCustomFirewallVoice(uiRandomPick(FIREWALL_PHRASES));
}

// Speak a specific phrase in creepy robotic voice
export function speakCustomFirewallVoice(phrase: string): void {
  // Check if speech synthesis is available
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return;
  }

  // Cancel any ongoing speech first
  speechSynthesis.cancel();

  // Helper to configure and speak an utterance
  const doSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.pitch = 0.3; // Very low/deep
    utterance.rate = 0.5; // Very slow for creepy effect
    utterance.volume = 1.0; // Full volume

    // Always try to get fresh voices if cache is empty
    let voices = cachedVoices;
    if (!voices.length) {
      voices = speechSynthesis.getVoices();
      if (voices.length) {
        cachedVoices = voices;
        voicesLoaded = true;
      }
    }

    // Try to find a deep/male voice
    const deepVoice = voices.find(
      v =>
        v.name.toLowerCase().includes('male') ||
        v.name.includes('Daniel') ||
        v.name.includes('Google UK English Male')
    );
    if (deepVoice) {
      utterance.voice = deepVoice;
    }

    speechSynthesis.speak(utterance);
  };

  // If voices aren't loaded yet, wait for them then speak
  if (!voicesLoaded && speechSynthesis.getVoices().length === 0) {
    const onVoicesReady = () => {
      cachedVoices = speechSynthesis.getVoices();
      voicesLoaded = true;
      speechSynthesis.removeEventListener('voiceschanged', onVoicesReady);
      doSpeak();
    };
    speechSynthesis.addEventListener('voiceschanged', onVoicesReady);
    // Fallback: speak after a short delay even without voices
    setTimeout(() => {
      speechSynthesis.removeEventListener('voiceschanged', onVoicesReady);
      doSpeak();
    }, 300);
  } else {
    // Voices available — small delay for Chrome bug workaround
    setTimeout(doSpeak, 100);
  }
}

// Export constants for use elsewhere
export {
  DETECTION_THRESHOLD,
  DETECTION_INCREASE_ON_DETONATE,
  EYE_LIFETIME_MS,
  BATCH_SIZE,
  FIREWALL_EYE_BATCH_SIZES,
  FIREWALL_EYE_BATCH_THRESHOLDS,
  SPAWN_COOLDOWN_MS,
};
