// Shared helper functions used across multiple command handler modules

import {
  GameState,
  CommandResult,
  TerminalEntry,
  FileMutation,
  FileNode,
  ImageTrigger,
} from '../../types';
import { createSeededRng, seededRandomInt, seededRandomPick } from '../rng';
import {
  countEvidence,
  getDisturbingContentAvatarExpression,
  isEvidenceFile,
  MAX_EVIDENCE_COUNT,
} from '../evidenceRevelation';
import { ARCHIVE_FILES } from '../../data/archiveFiles';
import {
  DETECTION_THRESHOLDS,
  MAX_DETECTION,
  applyWarmupDetection,
  WARMUP_PHASE,
} from '../../constants/detection';
import { shouldSuppressPressure } from '../../constants/atmosphere';
import { createEntry, createEntryI18n, createOutputEntries, createUFO74Message } from './utils';
import { getTutorialTip, shouldShowTutorialTip } from './tutorial';
import { getFileContent } from '../filesystem';
import { saveCheckpoint } from '../../storage/saves';
import { translateStatic } from '../../i18n';

// ═══════════════════════════════════════════════════════════════════════════
// UFO74 EVIDENCE REACTIONS
// ═══════════════════════════════════════════════════════════════════════════

const EVIDENCE_UFO74_REACTIONS: Record<string, string> = {
  'alpha_journal.log':
    'that journal. the scientist lost his mind. but he was right about everything.',
  'alpha_neural_connection.psi':
    'they made contact. they actually made contact. and then it spoke back.',
  'alpha_autopsy_addendum.txt':
    'an autopsy on something that was still alive. these people were insane.',
  'jardim_andere_incident.txt': 'that is the original field report. the one they tried to destroy.',
  'incident_summary_official.txt':
    'the official version. compare it to what we have. they rewrote everything.',
  'audio_transcript_brief.txt':
    'interesting kid. we can leak this. not a clear evidence — but they were really hiding something.',
  'material_x_analysis.dat': 'material analysis. whatever they found, it is not from here.',
  'transport_log_96.txt': 'transport records. they moved everything in the middle of the night.',
  'logistics_manifest_fragment.txt':
    'manifest fragment. they shipped something weighing 112 kilos through diplomatic channels.',
  'integrity_hashes.dat':
    'integrity hashes. they were tracking which files had been tampered with.',
  'bio_container.log': 'containment log. they kept it in a sealed unit for eleven days.',
  'autopsy_alpha.log': 'an autopsy report. official. classified. exactly what we needed.',
  'autopsy_addendum_psi.txt':
    'neurological addendum. the brain was still active after death. still active.',
  'witness_statement_raw.txt': 'raw witness statement. before they got to her. before the edits.',
  'neural_dump_alfa.psi':
    'neural recording. they captured whatever was still firing in that brain.',
  'specimen_purpose_analysis.txt':
    'purpose analysis. they were trying to figure out what it was FOR.',
  'surveillance_recovery.vid': 'surveillance footage. someone saved this before the purge.',
  'field_report_delta.txt': 'field report from prato. 1977. this has been going on for decades.',
  'operation_prato_original.txt':
    'operation prato. the air force documented everything in 77. then buried it.',
  'initial_response_orders.txt':
    'response orders. standard military protocol for something very not standard.',
  'colares_incident_log_77.txt':
    'colares 77. dozens of sightings. hundreds of witnesses. all silenced.',
  'patrol_observation_shift_04.txt':
    'patrol observation. soldiers describing what they saw. you can feel the fear.',
  'medical_effects_brief_77.txt':
    'medical effects. burns on the skin. radiation marks. from light beams.',
  'photo_archive_register_77.txt': 'photo archive. they had photos. had. past tense.',
  'retrospective_scan_assessment.red':
    'retrospective assessment. someone connected 77 to 96. same pattern.',
  'scout_variants.meta': 'scout classification. they categorized different types. as in plural.',
  'energy_node_assessment.txt':
    'energy assessment. propulsion system we cannot replicate. not even close.',
  'signal_analysis_partial.txt':
    'signal fragment. partial decryption. whatever this says, they did not want us reading it.',
  'aircraft_incident_report.txt':
    'aircraft incident report. their first cover story. it did not hold.',
  'foreign_drone_assessment.txt':
    'drone theory. the one they floated before anyone knew what a drone was.',
  'industrial_accident_theory.txt': 'industrial accident. their fallback explanation. paper thin.',
  'witness_visit_log.txt': 'witness visit log. they visited every single one. every single one.',
  'debriefing_protocol.txt':
    'debriefing protocol. that is a polite word for what they did to those people.',
  'witness_subjects_file.txt':
    'the silva sisters file. three girls. teenagers. and the military went after them.',
  'recantation_001.txt': 'recantation form. they made witnesses sign this. under threat.',
  'animal_deaths_report.txt': 'animal deaths at the zoo. same week. same area. not a coincidence.',
  'veterinarian_silencing.txt':
    'they silenced the veterinarian. the one who asked too many questions.',
  'contamination_theory.txt':
    'contamination theory. the story they fed to the press about the dead animals.',
  'contact_incident_report.txt':
    'chereze. the officer who touched it. dead within weeks. and they covered it up.',
  'autopsy_suppression.txt':
    'autopsy suppression. they blocked the examination of a dead officer. why.',
  'family_compensation.txt':
    'family compensation. they paid the family to stay quiet. blood money.',
  'transcript_core.enc':
    'encrypted transmission. the core transcript. this is what they were saying.',
  'transcript_limit.enc':
    'second transcript. they intercepted more than one. they kept intercepting.',
  'psi_analysis_report.txt':
    'signal analysis. the pattern is structured. it is language. it is definitely language.',
  'foreign_liaison_note.txt': 'foreign liaison. other governments knew. they all knew.',
  'diplomatic_cable_23jan.enc': 'diplomatic cable. encrypted. sent three days after the incident.',
  'standing_orders_multinational.txt':
    'multinational protocol. six countries. coordinated. this goes so far beyond brazil.',
  'medical_examiner_query.txt': 'medical examiner query. someone was asking the wrong questions.',
  'neural_cluster_experiment.red':
    'neural cluster experiment. they built an interface. they tried to talk to it.',
  'intercept_summary_dec95.txt':
    'december 95 intercepts. a month before varginha. they knew something was coming.',
  'regional_summary_jan96.txt':
    'january 96 summary. the week before contact. activity was off the charts.',
  'morse_intercept.sig':
    'morse intercept. someone was sending morse. but not in any known protocol.',
  'journalist_payments.enc':
    'journalist payments. encrypted. they paid the press to look the other way.',
  'media_contacts.txt': 'media contacts list. every journalist they had in their pocket.',
  'kill_story_memo.txt': 'kill story memo. direct order to suppress coverage. signed and dated.',
  'tv_coverage_report.txt':
    'tv coverage report. they were monitoring every broadcast. every mention.',
  'foreign_press_alert.txt':
    'foreign press alert. international media was picking it up. they panicked.',
  'neural_cluster_memo.txt':
    'neural cluster memo. they replicated alien neural tissue in silicon. it worked.',
  'threat_window.red': 'threat window. a timeline for something they cannot stop.',
  'internal_note_07.txt': 'internal note. someone higher up was asking for updates. daily.',
  'bio_program_overview.red':
    'analyze biological material? that thing looks like a good old alien to me, kid.',
  'colonization_model.red':
    'colonization model. not invasion. colonization. the difference matters.',
  'ethics_exception_03.txt':
    'ethics exception. they waived the rules. officially. to do what they did.',
  'window_alignment.meta': 'window alignment data. the timing is not random. it never was.',
  'briefing_watchers_1996.txt':
    'thirty rotations. 2026. kid that is this year. i feel something bad will happen...',
  'weather_balloon_memo.txt': 'weather balloon memo. the oldest lie in the book.',
  'parallel_incidents_global.txt':
    'parallel incidents. same thing happened in other countries. same year.',
  'thirty_year_cycle.txt': 'thirty year cycle. 1966. 1996. 2026. the pattern does not stop.',
  'energy_extraction_theory.txt':
    'that document. whoever wrote it understood what is happening. and it broke them.',
  'non_arrival_colonization.txt':
    'non-arrival colonization. they do not need to come here. they never did.',
  'window_clarification.red': 'window clarification. the dates are specific. and close.',
  'extraction_mechanism.red':
    'extraction mechanism. the process is automated. we never even notice.',
  'second_deployment.sig':
    'second deployment. there was a second wave. there was always going to be.',
  'neural_fragment.dat':
    'neural fragment. reconstructed. whatever this was thinking, they captured it.',
  'emergency_broadcast.enc':
    'emergency broadcast. encrypted. whoever sent this was not expecting to send it.',
  'redaction_override_memo.txt':
    'redaction override. someone had the authority to unlock everything. and used it.',
  'trace_purge_memo.txt':
    'trace purge memo. the order to erase everything. we got here just in time.',
  'mudinho_dossier.txt': 'mudinho dossier. a planted witness. they fabricated the whole thing.',
  'alternative_explanations.txt': 'alternative explanations. a menu of lies. pick one and sell it.',
  'media_talking_points.txt': 'talking points. scripted answers for every question. word for word.',
  'cargo_transfer_memo.txt':
    'cargo memo. everything in code. "agricultural equipment" means what you think it means.',
  'visitor_briefing.txt': 'visitor briefing. coded language. they had a word for everything.',
  'asset_disposition_report.txt':
    'asset disposition. where they moved everything. hidden in plain language.',
  'terminology_guide.txt': 'terminology guide. a dictionary of lies. every real word replaced.',
  'duty_roster_jan96.txt':
    'all hands on deck. no explanation. just... everyone.',
  'birthdays_jan96.txt':
    'one name redacted. even from a birthday list.',
  'training_q1_96.txt':
    'stress management workshop. right after the incident. subtle.',
  'phone_directory_96.txt':
    'every extension. every name. some of these people vanished.',
  'vacation_calendar.txt':
    'cancelled vacation. no reason given. just "incident."',
  'facilities_memo_12.txt':
    'new hours starting the 20th. they were expecting a long night.',
  'parking_allocation_jan96.txt':
    'resurfacing a parking lot during a coverup. convenient.',
  'hvac_maintenance_log.txt':
    'cold storage failure. classified spoilage. you know what was in there.',
  'lost_found_jan96.txt':
    'classified item in lost and found. someone dropped something.',
  'budget_request_q1_96.txt':
    'sector 7 budget. look at the equipment line. that is not office gear.',
  'supplies_request_jan96.txt':
    'correction fluid. twelve bottles. a lot of things to erase.',
  'printer_notice.txt':
    'printer jams for weeks. a lot of paper going through that machine.',
  'badge_renewal_memo.txt':
    'badge renewal. perfect excuse to revoke someone quietly.',
  'budget_memo.txt':
    'they had time to audit paper clips. while people disappeared.',
  'maintenance_schedule.txt':
    'generator test postponed. they needed it running for something else.',
  'cafeteria_menu_week03.txt':
    'last normal menu before the 20th. enjoy the feijoada.',
  'incident_report_1996_01_VG.txt':
    'three specimens. they called it a chemical spill.',
  'cafeteria_menu.txt':
    'they were still serving lunch. while storing a body downstairs.',
  'cafeteria_feedback.txt':
    'broken coffee machine. three weeks. nobody came to fix anything.',
  'copa_94_celebration.txt':
    'é tetra. three times per hour. at least someone was happy once.',
  'vehicle_log_jan96.txt':
    '142 kilometers in one night. classified driver. classified destination.',
  'parking_regulations.txt':
    'normal parking rules. at a facility that does not officially exist.',
  'lost_found_log.txt':
    'someone lost reading glasses near the conference room. saw too much.',
  'coffee_harvest_q1_96.txt':
    'coffee harvest report. same region. same soil. same everything.',
  'weather_report_jan96.txt':
    'clear skies over varginha. perfect visibility. that was the problem.',
  'local_politics_memo.txt':
    'election year. the mayor knew nothing. officially.',
  'municipal_budget_96.txt':
    'public safety got twelve percent. they needed every centavo that week.',
  'railroad_schedule_jan96.txt':
    'military freight at 3:30 am. three covered cars. nobody looked inside.',
  'fire_dept_log_jan96.txt':
    'they called the fire dept too. then someone called them off.',
  'save_evidence.sh':
    'i wrote that script. in case they cut me off.',
  'purge_trace.sh':
    'old utility. someone used it the night of the 20th.',
  'core_dump_corrupted.bin':
    'that crash was not random. something triggered it from inside.',
  'encoded_transmission.enc':
    'rot13. amateur cipher. but the message underneath is not amateur.',
  'modem_log_jan96.txt':
    '28.8 modem. geocities. someone was uploading before they got caught.',
  '.signature.bak':
    'that sig file. i know whose terminal that was.',
  'URGENT_classified_alpha.txt':
    'honeypot. do not trust filenames that scream at you.',
  'LEAKED_classified_records.dat':
    'decoy file. they put these everywhere to catch people like us.',
  'FOR_PRESIDENTS_EYES_ONLY.enc':
    'trap. real classified files never advertise themselves.',
  'SMOKING_GUN_proof.txt':
    'obvious bait. real proof does not come with a label.',
  'witness_statement_original.txt':
    'the original statement. before they rewrote her words.',
  'directive_alpha_draft.txt':
    'the first draft. they removed the parts about cognitive persistence.',
  'deleted_comms_log.txt':
    'three biologics confirmed. one responsive. read that again.',
  'personnel_file_costa.txt':
    'costa. they erased him. like he never existed.',
  'project_seed_memo.txt':
    'project seed. they had a name for it. they had a plan.',
  'autopsy_notes_unredacted.txt':
    'it just stopped. no trauma. no illness. it chose to stop.',
  'transfer_manifest_deleted.txt':
    'operation colheita. harvest. they named it harvest.',
  'bio_containment_log_deleted.txt':
    'bio-b caused headaches within three meters. without touching anyone.',
  'psi_analysis_classified.txt':
    'theta-wave sync. it was in their heads. literally.',
  'foreign_liaison_cable_deleted.txt':
    'langley knew. within 72 hours. they always know.',
  'convergence_model_draft.txt':
    'september 2026. we are running out of time.',
  'active_trace.sys':
    'they flagged your session. they are watching you right now. keep going anyway.',
  'apollo_media_guidelines.pdf':
    'lighting anomalies in moon footage. funny how every government has the same playbook for things that look wrong.',
  'archival_photo_replacement.notice':
    'modernization. that is what they call it when they replace the photos that show too much.',
  'asset_transfer_form_incomplete.txt':
    'transfer from holding-7. rejected. no destination. someone chickened out at the last second.',
  'avian_tracking_program.csv':
    'surveillance pigeons. battery-powered. with audio-video payloads. and people laugh at conspiracy theorists.',
  'behavioral_compliance_study.dat':
    'acoustic influence on consumer behavior. background music that makes you buy things. or believe things. or forget things.',
  'cipher_notes.txt':
    'C-O-L-H-E-I-T-A. colheita. harvest. they hid the access code in plain sight using farm words. varginha is farm country.',
  'coherence_threshold.log':
    'the system knows what you are doing kid. it is measuring how close you are. keep collecting.',
  'consumer_device_listening.memo':
    'passive audio collection through home devices. in 1995. imagine what they can do now with a phone in every pocket.',
  'data_reconstruction.util':
    'someone built this tool to recover what was deleted. they knew files would disappear. smart person.',
  'economic_transition_memo.txt':
    'distributed ledger monetary system. in 1995. they had cryptocurrency before anyone had a name for it.',
  'education_curriculum_revision.doc':
    'they were editing what kids learn in school. you control the future by controlling what gets taught. classic.',
  'ghost_in_machine.enc':
    'you found it. you found me. i did not think anyone would dig this deep.',
  'ghost_session.log':
    'residual session. someone was here before you. they accessed the same files. they did not make it out.',
  'incident_review_protocol.txt':
    'cross-dimensional correlation. they want you to connect physical assets, communications, and oversight. that is what the dossier is for.',
  'infrastructure_blackout_simulation.txt':
    'exercise dark winter. they practiced shutting everything down. seventy-two hours became a hundred and sixty-eight. they liked what they saw.',
  'internal_response_memo.txt':
    'flood networks with fakes. pressure witnesses to recant. that is containment doctrine. they wrote it down like a recipe.',
  'maintenance_notes.txt':
    'the admin left breadcrumbs. recover. trace. scan. tools they did not put in the manual. someone wanted you to find them.',
  'news_archive_feb96.txt':
    'overactive imaginations. that is what they told the press. the press printed it. nobody asked a follow-up question.',
  'note_to_self.tmp':
    'laundry and birthdays. normal life. and then — special cargo in a temperature-controlled basement. ammonia and wet earth. kid. that is not normal.',
  'override_protocol_memo.txt':
    'override codes for restricted access. someone left the instructions right here in the system. on purpose.',
  'pattern_recognition.log':
    'the system is watching your patterns. every file you open. every command you type. it sees what you are building.',
  'personnel_transfer_notice.txt':
    'ferreira transferred to brasília. lima to são paulo. they scattered everyone who saw something. standard procedure.',
  'projection_update_2026.txt':
    'the 2026 window. kid. that is now. we are inside it right now. and the model says panic and collapse.',
  'redaction_keycard.txt':
    'phase two is already underway. that is not a code. that is a warning. and whoever left this card wanted it found.',
  'satellite_light_reflection_trials.txt':
    'orbital reflective arrays for psychological operations. lights in the sky that are not ufos. just government mirrors. sure.',
  'session_objectives.txt':
    'read-only access. incident reconstruction. that is what they think you are doing here. let them think that.',
  'session_residue.log':
    'the system flagged you as a deliberate collector. it knows you are assembling the picture. we should have purged this terminal. too late now.',
  'transfer_authorization.txt':
    'my transfer papers. base aérea de guarulhos. i left something in that authorization. on purpose.',
  'trust_protocol_1993.txt':
    'share nothing beyond your scope. i broke that rule. every single day for thirty years. and i would do it again.',
  'ufo74_last_signal.log':
    'my last transmission from inside the system. march 96. three in the morning. i did not know if anyone would ever hear it.',
  'weather_pattern_intervention.log':
    'aerosol dispersal over civilian areas. project cirrus. they called it weather modification. it was not about the weather.',
};

const GENERIC_EVIDENCE_REACTIONS: string[] = [
  'kid. that is insane. save that.',
  'good stuff. we are going to need this for the leak.',
  'damn. they really buried this one.',
  'you found it. i knew it was in there.',
  'this is exactly what we came for. keep going.',
  'they are going to hate that you found that.',
  'one more like that and we blow this wide open.',
  'save everything. do not skip a single file.',
  'that one is going straight into the leak package.',
  'this is why they locked this system down.',
];

let lastGenericReactionIndex = -1;

// ═══════════════════════════════════════════════════════════════════════════
// CONTEXT RNG - Deterministic random based on game state and context
// ═══════════════════════════════════════════════════════════════════════════

export function hashCommandContext(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) || 1;
}

export function createContextRng(
  state: GameState,
  ...parts: Array<string | number | boolean | undefined>
): () => number {
  const context = parts.map(part => String(part ?? '')).join('|');
  return createSeededRng((state.seed || 1) + (state.rngState || 1) + hashCommandContext(context));
}

export function contextChance(
  state: GameState,
  probability: number,
  ...parts: Array<string | number | boolean | undefined>
): boolean {
  return createContextRng(state, ...parts)() < probability;
}

export function contextRandomInt(
  state: GameState,
  min: number,
  max: number,
  ...parts: Array<string | number | boolean | undefined>
): number {
  return seededRandomInt(createContextRng(state, ...parts), min, max);
}

export function contextRandomPick<T>(
  state: GameState,
  items: T[],
  ...parts: Array<string | number | boolean | undefined>
): T {
  return seededRandomPick(createContextRng(state, ...parts), items);
}

// ═══════════════════════════════════════════════════════════════════════════
// SINGULAR IRREVERSIBLE EVENTS - Each can only happen once per run
// ═══════════════════════════════════════════════════════════════════════════

interface SingularEvent {
  id: string;
  trigger: (state: GameState, command: string, args: string[]) => boolean;
  execute: (state: GameState) => {
    output: TerminalEntry[];
    stateChanges: Partial<GameState>;
    delayMs?: number;
    triggerFlicker?: boolean;
    triggerTuringTest?: boolean;
  };
}

const SINGULAR_EVENTS: SingularEvent[] = [
  {
    // UFO74 WARNING - Warn player before Turing test triggers
    id: 'turing_warning',
    trigger: (state, _command, _args) => {
      if (state.singularEventsTriggered?.has('turing_warning')) return false;
      if (state.turingEvaluationCompleted) return false;
      if (state.turingEvaluationActive) return false;
      if (!state.tutorialComplete) return false;
      return state.detectionLevel >= DETECTION_THRESHOLDS.TURING_WARNING;
    },
    execute: state => {
      return {
        output: [
          createEntryI18n(
            'ufo74',
            'engine.commands.helpers.ufo74_careful_kid_they_re_getting_suspicious',
            "UFO74: careful kid, they're getting suspicious."
          ),
          createEntryI18n(
            'ufo74',
            'engine.commands.helpers.if_you_hit_50_you_ll_have_to_prove_you_re_human',
            "       if you hit 50% you'll have to prove you're human."
          ),
        ],
        stateChanges: {
          singularEventsTriggered: new Set([
            ...(state.singularEventsTriggered || []),
            'turing_warning',
          ]),
        },
        delayMs: 500,
      };
    },
  },
  {
    // TURING EVALUATION - System challenges user to prove they're not a human intruder
    id: 'turing_evaluation',
    trigger: (state, _command, _args) => {
      if (state.singularEventsTriggered?.has('turing_evaluation')) return false;
      if (state.turingEvaluationCompleted) return false;
      if (state.turingEvaluationActive) return false;
      if (!state.tutorialComplete) return false;
      return state.detectionLevel >= DETECTION_THRESHOLDS.TURING_TRIGGER;
    },
    execute: state => {
      return {
        output: [
          createEntry('system', ''),
          createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
          createEntryI18n(
            'warning',
            'engine.commands.helpers.security_protocol_turing_evaluation_initiated',
            '        SECURITY PROTOCOL: TURING EVALUATION INITIATED'
          ),
          createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
          createEntry('system', ''),
        ],
        stateChanges: {
          singularEventsTriggered: new Set([
            ...(state.singularEventsTriggered || []),
            'turing_evaluation',
          ]),
          turingEvaluationActive: true,
          turingEvaluationIndex: 0,
        },
        delayMs: 1500,
        triggerFlicker: true,
        triggerTuringTest: true,
      };
    },
  },
  {
    // THE ECHO - Triggered when accessing psi files at high detection
    id: 'the_echo',
    trigger: (state, command, args) => {
      if (state.singularEventsTriggered?.has('the_echo')) return false;
      if (shouldSuppressPressure(state)) return false;
      if (command !== 'open') return false;
      const path = args[0]?.toLowerCase() || '';
      return (
        (path.includes('psi') || path.includes('transcript')) &&
        state.detectionLevel >= DETECTION_THRESHOLDS.WANDERING_PSI
      );
    },
    execute: state => ({
      output: [
        createEntry('system', ''),
        createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
        createEntry('system', ''),
        createEntryI18n(
          'warning',
          'engine.commands.helpers.signal_echo_detected',
          '                    [SIGNAL ECHO DETECTED]'
        ),
        createEntry('system', ''),
        createEntryI18n(
          'output',
          'engine.commands.helpers.we_see_you_seeing',
          '                    ...we see you seeing...'
        ),
        createEntry('system', ''),
        createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
        createEntry('system', ''),
      ],
      stateChanges: {
        singularEventsTriggered: new Set([...(state.singularEventsTriggered || []), 'the_echo']),
        sessionStability: state.sessionStability - 15,
        systemHostilityLevel: Math.min((state.systemHostilityLevel || 0) + 2, 5),
      },
      delayMs: 3000,
      triggerFlicker: true,
    }),
  },
  {
    // THE SILENCE - Terminal goes completely silent briefly after accessing admin at high risk
    id: 'the_silence',
    trigger: (state, command, args) => {
      if (state.singularEventsTriggered?.has('the_silence')) return false;
      if (shouldSuppressPressure(state)) return false;
      if (command !== 'cd' && command !== 'ls') return false;
      const path = args[0]?.toLowerCase() || state.currentPath.toLowerCase();
      return (
        path.includes('admin') &&
        state.detectionLevel >= DETECTION_THRESHOLDS.WANDERING_ADMIN &&
        state.flags.adminUnlocked
      );
    },
    execute: state => ({
      output: [
        createEntry('system', ''),
        createEntry('system', ''),
        createEntry('system', ''),
        createEntryI18n('system', 'engine.commands.helpers.text', '            .'),
        createEntry('system', ''),
        createEntry('system', ''),
        createEntry('system', ''),
        createEntryI18n(
          'system',
          'engine.commands.helpers.text_2',
          '                              .'
        ),
        createEntry('system', ''),
        createEntry('system', ''),
        createEntryI18n(
          'warning',
          'engine.commands.helpers.text_3',
          '                                              .'
        ),
        createEntry('system', ''),
        createEntry('system', ''),
        createEntryI18n(
          'error',
          'engine.commands.helpers.session_observation_level_elevated',
          'SESSION OBSERVATION LEVEL: ELEVATED'
        ),
        createEntry('system', ''),
      ],
      stateChanges: {
        singularEventsTriggered: new Set([...(state.singularEventsTriggered || []), 'the_silence']),
        detectionLevel: Math.min(state.detectionLevel + 12, MAX_DETECTION),
        systemHostilityLevel: Math.min((state.systemHostilityLevel || 0) + 1, 5),
      },
      delayMs: 5000,
      triggerFlicker: true,
    }),
  },
  {
    // SECOND VOICE - a delayed, subtle mismatch after psi exposure
    id: 'second_voice',
    trigger: (state, command) => {
      if (state.singularEventsTriggered?.has('second_voice')) return false;
      if (shouldSuppressPressure(state)) return false;
      if (!['status', 'help', 'ls'].includes(command)) return false;
      return (
        state.evidenceCount >= 2 &&
        hasReadPsiMaterial(state) &&
        state.detectionLevel >= DETECTION_THRESHOLDS.STATUS_MED
      );
    },
    execute: state => ({
      output: [
        createEntry('system', ''),
        createEntryI18n(
          'warning',
          'engine.commands.helpers.response_timing_mismatch',
          '[RESPONSE TIMING MISMATCH]'
        ),
        createEntryI18n(
          'output',
          'engine.commands.helpers.reply_buffer_opened_before_command_log_update',
          'Reply buffer opened before command log update.'
        ),
        createEntryI18n(
          'ufo74',
          'engine.commands.helpers.ufo74_if_you_get_a_second_answer_from_this_terminal_dont_ans',
          'UFO74: if you get a second answer from this terminal, dont answer it back.'
        ),
        createEntry('system', ''),
      ],
      stateChanges: {
        singularEventsTriggered: new Set([
          ...(state.singularEventsTriggered || []),
          'second_voice',
        ]),
        paranoiaLevel: Math.min(100, (state.paranoiaLevel || 0) + 12),
      },
      delayMs: 1800,
      triggerFlicker: true,
    }),
  },
  {
    // THE WATCHER ACKNOWLEDGMENT
    id: 'watcher_ack',
    trigger: state => {
      if (state.singularEventsTriggered?.has('watcher_ack')) return false;
      if (shouldSuppressPressure(state)) return false;
      return (
        state.evidenceCount >= 3 && state.detectionLevel >= DETECTION_THRESHOLDS.WANDERING_TRUTHS
      );
    },
    execute: state => ({
      output: [
        createEntry('system', ''),
        createEntry('error', '─────────────────────────────────────────'),
        createEntry('system', ''),
        createEntryI18n(
          'warning',
          'engine.commands.helpers.notice_your_inquiry_has_been_noted',
          'NOTICE: Your inquiry has been noted.'
        ),
        createEntry('system', ''),
        createEntryI18n(
          'output',
          'engine.commands.helpers.pattern_analysis_systematic',
          'Pattern analysis: SYSTEMATIC'
        ),
        createEntryI18n(
          'output',
          'engine.commands.helpers.intent_classification_reconstruction',
          'Intent classification: RECONSTRUCTION'
        ),
        createEntry('system', ''),
        createEntryI18n(
          'warning',
          'engine.commands.helpers.observation_continues',
          'Observation continues.'
        ),
        createEntry('system', ''),
        createEntry('error', '─────────────────────────────────────────'),
        createEntry('system', ''),
      ],
      stateChanges: {
        singularEventsTriggered: new Set([...(state.singularEventsTriggered || []), 'watcher_ack']),
        systemHostilityLevel: Math.min((state.systemHostilityLevel || 0) + 1, 5),
      },
      delayMs: 2500,
      triggerFlicker: true,
    }),
  },
  {
    // RIVAL INVESTIGATOR
    id: 'rival_investigator',
    trigger: state => {
      if (state.singularEventsTriggered?.has('rival_investigator')) return false;
      if (shouldSuppressPressure(state)) return false;
      return (
        (state.evidenceLinks?.length || 0) >= 3 &&
        state.detectionLevel >= DETECTION_THRESHOLDS.WANDERING_EVIDENCE
      );
    },
    execute: state => ({
      output: [
        createEntry('system', ''),
        createEntry('warning', '─────────────────────────────────────────'),
        createEntryI18n(
          'warning',
          'engine.commands.helpers.notice_parallel_investigation_detected',
          'NOTICE: Parallel investigation detected'
        ),
        createEntry('system', ''),
        createEntryI18n(
          'output',
          'engine.commands.helpers.a_competing_analyst_is_pulling_records',
          'A competing analyst is pulling records.'
        ),
        createEntryI18n(
          'output',
          'engine.commands.helpers.chain_of_custody_locks_engaged_on_key_files',
          'Chain-of-custody locks engaged on key files.'
        ),
        createEntry('system', ''),
        createEntryI18n(
          'warning',
          'engine.commands.helpers.maintain_discretion_expect_delays',
          'Maintain discretion. Expect delays.'
        ),
        createEntry('warning', '─────────────────────────────────────────'),
        createEntry('system', ''),
      ],
      stateChanges: {
        singularEventsTriggered: new Set([
          ...(state.singularEventsTriggered || []),
          'rival_investigator',
        ]),
        rivalInvestigatorActive: true,
        systemHostilityLevel: Math.min((state.systemHostilityLevel || 0) + 1, 5),
        paranoiaLevel: Math.min(100, (state.paranoiaLevel || 0) + 20),
      },
      delayMs: 2000,
      triggerFlicker: true,
    }),
  },
];

// Check and trigger singular events
export function checkSingularEvents(
  state: GameState,
  command: string,
  args: string[]
): {
  output: TerminalEntry[];
  stateChanges: Partial<GameState>;
  delayMs?: number;
  triggerFlicker?: boolean;
  triggerTuringTest?: boolean;
} | null {
  for (const event of SINGULAR_EVENTS) {
    if (event.trigger(state, command, args)) {
      return event.execute(state);
    }
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// SYSTEM PERSONALITY DEGRADATION
// ═══════════════════════════════════════════════════════════════════════════

function getHostileSystemMessage(hostilityLevel: number, normalMessage: string): string {
  if (hostilityLevel <= 1) return normalMessage;
  if (hostilityLevel === 2) {
    return normalMessage.replace(/\.$/, '').replace('Use:', 'Command:');
  }
  if (hostilityLevel === 3) {
    if (normalMessage.toLowerCase().includes('tip:')) return '';
    if (normalMessage.toLowerCase().includes('hint:')) return '';
    return normalMessage.replace(/\.$/, '');
  }
  if (hostilityLevel >= 4) {
    if (normalMessage.toLowerCase().includes('tip:')) return '';
    if (normalMessage.toLowerCase().includes('hint:')) return '';
    if (normalMessage.toLowerCase().includes('use:')) return '';
    if (normalMessage.length > 40) return normalMessage.substring(0, 35) + '...';
    return normalMessage;
  }
  return normalMessage;
}

export function applyHostileFiltering(
  entries: TerminalEntry[],
  hostilityLevel: number
): TerminalEntry[] {
  if (hostilityLevel <= 1) return entries;

  return entries
    .map(entry => ({
      ...entry,
      content: getHostileSystemMessage(hostilityLevel, entry.content),
    }))
    .filter(entry => entry.content !== '' || entry.type === 'system');
}

export function calculateHostilityIncrease(state: GameState, command: string): number {
  const baseHostility = state.systemHostilityLevel || 0;

  if (command === 'trace') return 1;
  if (command === 'override') return 2;
  if (state.detectionLevel >= DETECTION_THRESHOLDS.HOSTILITY_HIGH && baseHostility < 4) return 1;
  if (state.detectionLevel >= DETECTION_THRESHOLDS.HOSTILITY_MED && baseHostility < 3) return 1;
  if (state.detectionLevel >= DETECTION_THRESHOLDS.HOSTILITY_LOW && baseHostility < 2) return 1;

  return 0;
}

// ═══════════════════════════════════════════════════════════════════════════
// WANDERING DETECTION
// ═══════════════════════════════════════════════════════════════════════════

function isMeaningfulAction(
  command: string,
  args: string[],
  state: GameState,
  result: { output: TerminalEntry[]; stateChanges: Partial<GameState> }
): boolean {
  if (command === 'open') {
    return true;
  }
  if (command === 'cd' || command === 'ls' || command === 'cat' || command === 'read') {
    return true;
  }
  const updatedEvidenceCount = result.stateChanges.evidenceCount;
  if (
    typeof updatedEvidenceCount === 'number' &&
    updatedEvidenceCount > (state.evidenceCount || 0)
  ) {
    return true;
  }
  if (result.stateChanges.accessLevel && result.stateChanges.accessLevel > state.accessLevel) {
    return true;
  }
  return false;
}

function getWanderingNotice(level: number, state?: GameState): TerminalEntry[] {
  const contextualHints = state ? getContextualExplorationHints(state) : null;

  if (level === 0) {
    const hints: TerminalEntry[] = [
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.ufo74_hey_need_a_hint',
        'UFO74: hey. need a hint?'
      ),
    ];
    if (contextualHints) {
      hints.push(createEntryI18n('ufo74', contextualHints.key, contextualHints.fallback));
    } else {
      hints.push(
        createEntryI18n(
          'ufo74',
          'engine.commands.helpers.ufo74_read_the_files_open_filename',
          'UFO74: READ the files. "open <filename>".'
        )
      );
      hints.push(
        createEntryI18n(
          'ufo74',
          'engine.commands.helpers.theres_a_protocol_doc_in_internal',
          '       theres a protocol doc in /internal/.'
        )
      );
    }
    return hints;
  } else if (level === 1) {
    return [
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.ufo74_look_for_evidence_in',
        'UFO74: look for evidence in:'
      ),
      createEntryI18n(
        'output',
        'engine.commands.helpers.storage_ops_quarantine_comms',
        '       /storage/, /ops/quarantine/, /comms/'
      ),
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.ufo74_the_index_knows_more_than_they_want_you_to_find',
        'UFO74: the index knows more than they want you to find.'
      ),
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.try_search_keyword',
        '       try: search <keyword>'
      ),
    ];
  } else {
    return [
      createEntryI18n('ufo74', 'engine.commands.helpers.ufo74_last_hint', 'UFO74: last hint:'),
      createEntryI18n(
        'output',
        'engine.commands.helpers.1_cd_directory',
        '       1. cd <directory>'
      ),
      createEntryI18n('output', 'engine.commands.helpers.2_ls', '       2. ls'),
      createEntryI18n(
        'output',
        'engine.commands.helpers.3_open_filename',
        '       3. open <filename>'
      ),
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.ufo74_january_96_find_the_pieces',
        'UFO74: january 96. find the pieces.'
      ),
    ];
  }
}

interface ContextualExplorationHint {
  key: string;
  fallback: string;
}

function getContextualExplorationHints(state: GameState): ContextualExplorationHint | null {
  const filesRead = state.filesRead || new Set<string>();
  const truthsCount = state.evidenceCount || 0;
  const prisoner45Used = state.prisoner45QuestionsAsked > 0;

  const readFlags = {
    storage: false,
    comms: false,
    ops: false,
    admin: false,
  };

  for (const filePath of filesRead) {
    if (!readFlags.storage && filePath.includes('/storage/')) readFlags.storage = true;
    if (!readFlags.comms && filePath.includes('/comms/')) readFlags.comms = true;
    if (!readFlags.ops && filePath.includes('/ops/')) readFlags.ops = true;
    if (!readFlags.admin && filePath.includes('/admin/')) readFlags.admin = true;
    if (readFlags.storage && readFlags.comms && readFlags.ops && readFlags.admin) {
      break;
    }
  }

  const {
    storage: hasReadStorage,
    comms: hasReadComms,
    ops: hasReadOps,
    admin: hasReadAdmin,
  } = readFlags;

  if (!hasReadStorage && truthsCount < 1) {
    return {
      key: 'engine.commands.helpers.contextHint.storage',
      fallback: 'UFO74: check /storage/ for transport logs.',
    };
  }
  if (!hasReadOps && truthsCount < 2) {
    return {
      key: 'engine.commands.helpers.contextHint.ops',
      fallback: 'UFO74: /ops/ has quarantine records.',
    };
  }
  if (!hasReadComms && truthsCount < 3) {
    return {
      key: 'engine.commands.helpers.contextHint.comms',
      fallback: 'UFO74: /comms/psi/ has weird signal stuff.',
    };
  }
  if (!prisoner45Used && state.tutorialComplete) {
    return {
      key: 'engine.commands.helpers.contextHint.chat',
      fallback: 'UFO74: try "chat". someones in here.',
    };
  }
  if (!hasReadAdmin && truthsCount >= 2 && state.accessLevel >= 3) {
    return {
      key: 'engine.commands.helpers.contextHint.admin',
      fallback: 'UFO74: you have clearance. check /admin/.',
    };
  }
  return null;
}

export function hasReadPsiMaterial(state: GameState): boolean {
  for (const filePath of state.filesRead || []) {
    const lower = filePath.toLowerCase();
    if (
      lower.includes('/comms/psi/') ||
      lower.includes('transcript') ||
      lower.includes('psi') ||
      lower.includes('neural')
    ) {
      return true;
    }
  }
  return false;
}

export function getObserverStatusLines(state: GameState): string[] {
  const evidCount = state.evidenceCount || 0;
  const psiExposed = hasReadPsiMaterial(state);
  const lines: string[] = [];

  if (psiExposed && evidCount >= 2 && state.detectionLevel >= DETECTION_THRESHOLDS.STATUS_MED) {
    lines.push('  SIGNAL: Residual echo persists in relay buffer.');
    if (state.detectionLevel >= DETECTION_THRESHOLDS.STATUS_HIGH) {
      lines.push('  NOTE: One response arrived before keystroke registration.');
    } else {
      lines.push('  NOTE: Command cadence is being mirrored faintly.');
    }
    return lines;
  }

  if (psiExposed && state.detectionLevel >= DETECTION_THRESHOLDS.STATUS_LOW) {
    lines.push('  SIGNAL: Background carrier present. Source unresolved.');
  }

  if (evidCount >= 3 && state.detectionLevel >= DETECTION_THRESHOLDS.STATUS_HIGH) {
    lines.push('  NOTICE: Query pattern resembles prior containment interviews.');
  }

  return lines;
}

export function checkWanderingState(
  state: GameState,
  command: string,
  args: string[],
  result: { output: TerminalEntry[]; stateChanges: Partial<GameState> }
): { notices: TerminalEntry[]; stateChanges: Partial<GameState> } | null {
  const commandCount = state.sessionCommandCount || 0;
  const lastMeaningful = state.lastMeaningfulAction || 0;
  const wanderingCount = state.wanderingNoticeCount || 0;

  if (commandCount < 15) return null;
  if (wanderingCount >= 3) return null;

  const meaningful = isMeaningfulAction(command, args, state, result);

  if (meaningful) {
    return {
      notices: [],
      stateChanges: {
        lastMeaningfulAction: commandCount,
      },
    };
  }

  const commandsSinceMeaningful = commandCount - lastMeaningful;
  const threshold = 8 + wanderingCount * 5;

  if (commandsSinceMeaningful >= threshold) {
    return {
      notices: getWanderingNotice(Math.min(wanderingCount, 2), state),
      stateChanges: {
        wanderingNoticeCount: wanderingCount + 1,
        lastMeaningfulAction: commandCount,
      },
    };
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// PER-RUN VARIANCE
// ═══════════════════════════════════════════════════════════════════════════

function getCommandDetectionMultiplier(state: GameState, command: string): number {
  const rng = createSeededRng(state.seed + command.charCodeAt(0) * 100);
  const roll = rng();

  if (roll < 0.15) return 1.5;
  if (roll > 0.85) return 0.7;
  return 1.0;
}

export function applyDetectionVariance(
  state: GameState,
  command: string,
  baseIncrease: number
): number {
  const multiplier = getCommandDetectionMultiplier(state, command);
  return Math.floor(baseIncrease * multiplier);
}

// ═══════════════════════════════════════════════════════════════════════════
// WARMUP DETECTION
// ═══════════════════════════════════════════════════════════════════════════

export function getWarmupAdjustedDetection(state: GameState, increase: number): number {
  const filesReadCount = state.filesRead?.size || 0;
  return applyWarmupDetection(state.detectionLevel, increase, filesReadCount);
}

export function isInWarmupPhase(state: GameState): boolean {
  const filesReadCount = state.filesRead?.size || 0;
  return filesReadCount < WARMUP_PHASE.FILES_READ_THRESHOLD;
}

// ═══════════════════════════════════════════════════════════════════════════
// VICTORY CHECK
// ═══════════════════════════════════════════════════════════════════════════

export function checkVictory(state: GameState): boolean {
  return countEvidence(state) >= MAX_EVIDENCE_COUNT;
}

// ═══════════════════════════════════════════════════════════════════════════
// EVIDENCE DISCOVERY
// ═══════════════════════════════════════════════════════════════════════════

export function applyEvidenceDiscovery(
  state: GameState,
  stateChanges: Partial<GameState>,
  filePath: string,
  file: FileNode,
  content: string[] | null,
  notices: TerminalEntry[]
): void {
  if (!content) {
    return;
  }

  const disturbingExpression = getDisturbingContentAvatarExpression(content);
  if (disturbingExpression && !stateChanges.avatarExpression) {
    stateChanges.avatarExpression = disturbingExpression;
  }

  if (!state.tutorialComplete || state.filesRead.has(filePath) || !isEvidenceFile(file)) {
    return;
  }

  const currentCount = countEvidence(state);
  const newCount = Math.min(MAX_EVIDENCE_COUNT, currentCount + 1);

  if (newCount <= currentCount) {
    return;
  }

  stateChanges.evidenceCount = newCount;
  stateChanges.avatarExpression = 'scared';

  // UFO74 reacts to the specific evidence found
  const specificReaction = EVIDENCE_UFO74_REACTIONS[file.name];
  if (specificReaction) {
    notices.push(createEntry('ufo74', `UFO74: ${specificReaction}`));
  } else {
    // Fallback: pick from generic pool, never repeating consecutively
    let idx = Math.floor(Math.random() * GENERIC_EVIDENCE_REACTIONS.length);
    if (idx === lastGenericReactionIndex && GENERIC_EVIDENCE_REACTIONS.length > 1) {
      idx = (idx + 1) % GENERIC_EVIDENCE_REACTIONS.length;
    }
    lastGenericReactionIndex = idx;
    notices.push(createEntry('ufo74', `UFO74: ${GENERIC_EVIDENCE_REACTIONS[idx]}`));
  }

  notices.push(createEntry('system', ''));
  notices.push(
    createEntryI18n(
      'system',
      'engine.commands.helpers.system_recalibrating_attention_momentarily_diverted',
      '[System recalibrating... attention momentarily diverted]'
    )
  );

  if (newCount === 1) {
    if (
      shouldShowTutorialTip(
        'first_evidence',
        state.interactiveTutorialMode,
        state.tutorialTipsShown || new Set()
      )
    ) {
      notices.push(...getTutorialTip('first_evidence'));
      const newTipsShown = new Set(state.tutorialTipsShown || []);
      newTipsShown.add('first_evidence');
      stateChanges.tutorialTipsShown = newTipsShown;
    }
  }
  if (newCount === 2) {
    notices.push(createEntry('notice', ''));
    notices.push(
      createEntryI18n(
        'notice',
        'engine.commands.helpers.system_evidence_archive_updated',
        'SYSTEM: Evidence archive updated.'
      )
    );
  }
  if (newCount === 4) {
    notices.push(createEntry('notice', ''));
    notices.push(
      createEntryI18n(
        'notice',
        'engine.commands.helpers.notice_evidence_count_growing_keep_digging',
        'NOTICE: Evidence count growing. Keep digging.'
      )
    );
  }
  if (newCount === 7) {
    notices.push(createEntry('notice', ''));
    notices.push(
      createEntryI18n(
        'notice',
        'engine.commands.helpers.notice_leak_package_almost_ready',
        'NOTICE: Leak package almost ready.'
      )
    );
  }
  if (newCount === MAX_EVIDENCE_COUNT) {
    notices.push(createEntry('notice', ''));
    notices.push(
      createEntryI18n(
        'notice',
        'engine.commands.helpers.leak_package_ready',
        '▓▓▓ LEAK PACKAGE READY ▓▓▓'
      )
    );
    notices.push(
      ...createUFO74Message([
        'UFO74: ten files logged. leak path is live.',
        '       type: leak',
        '       do it NOW before they cut the connection.',
      ])
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// DECRYPTION HELPER
// ═══════════════════════════════════════════════════════════════════════════

export function performDecryption(
  filePath: string,
  file: FileNode,
  state: GameState
): CommandResult {
  const isFirstDecryption = !state.flags?.firstDecryptionComplete;
  if (isFirstDecryption) {
    saveCheckpoint(state, translateStatic('checkpoint.reason.firstEncryptedFileDecrypted'));
  }

  const mutation: FileMutation = state.fileMutations[filePath] || {
    decrypted: false,
  };
  mutation.decrypted = true;
  const filesRead = new Set(state.filesRead || []);
  filesRead.add(filePath);

  const stateChanges: Partial<GameState> = {
    fileMutations: {
      ...state.fileMutations,
      [filePath]: mutation,
    },
    filesRead,
    detectionLevel: state.detectionLevel + 8,
    sessionStability: state.sessionStability - 5,
    pendingDecryptFile: undefined,
    flags: {
      ...state.flags,
      firstDecryptionComplete: true,
    },
  };

  if (!state.tutorialComplete) {
    delete stateChanges.detectionLevel;
    delete stateChanges.sessionStability;
  }

  if (filePath.includes('neural_dump') || filePath.includes('.psi')) {
    stateChanges.flags = { ...stateChanges.flags, scoutLinkUnlocked: true };
  }

  const content = getFileContent(filePath, { ...state, ...stateChanges } as GameState, true);

  const truthNotices: TerminalEntry[] = [];
  applyEvidenceDiscovery(state, stateChanges, filePath, file, content, truthNotices);

  const output = [
    createEntryI18n(
      'system',
      'engine.commands.helpers.authentication_verified',
      'AUTHENTICATION VERIFIED'
    ),
    createEntry('system', ''),
    createEntryI18n(
      'warning',
      'engine.commands.helpers.warning_partial_recovery_only',
      'WARNING: Partial recovery only'
    ),
    ...createOutputEntries(['', `FILE: ${filePath}`, '']),
    ...createOutputEntries(content || ['[DECRYPTION FAILED]']),
    ...truthNotices,
  ];

  if (filePath.includes('neural_dump') || filePath.includes('.psi')) {
    output.push(createEntry('system', ''));
    output.push(
      createEntryI18n(
        'notice',
        'engine.commands.helpers.notice_neural_pattern_preserved',
        'NOTICE: Neural pattern preserved.'
      )
    );
    output.push(
      createEntryI18n(
        'notice',
        'engine.commands.helpers.notice_remote_link_now_available',
        'NOTICE: Remote link now available.'
      )
    );
    output.push(createEntryI18n('system', 'engine.commands.helpers.use_link', 'Use: link'));
  }

  let imageTrigger: ImageTrigger | undefined = undefined;
  if (file.imageTrigger) {
    const imageId = file.imageTrigger.src;
    const imagesShown = state.imagesShownThisRun || new Set<string>();

    if (!imagesShown.has(imageId)) {
      imageTrigger = file.imageTrigger;
      const newImagesShown = new Set(imagesShown);
      newImagesShown.add(imageId);
      stateChanges.imagesShownThisRun = newImagesShown;
    }
  }

  return {
    output,
    stateChanges,
    triggerFlicker: true,
    delayMs: 2000,
    imageTrigger,
    streamingMode: 'slow' as const,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// UFO74 FILE REACTION SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

function getUFO74TrustLevel(state: GameState): 'trusting' | 'cautious' | 'paranoid' | 'cryptic' {
  const warnings = state.legacyAlertCounter || 0;
  const hostility = state.systemHostilityLevel || 0;
  const detection = state.detectionLevel || 0;

  const riskScore = warnings * 2 + hostility * 3 + Math.floor(detection / 20);

  if (riskScore >= 15) return 'cryptic';
  if (riskScore >= 10) return 'paranoid';
  if (riskScore >= 5) return 'cautious';
  return 'trusting';
}

function getUFO74ConditionalDialogue(state: GameState, filePath: string): TerminalEntry[] | null {
  const truthCount = state.evidenceCount || 0;
  const path = filePath.toLowerCase();

  if (
    truthCount >= 2 &&
    (path.includes('psi') || path.includes('transcript') || path.includes('neural'))
  ) {
    return contextRandomPick(
      state,
      [
        [
          createEntryI18n(
            'ufo74',
            'engine.commands.helpers.ufo74_if_the_terminal_starts_using_your_wording_stop_typing',
            'UFO74: if the terminal starts using your wording, stop typing.'
          ),
        ],
        [
          createEntryI18n(
            'ufo74',
            'engine.commands.helpers.ufo74_dont_mirror_anything_back_from_the_psi_files',
            'UFO74: dont mirror anything back from the psi files.'
          ),
        ],
        [
          createEntryI18n(
            'ufo74',
            'engine.commands.helpers.ufo74_if_another_line_answers_before_i_do_ignore_it',
            'UFO74: if another line answers before i do, ignore it.'
          ),
        ],
      ],
      'ufo74-telepathy-aftershock',
      filePath,
      truthCount
    );
  }

  if (
    truthCount >= 1 &&
    truthCount < 3 &&
    (path.includes('bio') || path.includes('containment') || path.includes('quarantine'))
  ) {
    return [
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.ufo74_telepathy_captured_did_they_choose_this',
        'UFO74: telepathy + captured... did they CHOOSE this?'
      ),
    ];
  }

  if (
    truthCount >= 2 &&
    truthCount < 4 &&
    (path.includes('2026') || path.includes('window') || path.includes('transition'))
  ) {
    return [
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.ufo74_all_countries_agreed_on_2026_bigger_than_politics',
        'UFO74: all countries agreed on 2026? bigger than politics.'
      ),
    ];
  }

  if (
    truthCount >= 1 &&
    truthCount < 3 &&
    (path.includes('autopsy') || path.includes('specimen') || path.includes('bio'))
  ) {
    return [
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.ufo74_ship_pieces_first_now_the_crew_someone_survived',
        'UFO74: ship pieces first, now the CREW. someone survived.'
      ),
    ];
  }

  if (
    truthCount >= 2 &&
    truthCount < 4 &&
    (path.includes('liaison') || path.includes('diplomatic') || path.includes('foreign'))
  ) {
    return [
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.ufo74_captured_alive_then_shared_whos_coordinating_this',
        'UFO74: captured alive, then SHARED? whos coordinating this?'
      ),
    ];
  }

  if (
    truthCount >= 3 &&
    (path.includes('psi') || path.includes('telepat') || path.includes('neural'))
  ) {
    return [
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.ufo74_knew_about_2026_before_reading_minds_or_did_they_tell_',
        'UFO74: knew about 2026 before reading minds? or did THEY tell us?'
      ),
    ];
  }

  if (
    state.evidenceLinks?.length === 1 &&
    !state.singularEventsTriggered?.has('ufo74_first_link')
  ) {
    return [
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.ufo74_connecting_dots_good',
        'UFO74: connecting dots. good.'
      ),
    ];
  }

  if (truthCount >= 4) {
    return [
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.ufo74_almost_there_one_more_piece',
        'UFO74: almost there. one more piece.'
      ),
    ];
  }

  return null;
}

function getUFO74DegradedTrustMessage(
  state: GameState,
  trustLevel: 'cautious' | 'paranoid' | 'cryptic',
  context: string
): TerminalEntry[] {
  if (trustLevel === 'cryptic') {
    const crypticMessages = [
      [
        createEntryI18n(
          'ufo74',
          'engine.commands.helpers.ufo74_walls_listen_find_the_thread',
          'UFO74: walls listen. find the thread.'
        ),
      ],
      [
        createEntryI18n(
          'ufo74',
          'engine.commands.helpers.ufo74_th3y_r3_1ns1d3',
          'UFO74: th3y r3 1ns1d3'
        ),
      ],
      [
        createEntryI18n(
          'ufo74',
          'engine.commands.helpers.ufo74_january_they_took_everything',
          'UFO74: ...january... they took everything...'
        ),
      ],
    ];
    return contextRandomPick(state, crypticMessages, 'ufo74-cryptic-message', context);
  }

  if (trustLevel === 'paranoid') {
    const paranoidMessages = [
      [
        createEntryI18n(
          'ufo74',
          'engine.commands.helpers.ufo74_theyre_scanning_cant_talk',
          'UFO74: theyre scanning. cant talk.'
        ),
      ],
      [createEntryI18n('ufo74', 'engine.commands.helpers.ufo74_be_fast', 'UFO74: be fast.')],
      [
        createEntryI18n(
          'ufo74',
          'engine.commands.helpers.ufo74_every_file_you_open_they_see',
          'UFO74: every file you open, they see.'
        ),
      ],
    ];
    return contextRandomPick(state, paranoidMessages, 'ufo74-paranoid-message', context);
  }

  const cautiousMessages = [
    [
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.ufo74_triggered_some_flags_careful',
        'UFO74: triggered some flags. careful.'
      ),
    ],
    [
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.ufo74_system_suspicious_use_wait',
        'UFO74: system suspicious. use "wait".'
      ),
    ],
  ];
  return contextRandomPick(state, cautiousMessages, 'ufo74-cautious-message', context);
}

function getUFO74ContentReaction(state: GameState, filePath: string): TerminalEntry[] {
  const path = filePath.toLowerCase();

  if (path.includes('autopsy') || path.includes('medical')) {
    return [
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.ufo74_autopsy_report_not_human',
        'UFO74: autopsy report. not human.'
      ),
    ];
  }
  if (path.includes('transport') || path.includes('logistics') || path.includes('manifest')) {
    return [
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.ufo74_transport_log_they_split_up_the_evidence',
        'UFO74: transport log. they split up the evidence.'
      ),
    ];
  }
  if (path.includes('transcript') || path.includes('psi') || path.includes('neural')) {
    return [
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.ufo74_they_were_communicating_telepathically',
        'UFO74: they were communicating. telepathically.'
      ),
    ];
  }
  if (path.includes('/comms/intercepts/')) {
    return [
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.ufo74_routine_intercepts_signal_in_the_noise',
        'UFO74: routine intercepts. signal in the noise.'
      ),
    ];
  }
  if (path.includes('foreign') || path.includes('liaison') || path.includes('international')) {
    return [
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.ufo74_other_countries_involved_coordinated_cover_up',
        'UFO74: other countries involved. coordinated cover-up.'
      ),
    ];
  }
  if (
    path.includes('2026') ||
    path.includes('window') ||
    path.includes('transition') ||
    path.includes('threat')
  ) {
    return [
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.ufo74_2026_something_coming_thats_why_they_buried_it',
        'UFO74: 2026. something coming. thats why they buried it.'
      ),
    ];
  }
  if (path.includes('bio') || path.includes('containment') || path.includes('quarantine')) {
    return [
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.ufo74_containment_they_captured_them',
        'UFO74: containment. they captured them.'
      ),
    ];
  }
  if (
    path.includes('crash') ||
    path.includes('debris') ||
    path.includes('material') ||
    path.includes('sample')
  ) {
    return [
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.ufo74_physical_evidence_smoking_gun',
        'UFO74: physical evidence. smoking gun.'
      ),
    ];
  }
  if (path.includes('balloon') || path.includes('drone') || path.includes('aircraft_incident')) {
    return [
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.ufo74_cover_story_the_real_material_is_buried_deeper',
        'UFO74: cover story. the real material is buried deeper.'
      ),
    ];
  }
  if (path.includes('morse_intercept')) {
    return [
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.ufo74_morse_code_decipher_it',
        'UFO74: morse code. decipher it.'
      ),
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.might_be_the_override_passphrase',
        '       might be the override passphrase.'
      ),
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.use_message_answer',
        '       use: message <answer>'
      ),
    ];
  }

  const defaultReactions = [
    [
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.ufo74_interesting_keep_digging',
        'UFO74: interesting. keep digging.'
      ),
    ],
    [
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.ufo74_good_every_file_matters',
        'UFO74: good. every file matters.'
      ),
    ],
    [
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.ufo74_noted_try_ops_storage_comms',
        'UFO74: noted. try /ops, /storage, /comms.'
      ),
    ],
  ];

  return contextRandomPick(state, defaultReactions, 'ufo74-default-reaction', filePath);
}

function getUFO74FileReaction(
  filePath: string,
  state: GameState,
  isEncryptedAndLocked?: boolean,
  isFirstUnstable?: boolean
): TerminalEntry[] | null {
  const truthCount = state.evidenceCount || 0;
  const messageCount = state.incognitoMessageCount || 0;

  if (messageCount >= 12) return null;

  const trustLevel = getUFO74TrustLevel(state);

  const isGettingParanoid = truthCount >= 3 || messageCount >= 6;
  const isAboutToFlee = truthCount >= 4 || messageCount >= 9;
  const isFinalMessage = messageCount === 11;

  let messages: TerminalEntry[] = [];

  if (
    (trustLevel === 'cryptic' || trustLevel === 'paranoid') &&
    contextChance(
      state,
      0.5,
      'ufo74-degraded-trust',
      trustLevel,
      filePath,
      messageCount,
      truthCount
    )
  ) {
    messages = getUFO74DegradedTrustMessage(state, trustLevel, filePath);
    return messages;
  }

  const conditionalDialogue = getUFO74ConditionalDialogue(state, filePath);
  if (
    conditionalDialogue &&
    contextChance(state, 0.6, 'ufo74-conditional-dialogue', filePath, messageCount, truthCount)
  ) {
    return conditionalDialogue;
  }

  if (isFirstUnstable) {
    messages = [
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.ufo74_messy_copy_but_it_should_still_read_clean_enough',
        'UFO74: messy copy, but it should still read clean enough.'
      ),
    ];
  } else if (isEncryptedAndLocked) {
    const encryptedMessages = [
      [
        createEntryI18n(
          'ufo74',
          'engine.commands.helpers.ufo74_old_wrapper_on_this_file_readable_layer_is_still_intac',
          'UFO74: old wrapper on this file. readable layer is still intact.'
        ),
      ],
      [
        createEntryI18n(
          'ufo74',
          'engine.commands.helpers.ufo74_legacy_encryption_tag_just_keep_reading_closely',
          'UFO74: legacy encryption tag. just keep reading closely.'
        ),
      ],
      [
        createEntryI18n(
          'ufo74',
          'engine.commands.helpers.ufo74_noisy_shell_but_the_evidence_is_still_there',
          'UFO74: noisy shell, but the evidence is still there.'
        ),
      ],
    ];
    messages = contextRandomPick(
      state,
      encryptedMessages,
      'ufo74-encrypted-message',
      filePath,
      messageCount,
      truthCount
    );
  } else if (isFinalMessage) {
    messages = [
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.ufo74_someones_at_my_door',
        'UFO74: someones at my door.'
      ),
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.not_police_they_dont_knock_like_that',
        '       not police. they dont knock like that.'
      ),
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.ufo74_tell_everyone_what_you_found',
        'UFO74: tell everyone what you found.'
      ),
      createEntryI18n(
        'ufo74',
        'engine.commands.helpers.goodbye_hackerkid',
        '       goodbye hackerkid.'
      ),
    ];
  } else if (isAboutToFlee) {
    const fleeMessages = [
      [
        createEntryI18n(
          'ufo74',
          'engine.commands.helpers.ufo74_hearing_noises_stay_alert',
          'UFO74: hearing noises. stay alert.'
        ),
      ],
      [
        createEntryI18n(
          'ufo74',
          'engine.commands.helpers.ufo74_my_connection_dropped_footsteps_upstairs',
          'UFO74: my connection dropped. footsteps upstairs.'
        ),
        createEntryI18n('ufo74', 'engine.commands.helpers.i_live_alone', '       i live alone.'),
      ],
      [
        createEntryI18n(
          'ufo74',
          'engine.commands.helpers.ufo74_van_outside_finish_fast',
          'UFO74: van outside. finish fast.'
        ),
      ],
    ];
    messages = contextRandomPick(
      state,
      fleeMessages,
      'ufo74-flee-message',
      filePath,
      messageCount,
      truthCount
    );
  } else if (isGettingParanoid) {
    const nervousMessages = [
      [
        createEntryI18n(
          'ufo74',
          'engine.commands.helpers.ufo74_youre_deep_now_its_real',
          'UFO74: youre deep now. its real.'
        ),
      ],
      [
        createEntryI18n(
          'ufo74',
          'engine.commands.helpers.ufo74_be_careful_with_this_info',
          'UFO74: be careful with this info.'
        ),
      ],
    ];
    messages = contextRandomPick(
      state,
      nervousMessages,
      'ufo74-nervous-message',
      filePath,
      messageCount,
      truthCount
    );
  } else {
    messages = getUFO74ContentReaction(state, filePath);
  }

  return messages;
}

function getUFO74NoticeExplanation(notices: TerminalEntry[]): TerminalEntry[] | null {
  const noticeTexts = notices
    .filter(
      n =>
        n.content.includes('NOTICE:') ||
        n.content.includes('MEMO FLAG:') ||
        n.content.includes('SYSTEM:')
    )
    .map(n => n.content);

  if (noticeTexts.length === 0) return null;

  const explanations: TerminalEntry[] = [
    createEntry('system', ''),
    createEntryI18n('warning', 'engine.commands.helpers.ufo74', '>> UFO74 <<'),
    createEntry('system', ''),
  ];

  for (const notice of noticeTexts) {
    if (
      notice.includes('Physical evidence') ||
      notice.includes('Asset chain') ||
      notice.includes('Relocation')
    ) {
      explanations.push(
        createEntryI18n(
          'ufo74',
          'engine.commands.helpers.ufo74_physical_debris_confirmed',
          'UFO74: physical debris confirmed.'
        )
      );
      break;
    }
    if (
      notice.includes('Bio-material') ||
      notice.includes('Specimen') ||
      notice.includes('Containment')
    ) {
      explanations.push(
        createEntryI18n(
          'ufo74',
          'engine.commands.helpers.ufo74_bio_specimens_confirmed',
          'UFO74: bio specimens confirmed.'
        )
      );
      break;
    }
    if (
      notice.includes('Multi-lateral') ||
      notice.includes('Foreign') ||
      notice.includes('External')
    ) {
      explanations.push(
        createEntryI18n(
          'ufo74',
          'engine.commands.helpers.ufo74_international_involvement',
          'UFO74: international involvement.'
        )
      );
      break;
    }
    if (
      notice.includes('Contextual model') ||
      notice.includes('Signal') ||
      notice.includes('Communication')
    ) {
      explanations.push(
        createEntryI18n(
          'ufo74',
          'engine.commands.helpers.ufo74_communication_evidence',
          'UFO74: communication evidence.'
        )
      );
      break;
    }
    if (
      notice.includes('Temporal') ||
      notice.includes('Transition') ||
      notice.includes('Chronological')
    ) {
      explanations.push(
        createEntryI18n(
          'ufo74',
          'engine.commands.helpers.ufo74_2026_timeline',
          'UFO74: 2026 timeline.'
        )
      );
      break;
    }
    if (notice.includes('Independent verification') || notice.includes('verification')) {
      explanations.push(
        createEntryI18n(
          'ufo74',
          'engine.commands.helpers.ufo74_two_pieces_confirm_each_other',
          'UFO74: two pieces confirm each other.'
        )
      );
      break;
    }
    if (notice.includes('Sufficient documentation') || notice.includes('threshold')) {
      explanations.push(
        createEntryI18n(
          'ufo74',
          'engine.commands.helpers.ufo74_almost_there',
          'UFO74: almost there.'
        )
      );
      break;
    }
  }

  explanations.push(createEntry('system', ''));

  return explanations;
}

export function getIncognitoMessage(
  state: GameState,
  filePath?: string,
  notices?: TerminalEntry[],
  isEncryptedAndLocked?: boolean,
  isFirstUnstable?: boolean
): TerminalEntry[] | null {
  if ((state.incognitoMessageCount || 0) >= 12) return null;

  const now = Date.now();
  if (state.lastIncognitoTrigger && now - state.lastIncognitoTrigger < 15000) return null;

  const isTruthDiscovery =
    notices &&
    notices.some(
      n =>
        n.content.includes('TRUTH FRAGMENT') ||
        n.content.includes('EVIDENCE') ||
        n.content.includes('discovered')
    );

  if (!isTruthDiscovery && !isFirstUnstable) {
    if (!contextChance(state, 0.2, 'ufo74-react-to-open', filePath || '', notices?.length || 0)) {
      return null;
    }
  }

  if (notices && notices.length > 0 && !isEncryptedAndLocked && !isFirstUnstable) {
    const explanation = getUFO74NoticeExplanation(notices);
    if (explanation) return explanation;
  }

  if (filePath) {
    if (
      isEncryptedAndLocked ||
      isFirstUnstable ||
      contextChance(state, 0.7, 'ufo74-file-comment', filePath, notices?.length || 0)
    ) {
      return getUFO74FileReaction(filePath, state, isEncryptedAndLocked, isFirstUnstable);
    }
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// ARCHIVE MODE HELPERS
// ═══════════════════════════════════════════════════════════════════════════

export function isArchiveOnlyFile(filePath: string): boolean {
  return filePath in ARCHIVE_FILES;
}
