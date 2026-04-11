'use client';

import React, { memo } from 'react';
import { ACHIEVEMENTS, getUnlockedAchievements } from '../engine/achievements';
import { useI18n } from '../i18n';
import styles from './AchievementGallery.module.css';

interface AchievementGalleryProps {
  onCloseAction: () => void;
}

export default memo(function AchievementGallery({ onCloseAction }: AchievementGalleryProps) {
  const { t, translateRuntimeText } = useI18n();
  const unlockedIds = getUnlockedAchievements();

  const visibleAchievements = ACHIEVEMENTS.map(achievement => {
    const isUnlocked = unlockedIds.has(achievement.id);
    const isSecret = achievement.secret && !isUnlocked;

    return {
      ...achievement,
      isUnlocked,
      displayName: isSecret ? t('achievement.gallery.secretName') : translateRuntimeText(achievement.name),
      displayDescription: isSecret
        ? t('achievement.gallery.secretDescription')
        : translateRuntimeText(achievement.description),
      displayIcon: isSecret ? '🔒' : achievement.icon,
    };
  });

  const unlockedCount = visibleAchievements.filter(a => a.isUnlocked).length;
  const totalCount = ACHIEVEMENTS.length;

  return (
    <div className={styles.overlay} onClick={onCloseAction} role="dialog" aria-modal="true" aria-labelledby="achievements-title">
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="achievements-title">{t('achievement.gallery.title')}</h2>
          <div className={styles.line}>═══════════════════════════</div>
          <div className={styles.progress}>
            {t('achievement.gallery.progress', { unlocked: unlockedCount, total: totalCount })}
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
            tabIndex={-1}
            onMouseDown={e => e.preventDefault()}
            onClick={onCloseAction}
          >
            {t('achievement.gallery.close')}
          </button>
        </div>
      </div>
    </div>
  );
});
