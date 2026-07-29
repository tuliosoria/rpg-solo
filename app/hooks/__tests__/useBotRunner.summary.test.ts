/**
 * The run summary has to survive the screen that replaces the terminal.
 *
 * `buildRunSummary` writes into the terminal history, and `Terminal` returns
 * the ending component *instead of* the history once `gamePhase` becomes
 * `victory` or `bad_ending`. So the summary — described as the only real output
 * the harness has — was invisible for exactly the runs most worth reading:
 * every winning level run and all twelve ending runs replaced the surface it
 * was printed on, and the ending screen's one control restarts the game.
 * Verified live: a `chaos` run won, the AOL ending screen took over, and
 * neither Escape nor anything else brought the summary back.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { DEFAULT_GAME_STATE, GameState, TerminalEntry } from '../../types';
import { useBotRunner } from '../useBotRunner';

function wonState(): GameState {
  return {
    ...DEFAULT_GAME_STATE,
    tutorialComplete: true,
    seed: 1,
    rngState: 1,
    sessionStartTime: 0,
    filesRead: new Set<string>(),
    savedFiles: new Set<string>(),
    gameWon: true,
    botTest: { active: true, level: 'pro', seed: 1, maxTurns: 400, delayMs: 0 },
  } as GameState;
}

function runnerArgs(gameState: GameState, appended: TerminalEntry[][]) {
  return {
    gameState,
    isProcessing: false,
    showTuringTest: false,
    hasActiveOverlay: false,
    hasEnterPrompt: false,
    hasVideoPrompt: false,
    hasBlockingPopup: false,
    submit: vi.fn(),
    dismissActiveOverlay: vi.fn(),
    appendOutput: vi.fn((entries: TerminalEntry[]) => {
      appended.push(entries);
    }),
    clearBot: vi.fn(),
  };
}

describe('useBotRunner run summary', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('mirrors the summary to the console so it outlives the ending screen', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const appended: TerminalEntry[][] = [];
    const args = runnerArgs(wonState(), appended);

    renderHook(() => useBotRunner(args));
    await vi.advanceTimersByTimeAsync(50);

    expect(appended).toHaveLength(1);
    expect(args.clearBot).toHaveBeenCalled();

    expect(log).toHaveBeenCalledTimes(1);
    const logged = log.mock.calls[0][0] as string;
    // Plain text, not entry objects — it has to be readable and copyable from
    // a devtools console.
    expect(typeof logged).toBe('string');
    expect(logged).toContain('BOT-TEST RUN SUMMARY');
    expect(logged).toContain('Outcome:');
    // Everything the on-screen block shows is in the console copy too.
    const onScreen = appended[0].map(e => e.content).join('\n');
    expect(logged).toBe(onScreen);
  });
});
