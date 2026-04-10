#!/usr/bin/env node

const {
  REPORT_MARKDOWN_PATH,
  analyzeFilesystemSources,
  writeMarkdownReport,
} = require('./story-tools-common');

const analysis = analyzeFilesystemSources();
writeMarkdownReport(analysis);

console.log('Story report generated.');
console.log(`Markdown report written to: ${REPORT_MARKDOWN_PATH}`);
