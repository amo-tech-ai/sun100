-- Migration: Additional Initialization
-- Purpose: Add any additional tables and indexes needed after initial schema
-- This file exists for backward compatibility with existing deployments
-- Generated: 2024-09-10

-- Note: The core schema is defined in 20240821120000_initial_schema.sql
-- This migration adds any additional features or modifications

-- ============================================================================
-- ADDITIONAL INDEXES FOR PERFORMANCE
-- ============================================================================

-- Full-text search index on startup names (if not exists)
create index if not exists idx_startups_name_trgm on public.startups using gin (name gin_trgm_ops);

-- Full-text search index on deck titles (if not exists)  
create index if not exists idx_decks_title_trgm on public.decks using gin (title gin_trgm_ops);

-- Note: These indexes require the pg_trgm extension
-- If the extension is not available, these will fail silently

-- ============================================================================
-- GRANT USAGE (if needed for API access)
-- ============================================================================

-- Ensure the 'anon' and 'authenticated' roles have proper access
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant all on all routines in schema public to anon, authenticated;
