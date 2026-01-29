'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { FirewallEye } from '../types';
import { uiRandom } from '../engine/rng';
import styles from './FirewallEyes.module.css';

// Configuration
const EYE_LIFETIME_MS = 8000; // Time before eye detonates (8 seconds)
const EYE_WARNING_MS = 2000; // Time before detonation when eye starts pulsing
const DETECTION_THRESHOLD = 25; // Detection level when firewall activates
const BATCH_SIZE = 5; // Spawn 5 eyes at once
const SPAWN_COOLDOWN_MS = 60000; // 1 minute cooldown between spawns
const DETECTION_INCREASE_ON_DETONATE = 5; // Risk increase when eye detonates

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
  const detonationTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
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

  // Random position avoiding edges and UI elements
  const x = 10 + uiRandom() * 80; // 10-90% horizontal
  const y = 20 + uiRandom() * 60; // 20-80% vertical (avoid header/footer)

  return {
    id: `eye-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    x,
    y,
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

// Export constants for use elsewhere
export {
  DETECTION_THRESHOLD,
  DETECTION_INCREASE_ON_DETONATE,
  EYE_LIFETIME_MS,
  BATCH_SIZE,
  SPAWN_COOLDOWN_MS,
};
