const path = require('path');
const { spawnSync } = require('child_process');

function isReleaseTag() {
  if (process.env.GITHUB_REF?.startsWith('refs/tags/v')) {
    return true;
  }

  return process.env.GITHUB_REF_TYPE === 'tag' && /^v/.test(process.env.GITHUB_REF_NAME || '');
}

module.exports = async function beforeBuild() {
  const repoRoot = path.resolve(__dirname, '..');
  const prepareScript = path.join(repoRoot, 'scripts', 'prepare-steam-app-id.mjs');
  const requireSteamAppId = process.env.REQUIRE_STEAM_APP_ID || (isReleaseTag() ? '1' : '0');
  const expectedTag = process.env.GITHUB_REF_NAME;

  if (isReleaseTag() && expectedTag) {
    const { version } = require('../package.json');
    if (`v${version}` !== expectedTag) {
      throw new Error(`Release tag ${expectedTag} does not match package version ${version}`);
    }
  }

  const result = spawnSync(process.execPath, [prepareScript], {
    cwd: repoRoot,
    env: {
      ...process.env,
      REQUIRE_STEAM_APP_ID: requireSteamAppId,
    },
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error('Steam App ID preparation failed');
  }
};
