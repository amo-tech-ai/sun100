# Solar: Minimum Viable Product (MVP) Blueprint

**Document Status:** Published
**Version:** 1.0

This document outlines the minimal, production-ready architecture for the Solar platform. It is designed to guide the construction of a stable, launchable product from a clean slate, focusing on correctness and stability.

---

### 1. Solar MVP Architecture Blueprint

-   **Frontend:** React + Vite + TypeScript + Tailwind CSS + shadcn/ui
-   **Backend:** Supabase (Postgres + Auth + RLS + Storage)
-   **AI Integration:** Gemini 2.5 via Supabase Edge Functions

#### Folder Tree (Simplified)

```
/
├── public/                 # Static assets (favicons, images)
├── supabase/
│   ├── functions/
│   │   ├── generate-pitch/ # Edge Function for the Pitch Wizard
│   │   └── ...
│   └── migrations/
│       └── <timestamp>_initial_schema.sql
├── src/
│   ├── components/
│   │   ├── ui/             # shadcn/ui primitives (Button, Input, etc.)
│   │   └── shared/         # App-specific components (Header, WizardNav)
│   ├── contexts/           # React Context providers (AuthProvider)
│   ├── layouts/            # Top-level page layouts (DashboardLayout)
│   ├── lib/                # Supabase client, utility functions
│   ├── pages/              # Route components
│   │   ├── app/            # Authenticated pages (Dashboard, Wizards)
│   │   └── public/         # Public pages (Landing, Login)
│   ├── services/           # Frontend data services (e.g., deckService.ts)
│   ├── App.tsx             # Main application router
│   └── main.tsx            # Application entry point
├── .env.example
└── package.json
```

#### Routing Structure

-   `/` → Public landing page
-   `/login`, `/signup` → Authentication pages
-   `/dashboard` → Main user dashboard (protected)
-   `/wizard/pitch/new` → Start a new Pitch Deck Wizard session
-   `/wizard/pitch/:id` → Edit an existing pitch deck draft
-   `/events`, `/profiles` → Community pages (view-only)

#### Environment Variable Rules

-   `VITE_SUPABASE_URL`: Public URL for the Supabase project (client-safe).
-   `VITE_SUPABASE_ANON_KEY`: Public anon key for the Supabase project (client-safe).
-   `SUPABASE_DB_URL`: Database connection string (server-only secret for migrations).
-   `GEMINI_API_KEY`: Google Gemini API key (server-only secret for Edge Functions).

#### How Wizards and Dashboards Connect

Wizards create and edit drafts in the database tables. The dashboard reads from the same tables to display summaries and links. For example, the Pitch Wizard interacts with the `pitch_decks` and `slides` tables. The main dashboard queries `pitch_decks` to show a list of the user's recent work.

---

### 2. Solar MVP Database & RLS Schema

#### Minimal Tables

```sql
-- Profiles table automatically linked to Supabase Auth via a trigger
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username text UNIQUE NOT NULL,
    full_name text,
    avatar_url text,
    created_at timestamptz DEFAULT now()
);

-- Startups linked to user profiles
CREATE TABLE public.startups (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name text NOT NULL,
    tagline text,
    website text,
    created_at timestamptz DEFAULT now()
);

-- Events created by users
CREATE TABLE public.events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    start_date timestamptz NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Pitch decks linked to startups
CREATE TABLE public.pitch_decks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id uuid NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
    title text NOT NULL,
    status text DEFAULT 'draft' NOT NULL, -- 'draft', 'published'
    created_at timestamptz DEFAULT now()
);

-- Slides for each pitch deck
CREATE TABLE public.slides (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    deck_id uuid NOT NULL REFERENCES public.pitch_decks(id) ON DELETE CASCADE,
    position integer NOT NULL,
    title text,
    content text,
    UNIQUE (deck_id, position)
);

-- Wizard sessions for saving drafts
CREATE TABLE public.wizard_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    wizard_type text NOT NULL, -- 'pitch', 'event', 'profile'
    payload jsonb,
    created_at timestamptz DEFAULT now()
);
```

#### Owner-Based RLS Policies

```sql
-- Enable RLS for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pitch_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wizard_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see and manage their own profile.
CREATE POLICY "Users can manage their own profile."
    ON public.profiles FOR ALL
    USING (auth.uid() = id);

-- Policy: Users can only manage startups they own.
CREATE POLICY "Users can manage their own startups."
    ON public.startups FOR ALL
    USING (auth.uid() = profile_id);

-- Example for decks (apply similar logic to events, slides, sessions)
CREATE POLICY "Users can manage decks for startups they own."
    ON public.pitch_decks FOR ALL
    USING (
        (SELECT profile_id FROM public.startups WHERE id = startup_id) = auth.uid()
    );
```

#### Basic Indexes

```sql
-- Index foreign keys for faster joins
CREATE INDEX ON public.startups (profile_id);
CREATE INDEX ON public.events (profile_id);
CREATE INDEX ON public.pitch_decks (startup_id);
CREATE INDEX ON public.slides (deck_id);
CREATE INDEX ON public.wizard_sessions (profile_id);
```

#### Required Migrations

A single migration file (`<timestamp>_initial_schema.sql`) containing the SQL above should be created in `supabase/migrations/` and run to set up the database.

---

### 3. Solar Wizard Engine (MVP)

#### Core Mechanics

-   **Step-based Navigation:** A simple state machine (e.g., `useState` or a `useReducer` hook in React) manages the current step (e.g., `1`, `2`, `3`). The UI conditionally renders the form fields for the active step.
-   **Form Input Handling:** Use a form library like `react-hook-form` for simple, performant state management and validation of user inputs.
-   **State Management:** For an MVP, a single React Context (`WizardProvider`) or a Zustand store can hold the wizard's state. This state object will contain all the data being collected across all steps.
    -   *Example State:* `{ step: 1, pitchData: { companyName: '', problem: '' } }`
-   **Draft Saving:** On each step change or after a short debounce interval, the current state from the context/store is saved to the `wizard_sessions` table in Supabase.
    -   *Example call:* `supabase.from('wizard_sessions').upsert({ profile_id: user.id, wizard_type: 'pitch', payload: wizardState })`
-   **Preview Panel:** A simple component that subscribes to the wizard's state. As the user types, the preview updates in real-time to show how the final output (e.g., a slide) will look.

---

### 4. Solar MVP AI Integration

#### Minimal & Secure Implementation

-   **Edge Functions:** All Gemini API calls **must** be encapsulated in Supabase Edge Functions. This keeps the `GEMINI_API_KEY` secure on the server.
    -   `generate_pitch`: Takes a `wizard_session.payload`, generates a 10-slide pitch deck outline.
    -   `generate_event`: Takes event details, generates a compelling description.
-   **Structured JSON with Gemini Pro:** The Edge Function prompt will explicitly instruct the `gemini-2.5-pro` model to return a structured JSON object. For maximum reliability, use **Function Calling**.
    -   *Example Prompt Snippet:* `"Analyze the user's input and generate a 10-slide pitch deck outline by calling the 'createPitchDeck' function."`
-   **Error Handling:** The Edge Function must include a `try...catch` block. If the Gemini API call fails or returns malformed data, the function should return a `500` error with a clear message. The frontend must handle this error and display a user-friendly message (e.g., "AI generation failed. Please try again.").
-   **Validate AI Responses:** Before saving to the database, the Edge Function should validate the AI's response against a predefined schema (e.g., using Zod). If validation fails, return an error.
-   **No Client-Side AI:** The frontend **never** calls the Gemini API directly. It only calls the Supabase Edge Function.

---

### 5. Solar MVP UI/UX Style Guidelines

#### Core Palette

-   **Background:** Off-white (`#FBF8F5`)
-   **Primary/Accent:** Burnt Orange (`#E87C4D`)
-   **Text:** Dark Blue/Gray (`#1E293B`)
-   **Success:** Green (`#10B981`)
-   **Error:** Red (`#EF4444`)

#### Typography Scale (using Tailwind CSS classes)

-   **Display (`h1`):** `text-4xl` / `font-extrabold`
-   **Heading (`h2`):** `text-2xl` / `font-bold`
-   **Subheading (`h3`):** `text-lg` / `font-semibold`
-   **Body:** `text-base` / `font-normal` (using a sans-serif font like Sora)
-   **Caption:** `text-sm` / `font-normal`

#### Spacing System (8-point grid)

-   **`p-2`** (8px), **`p-4`** (16px), **`p-6`** (24px), **`p-8`** (32px)
-   **Section Spacing:** Use `space-y-8` (32px) for vertical rhythm between sections.

#### Layout Rules

-   **Container:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` for main page content.
-   **Card Style:** `bg-white rounded-lg shadow-sm border border-gray-200/50 p-6`.

#### Base Components (shadcn/ui style)

-   **Button:**
    -   *Primary:* `bg-brand-orange text-white`
    -   *Secondary:* `bg-white border border-gray-300 text-gray-700`
-   **Input:** `border-gray-300 rounded-md`, with a `focus:ring-brand-orange` state.
-   **Card:** As defined in Layout Rules.
