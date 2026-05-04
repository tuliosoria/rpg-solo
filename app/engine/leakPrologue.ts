// Dynamic ending prologue based on the player's leaked dossier.
//
// When the player has saved/leaked enough alien-related files, every applicable
// ending opens with a dynamic "world reaction" segment about the hackerkid leak
// before the ending's own narrative takes over.

import type { EndingId } from './endings';

// File basenames that count as "alien-related" for prologue purposes.
// Mirrors the alien-leaning categories in `endings.ts` (excludes
// conspiracy_unrelated, corruption_financial, coverup, honeypot_trap).
const ALIEN_RELATED_FILES = new Set<string>([
  // ufo_core
  'alpha_journal.log',
  'audio_transcript_brief.txt',
  'photo_archive_register_77.txt',
  'surveillance_recovery.vid',
  'field_report_delta.txt',
  'scout_variants.meta',
  'energy_node_assessment.txt',
  'deleted_comms_log.txt',
  // medical_autopsy
  'autopsy_alpha.log',
  'autopsy_addendum_psi.txt',
  'alpha_autopsy_addendum.txt',
  'bio_container.log',
  'specimen_purpose_analysis.txt',
  'material_x_analysis.dat',
  'medical_examiner_query.txt',
  'medical_effects_brief_77.txt',
  'contact_incident_report.txt',
  'autopsy_notes_unredacted.txt',
  // witness
  'witness_statement_raw.txt',
  'witness_statement_original.txt',
  'witness_visit_log.txt',
  'witness_subjects_file.txt',
  'debriefing_protocol.txt',
  'recantation_001.txt',
  'patrol_observation_shift_04.txt',
  'mudinho_dossier.txt',
  // containment
  'bio_containment_log_deleted.txt',
  'bio_program_overview.red',
  'ethics_exception_03.txt',
  'neural_dump_alfa.psi',
  'neural_cluster_experiment.red',
  'neural_cluster_memo.txt',
  // alpha_neural
  'alpha_neural_connection.psi',
  // ghost_machine
  'ghost_in_machine.enc',
  // comms_intercept
  'transcript_core.enc',
  'transcript_limit.enc',
  'psi_analysis_report.txt',
  'psi_analysis_classified.txt',
  'signal_analysis_partial.txt',
  'intercept_summary_dec95.txt',
  'morse_intercept.sig',
  'emergency_broadcast.enc',
  // temporal_convergence
  'convergence_model_draft.txt',
  'thirty_year_cycle.txt',
  'projection_update_2026.txt',
  'threat_window.red',
  'window_alignment.meta',
  'window_clarification.red',
  'second_deployment.sig',
  // extraction_harvest
  'extraction_mechanism.red',
  'colonization_model.red',
  'non_arrival_colonization.txt',
  'energy_extraction_theory.txt',
  'transfer_manifest_deleted.txt',
  'briefing_watchers_1996.txt',
  // military_coverup (alien-relevant cover side)
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
  // diplomatic
  'foreign_liaison_note.txt',
  'foreign_liaison_cable_deleted.txt',
  'diplomatic_cable_23jan.enc',
  'standing_orders_multinational.txt',
  'parallel_incidents_global.txt',
]);

// File basenames whose virtualFileSystem FileNode carries an `imageTrigger`.
// Hardcoded mirror of the 9 image-bearing files in app/data/virtualFileSystem.ts.
const FILES_WITH_IMAGES = new Set<string>([
  'foreign_drone_assessment.txt',
  'material_x_analysis.dat',
  'bio_container.log',
  'autopsy_alpha.log',
  'transcript_core.enc',
  'field_report_delta.txt',
  'bio_program_overview.red',
  'second_deployment.sig',
  'extraction_mechanism.red',
]);

// Full filesystem paths whose saved file maps to an evidence video.
// Mirrors the keys of EVIDENCE_VIDEO_ATTACHMENTS in terminalConstants.ts.
const FILES_WITH_VIDEOS = new Set<string>([
  '/internal/jardim_andere_incident.txt',
  '/storage/assets/logistics_manifest_fragment.txt',
  '/admin/energy_extraction_theory.txt',
  '/internal/ghost_in_machine.enc',
  '/storage/assets/transport_log_96.txt',
  '/ops/mib/recantation_forms/recantation_001.txt',
  '/ops/prato/operation_prato_original.txt',
  '/internal/protocols/sanitized/visitor_briefing.txt',
  '/internal/witness_farm_recording.txt',
]);

// Endings where a "leak proves aliens are real" prologue would directly
// contradict the ending's own framing — skip the prologue entirely.
const ENDINGS_WITHOUT_PROLOGUE: ReadonlySet<EndingId> = new Set<EndingId>([
  'ridiculed',
  'hackerkid_caught',
]);

// At least this many alien-related saved files are required before the leak
// is treated as a globally significant event.
const ALIEN_FILE_THRESHOLD = 2;

export interface LeakSummary {
  alienFileCount: number;
  hasImages: boolean;
  hasVideos: boolean;
  qualifies: boolean;
}

export function analyzeLeak(savedFiles: ReadonlySet<string> | undefined | null): LeakSummary {
  const summary: LeakSummary = {
    alienFileCount: 0,
    hasImages: false,
    hasVideos: false,
    qualifies: false,
  };
  if (!savedFiles || savedFiles.size === 0) return summary;

  for (const fullPath of savedFiles) {
    const basename = fullPath.split('/').pop() ?? fullPath;
    if (ALIEN_RELATED_FILES.has(basename)) summary.alienFileCount += 1;
    if (FILES_WITH_IMAGES.has(basename)) summary.hasImages = true;
    if (FILES_WITH_VIDEOS.has(fullPath)) summary.hasVideos = true;
  }

  summary.qualifies = summary.alienFileCount >= ALIEN_FILE_THRESHOLD;
  return summary;
}

export function buildLeakPrologue(
  savedFiles: ReadonlySet<string> | undefined | null,
  endingId: EndingId | undefined | null,
): string[] {
  if (endingId && ENDINGS_WITHOUT_PROLOGUE.has(endingId)) return [];
  const summary = analyzeLeak(savedFiles);
  if (!summary.qualifies) return [];

  const evidence: string[] = [];
  if (summary.hasImages) evidence.push('photographic evidence');
  if (summary.hasVideos) evidence.push('video footage');

  let evidenceLine: string;
  if (evidence.length === 2) {
    evidenceLine =
      'The dump includes photographic evidence and video footage, amplifying the hysteria with every replay.';
  } else if (summary.hasImages) {
    evidenceLine =
      'The dump includes photographic evidence, and broadcasters loop the stills on every channel.';
  } else if (summary.hasVideos) {
    evidenceLine =
      'The dump includes raw video footage, and the clips amplify the hysteria with every replay.';
  } else {
    evidenceLine =
      'The dump is text-only, but the documents read like internal memos no one was ever meant to see.';
  }

  return [
    'A user known only as hackerkid has leaked classified Brazilian government files appearing to prove the existence of extraterrestrial life, and the world is in international uproar.',
    evidenceLine,
    'Skeptics insist the files are forged. Forensic analysts, working around the clock, are reporting that they may be authentic.',
    'Aliens are all anyone is talking about. Then, buried inside the same archive, a second story begins to surface.',
  ];
}
