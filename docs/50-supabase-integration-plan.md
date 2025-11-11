# 🗺️ Implementation Plan: Full-Stack Supabase Integration

**Document Status:** Planning - 2024-08-21
**Author:** Senior Full-Stack Architect
**System Goal:** To provide a complete, step-by-step engineering blueprint for migrating the Sun AI application from a client-side prototype to a secure, scalable, and production-ready full-stack application using Supabase for the backend, database, and authentication.

---

### 1. Executive Summary & Goal

The application is currently a feature-rich but client-only prototype that uses `sessionStorage` for persistence. This is insecure (API keys on the client) and not scalable (no persistent user data).

This plan outlines the migration to a full-stack architecture powered by Supabase. The goal is to create a production-grade application by:
1.  **Securing API Keys:** Moving all Gemini API calls into Supabase Edge Functions.
2.  **Persisting User Data:** Using the Supabase PostgreSQL database to store all user-generated content.
3.  **Implementing Authentication:** Using Supabase Auth to manage user accounts and secure data access.

---

### 2. Phase 1: Project Setup & Database Migration

**Goal:** Establish the Supabase project and replicate the planned database schema.

| Task | Action Steps | Success Criteria |
| :--- | :--- | :--- |
| **Create Supabase Project** | 1. Create a new project on `app.supabase.com`.<br/>2. Note the Project URL and `anon` key. | A new, empty Supabase project is accessible. |
| **Install Dependencies** | Run `npm install @supabase/supabase-js` in the frontend project. | The Supabase client library is added to `package.json`. |
| **Configure Environment** | 1. Create a `.env` file.<br/>2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. | Environment variables are correctly configured and accessible in the app. |
| **Initialize Supabase Client** | Create a new file `lib/supabaseClient.ts` to initialize and export a singleton Supabase client instance. | A single, reusable Supabase client is available throughout the application. |
| **Execute Database Schema**| 1. Navigate to the SQL Editor in the Supabase dashboard.<br/>2. Copy and execute the entire SQL script from `01-docs/05-supabase-schema.md`. | All tables, indexes, RLS policies, and trigger functions are created in the database without errors. |

---

### 3. Phase 2: User Authentication

**Goal:** Replace the mock login/signup flow with a secure, production-ready authentication system.

| Task | Action Steps | Success Criteria |
| :--- | :--- | :--- |
| **Refactor Auth Screens**| 1. Modify `screens/Login.tsx` to call `supabase.auth.signInWithPassword()`.<br/>2. Modify `screens/Signup.tsx` to call `supabase.auth.signUp()`. | Users can successfully sign up for a new account and log in with their credentials. A user session is created. |
| **Implement Session Management**| 1. Create an `AuthContext` to provide user session data globally.<br/>2. Use `supabase.auth.onAuthStateChange` in `App.tsx` to listen for session changes and update the context. | The application state correctly reflects whether a user is logged in or out, and the UI updates accordingly. |
| **Implement Protected Routes**| 1. Uncomment and fix the logic in `components/ProtectedRoute.tsx` to check for an active user session from the `AuthContext`.<br/>2. Apply this component to all authenticated routes in `App.tsx`. | Unauthenticated users attempting to access `/dashboard` or `/pitch-decks` are correctly redirected to the `/login` page. |

---

### 4. Phase 3: Secure AI Logic with Edge Functions

**Goal:** Move all Gemini API calls from the client to secure, server-side Edge Functions to protect the API key.

| Task | Action Steps | Success Criteria |
| :--- | :--- | :--- |
| **Setup Supabase CLI** | 1. Install the Supabase CLI (`npm install supabase --save-dev`).<br/>2. Link the CLI to your project (`supabase link`). | The local development environment is connected to the remote Supabase project. |
| **Create Edge Functions** | 1. Create a new Edge Function for each AI task (e.g., `supabase functions new generate-deck`).<br/>2. Move the logic from `services/apiService.ts` into these functions. | Edge Functions are created in the `/supabase/functions` directory. |
| **Secure API Key** | Set the Gemini API key as a secret in Supabase: `supabase secrets set GEMINI_API_KEY <your-key>`. | The `GEMINI_API_KEY` is securely stored and accessible only from within Edge Functions. |
| **Refactor Frontend Calls**| 1. Replace all calls in `DeckEditor.tsx` that use `apiService.ts` with `supabase.functions.invoke('function-name', { body: ... })`.<br/>2. Delete `services/apiService.ts`. | All AI features are fully functional, but network requests now go to Supabase Edge Functions. The Gemini API key is no longer visible in client-side code. |

---

### 5. Phase 4: Data Persistence Migration

**Goal:** Replace all temporary `sessionStorage` and mock data with live database calls.

| Task | Action Steps | Success Criteria |
| :--- | :--- | :--- |
| **Refactor Data Fetching** | 1. In `DeckEditor.tsx`, replace `sessionStorage.getItem` with a call to `supabase.from('decks').select('*, slides(*)').eq('id', deckId)`.<br/>2. In `Events.tsx` and `Jobs.tsx`, replace mock data services with live Supabase queries. | All data displayed in the application is fetched directly from the Supabase database. |
| **Refactor Data Writing**| 1. In `DeckEditor.tsx`, replace all `sessionStorage.setItem` calls (triggered on deck/slide updates) with `supabase.from('slides').update(...)` or `.upsert(...)`. | Any change made in the editor is persisted to the database and is still present after a page refresh. |
| **Test RLS Policies**| 1. Log in as User A and create a deck.<br/>2. Log in as User B and attempt to access User A's deck via a direct URL. | The request for User B should fail or return no data, confirming that Row-Level Security is working correctly. |

---

### 6. Production-Ready Checklist

-   [ ] **Security:** All RLS policies are tested. All API keys are server-side only. `.env` files are in `.gitignore`.
-   [ ] **Performance:** Indexes are applied to all foreign keys and frequently queried columns.
-   [ ] **Error Handling:** All Supabase client calls (`.select`, `.invoke`, etc.) are wrapped in `try/catch` blocks and provide clear user feedback on failure.
-   [ ] **Testing:** A full manual E2E test is performed for the entire user journey: Sign Up -> Create Deck -> Edit Deck -> Log Out -> Log In -> Verify Deck is still present.
-   [ ] **Deployment:** The application is successfully deployed to a hosting provider (e.g., Vercel, Netlify) with production environment variables configured.
