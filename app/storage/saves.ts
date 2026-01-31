/**
 * Save/Load Utilities for Terminal 1996
 *
 * Handles game state persistence to localStorage with:
 * - Versioned save data format with automatic migrations
 * - Set-to-Array serialization for proper JSON storage
 * - Automatic cleanup when quota is exceeded
 * - Auto-save support for session recovery
 *
 * @module storage/saves
 */

import { GameState, SaveSlot, DEFAULT_GAME_STATE, FileMutation } from '../types';
import { generateSeed } from '../engine/rng';
import { generateBootSequence } from '../engine/commands';
import {
  MAX_HISTORY_SIZE,
  MAX_COMMAND_HISTORY_SIZE,
  MAX_SAVE_SLOTS,
  SAVE_VERSION,
} from '../constants/limits';
import { MAX_DETECTION } from '../constants/detection';

const SAVES_KEY = 'terminal1996:saves';
const SAVE_PREFIX = 'terminal1996:save:';

// Interface for versioned save data
interface VersionedSaveData {
  version: number;
  state: Record<string, unknown>;
}

// Migrate save data from older versions to current version
// Add new migration cases here when SAVE_VERSION is incremented
function migrateState(data: VersionedSaveData): Record<string, unknown> {
  let { version } = data;
  const { state } = data;

  // Run migrations sequentially for each version
  // Example: if migrating from v1 to v3, run v1->v2, then v2->v3

  // Version 0 or undefined: original saves without version field
  if (version === 0 || version === undefined) {
    // No structural changes needed for v0 -> v1
    // Future migrations would transform state here
    version = 1;
  }

  // Add future migrations here:
  // if (version === 1) {
  //   // Migrate v1 -> v2
  //   state = { ...state, newField: defaultValue };
  //   version = 2;
  // }

  return state;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === 'string');
}

function toPlainObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

function clampNumber(value: unknown, fallback: number, min: number, max: number): number {
  const numeric = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  const rounded = Math.floor(numeric);
  return Math.min(max, Math.max(min, rounded));
}

function normalizeSeed(value: unknown): number | null {
  const numeric = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numeric)) return null;
  const rounded = Math.floor(numeric);
  const clamped = Math.min(2147483646, Math.max(1, rounded));
  return clamped;
}

// Serialize GameState (handle Set conversion)
function serializeState(state: GameState): string {
  const data: VersionedSaveData = {
    version: SAVE_VERSION,
    state: {
      ...state,
      truthsDiscovered: Array.from(state.truthsDiscovered),
      singularEventsTriggered: Array.from(state.singularEventsTriggered || []),
      imagesShownThisRun: Array.from(state.imagesShownThisRun || []),
      videosShownThisRun: Array.from(state.videosShownThisRun || []),
      categoriesRead: Array.from(state.categoriesRead || []),
      filesRead: Array.from(state.filesRead || []),
      tutorialTipsShown: Array.from(state.tutorialTipsShown || []),
      prisoner45UsedResponses: Array.from(state.prisoner45UsedResponses || []),
      scoutLinkUsedResponses: Array.from(state.scoutLinkUsedResponses || []),
      disinformationDiscovered: Array.from(state.disinformationDiscovered || []),
      hiddenCommandsDiscovered: Array.from(state.hiddenCommandsDiscovered || []),
      passwordsFound: Array.from(state.passwordsFound || []),
      bookmarkedFiles: Array.from(state.bookmarkedFiles || []),
      trapsTriggered: Array.from(state.trapsTriggered || []),
      // Limit history size to prevent quota issues
      history: state.history.slice(-MAX_HISTORY_SIZE),
    },
  };
  return JSON.stringify(data);
}

// Deserialize GameState (handle Set conversion and version migration)
function deserializeState(json: string): GameState {
  const rawParsed = JSON.parse(json);

  // Handle both versioned and legacy (unversioned) save formats
  let parsed: Record<string, unknown>;
  if (rawParsed.version !== undefined && rawParsed.state !== undefined) {
    if (typeof rawParsed.version === 'number' && rawParsed.version > SAVE_VERSION) {
      throw new Error('Unsupported save version');
    }
    // New versioned format
    parsed = migrateState(rawParsed as VersionedSaveData);
  } else {
    // Legacy unversioned format - treat as version 0
    parsed = migrateState({ version: 0, state: rawParsed });
  }

  // Spread DEFAULT_GAME_STATE first for migration support (new fields get defaults)
  const baseState = {
    ...DEFAULT_GAME_STATE,
    ...parsed,
  } as GameState & Record<string, unknown>;

  const normalizedSeed = normalizeSeed(baseState.seed) ?? generateSeed();
  const normalizedRngState = normalizeSeed(baseState.rngState) ?? normalizedSeed;

  return {
    ...baseState,
    seed: normalizedSeed,
    rngState: normalizedRngState,
    detectionLevel: clampNumber(
      baseState.detectionLevel,
      DEFAULT_GAME_STATE.detectionLevel,
      0,
      MAX_DETECTION
    ),
    sessionStability: clampNumber(
      baseState.sessionStability,
      DEFAULT_GAME_STATE.sessionStability,
      0,
      100
    ),
    accessLevel: clampNumber(baseState.accessLevel, DEFAULT_GAME_STATE.accessLevel, 0, 5),
    systemHostilityLevel: clampNumber(
      baseState.systemHostilityLevel,
      DEFAULT_GAME_STATE.systemHostilityLevel,
      0,
      5
    ),
    icqTrust: clampNumber(baseState.icqTrust, DEFAULT_GAME_STATE.icqTrust, 0, 100),
    legacyAlertCounter: clampNumber(
      baseState.legacyAlertCounter,
      DEFAULT_GAME_STATE.legacyAlertCounter,
      0,
      10
    ),
    wrongAttempts: clampNumber(baseState.wrongAttempts, DEFAULT_GAME_STATE.wrongAttempts, 0, 8),
    flags: toPlainObject(baseState.flags) as Record<string, boolean>,
    fileMutations: toPlainObject(baseState.fileMutations) as Record<string, FileMutation>,
    truthsDiscovered: new Set(toStringArray(parsed.truthsDiscovered)),
    singularEventsTriggered: new Set(toStringArray(parsed.singularEventsTriggered)),
    imagesShownThisRun: new Set(toStringArray(parsed.imagesShownThisRun)),
    videosShownThisRun: new Set(toStringArray(parsed.videosShownThisRun)),
    categoriesRead: new Set(toStringArray(parsed.categoriesRead)),
    filesRead: new Set(toStringArray(parsed.filesRead)),
    tutorialTipsShown: new Set(toStringArray(parsed.tutorialTipsShown)),
    prisoner45UsedResponses: new Set(toStringArray(parsed.prisoner45UsedResponses)),
    scoutLinkUsedResponses: new Set(toStringArray(parsed.scoutLinkUsedResponses)),
    disinformationDiscovered: new Set(toStringArray(parsed.disinformationDiscovered)),
    hiddenCommandsDiscovered: new Set(toStringArray(parsed.hiddenCommandsDiscovered)),
    passwordsFound: new Set(toStringArray(parsed.passwordsFound)),
    bookmarkedFiles: new Set(toStringArray(parsed.bookmarkedFiles)),
    trapsTriggered: new Set(toStringArray(parsed.trapsTriggered)),
    // Ensure fileEvidenceStates is initialized (plain object, no Set conversion needed)
    fileEvidenceStates: toPlainObject(baseState.fileEvidenceStates) as Record<string, unknown>,
    // Limit command history to last MAX_COMMAND_HISTORY_SIZE entries
    commandHistory: toStringArray(parsed.commandHistory).slice(-MAX_COMMAND_HISTORY_SIZE),
    history: Array.isArray(baseState.history)
      ? baseState.history.slice(-MAX_HISTORY_SIZE)
      : DEFAULT_GAME_STATE.history,
    evidenceLinks: Array.isArray(baseState.evidenceLinks) ? baseState.evidenceLinks : [],
    icqMessages: Array.isArray(baseState.icqMessages) ? baseState.icqMessages : [],
  } as GameState;
}

// Check if we're in a browser with real localStorage
function isBrowserWithStorage(): boolean {
  try {
    return (
      typeof document !== 'undefined' &&
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined' &&
      typeof window.localStorage.getItem === 'function'
    );
  } catch {
    return false;
  }
}

function isQuotaExceededError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const domError = error as DOMException;
  return (
    domError.name === 'QuotaExceededError' ||
    domError.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    domError.code === 22 ||
    domError.code === 1014
  );
}

/**
 * Retrieves all saved game slots from localStorage.
 * @returns Array of save slot metadata, empty if none exist or storage unavailable
 */
export function getSaveSlots(): SaveSlot[] {
  if (!isBrowserWithStorage()) return [];

  try {
    const raw = window.localStorage.getItem(SAVES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Saves the current game state to a new slot.
 * Handles quota exceeded errors by removing oldest saves.
 * @param state - The game state to save
 * @param slotName - Optional custom name for the save slot
 * @returns The created SaveSlot metadata, or null if save failed
 */
export function saveGame(state: GameState, slotName?: string): SaveSlot | null {
  if (!isBrowserWithStorage()) return null;

  const id = `save_${Date.now()}`;
  const name = slotName || `Session ${new Date().toLocaleString()}`;
  const now = Date.now();

  const slot: SaveSlot = {
    id,
    name,
    timestamp: now,
    currentPath: state.currentPath,
    truthCount: state.truthsDiscovered.size,
    detectionLevel: state.detectionLevel,
  };

  // Save the state with updated lastSaveTime
  const stateToSave = { ...state, lastSaveTime: now };

  try {
    window.localStorage.setItem(SAVE_PREFIX + id, serializeState(stateToSave));
  } catch (e) {
    // Handle quota exceeded error by cleaning up oldest saves
    if (isQuotaExceededError(e)) {
      const slots = getSaveSlots();
      // Delete oldest saves to make room (keep only 5 most recent)
      const toDelete = slots.slice(5);
      toDelete.forEach(s => window.localStorage.removeItem(SAVE_PREFIX + s.id));
      // Update the saves list to remove deleted slots
      const remainingSlots = slots.slice(0, 5);
      window.localStorage.setItem(SAVES_KEY, JSON.stringify(remainingSlots));
      // Try again
      try {
        window.localStorage.setItem(SAVE_PREFIX + id, serializeState(stateToSave));
      } catch {
        console.error('Failed to save game: storage quota exceeded');
        return null;
      }
    } else {
      console.error('Failed to save game:', e);
      return null;
    }
  }

  // Update saves list
  const slots = getSaveSlots();
  slots.unshift(slot); // Add to front

  // Keep only last MAX_SAVE_SLOTS saves, delete orphaned save data
  if (slots.length > MAX_SAVE_SLOTS) {
    const orphanedSlots = slots.slice(MAX_SAVE_SLOTS);
    orphanedSlots.forEach(s => {
      try {
        window.localStorage.removeItem(SAVE_PREFIX + s.id);
      } catch {
        // Ignore removal errors
      }
    });
  }
  const trimmedSlots = slots.slice(0, MAX_SAVE_SLOTS);
  window.localStorage.setItem(SAVES_KEY, JSON.stringify(trimmedSlots));

  return slot;
}

/**
 * Loads a saved game state by slot ID.
 * @param slotId - The unique identifier of the save slot
 * @returns The deserialized GameState, or null if not found
 */
export function loadGame(slotId: string): GameState | null {
  if (!isBrowserWithStorage()) return null;

  try {
    const raw = window.localStorage.getItem(SAVE_PREFIX + slotId);
    if (!raw) return null;
    return deserializeState(raw);
  } catch {
    return null;
  }
}

/**
 * Deletes a save slot and its associated state data.
 * @param slotId - The unique identifier of the save slot to delete
 */
export function deleteSave(slotId: string): void {
  if (!isBrowserWithStorage()) return;

  try {
    window.localStorage.removeItem(SAVE_PREFIX + slotId);

    const slots = getSaveSlots().filter(s => s.id !== slotId);
    window.localStorage.setItem(SAVES_KEY, JSON.stringify(slots));
  } catch {
    // localStorage may be unavailable
  }
}

/**
 * Creates a fresh game state for a new game.
 * Generates a new seed and boot sequence, sets initial flags.
 * @returns A new GameState ready for gameplay
 */
export function createNewGame(): GameState {
  const seed = generateSeed();
  const bootSequence = generateBootSequence();
  const variantAlpha = seed % 2 === 0;
  const hasPriorSave = getSaveSlots().length > 0;
  let hasAutoSave = false;
  try {
    hasAutoSave = isBrowserWithStorage() && !!window.localStorage.getItem('terminal1996:autosave');
  } catch {
    // localStorage may be unavailable
  }
  const ghostSessionAvailable = hasPriorSave || hasAutoSave;
  const flags = {
    ...DEFAULT_GAME_STATE.flags,
    ...(variantAlpha ? { variant_route_alpha: true } : { variant_route_beta: true }),
    ...(ghostSessionAvailable ? { ghostSessionAvailable: true } : {}),
  };

  return {
    ...DEFAULT_GAME_STATE,
    seed,
    rngState: seed,
    sessionStartTime: Date.now(),
    history: bootSequence,
    truthsDiscovered: new Set(),
    singularEventsTriggered: new Set(),
    imagesShownThisRun: new Set(),
    videosShownThisRun: new Set(),
    flags,
    tutorialStep: 0,
    tutorialComplete: false,
  };
}

/**
 * Saves the current state to the auto-save slot.
 * Used for session recovery on page reload.
 * @param state - The game state to auto-save
 */
export function autoSave(state: GameState): void {
  if (!isBrowserWithStorage()) return;

  try {
    const stateToSave = { ...state, lastSaveTime: Date.now() };
    window.localStorage.setItem('terminal1996:autosave', serializeState(stateToSave));
  } catch {
    // localStorage may be full or unavailable
  }
}

/**
 * Loads the auto-saved game state if available.
 * @returns The auto-saved GameState, or null if none exists
 */
export function loadAutoSave(): GameState | null {
  if (!isBrowserWithStorage()) return null;

  try {
    const raw = window.localStorage.getItem('terminal1996:autosave');
    if (!raw) return null;
    return deserializeState(raw);
  } catch {
    return null;
  }
}
