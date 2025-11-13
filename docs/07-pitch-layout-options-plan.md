# AI Design Implementation Plan: Intelligent Pitch Deck Layout System

**Document Status:** Planning - 2024-08-24
**System Goal:** To transform the current static pitch deck templates into an intelligent, flexible layout system that leverages AI to suggest the most effective visual structure for a slide's content.

---

### 1. Analysis of Current State

-   **What's Working:**
    -   **Variety of Themes:** The application offers four distinct starting points (`default`, `professional`, `minimalist`, `startup`), providing good aesthetic variety.
    -   **Responsive Foundation:** The use of Tailwind CSS ensures that the templates are maintainable and have a solid responsive base.

-   **Weaknesses & Opportunities:**
    -   **Rigidity:** Each template has a single, fixed layout (e.g., image-left, text-right). This is inflexible for diverse content types. A "Team" slide, a "Problem" slide, and a "Quote" slide all require different visual structures, but are currently forced into the same layout.
    -   **Inconsistent Spacing:** The templates use arbitrary padding values (`p-12`, `p-16`). A more systematic approach to spacing would create a more polished and professional feel.
    -   **Flat Visual Hierarchy:** The layouts are functional but do not do enough to guide the viewer's eye to the most important information on the slide, reducing the overall impact.

---

### 2. Core Design Principles for Improvement

This section outlines four core design principles that will form the foundation of our new, intelligent layout system.

#### A. Establish a Clear Typographic Hierarchy
A great presentation uses typography to guide the audience. Instead of using generic text sizes, we should define a strict, proportional scale.

-   **Recommendation:**
    -   **Slide Title (`<h1>`):** Use a large, bold font (`text-4xl lg:text-5xl font-extrabold`). This is the first thing an investor should see.
    -   **Key Insight / Subtitle (`<h2>`):** A slightly smaller font (`text-xl lg:text-2xl`) to summarize the slide's core message.
    -   **Body Content (`<p>`, `<ul>`):** Use a clean, readable size (`text-lg lg:text-xl`) with ample line-height (`leading-relaxed`) for readability.
    -   **Captions & Data Labels:** Use a smaller font (`text-sm`) for less critical information like chart labels or image captions.

#### B. Implement a Consistent Spacing System
Professional design feels harmonious because the space between elements is consistent and proportional. We can achieve this by adopting an 8-point grid system, where all spacing and sizing values are multiples of 8px.

-   **Recommendation:** Use Tailwind's default spacing scale consistently.
    -   **Padding:** Use `p-8` for smaller cards, `p-12` or `p-16` for main slide padding.
    -   **Gaps:** Use `gap-8` for spacing between columns or `gap-4` for smaller elements.
    -   **Margins:** Use `mb-4`, `mb-8`, etc., to create a consistent vertical rhythm between the title and body content.

#### C. Create Multiple Layout Variations (The "Options")
This is the most impactful architectural change. Instead of one layout per theme, we will introduce a new, powerful `dynamic` template with multiple layout options that can be applied on a per-slide basis.

-   **Recommendation:** Introduce a new `dynamic` template in `styles/templates.ts` with the following layout variations:
    -   **`layout-default`:** The classic two-column layout (text and image). Ideal for "Problem," "Solution," and general content slides.
    -   **`layout-text-centric`:** A layout with a larger text area and a smaller visual element, perfect for content-heavy slides.
    -   **`layout-visual-centric`:** A full-bleed image background with a text overlay, perfect for powerful opening, closing, or transition slides (e.g., "Vision").
    -   **`layout-quote`:** A layout specifically designed for a single, large, centered quote to make a powerful statement.
    -   **`layout-three-column`:** Ideal for "Team" slides, pricing tables, or comparing three key features side-by-side.

#### D. Use Color for Strategic Emphasis
In a professional presentation, color should be used to draw attention, not just for decoration.

-   **Recommendation:**
    -   The vast majority of text should be a dark, highly readable color (`text-brand-blue` or `text-gray-800`).
    -   The brand's accent color (`text-brand-orange`) should be used sparingly to highlight key metrics, calls-to-action, or important words in a title. This makes those elements "pop" and tells the investor exactly what to focus on.

---

### 3. AI Integration Strategy: The Intelligent Layout Agent

The existing `suggestLayout` function in `services/aiService.ts` is the key to this new system. We will upgrade it to become a true **Intelligent Layout Agent**.

-   **Goal:** Enhance the `suggestLayout` AI function to be content-aware and suggest the most effective layout *variation* for a given slide.

-   **New AI Workflow:**
    1.  **Analyze Content:** The Gemini model will be prompted to analyze the `slide.title`, `slide.content`, and `slide.type` (e.g., 'problem', 'team').
    2.  **Choose Best Layout:** Based on the analysis, it will choose the most effective layout variation from the new `dynamic` template's options.
    3.  **Return Actionable Suggestion:** The function will return a specific, combined layout key (e.g., `dynamic-layout-three-column`).

-   **Example AI Logic:**
    -   If `slide.type === 'team'`, suggest `dynamic-layout-three-column`.
    -   If `slide.content` contains quotation marks, suggest `dynamic-layout-quote`.
    -   If `slide.type === 'vision'`, suggest `dynamic-layout-visual-centric`.

---

### 4. Architectural Impact & Implementation Steps

1.  **Modify `styles/templates.ts`:**
    -   **Action:** Create a new `dynamic` template entry. This will be an object containing separate style definitions for each layout variation (`layout-default`, `layout-visual-centric`, etc.), rather than a single flat object.

2.  **Modify `services/aiService.ts`:**
    -   **Action:** Update the prompt for the `suggestLayout` function to instruct Gemini to analyze the slide's content and choose one of the new layout variation keys as its response. The function's return type will be updated to `Promise<{ layout: string }>`.

3.  **Modify `EditorPanel.tsx`:**
    -   **Action:** The component responsible for rendering the slide will be updated to parse the new layout keys.
    -   **Logic:** When applying a template, it will check if the key contains a variation (e.g., `dynamic-layout-three-column`). If so, it will apply the base `dynamic` styles and then merge in the specific `layout-three-column` styles. This allows for a flexible and scalable system.