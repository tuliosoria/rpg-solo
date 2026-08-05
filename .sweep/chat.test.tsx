/**
 * End-to-end: actually run `chat <question>` and look at what a pt-BR / es
 * player sees, rather than inferring from source literals.
 */
import React from 'react';
import { describe, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { I18nProvider, useI18n, Language } from '../app/i18n';
import { executeCommand } from '../app/engine/commands';
import { freshState } from './collect';
import { GameState } from '../app/types';

const STORAGE_KEY = 'terminal1996_language';
const LANGS: Language[] = ['en', 'pt-BR', 'es'];

function wrapper({ children }: { children: React.ReactNode }) {
  return <I18nProvider>{children}</I18nProvider>;
}

// One question per PRISONER_45 category keyword, plus repeats to drain tiers.
const QUESTIONS = [
  'what is the password', 'tell me about telepathy', 'what experiments did they run',
  'who are you', 'what happened at varginha', 'describe the alien', 'can you escape',
  'what is the truth', 'i need help', 'what did the military do', 'describe the crash',
  'did anyone die', 'do you believe in god', 'was it disinformation', 'any witnesses',
  'are you afraid', 'what sounds do you hear', 'what about the hospital',
  'where are you', 'are you brazilian', 'hello', 'how are you', 'thanks', 'sorry',
  'do you love anyone', 'tell me about your family', 'what food do you eat',
  'how is the weather', 'do you like music', 'tell me a joke', 'is there hope',
  'who is ufo74', 'is this real', 'is this a game', 'how old are you',
];

describe('E2E: chat output per language', () => {
  it('runs every chat category in all three languages', async () => {
    const perLang: Record<Language, string[]> = {} as Record<Language, string[]>;

    for (const lang of LANGS) {
      window.localStorage.clear();
      window.localStorage.setItem(STORAGE_KEY, lang);
      const { result, unmount } = renderHook(() => useI18n(), { wrapper });
      await waitFor(() => {
        if (result.current.language !== lang) throw new Error('not ready');
      });
      const { t, translateRuntimeText } = result.current;

      const lines: string[] = [];
      let state: GameState = freshState();
      state = { ...state, ...executeCommand('chat', state).stateChanges } as GameState;
      // Ask each question from a state where the relay is open, repeating a few
      // times per category so multiple tiers are drawn.
      for (let round = 0; round < 3; round++) {
        for (const q of QUESTIONS) {
          const r = executeCommand(`chat ${q}`, state);
          state = { ...state, ...r.stateChanges } as GameState;
          for (const e of r.output) {
            if (e.type === 'input') continue;
            const rendered = e.i18nKey
              ? t(e.i18nKey, e.i18nValues, e.content)
              : translateRuntimeText(e.content);
            if (rendered.trim()) lines.push(rendered);
          }
        }
      }
      perLang[lang] = lines;
      unmount();
    }

    const n = Math.min(...LANGS.map(l => perLang[l].length));
    console.log(`\ncounts: ${LANGS.map(l => `${l}=${perLang[l].length}`).join(' ')}`);

    const same = new Set<string>();
    for (let i = 0; i < n; i++) {
      const en = perLang.en[i];
      if (en === perLang['pt-BR'][i] && en === perLang.es[i] && /[A-Za-z]{3,}.*[A-Za-z]{3,}/.test(en)) {
        same.add(en.trim());
      }
    }
    console.log(`\n=== CHAT LINES IDENTICAL IN ALL 3 LANGUAGES: ${same.size} ===`);
    for (const s of [...same].slice(0, 120)) console.log(`   ${JSON.stringify(s.slice(0, 150))}`);
  }, 120000);
});
