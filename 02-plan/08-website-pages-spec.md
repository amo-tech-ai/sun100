# Solar MVP: Public Website Pages Specification

**Document Status:** Published
**Version:** 1.0
**Author:** Lead UX Architect

---

## 1. Executive Summary & Goal

The primary goal of the Solar public website is to **attract, educate, and convert** our target users (founders, startup teams, community builders). The site must clearly articulate our value proposition, build trust, and provide a seamless path for users to sign up and start using the platform.

This specification outlines the minimal set of pages required for a successful MVP launch.

---

## 2. Information Architecture & Navigation

The navigation is designed to be simple and intuitive, guiding users to key information and the primary call-to-action.

#### Primary Navigation (Header)
-   **Home:** Links to the landing page (`/`).
-   **About:** Explains our mission and team (`/about`).
-   **AI Tools:** Details the core AI-powered features of the platform (`/tools`).
-   **Events:** Lists upcoming community events (`/events`).
-   **Resources:** A blog or knowledge base with articles for founders (`/resources`).
-   **Contact:** A page with contact information and a form (`/contact`).
-   **Primary CTA:** "Sign Up" or "Get Started" button, prominently displayed.
-   **Secondary CTA:** "Log In" link.

#### Footer Navigation
-   **Product:** AI Tools, Events, Resources.
-   **Company:** About, Contact, Careers.
-   **Legal:** Privacy Policy, Terms of Service.
-   **Social Links:** LinkedIn, Twitter.

---

## 3. Core Component Library (Minimal)

To ensure consistency and rapid development, the website will be built using a small set of reusable components.

-   **Hero Section:** Large, full-width section with a primary headline, subheading, and a prominent CTA button.
-   **Feature Card / Info Card:** A card component with an icon, title, and short description to highlight features or benefits.
-   **CTA Button:** A standardized button component with primary (solid color) and secondary (outline) variants.
-   **FAQ Section:** An accordion-style component to display frequently asked questions and answers.
-   **Footer:** The standard site footer containing navigation links, legal information, and social media icons.
-   **Header:** The standard site header containing the primary navigation and CTA buttons.

---

## 4. Page Specifications

### A. Home (`/`)
-   **Purpose:** To capture the user's attention, communicate the core value proposition ("From idea to investor-ready in one platform"), and drive sign-ups.
-   **Required Content Sections:**
    1.  **Hero:** Compelling headline, subheading, and primary "Get Started" CTA.
    2.  **Social Proof:** "Trusted By" logo strip (e.g., mock logos of accelerators, VCs).
    3.  **Problem/Solution:** A "before and after" narrative contrasting the pain of manual work with the ease of using Solar's AI tools.
    4.  **Core Features:** A grid of 3-4 `Feature Cards` highlighting the Pitch Wizard, Event Wizard, etc.
    5.  **Testimonials:** 1-2 quotes from fictional happy users.
    6.  **Final CTA:** A final, strong call-to-action to sign up.

### B. About (`/about`)
-   **Purpose:** To build trust and humanize the brand by explaining our mission and introducing the team.
-   **Required Content Sections:**
    1.  **Mission Statement:** A hero-like section with a clear, concise statement about why Solar exists.
    2.  **Our Story:** A brief narrative about the company's origins.
    3.  **Meet the Team:** A grid of profile cards for the founding team members.
    4.  **Join Us (CTA):** A call-to-action to view open positions or get in touch.

### C. AI Tools (`/tools`)
-   **Purpose:** To provide a detailed overview of the key AI-powered features of the platform, focusing on user benefits.
-   **Required Content Sections:**
    1.  **Hero:** A headline focused on automation and intelligence (e.g., "Your Intelligent Co-Pilot for Growth").
    2.  **Pitch Deck Wizard Deep Dive:** A dedicated section with a title, description, and visual (screenshot/animation) explaining the Pitch Wizard.
    3.  **Event Wizard Deep Dive:** A similar section for the Event Wizard.
    4.  **Profile Wizard Deep Dive:** A similar section for the Startup Profile Wizard.
    5.  **FAQ:** An `FAQ Section` answering common questions about the AI tools.

### D. Events (`/events`)
-   **Purpose:** To showcase community engagement and provide a space for users to discover and register for upcoming events.
-   **Required Content Sections:**
    1.  **Hero:** Headline announcing upcoming events.
    2.  **Featured Event:** A large card or banner for the next major event.
    3.  **Event List:** A chronological list of upcoming events (virtual meetups, workshops, etc.) with filtering options (e.g., by topic, date).
    4.  **Past Events Archive:** A link to a page with recordings or summaries of past events.

### E. Resources (`/resources`)
-   **Purpose:** To provide value to the startup community through content marketing, which also serves as a key channel for SEO and user acquisition.
-   **Required Content Sections:**
    1.  **Hero:** Headline for the blog or knowledge base (e.g., "The Founder's Playbook").
    2.  **Featured Article:** A large card highlighting the most recent or popular article.
    3.  **Article Grid/List:** A filterable list of all articles, categorized by topic (e.g., "Pitching," "Growth," "Fundraising").
    4.  **Newsletter CTA:** A call-to-action to subscribe to the company newsletter.

### F. Contact (`/contact`)
-   **Purpose:** To provide a clear and simple way for users to get in touch for support, partnerships, or press inquiries.
-   **Required Content Sections:**
    1.  **Hero:** Simple headline: "Get in Touch."
    2.  **Contact Form:** A simple form with fields for Name, Email, Subject, and Message.
    3.  **Contact Information:** Direct email addresses for different departments (e.g., `support@solar.com`, `partners@solar.com`).

---

## 5. Mobile-First & Responsive Design Rules

-   **Breakpoints:** A simple two-breakpoint system: a default mobile view and a desktop view (`lg:` prefix in Tailwind, e.g., at `1024px`).
-   **Layout Stacking:** All multi-column layouts (e.g., feature grids) **must** stack into a single, vertical column on mobile. Use `flex-col lg:flex-row`.
-   **Typography Scaling:** Headings and body text should use responsive font sizes (e.g., `text-3xl lg:text-4xl`) to ensure readability on all devices.
-   **Tap Targets:** All buttons, links, and interactive elements must have a minimum height of `44px` on mobile to be easily tappable.
-   **Navigation:** The primary header navigation will collapse into a hamburger menu on mobile.

---

## 6. Success Criteria

The MVP website will be considered a success when the following criteria are met:

#### Functional Criteria
-   [ ] All pages listed in the sitemap are created and accessible via the navigation.
-   [ ] All links and CTA buttons navigate to the correct destination.
-   [ ] The contact form successfully submits data.
-   [ ] The site loads without any 404 errors or console errors.

#### User Experience Criteria
-   [ ] The website is fully responsive and provides a seamless experience on mobile, tablet, and desktop.
-   [ ] The navigation is intuitive, and users can find key information within three clicks.
-   [ ] The value proposition is clear and easy to understand within the first 10 seconds of visiting the homepage.

#### Performance Criteria
-   [ ] The site achieves a Google Lighthouse performance score of **≥ 90** on mobile.
-   [ ] The Largest Contentful Paint (LCP) for the homepage is **under 2.5 seconds**.
-   [ ] All images are optimized (e.g., converted to WebP) to reduce load times.
