#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO_ROOT = path.join(__dirname, '..');
const DATA_ROOT = path.join(REPO_ROOT, 'app', 'data');
const ANALYSIS_JSON_PATH = path.join(REPO_ROOT, 'story-analysis-report.json');
const REPORT_MARKDOWN_PATH = path.join(REPO_ROOT, 'STORY-REPORT.md');
const EVIDENCE_MARKER_PATTERN = /isEvidence:\s*true/g;

function findDataFiles(dir = DATA_ROOT) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return findDataFiles(fullPath);
    }

    if (entry.isFile() && entry.name.endsWith('.ts')) {
      return [fullPath];
    }

    return [];
  });
}

function collectMatches(source, expression) {
  return Array.from(source.matchAll(expression));
}

function parseQuotedList(block) {
  return collectMatches(block, /'([^']+)'/g).map(match => match[1]);
}

function analyzeFilesystemSources() {
  const files = findDataFiles();
  const statusCounts = {};
  const requiredFlags = new Set();
  const fileSummaries = [];

  let fileNodeCount = 0;
  let directoryNodeCount = 0;
  let imageTriggerCount = 0;
  let videoTriggerCount = 0;
  let encryptedNodeCount = 0;
  let conditionalNodeCount = 0;
  let evidenceFileCount = 0;

  for (const filePath of files) {
    const source = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(REPO_ROOT, filePath);

    const fileNodes = collectMatches(source, /:\s*FileNode\s*=\s*{/g).length;
    const directoryNodes = collectMatches(source, /:\s*DirectoryNode\s*=\s*{/g).length;
    const statuses = collectMatches(source, /status:\s*'([^']+)'/g).map(match => match[1]);
    const evidenceMarkers = collectMatches(source, EVIDENCE_MARKER_PATTERN).length;
    const flagBlocks = collectMatches(source, /requiredFlags:\s*\[([\s\S]*?)\]/g).map(match => match[1]);
    const imageTriggers = collectMatches(source, /imageTrigger:\s*{/g).length;
    const videoTriggers = collectMatches(source, /videoTrigger:\s*{/g).length;

    fileNodeCount += fileNodes;
    directoryNodeCount += directoryNodes;
    imageTriggerCount += imageTriggers;
    videoTriggerCount += videoTriggers;
    evidenceFileCount += evidenceMarkers;

    for (const status of statuses) {
      statusCounts[status] = (statusCounts[status] || 0) + 1;
      if (status === 'encrypted') {
        encryptedNodeCount += 1;
      }
      if (status === 'conditional') {
        conditionalNodeCount += 1;
      }
    }

    for (const flagBlock of flagBlocks) {
      for (const flag of parseQuotedList(flagBlock)) {
        requiredFlags.add(flag);
      }
    }

    fileSummaries.push({
      path: relativePath,
      lines: source.split('\n').length,
      bytes: Buffer.byteLength(source),
      fileNodes,
      directoryNodes,
      imageTriggers,
      videoTriggers,
    });
  }

  fileSummaries.sort((left, right) => right.lines - left.lines);

  return {
    generatedAt: new Date().toISOString(),
    sourceFiles: files.length,
    fileNodeCount,
    directoryNodeCount,
    imageTriggerCount,
    videoTriggerCount,
    encryptedNodeCount,
    conditionalNodeCount,
    requiredFlagCount: requiredFlags.size,
    requiredFlags: Array.from(requiredFlags).sort(),
    evidenceFileCount,
    statusCounts,
    largestSourceFiles: fileSummaries.slice(0, 10),
  };
}

function writeAnalysisReport(analysis, outputPath = ANALYSIS_JSON_PATH) {
  fs.writeFileSync(outputPath, `${JSON.stringify(analysis, null, 2)}\n`);
}

function formatMarkdownReport(analysis) {
  const topSources = analysis.largestSourceFiles
    .map(source => `| ${source.path} | ${source.lines} | ${source.fileNodes} | ${source.directoryNodes} |`)
    .join('\n');

  const evidenceCoverage = `- Evidence-marked files: ${analysis.evidenceFileCount}`;

  const statuses = Object.entries(analysis.statusCounts)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([status, count]) => `- **${status}**: ${count}`)
    .join('\n');

  const requiredFlags = analysis.requiredFlags.map(flag => `\`${flag}\``).join(', ') || 'None';

  return `# Varginha Story Analysis Report
Generated at ${analysis.generatedAt}

## Summary
- Source files analyzed: ${analysis.sourceFiles}
- File nodes: ${analysis.fileNodeCount}
- Directory nodes: ${analysis.directoryNodeCount}
- Encrypted file nodes: ${analysis.encryptedNodeCount}
- Conditional file nodes: ${analysis.conditionalNodeCount}
- Image triggers: ${analysis.imageTriggerCount}
- Video triggers: ${analysis.videoTriggerCount}
- Distinct required flags: ${analysis.requiredFlagCount}

## Evidence Coverage
${evidenceCoverage}

## Status Distribution
${statuses}

## Required Flags
${requiredFlags}

## Largest Data Sources
| File | Lines | File Nodes | Directory Nodes |
| --- | ---: | ---: | ---: |
${topSources}
`;
}

function writeMarkdownReport(analysis, outputPath = REPORT_MARKDOWN_PATH) {
  fs.writeFileSync(outputPath, formatMarkdownReport(analysis));
}

function runVitestSuite(testFiles) {
  const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const result = spawnSync(command, ['vitest', 'run', ...testFiles], {
    cwd: REPO_ROOT,
    stdio: 'inherit',
  });

  if (typeof result.status === 'number') {
    process.exit(result.status);
  }

  process.exit(1);
}

module.exports = {
  ANALYSIS_JSON_PATH,
  REPORT_MARKDOWN_PATH,
  analyzeFilesystemSources,
  formatMarkdownReport,
  runVitestSuite,
  writeAnalysisReport,
  writeMarkdownReport,
};
