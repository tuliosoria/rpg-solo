const { execFileSync } = require('child_process');

/**
 * Remove extended attributes before codesign runs.
 * macOS packaging can fail when copied assets carry Finder metadata.
 */
async function stripExtendedAttributes(context) {
  if (process.platform !== 'darwin') {
    return;
  }

  execFileSync('xattr', ['-cr', context.appOutDir]);
}

exports.default = stripExtendedAttributes;
module.exports = stripExtendedAttributes;
module.exports.default = stripExtendedAttributes;
