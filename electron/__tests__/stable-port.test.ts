// @vitest-environment node
import { describe, it, expect, afterEach } from 'vitest';
import http from 'node:http';
import type { AddressInfo } from 'node:net';

const { STABLE_PORT, listenOnStablePort } = require('../stable-port');

describe('stable local server origin', () => {
  const open: http.Server[] = [];
  function createServer(): http.Server {
    const server = http.createServer((_req, res) => res.end('ok'));
    open.push(server);
    return server;
  }
  async function close(server: http.Server) {
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
  async function occupyPort() {
    const server = createServer();
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    return { server, port: (server.address() as AddressInfo).port };
  }
  afterEach(async () => {
    await Promise.all(open.splice(0).map(close));
  });

  it('preserves the original primary storage origin', () => {
    expect(STABLE_PORT).toBe(43196);
  });
  it('binds the same port across restarts', async () => {
    const fixture = await occupyPort();
    await close(fixture.server);
    const firstServer = createServer();
    const first = await listenOnStablePort(firstServer, { port: fixture.port });
    await close(firstServer);
    const second = await listenOnStablePort(createServer(), { port: fixture.port });
    expect(second).toBe(first);
  });
  it('does not open a different save origin during a collision, then recovers on retry', async () => {
    const fixture = await occupyPort();
    const server = createServer();
    const originalListeningListeners = server.listeners('listening');
    await expect(listenOnStablePort(server, { port: fixture.port })).rejects.toMatchObject({
      code: 'EADDRINUSE',
    });
    expect(server.listening).toBe(false);
    expect(server.address()).toBeNull();
    expect(server.listenerCount('error')).toBe(0);
    expect(server.listeners('listening')).toEqual(originalListeningListeners);
    await close(fixture.server);
    expect(await listenOnStablePort(server, { port: fixture.port })).toBe(fixture.port);
    expect((server.address() as AddressInfo).port).toBe(fixture.port);
  });
  it.each([0, -1, 65536, 1.5])('rejects invalid fixed port %s', async port => {
    const server = createServer();
    await expect(listenOnStablePort(server, { port })).rejects.toThrow('fixed local-server port');
    expect(server.listening).toBe(false);
  });
  it('rejects a non-busy bind failure without opening another origin', async () => {
    const fixture = await occupyPort();
    const server = createServer();
    await expect(
      listenOnStablePort(server, { port: fixture.port, host: '203.0.113.1' })
    ).rejects.toMatchObject({ code: 'EADDRNOTAVAIL' });
    expect(server.listening).toBe(false);
  });
});
