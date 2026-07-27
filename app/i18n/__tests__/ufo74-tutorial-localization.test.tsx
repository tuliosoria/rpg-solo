import { describe, expect, it } from 'vitest';
import ptBr from '../../locales/pt-br.json';
import es from '../../locales/es.json';

describe('UFO74 tutorial strings — command localization (BUG-001)', () => {
  describe('PT-BR', () => {
    it('ufo74_use_save_filename uses `salvar`, not `save`', () => {
      const s = ptBr['engine.commands.interactiveTutorial.ufo74_use_save_filename'];
      expect(s).toContain('salvar');
      expect(s).not.toMatch(/`save\b/);
    });

    it('ufo74_use_unsave_filename uses `remover`, not `unsave`, and re-phrases the trailing verb in military register', () => {
      const s = ptBr['engine.commands.interactiveTutorial.ufo74_use_unsave_filename'];
      expect(s).toContain('remover');
      expect(s).not.toMatch(/`unsave\b/);
      expect(s).not.toMatch(/\bremove\.\s*$/);
    });
  });

  describe('ES', () => {
    it('ufo74_use_save_filename uses `guardar`, not `save`', () => {
      const s = es['engine.commands.interactiveTutorial.ufo74_use_save_filename'];
      expect(s).toContain('guardar');
      expect(s).not.toMatch(/`save\b/);
    });

    it('ufo74_use_unsave_filename uses `quitar`, not `unsave`', () => {
      const s = es['engine.commands.interactiveTutorial.ufo74_use_unsave_filename'];
      expect(s).toContain('quitar');
      expect(s).not.toMatch(/`unsave\b/);
    });
  });
});
