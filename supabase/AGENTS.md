# Supabase - Edge Functions & Database

> **Backend infrastructure:** Edge Functions (Deno runtime), PostgreSQL database, and Supabase services.

---

## 🎯 Edge Function Patterns

### Standard Edge Function Structure
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleGenAI } from "https://esm.sh/@google/genai";

// CORS headers (required for frontend calls)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle OPTIONS request (CORS preflight)
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate input
    const { param1, param2 } = await req.json();
    if (!param1) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: param1' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process request (AI, database, etc.)
    const result = await processRequest(param1, param2);

    // Return success response
    return new Response(
      JSON.stringify({ data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

---

## 🤖 AI Edge Function Patterns

### Gemini Integration
```typescript
// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: Deno.env.get('GEMINI_API_KEY') });

// Use Gemini 3 Pro for complex tasks
const response = await ai.models.generateContent({
  model: 'gemini-3-pro-preview',
  contents: prompt,
  config: {
    thinkingLevel: 'high',
    responseMimeType: 'application/json',
    responseSchema: schema
  }
});

// Parse and validate response
const responseText = response.text || "{}";
const parsed = JSON.parse(responseText);

// Validate required fields
if (!parsed.title) {
  throw new Error('AI response missing required field: title');
}

return parsed;
```

### Structured Output Schema Pattern
```typescript
import { Type } from "https://esm.sh/@google/genai";

const schema = {
  type: Type.OBJECT,
  properties: {
    title: { 
      type: Type.STRING, 
      description: "Slide title (concise, investor-focused)" 
    },
    content: { 
      type: Type.STRING, 
      description: "Slide content (2-3 bullet points)" 
    },
    type: {
      type: Type.STRING,
      enum: ["vision", "problem", "solution", "market", "product"],
      description: "Slide type from predefined list"
    }
  },
  required: ["title", "content", "type"]
};
```

---

## 🗄️ Database Access

### Using Supabase Client in Edge Functions
```typescript
// Initialize Supabase client with service role key (Edge Functions only!)
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // Service role key for server-side
);

// Query database
const { data, error } = await supabase
  .from('pitch_decks')
  .select('*')
  .eq('id', deckId)
  .single();

if (error) throw error;
return data;
```

### Insert/Update Patterns
```typescript
// Insert new record
const { data: newDeck, error: insertError } = await supabase
  .from('pitch_decks')
  .insert({
    title: 'New Deck',
    organization_id: orgId,
    created_at: new Date().toISOString()
  })
  .select()
  .single();

if (insertError) throw insertError;

// Update existing record
const { error: updateError } = await supabase
  .from('pitch_decks')
  .update({ title: 'Updated Title' })
  .eq('id', deckId);

if (updateError) throw updateError;
```

---

## 🔒 Security Rules

### Environment Variables
- **GEMINI_API_KEY** - Google Gemini API key (required for AI functions)
- **SUPABASE_URL** - Supabase project URL
- **SUPABASE_SERVICE_ROLE_KEY** - Service role key (use only in Edge Functions!)
- **SUPABASE_ANON_KEY** - Anon key (for frontend, not needed in Edge Functions)

### NEVER Do This
```typescript
// ❌ BAD - Exposing API key in response
return new Response(
  JSON.stringify({ apiKey: Deno.env.get('GEMINI_API_KEY') })
);

// ❌ BAD - Using anon key in Edge Function (use service role key)
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_ANON_KEY')! // Wrong! Use SERVICE_ROLE_KEY
);

// ❌ BAD - No CORS headers (frontend can't call this)
return new Response(JSON.stringify({ data }));
```

### Always Do This
```typescript
// ✅ GOOD - Validate environment variables
const apiKey = Deno.env.get('GEMINI_API_KEY');
if (!apiKey) {
  throw new Error('GEMINI_API_KEY not configured');
}

// ✅ GOOD - Use service role key in Edge Functions
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// ✅ GOOD - Always include CORS headers
return new Response(
  JSON.stringify({ data }),
  { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
);
```

---

## 🧪 Testing Edge Functions Locally

### Test with Supabase CLI
```bash
# Serve function locally
supabase functions serve generate-deck

# Test with curl
curl -X POST http://localhost:54321/functions/v1/generate-deck \
  -H "Content-Type: application/json" \
  -d '{"businessContext": "AI startup", "deckType": "seed"}'
```

### Test from Frontend
```typescript
// Make sure dev server is running first
import { callEdgeFunction } from '@/services/edgeFunctionService';

const result = await callEdgeFunction('generate-deck', {
  businessContext: 'AI startup',
  deckType: 'seed'
});
```

---

## 📊 Common Edge Function Use Cases

### 1. Deck Generation (`generate-deck`)
- **Input:** Business context, deck type, financials
- **Process:** Gemini 3 Pro generates 10-15 slides with structured output
- **Output:** Deck object with slides array

### 2. Image Generation (`generate-image-preview`, `generate-image-final`)
- **Input:** Prompt, aspect ratio, optional brand URLs
- **Process:** Gemini 2.5 Flash Image generates base64 image
- **Output:** Base64 image string + metadata

### 3. Content Modification (`modify-slide-content`)
- **Input:** Slide ID, modification instruction
- **Process:** Gemini 2.5 Flash rewrites content
- **Output:** Updated slide title/content

### 4. Analysis (`analyze-slide`)
- **Input:** Slide content
- **Process:** Gemini 2.5 Flash analyzes clarity, impact, tone
- **Output:** Scores (0-10) + feedback text

### 5. Market Research (`slide-ai` with `generateMarketData`)
- **Input:** Industry, location
- **Process:** Gemini 2.5 Flash + Google Search for real-time TAM/SAM/SOM
- **Output:** Market data with citations

### 6. Trends Analysis (`slide-ai` with `generateTrends`)
- **Input:** Industry
- **Process:** Gemini 2.5 Flash + Google Search for current trends
- **Output:** Trends array + "Why Now" narrative

### 7. Competitor Matrix (`slide-ai` with `generateCompetitorMatrix`)
- **Input:** Context/industry
- **Process:** Gemini 2.5 Flash + Google Search for competitor data
- **Output:** Table headers + rows with pricing/features

---

## 🚨 Error Handling Patterns

### Input Validation
```typescript
// Validate required fields
const requiredFields = ['businessContext', 'deckType'];
for (const field of requiredFields) {
  if (!requestData[field]) {
    return new Response(
      JSON.stringify({ error: `Missing required field: ${field}` }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
```

### AI Response Validation
```typescript
// Parse JSON response
const responseText = response.text || "{}";
let parsed;
try {
  parsed = JSON.parse(responseText);
} catch (error) {
  console.error('JSON parse error:', responseText);
  throw new Error('Invalid JSON response from AI');
}

// Validate structure
if (!parsed.slides || !Array.isArray(parsed.slides)) {
  throw new Error('AI response missing slides array');
}

if (parsed.slides.length === 0) {
  throw new Error('AI generated zero slides');
}
```

### Database Error Handling
```typescript
const { data, error } = await supabase
  .from('pitch_decks')
  .select('*')
  .eq('id', deckId)
  .single();

if (error) {
  console.error('Database error:', error);
  if (error.code === 'PGRST116') {
    throw new Error('Deck not found');
  }
  throw new Error('Database query failed');
}

if (!data) {
  throw new Error('Deck not found');
}
```

---

## 📝 Function Naming Conventions

### Edge Function Names
- Use kebab-case: `generate-deck`, `modify-slide-content`
- Be descriptive: What does it do?
- Verb-noun pattern: `analyze-slide`, `generate-image`, `search-events`

### File Structure
```
supabase/functions/
├── generate-deck/
│   └── index.ts
├── generate-image-preview/
│   └── index.ts
├── modify-slide-content/
│   └── index.ts
├── analyze-slide/
│   └── index.ts
└── slide-ai/
    └── index.ts  # Multi-action function (generateMarketData, generateTrends, etc.)
```

---

## 🔄 Deployment Workflow

### Deploy Single Function
```bash
supabase functions deploy generate-deck
```

### Set Environment Variables
```bash
supabase secrets set GEMINI_API_KEY=your_key_here
```

### Check Logs
```bash
supabase functions logs generate-deck
```

---

## 💡 Best Practices

1. **Always handle CORS** - Include OPTIONS handler and CORS headers
2. **Validate all inputs** - Check required fields before processing
3. **Use service role key** - For database access in Edge Functions
4. **Log errors properly** - `console.error()` for debugging in Supabase dashboard
5. **Return consistent format** - `{ data }` for success, `{ error }` for failure
6. **Test locally first** - Use `supabase functions serve`
7. **Keep functions focused** - One function = one responsibility
8. **Use environment variables** - Never hardcode API keys
9. **Add timeout handling** - AI calls can take 10-30 seconds
10. **Validate AI responses** - Always check structure before returning

---

**Remember:** Edge Functions run in Deno, not Node.js. Use `https://esm.sh/` or `https://deno.land/` for imports, not npm packages.
