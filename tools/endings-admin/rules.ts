import {
  FILE_CATEGORIES,
  determineEnding,
  type EndingId,
} from '../../app/engine/endings';

/** Sorted, de-duplicated union of every filename referenced by FILE_CATEGORIES. */
export function fileUniverse(): string[] {
  const all = Object.values(FILE_CATEGORIES).flat();
  return [...new Set(all)].sort();
}

/** Files grouped by their category key, for the simulator UI. */
export function filesByCategory(): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const [cat, files] of Object.entries(FILE_CATEGORIES)) {
    out[cat] = [...new Set(files)].sort();
  }
  return out;
}

/**
 * Plain-language description of each ending's trigger, mirroring the priority
 * order in determineEnding (endings.ts). Read-only documentation.
 */
const RULE_TEXT: Record<EndingId, string> = {
  hackerkid_caught: 'Saved 2+ obvious honeypot/trap files.',
  secret_ending: 'ghost_in_machine.enc + alpha-neural evidence + physicist convergence files + a convergence file.',
  ufo74_exposed: 'Saved ghost_in_machine.enc (without the full secret-ending set).',
  real_ending: '2+ ufo_core AND 2+ medical/autopsy AND 1+ witness AND 2+ military/coverup files.',
  wrong_story: '5+ corruption+unrelated files with at most 1 ufo_core file.',
  government_scandal: '4+ military/coverup files (without meeting real_ending).',
  prisoner_45_freed: '2+ containment files AND 1+ witness file.',
  the_2026_warning: '2+ temporal/convergence files.',
  harvest_understood: '2+ extraction/harvest files.',
  nothing_changes: '2+ ufo_core AND 1+ medical AND 1+ military file (short of real_ending).',
  incomplete_picture: 'Scattered dossier (largest tracked category <= 2) OR hard biological/containment evidence (2+ autopsy or 2+ containment) that never cohered.',
  ridiculed: 'Default: weak or incoherent dossier that matched no stronger rule (e.g. 3+ witness files with no supporting evidence).',
};

export function describeRuleFor(id: EndingId): string {
  return RULE_TEXT[id];
}

/**
 * A concrete, verified set of filenames that triggers `id`. Built by greedily
 * taking the first N filenames from the relevant categories, then CONFIRMED
 * against the real determineEnding so it can never drift from the logic.
 */
export function exampleSaveSet(id: EndingId): string[] | null {
  const c = FILE_CATEGORIES;
  const take = (arr: string[], n: number) => arr.slice(0, n);

  const candidates: Record<EndingId, string[]> = {
    hackerkid_caught: take(c.honeypot_trap, 2),
    secret_ending: [
      ...c.ghost_machine,
      ...take(c.alpha_neural, 1),
      'thirty_year_cycle.txt',
      'convergence_model_draft.txt',
    ],
    ufo74_exposed: [...c.ghost_machine],
    real_ending: [
      ...take(c.ufo_core, 2), ...take(c.medical_autopsy, 2),
      ...take(c.witness, 1), ...take(c.military_coverup, 2),
    ],
    wrong_story: [...take(c.corruption_financial, 3), ...take(c.conspiracy_unrelated, 2)],
    government_scandal: take(c.military_coverup, 4),
    prisoner_45_freed: [...take(c.containment, 2), ...take(c.witness, 1)],
    the_2026_warning: take(c.temporal_convergence, 2),
    harvest_understood: take(c.extraction_harvest, 2),
    nothing_changes: [
      ...take(c.ufo_core, 2), ...take(c.medical_autopsy, 1), ...take(c.military_coverup, 1),
    ],
    incomplete_picture: take(c.medical_autopsy, 2),
    // 3 witness files (no other tracked evidence) keeps maxCategory > 2 without
    // hard evidence, so it falls through every rule to the default.
    ridiculed: take(c.witness, 3),
  };

  const set = candidates[id];
  if (determineEnding(new Set(set)) === id) return set;
  return null;
}
