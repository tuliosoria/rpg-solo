/**
 * Guards the alignment of ASCII box-drawn UI across locales.
 *
 * Several terminal panels (the dossier map, tutorial tip boxes) draw their top,
 * middle, and bottom borders from hardcoded literals in the engine, while the
 * content lines between them come from the locale files with the `║ … ║` border
 * characters baked into the translated string.
 *
 * That means a translated content line MUST be exactly as wide as its English
 * counterpart. If it is not, the right-hand border juts out or falls short of
 * the code-drawn border and the panel renders ragged — which, in a game whose
 * entire visual identity is a 1996 terminal, reads as broken.
 *
 * `keyCoverage.test.ts` cannot catch this: it only verifies that keys exist.
 * Nothing about a one-column-narrow string is detectable at runtime either — it
 * just quietly looks wrong, and only in the locales the author does not read.
 */
import { describe, it, expect } from 'vitest';
import en from '../../locales/en.json';
import ptBr from '../../locales/pt-br.json';
import es from '../../locales/es.json';

const LOCALES: Array<[string, Record<string, string>]> = [
  ['pt-br', ptBr as Record<string, string>],
  ['es', es as Record<string, string>],
];

const VERTICAL_BORDER = /^[║│┃].*[║│┃]$/;

/**
 * A fixed-width box content line: opens and closes with a vertical border
 * character. Self-contained banners like `═══ TITLE ═══` are deliberately
 * excluded — they carry their own decoration and may freely change width.
 */
function isFixedWidthBoxLine(value: unknown): value is string {
  return typeof value === 'string' && VERTICAL_BORDER.test(value);
}

// Count by code point, not UTF-16 code unit, so box-drawing characters and
// accented Latin glyphs each count as the single column they render as.
function displayWidth(value: string): number {
  return [...value].length;
}

describe('i18n box-drawing alignment', () => {
  const source = en as Record<string, string>;
  const boxKeys = Object.keys(source).filter(key => isFixedWidthBoxLine(source[key]));

  it('finds the fixed-width box lines it is meant to guard', () => {
    // Sanity check: if a refactor moves these panels out of the locale files,
    // this suite would silently pass while guarding nothing.
    expect(boxKeys.length).toBeGreaterThan(0);
  });

  it('keeps every translated box line the same width as English', () => {
    const misaligned: string[] = [];

    for (const key of boxKeys) {
      const expected = displayWidth(source[key]);

      for (const [locale, table] of LOCALES) {
        const translated = table[key];
        if (typeof translated !== 'string') continue;

        const actual = displayWidth(translated);
        if (actual !== expected) {
          misaligned.push(
            `${key} [${locale}]: expected width ${expected}, got ${actual} — ${JSON.stringify(translated)}`
          );
        }
      }
    }

    expect(misaligned).toEqual([]);
  });

  it('keeps translated box lines closed on both sides', () => {
    const unclosed: string[] = [];

    for (const key of boxKeys) {
      for (const [locale, table] of LOCALES) {
        const translated = table[key];
        if (typeof translated !== 'string') continue;

        if (!VERTICAL_BORDER.test(translated)) {
          unclosed.push(`${key} [${locale}]: ${JSON.stringify(translated)}`);
        }
      }
    }

    expect(unclosed).toEqual([]);
  });
});
