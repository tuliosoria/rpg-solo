import { describe, it, expect } from 'vitest';
import { BOT_ENABLED } from '../bot';

describe('BOT_ENABLED kill-switch', () => {
  it('is a boolean flag', () => {
    expect(typeof BOT_ENABLED).toBe('boolean');
  });

  it('is currently enabled (production hack active)', () => {
    expect(BOT_ENABLED).toBe(true);
  });
});
