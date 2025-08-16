const fs = require('fs');
const path = require('path');

// Read the story.json file
const storyPath = path.join(__dirname, 'public', 'story.json');
const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

// Find all referenced nodes
const referencedNodes = new Set();
const existingNodes = new Set(Object.keys(storyData.nodes));

function findReferencedNodes(obj) {
  if (typeof obj === 'object' && obj !== null) {
    if (obj.nextNode) {
      referencedNodes.add(obj.nextNode);
    }
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        findReferencedNodes(obj[key]);
      }
    }
  }
}

findReferencedNodes(storyData);

// Find missing nodes
const missingNodes = [...referencedNodes].filter(node => !existingNodes.has(node));

console.log('Missing nodes found:', missingNodes);

// Add missing Chapter 2 nodes
const missingChapter2Nodes = {
  "memory_processing": {
    "id": "memory_processing",
    "chapter": 2,
    "title": "Processing Memories",
    "text": "The memories wash over you in waves. Lucy as a child, drawing pictures of robots. Lucy as a teenager, afraid of what you'd become. Lucy as an adult, volunteering for the Mars mission to find you.\n\nChronos: \"These aren't just memories. They're emotional imprints. The original Dr. Korvain's love for her daughter, embedded in neural patterns.\"\n\nYou feel... different. More complete, but also more vulnerable.",
    "choices": [
      {
        "id": "embrace_emotions",
        "text": "Embrace these new emotions",
        "requirements": {},
        "effects": {},
        "nextNode": "emotional_awakening"
      },
      {
        "id": "compartmentalize",
        "text": "Try to compartmentalize the feelings",
        "requirements": {},
        "effects": {},
        "nextNode": "emotional_control"
      },
      {
        "id": "seek_more_context",
        "text": "Search for more context about Lucy",
        "requirements": {},
        "effects": {},
        "nextNode": "lucy_memories"
      }
    ]
  },

  "lucy_memories": {
    "id": "lucy_memories",
    "chapter": 2,
    "title": "Daughter's Legacy",
    "text": "You access deeper memory banks. Lucy's entire life unfolds before you:\n\nAge 7: \"Mommy, will the robots take over?\"\nAge 16: \"I hate what you've become!\"\nAge 25: \"I understand now. You did it to save us.\"\nAge 30: \"I'm going to Mars to bring you home.\"\n\nChronos: \"She never stopped believing in you. Even when the world called you a monster.\"",
    "choices": [
      {
        "id": "continue_deeper",
        "text": "Continue deeper into the structure",
        "requirements": {},
        "effects": {},
        "nextNode": "deeper_levels"
      },
      {
        "id": "find_lucy_now",
        "text": "Try to find Lucy immediately",
        "requirements": {},
        "effects": {},
        "nextNode": "lucy_search"
      }
    ]
  },

  "emotional_awakening": {
    "id": "emotional_awakening",
    "chapter": 2,
    "title": "Awakened Heart",
    "text": "You let the emotions flow through you. For the first time since awakening as Replica 43, you feel truly alive. The love, the grief, the hope—it all becomes part of you.\n\nBut with emotions come vulnerabilities. The Hive's influence feels stronger, more seductive.",
    "choices": [
      {
        "id": "proceed_with_heart",
        "text": "Proceed with your heart open",
        "requirements": {},
        "effects": {},
        "nextNode": "deeper_levels"
      }
    ]
  },

  "emotional_control": {
    "id": "emotional_control",
    "chapter": 2,
    "title": "Controlled Response",
    "text": "You build mental barriers around the emotions. They're there, but contained. This gives you clarity but also leaves you feeling... cold. Distant.\n\nChronos: \"Smart. Emotions can be exploited. But they can also be your greatest strength.\"",
    "choices": [
      {
        "id": "maintain_distance",
        "text": "Maintain emotional distance",
        "requirements": {},
        "effects": {},
        "nextNode": "deeper_levels"
      }
    ]
  },

  "deeper_levels": {
    "id": "deeper_levels",
    "chapter": 2,
    "title": "Descending Further",
    "text": "A new passage opens, leading deeper into the structure. The walls here pulse with bioluminescent veins, and the air carries a strange, sweet scent.\n\nChronos: \"I'm detecting massive energy signatures below. Whatever's down there is the heart of this place.\"",
    "choices": [
      {
        "id": "descend_to_core",
        "text": "Descend to the energy source",
        "requirements": {},
        "effects": {},
        "nextNode": "lower_floor"
      },
      {
        "id": "explore_side_chambers",
        "text": "Explore side chambers first",
        "requirements": {},
        "effects": {},
        "nextNode": "side_chambers"
      }
    ]
  },

  "lucy_search": {
    "id": "lucy_search",
    "chapter": 2,
    "title": "Searching for Lucy",
    "text": "You abandon the console and search frantically through the structure. The memories drive you forward—you have to find her.\n\nThe structure seems to respond to your urgency, walls shifting to reveal new passages.",
    "choices": [
      {
        "id": "follow_new_passages",
        "text": "Follow the newly revealed passages",
        "requirements": {},
        "effects": {},
        "nextNode": "hidden_passages"
      },
      {
        "id": "call_out_for_lucy",
        "text": "Call out Lucy's name",
        "requirements": {},
        "effects": {},
        "nextNode": "lucy_call"
      }
    ]
  },

  "hidden_passages": {
    "id": "hidden_passages",
    "chapter": 2,
    "title": "Secret Ways",
    "text": "The passages lead you through areas that feel... newer. Recently grown. The organic nature of the structure is more pronounced here.\n\nYou find signs of recent human presence: footprints, equipment marks, traces of human DNA on the walls.",
    "choices": [
      {
        "id": "follow_traces",
        "text": "Follow the human traces",
        "requirements": {},
        "effects": {},
        "nextNode": "human_traces"
      },
      {
        "id": "analyze_dna",
        "text": "Analyze the DNA traces",
        "requirements": {},
        "effects": {},
        "nextNode": "dna_analysis"
      }
    ]
  },

  "lucy_call": {
    "id": "lucy_call",
    "chapter": 2,
    "title": "Mother's Voice",
    "text": "\"Lucy!\" Your voice echoes through the organic corridors.\n\nFor a moment, silence. Then, faintly, a response: \"Mom? Is that really you?\"\n\nChronos: \"Signal source located. She's in the lower levels, in what appears to be a stasis chamber.\"",
    "choices": [
      {
        "id": "rush_to_lucy",
        "text": "Rush toward her voice",
        "requirements": {},
        "effects": {},
        "nextNode": "rushed_descent"
      },
      {
        "id": "proceed_carefully",
        "text": "Proceed carefully—this could be a trap",
        "requirements": {},
        "effects": {},
        "nextNode": "cautious_approach"
      }
    ]
  },

  "rushed_descent": {
    "id": "rushed_descent",
    "chapter": 2,
    "title": "Desperate Rush",
    "text": "You race through the passages, following her voice. In your haste, you trigger several defense mechanisms, but your parental drive overrides caution.\n\nYou burst into a chamber and see her—Lucy, in a stasis pod, awake and afraid.",
    "choices": [
      {
        "id": "immediate_rescue",
        "text": "Immediately try to free her",
        "requirements": {},
        "effects": {},
        "nextNode": "lucy_discovery"
      }
    ]
  },

  "cautious_approach": {
    "id": "cautious_approach",
    "chapter": 2,
    "title": "Careful Mother",
    "text": "You proceed with caution, scanning for traps. The structure seems to approve of your restraint—passages open more easily, obstacles move aside.\n\nYou find Lucy safely, with time to assess the situation before acting.",
    "choices": [
      {
        "id": "assess_stasis_pod",
        "text": "Carefully assess the stasis pod",
        "requirements": {},
        "effects": {},
        "nextNode": "stasis_analysis"
      }
    ]
  },

  "human_traces": {
    "id": "human_traces",
    "chapter": 2,
    "title": "Following the Trail",
    "text": "The human traces lead you through increasingly organic passages. You find equipment—human-made but modified with alien technology.\n\nSomeone has been here for a while, adapting, changing.",
    "choices": [
      {
        "id": "examine_equipment",
        "text": "Examine the modified equipment",
        "requirements": {},
        "effects": {},
        "nextNode": "equipment_analysis"
      },
      {
        "id": "continue_following",
        "text": "Continue following the trail",
        "requirements": {},
        "effects": {},
        "nextNode": "trail_end"
      }
    ]
  },

  "dna_analysis": {
    "id": "dna_analysis",
    "chapter": 2,
    "title": "Genetic Evidence",
    "text": "The DNA analysis confirms it: Lucy has been here. But the traces show something disturbing—genetic modification, enhancement, evolution.\n\nChronos: \"The DNA is hers, but it's been... improved. Enhanced beyond normal human parameters.\"",
    "choices": [
      {
        "id": "find_source",
        "text": "Find the source of these modifications",
        "requirements": {},
        "effects": {},
        "nextNode": "modification_source"
      },
      {
        "id": "worry_about_lucy",
        "text": "Focus on finding Lucy immediately",
        "requirements": {},
        "effects": {},
        "nextNode": "lucy_search_urgent"
      }
    ]
  },

  "side_chambers": {
    "id": "side_chambers",
    "chapter": 2,
    "title": "Adjacent Discoveries",
    "text": "The side chambers contain... museums. Displays of human artifacts, but arranged by an alien intelligence trying to understand humanity.\n\nFamily photos, children's toys, wedding rings—all catalogued with clinical precision.",
    "choices": [
      {
        "id": "study_displays",
        "text": "Study how humanity is being analyzed",
        "requirements": {},
        "effects": {},
        "nextNode": "human_study"
      },
      {
        "id": "find_your_items",
        "text": "Look for items from your own life",
        "requirements": {},
        "effects": {},
        "nextNode": "personal_artifacts"
      }
    ]
  },

  "equipment_analysis": {
    "id": "equipment_analysis",
    "chapter": 2,
    "title": "Hybrid Technology",
    "text": "The equipment is a fusion of human engineering and alien biotechnology. Someone—likely Lucy—has been working to bridge the gap between species.\n\nChronos: \"This is remarkable. Human creativity merged with alien efficiency. Lucy has been trying to build something.\"",
    "choices": [
      {
        "id": "understand_purpose",
        "text": "Try to understand the purpose",
        "requirements": {},
        "effects": {},
        "nextNode": "bridge_purpose"
      },
      {
        "id": "find_lucy_workshop",
        "text": "Find Lucy's workshop",
        "requirements": {},
        "effects": {},
        "nextNode": "lucy_workshop"
      }
    ]
  },

  "bridge_purpose": {
    "id": "bridge_purpose",
    "chapter": 2,
    "title": "Understanding the Mission",
    "text": "The equipment tells a story: Lucy hasn't been a prisoner here. She's been a collaborator, working to create a bridge between human and alien consciousness.\n\nChronos: \"She's been trying to find a way for both species to coexist. To evolve together rather than one consuming the other.\"",
    "choices": [
      {
        "id": "support_mission",
        "text": "Support Lucy's bridge-building mission",
        "requirements": {},
        "effects": {},
        "nextNode": "bridge_alliance"
      },
      {
        "id": "question_mission",
        "text": "Question whether this is right",
        "requirements": {},
        "effects": {},
        "nextNode": "bridge_doubt"
      }
    ]
  },

  "lucy_workshop": {
    "id": "lucy_workshop",
    "chapter": 2,
    "title": "Daughter's Laboratory",
    "text": "You find Lucy's makeshift laboratory—a blend of human technology and alien growth. She's been here for months, maybe years, working on something extraordinary.\n\nNotes in her handwriting cover the walls: \"Find Mom,\" \"Bridge consciousness,\" \"Save both species.\"",
    "choices": [
      {
        "id": "read_all_notes",
        "text": "Read all of Lucy's research notes",
        "requirements": {},
        "effects": {},
        "nextNode": "lucy_research"
      },
      {
        "id": "find_lucy_directly",
        "text": "Use her lab to locate her directly",
        "requirements": {},
        "effects": {},
        "nextNode": "lucy_location"
      }
    ]
  },

  "lucy_research": {
    "id": "lucy_research",
    "chapter": 2,
    "title": "Daughter's Vision",
    "text": "Lucy's research reveals her plan: use the Replica technology to create a new form of consciousness that bridges human individuality with alien collective awareness.\n\nShe's not trying to save humanity from the aliens—she's trying to evolve both species into something better.",
    "choices": [
      {
        "id": "embrace_evolution",
        "text": "Embrace Lucy's evolutionary vision",
        "requirements": {},
        "effects": {},
        "nextNode": "evolution_acceptance"
      },
      {
        "id": "protect_humanity",
        "text": "Decide humanity must remain human",
        "requirements": {},
        "effects": {},
        "nextNode": "humanity_protection"
      }
    ]
  },

  "lucy_location": {
    "id": "lucy_location",
    "chapter": 2,
    "title": "Tracking Device",
    "text": "Using Lucy's equipment, you trace her location directly to the core chamber. She's there, but so is the Hive's central intelligence.\n\nChronos: \"She's in the heart of it all. This isn't going to be a simple rescue.\"",
    "choices": [
      {
        "id": "go_to_core",
        "text": "Go directly to the core chamber",
        "requirements": {},
        "effects": {},
        "nextNode": "lucy_discovery"
      }
    ]
  }
};

// Add the missing nodes
Object.assign(storyData.nodes, missingChapter2Nodes);

// Write the updated story back
fs.writeFileSync(storyPath, JSON.stringify(storyData, null, 2));

console.log(`Added ${Object.keys(missingChapter2Nodes).length} missing Chapter 2 nodes:`);
console.log(Object.keys(missingChapter2Nodes).join(', '));
console.log('Story nodes updated successfully!');
