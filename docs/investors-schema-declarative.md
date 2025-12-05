# Investors Table - Declarative Schema Documentation

**Date:** 2025-01-23  
**Status:** ✅ Schema file created, migration documented

## 📁 Files Created

### 1. Declarative Schema File
**Location:** `supabase/schemas/investors.sql`

This file represents the **desired final state** of the `investors` table. Use this file for:
- Future schema modifications
- Generating migrations via `supabase db diff`
- Documentation of table structure

### 2. Migration File (Reference)
**Location:** `supabase/migrations/20250123035227_create_investors_table.sql`

This migration file documents the current schema state. It includes:
- Complete table definition
- All constraints and indexes
- RLS policies
- Comments and documentation

**Note:** Since the table already exists, this migration serves as reference documentation. For future changes, modify `supabase/schemas/investors.sql` and generate migrations using `supabase db diff`.

---

## 🔄 Declarative Schema Workflow

### For Future Schema Changes

1. **Stop Supabase locally:**
   ```bash
   supabase stop
   ```

2. **Modify schema file:**
   - Edit `supabase/schemas/investors.sql`
   - Make desired changes (add columns, modify constraints, etc.)

3. **Generate migration:**
   ```bash
   supabase db diff -f add_investor_field_description
   ```

4. **Review generated migration:**
   - Check `supabase/migrations/YYYYMMDDHHmmss_add_investor_field_description.sql`
   - Verify changes are correct

5. **Apply migration:**
   ```bash
   supabase db reset  # For local development
   # OR
   supabase db push   # For remote database
   ```

---

## 📋 Current Schema Summary

### Table: `public.investors`

**Purpose:** Unified directory for VCs, accelerators, angel groups, and corporate VCs

**Columns (22 total):**
- **Core:** `id`, `name`, `type`, `slug`
- **Contact:** `logo_url`, `description`, `website_url`, `contact_email`, `application_link`
- **Funding:** `min_check_size`, `max_check_size`, `equity_percent_min`, `equity_percent_max`, `terms_summary`
- **Arrays:** `stages[]`, `specialties[]`, `geographies[]`, `benefits[]`, `notable_investments[]`
- **Process:** `time_to_decision`
- **Timestamps:** `created_at`, `updated_at`

**Constraints:**
- `type` CHECK: `'vc' | 'accelerator' | 'angel_group' | 'corporate_vc'`
- `slug` UNIQUE
- Primary Key: `id` (uuid)

**Indexes:**
- `idx_investors_slug` - Fast slug lookups
- `idx_investors_type` - Filter by type

**RLS Policies:**
- Public read access (SELECT)
- Authenticated write access (INSERT, UPDATE, DELETE)

**Triggers:**
- `update_investors_updated_at` - Auto-update `updated_at` timestamp

---

## ✅ Validation

- ✅ Schema file matches database structure
- ✅ Migration file documents current state
- ✅ All constraints properly defined
- ✅ RLS policies correctly configured
- ✅ Indexes optimized for common queries
- ✅ TypeScript interface aligned (`services/vcService.ts`)

---

## 🚀 Next Steps

1. **For new changes:** Edit `supabase/schemas/investors.sql`
2. **Generate migrations:** Use `supabase db diff`
3. **Review:** Always review generated migrations before applying
4. **Apply:** Use `supabase db reset` (local) or `supabase db push` (remote)

---

**Last Updated:** 2025-01-23


