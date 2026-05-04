import { describe, it, expect } from 'vitest';
import { analyzeLeak, buildLeakPrologue } from '../leakPrologue';
import { EVIDENCE_VIDEO_ATTACHMENTS } from '../../components/terminalConstants';

const ALIEN_FILES = [
  '/internal/autopsy_alpha.log',
  '/internal/jardim_andere_incident.txt',
];

const VIDEO_BEARING_PATH = '/internal/jardim_andere_incident.txt';
const IMAGE_BEARING_BASENAME = 'autopsy_alpha.log';
const IMAGE_BEARING_PATH = `/internal/${IMAGE_BEARING_BASENAME}`;

describe('analyzeLeak', () => {
  it('returns zero counts for empty / missing input', () => {
    expect(analyzeLeak(undefined)).toEqual({
      alienFileCount: 0,
      hasImages: false,
      hasVideos: false,
      qualifies: false,
    });
    expect(analyzeLeak(new Set())).toMatchObject({ qualifies: false, alienFileCount: 0 });
  });

  it('does not qualify with a single alien file', () => {
    const summary = analyzeLeak(new Set(['/internal/autopsy_alpha.log']));
    expect(summary.alienFileCount).toBe(1);
    expect(summary.qualifies).toBe(false);
  });

  it('qualifies once two or more alien files are saved', () => {
    const summary = analyzeLeak(new Set(ALIEN_FILES));
    expect(summary.alienFileCount).toBe(2);
    expect(summary.qualifies).toBe(true);
  });

  it('detects image-bearing saves by basename', () => {
    const summary = analyzeLeak(new Set([IMAGE_BEARING_PATH, '/internal/transport_log_96.txt']));
    expect(summary.hasImages).toBe(true);
  });

  it('detects video-bearing saves by full path', () => {
    const summary = analyzeLeak(new Set([VIDEO_BEARING_PATH, '/internal/autopsy_alpha.log']));
    expect(summary.hasVideos).toBe(true);
  });

  it('ignores conspiracy / honeypot files when counting alien evidence', () => {
    const summary = analyzeLeak(
      new Set([
        '/admin/cafeteria_menu.txt',
        '/admin/parking_allocation_jan96.txt',
        '/admin/URGENT_classified_alpha.txt',
        '/admin/SMOKING_GUN_proof.txt',
      ]),
    );
    expect(summary.alienFileCount).toBe(0);
    expect(summary.qualifies).toBe(false);
  });
});

describe('buildLeakPrologue', () => {
  it('returns empty for the ridiculed ending even with strong alien dossier', () => {
    expect(buildLeakPrologue(new Set(ALIEN_FILES), 'ridiculed')).toEqual([]);
  });

  it('returns empty for the hackerkid_caught ending', () => {
    expect(buildLeakPrologue(new Set(ALIEN_FILES), 'hackerkid_caught')).toEqual([]);
  });

  it('returns empty when no alien files are saved', () => {
    expect(buildLeakPrologue(new Set(), 'real_ending')).toEqual([]);
  });

  it('returns empty when a single alien file is saved (below threshold)', () => {
    expect(buildLeakPrologue(new Set([ALIEN_FILES[0]]), 'real_ending')).toEqual([]);
  });

  it('produces base prologue paragraphs once threshold is met', () => {
    const paragraphs = buildLeakPrologue(new Set(ALIEN_FILES), 'real_ending');
    expect(paragraphs.length).toBeGreaterThanOrEqual(3);
    expect(paragraphs[0]).toMatch(/hackerkid/);
    expect(paragraphs[0]).toMatch(/Brazilian government/);
    expect(paragraphs.some(p => /skeptic/i.test(p))).toBe(true);
  });

  it('mentions photographic evidence when an image-bearing file was saved', () => {
    const paragraphs = buildLeakPrologue(
      new Set([IMAGE_BEARING_PATH, '/internal/witness_statement_raw.txt']),
      'real_ending',
    );
    expect(paragraphs.some(p => /photographic evidence/i.test(p))).toBe(true);
  });

  it('mentions video footage when a video-bearing file was saved', () => {
    const paragraphs = buildLeakPrologue(
      new Set([VIDEO_BEARING_PATH, '/internal/witness_statement_raw.txt']),
      'real_ending',
    );
    expect(paragraphs.some(p => /video footage/i.test(p))).toBe(true);
  });

  it('combines image and video phrasing into a single line when both are present', () => {
    const paragraphs = buildLeakPrologue(
      new Set([IMAGE_BEARING_PATH, VIDEO_BEARING_PATH]),
      'real_ending',
    );
    const evidenceLine = paragraphs.find(p => /photographic/i.test(p) && /video/i.test(p));
    expect(evidenceLine).toBeDefined();
  });
});

describe('leak prologue ↔ terminal constants drift', () => {
  it('every video-attachment path is recognized as video-bearing', () => {
    for (const fullPath of Object.keys(EVIDENCE_VIDEO_ATTACHMENTS)) {
      const summary = analyzeLeak(new Set([fullPath, '/internal/autopsy_alpha.log']));
      expect(summary.hasVideos, `expected video detection for ${fullPath}`).toBe(true);
    }
  });
});
