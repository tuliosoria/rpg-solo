const fs = require('fs');

console.log('🔍 CHAPTER 2 VALIDATION');
console.log('======================');

try {
  // Read and parse the chapter2 file
  const storyContent = fs.readFileSync('./public/chapter2_clean.json', 'utf8');
  const story = JSON.parse(storyContent);
  
  console.log('✅ JSON structure is valid');
  console.log('📖 Title:', story.title);
  console.log('📝 Description:', story.description);
  console.log('🎯 Start Node:', story.startNode);
  
  // Get all story nodes (from nodes object)
  const allNodes = Object.keys(story.nodes);
  console.log('📊 Total story nodes:', allNodes.length);
  
  // Check for broken links
  const brokenLinks = [];
  const validTargets = new Set([...allNodes]);
  
  console.log('\n🔗 LINK VALIDATION:');
  allNodes.forEach(nodeId => {
    const node = story.nodes[nodeId];
    if (node.choices) {
      node.choices.forEach((choice, index) => {
        if (choice.nextNode && !validTargets.has(choice.nextNode)) {
          brokenLinks.push({
            nodeId: nodeId,
            choiceIndex: index,
            choiceText: choice.text,
            target: choice.nextNode
          });
        }
        
        // Check skill check targets
        if (choice.skillCheck) {
          if (choice.skillCheck.successNode && !validTargets.has(choice.skillCheck.successNode)) {
            brokenLinks.push({
              nodeId: nodeId,
              choiceIndex: index,
              choiceText: choice.text + " (success)",
              target: choice.skillCheck.successNode
            });
          }
          if (choice.skillCheck.failureNode && !validTargets.has(choice.skillCheck.failureNode)) {
            brokenLinks.push({
              nodeId: nodeId,
              choiceIndex: index,
              choiceText: choice.text + " (failure)",
              target: choice.skillCheck.failureNode
            });
          }
        }
      });
    }
  });
  
  if (brokenLinks.length === 0) {
    console.log('✅ All links are valid');
  } else {
    console.log(`❌ Found ${brokenLinks.length} broken links:`);
    brokenLinks.forEach(link => {
      console.log(`   🔴 ${link.nodeId} -> "${link.choiceText}" -> ${link.target}`);
    });
  }

  // Check for orphaned nodes (except start node)
  const referencedNodes = new Set([story.startNode]);
  allNodes.forEach(nodeId => {
    const node = story.nodes[nodeId];
    if (node.choices) {
      node.choices.forEach(choice => {
        if (choice.nextNode) {
          referencedNodes.add(choice.nextNode);
        }
        if (choice.skillCheck) {
          if (choice.skillCheck.successNode) {
            referencedNodes.add(choice.skillCheck.successNode);
          }
          if (choice.skillCheck.failureNode) {
            referencedNodes.add(choice.skillCheck.failureNode);
          }
        }
      });
    }
  });

  const orphanedNodes = allNodes.filter(nodeId => !referencedNodes.has(nodeId));
  if (orphanedNodes.length > 0) {
    console.log(`\n⚠️  Found ${orphanedNodes.length} orphaned nodes:`);
    orphanedNodes.forEach(nodeId => {
      console.log(`   🟡 ${nodeId}: ${story.nodes[nodeId].title}`);
    });
  } else {
    console.log('\n✅ No orphaned nodes found');
  }

  console.log('\n✅ CHAPTER 2 VALIDATION COMPLETE');

} catch (error) {
  console.error('❌ Validation failed:', error.message);
  console.log('💡 This appears to be a JSON syntax error. Check for:');
  console.log('   - Missing commas between objects');
  console.log('   - Unclosed brackets or braces');
  console.log('   - Invalid escape characters');
  process.exit(1);
}
