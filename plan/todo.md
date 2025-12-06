# Sun AI - Master Todo & Progress Tracker

**Last Updated:** 2025-12-06  
**Overall Progress:** 42%  
**Target:** Production Ready (≥90%)

---

## 📊 Features Matrix

| Module | Status | Progress | Priority | Sprint |
|--------|--------|----------|----------|--------|
| **Core Platform** | ✅ Done | 100% | P0 | - |
| **Pitch Deck Editor** | ✅ Done | 95% | P0 | - |
| **Auth & Security** | ✅ Done | 100% | P0 | - |
| **Edge Functions (33)** | ✅ Done | 100% | P0 | - |
| **CRM - Contacts** | 🟡 WIP | 60% | P1 | S1 |
| **CRM - Deals Pipeline** | 🟡 WIP | 50% | P1 | S1 |
| **CRM - Tasks System** | 🔴 Todo | 20% | P1 | S1 |
| **Workflows Engine** | 🔴 Todo | 10% | P1 | S2 |
| **Automation Rules** | 🔴 Todo | 0% | P2 | S2 |
| **📄 Document Suite (10 Docs)** | 🔴 Todo | 0% | P1 | S3 |
| **AI Task Generator** | 🔴 Todo | 0% | P1 | S3 |
| **AI Insights & Forecast** | 🔴 Todo | 0% | P2 | S4 |
| **Communication Hub** | 🔴 Todo | 0% | P2 | S4 |

---

## 📄 Document Suite - The 10 Essential Startup Documents

### Overview

| # | Document | Purpose | AI Tools Used |
|---|----------|---------|---------------|
| 1 | **Pitch Deck** | Investor presentation (10-12 slides) | Gemini 3 Pro + Structured Output + URL Context |
| 2 | **One-Pager** | Quick intro summary (1 page) | Gemini 2.5 Flash + Structured Output |
| 3 | **Executive Summary** | 1-2 paragraph snapshot | Gemini 2.5 Flash + Text Gen |
| 4 | **Business Plan / Lean Canvas** | Business model outline | Gemini 3 Pro + Thinking |
| 5 | **Financial Model** | Revenue, costs, projections (12-36mo) | Gemini + Code Execution |
| 6 | **GTM Strategy** | Go-to-market plan | Gemini 3 Pro + Google Search + Thinking |
| 7 | **Market Research** | TAM/SAM/SOM + competitors | Gemini 3 Pro + Google Search |
| 8 | **Product Roadmap** | Features timeline (MVP → V2) | Gemini 2.5 Flash + Structured Output |
| 9 | **Legal Checklist** | Incorporation, IP, contracts | Gemini 2.5 Flash + Structured Output |
| 10 | **Data Room Checklist** | Due diligence folder structure | Gemini 2.5 Flash + Structured Output |

### Generation Flow

```
User Input → URL Context → RAG File Search → Google Search → Gemini 3 Pro → Structured JSON → UI Editor → Export (PDF/Slides/Notion)
```

### AI Features by Document

| Document | Text Gen | Structured Output | Google Search | URL Context | RAG | Code Exec |
|----------|----------|-------------------|---------------|-------------|-----|-----------|
| Pitch Deck | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| One-Pager | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| Executive Summary | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| Business Plan | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Financial Model | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| GTM Strategy | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Market Research | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Product Roadmap | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| Legal Checklist | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Data Room | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |

---

## 🎯 Success Criteria

### Production Ready Checklist

| Category | Criteria | Status |
|----------|----------|--------|
| **Build** | `npm run build` passes with 0 errors | ✅ |
| **Console** | 0 browser console errors | ✅ |
| **Network** | 0 failed requests (no 404s) | ✅ |
| **Edge Functions** | All 33+ functions deployed | ✅ |
| **Auth** | Login/logout works, mock mode only in dev | ✅ |
| **RLS** | All tables have org_id RLS policies | 🟡 |
| **CRM CRUD** | Create/read/update/delete contacts, deals, tasks | 🔴 |
| **Workflows** | 5-step workflow runs end-to-end | 🔴 |
| **Automation** | Rules trigger correctly on events | 🔴 |
| **AI Integration** | Task generator returns valid JSON | 🔴 |
| **Document Suite** | All 10 docs generate without errors | 🔴 |
| **Performance** | Pipeline renders 200+ deals smoothly | 🔴 |
| **Mobile** | Responsive on all breakpoints | 🟡 |

### Document Suite Acceptance Tests

- [ ] Generate pitch deck from startup form (< 2 min)
- [ ] Generate one-pager from URL context
- [ ] Generate GTM strategy with Google Search grounding
- [ ] Generate market research with cited sources
- [ ] Generate financial model from CSV upload
- [ ] Export documents to PDF
- [ ] Edit any document section, regenerate with AI
- [ ] All 10 documents stored and retrievable

### CRM Acceptance Tests

- [ ] Create org → add accounts → add contacts → add deals → create tasks
- [ ] Run workflow → automation creates follow-up tasks
- [ ] AI generates tasks from deal context
- [ ] Cross-org access denied (RLS test)
- [ ] All CRM screens load without 404 errors
- [ ] Task status changes reflect in <2s across views

---

## ✅ COMPLETED

### Core Platform (100%)
- [x] React + Vite + TypeScript setup
- [x] Tailwind CSS configuration
- [x] Supabase client integration
- [x] Auth context & protected routes
- [x] Error boundaries
- [x] Provider chain (main.tsx)

### Pitch Deck Editor (95%)
- [x] Deck generation wizard
- [x] Slide editor with canvas
- [x] AI slide content generation
- [x] Template system
- [x] Export functionality
- [ ] Real-time collaboration (future)

### Edge Functions (100%)
- [x] 33 functions deployed to Supabase
- [x] GEMINI_API_KEY configured
- [x] CORS headers on all functions
- [x] Structured output schemas

### Auth & Security (100%)
- [x] Supabase auth integration
- [x] Protected routes
- [x] Dev mode bypass (VITE_DISABLE_AUTH)
- [x] Production safety guards
- [x] Mock mode only in development

---

## 🟡 IN PROGRESS

### CRM - Contacts (60%)
- [x] `crm_contacts` table exists
- [x] Basic contacts screen
- [x] Contact list view
- [ ] Contact detail drawer
- [ ] AI enrichment display
- [ ] Activity timeline per contact
- [ ] Search & filters

### CRM - Deals Pipeline (50%)
- [x] `crm_deals` table exists
- [x] Basic deals screen
- [x] Deal card component
- [ ] Kanban board view
- [ ] Drag-and-drop stages
- [ ] Deal detail panel
- [ ] Pipeline filters (fundraising/sales/hiring)

### CRM - Tasks System (20%)
- [x] Basic task concept in PRD
- [ ] `crm_tasks` table migration
- [ ] Task row component
- [ ] Task list view
- [ ] Task filters (status, priority, type)
- [ ] Phase-based grouping (5-step)
- [ ] Due date handling
- [ ] Assignee support

---

## 🔴 TODO

### Phase 1: Database & Schema (Sprint 1)

#### 1.1 CRM Tasks Table
```sql
-- Migration: crm_tasks
- [ ] Create table with all columns
- [ ] Add RLS policy (org_id)
- [ ] Add indexes (deal_id, contact_id, due_at)
- [ ] Test CRUD operations
```

#### 1.2 Workflows Tables
```sql
-- Migration: crm_workflows + crm_workflow_runs
- [ ] Create crm_workflows table
- [ ] Create crm_workflow_runs table
- [ ] Add RLS policies
- [ ] Seed default workflow templates
```

#### 1.3 Automation Tables
```sql
-- Migration: automation_rules + crm_activities
- [ ] Create automation_rules table
- [ ] Create crm_activities table
- [ ] Add RLS policies
- [ ] Add trigger functions
```

### Phase 2: Document Suite Tables (Sprint 3)

#### 2.1 Documents Table
```sql
-- Migration: startup_documents
- [ ] Create table: id, org_id, startup_id, doc_type, title, content_json, status, created_at, updated_at
- [ ] doc_type ENUM: pitch_deck, one_pager, exec_summary, business_plan, financial_model, gtm_strategy, market_research, product_roadmap, legal_checklist, data_room
- [ ] Add RLS policy (org_id)
- [ ] Add indexes
```

#### 2.2 Document Versions
```sql
-- Migration: document_versions
- [ ] Create table for version history
- [ ] Link to startup_documents
- [ ] Add RLS policy
```

### Phase 3: Document Suite Edge Functions (Sprint 3)

#### 3.1 Master Document Generator
```
- [ ] Create supabase/functions/generate-startup-docs
- [ ] Accept: startup info, doc_types[], grounding options
- [ ] Use URL Context for website extraction
- [ ] Use Google Search for market data
- [ ] Return structured JSON for each doc type
```

#### 3.2 Individual Document Functions
```
- [ ] generate-one-pager (Gemini 2.5 Flash)
- [ ] generate-exec-summary (Gemini 2.5 Flash)
- [ ] generate-business-plan (Gemini 3 Pro + Thinking)
- [ ] generate-financial-model (Gemini + Code Exec)
- [ ] generate-gtm-strategy (EXISTS - enhance)
- [ ] generate-market-sizing (EXISTS - enhance)
- [ ] generate-product-roadmap (Gemini 2.5 Flash)
- [ ] generate-legal-checklist (Gemini 2.5 Flash)
- [ ] generate-data-room-checklist (Gemini 2.5 Flash)
```

#### 3.3 Document Editing Functions
```
- [ ] rewrite-document-section
- [ ] expand-section
- [ ] shorten-section
- [ ] improve-clarity
- [ ] add-citations
```

### Phase 4: Document Suite Frontend (Sprint 3-4)

#### 4.1 Documents Dashboard
```
- [ ] Create screens/DocumentsHub.tsx
- [ ] Grid of 10 document cards
- [ ] Status: Not Started, Draft, Complete
- [ ] Click to open editor
- [ ] "Generate All" button
```

#### 4.2 Document Wizard
```
- [ ] Create components/documents/DocumentWizard.tsx
- [ ] Step 1: Startup basics (name, tagline, stage)
- [ ] Step 2: Website URL (for URL Context)
- [ ] Step 3: Upload files (for RAG)
- [ ] Step 4: Select documents to generate
- [ ] Step 5: Grounding options (Search, URL, Files)
```

#### 4.3 Document Editor
```
- [ ] Create screens/DocumentEditor.tsx
- [ ] Left: Document outline/sections
- [ ] Center: Editable content
- [ ] Right: AI actions panel
- [ ] Export: PDF, PPTX, Notion, Google Docs
```

#### 4.4 Document Components
```
- [ ] components/documents/OnePagerCard.tsx
- [ ] components/documents/PitchDeckSlide.tsx
- [ ] components/documents/FinancialTable.tsx
- [ ] components/documents/GTMTimeline.tsx
- [ ] components/documents/ChecklistItem.tsx
```

### Phase 5: CRM Edge Functions (Sprint 2)

#### 5.1 AI Task Generator
```
- [ ] Create supabase/functions/crm-generate-tasks
- [ ] Define input schema (deal context, pipeline, stage)
- [ ] Define output schema (task array)
- [ ] Integrate Gemini 3 Pro with thinkingLevel: high
- [ ] Add Google Search grounding for company research
- [ ] Test with sample deals
```

#### 5.2 Automation Dispatcher
```
- [ ] Create supabase/functions/crm-automation-dispatch
- [ ] Load matching rules by trigger_event
- [ ] Evaluate trigger_filter conditions
- [ ] Execute actions (create_task, call_ai, update_field)
- [ ] Log to crm_activities
- [ ] Handle errors gracefully
```

#### 5.3 Communication Drafts
```
- [ ] Create supabase/functions/crm-communication-draft
- [ ] Email drafting with Gemini 2.5 Flash
- [ ] Meeting brief generation
- [ ] Activity summarization
```

#### 5.4 Pipeline Forecast
```
- [ ] Create supabase/functions/crm-forecast
- [ ] Aggregate deal data by stage
- [ ] Calculate win probability
- [ ] Generate AI insights
- [ ] Return structured JSON
```

### Phase 6: CRM Frontend Screens (Sprint 1-2)

#### 6.1 CRM Dashboard
```
- [ ] Create screens/CrmDashboard.tsx
- [ ] KPI row (4 cards)
- [ ] Pipeline snapshot
- [ ] "My Work Today" task list
- [ ] Recent activity feed
- [ ] Responsive breakpoints
```

#### 6.2 Contacts Screen
```
- [ ] Update screens/CustomerCRM.tsx
- [ ] Left filter sidebar
- [ ] Main table with sorting
- [ ] Right detail drawer
- [ ] Tabs: Overview, Activity, Tasks, AI Insights
```

#### 6.3 Deals Pipeline
```
- [ ] Update screens/Prospecting.tsx
- [ ] Kanban board layout
- [ ] Drag-and-drop between stages
- [ ] Deal card with amount, stage, next task
- [ ] Slide-over detail panel
```

#### 6.4 Tasks & Workflows
```
- [ ] Create screens/TasksWorkflows.tsx
- [ ] Top tabs: All, Today, Week, Overdue, Workflows
- [ ] Phase strips: Capture → Clarify → Plan → Execute → Review
- [ ] Mini-kanban per phase
- [ ] Left filters: pipeline, owner, priority, type
```

### Phase 7: Services & State (Sprint 1-2)

#### 7.1 CRM Service Layer
```
- [ ] Create src/services/crmService.ts
- [ ] getTasks(), createTask(), updateTask()
- [ ] getDeals(), createDeal(), updateDealStage()
- [ ] getContacts(), getAccounts()
- [ ] getActivities(), logActivity()
```

#### 7.2 Document Service Layer
```
- [ ] Create src/services/documentService.ts
- [ ] getDocuments(), createDocument()
- [ ] generateDocument(docType, startupId, options)
- [ ] updateDocumentSection()
- [ ] exportDocument(format)
```

#### 7.3 Zustand Stores
```
- [ ] Create src/stores/crmStore.ts
- [ ] Create src/stores/documentStore.ts
- [ ] contacts, deals, tasks, documents state
- [ ] filters and sorting
- [ ] optimistic updates
- [ ] error handling
```

### Phase 8: Integration & Testing (Sprint 4)

#### 8.1 Wire Everything Together
```
- [ ] Connect CRM screens to services
- [ ] Connect Document Hub to services
- [ ] Implement real-time subscriptions
- [ ] Add loading states
- [ ] Add error states
- [ ] Add empty states
```

#### 8.2 E2E Testing
```
- [ ] Test full CRM flow in browser
- [ ] Test all 10 document generators
- [ ] Test automation triggers
- [ ] Test AI task generation
- [ ] Test cross-org denial (RLS)
- [ ] Test mobile responsiveness
```

#### 8.3 Performance Optimization
```
- [ ] Virtualize long lists (200+ items)
- [ ] Implement pagination
- [ ] Add caching layer
- [ ] Optimize bundle chunks
```

---

## 📅 Sprint Plan

### Sprint 1 (Days 1-3) - CRM Foundation
| Task | Status | ETA |
|------|--------|-----|
| crm_tasks migration | 🔴 | Day 1 |
| crm_workflows migration | 🔴 | Day 1 |
| Basic TaskRow component | 🔴 | Day 2 |
| Tasks list view | 🔴 | Day 2 |
| Task CRUD service | 🔴 | Day 3 |
| Kanban board (deals) | 🔴 | Day 3 |

### Sprint 2 (Days 4-6) - Workflows & Automation
| Task | Status | ETA |
|------|--------|-----|
| automation_rules migration | 🔴 | Day 4 |
| crm-automation-dispatch function | 🔴 | Day 5 |
| Workflow templates seed | 🔴 | Day 5 |
| Workflow runs tracking | 🔴 | Day 6 |
| crm-generate-tasks function | 🔴 | Day 6 |

### Sprint 3 (Days 7-10) - Document Suite
| Task | Status | ETA |
|------|--------|-----|
| startup_documents migration | 🔴 | Day 7 |
| Document Hub screen | 🔴 | Day 7 |
| Document Wizard component | 🔴 | Day 8 |
| generate-one-pager function | 🔴 | Day 8 |
| generate-exec-summary function | 🔴 | Day 9 |
| generate-business-plan function | 🔴 | Day 9 |
| generate-financial-model function | 🔴 | Day 10 |
| generate-product-roadmap function | 🔴 | Day 10 |

### Sprint 4 (Days 11-14) - Polish & Testing
| Task | Status | ETA |
|------|--------|-----|
| generate-legal-checklist function | 🔴 | Day 11 |
| generate-data-room-checklist function | 🔴 | Day 11 |
| Document editor screen | 🔴 | Day 12 |
| E2E testing (CRM + Docs) | 🔴 | Day 13 |
| Bug fixes & performance | 🔴 | Day 14 |
| Production deploy | 🔴 | Day 14 |

---

## 📋 JSON Schemas

### Document Generation Request
```json
{
  "startup": {
    "name": "EventOS",
    "tagline": "AI-powered operating system for event teams",
    "stage": "Seed",
    "url": "https://example.com",
    "industry": "B2B SaaS - Events",
    "target_users": ["event planners", "agencies"],
    "region": "US + Europe"
  },
  "request": {
    "documents": ["pitch_deck", "one_pager", "gtm_strategy"],
    "grounding": {
      "use_search": true,
      "use_url_context": true,
      "use_file_rag": true
    },
    "output_format": "structured_json"
  }
}
```

### Document Generation Response
```json
{
  "pitch_deck": {
    "slides": [
      { "type": "vision", "title": "", "bullets": [] },
      { "type": "problem", "title": "", "bullets": [] },
      { "type": "solution", "title": "", "bullets": [] }
    ]
  },
  "one_pager": {
    "sections": [
      { "type": "tagline", "content": "" },
      { "type": "problem", "content": "" },
      { "type": "solution", "content": "" },
      { "type": "traction", "content": "" },
      { "type": "team", "content": "" },
      { "type": "ask", "content": "" }
    ]
  },
  "gtm_strategy": {
    "personas": [],
    "channels": [],
    "messaging": [],
    "timeline": []
  }
}
```

### Task Schema
```json
{
  "title": "string",
  "description": "string",
  "priority": "low | medium | high | urgent",
  "task_type": "call | email | meeting | internal | document | other",
  "status": "backlog | todo | in_progress | blocked | done | canceled",
  "due_at": "ISO8601",
  "linked_entity": {
    "type": "deal | contact | account | startup",
    "id": "uuid"
  }
}
```

---

## 📝 Notes

### Architecture Decisions
- All CRM tables include `org_id` for RLS
- All document tables include `org_id` + `startup_id`
- Tasks always linked to at least one entity (deal/contact/account)
- Workflows use 5-step model: Capture → Clarify → Plan → Execute → Review
- Automation rules are event-driven, processed by Edge Functions
- AI calls are server-side only (no client-side API keys)
- Documents use structured JSON for easy UI mapping

### Gemini 3 Pro Features Used
- **Thinking (High):** Complex reasoning for GTM, market sizing, business plan
- **Structured Outputs:** All document generation returns JSON
- **Google Search:** Real-time market data, competitors, benchmarks
- **URL Context:** Extract website content for context
- **Function Calling:** Save docs, create tasks, update fields
- **RAG File Search:** Pull from uploaded PDFs, past decks
- **Code Execution:** Financial calculations, CSV processing

### Key Files
- `prd.md` - Full product requirements
- `plan/todo.md` - This file
- `plan/errors/*.md` - Error documentation
- `supabase/migrations/*.sql` - Database schemas
- `supabase/functions/*.ts` - Edge Functions

---

## 🔗 Quick Links

| Resource | Path |
|----------|------|
| PRD | `/prd.md` |
| Error Docs | `/plan/errors/` |
| Edge Functions | `/supabase/functions/` |
| Migrations | `/supabase/migrations/` |
| Screens | `/screens/` |
| Components | `/components/` |
| Services | `/src/services/` |

---

**Legend:**
- ✅ Done
- 🟡 In Progress
- 🔴 Todo
- P0 = Critical
- P1 = High
- P2 = Medium
- S1-S4 = Sprint 1-4
