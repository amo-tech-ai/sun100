-- Seed data for startup related tables
-- Purpose: Populate startup_founders, startup_competitors, startup_metrics_snapshots, and startup_links with sample data
-- Generated: 2025-01-23
-- 
-- This seed file inserts sample data into the related tables for existing startups.
-- Uses INSERT statements with ON CONFLICT DO NOTHING to prevent duplicates.

-- ============================================================================
-- STARTUP FOUNDERS - Sample Team Members
-- ============================================================================

-- Founders for FashionOS (or first startup found)
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
    'Former fashion event producer with 10+ years experience. Built events for 50+ brands including Gucci and Prada. Previously at Condé Nast.'
FROM public.startups s
WHERE s.name = 'FashionOS' OR s.id = (SELECT id FROM public.startups LIMIT 1)
LIMIT 1
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
    'Ex-Google AI engineer. Built ML systems processing 1B+ fashion images. Y Combinator S23. Previously led ML team at Pinterest.'
FROM public.startups s
WHERE s.name = 'FashionOS' OR s.id = (SELECT id FROM public.startups LIMIT 1)
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.startup_founders (
    startup_id,
    full_name,
    role,
    bio
)
SELECT 
    s.id,
    'Samira Patel',
    'Head of Product',
    'Former product lead at Airbnb Experiences. 8+ years building marketplace products. Expert in two-sided marketplaces and user experience design.'
FROM public.startups s
WHERE s.name = 'FashionOS' OR s.id = (SELECT id FROM public.startups LIMIT 1)
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================================================
-- STARTUP COMPETITORS - Sample Competitor Analysis
-- ============================================================================

-- Competitors for FashionOS (or first startup found)
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
    'General event platform, not fashion-specific. Lacks runway show templates and fashion industry features. Weak on venue curation for fashion events.'
FROM public.startups s
WHERE s.name = 'FashionOS' OR s.id = (SELECT id FROM public.startups LIMIT 1)
LIMIT 1
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
    'Venue marketplace but not fashion-focused. No AI matching or fashion event workflows. Limited to US markets only.'
FROM public.startups s
WHERE s.name = 'FashionOS' OR s.id = (SELECT id FROM public.startups LIMIT 1)
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.startup_competitors (
    startup_id,
    name,
    website_url,
    notes
)
SELECT 
    s.id,
    'Splash',
    'https://splashthat.com',
    'Event marketing platform but lacks venue discovery. Focuses on event pages and ticketing, not venue booking. No fashion industry specialization.'
FROM public.startups s
WHERE s.name = 'FashionOS' OR s.id = (SELECT id FROM public.startups LIMIT 1)
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================================================
-- STARTUP METRICS SNAPSHOTS - Historical Growth Data
-- ============================================================================

-- Historical metrics for FashionOS (or first startup found)
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
WHERE s.name = 'FashionOS' OR s.id = (SELECT id FROM public.startups LIMIT 1)
LIMIT 1
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
WHERE s.name = 'FashionOS' OR s.id = (SELECT id FROM public.startups LIMIT 1)
LIMIT 1
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
WHERE s.name = 'FashionOS' OR s.id = (SELECT id FROM public.startups LIMIT 1)
LIMIT 1
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
    CURRENT_DATE,
    200,
    18000.00,
    30.0
FROM public.startups s
WHERE s.name = 'FashionOS' OR s.id = (SELECT id FROM public.startups LIMIT 1)
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================================================
-- STARTUP LINKS - External Resources & Assets
-- ============================================================================

-- Links for FashionOS (or first startup found)
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
WHERE s.name = 'FashionOS' OR s.id = (SELECT id FROM public.startups LIMIT 1)
LIMIT 1
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
WHERE s.name = 'FashionOS' OR s.id = (SELECT id FROM public.startups LIMIT 1)
LIMIT 1
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
    'LinkedIn Company Page',
    'https://linkedin.com/company/fashionos'
FROM public.startups s
WHERE s.name = 'FashionOS' OR s.id = (SELECT id FROM public.startups LIMIT 1)
LIMIT 1
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
WHERE s.name = 'FashionOS' OR s.id = (SELECT id FROM public.startups LIMIT 1)
LIMIT 1
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
    'API Documentation',
    'https://docs.fashionos.ai'
FROM public.startups s
WHERE s.name = 'FashionOS' OR s.id = (SELECT id FROM public.startups LIMIT 1)
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.startup_links (
    startup_id,
    kind,
    label,
    url
)
SELECT 
    s.id,
    'website',
    'Company Website',
    'https://fashionos.ai'
FROM public.startups s
WHERE s.name = 'FashionOS' OR s.id = (SELECT id FROM public.startups LIMIT 1)
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================================================
-- ADDITIONAL STARTUP EXAMPLE - SaaS Platform
-- ============================================================================

-- Founders for second startup (if exists)
INSERT INTO public.startup_founders (
    startup_id,
    full_name,
    role,
    bio
)
SELECT 
    s.id,
    'Taylor Kim',
    'Founder & CEO',
    'Serial entrepreneur. Previously founded and exited two SaaS companies. Expert in B2B product development and go-to-market strategy.'
FROM public.startups s
WHERE s.id != (SELECT id FROM public.startups LIMIT 1)
LIMIT 1
ON CONFLICT DO NOTHING;

-- Competitors for second startup (if exists)
INSERT INTO public.startup_competitors (
    startup_id,
    name,
    website_url,
    notes
)
SELECT 
    s.id,
    'Competitor A',
    'https://competitor-a.com',
    'Market leader but lacks modern UX. Slower to innovate. Higher pricing.'
FROM public.startups s
WHERE s.id != (SELECT id FROM public.startups LIMIT 1)
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.startup_competitors (
    startup_id,
    name,
    website_url,
    notes
)
SELECT 
    s.id,
    'Competitor B',
    'https://competitor-b.com',
    'Newer player with strong funding. Good product but limited market presence. Aggressive pricing.'
FROM public.startups s
WHERE s.id != (SELECT id FROM public.startups LIMIT 1)
LIMIT 1
ON CONFLICT DO NOTHING;

