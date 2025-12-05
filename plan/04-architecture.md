# System Architecture & Data Flow

**Last Updated:** 2024-08-20
**Version:** 1.0
**Status:** Published

## 1. Entity Relationship Diagram (ERD)

This ERD represents the complete relational schema for our PostgreSQL database on Google Cloud SQL. It is designed for multi-tenancy, scalability, and observability, serving as the single source of truth for our data model.

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

## 2. C4 Deployment Diagram

This diagram illustrates the high-level system architecture and data flow for the production environment, which is deployed on Google Cloud Platform. It shows how the user-facing frontend application interacts with the custom backend, database, and external services.

```mermaid
C4Deployment
    title Deployment Diagram for Sun AI Startup (Production on Google Cloud)

    Deployment_Node(browser, "User's Device") {
        Deployment_Node(web_browser, "Web Browser", "Chrome, Firefox, Safari") {
            Container(spa, "Single-Page Application", "React / Vite", "Provides the complete Sun AI user interface.")
        }
    }

    Deployment_Node(gcp, "Google Cloud Platform") {
        Deployment_Node(gcp_project, "GCP Project") {
            Deployment_Node(cloud_run, "Cloud Run Service", "Serverless Container Platform") {
                Container(api, "API Server", "Node.js / Express", "Handles all business logic, validates user authentication, and makes secure calls to the Gemini API.")
            }
            Deployment_Node(cloud_sql, "Cloud SQL", "Managed PostgreSQL 15") {
                Database(db, "sun_ai_database", "Stores all application data: users, decks, events, etc.")
            }
            Deployment_Node(cloud_storage, "Cloud Storage", "Object Storage") {
                Container(storage, "Asset Storage", "Bucket", "Stores user-generated assets like uploaded images and generated PDFs.")
            }
        }
    }
    
    Deployment_Node(external_services, "External Services") {
        Deployment_Node(google_ai, "Google AI Platform") {
            System_Ext(gemini, "Gemini API", "Provides generative AI models for content, images, and analysis.")
        }
        
        Deployment_Node(clerk, "Clerk Auth Service") {
            System_Ext(clerk_auth, "Clerk API", "Manages user authentication, sign-up, login, and session tokens (JWTs).")
        }
    }
    
    Rel(spa, clerk_auth, "Authenticates user via SDK", "HTTPS")
    Rel(spa, api, "Makes API calls with JWT", "HTTPS/REST")
    
    Rel(api, clerk_auth, "Validates JWT on every request", "HTTPS")
    Rel(api, db, "Reads/writes data", "SQL over private connection / Cloud SQL Proxy")
    Rel(api, storage, "Uploads/serves assets securely", "HTTPS")
    Rel(api, gemini, "Makes secure, server-to-server API calls", "HTTPS")
```

### Data Flow Explanation

1.  **User Authentication:** The user interacts with the React frontend, which uses the Clerk SDK to handle sign-up and login. Upon successful authentication, Clerk issues a JSON Web Token (JWT).
2.  **API Requests:** For any action requiring backend interaction (e.g., saving a deck), the React app sends a request to our Node.js API on Cloud Run, including the JWT in the `Authorization` header.
3.  **Backend Logic:**
    *   The Cloud Run service receives the request and uses Clerk's backend SDK to validate the JWT.
    *   If valid, it executes the required business logic.
    *   If the logic requires AI, the backend makes a secure, server-to-server call to the Gemini API with the protected API key.
    *   If the logic requires database interaction, it connects to the Cloud SQL instance over a secure connection and performs the query. Row-Level Security (RLS) in the database ensures the query only accesses data the user is permitted to see.
4.  **Response:** The backend service sends a response back to the client, which then updates the UI.
