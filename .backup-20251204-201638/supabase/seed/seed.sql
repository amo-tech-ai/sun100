-- Seed data for investors table
-- Purpose: Populate VC and startup accelerator directory with sample data
-- Generated: 2025-01-23
-- Source: Top 20 AI Startup Accelerators research
--
-- This seed file is automatically executed when running:
--   supabase db reset
--   supabase db seed
--
-- Note: This file uses INSERT statements with ON CONFLICT to prevent duplicates
-- if seed is run multiple times. The slug field is unique, so conflicts are handled gracefully.

-- Clear existing seed data (optional - comment out if you want to preserve existing data)
-- TRUNCATE TABLE public.investors CASCADE;

-- Top 10 AI Startup Accelerators (1-10)

-- Y Combinator
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'Y Combinator',
    'accelerator',
    'y-combinator',
    'https://www.ycombinator.com',
    'Broad tech accelerator including AI/ML. Strong AI batch history with 75% AI in recent cohorts. Notable alumni include OpenAI. Rolling early decisions.',
    ARRAY['pre-seed', 'seed'],
    500000,
    500000,
    7,
    7,
    ARRAY['AI/ML', 'Infrastructure', 'Applications'],
    ARRAY['San Francisco'],
    ARRAY['Dedicated partner mentorship', 'Investor intros', 'Demo Day', 'Alumni network'],
    'Winter 2026 opens now, deadline Nov 10, 2025 (8pm PT)',
    ARRAY['OpenAI'],
    'https://www.ycombinator.com/apply',
    '$500K for ~7% equity. Program duration: 3 months (Jan-Mar 2026).',
    '{"twitter": "https://x.com/ycombinator", "linkedin": "https://www.linkedin.com/school/ycombinator/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- NEO Accelerator
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'NEO Accelerator',
    'accelerator',
    'neo-accelerator',
    'https://neo.com',
    'AI/deep tech accelerator for technical founders. Delaware C-Corp required. Offers follow-on funding. Alumni: Pika, Cognition.',
    ARRAY['pre-seed', 'seed'],
    600000,
    600000,
    NULL,
    NULL,
    ARRAY['AI', 'Deep Tech'],
    ARRAY['Global', 'Remote-friendly'],
    ARRAY['1:1 mentorship (OpenAI/Microsoft)', '$350K+ OpenAI/Azure credits', 'Hiring support', 'Demo Day'],
    '2025 cohort open (seasonal windows, check site)',
    ARRAY['Pika', 'Cognition'],
    'https://neo.com/apply',
    '$600K uncapped SAFE ($10M floor). 3 months program. Global, remote-friendly with retreats.',
    '{"twitter": "https://x.com/neo", "substack": "https://neo.substack.com"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- AI2 Incubator
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'AI2 Incubator',
    'accelerator',
    'ai2-incubator',
    'https://www.ai2incubator.com',
    'Applied AI/deep tech incubator. ~15 teams/year. Technical/domain founders. No relocation required.',
    ARRAY['pre-seed', 'seed'],
    600000,
    600000,
    NULL,
    NULL,
    ARRAY['Applied AI', 'Deep Tech', 'Climate', 'Healthcare', 'Fintech'],
    ARRAY['Seattle', 'Remote', 'AI House'],
    ARRAY['Technical support', 'Research access', 'Investor network', 'Cloud credits'],
    'Rolling admissions (no fixed Dec 2025-2026 windows)',
    ARRAY[]::text[],
    'https://www.ai2incubator.com/apply',
    'Up to $600K + cloud credits. Flexible/ongoing program duration. Early research-to-product stage.',
    '{"twitter": "https://x.com/AI2Incubator"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Betaworks AI Camp
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'Betaworks AI Camp',
    'accelerator',
    'betaworks-ai-camp',
    'https://www.betaworks.com',
    'AI applications/frontier tech accelerator. Focuses on custom AI architectures. Syndicate partners.',
    ARRAY['seed'],
    500000,
    500000,
    5,
    5,
    ARRAY['AI Applications', 'Frontier Tech', 'SMB Productivity'],
    ARRAY['NYC'],
    ARRAY['In-residence mentorship', 'Investor speed dating', 'NYC workspace', 'Demo Day'],
    'Next cohort late Feb-May 2026 (apply ongoing for 2026)',
    ARRAY[]::text[],
    'https://www.betaworks.com/apply',
    'Up to $500K (uncapped SAFE 25% discount + 5% stock). 13 weeks program. NYC, mostly in-person.',
    '{"twitter": "https://x.com/betaworks"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Boost VC
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'Boost VC',
    'accelerator',
    'boost-vc',
    'https://www.boost.vc',
    'AI, robotics, deep tech accelerator. 300+ backed companies. Alumni include Coinbase.',
    ARRAY['pre-seed'],
    500000,
    500000,
    15,
    15,
    ARRAY['AI', 'Robotics', 'Deep Tech', 'Blockchain', 'VR'],
    ARRAY['San Francisco'],
    ARRAY['Housing/office', 'Mentor network', 'Investor access'],
    'Twice yearly (check for Dec 2025 cohorts)',
    ARRAY['Coinbase'],
    'https://www.boost.vc/apply',
    'Up to $500K for 15% equity. 3 months program. San Francisco.',
    '{"linkedin": "https://www.linkedin.com/company/boost-vc", "twitter": "https://x.com/boostvc"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- a16z Speedrun
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'a16z Speedrun',
    'accelerator',
    'a16z-speedrun',
    'https://speedrun.a16z.com',
    'AI/games/deep tech accelerator. <1% acceptance rate. 120+ backed companies.',
    ARRAY['seed'],
    750000,
    1000000,
    7,
    10,
    ARRAY['AI', 'Games', 'Deep Tech', 'Consumer'],
    ARRAY['San Francisco', 'Los Angeles'],
    ARRAY['Mentorship', 'Investor network'],
    'Cohorts ongoing (2026 next)',
    ARRAY[]::text[],
    'https://speedrun.a16z.com/apply',
    '$750K-$1M for 7-10% equity. Accelerator format (varies). SF/LA.',
    '{"twitter": "https://x.com/speedrun", "substack": "https://speedrun.substack.com"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- OpenAI Converge
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'OpenAI Converge',
    'accelerator',
    'openai-converge',
    'https://www.openai.fund/converge',
    'Frontier AI models accelerator. Travel covered. Community focus. Early model access.',
    ARRAY['seed'],
    1000000,
    1000000,
    NULL,
    NULL,
    ARRAY['Frontier AI Models', 'Cutting-edge AI'],
    ARRAY['Remote', 'San Francisco'],
    ARRAY['Early model access', 'Workshops', 'OpenAI office hours', 'Travel covered'],
    'Check for 2026 openings',
    ARRAY[]::text[],
    'https://www.openai.fund/converge/apply',
    '$1M equity. ~6 hours/week. Remote + final SF week. Community focus.',
    '{"twitter": "https://x.com/OpenAI"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Google for Startups AI First
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'Google for Startups AI First',
    'accelerator',
    'google-ai-first',
    'https://startup.google.com/programs/accelerator/ai-first/',
    'AI/ML applications accelerator. 20 startups/cohort. India/global focus. Equity-free.',
    ARRAY['seed', 'series-a'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['AI/ML', 'Agentic AI', 'Multimodal AI'],
    ARRAY['Global', 'Hybrid'],
    ARRAY['Google mentorship', 'Bootcamps', 'Gemini access', '$350K Google Cloud credits'],
    'Cohorts yearly (2026 expected)',
    ARRAY[]::text[],
    'https://startup.google.com/programs/accelerator/ai-first/apply',
    '$350K Google Cloud credits (equity-free). Varies by cohort. Global/hybrid.',
    '{"twitter": "https://x.com/GoogleStartups"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Techstars AI Programs
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'Techstars AI Programs',
    'accelerator',
    'techstars-ai',
    'https://www.techstars.com',
    'AI across sectors accelerator. Strong network. Global programs.',
    ARRAY['seed'],
    220000,
    220000,
    5,
    7,
    ARRAY['AI', 'SaaS'],
    ARRAY['Global'],
    ARRAY['Mentorship', 'Investor Demo Day'],
    'Rolling/seasonal for 2026',
    ARRAY[]::text[],
    'https://www.techstars.com/apply',
    '$220K for 5-7% equity. 3 months program. Global programs.',
    '{"twitter": "https://x.com/techstars", "linkedin": "https://www.linkedin.com/company/techstars"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- AI Grant
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'AI Grant',
    'accelerator',
    'ai-grant',
    'https://aigrant.com',
    'AI tooling/infrastructure grant program. Equity-free focus. Community-driven.',
    ARRAY['pre-seed'],
    250000,
    250000,
    NULL,
    NULL,
    ARRAY['Generative AI', 'AI Tooling', 'Infrastructure'],
    ARRAY['Global', 'Remote'],
    ARRAY['Compute credits', 'Community'],
    'Ongoing/rolling',
    ARRAY[]::text[],
    'https://aigrant.com/apply',
    '$250K uncapped. Equity-free focus. Flexible program duration. Global/remote.',
    '{"twitter": "https://x.com/aigrant"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Top 20 AI Startup Accelerators (11-20)

-- NVIDIA Inception
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'NVIDIA Inception',
    'accelerator',
    'nvidia-inception',
    'https://www.nvidia.com/en-us/startups/',
    'AI infrastructure, edge computing, robotics accelerator. Backed Runway ML. No equity taken.',
    ARRAY['seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['AI Infrastructure', 'Edge Computing', 'Robotics', 'Compute-intensive AI'],
    ARRAY['Global', 'Remote'],
    ARRAY['GPU access', 'SDKs', 'Engineering support', 'Co-marketing', 'Hardware discounts'],
    'Rolling admissions (ongoing 2025-2026)',
    ARRAY['Runway ML'],
    'https://www.nvidia.com/en-us/startups/',
    'GPU access, SDKs (equity-free). Ongoing support. Global, remote.',
    '{"twitter": "https://x.com/InceptionNvidia", "linkedin": "https://www.linkedin.com/showcase/nvidia-for-startups/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Microsoft for Startups Founders Hub
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'Microsoft for Startups Founders Hub',
    'accelerator',
    'microsoft-founders-hub',
    'https://portal.startups.microsoft.com/',
    'AI/ML accelerator with Azure tools. Includes GPT-4 access. No equity required.',
    ARRAY['pre-seed', 'seed', 'series-a'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['AI/ML', 'Azure Tools', 'AI-integrated Products'],
    ARRAY['Global', 'Remote'],
    ARRAY['Up to $150K Azure credits', '1,800+ AI models access', 'Expert network', 'GPT-4 access'],
    'Rolling (apply anytime for 2026 benefits)',
    ARRAY[]::text[],
    'https://portal.startups.microsoft.com/',
    'Up to $150K Azure credits (equity-free). Flexible/ongoing program. Global/remote.',
    '{"twitter": "https://x.com/msft4startups", "linkedin": "https://www.linkedin.com/company/microsoftforstartups/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Plug and Play – Enterprise & AI
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'Plug and Play – Enterprise & AI',
    'accelerator',
    'plug-and-play-ai',
    'https://www.plugandplaytechcenter.com/industries/enterprise-and-ai/',
    'AI innovation across sectors accelerator. 40 startups/year. Government and corporate ties.',
    ARRAY['seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['AI Innovation', 'AI Prototypes', 'Enterprise AI'],
    ARRAY['San Jose', 'Global'],
    ARRAY['Corporate intros', 'Workspace', 'Testing ground', 'Low-cost entry'],
    'Open now for 2026 cohorts',
    ARRAY[]::text[],
    'https://www.plugandplaytechcenter.com/industries/enterprise-and-ai/',
    'Low-cost entry, corporate partnerships. Varies by batch. San Jose/global.',
    '{"twitter": "https://x.com/PlugandPlayTC", "linkedin": "https://www.linkedin.com/company/plug-and-play-tech-center/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- ventureLAB – Accelerate AI
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'ventureLAB – Accelerate AI',
    'accelerator',
    'venturelab-accelerate-ai',
    'https://www.venturelab.ca/aai',
    'Applied AI/ML products accelerator. Canadian focus. Ethical AI emphasis.',
    ARRAY['seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['Applied AI/ML', 'Intelligent Value Chain AI'],
    ARRAY['Ontario', 'Canada'],
    ARRAY['Grants for tech/talent', 'Customer acquisition', 'Capital access'],
    'Seasonal windows (check for 2026)',
    ARRAY[]::text[],
    'https://www.venturelab.ca/aai',
    'Grants for tech/talent (amount varies). 6 months program. Ontario, Canada.',
    '{"twitter": "https://x.com/ventureLABca", "linkedin": "https://www.linkedin.com/company/venturelabca/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Alchemist Accelerator
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'Alchemist Accelerator',
    'accelerator',
    'alchemist-accelerator',
    'https://www.alchemistaccelerator.com/',
    'Enterprise AI/SaaS accelerator. VC Demo Day focus. Revenue-generating early-stage companies.',
    ARRAY['seed'],
    36000,
    36000,
    NULL,
    NULL,
    ARRAY['Enterprise AI', 'SaaS', 'B2B AI', 'IoT'],
    ARRAY['Silicon Valley'],
    ARRAY['$36K seed for equity', 'Sales training', 'Enterprise customer network'],
    'Batch applications ongoing',
    ARRAY[]::text[],
    'https://www.alchemistaccelerator.com/',
    '$36K seed for equity. 6 months program. Silicon Valley.',
    '{"twitter": "https://x.com/AlchemistAcc", "linkedin": "https://www.linkedin.com/company/alchemist-accelerator/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- AngelPad
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'AngelPad',
    'accelerator',
    'angelpad',
    'https://angelpad.com/',
    'AI scaling across niches accelerator. High exit rate. Structured mentorship.',
    ARRAY['seed'],
    120000,
    120000,
    NULL,
    NULL,
    ARRAY['AI', 'Tech'],
    ARRAY['USA', 'Remote-friendly'],
    ARRAY['$120K investment', 'Structured mentorship', 'Growth guidance'],
    'Rolling for 2026',
    ARRAY[]::text[],
    'https://angelpad.com/',
    '$120K investment. Varies program duration. USA/remote-friendly.',
    '{"twitter": "https://x.com/angelpad", "linkedin": "https://www.linkedin.com/company/angelpad-llc/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- MassChallenge – AI / Deep Tech (UK & Global)
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'MassChallenge – AI / Deep Tech (UK & Global)',
    'accelerator',
    'masschallenge-ai-deep-tech',
    'https://masschallenge.org/programs-united-kingdom/',
    'AI, robotics, autonomy accelerator. Zero-equity support. €3.6B alumni funding. 40-80 startups per cohort.',
    ARRAY['seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['AI', 'Robotics', 'Autonomy', 'Perceptual AI', 'Data Engineering'],
    ARRAY['UK', 'Global', 'Oxford-Cambridge'],
    ARRAY['Non-dilutive cash prizes', 'Zero-equity support', 'Global network'],
    '2026 cohort opens soon',
    ARRAY[]::text[],
    'https://masschallenge.org/programs-united-kingdom/',
    'Non-dilutive cash prizes. Cohort-based program. UK/global (Oxford-Cambridge).',
    '{"twitter": "https://x.com/MassChallenge", "linkedin": "https://www.linkedin.com/company/masschallenge/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- HighTechXL
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'HighTechXL',
    'accelerator',
    'hightechxl',
    'https://www.hightechxl.com/',
    'Deep tech AI/hardware accelerator. Europe deep tech focus. Intensive program.',
    ARRAY['pre-seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['Deep Tech AI', 'Hardware AI'],
    ARRAY['Eindhoven', 'Netherlands'],
    ARRAY['Venture-building investment', 'Intensive program', 'Team building'],
    'Program calls yearly',
    ARRAY[]::text[],
    'https://www.hightechxl.com/',
    'Venture-building investment. Intensive fixed program. Eindhoven, Netherlands.',
    '{"twitter": "https://x.com/Hightechxl", "linkedin": "https://www.linkedin.com/company/hightechxl/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- SOSV (Deep Tech Programs: HAX, IndieBio, etc.)
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'SOSV (Deep Tech Programs: HAX, IndieBio, etc.)',
    'accelerator',
    'sosv-deep-tech',
    'https://sosv.com/',
    'AI deep tech/biotech accelerator. IndieBio for AI bio. Global labs network.',
    ARRAY['pre-seed', 'seed'],
    100000,
    100000,
    NULL,
    NULL,
    ARRAY['AI Deep Tech', 'Biotech', 'Hardware AI'],
    ARRAY['Global', 'New Jersey', 'Asia'],
    ARRAY['$100K+ for equity', 'Global labs', 'Mentor network'],
    'Rolling/seasonal 2026',
    ARRAY[]::text[],
    'https://sosv.com/',
    '$100K+ for equity. 6 months program. Global (NJ, Asia).',
    '{"twitter": "https://x.com/SOSV", "linkedin": "https://www.linkedin.com/company/sosv/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Google for Startups Accelerator: Europe / EMEA (AI-focused)
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'Google for Startups Accelerator: Europe / EMEA (AI-focused)',
    'accelerator',
    'google-startups-accelerator-europe',
    'https://startup.google.com/programs/accelerator/europe/',
    'ML/AI tech accelerator. Product/leadership focus. Equity-free support.',
    ARRAY['seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['ML/AI', 'AI/ML Apps'],
    ARRAY['Europe', 'Hybrid', 'EMEA'],
    ARRAY['Equity-free support', 'Google mentorship', 'Workshops'],
    '3-month cohorts (2026 openings TBA)',
    ARRAY[]::text[],
    'https://startup.google.com/programs/accelerator/europe/',
    'Equity-free support. 3 months program. Europe/hybrid.',
    '{"twitter": "https://x.com/GoogleStartups", "linkedin": "https://www.linkedin.com/company/google-for-startups/", "youtube": "https://www.youtube.com/googleforstartups"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Additional AI Startup Accelerators (21+)

-- IBM for Startups
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'IBM for Startups',
    'accelerator',
    'ibm-for-startups',
    'https://www.ibm.com/startups',
    'AI, cloud, and enterprise SaaS using IBM Cloud and watsonx. Good fit for B2B AI startups selling into large enterprises.',
    ARRAY['pre-seed', 'seed', 'series-a'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['Applied AI', 'Enterprise SaaS', 'Data & Analytics'],
    ARRAY['Global', 'Remote'],
    ARRAY['Cloud credits', 'Mentorship from IBM experts', 'Access to enterprise customers', 'Technical support'],
    'Rolling online applications; check program site for 2025–2026 cycles',
    ARRAY[]::text[],
    'https://www.ibm.com/startups',
    'Cloud and software credits for IBM Cloud and watsonx; amount varies by startup. Equity-free. Ongoing support; structured programs typically around 8–12 weeks.',
    '{}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- AWS Generative AI Accelerator (GAIA)
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'AWS Generative AI Accelerator (GAIA)',
    'accelerator',
    'aws-generative-ai-accelerator',
    'https://aws.amazon.com/startups/programs/generative-ai',
    'Generative and agentic AI startups worldwide. Highly competitive (<2% acceptance in recent cohorts).',
    ARRAY['seed', 'series-a'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['Foundation Models', 'Generative AI Apps', 'AI Developer Tools', 'Infrastructure Providers'],
    ARRAY['Global', 'Hybrid'],
    ARRAY['Large AWS credit package', 'Mentorship from AWS and partners', 'Go-to-market and co-selling support', 'Investor and enterprise introductions'],
    'Annual global cohorts; 2025 and 2026 application windows announced on AWS site',
    ARRAY[]::text[],
    'https://aws.amazon.com/startups/programs/generative-ai',
    'Up to $1,000,000 in AWS credits per selected startup. Equity-free. 8-week intensive program.',
    '{}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- 500 Global Accelerator
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    '500 Global Accelerator',
    'accelerator',
    '500-global-accelerator',
    'https://500.co',
    'Global tech accelerator with strong AI and fintech portfolio. Useful for AI startups targeting emerging markets and global expansion.',
    ARRAY['pre-seed', 'seed'],
    150000,
    150000,
    5,
    5,
    ARRAY['AI', 'Fintech', 'SaaS'],
    ARRAY['Global', 'US', 'Asia', 'MENA'],
    ARRAY['Seed funding', 'Mentorship and founder education', 'Global investor network', 'Support on growth and distribution'],
    'Multiple regional cohorts in 2025–2026; applications via 500 Global site',
    ARRAY[]::text[],
    'https://500.co',
    'Typically around $150,000 investment. Roughly 5% equity for standard accelerator deal. About 4 months.',
    '{}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Additional Accelerators (Expanded List 24-50+)

-- Berkeley SkyDeck
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'Berkeley SkyDeck',
    'accelerator',
    'berkeley-skydeck',
    'https://skydeck.berkeley.edu',
    'UC Berkeley accelerator blending academia with Silicon Valley connections. Focuses on AI and deep tech startups.',
    ARRAY['pre-seed', 'seed'],
    200000,
    200000,
    5,
    5,
    ARRAY['AI', 'Deep Tech', 'University Spinouts'],
    ARRAY['California', 'USA'],
    ARRAY['$200K investment', 'UC Berkeley resources', 'Silicon Valley connections', 'Mentorship'],
    '6 months program; check website for 2025-2026 cohorts',
    ARRAY[]::text[],
    'https://skydeck.berkeley.edu/apply',
    '$200K for 5% equity. 6 months program. California, USA.',
    '{"twitter": "https://x.com/BerkeleySkyDeck", "linkedin": "https://www.linkedin.com/company/berkeley-skydeck/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Founder Institute
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'Founder Institute',
    'accelerator',
    'founder-institute',
    'https://fi.co',
    'World''s largest pre-seed startup accelerator. Global chapters supporting early-stage founders. Strong track record with AI startups.',
    ARRAY['idea', 'pre-seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['AI', 'Tech', 'Global'],
    ARRAY['Global', 'Worldwide Chapters'],
    ARRAY['Pre-seed support', 'Global network', 'Mentorship', 'Co-founder matching'],
    'Rolling admissions; check local chapter for 2025-2026 cohorts',
    ARRAY[]::text[],
    'https://fi.co/apply',
    'Pre-seed accelerator program. Varies by chapter. Global, worldwide chapters.',
    '{"twitter": "https://x.com/founderinst", "linkedin": "https://www.linkedin.com/company/founder-institute/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Seedcamp
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'Seedcamp',
    'accelerator',
    'seedcamp',
    'https://seedcamp.com',
    'Early-stage VC and accelerator in Europe. Backed 450+ companies including AI startups like UiPath. Strong European network.',
    ARRAY['pre-seed', 'seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['AI', 'Tech', 'SaaS'],
    ARRAY['Europe', 'Global'],
    ARRAY['Early-stage funding', 'European network', 'Mentorship', 'Investor access'],
    'Rolling applications; check website for 2025-2026 cohorts',
    ARRAY['UiPath'],
    'https://seedcamp.com/apply',
    'Early-stage VC and accelerator. Varies by deal. Europe, global reach.',
    '{"twitter": "https://x.com/seedcamp", "linkedin": "https://www.linkedin.com/company/seedcamp/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Startupbootcamp
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'Startupbootcamp',
    'accelerator',
    'startupbootcamp',
    'https://www.startupbootcamp.org',
    'Global accelerator with industry-focused programs. Supports AI startups like AImotive and CloudWalk. Multiple vertical programs.',
    ARRAY['seed'],
    NULL,
    NULL,
    6,
    6,
    ARRAY['AI', 'Tech', 'Industry Vertical'],
    ARRAY['Global', 'Multiple Regions'],
    ARRAY['Industry-focused programs', 'Corporate partnerships', 'Mentorship', 'Demo Day'],
    'Multiple cohorts per year; check website for 2025-2026 programs',
    ARRAY['AImotive', 'CloudWalk'],
    'https://www.startupbootcamp.org/apply',
    'Typically €15K for 6% equity. Varies by program. Global, multiple regions.',
    '{"twitter": "https://x.com/sbootcamp", "linkedin": "https://www.linkedin.com/company/startupbootcamp/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Capital Factory
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'Capital Factory',
    'accelerator',
    'capital-factory',
    'https://www.capitalfactory.com',
    'Texas-based accelerator and venture fund. Supports AI, defense, and healthtech startups. Strong Austin and Texas network.',
    ARRAY['pre-seed', 'seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['AI', 'Defense', 'Healthtech'],
    ARRAY['Texas', 'USA', 'Remote-friendly'],
    ARRAY['Texas network', 'Mentorship', 'Investor access', 'Workspace'],
    'Ongoing programs; check website for 2025-2026 cohorts',
    ARRAY[]::text[],
    'https://www.capitalfactory.com/apply',
    'Varies by program. Ongoing support. Texas, USA, remote-friendly.',
    '{"twitter": "https://x.com/CapitalFactory", "linkedin": "https://www.linkedin.com/company/capital-factory/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- StartX
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'StartX',
    'accelerator',
    'startx',
    'https://startx.com',
    'Stanford-linked accelerator supporting Stanford-affiliated founders. Strong focus on AI and deep tech. Equity-free program.',
    ARRAY['pre-seed', 'seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['AI', 'Deep Tech', 'University Spinouts'],
    ARRAY['California', 'Stanford'],
    ARRAY['Stanford network', 'Equity-free', 'Mentorship', 'Investor access'],
    'Multiple cohorts per year; check website for 2025-2026 programs',
    ARRAY[]::text[],
    'https://startx.com/apply',
    'Equity-free program. Varies by cohort. California, Stanford-linked.',
    '{"twitter": "https://x.com/StartX", "linkedin": "https://www.linkedin.com/company/startx/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Antler
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'Antler',
    'accelerator',
    'antler',
    'https://www.antler.co',
    'Global early-stage VC and accelerator. Helps individuals find co-founders and build companies from scratch. Strong AI portfolio.',
    ARRAY['idea', 'pre-seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['AI', 'Tech', 'Global'],
    ARRAY['Global', 'Multiple Regions'],
    ARRAY['Co-founder matching', 'Pre-seed funding', 'Global network', 'Mentorship'],
    'Multiple cohorts per year; check website for 2025-2026 programs',
    ARRAY[]::text[],
    'https://www.antler.co/apply',
    'Pre-seed funding. Varies by region. Global, multiple regions.',
    '{"twitter": "https://x.com/antlerco", "linkedin": "https://www.linkedin.com/company/antler-co/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
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
    'https://www.creativedestructionlab.com',
    'Deep-tech accelerator with Machine Learning track. Connects startups with business leaders and scientists. Rigorous program.',
    ARRAY['pre-seed', 'seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['AI', 'Machine Learning', 'Deep Tech', 'Science-based'],
    ARRAY['Canada', 'Global'],
    ARRAY['Machine Learning track', 'Business leader connections', 'Scientific mentorship', 'Rigorous program'],
    'Multiple streams; check website for 2025-2026 Machine Learning cohorts',
    ARRAY[]::text[],
    'https://www.creativedestructionlab.com/apply',
    'Deep-tech accelerator. Varies by stream. Canada, global reach.',
    '{"twitter": "https://x.com/CDL_Toronto", "linkedin": "https://www.linkedin.com/company/creative-destruction-lab/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Entrepreneur First
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'Entrepreneur First',
    'accelerator',
    'entrepreneur-first',
    'https://www.joinef.com',
    'Global talent investor helping individuals find co-founders before they have a company. Strong focus on AI-first startups.',
    ARRAY['idea', 'pre-seed'],
    80000,
    80000,
    NULL,
    NULL,
    ARRAY['AI', 'Tech', 'Co-founder Matching'],
    ARRAY['Global', 'London', 'Multiple Cities'],
    ARRAY['Co-founder matching', '$80K investment', 'Global network', 'Mentorship'],
    'Multiple cohorts per year; check website for 2025-2026 programs',
    ARRAY[]::text[],
    'https://www.joinef.com/apply',
    '$80K investment. 3-6 months program. Global, multiple cities.',
    '{"twitter": "https://x.com/join_ef", "linkedin": "https://www.linkedin.com/company/entrepreneur-first/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Deep Science Ventures
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'Deep Science Ventures',
    'accelerator',
    'deep-science-ventures',
    'https://deepscienceventures.com',
    'UK-based accelerator combining scientific research with venture creation. Ideal for AI projects grounded in deep tech.',
    ARRAY['pre-seed', 'seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['AI', 'Deep Tech', 'Science-based'],
    ARRAY['UK', 'Global'],
    ARRAY['Scientific research support', 'Venture creation', 'Deep tech focus', 'Mentorship'],
    '12 months program; check website for 2025-2026 cohorts',
    ARRAY[]::text[],
    'https://deepscienceventures.com/apply',
    'Varies by venture. 12 months program. UK, global reach.',
    '{"twitter": "https://x.com/DeepSciVentures", "linkedin": "https://www.linkedin.com/company/deep-science-ventures/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Pi Campus
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'Pi Campus',
    'accelerator',
    'pi-campus',
    'https://picampus.it',
    'Italian venture fund and startup district supporting AI-first startups. Early-stage AI incubator with European reach.',
    ARRAY['pre-seed', 'seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['AI', 'Tech', 'European'],
    ARRAY['Italy', 'Europe'],
    ARRAY['€50K-€200K investment', 'European network', 'Mentorship', 'Startup district'],
    '3-6 months program; check website for 2025-2026 cohorts',
    ARRAY[]::text[],
    'https://picampus.it/apply',
    '€50K-€200K investment. 3-6 months program. Italy, Europe.',
    '{"twitter": "https://x.com/PiCampus", "linkedin": "https://www.linkedin.com/company/pi-campus/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Conception X
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'Conception X',
    'accelerator',
    'conception-x',
    'https://www.conceptionx.org',
    'UK-based program helping PhD students commercialize AI research into startups. Focuses on AI PhD spinouts.',
    ARRAY['pre-seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['AI', 'PhD Spinouts', 'Deep Tech'],
    ARRAY['UK'],
    ARRAY['Grant-based support', 'PhD student focus', 'Commercialization support', '9 months program'],
    '9 months program; check website for 2025-2026 cohorts',
    ARRAY[]::text[],
    'https://www.conceptionx.org/apply',
    'Grant-based support. 9 months program. UK.',
    '{"twitter": "https://x.com/Conception_X", "linkedin": "https://www.linkedin.com/company/conception-x/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Village Global
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'Village Global',
    'accelerator',
    'village-global',
    'https://www.villageglobal.vc',
    'Early-stage venture capital firm backed by successful entrepreneurs. Supports AI startups through mentorship and funding.',
    ARRAY['pre-seed', 'seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['AI', 'Tech', 'Global'],
    ARRAY['Global', 'Remote-friendly'],
    ARRAY['Pre-seed/seed funding', 'Entrepreneur network', 'Mentorship', 'Remote-friendly'],
    'Ongoing support; check website for 2025-2026 programs',
    ARRAY[]::text[],
    'https://www.villageglobal.vc/apply',
    'Pre-seed/seed funding. Ongoing support. Global, remote-friendly.',
    '{"twitter": "https://x.com/villageglobal", "linkedin": "https://www.linkedin.com/company/village-global/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- All Turtles
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'All Turtles',
    'accelerator',
    'all-turtles',
    'https://all-turtles.com',
    'AI-focused startup studio. Co-creates and invests in AI-based startups. Builds companies from scratch.',
    ARRAY['idea', 'pre-seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['AI', 'Startup Studio', 'Product Development'],
    ARRAY['Global', 'US-origin'],
    ARRAY['Startup studio support', 'Co-creation', 'Product development', 'AI focus'],
    'Ongoing; check website for 2025-2026 opportunities',
    ARRAY[]::text[],
    'https://all-turtles.com/contact',
    'Startup studio model. Varies by company. Global, US-origin.',
    '{"twitter": "https://x.com/allturtles", "linkedin": "https://www.linkedin.com/company/all-turtles/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- MEST Africa
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'MEST Africa',
    'accelerator',
    'mest-africa',
    'http://meltwater.org',
    'Meltwater Entrepreneurial School of Technology. Pan-Africa accelerator supporting tech startups including AI.',
    ARRAY['pre-seed', 'seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['AI', 'Tech', 'Africa'],
    ARRAY['Africa', 'Ghana', 'Pan-Africa'],
    ARRAY['Pan-Africa network', 'Mentorship', 'Training', 'Funding'],
    'Annual cohorts; check website for 2025-2026 programs',
    ARRAY[]::text[],
    'http://meltwater.org/apply',
    'Varies by program. Annual cohorts. Africa, Ghana, pan-Africa.',
    '{"twitter": "https://x.com/MESTAfrica", "linkedin": "https://www.linkedin.com/company/mest-africa/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Fast Forward
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'Fast Forward',
    'accelerator',
    'fast-forward',
    'https://www.ffwd.org',
    'Tech-for-good accelerator focusing on nonprofits. Supports social-impact AI teams with equity-free grants.',
    ARRAY['pre-seed', 'seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['AI', 'Tech-for-Good', 'Nonprofit', 'Social Impact'],
    ARRAY['Global', 'Nonprofit-oriented'],
    ARRAY['Equity-free grants', 'Nonprofit focus', 'Social impact', 'Mentorship'],
    'Annual cohorts; check website for 2025-2026 programs',
    ARRAY[]::text[],
    'https://www.ffwd.org/apply',
    'Equity-free grants. Annual cohorts. Global, nonprofit-oriented.',
    '{"twitter": "https://x.com/ffwdorg", "linkedin": "https://www.linkedin.com/company/fast-forward/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Accelerace
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'Accelerace',
    'accelerator',
    'accelerace',
    'https://www.accelerace.dk',
    'Nordic accelerator supporting tech startups. Strong European network. Supports AI and deep tech companies.',
    ARRAY['pre-seed', 'seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['AI', 'Tech', 'Nordic'],
    ARRAY['Nordic', 'Europe'],
    ARRAY['Nordic network', 'Mentorship', 'Funding', 'European connections'],
    'Multiple cohorts per year; check website for 2025-2026 programs',
    ARRAY[]::text[],
    'https://www.accelerace.dk/apply',
    'Varies by program. Multiple cohorts. Nordic, Europe.',
    '{"twitter": "https://x.com/Accelerace", "linkedin": "https://www.linkedin.com/company/accelerace/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Intel Ignite
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'Intel Ignite',
    'accelerator',
    'intel-ignite',
    'https://www.intel.com/content/www/us/en/startups/ignite.html',
    'Intel-backed startup program supporting deep tech and AI startups. Global hubs including Tel Aviv.',
    ARRAY['pre-seed', 'seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['AI', 'Deep Tech', 'Hardware'],
    ARRAY['Global', 'Tel Aviv', 'Multiple Hubs'],
    ARRAY['Intel resources', 'Deep tech focus', 'Hardware support', 'Mentorship'],
    'Multiple cohorts per year; check website for 2025-2026 programs',
    ARRAY[]::text[],
    'https://www.intel.com/content/www/us/en/startups/ignite/apply.html',
    'Intel-backed program. Varies by hub. Global, Tel Aviv, multiple hubs.',
    '{"twitter": "https://x.com/Intel", "linkedin": "https://www.linkedin.com/company/intel/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- Newchip Accelerator
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'Newchip Accelerator',
    'accelerator',
    'newchip-accelerator',
    'https://newchip.com',
    'Global accelerator with remote-friendly programs. Supports tech startups including AI. Online-first approach.',
    ARRAY['pre-seed', 'seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['AI', 'Tech', 'Remote'],
    ARRAY['Global', 'Remote-friendly'],
    ARRAY['Remote-friendly', 'Online programs', 'Mentorship', 'Investor access'],
    'Multiple cohorts per year; check website for 2025-2026 programs',
    ARRAY[]::text[],
    'https://newchip.com/apply',
    'Varies by program. Remote-friendly. Global, remote-friendly.',
    '{"twitter": "https://x.com/newchip", "linkedin": "https://www.linkedin.com/company/newchip/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

-- ERA (Entrepreneurs Roundtable Accelerator)
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary, social_links
) VALUES (
    'ERA (Entrepreneurs Roundtable Accelerator)',
    'accelerator',
    'era-accelerator',
    'https://www.eranyc.com',
    'NYC-based accelerator with tailored curriculum. Over 500 expert mentors. Strong Demo Day connections.',
    ARRAY['pre-seed', 'seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['AI', 'Tech', 'NYC'],
    ARRAY['NYC', 'USA', 'Remote-friendly'],
    ARRAY['Tailored curriculum', '500+ expert mentors', 'Demo Day', 'NYC network'],
    'Multiple cohorts per year; check website for 2025-2026 programs',
    ARRAY[]::text[],
    'https://www.eranyc.com/apply',
    'Varies by program. Multiple cohorts. NYC, USA, remote-friendly.',
    '{"twitter": "https://x.com/ERAccelerator", "linkedin": "https://www.linkedin.com/company/entrepreneurs-roundtable-accelerator/"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    updated_at = now();

