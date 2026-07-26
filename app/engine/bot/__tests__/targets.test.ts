import { describe, it, expect } from 'vitest';
import { secretEndingTargets, isSecretTarget } from '../targets';

describe('secretEndingTargets', () => {
  it('includes the secret-ending category files', () => {
    const t = secretEndingTargets();
    expect(t.some(f => f.includes('ghost_in_machine'))).toBe(true);
    expect(t.some(f => f.includes('alpha_neural'))).toBe(true);
    expect(t.some(f => f.includes('convergence'))).toBe(true);
  });

  it('isSecretTarget matches by basename regardless of directory', () => {
    expect(isSecretTarget('/internal/ghost_in_machine.enc')).toBe(true);
    expect(isSecretTarget('/storage/random_manifest.txt')).toBe(false);
  });
});
