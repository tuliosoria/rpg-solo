import React from 'react';
import { describe, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { I18nProvider, useI18n, Language } from '../app/i18n';
import { executeCommand } from '../app/engine/commands';
import { freshState } from './collect';
import { GameState } from '../app/types';

const STORAGE_KEY = 'terminal1996_language';

function wrapper({ children }: { children: React.ReactNode }) {
  return <I18nProvider>{children}</I18nProvider>;
}

describe('EYES-ON: a real pt-BR chat exchange', () => {
  it('prints what a Brazilian player actually sees', async () => {
    for (const lang of ['pt-BR', 'es'] as Language[]) {
      window.localStorage.clear();
      window.localStorage.setItem(STORAGE_KEY, lang);
      const { result, unmount } = renderHook(() => useI18n(), { wrapper });
      await waitFor(() => {
        if (result.current.language !== lang) throw new Error('not ready');
      });
      const { t, translateRuntimeText } = result.current;
      const render = (e: { type: string; content: string; i18nKey?: string; i18nValues?: Record<string, string | number> }) =>
        e.i18nKey ? t(e.i18nKey, e.i18nValues, e.content) : translateRuntimeText(e.content);

      let state: GameState = freshState();
      const out: string[] = [];
      for (const cmd of ['chat', 'chat quem e voce', 'chat o que aconteceu em varginha', 'chat fale do alien', 'chat qual a senha']) {
        const r = executeCommand(cmd, state);
        state = { ...state, ...r.stateChanges } as GameState;
        out.push(`$ ${cmd}`);
        for (const e of r.output) out.push('   ' + render(e));
      }
      console.log(`\n########## ${lang} ##########\n` + out.filter(l => l.trim()).join('\n'));
      unmount();
    }
  }, 60000);
});
