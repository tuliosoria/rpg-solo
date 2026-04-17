import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const vitestEntry = path.join(repoRoot, 'node_modules', 'vitest', 'vitest.mjs');

function getInheritedNodeOptions() {
  const nodeOptions = process.env.NODE_OPTIONS?.trim();
  const inheritedOptions = nodeOptions ? [nodeOptions] : [];

  // Node 20 rejects --no-webstorage in NODE_OPTIONS, while newer runtimes allow it.
  if (
    process.allowedNodeEnvironmentFlags?.has('--no-webstorage') &&
    !inheritedOptions.some(option => option.includes('--no-webstorage'))
  ) {
    inheritedOptions.push('--no-webstorage');
  }

  return inheritedOptions.join(' ');
}

const inheritedNodeOptions = getInheritedNodeOptions();

const child = spawn(
  process.execPath,
  [vitestEntry, ...process.argv.slice(2)],
  {
    cwd: repoRoot,
    env: {
      ...process.env,
      ...(inheritedNodeOptions ? { NODE_OPTIONS: inheritedNodeOptions } : {}),
    },
    stdio: 'inherit',
  }
);

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});

child.on('error', (error) => {
  console.error(error);
  process.exit(1);
});
