# ✅ Checklist & Validation: `geminiService.ts` Refactor

**Document Status:** Published - 2024-08-22
**Purpose:** To provide a step-by-step checklist for safely refactoring the monolithic `geminiService.ts` into smaller, domain-specific services. This ensures the process is methodical, verifiable, and regression-free.

---

## Phase 1: Preparation & Scaffolding

This phase prepares the codebase for the migration by creating the necessary files and centralizing shared types.

- [ ] **Create Shared Types File:**
    - [ ] Create a new file: `services/ai.models.ts`.
- [ ] **Migrate Shared Types:**
    - [ ] Move all shared type and interface definitions (`DeckGenerationResult`, `SlideAnalysis`, `ResearchResult`, `ExtractedMetric`, `BioSummary`) from `geminiService.ts` into `services/ai.models.ts`.
    - [ ] Verify that all moved types are correctly exported from `ai.models.ts`.
- [ ] **Create New Service Files:**
    - [ ] Create empty placeholder files for the new services:
        - [ ] `services/deckGenerationService.ts`
        - [ ] `services/contentService.ts`
        - [ ] `services/visualService.ts`
        - [ ] `services/analysisService.ts`
        - [ ] `services/suggestionService.ts`

---

## Phase 2: Function & Declaration Migration

This phase involves the systematic migration of functions and their corresponding `FunctionDeclaration` constants to their new, domain-specific homes.

- [ ] **`deckGenerationService.ts`:**
    - [ ] Move `generateDeckContent` and `generateDeckFromUrls` functions.
    - [ ] Move `generateDeckOutlineFunctionDeclaration`.
    - [ ] Update all internal imports (e.g., to use types from `ai.models.ts`).
- [ ] **`contentService.ts`:**
    - [ ] Move `modifySlideContent`, `generateHeadlineVariations`, `extractMetrics`, `generatePricingTable`, and `summarizeBio`.
    - [ ] Move their corresponding `FunctionDeclaration` constants.
    - [ ] Update all internal imports.
- [ ] **`visualService.ts`:**
    - [ ] Move `generateSlideImage`, `editSlideImage`, and `generateRoadmapSlide`.
    - [ ] Move `generateRoadmapSlideFunctionDeclaration`.
    - [ ] Update all internal imports.
- [ ] **`analysisService.ts`:**
    - [ ] Move `analyzeSlide`, `researchTopic`, `suggestLayout`, `suggestChart`, and `suggestPieChart`.
    - [ ] Move their corresponding `FunctionDeclaration` constants.
    - [ ] Update all internal imports.
- [ ] **`suggestionService.ts`:**
    - [ ] Move `fetchAllSuggestions`.
    - [ ] Move `getSuggestionsFunctionDeclaration`.
    - [ ] Update all internal imports.
- [ ] **Verification:**
    - [ ] Confirm that `geminiService.ts` is now empty of all the functions and declarations listed above.

---

## Phase 3: Refactor Consumer Components

This phase updates all components that were using the old `geminiService.ts` to use the new, modular services.

- [ ] **`screens/DeckEditor.tsx`:**
    - [ ] Remove the single, large import from `geminiService.ts`.
    - [ ] Add new, specific imports from each of the new service files (e.g., `import { ... } from '../services/visualService'`).
    - [ ] Verify that all function calls within `DeckEditor.tsx` (e.g., in `handle...` callbacks) correctly point to the newly imported functions.
    - [ ] Ensure the application compiles without errors.
- [ ] **`screens/GeneratingScreen.tsx`:**
    - [ ] Remove the import from `geminiService.ts`.
    - [ ] Add new imports from `services/deckGenerationService.ts`.
    - [ ] Verify that the `generateDeckContent` and `generateDeckFromUrls` calls are correct.
    - [ ] Ensure the application compiles without errors.

---

## Phase 4: Cleanup & Final Validation

This final phase removes the old file and performs a full regression test to confirm the application is healthy.

- [ ] **Delete Old Service:**
    - [ ] Delete the file `services/geminiService.ts`.
- [ ] **Full Application Regression Test:**
    - [ ] Perform an end-to-end test of the deck creation and editing process.
    - [ ] Test deck generation from text details.
    - [ ] Test deck generation from URLs.
    - [ ] In the editor, validate at least one key feature from each new service:
        - [ ] Test "Generate Image" (`visualService`).
        - [ ] Test "AI Copilot" rewrite (`contentService`).
        - [ ] Test "Slide Analysis" (`analysisService`).
        - [ ] Test that AI suggestions load on slide select (`suggestionService`).
- [ ] **Documentation:**
    - [ ] Update `CHANGELOG.md` with an entry noting the major architectural refactor of the service layer.
