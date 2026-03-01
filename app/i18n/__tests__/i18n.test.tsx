import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { I18nProvider, translateStatic, useI18n } from '../index';

const STORAGE_KEY = 'terminal1996_language';

function wrapper({ children }: { children: React.ReactNode }) {
  return <I18nProvider>{children}</I18nProvider>;
}

describe('i18n system', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('translates static keys with interpolation', () => {
    const message = translateStatic('terminal.timer.sequence', { value: '7-3-1' }, undefined, 'en');
    expect(message).toBe('Sequence: 7-3-1');
  });

  it('loads persisted language from localStorage', async () => {
    window.localStorage.setItem(STORAGE_KEY, 'pt-BR');
    const { result } = renderHook(() => useI18n(), { wrapper });

    await waitFor(() => {
      expect(result.current.language).toBe('pt-BR');
    });
  });

  it('updates and persists language through context', async () => {
    const { result } = renderHook(() => useI18n(), { wrapper });

    await waitFor(() => {
      expect(result.current.language).toBe('en');
    });

    act(() => {
      result.current.setLanguage('es');
    });

    expect(result.current.language).toBe('es');
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('es');
  });

  it('translates runtime dictionary lines', async () => {
    const { result } = renderHook(() => useI18n(), { wrapper });

    act(() => {
      result.current.setLanguage('pt-BR');
    });

    expect(result.current.translateRuntimeText('MISSION COMPLETE')).toBe('MISSÃO CONCLUÍDA');
  });

  it('translates runtime dynamic patterns', async () => {
    const { result } = renderHook(() => useI18n(), { wrapper });

    act(() => {
      result.current.setLanguage('es');
    });

    expect(result.current.translateRuntimeText('Unknown command: xyz')).toBe('Comando desconocido: xyz');
    expect(result.current.translateRuntimeText('   [Invalid attempts: 3/8]')).toBe(
      '   [Intentos inválidos: 3/8]'
    );
  });
});
