import { describe, it, expect } from 'vitest';
import { RUNTIME_COMMAND_SUPPLEMENT } from '../runtimeCommandSupplement';
import baseline from './endingsSupplement.baseline.json';

describe('runtime supplement equivalence after generated-module refactor', () => {
  it('pt-BR dictionary is unchanged (same keys and values)', () => {
    expect(RUNTIME_COMMAND_SUPPLEMENT['pt-BR']).toEqual(
      (baseline as typeof RUNTIME_COMMAND_SUPPLEMENT)['pt-BR']
    );
  });
  it('es dictionary is unchanged (same keys and values)', () => {
    expect(RUNTIME_COMMAND_SUPPLEMENT.es).toEqual(
      (baseline as typeof RUNTIME_COMMAND_SUPPLEMENT).es
    );
  });
});
