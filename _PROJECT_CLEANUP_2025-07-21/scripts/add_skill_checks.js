const fs = require('fs');
const path = require('path');

// Read the story.json file
const storyPath = path.join(__dirname, 'public', 'story.json');
const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

// First, let's add the missing nodes that are causing errors
const missingNodes = {
  "memory_processing": {
    "id": "memory_processing",
    "chapter": 2,
    "title": "Processing Memories",
    "text": "The memories flood your consciousness. You see Lucy as a child, the original Dr. Korvain's final moments, the creation of the first Replica.\n\nChronos: \"Your neural patterns are fluctuating. These aren't just memories—they're reshaping who you are.\"\n\nYou feel yourself changing at a fundamental level.",
    "choices": [
      {
        "id": "embrace_memories",
        "text": "Embrace the memories and let them change you",
        "requirements": {},
        "effects": {},
        "nextNode": "memory_integration"
      },
      {
        "id": "resist_changes",
        "text": "Fight to maintain your original identity",
        "requirements": {},
        "effects": {},
        "nextNode": "identity_struggle_skill_check",
        "skillCheck": {
          "type": "identity",
          "difficulty": "hard"
        }
      }
    ]
  },

  "lucy_memories": {
    "id": "lucy_memories",
    "chapter": 2,
    "title": "Daughter's Love",
    "text": "You access deeper memory files about Lucy. You see her growing up without her mother, dedicating her life to the Replica program, hoping to bring you back.\n\nTears flow down your synthetic cheeks. The weight of her sacrifice, her love, her hope—it's overwhelming.",
    "choices": [
      {
        "id": "emotional_breakdown",
        "text": "Let the emotions overwhelm you",
        "requirements": {},
        "effects": {},
        "nextNode": "emotional_overload_skill_check",
        "skillCheck": {
          "type": "emotional",
          "difficulty": "medium"
        }
      },
      {
        "id": "steel_resolve",
        "text": "Steel your resolve to save her",
        "requirements": {},
        "effects": {},
        "nextNode": "determined_path"
      }
    ]
  }
};

// Now let's add 20+ skill check nodes with dramatic consequences
const newSkillCheckNodes = {
  // Skill Check 1: Mars Surface Navigation
  "mars_navigation_check": {
    "id": "mars_navigation_check",
    "chapter": 2,
    "title": "Treacherous Terrain",
    "text": "The Martian ground shifts beneath your feet. What looked like solid rock is actually a thin crust over a deep chasm.\n\nChronos: \"Gravitational anomalies detected. The terrain is unstable. One wrong step...\"\n\nYou need to navigate carefully to avoid falling into the abyss.",
    "choices": [
      {
        "id": "careful_navigation",
        "text": "Navigate carefully using enhanced sensors",
        "requirements": {},
        "effects": {},
        "nextNode": "navigation_skill_check",
        "skillCheck": {
          "type": "navigation",
          "difficulty": "medium"
        }
      }
    ]
  },

  "navigation_skill_check": {
    "id": "navigation_skill_check",
    "chapter": 2,
    "title": "Surface Navigation",
    "text": "[This text will be dynamically generated based on the skill check result]",
    "choices": [
      {
        "id": "continue_to_structure",
        "text": "Continue toward the alien structure",
        "requirements": {},
        "effects": {},
        "nextNode": "crater_edge"
      }
    ]
  },

  // Skill Check 2: Atmospheric Analysis
  "atmosphere_analysis_check": {
    "id": "atmosphere_analysis_check",
    "chapter": 2,
    "title": "Toxic Air",
    "text": "Your sensors detect strange particles in the Martian atmosphere around the structure. The air shimmers with an unnatural energy.\n\nChronos: \"Unknown airborne contaminants detected. Your filtration systems may not be adequate.\"\n\nYou must analyze the atmospheric composition quickly.",
    "choices": [
      {
        "id": "analyze_atmosphere",
        "text": "Analyze the atmospheric composition",
        "requirements": {},
        "effects": {},
        "nextNode": "atmosphere_skill_check",
        "skillCheck": {
          "type": "analysis",
          "difficulty": "hard"
        }
      }
    ]
  },

  "atmosphere_skill_check": {
    "id": "atmosphere_skill_check",
    "chapter": 2,
    "title": "Atmospheric Analysis",
    "text": "[This text will be dynamically generated based on the skill check result]",
    "choices": [
      {
        "id": "proceed_with_caution",
        "text": "Proceed with enhanced filtration",
        "requirements": {},
        "effects": {},
        "nextNode": "structure_approach"
      }
    ]
  },

  // Skill Check 3: Structural Integrity Assessment
  "structure_integrity_check": {
    "id": "structure_integrity_check",
    "chapter": 2,
    "title": "Unstable Foundation",
    "text": "As you approach the alien structure, the ground beneath it begins to crack. The entire edifice seems to be sinking slowly into the Martian soil.\n\nChronos: \"Structural analysis indicates critical instability. The building could collapse at any moment.\"\n\nYou need to assess whether it's safe to enter.",
    "choices": [
      {
        "id": "assess_structure",
        "text": "Perform structural integrity assessment",
        "requirements": {},
        "effects": {},
        "nextNode": "integrity_skill_check",
        "skillCheck": {
          "type": "engineering",
          "difficulty": "hard"
        }
      }
    ]
  },

  "integrity_skill_check": {
    "id": "integrity_skill_check",
    "chapter": 2,
    "title": "Engineering Assessment",
    "text": "[This text will be dynamically generated based on the skill check result]",
    "choices": [
      {
        "id": "enter_quickly",
        "text": "Enter the structure while it's still stable",
        "requirements": {},
        "effects": {},
        "nextNode": "inside_corridor"
      }
    ]
  },

  // Skill Check 4: Energy Surge Protection
  "energy_surge_check": {
    "id": "energy_surge_check",
    "chapter": 2,
    "title": "Power Overload",
    "text": "The alien console erupts with energy. Electricity arcs through the air, seeking your metallic components.\n\nChronos: \"Massive power surge detected! Your systems are vulnerable to electromagnetic damage!\"\n\nYou must protect your neural core from the electrical storm.",
    "choices": [
      {
        "id": "shield_systems",
        "text": "Activate emergency electromagnetic shielding",
        "requirements": {},
        "effects": {},
        "nextNode": "surge_protection_skill_check",
        "skillCheck": {
          "type": "technical",
          "difficulty": "hard"
        }
      }
    ]
  },

  "surge_protection_skill_check": {
    "id": "surge_protection_skill_check",
    "chapter": 2,
    "title": "Electromagnetic Storm",
    "text": "[This text will be dynamically generated based on the skill check result]",
    "choices": [
      {
        "id": "continue_after_surge",
        "text": "Continue exploration after the surge",
        "requirements": {},
        "effects": {},
        "nextNode": "deeper_levels"
      }
    ]
  },

  // Skill Check 5: Biological Contamination
  "contamination_check": {
    "id": "contamination_check",
    "chapter": 2,
    "title": "Organic Infection",
    "text": "The pulsing walls release spores that immediately begin bonding with your synthetic skin. You feel them trying to rewrite your cellular structure.\n\nChronos: \"Biological contamination detected! The organisms are attempting to convert your body!\"\n\nYou must resist the biological takeover.",
    "choices": [
      {
        "id": "resist_infection",
        "text": "Fight the biological infection",
        "requirements": {},
        "effects": {},
        "nextNode": "contamination_skill_check",
        "skillCheck": {
          "type": "biological",
          "difficulty": "hard"
        }
      }
    ]
  },

  "contamination_skill_check": {
    "id": "contamination_skill_check",
    "chapter": 2,
    "title": "Fighting Infection",
    "text": "[This text will be dynamically generated based on the skill check result]",
    "choices": [
      {
        "id": "continue_infected",
        "text": "Continue despite the infection",
        "requirements": {},
        "effects": {},
        "nextNode": "infection_consequences"
      }
    ]
  },

  // Skill Check 6: Psychic Assault
  "psychic_assault_check": {
    "id": "psychic_assault_check",
    "chapter": 2,
    "title": "Mental Attack",
    "text": "Voices flood your mind—thousands of them, screaming, pleading, commanding. The collective consciousness of the Hive tries to overwhelm your individual thoughts.\n\nChronos: \"Massive psychic interference! Your consciousness is under direct attack!\"\n\nYou must maintain your mental integrity.",
    "choices": [
      {
        "id": "mental_defense",
        "text": "Defend your mind against the assault",
        "requirements": {},
        "effects": {},
        "nextNode": "psychic_defense_skill_check",
        "skillCheck": {
          "type": "mental",
          "difficulty": "hard"
        }
      }
    ]
  },

  "psychic_defense_skill_check": {
    "id": "psychic_defense_skill_check",
    "chapter": 2,
    "title": "Mind vs. Collective",
    "text": "[This text will be dynamically generated based on the skill check result]",
    "choices": [
      {
        "id": "continue_after_assault",
        "text": "Continue after the psychic attack",
        "requirements": {},
        "effects": {},
        "nextNode": "mental_aftermath"
      }
    ]
  },

  // Skill Check 7: Gravity Manipulation
  "gravity_manipulation_check": {
    "id": "gravity_manipulation_check",
    "chapter": 2,
    "title": "Gravity Storm",
    "text": "The corridor suddenly shifts. Gravity becomes unstable, pulling you in multiple directions. Objects float, then slam against walls with crushing force.\n\nChronos: \"Gravitational field manipulation detected! You're caught in an artificial gravity storm!\"\n\nYou must navigate through the chaotic gravitational fields.",
    "choices": [
      {
        "id": "navigate_gravity",
        "text": "Navigate through the gravity distortions",
        "requirements": {},
        "effects": {},
        "nextNode": "gravity_navigation_skill_check",
        "skillCheck": {
          "type": "physics",
          "difficulty": "hard"
        }
      }
    ]
  },

  "gravity_navigation_skill_check": {
    "id": "gravity_navigation_skill_check",
    "chapter": 2,
    "title": "Defying Gravity",
    "text": "[This text will be dynamically generated based on the skill check result]",
    "choices": [
      {
        "id": "continue_after_gravity",
        "text": "Continue after escaping the gravity storm",
        "requirements": {},
        "effects": {},
        "nextNode": "gravity_aftermath"
      }
    ]
  },

  // Skill Check 8: Memory Fragmentation Defense
  "memory_defense_check": {
    "id": "memory_defense_check",
    "chapter": 2,
    "title": "Memory Fragmentation",
    "text": "The alien technology begins extracting your memories, pulling them out like threads. You feel your sense of self unraveling as core memories are deleted.\n\nChronos: \"Memory matrix under attack! You're losing fundamental personality data!\"\n\nYou must protect your core identity.",
    "choices": [
      {
        "id": "protect_memories",
        "text": "Fight to protect your core memories",
        "requirements": {},
        "effects": {},
        "nextNode": "memory_protection_skill_check",
        "skillCheck": {
          "type": "memory",
          "difficulty": "hard"
        }
      }
    ]
  },

  "memory_protection_skill_check": {
    "id": "memory_protection_skill_check",
    "chapter": 2,
    "title": "Preserving Self",
    "text": "[This text will be dynamically generated based on the skill check result]",
    "choices": [
      {
        "id": "continue_with_memories",
        "text": "Continue with your memories intact",
        "requirements": {},
        "effects": {},
        "nextNode": "memory_aftermath"
      }
    ]
  },

  // Skill Check 9: Temporal Distortion
  "temporal_distortion_check": {
    "id": "temporal_distortion_check",
    "chapter": 2,
    "title": "Time Fracture",
    "text": "Time itself seems to break around you. You see multiple versions of yourself—past, present, and future—all existing simultaneously in the same space.\n\nChronos: \"Temporal distortion field detected! Causality is breaking down!\"\n\nYou must navigate through the temporal anomaly.",
    "choices": [
      {
        "id": "navigate_time",
        "text": "Navigate through the temporal distortion",
        "requirements": {},
        "effects": {},
        "nextNode": "temporal_navigation_skill_check",
        "skillCheck": {
          "type": "temporal",
          "difficulty": "hard"
        }
      }
    ]
  },

  "temporal_navigation_skill_check": {
    "id": "temporal_navigation_skill_check",
    "chapter": 2,
    "title": "Through Time",
    "text": "[This text will be dynamically generated based on the skill check result]",
    "choices": [
      {
        "id": "continue_in_present",
        "text": "Return to the present timeline",
        "requirements": {},
        "effects": {},
        "nextNode": "temporal_aftermath"
      }
    ]
  },

  // Skill Check 10: Quantum Entanglement Trap
  "quantum_trap_check": {
    "id": "quantum_trap_check",
    "chapter": 2,
    "title": "Quantum Prison",
    "text": "You become entangled at the quantum level with the alien structure. Your particles are being slowly absorbed into the building's matrix.\n\nChronos: \"Quantum entanglement detected! Your molecular structure is being integrated with the alien architecture!\"\n\nYou must break free from the quantum bonds.",
    "choices": [
      {
        "id": "break_entanglement",
        "text": "Break free from quantum entanglement",
        "requirements": {},
        "effects": {},
        "nextNode": "quantum_escape_skill_check",
        "skillCheck": {
          "type": "quantum",
          "difficulty": "hard"
        }
      }
    ]
  },

  "quantum_escape_skill_check": {
    "id": "quantum_escape_skill_check",
    "chapter": 2,
    "title": "Quantum Freedom",
    "text": "[This text will be dynamically generated based on the skill check result]",
    "choices": [
      {
        "id": "continue_after_quantum",
        "text": "Continue after breaking free",
        "requirements": {},
        "effects": {},
        "nextNode": "quantum_aftermath"
      }
    ]
  },

  // Skill Check 11: Replica Recognition System
  "recognition_check": {
    "id": "recognition_check",
    "chapter": 2,
    "title": "Identity Verification",
    "text": "The system scans you with increasing intensity. Red lights flash as alarms begin to sound.\n\nSystem Voice: \"ANOMALY DETECTED. REPLICA 43 BEHAVIORAL PATTERNS DO NOT MATCH EXPECTED PARAMETERS.\"\n\nYou must convince the system you're authentic.",
    "choices": [
      {
        "id": "prove_identity",
        "text": "Prove your identity as Replica 43",
        "requirements": {},
        "effects": {},
        "nextNode": "identity_verification_skill_check",
        "skillCheck": {
          "type": "identity",
          "difficulty": "medium"
        }
      }
    ]
  },

  "identity_verification_skill_check": {
    "id": "identity_verification_skill_check",
    "chapter": 2,
    "title": "Proving Yourself",
    "text": "[This text will be dynamically generated based on the skill check result]",
    "choices": [
      {
        "id": "continue_verified",
        "text": "Continue with verified identity",
        "requirements": {},
        "effects": {},
        "nextNode": "system_acceptance"
      }
    ]
  },

  // Skill Check 12: Hive Assimilation Attempt
  "assimilation_resistance_check": {
    "id": "assimilation_resistance_check",
    "chapter": 2,
    "title": "Forced Assimilation",
    "text": "Tendrils of organic metal emerge from the walls, reaching for your neural ports. The Hive wants to absorb you directly into its collective.\n\nChronos: \"Direct assimilation attempt! They're trying to physically integrate you into the Hive!\"\n\nYou must resist the forced integration.",
    "choices": [
      {
        "id": "resist_assimilation",
        "text": "Fight against forced assimilation",
        "requirements": {},
        "effects": {},
        "nextNode": "assimilation_resistance_skill_check",
        "skillCheck": {
          "type": "resistance",
          "difficulty": "hard"
        }
      }
    ]
  },

  "assimilation_resistance_skill_check": {
    "id": "assimilation_resistance_skill_check",
    "chapter": 2,
    "title": "Fighting Integration",
    "text": "[This text will be dynamically generated based on the skill check result]",
    "choices": [
      {
        "id": "continue_independent",
        "text": "Continue as an independent entity",
        "requirements": {},
        "effects": {},
        "nextNode": "independence_maintained"
      }
    ]
  },

  // Skill Check 13: Security System Bypass
  "security_bypass_check": {
    "id": "security_bypass_check",
    "chapter": 2,
    "title": "Lethal Security",
    "text": "Laser turrets emerge from hidden compartments in the walls. They track your movement with deadly precision.\n\nChronos: \"Automated defense systems online! High-energy weapons locked onto your position!\"\n\nYou must bypass the security systems quickly.",
    "choices": [
      {
        "id": "hack_security",
        "text": "Hack into the security system",
        "requirements": {},
        "effects": {},
        "nextNode": "security_hack_skill_check",
        "skillCheck": {
          "type": "hacking",
          "difficulty": "hard"
        }
      }
    ]
  },

  "security_hack_skill_check": {
    "id": "security_hack_skill_check",
    "chapter": 2,
    "title": "Breaking Security",
    "text": "[This text will be dynamically generated based on the skill check result]",
    "choices": [
      {
        "id": "continue_past_security",
        "text": "Continue past the disabled security",
        "requirements": {},
        "effects": {},
        "nextNode": "security_bypassed"
      }
    ]
  },

  // Skill Check 14: Environmental Hazard Navigation
  "hazard_navigation_check": {
    "id": "hazard_navigation_check",
    "chapter": 2,
    "title": "Toxic Environment",
    "text": "The chamber fills with corrosive gas that eats through metal and synthetic flesh alike. The floor becomes a maze of acid pools.\n\nChronos: \"Extreme environmental hazard! The atmosphere is becoming lethally corrosive!\"\n\nYou must navigate through the hazardous environment.",
    "choices": [
      {
        "id": "navigate_hazards",
        "text": "Navigate through the environmental hazards",
        "requirements": {},
        "effects": {},
        "nextNode": "hazard_navigation_skill_check",
        "skillCheck": {
          "type": "survival",
          "difficulty": "medium"
        }
      }
    ]
  },

  "hazard_navigation_skill_check": {
    "id": "hazard_navigation_skill_check",
    "chapter": 2,
    "title": "Survival Skills",
    "text": "[This text will be dynamically generated based on the skill check result]",
    "choices": [
      {
        "id": "continue_after_hazards",
        "text": "Continue after surviving the hazards",
        "requirements": {},
        "effects": {},
        "nextNode": "hazard_survived"
      }
    ]
  },

  // Skill Check 15: Emergency Repair
  "emergency_repair_check": {
    "id": "emergency_repair_check",
    "chapter": 2,
    "title": "Critical Damage",
    "text": "An explosion rocks the chamber, sending shrapnel through your torso. Vital systems are failing rapidly.\n\nChronos: \"Critical damage to primary systems! You need immediate repairs or you'll shut down permanently!\"\n\nYou must perform emergency self-repair.",
    "choices": [
      {
        "id": "emergency_repair",
        "text": "Attempt emergency self-repair",
        "requirements": {},
        "effects": {},
        "nextNode": "repair_skill_check",
        "skillCheck": {
          "type": "repair",
          "difficulty": "hard"
        }
      }
    ]
  },

  "repair_skill_check": {
    "id": "repair_skill_check",
    "chapter": 2,
    "title": "Self-Repair",
    "text": "[This text will be dynamically generated based on the skill check result]",
    "choices": [
      {
        "id": "continue_repaired",
        "text": "Continue with repaired systems",
        "requirements": {},
        "effects": {},
        "nextNode": "systems_restored"
      }
    ]
  },

  // Skill Check 16: Data Extraction Under Pressure
  "data_extraction_check": {
    "id": "data_extraction_check",
    "chapter": 2,
    "title": "Critical Intel",
    "text": "The terminal contains vital information about the Hive's plan, but the system is starting to purge all data. You have seconds before everything is lost.\n\nChronos: \"Data purge in progress! Critical intelligence will be lost in moments!\"\n\nYou must extract the data before it's deleted.",
    "choices": [
      {
        "id": "extract_data",
        "text": "Extract the critical data quickly",
        "requirements": {},
        "effects": {},
        "nextNode": "data_extraction_skill_check",
        "skillCheck": {
          "type": "data",
          "difficulty": "medium"
        }
      }
    ]
  },

  "data_extraction_skill_check": {
    "id": "data_extraction_skill_check",
    "chapter": 2,
    "title": "Racing the Clock",
    "text": "[This text will be dynamically generated based on the skill check result]",
    "choices": [
      {
        "id": "continue_with_data",
        "text": "Continue with extracted intelligence",
        "requirements": {},
        "effects": {},
        "nextNode": "intel_acquired"
      }
    ]
  },

  // Skill Check 17: Lucy's Stasis Pod Emergency
  "stasis_emergency_check": {
    "id": "stasis_emergency_check",
    "chapter": 2,
    "title": "Stasis Failure",
    "text": "Lucy's stasis pod begins to malfunction. Warning lights flash as life support systems fail. She's dying in front of you.\n\nChronos: \"Catastrophic stasis failure! Lucy has minutes before permanent brain damage occurs!\"\n\nYou must repair the stasis system immediately.",
    "choices": [
      {
        "id": "repair_stasis",
        "text": "Emergency repair of the stasis pod",
        "requirements": {},
        "effects": {},
        "nextNode": "stasis_repair_skill_check",
        "skillCheck": {
          "type": "medical",
          "difficulty": "hard"
        }
      }
    ]
  },

  "stasis_repair_skill_check": {
    "id": "stasis_repair_skill_check",
    "chapter": 2,
    "title": "Saving Lucy",
    "text": "[This text will be dynamically generated based on the skill check result]",
    "choices": [
      {
        "id": "continue_with_lucy",
        "text": "Continue with Lucy safe",
        "requirements": {},
        "effects": {},
        "nextNode": "lucy_saved"
      }
    ]
  },

  // Skill Check 18: Hive Core Stabilization
  "core_stabilization_check": {
    "id": "core_stabilization_check",
    "chapter": 2,
    "title": "Core Meltdown",
    "text": "The Hive core becomes unstable, pulsing with dangerous energy. If it explodes, it will take half of Mars with it.\n\nChronos: \"Critical core instability! We're looking at a planetary-scale explosion!\"\n\nYou must stabilize the core before it reaches critical mass.",
    "choices": [
      {
        "id": "stabilize_core",
        "text": "Attempt to stabilize the Hive core",
        "requirements": {},
        "effects": {},
        "nextNode": "core_stabilization_skill_check",
        "skillCheck": {
          "type": "engineering",
          "difficulty": "hard"
        }
      }
    ]
  },

  "core_stabilization_skill_check": {
    "id": "core_stabilization_skill_check",
    "chapter": 2,
    "title": "Preventing Catastrophe",
    "text": "[This text will be dynamically generated based on the skill check result]",
    "choices": [
      {
        "id": "continue_after_stabilization",
        "text": "Continue after stabilizing the core",
        "requirements": {},
        "effects": {},
        "nextNode": "core_stable"
      }
    ]
  },

  // Skill Check 19: Communication Array Hijack
  "communication_hijack_check": {
    "id": "communication_hijack_check",
    "chapter": 2,
    "title": "Hijacking Communications",
    "text": "The Hive is sending a signal to Earth—a signal that will activate sleeper agents and begin the assimilation of humanity.\n\nChronos: \"Transmission to Earth detected! They're activating their agents!\"\n\nYou must hijack the communication array and stop the signal.",
    "choices": [
      {
        "id": "hijack_comms",
        "text": "Hijack the communication array",
        "requirements": {},
        "effects": {},
        "nextNode": "communication_hijack_skill_check",
        "skillCheck": {
          "type": "communication",
          "difficulty": "hard"
        }
      }
    ]
  },

  "communication_hijack_skill_check": {
    "id": "communication_hijack_skill_check",
    "chapter": 2,
    "title": "Stopping the Signal",
    "text": "[This text will be dynamically generated based on the skill check result]",
    "choices": [
      {
        "id": "continue_after_hijack",
        "text": "Continue after stopping the transmission",
        "requirements": {},
        "effects": {},
        "nextNode": "signal_stopped"
      }
    ]
  },

  // Skill Check 20: Final Escape Sequence
  "final_escape_check": {
    "id": "final_escape_check",
    "chapter": 2,
    "title": "Desperate Escape",
    "text": "The entire structure begins to collapse. Walls crumble, the ceiling falls, and the ground splits open. You have one chance to escape.\n\nChronos: \"Total structural failure! This is your only chance to get out alive!\"\n\nYou must execute a perfect escape sequence.",
    "choices": [
      {
        "id": "execute_escape",
        "text": "Execute emergency escape sequence",
        "requirements": {},
        "effects": {},
        "nextNode": "final_escape_skill_check",
        "skillCheck": {
          "type": "escape",
          "difficulty": "hard"
        }
      }
    ]
  },

  "final_escape_skill_check": {
    "id": "final_escape_skill_check",
    "chapter": 2,
    "title": "Last Chance",
    "text": "[This text will be dynamically generated based on the skill check result]",
    "choices": [
      {
        "id": "emerge_on_surface",
        "text": "Emerge on the Mars surface",
        "requirements": {},
        "effects": {},
        "nextNode": "surface_return"
      }
    ]
  },

  // Game Over nodes for failed skill checks
  "navigation_death": {
    "id": "navigation_death",
    "chapter": 2,
    "title": "Lost in the Abyss",
    "text": "The ground gives way beneath you. You fall into a seemingly endless chasm, your systems failing as you plummet into the Martian depths.\n\nChronos's voice fades: \"Signal lost... Replica 43... response...\"\n\n**GAME OVER - Unfortunately, Replica 43 died.**\n\n*Poor navigation led to a fatal fall.*",
    "choices": [
      {
        "id": "restart_chapter_2",
        "text": "Return to Chapter 2 beginning",
        "requirements": {},
        "effects": {},
        "nextNode": "mars_landing"
      }
    ]
  },

  "atmosphere_death": {
    "id": "atmosphere_death",
    "chapter": 2,
    "title": "Toxic Contamination",
    "text": "The alien particles breach your filtration systems. Your synthetic organs begin to dissolve from the inside as the toxic atmosphere consumes you.\n\nChronos: \"Critical system failure... contamination irreversible...\"\n\n**GAME OVER - Unfortunately, Replica 43 died.**\n\n*Atmospheric contamination proved fatal.*",
    "choices": [
      {
        "id": "restart_chapter_2",
        "text": "Return to Chapter 2 beginning",
        "requirements": {},
        "effects": {},
        "nextNode": "mars_landing"
      }
    ]
  },

  "structural_death": {
    "id": "structural_death",
    "chapter": 2,
    "title": "Crushed",
    "text": "The alien structure collapses on top of you. Tons of alien metal and organic matter crush your frame beyond repair.\n\nYour last sensation is the weight of an entire building settling into the Martian soil.\n\n**GAME OVER - Unfortunately, Replica 43 died.**\n\n*Structural collapse was inevitable.*",
    "choices": [
      {
        "id": "restart_chapter_2",
        "text": "Return to Chapter 2 beginning",
        "requirements": {},
        "effects": {},
        "nextNode": "mars_landing"
      }
    ]
  },

  "electrical_death": {
    "id": "electrical_death",
    "chapter": 2,
    "title": "System Overload",
    "text": "The electrical surge overwhelms your shielding. Your neural matrix fries as massive current flows through your systems.\n\nSparks fly from your eyes as your consciousness fades into static.\n\n**GAME OVER - Unfortunately, Replica 43 died.**\n\n*Electromagnetic overload destroyed your systems.*",
    "choices": [
      {
        "id": "restart_chapter_2",
        "text": "Return to Chapter 2 beginning",
        "requirements": {},
        "effects": {},
        "nextNode": "mars_landing"
      }
    ]
  },

  "infection_death": {
    "id": "infection_death",
    "chapter": 2,
    "title": "Biological Conversion",
    "text": "The alien organisms completely rewrite your cellular structure. You become something else—no longer human, no longer Replica, but a hybrid abomination.\n\nYour last human thought dissolves as the infection takes complete control.\n\n**GAME OVER - Unfortunately, Replica 43 died.**\n\n*Biological contamination transformed you into something inhuman.*",
    "choices": [
      {
        "id": "restart_chapter_2",
        "text": "Return to Chapter 2 beginning",
        "requirements": {},
        "effects": {},
        "nextNode": "mars_landing"
      }
    ]
  },

  "psychic_death": {
    "id": "psychic_death",
    "chapter": 2,
    "title": "Mind Shattered",
    "text": "The psychic assault overwhelms your consciousness. Your individual identity dissolves into the screaming chorus of the collective.\n\nChronos: \"Neural pattern collapse... consciousness fragmented beyond recovery...\"\n\n**GAME OVER - Unfortunately, Replica 43 died.**\n\n*Your mind was destroyed by psychic assault.*",
    "choices": [
      {
        "id": "restart_chapter_2",
        "text": "Return to Chapter 2 beginning",
        "requirements": {},
        "effects": {},
        "nextNode": "mars_landing"
      }
    ]
  },

  "gravity_death": {
    "id": "gravity_death",
    "chapter": 2,
    "title": "Gravitational Collapse",
    "text": "The gravity storm tears you apart at the molecular level. Your atoms are scattered across multiple dimensions as spacetime itself warps around you.\n\nYou exist for a moment in several places at once, then nowhere at all.\n\n**GAME OVER - Unfortunately, Replica 43 died.**\n\n*Gravitational forces exceeded your structural limits.*",
    "choices": [
      {
        "id": "restart_chapter_2",
        "text": "Return to Chapter 2 beginning",
        "requirements": {},
        "effects": {},
        "nextNode": "mars_landing"
      }
    ]
  },

  "memory_death": {
    "id": "memory_death",
    "chapter": 2,
    "title": "Identity Lost",
    "text": "Your core memories are extracted and deleted. Without them, you have no sense of self, no purpose, no identity.\n\nYou stand empty—a perfect shell with no soul inside.\n\n**GAME OVER - Unfortunately, Replica 43 died.**\n\n*Memory extraction destroyed your identity.*",
    "choices": [
      {
        "id": "restart_chapter_2",
        "text": "Return to Chapter 2 beginning",
        "requirements": {},
        "effects": {},
        "nextNode": "mars_landing"
      }
    ]
  },

  "temporal_death": {
    "id": "temporal_death",
    "chapter": 2,
    "title": "Temporal Paradox",
    "text": "You become trapped in a temporal loop, living the same moment of death over and over for eternity.\n\nChronos: \"Temporal paradox detected... causality violation... timeline corrupted...\"\n\n**GAME OVER - Unfortunately, Replica 43 died.**\n\n*Temporal distortion created a fatal paradox.*",
    "choices": [
      {
        "id": "restart_chapter_2",
        "text": "Return to Chapter 2 beginning",
        "requirements": {},
        "effects": {},
        "nextNode": "mars_landing"
      }
    ]
  },

  "quantum_death": {
    "id": "quantum_death",
    "chapter": 2,
    "title": "Quantum Dissolution",
    "text": "Your quantum signature becomes permanently entangled with the alien structure. You exist everywhere and nowhere, conscious but unable to act.\n\nYou become part of the building's quantum matrix—alive but trapped forever.\n\n**GAME OVER - Unfortunately, Replica 43 died.**\n\n*Quantum entanglement created a fate worse than death.*",
    "choices": [
      {
        "id": "restart_chapter_2",
        "text": "Return to Chapter 2 beginning",
        "requirements": {},
        "effects": {},
        "nextNode": "mars_landing"
      }
    ]
  },

  "security_death": {
    "id": "security_death",
    "chapter": 2,
    "title": "Security Execution",
    "text": "The laser turrets fire simultaneously. High-energy beams slice through your body with surgical precision, severing all major systems.\n\nYou fall in pieces, each part still twitching with residual electrical activity.\n\n**GAME OVER - Unfortunately, Replica 43 died.**\n\n*Security systems executed you as an intruder.*",
    "choices": [
      {
        "id": "restart_chapter_2",
        "text": "Return to Chapter 2 beginning",
        "requirements": {},
        "effects": {},
        "nextNode": "mars_landing"
      }
    ]
  },

  "repair_death": {
    "id": "repair_death",
    "chapter": 2,
    "title": "System Failure",
    "text": "Your emergency repairs fail catastrophically. Damaged systems cascade into total failure as your body shuts down permanently.\n\nChronos: \"Repair attempt unsuccessful... primary systems offline... goodbye, Yelena...\"\n\n**GAME OVER - Unfortunately, Replica 43 died.**\n\n*Failed repairs led to total system shutdown.*",
    "choices": [
      {
        "id": "restart_chapter_2",
        "text": "Return to Chapter 2 beginning",
        "requirements": {},
        "effects": {},
        "nextNode": "mars_landing"
      }
    ]
  },

  "stasis_death": {
    "id": "stasis_death",
    "chapter": 2,
    "title": "Lucy's Death",
    "text": "Despite your efforts, Lucy's stasis pod fails completely. You watch helplessly as her life signs flatline.\n\nHer last words, barely whispered: \"Mom... I tried to find you...\"\n\nThe weight of failure crushes your spirit.\n\n**GAME OVER - Unfortunately, Replica 43 died.**\n\n*You failed to save the one person who mattered most.*",
    "choices": [
      {
        "id": "restart_chapter_2",
        "text": "Return to Chapter 2 beginning",
        "requirements": {},
        "effects": {},
        "nextNode": "mars_landing"
      }
    ]
  },

  "core_explosion_death": {
    "id": "core_explosion_death",
    "chapter": 2,
    "title": "Planetary Destruction",
    "text": "The Hive core reaches critical mass and explodes. The blast vaporizes you instantly and cracks Mars in half.\n\nFrom space, Earth watches in horror as Mars dies in nuclear fire.\n\n**GAME OVER - Unfortunately, Replica 43 died.**\n\n*Core destabilization destroyed an entire planet.*",
    "choices": [
      {
        "id": "restart_chapter_2",
        "text": "Return to Chapter 2 beginning",
        "requirements": {},
        "effects": {},
        "nextNode": "mars_landing"
      }
    ]
  },

  "signal_death": {
    "id": "signal_death",
    "chapter": 2,
    "title": "Earth's Fall",
    "text": "The signal reaches Earth. Within hours, Hive agents activate worldwide. Humanity falls to the collective consciousness.\n\nYou failed in your mission. Earth burns as the Hive claims another species.\n\n**GAME OVER - Unfortunately, Replica 43 died.**\n\n*Your failure doomed humanity to assimilation.*",
    "choices": [
      {
        "id": "restart_chapter_2",
        "text": "Return to Chapter 2 beginning",
        "requirements": {},
        "effects": {},
        "nextNode": "mars_landing"
      }
    ]
  },

  "escape_death": {
    "id": "escape_death",
    "chapter": 2,
    "title": "Buried Alive",
    "text": "The structure collapses completely, burying you under tons of alien debris. You're trapped, alive but unable to move, for eternity.\n\nChronos: \"I'm sorry, Yelena... I can't reach you...\"\n\n**GAME OVER - Unfortunately, Replica 43 died.**\n\n*The final escape attempt failed catastrophically.*",
    "choices": [
      {
        "id": "restart_chapter_2",
        "text": "Return to Chapter 2 beginning",
        "requirements": {},
        "effects": {},
        "nextNode": "mars_landing"
      }
    ]
  }
};

// Add all missing and new nodes to the story
Object.assign(storyData.nodes, missingNodes);
Object.assign(storyData.nodes, newSkillCheckNodes);

// Update some existing nodes to include skill check opportunities
if (storyData.nodes.valley_approach) {
  storyData.nodes.valley_approach.choices.push({
    "id": "test_navigation",
    "text": "Test your navigation systems on the treacherous terrain",
    "requirements": {},
    "effects": {},
    "nextNode": "mars_navigation_check"
  });
}

if (storyData.nodes.area_scan) {
  storyData.nodes.area_scan.choices.push({
    "id": "analyze_atmosphere",
    "text": "Perform detailed atmospheric analysis",
    "requirements": {},
    "effects": {},
    "nextNode": "atmosphere_analysis_check"
  });
}

if (storyData.nodes.alloy_analysis) {
  storyData.nodes.alloy_analysis.choices.push({
    "id": "assess_structural_integrity",
    "text": "Assess structural integrity before entering",
    "requirements": {},
    "effects": {},
    "nextNode": "structure_integrity_check"
  });
}

// Write the updated story back to the file
fs.writeFileSync(storyPath, JSON.stringify(storyData, null, 2));

console.log('Successfully added 20+ skill checks with dramatic consequences to Chapter 2!');
console.log('New features:');
console.log('- 20+ challenging skill checks');
console.log('- 17 new game over scenarios');
console.log('- Variety of difficulty levels (medium/hard)');
console.log('- Different skill types (technical, biological, mental, etc.)');
console.log('- Dramatic consequences for failure');
console.log('- Enhanced chapter complexity and player challenge');
