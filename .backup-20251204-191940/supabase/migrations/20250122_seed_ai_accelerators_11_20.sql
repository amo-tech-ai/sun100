-- Seed data for AI Startup Accelerators (11-20)
-- Generated: 2025-01-22
-- Source: Top 20 AI Startup Accelerators research

-- NVIDIA Inception
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary
) VALUES (
    'NVIDIA Inception',
    'accelerator',
    'nvidia-inception',
    'https://nvidia.com/en-us/startups',
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
    'https://nvidia.com/en-us/startups/apply',
    'GPU access, SDKs (equity-free). Ongoing support. Global, remote.'
);

-- Microsoft for Startups Founders Hub
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary
) VALUES (
    'Microsoft for Startups Founders Hub',
    'accelerator',
    'microsoft-founders-hub',
    'https://startups.microsoft.com',
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
    'https://startups.microsoft.com/apply',
    'Up to $150K Azure credits (equity-free). Flexible/ongoing program. Global/remote.'
);

-- Plug and Play AI
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary
) VALUES (
    'Plug and Play AI',
    'accelerator',
    'plug-and-play-ai',
    'https://plugandplaytechcenter.com/ai',
    'AI innovation across sectors accelerator. 40 startups/year. Government and corporate ties.',
    ARRAY['seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['AI Innovation', 'AI Prototypes'],
    ARRAY['San Jose', 'Global'],
    ARRAY['Corporate intros', 'Workspace', 'Testing ground', 'Low-cost entry'],
    'Open now for 2026 cohorts',
    ARRAY[]::text[],
    'https://plugandplaytechcenter.com/ai/apply',
    'Low-cost entry, corporate partnerships. Varies by batch. San Jose/global.'
);

-- ventureLAB Accelerate AI
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary
) VALUES (
    'ventureLAB Accelerate AI',
    'accelerator',
    'venturelab-accelerate-ai',
    'https://venturelab.ca/accelerate-ai',
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
    'https://venturelab.ca/accelerate-ai/apply',
    'Grants for tech/talent (amount varies). 6 months program. Ontario, Canada.'
);

-- Alchemist Accelerator
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary
) VALUES (
    'Alchemist Accelerator',
    'accelerator',
    'alchemist-accelerator',
    'https://alchemistaccelerator.com',
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
    'https://alchemistaccelerator.com/apply',
    '$36K seed for equity. 6 months program. Silicon Valley.'
);

-- AngelPad
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary
) VALUES (
    'AngelPad',
    'accelerator',
    'angelpad',
    'https://angelpad.com',
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
    'https://angelpad.com/apply',
    '$120K investment. Varies program duration. USA/remote-friendly.'
);

-- MassChallenge AI/Deep Tech
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary
) VALUES (
    'MassChallenge AI/Deep Tech',
    'accelerator',
    'masschallenge-ai-deep-tech',
    'https://masschallenge.org',
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
    'https://masschallenge.org/apply',
    'Non-dilutive cash prizes. Cohort-based program. UK/global (Oxford-Cambridge).'
);

-- HighTechXL
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary
) VALUES (
    'HighTechXL',
    'accelerator',
    'hightechxl',
    'https://hightechxl.com',
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
    'https://hightechxl.com/apply',
    'Venture-building investment. Intensive fixed program. Eindhoven, Netherlands.'
);

-- SOSV (Deep Tech Focus)
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary
) VALUES (
    'SOSV (Deep Tech Focus)',
    'accelerator',
    'sosv-deep-tech',
    'https://sosv.com',
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
    'https://sosv.com/apply',
    '$100K+ for equity. 6 months program. Global (NJ, Asia).'
);

-- Google for Startups Accelerator: Europe
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary
) VALUES (
    'Google for Startups Accelerator: Europe',
    'accelerator',
    'google-startups-accelerator-europe',
    'https://startup.google.com/europe/ai',
    'ML/AI tech accelerator. Product/leadership focus. Equity-free support.',
    ARRAY['seed'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['ML/AI', 'AI/ML Apps'],
    ARRAY['Europe', 'Hybrid'],
    ARRAY['Equity-free support', 'Google mentorship', 'Workshops'],
    '3-month cohorts (2026 openings TBA)',
    ARRAY[]::text[],
    'https://startup.google.com/europe/ai/apply',
    'Equity-free support. 3 months program. Europe/hybrid.'
);


