/**
 * Regressions for player-forgiveness fixes on the critical path.
 *
 * The leak preparation sequence is the only way to win, and unknown commands
 * feed an 8-strike lockout. Both used to punish players for mistakes that were
 * not actually gameplay decisions (capitalisation, a stray word, a typo).
 */
import { describe, it, expect } from 'vitest';
import { executeCommand } from '../commands';
import { suggestCommand, PUBLIC_COMMANDS } from '../commands/utils';
import { DEFAULT_GAME_STATE, type GameState } from '../../types';

const TEN_SAVED_FILES = [
  '/internal/audio_transcript_brief.txt',
  '/internal/jardim_andere_incident.txt',
  '/internal/misc/incident_report_1996_01_VG.txt',
  '/storage/quarantine/bio_container.log',
  '/storage/quarantine/autopsy_alpha.log',
  '/storage/quarantine/witness_statement_raw.txt',
  '/ops/prato/archive/patrol_observation_shift_04.txt',
  '/ops/prato/initial_response_orders.txt',
  '/admin/thirty_year_cycle.txt',
  '/admin/colonization_model.red',
];

function leakReadyState(overrides: Partial<GameState> = {}): GameState {
  return {
    ...DEFAULT_GAME_STATE,
    seed: 4242,
    rngState: 4242,
    sessionStartTime: 0,
    tutorialStep: -1,
    tutorialComplete: true,
    interactiveTutorialState: undefined,
    savedFiles: new Set(TEN_SAVED_FILES),
    filesRead: new Set(TEN_SAVED_FILES),
    ...overrides,
  } as GameState;
}

function apply(state: GameState, input: string): { state: GameState; text: string } {
  const result = executeCommand(input, state);
  return {
    state: { ...state, ...result.stateChanges } as GameState,
    text: result.output.map(entry => entry.content).join('\n'),
  };
}

describe('leak preparation sequence input handling', () => {
  it('accepts a step regardless of capitalisation or extra spacing', () => {
    let state = leakReadyState();
    ({ state } = apply(state, 'leak'));

    const sequence = state.leakSequence!;
    expect(sequence).toHaveLength(3);

    const shouty = apply(state, `leak ${sequence[0].toUpperCase()}`);
    expect(shouty.state.leakSequenceProgress).toBe(1);
    expect(shouty.state.detectionLevel).toBe(state.detectionLevel);

    const spaced = apply(shouty.state, `leak  ${sequence[1].replace(' ', '   ')} `);
    expect(spaced.state.leakSequenceProgress).toBe(2);
    expect(spaced.state.detectionLevel).toBe(state.detectionLevel);
  });

  it('still penalises a valid step entered out of order', () => {
    let state = leakReadyState();
    ({ state } = apply(state, 'leak'));

    const sequence = state.leakSequence!;
    const outOfOrder = apply(state, `leak ${sequence[2]}`);

    expect(outOfOrder.state.leakSequenceProgress).toBe(0);
    expect(outOfOrder.state.detectionLevel).toBe(state.detectionLevel + 5);
    expect(outOfOrder.text).toContain('SEQUENCE MISMATCH');
  });

  it('does not reset progress or raise detection for a step that is not part of the protocol', () => {
    let state = leakReadyState();
    ({ state } = apply(state, 'leak'));

    const sequence = state.leakSequence!;
    const advanced = apply(state, `leak ${sequence[0]}`);
    expect(advanced.state.leakSequenceProgress).toBe(1);

    const nonsense = apply(advanced.state, 'leak everything');
    expect(nonsense.state.leakSequenceProgress).toBe(1);
    expect(nonsense.state.detectionLevel).toBe(advanced.state.detectionLevel);
    expect(nonsense.text).toContain('UNRECOGNIZED PROTOCOL STEP');
  });
});

describe('suggestCommand', () => {
  it('recovers common single-character typos', () => {
    expect(suggestCommand('lls')).toBe('ls');
    expect(suggestCommand('oepn')).toBe('open');
    expect(suggestCommand('serach')).toBe('search');
    expect(suggestCommand('progres')).toBe('progress');
  });

  it('maps localized aliases back to the canonical command', () => {
    expect(suggestCommand('salvarr')).toBe('save');
    expect(suggestCommand('ayudaa')).toBe('help');
  });

  it('returns null for valid commands and for unrelated input', () => {
    for (const command of PUBLIC_COMMANDS) {
      expect(suggestCommand(command)).toBeNull();
    }
    expect(suggestCommand('xyzzy')).toBeNull();
    expect(suggestCommand('')).toBeNull();
  });

  it('never suggests a command the player is meant to discover in the fiction', () => {
    // `link`, `release`, `script`, `recover` are found through documents.
    expect(suggestCommand('lnk')).not.toBe('link');
    expect(suggestCommand('releas')).not.toBe('release');
    expect(suggestCommand('scrip')).not.toBe('script');
  });
});

describe('unknown command feedback', () => {
  it('names the closest command when the player mistypes', () => {
    const state = leakReadyState({ savedFiles: new Set(), filesRead: new Set() });
    const { text, state: next } = apply(state, 'oepn report.txt');

    expect(text).toContain('did you mean');
    expect(text).toContain('open');
    // Invalid commands still draw attention — the fix is feedback, not immunity.
    expect(next.detectionLevel).toBeGreaterThan(state.detectionLevel);
  });
});
