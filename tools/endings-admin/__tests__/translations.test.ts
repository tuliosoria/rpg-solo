import { describe, it, expect } from 'vitest';
import { buildSupplement } from '../../../scripts/gen-endings-from-content';

describe('supplement build from per-field locale edits', () => {
  it('maps an edited English string to its pt-BR translation', () => {
    const content = {
      demo: {
        fields: { title: 'HELLO', subtitle: '', ufo74_final: '', narrative: [],
          aol: { headline: '', subheadline: '', url: '', imageAlt: '', visitorCount: 0, body: [] } },
        translations: { 'pt-BR': {}, es: {} },
        fieldLocales: { title: { 'pt-BR': 'OLÁ', es: 'HOLA' } },
      },
    };
    const merged = buildSupplement(content as never);
    expect(merged['pt-BR']['HELLO']).toBe('OLÁ');
    expect(merged.es['HELLO']).toBe('HOLA');
  });
});
