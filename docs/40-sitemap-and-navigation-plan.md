
# 🗺️ Sitemap & Navigation Expansion Plan

**Document Status:** Published - 2024-08-17 (Revised & Approved)
**Author:** Senior UX Architect & Product Strategist
**Goal:** To provide a comprehensive, production-ready sitemap and navigation plan that evolves the sun ai startup platform from a core functional tool into a complete, user-friendly, and commercially viable platform.

---

### 1. Executive Summary & Goal

The current application provides an excellent core user journey for creating and presenting pitch decks. However, to support a public launch and long-term growth, it must be supplemented with standard informational, legal, and community-building pages.

This plan outlines a strategic expansion of the sitemap. The goal is to build user trust, improve SEO and discoverability, ensure legal compliance, and create pathways for community engagement.

---

### 2. Proposed Expanded Sitemap

This proposed sitemap includes all necessary pages for a mature web application. The authentication and public-facing pages will be rolled out in phases.

```
/ (Public Landing Page)
├── /terms
├── /privacy
├── /login (Future)
├── /signup (Future)
/dashboard (App Root)
├── /decks/new (Wizard)
├── /decks/generating
├── /decks/:id
│   ├── /edit
│   └── /present
└── /sitemap
```

---

### 3. Visual Sitemap Flowchart

This diagram illustrates the relationship between public-facing pages, authentication, and the core application. Authentication will be added in a future phase.

```mermaid
graph TD
    subgraph "Public Website"
        A[/ - Landing] --> F[Login & Signup (Future)];
    end

    subgraph "Legal (Footer)"
        G[/terms];
        H[/privacy];
    end

    subgraph "Core Application"
        I[/dashboard] --> J{Deck List};
        J --> K[/decks/new - Wizard];
        J --> L[/decks/:id/edit];
        L --> M[/decks/:id/present];
        K --> N[/decks/generating];
        N --> L;
    end

    A -- Direct Access --> I;
    F -.-> I;
    A -.-> G;
    A -.-> H;
```

---

### 4. Strategic Value of New Pages

| Page Category | Pages | Business Purpose | Real-World Example |
| :--- | :--- | :--- | :--- |
| **Public & SEO** | `about`, `contact`, `blog` | Build brand trust, tell the company story, and attract organic traffic through content marketing. | A potential user searches for "pitch deck tips" and finds a relevant article on the Sun AI blog, discovering the tool. |
| **Authentication** | `login`, `signup` | Provide a secure and standard entry point for new and returning users to access the core application. | A user returning to the site clicks "Login" to access their saved decks. |
| **Legal** | `terms`, `privacy` | Ensure legal compliance (GDPR, CCPA), protect the company, and inform users of their rights and responsibilities. | A user signs up and agrees to the Terms of Service, creating a clear legal agreement. |

---

### 5. Technical Implementation Plan

This section details the required architectural changes to support the expanded sitemap.

#### 5.1. Core Routing Technology
- **Router:** Use `BrowserRouter` instead of `HashRouter` for clean URLs, which is critical for Search Engine Optimization (SEO).
- **Code Splitting:** Implement `React.lazy()` and `<Suspense>` to load heavy components like the `DeckEditor` on demand, improving initial page load performance.

#### 5.2. Target Routing Architecture (`App.tsx`)

The application's routing will be restructured to separate public and application routes using layout components. A `ProtectedRoute` will be added in a future phase.

```tsx
// screens/App.tsx (Target Structure)
<BrowserRouter>
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      {/* --- Public Routes --- */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Landing />} />
        <Route path="terms" element={<Terms />} />
        <Route path="privacy" element={<Privacy />} />
      </Route>

      {/* --- App Routes (Will be protected later) --- */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/decks/new" element={<WizardSteps />} />
        <Route path="/decks/generating" element={<GeneratingScreen />} />
        <Route path="/decks/:id/edit" element={<DeckEditor />} />
        <Route path="/sitemap" element={<Sitemap />} />
      </Route>

      {/* --- Full-screen/Special Route --- */}
      <Route path="/decks/:id/present" element={<PresentationScreen />} />

      {/* --- 404 Fallback Route --- */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
</BrowserRouter>
```

---

### 6. Phased Implementation Plan

This rollout strategy prioritizes the most critical pages and technical changes first, deferring authentication.

#### Phase 1: Foundation & Public Pages (High Priority)
- **Goal:** Establish the new routing architecture, create a public landing page, and add required legal pages.
- **Tasks:**
    - [x] Create `PublicLayout.tsx` for all public-facing pages.
    - [x] Create placeholder components: `Landing.tsx`, `Terms.tsx`, `Privacy.tsx`.
    - [x] Refactor `App.tsx` completely to use the corrected routing architecture.
    - [x] Update the `Sidebar.tsx` and all internal navigation to use the new, consistent route paths.
    - [x] Add a `NotFound.tsx` page for a better user experience on invalid URLs.

#### Phase 2: Authentication Layer (Future Enhancement)
- **Goal:** Secure the application with user accounts.
- **Tasks:**
    - [ ] Integrate an authentication service (e.g., Supabase Auth).
    - [ ] Create `Login.tsx` and `Signup.tsx` screens.
    - [ ] Create a `ProtectedRoute.tsx` component to guard authenticated routes.
    - [ ] Wrap all application routes in `App.tsx` with the `ProtectedRoute`.

---

### 7. Production-Ready Checklist (for Phase 1)

-   **Routing:**
    -   [x] All routes are defined in `App.tsx` following the new nested structure.
    -   [x] Public routes (`/`, `/terms`, `/privacy`) correctly render inside `PublicLayout`.
    -   [x] Application routes (`/dashboard`, etc.) correctly render inside `DashboardLayout`.
    -   [x] The fallback route correctly renders the new `NotFound` component.
-   **UI:**
    -   [x] `PublicLayout` has a distinct header/footer from the core application layout.
    -   [x] The `Sidebar` footer has been updated with working links to the Terms and Privacy pages.
    -   [x] All new pages are responsive and mobile-friendly.
-   **Performance:**
    -   [x] Heavy components are lazy-loaded to improve initial load time.