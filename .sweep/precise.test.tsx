/**
 * Precise: only literals passed as the CONTENT argument of `createEntry(type, '...')`.
 *
 * These carry no i18n key, so `translateRuntimeText` (the runtime tables) is the
 * only thing that can localize them. Literals passed to `createEntryI18n` are
 * English fallbacks behind a key and are excluded — counting those is what made
 * a naive source scrape report 411 phantom gaps in chat.ts.
 */
import fs from 'fs';
import path from 'path';
import React from 'react';
import { describe, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { I18nProvider, useI18n, Language } from '../app/i18n';

const STORAGE_KEY = 'terminal1996_language';
const LANGS: Language[] = ['pt-BR', 'es'];

function wrapper({ children }: { children: React.ReactNode }) {
  return <I18nProvider>{children}</I18nProvider>;
}

const TYPES = "'(?:input|output|system|warning|error|notice|ufo74|file|dim|prompt)'";

function createEntryLiterals(file: string): string[] {
  const src = fs.readFileSync(path.resolve(process.cwd(), file), 'utf8');
  const out: string[] = [];
  // createEntry('warning', 'some literal')  — single or double quoted content
  const re = new RegExp(`createEntry\\(\\s*${TYPES}\\s*,\\s*(['"])((?:\\\\.|(?!\\1)[^\\\\\\n])*)\\1`, 'g');
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    out.push(m[2].replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\'));
  }
  return out;
}

function isProse(s: string): boolean {
  const t = s.trim();
  if (t.length < 14) return false;
  const words = t.match(/[A-Za-zÀ-ÿ']{3,}/g) ?? [];
  return words.length >= 3;
}

const FILES = [
  'app/engine/commands/chat.ts',
  'app/engine/commands/system.ts',
  'app/engine/commands/evidence.ts',
  'app/engine/commands/filesystem.ts',
  'app/engine/commands/navigation.ts',
  'app/engine/commands/inventory.ts',
  'app/engine/commands/combat.ts',
  'app/engine/commands/archive.ts',
  'app/engine/commands/helpers.ts',
  'app/engine/commands/tutorial.ts',
  'app/engine/commands/interactiveTutorial.ts',
  'app/engine/commands.ts',
];

describe('PRECISE: createEntry content literals vs runtime tables', () => {
  it('reports untranslated per file', async () => {
    const perFile = FILES.filter(f => fs.existsSync(path.resolve(process.cwd(), f))).map(f => ({
      file: f,
      lines: [...new Set(createEntryLiterals(f).filter(isProse))],
    }));

    const missing: Record<string, Record<string, string[]>> = {};
    for (const lang of LANGS) {
      window.localStorage.clear();
      window.localStorage.setItem(STORAGE_KEY, lang);
      const { result, unmount } = renderHook(() => useI18n(), { wrapper });
      await waitFor(() => {
        if (result.current.language !== lang) throw new Error('not ready');
      });
      const { translateRuntimeText } = result.current;
      for (const { file, lines } of perFile) {
        missing[file] ??= {};
        missing[file][lang] = lines.filter(l => translateRuntimeText(l) === l);
      }
      unmount();
    }

    let grand = 0;
    console.log('\n=== SUMMARY (untranslated createEntry content literals) ===');
    for (const { file, lines } of perFile) {
      const both = missing[file]['pt-BR'].filter(l => missing[file]['es'].includes(l));
      grand += both.length;
      console.log(`${String(both.length).padStart(4)} / ${String(lines.length).padStart(4)}  ${file}`);
    }
    console.log(`TOTAL untranslated in both languages: ${grand}`);

    for (const { file } of perFile) {
      const both = missing[file]['pt-BR'].filter(l => missing[file]['es'].includes(l));
      if (!both.length) continue;
      console.log(`\n##### ${file} (${both.length})`);
      for (const l of both) console.log(`   ${JSON.stringify(l)}`);
    }
  }, 120000);
});
