/**
 * Stable local-server port selection.
 *
 * The packaged app serves the exported site over HTTP and points the renderer
 * at `http://127.0.0.1:<port>`. Chromium keys Web Storage by the full origin
 * tuple — scheme, host, AND port — so binding to an ephemeral port (`listen(0)`)
 * hands the player a brand-new, empty localStorage bucket on every launch:
 * saved games, settings, statistics, and achievements all silently vanish.
 *
 * Binding to one fixed port keeps the origin constant across launches. A busy
 * port must stop startup: falling back to another port hides the player's saves
 * and lets the next session write into a different storage bucket.
 */

/**
 * Keep the existing primary origin so this change preserves existing saves.
 */
const STABLE_PORT = 43196;

const DEFAULT_HOST = '127.0.0.1';

/**
 * Binds `server` to the fixed storage origin, or rejects without a fallback.
 *
 * @param {import('http').Server} server - An unbound HTTP server.
 * @param {{port?: number, host?: string}} [options] Port override for isolated tests.
 * @returns {Promise<number>} The port actually bound.
 */
function listenOnStablePort(server, options = {}) {
  const port = options.port ?? STABLE_PORT;
  const host = options.host || DEFAULT_HOST;

  return new Promise((resolve, reject) => {
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      reject(new Error('A fixed local-server port is required'));
      return;
    }

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

      if (err?.code === 'EADDRINUSE') {
        const error = new Error(
          `Port ${port} is already in use. Close the other instance or application using it and relaunch. ` +
            'The game will not switch ports because that would hide your saved progress. Your existing saves have not been changed.'
        );
        error.code = 'EADDRINUSE';
        reject(error);
      } else {
        reject(err);
      }
    }

    function onListening() {
      cleanup();
      resolve(port);
    }

    server.once('error', onError);
    server.once('listening', onListening);
    server.listen(port, host);
  });
}

module.exports = { STABLE_PORT, listenOnStablePort };
