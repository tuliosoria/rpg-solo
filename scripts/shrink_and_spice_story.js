#!/usr/bin/env node

const { analyzeFilesystemSources } = require('./story-tools-common');

const analysis = analyzeFilesystemSources();

console.log('Automated shrink-and-rewrite is disabled for the TypeScript filesystem narrative.');
console.log('No content was modified.');
console.log('');
console.log('Largest narrative source files to review manually:');

for (const source of analysis.largestSourceFiles.slice(0, 5)) {
  console.log(`- ${source.path} (${source.lines} lines, ${source.fileNodes} file nodes)`);
}
