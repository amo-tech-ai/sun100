# Database Setup & Schema Generation

**Document Status:** Published - 2025-01-16
**Author:** Lead Database Architect
**Goal:** This document provides a complete database architecture, schema, and implementation guide for the sun ai startup platform, optimized for a PostgreSQL 15+ environment on Google Cloud SQL.

---

### 1. User Journey & Data Flow

This diagram illustrates the core user journey from registration to creating a pitch deck, showing how different parts of the system interact and what data is created at each step.

```mermaid
graph TD
    subgraph "User Onboarding"
        A[Visit Landing Page] --> B{Sign Up};
        B --> C[Create User & Organization];
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
        C -- Creates --> M(users, organizations);
        F -- Creates --> N(saved_items);
        I -- Creates --> O(decks, slides);
        K -- Creates --> P(ai_runs);
    end
```

---

### 2. Entity Relationship Diagram (ERD)

This ERD represents the complete relational schema, designed for multi-tenancy, scalability, and observability with a custom backend.

```mermaid
erDiagram
    %% Core User & Organization Tables
    users ||--o{ organization_members : "is member of"
    organizations ||--|{ organization_members : "has"
    organizations ||--|{ decks : "owns"
    
    users {
        uuid id PK
        text email UK
        text password_hash
        text full_name
        timestamptz created_at
        timestamptz updated_at
    }
    
    organizations {
        uuid id PK
        text name
        timestamptz created_at
        timestamptz updated_at
    }
    
    organization_members {
        uuid organization_id PK,FK
        uuid user_id PK,FK
        text role "owner, admin, editor, viewer"
        timestamptz created_at
    }

    %% Pitch Deck Core System
    decks ||--|{ slides : "contains"
    
    decks {
        uuid id PK
        uuid organization_id FK
        text title
        text template
        timestamptz created_at
        timestamptz updated_at
    }
    
    slides {
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
    
    %% Community Features
    startups { uuid id PK, uuid organization_id FK, text name, text website, text description }
    events { uuid id PK, uuid organization_id FK, text name, text description, timestamptz start_date }
    jobs { uuid id PK, uuid organization_id FK, text title, text description }
    perks { uuid id PK, text name, text description }

    %% User Bookmarks
    users ||--o{ saved_items : "saves"
    saved_items { uuid id PK, uuid user_id FK, text item_type, uuid item_id, timestamptz created_at }

    %% Observability & Audit Trail
    users ||--o{ ai_runs : "initiates"
    users ||--o{ audit_log : "performs"
    
    ai_runs { uuid id PK, uuid user_id FK, text tool_name, jsonb args_json, text status, integer duration_ms, timestamptz created_at }
    audit_log { uuid id PK, uuid user_id FK, text action, text table_name, uuid row_id, jsonb changes, timestamptz created_at }
```

---

### 3. Database Schema (PostgreSQL DDL)

This production-ready schema is designed for a custom application backend connecting to Cloud SQL.

```sql
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. CORE USER & ORGANIZATION TABLES

-- Stores user authentication and profile data
CREATE TABLE public.users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    full_name text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Organizations for multi-tenancy
CREATE TABLE public.organizations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Junction table for user roles within organizations
CREATE TABLE public.organization_members (
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role text NOT NULL CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (organization_id, user_id)
);

-- 2. PITCH DECK TABLES

CREATE TABLE public.decks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    title text NOT NULL,
    template text NOT NULL DEFAULT 'default',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.slides (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    deck_id uuid NOT NULL REFERENCES public.decks(id) ON DELETE CASCADE,
    position integer NOT NULL,
    title text NOT NULL,
    content text,
    image_url text,
    template text,
    chart_data jsonb,
    table_data jsonb,
    type text CHECK (type IN ('vision', 'problem', 'solution', 'market', 'product', 'traction', 'competition', 'team', 'ask', 'roadmap', 'generic')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (deck_id, position)
);

-- 3. COMMUNITY FEATURE TABLES (Placeholders)
CREATE TABLE public.startups ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE, name text NOT NULL, website text, description text );
CREATE TABLE public.events ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE, name text NOT NULL, description text, start_date timestamptz );
CREATE TABLE public.jobs ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE, title text NOT NULL, description text );
CREATE TABLE public.perks ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, description text );
CREATE TABLE public.saved_items ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE, item_type text NOT NULL CHECK (item_type IN ('event', 'job', 'perk')), item_id uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(user_id, item_type, item_id) );

-- 4. OBSERVABILITY TABLES
CREATE TABLE public.ai_runs ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE, tool_name text NOT NULL, args_json jsonb, status text NOT NULL CHECK (status IN ('success', 'error')), duration_ms integer, created_at timestamptz NOT NULL DEFAULT now() );
CREATE TABLE public.audit_log ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE, action text NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')), table_name text NOT NULL, row_id uuid, changes jsonb, created_at timestamptz NOT NULL DEFAULT now() );
```

---

### 4. Performance: Indexes

```sql
-- Indexes for foreign keys to speed up joins
CREATE INDEX ON public.decks (organization_id);
CREATE INDEX ON public.slides (deck_id);
CREATE INDEX ON public.organization_members (user_id);

-- Composite index for fast ordering of slides
CREATE INDEX ON public.slides (deck_id, position);

-- GIN indexes for full-text search capabilities
CREATE INDEX ON public.decks USING GIN (to_tsvector('english', title));
CREATE INDEX ON public.slides USING GIN (to_tsvector('english', title || ' ' || content));
```

---

### 5. Security: Row-Level Security (RLS)

RLS policies now use a session variable (`app.current_user_id`), which the backend application must set for each transaction.

```sql
-- Enable RLS on all relevant tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slides ENABLE ROW LEVEL SECURITY;
-- (Enable for all other data tables)

-- Helper function to get a user's role in an organization
CREATE OR REPLACE FUNCTION get_user_role(org_id uuid)
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT role FROM public.organization_members 
  WHERE organization_id = org_id AND user_id = current_setting('app.current_user_id', true)::uuid;
$$;

-- Example Policies for the 'decks' table:
CREATE POLICY "Allow SELECT for org members" ON public.decks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_members.organization_id = decks.organization_id 
      AND organization_members.user_id = current_setting('app.current_user_id', true)::uuid
    )
  );

-- (Define INSERT, UPDATE, DELETE policies similarly)

-- Users can only see and edit their own user record
CREATE POLICY "Allow individual access to own user record" ON public.users
    FOR ALL USING ((current_setting('app.current_user_id', true)::uuid) = id);
```

---

### 6. Automation: Triggers & Functions

This trigger automatically updates the `updated_at` timestamp on any row that is modified.

```sql
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_deck_update
  BEFORE UPDATE ON public.decks
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER on_slide_update
  BEFORE UPDATE ON public.slides
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
```

---

### 7. Google Cloud SQL Setup Notes

1.  **Create Instance:** In the Google Cloud Console, create a new PostgreSQL 15 instance.
2.  **Create Database & User:** Create a database (e.g., `sun_ai_prod`) and a user with a strong password.
3.  **Configure Networking:** For production, use the Cloud SQL Auth Proxy or a Private IP connection from your application server (e.g., Cloud Run) for secure connections. Do not whitelist public IPs (`0.0.0.0/0`).
4.  **Backend Connection:** Your backend application (e.g., a Node.js service) will connect to this database. After authenticating a user, it should run `SET app.current_user_id = '<user-uuid>';` before executing queries to enable the RLS policies.