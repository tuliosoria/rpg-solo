import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import type { Server } from 'node:http';
import { createServer } from '../server';

const REPO_ROOT = resolve(__dirname, '../../../');
let fixtureRoot: string;
let contentPath: string;
let server: Server;
let base: string;

beforeAll(async () => {
  fixtureRoot = mkdtempSync(join(tmpdir(), 'endings-admin-save-'));
  contentPath = join(fixtureRoot, 'app/data/endingsContent.json');
  mkdirSync(join(fixtureRoot, 'app/data'), { recursive: true });
  copyFileSync(join(REPO_ROOT, 'app/data/endingsContent.json'), contentPath);
  copyFileSync(join(REPO_ROOT, '.prettierrc'), join(fixtureRoot, '.prettierrc'));
  server = createServer({ repoRoot: fixtureRoot });
  await new Promise<void>(r => server.listen(0, '127.0.0.1', () => r()));
  const port = (server.address() as import('node:net').AddressInfo).port;
  base = `http://127.0.0.1:${port}`;
});

afterAll(async () => {
  try {
    if (server?.listening) await new Promise<void>(r => server.close(() => r()));
  } finally {
    if (fixtureRoot) rmSync(fixtureRoot, { recursive: true, force: true });
  }
});

describe('save endpoint', () => {
  it('GET /api/content returns the source-of-truth JSON', async () => {
    const body = await (await fetch(`${base}/api/content`)).json();
    expect(body.government_scandal.fields.title).toBe('BRAZILIAN GOVERNMENT SCANDAL');
  });

  it('POST /api/save persists content and regenerates English, Portuguese and Spanish modules', async () => {
    const content = await (await fetch(`${base}/api/content`)).json();
    content.ridiculed.fields.title = 'RIDICULED (edited)';
    content.ridiculed.fieldLocales = {
      title: { 'pt-BR': 'RIDICULARIZADO (editado)', es: 'RIDICULIZADO (editado)' },
    };
    const res = await fetch(`${base}/api/save`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true });
    const onDisk = JSON.parse(readFileSync(contentPath, 'utf-8'));
    expect(onDisk).toEqual(content);
    const generated = readFileSync(
      join(fixtureRoot, 'app/engine/generated/endingsContent.generated.ts'),
      'utf-8'
    );
    expect(generated).toContain('RIDICULED (edited)');
    const translations = readFileSync(
      join(fixtureRoot, 'app/i18n/generated/endingsSupplement.generated.ts'),
      'utf-8'
    );
    expect(translations).toContain("'RIDICULED (edited)': 'RIDICULARIZADO (editado)'");
    expect(translations).toContain("'RIDICULED (edited)': 'RIDICULIZADO (editado)'");
  });
});
