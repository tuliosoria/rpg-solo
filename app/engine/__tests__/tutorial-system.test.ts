// Tests for the new tutorial system

import { describe, it, expect } from 'vitest';
import {
  getTutorialTip,
  shouldShowTutorialTip,
  getFirstRunMessage,
} from '../commands/tutorial';
import type { TutorialTipId } from '../commands/tutorial';
import {
  getTutorialAutocomplete,
  TUTORIAL_BRIEFING_STEPS,
  TUTORIAL_INTRO_STEPS,
  TutorialStateID,
} from '../commands/interactiveTutorial';

describe('Tutorial System', () => {
  describe('shouldShowTutorialTip', () => {
    it('returns false when tutorial mode is off', () => {
      const result = shouldShowTutorialTip('first_evidence', false, new Set());
      expect(result).toBe(false);
    });

    it('returns true when tutorial mode is on and tip not yet shown', () => {
      const result = shouldShowTutorialTip('first_evidence', true, new Set());
      expect(result).toBe(true);
    });

    it('returns false when tip has already been shown', () => {
      const shownTips = new Set(['first_evidence']);
      const result = shouldShowTutorialTip('first_evidence', true, shownTips);
      expect(result).toBe(false);
    });
  });

  describe('getTutorialTip', () => {
    const tipIds: TutorialTipId[] = ['first_evidence'];

    it.each(tipIds)('returns entries for %s', tipId => {
      const entries = getTutorialTip(tipId);
      expect(entries.length).toBeGreaterThan(0);
      // Check for box characters indicating proper formatting
      const hasBoxChars = entries.some(e => e.content.includes('╔') || e.content.includes('╚'));
      expect(hasBoxChars).toBe(true);
    });

    it('includes TUTORIAL TIP header', () => {
      const entries = getTutorialTip('first_evidence');
      const hasHeader = entries.some(e => e.content.includes('TUTORIAL TIP'));
      expect(hasHeader).toBe(true);
    });
  });

  describe('getFirstRunMessage', () => {
    it('returns a friendly first-run message', () => {
      const entries = getFirstRunMessage();
      expect(entries.length).toBeGreaterThan(0);

      const allContent = entries.map(e => e.content).join('\n');
      expect(allContent).toContain('help basics');
    });
  });

  describe('getTutorialAutocomplete', () => {
    it('returns filename only (not full command) for open command completion', () => {
      // This test prevents regression of bug where 'open open cafeteria_menu' was produced
      const result = getTutorialAutocomplete('open c', TutorialStateID.FILE_DISPLAY);
      expect(result).toBe('cafeteria_menu_week03.txt');
      // Should NOT return the full command - that causes double-appending
      expect(result).not.toBe('open cafeteria_menu_week03.txt');
    });

    it('returns cafeteria_menu_week03.txt for partial matches', () => {
      expect(getTutorialAutocomplete('open ca', TutorialStateID.FILE_DISPLAY)).toBe('cafeteria_menu_week03.txt');
      expect(getTutorialAutocomplete('open caf', TutorialStateID.FILE_DISPLAY)).toBe('cafeteria_menu_week03.txt');
      expect(getTutorialAutocomplete('open cafeteria', TutorialStateID.FILE_DISPLAY)).toBe('cafeteria_menu_week03.txt');
    });

    it('returns null for non-matching input', () => {
      expect(getTutorialAutocomplete('open x', TutorialStateID.FILE_DISPLAY)).toBe(null);
      expect(getTutorialAutocomplete('ls', TutorialStateID.FILE_DISPLAY)).toBe(null);
    });

    it('returns null for wrong tutorial state', () => {
      expect(getTutorialAutocomplete('open c', TutorialStateID.LS_PROMPT)).toBe(null);
      expect(getTutorialAutocomplete('open c', TutorialStateID.CD_PROMPT)).toBe(null);
    });
  });

  describe('interactive tutorial copy', () => {
    it('keeps the live onboarding path on the original tone', () => {
      const introText = TUTORIAL_INTRO_STEPS.flat().map(entry => entry.content).join('\n');
      const briefingText = TUTORIAL_BRIEFING_STEPS.flat().map(entry => entry.content).join('\n');

      expect(introText).toContain('[UFO74]: Connection established.');
      expect(introText).toContain("[UFO74]: Great, now you're in. Let's get to business.");
      expect(briefingText).toContain('[UFO74]: Your mission: find 10 pieces of evidence.');
      expect(briefingText).toContain(
        '[UFO74]: Be careful, do not type wrong commands on the terminal. In doubt, type help.'
      );
      expect(briefingText).toContain(
        '[UFO74]: Type wrong commands 8 times, the window closes. Permanently. So concentrate, kid!'
      );
    });
  });
});
