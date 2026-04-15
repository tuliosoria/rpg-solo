// Tutorial and boot sequence messages for Terminal 1996

import { TerminalEntry } from '../../types';
import { createEntry, createEntryI18n } from './utils';

type TutorialMessageLine = {
  kind: 'system' | 'ufo74';
  fallback: string;
  key?: string;
};

type TutorialTipLine = {
  fallback: string;
  key?: string;
};

// Tutorial messages from UFO74 - shown one at a time
// Design: explicit early steps, diegetic, natural hacker briefing flow
export const TUTORIAL_MESSAGES: TutorialMessageLine[][] = [
  [
    {
      kind: 'ufo74',
      key: 'engine.commands.tutorial.message.0.line1',
      fallback: 'UFO74: youre in. keep it quiet.',
    },
  ],
  [
    {
      kind: 'ufo74',
      key: 'engine.commands.tutorial.message.1.line1',
      fallback: 'UFO74: quick brief. you cant change anything here — read only.',
    },
  ],
  [
    {
      kind: 'ufo74',
      key: 'engine.commands.tutorial.message.2.line1',
      fallback: 'UFO74: type "ls" to see whats in front of you.',
    },
  ],
  [
    {
      kind: 'ufo74',
      key: 'engine.commands.tutorial.message.3.line1',
      fallback: 'UFO74: type "cd <folder>" to go inside. "open <file>" to read.',
    },
  ],
  [
    {
      kind: 'ufo74',
      key: 'engine.commands.tutorial.message.4.line1',
      fallback: 'UFO74: when this channel closes, start with: ls',
    },
  ],
  [
    {
      kind: 'ufo74',
      key: 'engine.commands.tutorial.message.5.line1',
      fallback: 'UFO74: try internal/ first. routine paperwork. low heat.',
    },
  ],
  [
    {
      kind: 'ufo74',
      key: 'engine.commands.tutorial.message.6.line1',
      fallback: 'UFO74: youll see an evidence tracker. it lights up when you prove something.',
    },
  ],
  [
    {
      kind: 'ufo74',
      key: 'engine.commands.tutorial.message.7.line1',
      fallback:
        'UFO74: risk meter climbs as you dig. if it spikes, they test you. fail that, youre out.',
    },
  ],
  [
    {
      kind: 'ufo74',
      key: 'engine.commands.tutorial.message.8.line1',
      fallback: 'UFO74: im cutting the link. from here, youre on your own.',
    },
    {
      kind: 'ufo74',
      key: 'engine.commands.tutorial.message.8.line2',
      fallback: '       move slow. read everything. the truth is in the details.',
    },
  ],
  [
    { kind: 'system', fallback: '' },
    {
      kind: 'system',
      key: 'engine.commands.tutorial.message.9.line2',
      fallback: 'Type "help" for commands. "help basics" if youre new.',
    },
  ],
];

// Boot sequence for new game (without UFO74 tutorial)
export function generateBootSequence(): TerminalEntry[] {
  return [
    createEntry('system', ''),
    createEntry('system', '═══════════════════════════════════════════════════════════'),
    createEntryI18n(
      'system',
      'engine.commands.interactiveTutorial.brazilian_intelligence_legacy_system',
      'BRAZILIAN INTELLIGENCE LEGACY SYSTEM'
    ),
    createEntryI18n(
      'system',
      'engine.commands.interactiveTutorial.terminal_access_point_node_7',
      'TERMINAL ACCESS POINT — NODE 7'
    ),
    createEntry('system', '═══════════════════════════════════════════════════════════'),
    createEntry('system', ''),
    createEntryI18n(
      'system',
      'engine.commands.interactiveTutorial.system_date_january_1996',
      'SYSTEM DATE: JANUARY 1996'
    ),
    createEntry('system', ''),
    createEntryI18n(
      'warning',
      'engine.commands.tutorial.warning_unauthorized_access_detected',
      'WARNING: Unauthorized access detected'
    ),
    createEntryI18n(
      'warning',
      'engine.commands.tutorial.warning_session_logging_enabled',
      'WARNING: Session logging enabled'
    ),
    createEntry('system', ''),
    createEntryI18n(
      'system',
      'engine.commands.tutorial.incident_related_archive',
      'INCIDENT-RELATED ARCHIVE'
    ),
    createEntryI18n(
      'warning',
      'engine.commands.tutorial.warning_partial_access_may_result_in_incomplete_conclusions',
      'WARNING: Partial access may result in incomplete conclusions.'
    ),
    createEntry('system', ''),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// FIRST-RUN DETECTION - Gentle nudge for new players
// ═══════════════════════════════════════════════════════════════════════════

export function getFirstRunMessage(): TerminalEntry[] {
  return [
    createEntry('system', ''),
    createEntryI18n(
      'ufo74',
      'engine.commands.tutorial.ufo74_new_here_type_help_basics',
      'UFO74: new here? type "help basics".'
    ),
    createEntry('system', ''),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// INTERACTIVE TUTORIAL MODE - Opt-in tips during gameplay
// ═══════════════════════════════════════════════════════════════════════════

// Tutorial tip IDs
export type TutorialTipId = 'first_evidence';

// Helper to create boxed tutorial tips
function createTutorialTipBox(lines: TutorialTipLine[]): TerminalEntry[] {
  const width = 43;
  const entries: TerminalEntry[] = [
    createEntry('system', ''),
    createEntry('notice', '╔' + '═'.repeat(width) + '╗'),
    createEntry('notice', '║  💡 TUTORIAL TIP' + ' '.repeat(width - 17) + '║'),
  ];

  for (const line of lines) {
    const paddedLine = '  ' + line.fallback;
    const padding = Math.max(0, width - paddedLine.length);
    const content = '║' + paddedLine + ' '.repeat(padding) + '║';
    entries.push(
      line.key ? createEntryI18n('notice', line.key, content) : createEntry('notice', content)
    );
  }

  entries.push(createEntry('notice', '╚' + '═'.repeat(width) + '╝'));
  entries.push(createEntry('system', ''));

  return entries;
}

// Tutorial tips content
export const TUTORIAL_TIPS: Record<TutorialTipId, TutorialTipLine[]> = {
  first_evidence: [
    {
      key: 'engine.commands.tutorial.tip.first_evidence.line1',
      fallback: 'Evidence updated.',
    },
    { fallback: '' },
    {
      key: 'engine.commands.tutorial.tip.first_evidence.line3',
      fallback: 'Use "progress" if you want a clean recap.',
    },
    {
      key: 'engine.commands.tutorial.tip.first_evidence.line4',
      fallback: 'Save 10 files to unlock the leak.',
    },
  ],
};

// Get a tutorial tip as formatted terminal entries
export function getTutorialTip(tipId: TutorialTipId): TerminalEntry[] {
  const lines = TUTORIAL_TIPS[tipId];
  if (!lines) return [];
  return createTutorialTipBox(lines);
}

// Check if a tutorial tip should be shown
export function shouldShowTutorialTip(
  tipId: TutorialTipId,
  tutorialMode: boolean,
  tipsShown: Set<string>
): boolean {
  if (!tutorialMode) return false;
  if (tipsShown.has(tipId)) return false;
  return true;
}

// ═══════════════════════════════════════════════════════════════════════════
// ENHANCED HELP COMMANDS - Detailed guides for new players
// ═══════════════════════════════════════════════════════════════════════════

export function getHelpBasics(): TerminalEntry[] {
  return [
    createEntry('system', ''),
    createEntry('output', '═══════════════════════════════════════════════'),
    createEntryI18n('output', 'engine.commands.tutorial.b_a_s_i_c_s', '  B A S I C S'),
    createEntry('output', '═══════════════════════════════════════════════'),
    createEntry('system', ''),
    createEntryI18n('output', 'engine.commands.tutorial.navigation', '  NAVIGATION'),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.ls_list_files_in_current_directory',
      '  ls              List files in current directory'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.cd_dir_change_directory',
      '  cd <dir>        Change directory'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.cd_go_back_one_level',
      '  cd ..           Go back one level'
    ),
    createEntry('system', ''),
    createEntryI18n('output', 'engine.commands.tutorial.reading', '  READING'),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.open_file_read_a_file_s_contents',
      "  open <file>     Read a file's contents"
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.last_re_read_last_opened_file',
      '  last            Re-read last opened file'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.search_term_scan_accessible_files_and_text',
      '  search <term>   Scan accessible files and text'
    ),
    createEntry('system', ''),
    createEntryI18n('output', 'engine.commands.tutorial.tracking', '  TRACKING'),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.note_text_save_a_personal_note',
      '  note <text>     Save a personal note'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.notes_view_all_your_notes',
      '  notes           View all your notes'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.bookmark_file_bookmark_a_file_for_later',
      '  bookmark <file> Bookmark a file for later'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.progress_review_case_summary',
      '  progress        Review your case summary'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.save_file_save_to_dossier',
      '  save <file>     Save a file to your dossier'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.unsave_file_remove_from_dossier',
      '  unsave <file>   Remove a file from your dossier'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.unread_list_files_you_have_not_opened',
      '  unread          List files you have not opened'
    ),
    createEntry('system', ''),
    createEntryI18n('output', 'engine.commands.tutorial.status', '  STATUS'),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.help_show_all_commands',
      '  help            Show all commands'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.status_check_risk_and_session_pressure',
      '  status          Check risk and session pressure'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.wait_lower_risk_briefly_limited_uses',
      '  wait            Lower risk briefly (limited uses)'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.help_recovery_learn_the_emergency_recovery_options',
      '  help recovery   Learn the emergency recovery options'
    ),
    createEntry('system', ''),
  ];
}

export function getHelpEvidence(): TerminalEntry[] {
  return [
    createEntry('system', ''),
    createEntry('output', '═══════════════════════════════════════════════'),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.e_v_i_d_e_n_c_e_s_y_s_t_e_m',
      '  D O S S I E R   W O R K F L O W'
    ),
    createEntry('output', '═══════════════════════════════════════════════'),
    createEntry('system', ''),
    createEntryI18n('output', 'engine.commands.tutorial.objective', '  OBJECTIVE'),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.collect_10_evidence_files_to_expose_5_truths',
      '  Save 10 files that expose 5 core truths:'
    ),
    createEntry('system', ''),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.1_debris_relocation',
      '  1. Debris Relocation'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.2_being_containment',
      '  2. Being Containment'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.3_telepathic_scouts',
      '  3. Telepathic Scouts'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.4_international_actors',
      '  4. International Actors'
    ),
    createEntryI18n('output', 'engine.commands.tutorial.5_transition_2026', '  5. Transition 2026'),
    createEntry('system', ''),
    createEntry('output', '  ─────────────────────────────────────────────'),
    createEntry('system', ''),
    createEntryI18n('output', 'engine.commands.tutorial.evidence_workflow', '  DOSSIER WORKFLOW:'),
    createEntry('system', ''),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.1_navigate_directories_with_ls_cd',
      '  1. Navigate directories with ls, cd'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.2_read_files_with_open_filename',
      '  2. Read files with open <filename>'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.3_watch_the_header_counter_update',
      '  3. Save the strongest files with save <filename>'
    ),
    createEntry('system', ''),
    createEntry('output', '  ─────────────────────────────────────────────'),
    createEntry('system', ''),
    createEntryI18n('output', 'engine.commands.tutorial.winning', '  WINNING:'),
    createEntry('system', ''),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.reach_10_of_10_evidence',
      '  • Reach 10/10 saved files'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.use_leak_to_transmit_the_evidence',
      '  • Use "leak" to transmit the dossier'
    ),
    createEntry('system', ''),
  ];
}

export function getHelpWinning(): TerminalEntry[] {
  return [
    createEntry('system', ''),
    createEntry('output', '═══════════════════════════════════════════════'),
    createEntryI18n('output', 'engine.commands.tutorial.h_o_w_t_o_w_i_n', '  H O W   T O   W I N'),
    createEntry('output', '═══════════════════════════════════════════════'),
    createEntry('system', ''),
    createEntryI18n('output', 'engine.commands.tutorial.objective', '  OBJECTIVE'),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.collect_10_evidence_files_to_expose_5_truths',
      '  Save 10 files that expose 5 core truths:'
    ),
    createEntry('system', ''),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.1_debris_relocation',
      '  1. Debris Relocation'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.2_being_containment',
      '  2. Being Containment'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.3_telepathic_scouts',
      '  3. Telepathic Scouts'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.4_international_actors',
      '  4. International Actors'
    ),
    createEntryI18n('output', 'engine.commands.tutorial.5_transition_2026', '  5. Transition 2026'),
    createEntry('system', ''),
    createEntry('output', '  ─────────────────────────────────────────────'),
    createEntry('system', ''),
    createEntryI18n('output', 'engine.commands.tutorial.strategy', '  STRATEGY'),
    createEntry('system', ''),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.read_carefully_evidence_is_in_the_details',
      '  • Read carefully - the case is in the details'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.use_note_to_track_important_details',
      '  • Use "note" to track important details'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.watch_your_detection_level',
      '  • Watch your detection level!'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.if_risk_spikes_use_wait_to_buy_time',
      '  • If risk spikes, use "wait" to buy time'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.at_90_risk_hide_becomes_a_one_time_escape',
      '  • At 90% risk, "hide" becomes a one-time escape'
    ),
    createEntry('system', ''),
    createEntry('output', '  ─────────────────────────────────────────────'),
    createEntry('system', ''),
    createEntryI18n('output', 'engine.commands.tutorial.commands_to_know', '  COMMANDS TO KNOW'),
    createEntry('system', ''),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.note_text_save_personal_notes',
      '  note <text>      Save personal notes'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.bookmark_file_mark_files_for_later',
      '  bookmark <file>  Mark files for later'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.save_file_add_a_file_to_the_dossier',
      '  save <file>      Add a file to the dossier'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.search_term_scan_accessible_files_and_text',
      '  search <term>   Scan accessible files and text'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.progress_review_case_summary',
      '  progress        Review your case summary'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.unread_list_files_you_have_not_opened',
      '  unread          List files you have not opened'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.leak_transmit_the_finished_dossier',
      '  leak            Transmit the finished dossier'
    ),
    createEntry('system', ''),
  ];
}

export function getHelpRecovery(): TerminalEntry[] {
  return [
    createEntry('system', ''),
    createEntry('output', '═══════════════════════════════════════════════'),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.r_e_c_o_v_e_r_y_s_t_e_a_l_t_h',
      '  R E C O V E R Y   &   S T E A L T H'
    ),
    createEntry('output', '═══════════════════════════════════════════════'),
    createEntry('system', ''),
    createEntryI18n('output', 'engine.commands.tutorial.wait', '  wait'),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.lowers_detection_for_a_moment',
      '    Lowers detection for a moment.'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.limited_to_3_uses_per_run',
      '    Limited to 3 uses per run.'
    ),
    createEntry('system', ''),
    createEntryI18n('output', 'engine.commands.tutorial.hide', '  hide'),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.unlocks_automatically_at_90_risk',
      '    Unlocks automatically at 90% risk.'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.gives_you_one_emergency_escape_but_hurts_stability',
      '    Gives you one emergency escape, but hurts stability.'
    ),
    createEntry('system', ''),
    createEntryI18n('output', 'engine.commands.tutorial.status_2', '  status'),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.shows_your_current_pressure_and_available_recovery_options',
      '    Shows your current pressure and available recovery options.'
    ),
    createEntry('system', ''),
    createEntryI18n('output', 'engine.commands.tutorial.rule_of_thumb', '  RULE OF THUMB'),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.if_the_tracker_turns_red_slow_down_and_recover_before_diggin',
      '    If the tracker turns red, slow down and recover before digging deeper.'
    ),
    createEntryI18n(
      'output',
      'engine.commands.tutorial.if_the_terminal_replies_too_early_stop_and_wait_it_out',
      '    If the terminal replies too early, stop and wait it out.'
    ),
    createEntry('system', ''),
  ];
}

// Convert tutorial message to entries
export function getTutorialMessage(step: number): TerminalEntry[] {
  if (step < 0 || step >= TUTORIAL_MESSAGES.length) {
    return [];
  }

  const messages = TUTORIAL_MESSAGES[step];
  const entries: TerminalEntry[] = [createEntry('system', '')];

  for (const message of messages) {
    if (message.key) {
      entries.push(createEntryI18n(message.kind, message.key, message.fallback));
      continue;
    }

    entries.push(createEntry(message.kind, message.fallback));
  }

  // Add blank line after each step (enter prompt is now handled by UI)
  entries.push(createEntry('system', ''));

  return entries;
}
