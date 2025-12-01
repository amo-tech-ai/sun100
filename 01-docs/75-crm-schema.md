
# 🗄️ Database Schema: CRM Module

**Document Status:** Published - 2024-09-06
**Author:** Lead Database Architect
**Goal:** Define the SQL schema for the Customer CRM module, enabling relationship tracking for startups.

---

### 1. Tables Overview

The CRM module introduces five new tables designed for multi-tenancy (linked to `startups` via `startup_id`).

| Table | Purpose | Key Fields |
| :--- | :--- | :--- |
| **`crm_accounts`** | Stores companies/clients. | `name`, `segment`, `status`, `mrr`, `health_score` |
| **`crm_contacts`** | Individual people at accounts. | `email`, `role`, `account_id` |
| **`crm_deals`** | Potential revenue opportunities. | `value`, `stage`, `probability`, `expected_close_date` |
| **`crm_interactions`** | History of emails, calls, notes. | `type`, `summary`, `sentiment` |
| **`crm_tasks`** | Action items linked to accounts. | `title`, `due_date`, `completed` |

---

### 2. DDL (SQL)

```sql
--
-- CRM ACCOUNTS (Companies/Customers)
--
CREATE TABLE public.crm_accounts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id uuid NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
    name text NOT NULL,
    logo_url text,
    segment text CHECK (segment IN ('Enterprise', 'SMB', 'Mid-Market', 'Partner')),
    status text CHECK (status IN ('Active', 'Churned', 'Trial', 'Lead')),
    mrr numeric DEFAULT 0,
    health_score integer DEFAULT 50, -- 0-100
    last_interaction_at timestamptz,
    renewal_date date,
    owner_id uuid REFERENCES auth.users(id), -- Assigned team member
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.crm_accounts ENABLE ROW LEVEL SECURITY;

--
-- CRM CONTACTS (People)
--
CREATE TABLE public.crm_contacts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id uuid NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
    account_id uuid REFERENCES public.crm_accounts(id) ON DELETE CASCADE,
    first_name text NOT NULL,
    last_name text,
    email text,
    role text,
    linkedin_url text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;

--
-- CRM DEALS (Pipeline)
--
CREATE TABLE public.crm_deals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id uuid NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
    account_id uuid REFERENCES public.crm_accounts(id) ON DELETE SET NULL,
    name text NOT NULL,
    value numeric DEFAULT 0,
    stage text CHECK (stage IN ('Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost')),
    probability integer DEFAULT 0, -- 0-100%
    expected_close_date date,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.crm_deals ENABLE ROW LEVEL SECURITY;

--
-- CRM INTERACTIONS (Activity Feed)
--
CREATE TABLE public.crm_interactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id uuid NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
    account_id uuid REFERENCES public.crm_accounts(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id), -- Who logged it
    type text CHECK (type IN ('email', 'call', 'meeting', 'note')),
    summary text NOT NULL,
    date timestamptz DEFAULT now(),
    sentiment text CHECK (sentiment IN ('Positive', 'Neutral', 'Negative')),
    created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.crm_interactions ENABLE ROW LEVEL SECURITY;

--
-- CRM TASKS (To-Do)
--
CREATE TABLE public.crm_tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id uuid NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
    account_id uuid REFERENCES public.crm_accounts(id) ON DELETE CASCADE,
    assigned_to uuid REFERENCES auth.users(id),
    title text NOT NULL,
    due_date timestamptz,
    completed boolean DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.crm_tasks ENABLE ROW LEVEL SECURITY;

--
-- Automation Triggers
--
CREATE TRIGGER on_crm_account_update BEFORE UPDATE ON public.crm_accounts FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER on_crm_contact_update BEFORE UPDATE ON public.crm_contacts FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER on_crm_deal_update BEFORE UPDATE ON public.crm_deals FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER on_crm_task_update BEFORE UPDATE ON public.crm_tasks FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
```

### 3. RLS Policies (Standard Template)

Apply these policies to all CRM tables (`crm_accounts`, `crm_contacts`, etc.) to ensure users only access data belonging to their startup.

```sql
CREATE POLICY "Users can manage their startup's CRM data."
    ON public.crm_accounts -- Repeat for all CRM tables
    FOR ALL
    USING (
        startup_id IN (
            SELECT startup_id FROM public.team_members WHERE user_id = auth.uid()
        )
    );
```
