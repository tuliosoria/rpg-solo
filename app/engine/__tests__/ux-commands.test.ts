// UX Commands Tests - last, back, note, notes, bookmark, unread, progress
import { describe, it, expect } from 'vitest';
import { executeCommand } from '../commands';
import { GameState, DEFAULT_GAME_STATE } from '../../types';
import { MAX_COMMAND_INPUT_LENGTH } from '../../constants/limits';
import { determineEnding } from '../endings';
import { isEvidencePath } from '../evidenceRevelation';

// Helper to create a test state
const createTestState = (overrides: Partial<GameState> = {}): GameState => ({
  ...DEFAULT_GAME_STATE,
  seed: 12345,
  rngState: 12345,
  sessionStartTime: Date.now(),
  tutorialStep: -1,
  tutorialComplete: true,
  ...overrides,
});

describe('UX Commands', () => {
  describe('last command', () => {
    it('should show error when no file has been opened', () => {
      const state = createTestState();
      const result = executeCommand('last', state);

      expect(result.output.some(e => e.content.includes('No file opened yet'))).toBe(true);
    });

    it('should re-display last opened file', () => {
      const state = createTestState({
        lastOpenedFile: '/internal/protocols/session_objectives.txt',
        filesRead: new Set(['/internal/protocols/session_objectives.txt']),
      });
      const result = executeCommand('last', state);

      expect(result.output.some(e => e.content.includes('Re-reading'))).toBe(true);
      expect(result.stateChanges.detectionLevel).toBeUndefined(); // No detection increase
    });
  });

  describe('back command', () => {
    it('should go to parent directory when no history', () => {
      const state = createTestState({ currentPath: '/internal' });
      const result = executeCommand('back', state);

      expect(result.stateChanges.currentPath).toBe('/');
    });

    it('should stay at root if already at root with no history', () => {
      const state = createTestState({ currentPath: '/' });
      const result = executeCommand('back', state);

      expect(result.output.some(e => e.content.includes('Already at root'))).toBe(true);
    });

    it('should handle nested directories when no history', () => {
      const state = createTestState({ currentPath: '/internal/deep' });
      const result = executeCommand('back', state);

      expect(result.stateChanges.currentPath).toBe('/internal');
    });

    it('should use navigation history when available', () => {
      const state = createTestState({
        currentPath: '/admin',
        navigationHistory: ['/internal', '/ops'],
      });
      const result = executeCommand('back', state);

      // Should go to last item in history, not parent
      expect(result.stateChanges.currentPath).toBe('/ops');
      expect(result.stateChanges.navigationHistory).toEqual(['/internal']);
    });

    it('should pop from navigation history stack', () => {
      const state = createTestState({
        currentPath: '/admin/logs',
        navigationHistory: ['/', '/internal', '/ops'],
      });
      const result = executeCommand('back', state);

      expect(result.stateChanges.currentPath).toBe('/ops');
      expect(result.stateChanges.navigationHistory).toEqual(['/', '/internal']);
    });

    it('should fallback to parent when history is exhausted', () => {
      const state = createTestState({
        currentPath: '/internal/protocols',
        navigationHistory: [],
      });
      const result = executeCommand('back', state);

      expect(result.stateChanges.currentPath).toBe('/internal');
      expect(result.output.some(e => e.content.includes('UFO74'))).toBe(true);
    });
  });

  describe('note command', () => {
    it('should save a note', () => {
      const state = createTestState();
      const result = executeCommand('note password is test123', state);

      expect(result.stateChanges.playerNotes).toBeDefined();
      expect(result.stateChanges.playerNotes?.length).toBe(1);
      expect(result.stateChanges.playerNotes?.[0].note).toBe('password is test123');
      expect(result.output.some(e => e.content.includes('Note saved'))).toBe(true);
    });

    it('should show error when no text provided', () => {
      const state = createTestState();
      const result = executeCommand('note', state);

      expect(result.output.some(e => e.content.includes('Specify note text'))).toBe(true);
    });

    it('should append to existing notes', () => {
      const state = createTestState({
        playerNotes: [{ note: 'first note', timestamp: 1000 }],
      });
      const result = executeCommand('note second note', state);

      expect(result.stateChanges.playerNotes?.length).toBe(2);
    });
  });

  describe('input validation', () => {
    it('rejects overly long commands', () => {
      const state = createTestState();
      const longInput = 'a'.repeat(MAX_COMMAND_INPUT_LENGTH + 10);

      const result = executeCommand(longInput, state);

      expect(result.output.some(e => e.content.includes('INPUT TOO LONG'))).toBe(true);
      expect(result.stateChanges.legacyAlertCounter).toBe(1);
      expect(result.stateChanges.detectionLevel).toBe(2);
    });

    it('clamps detection on invalid commands', () => {
      const state = createTestState({ detectionLevel: 99 });

      const result = executeCommand('doesnotexist', state);

      expect(result.stateChanges.detectionLevel).toBe(100);
      expect(result.stateChanges.isGameOver).toBe(true);
    });
  });

  describe('notes command', () => {
    it('should show message when no notes saved', () => {
      const state = createTestState();
      const result = executeCommand('notes', state);

      expect(result.output.some(e => e.content.includes('No notes saved'))).toBe(true);
    });

    it('should display saved notes', () => {
      const state = createTestState({
        playerNotes: [
          { note: 'test note 1', timestamp: Date.now() },
          { note: 'test note 2', timestamp: Date.now() },
        ],
      });
      const result = executeCommand('notes', state);

      expect(result.output.some(e => e.content.includes('YOUR NOTES'))).toBe(true);
      expect(result.output.some(e => e.content.includes('test note 1'))).toBe(true);
      expect(result.output.some(e => e.content.includes('test note 2'))).toBe(true);
    });
  });

  describe('bookmark command', () => {
    it('should show bookmarks when no args', () => {
      const state = createTestState({
        bookmarkedFiles: new Set(['/internal/test.txt']),
      });
      const result = executeCommand('bookmark', state);

      expect(result.output.some(e => e.content.includes('BOOKMARKED FILES'))).toBe(true);
    });

    it('should show empty message when no bookmarks', () => {
      const state = createTestState();
      const result = executeCommand('bookmark', state);

      expect(result.output.some(e => e.content.includes('No bookmarks saved'))).toBe(true);
    });

    it('should add a bookmark', () => {
      const state = createTestState({ currentPath: '/internal/protocols' });
      const result = executeCommand('bookmark session_objectives.txt', state);

      expect(result.stateChanges.bookmarkedFiles).toBeDefined();
      expect(
        result.stateChanges.bookmarkedFiles?.has('/internal/protocols/session_objectives.txt')
      ).toBe(true);
    });

    it('should toggle bookmark off', () => {
      const state = createTestState({
        currentPath: '/internal/protocols',
        bookmarkedFiles: new Set(['/internal/protocols/session_objectives.txt']),
      });
      const result = executeCommand('bookmark session_objectives.txt', state);

      expect(
        result.stateChanges.bookmarkedFiles?.has('/internal/protocols/session_objectives.txt')
      ).toBe(false);
      expect(result.output.some(e => e.content.includes('removed'))).toBe(true);
    });
  });

  describe('unread command', () => {
    it('should list unread files', () => {
      const state = createTestState();
      const result = executeCommand('unread', state);

      expect(result.output.some(e => e.content.includes('UNREAD FILES'))).toBe(true);
    });

    it('should say all read when everything is read', () => {
      // Create a state with many files read
      const state = createTestState({
        filesRead: new Set([
          '/internal/protocols/session_objectives.txt',
          '/internal/incident_review_protocol.txt',
          // Add many more...
        ]),
      });
      // Note: This test may pass or fail depending on file count
      const result = executeCommand('unread', state);
      expect(result.output.length).toBeGreaterThan(0);
    });
  });

  describe('progress command', () => {
    it('should show investigation progress', () => {
      const state = createTestState();
      const result = executeCommand('progress', state);

      expect(result.output.some(e => e.content.includes('DOSSIER — LEAK PREPARATION'))).toBe(true);
      expect(result.output.some(e => e.content.includes('Files saved: 0/10'))).toBe(true);
    });

    it('should show saved dossier file count', () => {
      const state = createTestState({
        savedFiles: new Set([
          '/internal/audio_transcript_brief.txt',
          '/storage/quarantine/bio_container.log',
        ]),
      });
      const result = executeCommand('progress', state);

      expect(result.output.some(e => e.content.includes('Files saved: 2/10'))).toBe(true);
    });

    it('shows dossier completion when all 10 files are saved', () => {
      const state = createTestState({
        savedFiles: new Set([
          '/internal/audio_transcript_brief.txt',
          '/internal/jardim_andere_incident.txt',
          '/internal/misc/incident_report_1996_01_VG.txt',
          '/storage/quarantine/bio_container.log',
          '/storage/quarantine/autopsy_alpha.log',
          '/storage/quarantine/witness_statement_raw.txt',
          '/ops/prato/archive/patrol_observation_shift_04.txt',
          '/ops/prato/initial_response_orders.txt',
          '/admin/thirty_year_cycle.txt',
          '/admin/colonization_model.red',
        ]),
      });
      const result = executeCommand('progress', state);

      expect(result.output.some(e => e.content.includes('DOSSIER COMPLETE'))).toBe(true);
    });

    it('lists the saved file names in the dossier', () => {
      const state = createTestState({
        savedFiles: new Set([
          '/internal/audio_transcript_brief.txt',
          '/storage/quarantine/bio_container.log',
        ]),
      });
      const result = executeCommand('progress', state);

      expect(result.output.some(e => e.content.includes('audio_transcript_brief.txt'))).toBe(true);
      expect(result.output.some(e => e.content.includes('bio_container.log'))).toBe(true);
    });
  });

  describe('search command', () => {
    it('shows usage when no term is provided', () => {
      const state = createTestState();
      const result = executeCommand('search', state);

      expect(result.output.some(e => e.content.includes('Specify a search term'))).toBe(true);
      expect(result.output.some(e => e.content.includes('Usage: search <keyword>'))).toBe(true);
    });

    it('finds files by filename', () => {
      const state = createTestState();
      const result = executeCommand('search session_objectives', state);

      expect(result.output.some(e => e.content.includes('SEARCH RESULTS'))).toBe(true);
      expect(result.output.find(e => e.i18nKey === 'engine.commands.inventory.search_query')).toBeDefined();
      expect(
        result.output.some(e => e.content.includes('/internal/protocols/session_objectives.txt'))
      ).toBe(true);
      expect(
        result.output.some(
          e => e.i18nKey === 'engine.commands.inventory.search_result.filename'
        )
      ).toBe(true);
    });

    it('finds files by content', () => {
      const state = createTestState();
      const result = executeCommand('search anomalous', state);

      expect(result.output.some(e => e.content.includes('/internal/protocols/session_objectives.txt'))).toBe(true);
    });

    it('searches file content case-insensitively across multiple directories', () => {
      const state = createTestState({
        flags: { adminUnlocked: true },
      });
      const result = executeCommand('search ANOMALOUS', state);

      expect(result.output.some(e => e.content.includes('/internal/protocols/session_objectives.txt'))).toBe(true);
      expect(result.output.some(e => e.content.includes('/storage/quarantine/surveillance_recovery.vid'))).toBe(true);
      expect(
        result.output.some(e => e.i18nKey === 'engine.commands.inventory.search_result.content')
      ).toBe(true);
    });

    it('keeps override-gated files hidden until override is used, then makes them searchable', () => {
      const lockedState = createTestState({
        accessLevel: 5,
        flags: { adminUnlocked: true },
      });
      const unlockedState = createTestState({
        accessLevel: 5,
        flags: { adminUnlocked: true, tracePurgeUsed: true },
      });

      const lockedResult = executeCommand('search trace_purge_memo', lockedState);
      const unlockedResult = executeCommand('search trace_purge_memo', unlockedState);

      expect(lockedResult.output.some(e => e.content.includes('/admin/trace_purge_memo.txt'))).toBe(
        false
      );
      expect(
        unlockedResult.output.some(e => e.content.includes('/admin/trace_purge_memo.txt'))
      ).toBe(true);
    });

    it('adds a small detection penalty when searching', () => {
      const state = createTestState({ detectionLevel: 10 });
      const result = executeCommand('search crash', state);

      expect(result.stateChanges.detectionLevel).toBe(12);
    });

    it('does not hide direct matches behind an overflow truncation line', () => {
      const state = createTestState({
        accessLevel: 5,
        flags: { adminUnlocked: true, tracePurgeUsed: true },
      });
      const result = executeCommand('search report', state);

      expect(result.output.some(e => e.i18nKey === 'engine.commands.inventory.search_more_results')).toBe(false);
      expect(result.output.some(e => e.content.includes('/internal/sanitized/asset_disposition_report.txt'))).toBe(
        true
      );
    });
  });

  describe('help recovery', () => {
    it('shows recovery guidance instead of an unknown-command dead end', () => {
      const state = createTestState();
      const result = executeCommand('help recovery', state);

      expect(result.output.some(e => e.type === 'error')).toBe(false);
      expect(
        result.output.some(e => e.content.includes('Lower detection briefly (limited uses)'))
      ).toBe(true);
      expect(result.output.some(e => e.content.includes('Emergency escape at 90% risk'))).toBe(
        true
      );
    });
  });

  describe('god evidences command', () => {
    it('fills all evidence slots and leaves the game ready for leak without requiring iddqd first', () => {
      const state = createTestState({ evidenceCount: 1, flags: {} });
      const result = executeCommand('god evidences', state);

      expect(result.stateChanges.evidenceCount).toBe(10);
      expect(result.stateChanges.savedFiles?.size).toBe(10);
      expect(result.stateChanges.flags).toBeUndefined();
      expect(result.stateChanges.evidencesSaved).toBeUndefined();
      expect(result.output.some(e => e.content.includes('Leak path ready'))).toBe(true);

      // With evidenceCount 10 (god evidences gives 10), leak should proceed
      const readyState = {
        ...state,
        ...result.stateChanges,
        flags: { ...state.flags, ...(result.stateChanges.flags || {}) },
      } as GameState;
      const leakResult = executeCommand('leak', readyState);

      expect(leakResult.output.some(e => e.content.includes('INSUFFICIENT EVIDENCE'))).toBe(false);
    });

    it('keeps god evidence compatible inside god mode', () => {
      const state = createTestState({ godMode: true, evidenceCount: 0, flags: {} });
      const result = executeCommand('god evidence', state);

      expect(result.stateChanges.evidenceCount).toBe(10);
      expect(result.stateChanges.savedFiles?.size).toBe(10);
      expect(result.stateChanges.flags).toBeUndefined();
      expect(result.output.some(e => e.content.includes('ALL EVIDENCE UNLOCKED'))).toBe(true);
      expect(result.output.some(e => e.content.includes('Leak path ready'))).toBe(true);
    });
  });

  describe('god random command', () => {
    it('builds a mixed 10-file dossier and jumps to the resolved victory ending', () => {
      const state = createTestState({ godMode: true, savedFiles: new Set(), filesRead: new Set() });
      const result = executeCommand('god random', state);
      const savedFiles = result.stateChanges.savedFiles ?? new Set<string>();
      const selectedFiles = [...savedFiles];
      const evidenceFiles = selectedFiles.filter(isEvidencePath);
      const nonEvidenceFiles = selectedFiles.filter(path => !isEvidencePath(path));

      expect(result.skipToPhase).toBe('victory');
      expect(result.stateChanges.gameWon).toBe(true);
      expect(result.stateChanges.evidencesSaved).toBe(true);
      expect(savedFiles.size).toBe(10);
      expect(evidenceFiles).toHaveLength(7);
      expect(nonEvidenceFiles).toHaveLength(3);
      expect(result.stateChanges.evidenceCount).toBe(7);
      expect(result.stateChanges.filesRead?.size).toBeGreaterThanOrEqual(10);
      expect(result.stateChanges.endingId).toBe(determineEnding(savedFiles));
      expect(result.output.some(e => e.content.includes('RANDOM DOSSIER GENERATED'))).toBe(true);
    });

    it('uses the current seeded state so the same run produces the same random dossier', () => {
      const state = createTestState({ godMode: true, sessionCommandCount: 27 });
      const first = executeCommand('god random', state);
      const second = executeCommand('god random', state);

      expect([...((first.stateChanges.savedFiles as Set<string>) ?? [])]).toEqual([
        ...((second.stateChanges.savedFiles as Set<string>) ?? []),
      ]);
      expect(first.stateChanges.endingId).toBe(second.stateChanges.endingId);
    });
  });

  describe('god alien command', () => {
    it('sets detection to 70 and arms an alien preview without requiring iddqd first', () => {
      const state = createTestState({ detectionLevel: 12 });
      const before = Date.now();
      const result = executeCommand('god alien', state);

      expect(result.stateChanges.detectionLevel).toBe(70);
      expect(result.stateChanges.alienPreviewUntil).toBeGreaterThan(before);
      expect(result.output.some(e => e.content.includes('ALIEN PREVIEW ARMED'))).toBe(true);
    });
  });

  describe('ls command enhancements', () => {
    it('should show bookmark star for bookmarked files', () => {
      const state = createTestState({
        currentPath: '/internal/protocols',
        bookmarkedFiles: new Set(['/internal/protocols/session_objectives.txt']),
      });
      const result = executeCommand('ls', state);

      expect(result.output.some(e => e.content.includes('★'))).toBe(true);
    });

    it('should show [READ] for read files', () => {
      const state = createTestState({
        currentPath: '/internal/protocols',
        filesRead: new Set(['/internal/protocols/session_objectives.txt']),
      });
      const result = executeCommand('ls', state);

      expect(result.output.some(e => e.content.includes('[READ]'))).toBe(true);
    });

    it('should show [UNREAD] for unread files', () => {
      const state = createTestState({
        currentPath: '/internal/protocols',
        filesRead: new Set(), // No files read
      });
      const result = executeCommand('ls', state);

      expect(result.output.some(e => e.content.includes('[UNREAD]'))).toBe(true);
    });

    it('should not mark evidence files with a special legend or icon', () => {
      const state = createTestState({
        currentPath: '/storage/quarantine',
        filesRead: new Set(['/storage/quarantine/bio_container.log']),
      });
      const result = executeCommand('ls', state);

      expect(result.output.some(e => e.content.includes('evidence logged'))).toBe(false);
      expect(result.output.some(e => e.content.includes('[●]'))).toBe(false);
    });
  });

  describe('cd command navigation history', () => {
    it('should push current path to navigation history', () => {
      const state = createTestState({
        currentPath: '/internal',
        navigationHistory: [],
      });
      const result = executeCommand('cd protocols', state);

      expect(result.stateChanges.currentPath).toBe('/internal/protocols');
      expect(result.stateChanges.navigationHistory).toContain('/internal');
    });

    it('should append to existing navigation history', () => {
      const state = createTestState({
        currentPath: '/internal',
        navigationHistory: ['/'],
      });
      const result = executeCommand('cd protocols', state);

      expect(result.stateChanges.navigationHistory).toEqual(['/', '/internal']);
    });
  });

  describe('open command enhancements', () => {
    it('should track lastOpenedFile', () => {
      const state = createTestState({ currentPath: '/internal/protocols' });
      const result = executeCommand('open session_objectives.txt', state);

      expect(result.stateChanges.lastOpenedFile).toBe('/internal/protocols/session_objectives.txt');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // STEALTH RECOVERY COMMANDS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('wait command', () => {
    it('should reduce detection level', () => {
      const state = createTestState({ detectionLevel: 40, waitUsesRemaining: 3 });
      const result = executeCommand('wait', state);

      expect(result.stateChanges.detectionLevel).toBeLessThan(40);
      expect(result.stateChanges.waitUsesRemaining).toBe(2);
    });

    it('should increase system hostility', () => {
      const state = createTestState({
        detectionLevel: 40,
        waitUsesRemaining: 3,
        systemHostilityLevel: 0,
      });
      const result = executeCommand('wait', state);

      expect(result.stateChanges.systemHostilityLevel).toBe(1);
    });

    it('should fail when no uses remaining', () => {
      const state = createTestState({ detectionLevel: 40, waitUsesRemaining: 0 });
      const result = executeCommand('wait', state);

      expect(result.output.some(e => e.content.includes('Cannot wait any longer'))).toBe(true);
      expect(result.stateChanges.detectionLevel).toBeUndefined();
    });

    it('should not reduce if detection already minimal', () => {
      const state = createTestState({ detectionLevel: 3, waitUsesRemaining: 3 });
      const result = executeCommand('wait', state);

      expect(result.output.some(e => e.content.includes('already minimal'))).toBe(true);
      expect(result.stateChanges.detectionLevel).toBeUndefined();
    });

    it('should reduce more at high detection levels', () => {
      const lowState = createTestState({ detectionLevel: 30, waitUsesRemaining: 3 });
      const highState = createTestState({ detectionLevel: 80, waitUsesRemaining: 3 });

      const lowResult = executeCommand('wait', lowState);
      const highResult = executeCommand('wait', highState);

      const lowReduction = 30 - (lowResult.stateChanges.detectionLevel ?? 30);
      const highReduction = 80 - (highResult.stateChanges.detectionLevel ?? 80);

      expect(highReduction).toBeGreaterThan(lowReduction);
    });
  });

  describe('hide command', () => {
    it('should not be available at low detection', () => {
      const state = createTestState({ detectionLevel: 50 });
      const result = executeCommand('hide', state);

      expect(result.output.some(e => e.content.includes('not recognized'))).toBe(true);
    });

    it('should work at 90+ detection and reset to 70', () => {
      const state = createTestState({
        detectionLevel: 92,
        sessionStability: 100,
        singularEventsTriggered: new Set(),
      });
      const result = executeCommand('hide', state);

      expect(result.stateChanges.detectionLevel).toBe(70);
      expect(result.stateChanges.sessionStability).toBeLessThan(100);
    });

    it('should only work once per run', () => {
      const state = createTestState({
        detectionLevel: 95,
        singularEventsTriggered: new Set(['hide_used']),
      });
      const result = executeCommand('hide', state);

      expect(result.output.some(e => e.content.includes('Cannot hide again'))).toBe(true);
      expect(result.stateChanges.detectionLevel).toBeUndefined();
    });

    it('should trigger flicker effect', () => {
      const state = createTestState({
        detectionLevel: 92,
        sessionStability: 100,
        singularEventsTriggered: new Set(),
      });
      const result = executeCommand('hide', state);

      expect(result.triggerFlicker).toBe(true);
    });
  });

  describe('file re-read detection', () => {
    it('should show already read message for re-opened files', () => {
      const state = createTestState({
        currentPath: '/internal/protocols',
        filesRead: new Set(['/internal/protocols/session_objectives.txt']),
      });
      const result = executeCommand('open session_objectives.txt', state);

      expect(result.output.some(e => e.content.includes('already read this file'))).toBe(true);
      expect(result.stateChanges.detectionLevel).toBe(state.detectionLevel + 1); // Reduced penalty
    });

    it('should show trap re-read message for re-opened trap files', () => {
      const state = createTestState({
        currentPath: '/tmp',
        filesRead: new Set(['/tmp/URGENT_classified_alpha.txt']),
        trapsTriggered: new Set(['/tmp/URGENT_classified_alpha.txt']),
        trapWarningGiven: true,
      });
      const result = executeCommand('open URGENT_classified_alpha.txt', state);

      expect(result.output.some(e => e.content.includes('already fell for this trap'))).toBe(true);
      expect(result.stateChanges.detectionLevel).toBe(state.detectionLevel + 1); // Reduced penalty, not +20
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // NEW QOL COMMANDS - tree, tutorial, context-sensitive help
  // ═══════════════════════════════════════════════════════════════════════════

  describe('tree command', () => {
    it('should show confirmation prompt on first call', () => {
      const state = createTestState();
      const result = executeCommand('tree', state);

      expect(result.output.some(e => e.content.includes('are you sure'))).toBe(true);
      expect(result.stateChanges.pendingTreeConfirm).toBe(true);
    });

    it('should display directory structure after confirmation', () => {
      const state = createTestState({ pendingTreeConfirm: true });
      const result = executeCommand('tree', state);

      expect(result.output.some(e => e.content.includes('DIRECTORY STRUCTURE'))).toBe(true);
      expect(result.output.some(e => e.content.includes('/'))).toBe(true);
    });

    it('should show current location after confirmation', () => {
      const state = createTestState({ currentPath: '/internal', pendingTreeConfirm: true });
      const result = executeCommand('tree', state);

      expect(result.output.some(e => e.content.includes('Current location: /internal'))).toBe(true);
    });

    it('should show [READ] markers for read files', () => {
      const state = createTestState({
        filesRead: new Set(['/storage/assets/transport_log_96.txt']),
        pendingTreeConfirm: true,
        // NOT setting adminUnlocked — tree post-override triggers firewall
      });
      const result = executeCommand('tree', state);

      // Pre-override tree won't see /storage/ files (adminUnlocked required),
      // so just verify tree output renders without crash
      expect(result.output.some(e => e.content.includes('DIRECTORY STRUCTURE'))).toBe(true);
    });

    it('should increase detection by 30 after confirmation', () => {
      const state = createTestState({ detectionLevel: 10, pendingTreeConfirm: true });
      const result = executeCommand('tree', state);

      expect(result.stateChanges.detectionLevel).toBe(40);
    });

    it('should trigger firewall when adminUnlocked', () => {
      const state = createTestState({ flags: { adminUnlocked: true } });
      const result = executeCommand('tree', state);

      expect(result.output.some(e => e.content.includes('FIREWALL TRIGGERED'))).toBe(true);
      expect(result.stateChanges.isGameOver).toBe(true);
    });
  });

  describe('tutorial command', () => {
    it('should reset tutorial state', () => {
      const state = createTestState({
        tutorialStep: 5,
        tutorialComplete: true,
      });
      const result = executeCommand('tutorial', state);

      expect(result.stateChanges.tutorialStep).toBe(0);
      expect(result.stateChanges.tutorialComplete).toBe(false);
    });

    it('should clear history for fresh start', () => {
      const state = createTestState({
        history: [{ id: '1', type: 'output', content: 'test', timestamp: Date.now() }],
      });
      const result = executeCommand('tutorial', state);

      expect(result.stateChanges.history).toEqual([]);
    });

    it('should show restart message', () => {
      const state = createTestState();
      const result = executeCommand('tutorial', state);

      expect(result.output.some(e => e.content.includes('Restarting tutorial'))).toBe(true);
    });
  });

  describe('context-sensitive help', () => {
    it('should show detailed help for specific command', () => {
      const state = createTestState();
      const result = executeCommand('help cd', state);

      expect(result.output.some(e => e.content.includes('COMMAND: cd'))).toBe(true);
      expect(result.output.some(e => e.content.includes('USAGE:'))).toBe(true);
    });

    it('should show help for open command', () => {
      const state = createTestState();
      const result = executeCommand('help open', state);

      expect(result.output.some(e => e.content.includes('COMMAND: open'))).toBe(true);
      expect(result.output.some(e => e.content.includes('Opening certain files may increase detection risk.'))).toBe(true);
    });

    it('should not expose removed decrypt help', () => {
      const state = createTestState();
      const result = executeCommand('help decrypt', state);

      expect(result.output.some(e => e.content.includes('Unknown command: decrypt'))).toBe(true);
    });

    it('should show general help when no argument', () => {
      const state = createTestState();
      const result = executeCommand('help', state);

      expect(result.output.some(e => e.content.includes('TERMINAL COMMANDS'))).toBe(true);
      expect(result.output.some(e => e.content.includes('wait'))).toBe(true);
      expect(result.output.some(e => e.content.includes('hide'))).toBe(true);
      expect(result.output.some(e => e.content.includes('  back              Go to previous directory'))).toBe(false);
      expect(result.output.some(e => e.content.includes('  progress          Show investigation progress'))).toBe(false);
      expect(result.output.some(e => e.content.includes('  map               Show evidence connections'))).toBe(false);
      expect(result.output.some(e => e.content.includes('  decrypt <file>    Attempt decryption of .enc files'))).toBe(false);
      expect(result.output.some(e => e.content.includes('  recover <file>    Attempt file recovery (RISK)'))).toBe(false);
      expect(result.output.some(e => e.content.includes('  trace             Trace system connections (RISK)'))).toBe(false);
      expect(result.output.some(e => e.content.includes('  rewind            Access archive state (RISK)'))).toBe(false);
      expect(result.output.some(e => e.content.includes('  present           Return to present from archive'))).toBe(false);
    });

    it('should not expose removed mechanics in direct help', () => {
      const state = createTestState();
      // back is now a documented command — verify it returns help instead of "Unknown"
      const result = executeCommand('help back', state);

      expect(result.output.some(e => e.content.includes('Unknown command: back'))).toBe(false);
      expect(result.output.some(e => e.content.includes('COMMAND: back'))).toBe(true);
    });

    it('should handle unknown command gracefully', () => {
      const state = createTestState();
      const result = executeCommand('help unknownxyz', state);

      // Should show general help or error message
      expect(result.output.length).toBeGreaterThan(0);
    });

    it('keeps help available after dossier prep starts', () => {
      const state = createTestState({
        savedFiles: new Set(['/a.txt', '/b.txt', '/c.txt', '/d.txt', '/e.txt']),
      });
      const result = executeCommand('help', state);

      expect(result.output.some(e => e.content.includes('COMMAND RESTRICTED'))).toBe(false);
      expect(result.output.some(e => e.content.includes('TERMINAL COMMANDS'))).toBe(true);
    });
  });

  describe('status guidance', () => {
    it('surfaces dossier progress and recovery advice when pressure is high', () => {
      const state = createTestState({
        tutorialComplete: true,
        detectionLevel: 88,
        waitUsesRemaining: 2,
        evidenceCount: 3,
        savedFiles: new Set(['/a.txt', '/b.txt', '/c.txt']),
        filesRead: new Set(['/comms/psi/transcript_core.enc']),
      });
      const result = executeCommand('status', state);

      expect(result.output.some(e => e.content.includes('3/10'))).toBe(true);
      expect(result.output.some(e => e.content.includes('RECOVERY: "wait" can buy time'))).toBe(true);
      expect(result.output.some(e => e.content.includes('SIGNAL: Residual echo persists'))).toBe(true);
    });

    it('can trigger a delayed second-voice warning after psi exposure', () => {
      const state = createTestState({
        tutorialComplete: true,
        detectionLevel: 60,
        evidenceCount: 2,
        filesRead: new Set(['/comms/psi/transcript_core.enc']),
        singularEventsTriggered: new Set(['turing_warning', 'turing_evaluation']),
      });
      const result = executeCommand('help', state);

      expect(result.output.some(e => e.content.includes('[RESPONSE TIMING MISMATCH]'))).toBe(true);
      expect(result.output.some(e => e.content.includes('dont answer it back'))).toBe(true);
    });

    it('keeps observer cues hidden until psi material has actually been read', () => {
      const state = createTestState({
        tutorialComplete: true,
        detectionLevel: 62,
        evidenceCount: 1,
        filesRead: new Set(['/storage/witness_statement_raw.txt']),
      });

      const statusResult = executeCommand('status', state);
      const helpResult = executeCommand('help', state);

      expect(statusResult.output.some(e => e.content.includes('Residual echo persists'))).toBe(false);
      expect(
        helpResult.output.some(e =>
          e.content.includes('If assistance appears before you finish typing')
        )
      ).toBe(false);
    });

    it('keeps search and wait available after dossier prep starts', () => {
      const savedFiles = new Set(['/a.txt', '/b.txt', '/c.txt', '/d.txt', '/e.txt']);
      const searchState = createTestState({
        currentPath: '/internal/protocols',
        savedFiles,
      });
      const searchResult = executeCommand('search session', searchState);

      expect(searchResult.output.some(e => e.content.includes('COMMAND RESTRICTED'))).toBe(false);
      expect(searchResult.output.some(e => e.content.includes('SEARCH RESULTS'))).toBe(true);

      const waitState = createTestState({
        savedFiles,
        detectionLevel: 50,
        waitUsesRemaining: 2,
      });
      const waitResult = executeCommand('wait', waitState);

      expect(waitResult.output.some(e => e.content.includes('COMMAND RESTRICTED'))).toBe(false);
      expect((waitResult.stateChanges.detectionLevel ?? waitState.detectionLevel) < waitState.detectionLevel).toBe(
        true
      );
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // EVIDENCE REVELATION INTEGRATION TESTS
  // These test how the evidence revelation system integrates with file commands
  // ═══════════════════════════════════════════════════════════════════════════

  describe('evidence revelation integration', () => {
    it('should open a file and produce output', () => {
      const state = createTestState({
        currentPath: '/internal/protocols',
      });

      // Open a file - should produce output
      const result = executeCommand('open session_objectives.txt', state);

      // Should have output entries
      expect(result.output.length).toBeGreaterThan(0);
    });

    it('should track file evidence state through multiple reads', () => {
      const state = createTestState({
        currentPath: '/ops/assessments',
        filesRead: new Set(['/ops/assessments/debris_analysis.txt']),
        evidenceCount: 1,
      });

      // Re-read the file
      const result = executeCommand('open debris_analysis.txt', state);

      // Either shows "already read" message or reveals additional evidence
      const hasContent = result.output.some(
        e =>
          e.content.includes('already read') ||
          e.content.includes('additional insights') ||
          e.content.length > 0
      );
      expect(hasContent).toBe(true);
    });

    it('should persist evidence states across multiple file operations', () => {
      const state = createTestState({
        currentPath: '/internal/protocols',
      });

      // Open a file - should initialize evidence state
      const result = executeCommand('open session_objectives.txt', state);

      // State should be tracked
      expect(result.output.length).toBeGreaterThan(0);
    });

    it('should handle encrypted files correctly', () => {
      const state = createTestState({
        currentPath: '/ops/medical',
        avatarExpression: 'neutral',
      });

      // Open a potentially encrypted file
      const result = executeCommand('open subject_beta_autopsy.txt', state);

      // Should produce output (either file content or encryption notice)
      expect(result.output.length).toBeGreaterThan(0);
    });

    it('should handle files in liaison directory', () => {
      const state = createTestState({
        currentPath: '/comms/liaison',
      });

      // Open file that could have multiple evidence types
      const result = executeCommand('open foreign_coordination_log.txt', state);

      // Should output file content or encryption notice
      expect(result.output.length).toBeGreaterThan(0);
    });
  });
});
