const fs = require('fs');
const path = require('path');

// Read the story.json file
const storyPath = path.join(__dirname, 'public', 'story.json');
const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

// Function to remove stat bonuses from choices
function removeStatBonusesFromChoices(obj) {
  if (typeof obj === 'object' && obj !== null) {
    // Check if this is a choice object with effects
    if (obj.effects && typeof obj.effects === 'object') {
      // Keep the upgrade test effects but remove others
      const hasUpgradeBonus = 
        (obj.effects.logical === 5 || obj.effects.logical === 10) ||
        (obj.effects.empathy === 5 || obj.effects.empathy === 10) || 
        (obj.effects.tech === 5 || obj.effects.tech === 10);
      
      // If this is not from an upgrade test, clear the effects
      if (!hasUpgradeBonus || Object.keys(obj.effects).length === 1) {
        // Check if we're in the upgrade section by looking at the parent context
        const isUpgradeChoice = obj.id && (
          obj.id.includes('upgrade') || 
          obj.id === 'logical_upgrade' || 
          obj.id === 'empathy_upgrade' || 
          obj.id === 'tech_upgrade'
        );
        
        if (!isUpgradeChoice) {
          obj.effects = {};
        }
      }
    }
    
    // Recursively process all properties
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        removeStatBonusesFromChoices(obj[key]);
      }
    }
  }
  
  return obj;
}

// Process the story data
const processedStory = removeStatBonusesFromChoices(storyData);

// Write the updated story back to file
fs.writeFileSync(storyPath, JSON.stringify(processedStory, null, 2));

console.log('Stat bonuses removed from choices (except upgrade test)');
