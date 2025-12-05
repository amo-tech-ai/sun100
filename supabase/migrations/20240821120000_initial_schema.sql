-- Migration: Initial Schema for Startup Platform
-- Purpose: Create core tables for startups, users, decks, and team management
-- Affected tables: profiles, organizations, startups, team_members, decks, slides, milestones, jobs
-- Generated: 2024-08-21

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Function to auto-update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- ============================================================================
-- 1) PROFILES TABLE (extends Supabase auth.users)
-- ============================================================================
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    username text unique,
    full_name text,
    title text,
    avatar_url text,
    bio text,
    linkedin_url text,
    twitter_url text,
    website_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

comment on table public.profiles is 'User profiles extending Supabase auth.users. Stores public profile information.';
comment on column public.profiles.username is 'Unique username for public profile URL (/community/profile/:username)';

create index if not exists idx_profiles_username on public.profiles(username);

-- Trigger for updated_at
create trigger update_profiles_updated_at
    before update on public.profiles
    for each row
    execute function public.handle_updated_at();

-- ============================================================================
-- 2) ORGANIZATIONS TABLE (for multi-tenant support)
-- ============================================================================
create table if not exists public.organizations (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text unique,
    logo_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

comment on table public.organizations is 'Organizations for multi-tenant support. Users can belong to organizations.';

create index if not exists idx_organizations_slug on public.organizations(slug);

-- Trigger for updated_at
create trigger update_organizations_updated_at
    before update on public.organizations
    for each row
    execute function public.handle_updated_at();

-- ============================================================================
-- 3) STARTUPS TABLE (core startup profiles)
-- ============================================================================
create table if not exists public.startups (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete set null,
    org_id uuid references public.organizations(id) on delete cascade,
    
    -- Core Information
    name text not null,
    slug text unique,
    tagline text,
    description text,
    
    -- Company Details
    website_url text,
    logo_url text,
    cover_image_url text,
    industry text,
    founded_year integer,
    location text,
    stage text check (stage in ('idea', 'pre-seed', 'seed', 'series-a', 'series-b', 'growth')),
    team_size text,
    
    -- Funding Information
    funding_ask text,
    total_raised numeric(14,2),
    
    -- Contact
    contact_email text,
    socials jsonb default '{}'::jsonb,
    
    -- AI Generated Fields
    ai_analysis jsonb default '{}'::jsonb,
    
    -- Status
    status text default 'draft' check (status in ('draft', 'active', 'archived')),
    
    -- Timestamps
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

comment on table public.startups is 'Core startup profiles. Each startup can have multiple team members and decks.';
comment on column public.startups.user_id is 'Original creator/owner of the startup';
comment on column public.startups.org_id is 'Organization this startup belongs to (for multi-tenant)';
comment on column public.startups.ai_analysis is 'AI-generated analysis and insights (JSONB)';

create index if not exists idx_startups_user_id on public.startups(user_id);
create index if not exists idx_startups_org_id on public.startups(org_id);
create index if not exists idx_startups_slug on public.startups(slug);
create index if not exists idx_startups_stage on public.startups(stage);

-- Trigger for updated_at
create trigger update_startups_updated_at
    before update on public.startups
    for each row
    execute function public.handle_updated_at();

-- ============================================================================
-- 4) TEAM MEMBERS TABLE (links users to startups)
-- ============================================================================
create table if not exists public.team_members (
    id uuid primary key default gen_random_uuid(),
    startup_id uuid not null references public.startups(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    
    -- Role and Department
    role text not null default 'member' check (role in ('owner', 'admin', 'member', 'viewer')),
    department text,
    title text,
    
    -- Timestamps
    created_at timestamptz not null default now(),
    
    -- Unique constraint: one membership per user per startup
    unique(startup_id, user_id)
);

comment on table public.team_members is 'Links users to startups with roles. Supports team-based access control.';
comment on column public.team_members.role is 'User role: owner (full control), admin (manage), member (contribute), viewer (read-only)';

create index if not exists idx_team_members_startup_id on public.team_members(startup_id);
create index if not exists idx_team_members_user_id on public.team_members(user_id);

-- ============================================================================
-- 5) DECKS TABLE (pitch decks)
-- ============================================================================
create table if not exists public.decks (
    id uuid primary key default gen_random_uuid(),
    startup_id uuid references public.startups(id) on delete cascade,
    org_id uuid references public.organizations(id) on delete cascade,
    user_id uuid references auth.users(id) on delete set null,
    
    -- Deck Information
    title text not null,
    description text,
    deck_type text default 'pitch' check (deck_type in ('pitch', 'investor', 'sales', 'product', 'custom')),
    
    -- Template and Styling
    template_id text,
    theme jsonb default '{}'::jsonb,
    
    -- Status and Visibility
    status text default 'draft' check (status in ('draft', 'published', 'archived')),
    is_public boolean default false,
    
    -- AI Generation Metadata
    generation_metadata jsonb default '{}'::jsonb,
    
    -- Timestamps
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

comment on table public.decks is 'Pitch decks and presentations. Can be linked to startups or standalone.';
comment on column public.decks.generation_metadata is 'AI generation context (prompts, model, etc.)';

create index if not exists idx_decks_startup_id on public.decks(startup_id);
create index if not exists idx_decks_org_id on public.decks(org_id);
create index if not exists idx_decks_user_id on public.decks(user_id);
create index if not exists idx_decks_status on public.decks(status);

-- Trigger for updated_at
create trigger update_decks_updated_at
    before update on public.decks
    for each row
    execute function public.handle_updated_at();

-- ============================================================================
-- 6) SLIDES TABLE (individual slides in decks)
-- ============================================================================
create table if not exists public.slides (
    id uuid primary key default gen_random_uuid(),
    deck_id uuid not null references public.decks(id) on delete cascade,
    
    -- Slide Content
    slide_type text not null,
    title text,
    content jsonb default '{}'::jsonb,
    
    -- Visuals
    image_url text,
    background_url text,
    
    -- Ordering
    position integer not null default 0,
    
    -- AI Generation
    image_prompt text,
    ai_generated boolean default false,
    
    -- Timestamps
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

comment on table public.slides is 'Individual slides within decks. Ordered by position.';
comment on column public.slides.content is 'Slide content as JSONB (supports rich content types)';
comment on column public.slides.image_prompt is 'Prompt used for AI image generation';

create index if not exists idx_slides_deck_id on public.slides(deck_id);
create index if not exists idx_slides_position on public.slides(deck_id, position);

-- Trigger for updated_at
create trigger update_slides_updated_at
    before update on public.slides
    for each row
    execute function public.handle_updated_at();

-- ============================================================================
-- 7) MILESTONES TABLE (startup milestones)
-- ============================================================================
create table if not exists public.milestones (
    id uuid primary key default gen_random_uuid(),
    startup_id uuid not null references public.startups(id) on delete cascade,
    
    -- Milestone Information
    title text not null,
    description text,
    target_date date,
    completed_date date,
    
    -- Status
    status text default 'pending' check (status in ('done', 'active', 'pending')),
    
    -- Timestamps
    created_at timestamptz not null default now()
);

comment on table public.milestones is 'Startup milestones for tracking progress and displaying on dashboard.';

create index if not exists idx_milestones_startup_id on public.milestones(startup_id);
create index if not exists idx_milestones_status on public.milestones(status);

-- ============================================================================
-- 8) JOBS TABLE (job postings)
-- ============================================================================
create table if not exists public.jobs (
    id uuid primary key default gen_random_uuid(),
    startup_id uuid not null references public.startups(id) on delete cascade,
    
    -- Job Information
    title text not null,
    department text,
    description text,
    location text,
    employment_type text check (employment_type in ('full-time', 'part-time', 'contract', 'internship')),
    
    -- Compensation
    salary_min numeric(14,2),
    salary_max numeric(14,2),
    equity_percent numeric(5,2),
    
    -- Application
    application_url text,
    
    -- Status
    is_active boolean default true,
    
    -- Timestamps
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

comment on table public.jobs is 'Job postings for startups. Displayed on startup profiles and job board.';

create index if not exists idx_jobs_startup_id on public.jobs(startup_id);
create index if not exists idx_jobs_is_active on public.jobs(is_active);

-- Trigger for updated_at
create trigger update_jobs_updated_at
    before update on public.jobs
    for each row
    execute function public.handle_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.startups enable row level security;
alter table public.team_members enable row level security;
alter table public.decks enable row level security;
alter table public.slides enable row level security;
alter table public.milestones enable row level security;
alter table public.jobs enable row level security;

-- ============================================================================
-- RLS POLICIES: profiles
-- ============================================================================

-- Public can read all profiles (for community directory)
create policy "Profiles are publicly readable"
    on public.profiles for select
    to public
    using (true);

-- Users can update their own profile
create policy "Users can update own profile"
    on public.profiles for update
    to authenticated
    using (auth.uid() = id)
    with check (auth.uid() = id);

-- Users can insert their own profile
create policy "Users can insert own profile"
    on public.profiles for insert
    to authenticated
    with check (auth.uid() = id);

-- ============================================================================
-- RLS POLICIES: organizations
-- ============================================================================

-- Authenticated users can read organizations they belong to
create policy "Users can read their organizations"
    on public.organizations for select
    to authenticated
    using (
        exists (
            select 1 from public.team_members tm
            join public.startups s on tm.startup_id = s.id
            where s.org_id = organizations.id and tm.user_id = auth.uid()
        )
    );

-- ============================================================================
-- RLS POLICIES: startups
-- ============================================================================

-- Users can read startups they are members of
create policy "Team members can read startups"
    on public.startups for select
    to authenticated
    using (
        exists (
            select 1 from public.team_members
            where startup_id = startups.id and user_id = auth.uid()
        )
        or user_id = auth.uid()
    );

-- Users can insert startups (creates ownership)
create policy "Authenticated users can create startups"
    on public.startups for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Owners and admins can update startups
create policy "Owners and admins can update startups"
    on public.startups for update
    to authenticated
    using (
        exists (
            select 1 from public.team_members
            where startup_id = startups.id 
            and user_id = auth.uid()
            and role in ('owner', 'admin')
        )
        or user_id = auth.uid()
    );

-- Only owners can delete startups
create policy "Owners can delete startups"
    on public.startups for delete
    to authenticated
    using (
        exists (
            select 1 from public.team_members
            where startup_id = startups.id 
            and user_id = auth.uid()
            and role = 'owner'
        )
        or user_id = auth.uid()
    );

-- ============================================================================
-- RLS POLICIES: team_members
-- ============================================================================

-- Team members can see other team members
create policy "Team members can view team"
    on public.team_members for select
    to authenticated
    using (
        exists (
            select 1 from public.team_members tm
            where tm.startup_id = team_members.startup_id and tm.user_id = auth.uid()
        )
    );

-- Owners and admins can manage team members
create policy "Owners and admins can manage team"
    on public.team_members for all
    to authenticated
    using (
        exists (
            select 1 from public.team_members tm
            where tm.startup_id = team_members.startup_id 
            and tm.user_id = auth.uid()
            and tm.role in ('owner', 'admin')
        )
    );

-- ============================================================================
-- RLS POLICIES: decks
-- ============================================================================

-- Public can read published public decks
create policy "Public decks are readable"
    on public.decks for select
    to public
    using (status = 'published' and is_public = true);

-- Users can read their own decks
create policy "Users can read own decks"
    on public.decks for select
    to authenticated
    using (user_id = auth.uid());

-- Team members can read startup decks
create policy "Team members can read startup decks"
    on public.decks for select
    to authenticated
    using (
        exists (
            select 1 from public.team_members tm
            where tm.startup_id = decks.startup_id and tm.user_id = auth.uid()
        )
    );

-- Users can create decks
create policy "Authenticated users can create decks"
    on public.decks for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Users can update their own decks
create policy "Users can update own decks"
    on public.decks for update
    to authenticated
    using (user_id = auth.uid())
    with check (user_id = auth.uid());

-- Users can delete their own decks
create policy "Users can delete own decks"
    on public.decks for delete
    to authenticated
    using (user_id = auth.uid());

-- ============================================================================
-- RLS POLICIES: slides
-- ============================================================================

-- Users can manage slides for their decks
create policy "Users can manage slides for their decks"
    on public.slides for all
    to authenticated
    using (
        exists (
            select 1 from public.decks d
            where d.id = slides.deck_id and d.user_id = auth.uid()
        )
    );

-- Public can read slides for public decks
create policy "Public can read slides for public decks"
    on public.slides for select
    to public
    using (
        exists (
            select 1 from public.decks d
            where d.id = slides.deck_id 
            and d.status = 'published' 
            and d.is_public = true
        )
    );

-- ============================================================================
-- RLS POLICIES: milestones
-- ============================================================================

-- Team members can manage milestones
create policy "Team members can manage milestones"
    on public.milestones for all
    to authenticated
    using (
        exists (
            select 1 from public.team_members tm
            where tm.startup_id = milestones.startup_id and tm.user_id = auth.uid()
        )
    );

-- ============================================================================
-- RLS POLICIES: jobs
-- ============================================================================

-- Public can read active jobs
create policy "Active jobs are publicly readable"
    on public.jobs for select
    to public
    using (is_active = true);

-- Team members can manage jobs
create policy "Team members can manage jobs"
    on public.jobs for all
    to authenticated
    using (
        exists (
            select 1 from public.team_members tm
            where tm.startup_id = jobs.startup_id 
            and tm.user_id = auth.uid()
            and tm.role in ('owner', 'admin')
        )
    );

-- ============================================================================
-- AUTO-CREATE PROFILE TRIGGER
-- ============================================================================

-- Function to create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, full_name, avatar_url)
    values (
        new.id,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url'
    );
    return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users
create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
