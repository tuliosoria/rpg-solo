'use client';

/**
 * Memoized selectors for game state to reduce re-renders.
 * Use these instead of accessing gameState directly in components.
 */

import { useMemo } from 'react';
import { GameState } from '../types';
import { DETECTION_THRESHOLDS } from '../constants/detection';
import { MAX_WRONG_ATTEMPTS } from '../constants/gameplay';

/**
 * Get memoized risk level info
 */
export function useRiskLevel(detectionLevel: number) {
  return useMemo(() => {
    const percent = `${detectionLevel}%`;
    if (detectionLevel >= 80) return { level: `CRITICAL ${percent}`, color: 'critical' as const };
    if (detectionLevel >= 60) return { level: `HIGH ${percent}`, color: 'high' as const };
    if (detectionLevel >= 40) return { level: `ELEVATED ${percent}`, color: 'elevated' as const };
    if (detectionLevel >= 20) return { level: `LOW ${percent}`, color: 'low' as const };
    return { level: `MINIMAL ${percent}`, color: 'minimal' as const };
  }, [detectionLevel]);
}

/**
 * Get memoized status bar content
 */
export function useStatusBar(gameState: GameState) {
  return useMemo(() => {
    const parts: string[] = [];

    if (gameState.detectionLevel >= DETECTION_THRESHOLDS.SUSPICIOUS) {
      parts.push('AUDIT: ACTIVE');
    }
    if (gameState.sessionStability < 50) {
      parts.push('SESSION: UNSTABLE');
    }
    if (gameState.flags.adminUnlocked) {
      parts.push('ACCESS: ADMIN');
    }
    if (gameState.paranoiaLevel >= 40) {
      parts.push('PARANOIA: ELEVATED');
    } else if (gameState.paranoiaLevel >= 15) {
      parts.push('PARANOIA: ACTIVE');
    }
    if (gameState.isGameOver) {
      parts.push(gameState.gameOverReason || 'TERMINATED');
    }

    return parts.join(' │ ') || 'SYSTEM NOMINAL';
  }, [
    gameState.detectionLevel,
    gameState.sessionStability,
    gameState.flags.adminUnlocked,
    gameState.paranoiaLevel,
    gameState.isGameOver,
    gameState.gameOverReason,
  ]);
}

/**
 * Get memoized save indicator
 */
export function useSaveIndicator(lastSaveTime: number | undefined) {
  return useMemo(() => {
    if (!lastSaveTime) return null;
    const elapsed = Math.floor((Date.now() - lastSaveTime) / 60000);
    if (elapsed < 1) return 'Saved: <1m ago';
    if (elapsed < 60) return `Saved: ${elapsed}m ago`;
    const hours = Math.floor(elapsed / 60);
    return `Saved: ${hours}h ago`;
  }, [lastSaveTime]);
}

/**
 * Get memoized evidence discovery state
 */
export function useEvidenceState(truthsDiscovered: Set<string> | undefined) {
  return useMemo(() => {
    const discovered = truthsDiscovered ?? new Set<string>();
    const categories = [
      'debris_relocation',
      'being_containment', 
      'telepathic_scouts',
      'international_actors',
      'transition_2026',
    ] as const;
    
    return {
      count: discovered.size,
      categories: categories.map(cat => ({
        id: cat,
        discovered: discovered.has(cat),
        symbol: discovered.has(cat) ? '●' : '□',
      })),
    };
  }, [truthsDiscovered]);
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
    eyeCount: gameState.firewallEyes.length,
    lastSpawnTime: gameState.lastEyeSpawnTime,
  }), [
    gameState.firewallActive,
    gameState.firewallDisarmed,
    gameState.firewallEyes.length,
    gameState.lastEyeSpawnTime,
  ]);
}
