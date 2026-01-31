// Command utilities - shared helper functions for terminal commands

import { GameState, CommandResult, TerminalEntry } from '../../types';
import { MAX_COMMAND_INPUT_LENGTH } from '../../constants/limits';
import { createSeededRng } from '../rng';
import { DETECTION_THRESHOLDS, applyWarmupDetection } from '../../constants/detection';

// Generate unique ID for terminal entries
let entryIdCounter = 0;
export function generateEntryId(): string {
  return `entry_${Date.now()}_${entryIdCounter++}`;
}

export function createEntry(type: TerminalEntry['type'], content: string): TerminalEntry {
  return {
    id: generateEntryId(),
    type,
    content,
    timestamp: Date.now(),
  };
}

export function createOutputEntries(
  lines: string[],
  type: TerminalEntry['type'] = 'output'
): TerminalEntry[] {
  return lines.map(line => createEntry(type, line));
}

// Helper to create invalid command result with legacyAlertCounter increment
export function createInvalidCommandResult(state: GameState, commandName: string): CommandResult {
  const newAlertCounter = state.legacyAlertCounter + 1;

  // Check if this triggers game over
  if (newAlertCounter >= 8) {
    return {
      output: [
        createEntry('error', ''),
        createEntry('error', '═══════════════════════════════════════════════════════════'),
        createEntry('error', 'CRITICAL: INVALID ATTEMPT THRESHOLD EXCEEDED'),
        createEntry('error', '═══════════════════════════════════════════════════════════'),
        createEntry('error', ''),
        createEntry('error', 'SYSTEM LOCKDOWN INITIATED'),
        createEntry('error', 'SESSION TERMINATED'),
        createEntry('error', ''),
      ],
      stateChanges: {
        isGameOver: true,
        gameOverReason: 'INVALID ATTEMPT THRESHOLD',
        legacyAlertCounter: newAlertCounter,
      },
      triggerFlicker: true,
    };
  }

  return {
    output: [
      createEntry(
        'error',
        commandName ? `Unknown command: ${commandName}` : 'ERROR: Unknown command'
      ),
      createEntry('warning', ''),
      createEntry('warning', '⚠ RISK INCREASED: Invalid commands draw system attention.'),
      createEntry('system', `   [Invalid attempts: ${newAlertCounter}/8]`),
    ],
    stateChanges: {
      detectionLevel: applyWarmupDetection(state.detectionLevel, 2, state.filesRead?.size || 0),
      legacyAlertCounter: newAlertCounter,
    },
  };
}

// Parse command into name and args
const CONTROL_CHARS_REGEX = /\p{Cc}/gu;
const ZERO_WIDTH_REGEX = /[\u200B-\u200F\uFEFF]/g;

export function sanitizeCommandInput(
  input: string,
  maxLength: number = MAX_COMMAND_INPUT_LENGTH
): { value: string; wasModified: boolean; wasTruncated: boolean } {
  const normalized = typeof input.normalize === 'function' ? input.normalize('NFKC') : input;
  let sanitized = normalized.replace(CONTROL_CHARS_REGEX, ' ').replace(ZERO_WIDTH_REGEX, '');
  let wasTruncated = false;
  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
    wasTruncated = true;
  }
  const wasModified = sanitized !== input;
  return { value: sanitized, wasModified, wasTruncated };
}

export function parseCommand(input: string): { command: string; args: string[] } {
  const { value } = sanitizeCommandInput(input);
  const trimmed = value.trim();
  const parts = trimmed.split(/\s+/);
  const command = (parts[0] || '').toLowerCase();
  const args = parts.slice(1);
  return { command, args };
}

// Calculate delay based on detection level and per-run variance
export function calculateDelay(state: GameState): number {
  // Base delay from detection level
  let baseDelay = 0;
  if (state.detectionLevel < DETECTION_THRESHOLDS.DELAY_NONE) baseDelay = 0;
  else if (state.detectionLevel < DETECTION_THRESHOLDS.DELAY_LOW) baseDelay = 300;
  else if (state.detectionLevel < DETECTION_THRESHOLDS.DELAY_MEDIUM) baseDelay = 800;
  else if (state.detectionLevel < DETECTION_THRESHOLDS.DELAY_HIGH) baseDelay = 1500;
  else baseDelay = 2500;

  // Per-run variance: some runs have faster/slower response times (±30%)
  const rng = createSeededRng(state.seed + 777);
  const variance = 0.7 + rng() * 0.6; // 0.7 to 1.3

  return Math.floor(baseDelay * variance);
}

// Check if should trigger flicker based on stability
export function shouldFlicker(state: GameState): boolean {
  if (state.sessionStability > 80) return false;
  if (state.sessionStability > 60) return Math.random() < 0.1;
  if (state.sessionStability > 40) return Math.random() < 0.25;
  return Math.random() < 0.5;
}

// ═══════════════════════════════════════════════════════════════════════════
// TERMINAL PERSONALITY - Typos that self-correct, hesitation for scary content
// ═══════════════════════════════════════════════════════════════════════════

// Add hesitation dots before scary/classified content
export function addHesitation(text: string, intensity: number = 1): string[] {
  const dots = '.'.repeat(Math.min(3, Math.max(1, Math.floor(intensity))));
  return [dots + dots + dots, text];
}

// Create a typo version of text that will be followed by correction
// Returns [typo, correction] or [original] if no typo needed
export function maybeAddTypo(text: string, chance: number = 0.1): string[] {
  if (Math.random() > chance || text.length < 5) return [text];

  // Common typo patterns for terminal "personality"
  const typoTypes = [
    // Letter swap
    (s: string) => {
      const i = Math.floor(Math.random() * (s.length - 2)) + 1;
      return s.substring(0, i) + s[i + 1] + s[i] + s.substring(i + 2);
    },
    // Double letter
    (s: string) => {
      const i = Math.floor(Math.random() * s.length);
      return s.substring(0, i) + s[i] + s[i] + s.substring(i + 1);
    },
    // Missing letter
    (s: string) => {
      const i = Math.floor(Math.random() * s.length);
      return s.substring(0, i) + s.substring(i + 1);
    },
  ];

  const typoFn = typoTypes[Math.floor(Math.random() * typoTypes.length)];
  const typo = typoFn(text);

  // Return typo followed by backspace simulation and correction
  return [typo, `[CORRECTION] ${text}`];
}

// Wrap UFO74 messages with transmission banner
// Note: With the new encrypted channel system, these messages will be queued
// and displayed one at a time with the proper channel open/close flow
// Always adds a blank line before messages for consistent spacing
export function createUFO74Message(messages: string[]): TerminalEntry[] {
  return [createEntry('system', ''), ...messages.map(msg => createEntry('ufo74', msg))];
}
