# 🤖 AI Agent Blueprint: One-Pager & Investor Update Generators

**Document Status:** Planning - 2024-09-02
**Goal:** To design the prompt engineering and data flow for automatically generating high-stakes investor communications using Gemini 3.

---

## Part 1: The "Perfect One-Pager" Agent

### 1. Concept
A One-Pager (or "Tear Sheet") is a single page summary used to get an initial meeting. It must be dense, factual, and visually structured. We do not want the AI to generate a "blob" of text; we want structured fields to render into a nice UI/PDF.

### 2. Input Data
*   **Startup Profile:** Name, Tagline, Vision.
*   **Metrics:** Current MRR, Growth Rate, Run Rate.
*   **Fundraising:** Target Raise, Use of Funds.

### 3. AI Architecture
*   **Model:** `gemini-3-pro-preview`
*   **Config:** `responseSchema` (Strict JSON)

### 4. Prompt Strategy
> "Generate a structured One-Pager for a VC audience.
>
> **Constraints:**
> - 'Problem' must be < 40 words.
> - 'Solution' must focus on benefits, not features.
> - 'Market' must include the TAM figure if provided.
>
> **Output Schema:**
> ```json
> {
>   "headline": "The Operating System for X",
>   "problem_summary": "...",
>   "solution_summary": "...",
>   "market_opportunity": "...",
>   "traction_bullets": ["$10k MRR", "20% MoM Growth"],
>   "team_highlight": "Ex-Google AI Engineers",
>   "funding_ask": "$2M Seed to scale sales"
> }
> ```"

---

## Part 2: The "Smart Investor Update" Agent

### 1. Concept
Founders dread writing monthly updates. This agent automates the "Math" and drafts the "Narrative." It compares this month's data to last month's to automatically highlight growth or explain churn.

### 2. Input Data
*   **Period A Metrics:** e.g., Jan Revenue ($10k), Active Users (100).
*   **Period B Metrics:** e.g., Feb Revenue ($12k), Active Users (150).
*   **Qualitative Notes:** "Launched Feature X", "Lost Customer Y".

### 3. AI Architecture
*   **Model:** `gemini-3-pro-preview`
*   **Tools:** `functionCalling` (optional, if we want the model to request data), but direct injection of JSON metrics is simpler and faster.
*   **Thinking Level:** `low` (Reasoning is straightforward comparison).

### 4. Prompt Strategy
> "You are an assistant to a startup founder. Draft a monthly investor update email based on the following data.
>
> **Data Comparison:**
> - Revenue: $10k -> $12k
> - Users: 100 -> 150
>
> **Founder Notes:**
> - Hired a new CTO.
> - Delay in product launch by 1 week.
>
> **Instructions:**
> 1. Calculate the % growth for Revenue and Users.
> 2. If growth is > 10%, start with a 'Green' status summary.
> 3. If growth is flat or negative, use a 'Yellow' status and diplomatically explain using the notes.
> 4. Structure the email with sections: Highlights, Lowlights, KPI Summary, and Asks.
> 5. Tone: Professional, transparent, and succinct."

### 5. Output Format
The output should be Markdown text that can be easily copied into an email client or rendered in the dashboard.

```markdown
# February Update: 20% Growth & New CTO 🚀

**Status:** 🟢 On Track

**Key Metrics:**
*   **Revenue:** $12k (+20% MoM)
*   **Users:** 150 (+50% MoM)

**Highlights:**
We are thrilled to welcome our new CTO...

**Lowlights:**
We experienced a minor delay...
```