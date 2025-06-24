const fs = require('fs');
const path = require('path');

// Read the original story.json
const storyPath = path.join(__dirname, 'public', 'story.json');
const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

// Function to find all nodes that belong to a specific chapter
function getNodesByChapter(nodes, chapter) {
  const chapterNodes = {};
  
  for (const [nodeId, nodeData] of Object.entries(nodes)) {
    if (nodeData.chapter === chapter) {
      chapterNodes[nodeId] = nodeData;
    }
  }
  
  return chapterNodes;
}

// Function to find nodes without chapter property (shared nodes)
function getSharedNodes(nodes) {
  const sharedNodes = {};
  
  for (const [nodeId, nodeData] of Object.entries(nodes)) {
    if (!nodeData.hasOwnProperty('chapter')) {
      sharedNodes[nodeId] = nodeData;
    }
  }
  
  return sharedNodes;
}

// Get nodes for each chapter
const chapter1Nodes = getNodesByChapter(storyData.nodes, 1);
const chapter2Nodes = getNodesByChapter(storyData.nodes, 2);
const sharedNodes = getSharedNodes(storyData.nodes);

// Create Chapter 1 JSON
const chapter1Data = {
  metadata: storyData.metadata,
  start: storyData.start,
  tutorial_logical: storyData.tutorial_logical,
  tutorial_empathic: storyData.tutorial_empathic,
  tutorial_technical: storyData.tutorial_technical,
  nodes: {
    ...sharedNodes,
    ...chapter1Nodes
  }
};

// Create Chapter 2 JSON  
const chapter2Data = {
  metadata: storyData.metadata,
  nodes: {
    ...chapter2Nodes
  }
};

// Write the separate files
const chapter1Path = path.join(__dirname, 'public', 'chapter1.json');
const chapter2Path = path.join(__dirname, 'public', 'chapter2.json');

fs.writeFileSync(chapter1Path, JSON.stringify(chapter1Data, null, 2));
fs.writeFileSync(chapter2Path, JSON.stringify(chapter2Data, null, 2));

console.log('Chapter separation complete!');
console.log(`Chapter 1: ${Object.keys(chapter1Data).length} nodes`);
console.log(`Chapter 2: ${Object.keys(chapter2Data).length} nodes`);
console.log(`Shared nodes: ${Object.keys(sharedNodes).length} nodes`);
