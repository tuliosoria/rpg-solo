/**
 * Statistics Tracking and Persistence
 *
 * Tracks player progress and achievements across multiple play sessions:
 * - Total playtime and games played/completed
 * - Ending statistics (good/bad/neutral/secret)
 * - Performance records (fastest completion, highest detection survived)
 *
 * @module storage/statistics
 */

import { safeGetJSON, safeSetJSON, safeRemoveItem } from './safeStorage';

/**
 * Aggregate player statistics tracked across all sessions.
 */
export interface GameStatistics {
  totalPlaytime: number; // milliseconds
  gamesPlayed: number;
  gamesCompleted: number;
  filesRead: number;
  commandsTyped: number;
  endingsAchieved: {
    good: number;
    bad: number;
    neutral: number;
    secret: number;
  };
  highestDetectionSurvived: number;
  fastestCompletion: number | null; // commands, null if never completed
  lastPlayed: number; // timestamp
}

const STATISTICS_KEY = 'rpg-solo-statistics';

const DEFAULT_STATISTICS: GameStatistics = {
  totalPlaytime: 0,
  gamesPlayed: 0,
  gamesCompleted: 0,
  filesRead: 0,
  commandsTyped: 0,
  endingsAchieved: {
    good: 0,
    bad: 0,
    neutral: 0,
    secret: 0,
  },
  highestDetectionSurvived: 0,
  fastestCompletion: null,
  lastPlayed: 0,
};

/**
 * Retrieves all player statistics, merging with defaults for any missing fields.
 * @returns Complete GameStatistics object
 */
export function getStatistics(): GameStatistics {
  const stored = safeGetJSON<Partial<GameStatistics>>(STATISTICS_KEY, {});
  // Merge with defaults to handle new fields
  return { ...DEFAULT_STATISTICS, ...stored };
}

/**
 * Persists the complete statistics object to localStorage.
 * @param stats - The statistics to save
 */
export function saveStatistics(stats: GameStatistics): void {
  safeSetJSON(STATISTICS_KEY, stats);
}

/**
 * Partially updates statistics and saves to storage.
 * Automatically updates lastPlayed timestamp.
 * @param updates - Partial statistics to merge
 * @returns The updated complete statistics
 */
export function updateStatistics(updates: Partial<GameStatistics>): GameStatistics {
  const current = getStatistics();
  const updated = { ...current, ...updates, lastPlayed: Date.now() };
  saveStatistics(updated);
  return updated;
}

/**
 * Increments a numeric statistic by one.
 * @param key - The statistic key to increment
 */
export function incrementStatistic(
  key: keyof Pick<GameStatistics, 'gamesPlayed' | 'gamesCompleted' | 'filesRead' | 'commandsTyped'>
): void {
  const current = getStatistics();
  current[key]++;
  current.lastPlayed = Date.now();
  saveStatistics(current);
}

/**
 * Records a game ending with associated statistics.
 * Updates games completed, ending counts, and performance records.
 * @param type - The ending type achieved
 * @param commandCount - Total commands used in the session
 * @param detectionLevel - Final detection level at game end
 */
export function recordEnding(
  type: 'good' | 'bad' | 'neutral' | 'secret',
  commandCount: number,
  detectionLevel: number
): void {
  const current = getStatistics();
  current.endingsAchieved[type]++;
  current.gamesCompleted++;

  if (detectionLevel > current.highestDetectionSurvived) {
    current.highestDetectionSurvived = detectionLevel;
  }

  if (type === 'good' || type === 'secret') {
    if (current.fastestCompletion === null || commandCount < current.fastestCompletion) {
      current.fastestCompletion = commandCount;
    }
  }

  current.lastPlayed = Date.now();
  saveStatistics(current);
}

/**
 * Adds playtime to the cumulative total.
 * @param milliseconds - Time to add in milliseconds
 */
export function addPlaytime(milliseconds: number): void {
  const current = getStatistics();
  current.totalPlaytime += milliseconds;
  current.lastPlayed = Date.now();
  saveStatistics(current);
}

/**
 * Formats milliseconds into a human-readable duration string.
 * @param ms - Duration in milliseconds
 * @returns Formatted string like "2h 15m" or "45m"
 */
export function formatPlaytime(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Clears all statistics from storage (for testing).
 */
export function clearStatistics(): void {
  safeRemoveItem(STATISTICS_KEY);
}
