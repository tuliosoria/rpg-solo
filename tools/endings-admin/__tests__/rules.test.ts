import { describe, it, expect } from 'vitest';
import { fileUniverse, exampleSaveSet, describeRuleFor } from '../rules';
import { determineEnding } from '../../../app/engine/endings';

describe('endings-admin rules', () => {
  it('fileUniverse is the sorted union of all FILE_CATEGORIES filenames', () => {
    const u = fileUniverse();
    expect(u).toContain('jardim_andere_incident.txt');
    expect(u).toContain('URGENT_classified_alpha.txt');
    // sorted + de-duplicated
    expect([...u]).toEqual([...new Set(u)].sort());
  });

  it('exampleSaveSet for each ending actually triggers that ending', () => {
    for (const id of [
      'ridiculed','ufo74_exposed','the_2026_warning','government_scandal',
      'prisoner_45_freed','harvest_understood','nothing_changes',
      'incomplete_picture','wrong_story','hackerkid_caught','secret_ending','real_ending',
    ] as const) {
      const set = exampleSaveSet(id);
      expect(set, `no example found for ${id}`).not.toBeNull();
      expect(determineEnding(new Set(set as string[]))).toBe(id);
    }
  });

  it('describeRuleFor returns a non-empty human-readable string', () => {
    expect(describeRuleFor('government_scandal')).toMatch(/military/i);
  });
});
