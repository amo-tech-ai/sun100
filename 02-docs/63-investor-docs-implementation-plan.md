# 🗺️ Implementation Plan: Investor Command Center

**Document Status:** Planning - 2024-09-02
**Goal:** A phased roadmap to build the backend, API, and frontend for the Investor Docs module.

---

## Phase 1: Data Layer (Cloud SQL)

**Goal:** Establish the persistent storage for docs and metrics.

1.  **Create Migration Script:**
    *   Define `investor_docs` table (JSONB content).
    *   Define `startup_metrics` table (Numeric/Integer columns).
    *   Set up RLS policies (Owners only).
2.  **Execute Migration:** Run via Supabase CLI or SQL Editor.
3.  **Seed Data:** Create dummy metrics for the demo user to test visualization.

## Phase 2: Backend Logic (Edge Functions)

**Goal:** Create the "Brain" that connects data to Gemini.

1.  **`generate-one-pager` Function:**
    *   Fetch Startup Profile + Latest Metrics from DB.
    *   Call Gemini with `onePagerSchema`.
    *   Return JSON result.
2.  **`generate-investor-update` Function:**
    *   Fetch metrics for `current_month` and `current_month - 1`.
    *   Calculate deltas (Growth %).
    *   Call Gemini to draft the narrative.
3.  **`extract-metrics` Function:**
    *   Accept a file upload (PDF/CSV).
    *   Use Gemini Files API + Code Execution to parse and return structured Key/Value pairs.

## Phase 3: Frontend UI (React)

**Goal:** A professional, dashboard-style interface.

1.  **`InvestorDashboard.tsx`:**
    *   Display a chart of MRR/Burn (using custom SVG or a charting lib).
    *   List recent documents with status badges.
2.  **`MetricsTable.tsx`:**
    *   A simplified spreadsheet-like interface for manual metric entry.
3.  **`DocBuilder.tsx`:**
    *   A wizard to select document type (One-Pager vs. Update).
    *   Inputs for "Key Wins," "Asks," etc.
    *   "Generate" button triggering the Edge Function.
4.  **`DocPreview.tsx`:**
    *   A print-friendly view for the generated JSON data.
    *   "Download PDF" and "Copy Link" buttons.

## Phase 4: Integration & Testing

1.  **E2E Test:** Create a startup -> Add Metrics -> Generate One-Pager -> Save.
2.  **Validation:** Ensure RLS prevents accessing another user's metrics.
3.  **Polish:** Add loading states ("AI is analyzing your metrics...") and error handling.

---

## Timeline Estimate

*   **Phase 1 (DB):** 1 Day
*   **Phase 2 (API):** 2 Days
*   **Phase 3 (UI):** 3 Days
*   **Phase 4 (QA):** 1 Day

**Total:** ~1 Week for MVP release.