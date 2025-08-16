const fs = require('fs');
const path = require('path');

// Load both chapter files
const chapter1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'chapter1.json'), 'utf8'));
const chapter2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'chapter2.json'), 'utf8'));

// Combine all nodes
const allNodes = { ...chapter1.nodes, ...chapter2.nodes };

console.log('=== NODE VALIDATION REPORT ===');
console.log(`Chapter 1 nodes: ${Object.keys(chapter1.nodes).length}`);
console.log(`Chapter 2 nodes: ${Object.keys(chapter2.nodes).length}`);
console.log(`Total nodes: ${Object.keys(allNodes).length}`);

// Check for missing references
const missingRefs = [];

function checkChoices(nodes, chapterName) {
  Object.values(nodes).forEach(node => {
    if (node.choices) {
      node.choices.forEach(choice => {
        if (choice.nextNode && !allNodes[choice.nextNode]) {
          missingRefs.push({
            chapter: chapterName,
            nodeId: node.id,
            choiceText: choice.text,
            missingNode: choice.nextNode
          });
        }
        // Check skill check nodes
        if (choice.skillCheck) {
          if (choice.skillCheck.successNode && !allNodes[choice.skillCheck.successNode]) {
            missingRefs.push({
              chapter: chapterName,
              nodeId: node.id,
              choiceText: choice.text + ' (success)',
              missingNode: choice.skillCheck.successNode
            });
          }
          if (choice.skillCheck.failureNode && !allNodes[choice.skillCheck.failureNode]) {
            missingRefs.push({
              chapter: chapterName,
              nodeId: node.id,
              choiceText: choice.text + ' (failure)',
              missingNode: choice.skillCheck.failureNode
            });
          }
        }
      });
    }
  });
}

checkChoices(chapter1.nodes, 'Chapter 1');
checkChoices(chapter2.nodes, 'Chapter 2');

if (missingRefs.length === 0) {
  console.log('✅ All node references are valid!');
} else {
  console.log(`❌ Found ${missingRefs.length} missing references:`);
  missingRefs.forEach(ref => {
    console.log(`  ${ref.chapter} - Node "${ref.nodeId}" -> "${ref.missingNode}" (${ref.choiceText})`);
  });
}

console.log('\n=== CHAPTER NAVIGATION ===');
console.log('Chapter 1 start node:', chapter1.startNode);
console.log('Chapter 2 start node:', chapter2.startNode);
console.log('Chapter select node exists:', allNodes['chapter_select'] ? '✅' : '❌');
