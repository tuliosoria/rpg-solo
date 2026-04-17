import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { I18nProvider, translateStatic, useI18n } from '../index';
import en from '../../locales/en.json';
import ptBr from '../../locales/pt-br.json';
import es from '../../locales/es.json';

const STORAGE_KEY = 'terminal1996_language';

function wrapper({ children }: { children: React.ReactNode }) {
  return <I18nProvider>{children}</I18nProvider>;
}

describe('i18n system', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.lang = 'en';
    document.title = '';
    document.head.querySelector('meta[name="description"]')?.remove();
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

    expect(result.current.translateRuntimeText('Unknown command: xyz')).toBe(
      'Comando desconocido: xyz'
    );
    expect(result.current.translateRuntimeText('   [Invalid attempts: 3/8]')).toBe(
      '   [Intentos inválidos: 3/8]'
    );
  });

  it('translates leak-sequence wrapped runtime lines for pt-BR', async () => {
    const { result } = renderHook(() => useI18n(), { wrapper });

    act(() => {
      result.current.setLanguage('pt-BR');
    });

    expect(result.current.translateRuntimeText('  [DEBRIS]')).toBe('  [DESTROÇOS]');
    expect(result.current.translateRuntimeText('  "They moved the debris. Where?"')).toBe(
      '  "Eles moveram os destroços. Para onde?"'
    );
    expect(result.current.translateRuntimeText('  Acceptable.')).toBe('  Aceitável.');
    expect(result.current.translateRuntimeText('  [DETECTION: +18%]')).toBe('  [DETECÇÃO: +18%]');
    expect(result.current.translateRuntimeText('  [Wrong answers: 2/3]')).toBe(
      '  [Respostas erradas: 2/3]'
    );
    expect(
      result.current.translateRuntimeText('  You have 3 conspiracy document(s) in your cache.')
    ).toBe('  Você tem 3 documento(s) da conspiração no seu cache.');
  });

  it('keeps locale key parity across en, pt-BR, and es', () => {
    const enKeys = Object.keys(en).sort();
    expect(Object.keys(ptBr).sort()).toEqual(enKeys);
    expect(Object.keys(es).sort()).toEqual(enKeys);
  });

  it('translates tutorial guidance and command-hint lines for pt-BR', async () => {
    const { result } = renderHook(() => useI18n(), { wrapper });

    act(() => {
      result.current.setLanguage('pt-BR');
    });

    expect(result.current.translateRuntimeText('UFO74: new here? type "help basics".')).toBe(
      'UFO74: é novo por aqui? digite "help basics".'
    );
    expect(result.current.translateRuntimeText('[UFO74]: Close idea, wrong system. Try: ls')).toBe(
      'UFO74: Ideia certa, sistema errado. Tente: ls'
    );
    expect(
      result.current.translateRuntimeText('ls              List files in current directory')
    ).toBe('ls              Lista arquivos no diretório atual');
    expect(
      result.current.translateRuntimeText(
        '[UFO74]: Be careful, do not type wrong commands on the terminal. In doubt, type help.'
      )
    ).toBe('UFO74: Cuidado, não digite comandos errados no terminal. Na dúvida, digite help.');
  });

  it('translates tutorial, warning, and boot lines for Spanish', async () => {
    const { result } = renderHook(() => useI18n(), { wrapper });

    act(() => {
      result.current.setLanguage('es');
    });

    expect(result.current.translateRuntimeText('[UFO74]: Connection established.')).toBe(
      'UFO74: Conexión establecida.'
    );
    expect(
      result.current.translateRuntimeText(
        '[UFO74]: Type wrong commands 8 times, the window closes. Permanently. So concentrate, kid!'
      )
    ).toBe(
      'UFO74: Escribe comandos incorrectos 8 veces y la ventana se cierra. Para siempre. Así que concéntrate, kid!'
    );
    expect(
      result.current.translateRuntimeText(
        '⚠ RISK INCREASED: Invalid commands draw system attention.'
      )
    ).toBe('⚠ RIESGO AUMENTADO: los comandos inválidos llaman la atención del sistema.');
    expect(result.current.translateRuntimeText('BRAZILIAN INTELLIGENCE LEGACY SYSTEM')).toBe(
      'SISTEMA LEGADO DE INTELIGENCIA BRASILEÑA'
    );
  });

  it('translates new engine i18n keys for hint protocol and invalid command output', async () => {
    const { result } = renderHook(() => useI18n(), { wrapper });

    act(() => {
      result.current.setLanguage('pt-BR');
    });

    expect(result.current.t('engine.hints.protocol.activated')).toBe(
      '>>> PROTOCOLO DE DICAS ATIVADO'
    );
    expect(result.current.t('engine.invalidCommand.invalidAttempts', { value: 5 })).toBe(
      '   [Tentativas inválidas: 5/8]'
    );
  });

  it('translates status/help command output and runtime overlays for pt-BR', async () => {
    const { result } = renderHook(() => useI18n(), { wrapper });

    act(() => {
      result.current.setLanguage('pt-BR');
    });

    expect(
      result.current.translateRuntimeText(
        '  help [cmd]        Display help (or help for specific command)'
      )
    ).toBe('  help [cmd]        Exibe ajuda (ou ajuda para um comando específico)');
    expect(result.current.translateRuntimeText('SYSTEM STATUS')).toBe('STATUS DO SISTEMA');
    expect(result.current.translateRuntimeText('  EVIDENCE: 3/10 confirmed')).toBe(
      '  EVIDÊNCIAS: 3/10 confirmadas'
    );
    expect(result.current.translateRuntimeText('  FIREWALL: LOCKDOWN — 2 nodes remaining')).toBe(
      '  FIREWALL: BLOQUEIO — 2 nós restantes'
    );
    expect(result.current.translateRuntimeText('TRACE DETECTED: External observer connected')).toBe(
      'RASTRO DETECTADO: observador externo conectado'
    );
    expect(
      result.current.translateRuntimeText(
        "[UFO74]: Don't forget: 'note' saves reminders, 'bookmark' saves files."
      )
    ).toBe("UFO74: Não esqueça: 'note' salva lembretes, 'bookmark' salva arquivos.");
    expect(result.current.translateRuntimeText("[UFO74]: ⚠️  Hey kid, that's the FIREWALL.")).toBe(
      'UFO74: ⚠️  Ei, kid, isso é o FIREWALL.'
    );
  });

  it('updates document metadata and lang when the language changes', async () => {
    const { result } = renderHook(() => useI18n(), { wrapper });

    act(() => {
      result.current.setLanguage('es');
    });

    await waitFor(() => {
      expect(document.documentElement.lang).toBe('es');
    });

    expect(document.title).toBe(es['metadata.title']);
    expect(document.head.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      es['metadata.description']
    );
  });

  it('translates checkpoint reasons and turing video aria for pt-BR', async () => {
    const { result } = renderHook(() => useI18n(), { wrapper });

    act(() => {
      result.current.setLanguage('pt-BR');
    });

    expect(result.current.translateRuntimeText('First UFO74 contact')).toBe(
      'Primeiro contato com UFO74'
    );
    expect(result.current.translateRuntimeText('Tutorial skipped')).toBe('Tutorial ignorado');
    expect(result.current.translateRuntimeText('Evidence 3/5')).toBe('Evidências 3/5');
    expect(result.current.t('turing.video.aria')).toBe('Vídeo da avaliação de Turing');
  });

  it('translates checkpoint progress and access reasons for Spanish', async () => {
    const { result } = renderHook(() => useI18n(), { wrapper });

    act(() => {
      result.current.setLanguage('es');
    });

    expect(result.current.translateRuntimeText('Access level 2')).toBe('Nivel de acceso 2');
    expect(result.current.translateRuntimeText('Before leak transmission')).toBe(
      'Antes de la transmisión de la filtración'
    );
    expect(result.current.translateRuntimeText('Detection approaching critical')).toBe(
      'La detección se acerca al nivel crítico'
    );
  });
});
