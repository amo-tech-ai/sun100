-- Migration: CRM Schema
-- Purpose: Add CRM-related tables for lead management and sales tracking
-- Affected tables: leads, contacts, deals, activities
-- Generated: 2024-09-06

-- ============================================================================
-- 1) LEADS TABLE
-- ============================================================================
create table if not exists public.leads (
    id uuid primary key default gen_random_uuid(),
    startup_id uuid references public.startups(id) on delete cascade,
    user_id uuid references auth.users(id) on delete set null,
    
    -- Lead Information
    company_name text not null,
    contact_name text,
    contact_email text,
    contact_phone text,
    website_url text,
    
    -- Lead Details
    source text,
    status text default 'new' check (status in ('new', 'contacted', 'qualified', 'converted', 'lost')),
    score integer default 0,
    
    -- AI Enrichment
    enrichment_data jsonb default '{}'::jsonb,
    
    -- Notes
    notes text,
    
    -- Timestamps
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

comment on table public.leads is 'Sales leads for CRM. Can be linked to startups or standalone.';
comment on column public.leads.enrichment_data is 'AI-enriched data about the lead (company info, social profiles, etc.)';

create index if not exists idx_leads_startup_id on public.leads(startup_id);
create index if not exists idx_leads_user_id on public.leads(user_id);
create index if not exists idx_leads_status on public.leads(status);

-- Trigger for updated_at
create trigger update_leads_updated_at
    before update on public.leads
    for each row
    execute function public.handle_updated_at();

-- ============================================================================
-- 2) DEALS TABLE
-- ============================================================================
create table if not exists public.deals (
    id uuid primary key default gen_random_uuid(),
    startup_id uuid references public.startups(id) on delete cascade,
    lead_id uuid references public.leads(id) on delete set null,
    user_id uuid references auth.users(id) on delete set null,
    
    -- Deal Information
    title text not null,
    value numeric(14,2),
    currency text default 'USD',
    
    -- Pipeline Stage
    stage text default 'discovery' check (stage in ('discovery', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost')),
    probability integer default 0,
    
    -- Dates
    expected_close_date date,
    actual_close_date date,
    
    -- Notes
    notes text,
    
    -- AI Analysis
    deal_score integer,
    ai_insights jsonb default '{}'::jsonb,
    
    -- Timestamps
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

comment on table public.deals is 'Sales deals/opportunities. Tracks pipeline stages and values.';
comment on column public.deals.deal_score is 'AI-calculated deal score (0-100)';
comment on column public.deals.ai_insights is 'AI-generated insights about the deal';

create index if not exists idx_deals_startup_id on public.deals(startup_id);
create index if not exists idx_deals_lead_id on public.deals(lead_id);
create index if not exists idx_deals_stage on public.deals(stage);

-- Trigger for updated_at
create trigger update_deals_updated_at
    before update on public.deals
    for each row
    execute function public.handle_updated_at();

-- ============================================================================
-- 3) ACTIVITIES TABLE
-- ============================================================================
create table if not exists public.activities (
    id uuid primary key default gen_random_uuid(),
    startup_id uuid references public.startups(id) on delete cascade,
    lead_id uuid references public.leads(id) on delete cascade,
    deal_id uuid references public.deals(id) on delete cascade,
    user_id uuid references auth.users(id) on delete set null,
    
    -- Activity Information
    activity_type text not null check (activity_type in ('call', 'email', 'meeting', 'note', 'task')),
    title text not null,
    description text,
    
    -- Scheduling
    scheduled_at timestamptz,
    completed_at timestamptz,
    is_completed boolean default false,
    
    -- Timestamps
    created_at timestamptz not null default now()
);

comment on table public.activities is 'CRM activities (calls, emails, meetings) linked to leads and deals.';

create index if not exists idx_activities_lead_id on public.activities(lead_id);
create index if not exists idx_activities_deal_id on public.activities(deal_id);
create index if not exists idx_activities_user_id on public.activities(user_id);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Enable RLS
alter table public.leads enable row level security;
alter table public.deals enable row level security;
alter table public.activities enable row level security;

-- Leads: Users can manage their own leads
create policy "Users can manage own leads"
    on public.leads for all
    to authenticated
    using (user_id = auth.uid())
    with check (user_id = auth.uid());

-- Leads: Team members can manage startup leads
create policy "Team members can manage startup leads"
    on public.leads for all
    to authenticated
    using (
        exists (
            select 1 from public.team_members tm
            where tm.startup_id = leads.startup_id and tm.user_id = auth.uid()
        )
    );

-- Deals: Users can manage their own deals
create policy "Users can manage own deals"
    on public.deals for all
    to authenticated
    using (user_id = auth.uid())
    with check (user_id = auth.uid());

-- Deals: Team members can manage startup deals
create policy "Team members can manage startup deals"
    on public.deals for all
    to authenticated
    using (
        exists (
            select 1 from public.team_members tm
            where tm.startup_id = deals.startup_id and tm.user_id = auth.uid()
        )
    );

-- Activities: Users can manage their own activities
create policy "Users can manage own activities"
    on public.activities for all
    to authenticated
    using (user_id = auth.uid())
    with check (user_id = auth.uid());

-- Activities: Team members can view startup activities
create policy "Team members can view startup activities"
    on public.activities for select
    to authenticated
    using (
        exists (
            select 1 from public.team_members tm
            where tm.startup_id = activities.startup_id and tm.user_id = auth.uid()
        )
    );
