import { describe, it, expect } from 'vitest';
import {
  detectRevelationThemes,
  hasAnyRevelation,
  pickAcknowledgmentTheme,
  resolveNarrativeWithRevelations,
  resolveAolBodyWithRevelations,
  WRONG_STORY_NARRATIVE_SWAP,
  WRONG_STORY_AOL_SWAP,
} from '../alienRevelationCopy';

const AUTOPSY = '/storage/quarantine/autopsy_alpha.log'; // biology
const NEURAL = '/storage/quarantine/alpha_neural_connection.psi'; // telepathy
const COLONIZATION = '/admin/colonization_model.red'; // harvest
const CYCLE = '/admin/thirty_year_cycle.txt'; // window2026
const CAFETERIA = '/internal/misc/cafeteria_menu.txt'; // no theme

describe('detectRevelationThemes', () => {
  it('maps files to their themes by basename', () => {
    const themes = detectRevelationThemes(new Set([AUTOPSY, NEURAL, COLONIZATION]));
    expect(themes.has('biology')).toBe(true);
    expect(themes.has('telepathy')).toBe(true);
    expect(themes.has('harvest')).toBe(true);
  });

  it('ignores mundane files', () => {
    expect(hasAnyRevelation(new Set([CAFETERIA]))).toBe(false);
    expect(hasAnyRevelation(new Set())).toBe(false);
    expect(hasAnyRevelation(undefined)).toBe(false);
    expect(hasAnyRevelation(null)).toBe(false);
  });
});

describe('pickAcknowledgmentTheme', () => {
  it('picks the highest-severity theme not already foregrounded', () => {
    // the_2026_warning foregrounds window2026; harvest outranks it and is present
    expect(
      pickAcknowledgmentTheme('the_2026_warning', new Set([CYCLE, COLONIZATION])),
    ).toBe('harvest');
  });

  it('returns null when the only present theme is already foregrounded', () => {
    // the_2026_warning foregrounds window2026; only window2026 present
    expect(pickAcknowledgmentTheme('the_2026_warning', new Set([CYCLE]))).toBeNull();
  });

  it('never adds to excluded endings', () => {
    expect(pickAcknowledgmentTheme('hackerkid_caught', new Set([AUTOPSY]))).toBeNull();
    expect(pickAcknowledgmentTheme('wrong_story', new Set([AUTOPSY]))).toBeNull();
  });

  it('returns null with no revelation files', () => {
    expect(pickAcknowledgmentTheme('the_2026_warning', new Set([CAFETERIA]))).toBeNull();
  });
});

describe('resolveNarrativeWithRevelations', () => {
  it('appends one acknowledgment paragraph for under-reporting endings', () => {
    const base = ['line a', 'line b'];
    const out = resolveNarrativeWithRevelations('the_2026_warning', base, new Set([AUTOPSY]));
    expect(out).toHaveLength(3);
    expect(out.slice(0, 2)).toEqual(base);
    expect(out[2]).toContain('autopsy');
  });

  it('leaves narrative unchanged when nothing new to add', () => {
    const base = ['line a', 'line b'];
    expect(resolveNarrativeWithRevelations('the_2026_warning', base, new Set([CYCLE]))).toEqual(
      base,
    );
    expect(resolveNarrativeWithRevelations('the_2026_warning', base, new Set([CAFETERIA]))).toEqual(
      base,
    );
  });

  it('swaps the contradictory wrong_story line when a revelation is present', () => {
    const base = ['intro', 'the beings are never mentioned', 'outro'];
    const out = resolveNarrativeWithRevelations('wrong_story', base, new Set([AUTOPSY]));
    expect(out[1]).toBe(WRONG_STORY_NARRATIVE_SWAP);
    expect(out).toHaveLength(3);
  });

  it('leaves wrong_story untouched with no revelation', () => {
    const base = ['intro', 'the beings are never mentioned', 'outro'];
    expect(resolveNarrativeWithRevelations('wrong_story', base, new Set([CAFETERIA]))).toEqual(base);
  });
});

describe('resolveAolBodyWithRevelations', () => {
  it('appends one AOL line for under-reporting endings', () => {
    const base = ['dateline body'];
    const out = resolveAolBodyWithRevelations('the_2026_warning', base, new Set([COLONIZATION]));
    expect(out).toHaveLength(2);
    expect(out[1]).toContain('extraction model');
  });

  it('swaps the last wrong_story AOL line when a revelation is present', () => {
    const base = ['lead', 'middle', 'notably absent...'];
    const out = resolveAolBodyWithRevelations('wrong_story', base, new Set([NEURAL]));
    expect(out[2]).toBe(WRONG_STORY_AOL_SWAP);
    expect(out).toHaveLength(3);
  });
});
