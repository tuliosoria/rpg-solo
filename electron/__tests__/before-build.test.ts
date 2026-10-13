// @vitest-environment node
import { afterEach, describe, expect, it } from 'vitest';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const fixtures: string[] = [];

afterEach(() => {
  for (const fixture of fixtures.splice(0)) rmSync(fixture, { recursive: true, force: true });
});

function packageFixture(appId: string, tag: string) {
  const root = mkdtempSync(path.join(tmpdir(), 'varginha-release-'));
  fixtures.push(root);
  mkdirSync(path.join(root, 'electron'));
  mkdirSync(path.join(root, 'scripts'));
  copyFileSync('electron/before-build.js', path.join(root, 'electron/before-build.js'));
  copyFileSync(
    'scripts/prepare-steam-app-id.mjs',
    path.join(root, 'scripts/prepare-steam-app-id.mjs')
  );
  writeFileSync(path.join(root, 'package.json'), JSON.stringify({ version: '1.0.0' }));
  const result = spawnSync(
    process.execPath,
    [
      '-e',
      "require('./electron/before-build.js')().then(result => { require('node:assert/strict').equal(result, true, 'builder must continue packaging runtime dependencies'); }).catch(e => { console.error(e.message); process.exit(1); })",
    ],
    {
      cwd: root,
      encoding: 'utf8',
      env: {
        ...process.env,
        STEAM_APP_ID: appId,
        REQUIRE_STEAM_APP_ID: '',
        GITHUB_REF: tag ? `refs/tags/${tag}` : 'refs/heads/main',
        GITHUB_REF_TYPE: tag ? 'tag' : 'branch',
        GITHUB_REF_NAME: tag || 'main',
      },
    }
  );
  return { root, result };
}

describe('desktop release preparation', () => {
  it('embeds a configured App ID for a matching release tag', () => {
    const { root, result } = packageFixture('1234567', 'v1.0.0');
    expect(result.status, result.stderr).toBe(0);
    expect(readFileSync(path.join(root, 'electron/steam-app-id.generated.js'), 'utf8')).toContain(
      'module.exports = "1234567"'
    );
  });

  it('keeps dependency packaging enabled for an ordinary build with a configured App ID', () => {
    const { result } = packageFixture('1234567', '');
    expect(result.status, result.stderr).toBe(0);
  });

  it('rejects tagged packaging without an App ID', () => {
    const { result } = packageFixture('', 'v1.0.0');
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('STEAM_APP_ID is required');
  });

  it('rejects a release tag that differs from the package version', () => {
    const { result } = packageFixture('1234567', 'v2.0.0');
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('does not match package version');
  });

  it('allows ordinary validation builds without Steam configuration', () => {
    const { result } = packageFixture('', '');
    expect(result.status, result.stderr).toBe(0);
  });
});
