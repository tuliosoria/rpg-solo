/**
 * Guards that UFO74 is labelled the same way wherever they speak.
 *
 * UFO74's lines reach the screen through two pipelines: scripted ones resolved
 * by locale key through `translateStatic`, and improvised ones resolved by
 * matching source text through `translateRuntimeText`. For a while only the
 * second normalized the speaker label, so the tutorial rendered
 *
 *     UFO74: Type ls
 *     > dir
 *     [UFO74]: Close idea, wrong system. Try: ls
 *
 * — the same character labelled two ways, one line apart, in the first minute
 * of the game. Nothing failed; it just looked like a bug in the fiction.
 *
 * The locale files still carry both forms, and deliberately so: normalizing at
 * render keeps this in one place instead of spread across several hundred
 * strings in three languages. What must hold is that only the bracketed form
 * ever reaches the player.
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

/** A speaker line in either stored form. */
const ANY_SPEAKER_PREFIX = /^\[?UFO74\]?:/;
/** The one form allowed to reach the screen. */
const RENDERED_PREFIX = /^\[UFO74\]: /;

describe('UFO74 speaker prefix', () => {
  it('renders every scripted line with the bracketed label', () => {
    const wrong: string[] = [];

    for (const [language, table] of LOCALES) {
      for (const [key, value] of Object.entries(table)) {
        if (typeof value !== 'string' || !ANY_SPEAKER_PREFIX.test(value)) continue;

        const rendered = translateStatic(key, undefined, undefined, language);
        if (!RENDERED_PREFIX.test(rendered)) {
          wrong.push(`${language} ${key}: ${JSON.stringify(rendered.slice(0, 60))}`);
        }
      }
    }

    expect(wrong).toEqual([]);
  });

  it('never doubles the brackets on an already-labelled line', () => {
    // Normalizing must be idempotent: the 112 strings already stored bracketed
    // pass through the same code path as the 201 stored bare.
    const doubled: string[] = [];

    for (const [language, table] of LOCALES) {
      for (const [key, value] of Object.entries(table)) {
        if (typeof value !== 'string' || !ANY_SPEAKER_PREFIX.test(value)) continue;

        const rendered = translateStatic(key, undefined, undefined, language);
        if (/^\[\[|\]\]:/.test(rendered)) {
          doubled.push(`${language} ${key}: ${JSON.stringify(rendered.slice(0, 60))}`);
        }
      }
    }

    expect(doubled).toEqual([]);
  });

  it('finds lines in both stored forms, so it is guarding something', () => {
    // If the locale files were ever rewritten to a single form, the tests above
    // would keep passing while covering only half the code path.
    let bare = 0;
    let bracketed = 0;

    for (const [, table] of LOCALES) {
      for (const value of Object.values(table)) {
        if (typeof value !== 'string') continue;
        if (/^\[UFO74\]:/.test(value)) bracketed++;
        else if (/^UFO74:/.test(value)) bare++;
      }
    }

    expect(bare).toBeGreaterThan(0);
    expect(bracketed).toBeGreaterThan(0);
  });

  it('gives the speaker slot to no handle but UFO74', () => {
    // The normalizer can only unify labels it recognizes as UFO74's. It cannot
    // catch a line of theirs filed under a different handle, which is how the
    // `tree` confirmation came to read "[HackerKid]: Hey kid, ..." — UFO74's
    // warning attributed to hackerkid, the handle UFO74 hands the *player* in
    // the tutorial ("You will be... hackerkid.").
    const foreign: string[] = [];

    for (const [language, table] of LOCALES) {
      for (const [key, value] of Object.entries(table)) {
        if (typeof value !== 'string') continue;
        const speaker = value.match(/^\s*\[([A-Za-z0-9_ ]{2,20})\]\s*:/);
        if (speaker && speaker[1] !== 'UFO74') {
          foreign.push(`${language} ${key}: ${JSON.stringify(value.slice(0, 60))}`);
        }
      }
    }

    expect(foreign).toEqual([]);
  });

  it('leaves lines that merely mention UFO74 alone', () => {    // Only a speaker prefix may be rewritten. The disconnect notice and the
    // fixed-width banner are not prefixes, and one of them is a box-drawn row
    // whose width is load-bearing.
    const untouched = [
      'terminal.tutorialSkip.disconnected', // "[UFO74 has disconnected]"
    ];

    for (const key of untouched) {
      const source = (en as Record<string, string>)[key];
      if (typeof source !== 'string') continue;
      expect(translateStatic(key, undefined, undefined, 'en')).toBe(source);
    }

    // Any fixed-width row mentioning UFO74 must keep its exact width.
    for (const [language, table] of LOCALES) {
      for (const [key, value] of Object.entries(table)) {
        if (typeof value !== 'string') continue;
        if (!/^[║│┃].*UFO74/.test(value)) continue;
        const rendered = translateStatic(key, undefined, undefined, language);
        expect([...rendered].length, `${language} ${key} changed width`).toBe([...value].length);
      }
    }
  });
});
