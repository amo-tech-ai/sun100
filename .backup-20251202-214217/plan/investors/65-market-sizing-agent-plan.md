# 🤖 AI Agent Blueprint: Market Sizing Agent (TAM/SAM/SOM)

**Document Status:** Planning - 2024-09-02
**Goal:** To design the logic for an AI agent that uses **Gemini 3 Pro** with **Google Search Grounding** to calculate defensible market size numbers.

---

## 1. The Problem
Founders often "guess" their market size or use outdated reports. Investors reject these immediately. This agent automates the research process to find *real*, cited numbers.

## 2. AI Architecture

### Input
*   **Industry:** e.g., "Generative AI for Legal Tech"
*   **Target Audience (ICP):** e.g., "Mid-sized Law Firms in the US"
*   **Business Model:** e.g., "SaaS Subscription ($2k/month)"

### The "Chain of Thought" Prompt Strategy
The prompt instructs Gemini to perform a multi-step investigation:

1.  **Step 1 (Search):** Find the total global spend on [Industry] (TAM). Prioritize sources like Gartner, Forrester, Statista from 2023-2025.
2.  **Step 2 (Filter):** Narrow down to [Target Audience] + [Geography] to estimate SAM.
3.  **Step 3 (Calculate):** Use the "Bottom-Up" method.
    *   *Formula:* (Number of potential customers in SAM) * (Average Contract Value).
4.  **Step 4 (Target):** Estimate a realistic 3-5 year market share (SOM) based on typical startup growth curves (e.g., 1-5%).

### Function Declaration (`marketSizeSchema`)

```typescript
const marketSizeSchema = {
  type: Type.OBJECT,
  properties: {
    tam: {
      type: Type.OBJECT,
      properties: {
        value: { type: Type.STRING, description: "e.g. $50B" },
        source_url: { type: Type.STRING },
        source_name: { type: Type.STRING },
        description: { type: Type.STRING }
      }
    },
    sam: { /* same structure */ },
    som: { /* same structure */ },
    methodology: { type: Type.STRING, description: "Explanation of the bottom-up calculation." }
  }
};
```

## 3. Backend Implementation (`generate-market-sizing`)

*   **Tool Config:** `tools: [{googleSearch: {}}]`
*   **Model:** `gemini-3-pro-preview`
*   **Thinking Level:** `high` (Crucial for the math and filtering logic).

## 4. Frontend Visualization
*   The JSON output is rendered into a "Target" chart (concentric circles).
*   Clicking a section opens the `source_url` in a new tab, providing instant credibility during a pitch.