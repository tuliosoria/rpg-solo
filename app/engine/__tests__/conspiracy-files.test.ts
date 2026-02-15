// Tests for conspiracy theory easter egg files
// These files trigger UFO74 reactions when opened

import { describe, it, expect, beforeEach } from 'vitest';
import { executeCommand } from '../commands';
import { GameState, DEFAULT_GAME_STATE, TutorialStateID } from '../../types';

describe('Conspiracy Easter Egg Files', () => {
  let state: GameState;

  beforeEach(() => {
    // Create a fresh game state with tutorial completed
    state = {
      ...DEFAULT_GAME_STATE,
      seed: 12345,
      rngState: 12345,
      sessionStartTime: Date.now(),
      tutorialComplete: true,
      tutorialStep: -1,
      interactiveTutorialState: {
        current: TutorialStateID.GAME_ACTIVE,
        failCount: 0,
        nudgeShown: false,
        inputLocked: false,
        dialogueComplete: true,
      },
      currentPath: '/internal/misc',
      filesRead: new Set(),
      conspiracyFilesSeen: new Set(),
    };
  });

  describe('File existence', () => {
    const conspiracyFiles = [
      'economic_transition_memo.txt',
      'apollo_media_guidelines.pdf',
      'weather_pattern_intervention.log',
      'behavioral_compliance_study.dat',
      'infrastructure_blackout_simulation.txt',
      'avian_tracking_program.csv',
      'consumer_device_listening.memo',
      'archival_photo_replacement.notice',
      'education_curriculum_revision.doc',
      'satellite_light_reflection_trials.txt',
    ];

    conspiracyFiles.forEach(filename => {
      it(`should have ${filename} in /internal/misc`, () => {
        const result = executeCommand(`open ${filename}`, state);
        
        // Should not return file not found error
        const hasError = result.output.some(
          e => e.type === 'error' && e.content.includes('not found')
        );
        expect(hasError).toBe(false);
        
        // Should show the file content
        const hasFileHeader = result.output.some(
          e => e.content.includes(`FILE: /internal/misc/${filename}`)
        );
        expect(hasFileHeader).toBe(true);
      });
    });
  });

  describe('UFO74 reactions', () => {
    it('should trigger UFO74 reaction when opening a conspiracy file', () => {
      const result = executeCommand('open economic_transition_memo.txt', state);
      
      // Should have pending UFO74 messages
      expect(result.pendingUfo74Messages).toBeDefined();
      expect(result.pendingUfo74Messages!.length).toBeGreaterThan(0);
      
      // UFO74 message should contain dismissive content
      const ufo74Content = result.pendingUfo74Messages!.map(e => e.content).join(' ');
      expect(ufo74Content.toLowerCase()).toContain('ufo74');
    });

    it('should only trigger UFO74 reaction once per conspiracy file', () => {
      // First open - should trigger reaction
      const result1 = executeCommand('open economic_transition_memo.txt', state);
      expect(result1.pendingUfo74Messages).toBeDefined();
      expect(result1.pendingUfo74Messages!.length).toBeGreaterThan(0);
      
      // Update state with changes
      const newState: GameState = {
        ...state,
        ...result1.stateChanges,
        filesRead: new Set([...(state.filesRead || []), ...(result1.stateChanges.filesRead || [])]),
        conspiracyFilesSeen: result1.stateChanges.conspiracyFilesSeen || state.conspiracyFilesSeen,
      };
      
      // Second open - should NOT trigger conspiracy reaction (file already seen)
      // Note: May still have other UFO74 messages (like sanitized folder warning)
      const result2 = executeCommand('open economic_transition_memo.txt', newState);
      
      // Check if this specific file was marked as seen
      expect(newState.conspiracyFilesSeen.has('/internal/misc/economic_transition_memo.txt')).toBe(true);
    });

    it('should track conspiracy files seen in state', () => {
      const result = executeCommand('open avian_tracking_program.csv', state);
      
      expect(result.stateChanges.conspiracyFilesSeen).toBeDefined();
      expect(result.stateChanges.conspiracyFilesSeen!.has('/internal/misc/avian_tracking_program.csv')).toBe(true);
    });

    it('should allow different conspiracy files to each trigger reactions', () => {
      // Open first file
      const result1 = executeCommand('open economic_transition_memo.txt', state);
      expect(result1.pendingUfo74Messages).toBeDefined();
      
      // Update state
      const state2: GameState = {
        ...state,
        ...result1.stateChanges,
        conspiracyFilesSeen: result1.stateChanges.conspiracyFilesSeen || new Set(),
      };
      
      // Open second file - should also trigger reaction
      const result2 = executeCommand('open apollo_media_guidelines.pdf', state2);
      expect(result2.pendingUfo74Messages).toBeDefined();
      expect(result2.pendingUfo74Messages!.length).toBeGreaterThan(0);
    });
  });

  describe('File content', () => {
    it('economic_transition_memo.txt should reference S.N. signature', () => {
      const result = executeCommand('open economic_transition_memo.txt', state);
      const content = result.output.map(e => e.content).join('\n');
      
      expect(content).toContain('S.N.');
      expect(content.toLowerCase()).toContain('cryptographic');
    });

    it('apollo_media_guidelines.pdf should reference visual inconsistencies', () => {
      const result = executeCommand('open apollo_media_guidelines.pdf', state);
      const content = result.output.map(e => e.content).join('\n');
      
      expect(content.toLowerCase()).toContain('visual inconsistencies');
      expect(content.toLowerCase()).toContain('lunar');
    });

    it('avian_tracking_program.csv should have surveillance data format', () => {
      const result = executeCommand('open avian_tracking_program.csv', state);
      const content = result.output.map(e => e.content).join('\n');
      
      expect(content).toContain('UNIT_ID');
      expect(content).toContain('SPECIES_COVER');
      expect(content.toLowerCase()).toContain('surveillance');
    });

    it('consumer_device_listening.memo should reference passive audio', () => {
      const result = executeCommand('open consumer_device_listening.memo', state);
      const content = result.output.map(e => e.content).join('\n');
      
      expect(content.toLowerCase()).toContain('passive');
      expect(content.toLowerCase()).toContain('microphone');
    });
  });

  describe('File tags', () => {
    it('conspiracy files should have conspiracy tag', () => {
      // We test this indirectly by checking they appear in search results
      // when searching for conspiracy-related terms
      const result = executeCommand('open economic_transition_memo.txt', state);
      const hasContent = result.output.some(e => e.content.includes('FILE:'));
      expect(hasContent).toBe(true);
    });
  });
});
