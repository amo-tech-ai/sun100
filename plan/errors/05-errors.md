
# 🚨 System Troubleshooting Report: Critical Errors & Remediation

**Date:** 2025-01-23
**Status:** Critical Action Required

## 1. 🔴 Critical Architecture Errors (Build & Runtime Blockers)

### 1.1. "Split-Brain" Application Structure
**Severity:** Critical
**Location:** Root vs. `src/`
- **Observation:** The codebase contains conflicting entry points and structure.
    - `main.tsx` exists at the root level.
    - `src/App.jsx` exists inside a `src` folder.
    - `App.tsx` (implied by `main.tsx` import) exists at the root.
- **Why it breaks:** Vite expects a clean `src/` directory. Having source files at the root *and* in `src/` creates duplicate code paths, build failures, and confusion about which `App` component is the source of truth.
- **Fix:** Move all source code (`main.tsx`, `App.tsx`, `screens`, `components`, `services`, `hooks`, `contexts`, `lib`) into the `src/` directory. Update `index.html` to point to `/src/main.tsx`. Delete the redundant `src/App.jsx`.

### 1.2. Hardcoded Auth Bypass (Security Risk)
**Severity:** Critical
**Location:** `contexts/AuthContext.tsx`
- **Observation:** The `useEffect` explicitly forces a mock user: `setUser({ id: 'mock-user-id', ... })` and logs "🔓 Auth disabled for development".
- **Why it breaks:** If deployed to production, **Authentication is effectively disabled**. Furthermore, this mock user ID (`mock-user-id`) will fail Postgres Row-Level Security (RLS) policies if the app attempts to talk to a real Supabase database (which requires a valid JWT UUID).
- **Fix:** Remove the forced mock override or wrap it strictly in a `if (import.meta.env.DEV && IS_MOCK_MODE)` check. Ensure the fallback handles RLS failures gracefully.

### 1.3. Edge Function Timeout Risk
**Severity:** High
**Location:** `supabase/functions/investor-ai/index.ts` (and others)
- **Observation:** Functions use `thinkingConfig` (reasoning models) and `googleSearch` tools synchronously.
- **Why it breaks:** Reasoning models can take 30-60+ seconds to generate. Standard Supabase Edge Functions have a default timeout (often 60s). Long-running generations will result in `504 Gateway Timeout` errors on the frontend.
- **Fix:** Implement client-side retries/polling or ensure Edge Function timeouts are configured to maximum. Ideally, switch to an async job queue for heavy reasoning tasks.

---

## 2. ⚠️ Important Code Quality & Consistency Flags

### 2.1. Inconsistent File Extensions
- **Observation:** `src/App.jsx` uses `.jsx` while the rest of the project uses `.tsx`.
- **Impact:** Inconsistent type safety. `.jsx` files lose TypeScript benefits.
- **Fix:** Convert all component files to `.tsx`.

### 2.2. Prop Drilling in CRM
- **Observation:** `CustomerCRM.tsx` manages extensive state (`selectedCustomer`, `emailTarget`, `isFormOpen`, `tasks`, `deals`) and passes it down deeply.
- **Impact:** Hard to maintain.
- **Fix:** Refactor `CustomerCRM` state into a localized Context or Zustand store, similar to the `DeckEditorContext` pattern.

### 2.3. "Magic String" Dependencies
- **Observation:** AI Prompts (e.g., in `services/ai/deck.ts`) rely on implicit knowledge of the slide structure.
- **Impact:** If the `Slide` type changes, prompts might generate invalid JSON.
- **Fix:** Ensure `zod` schemas or strict TypeScript interfaces are shared between the AI service prompt generation and the response validation.

---

## 3. 🔍 Missing Best Practices

1.  **No Error Boundary:** If a specific widget (e.g., `TaskAdvisorWidget`) crashes, it might take down the whole dashboard. Wrap complex widgets in React Error Boundaries.
2.  **Environment Variable Validation:** `lib/supabaseClient.ts` checks for env vars but doesn't validate their format. Malformed keys can cause silent auth failures.
3.  **Accessibility (a11y):** Many icon-only buttons in `RightSidebar.tsx` and `CRM` components lack `aria-label` attributes.

## 4. Recommended Remediation Plan

1.  **Consolidate Source:** Move root source files into `src/`.
2.  **Secure Auth:** Restore real Supabase Auth logic in `AuthContext.tsx`.
3.  **Unify App Entry:** Delete `src/App.jsx` and ensure `src/App.tsx` is the master router.
4.  **Timeout Handling:** Add robust error handling in `edgeFunctionService.ts` specifically for 504 Timeouts.
