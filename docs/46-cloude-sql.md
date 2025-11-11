# System Architecture, Data Model, and User Journey

**Last Updated:** 2025-01-16
**Version:** 2.1 (Cloud SQL Edition)
**Status:** Complete Schema for Custom Backend

## Project Overview

**sun ai startup** is a comprehensive AI startup community platform designed for AI tech professionals, founders, and startups. The platform combines resource discovery, networking, and AI-powered content creation tools to support the entire startup ecosystem. This document outlines the PostgreSQL schema for use with a custom backend application hosted on a service like Google Cloud Run, connected to a Google Cloud SQL database.

---

## User Journey & Data Flow

```mermaid
graph TD
    subgraph "User Onboarding"
        A[Visit Landing Page] --> B{Sign Up};
        B --> C[Create User & Org in DB];
    end

    subgraph "Dashboard & Community"
        C --> D[Dashboard];
        D --> E[Browse Events, Jobs, Perks];
        E --> F[Save Opportunity];
    end

    subgraph "AI Tool: Pitch Deck Creation"
        D --> G[Start Pitch Deck Wizard];
        G --> H{Provide Context (Text/URL)};
        H --> I(Backend: Generate Deck with Gemini);
        I --> J[Deck Editor];
        J --> K{Use AI Copilot, Image Gen, etc.};
        K --> J;
        J --> L[Present Deck];
    end

    subgraph "Backend & Database"
        C -- Creates --> M(Users, Orgs Tables);
        F -- Creates --> N(Saved_Opportunities Table);
        I -- Creates --> O(Decks, Slides Tables);
        K -- Creates --> P(AI_Runs Table);
    end
```

---

## Google Cloud SQL ER Diagram

This ER diagram reflects the complete database schema designed for a standard PostgreSQL environment, removing dependencies on any specific BaaS provider like Supabase.

```mermaid
erDiagram
    %% Core User & Organization Management
    USERS ||--o{ ORGS : "owns"
    USERS ||--o{ ORG_MEMBERS : "is member of"
    ORGS ||--o{ ORG_MEMBERS : "has"
    ORGS ||--o{ DECKS : "owns"
    ORGS ||--o{ STARTUPS : "belongs to"
    
    USERS {
        uuid id PK
        text email UK
        text password_hash
        text full_name
        text avatar_url
        text bio
        timestamptz created_at
        timestamptz updated_at
    }
    
    ORGS {
        uuid id PK
        uuid owner_id FK "References users"
        text name
        timestamptz created_at
        timestamptz updated_at
    }
    
    ORG_MEMBERS {
        uuid org_id PK,FK
        uuid user_id PK,FK
        text role "owner, admin, editor, viewer"
        timestamptz created_at
    }

    %% Pitch Deck Core System
    DECKS ||--o{ SLIDES : "contains"
    DECKS ||--o{ SHARE_LINKS : "has"
    DECKS }o--o| STARTUPS : "linked to"
    DECKS }o--o| USERS : "created by"
    
    DECKS {
        uuid id PK
        uuid org_id FK
        uuid user_id FK
        uuid startup_id FK
        text title
        text description
        text template
        timestamptz created_at
        timestamptz updated_at
    }
    
    SLIDES ||--o{ ASSETS : "has"
    SLIDES ||--o{ CITATIONS : "has"
    
    SLIDES {
        uuid id PK
        uuid deck_id FK
        integer position
        text title
        text content
        text image_url
        text template
        jsonb chart_data
        jsonb table_data
        text type
        timestamptz created_at
        timestamptz updated_at
    }
    
    ASSETS { uuid id PK, uuid slide_id FK, text bucket_id, text object_path, text asset_type, timestamptz created_at }
    CITATIONS { uuid id PK, uuid slide_id FK, text source_url, text quote, timestamptz created_at }
    SHARE_LINKS { uuid id PK, uuid deck_id FK, text token UK, timestamptz expires_at, timestamptz created_at }

    %% Startup Profiles & Dashboard Features
    USERS ||--o{ STARTUPS : "creates"
    
    STARTUPS {
        uuid id PK
        uuid user_id FK
        uuid org_id FK
        text name
        text website_url
        text tagline
        text logo_url
        timestamptz created_at
        timestamptz updated_at
    }
    
    STARTUPS ||--o{ JOBS : "posts"
    JOBS ||--o{ JOB_APPLICATIONS : "receives"
    USERS ||--o{ JOB_APPLICATIONS : "applies to"
    
    JOBS { uuid id PK, uuid startup_id FK, text title, text description, text location, timestamptz created_at }
    JOB_APPLICATIONS { uuid id PK, uuid user_id FK, uuid job_id FK, text status, timestamptz applied_at }

    %% Events & Community Features
    EVENTS ||--o{ EVENT_REGISTRATIONS : "has"
    USERS ||--o{ EVENT_REGISTRATIONS : "registers for"
    
    EVENTS { uuid id PK, text title, text description, timestamptz event_date, text location, timestamptz created_at }
    EVENT_REGISTRATIONS { uuid id PK, uuid user_id FK, uuid event_id FK, text status, timestamptz registered_at }

    %% User Bookmarks & Saved Content
    USERS ||--o{ SAVED_OPPORTUNITIES : "saves"
    SAVED_OPPORTUNITIES { uuid id PK, uuid user_id FK, text opportunity_type, uuid opportunity_id, timestamptz created_at }

    %% Observability & Audit Trail
    USERS ||--o{ AI_RUNS : "performs"
    USERS ||--o{ AUDIT_LOG : "creates"
    
    AI_RUNS { uuid id PK, uuid user_id FK, text tool_name, jsonb args_json, text status, integer duration_ms, numeric cost_estimate, timestamptz created_at }
    AUDIT_LOG { uuid id PK, uuid user_id FK, text action, text table_name, uuid row_id, jsonb diff, timestamptz created_at }
```

---

## PostgreSQL DDL (Data Definition Language)

```sql
-- DDL for tables like users, orgs, decks, slides, etc.
-- This schema is provider-agnostic.

-- USER TABLE
CREATE TABLE public.users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    full_name text,
    avatar_url text,
    bio text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ORGS TABLE
CREATE TABLE public.orgs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.orgs ENABLE ROW LEVEL SECURITY;

-- ORG_MEMBERS TABLE
CREATE TABLE public.org_members (
  org_id uuid NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (org_id, user_id)
);
ALTER TABLE public.org_members ENABLE ROW LEVEL SECURITY;

-- (DDL for other tables like decks, slides, etc. follows a similar pattern)
```

---

## Row-Level Security (RLS) for Custom Backends

These RLS policies are designed to work with a custom application server that sets a session variable for the user's ID at the beginning of each transaction.

```sql
-- Helper function to get the current user's ID from the session variable
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT current_setting('app.current_user_id', true)::uuid;
$$;

-- Helper function to get a user's role in an organization
CREATE OR REPLACE FUNCTION get_user_role(org_id uuid)
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT role FROM public.organization_members 
  WHERE organization_id = org_id AND user_id = get_current_user_id();
$$;

-- RLS Policies for 'decks' table

-- 1. Members can view decks in their org
CREATE POLICY "Allow SELECT for org members" ON public.decks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_members.organization_id = decks.organization_id AND organization_members.user_id = get_current_user_id()
    )
  );

-- 2. Editors, Admins, and Owners can create decks
CREATE POLICY "Allow INSERT for editors and above" ON public.decks
  FOR INSERT WITH CHECK (
    get_user_role(decks.organization_id) IN ('owner', 'admin', 'editor')
  );

-- 3. Editors, Admins, and Owners can update decks
CREATE POLICY "Allow UPDATE for editors and above" ON public.decks
  FOR UPDATE USING (
    get_user_role(decks.organization_id) IN ('owner', 'admin', 'editor')
  );

-- 4. Admins and Owners can delete decks
CREATE POLICY "Allow DELETE for admins and above" ON public.decks
  FOR DELETE USING (
    get_user_role(decks.organization_id) IN ('owner', 'admin')
  );
```

### Backend Implementation Note:
For RLS to work, the application backend must execute the following SQL command immediately after establishing a connection to the database for a user's request:
`SET app.current_user_id = '<user-uuid-from-jwt>';`

---

## Triggers & Automation

The following trigger function automatically updates the `updated_at` column on any table modification, ensuring data freshness without application-level logic.

```sql
-- Function to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply trigger to a table
CREATE TRIGGER on_deck_update
  BEFORE UPDATE ON public.decks
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

-- (Repeat for all tables with an 'updated_at' column)
```