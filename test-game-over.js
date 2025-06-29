// Test script to validate Game Over detection functionality
const fs = require('fs');

// Test the isGameOverNode function logic
function isGameOverNode(nodeText) {
    return nodeText.includes('GAME OVER') || 
           nodeText.includes('Game Over') || 
           nodeText.includes('CHAPTER 2 COMPLETE');
}

function extractGameOverReason(nodeText) {
    if (nodeText.includes('GAME OVER – Sacrifice Ending')) return 'Sacrifice Ending';
    if (nodeText.includes('GAME OVER – Transcendence Ending')) return 'Transcendence Ending';
    if (nodeText.includes('GAME OVER – Legacy Ending')) return 'Legacy Ending';
    if (nodeText.includes('GAME OVER – Unity Ending')) return 'Unity Ending';
    if (nodeText.includes('GAME OVER – Tragic Ending')) return 'Tragic Ending';
    if (nodeText.includes('CHAPTER 2 COMPLETE')) return 'Chapter 2 Complete - Victory!';
    if (nodeText.includes('GAME OVER')) return 'Game Over';
    return 'Story Complete';
}

console.log('Testing Game Over functionality...\n');

// Test Chapter 1
try {
    const chapter1 = JSON.parse(fs.readFileSync('public/chapter1.json', 'utf8'));
    const chapter1GameOvers = [];
    
    for (const [nodeId, node] of Object.entries(chapter1.nodes)) {
        if (isGameOverNode(node.text)) {
            chapter1GameOvers.push({
                nodeId,
                reason: extractGameOverReason(node.text),
                text: node.text.substring(0, 100) + '...'
            });
        }
    }
    
    console.log(`Chapter 1: Found ${chapter1GameOvers.length} Game Over nodes`);
    chapter1GameOvers.forEach(go => {
        console.log(`  - ${go.nodeId}: ${go.reason}`);
    });
    
} catch (error) {
    console.error('Error testing Chapter 1:', error.message);
}

console.log();

// Test Chapter 2
try {
    const chapter2 = JSON.parse(fs.readFileSync('public/chapter2.json', 'utf8'));
    const chapter2GameOvers = [];
    
    for (const [nodeId, node] of Object.entries(chapter2.nodes)) {
        if (isGameOverNode(node.text)) {
            chapter2GameOvers.push({
                nodeId,
                reason: extractGameOverReason(node.text),
                text: node.text.substring(0, 100) + '...'
            });
        }
        
        // Also check conditionalText for game overs
        if (node.conditionalText) {
            if (node.conditionalText.success && isGameOverNode(node.conditionalText.success)) {
                chapter2GameOvers.push({
                    nodeId: nodeId + ' (success)',
                    reason: extractGameOverReason(node.conditionalText.success),
                    text: node.conditionalText.success.substring(0, 100) + '...'
                });
            }
            if (node.conditionalText.failure && isGameOverNode(node.conditionalText.failure)) {
                chapter2GameOvers.push({
                    nodeId: nodeId + ' (failure)',
                    reason: extractGameOverReason(node.conditionalText.failure),
                    text: node.conditionalText.failure.substring(0, 100) + '...'
                });
            }
        }
    }
    
    console.log(`Chapter 2: Found ${chapter2GameOvers.length} Game Over scenarios`);
    chapter2GameOvers.forEach(go => {
        console.log(`  - ${go.nodeId}: ${go.reason}`);
    });
    
} catch (error) {
    console.error('Error testing Chapter 2:', error.message);
}

console.log('\n✅ Game Over functionality test completed!');
