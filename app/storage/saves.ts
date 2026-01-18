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
    categoriesRead: Array.from(state.categoriesRead || []),
  });
}

// Deserialize GameState (handle Set conversion)
function deserializeState(json: string): GameState {
  const parsed = JSON.parse(json);
  return {
    ...parsed,
    truthsDiscovered: new Set(parsed.truthsDiscovered || []),
    singularEventsTriggered: new Set(parsed.singularEventsTriggered || []),
    imagesShownThisRun: new Set(parsed.imagesShownThisRun || []),
    categoriesRead: new Set(parsed.categoriesRead || []),
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
  
  const slot: SaveSlot = {
    id,
    name,
    timestamp: Date.now(),
    currentPath: state.currentPath,
    truthCount: state.truthsDiscovered.size,
  };
  
  // Save the state
  window.localStorage.setItem(SAVE_PREFIX + id, serializeState(state));
  
  // Update saves list
  const slots = getSaveSlots();
  slots.unshift(slot); // Add to front
  
  // Keep only last 10 saves
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
  
  return {
    ...DEFAULT_GAME_STATE,
    seed,
    rngState: seed,
    sessionStartTime: Date.now(),
    history: bootSequence,
    truthsDiscovered: new Set(),
    singularEventsTriggered: new Set(),
    imagesShownThisRun: new Set(),
    tutorialStep: 0,
    tutorialComplete: false,
  };
}

// Auto-save (quick slot)
export function autoSave(state: GameState): void {
  if (!isBrowserWithStorage()) return;
  
  window.localStorage.setItem('terminal1996:autosave', serializeState(state));
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
