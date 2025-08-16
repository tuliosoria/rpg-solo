# D20 Skill Check Enhancement - Mars Signal Analysis

## Overview
Enhanced the tutorial skill check with improved d20 animation and specialized Mars signal analysis based on the player's chosen neural upgrade.

## Key Features Added

### 🎲 **Enhanced D20 Animation**
- **Longer Animation**: 15 iterations instead of 10
- **Faster Spin**: 80ms intervals for more dynamic movement
- **Larger Dice**: 100x100px with enhanced styling
- **Visual Effects**: Glowing border, enhanced shadows, 3D appearance
- **Custom Text**: "ANALYZING MARS SIGNAL..." instead of generic skill check

### 🧠 **Upgrade-Specific Analysis**

#### **Logical Upgrade**
- **Success**: Identifies potential sources (probe, research station, communication attempt)
- **Failure**: Acknowledges data is contradictory and inconclusive
- **Focus**: Scientific analysis and logical deduction

#### **Tech Upgrade** 
- **Success**: Reveals quantum encryption protocols and advanced transmission methods
- **Failure**: Overwhelmed by complex technical encryption
- **Focus**: Technical specifications and transmission analysis

#### **Empathy Upgrade**
- **Success**: Detects emotional resonance, consciousness, and intent behind the signal
- **Failure**: Senses intention but can't interpret alien consciousness
- **Focus**: Emotional undertones and conscious intent

### 🎨 **UI Improvements**
- **Enhanced Dice Design**: Larger, more colorful, with spinning animation
- **Success/Failure States**: Clear visual feedback with color coding
- **Detailed Roll Information**: Shows full calculation breakdown
- **Longer Display Time**: 2.5 seconds to read results

### 📖 **Story Integration**
- **Updated Story Text**: Tutorial now focuses on Mars signal instead of security protocols
- **Dynamic Content**: Each upgrade provides unique analysis perspective
- **Rich Narrative**: Success and failure both provide meaningful story content
- **Character Reactions**: Chronos responds appropriately to each outcome

## Technical Implementation

### **Functions Added**
- `rollD20()`: Dice rolling utility
- `getDifficultyClass()`: Difficulty to DC conversion
- `determineSkillCheckStat()`: Selects appropriate stat based on upgrade
- `generateMarsAnalysisText()`: Creates upgrade-specific narrative
- `performSkillCheck()`: Main skill check orchestration

### **State Management**
- `skillCheckInProgress`: Tracks animation state
- `diceRoll`: Current die face value
- `skillCheckResult`: Complete roll results
- `storyData`: Game rules and configuration

### **Story Updates**
- Updated `tutorial_skill_check` node text
- Changed title to "Neural Integration Test"  
- Updated choice text to "Analyze the mysterious Mars signal"
- Changed result node title to "Mars Signal Analysis"

## Result
The tutorial skill check now provides a immersive, upgrade-specific experience that ties directly into the Mars investigation storyline while showcasing the d20 system with enhanced visual flair!
