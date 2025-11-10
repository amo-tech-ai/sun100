# Application Sitemap

This document outlines the routing structure of the Sun AI Pitch Deck Engine, organized by the layout components that wrap the routes. This reflects the architecture in `App.tsx`.

---

## 1. Public Routes (`<PublicLayout />`)

These routes are accessible to all visitors and are wrapped in a public-facing layout with a header and footer.

-   **`/`**: `Landing.tsx` - The main landing page for the application.
-   **`/terms`**: `Terms.tsx` - The Terms of Service page.
-   **`/privacy`**: `Privacy.tsx` - The Privacy Policy page.
-   **`/about`**: `About.tsx` - Information about the Sun AI community.
-   **`/perks`**: `Perks.tsx` - List of available perks for members.
-   **`/perks/:id`**: `PerkDetail.tsx` - Details for a specific perk.
-   **`/events`**: `Events.tsx` - List of upcoming community events.
-   **`/events/:id`**: `EventDetail.tsx` - Details for a specific event.
-   **`/jobs`**: `Jobs.tsx` - Career board for AI startups.
-   **`/jobs/:id`**: `JobDetail.tsx` - Details for a specific job posting.
-   **`/how-it-works`**: `HowItWorks.tsx` - Explanation of the community platform.
-   **`/blogs`**: `Blogs.tsx` - Community blog and articles.
-   **`/blogs/:id`**: `BlogDetail.tsx` - A single blog post.
-   **`/login`**: Redirects to `/dashboard`.
-   **`/signup`**: Redirects to `/dashboard`.

---

## 2. Authenticated App Routes (`<DashboardLayout />`)

These routes are intended for logged-in users and are wrapped in the main application layout which includes the `Sidebar`.

-   **`/dashboard`**: `Dashboard.tsx` - The main user dashboard.
-   **`/pitch-deck`**: `WizardSteps.tsx` - The guided wizard for creating a new deck.
-   **`/pitch-deck/generating`**: `GeneratingScreen.tsx` - The loading screen shown during AI generation.
-   **`/dashboard/decks/:id/edit`**: `DeckEditor.tsx` - The core editor for modifying a specific deck.
-   **`/sitemap`**: `Sitemap.tsx` - A developer-facing page that visualizes this sitemap.

---

## 3. Full-Screen Routes (No Layout)

These routes render without the standard application layouts for a specialized, full-screen experience.

-   **`/dashboard/decks/:id/present`**: `PresentationScreen.tsx` - The distraction-free, full-screen presentation mode.

---

## 4. Fallback Route

This is a catch-all route that handles any URL that does not match the routes defined above.

-   **`*`**: `NotFound.tsx` - A user-friendly 404 "Page Not Found" error screen.
