
# AI Design Implementation Plan: Decktopus-Style Editor Redesign

**Document Status:** Planning - 2024-08-04

**System Goal:** Transform the current three-column Sun AI Deck Editor into a cleaner, more focused two-column layout inspired by Decktopus. This plan details the required architectural changes, component refactoring, and styling updates.

---

## 1. File Impact Analysis

To achieve the target layout, the following file changes are necessary. The core idea is to break down the monolithic `DeckEditor.tsx` into smaller, reusable components, making the layout more modular and maintainable.

### Files to be Modified

| File                           | Reason for Modification                                                                                                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `screens/DeckEditor.tsx`       | **Complete Overhaul.** Refactor from a three-column to a two-column layout. It will act as the main state container, orchestrating the new `SlideOutline` and `EditorPanel` child components. |
| `components/AICopilot.tsx`     | **Minor Styling.** Adjustments may be needed for padding and margins to fit within the new tabbed `AIToolbox` component.                                                                      |
| `components/ImageEditorPanel.tsx` | **Minor Styling.** Adjustments for consistent look and feel inside the `AIToolbox`.                                                                                                       |
| `components/AnalysisPanel.tsx` | **Minor Styling.** Adjustments for consistent look and feel inside the `AIToolbox`.                                                                                                       |
| `components/ResearchResultPanel.tsx` | **Minor Styling.** Adjustments for consistent look and feel inside the `AIToolbox`.                                                                                                       |

### Files to be Created

| File                          | Purpose                                                                                                                                                         |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `components/SlideOutline.tsx` | **New Component.** Will render the left-side panel, containing the list of all slides in an outline format. Manages the display and selection of slides.          |
| `components/EditorPanel.tsx`  | **New Component.** Will render the right-side panel, containing the main slide preview and the new `AIToolbox`. This isolates the editing context from the layout. |
| `components/AIToolbox.tsx`    | **New Component.** Will consolidate all four AI panels (`AICopilot`, `ImageEditor`, etc.) into a single, tabbed interface to save space and reduce clutter.       |

---

## 2. Implementation Plan

This is a step-by-step guide to executing the refactor.

### Step 1: Restructure `DeckEditor.tsx`

1.  **Remove Old Layout:** Delete the current three-column JSX structure (`<aside>`, `<main>`, `<aside>`).
2.  **Implement New Two-Column Layout:** Create a root `div` with a Tailwind class `flex h-full`.
3.  **Integrate New Components:**
    *   Render the `<SlideOutline />` component for the left panel.
    *   Render the `<EditorPanel />` component for the right panel.
4.  **State Management:**
    *   `DeckEditor.tsx` will continue to hold the primary state: `deck`, `setDeck`, `selectedSlide`, `setSelectedSlide`, and all AI-related handler functions (`handleGenerateImage`, `handleEditImage`, etc.).
    *   Pass the necessary state and handlers down to `SlideOutline` and `EditorPanel` as props.

**Example `DeckEditor.tsx` structure:**

```tsx
// screens/DeckEditor.tsx (Simplified)
const DeckEditor: React.FC = () => {
    // ... all existing state and handlers ...

    return (
        <div className="flex h-full bg-[#FBF8F5]">
            <SlideOutline
                slides={deck.slides}
                selectedSlideId={selectedSlide.id}
                onSlideSelect={handleSlideSelect}
                deckTitle={deck.title}
                onTitleSave={handleTitleSave}
            />
            <EditorPanel
                deck={deck}
                selectedSlide={selectedSlide}
                // Pass all handlers for AI actions
                onGenerateImage={handleGenerateImage}
                onEditImage={handleEditImage}
                onCopilotGenerate={handleCopilotGenerate}
                onAnalyzeSlide={handleAnalyzeSlide}
                onResearch={handleResearch}
                // Pass all state for loading/results
                isGeneratingImage={isGeneratingImage}
                isEditingImage={isEditingImage}
                // ... etc.
            />
        </div>
    );
};
```

### Step 2: Create the `SlideOutline` Component

1.  **Create `components/SlideOutline.tsx`:** This component will represent the entire left panel.
2.  **Layout:**
    *   Use a `div` with a fixed width, e.g., `w-[320px] bg-white border-r`.
    *   It will contain the deck title editor (logic moved from `DeckEditor.tsx`) and the scrollable list of slides.
3.  **Map Slides:**
    *   Accept `slides`, `selectedSlideId`, and `onSlideSelect` as props.
    *   Map over the `slides` array to render each slide as an item.
    *   Apply conditional styling for the selected slide based on `selectedSlideId`.

### Step 3: Create the `EditorPanel` Component

1.  **Create `components/EditorPanel.tsx`:** This component will represent the entire right panel.
2.  **Layout:**
    *   Use a `div` that takes the remaining space: `flex-1 p-8 overflow-y-auto`.
    *   This component will contain the main slide preview and the new `AIToolbox`.
3.  **Slide Preview:** The JSX for rendering the selected slide (the large preview) will be moved here from `DeckEditor.tsx`.
4.  **Integrate AI Toolbox:** Render the `<AIToolbox />` component below the slide preview. Pass all the necessary AI-related props down to it.

### Step 4: Create the `AIToolbox` Component

1.  **Create `components/AIToolbox.tsx`:** This component will manage the AI tools.
2.  **Tabbed Interface:**
    *   Implement a simple tab system with local state to manage the `activeTab`.
    *   Create tabs for "Copilot," "Image," "Analysis," and "Research."
    *   Conditionally render the corresponding panel component (`AICopilot`, `ImageEditorPanel`, etc.) based on the `activeTab`.
    *   The `ImageEditorPanel` should only be rendered in its tab if the selected slide has a generated image.

---

## 3. Style & Theme Integration

-   **Layout Patterns:**
    -   `DeckEditor`: `flex h-full`
    -   `SlideOutline`: `w-[320px] flex-shrink-0 bg-white border-r border-gray-200 flex flex-col`
    -   `EditorPanel`: `flex-1 flex flex-col items-center p-8 overflow-y-auto`
-   **Component Patterns:**
    -   `.outline-item`: `flex items-center p-2 rounded-md cursor-pointer border-2 transition-colors`
    -   `.outline-item-active`: `border-[#E87C4D] bg-orange-50`
    -   `.ai-toolbox-tab`: `py-2 px-4 font-medium text-sm cursor-pointer border-b-2`
    -   `.ai-toolbox-tab-active`: `border-[#E87C4D] text-[#E87C4D]`
-   **Responsive Design:** The two-column layout is more robust for responsiveness. On smaller screens (`< 1024px`), the `SlideOutline` could be collapsed into a toggleable drawer to maximize editor space.

---

## 4. Functional Mapping

| Feature / Action        | Old Location                                | New Location                                                                        |
| ----------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Slide Selection**     | Left sidebar in `DeckEditor.tsx`            | `SlideOutline.tsx` component.                                                       |
| **Deck Title Edit**     | Left sidebar in `DeckEditor.tsx`            | Top of `SlideOutline.tsx` component.                                                |
| **Slide Preview**       | Center `<main>` in `DeckEditor.tsx`         | Top section of `EditorPanel.tsx`.                                                   |
| **AI Copilot**          | Right sidebar in `DeckEditor.tsx`           | "Copilot" tab within `AIToolbox.tsx`, which is inside `EditorPanel.tsx`.            |
| **Image Edit**          | Right sidebar in `DeckEditor.tsx`           | "Image" tab within `AIToolbox.tsx`.                                                 |
| **Slide Analysis**      | Right sidebar in `DeckEditor.tsx`           | "Analysis" tab within `AIToolbox.tsx`.                                              |
| **AI Research**         | Right sidebar in `DeckEditor.tsx`           | "Research" tab within `AIToolbox.tsx`.                                              |
| **Present Button**      | Bottom of left sidebar in `DeckEditor.tsx`  | Can be moved to a header bar above the `EditorPanel` for better visibility.         |

---

## 5. Success Criteria

-   [ ] **Layout:** The editor correctly renders a two-column layout (Outline on left, Editor on right).
-   [ ] **Outline Functionality:** The slide outline correctly displays all slides, highlights the active slide, and selecting a new slide updates the main editor view.
-   [ ] **Editor Functionality:** The selected slide renders correctly in the `EditorPanel`.
-   [ ] **AI Toolbox:** The `AIToolbox` renders correctly with functional tabs.
-   [ ] **AI Actions:** All AI actions (generate/edit image, copilot, analysis, research) remain fully functional from their new locations within the tabs.
-   [ ] **State Integrity:** Editing content, titles, or images correctly updates the main `deck` state in `DeckEditor.tsx` and persists to `sessionStorage`.
-   [ ] **Responsiveness:** The layout adapts gracefully to smaller screen sizes without breaking.

---

## 6. Production-Ready Checklist

| Category          | Criteria                                                                               |
| ----------------- | -------------------------------------------------------------------------------------- |
| **Code**          | All new components have clear prop types. Build succeeds with no new warnings/errors.    |
| **UX/UI**         | Layout visually matches the Decktopus structure. Spacing is consistent. Hierarchy is clear. |
| **Performance**   | No noticeable performance degradation from prop drilling. Component rendering is fast.   |
| **Accessibility** | Tabbed interface in `AIToolbox` is keyboard navigable. ARIA roles are used correctly.    |
| **Testing**       | Manually verify all criteria in the "Success Criteria" section are met end-to-end.       |

