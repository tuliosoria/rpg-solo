/**
 * SteamPipe helpers (pure, dependency-free).
 *
 * Generates the VDF scripts SteamPipe (`steamcmd +run_app_build`) needs to
 * upload a build, and resolves the conventional depot layout for this game.
 *
 * The CI path (.github/workflows/steam-release.yml) uses the game-ci
 * steam-deploy action, which generates equivalent VDFs internally. This module
 * powers the LOCAL deploy path (scripts/steam-local-deploy.mjs) and is kept
 * pure so it can be unit tested without steamcmd, Steam, or the filesystem.
 *
 * Depot convention (Steamworks default): for an app with ID N, the platform
 * depots are N+1 (Windows), N+2 (macOS), N+3 (Linux). These IDs must match the
 * depots you create in the Steamworks partner site. See docs/STEAM_RELEASE.md.
 */

/** Platform keys in stable, documented order (depot offset = index + 1). */
export const STEAM_PLATFORMS = ['windows', 'mac', 'linux'];

/**
 * electron-builder unpacked output directory for each platform, relative to
 * the electron-builder `output` dir (`dist/`). These are the *runnable* app
 * trees Steam expects in a depot — not the installers.
 */
export const PLATFORM_CONTENT_DIRS = {
  windows: 'win-unpacked',
  mac: 'mac',
  linux: 'linux-unpacked',
};

const DEPOT_OFFSET = {
  windows: 1,
  mac: 2,
  linux: 3,
};

/** Files that should never ship in a Steam depot. */
export const DEFAULT_DEPOT_EXCLUSIONS = ['*.pdb', '*.map', '**/*.DS_Store'];

/**
 * Validate and normalise a Steam App ID.
 * @param {unknown} value
 * @returns {number} the parsed positive integer App ID
 */
export function normalizeAppId(value) {
  const raw = typeof value === 'string' ? value.trim() : value;
  const appId = Number(raw);
  if (!Number.isInteger(appId) || appId <= 0) {
    throw new Error(`Invalid Steam App ID: ${JSON.stringify(value)} (expected a positive integer)`);
  }
  return appId;
}

/**
 * Resolve the depot ID for a given platform under an app.
 * @param {number} appId
 * @param {string} platform - one of STEAM_PLATFORMS
 * @returns {number}
 */
export function depotIdFor(appId, platform) {
  const id = normalizeAppId(appId);
  const offset = DEPOT_OFFSET[platform];
  if (!offset) {
    throw new Error(`Unknown Steam platform: ${JSON.stringify(platform)}`);
  }
  return id + offset;
}

/**
 * Resolve the full depot layout for the platforms that were actually built.
 * @param {object} opts
 * @param {number|string} opts.appId
 * @param {string[]} [opts.platforms] - subset of STEAM_PLATFORMS (default: all)
 * @returns {Array<{platform:string, depotId:number, contentDir:string}>}
 */
export function resolveDepots({ appId, platforms = STEAM_PLATFORMS } = {}) {
  const id = normalizeAppId(appId);
  const unknown = platforms.filter(p => !STEAM_PLATFORMS.includes(p));
  if (unknown.length > 0) {
    throw new Error(`Unknown Steam platform(s): ${unknown.join(', ')}`);
  }
  // Preserve the canonical order regardless of input ordering.
  return STEAM_PLATFORMS.filter(p => platforms.includes(p)).map(platform => ({
    platform,
    depotId: depotIdFor(id, platform),
    contentDir: PLATFORM_CONTENT_DIRS[platform],
  }));
}

function quote(value) {
  return `"${String(value).replace(/"/g, '\\"')}"`;
}

/**
 * Build a single depot's VDF (`DepotBuildConfig`).
 * @param {object} depot
 * @param {number} depot.depotId
 * @param {string} depot.contentDir - path (relative to contentroot) of the build tree
 * @param {string[]} [depot.exclusions]
 * @returns {string}
 */
export function buildDepotVdf({ depotId, contentDir, exclusions = DEFAULT_DEPOT_EXCLUSIONS }) {
  const id = normalizeAppId(depotId);
  if (!contentDir || typeof contentDir !== 'string') {
    throw new Error('buildDepotVdf requires a non-empty contentDir');
  }
  const exclusionLines = exclusions.map(pattern => `\t${quote('FileExclusion')} ${quote(pattern)}`);
  return [
    `${quote('DepotBuildConfig')}`,
    '{',
    `\t${quote('DepotID')} ${quote(id)}`,
    `\t${quote('FileMapping')}`,
    '\t{',
    `\t\t${quote('LocalPath')} ${quote(`./${contentDir}/*`)}`,
    `\t\t${quote('DepotPath')} ${quote('.')}`,
    `\t\t${quote('recursive')} ${quote('1')}`,
    '\t}',
    ...exclusionLines,
    '}',
    '',
  ].join('\n');
}

/**
 * Build the top-level app build VDF (`appbuild`).
 * @param {object} opts
 * @param {number|string} opts.appId
 * @param {string} opts.description - build description (use the version, e.g. v1.0.0)
 * @param {Array<{depotId:number}>} opts.depots
 * @param {string} [opts.branch] - Steam branch to set live (empty string = none/default-unset)
 * @param {string} [opts.contentRoot]
 * @param {string} [opts.buildOutput]
 * @returns {string}
 */
export function buildAppVdf({
  appId,
  description,
  depots,
  branch = '',
  contentRoot = '../dist',
  buildOutput = './output',
}) {
  const id = normalizeAppId(appId);
  if (!description || typeof description !== 'string') {
    throw new Error('buildAppVdf requires a non-empty description');
  }
  if (!Array.isArray(depots) || depots.length === 0) {
    throw new Error('buildAppVdf requires at least one depot');
  }
  const depotLines = depots.map(({ depotId }) => {
    const dId = normalizeAppId(depotId);
    return `\t\t${quote(dId)} ${quote(`depot_build_${dId}.vdf`)}`;
  });
  return [
    `${quote('appbuild')}`,
    '{',
    `\t${quote('appid')} ${quote(id)}`,
    `\t${quote('desc')} ${quote(description)}`,
    `\t${quote('buildoutput')} ${quote(buildOutput)}`,
    `\t${quote('contentroot')} ${quote(contentRoot)}`,
    // setlive empty => upload only, do not auto-set-live (safer default).
    `\t${quote('setlive')} ${quote(branch)}`,
    `\t${quote('depots')}`,
    '\t{',
    ...depotLines,
    '\t}',
    '}',
    '',
  ].join('\n');
}

/**
 * Produce the complete set of VDF files for a build as in-memory strings,
 * keyed by filename. Callers write these to disk before invoking steamcmd.
 * @param {object} opts - see buildAppVdf + resolveDepots
 * @returns {Record<string,string>}
 */
export function buildVdfSet({ appId, description, platforms = STEAM_PLATFORMS, branch = '' }) {
  const depots = resolveDepots({ appId, platforms });
  const files = {
    'app_build.vdf': buildAppVdf({ appId, description, depots, branch }),
  };
  for (const depot of depots) {
    files[`depot_build_${depot.depotId}.vdf`] = buildDepotVdf(depot);
  }
  return files;
}
