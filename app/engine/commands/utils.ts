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

/**
 * Commands the game openly advertises to the player (via `help`, Tab completion
 * and "did you mean" suggestions).
 *
 * This is deliberately NOT `Object.keys(commands)`: several handlers
 * (`link`, `release`, `script`, `recover`, ...) are meant to be discovered
 * through documents, so surfacing them here would spoil that discovery.
 * Every entry must exist in the command registry — `exit` used to be listed for
 * Tab completion despite having no handler, which meant completing it cost the
 * player detection and an invalid attempt.
 */
export const PUBLIC_COMMANDS = [
  'help',
  'status',
  'progress',
  'ls',
  'cd',
  'back',
  'open',
  'last',
  'unread',
  'note',
  'notes',
  'unsave',
  'trace',
  'chat',
  'clear',
  'save',
  'override',
  'run',
  'map',
  'tree',
  'tutorial',
  'leak',
  'message',
  'search',
  'hint',
  'wait',
  'hide',
  'morse',
] as const;

/**
 * Names of every localized command alias, so typo suggestions still work for
 * players typing in pt-BR or es.
 */
export function getCommandAliasNames(): string[] {
  return Object.keys(COMMAND_ALIASES);
}

/** Levenshtein edit distance, capped early once it exceeds `max`. */
function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;

  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const value = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + cost);
      current.push(value);
      if (value < rowMin) rowMin = value;
    }
    if (rowMin > max) return max + 1;
    previous = current;
  }

  return previous[b.length];
}

/**
 * Suggest the closest known command for a mistyped one.
 *
 * Only advertised commands (plus their localized aliases) are candidates, so
 * this never leaks a command the player is supposed to discover in the fiction.
 * Returns the canonical English command name, or null when nothing is close
 * enough to be worth guessing.
 */
export function suggestCommand(input: string): string | null {
  const typed = input.trim().toLowerCase();
  if (typed.length < 2) return null;

  const candidates = [...PUBLIC_COMMANDS, ...getCommandAliasNames()];
  if (candidates.includes(typed)) return null;

  // Short commands tolerate a single edit; longer ones tolerate two.
  const maxDistance = typed.length <= 3 ? 1 : 2;

  let best: string | null = null;
  let bestDistance = maxDistance + 1;

  for (const candidate of candidates) {
    const distance = editDistance(typed, candidate, maxDistance);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = candidate;
    }
  }

  if (best === null || bestDistance > maxDistance) return null;
  return resolveCommandAlias(best);
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
