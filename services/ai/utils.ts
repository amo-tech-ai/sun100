
/**
 * Centralized error handler for AI service calls.
 * translating technical codes into user-friendly advice.
 */
export const formatAIError = (error: any): string => {
    console.error("AI Service Error:", error);
    const msg = (error?.message || error?.toString() || '').toLowerCase();
    
    // 1. Safety / Policy Violations (Gemini)
    if (
        msg.includes('safety') || 
        msg.includes('blocked') || 
        msg.includes('policy') || 
        msg.includes('harmful')
    ) {
        return "The AI flagged this prompt as potentially unsafe or against policy. Please try rephrasing it to be more professional or neutral.";
    }

    // 2. Quota / Rate Limits
    if (
        msg.includes('429') || 
        msg.includes('resource_exhausted') || 
        msg.includes('quota') ||
        msg.includes('too many requests')
    ) {
        return "We're experiencing high traffic with the AI provider. Please wait a minute and try again.";
    }

    // 3. Invalid Input / Prompts
    if (msg.includes('invalid_argument') || msg.includes('400')) {
        return "The AI couldn't process this input. It might be too short, too long, or contain unsupported characters. Please refine your prompt.";
    }

    // 4. Image / Format Issues
    if (
        msg.includes('mime') || 
        msg.includes('format') || 
        msg.includes('image bytes') ||
        msg.includes('decoding')
    ) {
        return "Unsupported image format or corrupted file. Please try using a standard JPG or PNG image.";
    }

    // 5. Timeout / Server Errors
    if (msg.includes('504') || msg.includes('timeout') || msg.includes('deadline')) {
        return "The request timed out. The AI is thinking hard! Try breaking your request into smaller steps.";
    }
    
    // 6. Auth Errors
    if (msg.includes('401') || msg.includes('unauthorized') || msg.includes('api key')) {
        return "Authentication error. Please check your connection or sign in again.";
    }

    // Default fallback
    return error?.message || "An unexpected error occurred. Please try again.";
};

/**
 * Deprecated: Use formatAIError in try/catch blocks instead.
 */
export const handleAIError = (error: any): never => {
    throw new Error(formatAIError(error));
};
