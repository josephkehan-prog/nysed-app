```markdown
# nysed-app Development Patterns

> Auto-generated skill from repository analysis

## Overview

This skill teaches you how to contribute effectively to the `nysed-app` codebase, a TypeScript React application focused on educational modules and accessibility. You'll learn the project's coding conventions, how to develop new features, ingest content, enhance accessibility, and write robust tests. The guide includes step-by-step workflows, code style examples, and recommended commands for common tasks.

---

## Coding Conventions

- **Language:** TypeScript
- **Framework:** React
- **File Naming:** Use `camelCase` for files and folders.
  - Example: `modulePlayer.tsx`, `accommodationsContext.tsx`
- **Imports:** Use relative import paths.
  - Example:
    ```ts
    import { ModulePlayer } from './modulePlayer';
    ```
- **Exports:** Prefer named exports.
  - Example:
    ```ts
    export function AccommodationsBar() { ... }
    ```
- **Commits:** Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
  - Types: `feat`, `chore`
  - Example: `feat: add mastery summary to module player`
- **Component Structure:** Place UI components in `src/components/` or `src/modules/`.

---

## Workflows

### Feature Development with Tests and UI

**Trigger:** When adding a new feature or module, including backend logic, UI components, and tests.  
**Command:** `/new-feature`

1. **Implement or update core logic** in TypeScript files.
   - Example: `src/modules/moduleLogic.ts`
2. **Create or update React UI components.**
   - Example: `src/modules/ModulePlayer.tsx`
3. **Write or update tests** for logic and UI.
   - Example: `src/modules/ModulePlayer.test.tsx`
4. **Wire up new components** to the main app.
   - Example: Add to `src/App.tsx`
5. **Ensure build passes and all tests are green.**

**Example:**
```ts
// src/modules/ModulePlayer.tsx
export function ModulePlayer(props: ModulePlayerProps) {
  // component logic
}
```
```tsx
// src/modules/ModulePlayer.test.tsx
import { render } from '@testing-library/react';
import { ModulePlayer } from './ModulePlayer';

test('renders ModulePlayer', () => {
  render(<ModulePlayer />);
  // assertions
});
```

---

### Content Ingestion Pipeline

**Trigger:** When ingesting a batch of new educational content modules.  
**Command:** `/ingest-content`

1. **Write or update an ingestion script.**
   - Example: `scripts/ingest-im-tasks.ts`
2. **Parse and transform source content into JSON module files.**
   - Example: `src/modules/content/math/algebra.json`
3. **Update or create index files** for auto-discovery.
   - Example: `src/modules/content/math/index.ts`
4. **Add or update tests** for parsing/ingestion logic.
   - Example: `src/content/imParse.test.ts`
5. **Run the ingestion script** to generate new content files.

**Example:**
```ts
// scripts/ingest-im-tasks.ts
import { parseIM } from '../src/content/imParse';
parseIM('source.csv', 'src/modules/content/math/');
```
```ts
// src/modules/content/math/index.ts
export * from './algebra.json';
export * from './geometry.json';
```

---

### UI Enhancement with Accessibility

**Trigger:** When adding or improving accessibility (a11y) features in UI components.  
**Command:** `/add-a11y`

1. **Implement or update accessibility context/provider.**
   - Example: `src/a11y/AccommodationsContext.tsx`
2. **Add or update accessibility helpers.**
   - Example: `src/a11y/speak.ts`
3. **Update UI components** to use new accessibility features.
   - Example: `src/components/AccommodationsBar.tsx`
4. **Write or update tests** for accessibility logic and UI.
   - Example: `src/a11y/AccommodationsContext.test.tsx`
5. **Wire provider/context into main app.**
   - Example: `src/App.tsx`

**Example:**
```tsx
// src/a11y/AccommodationsContext.tsx
import React, { createContext, useContext } from 'react';
export const AccommodationsContext = createContext({ tts: false });
// ...provider logic
```
```tsx
// src/components/AccommodationsBar.tsx
import { useContext } from 'react';
import { AccommodationsContext } from '../a11y/AccommodationsContext';
// ...use context for a11y features
```

---

## Testing Patterns

- **Framework:** [Vitest](https://vitest.dev/)
- **Test Files:** Use `.test.tsx` or `.test.ts` suffix.
  - Example: `ModulePlayer.test.tsx`
- **Placement:** Test files are colocated with the code they test.
- **Testing Libraries:** Use React Testing Library for UI components.
- **Example:**
  ```tsx
  // src/modules/ModuleCatalog.test.tsx
  import { render } from '@testing-library/react';
  import { ModuleCatalog } from './ModuleCatalog';

  test('renders ModuleCatalog', () => {
    render(<ModuleCatalog />);
    // assertions
  });
  ```

---

## Commands

| Command         | Purpose                                                      |
|-----------------|--------------------------------------------------------------|
| /new-feature    | Start a new feature/module with logic, UI, and tests         |
| /ingest-content | Ingest new educational content modules via script            |
| /add-a11y       | Add or enhance accessibility features in the UI              |
```
