# 📊 Progress Tracker: Investor Docs Module

**Document Status:** Planning - 2024-09-02
**Goal:** To track the development of the "Investor Command Center" and its AI capabilities.

---

### 🟩 Status Legend

| Status | Meaning |
| :--- | :--- |
| 🟢 **Completed** | Fully implemented & tested. |
| 🟡 **In Progress** | Development started. |
| 🔴 **Not Started** | Planned but untouched. |

---

### 📝 Feature Implementation Status

| Phase | Task / Feature | Status | Owner | Notes |
| :--- | :--- | :---: | :--- | :--- |
| **1. Database** | **Schema Migration** | 🔴 | Backend | Tables: `investor_docs`, `startup_metrics`. |
| | **RLS Policies** | 🔴 | Backend | Ensure strict data isolation. |
| **2. Backend Logic** | **Edge Function: `generate-one-pager`** | 🔴 | Backend | Connects DB data to Gemini schema. |
| | **Edge Function: `generate-update`** | 🔴 | Backend | Logic for metric comparison. |
| | **Edge Function: `generate-market-sizing`** | 🔴 | Backend | Uses Google Search Grounding. |
| | **Edge Function: `audit-data-room`** | 🔴 | Backend | File list analysis. |
| **3. Frontend UI** | **`InvestorDashboard.tsx`** | 🔴 | Frontend | Main HUD layout. |
| | **`MetricsTable.tsx`** | 🔴 | Frontend | Editable grid for KPIs. |
| | **`DocBuilder.tsx`** | 🔴 | Frontend | Wizard for generating docs. |
| | **`DocPreview.tsx`** | 🔴 | Frontend | PDF-style renderer. |
| | **Market Sizing Visualization** | 🔴 | Frontend | TAM/SAM/SOM interactive chart. |
| **4. Integration** | **E2E: Generate One-Pager** | 🔴 | QA | Test full flow from DB to PDF. |
| | **E2E: Market Sizing Agent** | 🔴 | QA | Verify Search grounding works. |

---

### 🚀 Next Actions
1.  Create the database migration file (`supabase/migrations/...`).
2.  Scaffold the `InvestorDashboard.tsx` screen to visualize the end goal.