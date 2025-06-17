# RPG Solo Story Analysis Report
*Generated on 2025-06-17*

## Overview
- **Total Nodes**: 73
- **Story Type**: Interactive Fiction / RPG Solo Adventure
- **Theme**: Humanity vs Formics moral choice adventure

## Story Structure Validation

### ✅ Validation Results
- All referenced nodes exist
- All nodes are reachable from start
- No orphaned or unused nodes detected
- Proper story endings identified

### 🏁 Ending Nodes
The story has **4** distinct endings:

#### refuse_final
> "You refuse again. The computer powers down. The story ends here."

#### alone
> "You remain alone. The world moves on without you. The story ends here."

#### distance_final
> "Distance is maintained. Peace is uneasy but lasting. The story ends here."

#### revenge_final
> "Revenge consumes you. The cycle of violence never ends. The story ends here."

## Node Details

| Node | Choices | Text Length | Type |
|------|---------|-------------|------|
| start | 3 | 219 | Branching |
| chosen | 4 | 192 | Branching |
| release | 4 | 113 | Branching |
| examine | 4 | 147 | Branching |
| communicate | 3 | 234 | Branching |
| battle | 3 | 229 | Branching |
| formics | 4 | 136 | Branching |
| war_history | 3 | 213 | Branching |
| refuse | 2 | 195 | Branching |
| hack | 2 | 206 | Branching |
| wait_silently | 3 | 68 | Branching |
| empathy | 3 | 217 | Branching |
| child | 3 | 130 | Branching |
| search_panels | 3 | 175 | Branching |
| share_tech | 3 | 165 | Branching |
| keep_tech | 2 | 161 | Branching |
| joint_research | 3 | 143 | Branching |
| defense | 2 | 164 | Branching |
| diplomacy | 3 | 133 | Branching |
| exploration | 2 | 120 | Branching |
| formic_art | 2 | 107 | Branching |
| analyze_failures | 2 | 135 | Branching |
| study_tactics | 2 | 123 | Branching |
| peace_advocates | 2 | 95 | Branching |
| find_survivors | 2 | 122 | Branching |
| seek_answers | 2 | 93 | Branching |
| admit_fear | 2 | 92 | Branching |
| deny_fear | 2 | 66 | Branching |
| remain_silent | 2 | 154 | Branching |
| invite_earth | 3 | 153 | Branching |
| neutral_ground | 2 | 141 | Branching |
| distance | 2 | 136 | Branching |
| fate | 2 | 123 | Branching |
| encounters | 2 | 107 | Branching |
| share_findings | 2 | 170 | Branching |
| keep_journal | 2 | 143 | Branching |
| look_clues | 2 | 86 | Branching |
| joint_governance | 2 | 148 | Branching |
| strict_oversight | 2 | 156 | Branching |
| vote | 2 | 143 | Branching |
| merge_societies | 2 | 134 | Branching |
| separate_cultures | 2 | 131 | Branching |
| pause_evaluate | 2 | 118 | Branching |
| isolation | 2 | 80 | Branching |
| support_ambassador | 2 | 108 | Branching |
| support_protesters | 2 | 127 | Branching |
| mediate_dialogue | 2 | 128 | Branching |
| contact_third | 2 | 113 | Branching |
| observe_third | 2 | 110 | Branching |
| joint_language | 2 | 134 | Branching |
| translators | 2 | 98 | Branching |
| rebuild | 2 | 128 | Branching |
| revenge | 2 | 112 | Branching |
| refuse_final | 0 | 64 | Ending |
| overcome_fear | 2 | 98 | Branching |
| alone | 0 | 70 | Ending |
| global_forum | 2 | 110 | Branching |
| increase_security | 2 | 99 | Branching |
| formalize_alliance | 2 | 104 | Branching |
| keep_informal | 2 | 116 | Branching |
| distance_final | 0 | 73 | Ending |
| destroy_journal | 2 | 124 | Branching |
| expand_worlds | 2 | 98 | Branching |
| focus_earth | 2 | 84 | Branching |
| move_forward | 2 | 104 | Branching |
| shared_culture | 2 | 91 | Branching |
| preserve_traditions | 2 | 109 | Branching |
| cultural_exchange | 2 | 99 | Branching |
| tri_alliance | 2 | 122 | Branching |
| proceed_caution | 2 | 101 | Branching |
| continue_observing | 2 | 105 | Branching |
| revenge_final | 0 | 76 | Ending |
| new_tradition | 3 | 144 | Branching |

## Story Flow

### Key Decision Points
The following nodes offer the most significant branching in the story:

#### chosen (4 choices)
> "'You have demonstrated unique empathy and strategic thinking,' the computer replies. 'I need your guidance. The Formics are approaching. Should we attempt communication or prepare for battle?'"

**Choices:**
- "Attempt communication" → `communicate`
- "Prepare for battle" → `battle`
- "Ask for more information about the Formics" → `formics`
- "Ask about the war's history" → `war_history`

#### release (4 choices)
> "'Release is not possible until a decision is made,' the computer says. 'Will you help me decide humanity's fate?'"

**Choices:**
- "Agree to help" → `chosen`
- "Refuse to help" → `refuse`
- "Try to hack the terminal" → `hack`
- "Wait silently" → `wait_silently`

#### examine (4 choices)
> "You find a hidden panel with old photos of battles and a child's drawing of a Formic. The computer asks, 'Do these images change your perspective?'"

**Choices:**
- "Yes, I feel empathy for the Formics" → `empathy`
- "No, I remain cautious" → `chosen`
- "Ask about the child who drew the picture" → `child`
- "Search for more hidden panels" → `search_panels`

#### formics (4 choices)
> "The computer shares data: The Formics communicate through images and emotions. They have never attacked unprovoked. What do you suggest?"

**Choices:**
- "Attempt communication" → `communicate`
- "Prepare for battle" → `battle`
- "Ask about previous encounters" → `encounters`
- "Request to see Formic art" → `formic_art`

#### start (3 choices)
> "You wake up in a sterile, locked room. A terminal flickers to life. The screen reads: 'I am your Moral Compass. You are here to help me decide the fate of humanity in the coming war against the Formics.' What do you do?"

**Choices:**
- "Ask the computer why you were chosen" → `chosen`
- "Demand to be released" → `release`
- "Examine the room for clues" → `examine`

#### communicate (3 choices)
> "You help the computer draft a message of peace. The Formics respond with curiosity. The war is averted, and a new era of understanding begins. But the peace is fragile. The computer asks: 'Should we share technology with the Formics?'"

**Choices:**
- "Share technology" → `share_tech`
- "Keep technology secret" → `keep_tech`
- "Propose a joint research project" → `joint_research`

#### battle (3 choices)
> "You advise preparation for battle. The computer launches a preemptive strike. The Formics retaliate, and humanity faces devastating losses. Survivors must decide how to rebuild. Do you focus on defense, diplomacy, or exploration?"

**Choices:**
- "Focus on defense" → `defense`
- "Focus on diplomacy" → `diplomacy`
- "Focus on exploration" → `exploration`

#### war_history (3 choices)
> "The computer displays a timeline of human-Formic interactions: first contact, misunderstandings, skirmishes, and uneasy truces. You notice a pattern of escalation after failed communications. What do you focus on?"

**Choices:**
- "Analyze failed communications" → `analyze_failures`
- "Study Formic tactics" → `study_tactics`
- "Look for peace advocates" → `peace_advocates`

#### wait_silently (3 choices)
> "You wait in silence. The computer eventually asks: 'Are you afraid?'"

**Choices:**
- "Admit fear" → `admit_fear`
- "Deny fear" → `deny_fear`
- "Remain silent" → `remain_silent`

#### empathy (3 choices)
> "Moved by empathy, you urge the computer to seek peace. The computer hesitates, then agrees. The Formics respond positively, and a fragile alliance is formed. The computer asks: 'Should we invite the Formics to Earth?'"

**Choices:**
- "Invite them to Earth" → `invite_earth`
- "Meet on neutral ground" → `neutral_ground`
- "Keep them at a distance" → `distance`

#### child (3 choices)
> "'The child was like you—curious and compassionate,' the computer says. 'Their empathy saved lives. Will you follow their example?'"

**Choices:**
- "Yes, seek peace" → `communicate`
- "No, prepare for battle" → `battle`
- "Ask about the child's fate" → `fate`

#### search_panels (3 choices)
> "You discover a journal hidden in the wall. It details experiments with Formic communication. The last entry reads: 'Success is possible, but trust is fragile.' What do you do?"

**Choices:**
- "Share findings with the computer" → `share_findings`
- "Keep the journal secret" → `keep_journal`
- "Look for more clues" → `look_clues`

#### share_tech (3 choices)
> "Sharing technology leads to rapid advancements, but also new tensions. Some humans fear Formic superiority. Do you advocate for joint governance or strict oversight?"

**Choices:**
- "Joint governance" → `joint_governance`
- "Strict oversight" → `strict_oversight`
- "Let the people vote" → `vote`

#### joint_research (3 choices)
> "A joint research project brings breakthroughs in medicine and energy. Both species prosper. The computer asks: 'Should we merge our societies?'"

**Choices:**
- "Begin merging societies" → `merge_societies`
- "Maintain separate cultures" → `separate_cultures`
- "Pause and evaluate" → `pause_evaluate`

#### diplomacy (3 choices)
> "Diplomacy opens new channels. A Formic ambassador visits Earth. Some humans protest. Do you support the ambassador or the protesters?"

**Choices:**
- "Support ambassador" → `support_ambassador`
- "Support protesters" → `support_protesters`
- "Mediate dialogue" → `mediate_dialogue`

#### invite_earth (3 choices)
> "Inviting the Formics to Earth sparks both hope and fear. Some humans welcome them, others protest. The computer asks: 'How should we address the unrest?'"

**Choices:**
- "Hold a global forum" → `global_forum`
- "Increase security" → `increase_security`
- "Encourage dialogue" → `mediate_dialogue`

#### new_tradition (3 choices)
> "You start a new tradition that blends both cultures. It becomes a symbol of unity and hope. The story continues with celebrations and new bonds."

**Choices:**
- "Organize a unity celebration" → `cultural_exchange`
- "Document the tradition" → `shared_culture`
- "Teach it to the children" → `focus_earth`

## Technical Notes

### Story Graph Properties
- **Average Branching Factor**: 2.18
- **Linear Progression Nodes**: 0
- **Branching Decision Nodes**: 69
- **Terminal Nodes**: 4

### Validation Scripts Available
- `npm run validate-story` - Validates story structure and references
- `npm run analyze-story` - Provides detailed statistical analysis
- `npm run generate-report` - Generates this markdown report

---
*Report generated by RPG Solo Story Analysis Tools*
