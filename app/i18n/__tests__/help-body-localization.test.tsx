import { describe, expect, it } from 'vitest';
import ptBr from '../../locales/pt-br.json';
import es from '../../locales/es.json';
import en from '../../locales/en.json';

describe('help body — command localization (BUG-002)', () => {
  const englishLiteralsForbiddenInLocalized: Array<[string, RegExp]> = [
    ['engine.commands.system.helpMenu.basics', /\bhelp\s+basics\b/],
    ['engine.commands.system.helpMenu.save', /^\s*save\b/],
    ['engine.commands.system.helpMenu.unsave', /^\s*unsave\b/],
    ['engine.commands.system.helpMenu.open', /^\s*open\b/],
    ['engine.commands.system.helpMenu.search', /^\s*search\b/],
    ['engine.commands.system.helpMenu.last', /^\s*last\b/],
    ['engine.commands.system.helpMenu.note', /^\s*note\b/],
    ['engine.commands.system.helpMenu.notes', /^\s*notes\b/],
    ['engine.commands.system.helpMenu.progress', /^\s*progress\b/],
    ['engine.commands.system.helpMenu.hint', /^\s*hint\b/],
    ['engine.commands.system.helpMenu.wait', /^\s*wait\b/],
    ['engine.commands.system.helpMenu.leak', /^\s*leak\b/],
    ['engine.commands.system.helpMenu.help', /^\s*help\b/],
    ['engine.commands.system.helpMenu.status', /^\s*status\b/],
    ['engine.commands.system.helpMenu.clear', /^\s*clear\b/],
  ];

  describe('PT-BR', () => {
    for (const [key, forbiddenPattern] of englishLiteralsForbiddenInLocalized) {
      it(`${key} does not start with an English command literal`, () => {
        const value = (ptBr as Record<string, string>)[key];
        if (value === undefined) return;
        expect(value).not.toMatch(forbiddenPattern);
      });
    }
  });

  describe('ES', () => {
    for (const [key, forbiddenPattern] of englishLiteralsForbiddenInLocalized) {
      it(`${key} does not start with an English command literal`, () => {
        const value = (es as Record<string, string>)[key];
        if (value === undefined) return;
        expect(value).not.toMatch(forbiddenPattern);
      });
    }
  });

  describe('EN regression', () => {
    it('EN helpMenu.save still starts with "save"', () => {
      expect((en as Record<string, string>)['engine.commands.system.helpMenu.save']).toMatch(/^\s*save\b/);
    });
  });
});
