import { createServer as createHttpServer, type Server, type IncomingMessage, type ServerResponse } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';

import {
  ENDINGS,
  determineEnding,
  analyzeDossier,
  type EndingId,
} from '../../app/engine/endings';
import { filesByCategory, exampleSaveSet, describeRuleFor } from './rules';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, 'public');

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

function sendJson(res: ServerResponse, status: number, data: unknown): void {
  const payload = JSON.stringify(data);
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  res.end(payload);
}

async function readBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf-8'));
}

function buildModel() {
  const ids = Object.keys(ENDINGS) as EndingId[];
  const endings: Record<string, unknown> = {};
  const examples: Record<string, string[]> = {};
  for (const id of ids) {
    endings[id] = { id, rule: describeRuleFor(id), ...ENDINGS[id] };
    examples[id] = exampleSaveSet(id) ?? [];
  }
  return { endings, categories: filesByCategory(), examples };
}

async function serveStatic(res: ServerResponse, urlPath: string): Promise<void> {
  const rel = urlPath === '/' ? '/index.html' : urlPath;
  try {
    const filePath = join(PUBLIC_DIR, rel);
    const buf = await readFile(filePath);
    res.writeHead(200, { 'content-type': MIME[extname(filePath)] ?? 'application/octet-stream' });
    res.end(buf);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('Not found');
  }
}

export function createServer(): Server {
  return createHttpServer(async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    try {
      if (req.method === 'GET' && url.pathname === '/api/model') {
        return sendJson(res, 200, buildModel());
      }
      if (req.method === 'POST' && url.pathname === '/api/simulate') {
        const body = (await readBody(req)) as { files?: string[] };
        const files = new Set(body.files ?? []);
        const endingId = determineEnding(files);
        const { counts } = analyzeDossier(files);
        return sendJson(res, 200, { endingId, counts, matchedRule: describeRuleFor(endingId) });
      }
      if (req.method === 'GET' && !url.pathname.startsWith('/api/')) {
        return void (await serveStatic(res, url.pathname));
      }
      sendJson(res, 404, { error: 'not found' });
    } catch (err) {
      sendJson(res, 500, { error: String(err) });
    }
  });
}

// Entry point when run directly: `npm run admin`.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const port = Number(process.env.PORT ?? 4599);
  createServer().listen(port, () => {
    console.log(`Endings admin tool → http://localhost:${port}`);
  });
}
