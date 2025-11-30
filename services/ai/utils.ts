
/**
 * Centralized error handler for AI service calls.
 * Detects rate limits (429) and quota exhaustion, throwing a user-friendly error.
 */
export const handleAIError = (error: any): never => {
    console.error("AI Service Error:", error);
    const msg = error?.message || error?.toString() || '';
    
    // Check for common rate limit / quota signals
    if (
        msg.includes('429') || 
        msg.includes('RESOURCE_EXHAUSTED') || 
        msg.includes('quota') ||
        msg.includes('Too Many Requests')
    ) {
        throw new Error("AI usage limit reached. Please wait a minute before trying again.");
    }
    
    // Re-throw original error if it's not a rate limit
    throw error;
};
