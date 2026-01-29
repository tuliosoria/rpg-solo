// Tests for the new tutorial system

import { describe, it, expect } from 'vitest';
import {
  getTutorialTip,
  shouldShowTutorialTip,
  getHelpBasics,
  getHelpEvidence,
  getHelpWinning,
  getFirstRunMessage,
} from '../commands/tutorial';
import type { TutorialTipId } from '../commands/tutorial';

describe('Tutorial System', () => {
  describe('shouldShowTutorialTip', () => {
    it('returns false when tutorial mode is off', () => {
      const result = shouldShowTutorialTip('first_fragment', false, new Set());
      expect(result).toBe(false);
    });

    it('returns true when tutorial mode is on and tip not yet shown', () => {
      const result = shouldShowTutorialTip('first_fragment', true, new Set());
      expect(result).toBe(true);
    });

    it('returns false when tip has already been shown', () => {
      const shownTips = new Set(['first_fragment']);
      const result = shouldShowTutorialTip('first_fragment', true, shownTips);
      expect(result).toBe(false);
    });

    it('returns true for different tip even if another was shown', () => {
      const shownTips = new Set(['first_fragment']);
      const result = shouldShowTutorialTip('second_fragment_same_category', true, shownTips);
      expect(result).toBe(true);
    });
  });

  describe('getTutorialTip', () => {
    const tipIds: TutorialTipId[] = ['first_fragment', 'second_fragment_same_category'];

    it.each(tipIds)('returns entries for %s', tipId => {
      const entries = getTutorialTip(tipId);
      expect(entries.length).toBeGreaterThan(0);
      // Check for box characters indicating proper formatting
      const hasBoxChars = entries.some(e => e.content.includes('╔') || e.content.includes('╚'));
      expect(hasBoxChars).toBe(true);
    });

    it('includes TUTORIAL TIP header', () => {
      const entries = getTutorialTip('first_fragment');
      const hasHeader = entries.some(e => e.content.includes('TUTORIAL TIP'));
      expect(hasHeader).toBe(true);
    });
  });

  describe('getHelpBasics', () => {
    it('returns formatted help entries', () => {
      const entries = getHelpBasics();
      expect(entries.length).toBeGreaterThan(0);

      // Check for expected content
      const allContent = entries.map(e => e.content).join('\n');
      expect(allContent).toContain('B A S I C S');
      expect(allContent).toContain('NAVIGATION');
      expect(allContent).toContain('ls');
      expect(allContent).toContain('cd');
      expect(allContent).toContain('open');
    });
  });

  describe('getHelpEvidence', () => {
    it('returns formatted help entries about evidence', () => {
      const entries = getHelpEvidence();
      expect(entries.length).toBeGreaterThan(0);

      const allContent = entries.map(e => e.content).join('\n');
      expect(allContent).toContain('E V I D E N C E');
      expect(allContent).toContain('OBJECTIVE');
    });
  });

  describe('getHelpWinning', () => {
    it('returns formatted help entries about winning', () => {
      const entries = getHelpWinning();
      expect(entries.length).toBeGreaterThan(0);

      const allContent = entries.map(e => e.content).join('\n');
      expect(allContent).toContain('H O W   T O   W I N');
      expect(allContent).toContain('Debris Relocation');
      expect(allContent).toContain('Being Containment');
      expect(allContent).toContain('Telepathic Scouts');
      expect(allContent).toContain('International Actors');
      expect(allContent).toContain('Transition 2026');
    });
  });

  describe('getFirstRunMessage', () => {
    it('returns a friendly first-run message', () => {
      const entries = getFirstRunMessage();
      expect(entries.length).toBeGreaterThan(0);

      const allContent = entries.map(e => e.content).join('\n');
      expect(allContent).toContain('first time');
      expect(allContent).toContain('help basics');
    });
  });
});
