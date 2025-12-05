
# 🚀 Engineering Plan: Phase 11 - Optimization & Enhancements

**Document Status:** Planning - 2024-09-04
**Goal:** To refine the recently released "Investor Suite" features, focusing on usability, mobile responsiveness, and AI interaction quality.

---

## 1. Usability Enhancements (High Priority)

| Feature | Enhancement | Rationale |
| :--- | :--- | :--- |
| **GTM Strategy** | **PDF Export / Print View** | Users need to share the generated strategy with their team or save it. The current view is screen-only. |
| **Metrics Table** | **Visual Health Indicators** | Raw numbers are hard to parse. Negative burn rates should be red; growing revenue should be green. |
| **Metrics Table** | **Mobile Card View** | Large tables break on mobile. On small screens, rows should transform into individual cards for better readability. |
| **Doc Builder** | **Draft Auto-Save** | Prevent data loss if the user navigates away or the browser crashes during the long generation process. |

## 2. AI Interaction Improvements

| Feature | Enhancement | Rationale |
| :--- | :--- | :--- |
| **All AI Tools** | **Streaming Responses** | Currently, the UI waits for the full response (30s+ for GTM). Streaming text token-by-token reduces perceived latency and improves UX. |
| **Investor Chat** | **"Ask My Data" Interface** | Allow users to chat with their metrics (e.g., "What was my burn rate last Q3?") using Gemini's reasoning capabilities over the SQL data. |
| **Error Handling** | **Smart Retry** | If an AI call fails (e.g., JSON parse error), automatically retry with a "Self-Correction" prompt instructing Gemini to fix the syntax. |

## 3. Architecture & Performance

| Feature | Enhancement | Rationale |
| :--- | :--- | :--- |
| **Database** | **Historical Snapshots** | Store a snapshot of the `metrics` table every time an Investor Update is generated to ensure historical reports don't change if data is updated later. |
| **Caching** | **Market Data Caching** | Cache `generateMarketSizing` results for 24 hours to reduce API costs and latency for repeated views. |

---

## 4. Immediate Implementation Steps

1.  **GTM Strategy:** Add a "Print / Save as PDF" button to the result view.
2.  **Metrics Table:** Apply conditional Tailwind classes for `text-green-600` and `text-red-600` based on values.
3.  **Progress Tracker:** Add these items to the master tracker.
