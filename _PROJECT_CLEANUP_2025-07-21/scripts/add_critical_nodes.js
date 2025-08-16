const fs = require('fs');
const path = require('path');

// Load the story file
const storyPath = path.join(__dirname, 'public', 'story.json');
const story = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

// Add critical missing nodes that are causing immediate errors
const criticalNodes = {
  "deeper_levels": {
    "id": "deeper_levels",
    "chapter": 2,
    "title": "Descent to Truth",
    "text": "Chronos leads you through passages you didn't know existed. The facility extends far deeper than you realized, with multiple sub-levels dedicated to different aspects of consciousness research.\n\n\"Lucy's laboratory is on Level -7,\" Chronos explains as you descend. \"She's been working there for over a decade, perfecting the techniques that created you.\"\n\nThe elevator stops with a soft chime. \"Are you ready?\" Chronos asks.",
    "choices": [
      { "id": "enter_lab", "text": "Enter Lucy's laboratory", "requirements": {}, "effects": {}, "nextNode": "lucy_workshop" },
      { "id": "hesitate", "text": "I need a moment", "requirements": {}, "effects": {}, "nextNode": "pre_meeting_anxiety" }
    ]
  },
  
  "replica_revelation": {
    "id": "replica_revelation",
    "chapter": 2,
    "title": "The Others",
    "text": "Chronos nods slowly. \"You are the seventh successful replica in the Dr. Korvain series. The others... did not achieve your level of consciousness integration.\"\n\n\"What happened to them?\"\n\n\"Some rejected their synthetic nature entirely and shut down. Others became lost in recursive identity loops. One became violent and had to be... contained.\"\n\nThe weight of this revelation settles over you. You are not unique - just uniquely successful.",
    "choices": [
      { "id": "ask_about_failures", "text": "Tell me about the failures", "requirements": {}, "effects": {}, "nextNode": "replica_failures" },
      { "id": "focus_on_success", "text": "What makes me different?", "requirements": {}, "effects": {}, "nextNode": "success_factors" }
    ]
  },

  "lucy_workshop": {
    "id": "lucy_workshop",
    "chapter": 2,
    "title": "The Laboratory",
    "text": "The laboratory is a temple to obsession. Hundreds of screens display brain scans, consciousness maps, and neural pathway diagrams. In the center, a figure hunches over a workstation, dark hair streaked with premature gray.\n\n\"Lucy,\" you whisper.\n\nShe turns, and you see your own eyes looking back at you - older, wearier, but unmistakably familiar. \"Hello, Dad,\" she says simply. \"Welcome back.\"",
    "choices": [
      { "id": "embrace_lucy", "text": "Embrace your daughter", "requirements": {}, "effects": {}, "nextNode": "emotional_reunion" },
      { "id": "maintain_distance", "text": "Keep your distance", "requirements": {}, "effects": {}, "nextNode": "cautious_reunion" }
    ]
  },

  "pre_meeting_anxiety": {
    "id": "pre_meeting_anxiety",
    "chapter": 2,
    "title": "Moment of Doubt",
    "text": "You pause at the threshold, synthetic heart racing with very real anxiety. What if Lucy doesn't recognize you? What if she's become someone you don't recognize?\n\nChronos waits patiently. \"Anxiety is normal. Even artificial consciousness can experience anticipatory stress.\"\n\n\"Will she... accept me? As her father?\"\n\n\"There's only one way to find out.\"",
    "choices": [
      { "id": "enter_now", "text": "Enter the laboratory", "requirements": {}, "effects": {}, "nextNode": "lucy_workshop" },
      { "id": "ask_more", "text": "Tell me what to expect", "requirements": {}, "effects": {}, "nextNode": "lucy_condition" }
    ]
  },

  "emotional_reunion": {
    "id": "emotional_reunion",
    "chapter": 2,
    "title": "Father and Daughter",
    "text": "You step forward and embrace Lucy, feeling the warmth of living flesh against your synthetic form. She's real, she's alive, and she's grown into a brilliant woman.\n\n\"I've missed you so much,\" she whispers against your chest. \"I've been working for decades to bring you back.\"\n\n\"Lucy, I'm so proud of you,\" you say, and mean it completely. \"But are you okay? Chronos mentioned you've been... changing yourself.\"\n\nShe pulls back, and you see the telltale glimmer of neural implants behind her eyes.",
    "choices": [
      { "id": "express_concern", "text": "I'm worried about what you've done to yourself", "requirements": {}, "effects": {}, "nextNode": "lucy_modifications" },
      { "id": "accept_changes", "text": "I understand the drive for knowledge", "requirements": {}, "effects": {}, "nextNode": "shared_purpose" }
    ]
  },

  "cautious_reunion": {
    "id": "cautious_reunion",
    "chapter": 2,
    "title": "Careful Approach",
    "text": "You remain at a respectful distance, studying the woman who was once your little girl. Lucy seems to understand your hesitation.\n\n\"I know I look different,\" she says softly. \"The neural modifications were necessary for the research. To understand artificial consciousness, I had to expand my own.\"\n\nShe gestures to the screens around her. \"Every breakthrough that made your existence possible came at a cost. But you're here now. That's what matters.\"\n\nYou notice her movements are slightly too precise, her speech patterns subtly mechanical.",
    "choices": [
      { "id": "step_closer", "text": "Move closer to your daughter", "requirements": {}, "effects": {}, "nextNode": "bridge_gap" },
      { "id": "question_changes", "text": "What have you done to yourself?", "requirements": {}, "effects": {}, "nextNode": "lucy_modifications" }
    ]
  }
};

// Add missing nodes
Object.keys(criticalNodes).forEach(nodeId => {
  if (!story.nodes[nodeId]) {
    story.nodes[nodeId] = criticalNodes[nodeId];
    console.log(`Added critical node: ${nodeId}`);
  } else {
    console.log(`Node ${nodeId} already exists`);
  }
});

// Save the file
fs.writeFileSync(storyPath, JSON.stringify(story, null, 2));
console.log('Critical missing nodes added successfully!');
