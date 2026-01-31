// ═══════════════════════════════════════════════════════════════════════════
// ATMOSPHERE PHASE - Pressure-free exploration period for narrative immersion
// ═══════════════════════════════════════════════════════════════════════════
//
// The Atmosphere Phase provides a calm period after the tutorial where players
// can explore without pressure systems (firewall eyes, turing tests, etc.).
// This ends when:
// 1. Player discovers their first evidence, OR
// 2. Player reads N meaningful files (excluding tutorial/mundane content)
//
// Additionally, a quiet cooldown period follows UFO74 disengage to prevent
// pressure systems from immediately overwhelming the player.

import { GameState } from '../types';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Number of meaningful files that must be read to end the atmosphere phase.
 * This is higher than warmup (8) because it only counts substantial content.
 */
export const MEANINGFUL_FILES_THRESHOLD = 5;

/**
 * Cooldown period after UFO74 disengages before pressure systems can trigger.
 * Range: 45-60 seconds (we use the midpoint for consistency).
 */
export const UFO74_DISENGAGE_COOLDOWN_MS = 52000; // 52 seconds (midpoint of 45-60s)

/**
 * File path patterns that are excluded from "meaningful" file count.
 * These are tutorial, help, or mundane files that don't advance the narrative.
 */
const EXCLUDED_PATH_PATTERNS: RegExp[] = [
  /readme/i,
  /help/i,
  /tutorial/i,
  /manual/i,
  /guide/i,
  /welcome/i,
];

/**
 * Directories that contain primarily mundane/administrative content.
 * Files in these directories don't count toward meaningful reads.
 */
const MUNDANE_DIRECTORIES: string[] = [
  '/admin/',
  '/logs/',
  '/temp/',
  '/tmp/',
];

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if a file path is considered "meaningful" for atmosphere phase purposes.
 * Meaningful files are narrative content that advances player understanding.
 */
export function isMeaningfulFile(filePath: string): boolean {
  // Exclude files matching mundane patterns
  if (EXCLUDED_PATH_PATTERNS.some(pattern => pattern.test(filePath))) {
    return false;
  }

  // Exclude files in mundane directories
  if (MUNDANE_DIRECTORIES.some(dir => filePath.toLowerCase().includes(dir))) {
    return false;
  }

  return true;
}

/**
 * Count how many meaningful files the player has read.
 */
export function countMeaningfulFilesRead(state: GameState): number {
  if (!state.filesRead) return 0;

  let count = 0;
  for (const filePath of state.filesRead) {
    if (isMeaningfulFile(filePath)) {
      count++;
    }
  }
  return count;
}

/**
 * Check if player has discovered any evidence (truths).
 */
export function hasFirstEvidence(state: GameState): boolean {
  return (state.truthsDiscovered?.size || 0) > 0;
}

/**
 * Check if the game is currently in the Atmosphere Phase.
 *
 * Atmosphere Phase is active when:
 * - Tutorial is complete (post-tutorial exploration period)
 * - No evidence has been discovered yet
 * - Fewer than MEANINGFUL_FILES_THRESHOLD meaningful files read
 *
 * The phase is designed to let players explore and absorb the atmosphere
 * before pressure systems (firewall, turing, etc.) kick in.
 */
export function isInAtmospherePhase(state: GameState): boolean {
  // Must be past the tutorial
  if (!state.tutorialComplete) {
    return false;
  }

  // Phase ends once player finds evidence
  if (hasFirstEvidence(state)) {
    return false;
  }

  // Phase ends after reading enough meaningful files
  const meaningfulCount = countMeaningfulFilesRead(state);
  if (meaningfulCount >= MEANINGFUL_FILES_THRESHOLD) {
    return false;
  }

  return true;
}

/**
 * Check if the quiet cooldown after UFO74 disengage is active.
 * During this period, pressure systems should not trigger.
 */
export function isPressureCooldownActive(state: GameState): boolean {
  if (!state.ufo74DisengageTime) {
    return false;
  }

  const elapsed = Date.now() - state.ufo74DisengageTime;
  return elapsed < UFO74_DISENGAGE_COOLDOWN_MS;
}

/**
 * Check if pressure systems should be suppressed.
 * This combines atmosphere phase and cooldown checks.
 */
export function shouldSuppressPressure(state: GameState): boolean {
  // Always suppress during tutorial
  if (!state.tutorialComplete) {
    return true;
  }

  // Suppress during atmosphere phase
  if (isInAtmospherePhase(state)) {
    return true;
  }

  // Suppress during cooldown after UFO74 disengage
  if (isPressureCooldownActive(state)) {
    return true;
  }

  return false;
}

/**
 * Check if penalties (wrong attempts, bad passwords, re-reads) should be suppressed.
 * During atmosphere phase, we want exploration without punishment.
 */
export function shouldSuppressPenalties(state: GameState): boolean {
  // Suppress during tutorial
  if (!state.tutorialComplete) {
    return true;
  }

  // Suppress during atmosphere phase
  if (isInAtmospherePhase(state)) {
    return true;
  }

  return false;
}
