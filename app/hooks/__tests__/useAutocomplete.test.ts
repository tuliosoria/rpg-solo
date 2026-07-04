import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAutocomplete, computeGhostSuffix } from '../useAutocomplete';
import { DEFAULT_GAME_STATE, GameState } from '../../types';

const createTestState = (overrides: Partial<GameState> = {}): GameState =>
  ({
    ...DEFAULT_GAME_STATE,
    seed: 12345,
    rngState: 12345,
    sessionStartTime: Date.now(),
    tutorialStep: -1,
    tutorialComplete: true,
    ...overrides,
  }) as GameState;

describe('useAutocomplete', () => {
  it('includes all player-facing guidance commands in command completion', () => {
    const { result } = renderHook(() => useAutocomplete(createTestState()));

    const completions = result.current.getCompletions('');

    expect(completions).toEqual(
      expect.arrayContaining(['search', 'hint', 'wait', 'hide', 'morse', 'unsave'])
    );
  });

  it('completes file arguments for save and unsave commands', () => {
    const { result } = renderHook(() =>
      useAutocomplete(
        createTestState({
          currentPath: '/ops/assessments',
        })
      )
    );

    expect(result.current.getCompletions('save fo')).toContain('foreign_drone_assessment.txt');
    expect(result.current.getCompletions('unsave fo')).toContain('foreign_drone_assessment.txt');
  });
});

describe('computeGhostSuffix', () => {
  it('returns the remaining characters for a single command match', () => {
    expect(computeGhostSuffix('aj', ['ajuda'])).toBe('uda');
    expect(computeGhostSuffix('hel', ['help'])).toBe('p');
  });

  it('returns the remaining characters for a single file/dir argument match', () => {
    expect(computeGhostSuffix('cd com', ['comms'])).toBe('ms');
    expect(computeGhostSuffix('cd t', ['tmp'])).toBe('mp');
  });

  it('completes only the fragment after the last slash for path arguments', () => {
    expect(computeGhostSuffix('open internal/re', ['report.txt'])).toBe('port.txt');
  });

  it('is case-insensitive when matching but preserves candidate casing', () => {
    expect(computeGhostSuffix('cd COM', ['comms'])).toBe('ms');
  });

  it('returns null when there is not exactly one candidate', () => {
    expect(computeGhostSuffix('cd ', ['comms', 'internal', 'ops', 'tmp'])).toBeNull();
    expect(computeGhostSuffix('cd zzz', [])).toBeNull();
  });

  it('returns null when the fragment already fully matches the candidate', () => {
    expect(computeGhostSuffix('cd comms', ['comms'])).toBeNull();
  });

  it('returns null when the sole candidate does not extend the typed fragment', () => {
    expect(computeGhostSuffix('cd xyz', ['comms'])).toBeNull();
  });

  it('resolves a real unique cd completion through getCompletions', () => {
    const { result } = renderHook(() => useAutocomplete(createTestState({ currentPath: '/' })));
    const candidates = result.current.getCompletions('cd com');
    expect(computeGhostSuffix('cd com', candidates)).toBe('ms');
  });

  it('ghosts a localized command alias in pt-BR mode', () => {
    const { result } = renderHook(() => useAutocomplete(createTestState(), 'pt-BR'));
    const candidates = result.current.getCompletions('aj');
    expect(candidates).toEqual(['ajuda']);
    expect(computeGhostSuffix('aj', candidates)).toBe('uda');
  });

  it('ghosts a localized command alias in es mode', () => {
    const { result } = renderHook(() => useAutocomplete(createTestState(), 'es'));
    const candidates = result.current.getCompletions('ayu');
    expect(computeGhostSuffix('ayu', candidates)).toBe('da');
  });
});
