// Save/Load utilities for Terminal 1996

import { GameState, SaveSlot, DEFAULT_GAME_STATE } from '../types';
import { generateSeed } from '../engine/rng';
import { generateBootSequence } from '../engine/commands';

const SAVES_KEY = 'terminal1996:saves';
const SAVE_PREFIX = 'terminal1996:save:';

// Serialize GameState (handle Set conversion)
function serializeState(state: GameState): string {
  return JSON.stringify({
    ...state,
    truthsDiscovered: Array.from(state.truthsDiscovered),
    singularEventsTriggered: Array.from(state.singularEventsTriggered || []),
    imagesShownThisRun: Array.from(state.imagesShownThisRun || []),
    videosShownThisRun: Array.from(state.videosShownThisRun || []),
    categoriesRead: Array.from(state.categoriesRead || []),
    filesRead: Array.from(state.filesRead || []),
    prisoner45UsedResponses: Array.from(state.prisoner45UsedResponses || []),
    scoutLinkUsedResponses: Array.from(state.scoutLinkUsedResponses || []),
    disinformationDiscovered: Array.from(state.disinformationDiscovered || []),
    hiddenCommandsDiscovered: Array.from(state.hiddenCommandsDiscovered || []),
    passwordsFound: Array.from(state.passwordsFound || []),
    bookmarkedFiles: Array.from(state.bookmarkedFiles || []),
    trapsTriggered: Array.from(state.trapsTriggered || []),
    // Limit history size to prevent quota issues
    history: state.history.slice(-500),
  });
}

// Deserialize GameState (handle Set conversion)
function deserializeState(json: string): GameState {
  const parsed = JSON.parse(json);
  // Spread DEFAULT_GAME_STATE first for migration support (new fields get defaults)
  return {
    ...DEFAULT_GAME_STATE,
    ...parsed,
    truthsDiscovered: new Set(parsed.truthsDiscovered || []),
    singularEventsTriggered: new Set(parsed.singularEventsTriggered || []),
    imagesShownThisRun: new Set(parsed.imagesShownThisRun || []),
    videosShownThisRun: new Set(parsed.videosShownThisRun || []),
    categoriesRead: new Set(parsed.categoriesRead || []),
    filesRead: new Set(parsed.filesRead || []),
    prisoner45UsedResponses: new Set(parsed.prisoner45UsedResponses || []),
    scoutLinkUsedResponses: new Set(parsed.scoutLinkUsedResponses || []),
    disinformationDiscovered: new Set(parsed.disinformationDiscovered || []),
    hiddenCommandsDiscovered: new Set(parsed.hiddenCommandsDiscovered || []),
    passwordsFound: new Set(parsed.passwordsFound || []),
    bookmarkedFiles: new Set(parsed.bookmarkedFiles || []),
    trapsTriggered: new Set(parsed.trapsTriggered || []),
    // Ensure fileEvidenceStates is initialized (plain object, no Set conversion needed)
    fileEvidenceStates: parsed.fileEvidenceStates || {},
    // Limit command history to last 100 entries
    commandHistory: (parsed.commandHistory || []).slice(-100),
  };
}

// Check if we're in a browser with real localStorage
function isBrowserWithStorage(): boolean {
  try {
    return typeof document !== 'undefined' && 
           typeof window !== 'undefined' && 
           typeof window.localStorage !== 'undefined' &&
           typeof window.localStorage.getItem === 'function';
  } catch {
    return false;
  }
}

// Get all save slots
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

// Save game to a slot
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
    if (e instanceof Error && e.name === 'QuotaExceededError') {
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
  
  // Keep only last 10 saves, delete orphaned save data
  if (slots.length > 10) {
    const orphanedSlots = slots.slice(10);
    orphanedSlots.forEach(s => window.localStorage.removeItem(SAVE_PREFIX + s.id));
  }
  const trimmedSlots = slots.slice(0, 10);
  window.localStorage.setItem(SAVES_KEY, JSON.stringify(trimmedSlots));
  
  return slot;
}

// Load game from a slot
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

// Delete a save slot
export function deleteSave(slotId: string): void {
  if (!isBrowserWithStorage()) return;
  
  window.localStorage.removeItem(SAVE_PREFIX + slotId);
  
  const slots = getSaveSlots().filter(s => s.id !== slotId);
  window.localStorage.setItem(SAVES_KEY, JSON.stringify(slots));
}

// Create a fresh game state
export function createNewGame(): GameState {
  const seed = generateSeed();
  const bootSequence = generateBootSequence();
  const variantAlpha = seed % 2 === 0;
  const hasPriorSave = getSaveSlots().length > 0;
  const hasAutoSave = isBrowserWithStorage() && !!window.localStorage.getItem('terminal1996:autosave');
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

// Auto-save (quick slot)
export function autoSave(state: GameState): void {
  if (!isBrowserWithStorage()) return;
  
  const stateToSave = { ...state, lastSaveTime: Date.now() };
  window.localStorage.setItem('terminal1996:autosave', serializeState(stateToSave));
}

// Load auto-save
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
