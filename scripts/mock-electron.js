/**
 * Creates a stub electron package in node_modules so that
 * require('electron') resolves during vitest runs.
 *
 * Electron is only available inside an Electron runtime, so tests
 * that exercise electron/ source files need this stub for the
 * CJS require('electron') call to succeed.
 */
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'node_modules', 'electron');

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(
  path.join(dir, 'package.json'),
  JSON.stringify({ name: 'electron', version: '0.0.0-mock', main: 'index.js' }, null, 2)
);

fs.writeFileSync(
  path.join(dir, 'index.js'),
  `// Auto-generated stub for testing – see scripts/mock-electron.js
module.exports = {
  Tray: function Tray() {},
  Menu: { buildFromTemplate: function() { return {}; } },
  nativeImage: {
    createFromPath: function() { return { isEmpty: function() { return false; } }; },
    createEmpty:    function() { return { isEmpty: function() { return false; } }; }
  },
  app: {
    quit: function() {},
    getPath: function() { return '/mock/path'; }
  },
  screen: {
    getAllDisplays: function() {
      return [{ bounds: { x: 0, y: 0, width: 1920, height: 1080 } }];
    }
  }
};
`
);

console.log('✓ electron stub created in node_modules/electron');
