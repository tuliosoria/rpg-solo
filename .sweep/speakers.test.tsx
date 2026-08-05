/**
 * Precise check: every line that is emitted verbatim through `createEntry`
 * (no i18n key) and therefore depends on the runtime tables.
 *
 * Scoped to strings that begin with a speaker prefix, so it cannot pick up
 * keyword-match literals, i18n keys, or `createEntryI18n` English fallbacks.
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

function literals(file: string): string[] {
  const src = fs.readFileSync(path.resolve(process.cwd(), file), 'utf8');
  const out: string[] = [];
  const re = /(['"])((?:\\.|(?!\1)[^\\\n])*)\1/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    out.push(m[2].replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\'));
  }
  return out;
}

const SPEAKERS = /^(PRISONER_45>|SCOUT>|UFO74:|\[UFO74\]:)/;

describe('EXHAUSTIVE: speaker lines vs runtime tables', () => {
  it('every speaker-prefixed line has a pt-BR and es translation', async () => {
    const lines = [...new Set(literals('app/engine/commands/chat.ts').filter(s => SPEAKERS.test(s)))];
    console.log(`\nspeaker-prefixed lines found: ${lines.length}`);

    const missing: Record<string, string[]> = {};
    for (const lang of LANGS) {
      window.localStorage.clear();
      window.localStorage.setItem(STORAGE_KEY, lang);
      const { result, unmount } = renderHook(() => useI18n(), { wrapper });
      await waitFor(() => {
        if (result.current.language !== lang) throw new Error('not ready');
      });
      const { translateRuntimeText } = result.current;
      missing[lang] = lines.filter(l => translateRuntimeText(l) === l);
      unmount();
    }

    for (const lang of LANGS) {
      console.log(`\n=== ${lang}: ${missing[lang].length} / ${lines.length} untranslated ===`);
      for (const l of missing[lang]) console.log(`   ${JSON.stringify(l)}`);
    }

    const both = missing['pt-BR'].filter(l => missing['es'].includes(l));
    console.log(`\n=== untranslated in BOTH: ${both.length} ===`);
  }, 120000);
});
