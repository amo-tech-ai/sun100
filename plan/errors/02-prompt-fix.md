# Forensic Audit & Troubleshooting Prompt

**Purpose:** Comprehensive multi-step prompt for Cursor to systematically troubleshoot, diagnose, and fix all project issues.

**Usage:** Copy this entire prompt and use it with Cursor when troubleshooting critical issues.

---

# 🔍 COMPREHENSIVE PROJECT TROUBLESHOOTING PROMPT

You are an expert systems troubleshooter and forensic auditor. Your goal: **FIX all errors, SOLVE all problems, and get the project working 100%**.

Follow these steps **EXACTLY** in order. Make safe changes, save files to disk, and verify everything works before proceeding.

---

## STEP 1 — INSPECT (Act Like a Detective)

**Your task:** Conduct a complete forensic audit of the project.

### 1.1 Project Structure Audit
- [ ] Read the full project structure (list all directories and key files)
- [ ] Identify the entry point (`index.html`, `main.tsx`, `App.tsx`)
- [ ] Map the component hierarchy and routing structure
- [ ] Check for duplicate files (e.g., `App.tsx` vs `App.jsx`)
- [ ] Verify directory organization (are files in correct locations?)

### 1.2 Import Path Analysis
- [ ] Scan ALL import statements in `src/App.tsx`
- [ ] Verify relative paths are correct (check `../` vs `./` depth)
- [ ] Check for missing imports or circular dependencies
- [ ] Verify all imported files actually exist
- [ ] Check for TypeScript vs JavaScript file mismatches

### 1.3 Configuration Files Check
- [ ] Verify `vite.config.ts` exists and is correct
- [ ] Check `tsconfig.json` for path aliases and module resolution
- [ ] Verify `package.json` dependencies are installed
- [ ] Check `.env` files exist (if needed)
- [ ] Verify `index.html` has correct script tags and root element

### 1.4 Code Quality Red Flags
- [ ] Check for commented-out code that should be active
- [ ] Look for missing closing tags in JSX
- [ ] Verify all context providers are properly wrapped
- [ ] Check for unused imports or dead code
- [ ] Verify error boundaries are in place

### 1.5 Runtime Error Detection
- [ ] Check browser console for JavaScript errors
- [ ] Verify network requests succeed (no 404s, 500s)
- [ ] Check for CORS errors
- [ ] Verify React DevTools shows component tree
- [ ] Check for hydration mismatches

### 1.6 Missing Files & Dependencies
- [ ] List all files referenced in imports
- [ ] Verify each file exists at the expected path
- [ ] Check for missing screen components
- [ ] Verify all context providers exist
- [ ] Check for missing utility functions or hooks

### 1.7 Workflow & User Journey
- [ ] Trace the complete user flow from landing to app
- [ ] Verify routing works (all routes accessible)
- [ ] Check authentication flow (if applicable)
- [ ] Verify data persistence (sessionStorage, database)
- [ ] Test critical user actions (create, edit, delete)

**Output Required:**
- Complete list of all errors found
- List of all red flags
- Missing files inventory
- Broken workflows identified
- Clear statement of main problems

---

## STEP 2 — DIAGNOSE (Root Cause Analysis)

**Your task:** Identify the exact root cause of each issue.

### 2.1 Error Categorization
For each error found, categorize:
- **Type:** Import error, runtime error, build error, configuration error
- **Severity:** Critical (blocks app), High (breaks feature), Medium (degrades UX), Low (cosmetic)
- **Scope:** Affects single file, multiple files, entire app

### 2.2 Root Cause Analysis
For each error:
- [ ] Compare expected vs actual behavior
- [ ] Identify the exact line/file causing the issue
- [ ] Determine if it's a syntax error, logic error, or configuration issue
- [ ] Check if it's a cascading effect from another error
- [ ] Verify if it's a missing dependency or file

### 2.3 Missing Components Inventory
Create a complete list of:
- [ ] Missing files (with expected paths)
- [ ] Missing folders/directories
- [ ] Missing imports (should be imported but aren't)
- [ ] Missing dependencies (in package.json)
- [ ] Missing configuration (env vars, config files)
- [ ] Missing context providers or wrappers

### 2.4 Best Practices Check
Verify:
- [ ] Code follows TypeScript best practices
- [ ] React patterns are correct (hooks, context, routing)
- [ ] Error handling is implemented
- [ ] Loading states are handled
- [ ] Accessibility standards met (if applicable)

**Output Required:**
- Root cause for each error
- Complete missing items list
- Best practices violations
- Prioritized fix order (critical first)

---
restart dev server blank screen test run local host mcp chrome dev @Browser @.cursor/rules/chrome-mcp.mdc check console for errors 
fix solve troubleshoot list steps to fix deepply analyze what is the core problem test forensic audit 

## STEP 3 — FIX (Apply Solutions)

**Your task:** Fix all issues systematically.

### 3.1 Create Fix Checklist
Before making changes:
- [ ] Create `docs/fix-checklist.md` with all errors and planned fixes
- [ ] Prioritize fixes (critical → high → medium → low)
- [ ] Plan fix order (dependencies first, then dependent code)

### 3.2 Apply Fixes Safely
For each fix:
- [ ] Read the file to understand context
- [ ] Make minimal, targeted changes
- [ ] Preserve existing functionality
- [ ] Add comments explaining the fix
- [ ] Save file to disk

### 3.3 Fix Categories

**Import Path Fixes:**
- [ ] Correct all relative path imports (`../` vs `./`)
- [ ] Fix TypeScript import extensions (if needed)
- [ ] Verify imports match actual file locations
- [ ] Remove duplicate or conflicting imports

**Missing File Fixes:**
- [ ] Create missing screen components (minimal stub if needed)
- [ ] Create missing context providers
- [ ] Create missing utility functions
- [ ] Create missing type definitions

**Configuration Fixes:**
- [ ] Fix `vite.config.ts` if needed
- [ ] Update `tsconfig.json` paths if needed
- [ ] Fix `package.json` dependencies
- [ ] Create/update `.env` files

**Code Structure Fixes:**
- [ ] Fix missing closing tags
- [ ] Uncomment critical code (if accidentally commented)
- [ ] Fix context provider wrapping
- [ ] Add missing error boundaries

**Runtime Fixes:**
- [ ] Fix JavaScript errors in components
- [ ] Fix network request failures
- [ ] Fix CORS issues
- [ ] Fix state management issues

**Output Required:**
- All fixes applied
- Files modified list
- Brief explanation of each fix

---
restart dev server blank screen test run local host mcp chrome dev @Browser @.cursor/rules/chrome-mcp.mdc check console for errors 
fix solve troubleshoot list steps to fix deepply analyze what is the core problem test forensic audit 

## STEP 4 — VERIFY (Testing & Validation)

**Your task:** Verify all fixes work and nothing broke.

### 4.1 Dev Server Test
- [ ] Stop any running dev servers
- [ ] Clear Vite cache (`rm -rf node_modules/.vite`)
- [ ] Start dev server (`npm run dev`)
- [ ] Verify server starts without errors
- [ ] Check terminal for build/compilation errors

### 4.2 Browser Testing
- [ ] Navigate to `http://localhost:3000`
- [ ] Check browser console for errors (should be zero)
- [ ] Check network tab for failed requests (should be zero)
- [ ] Verify page renders (not blank)
- [ ] Test navigation between routes

### 4.3 Component Testing
- [ ] Verify Landing page displays correctly
- [ ] Test all lazy-loaded components load
- [ ] Verify context providers work
- [ ] Test error boundaries catch errors gracefully
- [ ] Verify loading states display correctly

### 4.4 Build Test
- [ ] Run production build (`npm run build`)
- [ ] Verify build completes without errors
- [ ] Check build output for warnings
- [ ] Verify no TypeScript errors
- [ ] Check bundle size (if applicable)

### 4.5 End-to-End Flow Test
- [ ] Test complete user journey (landing → app → feature)
- [ ] Verify data persistence works
- [ ] Test all critical features
- [ ] Verify error handling works
- [ ] Test edge cases and error scenarios

**Output Required:**
- Test results for each category
- List of any remaining issues
- Performance metrics (if applicable)

---

## STEP 5 — DOCUMENTATION (Create Checklist)

**Your task:** Create comprehensive documentation of all work done.

### 5.1 Update `docs/fix-checklist.md`

Include:
- [ ] **All Errors Found** (with descriptions)
- [ ] **Root Causes** (why each error occurred)
- [ ] **Fixes Applied** (what was changed)
- [ ] **Files Modified** (complete list with line numbers)
- [ ] **Files Created** (new files added)
- [ ] **Files Deleted** (removed duplicates/stubs)
- [ ] **Tests Performed** (what was tested)
- [ ] **Test Results** (pass/fail for each test)
- [ ] **Final Verification Status** (overall status)
- [ ] **Success Criteria** (what "working 100%" means)
- [ ] **Remaining Issues** (if any, with priority)
- [ ] **Production Readiness** (yes/no with notes)

### 5.2 Update Error Tracking
- [ ] Update `plan/errors/01-errors-fix.md` with final status
- [ ] Document any new issues discovered
- [ ] Note any workarounds or temporary fixes

**Output Required:**
- Complete `docs/fix-checklist.md` file
- Updated error tracking documents

---

## STEP 6 — FINAL CONFIRMATION

**Your task:** Confirm everything is working perfectly.

### 6.1 Error-Free Verification
- [ ] **Zero console errors** in browser
- [ ] **Zero network errors** (all requests succeed)
- [ ] **Zero build errors** (TypeScript compiles cleanly)
- [ ] **Zero runtime errors** (app runs smoothly)

### 6.2 Best Practices Verification
- [ ] Code follows TypeScript best practices
- [ ] React patterns are correct and modern
- [ ] Error handling is comprehensive
- [ ] Code is maintainable and well-structured
- [ ] No security vulnerabilities (basic check)

### 6.3 Production Readiness Checklist
- [ ] All features work end-to-end
- [ ] No critical bugs remain
- [ ] Performance is acceptable
- [ ] Error handling is robust
- [ ] User experience is smooth
- [ ] Build succeeds without warnings
- [ ] All tests pass (if applicable)

**Output Required:**
- Final confirmation statement
- List of any remaining non-critical issues
- Production readiness assessment

---

## EXPECTED OUTPUT FORMAT

After completing all steps, provide:

### Summary
- Total errors found: [number]
- Total errors fixed: [number]
- Files modified: [number]
- Files created: [number]
- Files deleted: [number]

### Critical Fixes
1. [Error description] → [Fix applied] → [Status: ✅ Fixed]
2. [Error description] → [Fix applied] → [Status: ✅ Fixed]
...

### Verification Results
- Dev server: ✅ Running / ❌ Failed
- Browser console: ✅ No errors / ❌ Errors found
- Network requests: ✅ All succeed / ❌ Failures found
- Build: ✅ Success / ❌ Failed
- Production ready: ✅ Yes / ❌ No

### Final Status
- **Overall Status:** ✅ WORKING / ⚠️ PARTIAL / ❌ BROKEN
- **Production Ready:** ✅ YES / ❌ NO
- **Remaining Issues:** [list any non-critical issues]

---

## SPECIAL INSTRUCTIONS

1. **Always verify before proceeding:** Don't move to next step until current step is complete
2. **Make minimal changes:** Fix only what's broken, don't refactor unnecessarily
3. **Test after each fix:** Verify the fix works before moving to next issue
4. **Document everything:** Update checklists as you go
5. **Use browser tools:** Leverage Chrome DevTools MCP for console/network debugging
6. **Check both files:** If duplicate files exist (`.tsx` vs `.jsx`), verify which is being used
7. **Clear caches:** Clear Vite cache if import resolution issues persist
8. **Restart server:** Always restart dev server after major changes

---

## WHEN TO USE THIS PROMPT

Use this prompt when:
- App shows blank screen
- Multiple import errors
- Build failures
- Runtime errors
- After major refactoring
- After pulling remote changes
- When app behavior is unexpected

---

**Remember:** The goal is 100% working, production-ready code. Take your time, be thorough, and verify everything.


restart dev server blank screen test run local host mcp chrome dev @Browser @.cursor/rules/chrome-mcp.mdc check console for errors 
fix solve troubleshoot list steps to fix deepply analyze what is the core problem test forensic audit 