/**
 * Local SteamPipe deploy (manual upload from a developer machine).
 *
 * This is the manual counterpart to the CI deploy job. Use it for the first
 * upload to a beta branch, or when you don't want to cut a git tag. It:
 *   1. validates inputs and that the unpacked builds exist under dist/,
 *   2. writes app_build.vdf + depot_build_*.vdf (via scripts/steamPipe.mjs),
 *   3. invokes steamcmd +run_app_build to upload to Steam.
 *
 * Prerequisites:
 *   - steamcmd installed and on PATH (or set STEAMCMD).
 *   - A Steam BUILD account (NOT your personal account) created in Steamworks.
 *   - One prior interactive `steamcmd +login <user>` so credentials are cached.
 *   - Built, unpacked apps in dist/ (run: npm run electron:build:all).
 *
 * Usage:
 *   STEAM_APP_ID=1234567 STEAM_BUILD_USER=mybuildacct \
 *     node scripts/steam-local-deploy.mjs --branch beta --desc v1.0.0
 *
 * Flags:
 *   --branch <name>   Steam branch to set live after upload (default: none — upload only).
 *   --desc <text>     Build description (default: package.json version).
 *   --platforms a,b   Comma list subset of windows,mac,linux (default: those present in dist/).
 *   --dry-run         Generate VDFs and print the steamcmd command, but do not upload.
 *
 * SAFETY: with no --branch, the build uploads but is NOT set live. You promote
 * it from the Steamworks "Builds" page. This avoids accidentally shipping to
 * players. Read docs/STEAM_RELEASE.md before first use.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  STEAM_PLATFORMS,
  PLATFORM_CONTENT_DIRS,
  resolveDepots,
  buildVdfSet,
  normalizeAppId,
} from './steamPipe.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const distDir = path.join(repoRoot, 'dist');
const vdfDir = path.join(distDir, 'steampipe');

function parseArgs(argv) {
  const args = { branch: '', desc: '', platforms: null, dryRun: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--branch') args.branch = argv[++i] ?? '';
    else if (arg === '--desc') args.desc = argv[++i] ?? '';
    else if (arg === '--platforms') args.platforms = (argv[++i] ?? '').split(',').map(s => s.trim()).filter(Boolean);
    else if (arg === '--dry-run') args.dryRun = true;
  }
  return args;
}

function fail(message) {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
}

function detectBuiltPlatforms() {
  return STEAM_PLATFORMS.filter(platform => {
    const dir = path.join(distDir, PLATFORM_CONTENT_DIRS[platform]);
    return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
  });
}

function resolveSteamcmd() {
  return process.env.STEAMCMD?.trim() || 'steamcmd';
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  const appIdRaw = process.env.STEAM_APP_ID;
  if (!appIdRaw) fail('STEAM_APP_ID is not set.');
  let appId;
  try {
    appId = normalizeAppId(appIdRaw);
  } catch (error) {
    fail(error.message);
  }

  const buildUser = process.env.STEAM_BUILD_USER?.trim();
  if (!buildUser && !args.dryRun) {
    fail('STEAM_BUILD_USER is not set (your Steam build account name).');
  }

  let description = args.desc;
  if (!description) {
    try {
      description = `v${require_version()}`;
    } catch {
      description = 'local-build';
    }
  }

  const present = detectBuiltPlatforms();
  if (present.length === 0) {
    fail(
      `No unpacked builds found under ${distDir}. ` +
        'Run `npm run electron:build:all` first (looking for ' +
        STEAM_PLATFORMS.map(p => PLATFORM_CONTENT_DIRS[p]).join(', ') +
        ').'
    );
  }

  let platforms = args.platforms ?? present;
  const missing = platforms.filter(p => !present.includes(p));
  if (missing.length > 0) {
    fail(`Requested platform(s) not built: ${missing.join(', ')}. Present: ${present.join(', ')}.`);
  }

  const depots = resolveDepots({ appId, platforms });
  const files = buildVdfSet({ appId, description, platforms, branch: args.branch });

  fs.mkdirSync(vdfDir, { recursive: true });
  fs.mkdirSync(path.join(vdfDir, 'output'), { recursive: true });
  for (const [name, contents] of Object.entries(files)) {
    fs.writeFileSync(path.join(vdfDir, name), contents, 'utf8');
  }

  console.log(`App ID:       ${appId}`);
  console.log(`Description:  ${description}`);
  console.log(`Branch:       ${args.branch || '(none — upload only, promote in Steamworks)'}`);
  console.log('Depots:');
  for (const depot of depots) {
    console.log(`  - ${depot.depotId}  ←  dist/${depot.contentDir}`);
  }
  console.log(`VDFs written: ${vdfDir}`);

  const steamcmd = resolveSteamcmd();
  const appBuildPath = path.join(vdfDir, 'app_build.vdf');
  const steamcmdArgs = [
    '+login',
    buildUser ?? '<STEAM_BUILD_USER>',
    '+run_app_build',
    appBuildPath,
    '+quit',
  ];

  if (args.dryRun) {
    console.log('\n[dry-run] Would run:');
    console.log(`  ${steamcmd} ${steamcmdArgs.join(' ')}`);
    return;
  }

  console.log(`\nRunning: ${steamcmd} +login ${buildUser} +run_app_build ${appBuildPath} +quit\n`);
  const result = spawnSync(steamcmd, steamcmdArgs, {
    cwd: repoRoot,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.error) {
    if (result.error.code === 'ENOENT') {
      fail(
        `Could not find "${steamcmd}". Install Valve's steamcmd and ensure it is on PATH, ` +
          'or set the STEAMCMD environment variable to its full path.'
      );
    }
    fail(result.error.message);
  }
  process.exit(typeof result.status === 'number' ? result.status : 1);
}

function require_version() {
  const pkg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
  return pkg.version;
}

main();
