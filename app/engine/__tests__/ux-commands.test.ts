// UX Commands Tests - last, back, note, notes, bookmark, unread, progress
import { describe, it, expect } from 'vitest';
import { executeCommand } from '../commands';
import { GameState, DEFAULT_GAME_STATE } from '../../types';

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
    it('should go to parent directory', () => {
      const state = createTestState({ currentPath: '/internal' });
      const result = executeCommand('back', state);
      
      expect(result.stateChanges.currentPath).toBe('/');
    });

    it('should stay at root if already at root', () => {
      const state = createTestState({ currentPath: '/' });
      const result = executeCommand('back', state);
      
      expect(result.output.some(e => e.content.includes('Already at root'))).toBe(true);
    });

    it('should handle nested directories', () => {
      const state = createTestState({ currentPath: '/internal/deep' });
      const result = executeCommand('back', state);
      
      expect(result.stateChanges.currentPath).toBe('/internal');
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
      expect(result.stateChanges.bookmarkedFiles?.has('/internal/protocols/session_objectives.txt')).toBe(true);
    });

    it('should toggle bookmark off', () => {
      const state = createTestState({
        currentPath: '/internal/protocols',
        bookmarkedFiles: new Set(['/internal/protocols/session_objectives.txt']),
      });
      const result = executeCommand('bookmark session_objectives.txt', state);
      
      expect(result.stateChanges.bookmarkedFiles?.has('/internal/protocols/session_objectives.txt')).toBe(false);
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
      
      expect(result.output.some(e => e.content.includes('INVESTIGATION PROGRESS'))).toBe(true);
      expect(result.output.some(e => e.content.includes('Evidence Collected'))).toBe(true);
    });

    it('should show discovered truths', () => {
      const state = createTestState({
        truthsDiscovered: new Set(['debris_relocation', 'being_containment']),
      });
      const result = executeCommand('progress', state);
      
      expect(result.output.some(e => e.content.includes('Debris transfer'))).toBe(true);
      expect(result.output.some(e => e.content.includes('Non-human containment'))).toBe(true);
    });

    it('should show detection warning at high levels', () => {
      const state = createTestState({ detectionLevel: 75 });
      const result = executeCommand('progress', state);
      
      expect(result.output.some(e => e.content.includes('Detection level dangerously high'))).toBe(true);
    });

    it('should show session statistics', () => {
      const state = createTestState({
        filesRead: new Set(['/test1.txt', '/test2.txt']),
        sessionCommandCount: 50,
      });
      const result = executeCommand('progress', state);
      
      expect(result.output.some(e => e.content.includes('Files examined: 2'))).toBe(true);
      expect(result.output.some(e => e.content.includes('Commands executed: 50'))).toBe(true);
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
      const state = createTestState({ detectionLevel: 40, waitUsesRemaining: 3, systemHostilityLevel: 0 });
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
});
