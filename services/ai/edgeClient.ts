/**
 * @deprecated This module is deprecated. Do NOT use client-side AI initialization.
 * All AI calls must go through Supabase Edge Functions for security.
 * 
 * SECURITY WARNING: Never expose API keys in client-side code.
 * Use invokeEdgeFunction() from edgeFunctionService.ts instead.
 */

export const edgeClient = {
    models: {
        generateContent: () => { throw new Error('DEPRECATED: Use Edge Functions instead. Client-side AI is disabled for security.'); },
        generateImages: () => { throw new Error('DEPRECATED: Use Edge Functions instead. Client-side AI is disabled for security.'); },
        generateVideos: () => { throw new Error('DEPRECATED: Use Edge Functions instead. Client-side AI is disabled for security.'); },
    },
    operations: {
        getVideosOperation: () => { throw new Error('DEPRECATED: Use Edge Functions instead. Client-side AI is disabled for security.'); },
    }
};