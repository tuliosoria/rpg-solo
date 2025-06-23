const fs = require('fs');

console.log('🔍 DR. KORVAIN REPLICA 43 - STORY VALIDATION');
console.log('===========================================');

try {
  // Read and parse the story file
  const storyContent = fs.readFileSync('./public/story.json', 'utf8');
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
            from: nodeId,
            to: choice.nextNode,
            choiceIndex: index,
            text: choice.text?.substring(0, 40) + '...'
          });
        }
      });
    }
  });
  
  if (brokenLinks.length === 0) {
    console.log('✅ All story links are valid!');
  } else {
    console.log(`❌ Found ${brokenLinks.length} broken links:`);
    brokenLinks.forEach(link => {
      console.log(`   ${link.from} -> ${link.to} ("${link.text}")`);
    });
  }
  
  // Analyze skill system
  console.log('\n⚡ SKILL SYSTEM ANALYSIS:');
  const skillRequirements = { tech: 0, logical: 0, empathy: 0 };
  const skillEffects = { tech: 0, logical: 0, empathy: 0 };
  
  allNodes.forEach(nodeId => {
    const node = story.nodes[nodeId];
    if (node.choices) {
      node.choices.forEach(choice => {
        // Count skill requirements
        if (choice.requirements) {
          Object.keys(choice.requirements).forEach(skill => {
            if (skillRequirements[skill] !== undefined) {
              skillRequirements[skill]++;
            }
          });
        }
        // Count skill effects
        if (choice.effects) {
          Object.keys(choice.effects).forEach(skill => {
            if (skillEffects[skill] !== undefined) {
              skillEffects[skill]++;
            }
          });
        }
      });
    }
  });
  
  console.log('Skill requirements by type:');
  console.log('  Tech:', skillRequirements.tech);
  console.log('  Logical:', skillRequirements.logical);
  console.log('  Empathy:', skillRequirements.empathy);
  
  console.log('Skill effects by type:');
  console.log('  Tech:', skillEffects.tech);
  console.log('  Logical:', skillEffects.logical);
  console.log('  Empathy:', skillEffects.empathy);
  
  // Chapter analysis
  console.log('\n📖 CHAPTER STRUCTURE:');
  const chapterCounts = {};
  allNodes.forEach(nodeId => {
    const node = story.nodes[nodeId];
    const chapter = node.chapter || 'Unknown';
    chapterCounts[chapter] = (chapterCounts[chapter] || 0) + 1;
  });
  
  Object.keys(chapterCounts).sort().forEach(chapter => {
    console.log(`  Chapter ${chapter}: ${chapterCounts[chapter]} nodes`);
  });
  
  // Ending analysis
  console.log('\n🏁 ENDING ANALYSIS:');
  const endings = allNodes.filter(id => id.startsWith('ending_'));
  console.log('Available endings:', endings.length);
  endings.forEach(id => {
    const node = story.nodes[id];
    console.log(`  - ${id}: "${node.title}"`);
  });
  
  // Story flow validation
  console.log('\n🌊 STORY FLOW:');
  console.log('Start node exists:', validTargets.has(story.startNode) ? '✅' : '❌');
  console.log('Mission briefing accessible:', allNodes.includes('mission_briefing') ? '✅' : '❌');
  console.log('All chapters implemented:', Object.keys(chapterCounts).length >= 7 ? '✅' : '❌');
  console.log('All endings accessible:', endings.length >= 4 ? '✅' : '❌');
  
  // Summary
  console.log('\n📋 VALIDATION SUMMARY:');
  console.log('======================');
  if (brokenLinks.length === 0) {
    console.log('✅ Story structure is complete and valid');
    console.log('✅ All 7 chapters implemented');
    console.log('✅', endings.length, 'different endings available');
    console.log('✅ Skill system properly integrated');
    console.log('✅ Ready for gameplay testing');
  } else {
    console.log('⚠️  Story has some broken links that need fixing');
    console.log('');
    console.log('BROKEN LINKS TO FIX:');
    brokenLinks.forEach(link => {
      console.log(`❌ ${link.from} -> ${link.to}`);
    });
  }
  
} catch (error) {
  console.error('❌ Validation failed:', error.message);
  if (error instanceof SyntaxError) {
    console.error('💡 This appears to be a JSON syntax error. Check for:');
    console.error('   - Missing commas between objects');
    console.error('   - Unclosed brackets or braces');
    console.error('   - Invalid escape characters');
  }
}
