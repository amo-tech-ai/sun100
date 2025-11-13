# 🗺️ Implementation Plan: AI Service Layer Refactor

**Document Status:** Published - 2024-08-27
**Author:** Senior Frontend Architect
**Goal:** To provide a comprehensive plan for refactoring the monolithic `services/aiService.ts` into a modular, maintainable, and scalable architecture, preparing it for a future migration to a secure backend like Supabase Edge Functions.

---

### 📊 **Progress Task Tracker**

| Phase | Task / Milestone | Status |
| :--- | :--- | :---: |
| **1. Analysis & Planning** | Define the new modular structure and create this enhanced plan. | ✅ **Completed** |
| **2. Core Refactoring** | Create new files, extract types/prompts, and move functions to their respective modules. | 🔴 **Not Started** |
| **3. Facade Implementation** | Update `aiService.ts` to re-export from the new modules, ensuring no breaking changes. | 🔴 **Not Started** |
| **4. Validation & Testing** | Manually test all AI features and run build/lint checks to ensure no regressions. | 🔴 **Not Started** |
| **5. Documentation Update** | Update this document to reflect the successful completion of the refactor. | 🔴 **Not Started** |

---

## 1. Executive Summary & Goal

The current `services/aiService.ts` file has become a monolithic "God file," containing all AI-related logic for every feature in the application. This creates significant technical debt, making the codebase difficult to maintain, test, and scale.

The goal of this refactor is to break down this single file into a collection of smaller, single-responsibility modules organized by feature domain (e.g., `deck`, `slide`, `event`). This will dramatically improve code quality and prepare our services for a smoother migration to a secure, full-stack backend.

---

## 2. Analysis of Current State

-   **Problem:** The `aiService.ts` file is a single, large file containing mixed concerns.
-   **Impact:**
    -   **High Cognitive Load:** A developer needs to understand the entire file to safely make a small change.
    -   **Difficult to Test:** Testing a single function requires dealing with many unrelated dependencies.
    -   **Poor Scalability:** Adding new AI features further bloats the file.
    -   **Migration Risk:** Migrating this large file to a backend service is a high-risk, all-or-nothing operation.

---

## 3. Proposed New Architecture: Modular & Backend-Ready Services

We will adopt a modular structure that isolates concerns and explicitly prepares for a migration to secure backend functions.

### New Folder Structure

```
/services/
  ├── aiService.ts      // This becomes the "Facade"
  └── ai/
      ├── deck.ts       // Domain logic for decks
      ├── slide.ts      // Domain logic for slides
      ├── image.ts      // Domain logic for images
      ├── event.ts      // Domain logic for events
      ├── research.ts   // Domain logic for research
      ├── types.ts      // Shared TypeScript interfaces
      ├── prompts.ts    // Centralized library of FunctionDeclarations
      └── edgeClient.ts // NEW: Centralized network client for AI calls
```

### The Facade (`aiService.ts`)
The original `services/aiService.ts` will be cleared and will now serve as a clean entry point that re-exports all functions and types from the new modules. This ensures this is a **non-breaking change** for any UI component that imports from it.

```typescript
// The new content of services/aiService.ts
export * from './ai/deck';
export * from './ai/slide';
export * from './ai/image';
export * from './ai/event';
export * from './ai/research';
export * from './ai/prompts';
export * from './ai/types'; // Explicitly re-export all types
```

### 3.1 Future-Proofing: The `edgeClient` Abstraction
A new `services/ai/edgeClient.ts` file will be created. It will contain a single helper function, `callAiFunction(name, payload)`, responsible for all outbound calls to the Gemini API.

-   **Why it Matters:** All domain modules (`deck.ts`, `slide.ts`, etc.) will call this helper instead of the Gemini API directly. This creates a single point of control. When we migrate to Supabase Edge Functions, we only need to change the implementation inside `edgeClient.ts` to use `supabase.functions.invoke()` instead of `@google/genai`. **The migration becomes a one-file change.**

### 3.2 Clear Separation of Concerns
Each domain module (`deck.ts`, `slide.ts`, etc.) will follow a clear internal structure:
1.  **Public Functions:** The exported functions that the UI calls (e.g., `generateFullDeck`).
2.  **Internal Logic:** These functions will be short and simple: "prepare payload → call `edgeClient` → map result."
3.  **Prompt Builders:** All complex prompt logic and `FunctionDeclaration` objects will reside in `prompts.ts`.
4.  **Response Mappers:** Logic to map the raw AI response to our application's types will be located within each module.

---

## 4. Step-by-Step Implementation Plan

### Step 0: Pre-Refactor Safety Checklist
- [ ] `git commit` the current stable state of the application.
- [ ] Run all existing tests to establish a baseline: `npm run test`.
- [ ] Manually smoke test the core AI flows: Generate a deck, analyze a slide, generate an image.

### Step 1: Create New Files & Folders
- [ ] Create the `/services/ai` directory.
- [ ] Create all the new `.ts` files as outlined in the architecture above, including `edgeClient.ts`.

### Step 2: Extract Shared Types & Prompts
- [ ] Cut all `export interface` and `export type` definitions from `aiService.ts` and paste them into `services/ai/types.ts`.
- [ ] Cut all `FunctionDeclaration` objects from `aiService.ts` and paste them into `services/ai/prompts.ts`, exporting each one.

### Step 3: Implement `edgeClient.ts`
- [ ] Create the `callAiFunction` helper. For now, it will directly call the Gemini API.

### Step 4: Move Functions by Domain
- [ ] Systematically cut each function from `aiService.ts` and paste it into the appropriate new module file.
- [ ] Update each moved function to call the new `edgeClient` instead of the Gemini API directly.
- [ ] Update imports in each new file to reference `types.ts` and `prompts.ts`.

### Step 5: Implement the Facade
- [ ] Delete all content from the original `services/aiService.ts`.
- [ ] Add the `export * from './ai/...'` statements for each new module, ensuring `types.ts` is included.

### Step 6: Post-Refactor Validation Checklist
- [ ] Run the build to check for type errors: `npm run build`.
- [ ] Run the linter to check for style issues: `npm run lint`.
- [ ] Run all tests again to check for regressions: `npm run test`.
- [ ] Perform a full manual smoke test of all AI features to confirm functionality:
    - [ ] Deck Generation from Wizard.
    - [ ] Deck Editor: Copilot, Image Gen/Edit, Analysis, Research, Layout/Chart suggestions.
    - [ ] Event Wizard: All AI generation buttons.

---

## 5. Success Criteria & Validation

-   [ ] The application builds and runs without errors.
-   [ ] All AI-powered features function exactly as they did before the refactor. There are no regressions.
-   [ ] The original `aiService.ts` file is a small file containing only `export` statements.
-   [ ] All outbound Gemini API calls are routed through the `edgeClient.ts` helper.
-   [ ] The codebase is now significantly more organized, maintainable, and prepared for backend migration.
-   [ ] All steps in the Post-Refactor Validation Checklist are successfully completed.
