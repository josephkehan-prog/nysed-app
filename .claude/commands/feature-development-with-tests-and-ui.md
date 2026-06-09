---
name: feature-development-with-tests-and-ui
description: Workflow command scaffold for feature-development-with-tests-and-ui in nysed-app.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /feature-development-with-tests-and-ui

Use this workflow when working on **feature-development-with-tests-and-ui** in `nysed-app`.

## Goal

Implements a new feature or module, including core logic, UI components, and corresponding tests.

## Common Files

- `src/modules/ModulePlayer.tsx`
- `src/modules/ModulePlayer.test.tsx`
- `src/modules/ModuleCatalog.tsx`
- `src/modules/ModuleCatalog.test.tsx`
- `src/modules/ItemRenderer.tsx`
- `src/modules/ItemRenderer.test.tsx`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Implement or update core logic in TypeScript files (e.g., src/modules/*.ts or src/progress/*.ts)
- Create or update React UI components (e.g., src/modules/*.tsx, src/components/*.tsx)
- Write or update Jest/React Testing Library tests (e.g., *.test.ts, *.test.tsx)
- Wire up new components to the main app (e.g., src/App.tsx)
- Ensure build passes and tests are green

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.