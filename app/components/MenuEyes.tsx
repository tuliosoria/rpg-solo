'use client';

import React from 'react';
import styles from './MenuEyes.module.css';

const EYE_COUNT = 7;
const ORBIT_DURATION_S = 80;

/**
 * Seven white-glow watcher eyes that drift slowly around the perimeter
 * of the menu. Decorative only — no interaction, no audio.
 */
export default function MenuEyes() {
  return (
    <div className={styles.eyesLayer} aria-hidden="true">
      {Array.from({ length: EYE_COUNT }).map((_, i) => {
        // Spread eyes evenly around the orbit using negative animation-delay.
        const offset = (ORBIT_DURATION_S / EYE_COUNT) * i;
        return (
          <div
            key={`menu-eye-${i}`}
            className={`${styles.eye} ${styles.blink}`}
            style={{
              animationDelay: `-${offset.toFixed(2)}s, -${(i * 0.6).toFixed(2)}s, -${(i * 1.1).toFixed(2)}s`,
            }}
          >
            <div className={styles.eyeSocket}>
              <div className={styles.iris}>
                <div className={styles.pupil} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
