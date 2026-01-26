'use client';

import React, { useState, useEffect, memo } from 'react';
import styles from './AchievementPopup.module.css';
import { Achievement } from '../engine/achievements';

interface AchievementPopupProps {
  achievement: Achievement;
  onDismiss: () => void;
}

function AchievementPopup({ achievement, onDismiss }: AchievementPopupProps) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Animate in
    const showTimer = setTimeout(() => setVisible(true), 50);

    // Auto-dismiss after 4 seconds
    const dismissTimer = setTimeout(() => {
      setExiting(true);
      setTimeout(onDismiss, 500);
    }, 4000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(dismissTimer);
    };
  }, [onDismiss]);

  return (
    <div
      className={`${styles.popup} ${visible ? styles.visible : ''} ${exiting ? styles.exiting : ''}`}
      onClick={() => {
        setExiting(true);
        setTimeout(onDismiss, 500);
      }}
    >
      <div className={styles.icon}>{achievement.icon}</div>
      <div className={styles.content}>
        <div className={styles.header}>ACHIEVEMENT UNLOCKED</div>
        <div className={styles.name}>{achievement.name}</div>
        <div className={styles.description}>{achievement.description}</div>
      </div>
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(AchievementPopup);
