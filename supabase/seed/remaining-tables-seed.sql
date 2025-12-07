INSERT INTO events (id, title, description, event_date, location, event_type, registration_url, image_url, created_at, updated_at) VALUES
('11111111-aaaa-aaaa-aaaa-111111111111', 'StartupAI Launch Day', 'Official launch event for StartupAI platform with live demos and networking', NOW() + INTERVAL '30 days', 'San Francisco, CA', 'conference', 'https://startupai.com/events/launch', 'https://images.unsplash.com/photo-startup-event', NOW(), NOW()),
('22222222-aaaa-aaaa-aaaa-222222222222', 'Pitch Perfect Workshop', 'Learn how to create compelling pitch decks with AI assistance', NOW() + INTERVAL '14 days', 'Virtual Event', 'workshop', 'https://startupai.com/events/pitch-workshop', NULL, NOW(), NOW()),
('33333333-aaaa-aaaa-aaaa-333333333333', 'Investor Networking Night', 'Connect with angel investors and VCs in an informal setting', NOW() + INTERVAL '45 days', 'New York, NY', 'networking', 'https://startupai.com/events/investor-night', 'https://images.unsplash.com/photo-networking', NOW(), NOW()),
('44444444-aaaa-aaaa-aaaa-444444444444', 'AI in Business Summit', 'Deep dive into how AI is transforming startup operations', NOW() + INTERVAL '60 days', 'Austin, TX', 'conference', 'https://startupai.com/events/ai-summit', 'https://images.unsplash.com/photo-ai-summit', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO event_registrations (id, user_id, event_id, status, registered_at) VALUES
('11111111-bbbb-bbbb-bbbb-111111111111', '8f93914d-14b6-4393-8d86-9520e92c5ad8', '11111111-aaaa-aaaa-aaaa-111111111111', 'registered', NOW()),
('22222222-bbbb-bbbb-bbbb-222222222222', '86f2c37b-d26d-4f29-9f1d-8834de1fe9a3', '11111111-aaaa-aaaa-aaaa-111111111111', 'registered', NOW()),
('33333333-bbbb-bbbb-bbbb-333333333333', 'f0793a85-0b9d-4197-9e5f-bec368d28747', '22222222-aaaa-aaaa-aaaa-222222222222', 'registered', NOW()),
('44444444-bbbb-bbbb-bbbb-444444444444', '32558519-4deb-4c8c-95ab-3fef94ef222d', '33333333-aaaa-aaaa-aaaa-333333333333', 'registered', NOW()),
('55555555-bbbb-bbbb-bbbb-555555555555', '8f93914d-14b6-4393-8d86-9520e92c5ad8', '44444444-aaaa-aaaa-aaaa-444444444444', 'registered', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO jobs (id, startup_id, title, description, location, job_type, salary_range, application_url, created_at, updated_at) VALUES
('11111111-cccc-cccc-cccc-111111111111', '1122065b-42d4-4ee1-b03c-2d33a1a2216e', 'Senior Full-Stack Engineer', 'Build AI-powered pitch deck generation features', 'San Francisco, CA (Hybrid)', 'full-time', '$150,000 - $200,000', 'https://startupai.com/careers/senior-engineer', NOW(), NOW()),
('22222222-cccc-cccc-cccc-222222222222', '1122065b-42d4-4ee1-b03c-2d33a1a2216e', 'Product Designer', 'Design intuitive interfaces for AI-assisted workflows', 'Remote', 'full-time', '$120,000 - $160,000', 'https://startupai.com/careers/product-designer', NOW(), NOW()),
('33333333-cccc-cccc-cccc-333333333333', '861c87b7-62f8-47b3-91ee-26bb1a78dbac', 'DevOps Engineer', 'Scale infrastructure for collaborative coding platform', 'New York, NY', 'full-time', '$140,000 - $180,000', 'https://codeflow.dev/careers/devops', NOW(), NOW()),
('44444444-cccc-cccc-cccc-444444444444', '08c74e50-f86e-49a7-b215-338a47daa187', 'Growth Marketing Manager', 'Drive user acquisition and retention strategies', 'Remote', 'full-time', '$100,000 - $130,000', 'https://designhub.io/careers/growth', NOW(), NOW()),
('55555555-cccc-cccc-cccc-555555555555', '4b3e347a-6f2e-4c28-b456-03325a985252', 'Data Analyst Intern', 'Analyze product metrics and user behavior', 'Austin, TX', 'internship', '$25/hour', 'https://growthmetrics.co/careers/intern', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO job_applications (id, user_id, job_id, status, applied_at) VALUES
('11111111-dddd-dddd-dddd-111111111111', 'c35f2d8b-5d79-4b0b-b0d3-02ec4f25cd58', '11111111-cccc-cccc-cccc-111111111111', 'applied', NOW() - INTERVAL '5 days'),
('22222222-dddd-dddd-dddd-222222222222', '32558519-4deb-4c8c-95ab-3fef94ef222d', '22222222-cccc-cccc-cccc-222222222222', 'interviewing', NOW() - INTERVAL '10 days'),
('33333333-dddd-dddd-dddd-333333333333', 'f0793a85-0b9d-4197-9e5f-bec368d28747', '33333333-cccc-cccc-cccc-333333333333', 'applied', NOW() - INTERVAL '3 days'),
('44444444-dddd-dddd-dddd-444444444444', '86f2c37b-d26d-4f29-9f1d-8834de1fe9a3', '44444444-cccc-cccc-cccc-444444444444', 'rejected', NOW() - INTERVAL '15 days'),
('55555555-dddd-dddd-dddd-555555555555', 'c35f2d8b-5d79-4b0b-b0d3-02ec4f25cd58', '55555555-cccc-cccc-cccc-555555555555', 'hired', NOW() - INTERVAL '20 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO assets (id, slide_id, bucket_id, object_path, asset_type, created_at) VALUES
('11111111-eeee-eeee-eeee-111111111111', '22e29ee7-16e2-4e8e-afa5-b7fb71fa6575', 'deck-assets', 'decks/8d32405e/slides/22e29ee7/hero-image.png', 'image', NOW()),
('22222222-eeee-eeee-eeee-222222222222', '1837310a-70da-422b-9a5a-44a3df920659', 'deck-assets', 'decks/8d32405e/slides/1837310a/problem-chart.svg', 'chart_spec', NOW()),
('33333333-eeee-eeee-eeee-333333333333', '59b7ec47-8901-406f-b46d-16e2c14fd405', 'deck-assets', 'decks/8d32405e/slides/59b7ec47/solution-diagram.png', 'image', NOW()),
('44444444-eeee-eeee-eeee-444444444444', '7c122a1d-d036-47c9-a959-110b7b00e7fa', 'deck-assets', 'decks/8d32405e/slides/7c122a1d/traction-graph.png', 'chart_spec', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO citations (id, slide_id, source_url, quote, created_at) VALUES
('11111111-ffff-ffff-ffff-111111111111', '1837310a-70da-422b-9a5a-44a3df920659', 'https://techcrunch.com/2024/pitch-deck-statistics', 'Founders spend an average of 60+ hours creating their pitch decks', NOW()),
('22222222-ffff-ffff-ffff-222222222222', '1837310a-70da-422b-9a5a-44a3df920659', 'https://forbes.com/startup-funding-2024', '78% of investors say deck quality directly impacts funding decisions', NOW()),
('33333333-ffff-ffff-ffff-333333333333', '7c122a1d-d036-47c9-a959-110b7b00e7fa', 'https://bloomberg.com/ai-startup-growth', 'AI-powered tools are growing at 45% CAGR in the startup ecosystem', NOW()),
('44444444-ffff-ffff-ffff-444444444444', '59b7ec47-8901-406f-b46d-16e2c14fd405', 'https://ycombinator.com/library/pitch-best-practices', 'The best pitch decks tell a compelling story in under 15 slides', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO share_links (id, deck_id, token, expires_at, created_at) VALUES
('11111111-1111-1111-1111-aaaaaaaaaaaa', '8d32405e-dd87-4928-a5b2-669e323c6ee0', 'share_8d32405e_abc123xyz', NOW() + INTERVAL '7 days', NOW()),
('22222222-2222-2222-2222-aaaaaaaaaaaa', '44eeb276-730f-4c6f-9bcc-5108ea656216', 'share_44eeb276_def456uvw', NOW() + INTERVAL '14 days', NOW()),
('33333333-3333-3333-3333-aaaaaaaaaaaa', '0c20aa51-3ad4-4c02-9a24-f762babb2f00', 'share_0c20aa51_ghi789rst', NOW() + INTERVAL '30 days', NOW()),
('44444444-4444-4444-4444-aaaaaaaaaaaa', 'e0e96d78-678d-4e46-b254-10abf578db92', 'share_e0e96d78_jkl012mno', NULL, NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_log (id, user_id, action, table_name, row_id, diff, created_at) VALUES
('11111111-2222-3333-4444-555555555555', '8f93914d-14b6-4393-8d86-9520e92c5ad8', 'INSERT', 'decks', '8d32405e-dd87-4928-a5b2-669e323c6ee0', '{"title": "AI Pitch Pro - Seed Round", "template": "modern"}', NOW() - INTERVAL '10 days'),
('22222222-3333-4444-5555-666666666666', '8f93914d-14b6-4393-8d86-9520e92c5ad8', 'UPDATE', 'decks', '8d32405e-dd87-4928-a5b2-669e323c6ee0', '{"status": {"old": "draft", "new": "published"}}', NOW() - INTERVAL '5 days'),
('33333333-4444-5555-6666-777777777777', '86f2c37b-d26d-4f29-9f1d-8834de1fe9a3', 'INSERT', 'slides', '22e29ee7-16e2-4e8e-afa5-b7fb71fa6575', '{"title": "The Future of Pitch Decks", "type": "vision"}', NOW() - INTERVAL '9 days'),
('44444444-5555-6666-7777-888888888888', 'f0793a85-0b9d-4197-9e5f-bec368d28747', 'DELETE', 'slides', '00000000-0000-0000-0000-000000000001', '{"title": "Deleted draft slide"}', NOW() - INTERVAL '7 days'),
('55555555-6666-7777-8888-999999999999', '32558519-4deb-4c8c-95ab-3fef94ef222d', 'UPDATE', 'startups', '1122065b-42d4-4ee1-b03c-2d33a1a2216e', '{"stage": {"old": "pre-seed", "new": "seed"}}', NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO org_members (org_id, user_id, role, created_at) VALUES
('e033ddef-b3f2-4bbe-a10d-c451e05ae6f8', '8f93914d-14b6-4393-8d86-9520e92c5ad8', 'owner', NOW() - INTERVAL '60 days'),
('e033ddef-b3f2-4bbe-a10d-c451e05ae6f8', '86f2c37b-d26d-4f29-9f1d-8834de1fe9a3', 'admin', NOW() - INTERVAL '45 days'),
('195eb048-94c4-400e-8b56-31bbedc0fb4f', 'f0793a85-0b9d-4197-9e5f-bec368d28747', 'owner', NOW() - INTERVAL '50 days'),
('626664aa-e96c-48d3-a205-4bdae6b339aa', '32558519-4deb-4c8c-95ab-3fef94ef222d', 'owner', NOW() - INTERVAL '40 days'),
('f75ae98f-519c-46d7-8187-98304dbe51c5', 'c35f2d8b-5d79-4b0b-b0d3-02ec4f25cd58', 'owner', NOW() - INTERVAL '30 days')
ON CONFLICT (org_id, user_id) DO NOTHING;

INSERT INTO saved_opportunities (id, user_id, opportunity_type, opportunity_id, created_at) VALUES
('11111111-aaaa-bbbb-cccc-111111111111', '8f93914d-14b6-4393-8d86-9520e92c5ad8', 'investor', 'b9283dda-8e19-451f-8cf6-a5685026ec6d', NOW() - INTERVAL '5 days'),
('22222222-aaaa-bbbb-cccc-222222222222', '8f93914d-14b6-4393-8d86-9520e92c5ad8', 'investor', '1de962b6-728a-4add-b271-6872ac80e7f7', NOW() - INTERVAL '4 days'),
('33333333-aaaa-bbbb-cccc-333333333333', '86f2c37b-d26d-4f29-9f1d-8834de1fe9a3', 'event', '11111111-aaaa-aaaa-aaaa-111111111111', NOW() - INTERVAL '3 days'),
('44444444-aaaa-bbbb-cccc-444444444444', 'f0793a85-0b9d-4197-9e5f-bec368d28747', 'job', '11111111-cccc-cccc-cccc-111111111111', NOW() - INTERVAL '2 days'),
('55555555-aaaa-bbbb-cccc-555555555555', '32558519-4deb-4c8c-95ab-3fef94ef222d', 'investor', '8760afe1-cace-4aaa-9eab-0aff79f5bf61', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

