// Achievement definitions and tracking

import { safeGetJSON, safeSetJSON, safeRemoveItem } from '../storage/safeStorage';
import { unlockAchievement as steamUnlockAchievement } from '../lib/steamBridge';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji or ASCII art
  secret?: boolean; // Hidden until unlocked
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete the game in under 50 commands',
    icon: '⚡',
  },
  {
    id: 'ghost',
    name: 'Ghost Protocol',
    description: 'Win with detection level under 20%',
    icon: '👻',
  },
  {
    id: 'completionist',
    name: 'Completionist',
    description: 'Read every accessible file in the system',
    icon: '📚',
  },
  {
    id: 'pacifist',
    name: 'Pacifist',
    description: 'Never trigger a warning or alert',
    icon: '🕊️',
  },
  {
    id: 'curious',
    name: 'Curious Mind',
    description: 'Find all easter eggs',
    icon: '🔍',
  },
  {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Discover your first evidence',
    icon: '🩸',
  },
  {
    id: 'hacker',
    name: 'Elite Hacker',
    description: 'Decrypt 5 encrypted files',
    icon: '💀',
  },
  {
    id: 'survivor',
    name: 'Survivor',
    description: 'Complete the game after reaching critical detection',
    icon: '🎖️',
  },
  {
    id: 'mathematician',
    name: 'Mathematician',
    description: 'Solve all equations on first try',
    icon: '🧮',
  },
  {
    id: 'truth_seeker',
    name: 'Truth Seeker',
    description: 'Uncover all 5 truth categories',
    icon: '👁️',
  },
  {
    id: 'doom_fan',
    name: 'IDDQD',
    description: 'Activate god mode',
    icon: '🎮',
    secret: true,
  },
  {
    id: 'persistent',
    name: 'Persistent',
    description: 'Continue playing after a game over',
    icon: '💪',
  },
  // Hidden achievements
  {
    id: 'archivist',
    name: 'Archivist',
    description: 'Read every file in a folder with 3+ files',
    icon: '📁',
    secret: true,
  },
  {
    id: 'paranoid',
    name: 'Paranoid',
    description: 'Check system status 10+ times',
    icon: '👀',
    secret: true,
  },
  {
    id: 'bookworm',
    name: 'Bookworm',
    description: 'Bookmark 5+ files',
    icon: '🔖',
    secret: true,
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Play for over 30 minutes in a single session',
    icon: '🦉',
    secret: true,
  },
  // Multiple endings achievements
  {
    id: 'liberator',
    name: 'Liberator',
    description: 'Release Prisoner 46 from containment',
    icon: '🛸',
    secret: true,
  },
  {
    id: 'whistleblower',
    name: 'Whistleblower',
    description: 'Leak the conspiracy files to the world',
    icon: '📢',
    secret: true,
  },
  {
    id: 'linked',
    name: 'Neural Link',
    description: 'Connect to the alien consciousness',
    icon: '🧠',
    secret: true,
  },
  {
    id: 'revelator',
    name: 'Complete Revelation',
    description: 'Achieve the ultimate ending with all modifiers',
    icon: '✨',
    secret: true,
  },
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
