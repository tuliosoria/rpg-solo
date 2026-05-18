---
name: skill-authoring
description: Rules for adding, editing, or migrating skills so agents actually load them.
---

# Skill Authoring Workflow

Use this skill when creating a new skill, editing an existing one, or proposing
a new domain skill in a brainstorm or PR.

## The Two Skill Locations

This repo has two places skills can live. Only one is auto-loaded by agents.

| Path | Format | Auto-loaded? | Purpose |
|---|---|---|---|
| `.github/skills/<name>/SKILL.md` | YAML frontmatter | **Yes** — routed from this file's table in `AGENTS.md` | Active runtime guidance |
| `specs-driven/skills/SKILL_<NAME>.md` | Plain markdown | No | Long-form reference deep-dives (`BUGS`, `FILES`, `NARRATIVE`, `TRANSLATION`, `ENDINGS`, `AUDIO_VIDEO`) |

**New skills go in `.github/skills/`.** A skill outside that directory is
invisible to agents and will not self-activate.

## Required Frontmatter

Every `.github/skills/<name>/SKILL.md` MUST start with:

```yaml
---
name: <kebab-case slug, matches directory>
description: <one sentence, scannable, says when to use>
---
```

Both fields are required. The slug in `name` must match the directory name.

## Required AGENTS.md Routing

After creating or renaming a skill, **add a row to the skills table in
`AGENTS.md` (section "Skills (Domain-Specific Guidance)")** in the same PR.
A skill without a table entry is undiscoverable in practice.

## Format Conventions

Match the existing four skills (`game-design`, `game-content`, `testing`,
`version-bump`):

1. `# <Domain> Workflow` heading after frontmatter.
2. One-sentence "Use this skill when ..." paragraph.
3. `## Start Here` section pointing at the canonical source files.
4. Numbered or bulleted checklists for the common operations.
5. `## Common Pitfalls` or `## Don't` section near the end.
6. Target 40–80 lines. If you need more, link out to
   `specs-driven/<DOC>.md` rather than inlining.

## When to Use `specs-driven/skills/` Instead

Use the legacy directory only for **long-form reference material** that
exceeds the 80-line bar and is consulted occasionally rather than every PR
(example: `SKILL_BUGS.md`'s full bug pattern catalog). A reference-only file
must still be linked from the `.github/skills/` skill that points to it, so
agents have a path.

Do not create new `specs-driven/skills/SKILL_*.md` files without a matching
`.github/skills/<name>/SKILL.md` that links to them.

## Don't

- Don't add a skill to `specs-driven/skills/` and expect agents to find it.
- Don't ship a skill without updating the `AGENTS.md` table.
- Don't omit the YAML frontmatter — agent skill loaders parse it.
- Don't duplicate an existing `.github/skills/` skill. Extend it instead.
  (Example: testing additions go inside `.github/skills/testing/SKILL.md`,
  not into a parallel `testing-v2/`.)

## After Every Skill Change

1. Confirm `head -4 .github/skills/<name>/SKILL.md` shows valid frontmatter.
2. Confirm the skill appears in `AGENTS.md` skills table with a one-line
   "Use when" matching the skill's own opening sentence.
3. No code or test runs are required for documentation-only changes.
