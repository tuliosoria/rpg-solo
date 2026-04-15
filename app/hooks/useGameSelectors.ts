'use client';

/**
 * Memoized selectors for game state to reduce re-renders.
 * Use these instead of accessing gameState directly in components.
 */

import { useMemo } from 'react';
import { useI18n } from '../i18n';
import { GameState } from '../types';
import { DETECTION_THRESHOLDS } from '../constants/detection';
import { MAX_WRONG_ATTEMPTS } from '../constants/gameplay';

/**
 * Get memoized risk level info
 */
export function useRiskLevel(detectionLevel: number) {
  const { t } = useI18n();

  return useMemo(() => {
    const percent = `${detectionLevel}%`;
    if (detectionLevel >= 80) {
      return { level: t('terminal.risk.critical', { percent }), color: 'critical' as const };
    }
    if (detectionLevel >= 60) {
      return { level: t('terminal.risk.high', { percent }), color: 'high' as const };
    }
    if (detectionLevel >= 40) {
      return { level: t('terminal.risk.elevated', { percent }), color: 'elevated' as const };
    }
    if (detectionLevel >= 20) {
      return { level: t('terminal.risk.low', { percent }), color: 'low' as const };
    }
    return { level: t('terminal.risk.minimal', { percent }), color: 'minimal' as const };
  }, [detectionLevel, t]);
}

/**
 * Get memoized status bar content
 */
export function useStatusBar(gameState: GameState) {
  const { t, translateRuntimeText } = useI18n();

  return useMemo(() => {
    const parts: string[] = [];

    if (gameState.detectionLevel >= DETECTION_THRESHOLDS.SUSPICIOUS) {
      parts.push(t('terminal.status.auditActive'));
    }
    if (gameState.sessionStability < 50) {
      parts.push(t('terminal.status.sessionUnstable'));
    }
    if (gameState.flags.adminUnlocked) {
      parts.push(t('terminal.status.accessAdmin'));
    }
    if (gameState.paranoiaLevel >= 40) {
      parts.push(t('terminal.status.paranoiaElevated'));
    } else if (gameState.paranoiaLevel >= 15) {
      parts.push(t('terminal.status.paranoiaActive'));
    }
    if (gameState.isGameOver) {
      parts.push(
        gameState.gameOverReason
          ? translateRuntimeText(gameState.gameOverReason)
          : t('terminal.status.terminated')
      );
    }

    return parts.join(' │ ') || t('terminal.status.systemNominal');
  }, [
    gameState.detectionLevel,
    gameState.sessionStability,
    gameState.flags.adminUnlocked,
    gameState.paranoiaLevel,
    gameState.isGameOver,
    gameState.gameOverReason,
    t,
    translateRuntimeText,
  ]);
}

/**
 * Get memoized save indicator
 */
export function useSaveIndicator(lastSaveTime: number | undefined) {
  const { t } = useI18n();

  return useMemo(() => {
    if (!lastSaveTime) return null;
    const elapsed = Math.floor((Date.now() - lastSaveTime) / 60000);
    if (elapsed < 1) return t('terminal.save.justNow');
    if (elapsed < 60) return t('terminal.save.minutes', { value: elapsed });
    const hours = Math.floor(elapsed / 60);
    return t('terminal.save.hours', { value: hours });
  }, [lastSaveTime, t]);
}

/**
 * Get memoized evidence discovery state
 */
export function useEvidenceState(evidenceCount: number | undefined) {
  return useMemo(() => {
    const count = evidenceCount ?? 0;
    
    return {
      count,
    };
  }, [evidenceCount]);
}

/**
 * Get memoized attempts display
 */
export function useAttemptsDisplay(legacyAlertCounter: number) {
  return useMemo(() => {
    const attempts = legacyAlertCounter || 0;
    return `${attempts}/${MAX_WRONG_ATTEMPTS}`;
  }, [legacyAlertCounter]);
}

/**
 * Check if file reading suppression is active
 */
export function useIsReadingFile(isReadingFile: boolean, lastFileReadTime: number | undefined) {
  return useMemo(() => {
    const FILE_READ_COOLDOWN_MS = 15000;
    return Boolean(
      isReadingFile && 
      lastFileReadTime && 
      (Date.now() - lastFileReadTime < FILE_READ_COOLDOWN_MS)
    );
  }, [isReadingFile, lastFileReadTime]);
}

/**
 * Get memoized firewall state
 */
export function useFirewallState(gameState: GameState) {
  return useMemo(() => ({
    active: gameState.firewallActive,
    disarmed: gameState.firewallDisarmed,
  }), [
    gameState.firewallActive,
    gameState.firewallDisarmed,
  ]);
}
