---
name: testing
description: Guidance for running and updating tests in this repository.
---

Testing workflow:
- Run `npm test` after code changes that affect engine or UI behavior.
- Keep tests in `app/engine/__tests__` and `app/components/__tests__`.
- Prefer direct imports over mocking when possible to avoid module resolution issues.
- Use Vitest utilities (`describe`, `it`, `expect`) and React Testing Library patterns already in the repo.

If adding tests for filesystem gating:
- Update `filesystem.test.ts` with listDirectory/getNode expectations.
- Use `createTestState` to apply overrides for access levels and flags.
