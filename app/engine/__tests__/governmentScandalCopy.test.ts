import { describe, it, expect } from 'vitest';
import {
  hasSmokingGunContact,
  resolveGovernmentScandalNarrative,
  resolveGovernmentScandalAolBody,
  SMOKING_GUN_NARRATIVE_INTRO,
  SMOKING_GUN_AOL_PURPOSE,
} from '../governmentScandalCopy';

const MUNDANE_INTRO = 'MUNDANE_INTRO';
const MUNDANE_PURPOSE = 'MUNDANE_PURPOSE';
const baseNarrative = [MUNDANE_INTRO, 'line-1', 'line-2'];
const baseBody = ['body-0', MUNDANE_PURPOSE, 'body-2'];

describe('hasSmokingGunContact', () => {
  it('is true when jardim_andere is present (any path)', () => {
    expect(hasSmokingGunContact(new Set(['/internal/jardim_andere_incident.txt']))).toBe(true);
  });

  it('is true when the specimen-recovery report is present', () => {
    expect(hasSmokingGunContact(new Set(['/admin/incident_report_1996_01_VG.txt']))).toBe(true);
  });

  it('is false for pure-logistics military files', () => {
    expect(
      hasSmokingGunContact(
        new Set(['/storage/assets/transport_log_96.txt', '/ops/assessments/initial_response_orders.txt'])
      )
    ).toBe(false);
  });

  it('is false for empty or nullish input', () => {
    expect(hasSmokingGunContact(new Set())).toBe(false);
    expect(hasSmokingGunContact(undefined)).toBe(false);
    expect(hasSmokingGunContact(null)).toBe(false);
  });
});

describe('resolveGovernmentScandalNarrative', () => {
  it('swaps narrative[0] when a smoking gun is present', () => {
    const out = resolveGovernmentScandalNarrative(baseNarrative, new Set(['/internal/jardim_andere_incident.txt']));
    expect(out[0]).toBe(SMOKING_GUN_NARRATIVE_INTRO);
    expect(out.slice(1)).toEqual(baseNarrative.slice(1));
  });

  it('returns the base narrative unchanged for mundane dossiers', () => {
    const out = resolveGovernmentScandalNarrative(baseNarrative, new Set(['/storage/assets/transport_log_96.txt']));
    expect(out).toEqual(baseNarrative);
  });
});

describe('resolveGovernmentScandalAolBody', () => {
  it('swaps body[1] when a smoking gun is present', () => {
    const out = resolveGovernmentScandalAolBody(baseBody, new Set(['/admin/incident_report_1996_01_VG.txt']));
    expect(out[1]).toBe(SMOKING_GUN_AOL_PURPOSE);
    expect(out[0]).toBe('body-0');
    expect(out[2]).toBe('body-2');
  });

  it('returns the base body unchanged for mundane dossiers', () => {
    const out = resolveGovernmentScandalAolBody(baseBody, undefined);
    expect(out).toEqual(baseBody);
  });
});
