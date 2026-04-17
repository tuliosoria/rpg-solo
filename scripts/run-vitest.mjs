import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const vitestEntry = path.join(repoRoot, 'node_modules', 'vitest', 'vitest.mjs');
const nodeOptions = process.env.NODE_OPTIONS?.trim();
const inheritedNodeOptions = nodeOptions ? `${nodeOptions} --no-webstorage` : '--no-webstorage';

const child = spawn(
  process.execPath,
  [vitestEntry, ...process.argv.slice(2)],
  {
    cwd: repoRoot,
    env: {
      ...process.env,
      NODE_OPTIONS: inheritedNodeOptions,
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
