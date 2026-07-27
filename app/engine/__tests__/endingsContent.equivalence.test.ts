import { describe, it, expect } from 'vitest';
import { ENDINGS } from '../endings';
import content from '../../data/endingsContent.json';

describe('endings content equivalence', () => {
  it('every ENDINGS entry deep-equals the JSON source of truth', () => {
    for (const [id, e] of Object.entries(ENDINGS)) {
      expect(e).toEqual((content as Record<string, { fields: unknown }>)[id].fields);
    }
  });
});
