# SKILL: Files

> Use when: creating, editing, moving, or deleting any in-game file.

---

## Before You Touch a File

1. Read [FILES_REGISTRY.md](../FILES_REGISTRY.md) — find the file, confirm its current state
2. Read [NARRATIVE.md](../NARRATIVE.md) — understand what the file means in the story
3. Read [MECHANICS.md](../MECHANICS.md) — understand access levels, override gates, detection costs

## Checklist for Every File Change

- [ ] File exists in FILES_REGISTRY.md with correct path
- [ ] File has a UFO74 reaction (check CHARACTERS.md for voice)
- [ ] Override gate status is correct (pre-override vs post-override access)
- [ ] Video trigger is documented if applicable (check AUDIO_VIDEO.md)
- [ ] File is flagged as saveable/not-saveable correctly
- [ ] File content is 50–100 words
- [ ] Author voice matches the document type (see CHARACTERS.md — Analyst, Soldier, Medical Examiner, Director)
- [ ] File category is correct for ending evaluation (see ENDINGS.md)

## Creating a New File

1. Choose directory and filename (English, lowercase, with appropriate extension)
2. Write content following SKILL_NARRATIVE.md rules
3. Add UFO74 reaction in `virtualFileSystem.ts`
4. Set access level / clearance requirement
5. Determine if it triggers a video — if yes, document in AUDIO_VIDEO.md
6. Add to FILES_REGISTRY.md with all fields
7. Flag for translation in all three languages

## Editing an Existing File

1. Update content in `virtualFileSystem.ts`
2. Update FILES_REGISTRY.md entry
3. Check if content change affects ending categorization
4. Flag for retranslation if content changed
5. Run validate-translations

## Deleting a File

1. Remove from `virtualFileSystem.ts`
2. Remove UFO74 reaction
3. Remove from FILES_REGISTRY.md
4. Check if any ending depends on this file — update ENDINGS.md if needed
5. Remove any video trigger association

## After Every Change

1. Confirm the file renders correctly in the terminal (`open <filename>`)
2. Confirm UFO74 reaction fires
3. Confirm video trigger works (if applicable)
4. Update FILES_REGISTRY.md translation status
5. Run validate-translations
