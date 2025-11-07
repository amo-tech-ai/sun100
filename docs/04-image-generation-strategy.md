# Image Generation Strategy

**Document Status:** Initial Draft - 2024-08-03

This document outlines the strategic approach to generating high-quality, relevant images for pitch decks using the integrated AI capabilities. The goal is to move beyond simple prompts and empower users to create visuals that are as compelling as their content.

---

## Core Technology

All image generation is powered by Google's `gemini-2.5-flash-image` model. This model excels at understanding descriptive, narrative prompts to produce a wide range of visual styles.

---

## Strategic Options for Pitch Deck Images

Different slides in a pitch deck serve different purposes. Our image generation strategy should reflect this. Below are recommended approaches for various slide types.

### 1. Abstract & Thematic Images

**Best for:** Vision, Problem, Why Now?, high-level concept slides.

These slides benefit from visuals that convey a mood or an idea rather than a literal depiction.

-   **How to Accomplish:**
    -   Use metaphorical and descriptive language.
    -   Request minimalist compositions with significant negative space, which is ideal for slides that will have text overlays.
    -   Specify lighting and color palettes to set the tone.

-   **Example Prompt:**
    > "A minimalist composition featuring a single, glowing seedling sprouting from a crack in a concrete pavement, symbolizing new growth in a tough market. Soft, dawn lighting. Significant negative space to the left for text."

### 2. Photorealistic Scenes

**Best for:** Solution (in context), Team, Customer Persona slides.

These slides require relatable, real-world imagery that helps the audience connect with the human side of the business.

-   **How to Accomplish:**
    -   Use photography and cinematic terms: "close-up portrait," "wide-angle shot," "85mm lens."
    -   Describe the lighting in detail: "soft, golden hour light," "natural office lighting."
    -   Be specific about the subjects' appearance and actions.

-   **Example Prompt:**
    > "A photorealistic, eye-level shot of a diverse team of three young professionals collaborating enthusiastically around a laptop in a bright, modern co-working space. The mood is energetic and positive. Captured with a 50mm lens for a natural, soft-focus background."

### 3. Product Mockups & UI

**Best for:** Product, How It Works slides.

Clarity and professionalism are key. These images should look like they belong in a professional marketing campaign.

-   **How to Accomplish:**
    -   Use terms like "high-resolution," "studio-lit product photograph."
    -   Specify a clean, simple background (e.g., "on a polished concrete surface," "on a solid white background").
    -   Describe the lighting setup, like "three-point softbox setup to eliminate harsh shadows."

-   **Example Prompt:**
    > "A high-resolution, studio-lit product photograph of a modern smartphone displaying our app's main dashboard. The phone is presented on a clean, minimalist white surface. The lighting is soft and diffused to prevent glare."

### 4. Data Visualizations (Stylized)

**Best for:** Market Size, Financials, Traction slides.

While the model cannot generate precise, data-accurate charts, it can create compelling *representations* of data trends.

-   **How to Accomplish:**
    -   Describe the desired trend visually (e.g., "upward-trending," "hockey-stick growth").
    -   Specify the chart style ("modern illustration of a bar chart," "minimalist line graph").
    -   Define the color scheme to match the deck's branding.

-   **Example Prompt:**
    > "A stylized, 3D illustration of an upward-trending line graph, culminating in a glowing arrow. The color palette uses shades of blue and our brand's accent orange (#E87C4D). The design is clean and modern on a dark background."

---

## Implementation in the App

This strategy is already supported by the application's architecture:

1.  **Prompting:** The `imageUrl` field on any `Slide` object accepts a descriptive text prompt. The default AI-generated decks already include these prompts.
2.  **Generation:** In the `DeckEditor`, if a slide's `imageUrl` is not a URL, a "Generate Image" button appears.
3.  **Service:** Clicking this button triggers the `generateSlideImage` function in `geminiService.ts`, which communicates with the `gemini-2.5-flash-image` model to create the visual.

---

## Summary of Best Practices

To achieve the best results, users should be encouraged to:

-   **Describe, Don't Just List:** Instead of "business, success, chart," write a sentence: "A chart showing successful business growth."
-   **Be Hyper-Specific:** The more detail provided (lighting, camera angle, style, color), the more control you have over the output.
-   **Provide Context:** Mention the purpose of the image. "An image for a pitch deck slide about our market size" gives the AI valuable context.
-   **Iterate:** Use the AI Copilot to refine prompts if the first image isn't perfect.