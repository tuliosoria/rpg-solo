#!/usr/bin/env node

const { runVitestSuite } = require('./story-tools-common');

runVitestSuite([
  'app/engine/__tests__/story-consistency.test.ts',
  'app/engine/__tests__/filesystem.test.ts',
  'app/engine/__tests__/evidenceRevelation.test.ts',
  'app/engine/__tests__/conspiracy-files.test.ts',
  'app/engine/__tests__/endings.test.ts',
]);
