// Search Index System for Terminal 1996
// Provides keyword-based search across the filesystem with intentional imperfections

import { FileNode, FileTag, GameState } from '../types';
import { FILESYSTEM_ROOT } from '../data/filesystem';
import { createSeededRng } from './rng';

// Synonym mapping - allows related terms to find tagged files
// When user searches for a term, we also match files tagged with its synonyms
export const SEARCH_SYNONYMS: Record<string, FileTag[]> = {
  // Alien-related synonyms
  alien: ['creature', 'foreign', 'biological', 'specimen'],
  extraterrestrial: ['creature', 'foreign', 'biological', 'specimen'],
  et: ['creature', 'foreign', 'biological', 'specimen'],
  ufo: ['spacecraft', 'debris', 'crash', 'signal'],
  visitor: ['creature', 'foreign', 'biological'],
  entity: ['creature', 'biological', 'specimen'],
  being: ['creature', 'biological', 'specimen'],
  
  // Crash/debris synonyms
  wreckage: ['debris', 'crash', 'spacecraft', 'transport'],
  material: ['debris', 'spacecraft', 'specimen'],
  artifact: ['debris', 'spacecraft'],
  crash: ['crash', 'debris', 'spacecraft', 'transport'],
  recovery: ['debris', 'crash', 'transport', 'military'],
  
  // Medical/biological synonyms
  body: ['biological', 'autopsy', 'specimen', 'medical'],
  bodies: ['biological', 'autopsy', 'specimen', 'medical'],
  autopsy: ['autopsy', 'medical', 'biological', 'specimen'],
  dissection: ['autopsy', 'medical', 'biological'],
  specimen: ['specimen', 'biological', 'containment', 'medical'],
  tissue: ['biological', 'medical', 'specimen', 'autopsy'],
  dna: ['biological', 'medical', 'experiment'],
  
  // Containment synonyms
  prison: ['containment', 'security'],
  captured: ['containment', 'creature', 'biological'],
  held: ['containment', 'security'],
  facility: ['containment', 'military', 'security'],
  quarantine: ['containment', 'medical', 'biological'],
  
  // Communication/telepathy synonyms
  telepathy: ['telepathic', 'psi', 'neural', 'signal', 'communication'],
  psychic: ['telepathic', 'psi', 'neural'],
  mind: ['telepathic', 'psi', 'neural'],
  mental: ['telepathic', 'psi', 'neural'],
  signal: ['signal', 'communication', 'telepathic'],
  transmission: ['signal', 'communication'],
  intercept: ['signal', 'communication', 'military'],
  
  // Cover-up synonyms
  coverup: ['cover-up', 'government', 'military', 'classified'],
  conspiracy: ['cover-up', 'government', 'classified'],
  secret: ['cover-up', 'classified', 'security'],
  classified: ['classified', 'cover-up', 'military', 'security'],
  redacted: ['cover-up', 'classified'],
  hidden: ['cover-up', 'classified', 'security'],
  
  // Government/military synonyms
  army: ['military', 'government'],
  soldier: ['military'],
  government: ['government', 'military', 'cover-up'],
  official: ['government', 'administrative'],
  agency: ['government', 'military', 'security'],
  base: ['military', 'containment', 'security'],
  operation: ['military', 'government'],
  
  // Witness synonyms
  witness: ['witness', 'journalist'],
  testimony: ['witness'],
  sighting: ['witness', 'creature', 'spacecraft'],
  report: ['witness', 'military', 'administrative'],
  
  // International synonyms
  foreign: ['foreign', 'international', 'government'],
  international: ['international', 'foreign', 'government'],
  liaison: ['international', 'foreign', 'government'],
  treaty: ['international', 'foreign', 'government'],
  
  // Timeline/2026 synonyms
  future: ['2026', 'timeline'],
  transition: ['2026', 'timeline'],
  window: ['2026', 'timeline'],
  activation: ['2026', 'timeline'],
  prophecy: ['2026', 'timeline'],
  
  // Experiment synonyms
  experiment: ['experiment', 'medical', 'biological'],
  research: ['experiment', 'medical'],
  study: ['experiment', 'medical', 'biological'],
  lab: ['experiment', 'medical'],
  laboratory: ['experiment', 'medical'],
  test: ['experiment', 'medical'],
  
  // Surveillance synonyms
  camera: ['surveillance', 'security'],
  footage: ['surveillance', 'security'],
  recording: ['surveillance', 'security', 'signal'],
  monitoring: ['surveillance', 'security'],
  
  // Hospital synonyms
  hospital: ['hospital', 'medical'],
  humanitas: ['hospital', 'medical', 'creature'],
  doctor: ['hospital', 'medical'],
  nurse: ['hospital', 'medical'],
  patient: ['hospital', 'medical'],
  
  // Spacecraft synonyms
  craft: ['spacecraft', 'debris', 'crash'],
  ship: ['spacecraft', 'debris', 'crash', 'transport'],
  vehicle: ['spacecraft', 'transport'],
  
  // Neural/psi synonyms
  neural: ['neural', 'psi', 'telepathic', 'experiment'],
  brain: ['neural', 'psi', 'medical', 'biological'],
  consciousness: ['neural', 'psi', 'telepathic'],
  
  // Anomaly-related
  anomaly: ['creature', 'spacecraft', 'signal', 'telepathic'],
  strange: ['creature', 'spacecraft', 'signal'],
  unknown: ['creature', 'foreign', 'spacecraft'],
  unidentified: ['creature', 'spacecraft', 'signal'],
  
  // Varginha-specific
  varginha: ['crash', 'creature', 'witness', 'military', 'hospital'],
  janeiro: ['crash', 'timeline'],
  january: ['crash', 'timeline'],
  '1996': ['crash', 'timeline'],
  brazil: ['crash', 'military', 'government'],
  minas: ['crash', 'witness'],
};

// Corrupted entry variants for search results
const CORRUPTED_ENTRIES = [
  '[CORRUPTED ENTRY]',
  '??????.dat',
  '[DATA UNREADABLE]',
  '[INDEX CORRUPTED]',
  '%%ERROR_FILE%%',
  '[SECTOR DAMAGE]',
  '...???...',
];

interface FileWithTags {
  path: string;
  filename: string;
  tags: FileTag[];
}

/**
 * Recursively collects all files with their tags from the filesystem
 */
function collectAllFilesWithTags(
  node: typeof FILESYSTEM_ROOT,
  currentPath: string = ''
): FileWithTags[] {
  const files: FileWithTags[] = [];
  
  if (node.type === 'dir') {
    for (const [name, child] of Object.entries(node.children)) {
      const childPath = currentPath ? `${currentPath}/${name}` : `/${name}`;
      if (child.type === 'file') {
        const fileNode = child as FileNode;
        files.push({
          path: childPath,
          filename: name,
          tags: fileNode.tags || [],
        });
      } else {
        files.push(...collectAllFilesWithTags(child, childPath));
      }
    }
  }
  
  return files;
}

/**
 * Get tags that match a search keyword (including synonyms)
 */
function getMatchingTags(keyword: string): FileTag[] {
  const lowerKeyword = keyword.toLowerCase();
  
  // Direct tag match
  const directTags: FileTag[] = [];
  const allTags: FileTag[] = [
    'creature', 'foreign', 'biological', 'signal', 'debris', 'medical',
    'containment', 'telepathic', 'transport', 'cover-up', 'witness',
    'journalist', 'military', 'government', 'autopsy', 'spacecraft',
    'crash', 'communication', 'encryption', 'administrative', 'routine',
    'classified', 'timeline', '2026', 'psi', 'neural', 'experiment',
    'international', 'security', 'surveillance', 'hospital', 'specimen'
  ];
  
  // Check if keyword matches any tag directly
  for (const tag of allTags) {
    if (tag.includes(lowerKeyword) || lowerKeyword.includes(tag)) {
      directTags.push(tag);
    }
  }
  
  // Check synonym mapping
  const synonymTags = SEARCH_SYNONYMS[lowerKeyword] || [];
  
  // Combine and dedupe
  const allMatchingTags = new Set([...directTags, ...synonymTags]);
  return Array.from(allMatchingTags);
}

export interface SearchResult {
  filename: string;
  isCorrupted: boolean;
}

/**
 * Perform a search across the filesystem index
 * Returns file NAMES only (not paths) - player must find them manually
 * 
 * Imperfections by design:
 * - ~15-20% chance to MISS a relevant file
 * - ~10% chance to INCLUDE an irrelevant file
 * - Sometimes shows CORRUPTED entries
 */
export function performSearch(
  keyword: string,
  state: GameState
): SearchResult[] {
  const matchingTags = getMatchingTags(keyword);
  
  if (matchingTags.length === 0) {
    return [];
  }
  
  const allFiles = collectAllFilesWithTags(FILESYSTEM_ROOT);
  const results: SearchResult[] = [];
  const seenFilenames = new Set<string>();
  
  // Create seeded RNG for consistent randomness per search
  const rng = createSeededRng(state.seed + keyword.length * 31 + state.sessionCommandCount);
  
  // Find matching files
  for (const file of allFiles) {
    // Check if file has any matching tags
    const hasMatchingTag = file.tags.some(tag => matchingTags.includes(tag));
    
    if (hasMatchingTag) {
      // ~15-20% chance to MISS this file (unreliable archive)
      const missChance = 0.15 + rng() * 0.05; // 15-20%
      if (rng() < missChance) {
        continue; // File missed due to "index degradation"
      }
      
      // Avoid duplicate filenames in results
      if (!seenFilenames.has(file.filename)) {
        seenFilenames.add(file.filename);
        results.push({ filename: file.filename, isCorrupted: false });
      }
    } else {
      // ~10% chance to INCLUDE an irrelevant file (false positive)
      if (rng() < 0.10 && file.tags.length > 0) {
        if (!seenFilenames.has(file.filename)) {
          seenFilenames.add(file.filename);
          results.push({ filename: file.filename, isCorrupted: false });
        }
      }
    }
  }
  
  // Add 1-2 corrupted entries randomly (30% chance)
  if (rng() < 0.30 && results.length > 0) {
    const numCorrupted = rng() < 0.7 ? 1 : 2;
    for (let i = 0; i < numCorrupted; i++) {
      const corruptedEntry = CORRUPTED_ENTRIES[Math.floor(rng() * CORRUPTED_ENTRIES.length)];
      results.push({ filename: corruptedEntry, isCorrupted: true });
    }
  }
  
  // Shuffle results slightly for variety (Fisher-Yates partial)
  for (let i = results.length - 1; i > 0; i--) {
    if (rng() < 0.3) { // Only shuffle 30% of positions
      const j = Math.floor(rng() * (i + 1));
      [results[i], results[j]] = [results[j], results[i]];
    }
  }
  
  return results;
}

/**
 * Check search cooldown
 * Returns true if player can search, false if on cooldown
 */
export function canSearch(state: GameState): boolean {
  const now = Date.now();
  const cooldownMs = 12000; // 12 seconds between searches
  return now - (state.lastSearchTime || 0) >= cooldownMs;
}

/**
 * Get search cooldown message
 */
export function getSearchCooldownMessage(): string {
  return 'INDEX COOLDOWN ACTIVE. Please wait.';
}
