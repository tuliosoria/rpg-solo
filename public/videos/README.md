# Videos Directory

This directory contains video files that can be triggered when opening certain game files.

## Supported Formats

- MP4 (recommended)
- WebM
- OGG

## Adding Videos

1. Place your video files in this directory
2. Update the corresponding file definition in `app/data/filesystem.ts` to include a `videoTrigger`

## Example

For a file at `/videos/example.mp4`, add to your file definition:

```typescript
videoTrigger: {
  src: '/videos/example.mp4',
  alt: 'Example video description',
  corrupted: false // or true for corruption effects
}
```

## Video Guidelines

- **Resolution**: Recommended 720p or lower for optimal performance
- **Duration**: Keep videos under 2 minutes for best experience
- **Compression**: Use H.264 codec for maximum browser compatibility
- **File size**: Aim for under 10MB per video

## Example Videos

You can place example video files here such as:
- `surveillance.mp4` - Security camera footage
- `briefing.mp4` - Mission briefing
- `recovered_footage.mp4` - Found footage style content

Videos will be displayed with retro terminal aesthetics including:
- CRT scanline effects
- Color grading (amber tone)
- Optional corruption overlays
