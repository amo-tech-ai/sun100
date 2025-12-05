# Supabase PostgreSQL Schema: Sun AI

**Document Status:** Published - 2024-08-21
**Author:** Senior Database Architect
**Goal:** This document provides the complete, production-ready PostgreSQL schema for the Sun AI application, designed for a Supabase-managed environment.

---

```sql
--
-- TBL: public.startups
--
-- Purpose: Stores profile information for a user's startup, linked to their auth identity.
--
CREATE TABLE public.startups (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    tagline text,
    website_url text,
    logo_url text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.startups IS 'Profile information for user-owned startups.';

--
-- TBL: public.decks
--
-- Purpose: Stores metadata for each pitch deck created by a user.
--
CREATE TABLE public.decks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    template text NOT NULL DEFAULT 'default',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.decks IS 'Metadata for user-created pitch decks.';

--
-- TBL: public.slides
--
-- Purpose: Stores the content for each slide within a deck.
--
CREATE TABLE public.slides (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    deck_id uuid NOT NULL REFERENCES public.decks(id) ON DELETE CASCADE,
    position integer NOT NULL,
    title text NOT NULL,
    content text,
    image_url text,
    template text,
    chart_data jsonb,
    table_data jsonb,
    type text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (deck_id, position)
);
COMMENT ON TABLE public.slides IS 'Individual slides that make up a pitch deck.';

--
-- TBL: public.jobs
--
-- Purpose: Stores job listings posted by startups in the community.
--
CREATE TABLE public.jobs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, -- User who posted the job
    title text NOT NULL,
    description text,
    location text,
    type text, -- e.g., 'Full-time', 'Contract'
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.jobs IS 'Job listings posted by community members.';

--
-- TBL: public.job_applications
--
-- Purpose: Tracks applications submitted by users for jobs.
--
CREATE TABLE public.job_applications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, -- User who applied
    job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    status text NOT NULL DEFAULT 'submitted', -- e.g., 'submitted', 'reviewed', 'rejected'
    cover_letter_text text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, job_id)
);
COMMENT ON TABLE public.job_applications IS 'Tracks user applications for jobs.';

--
-- TBL: public.events
--
-- Purpose: Stores information about community events like workshops and meetups.
--
CREATE TABLE public.events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, -- Event organizer
    title text NOT NULL,
    description text,
    start_date timestamptz NOT NULL,
    end_date timestamptz,
    location text, -- Can be 'Virtual' or a physical address
    cover_image_url text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.events IS 'Community events like workshops, meetups, and hackathons.';

--
-- TBL: public.event_registrations
--
-- Purpose: Tracks user registrations for events.
--
CREATE TABLE public.event_registrations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    status text NOT NULL DEFAULT 'registered', -- e.g., 'registered', 'attended', 'cancelled'
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, event_id)
);
COMMENT ON TABLE public.event_registrations IS 'Tracks user registrations for events.';

--
-- TBL: public.perks
--
-- Purpose: Stores information about available startup perks and deals.
--
CREATE TABLE public.perks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_name text NOT NULL,
    offer text NOT NULL,
    description text,
    logo_url text,
    claim_url text,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.perks IS 'Exclusive deals and credits for startups.';

--
-- TBL: public.claimed_perks
--
-- Purpose: Tracks which users have claimed which perks.
--
CREATE TABLE public.claimed_perks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    perk_id uuid NOT NULL REFERENCES public.perks(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, perk_id)
);
COMMENT ON TABLE public.claimed_perks IS 'Tracks which users have claimed which perks.';

--
-- TBL: public.posts
--
-- Purpose: Stores community posts, such as articles and discussion threads.
--
CREATE TABLE public.posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    content text,
    type text NOT NULL DEFAULT 'discussion', -- e.g., 'article', 'discussion'
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.posts IS 'Community-generated content like articles and discussions.';

--
-- TBL: public.post_comments
--
-- Purpose: Stores comments on community posts.
--
CREATE TABLE public.post_comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    parent_comment_id uuid REFERENCES public.post_comments(id) ON DELETE CASCADE, -- For threaded comments
    content text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.post_comments IS 'Comments on community posts.';

--
-- TBL: public.post_votes
--
-- Purpose: Tracks upvotes/downvotes on posts.
--
CREATE TABLE public.post_votes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    vote_type smallint NOT NULL CHECK (vote_type IN (1, -1)), -- 1 for upvote, -1 for downvote
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, post_id)
);
COMMENT ON TABLE public.post_votes IS 'Tracks user votes on posts.';


-- =============================================
-- Performance Indexes
-- =============================================
CREATE INDEX ON public.decks (user_id);
CREATE INDEX ON public.slides (deck_id);
CREATE INDEX ON public.slides (deck_id, position);
CREATE INDEX ON public.jobs (user_id);
CREATE INDEX ON public.job_applications (user_id);
CREATE INDEX ON public.job_applications (job_id);
CREATE INDEX ON public.events (user_id);
CREATE INDEX ON public.event_registrations (user_id);
CREATE INDEX ON public.event_registrations (event_id);
CREATE INDEX ON public.posts (user_id);
CREATE INDEX ON public.post_comments (post_id);
CREATE INDEX ON public.post_votes (post_id);


-- =============================================
-- Row-Level Security (RLS)
-- =============================================
-- Enable RLS for all tables
ALTER TABLE public.startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claimed_perks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_votes ENABLE ROW LEVEL SECURITY;

--
-- POLICIES: public.startups
--
CREATE POLICY "Users can manage their own startup profile."
    ON public.startups FOR ALL
    USING (auth.uid() = user_id);

--
-- POLICIES: public.decks & public.slides
--
CREATE POLICY "Users can manage their own decks."
    ON public.decks FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage slides belonging to their own decks."
    ON public.slides FOR ALL
    USING ((SELECT user_id FROM public.decks WHERE id = deck_id) = auth.uid());

--
-- POLICIES: public.jobs & public.job_applications
--
CREATE POLICY "Anyone can view active job listings."
    ON public.jobs FOR SELECT
    USING (is_active = true);

CREATE POLICY "Users can manage jobs they posted."
    ON public.jobs FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own job applications."
    ON public.job_applications FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Job posters can view applications for their jobs."
    ON public.job_applications FOR SELECT
    USING ((SELECT user_id FROM public.jobs WHERE id = job_id) = auth.uid());
    
--
-- POLICIES: public.events & public.event_registrations
--
CREATE POLICY "Anyone can view events."
    ON public.events FOR SELECT
    USING (true);

CREATE POLICY "Users can manage events they created."
    ON public.events FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own event registrations."
    ON public.event_registrations FOR ALL
    USING (auth.uid() = user_id);

--
-- POLICIES: Community (posts, comments, votes)
-- These are generally more permissive to encourage community interaction.
--
CREATE POLICY "Anyone can view community posts."
    ON public.posts FOR SELECT
    USING (true);
    
CREATE POLICY "Users can manage their own posts."
    ON public.posts FOR ALL
    USING (auth.uid() = user_id);
    
CREATE POLICY "Users can manage their own comments and votes."
    ON public.post_comments FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own votes."
    ON public.post_votes FOR ALL
    USING (auth.uid() = user_id);

-- =============================================
-- Automation: Triggers
-- =============================================
-- Function to automatically update 'updated_at' timestamp on any row modification.
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
COMMENT ON FUNCTION public.handle_updated_at() IS 'Updates the updated_at column to the current timestamp on row modification.';

-- Apply trigger to all tables with an 'updated_at' column.
CREATE TRIGGER on_startups_update BEFORE UPDATE ON public.startups FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER on_decks_update BEFORE UPDATE ON public.decks FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER on_slides_update BEFORE UPDATE ON public.slides FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER on_jobs_update BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER on_job_applications_update BEFORE UPDATE ON public.job_applications FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER on_events_update BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER on_event_registrations_update BEFORE UPDATE ON public.event_registrations FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER on_perks_update BEFORE UPDATE ON public.perks FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER on_posts_update BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER on_post_comments_update BEFORE UPDATE ON public.post_comments FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
```