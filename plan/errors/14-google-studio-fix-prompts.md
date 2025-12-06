# Google AI Studio Fix Prompts

**Quick-reference prompts for fixing common React/Vite/Supabase errors.**

---

## 1. Blank Screen / App Not Rendering

```
My React app shows a blank white screen. Check:
1. Are there duplicate .jsx and .tsx files? Delete the .jsx versions.
2. Is main.tsx importing App correctly?
3. Are all context providers in the right order in main.tsx?
4. Run: rm -rf node_modules/.vite && npm run dev

Show me the correct provider chain order for: ErrorBoundary, BrowserRouter, AuthProvider, StartupProvider, ToastProvider
```

---

## 2. Import Path Errors

```
Vite says "Failed to resolve import" for [FILE].

My file structure:
- src/App.tsx (importing)
- src/contexts/AuthContext.tsx
- screens/Dashboard.tsx (at root, not src/)
- components/ProtectedRoute.tsx (at root)

Fix the relative path. Use ../ to go up one level. Show the correct import statement.
```

---

## 3. "useAuth must be used within AuthProvider"

```
Error: useAuth must be used within an AuthProvider

Check my provider chain in main.tsx. The order must be:
1. ErrorBoundary (outermost)
2. BrowserRouter
3. AuthProvider
4. StartupProvider (uses useAuth, must be INSIDE AuthProvider)
5. ToastProvider
6. App (innermost)

Also check: Is hooks/useAuth.ts importing from the correct AuthContext path?
```

---

## 4. Missing Dependency (Build Fails)

```
Build error: Cannot find module '[PACKAGE_NAME]'

Steps:
1. npm install [PACKAGE_NAME]
2. Check package.json has it listed
3. npm run build

Common missing packages: lucide-react, recharts, @google/genai
```

---

## 5. Edge Function API Key Error

```
My Supabase Edge Function can't access GEMINI_API_KEY.

Wrong: process.env.API_KEY
Wrong: process.env.GEMINI_API_KEY
Correct: Deno.env.get('GEMINI_API_KEY')

Show the correct Deno pattern for accessing secrets in Edge Functions.
```

---

## 6. Supabase Mock Mode in Production

```
My app says "Running in MOCK MODE" in production. This is dangerous.

Fix lib/supabaseClient.ts to:
1. Only allow mock mode in development (import.meta.env.MODE === 'development')
2. Throw error if VITE_SUPABASE_URL is missing in production
3. Add isSupabaseConfigured() helper function
```

---

## 7. 404 Dynamic Chunks After Deploy

```
After deploying to Vercel, I get 404 errors for chunk files like CustomerCRM-abc123.js

Fix:
1. Run clean build: rm -rf dist && npm run build
2. Redeploy entire dist folder
3. Clear CDN/service worker caches
4. Check vite.config.ts has correct base path
```

---

## 8. Bundle Too Large

```
Vite warning: bundle size is 700KB+

Add manual chunks to vite.config.ts:

build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom', 'react-router-dom'],
        gemini: ['@google/genai'],
        supabase: ['@supabase/supabase-js']
      }
    }
  }
}
```

---

## 9. TypeScript Compilation Error

```
Build fails with TypeScript error in [FILE].

Common fixes:
1. Check for missing closing tags in JSX (</Route>, </div>)
2. Check for commented-out code that breaks syntax
3. Verify all imports exist
4. Run: npx tsc --noEmit to see all errors
```

---

## 10. Git Push Rejected (Secrets Detected)

```
GitHub blocked my push: "Secret scanning found a token"

Fix:
1. Add to .gitignore: *.local*, .env.local*
2. Remove from history: git filter-repo --path-glob '*.local*' --invert-paths
3. Force push: git push --force
```

---

## 11. Vite Cache Issues

```
My changes aren't showing after restart.

Nuclear option:
pkill -9 -f "vite\|npm.*dev"
rm -rf node_modules/.vite
npm run dev

Or just: npx vite --force
```

---

## 12. Context Provider Not Found

```
Error: useStartup must be used within a StartupProvider

Debug steps:
1. Is StartupProvider in main.tsx?
2. Is it wrapping the component that uses useStartup?
3. Check import path in hooks/useStartup.ts points to correct file
4. Delete any duplicate context files at root level
```

---

## 13. CORS Error on Edge Function

```
CORS error when calling Supabase Edge Function.

Add to your Edge Function:

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle preflight
if (req.method === 'OPTIONS') {
  return new Response('ok', { headers: corsHeaders });
}

// Add to all responses
return new Response(JSON.stringify(data), {
  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
});
```

---

## 14. Lazy Load Component 404

```
React lazy component returns 404 or fails to load.

Check:
1. File exists at the path specified
2. Component has default export
3. Path is relative to the importing file
4. No typos in filename

Pattern:
const Dashboard = lazy(() => import('../screens/Dashboard'));
```

---

## 15. Full Forensic Audit

```
My app is broken and I don't know why. Run a full audit:

1. Check console for errors (zero errors = good)
2. Check network tab for failed requests
3. Run npm run build - does it pass?
4. Check for duplicate .jsx/.tsx files
5. Verify all imports resolve
6. Check provider chain order
7. Clear Vite cache and restart
8. Check env vars are set

What's the first error you see?
```

---

## Quick Diagnostic Commands

```bash
# Check for duplicate files
find . -name "*.jsx" -o -name "*.tsx" | sort

# Verify build
npm run build

# Clear cache and restart
rm -rf node_modules/.vite && npm run dev

# Check TypeScript
npx tsc --noEmit

# List all imports of a package
grep -r "from.*lucide-react" --include="*.tsx" --include="*.ts"

# Kill stuck processes
pkill -9 -f vite
```

---

## Error → Prompt Quick Reference

| Error Message | Use Prompt # |
|--------------|--------------|
| Blank screen | 1 |
| Failed to resolve import | 2 |
| useAuth must be used within AuthProvider | 3 |
| Cannot find module | 4 |
| Deno.env undefined | 5 |
| Running in MOCK MODE | 6 |
| 404 chunk files | 7 |
| Bundle too large | 8 |
| TypeScript error | 9 |
| Push rejected secrets | 10 |
| Changes not showing | 11 |
| useContext must be within Provider | 12 |
| CORS error | 13 |
| Lazy load fails | 14 |
| Unknown error | 15 |

---

**Last Updated:** 2025-12-06

