-- Migration: Add social_links column to investors table
-- Purpose: Store social media links (Twitter, LinkedIn, Substack, YouTube) as JSONB
-- Affected tables: public.investors
-- Generated: 2025-01-23

-- Add social_links column
ALTER TABLE public.investors
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;

-- Add column comment
COMMENT ON COLUMN public.investors.social_links IS 'Social media links (JSONB: {twitter: "url", linkedin: "url", substack: "url", youtube: "url"})';

