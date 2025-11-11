# System Architecture, Data Model, and User Journey

**Last Updated:** 2025-01-16
**Version:** 2.0
**Status:** Complete Schema with All Migrations Applied

## Project Overview

**Sun AI** is a comprehensive AI startup community platform designed for AI tech professionals, founders, and startups. The platform combines resource discovery, networking, and AI-powered content creation tools to support the entire startup ecosystem.

### Platform Features

**Community & Resources**
- **Startup Profiles**: Complete founder/startup profiles with traction data, team info, and needs
- **Events**: Community events, workshops, hackathons, demo days, and networking sessions
- **Jobs**: Startup job postings and career opportunities
- **Perks**: Exclusive benefits and deals for community members
- **Blogs**: Articles, tips, and insights on startup success
- **Accelerators**: Directory of accelerator programs
- **Saved Opportunities**: Bookmark events, jobs, perks, and content

**AI-Powered Tools (Google Gemini)**
- **Pitch Deck Wizard**: Generate investor-ready decks from business details or URLs
- **Startup Profile Wizard**: AI-assisted startup profile creation
- **Event Wizard**: AI-powered event planning and management
- **Deck Editor**: Real-time slide editing with AI copilot assistance
- **Content Analysis**: Automated slide analysis (clarity, impact, tone)
- **Research Tools**: AI-powered topic research with citations
- **Image Generation**: Context-aware slide image creation and editing
- **Chart/Table Generation**: Automated data visualization
- **Roadmap Creation**: AI-generated product roadmap slides

## User Journey & Data Flow

This diagram illustrates the core user journey from registration to creating a pitch deck, showing how different parts of the system interact.

```mermaid
graph TD
    subgraph "User Onboarding"
        A[Visit Landing Page] --> B{Sign Up};
        B --> C[Create Profile & Org];
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
        C -- Creates --> M(Profiles, Orgs Tables);
        F -- Creates --> N(Saved_Opportunities Table);
        I -- Creates --> O(Decks, Slides Tables);
        K -- Creates --> P(AI_Runs Table);
    end
```

## Supabase ER Diagram

This ER diagram reflects the complete database schema after all migrations have been applied, including dashboard tables, RLS policies, storage buckets, and helper functions.

```mermaid
erDiagram
    %% Core Authentication & User Management
    auth_users ||--|| PROFILES : "extends"
    PROFILES {
        uuid id PK "References auth.users"
        text email
        text full_name
        text avatar_url
        text bio
        timestamptz created_at
        timestamptz updated_at
    }

    %% Organization & Multi-tenant Architecture
    PROFILES ||--o{ ORGS : "owns"
    PROFILES ||--o{ ORG_MEMBERS : "member"
    ORGS ||--o{ ORG_MEMBERS : "contains"
    ORGS ||--o{ DECKS : "owns"
    ORGS ||--o{ STARTUPS : "belongs_to"
    
    ORGS {
        uuid id PK
        uuid owner_id FK "References profiles"
        text name
        timestamptz created_at
        timestamptz updated_at
    }
    
    ORG_MEMBERS {
        uuid org_id PK,FK "References orgs"
        uuid user_id PK,FK "References profiles"
        text role "owner, admin, editor, viewer"
        timestamptz created_at
    }

    %% Pitch Deck Core System
    DECKS ||--o{ SLIDES : "contains"
    DECKS ||--o{ SHARE_LINKS : "has"
    DECKS }o--o| STARTUPS : "linked_to"
    DECKS }o--o| auth_users : "created_by"
    DECKS }o--o| ORGS : "belongs_to"
    
    DECKS {
        uuid id PK
        uuid org_id FK "References orgs"
        uuid user_id FK "References auth.users"
        uuid startup_id FK "References startups"
        text title
        text description
        text template
        jsonb slides "Alternative storage"
        jsonb theme_config
        timestamptz created_at
        timestamptz updated_at
        timestamptz last_accessed_at
    }
    
    SLIDES ||--o{ ASSETS : "has"
    SLIDES ||--o{ CITATIONS : "has"
    
    SLIDES {
        uuid id PK
        uuid deck_id FK "References decks"
        integer position
        text title
        text content
        text image_url
        text template
        jsonb chart_data
        jsonb table_data
        text type "vision, problem, solution, market, product, traction, competition, team, ask, roadmap, generic"
        timestamptz created_at
        timestamptz updated_at
    }
    
    ASSETS {
        uuid id PK
        uuid slide_id FK "References slides"
        text bucket_id "Storage bucket name"
        text object_path "File path in storage"
        text asset_type "image, chart_spec, other"
        timestamptz created_at
    }
    
    CITATIONS {
        uuid id PK
        uuid slide_id FK "References slides"
        text source_url
        text quote
        timestamptz created_at
    }
    
    SHARE_LINKS {
        uuid id PK
        uuid deck_id FK "References decks"
        text token UK "Unique sharing token"
        timestamptz expires_at
        timestamptz created_at
    }

    %% Startup Profiles & Dashboard Features
    auth_users ||--o{ STARTUPS : "creates"
    ORGS ||--o{ STARTUPS : "owns"
    
    STARTUPS {
        uuid id PK
        uuid user_id FK "References auth.users"
        uuid org_id FK "References orgs"
        text name
        text website_url
        text tagline
        text logo_url
        text cover_image_url
        integer year_founded
        text description
        jsonb traction_data
        jsonb team_data
        jsonb needs_data
        integer profile_strength "0-100"
        boolean is_public
        timestamptz created_at
        timestamptz updated_at
    }
    
    STARTUPS ||--o{ JOBS : "posts"
    
    JOBS ||--o{ JOB_APPLICATIONS : "receives"
    auth_users ||--o{ JOB_APPLICATIONS : "applies"
    
    JOBS {
        uuid id PK
        uuid startup_id FK "References startups"
        text title
        text description
        text location
        text job_type "full_time, part_time, contract, internship"
        text salary_range
        text application_url
        timestamptz created_at
        timestamptz updated_at
    }
    
    JOB_APPLICATIONS {
        uuid id PK
        uuid user_id FK "References auth.users"
        uuid job_id FK "References jobs"
        text status "applied, reviewed, interview, rejected, accepted"
        timestamptz applied_at
        unique(user_id, job_id)
    }

    %% Events & Community Features
    EVENTS ||--o{ EVENT_REGISTRATIONS : "has"
    auth_users ||--o{ EVENT_REGISTRATIONS : "registers"
    
    EVENTS {
        uuid id PK
        text title
        text description
        timestamptz event_date
        text location
        text event_type "workshop, hackathon, demo_day, networking"
        text registration_url
        text image_url
        timestamptz created_at
        timestamptz updated_at
    }
    
    EVENT_REGISTRATIONS {
        uuid id PK
        uuid user_id FK "References auth.users"
        uuid event_id FK "References events"
        text status "registered, attended, cancelled"
        timestamptz registered_at
        unique(user_id, event_id)
    }

    %% User Bookmarks & Saved Content
    auth_users ||--o{ SAVED_OPPORTUNITIES : "saves"
    
    SAVED_OPPORTUNITIES {
        uuid id PK
        uuid user_id FK "References auth.users"
        text opportunity_type "event, job, perk, blog"
        uuid opportunity_id
        timestamptz created_at
        unique(user_id, opportunity_type, opportunity_id)
    }

    %% Observability & Audit Trail
    PROFILES ||--o{ AI_RUNS : "performs"
    PROFILES ||--o{ AUDIT_LOG : "creates"
    
    AI_RUNS {
        uuid id PK
        uuid user_id FK "References profiles"
        text tool_name
        jsonb args_json
        text status "success, error"
        integer duration_ms
        numeric cost_estimate
        timestamptz created_at
    }
    
    AUDIT_LOG {
        uuid id PK
        uuid user_id FK "References profiles"
        text action "INSERT, UPDATE, DELETE"
        text table_name
        uuid row_id
        jsonb diff "Before/after changes"
        timestamptz created_at
    }

    %% Storage Buckets (Conceptual)
    STORAGE_BUCKETS {
        text id PK "avatars, startup-logos, startup-covers, deck-assets, deck-exports"
        boolean public
    }
    
    ASSETS }o--o| STORAGE_BUCKETS : "stored_in"
    PROFILES }o--o| STORAGE_BUCKETS : "avatar_in"
    STARTUPS }o--o| STORAGE_BUCKETS : "logo_in"
    STARTUPS }o--o| STORAGE_BUCKETS : "cover_in"
```

## Key Relationships

### Core Hierarchy
- **auth.users** → **profiles** (1:1) - User authentication extends to profile
- **profiles** → **orgs** (1:many) - Users can own multiple organizations
- **orgs** → **org_members** (1:many) - Organizations have multiple members with roles
- **orgs** → **decks** (1:many) - Organizations own pitch decks
- **orgs** → **startups** (1:many) - Organizations can have multiple startups

### Pitch Deck Structure
- **decks** → **slides** (1:many) - Decks contain multiple slides
- **slides** → **assets** (1:many) - Slides can have multiple assets (images, charts)
- **slides** → **citations** (1:many) - Slides can reference multiple sources
- **decks** → **share_links** (1:many) - Decks can have multiple share links
- **decks** ↔ **startups** (many:many) - Decks can be linked to startup profiles

### Dashboard Features
- **startups** → **jobs** (1:many) - Startups post multiple jobs
- **events** → **event_registrations** (1:many) - Events have multiple registrations
- **users** → **saved_opportunities** (1:many) - Users save multiple opportunities
- **users** → **job_applications** (1:many) - Users apply to multiple jobs

### Observability
- **profiles** → **ai_runs** (1:many) - Users perform multiple AI operations
- **profiles** → **audit_log** (1:many) - Users create multiple audit entries

## Table Count Summary

| Category | Tables | Description |
|----------|--------|-------------|
| **Core** | 3 | profiles, orgs, org_members |
| **Pitch Decks** | 5 | decks, slides, assets, citations, share_links |
| **Dashboard** | 3 | startups, jobs, job_applications |
| **Community** | 3 | events, event_registrations, saved_opportunities |
| **Observability** | 2 | ai_runs, audit_log |
| **Storage** | 5 | avatars, startup-logos, startup-covers, deck-assets, deck-exports |
| **Total** | **21** | All tables with RLS enabled |

## Key Features

### Multi-Tenant Support
- Organizations with role-based access (owner, admin, editor, viewer)
- `get_user_role()` helper function for RLS policies
- Org-level data isolation

### Flexible Deck Storage
- **Option 1**: JSONB storage in `decks.slides` (quick MVP)
- **Option 2**: Normalized `slides` table (advanced features)
- Both supported simultaneously

### Security Model
- Row Level Security (RLS) on all tables
- Role-based permissions via `org_members.role`
- Storage bucket policies for file access
- Audit trail for all changes

### Community Features
- Event management and registrations
- Job board with applications
- Saved opportunities (bookmarks)
- Public/private startup profiles

### AI Integration
- `ai_runs` table logs all Gemini API calls
- Tracks cost, duration, and status
- Links to user profiles for analytics
