const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Story Node Connections...\n');

// Load all chapter files
const chapters = [];
for (let i = 1; i <= 3; i++) {
  const filePath = path.join(__dirname, 'public', `chapter${i}.json`);
  if (fs.existsSync(filePath)) {
    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      chapters.push({ number: i, data: content });
      console.log(`✅ Loaded Chapter ${i}: "${content.title}"`);
    } catch (error) {
      console.log(`❌ Error loading Chapter ${i}: ${error.message}`);
    }
  }
}

console.log(`\n📊 Total chapters loaded: ${chapters.length}\n`);

// Collect all nodes from all chapters
const allNodes = new Map();
chapters.forEach(chapter => {
  Object.keys(chapter.data.nodes).forEach(nodeId => {
    allNodes.set(nodeId, {
      chapter: chapter.number,
      node: chapter.data.nodes[nodeId]
    });
  });
});

console.log(`📊 Total nodes found: ${allNodes.size}\n`);

// Track broken connections
const brokenConnections = [];
const chapterTransitions = [];

// Validate connections
chapters.forEach(chapter => {
  console.log(`🔍 Validating Chapter ${chapter.number} connections...`);
  
  Object.entries(chapter.data.nodes).forEach(([nodeId, node]) => {
    if (node.choices) {
      node.choices.forEach(choice => {
        const nextNode = choice.nextNode;
        
        if (nextNode) {
          // Check if it's a chapter transition
          if (nextNode.match(/^chapter\d+_\d+$/)) {
            const targetChapter = parseInt(nextNode.match(/^chapter(\d+)_/)[1]);
            if (targetChapter !== chapter.number) {
              chapterTransitions.push({
                from: `Chapter ${chapter.number}: ${nodeId}`,
                to: `Chapter ${targetChapter}: ${nextNode}`,
                choice: choice.text
              });
            }
          }
          
          // Check if target node exists
          if (!allNodes.has(nextNode)) {
            brokenConnections.push({
              from: `Chapter ${chapter.number}: ${nodeId}`,
              choice: choice.text,
              missingNode: nextNode
            });
          }
        }
        
        // Check skill check connections
        if (choice.skillCheck) {
          if (choice.skillCheck.successNode && !allNodes.has(choice.skillCheck.successNode)) {
            brokenConnections.push({
              from: `Chapter ${chapter.number}: ${nodeId}`,
              choice: `${choice.text} (skill check success)`,
              missingNode: choice.skillCheck.successNode
            });
          }
          
          if (choice.skillCheck.failureNode && !allNodes.has(choice.skillCheck.failureNode)) {
            brokenConnections.push({
              from: `Chapter ${chapter.number}: ${nodeId}`,
              choice: `${choice.text} (skill check failure)`,
              missingNode: choice.skillCheck.failureNode
            });
          }
        }
      });
    }
  });
});

// Report results
console.log('\n📊 VALIDATION RESULTS:\n');

if (chapterTransitions.length > 0) {
  console.log('🔄 Chapter Transitions Found:');
  chapterTransitions.forEach(transition => {
    console.log(`   ${transition.from} → ${transition.to}`);
    console.log(`     Choice: "${transition.choice}"`);
  });
  console.log('');
}

if (brokenConnections.length === 0) {
  console.log('✅ All story node connections are valid!');
} else {
  console.log('❌ Broken Connections Found:');
  brokenConnections.forEach(broken => {
    console.log(`   ${broken.from}`);
    console.log(`     Choice: "${broken.choice}"`);
    console.log(`     Missing Node: "${broken.missingNode}"`);
    console.log('');
  });
}

// Check start nodes
console.log('\n🎯 Chapter Start Nodes:');
chapters.forEach(chapter => {
  const startNode = chapter.data.startNode;
  const nodeExists = allNodes.has(startNode);
  console.log(`   Chapter ${chapter.number}: ${startNode} ${nodeExists ? '✅' : '❌'}`);
});

console.log('\n🎮 Story Navigation Summary:');
console.log(`   Total Nodes: ${allNodes.size}`);
console.log(`   Chapter Transitions: ${chapterTransitions.length}`);
console.log(`   Broken Connections: ${brokenConnections.length}`);

if (brokenConnections.length === 0 && chapterTransitions.length > 0) {
  console.log('\n🎉 Story structure looks good! All connections are valid.');
} else if (brokenConnections.length > 0) {
  console.log('\n⚠️  Please fix the broken connections listed above.');
}
