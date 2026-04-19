// Command utilities - shared helper functions for terminal commands

import { GameState, CommandResult, TerminalEntry } from '../../types';
import { MAX_COMMAND_INPUT_LENGTH } from '../../constants/limits';
import { createSeededRng } from '../rng';
import { DETECTION_THRESHOLDS, applyWarmupDetection } from '../../constants/detection';

// Generate unique ID for terminal entries.
// Includes a random suffix so HMR-remounted modules and migrated saves can't collide.
let entryIdCounter = 0;
export function generateEntryId(): string {
  const rand = Math.floor(Math.random() * 0xffffff).toString(36);
  return `entry_${Date.now()}_${entryIdCounter++}_${rand}`;
}

export function resetEntryIdCounter(): void {
  entryIdCounter = 0;
}

export function createEntry(type: TerminalEntry['type'], content: string): TerminalEntry {
  return {
    id: generateEntryId(),
    type,
    content,
    timestamp: Date.now(),
  };
}

export function createEntryI18n(
  type: TerminalEntry['type'],
  i18nKey: string,
  fallbackContent: string,
  i18nValues?: Record<string, string | number>
): TerminalEntry {
  return {
    id: generateEntryId(),
    type,
    content: fallbackContent,
    i18nKey,
    i18nValues,
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
        createEntryI18n(
          'error',
          'engine.invalidAttemptThreshold.exceeded',
          'CRITICAL: INVALID ATTEMPT THRESHOLD EXCEEDED'
        ),
        createEntry('error', '═══════════════════════════════════════════════════════════'),
        createEntry('error', ''),
        createEntryI18n(
          'error',
          'engine.invalidAttemptThreshold.lockdown',
          'SYSTEM LOCKDOWN INITIATED'
        ),
        createEntryI18n('error', 'engine.invalidAttemptThreshold.terminated', 'SESSION TERMINATED'),
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
      commandName
        ? createEntryI18n('error', 'runtime.unknownCommand', `Unknown command: ${commandName}`, {
            value: commandName,
          })
        : createEntryI18n('error', 'runtime.errorUnknownCommand', 'ERROR: Unknown command'),
      createEntry('warning', ''),
      createEntryI18n(
        'warning',
        'engine.invalidCommand.riskIncreased',
        '⚠ RISK INCREASED: Invalid commands draw system attention.'
      ),
      createEntryI18n(
        'system',
        'engine.invalidCommand.invalidAttempts',
        `   [Invalid attempts: ${newAlertCounter}/8]`,
        { value: newAlertCounter }
      ),
    ],
    stateChanges: {
      detectionLevel: applyWarmupDetection(state.detectionLevel, 2, state.filesRead?.size || 0),
      legacyAlertCounter: newAlertCounter,
    },
  };
}

// Alias map: translated command names → canonical English command names
const COMMAND_ALIASES: Record<string, string> = {
  // PT-BR aliases
  'ajuda': 'help',
  'salvar': 'save',
  'vazar': 'leak',
  'esperar': 'wait',
  'buscar': 'search',
  'progresso': 'progress',
  'abrir': 'open',
  'remover': 'unsave',
  'estado': 'status',
  'limpar': 'clear',
  'dica': 'hint',
  'nota': 'note',
  'notas': 'notes',
  'ultimo': 'last',
  'protocolo': 'override',
  // ES aliases
  'ayuda': 'help',
  'guardar': 'save',
  'filtrar': 'leak',
  // 'esperar' already mapped above (same in PT-BR and ES)
  // 'buscar' already mapped above
  'progreso': 'progress',
  // 'abrir' already mapped above
  'quitar': 'unsave',
  // 'estado' already mapped above
  'limpiar': 'clear',
  'pista': 'hint',
  // 'nota' already mapped above
  // 'notas' already mapped above
  // 'ultimo' already mapped above
  // 'protocolo' already mapped above (same in PT-BR and ES)
};

// Per-language command translations: english command → translated command name
export const COMMAND_TRANSLATIONS: Record<string, Record<string, string>> = {
  'pt-BR': {
    'help': 'ajuda',
    'save': 'salvar',
    'leak': 'vazar',
    'wait': 'esperar',
    'search': 'buscar',
    'progress': 'progresso',
    'open': 'abrir',
    'unsave': 'remover',
    'status': 'estado',
    'clear': 'limpar',
    'hint': 'dica',
    'note': 'nota',
    'notes': 'notas',
    'last': 'ultimo',
    'override': 'protocolo',
  },
  'es': {
    'help': 'ayuda',
    'save': 'guardar',
    'leak': 'filtrar',
    'wait': 'esperar',
    'search': 'buscar',
    'progress': 'progreso',
    'open': 'abrir',
    'unsave': 'quitar',
    'status': 'estado',
    'clear': 'limpiar',
    'hint': 'pista',
    'note': 'nota',
    'notes': 'notas',
    'last': 'ultimo',
    'override': 'protocolo',
  },
};

/**
 * Resolve a command alias to its canonical English command name.
 * Returns the original command if no alias exists.
 */
export function resolveCommandAlias(cmd: string): string {
  return COMMAND_ALIASES[cmd] || cmd;
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
  const rawCommand = (parts[0] || '').toLowerCase();
  const command = resolveCommandAlias(rawCommand);
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

// Wrap UFO74 messages with transmission banner
// Note: With the new encrypted channel system, these messages will be queued
// and displayed one at a time with the proper channel open/close flow
// Always adds a blank line before messages for consistent spacing
export function createUFO74Message(messages: string[]): TerminalEntry[] {
  return [createEntry('system', ''), ...messages.map(msg => createEntry('ufo74', msg))];
}
