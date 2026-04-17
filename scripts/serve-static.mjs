import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const outDir = path.join(repoRoot, 'out');
const cliArgs = process.argv.slice(2);

function getArg(flag, fallback) {
  const index = cliArgs.indexOf(flag);
  if (index === -1) {
    return fallback;
  }

  return cliArgs[index + 1] ?? fallback;
}

const hostname = getArg('--hostname', '127.0.0.1');
const port = Number.parseInt(getArg('--port', '3000'), 10);

if (!Number.isFinite(port) || port <= 0) {
  console.error(`Invalid port: ${getArg('--port', '3000')}`);
  process.exit(1);
}

if (!fs.existsSync(path.join(outDir, 'index.html'))) {
  console.error('Static export not found in ./out. Run "npm run build" before "npm start".');
  process.exit(1);
}

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.ogg': 'audio/ogg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.wav': 'audio/wav',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function resolveFilePath(requestUrl) {
  const requestPathname = new URL(requestUrl, `http://${hostname}:${port}`).pathname;
  let decodedPathname;

  try {
    decodedPathname = decodeURIComponent(requestPathname);
  } catch {
    return null;
  }

  const normalizedPath = path.normalize(decodedPathname).replace(/^(\.\.[/\\])+/, '');
  let filePath = path.join(outDir, normalizedPath === '/' ? 'index.html' : normalizedPath);

  if (!filePath.startsWith(outDir)) {
    return null;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!path.extname(filePath)) {
    const nestedIndex = path.join(filePath, 'index.html');
    const htmlFile = `${filePath}.html`;

    if (fs.existsSync(nestedIndex)) {
      filePath = nestedIndex;
    } else if (fs.existsSync(htmlFile)) {
      filePath = htmlFile;
    }
  }

  return filePath;
}

const server = http.createServer((request, response) => {
  const filePath = resolveFilePath(request.url ?? '/');

  if (!filePath) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        response.writeHead(404);
        response.end('Not found');
        return;
      }

      response.writeHead(500);
      response.end('Internal server error');
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      'Content-Type': mimeTypes[extension] ?? 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    response.end(content);
  });
});

server.listen(port, hostname, () => {
  console.log(`Static export ready at http://${hostname}:${port}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
  });
}
