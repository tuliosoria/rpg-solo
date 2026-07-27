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

    expect(output).toContain('  USO: guardar <archivo>');
    expect(output).toContain('  Guarda un archivo leído cuando refuerce tu caso.');
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

  it('adds UFO74 dossier-stakes feedback when the fifth file is saved', () => {
    const savedFiles = new Set([
      '/ops/incident_report_1996_01_VG.txt',
      '/ops/initial_response_orders.txt',
      '/storage/autopsy_alpha.log',
      '/storage/witness_statement_raw.txt',
    ]);
    const filePath = '/storage/bio_container.log';

    const result = systemCommands.save(
      ['bio_container.log'],
      createTestState({
        filesRead: new Set([filePath]),
        savedFiles,
      })
    );

    expect(result.pendingUfo74Messages?.some(entry => entry.content.includes('five saved'))).toBe(true);
    expect(result.pendingUfo74Messages?.some(entry => entry.content.includes('not enough to make them believe you'))).toBe(true);
  });
});
