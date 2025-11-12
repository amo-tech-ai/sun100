# Blank Screen Debugging & Remediation Plan

**Document Status:** Action Plan - 2024-08-22
**Goal:** To diagnose the root cause of the blank screen, fix the fatal application crash, and address related architectural issues to make the application runnable and robust.

---

### 1. Diagnosis of Core Issues

A review of the browser console reveals a critical chain of failures causing the application to crash on startup:

1.  **Fatal Error (Root Cause):** The application crashes because it cannot find the required Supabase environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). This prevents the Supabase client from initializing and stops all subsequent JavaScript execution.
2.  **Authentication Failure:** The `AuthProvider` depends on the Supabase client. When the client fails to initialize, the auth provider also fails, preventing any part of the application (including protected routes) from rendering.
3.  **Data Fetching Errors:** Multiple components attempt to call the Supabase client directly. Since the client is not configured, these calls would also fail.
4.  **Minor Bugs:** Several other minor bugs (incorrect function calls, unhandled promise rejections) were identified that would cause runtime errors even if the main crash was fixed.

---

### 2. Step-by-Step Remediation Checklist

This plan addresses each issue in order of priority to restore application functionality.

| # | Task | Description | Status |
|:-:|:---|:---|:---:|
| 1 | **Fix Supabase Client Initialization** | Create `lib/supabaseClient.ts` and modify it to be resilient. If environment variables are missing, it will initialize a non-functional client instead of crashing the app. This makes the problem non-fatal. | ✅ Implemented |
| 2 | **Implement Resilient Auth Provider** | Create `contexts/AuthContext.tsx`. If Supabase is not configured, the provider will supply a "mock" authenticated user. This allows the application layout and protected routes to render for UI review and debugging, bypassing the broken login flow. | ✅ Implemented |
| 3 | **Create Core Auth Hooks** | Create `hooks/useAuth.ts` and `components/ProtectedRoute.tsx` to complete the authentication architecture. | ✅ Implemented |
| 4 | **Centralize Data Logic into Services**| Create `services/deckService.ts`, `services/eventService.ts` and `services/aiService.ts`. Move all direct Supabase calls and AI logic from components (`PitchDecks.tsx`, `EventDetail.tsx`, etc.) into these new service files to improve architecture. | ✅ Implemented |
| 5 | **Fix Component-Level Bugs** | - Correct the `supabase.auth` function call signature in `Login.tsx` and `Signup.tsx`. <br/> - Fix an unhandled promise rejection in `EventDetail.tsx`. <br/> - Fix TypeScript generic types in `useOnScreen.ts` and components that use it. | ✅ Implemented |
| 6 | **Final Validation** | Confirm that the application no longer shows a blank screen and that the main dashboard layout renders correctly with the mock user session. | 🟡 In Progress |

---
This plan will bring the application back to a runnable state and establish a more robust architecture for future development.