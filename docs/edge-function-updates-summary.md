# Edge Function Best Practices Update Summary

## Date: 2025-01-22

### ✅ Completed Updates

#### 1. `generate-deck` (Version 20)
- ✅ Replaced `serve` with `Deno.serve`
- ✅ Updated imports to `npm:@google/genai@1.29.0`
- ✅ Updated imports to `npm:@supabase/supabase-js@2.45.0`
- ✅ Removed `declare const Deno: any;`
- ✅ Fixed environment variable usage (using `!` assertion)
- ✅ **Status:** Deployed and ready for testing

#### 2. `slide-ai`
- ✅ Replaced `serve` with `Deno.serve`
- ✅ Updated imports to `npm:@google/genai@1.29.0`
- ✅ Removed `declare const Deno: any;`
- ⚠️ **Status:** Updated locally, needs deployment

#### 3. `enrich-lead`
- ✅ Replaced `serve` with `Deno.serve`
- ✅ Updated imports to `npm:@google/genai@1.29.0`
- ✅ Updated imports to `npm:@supabase/supabase-js@2.45.0`
- ✅ Fixed environment variable usage
- ✅ Removed `declare const Deno: any;`
- ⚠️ **Status:** Updated locally, needs deployment

#### 4. `score-lead`
- ✅ Replaced `serve` with `Deno.serve`
- ✅ Updated imports to `npm:@google/genai@1.29.0`
- ✅ Updated imports to `npm:@supabase/supabase-js@2.45.0`
- ✅ Fixed environment variable usage
- ✅ Removed `declare const Deno: any;`
- ⚠️ **Status:** Updated locally, needs deployment

#### 5. `suggest-tasks`
- ✅ Replaced `serve` with `Deno.serve`
- ✅ Updated imports to `npm:@google/genai@1.29.0`
- ✅ Updated imports to `npm:@supabase/supabase-js@2.45.0`
- ✅ Fixed environment variable usage
- ✅ Removed `declare const Deno: any;`
- ⚠️ **Status:** Updated locally, needs deployment

### ⏳ Remaining Functions to Update

The following functions still need updates:

1. `suggest-next-tasks/index.ts`
2. `research/index.ts`
3. `generate-crm-insights/index.ts`
4. `event-ai/index.ts`
5. `image-ai/index.ts`
6. `analyze-deal-score/index.ts`
7. `generate-leads/index.ts`
8. `suggest-csv-mapping/index.ts`
9. `generate-battlecard/index.ts`
10. `send-email/index.ts`
11. `generate-cold-email/index.ts`
12. `analyze-account-health/index.ts`

### Update Pattern

For each function, apply these changes:

```typescript
// ❌ OLD
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleGenAI, Type } from "npm:@google/genai";
declare const Deno: any;

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
});

// ✅ NEW
import { createClient } from "npm:@supabase/supabase-js@2.45.0";
import { GoogleGenAI, Type } from "npm:@google/genai@1.29.0";

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
});
```

### Next Steps

1. **Test `generate-deck`** - Verify it works correctly with the new imports
2. **Deploy updated functions** - Deploy `slide-ai`, `enrich-lead`, `score-lead`, `suggest-tasks`
3. **Update remaining functions** - Apply the same pattern to the 12 remaining functions
4. **Add linting rules** - Prevent future violations

### Testing Checklist

- [ ] Test `generate-deck` function via browser/API
- [ ] Verify database persistence works
- [ ] Check Edge Function logs for errors
- [ ] Verify all imports resolve correctly
- [ ] Test CORS handling
- [ ] Verify error handling works


