# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2024-08-07

### Added
- **Roadmap Slide Generation:** Added an "Add Roadmap" button to the editor sidebar. This automates the creation of a new slide pre-populated with a title and a detailed AI image prompt for the recommended "Vision Trail" roadmap style, streamlining the creation of this key pitch deck slide.

## [1.3.0] - 2024-08-06

### Changed
- **AI Workflow Enhancement:** Refined the image generation process to be more context-aware. The AI now uses the initial image prompt generated during the deck outline phase as a creative seed, leading to more relevant and higher-quality visuals. This improves the logical flow between the deck generation and visual creation AI agents.

## [1.2.0] - 2024-08-05

### Added
- **Collapsible Sidebar:** The left slide outline panel can now be collapsed to a minimal view, maximizing editor space.
- **Full-Screen Editing:** The editor panel expands to fill the available area when the sidebar is collapsed, creating a more focused workspace.
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
- **Analysis Panel UI:** Added a placeholder UI component `AnalysisPanel.tsx` to display AI-driven slide feedback.
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