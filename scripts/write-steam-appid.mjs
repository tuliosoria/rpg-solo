/**
 * Writes `steam_appid.txt` into a target directory.
 *
 * When running a Steam build OUTSIDE the Steam client (local smoke testing),
 * steamworks.js / the Steam SDK looks for a `steam_appid.txt` next to the
 * executable to know which app to initialise. This script drops that file into
 * the unpacked build directory (or any path you pass) so you can test Steam
 * features without uploading first.
 *
 * Usage:
 *   STEAM_APP_ID=1234567 node scripts/write-steam-appid.mjs [targetDir]
 *
 * The file is gitignored (see .gitignore) and must never be committed.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeAppId } from './steamPipe.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');

function main() {
  const appId = process.env.STEAM_APP_ID;
  if (!appId) {
    console.error('STEAM_APP_ID is not set. Example: STEAM_APP_ID=1234567 node scripts/write-steam-appid.mjs');
    process.exit(1);
  }

  let normalized;
  try {
    normalized = normalizeAppId(appId);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }

  const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : repoRoot;

  if (!fs.existsSync(targetDir)) {
    console.error(`Target directory does not exist: ${targetDir}`);
    process.exit(1);
  }

  const target = path.join(targetDir, 'steam_appid.txt');
  fs.writeFileSync(target, `${normalized}\n`, 'utf8');
  console.log(`Wrote ${target} (App ID ${normalized}).`);
}

main();
