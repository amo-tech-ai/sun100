# Pitch Deck Generation - Error Fix Checklist

**Date:** 2025-01-16  
**Status:** 🔴 **CRITICAL - GEMINI API KEY SUSPENDED**  
**Test Environment:** Localhost:3000 (Dev Server)

---

## 🚨 ROOT CAUSE IDENTIFIED

**The Gemini API key is SUSPENDED by Google Cloud.**

```json
{
  "error": {
    "code": 403,
    "message": "Permission denied: Consumer 'api_key:AIzaSyAlelHFzqTCe5GeQlZMHePlacCaJPm22ZQ' has been suspended.",
    "status": "PERMISSION_DENIED",
    "reason": "CONSUMER_SUSPENDED"
  }
}
```

### ⚠️ ACTION REQUIRED

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Check Billing**: Navigate to Billing > Account Management
3. **Unsuspend Project**: If billing is suspended, add payment method or resolve issues
4. **Create New API Key**: If key is revoked, create new one at https://aistudio.google.com/apikey
5. **Update Supabase Secret**: `supabase secrets set GEMINI_API_KEY=NEW_KEY`
6. **Redeploy**: `supabase functions deploy generate-deck`

---

## 🔍 Console Errors Observed

```
1. WebSocket connection to 'ws://localhost:3000/?token=...' failed
   - Location: client:536
   - Impact: HMR not working (minor, doesn't affect API calls)

2. Failed to load resource: server responded with status 500
   - URL: ouverjherohazwadfgud.supabase.co/functions/v1/generate-deck
   - Impact: CRITICAL - Deck generation fails

3. Error invoking Edge Function "generate-deck": FunctionsHttpError
   - Location: edgeFunctionService.ts:50
   - Error: Edge Function returned a non-2xx status code
```

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

### 🔍 Step 2: Check Edge Function Code for Errors

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

### 🔧 Step 3: Potential Fixes to Apply

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

### 🧪 Step 4: Test Commands

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

### 🔄 Step 5: Apply Fixes

#### Recommended Fix Order:

1. **Remove thinkingLevel and tools** (most likely cause)
2. **Redeploy edge function**
3. **Test again**
4. **If still failing, switch to gemini-1.5-flash**
5. **If still failing, check Supabase dashboard logs**

---

## 🎯 ROOT CAUSE ANALYSIS

### Most Likely Causes (in order):

1. **Gemini SDK Configuration Issue**
   - `thinkingLevel` parameter may not be supported with `gemini-2.5-flash`
   - `googleSearch` tool may conflict with structured output
   - SDK version `1.29.0` may have bugs

2. **API Key Issue**
   - Key may be suspended (previously confirmed)
   - New key may have restrictions

3. **Database Schema Mismatch**
   - `slides` table may be missing columns
   - RLS policies may block inserts

---

## 📝 IMMEDIATE ACTION ITEMS

### Action 1: Fix Edge Function
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

### Action 2: Redeploy
```bash
supabase functions deploy generate-deck
```

### Action 3: Test
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
| **NEXT** | Get valid API key | ⏳ | User action required |

---

## 🔗 Related Files

- `plan/pitch-deck/prompt-fix.md` - Google AI Studio prompt for fixes
- `docs/generate-deck-500-error-diagnosis.md` - Previous diagnosis
- `.cursor/rules/testing-pitchdeck.mdc` - Testing procedures
