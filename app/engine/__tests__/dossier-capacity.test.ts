/**
 * The dossier must be fillable to the number `leak` demands.
 *
 * `save` enforces a capacity and `leak` enforces a win requirement. They are
 * enforced in different files, and until recently the capacity was the literal
 * `10` while the requirement read MAX_EVIDENCE_COUNT. Nothing connected them.
 * Raising the constant would have produced the worst possible bug: a game that
 * looks completable, accepts saves right up to the old cap, and then refuses to
 * transmit forever — no error, no explanation, just a win condition that cannot
 * be met.
 *
 * These tests drive the real `save` command rather than asserting on constants,
 * so they fail if the two ends drift apart for any reason.
 */
import { describe, it, expect } from 'vitest';
import { executeCommand } from '../commands';
import {
  MAX_EVIDENCE_COUNT,
  LEAK_PREPARATION_THRESHOLD,
  getAllFilePaths,
} from '../evidenceRevelation';
import { DEFAULT_GAME_STATE, type GameState } from '../../types';
import { translateStatic } from '../../i18n';

/**
 * DEFAULT_GAME_STATE's Set fields are shared by reference and executeCommand
 * writes through them, so every case needs its own copies or results bleed
 * between iterations.
 */
function freshState(overrides: Partial<GameState> = {}): GameState {
  const base = DEFAULT_GAME_STATE as unknown as Record<string, unknown>;
  const fresh: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(base)) {
    if (value instanceof Set) fresh[key] = new Set(value);
  }

  return {
    ...(fresh as unknown as GameState),
    seed: 4242,
    rngState: 4242,
    tutorialComplete: true,
    ...overrides,
  };
}

/**
 * Distinct real files, enough to fill the dossier and try one past it.
 *
 * `save` resolves its argument against filesRead by basename, so duplicate
 * basenames would collapse onto one entry and the dossier would stop short for
 * a reason that has nothing to do with capacity.
 */
function distinctFilePaths(count: number): string[] {
  const seenNames = new Set<string>();
  const paths: string[] = [];

  for (const path of getAllFilePaths()) {
    const name = path.split('/').pop() ?? '';
    if (!name || seenNames.has(name)) continue;
    seenNames.add(name);
    paths.push(path);
    if (paths.length === count) break;
  }

  return paths;
}

/** Saves each file in turn, threading state changes forward as play would. */
function saveAll(paths: string[], startingState: GameState) {
  let state = startingState;
  const refused: string[] = [];

  for (const path of paths) {
    const name = path.split('/').pop() as string;
    const result = executeCommand(`save ${name}`, state);
    const saved = result.stateChanges.savedFiles;

    if (!saved || !saved.has(path)) refused.push(name);
    state = { ...state, ...result.stateChanges };
  }

  return { state, refused };
}

describe('dossier capacity matches the leak requirement', () => {
  const needed = MAX_EVIDENCE_COUNT;

  it('has enough distinct files in the filesystem to fill the dossier', () => {
    // If the filesystem itself cannot supply MAX_EVIDENCE_COUNT distinct
    // basenames, no amount of correct capacity logic makes the game winnable.
    expect(distinctFilePaths(needed + 1).length).toBe(needed + 1);
  });

  it('accepts saves all the way to the win requirement', () => {
    const paths = distinctFilePaths(needed);
    const { state, refused } = saveAll(paths, freshState({ filesRead: new Set(paths) }));

    expect(refused).toEqual([]);
    expect(state.savedFiles.size).toBe(needed);
  });

  it('refuses the file after the dossier is full', () => {
    // The cap must still be a cap — an off-by-one in the other direction would
    // let the dossier grow past what the endgame copy and UI assume.
    const paths = distinctFilePaths(needed + 1);
    const { state } = saveAll(paths.slice(0, needed), freshState({ filesRead: new Set(paths) }));

    const extra = paths[needed].split('/').pop() as string;
    const result = executeCommand(`save ${extra}`, state);

    expect(result.stateChanges.savedFiles).toBeUndefined();
    expect(state.savedFiles.size).toBe(needed);
  });

  it('unlocks leak preparation before the dossier is full', () => {
    // The preparation sequence is the player's signal that an endgame exists.
    // If this threshold ever met or exceeded the cap, that signal would arrive
    // at the same moment as the win, or never.
    expect(LEAK_PREPARATION_THRESHOLD).toBeLessThan(MAX_EVIDENCE_COUNT);
    expect(LEAK_PREPARATION_THRESHOLD).toBeGreaterThan(0);
  });

  it('keeps player-facing copy in step with the requirement', async () => {
    // Copy used to spell this number out ("10/10", "Save 10 files") in keys
    // across every language, so changing the constant silently made the UI
    // contradict the rules. Those keys now interpolate {{max}}. What can still
    // go wrong is the other half: a key that gained the placeholder while its
    // call site was never given a value, which ships a literal "{{max}}" to the
    // player.
    const locales = await Promise.all([
      import('../../locales/en.json'),
      import('../../locales/es.json'),
      import('../../locales/pt-br.json'),
    ]);

    const placeholderKeys = new Set<string>();
    for (const locale of locales) {
      const table = locale.default as Record<string, string>;
      for (const [key, value] of Object.entries(table)) {
        if (typeof value === 'string' && value.includes('{{max}}')) placeholderKeys.add(key);
      }
    }

    // Every locale must agree on which keys interpolate the dossier size —
    // a translation that hardcodes the digit goes stale the moment the
    // constant moves, and only for the players who read that language.
    const disagreements: string[] = [];
    for (const key of placeholderKeys) {
      for (const [index, locale] of locales.entries()) {
        const value = (locale.default as Record<string, string>)[key];
        if (typeof value === 'string' && !value.includes('{{max}}')) {
          disagreements.push(`${key} [locale ${index}]: ${JSON.stringify(value)}`);
        }
      }
    }

    expect(disagreements).toEqual([]);
    expect(placeholderKeys.size).toBeGreaterThan(0);
  });

  it('never shows the player an unsubstituted placeholder', () => {
    // The failure this replaces the old tripwire with. A key that gained
    // {{max}} while its call site was never given a value renders the literal
    // braces into the terminal — visible, ugly, and invisible to a type check.
    //
    // Entries must be resolved the way Terminal resolves them. `content` alone
    // is the raw fallback template, which legitimately still holds {{max}};
    // what matters is the string after translation.
    const paths = distinctFilePaths(needed + 1);
    const start = freshState({ filesRead: new Set(paths) });

    const transcripts = [
      // Usage text, shown when `save` is typed bare.
      executeCommand('save', start),
      // A normal save, which echoes the running dossier count.
      executeCommand(`save ${paths[0].split('/').pop()}`, start),
    ];

    // And the dossier-full refusal, which needs a filled dossier first.
    const { state: full } = saveAll(paths.slice(0, needed), start);
    transcripts.push(executeCommand(`save ${paths[needed].split('/').pop()}`, full));

    const leaked = transcripts
      .flatMap(result => result.output)
      .map(entry =>
        entry.i18nKey
          ? translateStatic(entry.i18nKey, entry.i18nValues, entry.content)
          : entry.content
      )
      .filter(line => typeof line === 'string' && /\{\{\w+\}\}/.test(line));

    expect(leaked).toEqual([]);
  });
});
