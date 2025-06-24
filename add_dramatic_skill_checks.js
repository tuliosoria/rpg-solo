const fs = require('fs');
const path = require('path');

// Read the current story.json
const storyPath = path.join(__dirname, 'public', 'story.json');
const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

// Function to add dramatic skill checks with severe consequences
function addDramaticSkillChecks() {
    const newNodes = {};
    
    // 1. CRITICAL AIRLOCK SEQUENCE - Tech failure = death
    newNodes.airlock_emergency = {
        id: "airlock_emergency",
        chapter: 2,
        title: "Airlock Emergency",
        text: "ALARM! The airlock is malfunctioning. The outer door is sealed, but the inner seal is failing. You have seconds before explosive decompression kills you.\n\nChronos: \"Emergency protocols engaged! You must manually override the system NOW!\"",
        choices: [{
            id: "emergency_override",
            text: "Attempt emergency override (Tech Check - CRITICAL)",
            requirements: {},
            effects: {},
            nextNode: "airlock_override_check",
            skillCheck: {
                skill: "tech",
                difficulty: 15,
                successNode: "airlock_saved",
                failureNode: "airlock_death"
            }
        }]
    };
    
    newNodes.airlock_override_check = {
        id: "airlock_override_check",
        chapter: 2,
        title: "Critical Override",
        text: "[Dynamic text based on skill check result - DEATH ON FAILURE]",
        choices: []
    };
    
    newNodes.airlock_saved = {
        id: "airlock_saved",
        chapter: 2,
        title: "Airlock Restored",
        text: "Your fingers fly across the emergency panel. The system responds! The inner seal re-engages with a satisfying *THUNK*.\n\nChronos: \"Excellent work. That was... uncomfortably close to catastrophic failure.\"",
        choices: [{
            id: "continue_exploration",
            text: "Continue exploration",
            requirements: {},
            effects: {},
            nextNode: "mars_valley"
        }]
    };
    
    newNodes.airlock_death = {
        id: "airlock_death",
        chapter: 2,
        title: "Explosive Decompression",
        text: "Your fingers fumble with the controls. The inner seal FAILS.\n\nExplosive decompression tears through the airlock. Your last breath escapes in a cloud of crystallizing moisture.\n\nChronos: \"Life signs... negative. Mission... terminated.\"\n\n**GAME OVER**\n\n*Sometimes technology fails when you need it most.*",
        choices: [{
            id: "restart_chapter_2",
            text: "Return to Chapter 2 beginning",
            requirements: {},
            effects: {},
            nextNode: "chapter_2_start"
        }]
    };
    
    // 2. UNSTABLE MARTIAN GROUND - Logical failure = trapped/death
    newNodes.ground_instability = {
        id: "ground_instability",
        chapter: 2,
        title: "Unstable Terrain",
        text: "The ground beneath your feet begins to crack and shift. Ancient lava tubes are collapsing! You need to find stable ground quickly.\n\nChronos: \"Geological instability detected. Calculating safe path... analysis inconclusive.\"",
        choices: [{
            id: "analyze_terrain",
            text: "Analyze terrain patterns to find safe path (Logical Check - CRITICAL)",
            requirements: {},
            effects: {},
            nextNode: "terrain_analysis_check",
            skillCheck: {
                skill: "logical",
                difficulty: 16,
                successNode: "terrain_navigated",
                failureNode: "ground_collapse"
            }
        }]
    };
    
    newNodes.terrain_analysis_check = {
        id: "terrain_analysis_check",
        chapter: 2,
        title: "Terrain Analysis",
        text: "[Dynamic text based on skill check result - DEATH ON FAILURE]",
        choices: []
    };
    
    newNodes.terrain_navigated = {
        id: "terrain_navigated",
        chapter: 2,
        title: "Safe Passage",
        text: "Your analysis reveals a pattern in the rock formations. You leap from stable point to stable point, reaching solid ground just as the area behind you collapses completely.\n\nChronos: \"Impressive deduction. That analysis likely saved your life.\"",
        choices: [{
            id: "continue_to_facility",
            text: "Continue toward the facility",
            requirements: {},
            effects: {},
            nextNode: "facility_approach"
        }]
    };
    
    newNodes.ground_collapse = {
        id: "ground_collapse",
        chapter: 2,
        title: "Catastrophic Collapse",
        text: "You misjudge the terrain patterns. The ground gives way beneath you!\n\nYou fall into a deep lava tube, your scream echoing in the Martian darkness. The walls are too smooth to climb, and your oxygen is running low.\n\nChronos: \"I've lost your signal. Yelena? Yelena!\"\n\n**GAME OVER**\n\n*Mars keeps its secrets buried deep.*",
        choices: [{
            id: "restart_chapter_2",
            text: "Return to Chapter 2 beginning",
            requirements: {},
            effects: {},
            nextNode: "chapter_2_start"
        }]
    };
    
    // 3. AGGRESSIVE MARS FAUNA - Empathy failure = attack/death
    newNodes.hostile_encounter = {
        id: "hostile_encounter",
        chapter: 2,
        title: "Hostile Life Forms",
        text: "Something moves in the shadows ahead. Not human. Not entirely alien either. Hybrid creatures—part organic, part machine—emerge from hidden alcoves.\n\nTheir eyes glow with malevolent intelligence. They're testing you, deciding whether you're prey or threat.",
        choices: [{
            id: "communicate_with_hybrids",
            text: "Attempt to communicate and show non-aggressive intent (Empathy Check - CRITICAL)",
            requirements: {},
            effects: {},
            nextNode: "hybrid_communication_check",
            skillCheck: {
                skill: "empathy",
                difficulty: 17,
                successNode: "hybrids_pacified",
                failureNode: "hybrid_attack"
            }
        }]
    };
    
    newNodes.hybrid_communication_check = {
        id: "hybrid_communication_check",
        chapter: 2,
        title: "Interspecies Communication",
        text: "[Dynamic text based on skill check result - DEATH ON FAILURE]",
        choices: []
    };
    
    newNodes.hybrids_pacified = {
        id: "hybrids_pacified",
        chapter: 2,
        title: "Peaceful Resolution",
        text: "You slowly raise your hands, projecting calm. Your body language speaks of peace, not aggression.\n\nThe hybrids pause, their mechanical parts whirring softly. One approaches and touches your helmet—a gesture of understanding.\n\nThey fade back into the shadows, allowing you passage.",
        choices: [{
            id: "continue_deeper",
            text: "Continue deeper into the facility",
            requirements: {},
            effects: {},
            nextNode: "deeper_levels"
        }]
    };
    
    newNodes.hybrid_attack = {
        id: "hybrid_attack",
        chapter: 2,
        title: "Hybrid Assault",
        text: "Your movements are too aggressive. The hybrids interpret this as a threat.\n\nThey surge forward as one, their mechanical claws tearing through your suit. Bio-engineered toxins flood your bloodstream.\n\nChronos: \"Vital signs critical! I'm detecting unknown pathogens in your system...\"\n\n**GAME OVER**\n\n*Some bridges can't be rebuilt once burned.*",
        choices: [{
            id: "restart_chapter_2",
            text: "Return to Chapter 2 beginning",
            requirements: {},
            effects: {},
            nextNode: "chapter_2_start"
        }]
    };
    
    // 4. QUANTUM MAZE TRAP - Mixed skills failure = lost forever
    newNodes.quantum_maze = {
        id: "quantum_maze",
        chapter: 2,
        title: "Quantum Maze",
        text: "The corridor ahead shimmers and warps. You've entered a quantum maze—a defense system that traps intruders in probability loops.\n\nChronos: \"Warning: Quantum field detected. Normal navigation protocols will not work here.\"",
        choices: [{
            id: "navigate_quantum_maze",
            text: "Navigate the maze using logic and intuition (Logical + Empathy Check - CRITICAL)",
            requirements: {},
            effects: {},
            nextNode: "quantum_maze_check",
            skillCheck: {
                skill: "logical",
                difficulty: 18,
                successNode: "maze_navigation_success",
                failureNode: "quantum_maze_failure"
            }
        }]
    };
    
    newNodes.quantum_maze_check = {
        id: "quantum_maze_check",
        chapter: 2,
        title: "Quantum Navigation",
        text: "[Dynamic text based on skill check result - TRAPPED FOREVER ON FAILURE]",
        choices: []
    };
    
    newNodes.maze_navigation_success = {
        id: "maze_navigation_success",
        chapter: 2,
        title: "Quantum Breakthrough",
        text: "You focus your mind, feeling the quantum patterns. Logic guides your steps while intuition warns of traps.\n\nThe maze recognizes your intelligence and allows you passage. Reality solidifies around you.\n\nChronos: \"Remarkable. You've successfully navigated a quantum maze.\"",
        choices: [{
            id: "reach_core_facility",
            text: "Reach the core facility",
            requirements: {},
            effects: {},
            nextNode: "core_facility_entrance"
        }]
    };
    
    newNodes.quantum_maze_failure = {
        id: "quantum_maze_failure",
        chapter: 2,
        title: "Quantum Trap",
        text: "You make a wrong turn. The maze responds by folding space around you.\n\nYou walk for hours, but every corridor leads back to the same room. The walls pulse with quantum energy, trapping you in an endless loop.\n\nChronos: \"I've lost your signal. You're... everywhere and nowhere at once.\"\n\n**GAME OVER**\n\n*Some mazes have no exit, only infinite paths to nowhere.*",
        choices: [{
            id: "restart_chapter_2",
            text: "Return to Chapter 2 beginning",
            requirements: {},
            effects: {},
            nextNode: "chapter_2_start"
        }]
    };
    
    // 5. REACTOR MELTDOWN - Tech failure = radiation death
    newNodes.reactor_crisis = {
        id: "reactor_crisis",
        chapter: 2,
        title: "Reactor Meltdown",
        text: "CRITICAL ALERT: The facility's reactor is going critical! Radiation levels are spiking beyond lethal limits.\n\nChronos: \"Emergency! You have 30 seconds to shut down the reactor or evacuate. Recommend immediate technical intervention!\"",
        choices: [{
            id: "emergency_shutdown",
            text: "Attempt emergency reactor shutdown (Tech Check - CRITICAL)",
            requirements: {},
            effects: {},
            nextNode: "reactor_shutdown_check",
            skillCheck: {
                skill: "tech",
                difficulty: 19,
                successNode: "reactor_stabilized",
                failureNode: "radiation_death"
            }
        }]
    };
    
    newNodes.reactor_shutdown_check = {
        id: "reactor_shutdown_check",
        chapter: 2,
        title: "Emergency Shutdown",
        text: "[Dynamic text based on skill check result - RADIATION DEATH ON FAILURE]",
        choices: []
    };
    
    newNodes.reactor_stabilized = {
        id: "reactor_stabilized",
        chapter: 2,
        title: "Crisis Averted",
        text: "Your hands work frantically on the control panel. The reactor's core temperature drops to safe levels just as the radiation warning stops blaring.\n\nChronos: \"Reactor stable. You've prevented a catastrophic meltdown. Impressive work under pressure.\"",
        choices: [{
            id: "access_reactor_data",
            text: "Access reactor data logs",
            requirements: {},
            effects: {},
            nextNode: "reactor_data_logs"
        }]
    };
    
    newNodes.radiation_death = {
        id: "radiation_death",
        chapter: 2,
        title: "Radiation Poisoning",
        text: "Your fingers slip on the controls. The reactor goes critical!\n\nLethal radiation floods the chamber. Your body begins to fail at the cellular level. Blood pours from your nose as your DNA unravels.\n\nChronos: \"Radiation levels... beyond survivable limits. I'm sorry, Yelena.\"\n\n**GAME OVER**\n\n*The atom's fire burns without mercy.*",
        choices: [{
            id: "restart_chapter_2",
            text: "Return to Chapter 2 beginning",
            requirements: {},
            effects: {},
            nextNode: "chapter_2_start"
        }]
    };
    
    // 6. PSYCHOLOGICAL TRAP - Empathy failure = mind control
    newNodes.mind_trap = {
        id: "mind_trap",
        chapter: 2,
        title: "Psychological Warfare",
        text: "A voice whispers in your mind—not Chronos, something else. It knows your fears, your doubts, your guilt about Lucy.\n\nVoice: \"You couldn't save her then. You can't save her now. Why do you even try?\"\n\nThe voice grows stronger, more insistent.",
        choices: [{
            id: "resist_mental_intrusion",
            text: "Resist the psychological attack (Empathy Check - CRITICAL)",
            requirements: {},
            effects: {},
            nextNode: "mental_resistance_check",
            skillCheck: {
                skill: "empathy",
                difficulty: 18,
                successNode: "mind_protected",
                failureNode: "mind_controlled"
            }
        }]
    };
    
    newNodes.mental_resistance_check = {
        id: "mental_resistance_check",
        chapter: 2,
        title: "Mental Resistance",
        text: "[Dynamic text based on skill check result - MIND CONTROL ON FAILURE]",
        choices: []
    };
    
    newNodes.mind_protected = {
        id: "mind_protected",
        chapter: 2,
        title: "Mental Fortress",
        text: "You focus on your love for Lucy, your determination to find her. The positive emotions create a barrier against the mental intrusion.\n\nThe voice fades, unable to penetrate your emotional defenses.\n\nChronos: \"Whatever attacked your mind has withdrawn. Well done.\"",
        choices: [{
            id: "continue_mission",
            text: "Continue the mission",
            requirements: {},
            effects: {},
            nextNode: "facility_depths"
        }]
    };
    
    newNodes.mind_controlled = {
        id: "mind_controlled",
        chapter: 2,
        title: "Mental Domination",
        text: "The voice grows too strong. Your own thoughts become foreign to you.\n\nYou watch helplessly as your body moves without your control. Your hands reach for your helmet's release mechanism.\n\nChronos: \"Yelena, what are you doing? Your vitals are spiking!\"\n\n**GAME OVER**\n\n*Your mind was the first casualty of this war.*",
        choices: [{
            id: "restart_chapter_2",
            text: "Return to Chapter 2 beginning",
            requirements: {},
            effects: {},
            nextNode: "chapter_2_start"
        }]
    };
    
    return newNodes;
}

// Function to modify existing nodes to add connections to new dramatic encounters
function addConnectionsToExistingNodes() {
    const connections = [
        {
            nodeId: "mars_valley",
            newChoice: {
                id: "airlock_malfunction",
                text: "Check the airlock systems",
                requirements: {},
                effects: {},
                nextNode: "airlock_emergency"
            }
        },
        {
            nodeId: "facility_approach",
            newChoice: {
                id: "unstable_ground",
                text: "Cross the unstable terrain",
                requirements: {},
                effects: {},
                nextNode: "ground_instability"
            }
        },
        {
            nodeId: "deeper_levels",
            newChoice: {
                id: "encounter_hybrids",
                text: "Investigate the moving shadows",
                requirements: {},
                effects: {},
                nextNode: "hostile_encounter"
            }
        },
        {
            nodeId: "facility_depths",
            newChoice: {
                id: "quantum_corridor",
                text: "Enter the shimmering corridor",
                requirements: {},
                effects: {},
                nextNode: "quantum_maze"
            }
        },
        {
            nodeId: "core_facility_entrance",
            newChoice: {
                id: "reactor_alarm",
                text: "Investigate the reactor alarm",
                requirements: {},
                effects: {},
                nextNode: "reactor_crisis"
            }
        },
        {
            nodeId: "lucy_workshop",
            newChoice: {
                id: "hear_whispers",
                text: "Listen to the whispers in your mind",
                requirements: {},
                effects: {},
                nextNode: "mind_trap"
            }
        }
    ];
    
    connections.forEach(conn => {
        if (storyData.nodes[conn.nodeId] && storyData.nodes[conn.nodeId].choices) {
            storyData.nodes[conn.nodeId].choices.push(conn.newChoice);
        }
    });
}

// Add all the new dramatic nodes
const newNodes = addDramaticSkillChecks();
Object.assign(storyData.nodes, newNodes);

// Add connections to existing nodes
addConnectionsToExistingNodes();

// Write the updated story back to file
fs.writeFileSync(storyPath, JSON.stringify(storyData, null, 2));

console.log("Added dramatic skill checks with severe consequences!");
console.log("New skill checks added:");
console.log("- Critical airlock emergency (Tech - death on failure)");
console.log("- Unstable Martian terrain (Logical - death on failure)");
console.log("- Hostile hybrid creatures (Empathy - death on failure)");
console.log("- Quantum maze navigation (Logical - trapped forever on failure)");
console.log("- Reactor meltdown (Tech - radiation death on failure)");
console.log("- Psychological warfare (Empathy - mind control on failure)");
console.log(`Total new nodes added: ${Object.keys(newNodes).length}`);
