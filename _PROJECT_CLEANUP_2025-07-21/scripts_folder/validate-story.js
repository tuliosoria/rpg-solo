#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Story Validation Script
 * This script validates the story.json file to ensure:
 * 1. All referenced nodes exist
 * 2. All nodes are reachable from the start
 * 3. Proper endings exist (nodes with empty choices)
 * 4. No dangling references
 */

function validateStory() {
  console.log('🔍 Starting story validation...\n');

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

  const errors = [];
  const warnings = [];
  
  // Get all node names
  const allNodes = Object.keys(story);
  const referencedNodes = new Set();
  const endingNodes = [];
  
  console.log(`📊 Found ${allNodes.length} total nodes\n`);

  // Check each node
  for (const [nodeName, nodeData] of Object.entries(story)) {
    // Validate node structure
    if (!nodeData.text || typeof nodeData.text !== 'string') {
      errors.push(`Node "${nodeName}" is missing or has invalid text`);
    }
    
    if (!Array.isArray(nodeData.choices)) {
      errors.push(`Node "${nodeName}" is missing or has invalid choices array`);
      continue;
    }

    // Check if this is an ending node
    if (nodeData.choices.length === 0) {
      endingNodes.push(nodeName);
    }

    // Check each choice
    for (const [choiceIndex, choice] of nodeData.choices.entries()) {
      if (!choice.text || typeof choice.text !== 'string') {
        errors.push(`Node "${nodeName}" choice ${choiceIndex} is missing or has invalid text`);
      }
      
      if (!choice.next || typeof choice.next !== 'string') {
        errors.push(`Node "${nodeName}" choice ${choiceIndex} is missing or has invalid next reference`);
        continue;
      }

      // Track referenced nodes
      referencedNodes.add(choice.next);

      // Check if referenced node exists
      if (!allNodes.includes(choice.next)) {
        errors.push(`Node "${nodeName}" choice ${choiceIndex} references non-existent node "${choice.next}"`);
      }
    }
  }

  // Find reachable nodes from start
  const reachableNodes = new Set();
  const visitedNodes = new Set();
  
  function traverseFrom(nodeName) {
    if (visitedNodes.has(nodeName) || !story[nodeName]) {
      return;
    }
    
    visitedNodes.add(nodeName);
    reachableNodes.add(nodeName);
    
    for (const choice of story[nodeName].choices || []) {
      if (choice.next) {
        traverseFrom(choice.next);
      }
    }
  }

  if (!allNodes.includes('start')) {
    errors.push('Missing required "start" node');
  } else {
    traverseFrom('start');
  }

  // Find orphaned nodes (exist but not reachable from start)
  const orphanedNodes = allNodes.filter(node => 
    node !== 'start' && !reachableNodes.has(node)
  );

  // Find unused nodes (exist but never referenced)
  const unusedNodes = allNodes.filter(node => 
    node !== 'start' && !referencedNodes.has(node)
  );

  // Report results
  console.log('📋 VALIDATION RESULTS\n');
  
  if (errors.length === 0) {
    console.log('✅ No errors found!');
  } else {
    console.log(`❌ Found ${errors.length} error(s):`);
    errors.forEach(error => console.log(`   • ${error}`));
  }
  
  console.log(`\n📊 STATISTICS:`);
  console.log(`   • Total nodes: ${allNodes.length}`);
  console.log(`   • Reachable from start: ${reachableNodes.size}`);
  console.log(`   • Ending nodes: ${endingNodes.length}`);
  console.log(`   • Orphaned nodes: ${orphanedNodes.length}`);
  console.log(`   • Unused nodes: ${unusedNodes.length}`);

  if (endingNodes.length > 0) {
    console.log(`\n🏁 ENDING NODES:`);
    endingNodes.forEach(node => console.log(`   • ${node}: "${story[node].text.substring(0, 50)}..."`));
  }

  if (orphanedNodes.length > 0) {
    console.log(`\n🏝️  ORPHANED NODES (exist but not reachable from start):`);
    orphanedNodes.forEach(node => console.log(`   • ${node}`));
  }

  if (unusedNodes.length > 0) {
    console.log(`\n🗑️  UNUSED NODES (exist but never referenced):`);
    unusedNodes.forEach(node => console.log(`   • ${node}`));
  }

  // Check for potential infinite loops (nodes that reference themselves)
  const selfReferencingNodes = [];
  for (const [nodeName, nodeData] of Object.entries(story)) {
    for (const choice of nodeData.choices || []) {
      if (choice.next === nodeName) {
        selfReferencingNodes.push(nodeName);
        break;
      }
    }
  }

  if (selfReferencingNodes.length > 0) {
    console.log(`\n🔄 SELF-REFERENCING NODES (potential infinite loops):`);
    selfReferencingNodes.forEach(node => console.log(`   • ${node}`));
  }

  // Check for very short paths to endings
  const pathsToEndings = {};
  function findShortestPath(target, current = 'start', visited = new Set(), depth = 0) {
    if (visited.has(current) || depth > 20) return Infinity; // Prevent infinite loops
    if (current === target) return depth;
    if (!story[current]) return Infinity;
    
    visited.add(current);
    let shortest = Infinity;
    
    for (const choice of story[current].choices || []) {
      if (choice.next) {
        const pathLength = findShortestPath(target, choice.next, new Set(visited), depth + 1);
        shortest = Math.min(shortest, pathLength);
      }
    }
    
    return shortest;
  }

  console.log(`\n📏 SHORTEST PATHS TO ENDINGS:`);
  endingNodes.forEach(ending => {
    const pathLength = findShortestPath(ending);
    if (pathLength < Infinity) {
      console.log(`   • ${ending}: ${pathLength} steps`);
    } else {
      console.log(`   • ${ending}: unreachable`);
    }
  });

  console.log('\n' + '='.repeat(50));
  
  if (errors.length === 0) {
    console.log('🎉 Story validation completed successfully!');
    process.exit(0);
  } else {
    console.log('💥 Story validation failed with errors.');
    process.exit(1);
  }
}

// Run the validation
validateStory();
