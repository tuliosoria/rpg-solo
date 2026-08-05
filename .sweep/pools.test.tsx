/**
 * Exhaustive check of every chat line in the game against the runtime tables.
 *
 * `chat` picks randomly from large pools, so a bot run only ever samples a
 * couple of them — the sweep saw 2 of 273 PRISONER_45 lines. This reads the
 * source of truth directly instead.
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

/** Pull every single/double-quoted string literal out of a source file. */
function stringLiteralsOf(file: string): string[] {
  const src = fs.readFileSync(path.resolve(process.cwd(), file), 'utf8');
  const out: string[] = [];
  const re = /(['"])((?:\\.|(?!\1)[^\\\n])*)\1/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const raw = m[2]
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n')
      .replace(/\\\\/g, '\\');
    out.push(raw);
  }
  return out;
}

function isProse(s: string): boolean {
  const t = s.trim();
  if (t.length < 14) return false;
  if (/^[A-Za-z0-9_./-]+$/.test(t)) return false; // identifiers, paths, keys
  if (/^(engine|terminal|runtime|ui)\./.test(t)) return false; // i18n keys
  const words = t.match(/[A-Za-zÀ-ÿ']{3,}/g) ?? [];
  return words.length >= 3;
}

describe('EXHAUSTIVE: speaker-pool lines vs runtime tables', () => {
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
  ];

  it('reports untranslated prose per file', async () => {
    const perFile = FILES.map(f => ({ file: f, lines: [...new Set(stringLiteralsOf(f).filter(isProse))] }));

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
        for (const line of lines) {
          if (translateRuntimeText(line) === line) {
            missing[file] ??= {};
            missing[file][lang] ??= [];
            missing[file][lang].push(line);
          }
        }
      }
      unmount();
    }

    const report: string[] = [];
    for (const { file, lines } of perFile) {
      const pt = missing[file]?.['pt-BR']?.length ?? 0;
      const es = missing[file]?.['es']?.length ?? 0;
      report.push(`${file}: ${lines.length} prose literals | untranslated pt-BR=${pt} es=${es}`);
    }
    console.log('\n=== PER-FILE SUMMARY ===\n' + report.join('\n'));

    for (const { file } of perFile) {
      const both = (missing[file]?.['pt-BR'] ?? []).filter(l => (missing[file]?.['es'] ?? []).includes(l));
      if (!both.length) continue;
      console.log(`\n=== ${file}: ${both.length} untranslated in BOTH pt-BR and es ===`);
      for (const l of both.slice(0, 400)) console.log(`   ${JSON.stringify(l.slice(0, 160))}`);
    }
  }, 120000);
});
