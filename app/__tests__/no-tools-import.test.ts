import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

describe('game bundle isolation', () => {
  it('no file under app/ imports from tools/', () => {
    const files = execSync('git ls-files "app/**/*.ts" "app/**/*.tsx"', { encoding: 'utf-8' })
      .trim().split('\n').filter(Boolean);
    const offenders = files.filter((f) => {
      const src = readFileSync(f, 'utf-8');
      return /from\s+['"][^'"]*tools\//.test(src) || /import\(['"][^'"]*tools\//.test(src);
    });
    expect(offenders, `app/ files importing tools/: ${offenders.join(', ')}`).toEqual([]);
  });
});
