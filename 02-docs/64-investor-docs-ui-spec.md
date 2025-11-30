# 🎨 UI/UX Specification: Investor Command Center

**Document Status:** Planning - 2024-09-02
**Goal:** To define the visual layout, user flow, and interaction design for the Investor Command Center frontend.

---

## 1. The "Command Center" Dashboard (`InvestorDashboard.tsx`)

**Concept:** A high-density, professional HUD (Heads-Up Display) for fundraising status. Unlike the main app dashboard which is creative/generative, this is analytical and financial.

### Layout Structure
*   **Header:**
    *   **Status Toggle:** "Fundraising Status" (Active/Paused).
    *   **Runway Summary:** A calculated badge (e.g., "8 Months Left" in yellow/red/green).
*   **Top Row (Key Metrics Cards):**
    *   **MRR / Revenue:** Sparkline chart showing last 6 months.
    *   **Burn Rate:** Monthly average with a trend indicator (up/down).
    *   **Cash Balance:** Bank balance input or sync status.
    *   **Commitments:** Soft/Hard committed capital vs. Target.
*   **Main Content Area (Split View):**
    *   **Left (Documents):** List of generated docs grouped by type (One-Pagers, Updates, Strategy).
        *   *Visuals:* Thumbnail previews of the PDF.
        *   *Actions:* Edit, PDF Export, Share Link, "Email to Investors".
    *   **Right (Action Items):** "Data Room Readiness" score and missing item checklist (e.g., "Missing: IP Assignment Agreements").

---

## 2. The Metrics Manager (`MetricsTable.tsx`)

**Concept:** A clean, spreadsheet-like interface for inputting the hard numbers that power the AI generators.

### Features
*   **Structure:**
    *   **Rows:** Revenue, Expenses, Active Users, Churn Rate, CAC, LTV.
    *   **Columns:** Months (Jan, Feb, Mar...).
*   **Interaction:**
    *   **Edit:** Click-to-edit cells with validation.
    *   **Auto-Calc:** Rows like "Net Burn" are read-only and calculated automatically.
    *   **Import:** "Import CSV" button to bulk upload from Stripe/Quickbooks exports.

---

## 3. The Document Generator Wizard (`DocBuilder.tsx`)

**Concept:** A focused, step-by-step flow to create specific investor assets.

### Step 1: Select Asset Type
*   Cards for: "One-Pager", "Investor Update", "Investment Memo", "GTM Strategy".

### Step 2: Context Input (Dynamic Form)
*   **For Investor Update:**
    *   "What were the big wins this month?" (Text Area).
    *   "What are the current blockers?" (Text Area).
    *   "Any specific asks for investors?" (Text Area).
*   **For One-Pager:**
    *   Auto-pulls from Startup Profile (Mission, Team).
    *   Allows override of "Key Highlights".

### Step 3: Generation & Preview (`DocPreview.tsx`)
*   **Split Screen:**
    *   **Left:** Markdown editor for fine-tuning the AI output.
    *   **Right:** Live PDF-style preview rendering the structured data.
*   **Actions:** "Regenerate with Feedback" (e.g., "Make the tone more urgent").

---

## 4. Market Sizing Visualization

**Concept:** A dedicated component to visualize TAM/SAM/SOM.

*   **Visual:** Nested concentric circles.
*   **Interactivity:** Hovering over a circle (e.g., SAM) displays a tooltip with the calculation logic and source citation found by the AI.