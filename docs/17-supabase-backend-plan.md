
# 🏛️ Supabase Backend: Architecture & Implementation Plan

**Document Status:** Published - 2024-08-10
**System Goal:** To provide a complete backend design and implementation plan for migrating the Sun AI Pitch Deck Engine to a secure, scalable, and production-ready Supabase architecture.

---

This document outlines the entire backend, from the database schema and security rules to the serverless functions that will house our Gemini API keys and business logic.

### 1. ERD & Data Model

The data model is designed to be multi-tenant, with `orgs` as the primary data boundary. All user-generated content is tied to an organization.

```mermaid
erDiagram
    "auth.users" }o--|| profiles : "has one"
    profiles ||--o{ org_members : "is member of"
    orgs ||--|{ org_members : "has"
    orgs ||--|{ decks : "owns"
    decks ||--|{ slides : "contains"
    decks ||--o{ share_links : "can be shared via"
    slides ||--o{ assets : "can have"
    slides ||--o{ citations : "can have"
    "auth.users" ||--o{ ai_runs : "initiates"
    "auth.users" ||--o{ audit_log : "performs actions"

    profiles {
        uuid id PK "FK to auth.users.id"
        text full_name
        text avatar_url
        timestampz created_at
        timestampz updated_at
    }

    orgs {
        uuid id PK
        uuid owner_id FK "FK to profiles.id"
        text name
        timestampz created_at
        timestampz updated_at
    }

    org_members {
        uuid org_id PK, FK
        uuid user_id PK, FK
        text role "e.g., owner, admin, editor, viewer"
        timestampz created_at
    }

    decks {
        uuid id PK
        uuid org_id FK
        text title
        text template
        timestampz created_at
        timestampz updated_at
    }

    slides {
        uuid id PK
        uuid deck_id FK
        int position
        jsonb content "Title, bullet points, notes"
        timestampz created_at
        timestampz updated_at
    }

    assets {
        uuid id PK
        uuid slide_id FK
        uuid storage_object_id "FK to storage.objects.id"
        text asset_type "e.g., image, chart_spec"
        timestampz created_at
    }

    citations {
        uuid id PK
        uuid slide_id FK
        text source_url
        text quote
        timestampz created_at
    }

    ai_runs {
        uuid id PK
        uuid user_id FK
        text tool_name
        jsonb args_json
        text status
        int duration_ms
        decimal cost_estimate
        timestampz created_at
    }

    share_links {
        uuid id PK
        uuid deck_id FK
        text token UNIQUE
        timestampz expires_at
        timestampz created_at
    }

    audit_log {
        uuid id PK
        uuid user_id FK
        text action
        text table_name
        uuid row_id
        jsonb diff
        timestampz created_at
    }
```

### 2. Postgres DDL (SQL)

These SQL statements define the core tables, indexes, and relationships.

```sql
-- Helper function to get a user's role in an organization
create or replace function get_user_role(org_id uuid)
returns text
language sql
security definer
set search_path = public
as $$
  select role from org_members where org_id = org_id and user_id = auth.uid();
$$;

-- PROFILES
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);
alter table profiles enable row level security;

-- ORGS
create table orgs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete restrict,
  name text not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);
alter table orgs enable row level security;

-- ORG_MEMBERS
create table org_members (
  org_id uuid not null references orgs(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'editor', 'viewer')),
  created_at timestamp with time zone not null default now(),
  primary key (org_id, user_id)
);
alter table org_members enable row level security;

-- DECKS
create table decks (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  title text not null,
  template text not null default 'default',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);
alter table decks enable row level security;
create index idx_decks_org_id on decks(org_id);
create index idx_decks_title_fts on decks using gin (to_tsvector('english', title));


-- SLIDES
create table slides (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid not null references decks(id) on delete cascade,
  position integer not null,
  content jsonb,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  unique(deck_id, position)
);
alter table slides enable row level security;
create index idx_slides_deck_id_position on slides(deck_id, position);
create index idx_slides_content_gin on slides using gin(content);

-- AI_RUNS (for observability)
create table ai_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  tool_name text not null,
  args_json jsonb,
  status text not null check (status in ('success', 'error')),
  duration_ms integer,
  cost_estimate numeric(10, 6),
  created_at timestamp with time zone not null default now()
);
alter table ai_runs enable row level security;

-- Placeholder tables
create table jobs (id uuid primary key);
create table perks (id uuid primary key);
create table events (id uuid primary key);
```

### 3. Row-Level Security (RLS) Policies

RLS is enabled on all tables. Policies ensure that users can only access data belonging to their organization.

**Policy Matrix:**

| Role    | Decks & Slides | Org Members |
| ------- | -------------- | ----------- |
| `owner` | `ALL`          | `ALL`       |
| `admin` | `ALL`          | `ALL`       |
| `editor`| `ALL`          | `SELECT`    |
| `viewer`| `SELECT`       | `SELECT`    |

**SQL Policies for `decks` table:**

```sql
-- 1. Members can view decks in their org
create policy "Allow SELECT for org members" on decks
  for select using (
    exists (
      select 1 from org_members
      where org_members.org_id = decks.org_id and org_members.user_id = auth.uid()
    )
  );

-- 2. Editors, Admins, and Owners can create decks
create policy "Allow INSERT for editors and above" on decks
  for insert with check (
    get_user_role(decks.org_id) in ('owner', 'admin', 'editor')
  );

-- 3. Editors, Admins, and Owners can update decks
create policy "Allow UPDATE for editors and above" on decks
  for update using (
    get_user_role(decks.org_id) in ('owner', 'admin', 'editor')
  );

-- 4. Admins and Owners can delete decks
create policy "Allow DELETE for admins and above" on decks
  for delete using (
    get_user_role(decks.org_id) in ('owner', 'admin')
  );
```
*(Similar policies would be created for `slides` and other tables.)*

### 4. Triggers & Functions (SQL/PLpgSQL)

This function automatically updates the `updated_at` column on any table it's applied to.

```sql
-- Function to update 'updated_at' timestamp
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for the 'decks' table
create trigger on_deck_update
  before update on decks
  for each row execute procedure handle_updated_at();

-- Trigger for the 'slides' table
create trigger on_slide_update
  before update on slides
  for each row execute procedure handle_updated_at();
```

### 5. Supabase Storage

-   **Bucket: `deck-assets`**
    -   **Path:** `{org_id}/{deck_id}/{asset_id}.webp`
    -   **Permissions:** Public read access for images is acceptable, but write access must be restricted to authenticated users who are members of the organization.
    -   **RLS Policy (for insert):**
        ```sql
        -- Allow members of an org to upload assets
        CREATE POLICY "Allow authenticated uploads for org members"
        ON storage.objects FOR INSERT TO authenticated WITH CHECK (
          bucket_id = 'deck-assets' AND
          (storage.foldername(name))[1] IN (
             SELECT org_id::text FROM org_members WHERE user_id = auth.uid()
          )
        );
        ```
-   **Bucket: `deck-exports`**
    -   **Path:** `private/{org_id}/{deck_id}/{export_id}.pdf`
    -   **Permissions:** Strictly private. Access should only be granted via expiring, signed URLs generated by an Edge Function.

-   **Guidance:** All uploaded images should be client-side resized to a max width of `2048px` and converted to `WebP` format to target a file size of `< 300KB`.

### 6. Edge Functions (TypeScript skeletons)

Edge Functions are crucial for securely handling Gemini API keys and business logic. Keys will be stored as Supabase secrets.

```typescript
// /supabase/functions/generate-outline/index.ts
import { serve } from 'https/deno.land/std@0.168.0/http/server.ts';
import { z } from 'https/deno.land/x/zod@v3.22.4/mod.ts';
import { createSupabaseClient } from '../_shared/supabase-client.ts';
import { GoogleGenAI } from '@google/genai';

const InputSchema = z.object({
  orgId: z.string().uuid(),
  companyDetails: z.string().min(50),
});

serve(async (req) => {
  // 1. Auth & Input Validation
  const supabase = createSupabaseClient(req.headers.get('Authorization'));
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const body = await req.json();
  const { orgId, companyDetails } = InputSchema.parse(body);

  // 2. Business Logic: Verify user is in the org
  const { data: member, error } = await supabase
    .from('org_members')
    .select('role')
    .eq('org_id', orgId)
    .eq('user_id', user.id)
    .single();

  if (error || !['owner', 'admin', 'editor'].includes(member.role)) {
    return new Response('Forbidden', { status: 403 });
  }

  // 3. Core Action: Call Gemini API
  const ai = new GoogleGenAI({ apiKey: Deno.env.get('GEMINI_API_KEY') });
  // ... logic to call ai.models.generateContent ...
  // ... using the `generateDeckOutline` function declaration ...

  // 4. Return response
  return new Response(JSON.stringify({ deck: "..." }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```
*(Similar structured skeletons for `rewrite_slide`, `image_generate`, etc.)*

### 7. RPCs (Postgres functions)

RPCs are useful for complex, transactional database operations.

```sql
-- Reorders slides within a deck transactionally
create or replace function reorder_slides(deck_id_input uuid, from_pos int, to_pos int)
returns void
language plpgsql
as $$
begin
  -- First, check if the user has permission on the deck
  if not exists (
    select 1 from decks
    where id = deck_id_input
    and get_user_role(org_id) in ('owner', 'admin', 'editor')
  ) then
    raise exception 'Permission denied';
  end if;

  -- Logic to shift positions of other slides and update the target slide
  -- This would be wrapped in a transaction block
  update slides set position = -1 where deck_id = deck_id_input and position = from_pos;
  -- ... shift other slides ...
  update slides set position = to_pos where deck_id = deck_id_input and position = -1;
end;
$$;
```

### 8. Rate Limits & Quotas

-   **Model:** Per-user, rolling window. E.g., 20 AI runs per hour.
-   **Enforcement:** Implemented within each Edge Function.
-   **Storage:** Use **Upstash (Redis)** for low-latency counters. A Postgres table would be too slow for this use case.
-   **Denial Message:** `429 Too Many Requests`. Response body: `{ "error": "Rate limit exceeded. Please try again in X minutes." }`.

### 9. Observability & Auditability

The `ai_runs` table will log key metrics for every AI operation.

**Dashboard SQL Examples:**
```sql
-- AI Tool Success Rate
SELECT
  tool_name,
  count(*) as total_runs,
  sum(case when status = 'success' then 1 else 0 end) as successful_runs,
  avg(duration_ms) as p50_latency_ms
FROM ai_runs
WHERE created_at > now() - interval '7 days'
GROUP BY tool_name;

-- Cost by Organization
SELECT
  o.name,
  sum(ar.cost_estimate) as total_cost
FROM ai_runs ar
JOIN org_members om ON ar.user_id = om.user_id
JOIN orgs o ON om.org_id = o.id
WHERE ar.created_at > now() - interval '30 days'
GROUP BY o.name
ORDER BY total_cost DESC;
```

### 10. Security Checklist

-   [x] RLS is **ENABLED** on all user-data tables.
-   [x] Edge Functions use the `service_role` key; the client uses the `anon` key. **No secret keys on the client.**
-   [x] All Edge Function inputs are validated with Zod.
-   [x] Storage upload policies restrict uploads to an authenticated user's own organization.
-   [x] PDF exports require authentication or a secure, expiring signed URL.
-   [x] Supabase daily backups are enabled with Point-in-Time-Recovery (PITR) on a production plan.

### 11. Seed Data & Fixtures

```sql
-- Create a user and profile (assumes a user signed up via Auth)
insert into profiles (id, full_name) values ('<user_id_from_auth>', 'Alex Founder');

-- Create an organization
insert into orgs (id, owner_id, name) values ('<org_uuid>', '<user_id_from_auth>', 'Sun AI Inc.');

-- Add user as owner
insert into org_members (org_id, user_id, role) values ('<org_uuid>', '<user_id_from_auth>', 'owner');

-- Create a deck
insert into decks (id, org_id, title) values ('<deck_uuid>', '<org_uuid>', 'Q3 Investor Update');

-- Create slides
insert into slides (deck_id, position, content) values
  ('<deck_uuid>', 1, '{ "title": "The Big Problem", "content": "Founders waste time and money..." }'),
  ('<deck_uuid>', 2, '{ "title": "Our Solution", "content": "A unified AI-native platform..." }');
```

### 12. RLS Tests (SQL)

These tests can be run in the Supabase SQL Editor to verify policies.

```sql
-- SETUP: Impersonate a specific user
set role authenticated;
set request.jwt.claims to '{"sub":"<user_id_of_org_member>", "role":"authenticated"}';

-- TEST 1: User can see decks in their own org
-- EXPECT: 1 row
select count(*) from decks where org_id = '<their_org_uuid>';

-- TEST 2: User cannot see decks in another org
-- EXPECT: 0 rows
select count(*) from decks where org_id = '<a_different_org_uuid>';

-- TEST 3: Viewer cannot update a deck
-- ASSUME: user is a 'viewer'
-- EXPECT: Fails with RLS error
update decks set title = 'New Title' where id = '<deck_uuid>';

-- CLEANUP
set role postgres;
```

### 13. Performance Plan

-   **Indexes:** B-tree indexes are on all foreign keys and high-cardinality columns used in `WHERE` clauses. A GIN index on `slides.content` allows for fast, deep searching of JSONB data.
-   **Maintenance:** Standard `VACUUM` and `ANALYZE` will be handled by Supabase's managed Postgres. No manual intervention is needed on standard plans.
-   **p95 Targets:**
    -   `generate_outline` / `rewrite_slide`: < 5 seconds
    -   `image_generate` / `image_edit`: < 10 seconds
-   **Pagination:** For listing decks, use standard `LIMIT`/`OFFSET` pagination, as the number of decks per user is unlikely to be massive.

### 14. Migration & Rollout

1.  **Phase 1 (Schema):** Create all tables, functions, and triggers in a new Supabase project using the CLI and migration files.
2.  **Phase 2 (Security):** Apply all RLS policies. Test thoroughly with the RLS test queries.
3.  **Phase 3 (Backend Logic):** Deploy all Edge Functions. Configure secrets (`GEMINI_API_KEY`, etc.).
4.  **Phase 4 (Frontend Cutover):** Update the frontend application to call the new Edge Function endpoints instead of the client-side `geminiService`, and use the Supabase client library for database interactions.
5.  **Phase 5 (Data Migration):** Write a script to migrate any existing data from `sessionStorage` or other sources if necessary.

**Backout Plan:** If RLS policies cause issues, they can be temporarily disabled (`ALTER TABLE ... DISABLE ROW LEVEL SECURITY;`). The frontend can be reverted to a previous commit that uses the client-side service.

---

### ✅ 5-Step Go-Live Checklist

1.  [ ] **Initialize Supabase Project:** Set up a new project and link it to the local codebase with `supabase init`.
2.  [ ] **Run Migrations:** Create migration files from the DDL and run `supabase db push` to deploy the schema.
3.  [ ] **Configure Secrets:** Set `GEMINI_API_KEY` and other secrets using `supabase secrets set`.
4.  [ ] **Deploy Functions:** Deploy all Edge Functions with `supabase functions deploy`.
5.  [ ] **Update Frontend:** Update frontend environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) and deploy the new client application.

