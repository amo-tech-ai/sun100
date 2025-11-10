# ✅ Best Practices Checklist: Using the `urlContext` Tool

**Document Status:** Published - 2024-08-18
**Author:** Senior AI Engineer
**Purpose:** To provide a comprehensive, actionable checklist for developers implementing the `urlContext` tool with the Gemini API. Adhering to these best practices will ensure reliability, cost-effectiveness, and a better user experience.

---

### 1. URL Input & Formatting

Correctly formatting your input URLs is the first step to a successful API call.

-   [ ] **Use Complete URLs:** Always provide the full, absolute URL, including the protocol (`https://` or `http://`).
    -   **Why?** The model requires a complete URL to resolve the address correctly. `example.com` is ambiguous; `https://www.example.com` is specific.
-   [ ] **Provide Specific, Direct Links:** Link directly to the page containing the content you need.
    -   **Why?** The `urlContext` tool does **not** crawl nested links. If the information is on `example.com/about`, providing `example.com` is not sufficient.
-   [ ] **Client-Side Validation:** Perform basic URL validation in the frontend before sending the request.
    -   **Why?** This prevents unnecessary, malformed API calls. Use checks like `URL.canParse()` or a simple regex to catch obvious errors early.

---

### 2. Content Accessibility & Scope

Ensure the model can access the content you are providing.

-   [ ] **Verify Public Accessibility:** Confirm that provided URLs do not lead to pages requiring a login, subscription, or other paywall.
    -   **Why?** The tool cannot bypass authentication. A failed retrieval will waste tokens and provide no value.
-   [ ] **Check for Supported Content Types:** Ensure the target URL serves a supported content type (HTML, JSON, Text, Images, PDF).
    -   **Why?** The tool cannot process unsupported types like videos, audio files, or Google Workspace documents (Docs, Sheets). Use the dedicated methods for YouTube videos.

---

### 3. API Limits & Constraints

Be mindful of the tool's operational limits to avoid errors.

-   [ ] **Adhere to URL Count Limit:** Do not exceed **20 URLs** in a single API request.
    -   **Why?** This is a hard limit set by the API. Requests with more than 20 URLs will fail.
-   [ ] **Be Mindful of Content Size:** Be aware of the **34MB** maximum content size per URL.
    -   **Why?** While most web pages are much smaller, linking to very large PDFs or data files could hit this limit and cause a retrieval failure.

---

### 4. Response Handling & Verification

Treat the API response as a source of truth for debugging and validation.

-   [ ] **Always Inspect `url_context_metadata`:** After a call, check the `url_context_metadata` object.
    -   **Why?** This metadata is crucial for debugging. It tells you exactly which URLs were successfully retrieved (`URL_RETRIEVAL_STATUS_SUCCESS`), which failed, and why (e.g., `URL_RETRIEVAL_STATUS_UNSAFE`, `URL_RETRIEVAL_STATUS_NOT_FOUND`).
-   [ ] **Use correct property name for your language:**
    -   Python: `response.candidates[0].url_context_metadata`
    -   JavaScript: `response.candidates[0].urlContextMetadata`
    -   REST: `url_context_metadata`
-   [ ] **Implement Graceful Fallbacks:** Your application logic should handle cases where one or more URLs fail to retrieve.
    -   **Why?** A user might provide a mix of valid and invalid links. The application should proceed with the content it could fetch and clearly inform the user which URLs failed.

---

### 5. Performance & Cost Management

Understand the cost implications of using the `urlContext` tool.

-   [ ] **Monitor Token Usage:** Remember that all content retrieved from URLs is counted as part of your **input tokens**.
    -   **Why?** This can significantly increase the cost of an API call. A few large web pages can result in thousands of tokens.
-   [ ] **Log `tool_use_prompt_token_count`:** From the `usage_metadata` in the response, log the token count specifically for tool use.
    -   **Why?** This helps you monitor costs and identify unexpectedly large or expensive URL inputs.
-   [ ] **Implement External Caching:** Gemini has internal caching. For additional cost savings and performance, cache frequently accessed URLs in your own database.
    -   **Why?** External caching gives you control over cache duration and is highly effective for reducing latency and costs on popular, non-time-sensitive URLs.

---

### 🚀 Production Readiness Checklist

Before deploying a feature that uses `urlContext`, ensure the following:

| Status | Item | Description |
| :--- | :--- | :--- |
| **[ ]** | **Secure API Key** | The `GEMINI_API_KEY` is stored securely in a backend environment (e.g., Supabase Edge Function secrets) and is **never** exposed on the client. |
| **[ ]** | **Input Validation** | All user-provided URLs are validated on both the client and server. |
| **[ ]** | **Rate Limiting** | Your backend endpoint has per-user rate limiting to prevent abuse and control costs. |
| **[ ]** | **Robust Error Handling** | The system gracefully handles API errors, partial successes (some URLs fail), and unsafe content warnings. |
| **[ ]** | **Clear User Feedback** | The UI clearly communicates the status of the URL processing, including any failures. |
| **[ ]** | **Cost Monitoring** | You have a logging or monitoring system in place to track `tool_use_prompt_token_count` and identify costly requests. |
| **[ ]** | **Caching Strategy** | A caching mechanism is in place for frequently accessed public information to optimize cost and performance. |