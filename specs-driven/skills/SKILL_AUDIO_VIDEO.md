# SKILL: Audio & Video

> Use when: adding, editing, or triggering any video or audio in the game.

---

## Before You Touch Audio/Video

1. Read [AUDIO_VIDEO.md](../AUDIO_VIDEO.md) — confirm the trigger file, video path, and prompt
2. Read [FILES_REGISTRY.md](../FILES_REGISTRY.md) — confirm the in-game file that triggers the media
3. Read [CHARACTERS.md](../CHARACTERS.md) — confirm UFO74 reaction text after video

## Video Checklist

- [ ] Trigger file is correct — the right in-game file triggers the right video
- [ ] Video path is correct in the code
- [ ] Video plays to completion (or can be skipped)
- [ ] **Scared Kid avatar fires after every video** — no exceptions
- [ ] UFO74 reaction fires after video (if one exists for the file)
- [ ] Terminal returns to normal state after video
- [ ] Detection adjustment applied correctly
- [ ] **No video prompt generates content using real names of individuals**

## Audio Checklist

### Background Music
- [ ] Correct track plays for current detection tier
- [ ] Crossfade works when detection tier changes
- [ ] Music toggle (mute/unmute) works in settings
- [ ] Music preference persists across sessions (localStorage)

### Firewall Taunts
- [ ] Taunts only play when Firewall is active (detection ≥ 25%)
- [ ] Same taunt never plays consecutively
- [ ] Minimum interval between taunts respected
- [ ] Taunts suppressed during Turing test overlay
- [ ] Taunts stop permanently after `link disarm`

### Static Noise
- [ ] Activates at detection ≥ 70%
- [ ] Intensity ramps correctly from 0.08 to 1.0
- [ ] Audio component matches visual intensity
- [ ] Layered on top of music (not replacing)

### Alien Silhouette
- [ ] Appears only at detection ≥ 70%
- [ ] Random interval: 60–180 seconds (not fixed)
- [ ] Display duration: 5–8 seconds
- [ ] Audio cue plays on appearance
- [ ] Fades out gradually

## Adding a New Video

1. Create the video file with appropriate 1990s VHS aesthetic
2. Determine which in-game file triggers it
3. Add trigger mapping in code
4. Add scared Kid avatar trigger after video
5. Add UFO74 reaction if appropriate
6. Document in AUDIO_VIDEO.md: trigger file, video path, generation prompt
7. Update FILES_REGISTRY.md: mark file as having video trigger
8. Test the full flow: open file → video plays → avatar → UFO74 → return

## Adding a New Sound Effect

1. Implement via Web Audio API synthesis (no external audio files for SFX)
2. Define the trigger condition
3. Test volume relative to background music
4. Document in AUDIO_VIDEO.md

## After Every Audio/Video Change

1. Test the trigger (open the file, reach the detection level, etc.)
2. Confirm scared Kid avatar fires after video
3. Confirm no video prompt uses real names of individuals
4. Test with music ON and OFF
5. Test with different detection levels
6. Update AUDIO_VIDEO.md with any changes
