/**
 * Type definitions for Steam Achievements Bridge
 */

export interface SteamClient {
  achievement?: {
    isActivated(name: string): boolean;
    activate(name: string): boolean;
    clear(name: string): boolean;
  } | null;
}

export interface AchievementMap {
  [key: string]: string;
  speed_demon: string;
  ghost: string;
  completionist: string;
  pacifist: string;
  curious: string;
  first_blood: string;
  hacker: string;
  survivor: string;
  mathematician: string;
  truth_seeker: string;
  doom_fan: string;
  persistent: string;
  archivist: string;
  paranoid: string;
  bookworm: string;
  night_owl: string;
}

export interface UnlockResult {
  success: boolean;
  alreadyUnlocked?: boolean;
  steamName?: string;
  error?: string;
}

export interface IsUnlockedResult {
  success: boolean;
  unlocked: boolean;
  error?: string;
}

export interface ClearResult {
  success: boolean;
  error?: string;
}

export const ACHIEVEMENT_MAP: AchievementMap;

export function initialize(client: SteamClient | null): void;
export function isAvailable(): boolean;
export function getSteamAchievementName(gameAchievementId: string): string | null;
export function unlock(gameAchievementId: string): UnlockResult;
export function isUnlocked(gameAchievementId: string): IsUnlockedResult;
export function clear(gameAchievementId: string): ClearResult;
export function getAllMappedAchievements(): string[];
