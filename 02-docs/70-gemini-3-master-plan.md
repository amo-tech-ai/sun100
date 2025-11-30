
# 🧠 Gemini 3 Master Plan: The Intelligent Pitch Deck Wizard

**Document Status:** Actionable Strategy - 2025-01-16
**Author:** Lead AI Systems Architect
**Goal:** To design the definitive "Gemini 3 Native" Pitch Deck Wizard, leveraging Thinking, Search Grounding, URL Context, and Code Execution to produce investor-grade assets automatically.

---

## 1. Project Evaluation & Requirements

### Goal Analysis
We are moving from "generative text" (LLM guessing) to "agentic construction" (LLM reasoning + acting). The user provides raw, unstructured business context; the system must return a structured, factual, and strategic 10-12 slide deck.

### Key Requirements
1.  **Strategic Depth:** The deck cannot be generic. It must understand the specific business model (SaaS vs. Marketplace vs. DeepTech). -> **Solution: Gemini 3 Thinking Mode.**
2.  **Market Accuracy:** Market sizing (TAM/SAM/SOM) and competitor lists must be real, not hallucinated. -> **Solution: Google Search Grounding.**
3.  **Contextual Integrity:** It must read the user's website to capture the exact brand voice and product details. -> **Solution: URL Context.**
4.  **Mathematical Precision:** Financial projections and ask calculations must be mathematically correct. -> **Solution: Code Execution.**
5.  **Structural Reliability:** The frontend requires a strict JSON shape to render the deck editor. -> **Solution: Structured Outputs (JSON Schema).**

---

## 2. The Wizard Flow Design

This 4-step flow maximizes data intake while minimizing user friction.

### Step 1: The "Brain Dump" (Context)
*   **Input:** "Tell us about your startup in 2-3 sentences." OR "Upload your one-pager/whitepaper."
*   **Gemini Action:** Text Analysis to extract core intent.
*   **Validation:** Ensure min. character count or valid file type.

### Step 2: The "Fact Check" (URL & Docs)
*   **Input:** Website URL (optional), LinkedIn URL (optional).
*   **Gemini Action:** `urlContext` tool crawls the site to extract Feature lists, Pricing tiers, and Team bios automatically.
*   **Fallback:** If crawl fails, ask user to manually input 3 key features.

### Step 3: The "Strategist" (Goal Setting)
*   **Input:** "What is your current stage?" (Pre-Seed/Seed/A), "Target Raise Amount?"
*   **Gemini Action:** `thinking_config` enabled. The model reasons: "For a Seed stage SaaS raising $2M, the narrative should focus on Traction and Velocity, not just Vision."

### Step 4: Generation (The Magic)
*   **Input:** "Generate Deck."
*   **Gemini Action:** Multi-tool execution (Search -> Calculate -> Write -> Format).
*   **Output:** A complete JSON object containing 12 slides.

---

## 3. Gemini 3 Tool Selection Matrix

| Feature / Tool | Usage in Wizard | Value Add | Risk / Mitigation |
| :--- | :--- | :--- | :--- |
| **Thinking Mode** (`thinking_level="high"`) | Used for the **Problem, Solution, and Why Now** slides. | Prevents generic fluff. Ensures the logic flows (Problem A -> Solution A). | Higher latency. Show "AI is strategizing..." UI state. |
| **Google Search** (`googleSearch`) | Used for **Market Size (TAM)** and **Competition** slides. | Provides real, cited numbers (e.g., "Global AI Market is $400B"). | Search failures. Fallback to "Estimate based on industry averages." |
| **URL Context** (`urlContext`) | Used to pre-fill **Product** and **Team** slides. | Reduces user typing. Ensures deck matches website copy. | Paywalls/Scrape blocks. Fallback to text input. |
| **Code Execution** (`codeExecution`) | Used for **Financials** and **The Ask**. | Calculates "18 months runway" accurately based on Raise / Burn. | Execution error. Fallback to text-based estimates. |
| **Structured Output** (`responseSchema`) | Used for **The Entire Response**. | Guarantees the React app never crashes due to bad JSON. | Strict schema limits creativity. Use `description` fields effectively. |

---

## 4. Engineering Action Plan

### Phase 1: Backend Setup (Supabase Edge Functions)
1.  **Create Endpoint:** `generate-deck-v2`.
2.  **Security:** Inject `GEMINI_API_KEY` via `Deno.env`.
3.  **Client Init:** Initialize `GoogleGenAI` with `v1beta` (required for some new tools).

### Phase 2: Schema Definition
Define the strict `DeckSchema` for the model to populate:
```typescript
const slideSchema = Schema.object({
  title: Schema.string(),
  type: Schema.enum(['problem', 'solution', 'market', 'team', 'financials', 'ask', 'traction', 'product', 'vision', 'competition']),
  bullets: Schema.array(Schema.string()),
  visual_prompt: Schema.string(),
  speaker_notes: Schema.string(),
  data_source: Schema.string(description="URL of source if data was searched"),
});

const deckSchema = Schema.object({
  slides: Schema.array(slideSchema),
  executive_summary: Schema.string(),
});
```

### Phase 3: The "Super-Prompt" Design
Construct a prompt that chains these tools:
> "You are a VC Partner.
> 1. Read the user's URL (`urlContext`).
> 2. Research the market size for this industry (`googleSearch`).
> 3. Calculate the required runway (`codeExecution`).
> 4. REASON (`thinking`) about the strongest narrative arc.
> 5. Output the final deck in strict JSON."

### Phase 4: Error Handling
*   **Retry Logic:** If `googleSearch` fails, retry without it (graceful degradation).
*   **Validation:** Parse the JSON with Zod before sending to frontend.

---

## 5. Success Criteria

*   **Accuracy:** 100% of "Market Size" slides contain a number and a citation source.
*   **Validity:** 100% of responses parse correctly against the `Deck` Zod schema.
*   **Relevance:** The "Solution" slide explicitly references features found on the user's provided URL.
*   **Logic:** The "Ask" slide math (Raise / Monthly Burn = Runway) is correct to within 1 month.

---

## 6. Production Readiness Checklist

### AI Readiness
- [ ] `responseSchema` matches Frontend Types exactly.
- [ ] `googleSearch` is restricted to high-quality domains (optional dynamic retrieval config).
- [ ] `thinking_level` is set to "high" for the generation step.

### Engineering
- [ ] API Key is stored in Supabase Secrets (NOT `.env` committed to repo).
- [ ] Edge Function timeout increased to 60s+ (Thinking + Search takes time).
- [ ] Database table `ai_runs` logs token usage and latency for cost tracking.

### Frontend
- [ ] Wizard shows "Searching Market Data..." and "Analyzing Strategy..." distinct loading states.
- [ ] Error Boundary catches JSON parse failures and offers a "Retry" button.

---

## 7. Simulated Output: The Gemini 3 Generated Deck

*Input Context:* "Sun AI Startup. An AI platform for founders to generate pitch decks. SaaS model. Seed stage."

```json
{
  "executive_summary": "Sun AI reduces the 40+ hour fundraising prep process to 10 minutes using advanced LLMs, targeting the $50B productivity software market.",
  "slides": [
    {
      "type": "vision",
      "title": "Democratizing the Perfect Pitch",
      "bullets": [
        "Fundraising is 80% storytelling, 20% data.",
        "Most founders fail because they can't articulate their vision.",
        "Sun AI is the 'Chief Strategy Officer' in your pocket."
      ],
      "visual_prompt": "A glowing, sunrise-themed interface connecting a founder to a venture capital deal.",
      "speaker_notes": "Start with the emotional hook: great ideas die because of bad storytelling."
    },
    {
      "type": "problem",
      "title": "The Fundraising Gap",
      "bullets": [
        "Founders spend 100+ hours on deck design, not product.",
        "Professional agencies cost $5k-$10k per deck.",
        "Generic templates fail to capture strategic nuance."
      ],
      "visual_prompt": "A split screen: A stressed founder burying in paperwork vs. a calm founder using AI.",
      "speaker_notes": "Highlight the opportunity cost. Time spent on slides is time not spent selling."
    },
    {
      "type": "solution",
      "title": "Sun AI: From Idea to Investor-Ready",
      "bullets": [
        "End-to-end deck generation using Gemini 3 reasoning.",
        "Real-time market data injection via Google Search.",
        "Automated financial modeling via Code Execution."
      ],
      "visual_prompt": "A dashboard screenshot of Sun AI showing the 'Generate Deck' wizard completing.",
      "speaker_notes": "Emphasize that this isn't just a template tool; it's an intelligence layer."
    },
    {
      "type": "market",
      "title": "A $50B Opportunity in Productivity",
      "bullets": [
        "Global Productivity Software Market: $52B (2023).",
        "Generative AI Market CAGR: 42% through 2032.",
        "SAM: 50M Early-stage founders and SMB owners."
      ],
      "data_source": "https://www.grandviewresearch.com/industry-analysis/productivity-management-software-market",
      "visual_prompt": "A layered TAM/SAM/SOM diagram with Sun AI capturing the high-growth AI segment.",
      "speaker_notes": "We are riding two massive waves: the explosion of entrepreneurship and the adoption of GenAI."
    },
    {
      "type": "product",
      "title": "Built on Advanced Reasoning",
      "bullets": [
        "Thinking Mode: Validates business logic before writing.",
        "Grounding: Cites sources for every claim.",
        "Live Sync: Updates deck as your metrics change."
      ],
      "visual_prompt": "Detailed UI shot of the 'AI Copilot' sidebar suggesting a strategic pivot.",
      "speaker_notes": "Our moat is the depth of the AI integration. It 'thinks' like an investor."
    },
    {
      "type": "business_model",
      "title": "SaaS + Marketplace Economics",
      "bullets": [
        "Freemium Entry: Viral growth via watermarked decks.",
        "Pro Tier ($49/mo): Unlimited AI runs and export.",
        "Take Rate: 15% on expert designer marketplace matches."
      ],
      "visual_prompt": "A clean pricing table comparing Free, Pro, and Enterprise tiers.",
      "speaker_notes": "We monetize the tool (SaaS) and the network (Marketplace)."
    },
    {
      "type": "traction",
      "title": "Early Velocity",
      "bullets": [
        "2,000+ Decks Generated in Beta.",
        "40% Week-over-Week User Growth.",
        "3 Funded Startups (Seed) using Sun AI decks."
      ],
      "visual_prompt": "An 'up and to the right' line chart showing user growth overlayed with logos of funded startups.",
      "speaker_notes": "We aren't just a tool; we are already generating outcomes for our users."
    },
    {
      "type": "competition",
      "title": "Winning on Intelligence",
      "bullets": [
        "Canva/PowerPoint: Great design, zero intelligence.",
        "Gamma/Tome: Generic text, low strategic depth.",
        "Sun AI: Deep reasoning, financial accuracy, and live data."
      ],
      "visual_prompt": "A 2x2 Matrix. X-axis: Design Freedom. Y-axis: Strategic Intelligence. Sun AI is top-right.",
      "speaker_notes": "Competitors help you format. We help you think."
    },
    {
      "type": "team",
      "title": "Engineers & Operators",
      "bullets": [
        "Alex Chen (CEO): Ex-Google AI, scaled ML infra to 1B users.",
        "Sam Rao (CTO): AI Researcher, specialist in LLM reasoning.",
        "David Kim (Product): Founder of 2 exited SaaS startups."
      ],
      "visual_prompt": "Three professional headshots with logos of previous companies (Google, etc.) below.",
      "speaker_notes": "We are the perfect team to build this because we've lived the problem."
    },
    {
      "type": "ask",
      "title": "Fueling the Engine",
      "bullets": [
        "Raising: $2M Seed Round.",
        "Runway: 18 Months to reach Series A metrics.",
        "Use of Funds: 60% Engineering, 30% Growth, 10% Ops."
      ],
      "visual_prompt": "A donut chart showing the allocation of funds.",
      "speaker_notes": "This capital gets us to $1M ARR and 50k users."
    }
  ]
}
```