# Implementation Plan: Function Calling for an Intelligent Editor

**Document Status:** Planning - 2024-08-06

**System Goal:** To evolve the Sun AI Pitch Deck Engine from a prompt-driven content generator into an intelligent, action-oriented editor by strategically implementing function calling. This will make the application more reliable, powerful, and capable of complex, multi-step workflows.

---

## 1. What is Function Calling & Why It Matters

In simple terms, function calling allows the AI model to not just **talk** (generate text), but to **act**. When a user gives a command, the model can choose to call a predefined, reliable backend function—like `rewriteSlide` or `chooseLayout`—with the exact parameters it needs.

This is a game-changer because it moves us from parsing unstructured text to receiving structured, predictable commands from the AI. It is the foundation for building a robust, multi-agent system where different AI capabilities work together seamlessly.

---

## 2. Top 10 Function Calling Use Cases

This table analyzes and ranks the most impactful function calls for a pitch deck editor.

|  # | Function Name           | What It Does                                                                     | Real-World Example                                                                 | Why It’s Valuable                           | Score / 100 |
| -: | ----------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------- | ----------: |
|  1 | **generateDeckOutline** | Creates a full 10-slide outline with titles and bullet points                    | A founder enters their idea, and the AI instantly builds a deck structure          | Fastest way to go from idea → working deck  |      **96** |
|  2 | **rewriteSlide**        | Improves tone, grammar, and clarity while keeping structure                      | “Make this slide more persuasive for investors” → AI rewrites with concise bullets | Saves editing time and polishes writing     |      **94** |
|  3 | **chooseLayout**        | Suggests best visual layout based on slide type (hero, two-column, metric, etc.) | For a “Problem Slide,” it chooses a bold headline + stat layout automatically      | Ensures every slide looks professional      |      **93** |
|  4 | **imageBrief**          | Generates a creative brief for the image model (keywords, colors, style)         | AI suggests “clean conference room, pastel palette, tech vibe” for Slide 2         | Produces cohesive and brand-aligned visuals |      **92** |
|  5 | **editImage**           | Refines an existing image with a text prompt                                     | “Add a city skyline background” → AI edits the current image                       | Enables quick, iterative visual changes     |      **90** |
|  6 | **researchCitation**    | Finds supporting stats and sources for a claim                                   | “AI event industry to reach $2 B by 2027 — source?” → AI attaches credible link    | Builds trust and fact-checks slides         |      **89** |
|  7 | **chartSuggester**      | Chooses best chart type and structure for data                                   | Detects numeric bullet points → suggests a bar chart layout                        | Makes data instantly visual and clear       |      **88** |
|  8 | **narrativeFlow**       | Suggests reordering slides for a smoother story arc                              | AI reorders slides to “Problem → Solution → Traction → Ask”                        | Creates natural storytelling flow           |      **87** |
|  9 | **toneStyle**           | Adjusts communication tone (investor, technical, simple)                         | “Make this slide sound more confident and visionary”                               | Keeps the entire deck in one voice          |      **86** |
| 10 | **competitorMatrix**    | Builds a comparison grid of rivals and differentiators                           | User adds competitor names → AI outputs a clean features table                     | Simplifies competitive positioning          |      **85** |

---

## 3. Executive Summary & Strategic Assessment

### Do We Need Function Calling?
**Yes, absolutely.** It is the single most important architectural upgrade we can make. The current approach of asking the model for a JSON blob is brittle and prone to failure. Function calling provides the structured, reliable foundation needed to build a professional-grade, multi-agent tool rather than a simple demo.

### Key Insights & Ranking
The functions can be grouped into three strategic categories, which will form the basis of our implementation plan:
1.  **Core Workflow (Highest Priority):** `generateDeckOutline`, `rewriteSlide`, `chooseLayout`. These three functions represent the fundamental user journey of creating, refining, and structuring a deck. They are the backbone of the editor.
2.  **Advanced Visuals & Data (Medium Priority):** `imageBrief`, `editImage`, `researchCitation`, `chartSuggester`. These functions add significant value by enhancing the visual quality and credibility of the deck. They directly support our existing "Visual," "Analyst," and "Research" agent concepts.
3.  **Strategic Polish (Lower Priority):** `narrativeFlow`, `toneStyle`, `competitorMatrix`. These functions are powerful differentiators that provide expert-level feedback, elevating a good deck to a great one. They are perfect follow-on features after the core experience is solidified.

---

## 4. Phased Implementation Plan

### Phase 1: Core Workflow Functions (The Foundation)
**Goal:** Build a robust, reliable "idea-to-structured-deck" pipeline.

-   [ ] **1. `generateDeckOutline`:**
    -   **Action:** Replace the current JSON-based deck generation in `geminiService.ts` with a function call.
    -   **Benefit:** Increases the reliability of initial deck creation to near 100%. The AI's primary job becomes calling the function, not formatting a complex JSON object.
-   [ ] **2. `rewriteSlide`:**
    -   **Action:** Refactor the "AI Copilot" to use a `rewriteSlide` function instead of asking for a JSON response.
    -   **Benefit:** Makes content editing more predictable and isolates the "what to change" from the "how to change it."
-   [ ] **3. `chooseLayout`:**
    -   **Action:** Implement a new capability where the AI can suggest a layout for a slide (e.g., from our `templates.ts`).
    -   **Benefit:** Automates a key design decision, ensuring slides are visually effective from the start.

### Phase 2: Advanced Visual & Data Functions (The Polish)
**Goal:** Enhance the deck's visual appeal and data-driven credibility.

-   [ ] **1. `imageBrief` & `editImage`:**
    -   **Action:** Instead of just generating an image, have the AI first call `imageBrief` to create a detailed prompt. Then, refactor the existing image editing to use a dedicated `editImage` function.
    -   **Benefit:** Produces much higher-quality, context-aware images and makes the editing process more intuitive.
-   [ ] **2. `researchCitation`:**
    -   **Action:** Refactor the "Research Assistant" to use a dedicated function for fetching and citing sources.
    -   **Benefit:** This formalizes our web-search capability, making it more robust and easier to extend.
-   [ ] **3. `chartSuggester`:**
    -   **Action:** Implement a feature where the AI detects data in slide text and suggests a `chartSuggester` call to format it visually.
    -   **Benefit:** Transforms dense, text-based data into easily digestible charts, a massive value-add for users.

### Phase 3: Strategic Polish Functions (The Differentiator)
**Goal:** Provide expert-level strategic feedback that sets our tool apart.

-   [ ] **1. `narrativeFlow` & `toneStyle`:**
    -   **Action:** Create new AI features in the "Analysis" tab that call these functions to give feedback on the deck's overall story and consistency.
    -   **Benefit:** Moves beyond single-slide analysis to providing holistic, strategic advice.
-   [ ] **2. `competitorMatrix`:**
    -   **Action:** Build a dedicated tool/template for competitive analysis that is powered by this function call.
    -   **Benefit:** Automates one of the most tedious but important slides in any pitch deck.

---

## 5. Conclusion

By implementing function calling in these three phases, we will systematically transform the Sun AI Pitch Deck Engine. It will evolve from a clever generator into a powerful, reliable creative partner. This plan prioritizes the most critical user needs first—a solid creation and editing workflow—before layering on advanced features that will create a best-in-class, defensible product.