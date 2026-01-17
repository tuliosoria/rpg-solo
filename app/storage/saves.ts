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
  });
}

// Deserialize GameState (handle Set conversion)
function deserializeState(json: string): GameState {
  const parsed = JSON.parse(json);
  return {
    ...parsed,
    truthsDiscovered: new Set(parsed.truthsDiscovered || []),
  };
}

// Get all save slots
export function getSaveSlots(): SaveSlot[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const raw = localStorage.getItem(SAVES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Save game to a slot
export function saveGame(state: GameState, slotName?: string): SaveSlot {
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
  localStorage.setItem(SAVE_PREFIX + id, serializeState(state));
  
  // Update saves list
  const slots = getSaveSlots();
  slots.unshift(slot); // Add to front
  
  // Keep only last 10 saves
  const trimmedSlots = slots.slice(0, 10);
  localStorage.setItem(SAVES_KEY, JSON.stringify(trimmedSlots));
  
  return slot;
}

// Load game from a slot
export function loadGame(slotId: string): GameState | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const raw = localStorage.getItem(SAVE_PREFIX + slotId);
    if (!raw) return null;
    return deserializeState(raw);
  } catch {
    return null;
  }
}

// Delete a save slot
export function deleteSave(slotId: string): void {
  localStorage.removeItem(SAVE_PREFIX + slotId);
  
  const slots = getSaveSlots().filter(s => s.id !== slotId);
  localStorage.setItem(SAVES_KEY, JSON.stringify(slots));
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
  };
}

// Auto-save (quick slot)
export function autoSave(state: GameState): void {
  localStorage.setItem('terminal1996:autosave', serializeState(state));
}

// Load auto-save
export function loadAutoSave(): GameState | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const raw = localStorage.getItem('terminal1996:autosave');
    if (!raw) return null;
    return deserializeState(raw);
  } catch {
    return null;
  }
}
