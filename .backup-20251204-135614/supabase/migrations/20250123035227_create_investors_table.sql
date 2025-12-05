-- Migration: Create investors table for VC and accelerator directory
-- Purpose: Unified table for VCs, accelerators, angel groups, and corporate VCs
-- Affected tables: public.investors
-- Special considerations: RLS enabled, public read access, authenticated write access
-- Generated: 2025-01-23

-- Create investors table
-- This table stores information about venture capital firms, accelerators, angel groups, and corporate VCs
-- Supports filtering by type, stage, geography, and specialties
create table public.investors (
    -- Primary key: UUID auto-generated
    id uuid primary key default gen_random_uuid(),
    
    -- Core identification fields
    name text not null,
    type text not null check (type = any (array['vc'::text, 'accelerator'::text, 'angel_group'::text, 'corporate_vc'::text])),
    slug text unique,
    
    -- Contact and branding
    logo_url text,
    description text,
    website_url text,
    contact_email text,
    application_link text,
    
    -- Funding terms and information
    min_check_size numeric,
    max_check_size numeric,
    equity_percent_min numeric,
    equity_percent_max numeric,
    terms_summary text,
    
    -- Array fields for flexible categorization
    -- Stages: investment stages this investor focuses on (e.g., pre-seed, seed, series-a)
    stages text[] default '{}'::text[],
    -- Specialties: industry or technology specialties
    specialties text[] default '{}'::text[],
    -- Geographies: geographic regions where investor operates
    geographies text[] default '{}'::text[],
    -- Benefits: benefits and perks provided (e.g., mentorship, credits, Demo Day)
    benefits text[] default '{}'::text[],
    -- Notable investments: portfolio companies or investments
    notable_investments text[] default '{}'::text[],
    
    -- Process information
    time_to_decision text,
    
    -- Timestamps for tracking
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Table comment
comment on table public.investors is 'Investor and VC firm directory. Stores firm information, check sizes, specialties, and application details.';

-- Column comments for documentation
comment on column public.investors.type is 'Type of investor: vc (venture capital), accelerator, angel_group, or corporate_vc';
comment on column public.investors.slug is 'URL-friendly identifier (unique). Used for generating profile URLs.';
comment on column public.investors.stages is 'Investment stages this investor focuses on (e.g., pre-seed, seed, series-a, series-b)';
comment on column public.investors.specialties is 'Industry or technology specialties (e.g., AI/ML, Healthcare, Fintech)';
comment on column public.investors.geographies is 'Geographic regions where investor operates (e.g., San Francisco, Global, Remote)';
comment on column public.investors.benefits is 'Benefits and perks provided (e.g., mentorship, cloud credits, Demo Day, office space)';
comment on column public.investors.notable_investments is 'Notable portfolio companies or investments (e.g., OpenAI, Coinbase)';
comment on column public.investors.time_to_decision is 'Typical time to decision (e.g., "2-4 weeks", "Rolling", "Next cohort opens soon")';
comment on column public.investors.terms_summary is 'Summary of funding terms (e.g., "$500K for 7% equity", "SAFE + MFN", "$350K credits equity-free")';

-- Indexes for query performance
-- Index on slug for fast URL lookups and profile page access
create index idx_investors_slug on public.investors using btree (slug);

-- Index on type for filtering (e.g., show all accelerators, show all VCs)
create index idx_investors_type on public.investors using btree (type);

-- Enable Row Level Security
-- RLS is enabled even though directory is public-read to ensure proper access control
alter table public.investors enable row level security;

-- RLS Policy: Allow public read access to investors
-- Purpose: Directory should be publicly readable for all users (authenticated and anonymous)
-- Rationale: Investors/accelerators want visibility, founders need to browse directory
-- Command: SELECT
-- Access: Everyone (public role)
create policy "Allow public read access to investors"
    on public.investors
    for select
    to public
    using (true);

-- RLS Policy: Allow authenticated users to manage investors
-- Purpose: Only authenticated users can create, update, or delete investor records
-- Rationale: Prevents spam and ensures data quality. Admin users manage directory.
-- Command: ALL (INSERT, UPDATE, DELETE)
-- Access: Authenticated users only
create policy "Allow authenticated users to manage investors"
    on public.investors
    for all
    to public
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');

-- Trigger to automatically update updated_at timestamp
-- Purpose: Track when records are modified for auditing and cache invalidation
-- Function: handle_updated_at() (assumes this function exists in public schema)
create trigger update_investors_updated_at
    before update on public.investors
    for each row
    execute function public.handle_updated_at();


