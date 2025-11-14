# 🚨 Remediation Plan: AI Service Layer & Layout Unification

**Document Status:** Published - 2024-08-28
**Author:** Lead Systems Analyst
**Conclusion:** A critical, application-breaking issue caused by an incomplete architectural refactor, combined with a major layout inconsistency, has been identified. This plan outlines the comprehensive remediation.

---

### 1. Problem Understanding

-   **Problem:** The application fails to start, presenting a blank screen, and even if it did, the public-facing layouts are inconsistent and unprofessional.
-   **Symptoms:**
    1.  Browser console shows multiple `SyntaxError: The requested module './services/aiService.ts' does not provide an export named '...'`, indicating a fatal JavaScript error.
    2.  Navigating between different public pages results in content jumping and inconsistent spacing, creating a jarring user experience.
-   **Scope:** The issues affect the entire application. The service layer crash is global, and the layout inconsistency affects all routes under `PublicLayout.tsx`.

---

### 2. Root Cause Analysis

-   **Cause 1 (Critical Failure):** An incomplete service layer refactor. The core logic for all AI functions was removed but not reimplemented in the new modular service files under `/services/ai/`. The application was attempting to import and use functions that did not exist, causing a fatal startup crash.
-   **Cause 2 (Layout Inconsistency):** Lack of a single source of truth for page layout. Individual pages defined their own padding, margins, and max-widths, which conflicted with the parent `PublicLayout`, leading to a disjointed and unprofessional visual experience.
-   **Explanation:** These two separate issues combined to render the application both non-functional and visually broken.

---

### 3. Solution Design

-   **Guaranteed Solution:** A two-part, comprehensive fix.
    1.  **Complete the Service Refactor:** Reimplement all missing AI logic within the new modular service files (`deck.ts`, `slide.ts`, `event.ts`, etc.), routing all calls through the `invokeEdgeFunction` abstraction layer. This will fix the startup crash and restore all AI functionality.
    2.  **Unify the Public Layout:** Make `PublicLayout.tsx` the single source of truth for page layout. Centralize `max-width`, `mx-auto`, and all page-level padding within its `<main>` element. Strip all redundant layout styles from the 20+ child pages to enforce consistency.

---

### 4. Implementation Plan

1.  **AI Service Restoration:** Systematically implement all missing AI function bodies in the `/services/ai/` directory.
2.  **Layout Centralization:** Modify `PublicLayout.tsx`'s `<main>` to be `<main className="flex-1 w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">`.
3.  **Child Page Refactor:** Go through every screen component rendered by `PublicLayout` and remove all root-level `max-w-*`, `mx-auto`, `p-*`, `px-*`, and `py-*` classes.
4.  **Documentation Update:** Update `CHANGELOG.md` and `01-docs/progress-tracker.md` to reflect the completion of these critical fixes.

---

### 5. Verification & Validation

-   **Success Criteria:**
    -   The application loads and runs without any console errors.
    -   All AI-powered features across the application are fully functional.
    -   All public-facing pages have a consistent, unified layout and spacing.
-   **Test Cases:**
    -   **E2E Test 1 (Deck Creation):** Verify the full user journey from the Wizard to the Editor works.
    -   **E2E Test 2 (Layout Consistency):** Navigate between `/`, `/about`, `/terms`, `/events`, and `/sunaistartup-deck`. Confirm that the content container has the same width and spacing from the header on every page.

---

### 6. Final Summary

-   **Root Cause:** Incomplete AI service refactor combined with an inconsistent layout architecture.
-   **Fix Applied:** Reimplemented all missing AI logic and centralized all page layout responsibilities into the parent `PublicLayout.tsx`.
-   **Validation:** All AI features have been restored, and the public layout is now consistent and professional.
-   **Future Prevention:** Major refactors must be validated as complete within a single, atomic Pull Request. A design system linter should be considered to enforce layout consistency programmatically.