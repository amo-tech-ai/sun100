
# 🚀 Solar Platform: The Rebuild Roadmap

**Document Status:** Published - 2024-08-29  
**Author:** Lead Full-Stack Architect & AI Systems Designer  
**Version:** 1.0  

---

## 1. Diagnostic Audit: What Went Wrong?

The previous iteration of the Solar platform failed due to a series of architectural flaws and process breakdowns. Understanding these issues is critical to preventing them in the future.

| Issue | Root Cause & Analysis | How It Broke the Wizards | Prevention Strategy |
| :--- | :--- | :--- | :--- |
| **Client-Side AI Calls** | **(Critical Security Flaw)** All Gemini API calls were made directly from the React frontend. The `GEMINI_API_KEY` was exposed in the client-side code. | This didn't just "break" the wizards; it made them a **catastrophic security liability**. A malicious user could steal the API key and incur thousands of dollars in fraudulent charges. | **Isolate Secrets:** All AI API keys **must** be stored and used exclusively in a secure backend environment (Supabase Edge Functions). The frontend should never have access to them. |
| **Wizard Failures & Blank Screens** | **Incomplete Refactors & Missing Logic.** The codebase was in a broken state where service files were empty or functions were missing (e.g., `generateFullDeck`). This caused fatal JavaScript import errors on application startup. | A user starting any wizard would trigger an import for a non-existent function, crashing the entire application and resulting in a blank screen. | **Atomic Commits & PRs:** Major refactors must be completed and validated within a single, atomic Pull Request. Code should not be merged in a broken or incomplete state. Enforce mandatory code reviews. |
| **No Persistent State** | **Over-reliance on `sessionStorage`.** All user-generated data (decks, events) was stored temporarily in the browser session, disappearing on refresh or when the session ended. | A user could spend 30 minutes creating a pitch deck, close their browser, and return to find all their work gone. This breaks user trust and makes the product unusable for real work. | **Database-First Approach:** All user-generated content must be persisted to a database (Supabase Postgres) in real-time or via an explicit "Save" action. `localStorage` should only be used for non-critical UI preferences. |
| **Incorrect Folder Structure** | **Project Files Outside `src`.** Critical source code and documentation were placed outside the `src/` directory, violating standard Vite/React project conventions. | This breaks the build process, causes unpredictable import resolution errors, and makes it impossible for standard development tools (like linters and bundlers) to function correctly. | **Adhere to Convention:** All application source code must reside within the `src/` directory. Static assets can live in `public/`. Project-level configuration files belong in the root. |
| **Environment Variable Mismatch** | **Inconsistent Naming.** The code expected a `GEMINI_API_KEY` while documentation or local setups might have used `API_KEY` or `VITE_GEMINI_API_KEY`. | An incorrectly named environment variable is the same as a missing one. The application would fail to authenticate with the Gemini API, causing all AI features to fail. | **Single Source of Truth:** Establish a single, version-controlled `.env.example` file that defines the exact names for all required environment variables. Secrets for Edge Functions must be set via the Supabase dashboard/CLI. |
| **Poor Component Hierarchy** | **"God Components."** A single component (`DeckEditor.tsx`) was responsible for managing 40+ pieces of state and passing them down through multiple layers of child components ("prop drilling"). | This made the code incredibly difficult to read, debug, and maintain. A small change in a deeply nested component could require refactoring multiple parent components, leading to bugs and slowing down development. | **Lift State Up & Use Context/Zustand:** State should be managed by the closest common ancestor. For globally shared state (like auth), use React Context. For complex, localized state (like a multi-step wizard), use a dedicated state management library like Zustand. |

---

## 2. The Correct Architecture for Solar

To build a stable and scalable platform, we must adhere to a modern, secure, full-stack architecture.

### Recommended File & Folder Tree

```
/
├── public/                 # Static assets (favicons, images)
├── supabase/
│   ├── functions/
│   │   ├── generate-pitch-deck/
│   │   │   └── index.ts      # Secure Gemini call for the Pitch Wizard
│   │   ├── generate-event-content/
│   │   │   └── index.ts      # Secure Gemini call for the Event Wizard
│   │   └── ...               # Other Edge Functions
│   └── migrations/
│       └── <timestamp>_initial_schema.sql
├── src/
│   ├── assets/             # Images, fonts, etc.
│   ├── components/
│   │   ├── ui/             # Reusable UI primitives (shadcn/ui)
│   │   └── shared/         # Shared complex components (Header, Sidebar)
│   ├── contexts/           # React Context providers (AuthProvider)
│   ├── hooks/              # Custom React hooks (useAuth, useDebounce)
│   ├── layouts/
│   │   ├── DashboardLayout.tsx # Layout for the authenticated app
│   │   └── PublicLayout.tsx    # Layout for the public website
│   ├── lib/
│   │   ├── supabaseClient.ts # Singleton Supabase client instance
│   │   └── utils.ts          # Utility functions
│   ├── pages/
│   │   ├── public/         # Public-facing pages (Landing, About, etc.)
│   │   └── app/            # Authenticated app pages (Dashboard, Wizards)
│   ├── services/
│   │   ├── deckService.ts    # Frontend service to call DB/Edge Functions for decks
│   │   └── eventService.ts   # Frontend service for events
│   ├── state/              # State management stores (Zustand)
│   ├── App.tsx             # Main router
│   └── main.tsx            # Application entry point
├── .env.example            # Template for environment variables
└── package.json
```

### Architectural Principles

-   **Frontend:** The React app is the **presentation layer only**. Its job is to render the UI, manage local UI state, and call the backend. It should contain **zero** business logic or secret keys.
-   **Backend (Supabase Edge Functions):** All business logic, third-party API calls (especially to Gemini), and database interactions are handled here. This is the **secure business logic layer**.
-   **Database (Supabase Postgres):** The single source of truth for all persistent data. **Row-Level Security (RLS)** is enabled on all tables to ensure data is only accessed by authorized users.
-   **State Management:**
    -   **React Context:** For simple, global state like the current user's session.
    -   **Zustand:** For complex, client-side state like the multi-step forms in the wizards. It's simple, powerful, and avoids the boilerplate of Redux.
-   **Storage:** Use two buckets:
    -   `public-assets`: For non-sensitive, publicly accessible files like logos and event banners.
    -   `private-user-data`: For sensitive user uploads, secured with Supabase Storage policies.

---

## 3. Phase-by-Phase Rebuild Roadmap

### **Phase 0 — Discovery & Architecture Audit**
-   **Goal:** Fully document all issues and establish a clean architectural blueprint.
-   **Tasks:**
    -   [✅] Analyze the existing codebase to identify all red flags (listed in Section 1).
    -   [✅] Create a definitive architectural plan (Section 2 of this document).
    -   [✅] Document a complete list of all missing pages and broken UX flows.
-   **Success Criteria:** This roadmap document is complete, reviewed, and approved. The team has a shared understanding of past failures and the path forward.

---

### **Phase 1 — Initial Setup (Clean Foundation)**
-   **Goal:** Create a new, stable project foundation following best practices.
-   **Tasks:**
    -   [ ] Initialize a new Vite + React + TypeScript project.
    -   [ ] Install and configure Tailwind CSS and `shadcn/ui`. **Do not use CDN links.**
    -   [ ] Set up `react-router-dom` with two root layouts: `PublicLayout` and `DashboardLayout`.
    -   [ ] Create placeholder pages for `/` (Landing) and `/dashboard`.
    -   [ ] Create `.env.example` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
    -   [ ] Initialize the Supabase client in `src/lib/supabaseClient.ts`.
-   **Checklist:** The new project builds successfully. Basic routes load the correct layouts. No console errors.

---

### **Phase 2 — Core Implementation**
-   **Goal:** Build the core, non-AI features of the authenticated application.
-   **Tasks:**
    -   [ ] Implement `Login` and `Signup` pages using Supabase Auth.
    -   [ ] Create `AuthProvider` context and `ProtectedRoute` component to secure app routes.
    -   [ ] Build the main `DashboardLayout` components (`Sidebar`, `Header`).
    -   [ ] Apply the full Supabase schema from `01-docs/05-supabase-schema.md` using a migration file.
    -   [ ] Create placeholder pages for `My Startups`, `My Events`, and `My Pitch Decks`.
-   **Checklist:** Users can sign up, log in, and navigate the core authenticated app. All pages are protected by auth.

---

### **Phase 3 — Wizard Engine (Core Logic)**
-   **Goal:** Build the reusable, non-AI foundation for all wizards.
-   **Tasks:**
    -   [ ] Create a generic multi-step wizard component that manages step navigation (`useWizard` hook).
    -   [ ] Use Zustand to manage the complex form state for each wizard.
    -   [ ] Implement client-side validation for all form fields.
    -   [ ] Create a standard "Form + Preview" layout for the wizard screens.
    -   [ ] Implement global error boundaries and per-component loading states.
-   **Checklist:** All wizard UIs are functional. Users can navigate between steps, fill out forms, and see client-side validation errors. Data is held in a Zustand store.

---

### **Phase 4 — AI Integration (Secure & Stable)**
-   **Goal:** Securely connect the wizards to the Gemini AI engine.
-   **Tasks:**
    -   [ ] Create Supabase Edge Functions for each core AI task (e.g., `generate-pitch-deck`, `generate-event-description`).
    -   [ ] Store the `GEMINI_API_KEY` as a Supabase secret.
    -   [ ] Implement the prompt engineering and Gemini API calls within the Edge Functions, using **Function Calling** for reliable JSON output.
    -   [ ] Connect the wizard's "Generate" button to invoke the corresponding Edge Function.
    -   [ ] Handle the response: save the AI-generated content to the database and notify the user.
-   **Checklist:** The "Generate" buttons in the wizards successfully trigger the secure backend functions. AI-generated content is correctly saved to the database. The API key is never exposed to the client.

---

### **Phase 5 — Advanced Wizard Features**
-   **Goal:** Enhance the user experience with polished, "magical" features.
-   **Tasks:**
    -   [ ] Implement an auto-save feature that periodically saves the wizard draft to Supabase.
    -   [ ] For the Pitch Wizard, create a live-updating slide preview component.
    -   [ ] For the Event Wizard, create a live preview of the public event page.
    -   [ ] Add a "Re-generate" button for AI-generated sections.
-   **Checklist:** User workflows are seamless and interactive. The risk of data loss is minimized.

---

### **Phase 6 — Resource Modules**
-   **Goal:** Build out the remaining community and resource features of the platform.
-   **Tasks:**
    -   [ ] Implement the public-facing Events page with filtering and registration.
    -   [ ] Implement the public-facing Startup Profile pages.
    -   [ ] Implement the Jobs board with application tracking.
    -   [ ] Implement the Perks marketplace.
-   **Checklist:** The full ecosystem is functional, with data flowing correctly between users, startups, events, and jobs.

---

### **Phase 7 — Production Hardening**
-   **Goal:** Ensure the platform is secure, performant, and reliable for a public launch.
-   **Tasks:**
    -   [ ] **Performance:** Optimize image loading (LCP) and database queries (add indexes).
    -   [ ] **Security:** Conduct RLS denial tests to ensure users cannot access data from other accounts.
    -   **Reliability:** Implement comprehensive rate limiting on all Edge Functions.
    -   **Observability:** Set up analytics and monitoring for key user flows and API health.
    -   **Data Safety:** Configure and test a database backup and restore strategy.
-   **Checklist:** The application meets production-grade standards for security, performance, and reliability.

---

### **Phase 8 — Post-Launch Enhancements**
-   **Goal:** Use data and user feedback to drive iterative improvements.
-   **Tasks:**
    -   [ ] Implement a user onboarding flow.
    -   [ ] Analyze user behavior to identify drop-off points and areas for improvement.
    -   [ ] Develop an AI-powered recommendation engine (e.g., suggesting relevant events or jobs to users).
    -   [ ] Explore advanced Gemini features like the Live API for a "pitch practice" coach.
-   **Checklist:** A data-driven product development cycle is established.

---

## 4. Rebuild Blueprint Summary

This roadmap outlines a disciplined, phase-by-phase approach to rebuilding the Solar platform. By starting with a clean architectural foundation, prioritizing security, and systematically layering in functionality, we will create a product that is not only feature-rich but also stable, scalable, and secure. This plan mitigates the risks that led to past failures and sets a clear path to a successful launch.
