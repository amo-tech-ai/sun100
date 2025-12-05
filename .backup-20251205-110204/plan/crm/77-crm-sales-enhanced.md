
# 📧 Engineering Blueprint: AI Sales Outreach & Email Integration

**Document Status:** ✅ Implemented - 2024-09-08
**System Goal:** To enable users to draft, refine, and log sales emails directly from the CRM and Prospecting screens using Gemini 3.

---

## 1. Architecture

The system extends the existing AI architecture to handle unstructured communication generation.

```mermaid
sequenceDiagram
    participant User
    participant UI as EmailComposeModal
    participant Service as outreach.ts
    participant Edge as Edge Function (generate-cold-email)
    participant Gemini as Gemini 3 Pro

    User->>UI: Opens Email Modal (Context: Prospect Name, Company)
    User->>UI: Selects Tone (e.g., "Direct", "Witty")
    User->>UI: Clicks "AI Draft"
    UI->>Service: generateColdEmail({ recipient, company, tone })
    Service->>Edge: POST /generate-cold-email
    Edge->>Gemini: generateContent({ tools: [generateColdEmailFunctionDeclaration] })
    Gemini-->>Edge: Returns { subject, body }
    Edge-->>UI: Returns drafts
    UI->>User: Populates editor for review
    User->>UI: Clicks "Send & Log"
    UI->>DB: Inserts into `crm_interactions`
```

## 2. Implementation Checklist

| Component | Type | Status |
| :--- | :--- | :--- |
| **`generateColdEmailFunctionDeclaration`** | Prompt Schema | ✅ Completed |
| **`outreach.ts`** | Frontend Service | ✅ Completed |
| **`generate-cold-email`** | Edge Function | ✅ Completed |
| **`EmailComposeModal.tsx`** | UI Component | ✅ Completed |
| **`Prospecting.tsx` Integration** | Screen Update | ✅ Completed |
| **`CustomerCRM.tsx` Integration** | Screen Update | ✅ Completed |

## 3. Key Features

1.  **Context Awareness:** The AI knows who the prospect is and what their company does (passed from the Prospecting screen).
2.  **Tone Selection:** Users can toggle between "Professional", "Friendly", or "Direct".
3.  **Seamless Logging:** Sending an email automatically creates a `crm_interaction` record.

---
