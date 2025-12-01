
# CRM System — Full Dashboard Layout & Component Plan

**Document Status:** Design Spec - 2024-09-05
**Target Audience:** Frontend Engineers, UI Designers
**Style Guide:** Clean, Data-Dense, Modern (Influences: Stripe, Linear, Intercom)

---

## 1. 🎯 Design Philosophy & Goals

The CRM interface serves as the "Central Nervous System" for startup relationships. It must balance **high data density** with **visual clarity**.

*   **Visual Hierarchy:** Use spacing and typography to guide the eye. Metrics first, then active tasks, then deep data.
*   **Action-Oriented:** Every row and card should offer an immediate action (e.g., "Email", "Edit", "View").
*   **AI-Native:** AI insights aren't hidden; they are a primary column in the layout.
*   **Palette:**
    *   **Background:** `#FAFAFA` (Neutral Gray) for the app canvas.
    *   **Cards:** `#FFFFFF` (White) with subtle borders `#E8E8E8`.
    *   **Primary Action:** `#E87C4D` (Brand Orange).
    *   **Health Indicators:** `#10B981` (Healthy), `#F59E0B` (Neutral), `#EF4444` (Risk).

---

## 2. 🧱 Page Layout Architecture

The page utilizes a **responsive grid layout** with a fixed header and a scrolling content area.

### Structure Diagram
```
[ HEADER (Fixed Height: 64px) ]
[ PADDING: 24px ]
[ KPI SUMMARY ROW (Height: 120px) ]
[ GAP: 24px ]
[ MAIN CONTENT GRID (2 Columns on Desktop) ]
   |-- LEFT COL (Flex: 2 / 66%) --|   |-- RIGHT COL (Flex: 1 / 33%) --|
   | Search & Filter Bar          |   | AI Insights Panel             |
   | Customer Data Table          |   | Account Health Panel          |
   | Deal Pipeline Viz            |   | Interaction Timeline          |
   | Segmentation Charts          |   | Upcoming Tasks                |
```

### Responsive Breakpoints
*   **Desktop (>1200px):** Full 2-column layout.
*   **Tablet (768px - 1199px):** Right column drops below Left column. KPI row wraps to 2x2 grid.
*   **Mobile (<768px):** Single column. Table transforms into "Card View". Sidebar/Filters collapse into drawers.

---

## 3. 📌 Header Region

*   **Container:** Flex row, `items-center`, `justify-between`, `border-b`.
*   **Left:**
    *   **Title:** `text-2xl font-bold text-slate-900` ("Customer CRM").
    *   **Subtitle:** `text-sm text-slate-500` ("Track customers, deals, interactions, and retention.").
*   **Right (Actions):**
    *   **Primary Button:** "New Customer" (Icon: `Plus`). Solid Brand Orange.
    *   **Secondary Buttons:** "Add Interaction" (Icon: `Message`), "Import CSV" (Icon: `Upload`). Outline styles.
    *   **Divider:** Vertical hairline separator.

---

## 4. 📊 KPI Summary Row (Hero Metrics)

A row of 4-5 equal-width cards providing instant situational awareness.

### Card Design
*   **Container:** White bg, rounded-xl, border `slate-200`, shadow-sm.
*   **Padding:** `p-4`.
*   **Content:**
    *   **Label:** `text-xs font-bold text-slate-400 uppercase tracking-wider`.
    *   **Value:** `text-2xl font-extrabold text-slate-900` (e.g., "3,482").
    *   **Trend:** Badge (Pill shape) with `TrendingUp` or `TrendingDown` icon. Green/Red bg.

### Card Data Points
1.  **Total Customers:** "Across all segments" | Trend: "+12% this mo"
2.  **Active Accounts:** "Used product in 7 days" | Trend: "+5%"
3.  **Renewal Rate:** "% of contracts renewed" | Trend: "98%" (Green)
4.  **At-Risk Accounts:** "Health Score < 40" | Trend: "14%" (Red Warning)
5.  **Pipeline Value:** "Weighted forecast" | Value: "$450k"

---

## 5. 👈 Left Column: Main Data Workspace

### A. Search & Filter Bar
*   **Layout:** Flex row, `gap-3`.
*   **Search Input:** Large, icon-left (`Search`), full-width on mobile.
*   **Filters:** Dropdown buttons with "active" state styling.
    *   *Status:* (Active, Trial, Churned)
    *   *Segment:* (SMB, Enterprise, Mid-Market)
    *   *Health:* (Healthy, At Risk)
*   **Sorting:** "Sort by: Last Interaction" (Dropdown).

### B. Customer Table (Primary Component)
*   **Style:** Stripe-like data table. `w-full`, `text-sm`.
*   **Hover:** `hover:bg-slate-50` on rows. Cursor pointer.
*   **Columns:**
    1.  **Customer:** Avatar/Logo + Name (Bold) + Email (Subtext).
    2.  **Status:** Badge (e.g., "Active" in Green, "Churned" in Gray).
    3.  **Revenue:** Text (e.g., "$2,000/mo").
    4.  **Health:** Visual Progress Bar (Green/Yellow/Red) or Score Badge (e.g., "85").
    5.  **Last Seen:** Relative time (e.g., "2h ago").
    6.  **Owner:** Avatar of team member.
    7.  **Actions:** "..." menu (Edit, Email, Log Call).

### C. Deal Pipeline Visualization
*   **Concept:** A horizontal "stacked bar" or mini-kanban summary.
*   **Visual:** A single bar divided into colored segments representing stages.
*   **Legend:**
    *   **Lead:** Gray
    *   **Qualified:** Blue
    *   **Negotiation:** Orange
    *   **Closed Won:** Green
*   **Interactivity:** Clicking a segment filters the Customer Table below.

---

## 6. 👉 Right Column: Intelligence & Timeline

### A. AI Insight Panel
*   **Header:** "Gemini Insights" (with Sparkle Icon).
*   **Style:** Gradient background (Subtle Blue/Purple) to differentiate as "AI".
*   **List Items:**
    *   "5 accounts show declining usage this week." (Action: View List)
    *   "Enterprise segment grew 15% faster than SMB." (Action: View Report)
    *   "Deal 'Acme Corp' has stalled for 14 days." (Action: Nudge)

### B. Account Health Overview
*   **Chart:** Radial gauge or Donut chart showing distribution of health scores (e.g., 60% Healthy, 30% Neutral, 10% Risk).
*   **List:** "Top Churn Risks" – List of 3 accounts with lowest health scores.

### C. Interaction Timeline
*   **Style:** Vertical line with nodes.
*   **Items:**
    *   **Email:** Envelope Icon. "Sent proposal to Jane Doe." (2h ago)
    *   **Meeting:** Video Icon. "Demo with Engineering Team." (Yesterday)
    *   **Note:** Sticky Note Icon. "They are concerned about pricing." (2d ago)

### D. Upcoming Tasks
*   **Header:** "To Do".
*   **List:** Checkbox items.
    *   [ ] Follow up with Acme Corp (Due Today)
    *   [ ] Send contract to Beta Inc (Due Tomorrow)
*   **CTA:** "Add Task" button (dashed border, full width).

---

## 7. 📦 Component Library Specifications

### `KPICard.tsx`
*   **Props:** `title`, `value`, `trend`, `trendDirection` ('up' | 'down'), `icon`.
*   **States:** Loading (Skeleton).

### `StatusBadge.tsx`
*   **Props:** `status` ('Active' | 'Trial' | 'Churned' | 'Lead').
*   **Styles:**
    *   Active: `bg-green-100 text-green-800`
    *   Trial: `bg-blue-100 text-blue-800`
    *   Churned: `bg-gray-100 text-gray-600`

### `HealthIndicator.tsx`
*   **Props:** `score` (0-100).
*   **Logic:**
    *   90-100: Green + "Excellent"
    *   70-89: Blue + "Good"
    *   40-69: Yellow + "Neutral"
    *   0-39: Red + "Risk"

### `InsightCard.tsx`
*   **Props:** `type` ('alert' | 'opportunity' | 'info'), `message`, `actionText`, `onAction`.
*   **Visual:** Icon left, bold text, small text button right.

---

## 8. 📱 Mobile Adaptation Plan

On mobile viewports (`<768px`):

1.  **Table Transformation:** The data table is hidden. Instead, render a `CustomerCardList` component. Each row becomes a standalone card showing only Name, Status, and Health.
2.  **Sidebar behavior:** The "Right Column" (Insights/Tasks) moves to a tabbed interface or a bottom drawer triggered by a floating action button (FAB) or a secondary tab bar.
3.  **Filters:** Complex filters move into a slide-over drawer modal.

---

**End of Specification**
