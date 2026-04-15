// Achievement definitions and tracking

import { translateStatic } from '../i18n';
import { safeGetJSON, safeSetJSON, safeRemoveItem } from '../storage/safeStorage';
import { unlockAchievement as steamUnlockAchievement } from '../lib/steamBridge';
import type { EndingId } from './endings';

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

const DOSSIER_ENDING_ACHIEVEMENTS = [
  ['ridiculed', 'Ridiculed', 'Reach the ending where the dossier is dismissed as noise', '📰'],
  ['ufo74_exposed', 'UFO74 Exposed', "Reveal UFO74's identity to the world", '📡'],
  [
    'the_2026_warning',
    'The 2026 Warning',
    'Publish the convergence warning before the next window opens',
    '⏳',
  ],
  [
    'government_scandal',
    'Government Scandal',
    'Expose the military cover-up as a national scandal',
    '⚖️',
  ],
  [
    'prisoner_45_freed',
    'Prisoner 45 Freed',
    'Reveal the containment of Prisoner 45',
    '🔓',
  ],
  [
    'harvest_understood',
    'Harvest Understood',
    'Expose the colonization and extraction model',
    '🌾',
  ],
  [
    'nothing_changes',
    'Nothing Changes',
    'Prove the truth, only to watch the world move on',
    '🕳️',
  ],
  [
    'incomplete_picture',
    'Incomplete Picture',
    'Reach an ending with real evidence but no coherent case',
    '🧩',
  ],
  [
    'wrong_story',
    'The Wrong Story',
    'Expose a scandal while missing the truth underneath',
    '🧾',
  ],
  ['hackerkid_caught', 'HackerKid Caught', 'Trigger the honeypot ending', '🚨'],
  [
    'secret_ending',
    'The Ferreira Protocol',
    "Assemble UFO74's full protocol and secure the secret ending",
    '🔐',
  ],
  [
    'real_ending',
    'Undeniable',
    'Assemble the dossier that forces a renewed investigation',
    '🌐',
  ],
] as const satisfies ReadonlyArray<readonly [EndingId, string, string, string]>;

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
    'first_blood',
    'first_blood',
    'First Blood',
    'Save your first file to the dossier',
    '🩸'
  ),
  createAchievement(
    'survivor',
    'survivor',
    'Survivor',
    'Complete the game after reaching critical detection',
    '🎖️'
  ),
  createAchievement(
    'truth_seeker',
    'truth_seeker',
    'Truth Seeker',
    'Save 10 files to the dossier',
    '👁️'
  ),
  createAchievement('doom_fan', 'doom_fan', 'IDDQD', 'Activate god mode', '🎮', true),
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
  ...DOSSIER_ENDING_ACHIEVEMENTS.map(([id, fallbackName, fallbackDescription, icon]) =>
    createAchievement(`ending_${id}`, `ending_${id}`, fallbackName, fallbackDescription, icon, true)
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
