#!/usr/bin/env node

const { runVitestSuite } = require('./story-tools-common');

runVitestSuite([
  'app/engine/__tests__/story-consistency.test.ts',
  'app/engine/__tests__/filesystem.test.ts',
]);
