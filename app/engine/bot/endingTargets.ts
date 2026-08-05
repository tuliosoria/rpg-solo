import { EndingId, FILE_CATEGORIES, determineEnding } from '../endings';
import { MAX_EVIDENCE_COUNT } from '../evidenceRevelation';

type CategoryName = keyof typeof FILE_CATEGORIES;

/**
 * How the bot builds a dossier that `determineEnding` resolves to one specific
 * ending.
 *
 * `required` is the anchor: on its own it must already resolve to the target.
 * Everything after it is padding, and padding is only ever accepted when it
 * leaves `determineEnding` unchanged — so a recipe cannot silently drift into a
 * neighbouring ending when a category gains a file or a priority is retuned.
 *
 * A win needs the dossier full (10/10), which is exactly why padding exists: the
 * anchors are 1–7 files and the rest of the slots have to be filled with
 * something that does not change the story the leak tells.
 */
export interface EndingRecipe {
  /** Basenames that must be in the dossier. Must resolve to the target alone. */
  required: string[];
  /** Categories padding is drawn from, in order, before the generic fallbacks. */
  padFrom: CategoryName[];
}

/**
 * One recipe per `EndingId`. Read alongside `determineEnding`'s priority list —
 * an anchor works by satisfying its own branch *and* failing every branch above
 * it, so the comment on each entry names the branch it lands on.
 */
export const ENDING_RECIPES: Record<EndingId, EndingRecipe> = {
  // P1: honeypotCount >= 2.
  hackerkid_caught: {
    required: ['URGENT_classified_alpha.txt', 'SMOKING_GUN_proof.txt'],
    padFrom: ['honeypot_trap', 'conspiracy_unrelated', 'military_coverup', 'medical_autopsy'],
  },

  // P2: ghost + alpha-neural + physicist + convergence, all four at once.
  secret_ending: {
    required: [
      'ghost_in_machine.enc',
      'alpha_neural_connection.psi',
      'convergence_model_draft.txt',
      'thirty_year_cycle.txt',
    ],
    padFrom: ['temporal_convergence', 'alpha_neural', 'ufo_core', 'comms_intercept', 'containment'],
  },

  // P3: ghost present but the other three legs of the secret ending absent.
  // Padding deliberately avoids alpha_neural / temporal_convergence so the
  // guard is not doing all the work on its own.
  ufo74_exposed: {
    required: ['ghost_in_machine.enc'],
    padFrom: ['ufo_core', 'comms_intercept', 'military_coverup', 'witness'],
  },

  // P4: core >= 2, medical >= 2, witness >= 1, military >= 2.
  real_ending: {
    required: [
      'audio_transcript_brief.txt',
      'photo_archive_register_77.txt',
      'autopsy_alpha.log',
      'autopsy_addendum_psi.txt',
      'witness_statement_raw.txt',
      'incident_report_1996_01_VG.txt',
      'initial_response_orders.txt',
    ],
    padFrom: ['ufo_core', 'medical_autopsy', 'witness', 'military_coverup'],
  },

  // P5: corruption + conspiracy >= 5 with core <= 1 — a dossier of office memos.
  wrong_story: {
    required: [
      'cafeteria_menu_week03.txt',
      'parking_allocation_jan96.txt',
      'supplies_request_jan96.txt',
      'printer_notice.txt',
      'badge_renewal_memo.txt',
    ],
    padFrom: ['conspiracy_unrelated', 'corruption_financial'],
  },

  // P6: military >= 4 without the corroboration `real_ending` needs.
  government_scandal: {
    required: [
      'incident_report_1996_01_VG.txt',
      'initial_response_orders.txt',
      'regional_summary_jan96.txt',
      'transport_log_96.txt',
    ],
    padFrom: ['military_coverup', 'coverup'],
  },

  // P7: containment >= 2 plus a witness. Anchors on the two pure-containment
  // files so the medical count stays clear of the `real_ending` branch.
  prisoner_45_freed: {
    required: ['bio_program_overview.red', 'ethics_exception_03.txt', 'witness_statement_raw.txt'],
    padFrom: ['containment', 'witness', 'coverup'],
  },

  // P8: temporal >= 2. Anchored on files that are neither convergence nor
  // physicist, so it cannot be confused with the secret-ending legs.
  the_2026_warning: {
    required: ['threat_window.red', 'window_alignment.meta'],
    padFrom: ['temporal_convergence', 'comms_intercept', 'diplomatic'],
  },

  // P9: harvest >= 2 with temporal < 2.
  harvest_understood: {
    required: ['extraction_mechanism.red', 'colonization_model.red'],
    padFrom: ['extraction_harvest', 'diplomatic', 'comms_intercept'],
  },

  // P10: core >= 2, medical >= 1, military >= 1 — but no witness and only one
  // military file, so `real_ending` above it cannot fire.
  nothing_changes: {
    required: [
      'audio_transcript_brief.txt',
      'photo_archive_register_77.txt',
      'autopsy_alpha.log',
      'incident_report_1996_01_VG.txt',
    ],
    padFrom: ['ufo_core', 'conspiracy_unrelated', 'coverup'],
  },

  // P11: two autopsies and nothing that coheres — `hardEvidence` keeps this
  // branch true no matter how the remaining slots are padded.
  incomplete_picture: {
    required: ['autopsy_alpha.log', 'autopsy_addendum_psi.txt'],
    padFrom: ['medical_autopsy', 'witness', 'ufo_core'],
  },

  // Default: one category above 2 with no hard evidence anywhere. Witness
  // testimony alone is exactly the dossier the world laughs at.
  ridiculed: {
    required: ['witness_statement_raw.txt', 'witness_visit_log.txt', 'witness_subjects_file.txt'],
    padFrom: ['witness', 'conspiracy_unrelated'],
  },
};

export const ALL_ENDING_IDS = Object.keys(ENDING_RECIPES) as EndingId[];

export function isEndingId(value: string): value is EndingId {
  return Object.prototype.hasOwnProperty.call(ENDING_RECIPES, value);
}

/** Every basename that appears in any category, for spotting neutral padding. */
function categorisedNames(): Set<string> {
  const names = new Set<string>();
  for (const files of Object.values(FILE_CATEGORIES)) {
    for (const f of files) names.add(f);
  }
  return names;
}

export interface EndingPlan {
  /** Full paths to read and save, in the order they should be handled. */
  paths: string[];
  /** Required basenames with no matching accessible file. */
  missing: string[];
  /** Whether the planned dossier actually resolves to the requested ending. */
  resolves: boolean;
  /** Whether the plan fills the dossier, which a win requires. */
  full: boolean;
}

/**
 * Plans the dossier for one ending out of the files currently reachable.
 *
 * Padding is chosen by trial: a candidate is only kept when the dossier still
 * resolves to the target with it added. That is what makes the recipes robust —
 * `padFrom` is a preference, not a promise, and a category that would tip the
 * dossier into a higher-priority branch is simply skipped.
 */
export function buildEndingDossier(
  ending: EndingId,
  accessiblePaths: string[],
  limit: number = MAX_EVIDENCE_COUNT
): EndingPlan {
  const recipe = ENDING_RECIPES[ending];
  const byName = new Map<string, string>();
  for (const path of [...accessiblePaths].sort()) {
    const name = path.split('/').pop() || '';
    if (!byName.has(name)) byName.set(name, path);
  }

  const chosen: string[] = [];
  const missing: string[] = [];
  for (const name of recipe.required) {
    const path = byName.get(name);
    if (!path) {
      missing.push(name);
      continue;
    }
    if (!chosen.includes(path)) chosen.push(path);
  }

  const categorised = categorisedNames();
  const inPlan = new Set(chosen);
  const candidates: string[] = [];
  const pushCandidate = (path: string) => {
    if (!inPlan.has(path) && !candidates.includes(path)) candidates.push(path);
  };

  for (const category of recipe.padFrom) {
    for (const name of FILE_CATEGORIES[category]) {
      const path = byName.get(name);
      if (path) pushCandidate(path);
    }
  }
  // Files in no category at all change no count, so they are the safest filler
  // once the preferred categories run out or start flipping the ending.
  for (const path of [...accessiblePaths].sort()) {
    const name = path.split('/').pop() || '';
    if (!categorised.has(name)) pushCandidate(path);
  }
  for (const path of [...accessiblePaths].sort()) pushCandidate(path);

  for (const candidate of candidates) {
    if (chosen.length >= limit) break;
    const probe = new Set([...chosen, candidate]);
    if (determineEnding(probe) === ending) chosen.push(candidate);
  }

  return {
    paths: chosen,
    missing,
    resolves: chosen.length > 0 && determineEnding(new Set(chosen)) === ending,
    full: chosen.length >= limit,
  };
}
