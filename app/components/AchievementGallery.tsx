'use client';

import React from 'react';
import { ACHIEVEMENTS, getUnlockedAchievements } from '../engine/achievements';
import styles from './AchievementGallery.module.css';

interface AchievementGalleryProps {
  onCloseAction: () => void;
}

export default function AchievementGallery({ onCloseAction }: AchievementGalleryProps) {
  const unlockedIds = getUnlockedAchievements();
  
  const visibleAchievements = ACHIEVEMENTS.map(achievement => {
    const isUnlocked = unlockedIds.has(achievement.id);
    const isSecret = achievement.secret && !isUnlocked;
    
    return {
      ...achievement,
      isUnlocked,
      displayName: isSecret ? '???' : achievement.name,
      displayDescription: isSecret ? 'Secret achievement' : achievement.description,
      displayIcon: isSecret ? '🔒' : achievement.icon,
    };
  });
  
  const unlockedCount = visibleAchievements.filter(a => a.isUnlocked).length;
  const totalCount = ACHIEVEMENTS.length;
  
  return (
    <div className={styles.overlay} onClick={onCloseAction}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>ACHIEVEMENTS</h2>
          <div className={styles.line}>═══════════════════════════</div>
          <div className={styles.progress}>
            {unlockedCount} / {totalCount} Unlocked
          </div>
        </div>
        
        <div className={styles.content}>
          <div className={styles.grid}>
            {visibleAchievements.map(achievement => (
              <div 
                key={achievement.id}
                className={`${styles.achievement} ${achievement.isUnlocked ? styles.unlocked : styles.locked}`}
              >
                <div className={styles.icon}>{achievement.displayIcon}</div>
                <div className={styles.info}>
                  <div className={styles.name}>{achievement.displayName}</div>
                  <div className={styles.description}>{achievement.displayDescription}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.actions}>
          <button 
            className={styles.closeButton}
            onClick={onCloseAction}
          >
            [ CLOSE ]
          </button>
        </div>
      </div>
    </div>
  );
}
