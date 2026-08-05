/**
 * Guards PRISONER_45's dialogue against falling back to English.
 *
 * Every line the prisoner speaks is emitted from `commands/chat.ts` as a plain
 * `createEntry` string, so it reaches the player through `translateRuntimeText`
 * and needs an entry in `RUNTIME_TRANSLATIONS` to appear in anything but
 * English. There was no such entry for any of them: all 272 lines — the whole
 * arc of the game's most personal voice, a Brazilian sergeant describing a
 * Brazilian incident — rendered in English in the pt-BR and es builds.
 *
 * A reachability sweep found it, not a unit test, because nothing tied the
 * literal table in `chat.ts` to the translation layer. This test is that tie:
 * it reads the strings straight out of the shipped source, so a line added to
 * `chat.ts` without a translation fails here rather than silently shipping.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { RUNTIME_TRANSLATIONS } from '../runtime';

const LANGS = ['pt-BR', 'es'] as const;
const CHAT_SOURCE = join(__dirname, '..', '..', 'engine', 'commands', 'chat.ts');

/**
 * The two things that must stay byte-identical in every language, because they
 * are input the player types rather than prose they read:
 *   - the morse for COLHEITA, which is the override password puzzle;
 *   - `override protocol <answer>`, the literal command that spends it.
 */
const MORSE_COLHEITA = '-.-. --- .-.. .... . .. - .-';
const LITERAL_COMMAND = 'override protocol <answer>';

/** Every `PRISONER_45…` string literal in the shipped chat module. */
function prisonerLines(): string[] {
  const source = readFileSync(CHAT_SOURCE, 'utf8');
  const literal = /(['"])((?:\\.|(?!\1)[^\\\r\n])*)\1/g;
  const found = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = literal.exec(source)) !== null) {
    const value = match[2].replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    if (value.startsWith('PRISONER_45')) found.add(value);
  }
  return [...found];
}

describe('PRISONER_45 dialogue localization', () => {
  const lines = prisonerLines();

  it('finds the dialogue table in chat.ts', () => {
    // A rename or refactor that empties this list would make every assertion
    // below vacuously pass, so the count is asserted before it is used.
    expect(lines.length).toBeGreaterThan(250);
  });

  for (const lang of LANGS) {
    it(`translates every line into ${lang}`, () => {
      const dictionary = RUNTIME_TRANSLATIONS[lang];
      const untranslated = lines.filter(line => {
        const translated = dictionary[line];
        return translated === undefined || translated === line;
      });
      expect(untranslated).toEqual([]);
    });

    it(`keeps the morse password and the literal command verbatim in ${lang}`, () => {
      const dictionary = RUNTIME_TRANSLATIONS[lang];
      for (const line of lines) {
        const translated = dictionary[line];
        if (!translated) continue;
        if (line.includes(MORSE_COLHEITA)) {
          expect(translated, `${lang} mangled the morse in ${JSON.stringify(line)}`).toContain(
            MORSE_COLHEITA
          );
        }
        if (line.includes(LITERAL_COMMAND)) {
          expect(
            translated,
            `${lang} translated the literal command in ${JSON.stringify(line)}`
          ).toContain(LITERAL_COMMAND);
        }
      }
    });

    it(`keeps the PRISONER_45 speaker prefix in ${lang}`, () => {
      const dictionary = RUNTIME_TRANSLATIONS[lang];
      const reprefixed = lines
        .filter(line => line.startsWith('PRISONER_45>'))
        .filter(line => dictionary[line] && !dictionary[line].startsWith('PRISONER_45>'));
      expect(reprefixed).toEqual([]);
    });
  }
});
