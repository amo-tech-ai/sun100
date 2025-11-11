# Implementation Plan & Progress Tracker: Cloud SQL Schema

**Document Status:** Planning - 2025-01-17
**Author:** Lead Database Architect
**Goal:** This document provides a series of actionable prompts to guide a database engineer in implementing the complete PostgreSQL schema, as defined in `docs/46-cloude-sql.md`, on a Google Cloud SQL instance. Each task is designed to incorporate best practices for data integrity, security, and performance.

---

### Status Legend

| Status | Meaning |
| :--- | :--- |
| 🔴 **Not Started** | The task is planned but no work has begun. |
| 🟡 **In Progress** | The task is actively being developed or deployed. |
| ✅ **Completed** | The task is fully implemented, tested, and validated. |

---

## Phase 1: Core Schema Implementation

**Goal:** To establish the foundational tables and relationships that define the application's data structure.

| Task | Prompt / Best Practice Implementation | Status |
| :--- | :--- | :--- |
| **1.1: Implement User & Auth Schema** | **Prompt:** Create the `profiles` table to extend `auth.users`. Use `uuid` as the primary key and enforce an `ON DELETE CASCADE` foreign key constraint. **Best Practice:** This ensures that when a user is deleted from the authentication system, their corresponding profile is automatically and cleanly removed, maintaining referential integrity. | 🔴 Not Started |
| **1.2: Implement Multi-Tenant Schema** | **Prompt:** Define the `orgs` and `org_members` tables. For `org_members`, use a composite primary key (`org_id`, `user_id`) to guarantee a user has only one role per organization. Implement a `CHECK` constraint on the `role` column to enforce a strict set of valid roles (e.g., 'owner', 'admin', 'editor'). | 🔴 Not Started |
| **1.3: Implement Pitch Deck Schema** | **Prompt:** Create the `decks` and `slides` tables. On the `slides` table, enforce a `UNIQUE` constraint on `(deck_id, position)` to prevent duplicate slide numbers within the same deck. Add a `CHECK` constraint to the `type` column to ensure only valid, predefined slide types are used. | 🔴 Not Started |
| **1.4: Implement Community Features Schema** | **Prompt:** Roll out the schema for all community features (`startups`, `jobs`, `events`, etc.). Apply `UNIQUE` constraints where necessary to model real-world business rules, such as `unique(user_id, job_id)` in the `job_applications` table to prevent a user from applying to the same job multiple times. | 🔴 Not Started |
| **1.5: Implement Observability Schema** | **Prompt:** Create the `ai_runs` and `audit_log` tables. Use the `jsonb` data type for the `args_json` and `diff` columns. **Best Practice:** `jsonb` provides efficient storage and querying for semi-structured data, making it ideal for logging flexible AI inputs and tracking data changes. | 🔴 Not Started |

#### ✅ Success Criteria
- All tables exist in the database and their structures match the ERD in `docs/46-cloude-sql.md`.
- All primary keys, foreign keys, and constraints (UNIQUE, CHECK) are correctly defined.
- An `INSERT` statement with invalid data (e.g., a non-existent role in `org_members` or a duplicate slide position) is correctly rejected by a database constraint.

#### 📋 Production-Ready Checklist
- [ ] **Consistency:** Naming conventions (snake_case) are consistent across all tables and columns.
- [ ] **Data Types:** Data types are appropriate for the stored data (e.g., `timestamptz` for dates, `uuid` for IDs).
- [ ] **Integrity:** `NOT NULL` constraints are applied to all columns where data is mandatory.
- [ ] **Version Control:** All DDL (Data Definition Language) is captured in a version-controlled Supabase migration file.

---

## Phase 2: Automation with Functions & Triggers

**Goal:** To reduce application-layer logic and improve data consistency by using database automation.

| Task | Prompt / Best Practice Implementation | Status |
| :--- | :--- | :--- |
| **2.1: Create `updated_at` Function** | **Prompt:** Write the `handle_updated_at()` PL/pgSQL trigger function. Ensure it correctly sets `new.updated_at = now()`. **Best Practice:** This centralizes the logic for updating timestamps, ensuring consistency and reducing the risk of developers forgetting to update this field from the application code. | 🔴 Not Started |
| **2.2: Apply Timestamps Triggers** | **Prompt:** Apply the `handle_updated_at` function as a `BEFORE UPDATE` trigger to all tables that have an `updated_at` column, such as `decks` and `slides`. This guarantees the timestamp accurately reflects the last modification time. | 🔴 Not Started |

#### ✅ Success Criteria
- The `handle_updated_at()` function is created and compiles without errors.
- Performing an `UPDATE` on a row in the `decks` table automatically changes its `updated_at` value without the application needing to specify it.
- The `created_at` column of a row is **not** affected when the trigger fires on an update.

#### 📋 Production-Ready Checklist
- [ ] **Security:** The trigger function is defined with `SECURITY DEFINER` as a best practice to control its execution context.
- [ ] **Performance:** The trigger logic is confirmed to be lightweight and does not introduce significant overhead on write operations.
- [ ] **Version Control:** All function and trigger definitions are captured in a Supabase migration file.

---

## Phase 3: Security Implementation

**Goal:** To secure the database with a multi-tenant security model, ensuring users can only access data belonging to their organization.

| Task | Prompt / Best Practice Implementation | Status |
| :--- | :--- | :--- |
| **3.1: Enable Row-Level Security (RLS)** | **Prompt:** As a foundational security measure, execute `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` on every table containing user or organization data. **Best Practice:** This enforces a "deny-all" security posture by default, preventing accidental data exposure. | 🔴 Not Started |
| **3.2: Implement `get_user_role` Helper** | **Prompt:** Create the `get_user_role(org_id)` SQL function with `SECURITY DEFINER`. **Best Practice:** `SECURITY DEFINER` allows the function to execute with the permissions of its owner, enabling it to securely check a user's role without granting the calling user direct access to the `org_members` table. | 🔴 Not Started |
| **3.3: Apply RLS Policies** | **Prompt:** Systematically create and apply the RLS policies for `SELECT`, `INSERT`, `UPDATE`, and `DELETE` operations on core tables like `decks`. Use the `get_user_role` function within these policies to create a robust, role-based access control system. | 🔴 Not Started |

#### ✅ Success Criteria
- By default, a newly authenticated user with no organization membership receives `0` rows from `SELECT count(*) FROM decks`.
- A user with a 'viewer' role can `SELECT` from a deck in their organization, but an `UPDATE` statement fails with an RLS permission error.
- A user with an 'editor' role can successfully `UPDATE` a deck in their organization.
- A user cannot perform any action (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) on data from an organization they are not a member of.

#### 📋 Production-Ready Checklist
- [ ] **Coverage:** Every table containing user data has RLS enabled. There are no exceptions.
- [ ] **Completeness:** Policies cover all four operations (SELECT, INSERT, UPDATE, DELETE) as required by the business logic.
- [ ] **Validation:** The RLS test suite from `docs/46-cloude-sql.md` passes for all defined user roles.
- [ ] **Version Control:** All RLS policies are captured in a Supabase migration file.

---

## Phase 4: Performance Optimization

**Goal:** To ensure the database can handle application queries efficiently at scale.

| Task | Prompt / Best Practice Implementation | Status |
| :--- | :--- | :--- |
| **4.1: Apply Foreign Key Indexes** | **Prompt:** Create B-tree indexes on all foreign key columns (e.g., `decks.org_id`, `slides.deck_id`). **Best Practice:** This is the most critical optimization for relational databases, as it dramatically speeds up `JOIN` operations. | 🔴 Not Started |
| **4.2: Apply Full-Text Search Indexes** | **Prompt:** Implement GIN (Generalized Inverted Index) indexes on text-heavy columns that will be searched by users, such as `decks.title` and a composite index on `slides` (`title`, `content`). Use the `to_tsvector` function to prepare the text for indexing. | 🔴 Not Started |
| **4.3: Apply Specialized Indexes** | **Prompt:** Add a composite B-tree index on `(deck_id, position)` for the `slides` table. This is essential for quickly fetching a deck's slides in the correct order. | 🔴 Not Started |

#### ✅ Success Criteria
- `EXPLAIN ANALYZE` on a query that `JOIN`s `decks` and `slides` shows an "Index Scan" on the foreign keys, not a "Seq Scan."
- A full-text search query on the `slides` table uses the GIN index.
- A query to `SELECT * FROM slides WHERE deck_id = '...' ORDER BY position` uses the composite index on `(deck_id, position)`.

#### 📋 Production-Ready Checklist
- [ ] **Efficiency:** No redundant indexes are created (e.g., an index on `(a, b)` makes a separate index on `(a)` unnecessary in many cases).
- [ ] **Impact Assessment:** The performance impact of indexes on write operations (INSERT/UPDATE) is considered and deemed acceptable.
- [ ] **Version Control:** All index creation scripts are included in the Supabase migration files.

---

## Phase 5: Validation & Seeding

**Goal:** To verify that the entire schema is implemented correctly and to populate the database with initial data for development and testing.

| Task | Prompt / Best Practice Implementation | Status |
| :--- | :--- | :--- |
| **5.1: Create Seed Data Script** | **Prompt:** Write `INSERT` statements to create a test user, organization, deck, and slides. **Best Practice:** A consistent seed script ensures all developers have a uniform testing environment, speeding up development and reducing "it works on my machine" issues. | 🔴 Not Started |
| **5.2: Create RLS Test Script** | **Prompt:** Write the `SET ROLE` and `SELECT`/`UPDATE` statements to test RLS policies for different user roles, as outlined in the architecture document. This script formalizes the manual testing process. | 🔴 Not Started |
| **5.3: Perform Schema Peer Review** | **Prompt:** Conduct a final peer review where another engineer compares the live database schema (or migration files) against the ERD in `docs/46-cloude-sql.md`. Check for correct data types, constraints, and naming conventions. | 🔴 Not Started |

#### ✅ Success Criteria
- The seed script runs without errors and successfully populates the database with consistent test data.
- The RLS test script produces the expected outcomes (e.g., rows returned for allowed queries, RLS errors for denied queries).
- The peer review confirms that the implemented schema perfectly matches the design document, and any discrepancies are resolved.

#### 📋 Production-Ready Checklist
- [ ] **Repository:** The seed and RLS test scripts are added to the project repository.
- [ ] **Documentation:** The process for running the scripts is clearly documented for new developers.
- [ ] **Sign-off:** The schema is formally signed off by the lead engineer or architect before being deployed to production.