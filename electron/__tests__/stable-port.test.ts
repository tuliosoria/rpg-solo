import { describe, it, expect, afterEach } from 'vitest';
import http from 'node:http';

const { STABLE_PORTS, listenOnStablePort } = require('../stable-port');

/**
 * These bind real loopback sockets rather than mocking, because the property
 * under test is exactly the OS-level bind behaviour: the packaged app must land
 * on the SAME origin every launch or Chromium hands the renderer an empty
 * localStorage and the player loses every save, setting, and achievement.
 */
describe('stable local server port', () => {
  const open: http.Server[] = [];

  function createServer(): http.Server {
    const server = http.createServer((_req, res) => res.end('ok'));
    open.push(server);
    return server;
  }

  function closeAll(): Promise<void> {
    return new Promise(resolve => {
      let remaining = open.length;
      if (remaining === 0) {
        resolve();
        return;
      }
      for (const server of open.splice(0)) {
        server.close(() => {
          remaining -= 1;
          if (remaining === 0) resolve();
        });
      }
    });
  }

  afterEach(async () => {
    await closeAll();
  });

  it('exposes a fixed, non-ephemeral candidate list', () => {
    expect(STABLE_PORTS.length).toBeGreaterThan(1);
    for (const port of STABLE_PORTS) {
      expect(Number.isInteger(port)).toBe(true);
      // Below the IANA ephemeral range, so the OS will not hand this port out
      // from under us to some unrelated process.
      expect(port).toBeGreaterThan(1024);
      expect(port).toBeLessThan(49152);
    }
  });

  it('binds the first candidate port when it is free', async () => {
    const port = await listenOnStablePort(createServer(), { ports: [43290, 43291] });

    expect(port).toBe(43290);
  });

  it('returns the same port across restarts, so the origin is stable', async () => {
    const first = await listenOnStablePort(createServer(), { ports: [43292, 43293] });
    await closeAll();
    const second = await listenOnStablePort(createServer(), { ports: [43292, 43293] });

    // This is the whole point: identical origin => localStorage survives.
    expect(second).toBe(first);
  });

  it('falls through to the next candidate when a port is already taken', async () => {
    const squatter = createServer();
    await new Promise<void>(resolve => squatter.listen(43294, '127.0.0.1', resolve));

    const port = await listenOnStablePort(createServer(), { ports: [43294, 43295] });

    expect(port).toBe(43295);
  });

  it('rejects with an actionable message when every candidate is taken', async () => {
    const squatterA = createServer();
    const squatterB = createServer();
    await new Promise<void>(resolve => squatterA.listen(43296, '127.0.0.1', resolve));
    await new Promise<void>(resolve => squatterB.listen(43297, '127.0.0.1', resolve));

    await expect(
      listenOnStablePort(createServer(), { ports: [43296, 43297] })
    ).rejects.toThrow(/All candidate ports are in use/);
  });

  it('rejects rather than retrying when the failure is not a busy port', async () => {
    // An unroutable bind address fails with EADDRNOTAVAIL, which would fail
    // identically on every candidate — retrying would just stall startup.
    await expect(
      listenOnStablePort(createServer(), { ports: [43298, 43299], host: '203.0.113.1' })
    ).rejects.toThrow();
  });
});
