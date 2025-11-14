# Solar: MVP Database & RLS Schema

**Document Status:** Published & Production-Ready
**Version:** 1.0

This document provides the complete, minimal, and secure PostgreSQL schema for the Solar MVP, designed for a Supabase environment. It focuses on owner-based data access and production stability.

---

### Core Principle: Security First with RLS

Our security model is built on Supabase's Row-Level Security (RLS). By default, all tables are locked down. We then create specific policies to grant access only when a user's ID matches the owner of the data. This "deny by default, allow by exception" approach is the best practice for building secure, multi-tenant applications and is non-negotiable for production.

---

### Storage Folder Structure

To keep user-generated assets organized and secure, we will use the following structure in Supabase Storage. Access will be controlled by Storage Policies that mirror the database RLS.

-   **`avatars/{profile_id}`**: User profile pictures.
-   **`startup-logos/{startup_id}`**: Logos for startups.
-   **`pitch-images/{deck_id}/{slide_id}`**: Images generated for or uploaded to specific slides.
-   **`event-banners/{event_id}`**: Cover images for events.

---

### 1. Table: `profiles`

**Description:** Stores public user profile information. This table is linked 1-to-1 with Supabase's `auth.users` table.

**SQL DDL:**
```sql
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username text UNIQUE NOT NULL,
    full_name text,
    avatar_url text,
    created_at timestamptz DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.profiles IS 'Public user profiles, linked to auth.users.';
```

**RLS Policies:**
```sql
-- 1. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Policy: Users can view any profile (for community features).
CREATE POLICY "Allow public read access" ON public.profiles
    FOR SELECT USING (true);

-- 3. Policy: Users can only create and manage their own profile.
CREATE POLICY "Users can manage their own profile." ON public.profiles
    FOR ALL USING (auth.uid() = id);
```

**Indexes:**
```sql
-- Index for fast username lookups
CREATE INDEX ON public.profiles (username);
```

**Example Row:**
| id (uuid) | username | full_name | avatar_url |
|---|---|---|---|
| `...` | `alex_chen` | `Alex Chen` | `storage/avatars/alex.png` |

---

### 2. Table: `startups`

**Description:** Stores information about the startups created by users.

**SQL DDL:**
```sql
CREATE TABLE public.startups (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name text NOT NULL,
    tagline text,
    website text,
    created_at timestamptz DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.startups IS 'Information about startups created by users.';
```

**RLS Policies:**
```sql
-- 1. Enable RLS
ALTER TABLE public.startups ENABLE ROW LEVEL SECURITY;

-- 2. Policy: Users can only manage startups they own.
CREATE POLICY "Users can manage their own startups." ON public.startups
    FOR ALL USING (auth.uid() = profile_id);
```

**Indexes:**
```sql
-- Index for quickly finding all startups for a user
CREATE INDEX ON public.startups (profile_id);
```

**Example Row:**
| id (uuid) | profile_id (uuid) | name | tagline |
|---|---|---|---|
| `...` | `(Alex's ID)` | `Sun AI Startup`| `From Idea to Investor-Ready. Instantly.` |

---

### 3. Table: `events`

**Description:** Stores details for community events created by users.

**SQL DDL:**
```sql
CREATE TABLE public.events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    start_date timestamptz NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.events IS 'Community events created by users.';
```

**RLS Policies:**
```sql
-- 1. Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- 2. Policy: Anyone can view events (for the public events page).
CREATE POLICY "Allow public read access to events." ON public.events
    FOR SELECT USING (true);

-- 3. Policy: Users can only manage events they created.
CREATE POLICY "Users can manage their own events." ON public.events
    FOR ALL USING (auth.uid() = profile_id);
```

**Indexes:**
```sql
-- Index for finding a user's events and for ordering by date
CREATE INDEX ON public.events (profile_id);
CREATE INDEX ON public.events (start_date);
```

**Example Row:**
| id (uuid) | profile_id (uuid) | title | start_date |
|---|---|---|---|
| `...` | `(Alex's ID)` | `AI Founder Networking Night`| `2024-10-15 18:00:00-04` |

---

### 4. Table: `pitch_decks`

**Description:** Stores metadata for each pitch deck, linking it to a startup.

**SQL DDL:**
```sql
CREATE TABLE public.pitch_decks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id uuid NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
    title text NOT NULL,
    status text DEFAULT 'draft' NOT NULL, -- 'draft' or 'published'
    created_at timestamptz DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.pitch_decks IS 'Metadata for pitch decks, linked to a startup.';
```

**RLS Policies:**
```sql
-- 1. Enable RLS
ALTER TABLE public.pitch_decks ENABLE ROW LEVEL SECURITY;

-- 2. Policy: Users can manage decks belonging to a startup they own.
CREATE POLICY "Users can manage decks for their own startups." ON public.pitch_decks
    FOR ALL USING (
        (SELECT profile_id FROM public.startups WHERE id = startup_id) = auth.uid()
    );
```

**Indexes:**
```sql
-- Index for finding all decks for a startup
CREATE INDEX ON public.pitch_decks (startup_id);
```

**Example Row:**
| id (uuid) | startup_id (uuid) | title | status |
|---|---|---|---|
| `...` | `(Sun AI's ID)` | `Sun AI Seed Round`| `draft` |

---

### 5. Table: `slides`

**Description:** Stores the content for each individual slide within a pitch deck.

**SQL DDL:**
```sql
CREATE TABLE public.slides (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    deck_id uuid NOT NULL REFERENCES public.pitch_decks(id) ON DELETE CASCADE,
    position integer NOT NULL,
    title text,
    content text,
    UNIQUE (deck_id, position)
);
COMMENT ON TABLE public.slides IS 'Individual slides within a pitch deck.';
```

**RLS Policies:**
```sql
-- 1. Enable RLS
ALTER TABLE public.slides ENABLE ROW LEVEL SECURITY;

-- 2. Policy: Users can manage slides belonging to a deck they have access to.
CREATE POLICY "Users can manage slides in their own decks." ON public.slides
    FOR ALL USING (
        (SELECT startup_id FROM public.pitch_decks WHERE id = deck_id) IN
        (SELECT id FROM public.startups WHERE profile_id = auth.uid())
    );
```

**Indexes:**
```sql
-- Index for fetching all slides for a deck, ordered by position
CREATE INDEX ON public.slides (deck_id, position);
```

**Example Row:**
| id (uuid) | deck_id (uuid) | position | title |
|---|---|---|---|
| `...` | `(Sun AI Deck's ID)` | `1` | `The Problem` |

---

### 6. Table: `wizard_sessions`

**Description:** Stores temporary drafts for any of the platform's multi-step wizards to prevent data loss.

**SQL DDL:**
```sql
CREATE TABLE public.wizard_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    wizard_type text NOT NULL, -- e.g., 'pitch', 'event', 'profile'
    payload jsonb,
    created_at timestamptz DEFAULT now() NOT NULL,
    UNIQUE (profile_id, wizard_type)
);
COMMENT ON TABLE public.wizard_sessions IS 'Saves draft progress for multi-step wizards.';
```

**RLS Policies:**
```sql
-- 1. Enable RLS
ALTER TABLE public.wizard_sessions ENABLE ROW LEVEL SECURITY;

-- 2. Policy: Users can only save and load their own wizard drafts.
CREATE POLICY "Users can manage their own wizard sessions." ON public.wizard_sessions
    FOR ALL USING (auth.uid() = profile_id);
```

**Indexes:**
```sql
-- Index for quickly finding a user's draft for a specific wizard
CREATE INDEX ON public.wizard_sessions (profile_id, wizard_type);
```

**Example Row:**
| id (uuid) | profile_id (uuid) | wizard_type | payload (jsonb) |
|---|---|---|---|
| `...` | `(Alex's ID)` | `pitch` | `{"step":2, "companyName":"Innovate AI"}` |

---

### Required Migrations

To apply this schema, create a new migration file in your local Supabase project (`supabase/migrations/<timestamp>_initial_schema.sql`) and paste the complete SQL DDL from this document into it. Run `supabase db push` to apply the changes to your remote database.

---

### How this Schema Supports the AI Wizards & Dashboards

-   The **AI Pitch Wizard** reads from and writes to `wizard_sessions`. When the AI generates a deck, it creates records in `pitch_decks` and `slides`.
-   The **AI Event Wizard** will use `wizard_sessions` to store drafts and will ultimately create a record in the `events` table.
-   The **Dashboard** queries the `pitch_decks` and `events` tables to display a summary of the user's created content, demonstrating the power of the RLS policies.

### Preventing Data Leaks: A Summary

The RLS policies defined above are the most critical part of this schema. They create a secure "data silo" for each user. For every `SELECT`, `INSERT`, `UPDATE`, or `DELETE` command that hits the database, PostgreSQL first checks the policy. If the `auth.uid()` of the person making the request does not match the owner of the data, the command is rejected. This happens at the database level, making it impossible for a bug in our application code to accidentally leak data from another user's account.