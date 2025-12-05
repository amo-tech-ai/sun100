# Multistep Prompt for Google AI Studio - Fix Pitch Deck Generation Errors

  

**Purpose:** Use this prompt in Google AI Studio (Gemini) to automatically fix all pitch deck generation errors

**Context:** React/TypeScript app with Supabase Edge Functions using Gemini API

**Status:** 🔴 Critical errors preventing deck generation

  

---

  

## 🎯 PROMPT FOR GOOGLE AI STUDIO

  

Copy and paste this entire prompt into Google AI Studio to get step-by-step fixes:

  

---

  

```

You are an expert TypeScript/Deno developer fixing critical errors in a pitch deck generation system.

  

## CONTEXT

  

I have a React/TypeScript application that generates pitch decks using:

- Frontend: React + Vite + TypeScript

- Backend: Supabase Edge Functions (Deno)

- AI: Google Gemini API (via @google/genai SDK)

  

## CURRENT ERRORS

  

The pitch deck generation is failing with these errors:

  

1. **Edge Function 500 Error**

- Location: `supabase/functions/generate-deck/index.ts:99`

- Error: Gemini API call throws error (API suspended) but isn't caught properly

- Current code wraps API call but error parsing fails

  

2. **Frontend Generic Error Messages**

- Location: `services/edgeFunctionService.ts:18-50`

- Error: Doesn't extract detailed error from Supabase response body

- Current code only checks `error.message` which is generic

  

3. **User-Unfriendly Error Display**

- Location: `screens/GeneratingScreen.tsx:76-95`

- Error: Shows generic error messages to users

- Current code doesn't distinguish between error types

  

## FILES TO FIX

  

### File 1: `supabase/functions/generate-deck/index.ts`

  

**Current Code (Lines 97-153):**

```typescript

// Call Gemini with structured output

console.log('Calling Gemini API...');

let response;

try {

response = await ai.models.generateContent({

model: config?.model || 'gemini-2.5-flash',

contents: prompt,

config: {

responseMimeType: 'application/json',

responseSchema: {

type: Type.OBJECT,

properties: {

title: { type: Type.STRING },

template: { type: Type.STRING },

slides: {

type: Type.ARRAY,

items: {

type: Type.OBJECT,

properties: {

id: { type: Type.STRING },

title: { type: Type.STRING },

content: { type: Type.STRING },

layout: { type: Type.STRING },

notes: { type: Type.STRING }

},

required: ['id', 'title', 'content', 'layout']

}

}

},

required: ['title', 'template', 'slides']

},

thinkingLevel: config?.thinking_level || 'high',

tools: [{ googleSearch: {} }]

}

});

} catch (geminiError: any) {

console.error('Gemini API call failed:', geminiError);

// Parse Gemini SDK error structure

let errorMessage = 'Unknown Gemini API error';

let statusCode = 500;

// Check for various error formats

if (geminiError?.message) {

errorMessage = geminiError.message;

} else if (geminiError?.error?.message) {

errorMessage = geminiError.error.message;

} else if (typeof geminiError === 'string') {

errorMessage = geminiError;

}

// Check for API suspension/authentication errors

if (errorMessage.includes('suspended') ||

errorMessage.includes('PERMISSION_DENIED') ||

errorMessage.includes('403') ||

errorMessage.includes('CONSUMER_SUSPENDED')) {

statusCode = 403;

errorMessage = 'AI Service Unavailable: The backend API key is suspended or invalid. Please contact support.';

}

throw new Error(errorMessage);

}

```

  

**Problem:** Error parsing may miss some error formats. Need to check more error properties.

  

**Fix Required:**

1. Check `geminiError.cause` property for nested errors

2. Check `geminiError.status` or `geminiError.statusCode` for HTTP status codes

3. Check if error is a Google API error object (may have `error.code`, `error.message`, `error.status`)

4. Handle both string and object error messages (convert objects to strings safely)

5. Log full error object for debugging: `console.error('Full Gemini error:', JSON.stringify(geminiError, null, 2))`

6. Check for error patterns: `suspended`, `PERMISSION_DENIED`, `403`, `CONSUMER_SUSPENDED`, `API_KEY_INVALID`

7. Return proper HTTP status code (403 for API issues, 500 for other errors)

  

### File 2: `services/edgeFunctionService.ts`

  

**Current Code (Lines 18-50):**

```typescript

if (error) {

console.error(`Error invoking Edge Function "${functionName}":`, error);

// Extract error details from response

let errorDetails = error.message || 'Unknown error';

// Try to parse error response if it's JSON

if (error.context?.body) {

try {

const parsed = JSON.parse(error.context.body);

if (parsed.error) {

errorDetails = parsed.error;

}

} catch {

// If parsing fails, use original message

}

}

// Provide more specific error messages

if (errorDetails.includes('CORS') || errorDetails.includes('fetch')) {

throw new Error(`CORS error calling ${functionName}. Check that the function is deployed and has proper CORS headers.`);

}

if (errorDetails.includes('404') || errorDetails.includes('not found')) {

throw new Error(`Edge Function "${functionName}" not found. Verify the function name and deployment status.`);

}

// Check for API suspension errors

if (errorDetails.includes('suspended') || errorDetails.includes('AI Service Unavailable')) {

throw new Error('AI Service Unavailable: The backend API key is suspended or invalid. Please contact support or try again later.');

}

throw new Error(`An error occurred while processing your request via ${functionName}: ${errorDetails}`);

}

```

  

**Problem:**

- `error.context.body` may not exist in Supabase error structure

- `errorDetails` might be an object, not a string

- String `.includes()` check fails on objects

- Need to check `error` object structure more thoroughly

  

**Fix Required:**

1. Check if `error` has `message` property (primary source)

2. Check if `error` has `context` property with `body` (Supabase may include response body here)

3. Check if `error` has `status` or `statusCode` (HTTP status code)

4. Check if `error` has `name` property (error type, e.g., "FunctionsHttpError")

5. Handle `errorDetails` as both string and object:

- If object: Extract message or stringify safely

- If string: Use directly

6. Convert object to string before using `.includes()`: `String(errorDetails).includes(...)`

7. Check response body from actual HTTP response if available (may be in `error.context.response`)

8. Handle case-insensitive error matching

  

### File 3: `screens/GeneratingScreen.tsx`

  

**Current Code (Lines 76-95):**

```typescript

} catch (err) {

console.error("Deck generation failed:", err);

let errorMessage = "An unknown error occurred during generation.";

if (err instanceof Error) {

errorMessage = err.message;

// Provide user-friendly messages for common errors

if (err.message.includes('suspended') || err.message.includes('AI Service Unavailable')) {

errorMessage = "AI Service Temporarily Unavailable\n\nThe backend AI service is currently unavailable. This is usually due to billing or API key issues. Please try again in a few minutes or contact support if the problem persists.";

} else if (err.message.includes('CORS')) {

errorMessage = "Connection Error\n\nUnable to connect to the backend service. Please check your internet connection and try again.";

} else if (err.message.includes('404') || err.message.includes('not found')) {

errorMessage = "Service Not Found\n\nThe backend service is not available. Please contact support.";

}

}

setError(errorMessage);

}

```

  

**Problem:** Error messages are good but could be more specific. Need to handle edge cases.

  

**Fix Required:**

1. Add more error type checks:

- Network errors (fetch failed, timeout)

- Authentication errors (401, 403)

- Server errors (500, 502, 503)

- Rate limiting errors (429)

2. Handle network errors specifically:

- Check for "Failed to fetch", "NetworkError", "timeout"

- Provide retry suggestions

3. Add timeout error handling:

- Check for timeout-related error messages

- Suggest checking connection or trying again

4. Improve error message formatting for better UX:

- Use line breaks (`\n`) for multi-line messages

- Add emoji or icons for visual clarity (optional)

- Provide actionable next steps

5. Handle edge cases:

- Null/undefined errors

- Non-Error objects

- Circular reference errors when stringifying

  

## TASK

  

Fix all three files with the following requirements:

  

1. **Improve Error Parsing:**

- Handle multiple error formats (string, object, nested objects)

- Check all possible error properties (`message`, `error.message`, `cause`, `status`, `statusCode`)

- Parse JSON error responses correctly

- Handle both string and object error details

  

2. **Better Error Messages:**

- Return 403 status code for API suspension errors (not 500)

- Provide user-friendly error messages

- Include error context for debugging

- Distinguish between different error types

  

3. **Robust Error Handling:**

- Never throw generic errors

- Always log full error objects for debugging

- Handle edge cases (null, undefined, different types)

- Validate error structure before parsing

  

4. **Code Quality:**

- Use TypeScript types properly

- Add JSDoc comments for error handling functions

- Follow existing code style

- Ensure no breaking changes

  

## OUTPUT FORMAT

  

For each file, provide:

1. **Complete fixed code** with line numbers (show full function/method, not just snippets)

2. **Explanation** of what was changed and why

3. **Why the fix works** - technical explanation

4. **Edge cases handled** - list all edge cases covered

5. **Testing recommendations** - how to verify the fix works

  

**Order:** Start with File 1 (`supabase/functions/generate-deck/index.ts`), then File 2 (`services/edgeFunctionService.ts`), then File 3 (`screens/GeneratingScreen.tsx`).

  

**Code Style:**

- Use TypeScript with proper types

- Follow existing code style (spaces, semicolons, etc.)

- Add helpful comments for complex error parsing logic

- Use descriptive variable names

- Handle all edge cases gracefully

  

**Important:**

- Don't break existing functionality

- Maintain backward compatibility

- All fixes must be production-ready

- Include proper error logging for debugging

```

  

---

  

## 📋 STEP-BY-STEP USAGE INSTRUCTIONS

  

### Step 1: Open Google AI Studio

1. Go to https://aistudio.google.com/

2. Sign in with your Google account

3. Create a new prompt

  

### Step 2: Copy the Prompt

1. Copy the entire prompt above (from "You are an expert..." to "Start with File 1...")

2. Paste into Google AI Studio

  

### Step 3: Review the Fixes

1. Gemini will provide fixes for each file

2. Review each fix carefully

3. Check that error handling is comprehensive

  

### Step 4: Apply Fixes

1. Copy the fixed code for each file

2. Replace the corresponding sections in your codebase

3. Save files

  

### Step 5: Test

1. Deploy edge function: `supabase functions deploy generate-deck`

2. Restart dev server: `npm run dev`

3. Test deck generation

4. Check console for errors

  

---

  

## 🔍 VERIFICATION CHECKLIST

  

After applying fixes, verify:

  

- [ ] Edge function catches Gemini API errors correctly

- [ ] Error status codes are correct (403 for API suspension, not 500)

- [ ] Frontend extracts error details from response

- [ ] User sees friendly error messages

- [ ] Console logs show detailed error information

- [ ] No TypeScript errors

- [ ] Code follows existing style

  

---

  

## 🎯 EXPECTED OUTCOMES

  

After fixes:

  

1. **Better Error Detection:**

- API suspension errors return 403 (not 500)

- Error messages are specific and helpful

- All error formats are handled

  

2. **Improved User Experience:**

- Users see clear error messages

- Errors explain what went wrong

- Users know what to do next

  

3. **Better Debugging:**

- Full error objects logged to console

- Error context preserved

- Easy to identify root causes

  

---

  

## 📝 NOTES

  

- The Gemini API key suspension is an external issue that requires fixing billing

- These code fixes ensure proper error handling once API is restored

- All fixes maintain backward compatibility

- No breaking changes to existing functionality

  

---

  

## 🚀 QUICK START

  

1. Copy the prompt above (the entire section between the triple backticks)

2. Paste into Google AI Studio (https://aistudio.google.com/)

3. Get fixes for all 3 files

4. Review each fix carefully

5. Apply fixes to codebase

6. Deploy edge function: `supabase functions deploy generate-deck`

7. Test: `npm run dev` and try generating a deck

  

**Estimated Time:** 10-15 minutes to apply all fixes

  

---

  

## 📋 ALTERNATIVE: USE CURSOR PARALLEL AGENTS

  

Instead of Google AI Studio, you can also use Cursor's parallel agents:

  

### Option 1: Single Agent Prompt

```

Fix the pitch deck generation errors in these files:

1. supabase/functions/generate-deck/index.ts - Improve Gemini API error handling

2. services/edgeFunctionService.ts - Extract error details from Supabase responses

3. screens/GeneratingScreen.tsx - Show user-friendly error messages

  

Requirements:

- Handle all error formats (string, object, nested)

- Return 403 for API suspension (not 500)

- Provide clear error messages

- Log full error objects for debugging

- Handle edge cases gracefully

```

  

### Option 2: Best-of-N (Multiple Models)

Run the same prompt across multiple models:

- `gemini-2.5-flash` (fast)

- `gemini-2.5-pro` (thorough)

- `gemini-3-pro-preview` (best reasoning)

  

Compare results and apply the best fix.

  

---

  

## ✅ VERIFICATION AFTER FIXES

  

After applying fixes from Google AI Studio:

  

1. **Code Review:**

- [ ] All error handling is comprehensive

- [ ] No TypeScript errors

- [ ] Code follows existing style

- [ ] All edge cases handled

  

2. **Deploy:**

- [ ] Edge function deployed successfully

- [ ] No deployment errors

- [ ] Function appears in Supabase dashboard

  

3. **Test:**

- [ ] Dev server starts without errors

- [ ] Navigate to `/pitch-decks/new`

- [ ] Fill wizard form

- [ ] Click "Generate Deck"

- [ ] Verify error messages are user-friendly

- [ ] Check console for detailed error logs

  

4. **Error Handling:**

- [ ] API suspension shows 403 status (not 500)

- [ ] Error messages are clear and helpful

- [ ] Full error objects logged to console

- [ ] User sees actionable error messages

  

---

  

## 🎯 EXPECTED RESULTS

  

After fixes are applied:

  

### Before (Current):

```

Error: Edge Function returned a non-2xx status code

Status: 500

User sees: "An error occurred during generation"

```

  

### After (Fixed):

```

Error: AI Service Unavailable: The backend API key is suspended

Status: 403

User sees: "AI Service Temporarily Unavailable

  

The backend AI service is currently unavailable. This is usually due to billing or API key issues. Please try again in a few minutes or contact support if the problem persists."

```

  

---

  

## 📝 NOTES

  

- The Gemini API key suspension is an external issue (Google Cloud billing)

- These code fixes ensure proper error handling once API is restored

- All fixes maintain backward compatibility

- No breaking changes to existing functionality

- Error handling improvements work even when API is working correctly

  

---

  

## 🔗 RELATED FILES

  

- **Checklist:** `plan/pitch-deck/pitch-deck-checklist.md` - Detailed error analysis

- **Edge Function:** `supabase/functions/generate-deck/index.ts` - Main generation logic

- **Service:** `services/edgeFunctionService.ts` - Edge function wrapper

- **Screen:** `screens/GeneratingScreen.tsx` - Generation UI