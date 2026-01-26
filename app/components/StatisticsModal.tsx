'use client';

import React, { memo } from 'react';
import { getStatistics, formatPlaytime } from '../storage/statistics';
import styles from './StatisticsModal.module.css';

interface StatisticsModalProps {
  onCloseAction: () => void;
}

export default memo(function StatisticsModal({ onCloseAction }: StatisticsModalProps) {
  const stats = getStatistics();

  const totalEndings =
    stats.endingsAchieved.good +
    stats.endingsAchieved.bad +
    stats.endingsAchieved.neutral +
    stats.endingsAchieved.secret;

  return (
    <div className={styles.overlay} onClick={onCloseAction}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>STATISTICS</h2>
          <div className={styles.line}>═══════════════════════════</div>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>SESSION DATA</div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Total Playtime</span>
              <span className={styles.statValue}>{formatPlaytime(stats.totalPlaytime)}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Games Started</span>
              <span className={styles.statValue}>{stats.gamesPlayed}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Games Completed</span>
              <span className={styles.statValue}>{stats.gamesCompleted}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Commands Typed</span>
              <span className={styles.statValue}>{stats.commandsTyped}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Files Read</span>
              <span className={styles.statValue}>{stats.filesRead}</span>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>ENDINGS ACHIEVED</div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>🏆 Good Ending</span>
              <span className={styles.statValue}>{stats.endingsAchieved.good}x</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>💀 Bad Ending</span>
              <span className={styles.statValue}>{stats.endingsAchieved.bad}x</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>🚪 Neutral Ending</span>
              <span className={styles.statValue}>{stats.endingsAchieved.neutral}x</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>🔮 Secret Ending</span>
              <span className={styles.statValue}>{stats.endingsAchieved.secret}x</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Total Endings</span>
              <span className={styles.statValue}>{totalEndings}</span>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>RECORDS</div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Highest Detection Survived</span>
              <span className={styles.statValue}>{stats.highestDetectionSurvived}%</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Fastest Completion</span>
              <span className={styles.statValue}>
                {stats.fastestCompletion !== null ? `${stats.fastestCompletion} commands` : '—'}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.closeButton} onClick={onCloseAction}>
            [ CLOSE ]
          </button>
        </div>
      </div>
    </div>
  );
});
