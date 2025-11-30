# 🚀 **Google AI Studio Prompt — “Plan to Develop a Go-To-Market Strategy Feature”**

**Task:**
Create a complete **development plan** for building a Go-To-Market (GTM) Strategy feature inside our startup platform (Sun AI / Solaris).
The plan must include product design, AI logic, data, UI/UX, integrations, and launch steps.

---

## 🧠 **System Instructions**

You are a senior product manager + AI architect.
Produce a practical, step-by-step plan that a tech team can implement immediately.
Write clearly, logically, and beginner-friendly.
Include real use cases and examples for startup founders.

---

## 📌 **What the Plan Must Contain**

### **1. Summary (short)**

A 2–3 line overview of the GTM Strategy feature and its purpose.

---

### **2. Core Objectives**

List the goals, such as:

* Enable founders to generate a full GTM plan in minutes
* Provide structured, investor-ready outputs
* Automate research using Gemini tools
* Display results in a clean dashboard

---

### **3. User Inputs (Define Schema)**

What founders need to provide:

```json
{
  "startup_name": "string",
  "industry": "string",
  "product": "string",
  "target_users": "string",
  "problem_solved": "string",
  "pricing_model": "string",
  "stage": "MVP | Beta | v1",
  "website_url": "string (optional)"
}
```

Include optional website scraping using **URL Context + Google Search**.

---

### **4. Output (Define JSON Schema for GTM Strategy)**

Gemini must produce:

* Summary
* Target customers
* ICP example
* Value proposition
* Positioning
* Channels (SEO, Paid, Partnerships, Community)
* Activation plan
* Pricing
* Retention
* Growth loops
* 90-day launch plan
* Success metrics
* Risks & mitigations

Return structured JSON for UI rendering.

---

### **5. Feature Architecture (High-Level)**

Include:

* Chat-style onboarding to collect founder info
* AI pipeline using Gemini 2.5/3 (text + search tools)
* Structured Output → JSON → stored in Supabase
* Dashboard display (cards, timeline, matrix)
* Export options (PDF, Notion, Deck)

Real-world example:
*Founder enters startup idea → Gemini generates full GTM → platform displays clean strategy page.*

---

### **6. AI Tools to Use**

Specify which Gemini tools power each step:

* **Text Generation** → GTM content
* **Google Search Tool** → competitor research
* **URL Context Tool** → extract startup info
* **Structured Output** → JSON
* **Thinking** → deeper reasoning
* **Document Generation (optional)** → downloadable PDF
* **Image Generation** → channel icons, competitor matrix graphic

---

### **7. UI/UX Plan**

Develop a simple, modern GTM module:

* Onboarding wizard (5 questions)
* One-page GTM dashboard
* Roadmap timeline
* Channel cards
* Competitor matrix
* Export buttons
* Mobile-optimized layout
* Colors: gradient blue/orange (Sun AI style)

Provide a wireframe description for each section.

---

### **8. Data Storage Plan (for platforms using Supabase)**

Tables needed:

* `gtm_strategies` (stores JSON)
* `gtm_history` (versions over time)
* RLS policies to ensure safe owner-based access

---

### **9. Development Steps (Full Plan)**

A clear checklist:

#### **Phase 1 — Foundation**

* Define user input schema
* Create GTM structured-output schema
* Build Edge Function for Gemini calls
* Add URL Context + Google Search tools

#### **Phase 2 — UI/UX**

* Build onboarding wizard
* Build GTM dashboard
* Add export formats (PDF, Notion, Deck)

#### **Phase 3 — Integration**

* Connect Supabase storage
* Add authentication + RLS
* Add version history
* Add analytics (PostHog events)

#### **Phase 4 — Testing & QA**

* Test invalid input handling
* Test long URLs
* Test duplicate GTM readiness
* Validate JSON schema

#### **Phase 5 — Launch**

* Add onboarding tutorial
* Add sample GTM templates
* Release beta to 20 users

---

### **10. Success Criteria**

* Founder generates a GTM plan in < 2 minutes
* JSON output matches schema 100%
* Dashboard renders all sections correctly
* Export formats work on mobile and desktop

---

### **11. Risks & Mitigations**

* **Low accuracy:** use Gemini 3 + Search grounding
* **Incomplete data:** autofill from URL context
* **High cost:** apply caching + rate limits

---

## 🎯 **Final Output Requirements**

Return:

1. **A complete development plan**
2. **Structured, step-by-step instructions**
3. **Short, smart, and practical text**
4. **Clear sections** that can be pasted into a PRD or project doc
5. **Examples and use cases** for real startups

---

## 🔚 End of Prompt

---

If you want, I can also generate:
✅ The Supabase schema
✅ The frontend component layout
✅ The Edge Function code
Just tell me which part you want next.