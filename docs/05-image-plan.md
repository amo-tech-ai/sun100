# Implementation Plan: Advanced Image Generation

**Document Status:** Initial Draft - 2024-08-03

This document outlines the plan to evolve the app's visual capabilities, moving from the current text-to-image generation to a full suite of conversational image editing and refinement tools. This will leverage the advanced features of the `gemini-2.5-flash-image` model, allowing users to create and perfect visuals with unprecedented control directly within the pitch deck editor.

---

## ✅ Core Setup (Current State)

The application currently supports a foundational text-to-image workflow.

-   **Functionality:** A text prompt stored in a slide's `imageUrl` field can be used to generate a new image.
-   **Key Files:**
    -   `screens/DeckEditor.tsx`: Contains the UI logic for displaying the "Generate Image" button and handling the result.
    -   `services/geminiService.ts`: The `generateSlideImage` function encapsulates the API call to the `gemini-2.5-flash-image` model.
-   **User Flow:**

```mermaid
graph TD
    A[User sees text prompt on slide] -->|Clicks 'Generate Image'| B(DeckEditor);
    B -->|Calls generateSlideImage(prompt)| C(geminiService);
    C -->|Sends text prompt to Gemini API| D{gemini-2.5-flash-image};
    D -->|Returns base64 image| C;
    C -->|Returns base64 image| B;
    B -->|Updates slide state with image| E[User sees generated image];
```

---

## ⚫ Phase 1: Image Editing & Refinement (Next Steps)

**Goal:** Implement in-place image editing using text prompts, allowing users to iteratively refine visuals. This directly leverages the Image + Text-to-Image capability.

### Task 1: UI Enhancements in `DeckEditor.tsx`

-   **Description:** When an image is present on a slide (either generated or uploaded), the UI will provide an "Edit Image" input field and button. This creates a conversational loop for refinement.
-   **Success Criteria:**
    -   [ ] If a slide's `imageUrl` is a base64 data URI, an "Edit Image" section is displayed below the slide.
    -   [ ] This section contains a text input for the editing prompt (e.g., "make the car red," "add a sun in the sky").
    -   [ ] An "Apply Edit" button triggers the new service call, showing a loading overlay on the image.

### Task 2: Service Layer Update in `geminiService.ts`

-   **Description:** Create a new function, `editSlideImage`, which accepts the current base64 image data and a text prompt.
-   **Success Criteria:**
    -   [ ] A new function `editSlideImage(base64Image: string, prompt: string): Promise<string>` is created.
    -   [ ] The function constructs a `contents` payload with two parts: one `inlineData` part for the image and one `text` part for the prompt.
    -   [ ] The function successfully calls the `gemini-2.5-flash-image` model and returns the new base64 image data.

### Task 3: State Management & Data Flow

-   **Description:** Wire the new UI and service together within the `DeckEditor`.
-   **Success Criteria:**
    -   [ ] Clicking "Apply Edit" in the `DeckEditor` calls the `editSlideImage` service function with the current image and the user's text prompt.
    -   [ ] The `deck` state is correctly updated with the new base64 `imageUrl` upon a successful API response.
    -   [ ] The UI re-renders to display the newly edited image, replacing the old one.

### Proposed User Flow

```mermaid
graph TD
    A[User sees generated image on slide] --> B{Enters edit prompt: "make it night time"};
    B -->|Clicks 'Apply Edit'| C(DeckEditor);
    C -->|Calls editSlideImage(base64, prompt)| D(geminiService);
    D -->|Sends image + text to Gemini API| E{gemini-2.5-flash-image};
    E -->|Returns new base64 image| D;
    D -->|Returns new base64 image| C;
    C -->|Updates slide state| F[User sees edited image];
```

---

## ⚫ Phase 2: Image Upload (Future Enhancement)

**Goal:** Allow users to upload their own images (e.g., product photos, logos) and use the AI editing tools on them.

### Task 1: Implement Image Upload Component

-   **Description:** Add a file input to the editor that allows users to select a local image file. This file will be converted to a base64 data URI and stored in the slide's state.
-   **Success Criteria:**
    -   [ ] An "Upload Image" button is available on slides.
    -   [ ] Clicking the button opens the user's file browser (`<input type="file">`).
    -   [ ] Selecting a valid image file reads it, converts it to a base64 data URI, and updates the slide's `imageUrl`.
    -   [ ] The uploaded image is immediately displayed on the slide canvas.

### Task 2: Connect Upload to Editing Flow

-   **Description:** Ensure that uploaded images are seamlessly integrated into the editing workflow developed in Phase 1.
-   **Success Criteria:**
    -   [ ] Once an image is uploaded, the "Edit Image" UI from Phase 1 becomes active for that slide.
    -   [ ] Users can apply text-based edits to their own uploaded images.

---

## Production Readiness Checklist

Before shipping these features, the following criteria must be met:

-   [ ] **Error Handling:** Implement clear, user-friendly error messages if an image fails to edit or upload.
-   [ ] **UI/UX:**
    -   [ ] Loading states are non-blocking and clearly indicate progress.
    -   [ ] Controls for editing and uploading are intuitive and accessible.
    -   [ ] File size or dimension limits for uploads are clearly communicated.
-   [ ] **Performance:**
    -   [ ] Test UI responsiveness when handling large base64 image strings in the component state.
    -   [ ] Ensure file-to-base64 conversion is performant.
-   [ ] **Accessibility:** All new interactive elements (buttons, inputs) have appropriate ARIA labels and keyboard navigation support.
-   [ ] **Testing:**
    -   [ ] Manually verify the end-to-end text-to-image-to-edit workflow.
    -   [ ] Manually verify the end-to-end upload-to-edit workflow.
    -   [ ] Test with various image file types (.png, .jpg, .webp) and sizes.
