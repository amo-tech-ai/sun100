# 🚀 Progress Tracker: The "Publish Event" Flow

**Document Status:** Planning - 2024-08-19 (Revised for Custom Backend)
**Author:** Lead Full-Stack Architect
**Goal:** To track the complete, end-to-end development of the "Publish Event" feature, ensuring all best practices from the engineering blueprint (`docs/44-publish-event-plan.md`) are implemented, tested, and validated.

---

### Status Legend

| Status | Meaning |
| :--- | :--- |
| 🔴 **Not Started** | The task is planned but no work has begun. |
| 🟡 **In Progress** | The task is actively being developed. |
| ✅ **Completed** | The task is fully implemented, tested, and merged. |

---

## Phase 1: Frontend Foundation & User Interaction

**Goal:** To build the client-side user interface and logic that initiates the publish process and handles the final success state.

| Task | Description | Status |
| :--- | :--- | :--- |
| **Create "Publish" Button & State** | Implement the final "Publish" button in the event creation wizard and add the necessary React state (`isPublishing`, `progressMessage`) to manage the UI during the process. | ✅ Completed |
| **Implement Granular Progress UI** | Display dynamic, user-friendly progress messages (e.g., "Validating...", "Saving...") to keep the user informed during the multi-step publish process. | ✅ Completed |
| **Implement Client-Side Validation** | Use a shared Zod schema to perform initial validation on the event payload before sending it to the backend. This provides instant feedback for obvious errors. | ✅ Completed |
| **Generate Idempotency Key** | On publish click, generate a unique `Idempotency-Key` (e.g., a UUID) to be sent as a request header. This is the first step in preventing duplicate event creation. | ✅ Completed |
| **Create Success Screen** | Build the `/dashboard/events/:id/success` screen. It should display a summary of the published event and provide clear next actions (e.g., "Copy Link", "View Dashboard"). | ✅ Completed |

#### ✅ Success Criteria
- The "Publish" button is disabled and shows a loading state when `isPublishing` is true.
- The UI correctly displays a sequence of progress messages based on the `progressMessage` state.
- The application navigates to the success screen with the correct `event_id` upon receiving a `200` response from the backend.
- The success screen correctly renders the event summary and all action buttons.

#### 🧪 Testing
- **Manual UI Test:** Click "Publish" and verify the button disables and progress messages appear in the correct order.
- **Validation Test:** Attempt to publish with an invalid form (e.g., missing title) and verify that the client-side Zod validation prevents the API call and shows an error.
- **Navigation Test:** After a successful mock API call, verify the app navigates to `/dashboard/events/:id/success`.

#### 📋 Production-Ready Checklist
- [ ] **Accessibility:** All buttons have `aria-label` attributes. Loading states use `aria-busy="true"`.
- [ ] **Responsiveness:** The success screen and progress indicators are fully responsive on mobile devices.
- [ ] **Error Handling:** The UI displays a clear, user-friendly error message if the API call fails.

---

## Phase 2: Secure Backend Endpoint

**Goal:** To create the secure backend endpoint (e.g., on Cloud Run) that will orchestrate the entire publish workflow, ensuring all secret keys and business logic remain on the server.

| Task | Description | Status |
| :--- | :--- | :--- |
| **Create `/api/events/publish` Endpoint** | Initialize a new backend endpoint that will serve as the single entry point for the publish action. | 🔴 Not Started |
| **Implement Authentication** | Secure the endpoint by requiring a valid user JWT. The function should reject any unauthenticated requests with a `401 Unauthorized` error. | 🔴 Not Started |
| **Implement Server-Side Validation** | Reuse the shared Zod schema to validate the incoming event payload on the server. This is a critical security step to ensure data integrity. | 🔴 Not Started |
| **Configure API Key as Secret** | Store the `GEMINI_API_KEY` as a secret (e.g., in Google Secret Manager) and ensure the backend service can securely access it. The key must never be exposed to the client. | 🔴 Not Started |

#### ✅ Success Criteria
- The `/api/events/publish` endpoint is deployed and accessible.
- Requests without a valid JWT are rejected with a `401` status.
- Requests with a malformed payload are rejected with a `400` status due to Zod validation failure.
- The backend service can successfully read the `GEMINI_API_KEY` from its environment secrets.

#### 🧪 Testing
- **Authentication Test:** Use `curl` to call the endpoint without an `Authorization` header and verify it returns a `401`.
- **Validation Test:** Use `curl` to send an invalid JSON payload and verify it returns a `400`.
- **Secret Test:** Add a temporary log in the function to print the first few characters of the API key and verify it's accessible. Remove the log afterward.

#### 📋 Production-Ready Checklist
- [ ] **Security:** RLS policies are planned and will be applied to all database interactions within the function.
- [ ] **Configuration:** The service's secrets are configured for local development and in the cloud provider for production.
- [ ] **Logging:** Basic logging is set up to capture the start and end of function invocations.

---

## Phase 3: Core Business Logic & Data Integrity

**Goal:** To implement the core transactional and idempotency logic that guarantees the reliability and consistency of the publish action.

| Task | Description | Status |
| :--- | :--- | :--- |
| **Implement Idempotency Check** | In the backend endpoint, check for the `Idempotency-Key`. If the key has been seen before for a successful request, return the original `event_id` without processing again. | 🔴 Not Started |
| **Implement Atomic Database Transaction** | Wrap all database write operations (`INSERT`/`UPDATE` for events, tickets, etc.) within a single `BEGIN/COMMIT` transaction block. | 🔴 Not Started |
| **Implement `ROLLBACK` on Error** | If any step within the transaction fails (e.g., a database error, an issue with an AI call), the entire transaction must be rolled back to prevent partial or corrupt data. | 🔴 Not Started |
| **Generate Public Slug & URL** | After a successful commit, generate a unique, URL-friendly slug for the event and construct the final `public_url`. | 🔴 Not Started |

#### ✅ Success Criteria
- Sending the same request twice with the same `Idempotency-Key` results in only one event being created in the database.
- If a database write fails, no new data for that event exists in the database.
- A successful publish operation results in a unique, human-readable `slug` and a valid `public_url` being returned to the client.

#### 🧪 Testing
- **Idempotency Test:** Call the endpoint twice in quick succession with the same payload and `Idempotency-Key`. Verify the second call returns the same `event_id` and the database contains only one new event.
- **Transaction Test:** Manually introduce an error into one of the `INSERT` statements within the transaction block. Verify that the function returns a `500` error and that no partial data was saved to the database.

#### 📋 Production-Ready Checklist
- [ ] **Reliability:** The idempotency logic is robust and handles race conditions.
- [ ] **Data Integrity:** The transaction management is confirmed to work for all failure scenarios.
- [ ] **Backout Plan:** A plan exists to manually clean up data in the rare case of a catastrophic failure.

---

## Phase 4: AI Enhancements & Finalization

**Goal:** To integrate intelligent Gemini features that enrich the event data and improve its shareability.

| Task | Description | Status |
| :--- | :--- | :--- |
| **Implement Conditional Image Generation** | If the event payload does not include a cover image, call the Gemini API (`imagen-4.0-generate-001`) to generate a relevant banner. | 🔴 Not Started |
| **Implement Image Optimization** | Before storing any image (user-uploaded or AI-generated), compress it to an efficient format like WebP to ensure fast load times on the public event page. | 🔴 Not Started |
| **Generate OpenGraph Meta Tags** | For the public event page (`/e/:slug`), dynamically generate OG tags (`og:title`, `og:description`, `og:image`) to ensure rich previews when shared on social media. | 🔴 Not Started |
| **Implement Confirmation Email (Stub)** | Create a fire-and-forget call to a separate `/emails.send` endpoint to queue a confirmation email for the event organizer. This should not block the main publish flow. | 🔴 Not Started |

#### ✅ Success Criteria
- Events created without a cover image have a high-quality, AI-generated image assigned to them.
- All event cover images in cloud storage are in WebP format and under a target file size (e.g., 300KB).
- The public event page's HTML contains correct `og:title`, `og:description`, and `og:image` meta tags.
- The `/publish` function completes successfully even if the `/emails.send` endpoint is slow or fails.

#### 🧪 Testing
- **E2E Test:** Create an event without uploading an image. Verify that the success screen and public page display an AI-generated image.
- **Performance Test:** Upload a large PNG image. Verify the image saved in storage is a smaller WebP file.
- **Social Media Test:** Paste a public event URL into a social media debugger (like Twitter's Card Validator) and verify the preview card appears correctly.

#### 📋 Production-Ready Checklist
- [ ] **Performance:** Image optimization is automated and efficient.
- [ ] **Cost Management:** AI image generation is only triggered when necessary.
- [ ] **API Timeouts:** Outbound calls to the Gemini API have a reasonable timeout (e.g., 20 seconds) to prevent the function from hanging.

---

## Phase 5: Testing, Validation & Polish

**Goal:** To rigorously test the entire flow for correctness, security, and performance, and to add final production-ready touches.

| Task | Description | Status |
| :--- | :--- | :--- |
| **Implement Structured Logging & Analytics** | Add structured logs for each key step (e.g., "validation_complete", "save_complete"). Fire an `event_published` analytics event on final success for business intelligence. | 🔴 Not Started |
| **Add `Cache-Control` Header** | On a successful `200` response, include a `Cache-Control: "max-age=60"` header to improve the performance of the public event page. | 🔴 Not Started |
| **Write & Execute Full Test Plan** | Conduct all tests outlined in the blueprint: manual smoke tests, automated unit/integration tests for RLS and idempotency, and E2E tests for the full user journey. | 🔴 Not Started |
| **Perform Accessibility & Performance Audit** | Run an automated accessibility check (`axe`) on the success screen. Measure the P95 latency of the publish endpoint to ensure it meets performance targets (≤ 5-10s). | 🔴 Not Started |

#### ✅ Success Criteria
- Logs for a successful publish event appear correctly in the logging dashboard.
- An `event_published` event is visible in the analytics platform.
- The response headers for the public event page include the correct `Cache-Control` value.
- The P95 latency for the publish endpoint is within the defined target.

#### 🧪 Testing
- **This phase *is* the execution of the full test plan.** All manual and automated tests defined in the engineering blueprint are run and must pass.
- **Load Test:** (Optional) Use a tool like k6 to simulate a small number of concurrent users publishing events to check for race conditions.

#### 📋 Production-Ready Checklist
- [ ] **Observability:** All critical steps are logged, and success metrics are being tracked.
- [ ] **Performance:** Latency targets are met, and caching is correctly configured.
- [ ] **Final Sign-off:** The QA lead, security lead, and product owner all sign off on the feature's production readiness.
- [ ] **Rollout Plan:** A staged rollout plan (e.g., using a feature flag) is prepared for releasing the feature to users.
- [ ] **Documentation:** A brief runbook is created for monitoring the feature in production.