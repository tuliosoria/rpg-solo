import { describe, it, expect, afterAll } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import type { Server } from 'node:http';
import { createServer } from '../server';

const CONTENT = resolve(__dirname, '../../../app/data/endingsContent.json');
const REPO_ROOT = resolve(__dirname, '../../../');
const original = readFileSync(CONTENT, 'utf-8');

const server: Server = createServer();
await new Promise<void>(r => server.listen(0, () => r()));
const port = (server.address() as import('node:net').AddressInfo).port;
const base = `http://127.0.0.1:${port}`;

afterAll(() => {
  writeFileSync(CONTENT, original, 'utf-8'); // restore source of truth
  execFileSync('npx', ['tsx', 'scripts/gen-endings-from-content.ts'], { cwd: REPO_ROOT }); // restore generated modules
  return new Promise<void>(r => server.close(() => r()));
});

describe('save endpoint', () => {
  it('GET /api/content returns the source-of-truth JSON', async () => {
    const body = await (await fetch(`${base}/api/content`)).json();
    expect(body.government_scandal.fields.title).toBe('BRAZILIAN GOVERNMENT SCANDAL');
  });

  it('POST /api/save persists an edited title back to JSON', async () => {
    const content = await (await fetch(`${base}/api/content`)).json();
    content.ridiculed.fields.title = 'RIDICULED (edited)';
    const res = await fetch(`${base}/api/save`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    expect(res.status).toBe(200);
    const onDisk = JSON.parse(readFileSync(CONTENT, 'utf-8'));
    expect(onDisk.ridiculed.fields.title).toBe('RIDICULED (edited)');
  });
});
