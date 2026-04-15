'use client';

import React, { memo, useRef, useEffect, useCallback } from 'react';
import { getStatistics, formatPlaytime } from '../../storage/statistics';
import { useI18n } from '../../i18n';
import { useFocusTrap } from '../../hooks';
import styles from './StatisticsModal.module.css';

interface StatisticsModalProps {
  onCloseAction: () => void;
}

export default memo(function StatisticsModal({ onCloseAction }: StatisticsModalProps) {
  const { t } = useI18n();
  const stats = getStatistics();
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseAction();
      }
    },
    [onCloseAction]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const totalEndings =
    stats.endingsAchieved.good +
    stats.endingsAchieved.bad +
    stats.endingsAchieved.neutral +
    stats.endingsAchieved.secret;

  return (
    <div className={styles.overlay} onClick={onCloseAction} role="dialog" aria-modal="true" aria-labelledby="statistics-title">
      <div className={styles.modal} ref={modalRef} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="statistics-title">{t('stats.title')}</h2>
          <div className={styles.line}>═══════════════════════════</div>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>{t('stats.section.session')}</div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>{t('stats.totalPlaytime')}</span>
              <span className={styles.statValue}>{formatPlaytime(stats.totalPlaytime)}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>{t('stats.gamesStarted')}</span>
              <span className={styles.statValue}>{stats.gamesPlayed}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>{t('stats.gamesCompleted')}</span>
              <span className={styles.statValue}>{stats.gamesCompleted}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>{t('stats.commandsTyped')}</span>
              <span className={styles.statValue}>{stats.commandsTyped}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>{t('stats.filesRead')}</span>
              <span className={styles.statValue}>{stats.filesRead}</span>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>{t('stats.section.endings')}</div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>{t('stats.goodEnding')}</span>
              <span className={styles.statValue}>{stats.endingsAchieved.good}x</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>{t('stats.badEnding')}</span>
              <span className={styles.statValue}>{stats.endingsAchieved.bad}x</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>{t('stats.neutralEnding')}</span>
              <span className={styles.statValue}>{stats.endingsAchieved.neutral}x</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>{t('stats.secretEnding')}</span>
              <span className={styles.statValue}>{stats.endingsAchieved.secret}x</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>{t('stats.totalEndings')}</span>
              <span className={styles.statValue}>{totalEndings}</span>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>{t('stats.section.records')}</div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>{t('stats.highestDetection')}</span>
              <span className={styles.statValue}>{stats.highestDetectionSurvived}%</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>{t('stats.fastestCompletion')}</span>
              <span className={styles.statValue}>
                {stats.fastestCompletion !== null
                  ? `${stats.fastestCompletion} ${t('stats.commandsSuffix')}`
                  : t('stats.none')}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.closeButton}
            tabIndex={0}
            onMouseDown={e => e.preventDefault()}
            onClick={onCloseAction}
          >
            {t('stats.close')}
          </button>
        </div>
      </div>
    </div>
  );
});
