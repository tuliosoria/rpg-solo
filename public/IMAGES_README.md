# Images for RPG Solo Game

## Required Images

### dome.png
- **Used in:** Chapter 2, node "chapter2_14" (The Dome)
- **Description:** A mysterious dome structure rising from the Martian dust, built from salvaged parts
- **Style:** Should evoke a cathedral-like feeling, combining sci-fi and gothic horror elements
- **Inspiration:** Think Black Mirror meets Alien, with Stephen King atmosphere
- **Recommended size:** 800x600 or similar landscape format
- **Color palette:** Muted reds (Mars), metallic greys, with hints of green tech lighting

## Image Integration

The UI now supports displaying images in story nodes by adding an `image` property to the node data:

```json
{
  "id": "chapter2_14",
  "title": "The Dome", 
  "text": "...",
  "image": "dome.png",
  "choices": [...]
}
```

Images are displayed:
- Between the chapter title and story text
- With a cyberpunk-style border and filter
- Responsive sizing that fits the game's aesthetic
- Graceful fallback if image fails to load

## Future Image Nodes

Additional nodes could benefit from images:
- Martian landscapes
- The mysterious structure interior
- Character portraits
- Technological interfaces
- Abstract/psychological imagery for memory sequences
