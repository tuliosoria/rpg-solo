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
 * The file also still holds translations keyed to prose that has since been
 * deleted or rewritten. Those are inert — nothing looks them up — and they are
 * left alone here because two existing tests pin specific ones
 * (runtimeCommandSupplement.smokingGun, endingsSupplement.equivalence), which
 * makes removing them a separate decision rather than a side effect of this fix.
 */
import { describe, it, expect } from 'vitest';
import endingsData from '../../data/endingsContent.json';
import { ENDINGS_SUPPLEMENT } from '../../i18n/generated/endingsSupplement.generated';

type Ending = {
  fields: Record<string, unknown>;
  translations: Record<string, Record<string, string>>;
};

const ENDINGS = endingsData as unknown as Record<string, Ending>;
const LANGUAGES = ['pt-BR', 'es'] as const;

/** Every string on an ending that the player reads as prose. */
function proseOf(ending: Ending): string[] {
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
  ].filter((s): s is string => typeof s === 'string' && s.trim().length > 3);
}

describe('ending translation coverage', () => {
  it('translates every ending string into pt-BR and Spanish', () => {
    const missing: string[] = [];

    for (const [id, ending] of Object.entries(ENDINGS)) {
      for (const language of LANGUAGES) {
        const table = ending.translations?.[language] ?? {};
        for (const source of proseOf(ending)) {
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
        for (const source of proseOf(ending)) {
          if (shipped[source] === undefined) {
            missing.push(`${id} [${language}]: ${JSON.stringify(source.slice(0, 60))}`);
          }
        }
      }
    }

    expect(missing).toEqual([]);
  });

  it('covers every ending, so the guard cannot pass by finding nothing', () => {
    const counts = Object.values(ENDINGS).map(proseOf).map(p => p.length);
    expect(Object.keys(ENDINGS).length).toBeGreaterThanOrEqual(12);
    expect(Math.min(...counts)).toBeGreaterThanOrEqual(8);
  });
});
