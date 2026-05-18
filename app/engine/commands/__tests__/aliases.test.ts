import { describe, expect, it } from 'vitest';
import {
  resolveCommandAlias,
  resolveSubcommandAlias,
  localizedCommandName,
} from '../utils';

describe('resolveSubcommandAlias (BUG-002)', () => {
  it('maps PT-BR "básica" → "basics"', () => {
    expect(resolveSubcommandAlias('básica')).toBe('basics');
  });
  it('maps ascii fallback "basica" → "basics"', () => {
    expect(resolveSubcommandAlias('basica')).toBe('basics');
  });
  it('maps ES "básicos" → "basics"', () => {
    expect(resolveSubcommandAlias('básicos')).toBe('basics');
  });
  it('passes through unknown subcommand unchanged (lowercased)', () => {
    expect(resolveSubcommandAlias('UNKNOWN')).toBe('unknown');
  });
  it('passes through canonical English "basics" unchanged', () => {
    expect(resolveSubcommandAlias('basics')).toBe('basics');
  });
  it('passes through "recovery" unchanged and "recuperação" → "recovery"', () => {
    expect(resolveSubcommandAlias('recovery')).toBe('recovery');
    expect(resolveSubcommandAlias('recuperação')).toBe('recovery');
  });
});

describe('localizedCommandName (BUG-002 helper, used by BUG-003 too)', () => {
  it('returns English unchanged for language=en', () => {
    expect(localizedCommandName('save', 'en')).toBe('save');
    expect(localizedCommandName('hide', 'en')).toBe('hide');
  });
  it('returns PT-BR alias for known commands', () => {
    expect(localizedCommandName('save', 'pt-BR')).toBe('salvar');
    expect(localizedCommandName('unsave', 'pt-BR')).toBe('remover');
    expect(localizedCommandName('help', 'pt-BR')).toBe('ajuda');
  });
  it('returns ES alias for known commands', () => {
    expect(localizedCommandName('save', 'es')).toBe('guardar');
    expect(localizedCommandName('unsave', 'es')).toBe('quitar');
    expect(localizedCommandName('help', 'es')).toBe('ayuda');
  });
  it('falls back to English for terms that stay in English', () => {
    expect(localizedCommandName('ls', 'pt-BR')).toBe('ls');
    expect(localizedCommandName('tree', 'es')).toBe('tree');
  });
});

describe('resolveCommandAlias — existing aliases regression', () => {
  it('keeps existing aliases intact', () => {
    expect(resolveCommandAlias('salvar')).toBe('save');
    expect(resolveCommandAlias('guardar')).toBe('save');
    expect(resolveCommandAlias('ayuda')).toBe('help');
  });
});
