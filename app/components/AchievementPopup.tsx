'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import styles from './AchievementPopup.module.css';
import { Achievement } from '../engine/achievements';
import { FloatingElement } from './FloatingUI';

interface AchievementPopupProps {
  achievement: Achievement;
  onDismiss: () => void;
}

function AchievementPopup({ achievement, onDismiss }: AchievementPopupProps) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerDismiss = useCallback(() => {
    if (exitTimerRef.current) {
      clearTimeout(exitTimerRef.current);
    }
    setExiting(true);
    exitTimerRef.current = setTimeout(onDismiss, 500);
  }, [onDismiss]);

  useEffect(() => {
    // Animate in
    showTimerRef.current = setTimeout(() => setVisible(true), 50);

    // Auto-dismiss after 4 seconds
    dismissTimerRef.current = setTimeout(() => {
      triggerDismiss();
    }, 4000);

    return () => {
      if (showTimerRef.current) {
        clearTimeout(showTimerRef.current);
      }
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
      if (exitTimerRef.current) {
        clearTimeout(exitTimerRef.current);
      }
    };
  }, [triggerDismiss]);

  return (
    <FloatingElement id="achievement-popup" zone="bottom-right" priority={2} baseOffset={32}>
      <div
        className={`${styles.popup} ${visible ? styles.visible : ''} ${exiting ? styles.exiting : ''}`}
        onClick={triggerDismiss}
      >
        <div className={styles.icon}>{achievement.icon}</div>
        <div className={styles.content}>
          <div className={styles.header}>ACHIEVEMENT UNLOCKED</div>
          <div className={styles.name}>{achievement.name}</div>
          <div className={styles.description}>{achievement.description}</div>
        </div>
      </div>
    </FloatingElement>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(AchievementPopup);
