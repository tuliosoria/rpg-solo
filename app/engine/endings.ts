// Dossier-Based Endings System for Terminal 1996
//
// 12 endings determined by pattern-matching the player's saved dossier (savedFiles).
// The game checks what combination of files the player chose to save and selects
// the best-matching ending based on priority order.

import { GameState } from '../types';
import { resolveGovernmentScandalNarrative } from './governmentScandalCopy';
import { resolveNarrativeWithRevelations } from './alienRevelationCopy';
import { ENDINGS_CONTENT } from './generated/endingsContent.generated';

// ═══════════════════════════════════════════════════════════════════════════
// NEW DOSSIER-BASED ENDING TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type EndingId =
  | 'ridiculed'
  | 'ufo74_exposed'
  | 'the_2026_warning'
  | 'government_scandal'
  | 'prisoner_45_freed'
  | 'harvest_understood'
  | 'nothing_changes'
  | 'incomplete_picture'
  | 'wrong_story'
  | 'hackerkid_caught'
  | 'secret_ending'
  | 'real_ending';

export interface AolPresentation {
  headline: string;
  subheadline: string;
  body: string[];
  url: string;
  imageSrc?: string;
  imageAlt: string;
  visitorCount: number;
}

export interface GameEnding {
  id: EndingId;
  title: string;
  subtitle: string;
  narrative: string[];
  ufo74_final: string;
  aol: AolPresentation;
}

// ═══════════════════════════════════════════════════════════════════════════
// FILE CATEGORIES — Real filenames from the game filesystem
// ═══════════════════════════════════════════════════════════════════════════

export const FILE_CATEGORIES = {
  military_coverup: [
    'incident_report_1996_01_VG.txt',
    'initial_response_orders.txt',
    'regional_summary_jan96.txt',
    'transport_log_96.txt',
    'jardim_andere_incident.txt',
    'incident_summary_official.txt',
    'logistics_manifest_fragment.txt',
    'cargo_transfer_memo.txt',
    'duty_roster_jan96.txt',
    'asset_disposition_report.txt',
  ],
  medical_autopsy: [
    'autopsy_alpha.log',
    'autopsy_addendum_psi.txt',
    'alpha_autopsy_addendum.txt',
    'bio_container.log',
    'specimen_purpose_analysis.txt',
    'material_x_analysis.dat',
    'medical_examiner_query.txt',
    'medical_effects_brief_77.txt',
    'contact_incident_report.txt',
  ],
  witness: [
    'witness_statement_raw.txt',
    'witness_visit_log.txt',
    'witness_subjects_file.txt',
    'debriefing_protocol.txt',
    'recantation_001.txt',
    'patrol_observation_shift_04.txt',
    'mudinho_dossier.txt',
  ],
  containment: [
    'bio_container.log',
    'bio_program_overview.red',
    'ethics_exception_03.txt',
    'neural_dump_alfa.psi',
    'neural_cluster_experiment.red',
    'neural_cluster_memo.txt',
  ],
  ufo_core: [
    'alpha_journal.log',
    'audio_transcript_brief.txt',
    'photo_archive_register_77.txt',
    'surveillance_recovery.vid',
    'field_report_delta.txt',
    'scout_variants.meta',
    'energy_node_assessment.txt',
  ],
  temporal_convergence: [
    'convergence_model_draft.txt',
    'thirty_year_cycle.txt',
    'projection_update_2026.txt',
    'threat_window.red',
    'window_alignment.meta',
    'window_clarification.red',
    'second_deployment.sig',
  ],
  extraction_harvest: [
    'extraction_mechanism.red',
    'colonization_model.red',
    'non_arrival_colonization.txt',
    'energy_extraction_theory.txt',
    'briefing_watchers_1996.txt',
  ],
  conspiracy_unrelated: [
    'cafeteria_menu_week03.txt',
    'cafeteria_menu.txt',
    'cafeteria_feedback.txt',
    'parking_allocation_jan96.txt',
    'parking_regulations.txt',
    'supplies_request_jan96.txt',
    'printer_notice.txt',
    'lost_found_jan96.txt',
    'lost_found_log.txt',
    'badge_renewal_memo.txt',
    'training_q1_96.txt',
    'hvac_maintenance_log.txt',
    'birthdays_jan96.txt',
    'vacation_calendar.txt',
    'copa_94_celebration.txt',
    'coffee_harvest_q1_96.txt',
    'weather_report_jan96.txt',
    'local_politics_memo.txt',
    'municipal_budget_96.txt',
    'fire_dept_log_jan96.txt',
  ],
  corruption_financial: [
    'budget_request_q1_96.txt',
    'budget_memo.txt',
    'journalist_payments.enc',
    'kill_story_memo.txt',
    'media_contacts.txt',
    'tv_coverage_report.txt',
    'foreign_press_alert.txt',
    'family_compensation.txt',
    'autopsy_suppression.txt',
    'veterinarian_silencing.txt',
  ],
  honeypot_trap: [
    'URGENT_classified_alpha.txt',
    'LEAKED_classified_records.dat',
    'FOR_PRESIDENTS_EYES_ONLY.enc',
    'SMOKING_GUN_proof.txt',
  ],
  ghost_machine: ['ghost_in_machine.enc'],
  alpha_neural: [
    'alpha_neural_connection.psi',
    'alpha_journal.log',
    'alpha_autopsy_addendum.txt',
  ],
  comms_intercept: [
    'transcript_core.enc',
    'transcript_limit.enc',
    'psi_analysis_report.txt',
    'signal_analysis_partial.txt',
    'intercept_summary_dec95.txt',
    'morse_intercept.sig',
    'emergency_broadcast.enc',
  ],
  diplomatic: [
    'foreign_liaison_note.txt',
    'diplomatic_cable_23jan.enc',
    'standing_orders_multinational.txt',
    'parallel_incidents_global.txt',
  ],
  coverup: [
    'aircraft_incident_report.txt',
    'foreign_drone_assessment.txt',
    'weather_balloon_memo.txt',
    'industrial_accident_theory.txt',
    'alternative_explanations.txt',
    'contamination_theory.txt',
    'animal_deaths_report.txt',
    'trace_purge_memo.txt',
    'redaction_override_memo.txt',
  ],
};

export type DossierThreadId =
  | 'military'
  | 'medical'
  | 'witness'
  | 'containment'
  | 'ufoCore'
  | 'temporal'
  | 'harvest'
  | 'comms'
  | 'diplomatic';

export interface DossierCategoryCounts {
  militaryCoverup: number;
  medicalAutopsy: number;
  witness: number;
  containment: number;
  ufoCore: number;
  temporalConvergence: number;
  extractionHarvest: number;
  conspiracyUnrelated: number;
  corruptionFinancial: number;
  honeypotTrap: number;
  alphaNeural: number;
  commsIntercept: number;
  diplomatic: number;
  coverup: number;
}

export interface DossierAnalysis {
  savedCount: number;
  fileNames: string[];
  counts: DossierCategoryCounts;
  visibleThreads: DossierThreadId[];
  hasGhostMachine: boolean;
  hasAlphaNeural: boolean;
  hasConvergence: boolean;
  hasPhysicist: boolean;
}

const DOSSIER_THREAD_COUNT_KEYS: Record<DossierThreadId, keyof DossierCategoryCounts> = {
  military: 'militaryCoverup',
  medical: 'medicalAutopsy',
  witness: 'witness',
  containment: 'containment',
  ufoCore: 'ufoCore',
  temporal: 'temporalConvergence',
  harvest: 'extractionHarvest',
  comms: 'commsIntercept',
  diplomatic: 'diplomatic',
};

const DOSSIER_THREAD_ORDER: DossierThreadId[] = [
  'military',
  'medical',
  'witness',
  'containment',
  'ufoCore',
  'temporal',
  'harvest',
  'comms',
  'diplomatic',
];

export function analyzeDossier(savedFiles: Set<string>): DossierAnalysis {
  const files = [...savedFiles];
  const fileNames = files.map(f => f.split('/').pop() || '');

  const countCategory = (category: string[]): number =>
    fileNames.filter(f => category.includes(f)).length;

  const counts: DossierCategoryCounts = {
    militaryCoverup: countCategory(FILE_CATEGORIES.military_coverup),
    medicalAutopsy: countCategory(FILE_CATEGORIES.medical_autopsy),
    witness: countCategory(FILE_CATEGORIES.witness),
    containment: countCategory(FILE_CATEGORIES.containment),
    ufoCore: countCategory(FILE_CATEGORIES.ufo_core),
    temporalConvergence: countCategory(FILE_CATEGORIES.temporal_convergence),
    extractionHarvest: countCategory(FILE_CATEGORIES.extraction_harvest),
    conspiracyUnrelated: countCategory(FILE_CATEGORIES.conspiracy_unrelated),
    corruptionFinancial: countCategory(FILE_CATEGORIES.corruption_financial),
    honeypotTrap: countCategory(FILE_CATEGORIES.honeypot_trap),
    alphaNeural: countCategory(FILE_CATEGORIES.alpha_neural),
    commsIntercept: countCategory(FILE_CATEGORIES.comms_intercept),
    diplomatic: countCategory(FILE_CATEGORIES.diplomatic),
    coverup: countCategory(FILE_CATEGORIES.coverup),
  };

  const visibleThreads = DOSSIER_THREAD_ORDER.filter(
    thread => counts[DOSSIER_THREAD_COUNT_KEYS[thread]] > 0
  );

  return {
    savedCount: savedFiles.size,
    fileNames,
    counts,
    visibleThreads,
    hasGhostMachine: fileNames.some(f => f.includes('ghost_in_machine')),
    hasAlphaNeural: counts.alphaNeural > 0,
    hasConvergence: fileNames.some(f => f.includes('convergence')),
    hasPhysicist: fileNames.some(f =>
      f.includes('thirty_year_cycle') || f.includes('projection_update_2026')
    ),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// ENDING DETERMINATION — Dossier pattern matching
// ═══════════════════════════════════════════════════════════════════════════

export function determineEnding(savedFiles: Set<string>): EndingId {
  const {
    counts,
    hasGhostMachine,
    hasAlphaNeural,
    hasConvergence,
    hasPhysicist,
  } = analyzeDossier(savedFiles);
  const honeypotCount = counts.honeypotTrap;
  const militaryCount = counts.militaryCoverup;
  const corruptionCount = counts.corruptionFinancial;
  const conspiracyCount = counts.conspiracyUnrelated;
  const witnessCount = counts.witness;
  const containmentCount = counts.containment;
  const temporalCount = counts.temporalConvergence;
  const harvestCount = counts.extractionHarvest;
  const medicalCount = counts.medicalAutopsy;
  const coreCount = counts.ufoCore;

  // Priority 1: HackerKid Caught — saved obvious honeypot files
  if (honeypotCount >= 2) return 'hackerkid_caught';

  // Priority 2: Secret Ending — ghost_in_machine + alpha neural + temporal convergence evidence
  if (hasGhostMachine && hasAlphaNeural && hasPhysicist && hasConvergence) return 'secret_ending';

  // Priority 3: UFO74 Exposed — ghost_in_machine.enc present
  if (hasGhostMachine) return 'ufo74_exposed';

  // Priority 4: The Real Ending — comprehensive dossier
  if (coreCount >= 2 && medicalCount >= 2 && witnessCount >= 1 && militaryCount >= 2) return 'real_ending';

  // Priority 5: The Wrong Story — mostly corruption/mundane, minimal core evidence
  if (corruptionCount + conspiracyCount >= 5 && coreCount <= 1) return 'wrong_story';

  // Priority 6: Government Scandal — heavy military/coverup focus
  if (militaryCount >= 4) return 'government_scandal';

  // Priority 7: Prisoner 45 Freed — containment + witness testimony
  if (containmentCount >= 2 && witnessCount >= 1) return 'prisoner_45_freed';

  // Priority 8: The 2026 Warning — temporal/convergence focus
  if (temporalCount >= 2) return 'the_2026_warning';

  // Priority 9: The Harvest Understood — extraction theory
  if (harvestCount >= 2) return 'harvest_understood';

  // Priority 10: Nothing Changes — decent dossier but missing the full picture
  if (coreCount >= 2 && medicalCount >= 1 && militaryCount >= 1) return 'nothing_changes';

  // Priority 11: Incomplete Picture — scattered dossier, OR one that still carries
  // hard biological/containment evidence (multiple autopsies or containment logs)
  // that never cohered into a case. Such evidence should not be laughed off as
  // 'ridiculed' — the horror leaked through even if the narrative did not.
  const maxCategory = Math.max(
    militaryCount, medicalCount, witnessCount, coreCount, temporalCount, harvestCount
  );
  const hardEvidence = medicalCount >= 2 || containmentCount >= 2;
  if (maxCategory <= 2 || hardEvidence) return 'incomplete_picture';

  // Default: Ridiculed — weak or incoherent dossier
  return 'ridiculed';
}

// ═══════════════════════════════════════════════════════════════════════════
// ENDING CONTENT — 12 dossier-based endings
// ═══════════════════════════════════════════════════════════════════════════

export const ENDINGS: Record<EndingId, Omit<GameEnding, 'id'>> = ENDINGS_CONTENT;

// ═══════════════════════════════════════════════════════════════════════════
// BACKWARD-COMPATIBLE EXPORTS — Used by Victory.tsx, Terminal.tsx, etc.
// ═══════════════════════════════════════════════════════════════════════════

export type EndingVariant = EndingId;

export interface EndingFlags {
  conspiracyFilesLeaked: boolean;
  alphaReleased: boolean;
  neuralLinkAuthenticated: boolean;
}

const ENDING_DIVIDER = '═══════════════════════════════════════════════════════════';

export function getEndingFlags(state: GameState): EndingFlags {
  const flags = state.flags || {};
  return {
    conspiracyFilesLeaked: flags.conspiracyFilesLeaked === true,
    alphaReleased: flags.alphaReleased === true,
    neuralLinkAuthenticated: flags.neuralLinkAuthenticated === true,
  };
}


export function getEndingTitle(variant: EndingVariant): string {
  const ending = (ENDINGS as Record<string, Omit<GameEnding, 'id'>>)[variant];
  return ending?.title ?? variant.toUpperCase().replace(/_/g, ' ');
}

export function getEndingNarrativeLines(
  variant: EndingVariant,
  savedFiles?: ReadonlySet<string> | null,
): string[] {
  const ending = (ENDINGS as Record<string, Omit<GameEnding, 'id'>>)[variant];
  if (!ending) return ['ENDING NOT FOUND'];
  const baseNarrative =
    variant === 'government_scandal'
      ? resolveGovernmentScandalNarrative(ending.narrative, savedFiles)
      : ending.narrative;
  const narrative = resolveNarrativeWithRevelations(variant, baseNarrative, savedFiles);
  return [
    ENDING_DIVIDER,
    '',
    ending.title,
    '',
    ENDING_DIVIDER,
    '',
    ...narrative,
    '',
    `[UFO74]: ${ending.ufo74_final}`,
    '',
    ENDING_DIVIDER,
    '',
    ending.subtitle,
    '',
    `>> ENDING: ${ending.title} <<`,
    '',
  ];
}


