# 🚀 Engineering Blueprint: The AI-Powered Event Wizard

**Document Status:** Planning - 2024-08-22
**Author:** Senior AI Systems Architect, Google Studio
**System Goal:** To plan, structure, and implement a new AI-powered Event Wizard from start to finish, following a step-by-step approach with clear logic, success criteria, and a production-ready checklist.

---

### **Step 1 — Goal & Context**

*   **Main Purpose:** The primary goal is to build an **AI-Powered Event Wizard**. This tool will transform the process of creating a community event from a manual data-entry task into an intelligent, streamlined experience. It will assist organizers by automating the creative and descriptive aspects of event creation.

*   **Real-World Use Case:** This feature is a core component of the **sun ai startup** platform, a comprehensive ecosystem for founders and AI professionals. For a busy founder, organizing a meetup or a product launch is time-consuming. This wizard saves them critical time by:
    1.  Generating compelling, professional event descriptions.
    2.  Suggesting creative and engaging titles to attract attendees.
    3.  Creating unique, high-quality cover images that make the event stand out.
    
    Ultimately, it empowers our users to create more successful events with less effort, directly contributing to a more vibrant and engaged community.

---

### **Step 2 — Key Tasks & Implementation Plan**

1.  **Setup Phase**
    *   **Environment:** A Supabase project will be used for the backend. The local development environment will be configured with the Supabase CLI to manage database migrations and Edge Functions.
    *   **API Keys:** The `GEMINI_API_KEY` will be stored securely as a secret in the Supabase project (`supabase secrets set GEMINI_API_KEY <your-key>`). It will only be accessible from server-side Edge Functions.
    *   **Authentication:** User authentication will be handled by Supabase Auth, leveraging the existing `AuthProvider` in the application.
    *   **Dependencies:** `@supabase/supabase-js` for the frontend client, and Deno/TypeScript for the Edge Functions.

2.  **Core Logic**
    *   **AI Flow:** The user provides basic event details (name, date, location). They can then trigger AI actions to generate a description, suggest alternative titles, or create a cover image.
    *   **Prompt Design:** We will engineer specific prompts for each AI task, instructing the model to act as a professional copywriter or a graphic designer.
    *   **Data Structure:** The `events` table schema will be the single source of truth for event data.
    *   **User Inputs:** A multi-step form in `EventWizard.tsx` will capture event details progressively.

3.  **Frontend**
    *   **Screens:**
        *   `EventWizard.tsx`: A new multi-step wizard for creating events.
        *   `MyEvents.tsx`: Will be refactored to display events created by the authenticated user.
        *   `EventDetail.tsx`: The public-facing page for a single event.
    *   **Components:** Reusable components for date/time pickers, form inputs, and buttons with clear loading/disabled states for AI actions.
    *   **UI Logic:** Manage form state using `useState`. All data fetching and AI calls will be handled through dedicated service functions.

4.  **Backend (Supabase Integration)**
    *   **Database Schema:** An `events` table will be created as defined in `01-docs/05-supabase-schema.md`. This table will store all event details and will be linked to the `user_id`.
    *   **Edge Functions:** All Gemini API calls will be encapsulated in Supabase Edge Functions. This is a critical security measure to protect our `GEMINI_API_KEY`. The frontend will invoke these functions.
        *   `/generate-event-description`: Takes event details, returns a description.
        *   `/generate-event-titles`: Takes a base title, returns three suggestions.
        *   `/generate-event-image`: Takes an event title/theme, returns a base64 image.
    *   **RLS (Row-Level Security):** Strict RLS policies will be applied to the `events` table to ensure users can only create, read, update, and delete their own events.

5.  **AI Integration (Gemini Tools)**
    *   **`textGeneration` (`gemini-2.5-pro`):** Will be used for generating descriptions and titles. **Function Calling** will be implemented to ensure reliable, structured JSON output (e.g., an array of 3 titles).
    *   **`imageGeneration` (`imagen-4.0-generate-001`):** Will be used to generate high-quality, unique cover images for events.

6.  **Testing & Validation**
    *   **Unit Tests:** Create tests for utility functions (e.g., date formatting, form validation).
    *   **Integration Tests:** Write tests to ensure the frontend can successfully invoke the Edge Functions and that the RLS policies correctly restrict data access.
    *   **Smoke Tests:** Perform a full end-to-end user flow test: sign up, create an event using all AI features, verify it appears in "My Events," and check that the public event page displays correctly.

7.  **Deployment**
    *   **Production Build:** The frontend will be deployed to a static hosting provider (e.g., Vercel, Netlify).
    *   **Environment Variables:** `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` will be configured in the deployment environment.
    *   **Monitoring:** Supabase's built-in logging and monitoring tools will be used to observe Edge Function performance and database health.

---

### **Step 3 — Files & Folder Setup**

*   **Files to be Created:**
    *   `/docs/52-event-wizard-plan.md` (this document)
    *   `/screens/EventWizard.tsx`
    *   `/services/eventService.ts` (for Supabase DB interactions)
    *   `/supabase/functions/generate-event-description/index.ts`
    *   `/supabase/functions/generate-event-titles/index.ts`
    *   `/supabase/functions/generate-event-image/index.ts`

*   **Files to be Modified:**
    *   `/App.tsx`: Add the route for `/dashboard/events/new`.
    *   `/screens/MyEvents.tsx`: Refactor to fetch and display real data from the `events` table.
    *   `/screens/EventDetail.tsx`: Refactor to fetch and display a single event from the database.
    *   `/services/aiService.ts`: Will be refactored. AI logic will move to Edge Functions, but this service can be used to invoke them.

*   **Files to be Tested:**
    *   All newly created and modified files listed above.

---

### **Step 4 — Success Criteria**

Define what “working 100% correctly” means:

*   **All screens load without console errors:** The wizard, dashboard, and detail pages are stable.
*   **AI responses are accurate and contextual:** The generated description, titles, and image are relevant to the user's input. The AI doesn't "hallucinate" unrelated content.
*   **Data saves and retrieves correctly:** An event created through the wizard is successfully saved to the Supabase `events` table and can be fetched and displayed on other pages.
*   **Frontend and backend integration validated:** The React frontend successfully calls the Supabase Edge Functions, and the functions correctly interact with both the Gemini API and the Supabase database. RLS policies are confirmed to be working.
*   **Meets performance targets:** The wizard is responsive. AI generation tasks provide clear loading feedback to the user and complete within a reasonable timeframe (e.g., < 5 seconds for text, < 20 seconds for images).

---

### **Step 5 — Production-Ready Checklist**

✅ **Environment variables configured:** `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in production. The `GEMINI_API_KEY` is securely stored as a Supabase secret.
✅ **Error handling & retries in AI calls:** Edge Functions include `try/catch` blocks. The frontend displays user-friendly error messages if an AI call fails.
✅ **Clear logging & monitoring setup:** Edge Functions have structured logging to aid in debugging.
✅ **Security rules & RLS applied:** RLS policies are enabled on the `events` table and have been tested to prevent unauthorized data access.
✅ **Deployment verified:** The frontend is deployed, and the production Supabase project is connected. The end-to-end flow is confirmed to be working in the live environment.
