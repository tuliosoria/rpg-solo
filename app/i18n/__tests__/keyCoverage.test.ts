/**
 * Guards that every i18n key referenced from engine/UI code actually exists in
 * `en.json`.
 *
 * `createEntryI18n(type, key, fallback)` and `translateStatic(key, …, fallback)`
 * both silently fall back to the hardcoded English string when the key is
 * missing. That looks fine in English and quietly ships untranslated text to
 * pt-BR and es players, so nothing surfaces the drift at runtime.
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import en from '../../locales/en.json';

const APP_ROOT = join(__dirname, '..', '..');
const SKIPPED_DIRS = new Set(['__tests__', 'node_modules', 'locales']);

function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (SKIPPED_DIRS.has(entry)) continue;
      sourceFiles(full, out);
    } else if (/\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

// Matches the key argument of createEntryI18n('type', 'the.key', …) and
// translateStatic('the.key', …). Template literals and computed keys are
// skipped on purpose — they cannot be statically verified.
const ENTRY_KEY = /createEntryI18n\(\s*'[^']*'\s*,\s*'([^']+)'/g;
const STATIC_KEY = /translateStatic\(\s*'([^']+)'/g;
/**
 * Matches the descriptor shape `{ key: 'the.key', fallback: '…' }`.
 *
 * `hintSystem.ts` does not call `createEntryI18n` directly — it returns
 * `HintDescriptor`s that the caller resolves later — so the two patterns above
 * saw none of its keys. `engine.hints.leak.ready` and `engine.hints.risk.critical`
 * were both absent from all three locale files and this test stayed green,
 * which meant the hint shown at the single most important moment in the game
 * (full dossier, player needs to be told to type `leak`) rendered in English
 * for every language.
 *
 * Requiring a `fallback` on the same construct keeps this anchored to the
 * localization shape and away from unrelated object literals that merely have
 * a `key` property.
 */
const DESCRIPTOR_KEY = /\bkey:\s*'([a-z][\w]*(?:\.[\w]+)+)'\s*,\s*\n?\s*fallback:/g;

describe('i18n key coverage', () => {
  it('registers every statically referenced key in en.json', () => {
    const known = new Set(Object.keys(en));
    const missing = new Map<string, string>();

    for (const file of sourceFiles(APP_ROOT)) {
      const source = readFileSync(file, 'utf8');
      for (const pattern of [ENTRY_KEY, STATIC_KEY, DESCRIPTOR_KEY]) {
        pattern.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = pattern.exec(source)) !== null) {
          const key = match[1];
          if (!known.has(key) && !missing.has(key)) {
            missing.set(key, file.slice(APP_ROOT.length + 1));
          }
        }
      }
    }

    expect([...missing].map(([key, file]) => `${key} (${file})`)).toEqual([]);
  });
});
