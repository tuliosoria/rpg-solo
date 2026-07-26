/**
 * Idle-hint conditions.
 *
 * These predicates decide when the terminal nudges an idle player. A wrong one
 * is invisible in the worst way: the hint either never appears, or — as with the
 * `/comms` nudge below — never stops appearing, so the game keeps explaining
 * something the player finished doing half an hour ago. Nothing throws, nothing
 * logs, and the only symptom is a game that feels like it is not paying
 * attention.
 */
import { describe, it, expect } from 'vitest';
import { IDLE_HINTS } from '../useTerminalEffects';
import { DEFAULT_GAME_STATE, GameState } from '../../types';

function stateWith(overrides: Partial<GameState> = {}): GameState {
  return {
    ...DEFAULT_GAME_STATE,
    filesRead: new Set<string>(),
    currentPath: '/',
    ...overrides,
  } as GameState;
}

function hint(key: string) {
  const found = IDLE_HINTS.find(h => h.key === key);
  if (!found) throw new Error(`No idle hint registered for ${key}`);
  return found;
}

describe('idle hints', () => {
  it('registers a unique key per hint', () => {
    // Duplicate keys would make one hint permanently unreachable, since lookup
    // and display both take the first match.
    const keys = IDLE_HINTS.map(h => h.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('gives every hint a non-empty fallback', () => {
    // The fallback is what renders when a locale lacks the key, so an empty one
    // shows the player a blank nudge.
    const empty = IDLE_HINTS.filter(h => !h.fallback?.trim()).map(h => h.key);
    expect(empty).toEqual([]);
  });

  describe('the /comms nudge', () => {
    const comms = () => hint('terminal.idleHint.7');

    it('fires for a player who has not touched /comms', () => {
      expect(comms().condition(stateWith())).toBe(true);
    });

    it('stays quiet while the player is already in /comms', () => {
      expect(comms().condition(stateWith({ currentPath: '/comms/intercepts' }))).toBe(false);
    });

    it('retires once any file in /comms has been read', () => {
      // The regression: this gated on a path that does not exist, so the check
      // was always false and the hint nagged forever.
      const state = stateWith({
        filesRead: new Set(['/comms/intercepts/intercept_summary_dec95.txt']),
        currentPath: '/internal',
      });

      expect(comms().condition(state)).toBe(false);
    });

    it('keeps firing when the only files read are outside /comms', () => {
      const state = stateWith({
        filesRead: new Set(['/internal/maintenance_notes.txt', '/ops/prato/summary.txt']),
        currentPath: '/internal',
      });

      expect(comms().condition(state)).toBe(true);
    });

    it('is not fooled by a path that merely mentions comms', () => {
      // `/internal/comms_policy.txt` is not in /comms; a substring check would
      // retire the hint on it and send the player off without the intel.
      const state = stateWith({
        filesRead: new Set(['/internal/comms_policy.txt']),
        currentPath: '/internal',
      });

      expect(comms().condition(state)).toBe(true);
    });
  });

  it('evaluates every condition without throwing on a default state', () => {
    // Conditions run against whatever state the player is in, including a fresh
    // one where the Set fields are empty and optional counters are undefined.
    const state = stateWith();

    for (const h of IDLE_HINTS) {
      expect(() => h.condition(state), `${h.key} threw`).not.toThrow();
    }
  });
});
