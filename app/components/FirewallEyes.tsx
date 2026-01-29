'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { FirewallEye } from '../types';
import { uiRandom } from '../engine/rng';
import styles from './FirewallEyes.module.css';

// Configuration
const EYE_LIFETIME_MS = 8000; // Time before eye detonates (8 seconds)
const EYE_WARNING_MS = 2000; // Time before detonation when eye starts pulsing
const DETECTION_THRESHOLD = 25; // Detection level when firewall activates
const SPAWN_INCREMENT = 10; // Spawn new eye every 10% detection increase
const DETECTION_INCREASE_ON_DETONATE = 5; // Risk increase when eye detonates

interface FirewallEyesProps {
  detectionLevel: number;
  firewallActive: boolean;
  firewallDisarmed: boolean;
  eyes: FirewallEye[];
  lastEyeSpawnDetection: number;
  onEyeClick: (eyeId: string) => void;
  onEyeDetonate: (eyeId: string) => void;
  onSpawnEye: () => void;
  onActivateFirewall: () => void;
}

export default function FirewallEyes({
  detectionLevel,
  firewallActive,
  firewallDisarmed,
  eyes,
  lastEyeSpawnDetection,
  onEyeClick,
  onEyeDetonate,
  onSpawnEye,
  onActivateFirewall,
}: FirewallEyesProps) {
  const detonationTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Activate firewall when detection reaches threshold
  useEffect(() => {
    if (!firewallActive && !firewallDisarmed && detectionLevel >= DETECTION_THRESHOLD) {
      onActivateFirewall();
    }
  }, [detectionLevel, firewallActive, firewallDisarmed, onActivateFirewall]);

  // Spawn new eye at incremental detection thresholds
  useEffect(() => {
    if (!firewallActive || firewallDisarmed) return;

    // Calculate if we've crossed a new threshold
    // First spawn at 25%, then at 35%, 45%, 55%, etc.
    const thresholdsPassed = Math.floor((detectionLevel - DETECTION_THRESHOLD) / SPAWN_INCREMENT);
    const lastThresholdsPassed = Math.floor(
      (lastEyeSpawnDetection - DETECTION_THRESHOLD) / SPAWN_INCREMENT
    );

    if (thresholdsPassed > lastThresholdsPassed && thresholdsPassed >= 0) {
      onSpawnEye();
    }
  }, [detectionLevel, firewallActive, firewallDisarmed, lastEyeSpawnDetection, onSpawnEye]);

  // Set up detonation timers for each eye
  useEffect(() => {
    if (firewallDisarmed) {
      // Clear all timers if firewall is disarmed
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

    // Cleanup timers for removed eyes
    detonationTimersRef.current.forEach((timer, id) => {
      if (!eyes.find(e => e.id === id)) {
        clearTimeout(timer);
        detonationTimersRef.current.delete(id);
      }
    });

    return () => {
      // Cleanup on unmount
      detonationTimersRef.current.forEach(timer => clearTimeout(timer));
    };
  }, [eyes, firewallDisarmed, onEyeDetonate]);

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

// Export constants for use elsewhere
export { DETECTION_THRESHOLD, DETECTION_INCREASE_ON_DETONATE, EYE_LIFETIME_MS };
