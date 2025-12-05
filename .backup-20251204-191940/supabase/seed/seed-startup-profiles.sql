-- Seed data for startup profiles schema
-- Purpose: Populate startups, founders, competitors, metrics, and links tables with sample data
-- Generated: 2025-01-23
-- Source: Sample startup data for testing wizard and dashboard features
--
-- This seed file is automatically executed when running:
--   supabase db reset
--   supabase db seed
--
-- Note: This file references existing users from auth.users.
-- Uses INSERT statements with ON CONFLICT to prevent duplicates if seed is run multiple times.

-- ============================================================================
-- STEP 1: Sample Startup Profile 1 - AI Fashion Platform
-- ============================================================================

-- Insert startup profile (using existing startups table schema)
INSERT INTO public.startups (
    user_id,
    name,
    website_url,
    tagline,
    logo_url,
    description,
    traction_data,
    team_data,
    needs_data,
    year_founded,
    profile_strength,
    is_public
) VALUES (
    (SELECT id FROM auth.users LIMIT 1),
    'FashionOS',
    'https://fashionos.ai',
    'AI-powered fashion event platform connecting brands with venues',
    'https://fashionos.ai/logo.png',
    'AI-powered marketplace that matches fashion brands with curated venues, automates booking workflows, and provides event planning tools specifically designed for runway shows, pop-ups, and fashion events.',
    '{"monthly_active_users": 150, "monthly_revenue": 12500.00, "growth_rate_pct": 25.5, "stage": "seed", "traction_level": "paying_customers"}'::jsonb,
    '{"size": "2_5", "founders": [{"name": "Alex Chen", "role": "CEO & Co-founder"}, {"name": "Jordan Martinez", "role": "CTO & Co-founder"}]}'::jsonb,
    '{"is_raising": true, "target_raise_amount": 500000.00, "use_of_funds": ["product", "engineering", "marketing"]}'::jsonb,
    2023,
    75,
    false
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    website_url = EXCLUDED.website_url,
    tagline = EXCLUDED.tagline,
    updated_at = now();

-- Insert founders for FashionOS
INSERT INTO public.startup_founders (
    startup_id,
    full_name,
    role,
    bio
)
SELECT 
    s.id,
    'Alex Chen',
    'CEO & Co-founder',
    'Former fashion event producer with 10+ years experience. Built events for 50+ brands including Gucci and Prada.'
FROM public.startups s
WHERE s.name = 'FashionOS'
ON CONFLICT DO NOTHING;

INSERT INTO public.startup_founders (
    startup_id,
    full_name,
    role,
    bio
)
SELECT 
    s.id,
    'Jordan Martinez',
    'CTO & Co-founder',
    'Ex-Google AI engineer. Built ML systems processing 1B+ fashion images. Y Combinator S23.'
FROM public.startups s
WHERE s.name = 'FashionOS'
ON CONFLICT DO NOTHING;

-- Insert competitors for FashionOS
INSERT INTO public.startup_competitors (
    startup_id,
    name,
    website_url,
    notes
)
SELECT 
    s.id,
    'Eventbrite',
    'https://eventbrite.com',
    'General event platform, not fashion-specific. Lacks runway show templates and fashion industry features.'
FROM public.startups s
WHERE s.name = 'FashionOS'
ON CONFLICT DO NOTHING;

INSERT INTO public.startup_competitors (
    startup_id,
    name,
    website_url,
    notes
)
SELECT 
    s.id,
    'Peerspace',
    'https://peerspace.com',
    'Venue marketplace but not fashion-focused. No AI matching or fashion event workflows.'
FROM public.startups s
WHERE s.name = 'FashionOS'
ON CONFLICT DO NOTHING;

-- Insert metrics snapshots for FashionOS
INSERT INTO public.startup_metrics_snapshots (
    startup_id,
    snapshot_date,
    monthly_active_users,
    monthly_revenue,
    growth_rate_pct
)
SELECT 
    s.id,
    CURRENT_DATE - INTERVAL '3 months',
    50,
    2500.00,
    15.0
FROM public.startups s
WHERE s.name = 'FashionOS'
ON CONFLICT DO NOTHING;

INSERT INTO public.startup_metrics_snapshots (
    startup_id,
    snapshot_date,
    monthly_active_users,
    monthly_revenue,
    growth_rate_pct
)
SELECT 
    s.id,
    CURRENT_DATE - INTERVAL '2 months',
    100,
    7500.00,
    20.0
FROM public.startups s
WHERE s.name = 'FashionOS'
ON CONFLICT DO NOTHING;

INSERT INTO public.startup_metrics_snapshots (
    startup_id,
    snapshot_date,
    monthly_active_users,
    monthly_revenue,
    growth_rate_pct
)
SELECT 
    s.id,
    CURRENT_DATE - INTERVAL '1 month',
    150,
    12500.00,
    25.5
FROM public.startups s
WHERE s.name = 'FashionOS'
ON CONFLICT DO NOTHING;

-- Insert links for FashionOS
INSERT INTO public.startup_links (
    startup_id,
    kind,
    label,
    url
)
SELECT 
    s.id,
    'pitch_deck',
    'Seed Deck',
    'https://fashionos.ai/pitch-deck.pdf'
FROM public.startups s
WHERE s.name = 'FashionOS'
ON CONFLICT DO NOTHING;

INSERT INTO public.startup_links (
    startup_id,
    kind,
    label,
    url
)
SELECT 
    s.id,
    'demo',
    'Product Demo',
    'https://demo.fashionos.ai'
FROM public.startups s
WHERE s.name = 'FashionOS'
ON CONFLICT DO NOTHING;

INSERT INTO public.startup_links (
    startup_id,
    kind,
    label,
    url
)
SELECT 
    s.id,
    'linkedin',
    'LinkedIn',
    'https://linkedin.com/company/fashionos'
FROM public.startups s
WHERE s.name = 'FashionOS'
ON CONFLICT DO NOTHING;

INSERT INTO public.startup_links (
    startup_id,
    kind,
    label,
    url
)
SELECT 
    s.id,
    'x',
    'Twitter/X',
    'https://x.com/fashionos'
FROM public.startups s
WHERE s.name = 'FashionOS'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- STEP 2: Sample Startup Profile 2 - Healthcare AI Platform
-- ============================================================================

INSERT INTO public.startups (
    user_id,
    name,
    website_url,
    tagline,
    logo_url,
    description,
    traction_data,
    team_data,
    needs_data,
    year_founded,
    profile_strength,
    is_public
) VALUES (
    (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1 OFFSET 0),
    'MedAI Diagnostics',
    'https://medaidiagnostics.com',
    'AI-powered medical imaging analysis for faster, more accurate diagnoses',
    'https://medaidiagnostics.com/logo.png',
    'AI-powered platform that analyzes medical images (X-rays, CT scans, MRIs) in seconds, flagging abnormalities and providing preliminary reports to radiologists for faster, more accurate diagnoses.',
    '{"monthly_active_users": 25, "monthly_revenue": 0.00, "growth_rate_pct": 0.0, "stage": "pre_seed", "traction_level": "early_users"}'::jsonb,
    '{"size": "2_5", "founders": [{"name": "Dr. Sarah Kim", "role": "CEO & Co-founder"}, {"name": "Michael Park", "role": "CTO & Co-founder"}]}'::jsonb,
    '{"is_raising": true, "target_raise_amount": 750000.00, "use_of_funds": ["regulatory", "engineering", "sales"]}'::jsonb,
    2024,
    60,
    false
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    website_url = EXCLUDED.website_url,
    updated_at = now();

-- Insert founders for MedAI Diagnostics
INSERT INTO public.startup_founders (
    startup_id,
    full_name,
    role,
    bio
)
SELECT 
    s.id,
    'Dr. Sarah Kim',
    'CEO & Co-founder',
    'Board-certified radiologist with 15 years experience. Former Chief of Radiology at Stanford Hospital.'
FROM public.startups s
WHERE s.name = 'MedAI Diagnostics'
ON CONFLICT DO NOTHING;

INSERT INTO public.startup_founders (
    startup_id,
    full_name,
    role,
    bio
)
SELECT 
    s.id,
    'Michael Park',
    'CTO & Co-founder',
    'Ex-DeepMind researcher. Published 20+ papers on medical AI. PhD in Computer Vision from MIT.'
FROM public.startups s
WHERE s.name = 'MedAI Diagnostics'
ON CONFLICT DO NOTHING;

-- Insert competitors for MedAI Diagnostics
INSERT INTO public.startup_competitors (
    startup_id,
    name,
    website_url,
    notes
)
SELECT 
    s.id,
    'Zebra Medical Vision',
    'https://zebramed.com',
    'Established player but slower, less accurate. Focuses on specific conditions only.'
FROM public.startups s
WHERE s.name = 'MedAI Diagnostics'
ON CONFLICT DO NOTHING;

INSERT INTO public.startup_competitors (
    startup_id,
    name,
    website_url,
    notes
)
SELECT 
    s.id,
    'Aidoc',
    'https://aidoc.com',
    'Good product but expensive and complex integration. We offer better pricing and easier setup.'
FROM public.startups s
WHERE s.name = 'MedAI Diagnostics'
ON CONFLICT DO NOTHING;

-- Insert metrics snapshots for MedAI Diagnostics
INSERT INTO public.startup_metrics_snapshots (
    startup_id,
    snapshot_date,
    monthly_active_users,
    monthly_revenue,
    growth_rate_pct
)
SELECT 
    s.id,
    CURRENT_DATE - INTERVAL '2 months',
    5,
    0.00,
    0.0
FROM public.startups s
WHERE s.name = 'MedAI Diagnostics'
ON CONFLICT DO NOTHING;

INSERT INTO public.startup_metrics_snapshots (
    startup_id,
    snapshot_date,
    monthly_active_users,
    monthly_revenue,
    growth_rate_pct
)
SELECT 
    s.id,
    CURRENT_DATE - INTERVAL '1 month',
    25,
    0.00,
    0.0
FROM public.startups s
WHERE s.name = 'MedAI Diagnostics'
ON CONFLICT DO NOTHING;

-- Insert links for MedAI Diagnostics
INSERT INTO public.startup_links (
    startup_id,
    kind,
    label,
    url
)
SELECT 
    s.id,
    'pitch_deck',
    'Pre-Seed Deck',
    'https://medaidiagnostics.com/pitch.pdf'
FROM public.startups s
WHERE s.name = 'MedAI Diagnostics'
ON CONFLICT DO NOTHING;

INSERT INTO public.startup_links (
    startup_id,
    kind,
    label,
    url
)
SELECT 
    s.id,
    'docs',
    'Clinical Study Results',
    'https://medaidiagnostics.com/clinical-study.pdf'
FROM public.startups s
WHERE s.name = 'MedAI Diagnostics'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- STEP 3: Sample Startup Profile 3 - Fintech SaaS (Solo Founder)
-- ============================================================================

INSERT INTO public.startups (
    user_id,
    name,
    website_url,
    tagline,
    logo_url,
    description,
    traction_data,
    team_data,
    needs_data,
    year_founded,
    profile_strength,
    is_public
) VALUES (
    (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1 OFFSET 1),
    'BudgetBot',
    'https://budgetbot.ai',
    'AI-powered personal finance assistant that helps people save money automatically',
    'https://budgetbot.ai/logo.png',
    'AI assistant that connects to bank accounts, analyzes spending patterns, and automatically suggests savings opportunities. Uses GPT-4 to provide personalized financial advice.',
    '{"monthly_active_users": 500, "monthly_revenue": 3500.00, "growth_rate_pct": 40.0, "stage": "mvp", "traction_level": "paying_customers"}'::jsonb,
    '{"size": "solo", "founders": [{"name": "Taylor Rodriguez", "role": "Founder & CEO"}]}'::jsonb,
    '{"is_raising": false, "target_raise_amount": null, "use_of_funds": []}'::jsonb,
    2024,
    85,
    false
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    website_url = EXCLUDED.website_url,
    updated_at = now();

-- Insert founder for BudgetBot (solo founder)
INSERT INTO public.startup_founders (
    startup_id,
    full_name,
    role,
    bio
)
SELECT 
    s.id,
    'Taylor Rodriguez',
    'Founder & CEO',
    'Former Stripe engineer. Built financial APIs for 5+ years. Self-taught AI/ML. Bootstrapped to $3.5K MRR.'
FROM public.startups s
WHERE s.name = 'BudgetBot'
ON CONFLICT DO NOTHING;

-- Insert competitors for BudgetBot
INSERT INTO public.startup_competitors (
    startup_id,
    name,
    website_url,
    notes
)
SELECT 
    s.id,
    'Mint',
    'https://mint.com',
    'Acquired by Intuit, being shut down. Users looking for alternatives.'
FROM public.startups s
WHERE s.name = 'BudgetBot'
ON CONFLICT DO NOTHING;

INSERT INTO public.startup_competitors (
    startup_id,
    name,
    website_url,
    notes
)
SELECT 
    s.id,
    'YNAB',
    'https://ynab.com',
    'Good but expensive ($14.99/month) and requires manual budgeting. We automate everything with AI.'
FROM public.startups s
WHERE s.name = 'BudgetBot'
ON CONFLICT DO NOTHING;

INSERT INTO public.startup_competitors (
    startup_id,
    name,
    website_url,
    notes
)
SELECT 
    s.id,
    'Copilot',
    'https://copilot.money',
    'Similar concept but no AI assistant. We provide conversational financial advice.'
FROM public.startups s
WHERE s.name = 'BudgetBot'
ON CONFLICT DO NOTHING;

-- Insert metrics snapshots for BudgetBot
INSERT INTO public.startup_metrics_snapshots (
    startup_id,
    snapshot_date,
    monthly_active_users,
    monthly_revenue,
    growth_rate_pct
)
SELECT 
    s.id,
    CURRENT_DATE - INTERVAL '4 months',
    100,
    500.00,
    25.0
FROM public.startups s
WHERE s.name = 'BudgetBot'
ON CONFLICT DO NOTHING;

INSERT INTO public.startup_metrics_snapshots (
    startup_id,
    snapshot_date,
    monthly_active_users,
    monthly_revenue,
    growth_rate_pct
)
SELECT 
    s.id,
    CURRENT_DATE - INTERVAL '3 months',
    200,
    1200.00,
    30.0
FROM public.startups s
WHERE s.name = 'BudgetBot'
ON CONFLICT DO NOTHING;

INSERT INTO public.startup_metrics_snapshots (
    startup_id,
    snapshot_date,
    monthly_active_users,
    monthly_revenue,
    growth_rate_pct
)
SELECT 
    s.id,
    CURRENT_DATE - INTERVAL '2 months',
    350,
    2500.00,
    35.0
FROM public.startups s
WHERE s.name = 'BudgetBot'
ON CONFLICT DO NOTHING;

INSERT INTO public.startup_metrics_snapshots (
    startup_id,
    snapshot_date,
    monthly_active_users,
    monthly_revenue,
    growth_rate_pct
)
SELECT 
    s.id,
    CURRENT_DATE - INTERVAL '1 month',
    500,
    3500.00,
    40.0
FROM public.startups s
WHERE s.name = 'BudgetBot'
ON CONFLICT DO NOTHING;

-- Insert links for BudgetBot
INSERT INTO public.startup_links (
    startup_id,
    kind,
    label,
    url
)
SELECT 
    s.id,
    'website',
    'Product Website',
    'https://budgetbot.ai'
FROM public.startups s
WHERE s.name = 'BudgetBot'
ON CONFLICT DO NOTHING;

INSERT INTO public.startup_links (
    startup_id,
    kind,
    label,
    url
)
SELECT 
    s.id,
    'demo',
    'Try BudgetBot',
    'https://app.budgetbot.ai/signup'
FROM public.startups s
WHERE s.name = 'BudgetBot'
ON CONFLICT DO NOTHING;

INSERT INTO public.startup_links (
    startup_id,
    kind,
    label,
    url
)
SELECT 
    s.id,
    'x',
    'Twitter/X',
    'https://x.com/budgetbot'
FROM public.startups s
WHERE s.name = 'BudgetBot'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- NOTES FOR PRODUCTION USE
-- ============================================================================
-- 
-- 1. USER ASSIGNMENT:
--    The seed data uses (SELECT id FROM auth.users LIMIT 1) to assign startups
--    to existing users. In production, you should:
--    - Create test users first via auth.signup() in your application
--    - Or replace with specific user UUIDs
--    - Or use a dedicated test user account
--
-- 2. ON CONFLICT HANDLING:
--    startups table uses ON CONFLICT (id) but id is UUID (random)
--    Consider adding a unique constraint on (user_id, name) if you want
--    to prevent duplicate startups per user, then use ON CONFLICT (user_id, name)
--
-- 3. CASCADE DELETES:
--    All child tables (founders, competitors, metrics, links) cascade delete
--    when parent startups record is deleted, so no cleanup needed
--
-- 4. METRICS SNAPSHOTS:
--    These are historical data points for dashboard charts
--    In production, you'd insert these via scheduled jobs or user actions
--
-- 5. JSONB FIELDS:
--    The startups table uses JSONB fields (traction_data, team_data, needs_data)
--    for flexible schema. The seed file populates these with structured data.
--    Related tables (founders, competitors, metrics, links) provide normalized
--    alternatives for querying and relationships.
--
-- 6. TESTING:
--    After running this seed:
--    - Verify startups are visible to their owners only (RLS)
--    - Test CRUD operations on founders, competitors, metrics, links
--    - Verify cascade deletes work correctly


