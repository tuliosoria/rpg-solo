// Achievement definitions and tracking

import { translateStatic } from '../i18n';
import { safeGetJSON, safeSetJSON, safeRemoveItem } from '../storage/safeStorage';
import { unlockAchievement as steamUnlockAchievement } from '../lib/steamBridge';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji or ASCII art
  secret?: boolean; // Hidden until unlocked
}

function createAchievement(
  id: string,
  key: string,
  fallbackName: string,
  fallbackDescription: string,
  icon: string,
  secret: boolean = false
): Achievement {
  return {
    id,
    get name() {
      return translateStatic(`engine.achievements.${key}.name`, undefined, fallbackName);
    },
    get description() {
      return translateStatic(
        `engine.achievements.${key}.description`,
        undefined,
        fallbackDescription
      );
    },
    icon,
    ...(secret ? { secret: true } : {}),
  };
}

export const ACHIEVEMENTS: Achievement[] = [
  createAchievement(
    'speed_demon',
    'speed_demon',
    'Speed Demon',
    'Complete the game in under 50 commands',
    '⚡'
  ),
  createAchievement(
    'ghost',
    'ghost',
    'Ghost Protocol',
    'Win with detection level under 20%',
    '👻'
  ),
  createAchievement(
    'completionist',
    'completionist',
    'Completionist',
    'Read every accessible file in the system',
    '📚'
  ),
  createAchievement(
    'pacifist',
    'pacifist',
    'Pacifist',
    'Never trigger a warning or alert',
    '🕊️'
  ),
  createAchievement(
    'curious',
    'curious',
    'Curious Mind',
    'Find all easter eggs',
    '🔍'
  ),
  createAchievement(
    'first_blood',
    'first_blood',
    'First Blood',
    'Discover your first evidence',
    '🩸'
  ),
  createAchievement(
    'hacker',
    'hacker',
    'Elite Hacker',
    'Decrypt 5 encrypted files',
    '💀'
  ),
  createAchievement(
    'survivor',
    'survivor',
    'Survivor',
    'Complete the game after reaching critical detection',
    '🎖️'
  ),
  createAchievement(
    'mathematician',
    'mathematician',
    'Mathematician',
    'Solve all equations on first try',
    '🧮'
  ),
  createAchievement(
    'truth_seeker',
    'truth_seeker',
    'Truth Seeker',
    'Collect 10 evidence files',
    '👁️'
  ),
  createAchievement('doom_fan', 'doom_fan', 'IDDQD', 'Activate god mode', '🎮', true),
  createAchievement(
    'persistent',
    'persistent',
    'Persistent',
    'Continue playing after a game over',
    '💪'
  ),
  // Hidden achievements
  createAchievement(
    'archivist',
    'archivist',
    'Archivist',
    'Read every file in a folder with 3+ files',
    '📁',
    true
  ),
  createAchievement(
    'paranoid',
    'paranoid',
    'Paranoid',
    'Check system status 10+ times',
    '👀',
    true
  ),
  createAchievement(
    'bookworm',
    'bookworm',
    'Bookworm',
    'Bookmark 5+ files',
    '🔖',
    true
  ),
  createAchievement(
    'night_owl',
    'night_owl',
    'Night Owl',
    'Play for over 30 minutes in a single session',
    '🦉',
    true
  ),
  // Multiple endings achievements
  createAchievement(
    'liberator',
    'liberator',
    'Liberator',
    'Release ALPHA from containment',
    '🛸',
    true
  ),
  createAchievement(
    'whistleblower',
    'whistleblower',
    'Whistleblower',
    'Leak the conspiracy files to the world',
    '📢',
    true
  ),
  createAchievement(
    'linked',
    'linked',
    'Neural Link',
    'Connect to the alien consciousness',
    '🧠',
    true
  ),
  createAchievement(
    'revelator',
    'revelator',
    'Complete Revelation',
    'Achieve the ultimate ending with all modifiers',
    '✨',
    true
  ),
  // Individual ending achievements (one per ending variant)
  createAchievement(
    'ending_controlled_disclosure',
    'ending_controlled_disclosure',
    'Controlled Disclosure',
    'Complete the game with a clean leak',
    '📰',
    true
  ),
  createAchievement(
    'ending_global_panic',
    'ending_global_panic',
    'Global Panic',
    'Leak conspiracy files and watch the world burn',
    '🔥',
    true
  ),
  createAchievement(
    'ending_undeniable_confirmation',
    'ending_undeniable_confirmation',
    'Undeniable Proof',
    'Release ALPHA and prove aliens exist',
    '👽',
    true
  ),
  createAchievement(
    'ending_total_collapse',
    'ending_total_collapse',
    'Total Collapse',
    'Release ALPHA and leak conspiracies',
    '💥',
    true
  ),
  createAchievement(
    'ending_personal_contamination',
    'ending_personal_contamination',
    'Personal Contamination',
    'Use the neural link and feel the alien presence',
    '🧠',
    true
  ),
  createAchievement(
    'ending_paranoid_awakening',
    'ending_paranoid_awakening',
    'Paranoid Awakening',
    'Leak conspiracies while neurally linked',
    '👁️',
    true
  ),
  createAchievement(
    'ending_witnessed_truth',
    'ending_witnessed_truth',
    'Witnessed Truth',
    'Release ALPHA while neurally linked',
    '🌌',
    true
  ),
];

const VALID_ACHIEVEMENT_IDS = new Set(ACHIEVEMENTS.map(a => a.id));

// Storage key for achievements
const ACHIEVEMENTS_KEY = 'rpg-solo-achievements';

/**
 * Retrieves the set of unlocked achievement IDs from localStorage.
 * @returns Set of achievement IDs that have been unlocked
 */
export function getUnlockedAchievements(): Set<string> {
  const stored = safeGetJSON<string[]>(ACHIEVEMENTS_KEY, []);
  const filtered = stored.filter(id => VALID_ACHIEVEMENT_IDS.has(id));
  return new Set(filtered);
}

/**
 * Persists the set of unlocked achievements to localStorage.
 * @param achievements - Set of achievement IDs to save
 */
export function saveAchievements(achievements: Set<string>): void {
  const filtered = [...achievements].filter(id => VALID_ACHIEVEMENT_IDS.has(id));
  safeSetJSON(ACHIEVEMENTS_KEY, filtered);
}

/**
 * Unlocks an achievement by ID if not already unlocked.
 * Also syncs the achievement to Steam when available.
 * @param id - The achievement ID to unlock
 * @returns Object with achievement details and whether it was newly unlocked, or null if invalid ID
 */
export function unlockAchievement(id: string): { achievement: Achievement; isNew: boolean } | null {
  const achievement = ACHIEVEMENTS.find(a => a.id === id);
  if (!achievement) return null;

  const unlocked = getUnlockedAchievements();
  const isNew = !unlocked.has(id);

  if (isNew) {
    unlocked.add(id);
    saveAchievements(unlocked);

    // Sync to Steam when available (fire and forget)
    if (typeof window !== 'undefined') {
      steamUnlockAchievement(id).catch(e => {
        // eslint-disable-next-line no-console
        console.error('Steam achievement sync failed:', e);
      });
    }
  }

  return { achievement, isNew };
}

/**
 * Clears all unlocked achievements from storage (for testing).
 */
export function clearAchievements(): void {
  safeRemoveItem(ACHIEVEMENTS_KEY);
}

/**
 * Retrieves an achievement definition by its ID.
 * @param id - The achievement ID to look up
 * @returns The achievement definition, or undefined if not found
 */
export function getAchievement(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}

// Get all achievements with unlock status
export function getAllAchievementsWithStatus(): (Achievement & { unlocked: boolean })[] {
  const unlocked = getUnlockedAchievements();
  return ACHIEVEMENTS.map(a => ({
    ...a,
    unlocked: unlocked.has(a.id),
  }));
}
