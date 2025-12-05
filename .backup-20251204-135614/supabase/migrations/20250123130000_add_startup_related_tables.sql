-- Migration: Add related tables for startup profiles wizard
-- Purpose: Add founders, competitors, metrics snapshots, and links tables that reference existing startups table
-- Affected tables: startup_founders, startup_competitors, startup_metrics_snapshots, startup_links
-- Special considerations: All tables reference existing startups table. RLS policies check user_id ownership.
-- Generated: 2025-01-23

-- ============================================================================
-- 1) FOUNDING TEAM TABLE
-- ============================================================================
-- Maps to wizard screen: multiple founders per startup
create table if not exists public.startup_founders (
    -- Primary key: UUID auto-generated
    id uuid primary key default gen_random_uuid(),
    
    -- Foreign key to existing startups table
    startup_id uuid not null references public.startups(id) on delete cascade,
    
    -- Founder information
    full_name text not null,
    role text,
    bio text,
    
    -- META
    created_at timestamptz not null default now()
);

-- Table comment
comment on table public.startup_founders is 'Founding team members for each startup. Multiple founders can be associated with one startup.';

-- Column comments
comment on column public.startup_founders.startup_id is 'References startups(id). Cascade delete when startup is deleted.';

-- Index for startup lookups
create index if not exists idx_startup_founders_startup_id on public.startup_founders(startup_id);

-- ============================================================================
-- 2) COMPETITORS TABLE
-- ============================================================================
-- Maps to wizard screen: up to 3 competitors (but schema allows more)
create table if not exists public.startup_competitors (
    -- Primary key: UUID auto-generated
    id uuid primary key default gen_random_uuid(),
    
    -- Foreign key to existing startups table
    startup_id uuid not null references public.startups(id) on delete cascade,
    
    -- Competitor information
    name text not null,
    website_url text,
    notes text,
    
    -- META
    created_at timestamptz not null default now()
);

-- Table comment
comment on table public.startup_competitors is 'Competitor information for each startup. Multiple competitors can be associated with one startup.';

-- Column comments
comment on column public.startup_competitors.startup_id is 'References startups(id). Cascade delete when startup is deleted.';

-- Index for startup lookups
create index if not exists idx_startup_competitors_startup_id on public.startup_competitors(startup_id);

-- ============================================================================
-- 3) METRICS SNAPSHOTS TABLE (OPTIONAL, FOR DASHBOARD)
-- ============================================================================
-- Feeds charts on dashboard. Allows tracking metrics over time.
create table if not exists public.startup_metrics_snapshots (
    -- Primary key: UUID auto-generated
    id uuid primary key default gen_random_uuid(),
    
    -- Foreign key to existing startups table
    startup_id uuid not null references public.startups(id) on delete cascade,
    
    -- Snapshot date
    snapshot_date date not null default current_date,
    
    -- Metrics at this snapshot
    monthly_active_users integer,
    monthly_revenue numeric(14,2),
    growth_rate_pct numeric(6,2),
    
    -- META
    created_at timestamptz not null default now()
);

-- Table comment
comment on table public.startup_metrics_snapshots is 'Historical metrics snapshots for dashboard charts. Tracks MAU, revenue, and growth rate over time.';

-- Column comments
comment on column public.startup_metrics_snapshots.startup_id is 'References startups(id). Cascade delete when startup is deleted.';
comment on column public.startup_metrics_snapshots.snapshot_date is 'Date of this metrics snapshot. Defaults to current_date.';

-- Index for startup lookups and date queries
create index if not exists idx_startup_metrics_snapshots_startup_id on public.startup_metrics_snapshots(startup_id);
create index if not exists idx_startup_metrics_snapshots_snapshot_date on public.startup_metrics_snapshots(snapshot_date);

-- ============================================================================
-- 4) LINKS & ASSETS TABLE
-- ============================================================================
-- Maps to links/assets step or dashboard settings
create table if not exists public.startup_links (
    -- Primary key: UUID auto-generated
    id uuid primary key default gen_random_uuid(),
    
    -- Foreign key to existing startups table
    startup_id uuid not null references public.startups(id) on delete cascade,
    
    -- Link information
    kind text not null check (kind in ('pitch_deck','demo','docs','linkedin','x','website','other')),
    label text,
    url text not null,
    
    -- META
    created_at timestamptz not null default now()
);

-- Table comment
comment on table public.startup_links is 'Links and assets for each startup (pitch deck, demo, docs, social media, etc.).';

-- Column comments
comment on column public.startup_links.startup_id is 'References startups(id). Cascade delete when startup is deleted.';
comment on column public.startup_links.kind is 'Type of link: pitch_deck, demo, docs, linkedin, x (Twitter), website, other';

-- Index for startup lookups
create index if not exists idx_startup_links_startup_id on public.startup_links(startup_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
alter table public.startup_founders enable row level security;
alter table public.startup_competitors enable row level security;
alter table public.startup_metrics_snapshots enable row level security;
alter table public.startup_links enable row level security;

-- ============================================================================
-- RLS POLICIES: startup_founders
-- ============================================================================
-- Note: Policies check ownership via startups.user_id since startups table already exists
-- Drop existing policies if they exist (for idempotent migrations)

-- Policy: Authenticated users can SELECT founders for their startups
-- Purpose: Allow owners to read founders for their own startups
-- Rationale: Access controlled via parent startups ownership (user_id)
drop policy if exists "Authenticated users can select founders for their startups" on public.startup_founders;
create policy "Authenticated users can select founders for their startups"
    on public.startup_founders
    for select
    to authenticated
    using (
        exists (
            select 1 from public.startups s
            where s.id = startup_founders.startup_id
                and s.user_id = (select auth.uid())
        )
    );

-- Policy: Authenticated users can INSERT founders for their startups
-- Purpose: Allow owners to add founders to their own startups
-- Rationale: Access controlled via parent startups ownership (user_id)
drop policy if exists "Authenticated users can insert founders for their startups" on public.startup_founders;
create policy "Authenticated users can insert founders for their startups"
    on public.startup_founders
    for insert
    to authenticated
    with check (
        exists (
            select 1 from public.startups s
            where s.id = startup_founders.startup_id
                and s.user_id = (select auth.uid())
        )
    );

-- Policy: Authenticated users can UPDATE founders for their startups
-- Purpose: Allow owners to modify founders for their own startups
-- Rationale: Access controlled via parent startups ownership (user_id)
drop policy if exists "Authenticated users can update founders for their startups" on public.startup_founders;
create policy "Authenticated users can update founders for their startups"
    on public.startup_founders
    for update
    to authenticated
    using (
        exists (
            select 1 from public.startups s
            where s.id = startup_founders.startup_id
                and s.user_id = (select auth.uid())
        )
    )
    with check (
        exists (
            select 1 from public.startups s
            where s.id = startup_founders.startup_id
                and s.user_id = (select auth.uid())
        )
    );

-- Policy: Authenticated users can DELETE founders for their startups
-- Purpose: Allow owners to remove founders from their own startups
-- Rationale: Access controlled via parent startups ownership (user_id)
drop policy if exists "Authenticated users can delete founders for their startups" on public.startup_founders;
create policy "Authenticated users can delete founders for their startups"
    on public.startup_founders
    for delete
    to authenticated
    using (
        exists (
            select 1 from public.startups s
            where s.id = startup_founders.startup_id
                and s.user_id = (select auth.uid())
        )
    );

-- Policy: Anonymous users cannot access founders
-- Purpose: Deny anonymous access to founders
-- Rationale: Founders are private to startup owners
drop policy if exists "Anonymous users cannot access founders" on public.startup_founders;
create policy "Anonymous users cannot access founders"
    on public.startup_founders
    for all
    to anon
    using (false)
    with check (false);

-- ============================================================================
-- RLS POLICIES: startup_competitors
-- ============================================================================

-- Policy: Authenticated users can SELECT competitors for their startups
drop policy if exists "Authenticated users can select competitors for their startups" on public.startup_competitors;
create policy "Authenticated users can select competitors for their startups"
    on public.startup_competitors
    for select
    to authenticated
    using (
        exists (
            select 1 from public.startups s
            where s.id = startup_competitors.startup_id
                and s.user_id = (select auth.uid())
        )
    );

-- Policy: Authenticated users can INSERT competitors for their startups
drop policy if exists "Authenticated users can insert competitors for their startups" on public.startup_competitors;
create policy "Authenticated users can insert competitors for their startups"
    on public.startup_competitors
    for insert
    to authenticated
    with check (
        exists (
            select 1 from public.startups s
            where s.id = startup_competitors.startup_id
                and s.user_id = (select auth.uid())
        )
    );

-- Policy: Authenticated users can UPDATE competitors for their startups
drop policy if exists "Authenticated users can update competitors for their startups" on public.startup_competitors;
create policy "Authenticated users can update competitors for their startups"
    on public.startup_competitors
    for update
    to authenticated
    using (
        exists (
            select 1 from public.startups s
            where s.id = startup_competitors.startup_id
                and s.user_id = (select auth.uid())
        )
    )
    with check (
        exists (
            select 1 from public.startups s
            where s.id = startup_competitors.startup_id
                and s.user_id = (select auth.uid())
        )
    );

-- Policy: Authenticated users can DELETE competitors for their startups
drop policy if exists "Authenticated users can delete competitors for their startups" on public.startup_competitors;
create policy "Authenticated users can delete competitors for their startups"
    on public.startup_competitors
    for delete
    to authenticated
    using (
        exists (
            select 1 from public.startups s
            where s.id = startup_competitors.startup_id
                and s.user_id = (select auth.uid())
        )
    );

-- Policy: Anonymous users cannot access competitors
drop policy if exists "Anonymous users cannot access competitors" on public.startup_competitors;
create policy "Anonymous users cannot access competitors"
    on public.startup_competitors
    for all
    to anon
    using (false)
    with check (false);

-- ============================================================================
-- RLS POLICIES: startup_metrics_snapshots
-- ============================================================================

-- Policy: Authenticated users can SELECT metrics for their startups
drop policy if exists "Authenticated users can select metrics for their startups" on public.startup_metrics_snapshots;
create policy "Authenticated users can select metrics for their startups"
    on public.startup_metrics_snapshots
    for select
    to authenticated
    using (
        exists (
            select 1 from public.startups s
            where s.id = startup_metrics_snapshots.startup_id
                and s.user_id = (select auth.uid())
        )
    );

-- Policy: Authenticated users can INSERT metrics for their startups
drop policy if exists "Authenticated users can insert metrics for their startups" on public.startup_metrics_snapshots;
create policy "Authenticated users can insert metrics for their startups"
    on public.startup_metrics_snapshots
    for insert
    to authenticated
    with check (
        exists (
            select 1 from public.startups s
            where s.id = startup_metrics_snapshots.startup_id
                and s.user_id = (select auth.uid())
        )
    );

-- Policy: Authenticated users can UPDATE metrics for their startups
drop policy if exists "Authenticated users can update metrics for their startups" on public.startup_metrics_snapshots;
create policy "Authenticated users can update metrics for their startups"
    on public.startup_metrics_snapshots
    for update
    to authenticated
    using (
        exists (
            select 1 from public.startups s
            where s.id = startup_metrics_snapshots.startup_id
                and s.user_id = (select auth.uid())
        )
    )
    with check (
        exists (
            select 1 from public.startups s
            where s.id = startup_metrics_snapshots.startup_id
                and s.user_id = (select auth.uid())
        )
    );

-- Policy: Authenticated users can DELETE metrics for their startups
drop policy if exists "Authenticated users can delete metrics for their startups" on public.startup_metrics_snapshots;
create policy "Authenticated users can delete metrics for their startups"
    on public.startup_metrics_snapshots
    for delete
    to authenticated
    using (
        exists (
            select 1 from public.startups s
            where s.id = startup_metrics_snapshots.startup_id
                and s.user_id = (select auth.uid())
        )
    );

-- Policy: Anonymous users cannot access metrics
drop policy if exists "Anonymous users cannot access metrics" on public.startup_metrics_snapshots;
create policy "Anonymous users cannot access metrics"
    on public.startup_metrics_snapshots
    for all
    to anon
    using (false)
    with check (false);

-- ============================================================================
-- RLS POLICIES: startup_links
-- ============================================================================

-- Policy: Authenticated users can SELECT links for their startups
drop policy if exists "Authenticated users can select links for their startups" on public.startup_links;
create policy "Authenticated users can select links for their startups"
    on public.startup_links
    for select
    to authenticated
    using (
        exists (
            select 1 from public.startups s
            where s.id = startup_links.startup_id
                and s.user_id = (select auth.uid())
        )
    );

-- Policy: Authenticated users can INSERT links for their startups
drop policy if exists "Authenticated users can insert links for their startups" on public.startup_links;
create policy "Authenticated users can insert links for their startups"
    on public.startup_links
    for insert
    to authenticated
    with check (
        exists (
            select 1 from public.startups s
            where s.id = startup_links.startup_id
                and s.user_id = (select auth.uid())
        )
    );

-- Policy: Authenticated users can UPDATE links for their startups
drop policy if exists "Authenticated users can update links for their startups" on public.startup_links;
create policy "Authenticated users can update links for their startups"
    on public.startup_links
    for update
    to authenticated
    using (
        exists (
            select 1 from public.startups s
            where s.id = startup_links.startup_id
                and s.user_id = (select auth.uid())
        )
    )
    with check (
        exists (
            select 1 from public.startups s
            where s.id = startup_links.startup_id
                and s.user_id = (select auth.uid())
        )
    );

-- Policy: Authenticated users can DELETE links for their startups
drop policy if exists "Authenticated users can delete links for their startups" on public.startup_links;
create policy "Authenticated users can delete links for their startups"
    on public.startup_links
    for delete
    to authenticated
    using (
        exists (
            select 1 from public.startups s
            where s.id = startup_links.startup_id
                and s.user_id = (select auth.uid())
        )
    );

-- Policy: Anonymous users cannot access links
drop policy if exists "Anonymous users cannot access links" on public.startup_links;
create policy "Anonymous users cannot access links"
    on public.startup_links
    for all
    to anon
    using (false)
    with check (false);

