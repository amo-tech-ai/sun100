# 🚀 Engineering Blueprint: Smart Investor Docs Module

**Document Status:** Planning - 2024-09-01
**Author:** Lead AI Architect
**System Goal:** To implement a "Smart Investor Docs" module within Sun AI that uses **Gemini 3 Pro** (with Thinking & Structured Outputs) to automatically generate, update, and format high-stakes fundraising documents like One-Pagers, Investor Updates, and Deal Memos.

---

## 1. Executive Summary

Founders struggle to translate raw data into the specific formats investors expect. The **Smart Investor Docs** module solves this by acting as an "AI Investment Banker."

It connects to the startup's profile and metrics (Supabase) and uses Gemini 3's advanced reasoning to draft narrative-heavy documents, while using Function Calling to ensure every number (MRR, Burn, Cash) is real-time and accurate.

---

## 2. Feature Matrix & Capabilities

| Feature | Description | Gemini 3 Capability | Input Data | Output Format |
| :--- | :--- | :--- | :--- | :--- |
| **The "Perfect" One-Pager** | Generates a standard 1-page tear sheet including Problem, Solution, Market, and Traction. | **Structured Output** (Strict JSON Schema) | Startup Profile, URL Context | PDF / Web View |
| **Smart Investor Update** | Drafts a monthly/quarterly update letter. It compares current metrics vs. last month automatically. | **Function Calling** (`get_metrics`, `compare_periods`) | Metrics Table, Recent Wins (Text) | Markdown Email |
| **GTM Strategy Builder** | Creates a detailed Go-To-Market strategy document based on industry and stage. | **Thinking Config** (`thinking_level: "high"`) | Industry, Target Audience | Structured Doc |
| **Market Sizing Agent** | Auto-calculates TAM, SAM, SOM, and Beachhead using real-time search data. | **Google Search Grounding** | Industry, Location, ICP | JSON + Sources |
| **Data Room Indexer** | Scans uploaded files (or placeholders) and generates a "Readiness Score" and missing doc checklist. | **Long Context** + **File Search** | File List, User Uploads | JSON Checklist |

---

## 3. Technical Architecture (Supabase + Gemini)

```mermaid
sequenceDiagram
    participant User
    participant UI as Investor Docs UI
    participant Edge as Supabase Edge Function
    participant DB as Cloud SQL
    participant Gemini

    User->>UI: Selects "Market Sizing Agent"
    UI->>Edge: invoke('generate-market-sizing', { industry, location })
    Edge->>Gemini: generateContent({ 
        tools: [googleSearch, marketSizeSchema], 
        thinking_level: "high" 
    })
    Gemini->>Gemini: Performs Google Search for TAM/SAM data
    Gemini-->>Edge: Returns JSON { TAM, SAM, SOM, sources }
    Edge->>DB: Save to `startup_metrics` table
    Edge-->>UI: Display interactive Market Sizing card
```

---

## 4. Market Sizing Agent Strategy (TAM/SAM/SOM)

This specific agent addresses a critical investor requirement: proving the size of the opportunity.

### Definitions & Concepts
To ensure the AI generates useful data, it must understand these standard definitions:

*   **TAM (Total Addressable Market):** The total market demand for a product or service.
    *   *Example:* "All people who buy fitness apps ($150B)."
*   **SAM (Serviceable Available Market):** The segment of the TAM targeted by your products and services which is within your geographical reach.
    *   *Example:* "English-speaking fitness buyers ($10B)."
*   **SOM (Serviceable Obtainable Market):** The portion of SAM that you can capture.
    *   *Example:* "U.S. early adopters ($50M)."
*   **ICP (Ideal Customer Profile):** The perfect customer.
    *   *Example:* "25–40-year-old urban professionals who work out 3–5 times per week."
*   **Beachhead Market:** The first specific market segment to dominate.
    *   *Example:* "NYC fitness influencers."
*   **Market Share:** The percentage of the market currently owned.

### Gemini 3 Prompt Strategy
We will use a **grounded generation** prompt to force the model to find real numbers using Google Search, rather than hallucinating estimates.

#### System Instruction
> "You are a Venture Capital analyst. Your job is to calculate the TAM, SAM, and SOM for a startup based on their industry and location. You must use Google Search to find credible, recent sources (2023-2025) for total market size. Return the data in a strict JSON format."

#### User Prompt Template
> "Calculate the Market Size for a startup in the **[Industry]** space, targeting **[Target Audience]** in **[Location]**.
>
> 1.  **Define the ICP:** Who is the perfect customer?
> 2.  **Identify the Beachhead:** What is the specific entry market?
> 3.  **Calculate TAM:** Global market size (find sources).
> 4.  **Calculate SAM:** Serviceable market based on language/geography.
> 5.  **Calculate SOM:** Realistic 3-year capture target (e.g., 1-5% of SAM).
>
> Return the result as a JSON object matching the `MarketSizeAnalysis` schema, including source URLs."

### Output Schema (`MarketSizeAnalysis`)
```typescript
interface MarketSizeAnalysis {
  icp: string;
  beachhead: string;
  tam: { value: string; description: string; sourceUrl: string };
  sam: { value: string; description: string; sourceUrl: string };
  som: { value: string; description: string; sourceUrl: string };
  marketShareCurrent?: string;
  reasoning: string;
}
```