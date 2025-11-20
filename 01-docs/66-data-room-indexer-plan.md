# 📂 AI Agent Blueprint: Data Room Indexer & Auditor

**Document Status:** Planning - 2024-09-02
**Goal:** To design an agent that analyzes a startup's file list to determine "Due Diligence Readiness."

---

## 1. The Concept
A "Data Room" is a folder of documents investors request before wiring money. Missing documents kill deals.
The **Data Room Indexer** scans a user's uploaded files (or a text list of filenames) and compares them against a "Gold Standard" VC checklist.

## 2. AI Architecture

### Capabilities Used
*   **Long Context Window:** To ingest a large list of filenames or folder structures.
*   **Reasoning:** To infer that "Employee_Contracts_v2.pdf" satisfies the requirement for "IP Assignment Agreements".

### Prompt Strategy
> "You are a strict Venture Capital Due Diligence Officer.
>
> **Task:** Compare the provided list of user files against the Standard Series A Checklist.
>
> **Input Files:**
> [List of 50+ filenames provided by user]
>
> **Standard Checklist:**
> 1. Corporate Structure (Articles of Inc, Bylaws)
> 2. IP & Tech (Patents, Open Source Usage)
> 3. Employment (IP Assignment, Contractor Agreements)
> 4. Financials (P&L, Cap Table)
>
> **Output:**
> Return a JSON object with:
> - `score`: 0-100 readiness score.
> - `missing_items`: Array of specific missing documents.
> - `warnings`: e.g., 'Cap Table file seems outdated (2021)'."

## 3. User Flow

1.  **Upload/Sync:** User drags and drops their Data Room folder (or connects Google Drive).
2.  **Analyze:** System extracts the file structure (metadata only, for privacy).
3.  **Report:**
    *   **Score:** "Your Data Room is 65% Ready."
    *   **Action Plan:** "Critical Missing Item: You have no Employee IP Assignment agreements listed. This is a red flag."
4.  **Auto-Fix:** User clicks "Generate Template" for a missing doc (e.g., IP Assignment), and the AI generates a standard legal template to fill the gap.

---

## 4. Privacy Note
For the MVP, we analyze **filenames only**, not file contents, to maintain strict privacy/security while still providing high value.