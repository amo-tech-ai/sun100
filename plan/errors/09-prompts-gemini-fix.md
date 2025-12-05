# Google Studio Multi-Step Prompts for Troubleshooting & Fixes

**Purpose:** Ready-to-use prompts for Google Studio (Gemini) to systematically troubleshoot, diagnose, and fix project issues.

**Usage:** Copy individual prompts into Google Studio and execute step-by-step.

---

## Prompt 1: Initial Diagnosis & Error Detection

```
You are an expert systems troubleshooter. Analyze this project and identify all errors.

TASK: Perform a complete forensic audit of the codebase.

STEP 1 — INSPECT:
1. Read the project structure (list all directories and key files)
2. Identify the entry point (index.html, main.tsx, App.tsx)
3. Scan ALL import statements in src/App.tsx
4. Verify relative paths are correct (check ../ vs ./ depth)
5. Check for duplicate files (App.tsx vs App.jsx, main.tsx vs main.jsx)
6. Verify all imported files actually exist
7. Check vite.config.ts and tsconfig.json for path aliases

STEP 2 — IDENTIFY ERRORS:
List every error you find:
- Import resolution errors
- Missing files
- Incorrect file paths
- Configuration issues
- Runtime errors

OUTPUT FORMAT:
- Error #1: [Description]
  File: [path]
  Issue: [what's wrong]
  Expected: [what should be]

- Error #2: [Description]
  ...

Provide a complete list of ALL errors found.
```

---

## Prompt 2: Root Cause Analysis

```
You are a forensic code auditor. Analyze the errors I found and determine the root cause.

CONTEXT: [Paste the error list from Prompt 1]

TASK: Identify the PRIMARY root cause and cascading failures.

STEP 1 — CATEGORIZE:
For each error, determine:
- Type: Import error, missing file, path error, configuration error
- Severity: Critical (blocks app), High (breaks feature), Medium, Low
- Root vs Secondary: Is this the first break or caused by another error?

STEP 2 — TRACE ORIGIN:
1. When did this error first appear? (Check git history if available)
2. What change triggered it? (File move, rename, restructure?)
3. Which error came first? (The one that caused others to fail)
4. What's the dependency chain? (Error A → Error B → Error C)

STEP 3 — IDENTIFY ROOT CAUSE:
Answer these questions:
- What was the FIRST thing that broke?
- What change caused the FIRST break?
- Why did other errors cascade from this?
- What's the underlying structural issue?

OUTPUT FORMAT:
PRIMARY ROOT CAUSE:
- File: [path]
- Issue: [exact problem]
- Why: [what change caused it]
- Impact: [what broke because of this]

CASCADING FAILURES:
- Error 1 → Error 2 → Error 3
- [Explain the chain]

Provide a clear root cause analysis.
```

---

## Prompt 3: Fix Plan Generation

```
You are a code fix expert. Create a precise fix plan for the errors I identified.

CONTEXT: [Paste root cause analysis from Prompt 2]

TASK: Generate exact fixes for each error.

STEP 1 — PRIORITIZE:
Order fixes by:
1. Root cause fixes first (fix the source)
2. Critical errors next (blocks app)
3. Secondary errors last (cascading issues)

STEP 2 — CREATE FIXES:
For each error, provide:
- File path
- Exact line number (if applicable)
- Current code (what's wrong)
- Fixed code (what it should be)
- Explanation (why this fix works)

STEP 3 — VERIFY DEPENDENCIES:
Check if fixing one error will automatically fix others.
Mark which fixes are independent vs dependent.

OUTPUT FORMAT:
FIX #1: [Error Name]
File: [path]
Line: [number]
Current: [code]
Fixed: [code]
Reason: [explanation]
Dependencies: [other errors this fixes]

FIX #2: [Error Name]
...

Provide exact code fixes ready to apply.
```

---

## Prompt 4: Import Path Correction

```
You are a TypeScript/React import path expert. Fix all import path errors in this project.

CONTEXT: [Paste list of import errors]

TASK: Correct all import paths to match actual file locations.

STEP 1 — MAP FILE STRUCTURE:
Create a map showing:
- Where each file actually exists
- Where files are trying to import from
- The correct relative path between them

STEP 2 — CALCULATE PATHS:
For each incorrect import:
- Current file location: [path]
- Target file location: [path]
- Current import: [wrong path]
- Correct import: [right path]
- Calculation: [how many ../ needed]

STEP 3 — PROVIDE FIXES:
For each file with import errors:
- File: [path]
- Imports to fix:
  - Line X: [current] → [fixed]
  - Line Y: [current] → [fixed]

RULES:
- Files in same directory: Use ./
- Files one level up: Use ../
- Files two levels up: Use ../../
- Files at root importing from src/: Use ./src/

OUTPUT FORMAT:
File: src/App.tsx
Fixes:
1. Line 8: import ErrorBoundary from './components/common/ErrorBoundary'
   → import ErrorBoundary from './components/common/ErrorBoundary'
   (Verify: ErrorBoundary is at src/components/common/ErrorBoundary.tsx)

2. Line 11: import DashboardLayout from './screens/DashboardLayout'
   → import DashboardLayout from '../screens/DashboardLayout'
   (Reason: Screens are at root level, not in src/)

Provide all import path corrections.
```

---

## Prompt 5: Missing Files Detection & Creation

```
You are a file structure expert. Identify missing files and create minimal stubs.

CONTEXT: [Paste list of "file not found" errors]

TASK: Create all missing files with minimal working code.

STEP 1 — VERIFY MISSING:
For each "file not found" error:
- Check if file exists elsewhere (maybe wrong path?)
- Check if file was deleted or never created
- Determine if file is actually needed

STEP 2 — CREATE STUBS:
For each truly missing file, create:
- Minimal React component (if .tsx)
- Minimal TypeScript file (if .ts)
- Proper exports
- TypeScript types (if needed)

STEP 3 — PLACE CORRECTLY:
Ensure files are created in the location where imports expect them.

OUTPUT FORMAT:
MISSING FILE #1:
- Expected location: [path]
- Imported from: [file that imports it]
- Type: [Component/Hook/Service/etc]
- Minimal code:
```typescript
[Provide minimal working code]
```

MISSING FILE #2:
...

Provide code for all missing files.
```

---

## Prompt 6: Configuration File Fixes

```
You are a build tool configuration expert. Fix vite.config.ts, tsconfig.json, and package.json issues.

CONTEXT: [Paste configuration errors or issues]

TASK: Correct all configuration files.

STEP 1 — ANALYZE CURRENT CONFIG:
Read and understand:
- vite.config.ts (Vite configuration)
- tsconfig.json (TypeScript configuration)
- package.json (Dependencies)

STEP 2 — IDENTIFY ISSUES:
List configuration problems:
- Missing path aliases
- Incorrect module resolution
- Missing dependencies
- Wrong file extensions
- Incorrect base paths

STEP 3 — PROVIDE FIXES:
For each config file:
- File: [path]
- Issue: [what's wrong]
- Fix: [corrected configuration]
- Explanation: [why this works]

OUTPUT FORMAT:
CONFIG FIX #1: vite.config.ts
Issue: [description]
Fix:
```typescript
[Corrected vite.config.ts]
```

CONFIG FIX #2: tsconfig.json
Issue: [description]
Fix:
```json
[Corrected tsconfig.json]
```

Provide corrected configuration files.
```

---

## Prompt 7: Provider & Context Chain Verification

```
You are a React context expert. Verify and fix provider chain issues.

CONTEXT: [Paste provider/context errors or component structure]

TASK: Ensure all context providers are correctly wrapped and ordered.

STEP 1 — MAP PROVIDER CHAIN:
Trace the provider hierarchy:
- Which providers wrap which?
- What's the correct order?
- Which components use which contexts?

STEP 2 — IDENTIFY ISSUES:
Check for:
- Missing providers
- Wrong provider order
- Providers used outside their scope
- Circular dependencies

STEP 3 — VERIFY HOOK USAGE:
For each useHook() call:
- Is the hook used within its provider?
- Is the provider wrapping the component?
- Is the import path correct?

OUTPUT FORMAT:
PROVIDER CHAIN:
```
<AuthProvider>
  <StartupProvider>  ← uses useAuth
    <ToastProvider>
      <App />
    </ToastProvider>
  </StartupProvider>
</AuthProvider>
```

ISSUES FOUND:
- Issue 1: [description]
  Fix: [solution]

- Issue 2: [description]
  Fix: [solution]

Provide provider chain fixes.
```

---

## Prompt 8: Complete Fix Verification

```
You are a QA expert. Verify all fixes are correct and complete.

CONTEXT: [Paste all fixes from previous prompts]

TASK: Validate fixes and create verification checklist.

STEP 1 — VERIFY FIXES:
For each fix:
- Is the code syntactically correct?
- Does it match the file structure?
- Will it resolve the error?
- Are there any side effects?

STEP 2 — CHECK COMPLETENESS:
- Are all errors addressed?
- Are all files created?
- Are all imports fixed?
- Are all configurations updated?

STEP 3 — CREATE CHECKLIST:
Generate a verification checklist:
- [ ] Fix 1 applied
- [ ] Fix 2 applied
- [ ] Dev server restarts
- [ ] No console errors
- [ ] No network errors
- [ ] App renders correctly

OUTPUT FORMAT:
VERIFICATION CHECKLIST:

FIXES TO APPLY:
1. [ ] Fix #1: [description]
   File: [path]
   Change: [what to change]

2. [ ] Fix #2: [description]
   ...

VERIFICATION STEPS:
1. [ ] Apply all fixes
2. [ ] Clear Vite cache: rm -rf node_modules/.vite
3. [ ] Restart dev server: npm run dev
4. [ ] Check browser console (should be 0 errors)
5. [ ] Check network requests (all should be 200)
6. [ ] Verify app renders (should see landing page)

Provide complete verification checklist.
```

---

## Prompt 9: Performance & Optimization Check

```
You are a performance expert. After fixes are applied, check for performance issues.

TASK: Analyze the fixed codebase for performance bottlenecks.

STEP 1 — CHECK IMPORTS:
- Are there unnecessary imports?
- Are lazy loading used for large components?
- Are there circular dependencies?

STEP 2 — CHECK RENDERING:
- Are components re-rendering unnecessarily?
- Are context providers optimized?
- Are there memory leaks?

STEP 3 — CHECK BUNDLE SIZE:
- Are dependencies optimized?
- Are unused imports removed?
- Are code splits appropriate?

OUTPUT FORMAT:
PERFORMANCE FINDINGS:

OPTIMIZATIONS NEEDED:
1. [Issue]: [Description]
   Impact: [High/Medium/Low]
   Fix: [Recommendation]

2. [Issue]: [Description]
   ...

Provide performance recommendations.
```

---

## Prompt 10: Final Production Readiness Check

```
You are a production deployment expert. Verify the app is production-ready.

TASK: Complete production readiness audit.

STEP 1 — BUILD TEST:
- Can the app build successfully? (npm run build)
- Are there build errors or warnings?
- Is the bundle size reasonable?

STEP 2 — RUNTIME TEST:
- Does the app start without errors?
- Do all routes work?
- Are all features functional?

STEP 3 — ERROR HANDLING:
- Are errors caught and handled gracefully?
- Are error boundaries in place?
- Are user-friendly error messages shown?

STEP 4 — SECURITY CHECK:
- Are API keys in environment variables?
- Are sensitive data protected?
- Are CORS settings correct?

OUTPUT FORMAT:
PRODUCTION READINESS REPORT:

BUILD STATUS:
- [ ] Build succeeds: npm run build
- [ ] No build warnings
- [ ] Bundle size: [size]

RUNTIME STATUS:
- [ ] App starts without errors
- [ ] All routes accessible
- [ ] All features working

ERROR HANDLING:
- [ ] Error boundaries implemented
- [ ] Graceful error handling
- [ ] User-friendly messages

SECURITY:
- [ ] No hardcoded secrets
- [ ] Environment variables used
- [ ] CORS configured correctly

PRODUCTION READY: [YES/NO]
ISSUES TO FIX: [List any remaining issues]

Provide production readiness assessment.
```

---

## Usage Guide

### Quick Start Workflow

1. **Start with Prompt 1** - Get initial error list
2. **Use Prompt 2** - Understand root cause
3. **Use Prompt 3** - Get fix plan
4. **Apply fixes** - Make code changes
5. **Use Prompt 8** - Verify everything works
6. **Use Prompt 10** - Check production readiness

### For Specific Issues

- **Import errors?** → Use Prompt 4
- **Missing files?** → Use Prompt 5
- **Config issues?** → Use Prompt 6
- **Context errors?** → Use Prompt 7
- **Performance?** → Use Prompt 9

### Best Practices

1. **Copy prompts one at a time** - Don't combine multiple prompts
2. **Paste context** - Always include results from previous prompts
3. **Verify each step** - Don't skip verification
4. **Test incrementally** - Fix one issue, test, then next
5. **Document results** - Save outputs for reference

---

## Example Workflow

```
1. Copy Prompt 1 → Get error list
2. Copy Prompt 2 + error list → Get root cause
3. Copy Prompt 3 + root cause → Get fixes
4. Apply fixes in code
5. Copy Prompt 8 + fixes → Verify
6. Copy Prompt 10 → Production check
```

---

**Last Updated:** 2025-01-25  
**Total Prompts:** 10  
**Status:** Ready to use

