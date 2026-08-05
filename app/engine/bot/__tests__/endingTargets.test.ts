import { describe, it, expect } from 'vitest';
import { executeCommand } from '../../commands';
import { getAllAccessibleFiles } from '../../filesystem';
import { determineEnding, FILE_CATEGORIES } from '../../endings';
import { OVERRIDE_PASSWORD } from '../../overrideSecret';
import { MAX_EVIDENCE_COUNT } from '../../evidenceRevelation';
import { DEFAULT_GAME_STATE, GameState } from '../../../types';
import { ALL_ENDING_IDS, ENDING_RECIPES, buildEndingDossier, isEndingId } from '../endingTargets';

/** An elevated session, which is what every recipe is written against. */
function elevatedFiles(): string[] {
  let state = {
    ...DEFAULT_GAME_STATE,
    tutorialComplete: true,
    seed: 1,
    rngState: 1,
    sessionStartTime: 0,
    filesRead: new Set<string>(['/internal/override_protocol_memo.txt']),
    savedFiles: new Set<string>(),
  } as GameState;
  const result = executeCommand(`override protocol ${OVERRIDE_PASSWORD}`, state);
  state = { ...state, ...result.stateChanges } as GameState;
  expect(state.flags?.adminUnlocked).toBe(true);
  return getAllAccessibleFiles(state);
}

describe('ending recipes', () => {
  it('covers every EndingId exactly once', () => {
    // `ENDING_RECIPES` is typed `Record<EndingId, ...>`, so a new ending is a
    // compile error rather than a silent gap. This asserts the runtime list
    // that `bot-test list` and the sweep iterate stays in step with it.
    expect(new Set(ALL_ENDING_IDS).size).toBe(ALL_ENDING_IDS.length);
    expect(ALL_ENDING_IDS.length).toBe(Object.keys(ENDING_RECIPES).length);
  });

  it('names only files that exist in the game', () => {
    const known = new Set(Object.values(FILE_CATEGORIES).flat());
    for (const id of ALL_ENDING_IDS) {
      for (const name of ENDING_RECIPES[id].required) {
        expect(known.has(name), `${id} requires unknown file ${name}`).toBe(true);
      }
    }
  });

  it('names only files an elevated session can actually reach', () => {
    const reachable = new Set(elevatedFiles().map(p => p.split('/').pop()));
    for (const id of ALL_ENDING_IDS) {
      for (const name of ENDING_RECIPES[id].required) {
        expect(reachable.has(name), `${id} requires unreachable file ${name}`).toBe(true);
      }
    }
  });

  /**
   * The invariant the whole planner rests on. Padding is only ever accepted when
   * it leaves `determineEnding` unchanged, which is sound *because* the anchor
   * already resolves to the target — if an anchor drifted, padding would be
   * comparing against the wrong ending from the first turn.
   */
  it('anchors on a file set that already resolves to its own ending', () => {
    for (const id of ALL_ENDING_IDS) {
      const anchor = new Set(ENDING_RECIPES[id].required);
      expect(determineEnding(anchor), `anchor for ${id} resolves elsewhere`).toBe(id);
    }
  });
});

describe('buildEndingDossier', () => {
  const accessible = elevatedFiles();

  it('plans a full dossier that resolves to the requested ending', () => {
    for (const id of ALL_ENDING_IDS) {
      const plan = buildEndingDossier(id, accessible);
      expect(plan.missing, `${id} missing files`).toEqual([]);
      // A win needs all ten slots filled, so a plan that resolves correctly but
      // stops at eight files is still a plan that cannot finish the game.
      expect(plan.paths.length, `${id} planned ${plan.paths.length} files`).toBe(
        MAX_EVIDENCE_COUNT
      );
      expect(plan.full).toBe(true);
      expect(plan.resolves).toBe(true);
      expect(determineEnding(new Set(plan.paths)), `${id} plan resolves elsewhere`).toBe(id);
    }
  });

  it('is deterministic', () => {
    for (const id of ALL_ENDING_IDS) {
      expect(buildEndingDossier(id, accessible).paths).toEqual(
        buildEndingDossier(id, accessible).paths
      );
    }
  });

  it('does not depend on the order files are discovered in', () => {
    const reversed = [...accessible].reverse();
    for (const id of ALL_ENDING_IDS) {
      expect(buildEndingDossier(id, reversed).paths).toEqual(
        buildEndingDossier(id, accessible).paths
      );
    }
  });

  it('routes around a file it cannot open', () => {
    // What the strategy does when an `open` produces nothing: it drops the path
    // and re-plans. The replacement still has to land on the same ending.
    for (const id of ALL_ENDING_IDS) {
      const first = buildEndingDossier(id, accessible).paths;
      const withoutLast = accessible.filter(p => p !== first[first.length - 1]);
      const replanned = buildEndingDossier(id, withoutLast);
      expect(replanned.paths).not.toContain(first[first.length - 1]);
      expect(determineEnding(new Set(replanned.paths)), `${id} re-plan drifted`).toBe(id);
    }
  });

  it('reports required files that are out of reach instead of planning around them', () => {
    const withoutGhost = accessible.filter(p => !p.endsWith('ghost_in_machine.enc'));
    const plan = buildEndingDossier('secret_ending', withoutGhost);
    expect(plan.missing).toContain('ghost_in_machine.enc');
    expect(plan.resolves).toBe(false);
  });
});

describe('isEndingId', () => {
  it('accepts real ids and rejects anything else', () => {
    expect(isEndingId('secret_ending')).toBe(true);
    expect(isEndingId('ridiculed')).toBe(true);
    expect(isEndingId('novice')).toBe(false);
    expect(isEndingId('')).toBe(false);
  });
});
