# 🚀 Best Practices Plan: Full-Stack Pitch Deck Wizard

**Document Status:** Published - 2024-08-18 (Revised for Custom Backend)
**Author:** Senior Full-Stack Architect
**System Goal:** To provide a detailed, step-by-step Best Practices Plan for building the Pitch Deck Wizard end-to-end, migrating from a client-side prototype to a secure, scalable, and production-ready full-stack feature powered by a custom backend and the Gemini API.

---

### 📊 **Progress Tracker: From Scratch Development**

This tracker outlines the complete development lifecycle for the Pitch Deck Wizard, starting from the initial frontend prototype and integrating a full suite of advanced Gemini capabilities.

| Phase | Feature / Task | Status | % Complete | Key Objective |
| :---- | :--- | :--- | :--- | :--- |
| **1. Frontend Scaffolding** | **Wizard UI Scaffolding (`WizardSteps.tsx`)** | 🔴 Not Started | 0% | Build the core UI, including tab switching for different input methods. |
| | **URL Input Component (`UrlInput.tsx`)** | 🔴 Not Started | 0% | Create the reusable component for adding, validating, and removing URLs. |
| | **File Input Component** | 🔴 Not Started | 0% | Create a UI for uploading documents (PDF, DOCX). |
| | **Client-Side State Management** | 🔴 Not Started | 0% | Manage form state and button logic using React hooks. |
| | **Generating Screen UI (`GeneratingScreen.tsx`)** | 🔴 Not Started | 0% | Build the loading screen with informative text for the user. |
| **2. Core AI Engine** | **Backend Service (`/api/ai/generate-deck`)** | 🔴 Not Started | 0% | Create the secure endpoint in our custom backend for all AI logic, protecting the API key. |
| | **AI Technique: Structured Outputs (Function Calling)** | 🔴 Not Started | 0% | Implement `generateDeckOutline` as a function call for 100% reliable JSON output. |
| | **Input Method: Text Generation** | 🔴 Not Started | 0% | The baseline feature: generate a deck from a user's written business context. |
| | **Input Method: URL Context** | 🔴 Not Started | 0% | Allow the AI to crawl up to 5 public URLs to gather context and generate the deck. |
| | **Input Method: Document Understanding (File Search)** | 🔴 Not Started | 0% | Allow users to upload a business plan (PDF, DOCX) to be used as the primary source. |
| | **Enrichment: Google Search** | 🔴 Not Started | 0% | Use Google Search to augment user-provided context or find relevant URLs if none are given. |
| | **Output: Image Generation Prompts** | 🔴 Not Started | 0% | The AI will generate descriptive prompts for the `imageUrl` field, preparing slides for the Visual Agent. |
| | **Output: Code Execution Snippets** | 🔴 Not Started | 0% | For technical decks, the AI can generate placeholder code snippets for product demo slides. |
| | **Configuration: Gemini Thinking** | 🔴 Not Started | 0% | Utilize `thinkingConfig` for complex analysis of source documents to improve outline quality. |
| **3. Full-Stack Integration** | **Database Schema (`decks`, `slides`)** | 🔴 Not Started | 0% | Define and migrate the core tables in Cloud SQL for persistent storage. |
| | **Row-Level Security (RLS) Policies** | 🔴 Not Started | 0% | Implement security policies to ensure users can only access their own data. |
| | **New Service Layers (`deckService`, `aiService`)** | 🔴 Not Started | 0% | Create frontend services to interact with the custom backend API and database. |
| | **Refactor Wizard (`WizardSteps.tsx`)** | 🔴 Not Started | 0% | Replace any client-side generation with a call to the secure `/api/ai/generate-deck` endpoint. |
| | **Refactor Generating Screen (`GeneratingScreen.tsx`)** | 🔴 Not Started | 0% | Implement polling logic to check for deck creation status in the database. |
| **4. Validation & Polish** | **UI/UX Polish & Responsiveness** | 🔴 Not Started | 0% | Ensure the entire wizard flow is mobile-friendly and visually polished. |
| | **End-to-End (E2E) Flow Validation** | 🔴 Not Started | 0% | Perform a full smoke test of the complete full-stack user journey for all input methods. |
| | **Security & RLS Policy Testing** | 🔴 Not Started | 0% | Manually test that users cannot access or modify data from other accounts. |

---

### 1. System Analysis

-   **Current State:** The application is a feature-rich, client-side React app. The wizard exists in `WizardSteps.tsx` and calls a client-side `geminiService.ts`. This is excellent for prototyping but poses two major production risks: **security** (API key exposure) and **scalability** (no persistent user data).
-   **Target State:** A secure full-stack application where the frontend is the presentation layer, and all business logic, data persistence, and AI communication are handled by a custom backend (e.g., Node.js on Cloud Run). This plan aligns with the previously defined backend and frontend migration plans.

---

### 2. Architecture Diagram

This sequence diagram illustrates the complete, secure workflow for generating a deck from a URL.

```mermaid
sequenceDiagram
    participant User
    participant Client as React Wizard
    participant Backend as Cloud Run Service
    participant DB as Cloud SQL
    participant Gemini as Gemini API

    User->>Client: Enters URLs and clicks "Generate"
    Client->>Backend: POST /api/ai/generate-deck { urls }
    Backend->>Backend: Authenticate user & validate input
    Backend->>Gemini: generateContent({ tools: [urlContext, generateDeckOutline] })
    Gemini-->>Backend: Returns structured deck via function call
    Backend->>DB: INSERT into decks (deck record)
    Backend->>DB: INSERT into slides (all generated slides)
    DB-->>Backend: Confirm transaction success
    Backend-->>Client: Returns { deckId }
    Client->>Client: Navigate to Generating Screen, polling for deck readiness
```

---

### 3. Wizard Stages & Flow

The wizard will be a single, powerful screen with a responsive two-column layout: form on the left, live-updating preview on the right.

| Stage | Purpose & UX | Frontend Components | Backend Interaction | AI & URL Context |
| :---- | :--- | :--- | :--- | :--- |
| **1. Input & Sourcing** | The user chooses their input source: providing business context via text or pasting up to 5 website URLs. | `WizardSteps.tsx`, `UrlInput.tsx` | None. This is a client-side state. | `urlContext` is prepared for the next step. |
| **2. AI Generation** | User clicks "Generate Deck". The app navigates to a loading screen while the backend works. | `GeneratingScreen.tsx` | **`POST /api/ai/generate-deck` to our backend service.** | **Gemini Pro + `urlContext`.** The backend securely calls Gemini, providing the URLs and asking it to generate a 10-slide outline via a function call. |
| **3. Review & Edit** | The user is navigated to the Deck Editor to review the newly created, AI-populated deck. | `DeckEditor.tsx` | **`GET /api/decks/:id` from `deckService.ts`.** | The user can now use all other AI agents (Copilot, Image, etc.) on the generated content. |
| **4. Finalize & Share** | The user completes their edits and can present or share the deck. | `DeckEditor.tsx`, `PresentationScreen.tsx` | Future: `POST /api/share-links`. | N/A |

---

### 4. Frontend Plan

-   **Layout:** A responsive two-column layout for the wizard screen (`WizardSteps.tsx`).
-   **State Management:** A React Context (`WizardContext`) will manage the wizard's state.
-   **Transitions & Loading:** All backend calls will trigger loading states.
-   **Service Layers:**
    -   **`services/aiService.ts`:** Will replace `geminiService.ts`. It will contain wrappers for calling our backend's AI endpoints.
    -   **`services/deckService.ts`:** Will handle all database interactions via our backend API.

---

### 5. Backend Plan

-   **Database Schema:** We will use the schema defined in `docs/46-cloude-sql.md`. The key tables are `decks` and `slides`. RLS policies are critical for multi-tenancy.
-   **Backend Service (`/api/ai/generate-deck`):**
    -   **Method:** `POST`
    -   **Auth:** JWT required.
    -   **Input Validation (Zod):** `{ inputMode: 'text' | 'url', content: string | string[] }`
    -   **Logic:**
        1. Authenticate user.
        2. Validate input.
        3. Call Gemini API with the appropriate prompt and `urlContext` if needed.
        4. On success, start a database transaction to insert the new deck and slides.
        5. Return `{ deckId }`.
    -   **Security:** Rate limiting per user.

---

### 6. Testing & Validation

(Remains the same as the original plan, focusing on unit, integration, security, E2E, and failure tests.)

---

### 7. Success Criteria & Summary

The wizard implementation will be a success when:
-   **Security:** All Gemini API keys are fully removed from the client-side code.
-   **Persistence:** A user can log in, create a deck, and find it saved in their account later.
-   **Reliability:** The generation process is robust and transactional.
-   **User Experience:** The process is fast, intuitive, and provides clear feedback.
