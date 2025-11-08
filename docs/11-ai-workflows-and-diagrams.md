# System Architecture & AI Workflows

**Document Status:** Planning - 2024-08-06

This document provides a comprehensive set of diagrams illustrating the complete user journey, system architecture, and detailed AI agent workflows for the Sun AI Pitch Deck Engine. It visually represents the function-calling architecture that powers the application's intelligent features.

---

### 1. High-Level User Journey

This flowchart shows the typical path a user takes from starting the application to presenting a finished deck.

```mermaid
graph TD
    A[Dashboard] -->|Clicks 'Create New Deck'| B(Wizard: Enter Details);
    B -->|Clicks 'Generate Deck'| C(Generating Screen);
    C -->|AI Generates Deck Outline| D(Deck Editor);
    D -- User edits content, images, and layout --> D;
    D -->|AI Agents Assist (Copilot, Visuals, Analysis)| D;
    D -->|Clicks 'Present'| E(Presentation Screen);
    E -->|Clicks 'Exit'| D;
```

---

### 2. Deck Generation Sequence Diagram

This diagram details the initial creation of the deck, highlighting the `generateDeckOutline` function call.

```mermaid
sequenceDiagram
    participant User
    participant UI as Wizard / Generating Screen
    participant Service as geminiService
    participant Model as Gemini API

    User->>UI: Enters company details
    User->>UI: Clicks "Generate Deck"
    UI->>Service: generateDeckContent(companyDetails)
    Service->>Model: generateContent({ tools: [generateDeckOutline] })
    Model-->>Service: response { functionCalls: [generateDeckOutline(...)] }
    Service-->>UI: Returns structured Deck object
    UI->>User: Navigates to Deck Editor with new deck
```

---

### 3. Content Editing (Copilot) Sequence Diagram

This illustrates how the AI Copilot refines slide content using the `rewriteSlide` function call.

```mermaid
sequenceDiagram
    participant User
    participant UI as Deck Editor / AI Toolbox
    participant Service as geminiService
    participant Model as Gemini API

    User->>UI: Enters prompt: "Make this more concise"
    User->>UI: Clicks "Generate Suggestions"
    UI->>Service: modifySlideContent(slide, "Make this more concise")
    Service->>Model: generateContent({ tools: [rewriteSlide] })
    Model-->>Service: response { functionCalls: [rewriteSlide(newTitle, newContent)] }
    Service-->>UI: Returns { newTitle, newContent }
    UI->>User: Updates slide with revised content
```

---

### 4. Image Generation Workflow

This flowchart shows the advanced, two-step process for generating a high-quality, context-aware image.

```mermaid
flowchart TD
    A[1. Start with Slide Content] --> B{2. Call AI with `imageBrief` tool};
    B --> C[3. AI returns a structured brief<br/>(e.g., style, palette, keywords)];
    C --> D{4. Call AI with Brief + generate image prompt};
    D --> E[5. AI returns a final, high-quality image];
```

---

### 5. Image Editing Sequence Diagram

This diagram shows how a user can iteratively refine an existing image. While this doesn't use a function call, it shows the multi-modal text + image input.

```mermaid
sequenceDiagram
    participant User
    participant UI as Deck Editor / AI Toolbox
    participant Service as geminiService
    participant Model as Gemini API

    User->>UI: Enters prompt: "Add a sun in the sky"
    User->>UI: Clicks "Apply Edit"
    UI->>Service: editSlideImage(base64Image, "Add a sun...")
    Service->>Model: generateContent({ parts: [image, text] })
    Model-->>Service: response { candidates: [{ content: { parts: [newImage] } }] }
    Service-->>UI: Returns new base64 image string
    UI->>User: Displays the edited image
```

---

### 6. Slide Analysis Sequence Diagram

This shows the "Analyst Agent" providing structured feedback on a slide using the `analyzeSlideContent` function call.

```mermaid
sequenceDiagram
    participant User
    participant UI as Deck Editor / AI Toolbox
    participant Service as geminiService
    participant Model as Gemini API

    User->>UI: Clicks "Get Detailed Feedback"
    UI->>Service: analyzeSlide(slide.title, slide.content)
    Service->>Model: generateContent({ tools: [analyzeSlideContent] })
    Model-->>Service: response { functionCalls: [analyzeSlideContent(...)] }
    Service-->>UI: Returns structured SlideAnalysis object
    UI->>User: Displays ratings and feedback for Clarity, Impact, Tone
```

---

### 7. Research Assistant Sequence Diagram

This illustrates how the "Research Agent" uses the `googleSearch` tool to provide grounded answers with sources.

```mermaid
sequenceDiagram
    participant User
    participant UI as Deck Editor / AI Toolbox
    participant Service as geminiService
    participant Model as Gemini API

    User->>UI: Enters query: "Latest AI trends"
    User->>UI: Clicks "Go"
    UI->>Service: researchTopic("Latest AI trends")
    Service->>Model: generateContent({ tools: [googleSearch] })
    Model-->>Service: response { text: "summary...", groundingMetadata: [...] }
    Service-->>UI: Returns { summary, sources }
    UI->>User: Displays summary and clickable source links
```

---

### 8. Automated Layout Suggestion Workflow

This diagram shows the future-state capability of the AI suggesting a layout for a slide.

```mermaid
sequenceDiagram
    participant User
    participant UI as Deck Editor
    participant Service as geminiService
    participant Model as Gemini API

    User->>UI: Clicks "Auto-Layout" button
    UI->>Service: suggestLayout(slide.content)
    Service->>Model: generateContent({ tools: [chooseLayout] })
    Model-->>Service: response { functionCalls: [chooseLayout(layoutName='professional')] }
    Service-->>UI: Returns layout name
    UI->>User: Applies 'professional' template styles to the slide
```

---

### 9. Overall System Architecture

This diagram provides a master map of how all the components of the Sun AI Pitch Deck Engine interact.

```mermaid
graph TD
    subgraph "Browser (Client-Side)"
        subgraph "React Application"
            A[DashboardLayout] --> B[Dashboard];
            A --> C[WizardSteps];
            A --> D[GeneratingScreen];
            A --> E[DeckEditor];
            E --> F[SlideOutline];
            E --> G[EditorPanel];
            G --> H[AIToolbox];
        end

        subgraph "Core Logic"
            I[geminiService.ts]
        end

        C -- Calls --> I;
        D -- Calls --> I;
        H -- Calls --> I;
    end

    subgraph "Google Cloud"
        J[Gemini API]
        subgraph "AI Tools (Functions)"
            K[generateDeckOutline]
            L[rewriteSlide]
            M[analyzeSlideContent]
            N[imageBrief]
            O[googleSearch]
            P[chooseLayout]
        end
    end

    I -- API Requests --> J;
    J -- Executes --> K;
    J -- Executes --> L;
    J -- Executes --> M;
    J -- Executes --> N;
    J -- Executes --> O;
    J -- Executes --> P;

    J -- Returns structured data --> I;
```

---

### 10. Context-Aware Suggestion Workflow

This sequence diagram shows how the application proactively generates suggestions for the user whenever they select a new slide.

```mermaid
sequenceDiagram
    participant User
    participant UI as Deck Editor
    participant Service as geminiService
    participant Model as Gemini API

    User->>UI: Selects a new slide
    UI->>UI: useEffect triggers on slide change
    UI->>Service: Promise.all([suggestImprovements, suggestImagePrompts, ...])
    Service->>Model: generateContent({ tools: [suggestImprovements] })
    Model-->>Service: response { functionCalls: [suggestImprovements(...)] }
    Service-->>UI: Returns array of suggestions
    UI->>UI: Updates state with suggestions
    UI->>User: Displays suggestions as clickable chips

    User->>UI: Clicks a suggestion chip
    UI->>Service: Triggers corresponding action (e.g., modifySlideContent)
```
