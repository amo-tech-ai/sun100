# Implementation Plan: Strategic AI Enhancements

**Document Status:** Production Blueprint - 2024-08-12 (Revised & Approved)
**System Goal:** To provide a detailed, actionable engineering plan for implementing the advanced AI features outlined in `docs/19-slide-deck-analysis.md`. This document will guide the development of each feature, ensuring a consistent, high-quality implementation.

---

### 1. Guiding Principles & Best Practices

-   **Incremental Implementation:** Each slide enhancement will be developed, tested, and validated as a discrete unit of work.
-   **User-in-the-Loop:** All AI suggestions are optional and must be confirmed by the user. The AI assists, but the user directs.
-   **Function-Driven Architecture:** Every new AI capability will be built upon a dedicated, strongly-typed function call in `services/geminiService.ts` for maximum reliability.
-   **Clear UI/UX:** New features will be integrated intuitively into the existing `AIToolbox` tabs (Copilot, Analysis, Research), with clear loading states and error handling.

---

## 2. Slide-by-Slide Implementation Plan

This section breaks down the implementation for each slide type, from 1 to 10.

---

### **Slide 1: The Vision Slide**

-   **Goal:** Hook investors in 10 seconds with a powerful, memorable brand identity.
-   **Enhancements:**
    1.  **Headline A/B Testing:** Generate 5 alternative headlines.
    2.  **Audience-Specific Subtitles:** Suggest powerful subtitles tailored to VCs or angels.
    3.  **High-Concept Visuals:** Suggest conceptual image prompts.

-   **Implementation Tasks:**
    1.  **UI:** In the "Copilot" tab, add a "Generate Headline Ideas" button. Results will be displayed in a list with a "Use" button. In the "Image" tab suggestions, include the conceptual visual prompts.
    2.  **Service:**
        -   Create `generateHeadlineVariations(title, audience)` which uses `generateHeadlinesFunctionDeclaration`.
        -   The visual prompts will be part of the existing `fetchAllSuggestions` call.
    3.  **Function Declaration:**
        ```typescript
        const generateHeadlinesFunctionDeclaration: FunctionDeclaration = {
            name: 'generateHeadlines',
            parameters: {
                type: Type.OBJECT,
                properties: {
                    headlines: {
                        type: Type.ARRAY,
                        description: 'An array of 5 compelling headline variations.',
                        items: { type: Type.STRING }
                    }
                },
                required: ['headlines']
            }
        };
        ```

-   **Success Criteria:** Clicking the button provides 5 relevant headlines. Visual suggestions are appropriate for a vision slide.

---

### **Slide 2: The Problem Slide**

-   **Goal:** Make investors feel the problem's urgency and significance.
-   **Enhancements:**
    1.  **Provocative Questioning:** Rewrite problem statements as engaging questions.
    2.  **Metric Extraction:** Automatically identify and suggest key pain-point metrics.
    3.  **Social Proof Finder:** Find real-world quotes validating the problem.

-   **Implementation Tasks:**
    1.  **UI:** In "Copilot" suggestions, include "Rewrite as a question". Add an "Extract Key Metrics" button. In the "Research" tab, add a "Find social proof" button.
    2.  **Service:**
        -   The rewrite action will use `modifySlideContent`.
        -   Create `extractMetrics(text)` using a new `extractMetricsFunctionDeclaration`.
        -   Create `findProblemQuotes(problemDescription)` which uses the existing `googleSearch` tool.
    3.  **Function Declaration:**
        ```typescript
        const extractMetricsFunctionDeclaration: FunctionDeclaration = {
            name: 'extractMetrics',
            parameters: {
                type: Type.OBJECT,
                properties: {
                    metrics: {
                        type: Type.ARRAY,
                        description: 'An array of key metrics found in the text.',
                        items: { 
                            type: Type.OBJECT,
                            properties: {
                                metric: { type: Type.STRING },
                                value: { type: Type.STRING }
                            },
                            required: ['metric', 'value']
                        }
                    }
                },
                required: ['metrics']
            }
        };
        ```
-   **Success Criteria:** All three actions perform as expected, enhancing the slide's text and providing external validation.

---

### **Slide 3: The Solution Slide**

-   **Goal:** Create an "aha" moment for the investor.
-   **Enhancements:**
    1.  **Benefit-Oriented Rewrites:** Convert feature descriptions into user benefits.
    2.  **"3 Pillars" Structure:** Distill the solution into three memorable pillars.
    3.  **Workflow Diagram Prompts:** Create a visual prompt for an AI-generated diagram.

-   **Implementation Tasks:**
    1.  **UI:** Add "Focus on benefits" and "Summarize in 3 pillars" suggestions to the "Copilot" tab. Add workflow diagram prompts to "Image" tab suggestions.
    2.  **Service:** The text-based actions will use `modifySlideContent`. The visual prompts will come from `fetchAllSuggestions`.
-   **Success Criteria:** The text rewrites are effective. The image suggestions provide a clear prompt for a workflow diagram.

---

### **Slide 4: The Market Slide**

-   **Goal:** Prove the market is large and growing with credible data.
-   **Enhancements:**
    1.  **Automated Market Sizing (TAM/SAM/SOM):** Use `googleSearch` to find market data.
    2.  **Market Trend Analysis:** Identify and summarize key growth trends.
    3.  **Source Validation:** Automatically add citation links for all researched data.

-   **Implementation Tasks:**
    1.  **UI:** In the "Research" tab, add a "Find Market Size & Trends" button.
    2.  **Service:** Create a new `researchMarketData(industry)` service function. The prompt will be engineered to specifically look for TAM/SAM/SOM data and growth trends, prioritizing credible sources.
-   **Success Criteria:** The research panel is populated with market size data, key trends, and clickable source links.

---

### **Slide 5: The Product Slide**

-   **Goal:** Make the product feel real and tangible.
-   **Enhancements:**
    1.  **Technical Jargon Simplifier:** Simplify technical descriptions for a business audience.
    2.  **Numbered Feature Lists:** Automatically format paragraphs into a clean, numbered list.

-   **Implementation Tasks:**
    1.  **UI:** Add "Simplify technical language" and "Format as a list" suggestions to the "Copilot" tab.
    2.  **Service:** Both actions will use the `modifySlideContent` service with specific instructions.
-   **Success Criteria:** The text is successfully simplified or reformatted on demand.

---

### **Slide 6: The Business Model Slide**

-   **Goal:** Show a clear, scalable, and proven model for generating revenue.
-   **Enhancements:**
    1.  **Pricing Table Generation:** Format features and pricing into a clean comparison table.
    2.  **Value Metric Clarification:** Help the user define their core value metric.

-   **Implementation Tasks:**
    1.  **UI:** Add a "Format as Pricing Table" button to the "Copilot" tab.
    2.  **Service:** Create a new `generatePricingTable(text)` service function with a dedicated `generatePricingTableFunctionDeclaration`. The returned structured data will be rendered into an HTML table in the UI, avoiding markdown issues.
    3.  **Function Declaration:**
        ```typescript
        const generatePricingTableFunctionDeclaration: FunctionDeclaration = {
            name: 'generatePricingTable',
            parameters: {
                type: Type.OBJECT,
                properties: {
                    tiers: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                price: { type: Type.STRING },
                                features: { type: Type.ARRAY, items: { type: Type.STRING } }
                            },
                            required: ['name', 'price', 'features']
                        }
                    }
                },
                required: ['tiers']
            }
        };
        ```
-   **Success Criteria:** User-provided text about pricing is transformed into a structured, professionally styled pricing table.

---

### **Slide 7: The Traction Slide**

-   **Goal:** Build credibility with undeniable proof of momentum.
-   **Enhancements:**
    1.  **Automated Chart Generation:** This is a core feature using the existing `suggestChart`.
    2.  **Key Metric Highlighting:** Emphasize the most impressive numbers.

-   **Implementation Tasks:**
    1.  **UI:** The "Suggest Chart" button is the primary feature. Add a "Highlight key metrics" suggestion to the "Copilot" tab.
    2.  **Service:** The highlight feature will use `modifySlideContent` with an instruction to wrap key numbers in asterisks (e.g., `*50%*`). The frontend will use a simple regex to convert `*...*` to `<strong>...</strong>`.
-   **Success Criteria:** Users can transform a text-based traction slide into a visual chart. Key metrics can be easily emphasized.

---

### **Slide 8: The Competition Slide**

-   **Goal:** Establish a unique and defensible market position.
-   **Enhancements:**
    1.  **2x2 Matrix Generation:** Generate a visual prompt for a 2x2 competitive matrix.
    2.  **"Why We Win" Summary:** Distill advantages into 2-3 powerful points.

-   **Implementation Tasks:**
    1.  **UI:** Add 2x2 matrix prompts to "Image" suggestions. Add "Create a 'Why We Win' summary" to "Copilot" suggestions.
    2.  **Service:** Use `fetchAllSuggestions` and `modifySlideContent` respectively.
-   **Success Criteria:** Users are guided to create a standard, effective competition slide with both visual and text-based tools.

---

### **Slide 9: The Team Slide**

-   **Goal:** Build trust by showcasing a credible team.
-   **Enhancements:**
    1.  **Compelling Bio Generation:** Generate a one-sentence bio from background info.
    2.  **Highlight Extraction:** Pull out high-status credentials.

-   **Implementation Tasks:**
    1.  **UI:** Add "Summarize bio" and "Extract highlights" buttons to the "Copilot" tab when on a team slide.
    2.  **Service:** Create a new `summarizeBio(rawText)` function using `summarizeBioFunctionDeclaration`.
    3.  **Function Declaration:**
        ```typescript
        const summarizeBioFunctionDeclaration: FunctionDeclaration = {
            name: 'summarizeBio',
            parameters: {
                type: Type.OBJECT,
                properties: {
                    summary: { type: Type.STRING, description: 'A compelling one-sentence summary.' },
                    highlights: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'An array of 2-3 key credentials.' }
                },
                required: ['summary', 'highlights']
            }
        };
        ```
-   **Success Criteria:** A long bio can be automatically condensed into a summary and key highlights.

---

### **Slide 10: The Ask Slide**

-   **Goal:** Make a clear, specific, and justified funding request.
-   **Enhancements:**
    1.  **Pie Chart Generation:** Generate a pie chart visualization for fund allocation.
    2.  **Milestone Timeline:** Create a visual prompt for a simple timeline.

-   **Implementation Tasks:**
    1.  **UI:** Add a "Generate Allocation Chart" button. Add timeline prompts to "Image" suggestions.
    2.  **Service:** Create a new `suggestPieChart` service function with a dedicated `suggestPieChartFunctionDeclaration`.
    3.  **Frontend:** Update `Chart.tsx` to render a new pie chart component when `chartData.type === 'pie'`. Update the `ChartData` type in `data/decks.ts`.
    4.  **Function Declaration:**
        ```typescript
        const suggestPieChartFunctionDeclaration: FunctionDeclaration = {
            name: 'suggestPieChart',
            description: 'Analyzes text for fund allocation percentages and creates data for a pie chart.',
            parameters: {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING, description: "The type of chart. Must be 'pie'." },
                    data: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                label: { type: Type.STRING, description: 'The allocation category (e.g., "Engineering").' },
                                value: { type: Type.NUMBER, description: 'The percentage for the category.' },
                            },
                            required: ['label', 'value'],
                        },
                    },
                },
                required: ['type', 'data'],
            },
        };
        ```
-   **Success Criteria:** Users can visualize their funding allocation as a pie chart, transforming the "Ask" slide into a data-driven request.

---

## 3. Cross-Cutting Concerns

### Chart & Visualization Strategy
- **Bar Charts:** The existing custom `Chart.tsx` component is sufficient.
- **Pie Charts (New):** For the "Ask" slide, we will extend the `Chart.tsx` component to render a simple SVG pie chart. We will not add a heavy charting library.
- **Tables (New):** For the "Business Model" slide, we will render a clean HTML `<table>` from the structured data returned by the AI.

### Error Handling & Loading States
- **Pattern:** All service calls within `DeckEditor.tsx` handlers must be wrapped in `try...catch...finally` blocks.
- **Loading:** The `finally` block will always be used to set the relevant `isLoading` state to `false`.
- **Errors:** The `catch` block will set a user-facing error message in the relevant state (`imageError`, `chartError`, etc.), which the UI will display near the action button.

### Testing Strategy
- **Unit Tests (`vitest`):** All new `geminiService.ts` functions must have corresponding unit tests that mock the Gemini API response and verify the function's output.
- **Manual E2E Testing:** A full manual test pass will be conducted before releasing these features, following the flow from slide creation to feature usage.