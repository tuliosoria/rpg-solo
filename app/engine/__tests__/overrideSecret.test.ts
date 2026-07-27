import { describe, it, expect } from 'vitest';
import { OVERRIDE_PASSWORD } from '../overrideSecret';

describe('OVERRIDE_PASSWORD', () => {
  it('is the canonical admin override password', () => {
    expect(OVERRIDE_PASSWORD).toBe('COLHEITA');
  });
});
