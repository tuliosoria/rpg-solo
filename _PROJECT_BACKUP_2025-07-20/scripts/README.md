# Story Validation Scripts

This directory contains scripts to validate and analyze the story structure for the RPG Solo adventure game.

## Available Scripts

### `npm run validate-story`
**Purpose**: Validates the story.json file for structural integrity
**What it checks**:
- ✅ All referenced nodes exist
- ✅ All nodes are reachable from 'start'
- ✅ No orphaned or dangling references
- ✅ Proper story endings (nodes with empty choices)
- ✅ No missing text or malformed data

**Example output**:
```
✅ No errors found!
📊 Total nodes: 73
📊 Reachable from start: 73
🏁 Ending nodes: 4
```

### `npm run analyze-story`
**Purpose**: Provides detailed statistical analysis of the story structure
**What it analyzes**:
- 📊 Branching factors and path complexity
- 🗺️ Story flow visualization (first 3 levels)
- 🕸️ Most connected nodes
- 📏 Path length statistics
- ⚠️ Potential issues detection

**Example output**:
```
Average branching factor: 2.18
Total possible paths: 106,140
Average path length: 18.95 nodes
Most connected nodes: start, distance_final, exploration...
```

### `npm run generate-report`
**Purpose**: Generates a comprehensive markdown report (STORY-REPORT.md)
**What it generates**:
- 📄 Complete node listing with statistics
- 🏁 All story endings documentation
- 🌳 Key decision points breakdown
- 📊 Technical metrics and properties

## How to Use

1. **After making changes to story.json**, always run:
   ```bash
   npm run validate-story
   ```

2. **For detailed analysis**, run:
   ```bash
   npm run analyze-story
   ```

3. **To generate documentation**, run:
   ```bash
   npm run generate-report
   ```

## Script Files

- `validate-story.js` - Core validation logic
- `analyze-story.js` - Statistical analysis and visualization
- `generate-report.js` - Markdown report generator

## Common Issues and Solutions

### "Node references non-existent node"
**Problem**: A choice points to a node that doesn't exist
**Solution**: Either create the missing node or fix the reference

### "Orphaned nodes detected"
**Problem**: Nodes exist but aren't reachable from 'start'
**Solution**: Add paths to these nodes or remove if unnecessary

### "No ending nodes found"
**Problem**: Story has no proper endings (all nodes have choices)
**Solution**: Create ending nodes with empty choices arrays

## Story Structure Best Practices

1. **Always have a 'start' node** - This is the entry point
2. **Include proper endings** - Nodes with `"choices": []`
3. **Avoid circular references** - Can cause infinite loops
4. **Keep text concise** - Aim for 50-300 characters per node
5. **Provide meaningful choices** - 2-4 options per branching node
6. **Test all paths** - Ensure every path leads to an ending

## File Structure
```
scripts/
├── validate-story.js      # Validation script
├── analyze-story.js       # Analysis script
├── generate-report.js     # Report generator
└── README.md             # This file

Generated files:
├── STORY-REPORT.md           # Comprehensive documentation
└── story-analysis-report.json # Detailed JSON report
```
