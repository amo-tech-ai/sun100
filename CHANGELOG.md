# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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