---
name: version-bump
description: Auto-increment the DEPLOY_VERSION in Terminal.tsx on every push.
---

## Version Bump — Auto-Increment on Push

The game build version is stored as a zero-padded string constant in
`app/components/Terminal.tsx`:

```ts
const DEPLOY_VERSION = 'v008';
```

### When to run

Run this skill **before every push** (or as part of a pre-push workflow).

### Steps

1. Open `app/components/Terminal.tsx`.
2. Find the line matching `const DEPLOY_VERSION = 'v___';` (three-digit number after `v`).
3. Parse the numeric portion (e.g., `008` → `8`).
4. Increment by 1 and zero-pad to 3 digits (e.g., `9` → `009`).
5. Replace the line with the new version string, e.g.:
   ```ts
   const DEPLOY_VERSION = 'v009';
   ```
6. Stage the changed file and amend or create a commit that includes the bump.

### Rules

- Never skip the zero-padding (always 3 digits: `001`, `012`, `123`).
- If the current version cannot be parsed, **stop and ask** rather than guessing.
- Do **not** touch any other line in the file.
