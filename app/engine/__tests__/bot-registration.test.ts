import { describe, it, expect } from 'vitest';
import { commands } from '../commands/index';
import { executeCommand } from '../commands';
import { BOT_ENABLED } from '../../constants/bot';
import { DEFAULT_GAME_STATE, GameState } from '../../types';

describe('bot command registration', () => {
  it('registers bot-test and bot-stop when BOT_ENABLED is on', () => {
    // In the Vitest env NODE_ENV is "test" (not "development"), so a registered
    // bot-test proves the BOT_ENABLED clause — not the dev clause — did the work.
    expect(BOT_ENABLED).toBe(true);
    expect(typeof commands['bot-test']).toBe('function');
    expect(typeof commands['bot-stop']).toBe('function');
  });

  /**
   * The sweep plays whole games, so it needs `executeCommand` — which reaches
   * back through the command registry to `debug.ts`, where `bot-test` lives.
   * Importing it into `sweep.ts` closes that loop, and `commands/index.ts`
   * dereferences `debugCommands` while it is still evaluating, so entering the
   * graph at `debug.ts` throws on the temporal dead zone. The engine is passed
   * in as a handler argument instead. This drives the sweep the way the app
   * does — through `executeCommand` — which is what proves the wiring works.
   */
  it('runs the sweep through the real dispatcher, which is what supplies the engine', () => {
    const state = {
      ...DEFAULT_GAME_STATE,
      tutorialComplete: true,
      seed: 1,
      rngState: 1,
      filesRead: new Set<string>(),
      savedFiles: new Set<string>(),
    } as GameState;

    const result = executeCommand('bot-test sweep 1', state);
    const lines = result.output.map(e => e.content);
    expect(lines.join('\n')).toContain('BOT-TEST SWEEP');
    expect(lines.filter(l => l.trimStart().startsWith('FAIL '))).toEqual([]);
    // A sweep is a report, not a run: it must not leave autoplay armed.
    expect(result.stateChanges.botTest).toBeUndefined();
  });

  it('says so plainly when called without an engine instead of throwing', () => {
    // Only reachable by invoking the handler directly, which the tests do.
    const state = { ...DEFAULT_GAME_STATE, tutorialComplete: true } as GameState;
    const result = commands['bot-test'](['sweep'], state);
    expect(result.output.map(e => e.content).join('\n')).toContain(
      'sweep needs the command executor'
    );
  });
});
