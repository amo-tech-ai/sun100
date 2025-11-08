# 🗺️ Implementation Plan: Intelligent Roadmap Agent

**Document Status:** Planning - 2024-08-10
**System Goal:** To evolve the "Add Roadmap" feature from a semi-manual helper into a one-click, fully-automated "Intelligent Roadmap Agent." This agent will generate a complete, visually-focused "Vision Trail" slide, including context-aware text content, ensuring full compatibility with all other AI agents (Copilot, Analysis, Research).

---

### 1. Executive Summary & Strategic Goal

The current `generateRoadmapSlide` function is effective at creating a high-quality visual, but it produces a slide with no text content. This limits the utility of our other AI agents, which rely on text to function.

This plan outlines the upgrade to a more sophisticated, multi-step AI workflow. The new agent will first generate the *strategic content* for the roadmap (the milestones) and then use that content to create a perfectly aligned visual. This provides a superior user experience and creates a more cohesive, intelligent product.

---

### 2. File Impact Analysis

This section details the required changes to refactor and enhance the roadmap generation feature.

| File                          | Reason for Modification                                                                                                                                                                                                                                                                                                           |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `services/geminiService.ts`   | **Major Overhaul.** The `generateRoadmapSlide` function will be re-architected. It will now incorporate a `FunctionDeclaration` for a new `createRoadmapContent` function. This will enable a two-step process: first generating structured text for milestones, then using that text to inform the visual generation prompt. |
| `screens/DeckEditor.tsx`      | **No Change Required.** The existing logic in `handleGenerateRoadmapSlide` is already robust. It calls the service, handles the loading state, and adds the returned slide to the deck. This abstraction means no UI-level changes are needed.                                                                                      |
| `components/SlideOutline.tsx` | **No Change Required.** The "Generate Roadmap" button and its `isGeneratingRoadmap` state are already correctly implemented. The button will simply trigger the new, more powerful backend service.                                                                                                                                 |

---

### 3. Step-by-Step Implementation Plan

This is a step-by-step guide to executing the refactor within `services/geminiService.ts`.

#### Task 1: Define a New Function Declaration

-   **Action:** In `geminiService.ts`, create a new `FunctionDeclaration` named `createRoadmapContentFunctionDeclaration`.
-   **Purpose:** This tool will instruct the AI to generate the core strategic content for a 4-step roadmap.
-   **Schema:**
    ```typescript
    const createRoadmapContentFunctionDeclaration: FunctionDeclaration = {
        name: 'createRoadmapContent',
        description: 'Generates content for a 4-milestone startup roadmap.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                milestones: {
                    type: Type.ARRAY,
                    description: 'An array of exactly 4 milestone titles.',
                    items: { type: Type.STRING },
                },
            },
            required: ['milestones'],
        },
    };
    ```

#### Task 2: Re-architect the `generateRoadmapSlide` Service

-   **Action:** Overhaul the `generateRoadmapSlide` function in `geminiService.ts` to orchestrate a multi-step workflow.
-   **Workflow Diagram:**

    ```mermaid
    sequenceDiagram
        participant Editor as DeckEditor
        participant Service as generateRoadmapSlide
        participant TextModel as Gemini Pro
        participant ImageModel as Gemini Flash Image
    
        Editor->>Service: Calls generateRoadmapSlide(companyDetails)
        Service->>TextModel: generateContent({ tools: [createRoadmapContent] })
        TextModel-->>Service: response { functionCalls: [createRoadmapContent(milestones: [...])] }
        Service->>Service: Dynamically builds image prompt using milestone text
        Service->>ImageModel: generateContent({ prompt: "A roadmap with labels: 'milestone 1', 'milestone 2'..." })
        ImageModel-->>Service: Returns roadmap image
        Service->>Editor: Returns complete Slide object with title, content, and imageUrl
    ```

-   **Implementation Steps:**
    1.  **Step 1 (Generate Content):**
        *   The function will first call the `gemini-2.5-pro` model.
        *   The prompt will ask the model to generate four relevant roadmap milestones for a company with the given `companyDetails`, using the `createRoadmapContent` function.
    2.  **Step 2 (Build Image Prompt):**
        *   Extract the four milestone titles from the function call response (e.g., `['Launch MVP', '10K Users', 'Series A', 'Global Expansion']`).
        *   Dynamically insert these titles into the "Vision Trail" image prompt. This ensures the visual perfectly matches the text.
    3.  **Step 3 (Generate Image):**
        *   Call the `gemini-2.5-flash-image` model with the new, dynamic prompt to generate the roadmap visual.
    4.  **Step 4 (Construct Final Slide):**
        *   Create the final `Slide` object.
        *   The `content` property will be a newline-separated string of the generated milestone titles.
        *   The `imageUrl` will be the base64 data of the generated image.
        *   Return the complete `Slide` object.

#### Task 3: Verify AI Toolbox Integration

-   **Action:** Manually test the newly generated roadmap slide with the `AIToolbox`.
-   **Verification Steps:**
    1.  **Copilot:** Use the Copilot to refine the milestone text (e.g., "Rewrite the final milestone to be more ambitious").
    2.  **Analysis:** Use the Analysis panel to get feedback on the clarity and impact of the roadmap's milestones.
    3.  **Research:** Use the Research panel to find supporting data for one of the milestones (e.g., "average time to Series A for SaaS startups").

---

### 4. Success Criteria

The feature will be considered successfully implemented when the following criteria are met:

-   [ ] Clicking the "Generate Roadmap" button adds a **single, complete slide** to the deck in one action.
-   [ ] The generated slide contains a default title ("Our Roadmap to Market Leadership"), a visually appealing "Vision Trail" image, and text content listing the generated milestones.
-   [ ] The text labels on the generated roadmap image **exactly match** the text content on the slide.
-   [ ] The loading state (`isGeneratingRoadmap`) is correctly displayed during the entire multi-step AI process and hidden upon completion.
-   [ ] The Copilot, Analysis, and Research tabs in the `AIToolbox` are fully functional for the newly generated roadmap slide.
-   [ ] The entire process is reliable and handles potential AI errors gracefully.

---

### 5. Production-Ready Checklist

| Category          | Criteria                                                                                                                                 |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Code Quality**  | The new function declaration is strongly typed. The `generateRoadmapSlide` function is clean, well-commented, and includes `try...catch` error handling for both AI calls. |
| **UX/UI**         | The user experience is seamless. The user clicks one button and receives a complete, ready-to-use slide. The loading indicator provides clear feedback. |
| **Performance**   | The two-step AI process completes within a reasonable timeframe (e.g., under 15 seconds).                                                 |
| **Functionality** | All success criteria are met. The generated slide is fully integrated into all aspects of the editor.                                    |
| **Testing**       | Manually test the feature 5 times with different `companyDetails` to ensure consistency and reliability of both text and image generation. |
| **Regressions**   | Verify that this change does not negatively impact any other AI generation features.                                                     |
