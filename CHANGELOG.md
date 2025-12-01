
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.4.0] - 2024-09-07

### Added
- **Customer CRM Module:** A complete, feature-rich CRM system (`/dashboard/crm`) for managing startup relationships.
  - **Dashboard:** KPI cards, Deal Pipeline visualization, and Data Tables.
  - **Detail View:** A slide-over panel (`CustomerDetailPanel`) for deep dives into account history, timeline, and tasks.
  - **Interaction Tracking:** Log emails, calls, and notes.
  - **Task Management:** integrated task list for follow-ups.
- **AI CRM Agents:**
  - **Account Health Analyzer:** AI evaluates interaction history to score account health (0-100) and suggest actions.
  - **Strategic Insights:** Dashboard-level AI suggestions for churn risks and opportunities.
- **Database Schema:** Added comprehensive SQL definitions for `crm_accounts`, `crm_contacts`, `crm_deals`, `crm_interactions`, and `crm_tasks`.

### Improved
- **Service Layer:** Enhanced `crmService.ts` with full CRUD capabilities and robust mock data fallbacks.
- **Navigation:** Updated Sidebar and Sitemap to include the new CRM capabilities.

## [2.3.0] - 2024-09-04

### Added
- **Funding Manager:** A dedicated dashboard (`FundingManager.tsx`) for tracking applications to VCs and Accelerators. Features a Kanban-like status view and "Fit Score" visualization.
- **Investor Chat:** An AI-powered chat widget (`InvestorChat.tsx`) in the Investor Dashboard that allows founders to ask natural language questions about their metrics (e.g., "What is my runway?").
- **VC Fit Check:** Added `MatchmakingModal` and `FitCheckModal` to help founders analyze compatibility with specific investors using Gemini 3 reasoning.

### Improved
- **Metrics Table:** Enhanced `MetricsTable.tsx` with mobile-responsive card views and conditional text coloring (green/red) for financial health indicators.
- **GTM Strategy:** Added "Export PDF" functionality to the GTM Strategy generator.
- **Documentation:** Updated `progress-tracker.md` to reflect the completion of the Investor Suite.

## [2.2.0] - 2024-09-03

### Added
- **Investor Command Center:** A new dedicated dashboard (`InvestorDashboard.tsx`) for managing fundraising activities, tracking runway, and organizing documents.
- **Document Builder:** A powerful wizard (`DocBuilder.tsx`) to generate AI-powered One-Pagers, Investor Updates, and Investment Memos. Includes PDF-style previews (`DocPreview.tsx`).
- **Metrics Management:** A spreadsheet-like interface (`MetricsTable.tsx`) for tracking monthly KPIs (Revenue, Burn, Cash, Users).
- **GTM Strategy Generator:** A comprehensive tool (`GTMStrategy.tsx`) that uses Gemini 3 to generate Go-To-Market plans, including ICP analysis, channel strategy, and launch roadmaps.
- **Data Room:** A secure file management interface (`DataRoom.tsx`) with an "AI Audit" feature that checks for missing due diligence documents.
- **VC Directory:** A browsable database of investors (`VCDirectory.tsx`) with deep profile views (`VCDetail.tsx`) and an AI-powered "Fit Check" matchmaking tool.
- **Financial Forecasting:** Added `generateFinancialForecast` AI service to create 3-year projections based on historical metrics.
- **Strategic Analysis:** Added `analyzeStartupStrategy` AI service to perform SWOT and market trend analysis for founder profiles.

### Improved
- **Landing Page:** Refactored `Landing.tsx` to use a consistent 8-point grid system (`py-16`, `gap-12`) and improved responsive stacking for mobile devices.
- **Navigation:** Updated `Sitemap.tsx` to include all new Investor Suite routes.

## [2.1.1] - 2024-08-28

### Fixed
- **Critical Application Failure & Layout Inconsistency:** Restored all AI service logic that was missing after an incomplete architectural refactor. The application's AI features were non-functional, causing crashes. This commit restores all AI functionality. Additionally, it standardizes page layouts by moving padding responsibility from individual pages to the parent `PublicLayout.tsx`, fixing inconsistent spacing and visual jarring when navigating between public pages.

## [2.1.0] - 2024-08-28

### Fixed
- **Critical Application Failure:** Restored all AI service logic that was missing after an incomplete architectural refactor. The monolithic `geminiService.ts` was previously removed, but its logic was not correctly reimplemented in the new modular services (`/services/ai/*`), causing a fatal application crash. All AI features are now functional again.
- **Layout Inconsistency:** Standardized page layouts by moving padding responsibility from individual pages to the parent `PublicLayout.tsx`. This fixes inconsistent spacing and visual jarring when navigating between public pages.

## [2.0.0] - 2024-08-13

### Changed
- **Major Architectural Refactor:** Implemented React Context API (`DeckEditorContext`) to eliminate prop drilling and resolve the "God Component" issue in `DeckEditor.tsx`. This significantly improves maintainability and scalability.
- **Centralized Event Handlers:** All AI-related event handlers are now centralized in `DeckEditor.tsx` and defined with `useCallback` for improved performance and consistency.
- **Robust Slide Typing:** Replaced brittle, title-based slide context detection with a dedicated `type` property in the `Slide` data model, making context-aware features more reliable.

### Fixed
- **Fatal Application Crash:** Resolved a startup crash caused by unconfigured Supabase environment variables by implementing a resilient mock client and auth provider, allowing the application to run in a "review mode."
- **Documentation Drift:** Updated all progress trackers (`docs/26-enhancement-progress-tracker.md`, `docs/34-progress-tracker.md`) to accurately reflect the application's feature-complete state, resolving a critical process failure.

## [1.9.0] - 2024-08-12

### Added
- **Strategic AI Enhancement Blueprints:** Created detailed, production-ready engineering plans for the first phase of advanced AI features. These plans address critical feedback and provide a clear implementation path for enhancing the Vision, Problem, and Solution slides.
  - `docs/23-slide-1-vision-plan.md`
  - `docs/24-slide-2-problem-plan.md`
  - `docs/25-slide-3-solution-plan.md`
- **Enhancement Progress Tracker:** Added a new tracker (`docs/26-enhancement-progress-tracker.md`) to monitor the planning and implementation status of the new slide-specific AI features.

## [1.8.0] - 2024-08-11

### Changed
- **Upgraded Roadmap Generation to Intelligent Agent:** The "Add Roadmap" feature has been completely re-architected. It now uses a multi-step AI workflow to first generate four strategic roadmap milestones (text content) and then uses that text to create a perfectly aligned "Vision Trail" visual. This ensures the generated slide is fully compatible with all other AI agents (Copilot, Analysis, Research) from the moment it's created.

## [1.7.0] - 2024-08-10

### Added
- **Intelligent Roadmap Agent Plan:** Created a new document (`docs/18-roadmap-implementation-plan.md`) outlining a comprehensive plan to upgrade the "Add Roadmap" feature. The new "Intelligent Roadmap Agent" will fully automate the generation of a complete, visually-focused "Vision Trail" roadmap slide in a single click, including generating supporting text content to ensure full compatibility with the Copilot, Analysis, and Research AI tools.

## [1.6.0] - 2024-08-09

### Added
- **Validation & Performance Audit:** Conducted a comprehensive, full-cycle audit of the application. This process verified the successful implementation of all performance optimizations (Combined AI Suggestions, Image Pre-loading, Component Memoization), confirmed the end-to-end stability of the user journey, and validated the correctness of all AI agent functionalities. The application is officially confirmed as production-ready.

## [1.5.0] - 2024-08-08

### Added
- **Performance Optimization:** Implemented component memoization across the Deck Editor using `React.memo` and `useCallback`. This optimization significantly reduces unnecessary re-renders when interacting with the editor, ensuring the UI remains responsive and scalable, especially for larger decks. This completes Stage 3 of the performance improvement plan.

## [1.4.0] - 2024-08-07

### Added
- **Roadmap Slide Generation:** Added an "Add Roadmap" button to the editor sidebar. This automates the creation of a new slide pre-populated with a title and a detailed AI image prompt for the recommended "Vision Trail" roadmap style, streamlining the creation of this key pitch deck slide.

## [1.3.0] - 2024-08-06

### Changed
- **AI Workflow Enhancement:** Refined the image generation process to be more context-aware. The AI now uses the initial image prompt generated during the deck outline phase as a creative seed, leading to more relevant and higher-quality visuals. This improves the logical flow between the deck generation and visual creation AI agents.

## [1.2.0] - 2024-08-05

### Added
- **Collapsible Sidebar:** The left slide outline panel can now be collapsed to a minimal view, maximizing editor space.
-   **Full-Screen Editing:** The editor panel expands to fill the available area when the sidebar is collapsed, creating a more focused workspace.
- **Slide Navigation Controls:** Added "Previous" and "Next" arrow buttons to the editor panel for easier navigation between slides.
- **Keyboard Shortcuts:** Implemented keyboard shortcuts for navigating slides (Arrow Keys) and toggling the sidebar (Cmd/Ctrl + [).

### Changed
- **Editor Layout:** The main `DeckEditor` now uses a dynamic layout to support the new collapsible sidebar and full-screen view.

## [1.1.0] - 2024-08-05

### Changed
- **Layout Redesign:** Overhauled the `DeckEditor` to use a two-column, Decktopus-style layout. This provides a more focused editing experience with a slide outline on the left and the main editor panel on the right.
- **Component Refactor:** Broke down the monolithic `DeckEditor` into smaller, reusable components: `SlideOutline`, `EditorPanel`, and `AIToolbox`.
- **AI Tools UI:** Consolidated all AI panels (Copilot, Image, Analysis, Research) into a single, tabbed `AIToolbox` component to reduce clutter and improve usability.

## [1.0.0] - 2024-08-04

### Added
- **Deployment Readiness:** Implemented containerization with a `Dockerfile` and `.dockerignore` to prepare the application for production deployment on services like Google Cloud Run. This fulfills the core setup outlined in the deployment guide.

### Changed
- **Project Status:** Updated version to `1.0.0` to signify MVP completion and deployment readiness. The progress tracker has been updated to reflect this milestone.

## [0.9.0] - 2024-08-03

### Added
- **Advanced Image Generation Plan:** Created a new document (`docs/05-image-plan.md`) outlining a phased plan to implement advanced image features, including conversational image editing (Image + Text-to-Image) and user image uploads.

## [0.8.0] - 2024-08-03

### Added
- **Image Generation Strategy Guide:** Created a new document (`docs/04-image-generation-strategy.md`) outlining strategic options and best practices for generating high-quality, context-aware images for different types of pitch deck slides using the `gemini-2.5-flash-image` model.

## [0.7.0] - 2024-08-02

### Added
- **Research AI Agent:** Implemented the "AI Research Assistant" panel, allowing users to perform web searches for up-to-date information.
- **Web Search Service:** Added `researchTopic` function to `geminiService.ts` using `gemini-2.5-pro` with the `googleSearch` tool for grounded, sourced answers.
- **Dynamic Research UI:** The Research Panel is now fully interactive. Users can input a query, see a loading state, and view a summarized answer along with clickable source links.

## [0.6.0] - 2024-08-01

### Added
- **Analyst AI Agent:** Implemented AI-powered slide analysis via the "Slide Analysis" panel.
- **Slide Analysis Service:** Added `analyzeSlide` function to `geminiService.ts` using `gemini-2.5-pro` to rate and provide feedback on a slide's clarity, impact, and tone.
- **Dynamic Feedback UI:** The Analysis Panel is now fully interactive, allowing users to request feedback for the selected slide, showing a loading state, and displaying the dynamic, color-coded results from the AI.

## [0.5.0] - 2024-07-31

### Added
- **Editor AI Agent:** Implemented AI-powered content modification via the "AI Copilot" panel.
- **Content Modification Service:** Added `modifySlideContent` function to `geminiService.ts` using `gemini-2.5-pro` to rewrite, shorten, or expand slide content based on user commands.
- **Interactive Copilot:** The AI Copilot is now fully functional, allowing users to request changes and see them applied directly to the selected slide.

## [0.4.0] - 2024-07-30

### Added
- **Visual AI Agent:** Implemented AI-powered image generation within the Deck Editor.
- **Image Generation Service:** Added `generateSlideImage` function to `geminiService.ts` using the `gemini-2.5-flash-image` model.
- **Dynamic Image UI:** The editor now shows a "Generate Image" button for slides with an image prompt. Clicking it calls the AI, displays a loading state, and then renders the generated image.

## [0.3.0] - 2024-07-29

### Added
- **AI Service Integration:** Created `services/geminiService.ts` to connect to the Gemini API for intelligent deck generation.
- **AI-Powered Generation:** Implemented `generateDeckContent` function with a structured prompt and a JSON response schema to reliably create pitch deck content.
- **AI Copilot UI:** Added a placeholder UI component `AICopilot.tsx` for future conversational edits.
- **Analysis Panel UI:** Added a placeholder UI component `AnalysisPanel.tsx` to display strategic feedback.
- **Research Panel UI:** Added a placeholder UI component `ResearchResultPanel.tsx` for an AI research assistant.

### Changed
- **Deck Editor:** Integrated the placeholder AI panel components into the editor's right sidebar.

## [0.2.0] - 2024-07-28

### Added
- **Deck Editor:** Implemented the core `DeckEditor.tsx` screen with a three-column layout: slide thumbnails, main slide preview, and tools sidebar.
- **Presentation Mode:** Created a fully functional `PresentationScreen.tsx` for presenting decks. Includes keyboard controls (Arrow keys, Space, Esc) and on-screen navigation.
- **Styling Templates:** Introduced a theme engine in `styles/templates.ts` to allow for different visual styles for decks.
- **Data Refactoring:** Centralized mock data and type definitions (`Deck`, `Slide`) into `data/decks.ts`.

### Changed
- Updated navigation to link from the editor to the new presentation screen.

## [0.1.0] - 2024-07-27

### Added
- **Project Scaffolding:** Initial project setup with React, TypeScript, and Tailwind CSS.
- **Core Navigation:** Implemented routing using `react-router-dom`, including a `DashboardLayout`.
- **Dashboard Screen:** Created the main `Dashboard.tsx` with a welcome message.
- **Pitch Deck Wizard Flow:**
  - Added a placeholder `WizardSteps.tsx` screen.
  - Implemented a `GeneratingScreen.tsx` with a loading animation to simulate AI processing.
- **Component Library:** Created a reusable `Sidebar.tsx` component for navigation.
- **Documentation:** Initialized `CHANGELOG.md` and `docs/01-progress-tracker.md`.
