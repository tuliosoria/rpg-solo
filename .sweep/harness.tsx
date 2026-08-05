import React from 'react';
import { describe, it, beforeAll } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { I18nProvider, useI18n, Language } from '../app/i18n';
import { Collected } from './collect';

const STORAGE_KEY = 'terminal1996_language';
export const LANGS: Language[] = ['en', 'pt-BR', 'es'];

function wrapper({ children }: { children: React.ReactNode }) {
  return <I18nProvider>{children}</I18nProvider>;
}

/**
 * Runs the WHOLE pipeline once per language.
 *
 * `tSystem` (and every other `translateStatic` caller in the engine) resolves
 * against `getStoredLanguage()` at command-execution time, not at render time.
 * Collecting entries once and rendering them three times therefore bakes the
 * engine-side translation to whatever language was stored during collection —
 * making every `tSystem` string look untranslated. The language has to be set
 * before `executeCommand` runs, not just before the render.
 */
export async function renderPerLanguage(
  collectFn: () => Collected[]
): Promise<{ collected: Collected[]; rendered: Record<Language, string[]> }> {
  const rendered = {} as Record<Language, string[]>;
  let collected: Collected[] = [];

  for (const lang of LANGS) {
    window.localStorage.clear();
    window.localStorage.setItem(STORAGE_KEY, lang);

    const { result, unmount } = renderHook(() => useI18n(), { wrapper });
    await waitFor(() => {
      if (result.current.language !== lang) throw new Error('not ready');
    });
    const { t, translateRuntimeText } = result.current;

    // Engine runs INSIDE the language pass.
    const entries = collectFn();
    if (lang === 'en') collected = entries;

    rendered[lang] = entries.map(c => {
      const e = c.entry;
      if (e.type === 'input') return e.content;
      if (e.i18nKey) return t(e.i18nKey, e.i18nValues, e.content);
      return translateRuntimeText(e.content);
    });
    unmount();
  }

  return { collected, rendered };
}

export function reportSameAcrossLanguages(
  collected: Collected[],
  rendered: Record<Language, string[]>,
  opts: { label: string; minLen?: number }
) {
  const minLen = opts.minLen ?? 12;
  const byScenario = new Map<string, Set<string>>();
  const n = Math.min(...LANGS.map(l => rendered[l].length));
  for (let i = 0; i < n; i++) {
    const en = rendered.en[i];
    if (en !== rendered['pt-BR'][i] || en !== rendered.es[i]) continue;
    const trimmed = en.trim();
    if (trimmed.length < minLen) continue;
    const words = trimmed.match(/[A-Za-zÀ-ÿ]{3,}/g) ?? [];
    if (words.length < 3) continue;
    const key = collected[i]?.scenario ?? '?';
    if (!byScenario.has(key)) byScenario.set(key, new Set());
    byScenario.get(key)!.add(trimmed);
  }
  const total = [...byScenario.values()].reduce((a, s) => a + s.size, 0);
  const lines: string[] = [];
  for (const [scenario, set] of byScenario) {
    lines.push(`--- ${scenario} (${set.size})`);
    for (const s of set) lines.push(`      ${JSON.stringify(s.slice(0, 160))}`);
  }
  console.log(`\n=== ${opts.label}: ${total} strings in ${byScenario.size} scenarios ===\n${lines.join('\n')}`);
  return { total, byScenario };
}

// Self-check that the harness itself is sound: `help basics` is known-translated
// and must NOT show up as a gap, while a raw box-rule must be filtered out.
describe('harness sanity', () => {
  it('resolves engine-time translations when the language is set first', async () => {
    const { executeCommand } = await import('../app/engine/commands');
    const { freshState } = await import('./collect');
    const out: string[] = [];
    for (const lang of LANGS) {
      window.localStorage.clear();
      window.localStorage.setItem(STORAGE_KEY, lang);
      const r = executeCommand('help', freshState());
      out.push(r.output.map(e => e.content).join('\n').slice(0, 200));
    }
    console.log('\n=== ENGINE-TIME help, per stored language ===');
    LANGS.forEach((l, i) => console.log(`[${l}] ${JSON.stringify(out[i].slice(0, 180))}`));
  });
});
