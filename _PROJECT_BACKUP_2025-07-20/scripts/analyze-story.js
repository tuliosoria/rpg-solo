#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Story Analysis Script
 * This script provides detailed analysis of the story structure including:
 * 1. Story flow visualization
 * 2. Node statistics
 * 3. Path analysis
 * 4. Branching factor analysis
 */

function analyzeStory() {
  console.log('📊 Starting detailed story analysis...\n');

  // Read the story file
  const storyPath = path.join(__dirname, '..', 'public', 'story.json');
  
  if (!fs.existsSync(storyPath)) {
    console.error('❌ Error: story.json not found at', storyPath);
    process.exit(1);
  }

  let story;
  try {
    const storyContent = fs.readFileSync(storyPath, 'utf8');
    story = JSON.parse(storyContent);
  } catch (error) {
    console.error('❌ Error parsing story.json:', error.message);
    process.exit(1);
  }

  const allNodes = Object.keys(story);
  console.log(`📈 STORY STATISTICS\n`);
  console.log(`Total nodes: ${allNodes.length}`);

  // Analyze branching factors
  const branchingFactors = {};
  const textLengths = {};
  let totalChoices = 0;

  for (const [nodeName, nodeData] of Object.entries(story)) {
    const choiceCount = nodeData.choices ? nodeData.choices.length : 0;
    branchingFactors[nodeName] = choiceCount;
    textLengths[nodeName] = nodeData.text ? nodeData.text.length : 0;
    totalChoices += choiceCount;
  }

  const avgBranchingFactor = totalChoices / allNodes.length;
  const avgTextLength = Object.values(textLengths).reduce((a, b) => a + b, 0) / allNodes.length;

  console.log(`Average branching factor: ${avgBranchingFactor.toFixed(2)}`);
  console.log(`Average text length: ${avgTextLength.toFixed(0)} characters`);

  // Find nodes with high branching factors
  const highBranchingNodes = Object.entries(branchingFactors)
    .filter(([_, count]) => count >= 4)
    .sort(([_, a], [__, b]) => b - a);

  if (highBranchingNodes.length > 0) {
    console.log(`\n🌳 HIGH BRANCHING NODES (4+ choices):`);
    highBranchingNodes.forEach(([node, count]) => {
      console.log(`   • ${node}: ${count} choices`);
    });
  }

  // Find all paths to endings
  const endingNodes = allNodes.filter(node => 
    story[node].choices && story[node].choices.length === 0
  );

  console.log(`\n🎯 PATH ANALYSIS`);
  console.log(`Ending nodes: ${endingNodes.length}`);
  // Analyze paths more efficiently - limit path analysis to prevent exponential explosion
  const allPaths = [];
  const maxPathsToAnalyze = 10000; // Limit to prevent memory issues
  
  function findAllPaths(current = 'start', path = [], visited = new Set(), depth = 0) {
    if (depth > 15 || visited.has(current) || allPaths.length >= maxPathsToAnalyze) return; // Reduced depth and added path limit
    
    const newPath = [...path, current];
    visited.add(current);
    
    if (!story[current] || !story[current].choices || story[current].choices.length === 0) {
      allPaths.push(newPath);
      visited.delete(current); // Clean up
      return;
    }
    
    for (const choice of story[current].choices) {
      if (choice.next && !visited.has(choice.next)) {
        findAllPaths(choice.next, newPath, visited, depth + 1);
      }
    }
    
    visited.delete(current); // Clean up
  }

  try {
    findAllPaths();
  } catch (error) {
    console.log(`⚠️  Path analysis stopped due to complexity (${allPaths.length} paths analyzed)`);
  }
  let avgPathLength = 0;
  let minPathLength = 0;
  let maxPathLength = 0;
  let mostConnectedNodes = [];

  if (allPaths.length === 0) {
    console.log(`Total possible paths: Unable to calculate (too complex)`);
    console.log(`Average path length: Unable to calculate`);
    console.log(`Shortest path: Unable to calculate`);
    console.log(`Longest path: Unable to calculate`);
  } else {
    const pathLengths = allPaths.map(path => path.length);
    avgPathLength = pathLengths.reduce((a, b) => a + b, 0) / pathLengths.length;
    minPathLength = Math.min(...pathLengths);
    maxPathLength = Math.max(...pathLengths);

    console.log(`Total possible paths: ${allPaths.length}${allPaths.length >= maxPathsToAnalyze ? '+' : ''}`);
    console.log(`Average path length: ${avgPathLength.toFixed(2)} nodes`);
    console.log(`Shortest path: ${minPathLength} nodes`);
    console.log(`Longest path: ${maxPathLength} nodes`);
  }  // Find the most connected nodes (appearing in most paths) - only if we have path data
  if (allPaths.length > 0) {
    const nodeFrequency = {};
    allPaths.forEach(path => {
      path.forEach(node => {
        nodeFrequency[node] = (nodeFrequency[node] || 0) + 1;
      });
    });

    mostConnectedNodes = Object.entries(nodeFrequency)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 10);

    console.log(`\n🕸️  MOST CONNECTED NODES (appear in most paths):`);
    mostConnectedNodes.forEach(([node, frequency]) => {
      const percentage = ((frequency / allPaths.length) * 100).toFixed(1);
      console.log(`   • ${node}: ${frequency}/${allPaths.length} paths (${percentage}%)`);
    });
  } else {
    console.log(`\n🕸️  MOST CONNECTED NODES: Unable to calculate due to complexity`);
  }

  // Generate a simple text-based graph
  console.log(`\n🗺️  STORY FLOW MAP (first 3 levels):`);
  
  function printTree(node, prefix = '', level = 0, visited = new Set()) {
    if (level > 2 || visited.has(node) || !story[node]) return;
    
    visited.add(node);
    const nodeInfo = story[node];
    const choiceCount = nodeInfo.choices ? nodeInfo.choices.length : 0;
    const isEnding = choiceCount === 0;
    
    console.log(`${prefix}📍 ${node} ${isEnding ? '🏁' : `(${choiceCount})`}`);
    
    if (nodeInfo.choices && level < 2) {
      nodeInfo.choices.forEach((choice, index) => {
        const isLast = index === nodeInfo.choices.length - 1;
        const newPrefix = prefix + (isLast ? '    ' : '│   ');
        const connector = isLast ? '└── ' : '├── ';
        
        console.log(`${prefix}${connector}${choice.text.substring(0, 30)}${choice.text.length > 30 ? '...' : ''}`);
        
        if (choice.next) {
          printTree(choice.next, newPrefix, level + 1, new Set(visited));
        }
      });
    }
  }

  printTree('start');

  // Check for potential issues
  console.log(`\n⚠️  POTENTIAL ISSUES:`);
  
  const issues = [];
  
  // Check for very short texts
  const shortTexts = Object.entries(textLengths)
    .filter(([_, length]) => length < 50)
    .map(([node, _]) => node);
  
  if (shortTexts.length > 0) {
    issues.push(`${shortTexts.length} nodes with very short text (< 50 chars)`);
  }
  
  // Check for very long texts
  const longTexts = Object.entries(textLengths)
    .filter(([_, length]) => length > 500)
    .map(([node, _]) => node);
  
  if (longTexts.length > 0) {
    issues.push(`${longTexts.length} nodes with very long text (> 500 chars)`);
  }
  
  // Check for nodes with only one choice
  const singleChoiceNodes = Object.entries(branchingFactors)
    .filter(([_, count]) => count === 1)
    .map(([node, _]) => node);
  
  if (singleChoiceNodes.length > 0) {
    issues.push(`${singleChoiceNodes.length} nodes with only one choice (might be unnecessary)`);
  }

  if (issues.length === 0) {
    console.log('   ✅ No potential issues detected');
  } else {
    issues.forEach(issue => console.log(`   • ${issue}`));
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Analysis complete!');
  
  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    totalNodes: allNodes.length,
    endingNodes: endingNodes.length,
    totalPaths: allPaths.length,
    averagePathLength: avgPathLength,
    averageBranchingFactor: avgBranchingFactor,
    averageTextLength: avgTextLength,
    highBranchingNodes: highBranchingNodes,
    mostConnectedNodes: mostConnectedNodes,
    potentialIssues: issues
  };

  const reportPath = path.join(__dirname, '..', 'story-analysis-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📄 Detailed report saved to: story-analysis-report.json`);
}

// Run the analysis
analyzeStory();
