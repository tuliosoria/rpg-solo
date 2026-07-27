import { describe, it, expect } from 'vitest';
import { PUBLIC_COMMANDS } from '../utils';

describe('bot commands stay hidden from discovery', () => {
  it('bot-test and bot-stop are not in PUBLIC_COMMANDS', () => {
    // PUBLIC_COMMANDS drives help, Tab completion and "did you mean" suggestions.
    // Keeping the bot out of it is what makes the production exposure safe.
    expect(PUBLIC_COMMANDS as readonly string[]).not.toContain('bot-test');
    expect(PUBLIC_COMMANDS as readonly string[]).not.toContain('bot-stop');
  });
});
