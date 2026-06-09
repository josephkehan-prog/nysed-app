---
name: ui-enhancement-with-accessibility
description: Workflow command scaffold for ui-enhancement-with-accessibility in nysed-app.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /ui-enhancement-with-accessibility

Use this workflow when working on **ui-enhancement-with-accessibility** in `nysed-app`.

## Goal

Adds or improves accessibility features in UI components, including state management and a11y helpers, with corresponding tests.

## Common Files

- `src/a11y/AccommodationsContext.tsx`
- `src/a11y/AccommodationsContext.test.tsx`
- `src/a11y/speak.ts`
- `src/components/AccommodationsBar.tsx`
- `src/components/AccommodationsBar.test.tsx`
- `src/modules/ItemRenderer.tsx`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Implement or update accessibility context/provider (e.g., src/a11y/AccommodationsContext.tsx)
- Add or update accessibility helpers (e.g., src/a11y/speak.ts)
- Update UI components to use new accessibility features (e.g., src/components/AccommodationsBar.tsx, src/modules/ItemRenderer.tsx, src/modules/ModulePlayer.tsx)
- Write or update tests for accessibility logic and UI (e.g., *.test.tsx)
- Wire provider/context into main app (e.g., src/App.tsx)

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.