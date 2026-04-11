// Filesystem resolver and navigation

import { FileSystemNode, FileNode, GameState } from '../types';
import { FILESYSTEM_ROOT } from '../data/filesystem';
import { createSeededRng } from './rng';
import { isDisturbingContent } from './evidenceRevelation';

// Cached set of file paths that can potentially reveal evidence
let _evidenceBearingFiles: Set<string> | null = null;

function buildEvidenceBearingFiles(): Set<string> {
  const result = new Set<string>();

  function traverse(node: FileSystemNode, path: string) {
    if (node.type === 'file') {
      const file = node as FileNode;
      if (isDisturbingContent(file.content)) {
        result.add(path);
      }
    } else {
      for (const [name, child] of Object.entries(node.children)) {
        const childPath = path === '/' ? `/${name}` : `${path}/${name}`;
        traverse(child, childPath);
      }
    }
  }

  traverse(FILESYSTEM_ROOT, '/');
  return result;
}

/**
 * Returns the set of file paths that can potentially reveal evidence.
 * Cached after first call since the filesystem is static.
 */
export function getEvidenceBearingFiles(): Set<string> {
  if (!_evidenceBearingFiles) {
    _evidenceBearingFiles = buildEvidenceBearingFiles();
  }
  return _evidenceBearingFiles;
}

/**
 * Checks if a file should be dynamically locked behind the override protocol.
 * After the player discovers their first evidence, all remaining evidence-bearing
 * files that haven't been read yet are gated behind override.
 */
export function isEvidenceGated(path: string, state: GameState): boolean {
  if (state.flags.adminUnlocked) return false;
  if (state.evidenceCount === 0) return false;
  if (state.filesRead.has(path)) return false;
  return getEvidenceBearingFiles().has(path);
}

/**
 * Resolves a path (absolute or relative) against a current working path.
 * Handles `.` (current dir) and `..` (parent dir) navigation.
 * @param path - The path to resolve (can be absolute starting with '/' or relative)
 * @param currentPath - The current working directory path
 * @returns The resolved absolute path
 */
export function resolvePath(path: string, currentPath: string): string {
  // Handle absolute vs relative paths
  let segments: string[];

  if (path.startsWith('/')) {
    segments = path.split('/').filter(Boolean);
  } else {
    const currentSegments = currentPath.split('/').filter(Boolean);
    const newSegments = path.split('/').filter(Boolean);
    segments = [...currentSegments, ...newSegments];
  }

  // Handle .. and .
  const resolved: string[] = [];
  for (const seg of segments) {
    if (seg === '..') {
      resolved.pop();
    } else if (seg !== '.') {
      resolved.push(seg);
    }
  }

  return '/' + resolved.join('/');
}

/**
 * Retrieves a filesystem node at the given path, respecting access controls.
 * @param path - The absolute path to the node
 * @param state - Current game state for access level and flag checks
 * @returns The node if accessible, or null if not found/inaccessible
 */
export function getNode(path: string, state: GameState): FileSystemNode | null {
  const segments = path.split('/').filter(Boolean);
  let current: FileSystemNode = FILESYSTEM_ROOT;

  for (const segment of segments) {
    if (current.type !== 'dir') return null;
    const child: FileSystemNode | undefined = current.children[segment];
    if (!child) return null;

    // Check access requirements
    if (child.requiredFlags) {
      const hasAllFlags = child.requiredFlags.every((f: string) => state.flags[f]);
      if (!hasAllFlags) return null;
    }

    if (child.accessThreshold && state.accessLevel < child.accessThreshold) {
      return null;
    }

    current = child;
  }

  return current;
}

/**
 * Lists the contents of a directory, filtering by access permissions.
 * @param path - The absolute path to the directory
 * @param state - Current game state for access checks
 * @returns Array of directory entries with name, type, and status, or null if not a directory
 */
export function listDirectory(
  path: string,
  state: GameState
): { name: string; type: 'dir' | 'file'; status?: string }[] | null {
  const node = getNode(path, state);
  if (!node || node.type !== 'dir') return null;

  const entries: { name: string; type: 'dir' | 'file'; status?: string }[] = [];

  for (const [name, child] of Object.entries(node.children)) {
    // Check visibility requirements for required flags
    if (child.requiredFlags) {
      const hasAllFlags = child.requiredFlags.every(f => state.flags[f]);
      if (!hasAllFlags) continue;
    }

    // Legacy encrypted/restricted states are now presentation only.
    if (child.accessThreshold && state.accessLevel < child.accessThreshold) {
      continue;
    }

    // Check if file is deleted
    const fullPath = path === '/' ? `/${name}` : `${path}/${name}`;
    const mutation = state.fileMutations[fullPath];
    if (mutation?.deleted) continue;

    // Hide evidence-bearing files after first evidence (dynamic override lock)
    if (child.type === 'file' && isEvidenceGated(fullPath, state)) continue;

    entries.push({
      name: child.type === 'dir' ? `${name}/` : name,
      type: child.type,
      status: child.type === 'file' ? (child as FileNode).status : undefined,
    });
  }

  return entries.sort((a, b) => {
    // Directories first, then files
    if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Retrieves the content of a file, applying mutations and time-sensitive degradation.
 * @param path - The absolute path to the file
 * @param state - Current game state for mutation and timing checks
 * @param decrypted - Whether to return decrypted content if available
 * @returns Array of content lines, or null if file not found/deleted
 */
export function getFileContent(
  path: string,
  state: GameState,
  decrypted: boolean = false
): string[] | null {
  const node = getNode(path, state);
  if (!node || node.type !== 'file') return null;

  const file = node as FileNode;
  const mutation = state.fileMutations[path];

  // Check if deleted or locked
  if (mutation?.deleted) return null;
  if (mutation?.locked) return ['[FILE LOCKED]'];

  // Get base content
  let content: string[];
  if (decrypted && file.decryptedFragment && mutation?.decrypted) {
    content = [...file.decryptedFragment];
  } else if (file.status === 'encrypted' && file.decryptedFragment) {
    content = [...file.decryptedFragment];
  } else {
    content = [...file.content];
  }

  return content;
}

/**
 * Checks if a file can be accessed by the player.
 * @param path - The absolute path to the file
 * @param state - Current game state for access checks
 * @returns Object with accessible boolean and optional reason if denied
 */
export function canAccessFile(
  path: string,
  state: GameState
): { accessible: boolean; reason?: string } {
  const node = getNode(path, state);
  if (!node) return { accessible: false, reason: 'FILE NOT FOUND' };
  if (node.type !== 'file') return { accessible: false, reason: 'NOT A FILE' };

  const _file = node as FileNode;
  const mutation = state.fileMutations[path];

  if (mutation?.deleted) return { accessible: false, reason: 'FILE DELETED' };
  if (mutation?.locked) return { accessible: false, reason: 'FILE LOCKED' };

  // Dynamic override lock — evidence-bearing files gated after first evidence
  if (isEvidenceGated(path, state)) {
    return { accessible: false, reason: 'ACCESS DENIED — OVERRIDE PROTOCOL REQUIRED' };
  }

  return { accessible: true };
}

/**
 * Recursively collects all accessible file paths from the filesystem.
 * @param state - Current game state for access checks
 * @param basePath - Starting directory path (defaults to root)
 * @returns Array of absolute file paths that are accessible
 */
export function getAllAccessibleFiles(state: GameState, basePath: string = '/'): string[] {
  const files: string[] = [];

  function traverse(dirPath: string) {
    const entries = listDirectory(dirPath, state);
    if (!entries) return;

    for (const entry of entries) {
      const fullPath =
        dirPath === '/'
          ? `/${entry.name.replace(/\/$/, '')}`
          : `${dirPath}/${entry.name.replace(/\/$/, '')}`;
      if (entry.type === 'file') {
        files.push(fullPath);
      } else {
        traverse(fullPath);
      }
    }
  }

  traverse(basePath);
  return files;
}

/**
 * Simple fuzzy matching for filenames - checks if searchTerm is "close enough" to filename.
 * Matches if:
 * - Exact match (case-insensitive)
 * - Filename contains the search term
 * - Search term is a substring with minor typos (1 char difference for short terms, 2 for longer)
 * @param filename - The filename to check
 * @param searchTerm - The search term to match against
 * @returns Match quality: 'exact' | 'contains' | 'fuzzy' | null
 */
export function fuzzyMatchFilename(
  filename: string,
  searchTerm: string
): 'exact' | 'contains' | 'fuzzy' | null {
  const filenameLower = filename.toLowerCase();
  const searchLower = searchTerm.toLowerCase();

  // Strip extension for matching
  const filenameBase = filenameLower.replace(/\.[^.]+$/, '');
  const searchBase = searchLower.replace(/\.[^.]+$/, '');

  // Exact match (with or without extension)
  if (filenameLower === searchLower || filenameBase === searchBase) {
    return 'exact';
  }

  // Contains match - search term is contained in filename
  if (filenameBase.includes(searchBase) || searchBase.includes(filenameBase)) {
    return 'contains';
  }

  // Split by underscore/hyphen and check if any word matches
  const filenameWords = filenameBase.split(/[_\-.]/);
  const searchWords = searchBase.split(/[_\-.]/);

  for (const searchWord of searchWords) {
    if (searchWord.length < 3) continue; // Skip short words
    for (const fileWord of filenameWords) {
      if (fileWord.includes(searchWord) || searchWord.includes(fileWord)) {
        return 'contains';
      }
      // Check edit distance for fuzzy matching
      if (
        levenshteinDistance(fileWord, searchWord) <= Math.min(2, Math.floor(searchWord.length / 3))
      ) {
        return 'fuzzy';
      }
    }
  }

  return null;
}

/**
 * Calculate Levenshtein edit distance between two strings.
 */
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

export interface FileMatch {
  path: string;
  filename: string;
  matchQuality: 'exact' | 'contains' | 'fuzzy';
}

/**
 * Finds files matching a search term across the accessible filesystem.
 * Returns matches sorted by quality (exact > contains > fuzzy).
 * @param searchTerm - Filename or partial filename to search for
 * @param state - Current game state for access checks
 * @returns Array of matching files with their paths and match quality
 */
export function findFilesMatching(searchTerm: string, state: GameState): FileMatch[] {
  const allFiles = getAllAccessibleFiles(state);
  const matches: FileMatch[] = [];

  for (const filePath of allFiles) {
    const filename = filePath.split('/').pop() || '';
    const matchQuality = fuzzyMatchFilename(filename, searchTerm);
    if (matchQuality) {
      matches.push({ path: filePath, filename, matchQuality });
    }
  }

  // Sort by match quality
  const qualityOrder = { exact: 0, contains: 1, fuzzy: 2 };
  matches.sort((a, b) => qualityOrder[a.matchQuality] - qualityOrder[b.matchQuality]);

  return matches;
}

/**
 * Smart file resolution: tries exact path first, then searches filesystem.
 * Returns the resolved path and any alternative suggestions.
 * @param input - User input (could be full path or just filename)
 * @param currentPath - Current working directory
 * @param state - Current game state
 * @returns Object with resolvedPath (if found) and suggestions (alternatives)
 */
export function smartResolvePath(
  input: string,
  currentPath: string,
  state: GameState
): { resolvedPath: string | null; suggestions: FileMatch[]; wasExact: boolean } {
  // First try the standard path resolution
  const standardPath = resolvePath(input, currentPath);
  const node = getNode(standardPath, state);

  if (node && node.type === 'file') {
    return { resolvedPath: standardPath, suggestions: [], wasExact: true };
  }

  // Path didn't resolve - search for matching files
  const matches = findFilesMatching(input, state);

  if (matches.length === 1 && matches[0].matchQuality === 'exact') {
    // Unique exact match - use it
    return { resolvedPath: matches[0].path, suggestions: [], wasExact: false };
  }

  if (matches.length > 0) {
    return { resolvedPath: null, suggestions: matches, wasExact: false };
  }

  return { resolvedPath: null, suggestions: [], wasExact: false };
}
