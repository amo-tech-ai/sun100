# 🗺️ Implementation Plan: Restore Missing Pages & Align with Sitemap

**Document Status:** ✅ Implemented & Validated - 2024-08-19
**Author:** Senior Frontend Architect
**System Goal:** To restore all missing pages as defined in `docs/sitemap.md`, bringing the application to functional completeness. This plan details the creation of placeholder components for all missing routes and their integration into the main `App.tsx` router.

---

### 1. Executive Summary & Audit

An audit revealed a critical discrepancy: the running application is missing a significant number of pages that are documented in the official sitemap (`docs/sitemap.md`). This includes both public-facing community pages and core authenticated application screens.

This plan addresses the issue by restoring all missing pages as functional, placeholder components. This action aligns the codebase with its documentation, completes the application's surface area, and prepares the platform for future feature implementation on these pages.

---

### 2. File Impact Analysis

| File | Reason for Modification / Creation | Status |
| :--- | :--- | :--- |
| `App.tsx` | **Modified:** To import and add routes for all the newly created screen components. | ✅ Completed |
| `screens/About.tsx` | **Created:** Placeholder component for the "About Us" page. | ✅ Completed |
| `screens/Perks.tsx` | **Created:** Placeholder component for the "Community Perks" list page. | ✅ Completed |
| `screens/PerkDetail.tsx` | **Created:** Placeholder for the perk detail page. | ✅ Completed |
| `screens/Events.tsx` | **Created:** Placeholder for the public "Events" list page. | ✅ Completed |
| `screens/EventDetail.tsx` | **Created:** Placeholder for the event detail page. | ✅ Completed |
| `screens/Jobs.tsx` | **Created:** Placeholder for the "Jobs" board page. | ✅ Completed |
| `screens/JobDetail.tsx` | **Created:** Placeholder for the job detail page. | ✅ Completed |
| `screens/HowItWorks.tsx`| **Created:** Placeholder for the "How It Works" page. | ✅ Completed |
| `screens/Blogs.tsx`| **Created:** Placeholder for the "Blog" list page. | ✅ Completed |
| `screens/BlogDetail.tsx`| **Created:** Placeholder for the blog detail page. | ✅ Completed |
| `screens/Services.tsx`| **Created:** Placeholder for the "Services" overview page. | ✅ Completed |
| `screens/WebDesign.tsx`| **Created:** Placeholder for the web design service page. | ✅ Completed |
| `screens/LogoBranding.tsx`| **Created:** Placeholder for the branding service page. | ✅ Completed |
| `screens/MvpDevelopment.tsx`| **Created:** Placeholder for the MVP development service page. | ✅ Completed |
| `screens/StartupWizard.tsx`| **Created:** Placeholder for the "Startup Profile Wizard" in the dashboard. | ✅ Completed |
| `screens/PitchDecks.tsx`| **Created:** Placeholder for the "My Pitch Decks" hub page. | ✅ Completed |
| `screens/MyEvents.tsx`| **Created:** Placeholder for the "My Events" dashboard page. | ✅ Completed |
| `screens/EventWizard.tsx`| **Created:** Placeholder for the "Create New Event" wizard. | ✅ Completed |
| `Sitemap.tsx`| **Modified:** To accurately list all newly restored routes, making it a true living document. | ✅ Completed |

---

### 3. Routing Architecture Diagrams

#### Current State (Before Implementation)
This diagram shows the limited set of routes that were implemented, highlighting the large gaps compared to the official sitemap.

```mermaid
graph TD
    subgraph "Public"
        A[/] --> Landing
        B[/terms]
        C[/privacy]
    end

    subgraph "App"
        D[/dashboard] --> Dashboard
        E[...] --> WizardSteps
        F[...] --> GeneratingScreen
        G[...] --> DeckEditor
        H[...] --> PresentationScreen
    end

    I[/*] --> NotFound
```

#### Target State (After Implementation - ✅ Achieved)
This diagram illustrates the complete, correct routing architecture with all pages restored and organized under their respective layouts.

```mermaid
graph TD
    subgraph "PublicLayout"
        A[/] --> Landing
        B[/terms]
        C[/privacy]
        D[/about]
        E[/perks] --> F[/perks/:id]
        G[/events] --> H[/events/:id]
        I[/jobs] --> J[/jobs/:id]
        K[/how-it-works]
        L[/blogs] --> M[/blogs/:id]
        N[/services] --> O[/services/web-design]
        N --> P[/services/logo-branding]
        N --> Q[/services/mvp-development]
    end

    subgraph "DashboardLayout"
        R[/dashboard] --> Dashboard
        S[/dashboard/startup-wizard]
        T[/dashboard/my-events]
        U[/dashboard/events/new]
        V[/pitch-decks] --> PitchDecksHub
        W[/pitch-decks/new] --> WizardSteps
        X[/pitch-decks/generating]
        Y[/pitch-decks/:id/edit] --> DeckEditor
        Z[/pitch-decks/:id/publish-success]
        AA[/dashboard/sitemap]
    end
    
    subgraph "No Layout"
        BB[/pitch-decks/:id/present] --> PresentationScreen
    end

    CC[/*] --> NotFound
```

---

### 4. Implementation Plan

1.  **Step 1: Create Placeholder Screen Components:**
    -   **Action:** For every missing page in `docs/sitemap.md`, a new React component file was created in the `screens/` directory.
    -   **Details:** Each component is a simple, functional React component that renders a basic placeholder UI. This ensures that every route has a valid component to render, preventing application crashes.
    -   **Status:** ✅ **Completed.**

2.  **Step 2: Update Application Router (`App.tsx`):**
    -   **Action:** All newly created screen components were imported into `App.tsx` using `React.lazy` for efficient code-splitting.
    -   **Details:** The `<Routes>` configuration was updated to include a `<Route>` for every new page, correctly nested within the appropriate layout (`<PublicLayout />` or `<DashboardLayout />`).
    -   **Status:** ✅ **Completed.**

3.  **Step 3: Update Live Sitemap (`Sitemap.tsx`):**
    -   **Action:** The `Sitemap.tsx` component, which serves as a live visualization of the app's routes, was updated to include all the newly restored pages.
    -   **Details:** This ensures that our internal developer tools remain accurate and reflect the true state of the application.
    -   **Status:** ✅ **Completed.**

4.  **Step 4: Verify Navigation Links:**
    -   **Action:** A manual check was performed on all navigation elements (`Sidebar.tsx`, `PublicLayout.tsx`) to confirm that links pointing to the restored pages are now functional.
    -   **Details:** No code changes were needed in the navigation components, as the links were already present; they now resolve correctly because the routes exist.
    -   **Status:** ✅ **Completed.**

---

### 5. Production-Ready Checklist & Validation

| Category | Criteria | Status |
| :--- | :--- | :--- |
| **Routing** | All routes defined in `docs/sitemap.md` are implemented in `App.tsx` and render a component without error. | ✅ **Validated** |
| **Component Rendering** | Each new placeholder component renders its placeholder content correctly. | ✅ **Validated** |
| **Navigation** | All links in `Sidebar.tsx` and `PublicLayout.tsx` navigate to the correct, newly created pages. | ✅ **Validated** |
| **Code Splitting** | All new components are loaded using `React.lazy` to ensure optimal application performance. | ✅ **Validated** |
| **Documentation** | The live sitemap at `/dashboard/sitemap` accurately reflects the complete and correct routing structure of the application. | ✅ **Validated** |
| **Final Result**| The application is now functionally complete at the routing level, and the codebase is aligned with its documentation. | ✅ **Validated** |