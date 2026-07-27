/**
 * Stable local-server port selection.
 *
 * The packaged app serves the exported site over HTTP and points the renderer
 * at `http://127.0.0.1:<port>`. Chromium keys Web Storage by the full origin
 * tuple — scheme, host, AND port — so binding to an ephemeral port (`listen(0)`)
 * hands the player a brand-new, empty localStorage bucket on every launch:
 * saved games, settings, statistics, and achievements all silently vanish.
 *
 * Binding to a fixed port keeps the origin constant across launches, which is
 * what makes persistence work at all. The list exists only so a port already
 * taken by unrelated software cannot stop the game from starting; ports are
 * always tried in the same order, so the first free one is deterministic.
 */

/**
 * Candidate ports, tried in order. Chosen from the IANA dynamic/private range
 * (49152-65535 is reserved for ephemeral allocation, so these sit just below it
 * to avoid colliding with the OS's own ephemeral assignments).
 */
const STABLE_PORTS = [43196, 43197, 43198, 43199, 43200];

const DEFAULT_HOST = '127.0.0.1';

/**
 * Binds `server` to the first available port in `ports`.
 *
 * @param {import('http').Server} server - An unbound HTTP server.
 * @param {{ports?: number[], host?: string}} [options]
 * @returns {Promise<number>} The port actually bound.
 */
function listenOnStablePort(server, options = {}) {
  const ports = options.ports || STABLE_PORTS;
  const host = options.host || DEFAULT_HOST;

  return new Promise((resolve, reject) => {
    if (!ports.length) {
      reject(new Error('No candidate ports supplied'));
      return;
    }

    let index = 0;

    const attempt = () => {
      const port = ports[index];

      // Both listeners must be detached on every outcome. Passing the success
      // callback to `listen()` instead would leave it registered after a failed
      // bind, so a later retry would fire the *previous* attempt's callback and
      // resolve with a port this server never bound.
      const cleanup = () => {
        server.removeListener('error', onError);
        server.removeListener('listening', onListening);
      };

      function onError(err) {
        cleanup();

        // Only a busy port is worth retrying; anything else (EACCES, EADDRNOTAVAIL)
        // would fail identically on every candidate.
        if (!err || err.code !== 'EADDRINUSE') {
          reject(err);
          return;
        }

        index += 1;
        if (index >= ports.length) {
          reject(
            new Error(
              `All candidate ports are in use (${ports.join(', ')}). ` +
                'Close the other instance or application using them and relaunch.'
            )
          );
          return;
        }

        attempt();
      }

      function onListening() {
        cleanup();
        resolve(port);
      }

      server.once('error', onError);
      server.once('listening', onListening);
      server.listen(port, host);
    };

    attempt();
  });
}

module.exports = { STABLE_PORTS, listenOnStablePort };
