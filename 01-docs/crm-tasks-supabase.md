
# 🗄️ CRM Task Management: Supabase Architecture

**Document Status:** Planning - 2025-01-21
**Goal:** To define the complete database schema, security policies, and backend logic required to support the CRM Task Management system.

---

## 1. Schema Design

The `crm_tasks` table is the core entity. It is designed to be multi-tenant (via `startup_id`) and relational (linking to accounts and users).

### Table: `public.crm_tasks`

| Column | Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | `gen_random_uuid()` | Primary Key. |
| `startup_id` | `uuid` | No | - | Foreign Key to `startups`. **Critical for RLS.** |
| `account_id` | `uuid` | Yes | - | Foreign Key to `crm_accounts`. Links task to a customer. |
| `assigned_to` | `uuid` | Yes | - | Foreign Key to `auth.users`. The team member responsible. |
| `created_by` | `uuid` | No | `auth.uid()` | The user who created the task. |
| `title` | `text` | No | - | The main task description. |
| `description` | `text` | Yes | - | Detailed notes or requirements. |
| `due_date` | `timestamptz` | Yes | - | Deadline. |
| `completed` | `boolean` | No | `false` | Simple status flag. |
| `priority` | `text` | No | `'medium'` | Enum: `low`, `medium`, `high`, `urgent`. |
| `tags` | `text[]` | Yes | - | Array of tags for filtering. |
| `created_at` | `timestamptz` | No | `now()` | Timestamp of creation. |
| `updated_at` | `timestamptz` | No | `now()` | Timestamp of last update. |

### SQL Definition

```sql
CREATE TABLE public.crm_tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id uuid NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
    account_id uuid REFERENCES public.crm_accounts(id) ON DELETE SET NULL,
    assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_by uuid NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
    title text NOT NULL,
    description text,
    due_date timestamptz,
    completed boolean NOT NULL DEFAULT false,
    priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    tags text[],
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add comment
COMMENT ON TABLE public.crm_tasks IS 'Tasks and to-dos linked to CRM accounts and startups.';
```

---

## 2. Performance Indexes

To ensure the dashboard loads instantly, specific columns must be indexed.

1.  **Tenant Filter:** `startup_id` is used in *every* query to enforce isolation.
2.  **Dashboard Views:** Users often filter by "My Tasks" (`assigned_to`) and "Due Date".
3.  **Account View:** The Customer Detail panel fetches tasks by `account_id`.

```sql
-- Critical for RLS and multi-tenancy
CREATE INDEX idx_crm_tasks_startup_id ON public.crm_tasks(startup_id);

-- For "My Tasks" dashboard widget
CREATE INDEX idx_crm_tasks_assigned_to ON public.crm_tasks(assigned_to) WHERE completed = false;

-- For sorting by urgency
CREATE INDEX idx_crm_tasks_due_date ON public.crm_tasks(due_date) WHERE completed = false;

-- For Customer Detail Panel lookups
CREATE INDEX idx_crm_tasks_account_id ON public.crm_tasks(account_id);
```

---

## 3. Row-Level Security (RLS)

We utilize the existing helper function `get_user_role(startup_id)` to enforce access control.

**Policy Strategy:**
*   **View:** Members can view all tasks in their startup.
*   **Create:** Members can create tasks.
*   **Update:** Members can update any task (collaborative model).
*   **Delete:** Only Admins/Owners can delete tasks (to prevent data loss), OR the creator of the task.

```sql
ALTER TABLE public.crm_tasks ENABLE ROW LEVEL SECURITY;

-- 1. SELECT: Allow members to view tasks
CREATE POLICY "Members can view startup tasks" ON public.crm_tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.startup_id = crm_tasks.startup_id
      AND team_members.user_id = auth.uid()
    )
  );

-- 2. INSERT: Allow members to create tasks
CREATE POLICY "Members can create tasks" ON public.crm_tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.startup_id = crm_tasks.startup_id
      AND team_members.user_id = auth.uid()
    )
  );

-- 3. UPDATE: Allow members to update tasks
CREATE POLICY "Members can update tasks" ON public.crm_tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.startup_id = crm_tasks.startup_id
      AND team_members.user_id = auth.uid()
    )
  );

-- 4. DELETE: Owners/Admins or Creator
CREATE POLICY "Owners, Admins, or Creator can delete" ON public.crm_tasks
  FOR DELETE USING (
    (created_by = auth.uid()) OR
    (
      SELECT role FROM public.team_members
      WHERE startup_id = crm_tasks.startup_id
      AND user_id = auth.uid()
    ) IN ('owner', 'admin')
  );
```

---

## 4. Automation & Triggers

### Timestamp Maintenance
Ensure `updated_at` is always fresh.

```sql
CREATE TRIGGER on_crm_tasks_update
  BEFORE UPDATE ON public.crm_tasks
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
```

### Interaction Logging (Advanced)
Optionally, completing a task linked to an account could auto-log an interaction.

```sql
-- Concept:
-- IF OLD.completed = false AND NEW.completed = true AND NEW.account_id IS NOT NULL THEN
--   INSERT INTO crm_interactions (startup_id, account_id, type, summary, date)
--   VALUES (NEW.startup_id, NEW.account_id, 'Task', 'Completed task: ' || NEW.title, now());
-- END IF;
```

---

## 5. Edge Functions (Backend Logic)

### `send-task-reminder` (Cron Job)
*   **Trigger:** Scheduled daily via `pg_cron` or Supabase Cron.
*   **Logic:**
    1.  Query `crm_tasks` where `due_date` is tomorrow AND `completed` is false.
    2.  Group by `assigned_to`.
    3.  Lookup user emails.
    4.  Send a digest email: "You have 3 tasks due tomorrow."
*   **AI Integration:** Use Gemini to summarize the tasks and suggest priorities in the email body.

### `process-recurring-tasks` (Cron Job)
*   **Trigger:** Daily.
*   **Logic:** Check for tasks tagged `#recurring`. If completed, clone them with a new due date (e.g., +7 days).

### `suggest-tasks` (AI Assistant)
*   **Trigger:** User click on "AI Suggest".
*   **Input:** Recent `crm_interactions` for an account.
*   **Logic:** "Based on the last email where the client asked for pricing, create a task to 'Send Pricing PDF' due in 2 days."
*   **Output:** JSON array of proposed tasks.

---

## 6. Implementation Checklist

- [ ] **Migration:** Create `.sql` file with Table, Indexes, and RLS policies.
- [ ] **Apply:** Run `supabase db push`.
- [ ] **Types:** Update `database.types.ts` to include `priority` and `tags`.
- [ ] **Frontend:** Update `TaskFormModal.tsx` to support the new fields (Priority dropdown).
- [ ] **Backend:** Deploy `send-task-reminder` Edge Function.
