// Achievement definitions and tracking

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
    id: 'speed_runner',
    name: 'Speed Runner',
    description: 'Complete the game in under 50 commands',
    icon: '🏃',
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
    id: 'ghost_protocol',
    name: 'Ghost',
    description: 'Complete the game with detection under 30%',
    icon: '🕵️',
    secret: true,
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Play for over 30 minutes in a single session',
    icon: '🦉',
    secret: true,
  },
  {
    id: 'completionist_hidden',
    name: 'Completionist',
    description: 'Read every readable file in the system',
    icon: '📖',
    secret: true,
  },
];

// Storage key for achievements
const ACHIEVEMENTS_KEY = 'rpg-solo-achievements';

// Get unlocked achievements from localStorage
export function getUnlockedAchievements(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  
  try {
    const stored = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch {
    // Ignore errors
  }
  return new Set();
}

// Save unlocked achievements to localStorage
export function saveAchievements(achievements: Set<string>): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify([...achievements]));
  } catch {
    // Ignore errors
  }
}

// Unlock an achievement
export function unlockAchievement(id: string): { achievement: Achievement; isNew: boolean } | null {
  const achievement = ACHIEVEMENTS.find(a => a.id === id);
  if (!achievement) return null;
  
  const unlocked = getUnlockedAchievements();
  const isNew = !unlocked.has(id);
  
  if (isNew) {
    unlocked.add(id);
    saveAchievements(unlocked);
  }
  
  return { achievement, isNew };
}

// Clear all achievements (for testing)
export function clearAchievements(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACHIEVEMENTS_KEY);
}

// Get achievement by ID
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
