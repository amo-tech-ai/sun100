-- Seed data for investors table (Additional Canadian Accelerators)
-- Purpose: Populate VC and startup accelerator directory with Canadian AI accelerators
-- Generated: 2025-01-23
-- Source: Canadian AI Startup Accelerators research
--
-- This seed file can be executed independently or combined with seed.sql
-- Note: This file uses INSERT statements with ON CONFLICT to prevent duplicates
-- if seed is run multiple times. The slug field is unique, so conflicts are handled gracefully.

-- NEXT AI
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'NEXT AI',
    'accelerator',
    'next-ai',
    'https://www.nextcanada.com/next-ai/',
    'AI/ML-first startup accelerator. Equity-free program. Good for technical founders wanting AI-native accelerator without equity dilution.',
    ARRAY['idea', 'pre-seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['Applied AI', 'ML/Data Products', 'AI-first'],
    ARRAY['Canada', 'Toronto', 'Montreal', 'Remote-friendly'],
    ARRAY['AI-student/mentor network', 'Workshops & founder training', 'Office-space (Toronto/Montreal)'],
    'Cohort batches; check website for 2026 call',
    ARRAY[]::text[],
    'https://www.nextcanada.com/next-ai/',
    'Equity-free (program doesn''t take ownership). In-kind support (mentorship, resources) — no public cash amount. ≈ 6 months.',
    '{}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    website_url = EXCLUDED.website_url,
    description = EXCLUDED.description,
    stages = EXCLUDED.stages,
    min_check_size = EXCLUDED.min_check_size,
    max_check_size = EXCLUDED.max_check_size,
    equity_percent_min = EXCLUDED.equity_percent_min,
    equity_percent_max = EXCLUDED.equity_percent_max,
    specialties = EXCLUDED.specialties,
    geographies = EXCLUDED.geographies,
    benefits = EXCLUDED.benefits,
    time_to_decision = EXCLUDED.time_to_decision,
    notable_investments = EXCLUDED.notable_investments,
    application_link = EXCLUDED.application_link,
    terms_summary = EXCLUDED.terms_summary,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Creative Destruction Lab (CDL)
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'Creative Destruction Lab (CDL)',
    'accelerator',
    'creative-destruction-lab',
    'https://creativedestructionlab.com/',
    'Deep-tech & science-based seed-stage accelerator (AI/ML, quantum, biotech, deep-tech). Best for deep-tech founders aiming for high-impact research→product ventures. No direct cash from program — but strong access to investors & funding networks.',
    ARRAY['pre-seed', 'seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['AI/ML', 'Deep-tech', 'Biotech + AI', 'Quantum', 'Advanced Computing'],
    ARRAY['Canada', 'Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Global outreach'],
    ARRAY['Milestone-based acceleration', 'Mentorship from scientists/entrepreneurs', 'Investor network access'],
    'Annual cycles — check site 2026 schedule',
    ARRAY[]::text[],
    'https://creativedestructionlab.com/',
    'Program is non-dilutive (equity deals negotiated externally). ≈ 9 months per stream.',
    '{}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    website_url = EXCLUDED.website_url,
    description = EXCLUDED.description,
    stages = EXCLUDED.stages,
    min_check_size = EXCLUDED.min_check_size,
    max_check_size = EXCLUDED.max_check_size,
    equity_percent_min = EXCLUDED.equity_percent_min,
    equity_percent_max = EXCLUDED.equity_percent_max,
    specialties = EXCLUDED.specialties,
    geographies = EXCLUDED.geographies,
    benefits = EXCLUDED.benefits,
    time_to_decision = EXCLUDED.time_to_decision,
    notable_investments = EXCLUDED.notable_investments,
    application_link = EXCLUDED.application_link,
    terms_summary = EXCLUDED.terms_summary,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- ventureLAB Accelerate AI
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'ventureLAB Accelerate AI',
    'accelerator',
    'venturelab-accelerate-ai',
    'https://www.venturelab.ca/aai',
    'Industrial/hardware-AI, ML infra, applied AI + industrialtech accelerator. Good for AI hardware or industrial-AI startups needing compute + commercialization guidance. Compute-lab access, infrastructure & in-kind support; cash funding not clearly disclosed.',
    ARRAY['seed', 'series-a'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['Industrial AI', 'Hardware + AI', 'ML Infrastructure', 'Applied AI Solutions'],
    ARRAY['Canada', 'Ontario', 'Markham', 'York Region', 'Remote-eligible for Canadian-incorporated startups'],
    ARRAY['AI compute lab & prototyping', 'Mentorship & advisors', 'IP & commercialization support', 'Fundraising readiness support'],
    'Rolling / not fixed publicly',
    ARRAY[]::text[],
    'https://www.venturelab.ca/aai',
    '6-month program track. MVP → early-revenue / growth-ready startups.',
    '{}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    website_url = EXCLUDED.website_url,
    description = EXCLUDED.description,
    stages = EXCLUDED.stages,
    min_check_size = EXCLUDED.min_check_size,
    max_check_size = EXCLUDED.max_check_size,
    equity_percent_min = EXCLUDED.equity_percent_min,
    equity_percent_max = EXCLUDED.equity_percent_max,
    specialties = EXCLUDED.specialties,
    geographies = EXCLUDED.geographies,
    benefits = EXCLUDED.benefits,
    time_to_decision = EXCLUDED.time_to_decision,
    notable_investments = EXCLUDED.notable_investments,
    application_link = EXCLUDED.application_link,
    terms_summary = EXCLUDED.terms_summary,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- DMZ (Toronto Metropolitan University)
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'DMZ (Toronto Metropolitan University)',
    'accelerator',
    'dmz-toronto-metropolitan-university',
    'https://dmz.torontomu.ca/',
    'Early-stage tech/SaaS/software startup incubator (general-tech; could host AI startups). Top-ranked Canadian incubator; good general support but AI-specialized resources may vary. No fixed grant; incubator offers support and resource credits (some program tracks 2.5% equity).',
    ARRAY['pre-seed', 'seed'],
    NULL,
    NULL,
    2.5,
    2.5,
    ARRAY['SaaS', 'Software', 'Tech-enabled Products', 'Possible AI-software'],
    ARRAY['Toronto', 'Ontario', 'Canada'],
    ARRAY['Mentorship & expert support', 'Workspace & startup community', 'Investor-matching & fundraising help', 'Tech-partner credits & services'],
    'Two cohorts per year — check site for 2026 intake',
    ARRAY[]::text[],
    'https://dmz.torontomu.ca/',
    '2.5% common shares for incubator track participants. Up to 18 months incubator track (or shorter pre-incubator).',
    '{}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    website_url = EXCLUDED.website_url,
    description = EXCLUDED.description,
    stages = EXCLUDED.stages,
    min_check_size = EXCLUDED.min_check_size,
    max_check_size = EXCLUDED.max_check_size,
    equity_percent_min = EXCLUDED.equity_percent_min,
    equity_percent_max = EXCLUDED.equity_percent_max,
    specialties = EXCLUDED.specialties,
    geographies = EXCLUDED.geographies,
    benefits = EXCLUDED.benefits,
    time_to_decision = EXCLUDED.time_to_decision,
    notable_investments = EXCLUDED.notable_investments,
    application_link = EXCLUDED.application_link,
    terms_summary = EXCLUDED.terms_summary,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- MaRS Discovery District
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'MaRS Discovery District',
    'accelerator',
    'mars-discovery-district',
    'https://www.marsdd.com/',
    'Innovation hub/incubator — supports tech, health-tech, cleantech, enterprise-software startups. Strong hub for tech startups seeking connections, grants or public funding — potential for AI/data startups.',
    ARRAY['pre-seed', 'seed', 'series-a'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['Enterprise-software', 'Health-tech', 'Clean-tech', 'Tech Products', 'Data/AI'],
    ARRAY['Toronto', 'Ontario', 'Canada'],
    ARRAY['Business advisory & mentorship', 'Access to investor and grant networks', 'Large urban startup ecosystem & resources'],
    'Check website for application dates',
    ARRAY[]::text[],
    'https://www.marsdd.com/',
    'Pre-seed → early-growth stage support.',
    '{}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    website_url = EXCLUDED.website_url,
    description = EXCLUDED.description,
    stages = EXCLUDED.stages,
    min_check_size = EXCLUDED.min_check_size,
    max_check_size = EXCLUDED.max_check_size,
    equity_percent_min = EXCLUDED.equity_percent_min,
    equity_percent_max = EXCLUDED.equity_percent_max,
    specialties = EXCLUDED.specialties,
    geographies = EXCLUDED.geographies,
    benefits = EXCLUDED.benefits,
    time_to_decision = EXCLUDED.time_to_decision,
    notable_investments = EXCLUDED.notable_investments,
    application_link = EXCLUDED.application_link,
    terms_summary = EXCLUDED.terms_summary,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Innovation Factory
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'Innovation Factory',
    'accelerator',
    'innovation-factory',
    'https://www.innovationfactory.ca/',
    'Early-stage tech & hardware/software startup accelerator, regional support (Hamilton/Ontario). Good for regional startups outside major hubs; may support hardware/embedded-AI or software startups.',
    ARRAY['pre-seed', 'seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['Tech/Software', 'Hardware-enabled', 'Hardware + Software'],
    ARRAY['Hamilton', 'Ontario', 'Canada'],
    ARRAY['Mentorship & local community support', 'Business support services & networking', 'Regional startup ecosystem access'],
    'Check website for application dates',
    ARRAY[]::text[],
    'https://www.innovationfactory.ca/',
    'Pre-seed/early-stage support.',
    '{}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    website_url = EXCLUDED.website_url,
    description = EXCLUDED.description,
    stages = EXCLUDED.stages,
    min_check_size = EXCLUDED.min_check_size,
    max_check_size = EXCLUDED.max_check_size,
    equity_percent_min = EXCLUDED.equity_percent_min,
    equity_percent_max = EXCLUDED.equity_percent_max,
    specialties = EXCLUDED.specialties,
    geographies = EXCLUDED.geographies,
    benefits = EXCLUDED.benefits,
    time_to_decision = EXCLUDED.time_to_decision,
    notable_investments = EXCLUDED.notable_investments,
    application_link = EXCLUDED.application_link,
    terms_summary = EXCLUDED.terms_summary,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- North Forge Technology Exchange (Fabrication Lab)
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'North Forge Technology Exchange (Fabrication Lab)',
    'accelerator',
    'north-forge-technology-exchange',
    'http://www.northforge.ca/',
    'Hardware/embedded/prototyping/deep-tech support — suitable for robotics or hardware-AI startups. Largest public-access fabrication lab in Canada — valuable for hardware + AI startups.',
    ARRAY['idea', 'pre-seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['Hardware + Software', 'Embedded AI/Robotics', 'Deep-tech/Prototyping'],
    ARRAY['Winnipeg', 'Manitoba', 'Canada'],
    ARRAY['Access to fabrication lab, 3D printers, CNC, electronics prototyping', 'Support to hardware + software ventures', 'Community and startup resources'],
    'Check website for application dates',
    ARRAY[]::text[],
    'http://www.northforge.ca/',
    'Concept → early-stage for hardware or deep-tech founders.',
    '{}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    website_url = EXCLUDED.website_url,
    description = EXCLUDED.description,
    stages = EXCLUDED.stages,
    min_check_size = EXCLUDED.min_check_size,
    max_check_size = EXCLUDED.max_check_size,
    equity_percent_min = EXCLUDED.equity_percent_min,
    equity_percent_max = EXCLUDED.equity_percent_max,
    specialties = EXCLUDED.specialties,
    geographies = EXCLUDED.geographies,
    benefits = EXCLUDED.benefits,
    time_to_decision = EXCLUDED.time_to_decision,
    notable_investments = EXCLUDED.notable_investments,
    application_link = EXCLUDED.application_link,
    terms_summary = EXCLUDED.terms_summary,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- OneEleven
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'OneEleven',
    'accelerator',
    'oneeleven',
    'https://oneeleven.com/',
    'Growth-oriented tech startup accelerator (post-seed/scaling phase). Option for scaling startups — can suit AI-powered SaaS or platform companies.',
    ARRAY['seed', 'series-a', 'growth'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['SaaS', 'Enterprise Software', 'Tech Platforms'],
    ARRAY['Toronto', 'Greater-Toronto Area', 'Canada'],
    ARRAY['Growth support', 'Corporate partnerships', 'Mentorship and network'],
    'Check website for application dates',
    ARRAY[]::text[],
    'https://oneeleven.com/',
    'Post-seed/early growth stage support.',
    '{}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    website_url = EXCLUDED.website_url,
    description = EXCLUDED.description,
    stages = EXCLUDED.stages,
    min_check_size = EXCLUDED.min_check_size,
    max_check_size = EXCLUDED.max_check_size,
    equity_percent_min = EXCLUDED.equity_percent_min,
    equity_percent_max = EXCLUDED.equity_percent_max,
    specialties = EXCLUDED.specialties,
    geographies = EXCLUDED.geographies,
    benefits = EXCLUDED.benefits,
    time_to_decision = EXCLUDED.time_to_decision,
    notable_investments = EXCLUDED.notable_investments,
    application_link = EXCLUDED.application_link,
    terms_summary = EXCLUDED.terms_summary,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Communitech Hub
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'Communitech Hub',
    'accelerator',
    'communitech-hub',
    'https://www.communitech.ca/',
    'Tech startup hub & support network (Kitchener–Waterloo/Ontario). One of Canada''s most active tech ecosystems — useful for AI/data startups needing community + growth support.',
    ARRAY['pre-seed', 'seed', 'series-a', 'growth'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['Software/SaaS', 'Tech Products', 'Potential AI/Data Startups'],
    ARRAY['Waterloo', 'Kitchener', 'Ontario', 'Canada'],
    ARRAY['Mentorship & coaching', 'Coworking space & community', 'Access to corporate & investor networks', 'Support services (legal, grants, go-to-market)'],
    'Check website for application dates',
    ARRAY[]::text[],
    'https://www.communitech.ca/',
    'Pre-seed → growth stage support.',
    '{}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    website_url = EXCLUDED.website_url,
    description = EXCLUDED.description,
    stages = EXCLUDED.stages,
    min_check_size = EXCLUDED.min_check_size,
    max_check_size = EXCLUDED.max_check_size,
    equity_percent_min = EXCLUDED.equity_percent_min,
    equity_percent_max = EXCLUDED.equity_percent_max,
    specialties = EXCLUDED.specialties,
    geographies = EXCLUDED.geographies,
    benefits = EXCLUDED.benefits,
    time_to_decision = EXCLUDED.time_to_decision,
    notable_investments = EXCLUDED.notable_investments,
    application_link = EXCLUDED.application_link,
    terms_summary = EXCLUDED.terms_summary,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Launch Academy
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'Launch Academy',
    'accelerator',
    'launch-academy',
    'https://www.launchacademy.ca/',
    'Tech startup accelerator (general-tech, software) in Western Canada/Vancouver region. Good for West-coast startups seeking local support; may suit AI-enabled software tools.',
    ARRAY['pre-seed', 'seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['SaaS', 'Software', 'Tech Tools/Platforms'],
    ARRAY['Vancouver', 'British Columbia', 'Canada'],
    ARRAY['Mentorship & founder support', 'Networking & community', 'Resources to scale tech startups'],
    'Check website for application dates',
    ARRAY[]::text[],
    'https://www.launchacademy.ca/',
    'Pre-seed → seed stage support.',
    '{}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    website_url = EXCLUDED.website_url,
    description = EXCLUDED.description,
    stages = EXCLUDED.stages,
    min_check_size = EXCLUDED.min_check_size,
    max_check_size = EXCLUDED.max_check_size,
    equity_percent_min = EXCLUDED.equity_percent_min,
    equity_percent_max = EXCLUDED.equity_percent_max,
    specialties = EXCLUDED.specialties,
    geographies = EXCLUDED.geographies,
    benefits = EXCLUDED.benefits,
    time_to_decision = EXCLUDED.time_to_decision,
    notable_investments = EXCLUDED.notable_investments,
    application_link = EXCLUDED.application_link,
    terms_summary = EXCLUDED.terms_summary,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Innovacorp
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'Innovacorp',
    'accelerator',
    'innovacorp',
    'https://innovacorp.ca/',
    'Nova Scotia/Atlantic Canada incubator & early-stage startup support (tech, biotech, cleantech, software). Regional option for startups outside central hubs — good for cost-efficient early-stage ventures.',
    ARRAY['pre-seed', 'seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['Tech/Software', 'Clean-tech/Biotech/Data'],
    ARRAY['Nova Scotia', 'Atlantic Canada', 'Canada'],
    ARRAY['Early-stage funding access & grants', 'Incubation and business support', 'Access to regional ecosystem & networks'],
    'Check website for application dates',
    ARRAY[]::text[],
    'https://innovacorp.ca/',
    'Pre-seed → seed stage support.',
    '{}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    website_url = EXCLUDED.website_url,
    description = EXCLUDED.description,
    stages = EXCLUDED.stages,
    min_check_size = EXCLUDED.min_check_size,
    max_check_size = EXCLUDED.max_check_size,
    equity_percent_min = EXCLUDED.equity_percent_min,
    equity_percent_max = EXCLUDED.equity_percent_max,
    specialties = EXCLUDED.specialties,
    geographies = EXCLUDED.geographies,
    benefits = EXCLUDED.benefits,
    time_to_decision = EXCLUDED.time_to_decision,
    notable_investments = EXCLUDED.notable_investments,
    application_link = EXCLUDED.application_link,
    terms_summary = EXCLUDED.terms_summary,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- WEtech Alliance
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'WEtech Alliance',
    'accelerator',
    'wetech-alliance',
    'https://www.wetech-alliance.com',
    'Regional innovation centre & accelerator for tech companies in Windsor-Essex/Chatham–Kent (Ontario). Good for startups in Ontario outside major metro hubs.',
    ARRAY['pre-seed', 'seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['Software/SaaS', 'Tech Tools'],
    ARRAY['Windsor-Essex', 'Chatham-Kent Region', 'Ontario', 'Canada'],
    ARRAY['Business advisory & startup coaching', 'Regional tech community & network', 'Support for early tech ventures'],
    'Check website for application dates',
    ARRAY[]::text[],
    'https://www.wetech-alliance.com',
    'Pre-seed/early-stage support.',
    '{}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    website_url = EXCLUDED.website_url,
    description = EXCLUDED.description,
    stages = EXCLUDED.stages,
    min_check_size = EXCLUDED.min_check_size,
    max_check_size = EXCLUDED.max_check_size,
    equity_percent_min = EXCLUDED.equity_percent_min,
    equity_percent_max = EXCLUDED.equity_percent_max,
    specialties = EXCLUDED.specialties,
    geographies = EXCLUDED.geographies,
    benefits = EXCLUDED.benefits,
    time_to_decision = EXCLUDED.time_to_decision,
    notable_investments = EXCLUDED.notable_investments,
    application_link = EXCLUDED.application_link,
    terms_summary = EXCLUDED.terms_summary,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- York Entrepreneurship Development Institute (YEDI)
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'York Entrepreneurship Development Institute (YEDI)',
    'accelerator',
    'york-entrepreneurship-development-institute',
    'https://yedi.ca',
    'University-backed accelerator/incubator supporting early-stage startups (varied sectors). Often overlooked — potential entry point for early founders.',
    ARRAY['pre-seed', 'seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['Tech/Software', 'General Startups'],
    ARRAY['Toronto', 'Ontario', 'Canada'],
    ARRAY['Mentorship & entrepreneurial support', 'Access to university network and resources', 'Business formation guidance'],
    'Check website for application dates',
    ARRAY[]::text[],
    'https://yedi.ca',
    'Pre-seed/early-stage support.',
    '{}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    website_url = EXCLUDED.website_url,
    description = EXCLUDED.description,
    stages = EXCLUDED.stages,
    min_check_size = EXCLUDED.min_check_size,
    max_check_size = EXCLUDED.max_check_size,
    equity_percent_min = EXCLUDED.equity_percent_min,
    equity_percent_max = EXCLUDED.equity_percent_max,
    specialties = EXCLUDED.specialties,
    geographies = EXCLUDED.geographies,
    benefits = EXCLUDED.benefits,
    time_to_decision = EXCLUDED.time_to_decision,
    notable_investments = EXCLUDED.notable_investments,
    application_link = EXCLUDED.application_link,
    terms_summary = EXCLUDED.terms_summary,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Toronto Business Development Centre (TBDC)
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'Toronto Business Development Centre (TBDC)',
    'accelerator',
    'toronto-business-development-centre',
    'http://www.tbdc.com',
    'Business incubator for new/emerging businesses (broad sector), support in formation and early-stage development. Potential fallback/incubation option for new ventures — not AI-specialized.',
    ARRAY['idea', 'pre-seed', 'seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['General Business', 'Tech/Software'],
    ARRAY['Toronto', 'Ontario', 'Canada'],
    ARRAY['Business seminars & training', 'Networking and mentorship', 'Support to early-stage companies and entrepreneurs'],
    'Check website for application dates',
    ARRAY[]::text[],
    'http://www.tbdc.com',
    'Pre-seed/idea/early-stage support.',
    '{}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    website_url = EXCLUDED.website_url,
    description = EXCLUDED.description,
    stages = EXCLUDED.stages,
    min_check_size = EXCLUDED.min_check_size,
    max_check_size = EXCLUDED.max_check_size,
    equity_percent_min = EXCLUDED.equity_percent_min,
    equity_percent_max = EXCLUDED.equity_percent_max,
    specialties = EXCLUDED.specialties,
    geographies = EXCLUDED.geographies,
    benefits = EXCLUDED.benefits,
    time_to_decision = EXCLUDED.time_to_decision,
    notable_investments = EXCLUDED.notable_investments,
    application_link = EXCLUDED.application_link,
    terms_summary = EXCLUDED.terms_summary,
    social_links = EXCLUDED.social_links,
    updated_at = now();
