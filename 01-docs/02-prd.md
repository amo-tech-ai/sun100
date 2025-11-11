# ☀️ Product Requirements Document: The Sun AI Ecosystem

**Document Status:** Published - 2024-08-19 (Revised for Custom Backend)
**Author:** Senior AI Product Strategist
**Version:** 1.1

---

## 1. Executive Summary

**Sun AI's mission** is to be the indispensable, all-in-one platform that empowers the startup journey. We provide founders, job seekers, and community members with the intelligent tools they need to create investor-ready pitch decks, discover career opportunities, organize and attend events, and access expert insights—all within a single, cohesive ecosystem.

Our core value proposition is simple: **"From idea to investor in one platform."**

### Key Success Metrics
- **Time-to-Deck:** A new user can generate a complete, 10-slide pitch deck draft in under 10 minutes.
- **AI Success Rate:** ≥ 90% of all AI generation tasks (deck creation, image generation, event automation) complete successfully without user-facing errors.
- **User Activation:** ≥ 40% of new sign-ups create their first pitch deck or event within their first session.

---

## 2. Core Features

| Feature | Purpose & User Value | Technical Requirements & Dependencies |
| :--- | :--- | :--- |
| **Pitch Deck Wizard** | The core AI engine. Transforms a user's raw idea (text or URL) into a professional, 10-slide pitch deck, saving founders dozens of hours. | **Frontend:** React, `WizardSteps.tsx`, `DeckEditor.tsx`.<br/>**Backend:** Custom backend (Node.js on Cloud Run), Cloud SQL DB.<br/>**AI:** Gemini 2.5 (`urlContext`, Function Calling for structured output). |
| **AI Jobs Board** | A curated career platform. Allows startups to post jobs and helps talent find roles with AI-powered matching and profile suggestions. | **Frontend:** React, `Jobs.tsx`, `JobDetail.tsx`.<br/>**Backend:** Cloud SQL DB for `jobs` and `job_applications` tables.<br/>**AI:** (Future) Gemini for matching skills to job descriptions. |
| **Events Platform** | An end-to-end event management tool. Organizers can create, publish, and manage community events, with AI assistance for generating promotional content and visuals. | **Frontend:** React, `EventWizard.tsx`, `EventDetail.tsx`.<br/>**Backend:** Custom backend endpoint (`/api/events/publish`), Cloud SQL DB.<br/>**AI:** Gemini for generating event descriptions, social media copy, and cover images (`imagen-4.0-generate-001`). |
| **Articles Hub** | A knowledge base for founders. Provides expert guides, startup playbooks, and community-submitted articles, with AI-generated summaries for quick insights. | **Frontend:** React, `Blogs.tsx`, `BlogDetail.tsx`.<br/>**Backend:** Cloud SQL DB for `articles` table.<br/>**AI:** Gemini for summarizing long-form content. |

---

## 3. User Journeys

### Founder: Pitch Deck Creation
```mermaid
sequenceDiagram
    participant User
    participant Frontend as React App
    participant Backend as Cloud Run Service
    participant DB as Cloud SQL
    participant Gemini

    User->>Frontend: Signs up, starts Wizard
    Frontend->>Backend: POST /api/auth/signup
    User->>Frontend: Enters URLs, clicks "Generate"
    Frontend->>Backend: POST /api/ai/generate-deck { urls }
    Backend->>Gemini: generateContent({ tools: [urlContext, generateDeckOutline] })
    Gemini-->>Backend: Returns structured Deck JSON
    Backend->>DB: INSERT into decks, slides
    Backend-->>Frontend: Returns { deckId }
    Frontend->>User: Navigates to Editor, deck is loaded
```

### Job Seeker: Find & Apply
```mermaid
sequenceDiagram
    participant User
    participant Frontend as React App
    participant Backend as Cloud Run Service
    participant DB as Cloud SQL

    User->>Frontend: Visits /jobs
    Frontend->>Backend: GET /api/jobs
    Backend->>DB: SELECT * FROM jobs
    DB-->>Backend: Returns job listings
    Backend-->>Frontend: Returns jobs
    User->>Frontend: Clicks "Apply" on a job
    Frontend->>Backend: POST /api/jobs/:id/apply
    Backend->>DB: INSERT into job_applications
    Backend-->>Frontend: Confirms application
```

### Event Organizer: Create & Publish
```mermaid
sequenceDiagram
    participant User
    participant Frontend as React App
    participant Backend as Cloud Run Service
    participant Gemini
    participant DB as Cloud SQL

    User->>Frontend: Fills out Event Wizard
    Frontend->>Backend: POST /api/events/publish { payload }
    Backend->>Gemini: (Optional) Generate cover image
    Gemini-->>Backend: Returns image
    Backend->>DB: INSERT into events, tickets
    Backend-->>Frontend: Returns { public_url }
    Frontend->>User: Shows Success Screen with shareable link
```

### Reader: Discover & Learn
```mermaid
sequenceDiagram
    participant User
    participant Frontend as React App
    participant Backend as Cloud Run Service
    participant DB as Cloud SQL

    User->>Frontend: Visits /blogs
    Frontend->>Backend: GET /api/articles
    Backend->>DB: SELECT * FROM articles
    DB-->>Backend: Returns articles
    Backend-->>Frontend: Returns articles
    User->>Frontend: Clicks an article
    Frontend->>Backend: GET /api/articles/:id
    Backend->>DB: SELECT content FROM articles WHERE id = :id
    DB-->>Backend: Returns article content
    Backend-->>Frontend: Returns article content
```

---

## 4. Real-World Use Cases

(Remains the same as original PRD)

---

## 5. System & Data Requirements

-   **Core Database Tables:** `users`, `organizations`, `decks`, `slides`, `jobs`, `job_applications`, `events`, `event_registrations`, `articles`, `media_assets`.
-   **Relationships:**
    -   `users` 1:n `decks` (via `organizations`)
    -   `users` 1:n `events` (via `organizations`)
    -   `users` 1:n `job_applications`
-   **Data Flow:** The application will use a single Cloud SQL-managed PostgreSQL database. The schema defined in `01-docs/01-database.md` will serve as the single source of truth.
-   **Security & Storage:**
    -   **RLS:** All tables containing user or organization data will have Row-Level Security enabled, managed by the backend.
    -   **Privacy:** Personally Identifiable Information (PII) will be handled in accordance with our Privacy Policy.
    -   **AI Output Storage:** AI-generated media (e.g., deck images, event covers) will be stored in Google Cloud Storage under a structured path, such as `media/{org_id}/decks/{deck_id}/{slide_id}.webp`.

---

## 6. Architecture & Flow Diagrams

### High-Level System Architecture
```mermaid
graph TD
    subgraph "User"
        A[Browser - React App]
    end

    subgraph "Google Cloud Platform"
        B(Authentication Service - e.g., using JWTs)
        C(Cloud SQL - Postgres w/ RLS)
        D(Cloud Storage)
        E(Cloud Run - Node.js Backend)
    end
    
    subgraph "Google AI"
        F[Gemini API]
    end

    A -- Auth Requests --> E;
    E -- Validates against --> C;
    A -- Data/API Requests (with JWT) --> E;
    
    E -- DB Queries --> C;
    E -- File Operations --> D;
    E -- Secure API Calls --> F;
```

---

## 7. KPIs & Production-Readiness Criteria

| Category | Criteria | How to Measure |
| :--- | :--- | :--- |
| ✅ **Functionality** | Each module (Decks, Jobs, Events, Articles) completes its core user journey without error. | Manual E2E testing and automated Playwright tests. |
| 🔒 **Security** | RLS policies are verified; all AI API keys are exclusively on the server-side. | Manual security audit and automated RLS tests. |
| ⚡ **Performance** | P95 latency for AI generation < 10s. Core page loads (LCP) < 3s. 99.9% uptime. | Google Cloud Monitoring, Vercel Analytics, and external monitoring (e.g., UptimeRobot). |
| 📊 **Observability**| All critical errors are logged. Key user actions are tracked as events. | Google Cloud Logging for errors, analytics platform (e.g., PostHog) for user behavior. |
| 💾 **Data Safety** | Daily automated database backups are enabled. Cloud Storage has correct public/private bucket policies. | Google Cloud console configuration review. |