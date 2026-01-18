# Video Playback Feature - Usage Examples

## Quick Start

The video playback feature allows you to trigger video content when players open specific files in the game.

## Example 1: Basic Video Trigger

Add a video to a simple file:

```typescript
// In app/data/filesystem.ts
{
  type: 'file',
  name: 'security_footage.dat',
  status: 'intact',
  content: [
    'SECURITY CAMERA LOG',
    'Location: Sector 7-G',
    'Timestamp: 1996-01-20 03:45:22',
    '',
    'Motion detected...',
    '[Recording available]'
  ],
  videoTrigger: {
    src: '/videos/security-cam.mp4',
    alt: 'Security camera footage',
    corrupted: false
  }
}
```

## Example 2: Corrupted Video

Add corruption effects for dramatic moments:

```typescript
{
  type: 'file',
  name: 'damaged_recording.dat',
  status: 'unstable',
  content: [
    '▓▓▓ PARTIAL RECOVERY ▓▓▓',
    '',
    'Recording severely damaged...',
    'Attempting reconstruction...',
  ],
  videoTrigger: {
    src: '/videos/corrupted-footage.mp4',
    alt: 'Damaged recording',
    corrupted: true  // Adds corruption overlay
  }
}
```

## Example 3: Encrypted Video

Require decryption before showing video:

```typescript
{
  type: 'file',
  name: 'classified_briefing.enc',
  status: 'encrypted',
  content: ['[ENCRYPTED - DECRYPTION REQUIRED]'],
  decryptedFragment: [
    'CLASSIFIED BRIEFING',
    'Clearance Level: OMEGA',
    '',
    'Subject: Operation parameters...',
    '[Video briefing attached]'
  ],
  securityQuestion: {
    question: 'Enter authorization code:',
    answers: ['COLHEITA', 'colheita'],
    hint: 'The code relates to the harvest...'
  },
  videoTrigger: {
    src: '/videos/classified-briefing.mp4',
    alt: 'Classified briefing video',
    corrupted: false
  }
}
```

## Example 4: Both Image and Video

Files can have both image and video triggers:

```typescript
{
  type: 'file',
  name: 'incident_report.dat',
  status: 'intact',
  content: [
    'INCIDENT REPORT #1247',
    'Date: 1996-01-20',
    '',
    'Multiple witnesses report...',
    '[Photos and video evidence attached]'
  ],
  imageTrigger: {
    src: '/images/incident-photo.png',
    alt: 'Incident photograph',
    tone: 'surveillance',
    corrupted: false
  },
  videoTrigger: {
    src: '/videos/witness-testimony.mp4',
    alt: 'Witness video testimony',
    corrupted: false
  }
}
```

## Testing Your Videos

After adding video files to `public/videos/`, test them in-game:

```bash
# Start the dev server
npm run dev

# In the game terminal:
> cd /path/to/your/file
> ls
> open your-video-file.dat
```

The video should automatically play with the retro terminal effects!

## Video Specifications

### Recommended Settings
- **Format**: MP4 with H.264 codec
- **Resolution**: 720p (1280x720) or lower
- **Duration**: Under 2 minutes
- **File Size**: Under 10MB
- **Frame Rate**: 24-30 fps

### Browser Compatibility
Supported formats by browser:
- **All modern browsers**: MP4 (H.264)
- **Chrome/Edge**: WebM
- **Firefox**: WebM, OGG

### Compression Tips

Using FFmpeg to optimize videos:

```bash
# Compress to 720p with good quality
ffmpeg -i input.mp4 -vf scale=1280:720 -c:v libx264 -crf 23 -preset medium output.mp4

# Reduce file size further
ffmpeg -i input.mp4 -vf scale=1280:720 -c:v libx264 -crf 28 -preset slower output.mp4
```

## Styling and Effects

Videos are automatically styled with:
- **CRT Scanlines**: Horizontal lines for retro effect
- **Color Grading**: Amber tone (sepia filter)
- **Noise Overlay**: Subtle static effect
- **Corruption Lines**: (when `corrupted: true`)
- **CRT Glow**: Ambient glow around edges

These effects are applied via CSS and cannot be disabled per-video.

## User Controls

When a video is playing:
- **ESC**: Close video
- **Enter**: Close video
- **Space**: Close video
- **Click overlay**: Close video
- **Video controls**: Pause, seek, volume (native browser controls)

Videos also auto-close when they finish playing.

## One-Time Playback

Videos are shown only once per game session. If a player opens the same file again in the same run, the video won't replay. This prevents repetitive content and maintains pacing.

To reset: Player must start a new game or load a different save.

## Security Considerations

- Videos are served as static assets from `/public/videos/`
- No server-side processing required
- Use `.gitignore` to exclude large video files from repository
- Store videos in CDN or external storage for production builds

## Troubleshooting

**Video doesn't play:**
1. Check file path in `src` property
2. Verify video file exists in `public/videos/`
3. Check browser console for errors
4. Try different video format (MP4 vs WebM)

**Video plays but effects missing:**
1. Check CSS modules are loading correctly
2. Verify VideoOverlay.module.css is present
3. Check browser DevTools for CSS errors

**Tests failing:**
```bash
npm test
```

Check test output for specific failures. Most common issues:
- Mock video elements not properly configured
- Timing issues in async tests
- Missing test utilities

## Example Integration

Complete example of adding a video to the game:

1. **Add video file**: `public/videos/example.mp4`

2. **Update filesystem**:
```typescript
// In app/data/filesystem.ts, add to appropriate directory
'example_file.dat': {
  type: 'file',
  name: 'example_file.dat',
  status: 'intact',
  content: ['Content with video...'],
  videoTrigger: {
    src: '/videos/example.mp4',
    alt: 'Example video',
    corrupted: false
  }
}
```

3. **Test in-game**:
```bash
npm run dev
# Navigate to the file and open it
> open example_file.dat
```

4. **Write tests**:
```typescript
// In your test file
it('triggers video for example file', () => {
  const result = executeCommand('open example_file.dat', initialState);
  expect(result.videoTrigger).toBeDefined();
  expect(result.videoTrigger?.src).toBe('/videos/example.mp4');
});
```

That's it! Your video is now integrated into the game.
