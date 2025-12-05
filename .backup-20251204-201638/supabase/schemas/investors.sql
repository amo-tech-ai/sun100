-- Declarative schema for investors table
-- Purpose: VC and startup accelerator directory
-- Supports: VCs, accelerators, angel groups, and corporate VCs
-- Last updated: 2025-01-22

-- Create investors table
create table public.investors (
    -- Primary key
    id uuid primary key default gen_random_uuid(),
    
    -- Core fields
    name text not null,
    type text not null check (type = any (array['vc'::text, 'accelerator'::text, 'angel_group'::text, 'corporate_vc'::text])),
    slug text unique,
    
    -- Contact & links
    logo_url text,
    description text,
    website_url text,
    contact_email text,
    application_link text,
    social_links jsonb default '{}'::jsonb,
    
    -- Funding information
    min_check_size numeric,
    max_check_size numeric,
    equity_percent_min numeric,
    equity_percent_max numeric,
    terms_summary text,
    
    -- Array fields (postgresql arrays)
    stages text[] default '{}'::text[],
    specialties text[] default '{}'::text[],
    geographies text[] default '{}'::text[],
    benefits text[] default '{}'::text[],
    notable_investments text[] default '{}'::text[],
    
    -- Process fields
    time_to_decision text,
    
    -- Timestamps
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Table comment
comment on table public.investors is 'Investor and VC firm directory. Stores firm information, check sizes, specialties, and application details.';

-- Column comments
comment on column public.investors.type is 'Type of investor: vc, accelerator, angel_group, or corporate_vc';
comment on column public.investors.slug is 'URL-friendly identifier (unique)';
comment on column public.investors.stages is 'Investment stages this investor focuses on (e.g., pre-seed, seed, series-a)';
comment on column public.investors.specialties is 'Industry or technology specialties';
comment on column public.investors.geographies is 'Geographic regions where investor operates';
comment on column public.investors.benefits is 'Benefits and perks provided (e.g., mentorship, credits, Demo Day)';
comment on column public.investors.notable_investments is 'Notable portfolio companies or investments';
comment on column public.investors.time_to_decision is 'Typical time to decision (e.g., "2-4 weeks", "Rolling")';
comment on column public.investors.terms_summary is 'Summary of terms (e.g., "SAFE + MFN", "$500K for 7% equity")';
comment on column public.investors.social_links is 'Social media links (JSONB: {twitter: "url", linkedin: "url", substack: "url"})';

-- Indexes for performance
-- Index on slug for fast URL lookups
create index idx_investors_slug on public.investors using btree (slug);

-- Index on type for filtering (e.g., show all accelerators)
create index idx_investors_type on public.investors using btree (type);

-- Enable Row Level Security
alter table public.investors enable row level security;

-- RLS Policies
-- Policy: Allow public read access to investors
-- Purpose: Directory should be publicly readable for all users
-- Command: SELECT
create policy "Allow public read access to investors"
    on public.investors
    for select
    to public
    using (true);

-- Policy: Allow authenticated users to manage investors
-- Purpose: Only authenticated users can create, update, or delete investor records
-- Command: ALL (INSERT, UPDATE, DELETE)
create policy "Allow authenticated users to manage investors"
    on public.investors
    for all
    to public
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');

-- Trigger to update updated_at timestamp
create trigger update_investors_updated_at
    before update on public.investors
    for each row
    execute function public.handle_updated_at();

