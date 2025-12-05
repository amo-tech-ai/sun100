# Pitch Deck Generation - Error Fix Checklist

**Date:** 2025-12-04  
**Status:** 🟡 **NEW API KEY SET - NEEDS GENERATIVE LANGUAGE API ENABLED**  
**Test Environment:** Localhost:3000 (Dev Server)

---

## ✅ QUICK SUMMARY

**Problem:** Deck generation failed with Edge Function 500 error - "Invalid or missing Gemini API key"

**Root Cause:** 
1. ✅ FIXED: `.env.local` file was missing (restored)
2. ✅ FIXED: Secret is accessible (verified in logs: `API Key exists: true`)
3. ✅ FIXED: **Old API key was suspended** - replaced with new API key from new Google account

**Fix Applied:**
1. ✅ Restored `.env.local` from `.env.local.backup`
2. ✅ Restarted dev server to load environment variables
3. ✅ Verified env vars loaded (NO mock mode warning in console)
4. ✅ Verified Edge Function is being called correctly (to real Supabase URL)

**Current Status:** 
- ✅ Frontend env vars loaded
- ✅ **NEW `GEMINI_API_KEY` secret set in Supabase** (from new Google account with active billing)
- ✅ Edge Function redeployed to pick up new key
- ✅ Error handling improved to show clear 403 messages
- 🟡 **READY TO TEST** - New API key should work if:
  - New Google project has billing active (no suspension)
  - Generative Language API is enabled
  - API key has no restrictions blocking Supabase

**Next Step:** Enable Generative Language API in new Google account

**Configuration Complete:**
- ✅ Supabase Secret: New `GEMINI_API_KEY` set
- ✅ Edge Function: Redeployed with improved error handling
- ✅ Local `.env.local`: Updated with new key
- ✅ Dev Server: Running and tested
- ✅ Error handling: Now shows clear permission error message
- 🔴 **Action Required:** Enable "Generative Language API" in Google Cloud Console

**Test Results:**
- ✅ API key is accessible (no "missing key" error)
- ✅ Error message is clear: "Gemini API key lacks permissions. Enable 'Generative Language API'..."
- 🔴 Still getting 403 PERMISSION_DENIED (API not enabled in Google Cloud Console)

---

## 🚨 ROOT CAUSE IDENTIFIED (UPDATED)

**The `.env.local` file was missing, causing the app to use placeholder Supabase URL.**

### Current Error (UPDATED):
```
Error invoking Edge Function "generate-deck": FunctionsHttpError: Edge Function returned a non-2xx status code
Deck generation failed: Error: Invalid or missing Gemini API key. Please check GEMINI_API_KEY environment variable.
```

### Network Request:
```
POST https://ouverjherohazwadfgud.supabase.co/functions/v1/generate-deck
Status: 500 Internal Server Error
```

### Console Status:
```
✅ NO "Supabase environment variables missing" warning (frontend env vars loaded)
✅ Edge Function URL is correct (not placeholder)
🔴 Edge Function returns 500 - Missing GEMINI_API_KEY secret
```

### ✅ FIX APPLIED (Frontend)

1. **Restore `.env.local` file** ✅ DONE - Restored from `.env.local.backup`
2. **Restart dev server** ✅ DONE - Server restarted
3. **Verify env vars are loaded** ✅ DONE - **NO MOCK MODE WARNING** in console
4. **Test deck generation** ✅ DONE - Edge Function called successfully but returns 500

### 🔴 ACTION REQUIRED (Edge Function) - TROUBLESHOOTING

**Issue:** Secret is set but Edge Function cannot access it

**Troubleshooting Steps:**

1. **✅ Secret Set Multiple Times** - Verified via `supabase secrets list`
2. **✅ Edge Function Deployed** - Multiple deployments completed
3. **✅ Debug Logging Added** - Added console.log to check secret access
4. **⏳ Check Dashboard Logs** - View actual error from Edge Function

**Next Actions:**

**Option 1: Check Dashboard Logs (RECOMMENDED)**
1. Go to: https://supabase.com/dashboard/project/ouverjherohazwadfgud/functions/generate-deck/logs
2. Look for the debug output showing:
   - `GEMINI_API_KEY check:` with `exists`, `length`, `firstChars`
   - This will show if the secret is accessible
3. Check for any error messages about secret access

**Option 2: Set Secret via Dashboard**
1. Go to: https://supabase.com/dashboard/project/ouverjherohazwadfgud/settings/functions
2. Navigate to "Edge Functions" → "Secrets"
3. Delete existing `GEMINI_API_KEY` if present
4. Add new secret:
   - Name: `GEMINI_API_KEY`
   - Value: `AIzaSyA75C_-eG2mKslML5zs4WemxMrosXF4EoU`
5. Save and wait 1-2 minutes
6. Redeploy Edge Function: `supabase functions deploy generate-deck`

**Option 3: Verify Secret Format**
- Secret may need to be set without quotes
- Try: `supabase secrets set GEMINI_API_KEY=AIzaSyA75C_-eG2mKslML5zs4WemxMrosXF4EoU`
- Or with quotes: `supabase secrets set GEMINI_API_KEY="AIzaSyA75C_-eG2mKslML5zs4WemxMrosXF4EoU"`

### ✅ VERIFICATION COMPLETE

- ✅ Console shows NO "Supabase environment variables missing" warning
- ✅ Console shows NO "placeholder.supabase.co" errors
- ✅ Wizard page loads successfully
- ✅ Environment variables confirmed in `.env.local`:
  - `VITE_SUPABASE_URL=https://ouverjherohazwadfgud.supabase.co`
  - `VITE_SUPABASE_ANON_KEY` is set
  - `VITE_GEMINI_API_KEY` is set

---

## 🔍 Console Errors Observed (CURRENT)

```
1. placeholder.supabase.co/functions/v1/generate-deck:1
   Failed to load resource: net::ERR_NAME_NOT_RESOLVED
   - Impact: CRITICAL - Cannot connect to Supabase Edge Functions

2. ⚠️ Supabase environment variables missing. Initializing in MOCK MODE.
   - Location: lib/supabaseClient.ts:18
   - Impact: App falls back to placeholder URL

3. Error invoking Edge Function "generate-deck": FunctionsFetchError
   - Location: edgeFunctionService.ts:44
   - Error: Failed to send a request to the Edge Function
```

---

## 📋 TROUBLESHOOTING CHECKLIST

### ✅ Step 1: Restore Environment Variables (DONE)
- [x] `.env.local` file restored from backup
- [x] `VITE_SUPABASE_URL` is set: `https://ouverjherohazwadfgud.supabase.co`
- [x] `VITE_SUPABASE_ANON_KEY` is set
- [x] `VITE_GEMINI_API_KEY` is set
- [x] **Restart dev server** ✅ DONE - Server restarted
- [x] **Verify env vars loaded** ✅ DONE - **NO mock mode warning** in console

---

## 📋 TROUBLESHOOTING CHECKLIST

### ✅ Step 1: Verify Supabase Secrets (DONE)
- [x] `GEMINI_API_KEY` is set
- [x] `SUPABASE_URL` is set  
- [x] `SUPABASE_SERVICE_ROLE_KEY` is set
- [x] `SUPABASE_ANON_KEY` is set
- [x] `SUPABASE_DB_URL` is set

**Command:** `supabase secrets list`
**Result:** All secrets are configured ✅

---

### ✅ Step 2: Verify Environment Variables Loaded (NEXT)

**After restarting dev server, check:**

1. **Browser Console** - Should NOT see:
   - ❌ `⚠️ Supabase environment variables missing. Initializing in MOCK MODE.`
   - ✅ Should see: Supabase client initialized successfully

2. **Network Tab** - Requests should go to:
   - ✅ `https://ouverjherohazwadfgud.supabase.co/functions/v1/generate-deck`
   - ❌ NOT `placeholder.supabase.co`

3. **Verify .env.local exists:**
   ```bash
   ls -la .env.local
   cat .env.local | grep VITE_SUPABASE_URL
   ```

4. **Check Vite loaded env vars:**
   - Open browser console
   - Type: `import.meta.env.VITE_SUPABASE_URL`
   - Should return: `"https://ouverjherohazwadfgud.supabase.co"`

---

### 🔍 Step 3: Check Edge Function Code for Errors

**File:** `supabase/functions/generate-deck/index.ts`

| Line | Check | Status |
|------|-------|--------|
| 2 | Gemini SDK import: `npm:@google/genai@1.29.0` | ⚠️ Check if version is compatible |
| 14-16 | Environment variables: `getRequiredEnv()` | ✅ |
| 31-33 | Validation: businessContext or urls required | ✅ |
| 48-50 | Gemini initialization | ⚠️ May fail silently |
| 99-129 | Gemini API call with structured output | ⚠️ Check thinkingLevel parameter |
| 126 | `thinkingLevel: 'high'` | ⚠️ May not be supported by gemini-2.5-flash |
| 127 | `tools: [{ googleSearch: {} }]` | ⚠️ May cause issues with structured output |
| 181-196 | Database insert (decks) | ⚠️ Check schema |
| 222-224 | Database insert (slides) | ⚠️ Check schema |

---

### 🔧 Step 4: Potential Fixes to Apply (If Still Failing)

#### Fix 1: Remove Incompatible Parameters
**Problem:** `thinkingLevel` and `googleSearch` tool may not work with structured output.

**File:** `supabase/functions/generate-deck/index.ts`
**Lines:** 126-127

**Current:**
```typescript
thinkingLevel: config?.thinking_level || 'high',
tools: [{ googleSearch: {} }]
```

**Fix:**
```typescript
// Remove thinkingLevel and tools for now - may conflict with structured output
// thinkingLevel: config?.thinking_level || 'high',
// tools: [{ googleSearch: {} }]
```

#### Fix 2: Use Simpler Gemini Model
**Problem:** `gemini-2.5-flash` may have issues with complex structured output.

**File:** `supabase/functions/generate-deck/index.ts`
**Line:** 100

**Current:**
```typescript
model: config?.model || 'gemini-2.5-flash',
```

**Fix:**
```typescript
model: config?.model || 'gemini-1.5-flash',
```

#### Fix 3: Add More Error Logging
**Problem:** Need to see exact error from Gemini API.

**File:** `supabase/functions/generate-deck/index.ts`
**Line:** 49

**Add after line 49:**
```typescript
console.log('GEMINI_API_KEY first 10 chars:', GEMINI_API_KEY.substring(0, 10));
```

---

### 📁 Files to Examine

| File | Purpose | Lines to Check |
|------|---------|----------------|
| `supabase/functions/generate-deck/index.ts` | Main edge function | 48-50, 99-129, 181-196 |
| `supabase/functions/_shared/errors.ts` | Error handling | 3-22, 24-30 |
| `supabase/functions/_shared/cors.ts` | CORS headers | All |
| `services/edgeFunctionService.ts` | Frontend service | 18-50 |
| `screens/GeneratingScreen.tsx` | UI component | 66-95 |

---

### 🧪 Step 5: Test Commands

```bash
# 1. Redeploy edge function after fixes
cd /home/sk/sun100 && supabase functions deploy generate-deck

# 2. Check Supabase logs for detailed errors
# Go to: https://supabase.com/dashboard/project/ouverjherohazwadfgud/logs/edge-functions

# 3. Test with curl
curl -X POST https://ouverjherohazwadfgud.supabase.co/functions/v1/generate-deck \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"businessContext": "Test startup", "deckType": "seed", "theme": "modern"}'
```

---

### 🔄 Step 6: Apply Fixes (If Needed)

#### Recommended Fix Order:

1. **Remove thinkingLevel and tools** (most likely cause)
2. **Redeploy edge function**
3. **Test again**
4. **If still failing, switch to gemini-1.5-flash**
5. **If still failing, check Supabase dashboard logs**

---

## 🎯 ROOT CAUSE ANALYSIS

### Primary Cause (CURRENT ISSUE):

1. **Missing Environment Variables** ✅ FIXED
   - `.env.local` file was missing
   - App fell back to `placeholder.supabase.co` URL
   - Vite requires `VITE_` prefix for env vars
   - **Fix:** Restored `.env.local` from backup
   - **Next:** Restart dev server to load env vars

### Secondary Causes (If Still Failing After Fix):

2. **Gemini SDK Configuration Issue**
   - `thinkingLevel` parameter may not be supported with `gemini-2.5-flash`
   - `googleSearch` tool may conflict with structured output
   - SDK version `1.29.0` may have bugs

3. **API Key Issue**
   - Key may be suspended (check if still valid)
   - New key may have restrictions

4. **Database Schema Mismatch**
   - `slides` table may be missing columns
   - RLS policies may block inserts

---

## 📝 IMMEDIATE ACTION ITEMS

### Action 1: Restore Environment Variables ✅ DONE
```bash
# Already completed:
cp .env.local.backup .env.local
```

### Action 2: Restart Dev Server ✅ DONE
```bash
# Already completed:
pkill -f "vite|npm.*dev"
npm run dev
```

### Action 3: Verify Fix
- [ ] Wait for dev server to start (5 seconds)
- [ ] Navigate to http://localhost:3000
- [ ] Open browser console
- [ ] Verify NO "MOCK MODE" warning
- [ ] Check network tab - requests should go to `ouverjherohazwadfgud.supabase.co`

### Action 4: Test Deck Generation
- [ ] Navigate to http://localhost:3000/pitch-decks/new
- [ ] Fill wizard form
- [ ] Click "Generate Deck"
- [ ] Check console for errors
- [ ] Verify network request succeeds (200 status)

### Action 5: Fix Edge Function (If Still Failing)
```typescript
// supabase/functions/generate-deck/index.ts
// Lines 99-129 - Remove problematic parameters

response = await ai.models.generateContent({
  model: config?.model || 'gemini-2.5-flash',
  contents: prompt,
  config: {
    responseMimeType: 'application/json',
    responseSchema: {
      // ... keep schema as is
    }
    // REMOVE: thinkingLevel and tools
  }
});
```

### Action 6: Redeploy (If Still Failing)
```bash
supabase functions deploy generate-deck
```

### Action 7: Test Again
- Navigate to http://localhost:3000/pitch-decks/new
- Fill wizard and click "Generate Deck"
- Check console for errors

---

## ✅ SUCCESS CRITERIA

- [ ] Edge function returns 200 status
- [ ] Deck is created in database
- [ ] Slides are created in database
- [ ] User is redirected to deck editor
- [ ] No console errors (except WebSocket - minor)

---

## 📊 TEST RESULTS LOG

| Timestamp | Action | Result | Notes |
|-----------|--------|--------|-------|
| 2025-01-16 | Set GEMINI_API_KEY | ✅ | New key set |
| 2025-01-16 | Redeploy v15 | ❌ | Still 500 error |
| 2025-01-16 | Check secrets | ✅ | All secrets present |
| 2025-01-16 | Remove thinkingLevel | ✅ | Deployed v16 |
| 2025-01-16 | Test again | ❌ | **API KEY SUSPENDED** |
| 2025-01-16 | curl test | ❌ | Confirmed: CONSUMER_SUSPENDED |
| 2025-12-04 | **NEW ISSUE** | ❌ | **MISSING .env.local FILE** |
| 2025-12-04 | **ISSUE 1** | ✅ | **MISSING .env.local FILE** - FIXED |
| 2025-12-04 | Restore .env.local | ✅ | Restored from backup |
| 2025-12-04 | Restart dev server | ✅ | Server restarted |
| 2025-12-04 | Verify env vars loaded | ✅ | **NO MOCK MODE WARNING** - Env vars loaded successfully |
| 2025-12-04 | **ISSUE 2** | 🔴 | **EDGE FUNCTION MISSING GEMINI_API_KEY SECRET** |
| 2025-12-04 | Set GEMINI_API_KEY secret | ✅ | Set via `supabase secrets set` (multiple times) |
| 2025-12-04 | Deploy Edge Function | ✅ | Deployed successfully (multiple times) |
| 2025-12-04 | Test deck generation | ❌ | Still returns 500 - Secret not accessible |
| 2025-12-04 | Add debug logging | ✅ | Added console.log to check secret access |
| 2025-12-04 | Redeploy with debug | ✅ | Deployed with debug logging (v2) |
| 2025-12-04 | Test generation | ❌ | Button click not triggering (browser automation issue) |
| 2025-12-04 | Manual curl test | ❌ | Still returns 500 - Secret not accessible |
| 2025-12-04 | **FOUND ISSUE** | ✅ | **Duplicate API keys in .env.local - one SUSPENDED** |
| 2025-12-04 | Test API keys | ✅ | Key 1 works, Key 2 is SUSPENDED |
| 2025-12-04 | Set correct secret | ✅ | Set to working key: `AIzaSyA75C_-eG2mKslML5zs4WemxMrosXF4EoU` |
| 2025-12-04 | Clean .env.local | ✅ | Removed suspended duplicate key |
| 2025-12-04 | Redeploy Edge Function | ✅ | Deployed with correct secret |
| 2025-12-04 | Enhanced debug logging | ✅ | Added comprehensive logging per Supabase docs |
| 2025-12-04 | Set secret via CLI (env-file) | ✅ | Used `supabase secrets set --env-file` method |
| 2025-12-04 | Set secret via CLI (direct) | ✅ | Used `supabase secrets set KEY=value` method |
| 2025-12-04 | Verified secret exists | ✅ | `supabase secrets list` shows GEMINI_API_KEY |
| 2025-12-04 | Updated code per docs | ✅ | Using `Deno.env.get('GEMINI_API_KEY')` as per docs |
| 2025-12-04 | Redeployed Edge Function | ✅ | Deployed v4 with Supabase docs-compliant code |
| **CRITICAL** | **Check Dashboard logs NOW** | ⏳ | **MUST CHECK**: https://supabase.com/dashboard/project/ouverjherohazwadfgud/functions/generate-deck/logs |
| **NEXT** | Review debug output | ⏳ | Look for `=== GEMINI_API_KEY DEBUG ===` section |
| **NEXT** | If still failing, try Dashboard UI | ⏳ | Dashboard > Settings > Edge Functions > Secrets |
| **NEXT** | **Check Dashboard logs** | ⏳ | **CRITICAL** - View debug output: https://supabase.com/dashboard/project/ouverjherohazwadfgud/functions/generate-deck/logs |
| **NEXT** | Set secret via Dashboard UI | ⏳ | Try Dashboard method instead of CLI |
| **NEXT** | Contact Supabase support | ⏳ | If secret still not accessible after Dashboard attempt |

---

## 🔧 TROUBLESHOOTING: Secret Not Accessible

### Problem
Secret `GEMINI_API_KEY` is set via `supabase secrets set` and appears in `supabase secrets list`, but Edge Function cannot access it via `Deno.env.get('GEMINI_API_KEY')`.

### Debug Steps Taken
1. ✅ Verified secret exists: `supabase secrets list` shows `GEMINI_API_KEY`
2. ✅ Reset secret multiple times with different formats
3. ✅ Redeployed Edge Function multiple times
4. ✅ Added debug logging to check secret access
5. ✅ Tested via curl - still returns 500 error

### Possible Causes
1. **Secret Propagation Delay** - Secrets may take 5-10 minutes to propagate
2. **Secret Format Issue** - May need specific format or escaping
3. **Supabase CLI Issue** - Secrets set via CLI may not sync properly
4. **Edge Function Environment** - Secrets may not be available in deployed environment

### Solutions to Try

#### Solution 1: Set Secret via Dashboard (RECOMMENDED)
1. Go to: https://supabase.com/dashboard/project/ouverjherohazwadfgud/settings/functions
2. Click "Secrets" tab
3. Delete `GEMINI_API_KEY` if it exists
4. Click "Add new secret"
5. Name: `GEMINI_API_KEY`
6. Value: `AIzaSyA75C_-eG2mKslML5zs4WemxMrosXF4EoU`
7. Click "Save"
8. Wait 2-3 minutes
9. Redeploy: `supabase functions deploy generate-deck`

#### Solution 2: Check Dashboard Logs
1. Go to: https://supabase.com/dashboard/project/ouverjherohazwadfgud/functions/generate-deck/logs
2. Look for debug output: `GEMINI_API_KEY check:`
3. Check if `exists: false` or `length: 0`
4. This will confirm if secret is accessible

#### Solution 3: Temporary Workaround - Pass API Key in Request
**⚠️ NOT RECOMMENDED FOR PRODUCTION** - Only for testing

Modify Edge Function to accept API key in request body as fallback:
```typescript
const apiKey = Deno.env.get('GEMINI_API_KEY') || (await req.json()).geminiApiKey;
```

#### Solution 4: Verify Secret Value
Test if API key is valid:
```bash
curl https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyA75C_-eG2mKslML5zs4WemxMrosXF4EoU
```

### Next Steps
1. **Check Dashboard Logs** - View debug output to see secret access status
2. **Set Secret via Dashboard** - Try UI method instead of CLI
3. **Wait 5-10 minutes** - Secrets can take time to propagate
4. **Contact Supabase Support** - If secret still not accessible after all steps

---

## 🔗 Related Files

- `plan/pitch-deck/prompt-fix.md` - Google AI Studio prompt for fixes
- `docs/generate-deck-500-error-diagnosis.md` - Previous diagnosis
- `.cursor/rules/testing-pitchdeck.mdc` - Testing procedures
