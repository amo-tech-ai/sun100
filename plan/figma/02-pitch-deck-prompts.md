# Pitch Deck AI System — Figma Make AI Prompts

**Version:** 1.0  
**Purpose:** Direct, production-ready Figma prompts for the complete Pitch Deck system  
**Status:** Ready to implement

---

## Table of Contents

1. [Master Component Library](#1-master-component-library)
2. [Wizard Step 1: Context](#2-wizard-step-1-context)
3. [Wizard Step 2: Aesthetic](#3-wizard-step-2-aesthetic)
4. [Wizard Step 3: Details](#4-wizard-step-3-details)
5. [Wizard Step 4: Financials](#5-wizard-step-4-financials)
6. [Generating Screen](#6-generating-screen)
7. [Deck Editor](#7-deck-editor)
8. [AI Copilot Sidebar](#8-ai-copilot-sidebar)
9. [Presentation Mode](#9-presentation-mode)
10. [Mobile Responsive](#10-mobile-responsive)

---

## 1. Master Component Library

### Prompt 1A: Design System Tokens

```
Create a design system for a SaaS pitch deck generator with these exact tokens:

COLORS:
- Primary: #1E3A5F (navy)
- Accent: #F97316 (orange)
- AI Accent: #8B5CF6 (violet/purple gradient)
- Background: #FAFBFC
- Surface: #FFFFFF
- Border: #E5E7EB
- Text Primary: #111827
- Text Secondary: #6B7280
- Success: #10B981
- Error: #EF4444

TYPOGRAPHY:
- Font: Inter
- H1: 32px/600
- H2: 24px/600
- H3: 18px/600
- Body: 16px/400
- Caption: 14px/400
- Small: 12px/400

SPACING:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

RADIUS:
- sm: 6px
- md: 8px
- lg: 12px
- xl: 16px
- full: 9999px

SHADOWS:
- sm: 0 1px 2px rgba(0,0,0,0.05)
- md: 0 4px 6px rgba(0,0,0,0.07)
- lg: 0 10px 15px rgba(0,0,0,0.1)

Generate color swatches, typography scale, spacing grid, and shadow samples as Figma components.
```

### Prompt 1B: Core UI Components

```
Design these UI components for a pitch deck wizard. Use Inter font, 8px grid, rounded corners (8-12px).

BUTTONS:
1. Primary: Orange (#F97316), white text, 44px height, 16px padding
2. Secondary: White bg, gray border, dark text
3. Ghost: Transparent, dark text, hover: light gray
4. AI Action: Purple gradient (#8B5CF6 to #7C3AED), white text, sparkle icon

INPUTS:
1. Text Input: 44px height, gray border, focus: orange border
2. Textarea: Same style, 120px min height
3. URL Input: Globe icon prefix, "https://" placeholder
4. Slider: Orange track, white thumb with shadow

CHIPS/TAGS:
1. Selectable: White bg → Orange bg when selected, checkmark icon
2. Category: Gray bg, rounded-full, small text
3. Status: Colored dot + text (green/yellow/red)

CARDS:
1. Template Card: 200x140px preview area, title below, category tag
2. Info Card: Icon + title + description, white bg, subtle shadow
3. Summary Card: Key-value pairs, dividers

PROGRESS:
1. Step Indicator: 4 circles connected by lines, active=filled, complete=checkmark
2. Progress Bar: Orange fill, gray track, percentage text

Create all variants with hover, active, disabled states.
```

---

## 2. Wizard Step 1: Context

### Prompt 2A: Context Screen Layout

```
Design Step 1 of a 4-step pitch deck wizard. Screen title: "Tell me about your business."

LAYOUT (1440x900px):
- Left: 220px sidebar (navigation menu)
- Top: 64px header with step progress indicator
- Center: 600px max-width content area

HEADER:
- Left: Sparkle icon + "PITCH WIZARD"
- Center: Step indicator (1=active, 2-4=inactive)
  - 1: "CONTEXT" (filled circle)
  - 2: "AESTHETIC" (empty)
  - 3: "DETAILS" (empty)
  - 4: "FINANCIALS" (empty)

CONTENT:
1. Hero Section:
   - H1: "Tell me about your business."
   - Subtitle: "I'll use this to structure your narrative, financials, and market slides."

2. Deck Type Toggle:
   - Two buttons side by side: "Investor Pitch" (selected, orange) | "Sales Deck"
   - Icons: briefcase, presentation

3. Business Description:
   - Large textarea (600x160px)
   - Placeholder: "Describe your startup, product, target market, and traction..."
   - Character counter: "246 chars" bottom right
   - Orange border when focused

4. Website URL Section:
   - Icon: Globe
   - Label: "Have a website?"
   - Subtext: "We can crawl it to extract features and pricing."
   - Input: URL field with "+ Add" button
   - Added URLs appear as removable chips below

FOOTER:
- Right side: "NEXT STEP: Choose Aesthetic" label + "Next →" button (dark navy)
- Sticky at bottom

Use white background, clean spacing (24-32px between sections).
```

### Prompt 2B: Context Screen AI Enhancement

```
Add AI assistance features to the Context screen:

AI SUGGESTION PANEL (appears after 100+ chars typed):
- Position: Below textarea, subtle purple border
- Content:
  - Sparkle icon + "AI detected:"
  - Chips showing extracted entities: "Problem: X", "Solution: Y", "Market: Z"
  - Button: "✨ Improve with AI" (purple gradient)

QUICK START TEMPLATES:
- Position: Above textarea (collapsed by default)
- Toggle: "Need help? Try a template"
- Options when expanded:
  - "I'm building [product] for [audience] that [benefit]"
  - "We help [who] solve [problem] by [how]"
- Click fills textarea with template

IMPORT OPTIONS:
- Row of small buttons below URL section:
  - "📄 Import from PDF"
  - "🔗 Import from LinkedIn"
  - "📊 Upload existing deck"

Design these as progressive disclosure — don't overwhelm first-time users.
```

---

## 3. Wizard Step 2: Aesthetic

### Prompt 3A: Template Selection Grid

```
Design Step 2: Template Selection. Title: "Define Your Aesthetic"

HEADER:
- Step indicator: 1=checkmark, 2=active, 3-4=inactive
- Subtitle: "Choose a visual theme. The AI will adapt fonts, layouts, and image generation styles to match."

TEMPLATE GRID:
- 3 columns, 3 rows (9 templates)
- Card size: 280x200px
- Selected state: Orange border (2px), checkmark badge top-right

TEMPLATE CARDS (design all 9):
1. "Classic Clean" - White bg, serif title, UNIVERSAL tag
2. "Enterprise Pro" - Dark navy bg, white text, CORPORATE tag
3. "Modern Minimal" - White bg, sans-serif, lots of whitespace, SAAS tag
4. "Dark Mode" - Black bg, white/gray text, TECH tag
5. "Vibrant Bold" - Bright colors, large typography, CONSUMER tag
6. "Vibrant Vision" - Gradient bg, modern, CREATIVE tag
7. "Vibrant Impact" - High contrast, bold shapes, CREATIVE tag
8. "Vibrant Features" - Feature-focused layout, CREATIVE tag
9. "Vibrant Journey" - Purple gradient, storytelling, CREATIVE tag

Each card shows:
- Preview thumbnail (shows sample slide design)
- Template name below
- Category tag (right-aligned, small pill)

FILTER ROW (above grid):
- Pills: "All" | "Light" | "Dark" | "Corporate" | "Creative"
- Active pill: Orange bg

FOOTER:
- Left: "Back" text button
- Right: "NEXT STEP: Startup Details" + "Next →" button
```

### Prompt 3B: Template Preview Modal

```
Design a template preview modal when user clicks a template card:

MODAL (800x600px):
- Header: Template name + close X
- Body: 3 sample slides from that template (carousel with dots)
  - Slide 1: Vision slide
  - Slide 2: Problem slide
  - Slide 3: Traction slide
- Sidebar (200px right):
  - "Template Details"
  - Color palette swatches (5 colors)
  - Font preview: "Heading / Body"
  - Best for: "Early-stage SaaS startups"
  - Used by: "1,234 decks"
- Footer:
  - "Select Template" button (orange)
  - "Cancel" text button

Add subtle animation hint (slide carousel indicator).
```

---

## 4. Wizard Step 3: Details

### Prompt 4A: Business Details Form

```
Design Step 3: Business Details. Title: "Tell Us About Your Business"

HEADER:
- Step indicator: 1-2=checkmarks, 3=active, 4=inactive
- Subtitle: "These details help the AI tailor your investor pitch narrative and financial projections."

FORM LAYOUT (single centered column, 600px max):

SECTION 1: Business Type
- Label: "What type of business is this?" + "(Select all that apply)"
- Multi-select chips in 2 rows:
  Row 1: AI SaaS | Marketplace | B2B SaaS | Consumer App | Fintech | Creator/Media
  Row 2: Hardware | Other
- Selected chips: Orange bg, white text, checkmark

SECTION 2: Stage
- Label: "What stage are you at?"
- Single-select chips:
  Idea | MVP | Pre-Seed | Seed | Series A+ | Growth
- Only one can be selected (orange)

SECTION 3: Deck Focus
- Label: "What is your main focus for this deck?" + "(Max 3)"
- Multi-select chips (max 3):
  Raising capital | Selling to Customers | Joining an accelerator | Closing customers
  Updating existing investors | Internal strategy | Recruiting

SECTION 4: Team & Traction (side by side)
- Left column: "Team Size"
  Chips: Solo | 2-5 | 6-15 | 16+
- Right column: "Traction"
  Chips: Pre-launch | Early users | Paying customers | Growing revenue

SECTION 5: Target Raise
- Label: "Target Raise Amount"
- Slider: $100k to $5M+ (logarithmic scale)
- Display: Large orange text showing current value (e.g., "$300k")
- Markers below: $100k | $1M | $5M+

FOOTER:
- "Back" button (left)
- "NEXT STEP: Financials" + "Next →" button (right)
```

### Prompt 4B: Details Screen AI Suggestions

```
Add AI-powered suggestions to the Details screen:

AI INSIGHTS CARD (right side, 280px):
- Purple gradient border, white bg
- Header: Sparkle icon + "AI Insights"
- Content:
  - "Based on your inputs:"
  - Bullet: "AI SaaS at MVP stage typically raises $500K-$1M"
  - Bullet: "92% of successful seed decks focus on problem + traction"
  - Bullet: "Solo founders should emphasize advisory network"
- Button: "Apply Recommendations" (purple outline)

SMART DEFAULTS:
- When user selects "AI SaaS" + "Seed":
  - Auto-suggest raise: $750K
  - Auto-select focus: "Raising capital"
  - Show toast: "✨ Suggested settings applied"

VALIDATION INDICATORS:
- Add green checkmarks next to completed sections
- Show warning if conflicting selections (e.g., "Growth" stage with "Idea" traction)
```

---

## 5. Wizard Step 4: Financials

### Prompt 5A: Financials & Review Screen

```
Design Step 4: Final Details & Review. Title: "Final Details"

LAYOUT: Two columns (60/40 split)

LEFT COLUMN (Main Content):

SECTION 1: Business Model Deep Dive
- Card with orange left border
- Fields:
  - "Revenue Model" dropdown: Subscription | Usage | Commission | One-time | Hybrid
  - "Avg Price / Deal Size ($)" input: number field

SECTION 2: Gemini 3 Deep Reasoning
- Purple gradient card (full width)
- Toggle switch (default: ON)
- Label: "Gemini 3 Deep Reasoning"
- Subtext: "Enable for complex strategic analysis (takes ~10s longer)."

RIGHT COLUMN (Review Summary):

SUMMARY CARD:
- Header: "REVIEW SUMMARY"
- Content (key-value pairs):
  - Type: "Investor Pitch"
  - Theme: Orange dot + "default"
  - Stage: "MVP"
  - Focus: "Raising capital" tag
- Subtext: "The AI will generate 10 slides tailored to AI SaaS at the MVP stage."

FOOTER:
- Left: "Back" button
- Right: "NEXT STEP: Generate Deck" + "✨ Generate Deck" button (ORANGE, prominent)
```

### Prompt 5B: Optional Financial Fields

```
Design expandable financial details section for Step 4:

COLLAPSIBLE SECTION: "Advanced Financial Data (Optional)"
- Collapsed by default
- Click to expand

EXPANDED CONTENT (2-column grid):

Row 1:
- "Current MRR ($)": Number input
- "Monthly Growth (%)": Number input with % suffix

Row 2:
- "Monthly Burn ($)": Number input
- "Runway (months)": Auto-calculated, read-only

Row 3:
- "Previous Funding": Dropdown (None | Pre-seed | Seed | Series A)
- "Amount Raised ($)": Number input

USE OF FUNDS SECTION:
- Label: "Planned Use of Funds"
- Chips (multi-select): Engineering | Marketing | Sales | Operations | Hiring
- Visual: Mini pie chart preview showing allocation

AI VALIDATION:
- Show warnings if numbers don't add up
- "Your burn rate suggests 8 months runway. Consider raising $X for 18 months."
```

---

## 6. Generating Screen

### Prompt 6A: Generation Loading Screen

```
Design the deck generation loading screen:

LAYOUT: Full screen, centered content

MAIN CONTENT (centered, 500px max):

LOGO/ICON:
- Large sparkle animation (48px, rotating/pulsing)
- Gradient: Purple to orange

TITLE:
- H1: "Generating Your Pitch Deck"
- Animate: Text typing effect

PROGRESS SECTION:
- Progress bar: 0-100%, orange fill, gray track
- Current step label below (changes as it progresses):
  - "Analyzing your business context..."
  - "Researching market size..."
  - "Crafting your narrative..."
  - "Generating slide content..."
  - "Applying template styles..."
  - "Finalizing your deck..."

SLIDE PREVIEW AREA:
- 3 placeholder cards (200x120px each)
- Animate: Cards flip/reveal as slides complete
- Show slide number and title when done

ESTIMATED TIME:
- "Usually takes 30-60 seconds"
- Elapsed time counter: "Elapsed: 0:23"

TIPS CAROUSEL (bottom):
- Rotating tips while waiting:
  - "💡 Tip: Strong problem slides have quantified pain points"
  - "💡 Tip: The best asks show clear use of funds"
  - "💡 Tip: Traction slides should show growth trajectory"
```

### Prompt 6B: Generation Complete State

```
Design the generation complete state:

TRANSITION: Progress bar hits 100%, confetti animation

SUCCESS STATE:

HEADER:
- Checkmark icon (green circle)
- H1: "Your Deck is Ready!"
- Subtitle: "10 investor-ready slides generated"

DECK PREVIEW:
- Large card showing first slide (cover slide)
- Deck title overlay at bottom
- Template style visible

STATS ROW:
- "10 Slides" | "5 AI Images" | "3 Data Charts" | "Est. 12 min read"

ACTION BUTTONS:
- Primary: "Open in Editor" (orange, large)
- Secondary: "Preview Slides" (outline)
- Tertiary: "Share Link" (text button)

QUICK ACTIONS:
- "Download PDF" icon button
- "Duplicate Deck" icon button
- "Start Presentation" icon button
```

---

## 7. Deck Editor

### Prompt 7A: Editor Main Layout

```
Design the main deck editor interface:

LAYOUT (1440x900px, 3 columns):
- Left Sidebar: 240px (slide outline)
- Center: Flexible (slide canvas)
- Right Sidebar: 320px (AI tools, collapsible)

TOP BAR (64px):
- Left: Back arrow + Deck title (editable) + Slide count "3/10"
- Center: (empty or breadcrumb)
- Right: Action buttons
  - "✨ AI" button (purple)
  - "▶ Present" button (indigo)
  - "↓ Export" dropdown

LEFT SIDEBAR (Slide Outline):
- Header: Deck title + edit icon
- Slide list (scrollable):
  - Thumbnail (160x90px) + slide number
  - Current slide: Orange left border
  - Drag handle on hover
- Footer: "+ Add Slide" button (full width)

CENTER (Slide Canvas):
- Large slide preview (16:9 ratio)
- Navigation arrows (< >) on sides
- Editable fields:
  - Title (large, click to edit)
  - Content (bullet points, click to edit)
  - Image placeholder (click to generate)

RIGHT SIDEBAR (AI Tools):
- Tab: "AI Copilot"
- Content sections (see next prompt)
```

### Prompt 7B: Slide Canvas Detail

```
Design the slide canvas editing area in detail:

CANVAS CONTAINER:
- White background
- Subtle shadow (lg)
- 16:9 aspect ratio
- Max width: 900px
- Centered in available space

EDITABLE TITLE:
- Position: Top third of slide
- Style: Template heading style
- Click: Inline editing with orange underline
- Placeholder: "Click to add title"

EDITABLE CONTENT:
- Position: Middle section
- Style: Bullet list, template body style
- Each bullet: Click to edit
- "+ Add bullet" on hover
- Drag to reorder

IMAGE AREA:
- Position: Right side or bottom (varies by layout)
- Placeholder state:
  - Dashed border
  - Camera icon
  - "Click to generate image"
- Generated state:
  - Image displayed
  - Hover: "Regenerate" button overlay

SLIDE NAVIGATION:
- Left arrow: Previous slide (positioned outside canvas)
- Right arrow: Next slide
- Keyboard hints: "← →" small text below

TOOLBAR (appears on selection):
- Floating bar above selected element
- Bold | Italic | Bullet | Link | AI Rewrite
```

### Prompt 7C: Slide Types & Layouts

```
Design slide layout variations for these slide types:

1. VISION SLIDE:
- Full-width bold headline
- Tagline below
- Gradient or solid background
- Optional: Company logo

2. PROBLEM SLIDE:
- Large stat/number (e.g., "67%")
- Problem statement
- Supporting bullets
- Sad/frustrated illustration

3. SOLUTION SLIDE:
- Value proposition headline
- 3-column benefits
- Each: Icon + title + description
- Product screenshot

4. MARKET SLIDE:
- TAM/SAM/SOM circles (nested)
- Numbers with labels
- Source citations (small text)
- Growth arrow

5. TRACTION SLIDE:
- Line/bar chart (primary)
- Key metrics grid below
- Logos of customers/partners

6. TEAM SLIDE:
- 2-3 founder cards
- Photo + Name + Title + Bio
- LinkedIn icon link

7. ASK SLIDE:
- Large funding amount
- Pie chart: Use of funds
- Timeline/milestones

Create each as a separate frame showing the layout grid.
```

---

## 8. AI Copilot Sidebar

### Prompt 8A: AI Copilot Panel

```
Design the AI Copilot sidebar (320px width):

HEADER:
- "AI Copilot" title
- Sparkle icon
- Collapse button (chevron)

SECTION 1: Quick Actions
- Grid of action buttons (2x3):
  - "✨ Improve" - Rewrite for impact
  - "📊 Add Data" - Generate charts
  - "🔍 Research" - Market data
  - "🎨 Image" - Generate visual
  - "📝 Expand" - Add more content
  - "✂️ Shorten" - Make concise

SECTION 2: Slide Analysis
- Card showing current slide score:
  - Clarity: ★★★★☆ (4/5)
  - Impact: ★★★☆☆ (3/5)
  - Tone: ★★★★★ (5/5)
- "Get detailed feedback" link

SECTION 3: Suggestions
- List of AI suggestions:
  - "Add quantified metrics to problem statement"
  - "Consider A/B testing these headlines"
  - "Market slide could use TAM/SAM/SOM breakdown"
- Each has "Apply" button

SECTION 4: Chat Input
- Text input: "Ask AI anything about this slide..."
- Send button
- Recent prompts dropdown
```

### Prompt 8B: AI Action Modals

```
Design modals for AI actions:

MODAL 1: Headline Generator
- Title: "Generate Headlines"
- Current headline shown
- 5 generated alternatives (radio select):
  - Each shows: Headline + tone tag (Bold/Professional/Creative)
- "Regenerate" button
- "Apply Selected" primary button

MODAL 2: Market Research
- Title: "Market Research"
- Loading state: "Searching for market data..."
- Results:
  - TAM: $45B (Source: Gartner 2024)
  - SAM: $12B (Calculation shown)
  - SOM: $1.2B (Assumptions listed)
  - Growth: 24% CAGR
- "Insert into slide" button
- "Edit values" link

MODAL 3: Image Generator
- Title: "Generate Slide Image"
- Prompt input (pre-filled from slide context)
- Style selector: Photo | Illustration | Abstract | Chart
- Generated preview (takes 10-20s)
- "Regenerate" | "Use Image" buttons

MODAL 4: Chart Builder
- Title: "Create Chart"
- Chart type selector: Line | Bar | Pie | Area
- Data input table:
  - Label | Value columns
  - Add/remove rows
- Live preview
- "Insert Chart" button
```

---

## 9. Presentation Mode

### Prompt 9A: Presentation View

```
Design the presentation/slideshow mode:

LAYOUT: Full screen, black background

SLIDE DISPLAY:
- Centered slide (max 90% of screen)
- White slide with content
- Smooth transition animations between slides

BOTTOM BAR (appears on mouse move):
- Left: Slide counter "3 / 10"
- Center: Navigation dots (clickable)
- Right: Controls
  - Previous/Next arrows
  - Full screen toggle
  - Exit button (X)

PRESENTER NOTES (optional panel):
- Toggle with 'N' key
- Right sidebar showing:
  - Current slide notes
  - Timer
  - Next slide preview

KEYBOARD SHORTCUTS:
- Show hint on first load:
  - "→ or Space: Next slide"
  - "← : Previous slide"
  - "Esc: Exit presentation"
  - "N: Toggle notes"
```

### Prompt 9B: Export & Share Options

```
Design export and share interfaces:

EXPORT DROPDOWN:
- "Download PDF" (with quality options: Standard/High)
- "Download PPTX" (coming soon badge)
- "Download Images" (all slides as PNG)

SHARE MODAL:
- Title: "Share Your Deck"
- Options:
  1. "Copy Link" - Public view link with copy button
  2. "Email" - Enter emails, add message
  3. "Embed" - Copy embed code
- Settings:
  - Toggle: "Allow downloading"
  - Toggle: "Require email to view"
  - Expiry dropdown: Never | 7 days | 30 days
- "Create Share Link" button

SHARE LINK PREVIEW:
- Shows what recipient will see
- Viewer count badge
- "Disable Link" option
```

---

## 10. Mobile Responsive

### Prompt 10A: Mobile Wizard (375px)

```
Design mobile version of the pitch deck wizard:

CHANGES FROM DESKTOP:
- Single column layout
- Collapsible sidebar (hamburger menu)
- Stacked form fields
- Bottom sheet for selections instead of dropdowns

STEP 1 (Mobile):
- Header: Hamburger + "StartupAI" + Step dots
- Content:
  - "Tell me about your business" (H2)
  - Deck type: Stacked buttons
  - Textarea: Full width
  - URL section: Stacked
- Footer: Sticky "Next" button (full width)

STEP 2 (Mobile):
- Template grid: 2 columns instead of 3
- Cards: Smaller (150x100px)
- Swipe to see more

STEP 3 (Mobile):
- Chips wrap to multiple lines
- Slider: Touch-friendly (larger handle)
- Side-by-side sections stack vertically

STEP 4 (Mobile):
- Summary card: Above form instead of sidebar
- Generate button: Full width, sticky bottom
```

### Prompt 10B: Mobile Editor (375px)

```
Design mobile deck editor:

VIEW MODES:
1. Slide Overview (default):
   - Grid of slide thumbnails (2 columns)
   - Tap to select
   - Long press for options

2. Single Slide Edit:
   - Full screen slide view
   - Tap fields to edit
   - Bottom toolbar: AI | Image | Delete | More

NAVIGATION:
- Bottom tab bar:
  - Slides | Edit | AI | Export
- Swipe left/right between slides

AI COPILOT (Mobile):
- Bottom sheet (slides up)
- Quick actions as horizontal scroll
- Chat input at bottom

EDITING:
- Title: Tap to open full-screen text editor
- Content: Same approach
- Image: Tap to open generation modal

LIMITATIONS NOTE:
- Show banner: "For full editing, use desktop"
- Key features work, advanced features limited
```

---

## Implementation Checklist

### Design System
- [ ] Color tokens
- [ ] Typography scale
- [ ] Spacing system
- [ ] Component library (buttons, inputs, cards)
- [ ] Icon set

### Wizard Screens
- [ ] Step 1: Context
- [ ] Step 2: Aesthetic
- [ ] Step 3: Details
- [ ] Step 4: Financials
- [ ] Generating screen
- [ ] Success state

### Editor Screens
- [ ] Main layout (3 columns)
- [ ] Slide canvas
- [ ] Slide outline sidebar
- [ ] AI copilot sidebar
- [ ] All 10 slide type layouts

### Additional Screens
- [ ] Presentation mode
- [ ] Export modal
- [ ] Share modal
- [ ] Mobile wizard
- [ ] Mobile editor

### States & Interactions
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Hover states
- [ ] Selected states
- [ ] Disabled states

---

## Quick Reference: Copy-Paste Prompts

### Minimal Wizard Prompt
```
Design a 4-step wizard for creating AI pitch decks. Steps: Context → Aesthetic → Details → Financials. Clean SaaS style, orange accent, Inter font, white cards, progress indicator at top. Include "Generate Deck" button on final step.
```

### Minimal Editor Prompt
```
Design a pitch deck editor with 3 columns: slide thumbnails left (240px), slide canvas center, AI tools right (320px). Top bar with deck title and export buttons. Show slide with editable title, bullet points, and image placeholder.
```

### Minimal Mobile Prompt
```
Design mobile version (375px) of pitch deck wizard. Single column, stacked inputs, sticky bottom navigation, collapsible menu. Keep it touch-friendly with large tap targets.
```

---

**Last Updated:** 2025-12-07  
**Ready for:** Figma Make AI implementation

