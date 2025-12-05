-- Seed data for AI Startup Accelerators
-- Generated: 2025-01-22
-- Source: Top 10 AI Startup Accelerators research

-- Y Combinator
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary
) VALUES (
    'Y Combinator',
    'accelerator',
    'y-combinator',
    'https://ycombinator.com',
    'Broad tech accelerator including AI/ML. Strong AI batch history with 75% AI in recent cohorts. Notable alumni include OpenAI.',
    ARRAY['pre-seed', 'seed'],
    500000,
    500000,
    7,
    7,
    ARRAY['AI/ML', 'Infrastructure', 'Applications'],
    ARRAY['San Francisco'],
    ARRAY['Dedicated partner mentorship', 'Investor intros', 'Demo Day', 'Alumni network'],
    'Rolling early decisions',
    ARRAY['OpenAI'],
    'https://ycombinator.com/apply',
    '$500K for ~7% equity. Winter 2026 opens now, deadline Nov 10, 2025 (8pm PT). Program duration: 3 months (Jan-Mar 2026).'
);

-- NEO Accelerator
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary
) VALUES (
    'NEO Accelerator',
    'accelerator',
    'neo-accelerator',
    'https://neo.com',
    'AI/deep tech accelerator for technical founders. Delaware C-Corp required. Offers follow-on funding.',
    ARRAY['pre-seed', 'seed'],
    600000,
    600000,
    NULL,
    NULL,
    ARRAY['AI', 'Deep Tech'],
    ARRAY['Global', 'Remote-friendly'],
    ARRAY['1:1 mentorship (OpenAI/Microsoft)', '$350K+ OpenAI/Azure credits', 'Hiring support', 'Demo Day'],
    '2025 cohort open (seasonal windows)',
    ARRAY['Pika', 'Cognition'],
    'https://neo.com/apply',
    '$600K uncapped SAFE ($10M floor). 3 months program. Global, remote-friendly with retreats.'
);

-- AI2 Incubator
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary
) VALUES (
    'AI2 Incubator',
    'accelerator',
    'ai2-incubator',
    'https://ai2incubator.com',
    'Applied AI/deep tech incubator. ~15 teams/year. Technical/domain founders. No relocation required.',
    ARRAY['pre-seed', 'seed'],
    600000,
    600000,
    NULL,
    NULL,
    ARRAY['Applied AI', 'Deep Tech', 'Climate', 'Healthcare', 'Fintech'],
    ARRAY['Seattle', 'Remote', 'AI House'],
    ARRAY['Technical support', 'Research access', 'Investor network', 'Cloud credits'],
    'Rolling admissions (no fixed windows)',
    ARRAY[]::text[],
    'https://ai2incubator.com/apply',
    'Up to $600K + cloud credits. Flexible/ongoing program duration. Early research-to-product stage.'
);

-- Betaworks AI Camp
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary
) VALUES (
    'Betaworks AI Camp',
    'accelerator',
    'betaworks-ai-camp',
    'https://betaworks.com',
    'AI applications/frontier tech accelerator. Focuses on custom AI architectures. Syndicate partners.',
    ARRAY['seed'],
    500000,
    500000,
    5,
    5,
    ARRAY['AI Applications', 'Frontier Tech', 'SMB Productivity'],
    ARRAY['NYC'],
    ARRAY['In-residence mentorship', 'Investor speed dating', 'NYC workspace', 'Demo Day'],
    'Next cohort late Feb-May 2026 (apply ongoing)',
    ARRAY[]::text[],
    'https://betaworks.com/apply',
    'Up to $500K (uncapped SAFE 25% discount + 5% stock). 13 weeks program. NYC, mostly in-person.'
);

-- Boost VC
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary
) VALUES (
    'Boost VC',
    'accelerator',
    'boost-vc',
    'https://boost.vc',
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
    'https://boost.vc/apply',
    'Up to $500K for 15% equity. 3 months program. San Francisco.'
);

-- a16z Speedrun
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary
) VALUES (
    'a16z Speedrun',
    'accelerator',
    'a16z-speedrun',
    'https://a16z.com/speedrun',
    'AI/games/deep tech accelerator. <1% acceptance rate. 120+ backed companies.',
    ARRAY['seed'],
    750000,
    1000000,
    7,
    10,
    ARRAY['AI', 'Games', 'Deep Tech', 'Consumer'],
    ARRAY['San Francisco', 'Los Angeles'],
    ARRAY['Mentorship', 'Investor network'],
    'Cohorts ongoing (LA 5th in 2025, 2026 next)',
    ARRAY[]::text[],
    'https://a16z.com/speedrun/apply',
    '$750K-$1M for 7-10% equity. Accelerator format (varies). SF/LA.'
);

-- OpenAI Converge
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary
) VALUES (
    'OpenAI Converge',
    'accelerator',
    'openai-converge',
    'https://openai.fund/converge',
    'Frontier AI models accelerator. Travel covered. Community focus. Early model access.',
    ARRAY['seed'],
    1000000,
    1000000,
    NULL,
    NULL,
    ARRAY['Frontier AI Models', 'Cutting-edge AI'],
    ARRAY['Remote', 'San Francisco'],
    ARRAY['Early model access', 'Workshops', 'OpenAI office hours', 'Travel covered'],
    'Check for 2026 openings (prior closed)',
    ARRAY[]::text[],
    'https://openai.fund/converge/apply',
    '$1M equity. ~6 hours/week. Remote + final SF week. Community focus.'
);

-- Google for Startups AI First
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary
) VALUES (
    'Google for Startups AI First',
    'accelerator',
    'google-ai-first',
    'https://startup.google.com',
    'AI/ML applications accelerator. 20 startups/cohort. India/global focus. Equity-free.',
    ARRAY['seed', 'series-a'],
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['AI/ML', 'Agentic AI', 'Multimodal AI'],
    ARRAY['Global', 'Hybrid'],
    ARRAY['Google mentorship', 'Bootcamps', 'Gemini access', '$350K Google Cloud credits'],
    'Cohorts yearly (2025 batch announced; 2026 expected)',
    ARRAY[]::text[],
    'https://startup.google.com/apply',
    '$350K Google Cloud credits (equity-free). Varies by cohort. Global/hybrid.'
);

-- Techstars AI Programs
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary
) VALUES (
    'Techstars AI Programs',
    'accelerator',
    'techstars-ai',
    'https://techstars.com',
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
    'https://techstars.com/apply',
    '$220K for 5-7% equity. 3 months program. Global programs.'
);

-- AI Grant
INSERT INTO public.investors (
    name, type, slug, website_url, description,
    stages, min_check_size, max_check_size, equity_percent_min, equity_percent_max,
    specialties, geographies, benefits, time_to_decision, notable_investments,
    application_link, terms_summary
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
    '$250K uncapped. Equity-free focus. Flexible program duration. Global/remote.'
);


