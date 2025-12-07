-- ============================================
-- CRM ENRICHMENT SAMPLE DATA SEED
-- Tables: crm_deal_enrichment, crm_deal_stage_history, crm_lead_enrichment
-- Generated: 2025-12-07
-- ============================================

-- ============================================
-- 1. CRM_DEAL_ENRICHMENT
-- AI-generated enrichment data for deals
-- ============================================

INSERT INTO crm_deal_enrichment (id, deal_id, company_data, decision_makers, competitors, recent_news, recommended_approach, enriched_at) VALUES
('11111111-1111-1111-1111-111111111111', 'd1e2f3a4-b5c6-4789-d0e1-f2a3b4c5d6e7',
  '{"name": "Acme Analytics", "industry": "Data Analytics", "employees": 250, "revenue_range": "$10M-$50M", "founded": 2018, "headquarters": "San Francisco, CA", "website": "https://acmeanalytics.com", "linkedin": "https://linkedin.com/company/acme-analytics", "funding_total": "$25M", "tech_stack": ["Python", "Snowflake", "Tableau", "AWS"]}',
  '[{"name": "John Mitchell", "title": "VP of Engineering", "linkedin": "https://linkedin.com/in/johnmitchell", "email": "john.mitchell@acmeanalytics.com", "decision_power": "high", "notes": "Technical decision maker, prefers detailed demos"}, {"name": "Sarah Williams", "title": "CFO", "linkedin": "https://linkedin.com/in/sarahwilliams", "email": "sarah.williams@acmeanalytics.com", "decision_power": "high", "notes": "Budget approval authority, ROI focused"}]',
  '[{"name": "Mixpanel", "strength": "Product analytics", "weakness": "Limited data warehouse integration"}, {"name": "Amplitude", "strength": "User behavior tracking", "weakness": "Higher pricing tier"}, {"name": "Heap", "strength": "Auto-capture events", "weakness": "Less customization"}]',
  '[{"date": "2025-11-15", "headline": "Acme Analytics raises $15M Series B", "source": "TechCrunch", "url": "https://techcrunch.com/acme-series-b", "sentiment": "positive"}, {"date": "2025-10-28", "headline": "Acme Analytics launches new AI dashboard", "source": "VentureBeat", "url": "https://venturebeat.com/acme-ai", "sentiment": "positive"}]',
  'Focus on ROI metrics and total cost of ownership. The CFO is key decision maker. Offer a pilot program with clear success metrics. Highlight integration with their existing Snowflake stack. Schedule technical deep-dive with VP Engineering before executive presentation.',
  NOW() - INTERVAL '2 days'
),
('22222222-2222-2222-2222-222222222222', 'f3a4b5c6-d7e8-4901-f2a3-b4c5d6e7f8a9',
  '{"name": "NovaHealth", "industry": "Healthcare Technology", "employees": 500, "revenue_range": "$50M-$100M", "founded": 2015, "headquarters": "Boston, MA", "website": "https://novahealth.io", "linkedin": "https://linkedin.com/company/novahealth", "funding_total": "$75M", "tech_stack": ["Java", "PostgreSQL", "React", "Azure", "HIPAA Compliant"]}',
  '[{"name": "Robert Anderson", "title": "CTO", "linkedin": "https://linkedin.com/in/robertanderson", "email": "robert.anderson@novahealth.io", "decision_power": "high", "notes": "Security and compliance focused"}, {"name": "Dr. Lisa Park", "title": "Chief Medical Officer", "linkedin": "https://linkedin.com/in/drlisapark", "email": "lisa.park@novahealth.io", "decision_power": "medium", "notes": "Clinical workflow advocate"}]',
  '[{"name": "Epic Systems", "strength": "Market leader in EHR", "weakness": "High implementation cost"}, {"name": "Cerner", "strength": "Strong hospital network", "weakness": "Legacy architecture"}, {"name": "athenahealth", "strength": "Cloud-native", "weakness": "Limited enterprise features"}]',
  '[{"date": "2025-11-20", "headline": "NovaHealth partners with major hospital network", "source": "Healthcare IT News", "url": "https://healthcareitnews.com/nova-partnership", "sentiment": "positive"}, {"date": "2025-10-15", "headline": "FDA clears NovaHealth AI diagnostic tool", "source": "MedTech Dive", "url": "https://medtechdive.com/nova-fda", "sentiment": "positive"}]',
  'Emphasize HIPAA compliance and security certifications. CTO is primary decision maker. Prepare detailed security questionnaire responses. Offer proof of concept in sandbox environment. Reference similar healthcare client implementations.',
  NOW() - INTERVAL '5 days'
),
('33333333-3333-3333-3333-333333333333', 'a4b5c6d7-e8f9-4012-a3b4-c5d6e7f8a9b0',
  '{"name": "Orbit Commerce", "industry": "E-commerce Platform", "employees": 150, "revenue_range": "$5M-$10M", "founded": 2020, "headquarters": "Austin, TX", "website": "https://orbitcommerce.com", "linkedin": "https://linkedin.com/company/orbit-commerce", "funding_total": "$12M", "tech_stack": ["Node.js", "MongoDB", "Shopify Plus", "GCP"]}',
  '[{"name": "Marcus Chen", "title": "CEO", "linkedin": "https://linkedin.com/in/marcuschen", "email": "marcus@orbitcommerce.com", "decision_power": "high", "notes": "Fast decision maker, growth focused"}, {"name": "Jennifer Liu", "title": "Head of Product", "linkedin": "https://linkedin.com/in/jenniferliu", "email": "jennifer@orbitcommerce.com", "decision_power": "medium", "notes": "Feature-oriented, integration needs"}]',
  '[{"name": "Shopify", "strength": "Ecosystem and app marketplace", "weakness": "Platform lock-in"}, {"name": "BigCommerce", "strength": "Headless commerce", "weakness": "Smaller app ecosystem"}, {"name": "Magento", "strength": "Customization", "weakness": "High maintenance cost"}]',
  '[{"date": "2025-11-25", "headline": "Orbit Commerce hits 1M merchants milestone", "source": "Retail Dive", "url": "https://retaildive.com/orbit-milestone", "sentiment": "positive"}]',
  'Position as growth enabler. CEO makes fast decisions - prepare concise proposal. Demonstrate scalability for their merchant growth trajectory. Focus on time-to-value and quick implementation.',
  NOW() - INTERVAL '1 day'
),
('44444444-4444-4444-4444-444444444444', 'b5c6d7e8-f9a0-4123-b4c5-d6e7f8a9b0c1',
  '{"name": "TechVentures Capital", "industry": "Venture Capital", "employees": 45, "revenue_range": "$1M-$5M", "founded": 2012, "headquarters": "New York, NY", "website": "https://techventures.vc", "linkedin": "https://linkedin.com/company/techventures-capital", "aum": "$500M", "portfolio_companies": 75, "focus_areas": ["B2B SaaS", "Fintech", "AI/ML"]}',
  '[{"name": "David Foster", "title": "Managing Partner", "linkedin": "https://linkedin.com/in/davidfoster", "email": "david@techventures.vc", "decision_power": "high", "notes": "Portfolio value driver, seeks tools for portfolio companies"}, {"name": "Amanda Torres", "title": "Principal", "linkedin": "https://linkedin.com/in/amandatorres", "email": "amanda@techventures.vc", "decision_power": "medium", "notes": "Due diligence lead, data-driven"}]',
  '[{"name": "Carta", "strength": "Cap table management", "weakness": "Limited CRM features"}, {"name": "Affinity", "strength": "Relationship intelligence", "weakness": "Less portfolio tracking"}, {"name": "Visible", "strength": "Portfolio reporting", "weakness": "No deal flow management"}]',
  '[{"date": "2025-11-10", "headline": "TechVentures closes $200M Fund IV", "source": "PitchBook", "url": "https://pitchbook.com/techventures-fund4", "sentiment": "positive"}]',
  'Position as portfolio value-add tool. Offer partnership program for portfolio companies. Focus on deal flow management and portfolio insights. Schedule demo with Principal first, then Managing Partner.',
  NOW() - INTERVAL '3 days'
);

-- ============================================
-- 2. CRM_DEAL_STAGE_HISTORY
-- Tracks all stage transitions for audit trail
-- ============================================

INSERT INTO crm_deal_stage_history (id, deal_id, from_stage, to_stage, changed_by, changed_at, ai_probability_at_change) VALUES
('aaaa1111-1111-1111-1111-111111111111', 'd1e2f3a4-b5c6-4789-d0e1-f2a3b4c5d6e7', NULL, 'Lead', '8f93914d-14b6-4393-8d86-9520e92c5ad8', NOW() - INTERVAL '30 days', 10),
('aaaa2222-2222-2222-2222-222222222222', 'd1e2f3a4-b5c6-4789-d0e1-f2a3b4c5d6e7', 'Lead', 'Qualified', '8f93914d-14b6-4393-8d86-9520e92c5ad8', NOW() - INTERVAL '25 days', 25),
('aaaa3333-3333-3333-3333-333333333333', 'd1e2f3a4-b5c6-4789-d0e1-f2a3b4c5d6e7', 'Qualified', 'Proposal', '8f93914d-14b6-4393-8d86-9520e92c5ad8', NOW() - INTERVAL '15 days', 50),
('aaaa4444-4444-4444-4444-444444444444', 'd1e2f3a4-b5c6-4789-d0e1-f2a3b4c5d6e7', 'Proposal', 'Negotiation', '86f2c37b-d26d-4f29-9f1d-8834de1fe9a3', NOW() - INTERVAL '5 days', 75),
('bbbb1111-1111-1111-1111-111111111111', 'e2f3a4b5-c6d7-4890-e1f2-a3b4c5d6e7f8', NULL, 'Lead', '86f2c37b-d26d-4f29-9f1d-8834de1fe9a3', NOW() - INTERVAL '60 days', 10),
('bbbb2222-2222-2222-2222-222222222222', 'e2f3a4b5-c6d7-4890-e1f2-a3b4c5d6e7f8', 'Lead', 'Qualified', '86f2c37b-d26d-4f29-9f1d-8834de1fe9a3', NOW() - INTERVAL '50 days', 30),
('bbbb3333-3333-3333-3333-333333333333', 'e2f3a4b5-c6d7-4890-e1f2-a3b4c5d6e7f8', 'Qualified', 'Proposal', '86f2c37b-d26d-4f29-9f1d-8834de1fe9a3', NOW() - INTERVAL '35 days', 55),
('bbbb4444-4444-4444-4444-444444444444', 'e2f3a4b5-c6d7-4890-e1f2-a3b4c5d6e7f8', 'Proposal', 'Negotiation', '86f2c37b-d26d-4f29-9f1d-8834de1fe9a3', NOW() - INTERVAL '20 days', 70),
('bbbb5555-5555-5555-5555-555555555555', 'e2f3a4b5-c6d7-4890-e1f2-a3b4c5d6e7f8', 'Negotiation', 'Closed Won', '8f93914d-14b6-4393-8d86-9520e92c5ad8', NOW() - INTERVAL '7 days', 95),
('cccc1111-1111-1111-1111-111111111111', 'f3a4b5c6-d7e8-4901-f2a3-b4c5d6e7f8a9', NULL, 'Lead', 'f0793a85-0b9d-4197-9e5f-bec368d28747', NOW() - INTERVAL '20 days', 15),
('cccc2222-2222-2222-2222-222222222222', 'f3a4b5c6-d7e8-4901-f2a3-b4c5d6e7f8a9', 'Lead', 'Qualified', 'f0793a85-0b9d-4197-9e5f-bec368d28747', NOW() - INTERVAL '12 days', 35),
('cccc3333-3333-3333-3333-333333333333', 'f3a4b5c6-d7e8-4901-f2a3-b4c5d6e7f8a9', 'Qualified', 'Proposal', 'f0793a85-0b9d-4197-9e5f-bec368d28747', NOW() - INTERVAL '3 days', 60),
('dddd1111-1111-1111-1111-111111111111', 'a4b5c6d7-e8f9-4012-a3b4-c5d6e7f8a9b0', NULL, 'Lead', '8f93914d-14b6-4393-8d86-9520e92c5ad8', NOW() - INTERVAL '10 days', 20),
('dddd2222-2222-2222-2222-222222222222', 'a4b5c6d7-e8f9-4012-a3b4-c5d6e7f8a9b0', 'Lead', 'Qualified', '8f93914d-14b6-4393-8d86-9520e92c5ad8', NOW() - INTERVAL '4 days', 40),
('eeee1111-1111-1111-1111-111111111111', 'b5c6d7e8-f9a0-4123-b4c5-d6e7f8a9b0c1', NULL, 'Lead', '86f2c37b-d26d-4f29-9f1d-8834de1fe9a3', NOW() - INTERVAL '7 days', 15);

-- ============================================
-- 3. CRM_LEAD_ENRICHMENT
-- AI-enriched data for contacts/leads
-- ============================================

-- Note: crm_lead_enrichment has UNIQUE constraint on lead_id
-- Use ON CONFLICT to handle re-runs gracefully
INSERT INTO crm_lead_enrichment (id, lead_id, company_id, ceo_name, ceo_linkedin, linkedin_company_url, recent_news, funding_history, hiring_trends, market_presence_score, search_trend_score, gemini_summary, evidence_links, created_at, updated_at) VALUES
('55555555-5555-5555-5555-555555555555', 'c1d2e3f4-a5b6-4789-c0d1-e2f3a4b5c6d7', 'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7',
  'Michael Reeves', 'https://linkedin.com/in/michaelreeves', 'https://linkedin.com/company/acme-analytics',
  '[{"date": "2025-11-15", "headline": "Acme Analytics raises $15M Series B", "source": "TechCrunch", "sentiment": "positive"}, {"date": "2025-10-20", "headline": "Acme Analytics expands to European market", "source": "Business Wire", "sentiment": "positive"}]',
  '[{"date": "2023-03-01", "round": "Seed", "amount": "$3M", "investors": ["Sequoia Scout", "Y Combinator"]}, {"date": "2024-06-15", "round": "Series A", "amount": "$10M", "investors": ["Accel", "Index Ventures"]}, {"date": "2025-11-15", "round": "Series B", "amount": "$15M", "investors": ["Andreessen Horowitz", "Accel"]}]',
  '{"total_employees": 250, "growth_6m": 35, "growth_12m": 85, "open_roles": 28, "top_roles": ["Senior Engineer", "Data Scientist", "Account Executive", "Product Manager"], "engineering_ratio": 0.45}',
  82, 75,
  'Acme Analytics is a fast-growing data analytics company that just closed Series B funding. Strong engineering team with 45% technical headcount. Actively hiring across engineering and sales. Recent European expansion indicates global ambitions. John Mitchell (VP Engineering) is a key contact - technical decision maker who prefers detailed product demonstrations. Ideal time to engage given recent funding and growth momentum.',
  '[{"title": "Acme Analytics Series B Announcement", "url": "https://techcrunch.com/acme-series-b"}, {"title": "LinkedIn Company Page", "url": "https://linkedin.com/company/acme-analytics"}, {"title": "Acme Analytics Careers", "url": "https://acmeanalytics.com/careers"}]',
  NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'
),
('66666666-6666-6666-6666-666666666666', 'e3f4a5b6-c7d8-4901-e2f3-a4b5c6d7e8f9', 'f6a7b8c9-d0e1-4234-f5a6-b7c8d9e0f1a2',
  'Rebecca Torres', 'https://linkedin.com/in/rebeccatorres', 'https://linkedin.com/company/bluewave-fintech',
  '[{"date": "2025-11-08", "headline": "BlueWave Fintech launches instant payment API", "source": "Fintech Today", "sentiment": "positive"}, {"date": "2025-09-22", "headline": "BlueWave partners with major bank consortium", "source": "American Banker", "sentiment": "positive"}]',
  '[{"date": "2022-01-10", "round": "Seed", "amount": "$2.5M", "investors": ["Ribbit Capital"]}, {"date": "2023-09-20", "round": "Series A", "amount": "$18M", "investors": ["Stripe", "Ribbit Capital"]}, {"date": "2025-02-28", "round": "Series B", "amount": "$45M", "investors": ["Goldman Sachs", "Stripe", "Tiger Global"]}]',
  '{"total_employees": 180, "growth_6m": 42, "growth_12m": 95, "open_roles": 35, "top_roles": ["Backend Engineer", "Compliance Officer", "Solutions Architect", "DevOps"], "engineering_ratio": 0.52}',
  78, 68,
  'BlueWave Fintech is a Series B fintech company focused on payment infrastructure. Strong backing from strategic investors (Stripe, Goldman Sachs). Recent bank consortium partnership signals enterprise readiness. Michael Chen (contact) is technical lead - highly responsive to API and integration discussions. Company is in rapid expansion mode with 95% YoY headcount growth.',
  '[{"title": "BlueWave Series B Announcement", "url": "https://fintechtoday.com/bluewave-series-b"}, {"title": "BlueWave Developer Portal", "url": "https://developers.bluewavefintech.com"}]',
  NOW() - INTERVAL '5 days', NOW() - INTERVAL '3 days'
),
('77777777-7777-7777-7777-777777777777', 'a5b6c7d8-e9f0-4123-a4b5-c6d7e8f9a0b1', 'a7b8c9d0-e1f2-4345-a6b7-c8d9e0f1a2b3',
  'Dr. James Wilson', 'https://linkedin.com/in/drjameswilson', 'https://linkedin.com/company/novahealth-io',
  '[{"date": "2025-11-20", "headline": "NovaHealth partners with major hospital network", "source": "Healthcare IT News", "sentiment": "positive"}, {"date": "2025-10-15", "headline": "FDA clears NovaHealth AI diagnostic tool", "source": "MedTech Dive", "sentiment": "positive"}]',
  '[{"date": "2020-06-01", "round": "Seed", "amount": "$5M", "investors": ["GV", "Rock Health"]}, {"date": "2022-03-15", "round": "Series A", "amount": "$22M", "investors": ["Andreessen Horowitz Bio", "GV"]}, {"date": "2024-08-10", "round": "Series B", "amount": "$50M", "investors": ["General Catalyst", "Andreessen Horowitz Bio"]}]',
  '{"total_employees": 500, "growth_6m": 28, "growth_12m": 65, "open_roles": 45, "top_roles": ["Clinical Data Scientist", "HIPAA Security Engineer", "Healthcare Integration Specialist", "ML Engineer"], "engineering_ratio": 0.38}',
  88, 82,
  'NovaHealth is a well-funded healthtech company with recent FDA clearance for their AI diagnostic tool. Strong focus on compliance and security (HIPAA). Robert Anderson (CTO contact) is security-focused and will require detailed compliance documentation. Hospital network partnership indicates enterprise sales capability. Good candidate for healthcare-specific solutions requiring compliance certifications.',
  '[{"title": "NovaHealth FDA Clearance", "url": "https://medtechdive.com/nova-fda"}, {"title": "NovaHealth Hospital Partnership", "url": "https://healthcareitnews.com/nova-partnership"}]',
  NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day'
),
('88888888-8888-8888-8888-888888888888', 'f4a5b6c7-d8e9-4012-f3a4-b5c6d7e8f9a0', 'f6a7b8c9-d0e1-4234-f5a6-b7c8d9e0f1a2',
  'Rebecca Torres', 'https://linkedin.com/in/rebeccatorres', 'https://linkedin.com/company/bluewave-fintech',
  '[{"date": "2025-11-08", "headline": "BlueWave Fintech launches instant payment API", "source": "Fintech Today", "sentiment": "positive"}]',
  '[{"date": "2025-02-28", "round": "Series B", "amount": "$45M", "investors": ["Goldman Sachs", "Stripe", "Tiger Global"]}]',
  '{"total_employees": 180, "growth_6m": 42, "growth_12m": 95, "open_roles": 35, "top_roles": ["Backend Engineer", "Compliance Officer"], "engineering_ratio": 0.52}',
  78, 68,
  'Emily Rodriguez is a senior product manager at BlueWave Fintech focused on enterprise integrations. She has buying influence for developer tools and API products. BlueWave recently launched their instant payment API indicating focus on developer experience. Emily is responsive to product-focused conversations and case studies.',
  '[{"title": "BlueWave API Documentation", "url": "https://developers.bluewavefintech.com"}]',
  NOW() - INTERVAL '4 days', NOW() - INTERVAL '2 days'
),
('99999999-9999-9999-9999-999999999999', 'd2e3f4a5-b6c7-4890-d1e2-f3a4b5c6d7e8', 'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7',
  'Michael Reeves', 'https://linkedin.com/in/michaelreeves', 'https://linkedin.com/company/acme-analytics',
  '[{"date": "2025-11-15", "headline": "Acme Analytics raises $15M Series B", "source": "TechCrunch", "sentiment": "positive"}]',
  '[{"date": "2025-11-15", "round": "Series B", "amount": "$15M", "investors": ["Andreessen Horowitz", "Accel"]}]',
  '{"total_employees": 250, "growth_6m": 35, "growth_12m": 85, "open_roles": 28, "top_roles": ["Senior Engineer", "Data Scientist"], "engineering_ratio": 0.45}',
  82, 75,
  'Sarah Williams is CFO at Acme Analytics with budget approval authority. She is ROI-focused and responds well to clear value propositions and TCO analysis. Recent Series B funding means budget availability for new tools. Prepare financial justification and case studies with measurable outcomes.',
  '[{"title": "Acme Analytics About", "url": "https://acmeanalytics.com/about"}]',
  NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'
);

