import { describe, it, expect } from 'vitest';
import { commands } from '../commands/index';
import { BOT_ENABLED } from '../../constants/bot';

describe('bot command registration', () => {
  it('registers bot-test and bot-stop when BOT_ENABLED is on', () => {
    // In the Vitest env NODE_ENV is "test" (not "development"), so a registered
    // bot-test proves the BOT_ENABLED clause — not the dev clause — did the work.
    expect(BOT_ENABLED).toBe(true);
    expect(typeof commands['bot-test']).toBe('function');
    expect(typeof commands['bot-stop']).toBe('function');
  });
});
