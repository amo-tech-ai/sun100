# Implementation Plan: Strategic AI Enhancements

**Document Status:** Planning - 2024-08-12
**System Goal:** To provide a detailed, actionable engineering plan for implementing the advanced AI features outlined in `docs/19-slide-deck-analysis.md`. This document will guide the development of each feature, ensuring a consistent, high-quality implementation.

---

### 1. Guiding Principles & Best Practices

-   **Incremental Implementation:** Each slide enhancement will be developed, tested, and validated as a discrete unit of work.
-   **User-in-the-Loop:** All AI suggestions are optional and must be confirmed by the user. The AI assists, but the user directs.
-   **Function-Driven Architecture:** Every new AI capability will be built upon a dedicated, strongly-typed function call in `services/geminiService.ts` for maximum reliability.
-   **Clear UI/UX:** New features will be integrated intuitively into the existing `AIToolbox` tabs (Copilot, Analysis, Research), with clear loading states and error handling.

---

## 2. Slide-by-Slide Implementation Plan

This section breaks down the implementation for each slide type.

### **Slide 1: The Vision Slide**

-   **Goal:** Hook investors in 10 seconds with a powerful, memorable brand identity.
-   **Enhancements:**
    1.  **Headline A/B Testing:** Generate 5 alternative headlines.
    2.  **High-Concept Visuals:** Suggest conceptual image prompts.

-   **Implementation Tasks & Steps:**
    1.  **UI (`AIToolbox.tsx`):**
        -   In the "Copilot" tab, add a new button: "Generate Headline Ideas".
        -   Clicking this button will display the results in a simple list within the Copilot panel, with a "Use" button next to each suggestion.
    2.  **Service (`geminiService.ts`):**
        -   Create a new `FunctionDeclaration`: `generateHeadlinesFunctionDeclaration` that returns an array of 5 strings.
        -   Create a new service function: `generateHeadlineVariations(title): Promise<string[]>`.
    3.  **State (`DeckEditor.tsx`):**
        -   Add new state: `const [headlineSuggestions, setHeadlineSuggestions] = useState<string[]>([]);`
        -   Create a handler `handleGenerateHeadlines` to call the new service and populate the state.

-   **Success Criteria:**
    -   [ ] Clicking "Generate Headline Ideas" button displays a loading state.
    -   [ ] After completion, 5 distinct, relevant headline suggestions are displayed.
    -   [ ] Clicking "Use" on a suggestion updates the current slide's title.

-   **Production Ready Checklist:**
    -   [ ] **Code Quality:** `generateHeadlinesFunctionDeclaration` is strongly typed.
    -   [ ] **UI/UX:** Loading state is clear. The suggestion list is easy to read and use.
    -   [ ] **Error Handling:** If the AI fails, a user-friendly error message is shown.
    -   [ ] **Testing:** Manually test the end-to-end flow with 3 different initial titles.

---

### **Slide 2: The Problem Slide**

-   **Goal:** Make investors feel the problem's urgency and significance.
-   **Enhancements:**
    1.  **Provocative Questioning:** Rewrite problem statements as engaging questions.
    2.  **Social Proof Finder:** Find real-world quotes validating the problem.

-   **Implementation Tasks & Steps:**
    1.  **UI (`AIToolbox.tsx`):**
        -   In the "Copilot" suggestions area, automatically include a "Rewrite as a question" suggestion chip.
        -   In the "Research" tab, add a button: "Find social proof for this problem".
    2.  **Service (`geminiService.ts`):**
        -   The "Rewrite as a question" action will use the existing `modifySlideContent` service, passing a specific instruction.
        -   Create a new service function `findProblemQuotes(problemDescription): Promise<ResearchResult>` that uses `googleSearch`.
    3.  **State (`DeckEditor.tsx`):**
        -   The research result will be displayed in the existing `researchResult` state.

-   **Success Criteria:**
    -   [ ] Clicking the "Rewrite as a question" suggestion chip updates the slide content to a question format.
    -   [ ] Clicking "Find social proof" populates the Research panel with a relevant quote and source.

-   **Production Ready Checklist:**
    -   [ ] **Code Quality:** Prompts are well-defined to ensure high-quality outputs.
    -   [ ] **UI/UX:** The new button and suggestion chip are clearly labeled and integrated.
    -   [ ] **Error Handling:** Gracefully handles cases where no relevant quotes are found.
    -   [ ] **Testing:** Test with both B2B and B2C problem statements.

---

### **Slide 3: The Solution Slide**

-   **Goal:** Create an "aha" moment where the solution perfectly addresses the problem.
-   **Enhancements:**
    1.  **Benefit-Oriented Rewrites:** Convert feature descriptions into user benefits.
    2.  **"3 Pillars" Structure:** Distill the solution into three memorable pillars.

-   **Implementation Tasks & Steps:**
    1.  **UI (`AIToolbox.tsx`):**
        -   Add "Focus on benefits" and "Summarize in 3 pillars" suggestion chips to the "Copilot" tab.
    2.  **Service (`geminiService.ts`):**
        -   Both actions will use the existing `modifySlideContent` service, passing specific, detailed instructions for the desired transformation.
    3.  **State (`DeckEditor.tsx`):**
        -   No new state is required. The existing copilot flow will handle the updates.

-   **Success Criteria:**
    -   [ ] Clicking "Focus on benefits" rewrites the slide content to be outcome-oriented.
    -   [ ] Clicking "Summarize in 3 pillars" restructures the content into three distinct, bolded sections.

-   **Production Ready Checklist:**
    -   [ ] **Code Quality:** The prompts for `modifySlideContent` are engineered to be highly effective at these specific tasks.
    -   [ ] **UI/UX:** The suggestions are clear and the results are immediately visible.
    -   [ ] **Error Handling:** The copilot's existing error handling is sufficient.
    -   [ ] **Testing:** Test with both a feature-heavy and a conceptual solution slide.

---

### **Slide 4: The Market Slide**

-   **Goal:** Prove the market is large and growing with credible data.
-   **Enhancements:**
    1.  **Automated Market Sizing (TAM/SAM/SOM):** Use `googleSearch` to find market size data.
    2.  **Source Validation:** Automatically add citation links for all researched data.

-   **Implementation Tasks & Steps:**
    1.  **UI (`AIToolbox.tsx`):**
        -   In the "Research" tab, modify the input to be more guided. Add a button: "Find Market Size (TAM)".
    2.  **Service (`geminiService.ts`):**
        -   Create a new service function: `researchMarketSize(industry): Promise<ResearchResult>`.
        -   This function will have a specialized prompt that instructs the AI to look for TAM, SAM, and SOM data and to prioritize credible sources (e.g., Gartner, Forrester, Statista).
    3.  **State (`DeckEditor.tsx`):**
        -   The research result will be displayed in the existing `researchResult` state. A new UI element may be needed to specifically display TAM/SAM/SOM.

-   **Success Criteria:**
    -   [ ] Clicking "Find Market Size" returns a summary of the market size with clear sources.
    -   [ ] The results are presented in a structured way that is easy to copy into the slide.

-   **Production Ready Checklist:**
    -   [ ] **Code Quality:** The prompt is optimized for high-quality, verifiable data.
    -   [ ] **UI/UX:** The action is clearly labeled. Results are easy to understand and use.
    -   [ ] **Error Handling:** Handles cases where market data is not found or is ambiguous.
    -   [ ] **Testing:** Test with niche and broad market queries (e.g., "AI-powered cat toys" vs. "global SaaS market").

---

### **Slide 9: The Team Slide**

-   **Goal:** Build trust by showcasing a credible team with relevant experience.
-   **Enhancements:**
    1.  **Compelling Bio Generation:** Generate a one-sentence bio from background info.
    2.  **Highlight Extraction:** Pull out high-status credentials from a longer bio.

-   **Implementation Tasks & Steps:**
    1.  **UI (`AIToolbox.tsx`):**
        -   In the "Copilot" tab, when on a "Team" slide, show buttons like "Summarize Bio" and "Extract Highlights".
    2.  **Service (`geminiService.ts`):**
        -   Create `FunctionDeclaration` for `summarizeBio` which returns a single `bio` string.
        -   Create a new service function `generateCompellingBio(rawText): Promise<string>`.
        -   This will be a new tool that takes a long bio and returns a concise, impactful version.
    3.  **State (`DeckEditor.tsx`):**
        -   The returned bio will be used to replace the content in the selected text block on the slide. This may require more granular content editing capabilities in the future.

-   **Success Criteria:**
    -   [ ] User can paste a long bio into the copilot.
    -   [ ] Clicking "Summarize Bio" replaces the long text with a single, powerful sentence.

-   **Production Ready Checklist:**
    -   [ ] **Code Quality:** Function and prompt are well-defined.
    -   [ ] **UI/UX:** The workflow is intuitive for the user.
    -   [ ] **Error Handling:** Handles empty or very short input text gracefully.
    -   [ ] **Testing:** Test with bios from different industries and levels of seniority.