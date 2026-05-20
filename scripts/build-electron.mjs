import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');

const builderBin =
  process.platform === 'win32'
    ? path.join(repoRoot, 'node_modules', '.bin', 'electron-builder.cmd')
    : path.join(repoRoot, 'node_modules', '.bin', 'electron-builder');

const platformArg =
  process.platform === 'darwin'
    ? '--mac'
    : process.platform === 'win32'
      ? '--win'
      : process.platform === 'linux'
        ? '--linux'
        : null;

const archArg =
  process.arch === 'arm64'
    ? '--arm64'
    : process.arch === 'x64'
      ? '--x64'
      : null;

if (!platformArg) {
  console.error(`Unsupported platform for electron packaging: ${process.platform}`);
  process.exit(1);
}

if (!archArg) {
  console.error(`Unsupported architecture for electron packaging: ${process.arch}`);
  process.exit(1);
}

const hasMacNotarizationCredentials =
  Boolean(process.env.APPLE_ID?.trim()) &&
  Boolean(process.env.APPLE_APP_SPECIFIC_PASSWORD?.trim()) &&
  Boolean(process.env.APPLE_TEAM_ID?.trim());

if (process.platform === 'darwin' && !hasMacNotarizationCredentials) {
  console.warn(
    [
      'macOS notarization credentials are not configured.',
      'The app can still be packaged for local smoke testing,',
      'but downloaded DMGs will be rejected by Gatekeeper until',
      'APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD, and APPLE_TEAM_ID are set',
      'and the machine has a Developer ID Application certificate available.',
    ].join(' ')
  );
}

const passthroughArgs = process.argv.slice(2);

const result = spawnSync(
  builderBin,
  ['--config', 'electron-builder.yml', platformArg, archArg, '--publish', 'never', ...passthroughArgs],
  {
    cwd: repoRoot,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  }
);

if (result.error) {
  console.error(result.error);
}

if (typeof result.status === 'number') {
  process.exit(result.status);
}

process.exit(1);
