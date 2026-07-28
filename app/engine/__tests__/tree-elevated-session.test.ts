/**
 * Guards the `tree` command against the inverted gating a bot sweep found.
 *
 * `tree` has two behaviours: on an ordinary session it costs 30% detection, and
 * on an elevated (admin-unlocked) session it trips the firewall and ends the
 * run. The trap is deliberate. The gating around it was not: the survivable
 * branch sat behind a two-step confirmation while the FATAL branch fired on the
 * first keystroke, unwarned.
 *
 * That mattered because `tree` is advertised, not hidden. It is in
 * `PUBLIC_COMMANDS`, `help` describes it as "Show directory structure", failed
 * searches suggest it, and the hint system recommended it outright. The intended
 * opening — read the override memo, unlock admin — leaves the player on exactly
 * one file read, which is the branch that produced "use tree for the map". So
 * the game could advise a move that instantly ended the run.
 */
import { describe, it, expect } from 'vitest';
import { executeCommand } from '../commands';
import { analyzeProgressForHint } from '../hintSystem';
import { DEFAULT_GAME_STATE, GameState } from '../../types';
import { OVERRIDE_PASSWORD } from '../overrideSecret';

function baseState(over: Partial<GameState> = {}): GameState {
  return {
    ...DEFAULT_GAME_STATE,
    tutorialComplete: true,
    seed: 4242,
    rngState: 4242,
    filesRead: new Set<string>(),
    savedFiles: new Set<string>(),
    ...over,
  } as GameState;
}

function run(state: GameState, input: string): GameState {
  const result = executeCommand(input, state);
  return { ...state, ...result.stateChanges } as GameState;
}

function adminState(over: Partial<GameState> = {}): GameState {
  const base = baseState(over);
  return { ...base, flags: { ...(base.flags || {}), adminUnlocked: true } } as GameState;
}

describe('tree on an elevated session', () => {
  it('warns and asks for confirmation instead of ending the run outright', () => {
    const first = run(adminState(), 'tree');

    expect(first.isGameOver).toBeFalsy();
    expect(first.pendingTreeConfirm).toBe(true);
  });

  it('still ends the run when the player confirms', () => {
    const confirmed = run(run(adminState(), 'tree'), 'tree');

    expect(confirmed.isGameOver).toBe(true);
    expect(confirmed.gameOverReason).toBe('FIREWALL — TREE SCAN ON ELEVATED SESSION');
    // The pending flag must clear, or a later `tree` would skip its own warning.
    expect(confirmed.pendingTreeConfirm).toBe(false);
  });

  it('warns again after the confirmation is spent on another command', () => {
    // executeCommand clears pendingTreeConfirm whenever a different command
    // runs, so an abandoned confirmation must not stay armed.
    const warned = run(adminState(), 'tree');
    const distracted = run(warned, 'status');
    const again = run(distracted, 'tree');

    expect(distracted.pendingTreeConfirm).toBe(false);
    expect(again.isGameOver).toBeFalsy();
    expect(again.pendingTreeConfirm).toBe(true);
  });

  it('leaves the ordinary (non-elevated) confirmation flow intact', () => {
    const warned = run(baseState(), 'tree');
    expect(warned.isGameOver).toBeFalsy();
    expect(warned.pendingTreeConfirm).toBe(true);

    const listed = run(warned, 'tree');
    expect(listed.isGameOver).toBeFalsy();
    expect(listed.detectionLevel).toBeGreaterThan(warned.detectionLevel);
  });
});

describe('hints never point at a fatal move', () => {
  it('drops the tree suggestion once admin is unlocked', () => {
    // The exact state the intended opening produces: one file read (the
    // override memo), nothing saved, admin unlocked.
    let state = baseState();
    state = run(state, 'open /internal/override_protocol_memo.txt');
    state = run(state, `override protocol ${OVERRIDE_PASSWORD}`);
    expect(state.flags?.adminUnlocked).toBe(true);
    expect(state.filesRead.size).toBeLessThan(4);
    expect(state.savedFiles.size).toBe(0);

    const hint = analyzeProgressForHint(state);
    expect(hint?.followUp?.fallback).not.toContain('tree');
  });

  it('still suggests tree before admin is unlocked, where it is survivable', () => {
    const hint = analyzeProgressForHint(
      baseState({ filesRead: new Set(['/internal/misc/printer_notice.txt']) })
    );
    expect(hint?.followUp?.fallback).toContain('tree');
  });

  it('never suggests tree from any hint an elevated session can reach', () => {
    // Broad sweep rather than a single branch: no reachable hint may name a
    // command that ends the run on the session the player is actually in.
    for (const filesRead of [0, 1, 2, 3, 5, 9, 15]) {
      for (const saved of [0, 1, 3, 5, 10]) {
        for (const hintsUsed of [0, 1, 2, 3]) {
          for (const detection of [0, 30, 60, 85]) {
            const state = adminState({
              filesRead: new Set(
                Array.from({ length: filesRead }, (_, i) => `/internal/misc/f${i}.txt`)
              ),
              savedFiles: new Set(Array.from({ length: saved }, (_, i) => `/x/s${i}.txt`)),
              hintsUsed,
              detectionLevel: detection,
            });
            const hint = analyzeProgressForHint(state);
            if (!hint) continue;
            const lines = [hint.primary.fallback, hint.followUp?.fallback ?? ''];
            for (const line of lines) {
              expect(
                line,
                `hint recommends tree at filesRead=${filesRead} saved=${saved} hintsUsed=${hintsUsed} detection=${detection}`
              ).not.toMatch(/\btree\b/);
            }
          }
        }
      }
    }
  });
});
