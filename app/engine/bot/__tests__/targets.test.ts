import { describe, it, expect } from 'vitest';
import { secretEndingTargets, secretCriticalTargets, isSecretTarget } from '../targets';

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

describe('secretCriticalTargets', () => {
  it('lists the four files determineEnding requires for the secret ending', () => {
    const c = secretCriticalTargets();
    expect(c).toContain('ghost_in_machine.enc');
    expect(c.some(f => f.includes('alpha_neural'))).toBe(true);
    expect(c).toContain('convergence_model_draft.txt');
    expect(c).toContain('thirty_year_cycle.txt');
    // All criticals are themselves secret targets.
    expect(c.every(name => isSecretTarget('/x/' + name))).toBe(true);
  });
});
