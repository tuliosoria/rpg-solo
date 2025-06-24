const fs = require('fs');
const path = require('path');

// Read the current story.json
const storyPath = path.join(__dirname, 'public', 'story.json');
const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

// Function to convert numeric difficulty to string difficulty
function convertDifficultyValues() {
    let conversions = 0;
    
    // Define difficulty mappings
    const difficultyMapping = {
        15: "hard",      // Was 15, now "hard" (DC 20)
        16: "hard",      // Was 16, now "hard" (DC 20) 
        17: "hard",      // Was 17, now "hard" (DC 20)
        18: "hard",      // Was 18, now "hard" (DC 20)
        19: "hard"       // Was 19, now "hard" (DC 20)
    };
    
    // Go through all nodes and fix numeric difficulty values
    Object.keys(storyData.nodes).forEach(nodeId => {
        const node = storyData.nodes[nodeId];
        if (node.choices) {
            node.choices.forEach(choice => {
                if (choice.skillCheck && typeof choice.skillCheck.difficulty === 'number') {
                    const numericDifficulty = choice.skillCheck.difficulty;
                    if (difficultyMapping[numericDifficulty]) {
                        choice.skillCheck.difficulty = difficultyMapping[numericDifficulty];
                        conversions++;
                        console.log(`Fixed ${nodeId}: difficulty ${numericDifficulty} → "${difficultyMapping[numericDifficulty]}"`);
                    }
                }
            });
        }
    });
    
    return conversions;
}

// Apply the fixes
const conversions = convertDifficultyValues();

// Write the corrected story back to file
fs.writeFileSync(storyPath, JSON.stringify(storyData, null, 2));

console.log(`\nFixed ${conversions} numeric difficulty values to string format.`);
console.log("All dramatic skill checks now use 'hard' difficulty (DC 20).");
console.log("This ensures compatibility with the UI while maintaining high stakes!");
