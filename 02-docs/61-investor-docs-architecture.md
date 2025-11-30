# 🏛️ Architecture: Sun AI Investor Command Center

**Document Status:** Planning - 2024-09-02
**Author:** Lead System Architect
**Goal:** To define the full-stack architecture for the "Investor Command Center," a new module in Sun AI that centralizes the creation, management, and sharing of high-stakes fundraising documents.

---

## 1. System Overview

The **Investor Command Center** is a dedicated dashboard within the application where founders manage their fundraising lifecycle. Unlike the creative "Pitch Deck" flow, this module focuses on **structured data, rigorous analysis, and standardized reporting**.

It acts as a secure repository and generation engine for:
1.  **One-Pagers (Tear Sheets)**
2.  **Investor Updates (Monthly/Quarterly)**
3.  **Investment Memos (Deal Memos)**
4.  **GTM Strategy Docs**
5.  **Data Room Management**

---

## 2. Database Schema (Cloud SQL Extensions)

We need new tables to store these documents and the structured metrics that power them.

```sql
-- TBL: public.investor_docs
-- Stores generated documents (markdown/JSON content)
CREATE TABLE public.investor_docs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id uuid NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
    type text NOT NULL CHECK (type IN ('one_pager', 'update', 'memo', 'gtm_strategy')),
    title text NOT NULL,
    content jsonb NOT NULL, -- Stores the structured content
    status text DEFAULT 'draft', -- 'draft', 'final', 'sent'
    last_generated_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- TBL: public.startup_metrics
-- Stores structured key performance indicators (KPIs) over time
CREATE TABLE public.startup_metrics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id uuid NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
    period_start date NOT NULL, -- e.g., '2024-08-01'
    period_end date NOT NULL,   -- e.g., '2024-08-31'
    mrr numeric,
    burn_rate numeric,
    cash_in_bank numeric,
    active_users integer,
    customer_count integer,
    custom_kpis jsonb, -- Flexible storage for industry-specific metrics
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.investor_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startup_metrics ENABLE ROW LEVEL SECURITY;

-- Policies (Example)
-- CREATE POLICY "Users can manage their own investor docs" ON public.investor_docs ...
```

---

## 3. API & Edge Function Strategy

All generation logic resides in Supabase Edge Functions to protect the Gemini API key and ensure secure database access.

| Endpoint | Function Purpose | Gemini Config |
| :--- | :--- | :--- |
| `/ai/docs/generate-one-pager` | Compiles profile + metrics into a 1-page summary. | `responseSchema` (Strict) |
| `/ai/docs/generate-update` | Compares current vs. previous month metrics and writes a narrative. | `functionCalling`, `thinking: "low"` |
| `/ai/docs/generate-gtm` | Research-heavy strategy generation. | `googleSearch`, `thinking: "high"` |
| `/ai/metrics/extract` | Extracts metrics from uploaded CSV/PDF financial reports. | `files` API, `codeExecution` |

---

## 4. Frontend Component Architecture

The UI will be modular, reusing the `DashboardLayout` but introducing specific components for document management.

```
src/
├── features/investor-docs/
│   ├── components/
│   │   ├── DocEditor.tsx       # Markdown/Block editor for the docs
│   │   ├── MetricsTable.tsx    # Editable grid for KPI entry
│   │   ├── DocPreview.tsx      # PDF-style preview renderer
│   │   └── ExportButton.tsx    # PDF/Link export handler
│   ├── hooks/
│   │   ├── useInvestorDocs.ts  # CRUD hooks
│   │   └── useMetrics.ts       # Metrics calculation logic
│   └── screens/
│       ├── InvestorDashboard.tsx # Main hub
│       └── DocBuilder.tsx        # The generation wizard
```

---

## 5. Security & Privacy

*   **Data Isolation:** RLS strictly enforces that User A cannot see User B's burn rate or investor updates.
*   **Snapshotting:** Investor updates often contain point-in-time data. The architecture supports versioning so that changing a metric today doesn't retroactively change a report sent last month.