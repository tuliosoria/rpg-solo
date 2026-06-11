import { describe, it, expect } from 'vitest';
import {
  STEAM_PLATFORMS,
  PLATFORM_CONTENT_DIRS,
  normalizeAppId,
  depotIdFor,
  resolveDepots,
  buildDepotVdf,
  buildAppVdf,
  buildVdfSet,
} from '../steamPipe.mjs';

describe('steamPipe', () => {
  describe('normalizeAppId', () => {
    it('accepts positive integer strings and numbers', () => {
      expect(normalizeAppId('1234567')).toBe(1234567);
      expect(normalizeAppId(480)).toBe(480);
      expect(normalizeAppId('  480  ')).toBe(480);
    });

    it('rejects non-positive, non-integer, and junk values', () => {
      expect(() => normalizeAppId('0')).toThrow();
      expect(() => normalizeAppId('-5')).toThrow();
      expect(() => normalizeAppId('12.5')).toThrow();
      expect(() => normalizeAppId('abc')).toThrow();
      expect(() => normalizeAppId('')).toThrow();
      expect(() => normalizeAppId(undefined)).toThrow();
    });
  });

  describe('depotIdFor', () => {
    it('uses the Steamworks +1/+2/+3 convention', () => {
      expect(depotIdFor(1234560, 'windows')).toBe(1234561);
      expect(depotIdFor(1234560, 'mac')).toBe(1234562);
      expect(depotIdFor(1234560, 'linux')).toBe(1234563);
    });

    it('throws on unknown platform', () => {
      expect(() => depotIdFor(1234560, 'switch')).toThrow(/Unknown Steam platform/);
    });
  });

  describe('resolveDepots', () => {
    it('returns all three platforms in canonical order by default', () => {
      const depots = resolveDepots({ appId: 1000 });
      expect(depots.map(d => d.platform)).toEqual(STEAM_PLATFORMS);
      expect(depots.map(d => d.depotId)).toEqual([1001, 1002, 1003]);
      expect(depots.map(d => d.contentDir)).toEqual([
        PLATFORM_CONTENT_DIRS.windows,
        PLATFORM_CONTENT_DIRS.mac,
        PLATFORM_CONTENT_DIRS.linux,
      ]);
    });

    it('filters to a requested subset but preserves canonical order', () => {
      const depots = resolveDepots({ appId: 1000, platforms: ['linux', 'windows'] });
      expect(depots.map(d => d.platform)).toEqual(['windows', 'linux']);
      expect(depots.map(d => d.depotId)).toEqual([1001, 1003]);
    });

    it('throws on an unknown platform in the subset', () => {
      expect(() => resolveDepots({ appId: 1000, platforms: ['windows', 'ps5'] })).toThrow(/Unknown Steam platform/);
    });
  });

  describe('buildDepotVdf', () => {
    it('produces a DepotBuildConfig with the depot id and recursive file mapping', () => {
      const vdf = buildDepotVdf({ depotId: 1234561, contentDir: 'win-unpacked' });
      expect(vdf).toContain('"DepotBuildConfig"');
      expect(vdf).toContain('"DepotID"		"1234561"'.replace(/\s+/g, ' ')); // tolerate tabs
      expect(vdf).toContain('"DepotID"');
      expect(vdf).toContain('1234561');
      expect(vdf).toContain('"LocalPath"');
      expect(vdf).toContain('./win-unpacked/*');
      expect(vdf).toContain('"recursive"');
      expect(vdf).toContain('"FileExclusion"');
      expect(vdf).toContain('*.pdb');
    });

    it('requires a content dir', () => {
      expect(() => buildDepotVdf({ depotId: 1234561, contentDir: '' })).toThrow(/contentDir/);
    });
  });

  describe('buildAppVdf', () => {
    const depots = [{ depotId: 1001 }, { depotId: 1002 }];

    it('produces an appbuild block referencing each depot vdf', () => {
      const vdf = buildAppVdf({ appId: 1000, description: 'v1.0.0', depots });
      expect(vdf).toContain('"appbuild"');
      expect(vdf).toContain('"appid"');
      expect(vdf).toContain('1000');
      expect(vdf).toContain('"desc"');
      expect(vdf).toContain('v1.0.0');
      expect(vdf).toContain('depot_build_1001.vdf');
      expect(vdf).toContain('depot_build_1002.vdf');
    });

    it('defaults setlive to empty (upload only, do not auto-promote)', () => {
      const vdf = buildAppVdf({ appId: 1000, description: 'v1.0.0', depots });
      expect(vdf).toMatch(/"setlive"\s+""/);
    });

    it('sets the live branch when provided', () => {
      const vdf = buildAppVdf({ appId: 1000, description: 'v1.0.0', depots, branch: 'beta' });
      expect(vdf).toMatch(/"setlive"\s+"beta"/);
    });

    it('requires a description and at least one depot', () => {
      expect(() => buildAppVdf({ appId: 1000, description: '', depots })).toThrow(/description/);
      expect(() => buildAppVdf({ appId: 1000, description: 'v1', depots: [] })).toThrow(/depot/);
    });
  });

  describe('buildVdfSet', () => {
    it('emits one app_build.vdf plus a depot vdf per platform', () => {
      const files = buildVdfSet({ appId: 1234560, description: 'v1.0.0' });
      expect(Object.keys(files).sort()).toEqual([
        'app_build.vdf',
        'depot_build_1234561.vdf',
        'depot_build_1234562.vdf',
        'depot_build_1234563.vdf',
      ]);
      // App vdf references every depot file it emits.
      for (const name of Object.keys(files)) {
        if (name === 'app_build.vdf') continue;
        expect(files['app_build.vdf']).toContain(name);
      }
    });

    it('honours a platform subset', () => {
      const files = buildVdfSet({ appId: 1234560, description: 'v1.0.0', platforms: ['windows'] });
      expect(Object.keys(files).sort()).toEqual(['app_build.vdf', 'depot_build_1234561.vdf']);
    });
  });
});
