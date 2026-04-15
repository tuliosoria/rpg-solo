import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_GAME_STATE, GameState } from '../../types';
import { systemCommands } from '../commands/system';

function createTestState(overrides: Partial<GameState> = {}): GameState {
  return {
    ...DEFAULT_GAME_STATE,
    ...overrides,
  } as GameState;
}

describe('systemCommands save/unsave localization', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('localizes save usage output in Spanish', () => {
    window.localStorage.setItem('terminal1996_language', 'es');

    const result = systemCommands.save([], createTestState());
    const output = result.output.map(entry => entry.content);

    expect(output).toContain('  USO: save <filename>');
    expect(output).toContain('  Guarda un archivo en tu dossier para la filtración.');
    expect(output).toContain('  Dossier: 0/10 archivos guardados');
  });

  it('localizes save and unsave file actions in pt-BR', () => {
    window.localStorage.setItem('terminal1996_language', 'pt-BR');

    const filePath = '/ops/report.txt';
    const savedResult = systemCommands.save(
      ['report.txt'],
      createTestState({
        filesRead: new Set([filePath]),
        savedFiles: new Set(),
      })
    );

    expect(savedResult.output.map(entry => entry.content)).toContain(
      '  ◉ ARQUIVO SALVO NO DOSSIÊ: report.txt'
    );

    const unsavedResult = systemCommands.unsave(
      ['report.txt'],
      createTestState({
        savedFiles: new Set([filePath]),
      })
    );

    expect(unsavedResult.output.map(entry => entry.content)).toContain(
      '  ◎ ARQUIVO REMOVIDO DO DOSSIÊ: report.txt'
    );
  });
});
