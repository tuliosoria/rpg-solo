import { describe, it, expect } from 'vitest';
import { determineEnding, type EndingId } from '../endings';
import { getAllAccessibleFiles } from '../filesystem';
import { DEFAULT_GAME_STATE, type GameState } from '../../types';

// ──────────────────────────────────────────────────────────────────────────
// Reachability regression test for the dossier-based endings.
//
// Background: A previous build (which retired `rewind`/archive mode) left
// the secret_ending unreachable through normal play because its priority
// check requires a saved file with "convergence" in the basename, and the
// only such file (`convergence_model_draft.txt`) had been left in
// archive-only storage. This test guards against that class of regression
// by walking the LIVE virtualFileSystem with a fully-unlocked game state
// and confirming every dossier-based EndingId can be reached using only
// files an actual player could open and save.
// ──────────────────────────────────────────────────────────────────────────

function fullyUnlockedState(): GameState {
  // Mark every flag the live filesystem checks so getAllAccessibleFiles()
  // returns the union of every path a player could reach over a full run.
  const allFlags: Record<string, boolean> = {
    adminUnlocked: true,
    overrideGateActive: false,
    redactionKeycardRead: true,
    redactionOverrideSolved: true,
    neuralLinkAuthenticated: true,
    scoutLinkUnlocked: true,
    conspiracyFilesLeaked: true,
    alphaReleased: true,
    leakSuccessful: false,
    evidencesSaved: false,
    forbiddenKnowledge: true,
    traceMonitorReviewed: true,
    tamperEvidenceNoted: true,
    overrideSuggested: true,
  };
  return {
    ...DEFAULT_GAME_STATE,
    accessLevel: 5,
    tutorialComplete: true,
    // Top-level flags that some VFS subtrees gate on (e.g. /aftermath).
    epilogueUnlocked: true,
    flags: allFlags,
  } as GameState;
}

function basenamesOf(paths: string[]): Set<string> {
  return new Set(paths.map((p) => p.split('/').pop() ?? p));
}

// Build a dossier out of paths whose basename matches one of the requested
// filenames, in the requested order, deduped and clamped to 10 entries.
function buildDossier(
  preferred: readonly string[],
  reachablePaths: ReadonlyMap<string, string>,
  fillerCandidates: readonly string[],
): Set<string> {
  const dossier = new Set<string>();
  const add = (basename: string) => {
    const fullPath = reachablePaths.get(basename);
    if (fullPath && dossier.size < 10) dossier.add(fullPath);
  };
  preferred.forEach(add);
  for (const filler of fillerCandidates) {
    if (dossier.size >= 10) break;
    add(filler);
  }
  return dossier;
}

describe('Ending reachability through the live virtualFileSystem', () => {
  const state = fullyUnlockedState();
  const reachablePathsList = getAllAccessibleFiles(state);
  // Map basename → first reachable absolute path. Some basenames live in
  // multiple directories; any one of them is fine for the determineEnding
  // category check, which works on basename only.
  const reachablePaths = new Map<string, string>();
  for (const p of reachablePathsList) {
    const base = p.split('/').pop() ?? p;
    if (!reachablePaths.has(base)) reachablePaths.set(base, p);
  }
  const reachableBasenames = basenamesOf(reachablePathsList);

  it('exposes a non-trivial number of reachable files', () => {
    expect(reachablePathsList.length).toBeGreaterThan(50);
  });

  // Filler files that don't trigger any ending priority — used to pad
  // dossiers up to 10 entries without accidentally hitting a higher
  // priority. /admin/ coverup files and a couple of cover-story files
  // are category-neutral for priorities 1-9.
  const safeFiller = [
    'aircraft_incident_report.txt',
    'foreign_drone_assessment.txt',
    'weather_balloon_memo.txt',
    'industrial_accident_theory.txt',
    'alternative_explanations.txt',
    'contamination_theory.txt',
    'animal_deaths_report.txt',
    'trace_purge_memo.txt',
    'redaction_override_memo.txt',
  ];

  // Curated dossiers per ending. Each list is the minimum set of files
  // whose categories satisfy the matching priority rule, then padded with
  // safe filler. Files chosen here MUST be reachable in the live VFS.
  const TARGETED_DOSSIERS: Record<EndingId, readonly string[]> = {
    hackerkid_caught: [
      'URGENT_classified_alpha.txt',
      'SMOKING_GUN_proof.txt',
      'FOR_PRESIDENTS_EYES_ONLY.enc',
      'LEAKED_classified_records.dat',
    ],
    secret_ending: [
      'ghost_in_machine.enc',
      'alpha_neural_connection.psi',
      'thirty_year_cycle.txt',
      'convergence_model_draft.txt',
    ],
    ufo74_exposed: [
      'ghost_in_machine.enc',
      'audio_transcript_brief.txt',
    ],
    real_ending: [
      'audio_transcript_brief.txt',
      'alpha_journal.log',
      'autopsy_alpha.log',
      'bio_container.log',
      'witness_statement_raw.txt',
      'incident_report_1996_01_VG.txt',
      'initial_response_orders.txt',
    ],
    wrong_story: [
      'journalist_payments.enc',
      'media_contacts.txt',
      'budget_request_q1_96.txt',
      'kill_story_memo.txt',
      'family_compensation.txt',
      'cafeteria_menu.txt',
    ],
    government_scandal: [
      'incident_report_1996_01_VG.txt',
      'initial_response_orders.txt',
      'regional_summary_jan96.txt',
      'transport_log_96.txt',
      'jardim_andere_incident.txt',
      'incident_summary_official.txt',
    ],
    prisoner_45_freed: [
      'bio_container.log',
      'neural_cluster_experiment.red',
      'neural_cluster_memo.txt',
      'witness_statement_raw.txt',
      'witness_visit_log.txt',
    ],
    the_2026_warning: [
      'thirty_year_cycle.txt',
      'projection_update_2026.txt',
      'window_alignment.meta',
    ],
    harvest_understood: [
      'extraction_mechanism.red',
      'colonization_model.red',
      'energy_extraction_theory.txt',
    ],
    nothing_changes: [
      'audio_transcript_brief.txt',
      'alpha_journal.log',
      'autopsy_alpha.log',
      'incident_report_1996_01_VG.txt',
    ],
    incomplete_picture: [
      'audio_transcript_brief.txt',
      'autopsy_alpha.log',
      'witness_statement_raw.txt',
      'incident_report_1996_01_VG.txt',
    ],
    ridiculed: [
      'witness_statement_raw.txt',
      'witness_visit_log.txt',
      'witness_subjects_file.txt',
      'debriefing_protocol.txt',
      'recantation_001.txt',
      'patrol_observation_shift_04.txt',
      'mudinho_dossier.txt',
    ],
  };

  for (const endingId of Object.keys(TARGETED_DOSSIERS) as EndingId[]) {
    const preferred = TARGETED_DOSSIERS[endingId];

    it(`reaches ${endingId} using only live-filesystem files`, () => {
      // Every preferred file must be reachable in the live VFS.
      const missing = preferred.filter((f) => !reachableBasenames.has(f));
      expect(
        missing,
        `Files required for ${endingId} are missing from the live filesystem: ${missing.join(', ')}`,
      ).toEqual([]);

      const dossier = buildDossier(preferred, reachablePaths, safeFiller);

      // Sanity: the dossier must be at least the preferred count.
      expect(dossier.size).toBeGreaterThanOrEqual(preferred.length);

      const result = determineEnding(dossier);
      expect(result).toBe(endingId);
    });
  }

  // Dedicated guard for the historical regression: secret_ending must be
  // reachable, and the convergence trigger must come from a live file.
  it('keeps a "convergence" file mounted in the live filesystem', () => {
    const convergenceMatches = [...reachableBasenames].filter((b) =>
      b.toLowerCase().includes('convergence'),
    );
    expect(
      convergenceMatches.length,
      'No live file contains "convergence" in its basename. The secret_ending priority cannot trigger.',
    ).toBeGreaterThan(0);
  });
});
