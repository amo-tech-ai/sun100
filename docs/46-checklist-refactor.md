# ✅ Checklist & Validation: `geminiService.ts` Refactor

**Document Status:** Published - 2024-08-22
**Purpose:** To provide a step-by-step checklist for safely refactoring the monolithic `geminiService.ts` into smaller, domain-specific services. This ensures the process is methodical, verifiable, and regression-free.

---

## Phase 1: Preparation & Scaffolding

This phase prepares the codebase for the migration by creating the necessary files and centralizing shared types.

- [x] **Create Shared Types File:**
    - [x] Create a new file: `services/ai.models.ts`.
- [x] **Migrate Shared Types:**
    - [x] Move all shared type and interface definitions (`DeckGenerationResult`, `SlideAnalysis`, `ResearchResult`, `ExtractedMetric`, `BioSummary`) from `geminiService.ts` into `services/ai.models.ts`.
    - [x] Verify that all moved types are correctly exported from `ai.models.ts`.
- [x] **Create New Service Files:**
    - [x] Create empty placeholder files for the new services:
        - [x] `services/deckGenerationService.ts`
        - [x] `services/contentService.ts`
        - [x] `services/visualService.ts`
        - [x] `services/analysisService.ts`
        - [x] `services/suggestionService.ts`

---

## Phase 2: Function & Declaration Migration

This phase involves the systematic migration of functions and their corresponding `FunctionDeclaration` constants to their new, domain-specific homes.

- [x] **`deckGenerationService.ts`:**
    - [x] Move `generateDeckContent` and `generateDeckFromUrls` functions.
    - [x] Move `generateDeckOutlineFunctionDeclaration`.
    - [x] Update all internal imports (e.g., to use types from `ai.models.ts`).
- [x] **`contentService.ts`:**
    - [x] Move `modifySlideContent`, `generateHeadlineVariations`, `extractMetrics`, `generatePricingTable`, and `summarizeBio`.
    - [x] Move their corresponding `FunctionDeclaration` constants.
    - [x] Update all internal imports.
- [x] **`visualService.ts`:**
    - [x] Move `generateSlideImage`, `editSlideImage`, and `generateRoadmapSlide`.
    - [x] Move `generateRoadmapSlideFunctionDeclaration`.
    - [x] Update all internal imports.
- [x] **`analysisService.ts`:**
    - [x] Move `analyzeSlide`, `researchTopic`, `suggestLayout`, `suggestChart`, and `suggestPieChart`.
    - [x] Move their corresponding `FunctionDeclaration` constants.
    - [x] Update all internal imports.
- [x] **`suggestionService.ts`:**
    - [x] Move `fetchAllSuggestions`.
    - [x] Move `getSuggestionsFunctionDeclaration`.
    - [x] Update all internal imports.
- [x] **Verification:**
    - [x] Confirm that `geminiService.ts` is now empty of all the functions and declarations listed above.

---

## Phase 3: Refactor Consumer Components

This phase updates all components that were using the old `geminiService.ts` to use the new, modular services.

- [x] **`screens/DeckEditor.tsx`:**
    - [x] Remove the single, large import from `geminiService.ts`.
    - [x] Add new, specific imports from each of the new service files (e.g., `import { ... } from '../services/visualService'`).
    - [x] Verify that all function calls within `DeckEditor.tsx` (e.g., in `handle...` callbacks) correctly point to the newly imported functions.
    - [x] Ensure the application compiles without errors.
- [x] **`screens/GeneratingScreen.tsx`:**
    - [x] Remove the import from `geminiService.ts`.
    - [x] Add new imports from `services/deckGenerationService.ts`.
    - [x] Verify that the `generateDeckContent` and `generateDeckFromUrls` calls are correct.
    - [x] Ensure the application compiles without errors.

---

## Phase 4: Cleanup & Final Validation

This final phase removes the old file and performs a full regression test to confirm the application is healthy.

- [x] **Delete Old Service:**
    - [x] Delete the file `services/geminiService.ts`.
- [x] **Full Application Regression Test:**
    - [x] Perform an end-to-end test of the deck creation and editing process.
    - [x] Test deck generation from text details.
    - [x] Test deck generation from URLs.
    - [x] In the editor, validate at least one key feature from each new service:
        - [x] Test "Generate Image" (`visualService`).
        - [x] Test "AI Copilot" rewrite (`contentService`).
        - [x] Test "Slide Analysis" (`analysisService`).
        - [x] Test that AI suggestions load on slide select (`suggestionService`).
- [x] **Documentation:**
    - [x] Update `CHANGELOG.md` with an entry noting the major architectural refactor of the service layer.