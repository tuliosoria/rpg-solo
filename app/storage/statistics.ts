// Statistics tracking and persistence

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

export function getStatistics(): GameStatistics {
  if (typeof window === 'undefined') return DEFAULT_STATISTICS;
  
  try {
    const stored = localStorage.getItem(STATISTICS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to handle new fields
      return { ...DEFAULT_STATISTICS, ...parsed };
    }
  } catch {
    // localStorage may be unavailable or corrupted
  }
  return DEFAULT_STATISTICS;
}

export function saveStatistics(stats: GameStatistics): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STATISTICS_KEY, JSON.stringify(stats));
  } catch {
    // localStorage may be full or unavailable
  }
}

export function updateStatistics(updates: Partial<GameStatistics>): GameStatistics {
  const current = getStatistics();
  const updated = { ...current, ...updates, lastPlayed: Date.now() };
  saveStatistics(updated);
  return updated;
}

export function incrementStatistic(key: keyof Pick<GameStatistics, 'gamesPlayed' | 'gamesCompleted' | 'filesRead' | 'commandsTyped'>): void {
  const current = getStatistics();
  current[key]++;
  current.lastPlayed = Date.now();
  saveStatistics(current);
}

export function recordEnding(type: 'good' | 'bad' | 'neutral' | 'secret', commandCount: number, detectionLevel: number): void {
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

export function addPlaytime(milliseconds: number): void {
  const current = getStatistics();
  current.totalPlaytime += milliseconds;
  current.lastPlayed = Date.now();
  saveStatistics(current);
}

export function formatPlaytime(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function clearStatistics(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STATISTICS_KEY);
  } catch {
    // localStorage may be unavailable
  }
}
