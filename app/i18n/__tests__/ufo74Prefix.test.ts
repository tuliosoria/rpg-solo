/**
 * Guards that UFO74 is labelled the same way wherever they speak.
 *
 * UFO74's lines reach the screen through two pipelines: scripted ones resolved
 * by locale key through `translateStatic`, and improvised ones resolved by
 * matching source text through `translateRuntimeText`. Only the second
 * normalized the speaker prefix, so the tutorial rendered
 *
 *     UFO74: Type ls
 *     > dir
 *     [UFO74]: Close idea, wrong system. Try: ls
 *
 * — the same character labelled two ways, one line apart, in the first minute
 * of the game. Nothing failed; it just looked like a bug in the fiction.
 *
 * The locale files still store the bracketed form for the scripted lines. That
 * is fine, and deliberately untouched: normalizing at render keeps the fix in
 * one place instead of spread across hundreds of strings in three languages.
 * What must hold is that nothing bracketed survives to the screen.
 */
import { describe, it, expect } from 'vitest';
import { translateStatic } from '../index';
import en from '../../locales/en.json';
import es from '../../locales/es.json';
import ptBr from '../../locales/pt-br.json';

const LOCALES = [
  ['en', en as Record<string, string>],
  ['es', es as Record<string, string>],
  ['pt-BR', ptBr as Record<string, string>],
] as const;

/** The source form stored in the locale files. */
const SOURCE_PREFIX = /^\[UFO74\]:/;

describe('UFO74 speaker prefix', () => {
  it('renders every scripted line with the normalized prefix', () => {
    const leaked: string[] = [];

    for (const [language, table] of LOCALES) {
      for (const [key, value] of Object.entries(table)) {
        if (typeof value !== 'string' || !SOURCE_PREFIX.test(value)) continue;

        const rendered = translateStatic(key, undefined, undefined, language);
        if (SOURCE_PREFIX.test(rendered)) {
          leaked.push(`${language} ${key}: ${JSON.stringify(rendered.slice(0, 60))}`);
        }
      }
    }

    expect(leaked).toEqual([]);
  });

  it('finds bracketed source strings to normalize', () => {
    // If the locale files were ever rewritten to store the bare form, the test
    // above would pass while checking nothing. This keeps it honest.
    const bracketed = LOCALES.flatMap(([, table]) =>
      Object.values(table).filter(v => typeof v === 'string' && SOURCE_PREFIX.test(v))
    );

    expect(bracketed.length).toBeGreaterThan(0);
  });
});
