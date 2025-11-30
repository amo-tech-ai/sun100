# 🤖 AI Prompt Engineering: Investor Documents

**Document Status:** Planning - 2024-09-02
**Goal:** To define the specific prompts, function declarations, and schemas required to generate professional investor documents using Gemini 3.

---

## 1. The "Perfect One-Pager" Generator

**Goal:** Create a concise, high-impact summary of the business.
**Model:** `gemini-3-pro-preview`
**Config:** `responseSchema` (Strict Structure)

### Schema Design
```typescript
const onePagerSchema = {
  type: Type.OBJECT,
  properties: {
    headline: { type: Type.STRING, description: "A catchy 5-10 word value prop." },
    problem_summary: { type: Type.STRING, description: "2-3 sentences on the pain point." },
    solution_summary: { type: Type.STRING, description: "2-3 sentences on the product." },
    market_opportunity: { type: Type.STRING, description: "TAM/SAM/SOM narrative." },
    traction_highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
    business_model: { type: Type.STRING, description: "How they make money." },
    ask: { type: Type.STRING, description: "Funding amount and use of funds." },
    contact_info: { type: Type.OBJECT, properties: { email: {type: Type.STRING}, website: {type: Type.STRING} } }
  },
  required: ["headline", "problem_summary", "solution_summary", "traction_highlights", "ask"]
};
```

### Prompt Strategy
> "You are a Tier-1 Venture Capital associate. Analyze the following startup profile and metrics. Generate a 'One-Pager' summary that is compelling, concise, and focused on growth potential.
>
> **Startup Context:** [Insert JSON Data]
>
> **Requirements:**
> 1. Headline must be punchy and benefit-driven.
> 2. Focus on specific numbers and facts for traction (e.g., '20% MoM growth', '$10k MRR').
> 3. Keep the tone professional but energetic."

---

## 2. The "Smart Investor Update" Writer

**Goal:** Write a narrative email update comparing this month's performance to last month's.
**Model:** `gemini-3-pro-preview`
**Config:** `thinking_level: "low"` (for faster drafting) + `functionCalling`

### Prompt Strategy
> "You are drafting a monthly investor update for [Startup Name].
>
> **Current Month Metrics:** [Insert Metrics Object]
> **Previous Month Metrics:** [Insert Metrics Object]
> **Wins/Blockers:** [Insert User Notes]
>
> **Task:**
> 1. Calculate the MoM growth for Revenue and Active Users.
> 2. Draft a standard 'Good/Bad/Ugly' style investor update.
> 3. **Reasoning:** If growth is negative, explain it diplomatically based on the 'Blockers' provided. If positive, highlight it in the opening sentence.
> 4. Include a specific 'Ask' section based on the provided blockers."

---

## 3. The "GTM Strategy" Builder

**Goal:** Create a detailed Go-To-Market plan grounded in real-world data.
**Model:** `gemini-3-pro-preview`
**Config:** `tools: [{googleSearch: {}}], thinking_level: "high"`

### Prompt Strategy
> "Create a Go-To-Market strategy for a B2B SaaS company in the [Industry] space targeting [Target Audience].
>
> **Reasoning Steps (Thinking):**
> 1. Identify the top 3 channels for this specific audience (e.g., LinkedIn vs. TikTok).
> 2. Search for successful GTM case studies in this industry.
> 3. Define a content strategy.
> 4. Outline a sales funnel structure.
>
> **Output:**
> Return a structured Markdown document with sections for:
> - Target Persona Analysis
> - Channel Strategy (Ranked)
> - Content Pillars
> - 30/60/90 Day Execution Plan
> - Key Metrics to Track"

---

## 4. The "Deal Memo" Architect

**Goal:** Draft an internal investment memo (as if written by a VC) to help the founder understand their own strengths and weaknesses.
**Model:** `gemini-3-pro-preview`
**Config:** `tools: [{googleSearch: {}}], thinking_level: "high"`

### Prompt Strategy
> "Act as a cynical but fair General Partner at a VC firm. Write an Investment Memo for [Startup Name] based on the attached pitch deck content and metrics.
>
> **Thinking Process:**
> 1. Analyze the market size claims (verify with Google Search).
> 2. Scrutinize the competitive advantage.
> 3. Identify the biggest existential risk.
>
> **Output Sections:**
> 1. **Investment Thesis:** Why invest?
> 2. **Key Risks:** What could go wrong? (Be specific).
> 3. **Market Dynamics:** Trends and timing.
> 4. **Verdict:** A probability score (0-100) of funding success."