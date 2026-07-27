// Adaptive "alien revelation" copy for dossier-based endings.
//
// Because endings are chosen by the FIRST matching trigger (see determineEnding),
// a mid-priority ending can fire while the player has ALSO leaked genuinely
// groundbreaking contact/harvest/telepathy files that the ending's base copy
// never mentions. Example: `the_2026_warning` (temporal >= 2) talks only about
// "atmospheric events" even when the same dossier contains the autopsy, the
// neural-contact logs, and the colonization model.
//
// This module detects those revelations by theme and, for endings that do not
// already foreground them, appends ONE tense "disclosure-day" acknowledgment
// paragraph (and one AOL body line) naming the single highest-severity theme
// that the ending is otherwise burying. Triggers, categories, and every other
// ending are unchanged. Mirrors the narrower governmentScandalCopy.ts pattern.

export type RevelationTheme =
  | 'harvest'
  | 'window2026'
  | 'telepathy'
  | 'containment'
  | 'biology'
  | 'craft'
  | 'witness'
  | 'international';

// Basenames whose content is a groundbreaking alien revelation, grouped by theme.
// Classification is by content severity, NOT the FileNode `isEvidence` flag —
// several devastating files (neural_dump_alfa, second_deployment, colonization_model)
// are isEvidence:false.
const THEME_FILES: Record<RevelationTheme, ReadonlySet<string>> = {
  harvest: new Set([
    'colonization_model.red',
    'non_arrival_colonization.txt',
    'extraction_mechanism.red',
    'energy_extraction_theory.txt',
    'energy_node_assessment.txt',
    'briefing_watchers_1996.txt',
    'second_deployment.sig',
  ]),
  window2026: new Set([
    'convergence_model_draft.txt',
    'thirty_year_cycle.txt',
    'threat_window.red',
    'window_clarification.red',
    'window_alignment.meta',
    'projection_update_2026.txt',
  ]),
  telepathy: new Set([
    'alpha_neural_connection.psi',
    'neural_dump_alfa.psi',
    'neural_fragment.dat',
    'neural_cluster_memo.txt',
    'psi_analysis_classified.txt',
    'psi_analysis_report.txt',
    'transcript_core.enc',
    'transcript_limit.enc',
    'alpha_journal.log',
  ]),
  containment: new Set([
    'bio_container.log',
    'bio_containment_log_deleted.txt',
    'surveillance_recovery.vid',
    'ethics_exception_03.txt',
  ]),
  biology: new Set([
    'autopsy_alpha.log',
    'autopsy_notes_unredacted.txt',
    'alpha_autopsy_addendum.txt',
    'specimen_purpose_analysis.txt',
    'scout_variants.meta',
    'contact_incident_report.txt',
  ]),
  craft: new Set([
    'transfer_manifest_deleted.txt',
    'material_x_analysis.dat',
  ]),
  witness: new Set([
    'witness_farm_recording.txt',
    'witness_statement_original.txt',
    'witness_statement_raw.txt',
    'jardim_andere_incident.txt',
  ]),
  international: new Set([
    'diplomatic_cable_23jan.enc',
    'foreign_liaison_cable_deleted.txt',
    'standing_orders_multinational.txt',
  ]),
};

// Highest impact first. When an ending buries several themes, we name the top one.
const THEME_SEVERITY: readonly RevelationTheme[] = [
  'harvest',
  'window2026',
  'telepathy',
  'containment',
  'biology',
  'craft',
  'witness',
  'international',
];

// One appended narrative paragraph per theme (clinical, "disclosure-day" register).
const THEME_NARRATIVE: Record<RevelationTheme, string> = {
  harvest:
    'And buried in the same dossier is the document that reframes everything else in it: an extraction model that treats Earth as a resource — cognitive output measured, catalogued, harvested without an arrival anyone would recognize as invasion. This is no longer only a story about what was hidden. It is a story about what we are worth to something that has already finished counting.',
  window2026:
    "The dossier also carries the timeline. 'Thirty rotations' — a convergence window fixed on 2026 — lifted from the recovered transmissions. It does not read like analysis. It reads like a countdown, and it is now public.",
  telepathy:
    'One set of files cannot be explained by wreckage or paperwork: neural-contact records in which a clinically dead specimen answered questions, named a handler’s child, and projected a warning. The evidence does not describe a crash. It describes a mind.',
  containment:
    'The containment logs travel with it — eleven days holding a responsive, non-human entity behind Faraday shielding while handlers reported the pressure of another intelligence pushing back. The record is not of debris recovered. It is of a prisoner kept.',
  biology:
    "And the autopsy is in the file. Non-human anatomy; an organism the examiner concluded was 'designed, not evolved.' Once that page is public, no weather-balloon story survives contact with it.",
  craft:
    'The recovery manifest is there too — hull alloy no tool could cut, a navigation array logged as still emitting, catalogued and trucked out under an operation named Harvest. The "debris" had instruments.',
  witness:
    "The civilian testimony rides with it — the recordings of the thing crouched in the dark, red-eyed, that 'knew I was there before I saw it' — the accounts the men in suits were sent to unremember. They are on the record now.",
  international:
    'And the cables prove it was never one nation’s secret: specimens divided by treaty, foreign teams inbound for neural extraction before the bodies cooled. The coverup had partners.',
};

// One appended AOL wire-service body line per theme.
const THEME_AOL: Record<RevelationTheme, string> = {
  harvest:
    "The same cache contains a classified 'extraction model' that characterizes Earth's population as a measurable resource — a document several analysts declined to describe on the record.",
  window2026:
    "The leaked files also include a projection fixing a 'transition window' on 2026, derived from what the documents describe as recovered transmissions.",
  telepathy:
    'Other documents in the cache describe neural-contact sessions with a recovered specimen, including claims of communication after clinical death.',
  containment:
    'Bio-containment logs in the leak describe a non-human entity held for eleven days under electromagnetic shielding.',
  biology:
    "The cache also contains autopsy records describing anatomy one examiner concluded was 'designed, not evolved.'",
  craft:
    'A recovered-materials manifest in the leak lists alloy fragments and a navigation array logged as still emitting a signal.',
  witness:
    'Civilian recordings in the cache describe a red-eyed figure encountered near Varginha and later suppressed.',
  international:
    'Diplomatic cables in the leak indicate the recovery was coordinated across multiple governments.',
};

// Themes each ending already foregrounds in its base copy (so we don't re-announce).
const FOREGROUNDED: Record<string, ReadonlySet<RevelationTheme>> = {
  the_2026_warning: new Set<RevelationTheme>(['window2026']),
  government_scandal: new Set<RevelationTheme>(['biology', 'witness']),
  prisoner_45_freed: new Set<RevelationTheme>([
    'containment',
    'telepathy',
    'biology',
    'witness',
  ]),
  harvest_understood: new Set<RevelationTheme>(['harvest', 'window2026']),
  nothing_changes: new Set<RevelationTheme>(['biology']),
  real_ending: new Set<RevelationTheme>(['biology', 'witness', 'telepathy']),
  secret_ending: new Set<RevelationTheme>(['telepathy', 'window2026']),
};

// Endings that must NOT receive an acknowledgment append.
//  - hackerkid_caught: the trap fired regardless of real evidence; adding a
//    revelation beat would undercut the ending.
//  - wrong_story: handled by a targeted line SWAP below, not an append, because
//    its base copy makes a claim ("never mentioned") that a present revelation
//    would directly contradict.
const APPEND_EXCLUDED: ReadonlySet<string> = new Set(['hackerkid_caught', 'wrong_story']);

function basenames(savedFiles: ReadonlySet<string> | undefined | null): Set<string> {
  const out = new Set<string>();
  if (!savedFiles) return out;
  for (const fullPath of savedFiles) {
    out.add(fullPath.split('/').pop() ?? fullPath);
  }
  return out;
}

export function detectRevelationThemes(
  savedFiles: ReadonlySet<string> | undefined | null,
): Set<RevelationTheme> {
  const names = basenames(savedFiles);
  const themes = new Set<RevelationTheme>();
  for (const theme of THEME_SEVERITY) {
    for (const name of names) {
      if (THEME_FILES[theme].has(name)) {
        themes.add(theme);
        break;
      }
    }
  }
  return themes;
}

export function hasAnyRevelation(
  savedFiles: ReadonlySet<string> | undefined | null,
): boolean {
  return detectRevelationThemes(savedFiles).size > 0;
}

// The single highest-severity theme present that the ending does not already
// foreground, or null if there is nothing worth adding.
export function pickAcknowledgmentTheme(
  endingId: string,
  savedFiles: ReadonlySet<string> | undefined | null,
): RevelationTheme | null {
  if (APPEND_EXCLUDED.has(endingId)) return null;
  const present = detectRevelationThemes(savedFiles);
  if (present.size === 0) return null;
  const foregrounded = FOREGROUNDED[endingId] ?? new Set<RevelationTheme>();
  for (const theme of THEME_SEVERITY) {
    if (present.has(theme) && !foregrounded.has(theme)) return theme;
  }
  return null;
}

// Replacement for wrong_story's contradictory lines when any revelation is present.
export const WRONG_STORY_NARRATIVE_SWAP =
  'The alien evidence you also leaked — the recovered documents that were the real story — surfaces in the same dump. Buried beneath the corruption headlines, editors file it as more unverified UFO noise. The truth was in the folder. Nobody followed it to the bodies.';

export const WRONG_STORY_AOL_SWAP =
  'The dossier does contain files referencing the alleged non-human recovery, but analysts say they were overshadowed by the financial disclosures and dismissed by most outlets as unverifiable.';

export function resolveNarrativeWithRevelations(
  endingId: string,
  baseNarrative: readonly string[],
  savedFiles: ReadonlySet<string> | undefined | null,
): string[] {
  if (baseNarrative.length === 0) return [...baseNarrative];

  // wrong_story: swap its "never mentioned" line rather than append.
  if (endingId === 'wrong_story') {
    if (!hasAnyRevelation(savedFiles)) return [...baseNarrative];
    const idx = baseNarrative.length >= 2 ? 1 : 0;
    return baseNarrative.map((line, i) => (i === idx ? WRONG_STORY_NARRATIVE_SWAP : line));
  }

  const theme = pickAcknowledgmentTheme(endingId, savedFiles);
  if (!theme) return [...baseNarrative];
  return [...baseNarrative, THEME_NARRATIVE[theme]];
}

export function resolveAolBodyWithRevelations(
  endingId: string,
  baseBody: readonly string[],
  savedFiles: ReadonlySet<string> | undefined | null,
): string[] {
  if (baseBody.length === 0) return [...baseBody];

  // wrong_story: swap its "notably absent" line rather than append.
  if (endingId === 'wrong_story') {
    if (!hasAnyRevelation(savedFiles)) return [...baseBody];
    const idx = baseBody.length - 1;
    return baseBody.map((line, i) => (i === idx ? WRONG_STORY_AOL_SWAP : line));
  }

  const theme = pickAcknowledgmentTheme(endingId, savedFiles);
  if (!theme) return [...baseBody];
  return [...baseBody, THEME_AOL[theme]];
}
