#!/usr/bin/env node

const {
  ANALYSIS_JSON_PATH,
  analyzeFilesystemSources,
  writeAnalysisReport,
} = require('./story-tools-common');

const analysis = analyzeFilesystemSources();
writeAnalysisReport(analysis);

console.log('Story analysis complete.');
console.log(`Source files analyzed: ${analysis.sourceFiles}`);
console.log(`File nodes: ${analysis.fileNodeCount}`);
console.log(`Directory nodes: ${analysis.directoryNodeCount}`);
console.log(`Report written to: ${ANALYSIS_JSON_PATH}`);
