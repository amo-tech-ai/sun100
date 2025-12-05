
# 📐 Sun AI Startup Platform: Architectural Diagrams & Documentation

**Document Status:** Live System Map  
**Target Audience:** Engineering, Product, & System Architects  
**Scope:** Full-Stack (Frontend, Backend, Database, AI Agents)

This document contains the complete technical visualization of the Sun AI ecosystem, including the Pitch Deck Engine, Command Center, VC Matching, and Data Room.

---

## 1️⃣ High-Level Architecture

This diagram illustrates the cloud-native architecture connecting the React frontend, Supabase backend services, and the Google Gemini AI engine.

```mermaid
graph TD
    subgraph "Client Layer"
        Browser[Web Browser]
        Mobile[Mobile View]
    end

    subgraph "Hosting & CDN (Vercel)"
        Vite[React + Vite App]
    end

    subgraph "Backend Services (Supabase)"
        Auth[Supabase Auth]
        DB[(PostgreSQL Database)]
        Storage[File Storage Buckets]
        Edge[Edge Functions (Node/Deno)]
    end

    subgraph "AI Intelligence Layer (Google Cloud)"
        GeminiFlash[Gemini 2.5 Flash]
        GeminiPro[Gemini 3 Pro]
        Search[Google Search Grounding]
        Embed[Text Embeddings]
    end

    Browser -->|HTTPS| Vite
    Vite -->|API Requests| Edge
    Vite -->|Session/Auth| Auth
    Vite -->|Direct Read (RLS)| DB
    
    Edge -->|Secure Key Access| GeminiPro
    Edge -->|Vector Search| Embed
    Edge -->|Queries| DB
    Edge -->|File Mgmt| Storage
    
    GeminiPro -->|Grounding Request| Search
```

### Key Components
1.  **Frontend:** React/TypeScript hosted on Vercel.
2.  **Backend:** Supabase handles Identity, Database (Postgres), and Storage.
3.  **Middleware:** Edge Functions act as the secure gateway for AI operations.
4.  **AI Engine:** Gemini 3 Pro handles reasoning (Strategy, Matching), while Flash handles high-volume tasks (Chat, summarization).

---

## 2️⃣ User Journey Flows

### A. Founder Journey
The lifecycle of a startup founder using the platform.

```mermaid
flowchart LR
    A[Onboarding] --> B{Setup Profile};
    B --> C[Pitch Deck Wizard];
    B --> D[Startup Command Center];
    
    C --> C1[Generate Deck];
    C1 --> C2[AI Editor];
    C2 --> C3[Publish/Export];
    
    D --> D1[Input Metrics];
    D1 --> D2[Generate Reports];
    D2 --> D3[Build Data Room];
    
    D3 --> E[Fundraising];
    E --> E1[Directory Search];
    E1 --> E2[AI Matching];
    E2 --> E3[Apply to VCs];
```

### B. Investor / VC Journey
How investors interact with deal flow.

```mermaid
flowchart LR
    A[Login] --> B[Investor Dashboard];
    B --> C{Deal Flow};
    
    C --> D[Review Applications];
    C --> E[Directory Matches];
    
    D --> D1[View Pitch Deck];
    D1 --> D2[Request Data Room];
    D2 --> D3[AI Due Diligence Summary];
    
    E --> E1[Filter Startups];
    E1 --> E2[Outbound Contact];
```

---

## 3️⃣ Workflows & Logic

### A. Pitch Deck AI Agent Workflow
The process of transforming raw ideas into a visual presentation.

```mermaid
sequenceDiagram
    actor User
    participant UI as Editor UI
    participant Edge as Edge Function
    participant AI as Gemini 3 Pro
    participant Img as Imagen/Flash-Image
    participant DB as Database

    User->>UI: Enter Startup Details / URL
    UI->>Edge: POST /generate-deck
    Edge->>AI: Prompt (Structure + Content)
    AI-->>Edge: JSON Slide Structure
    
    par Parallel Processing
        Edge->>Img: Generate Slide Images (x10)
        Edge->>AI: Generate Speaker Notes
    end
    
    Img-->>Edge: Image URLs
    Edge->>DB: Save Deck & Slides
    DB-->>UI: Return Deck ID
    UI->>User: Render Deck Editor
```

### B. VC Matching Engine Logic
How we score the compatibility between a Startup and an Investor.

```mermaid
flowchart TD
    subgraph "Inputs"
        S[Startup Profile]
        V[VC Firm Profile]
    end

    subgraph "Matching Processor (Edge Function)"
        S & V --> A[Data Normalization]
        A --> B{Criteria Check}
        
        B -->|Stage Fit?| C1[Score +]
        B -->|Sector Fit?| C2[Score +]
        B -->|Check Size?| C3[Score +]
        B -->|Geo Fit?| C4[Score +]
        
        C1 & C2 & C3 & C4 --> D[Weighted Calculation]
        D --> E[Gemini Reasoning]
        E -->|Generate| F[Match Explanation]
    end

    F --> G[Final Match Score (0-100%)]
```

### C. Startup Command Center Ecosystem
How data flows between the operational tools.

```mermaid
graph TD
    Metrics[Metrics Table] -->|Inputs| Agents
    Docs[Uploaded Files] -->|Context| Agents
    
    subgraph "AI Agents Layer"
        GTM[GTM Strategy Agent]
        Proj[Financial Projection Agent]
        Market[Market Sizing Agent]
        Audit[Data Room Auditor]
    end
    
    GTM -->|Creates| StratDoc[Strategy Document]
    Proj -->|Creates| Forecast[3-Year Forecast]
    Market -->|Search Grounding| TAM_SAM_SOM[Market Data]
    Audit -->|Scans| Room[Data Room Score]
    
    StratDoc & Forecast & TAM_SAM_SOM -->|Aggregated Into| InvestorUpdate[Investor Update Email]
```

---

## 4️⃣ Database Entity Relationship Diagram (ERD)

The schema powering the entire platform.

```mermaid
erDiagram
    %% Core
    users ||--o{ startups : owns
    startups ||--o{ pitch_decks : has
    startups ||--o{ startup_metrics : tracks
    
    %% Pitch Decks
    pitch_decks ||--o{ slides : contains
    pitch_decks ||--o{ deck_ai_insights : generates
    
    %% VC Directory & Matching
    vc_firms ||--o{ investment_ranges : defines
    vc_firms ||--o{ firm_specialties : has
    startups ||--o{ applications : submits
    vc_firms ||--o{ applications : receives
    applications ||--|| match_results : has
    
    %% Command Center
    startups ||--o{ investor_docs : creates
    startups ||--o{ data_room_files : stores
    data_room_files ||--o{ file_audit_logs : has

    users {
        uuid id PK
        string email
        string role
    }

    startups {
        uuid id PK
        uuid user_id FK
        string name
        string industry
        string stage
        int funding_goal
    }

    pitch_decks {
        uuid id PK
        uuid startup_id FK
        string title
        json theme_config
        status status
    }

    vc_firms {
        uuid id PK
        string name
        string thesis
        string website
        int min_check
        int max_check
    }

    match_results {
        uuid id PK
        uuid application_id FK
        float score
        text ai_explanation
    }

    startup_metrics {
        uuid id PK
        uuid startup_id FK
        date month
        decimal mrr
        decimal burn_rate
        decimal cash_in_bank
    }
```

---

## 5️⃣ AI Agent Orchestration

How different specialized agents interact within the system.

```mermaid
sequenceDiagram
    participant User
    participant Orch as Orchestrator (Edge)
    participant GTM as GTM Agent
    participant Fin as Projection Agent
    participant Search as Search Tool
    
    User->>Orch: "Create Fundraising Pack"
    
    rect rgb(20, 20, 20)
        Note right of Orch: Parallel Execution
        Orch->>Search: Research Competitors
        Orch->>Fin: Analyze Historical Metrics
    end
    
    Search-->>Orch: Market Data
    Fin-->>Orch: 3-Year Forecast
    
    Orch->>GTM: Generate Strategy (using Market Data)
    GTM-->>Orch: GTM Plan
    
    Orch->>Orch: Synthesize into One-Pager
    Orch-->>User: Return Complete Data Pack
```

---

## 6️⃣ System C4 Model (Container Level)

```mermaid
C4Container
    title Container Diagram - Sun AI Startup Platform

    Person(founder, "Founder", "User building a startup")
    Person(investor, "Investor", "VC reviewing deals")

    System_Boundary(sun_ai, "Sun AI Platform") {
        Container(web_app, "Web Application", "React, Vite", "Provides UI for decks, dashboard, and directory")
        Container(api, "Edge API", "Supabase Edge Functions", "Handles business logic and AI orchestration")
        ContainerDb(database, "Database", "PostgreSQL", "Stores relational data")
        Container(storage, "File Storage", "Supabase Storage", "Stores deck images, PDFs, and assets")
    }

    System_Ext(google_ai, "Google Gemini API", "LLM for text, code, and image generation")
    System_Ext(google_search, "Google Search", "Grounding for market data")

    Rel(founder, web_app, "Uses", "HTTPS")
    Rel(investor, web_app, "Uses", "HTTPS")
    
    Rel(web_app, api, "API Calls", "JSON/HTTPS")
    Rel(web_app, database, "Realtime Subscriptions", "WSS")
    
    Rel(api, database, "Reads/Writes", "SQL")
    Rel(api, storage, "Manages Assets", "API")
    
    Rel(api, google_ai, "Prompts & Context", "gRPC/HTTPS")
    Rel(google_ai, google_search, "Retrieves Info", "Internal")
```

---

## 7️⃣ Completeness & Improvements

### ✅ Completeness Checklist
- [x] **Frontend:** React architecture defined.
- [x] **Backend:** Supabase services mapped.
- [x] **Database:** Core entities and relationships defined.
- [x] **AI:** Agent flows and model usage specified.
- [x] **Core Modules:** Pitch Deck, Directory, Command Center workflows included.

### ⚠️ Missing Components List
1.  **Notification Service:** No diagram for email/push notifications (e.g., "Investor viewed your deck").
2.  **Payment Gateway:** Stripe integration architecture is implied but not explicitly diagrammed.
3.  **Analytics Pipeline:** Flow for tracking user behavior (PostHog/Mixpanel) is missing.

### 💡 Recommended Improvements
1.  **Vector Database Integration:** Explicitly map `pgvector` in the ERD for storing embedding vectors of startup descriptions and VC theses to improve matching quality beyond keyword filtering.
2.  **Async Queue System:** For heavy AI tasks (e.g., generating a full video or auditing a massive data room), introduce a job queue (Supabase/PgBoss) to prevent timeouts on Edge Functions.
3.  **Caching Layer:** Add Redis or similar caching for "Market Sizing" results to reduce API costs and latency for repeated queries on similar industries.

