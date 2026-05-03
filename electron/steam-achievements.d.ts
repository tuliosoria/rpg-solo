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
  first_blood: string;
  survivor: string;
  truth_seeker: string;
  doom_fan: string;
  archivist: string;
  paranoid: string;
  night_owl: string;
  liberator: string;
  whistleblower: string;
  linked: string;
  revelator: string;
  ending_ridiculed: string;
  ending_ufo74_exposed: string;
  ending_the_2026_warning: string;
  ending_government_scandal: string;
  ending_prisoner_45_freed: string;
  ending_harvest_understood: string;
  ending_nothing_changes: string;
  ending_incomplete_picture: string;
  ending_wrong_story: string;
  ending_hackerkid_caught: string;
  ending_secret_ending: string;
  ending_real_ending: string;
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
