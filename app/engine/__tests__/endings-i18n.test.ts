/**
 * Guards that every ending's prose reaches pt-BR and Spanish players.
 *
 * Ending copy is translated by exact source-string match: endingsContent.json
 * stores each translation keyed by the English text, and Victory.tsx renders it
 * through `translateRuntimeText`, which looks the English up verbatim. That
 * makes the keys silently positional on the English prose — rewrite a sentence
 * and its translation is orphaned, the lookup misses, and the win screen falls
 * back to English with nothing failing anywhere.
 *
 * That is exactly what happened: eight endings drifted, and three of them —
 * including the_2026_warning, which a player who fills the dossier actually
 * reaches — rendered their entire ending in English for two of the game's three
 * languages. 43 strings had translations sitting in the file, keyed to prose
 * that no longer existed.
 *
 * These tests fail on the drift itself rather than on the symptom, so the next
 * English rewrite has to bring its translations along.
 *
 * Two endings also swap lines in at render time rather than storing them in
 * `fields` — governmentScandalCopy and alienRevelationCopy replace a narrative
 * line and an AOL paragraph when the dossier warrants it. That copy reaches the
 * screen exactly like static prose and needs the same coverage, but it is
 * invisible to anything that reads `fields` alone, which is how the wrong_story
 * pair came to have no translation in either language.
 */
import { describe, it, expect } from 'vitest';
import endingsData from '../../data/endingsContent.json';
import { ENDINGS_SUPPLEMENT } from '../../i18n/generated/endingsSupplement.generated';
import {
  SMOKING_GUN_NARRATIVE_INTRO,
  SMOKING_GUN_AOL_PURPOSE,
} from '../governmentScandalCopy';
import { WRONG_STORY_NARRATIVE_SWAP, WRONG_STORY_AOL_SWAP } from '../alienRevelationCopy';

type Ending = {
  fields: Record<string, unknown>;
  translations: Record<string, Record<string, string>>;
};

const ENDINGS = endingsData as unknown as Record<string, Ending>;
const LANGUAGES = ['pt-BR', 'es'] as const;

/** Copy substituted into an ending at render time, keyed by the ending it belongs to. */
const DYNAMIC_COPY: Record<string, string[]> = {
  government_scandal: [SMOKING_GUN_NARRATIVE_INTRO, SMOKING_GUN_AOL_PURPOSE],
  wrong_story: [WRONG_STORY_NARRATIVE_SWAP, WRONG_STORY_AOL_SWAP],
};

/** Every string on an ending that the player reads as prose, however it gets there. */
function proseOf(ending: Ending, id?: string): string[] {
  const f = ending.fields;
  const aol = (f.aol ?? {}) as Record<string, unknown>;
  return [
    f.title,
    f.subtitle,
    ...((f.narrative as string[]) ?? []),
    f.ufo74_final,
    aol.headline,
    aol.subheadline,
    ...((aol.body as string[]) ?? []),
    ...(id ? DYNAMIC_COPY[id] ?? [] : []),
  ].filter((s): s is string => typeof s === 'string' && s.trim().length > 3);
}

describe('ending translation coverage', () => {
  it('translates every ending string into pt-BR and Spanish', () => {
    const missing: string[] = [];

    for (const [id, ending] of Object.entries(ENDINGS)) {
      for (const language of LANGUAGES) {
        const table = ending.translations?.[language] ?? {};
        for (const source of proseOf(ending, id)) {
          if (table[source] === undefined) {
            missing.push(`${id} [${language}]: ${JSON.stringify(source.slice(0, 60))}`);
          }
        }
      }
    }

    expect(missing).toEqual([]);
  });

  it('ships those translations in the generated supplement', () => {
    // The JSON is the source; Victory.tsx reads the generated supplement. If the
    // generator has not been re-run, the source can look complete while players
    // still get English.
    const missing: string[] = [];

    for (const [id, ending] of Object.entries(ENDINGS)) {
      for (const language of LANGUAGES) {
        const shipped = ENDINGS_SUPPLEMENT[language] as Record<string, string>;
        for (const source of proseOf(ending, id)) {
          if (shipped[source] === undefined) {
            missing.push(`${id} [${language}]: ${JSON.stringify(source.slice(0, 60))}`);
          }
        }
      }
    }

    expect(missing).toEqual([]);
  });

  it('carries no translation keyed to prose that no longer exists', () => {
    // An orphan is the fingerprint of the drift: the English was edited and its
    // translation left behind. Catching it names the cause, where the tests
    // above only show the effect.
    //
    // This is also the check that must know about dynamic copy. An earlier
    // version of it read `fields` alone, called the smoking-gun translations
    // orphans, and would have deleted live copy had it been believed.
    const orphaned: string[] = [];

    for (const [id, ending] of Object.entries(ENDINGS)) {
      const live = new Set(proseOf(ending, id));
      const aol = (ending.fields.aol ?? {}) as Record<string, unknown>;
      if (typeof aol.imageAlt === 'string') live.add(aol.imageAlt);

      for (const language of LANGUAGES) {
        for (const key of Object.keys(ending.translations?.[language] ?? {})) {
          if (!live.has(key)) {
            orphaned.push(`${id} [${language}]: ${JSON.stringify(key.slice(0, 60))}`);
          }
        }
      }
    }

    expect(orphaned).toEqual([]);
  });

  it('covers the copy that is swapped in at render time', () => {
    // Guards the guard: if these constants are renamed or the swap mechanism
    // moves, DYNAMIC_COPY goes quietly empty and the coverage checks above stop
    // seeing the very strings that were missing translations.
    const covered = Object.values(DYNAMIC_COPY).flat();
    expect(covered).toHaveLength(4);
    for (const source of covered) {
      expect(source.length).toBeGreaterThan(80);
      for (const language of LANGUAGES) {
        expect(
          (ENDINGS_SUPPLEMENT[language] as Record<string, string>)[source],
          `${language} is missing a render-time swap`
        ).toBeTruthy();
      }
    }
  });

  it('covers every ending, so the guard cannot pass by finding nothing', () => {
    const counts = Object.entries(ENDINGS).map(([id, e]) => proseOf(e, id).length);
    expect(Object.keys(ENDINGS).length).toBeGreaterThanOrEqual(12);
    expect(Math.min(...counts)).toBeGreaterThanOrEqual(8);
  });
});
