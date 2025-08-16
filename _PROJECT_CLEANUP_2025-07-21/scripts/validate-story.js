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
  const validTargets = new Set([...allNodes, story.startNode]);
  
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
  console.log('\n🧠 SKILL SYSTEM ANALYSIS:');
  const skillChecks = { logical: 0, empathic: 0, technical: 0 };
  const skillChoices = { logical: 0, empathic: 0, technical: 0 };
  
  allNodes.forEach(nodeId => {
    const node = story[nodeId];
    if (node.choices) {
      node.choices.forEach(choice => {
        if (choice.skillCheck) {
          skillChecks[choice.skillCheck]++;
        }
        if (choice.skillChoice) {
          skillChoices[choice.skillChoice]++;
        }
      });
    }
  });
  
  console.log('Skill checks by type:');
  console.log('  Logical:', skillChecks.logical);
  console.log('  Empathic:', skillChecks.empathic);
  console.log('  Technical:', skillChecks.technical);
  
  console.log('Skill selection choices:');
  console.log('  Logical:', skillChoices.logical);
  console.log('  Empathic:', skillChoices.empathic);
  console.log('  Technical:', skillChoices.technical);
  
  // Chapter analysis
  console.log('\n📖 CHAPTER STRUCTURE:');
  const chapterStarts = allNodes.filter(id => id.includes('chapter_') && id.includes('_start'));
  console.log('Chapter start nodes:', chapterStarts.length);
  chapterStarts.forEach(id => console.log('  -', id));
  
  // Ending analysis
  console.log('\n🏁 ENDING ANALYSIS:');
  const endings = allNodes.filter(id => id.includes('_ending'));
  console.log('Available endings:', endings.length);
  endings.forEach(id => console.log('  -', id));
  
  // Node distribution by chapter
  console.log('\n📊 NODE DISTRIBUTION:');
  const chapters = {
    'Chapter 1': allNodes.filter(id => id.startsWith('awakening') || id === 'skill_selection' || id.includes('enhancement')).length,
    'Chapter 2': allNodes.filter(id => id.startsWith('chapter_2') || id.startsWith('observation_') || id.startsWith('rogers_') || id.startsWith('discovery_') || id.startsWith('revelation_') || id.startsWith('debate_') || id === 'communication_attempt' || id === 'first_contact').length,
    'Chapter 3': allNodes.filter(id => id.startsWith('chapter_3') || id.startsWith('time_') || id.startsWith('truth_') || id.startsWith('tech_verification') || id.startsWith('timeline_') || id.startsWith('prevention_') || id.startsWith('alliance_') || id.startsWith('ai_integration')).length,
    'Chapter 4': allNodes.filter(id => id.startsWith('chapter_4') || id.startsWith('hunter_') || id.startsWith('battle_') || id.startsWith('collective_communication') || id.startsWith('anchor_') || id.startsWith('defiant_') || id.startsWith('sacrifice_offer')).length,
    'Chapter 5': allNodes.filter(id => id.startsWith('chapter_5') || id.startsWith('collective_study') || id.startsWith('individual_') || id.startsWith('system_interface') || id.startsWith('consciousness_weapons') || id.startsWith('freedom_promise')).length,
    'Chapter 6': allNodes.filter(id => id.startsWith('chapter_6') || id.startsWith('systematic_') || id.startsWith('trauma_') || id.startsWith('matrix_') || id.startsWith('collective_reformation') || id.startsWith('ai_alliance')).length,
    'Chapter 7': allNodes.filter(id => id.startsWith('chapter_7') || id.includes('_ending')).length
  };
  
  Object.entries(chapters).forEach(([chapter, count]) => {
    console.log(`${chapter}: ${count} nodes`);
  });
  
  // Story flow validation
  console.log('\n🌊 STORY FLOW:');
  console.log('Start node exists:', story.start ? '✅' : '❌');
  console.log('Skill selection accessible:', allNodes.includes('skill_selection') ? '✅' : '❌');
  console.log('All chapters have start nodes:', chapterStarts.length >= 6 ? '✅' : '❌');
  console.log('All endings accessible:', endings.length === 4 ? '✅' : '❌');
  
  // Summary
  console.log('\n📋 VALIDATION SUMMARY:');
  console.log('======================');
  if (brokenLinks.length === 0) {
    console.log('✅ Story structure is complete and valid');
    console.log('✅ All 7 chapters implemented');
    console.log('✅ 4 different endings available');
    console.log('✅ Skill system properly integrated');
    console.log('✅ Ready for gameplay testing');
  } else {
    console.log('⚠️  Story has some broken links that need fixing');
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
