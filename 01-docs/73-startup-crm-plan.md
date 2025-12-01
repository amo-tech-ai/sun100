
# 🚀 Product Plan: Startup CRM System

**Document Status:** Planning - 2024-09-05  
**Target Audience:** Product Managers, Engineers, Founders  
**Goal:** To define the architecture, features, and roadmap for a lightweight, AI-powered CRM integrated into the Startup Command Center.

---

## 1. System Overview

The **Startup CRM** is a unified relationship management engine designed specifically for early-stage companies. Unlike bloated enterprise CRMs, this system is lean, intelligent, and dual-purpose: it manages **Customers** (Revenue) and **Investors** (Capital) in a single interface.

**Why it matters:**
Founders often manage critical relationships in spreadsheets, leading to dropped leads, missed follow-ups, and fragmented data. This CRM centralizes all interactions, leverages Gemini AI to predict outcomes, and provides a single source of truth for the startup's growth engine.

---

## 2. Features & Modules

### 📇 Core Database
*   **Contact Management:** Store detailed profiles for individuals (customers, angels, VCs, partners).
*   **Account Management:** Group contacts into organizations/companies.
*   **Tagging System:** Flexible tags (e.g., `#prospect`, `#churn-risk`, `#series-a-lead`) for quick filtering.

### 💰 Deals & Pipeline
*   **Kanban Board:** Drag-and-drop interface for moving deals through stages (Prospect → Qualified → Negotiation → Closed).
*   **Dual Pipelines:** Separate views for **Sales Pipeline** (Customers) and **Fundraising Pipeline** (Investors).
*   **Deal Value:** Track estimated revenue or investment amounts with weighted probability.

### 💬 Interactions & History
*   **Activity Timeline:** A chronological feed of emails, calls, meeting notes, and document shares.
*   **Quick Notes:** Rapid entry for call summaries.
*   **Touchpoint Logging:** Manual or API-driven logging of key interactions.

### 🤖 AI Intelligence (Gemini)
*   **Relationship Health Score:** AI analysis of interaction frequency and sentiment to score connection strength.
*   **Smart Summaries:** Auto-summarize long interaction histories into a 3-bullet executive summary.
*   **Next Best Action:** AI suggestions for follow-ups based on deal stage and time since last contact.

### 📅 Tasks & Workflow
*   **Follow-up Reminders:** Automated prompts to reconnect with dormant leads.
*   **Task Assignment:** Assign specific relationship tasks to team members.

---

## 3. Data Architecture

### Entities & Relationships

| Entity | Description | Key Fields | Relationships |
| :--- | :--- | :--- | :--- |
| **Account** | A company or VC firm. | `name`, `industry`, `website`, `health_score`, `tier` | Has many `Contacts`, `Deals`. |
| **Contact** | An individual person. | `email`, `phone`, `role`, `linkedin_url`, `last_contacted` | Belongs to `Account`. |
| **Deal** | A potential revenue/funding event. | `amount`, `stage`, `probability`, `expected_close_date` | Linked to `Account`. |
| **Interaction** | A touchpoint record. | `type` (email/call), `summary`, `sentiment`, `date` | Linked to `Contact` or `Deal`. |
| **Task** | An action item. | `due_date`, `status`, `priority`, `assignee` | Linked to `Deal` or `Contact`. |

### Data Model Example (JSON)
```json
{
  "account_id": "acc_123",
  "name": "Acme Corp",
  "health_score": 85,
  "pipeline_stage": "Negotiation",
  "contacts": [
    { "name": "Jane Doe", "role": "CTO", "email": "jane@acme.com" }
  ],
  "deals": [
    { "id": "deal_99", "amount": 50000, "status": "Open" }
  ],
  "ai_insights": {
    "summary": "Strong engagement from CTO. Legal review is the bottleneck.",
    "next_action": "Send security compliance doc."
  }
}
```

---

## 4. User Journeys

### 👤 The Founder (Fundraising Mode)
1.  **Input:** Adds a new VC firm ("Sequoia") to the **Investor Pipeline**.
2.  **Action:** Logs notes from a coffee meeting using the mobile view.
3.  **AI Assist:** Gemini suggests, "Send your Series A deck and follow up in 3 days."
4.  **Result:** Sets a task for "Send Deck" and moves deal to "Due Diligence" stage.

### 👥 The Sales Lead (Growth Mode)
1.  **Input:** Uploads a CSV of leads from a recent conference.
2.  **Action:** Mass-emails contacts using a template.
3.  **Tracking:** Updates deal status to "Demo Scheduled" for responders.
4.  **Review:** Checks the **Pipeline Dashboard** to forecast Q3 revenue.

### 🤝 Customer Success (Retention Mode)
1.  **Alert:** Receives a notification: "Account 'TechStart' health dropped to 40%."
2.  **Diagnosis:** Reviews interaction history; sees 3 support tickets and zero logins in 2 weeks.
3.  **Action:** Calls the champion user to intervene.

---

## 5. AI Integration Strategy

We will use Gemini 3 Pro's **Reasoning** and **Structured Output** capabilities.

| Feature | AI Implementation |
| :--- | :--- |
| **Churn Prediction** | Analyze interaction frequency + product usage logs (if connected) to predict churn probability (0-100%). |
| **Sentiment Analysis** | Process recent email/note text to classify sentiment as Positive, Neutral, or Negative. |
| **Deal Scoring** | Score deals based on "BANT" (Budget, Authority, Need, Timing) extraction from notes. |
| **Auto-Enrichment** | Use **Google Search Grounding** to auto-fill company logos, descriptions, and latest news when a website URL is added. |

---

## 6. Metrics & Dashboards

The CRM Dashboard provides a high-level view of the startup's pulse.

*   **Pipeline Velocity:** Average days to close a deal.
*   **Total Pipeline Value:** Sum of (Deal Value * Probability).
*   **Conversion Rate:** Lead-to-Customer %.
*   **Activity Volume:** Calls/Emails per week per team member.
*   **Retention Rate:** % of customers renewed vs. churned.

---

## 7. Filters & Sorting

To manage chaos, users need robust filtering:

*   **By Health:** "Show me all 'At Risk' accounts."
*   **By Stagnation:** "Show deals that haven't moved in 30+ days" (Rotting Deals).
*   **By Value:** "Show deals worth > $10k."
*   **By Owner:** "Show leads assigned to Sarah."
*   **By Sector:** "Show all Fintech investors."

---

## 8. API & Backend Plan

### Endpoints (RESTful)
*   `GET /api/crm/accounts` (List with pagination & filters)
*   `POST /api/crm/accounts` (Create)
*   `GET /api/crm/accounts/:id/timeline` (Fetch full history)
*   `POST /api/crm/deals/move` (Update stage - drag & drop action)
*   `POST /api/ai/analyze-account` (Trigger Gemini analysis)

### Performance
*   **Pagination:** Cursor-based pagination for infinite scrolling lists.
*   **Search:** Full-text search on names and notes using PostgreSQL `tsvector`.

---

## 9. Security & Access Control

*   **Multi-Tenancy:** Strictly enforced via Row-Level Security (RLS). A startup ID is embedded in every query.
*   **Roles:**
    *   **Owner/Admin:** Can delete data, export CSVs, and see all pipelines.
    *   **Member:** Can view/edit data but cannot export or delete bulk records.
*   **Data Privacy:** AI processing is ephemeral; customer PII is not trained upon.

---

## 10. Roadmap

### 🟢 Phase 1: Core Database (MVP)
*   Tables for Accounts/Contacts.
*   Basic CRUD interface.
*   Manual note logging.

### 🟡 Phase 2: Pipelines & Tasks
*   Kanban board for Deals.
*   Task creation and due dates.
*   Investor vs. Customer toggle.

### 🔴 Phase 3: AI Intelligence Layer
*   Integration of Gemini for enrichment and summarization.
*   "Health Score" calculation logic.

### 🔴 Phase 4: Analytics & Automation
*   Dashboard charts.
*   Email integration (optional).

---

## 11. Success Criteria

The CRM is considered "Working" when:
1.  **Data Integrity:** Users can create, edit, and retrieve contacts without error.
2.  **Pipeline Flow:** Dragging a deal on the Kanban board correctly updates the database status.
3.  **Security:** User A cannot see User B's contacts (verified via RLS tests).
4.  **AI Utility:** The "Auto-Enrich" button successfully pulls real data (logo/description) for a valid domain.
