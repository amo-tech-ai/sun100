
import { supabase } from '../lib/supabaseClient';

/**
 * A generic helper function to invoke a Supabase Edge Function.
 */
export const invokeEdgeFunction = async <T>(
  functionName: string,
  payload?: Record<string, unknown>
): Promise<T> => {
  // Strictly call the Edge Function
  const { data, error } = await supabase.functions.invoke(functionName, {
    body: payload,
  });

  if (error) {
    console.error(`Error invoking Edge Function "${functionName}":`, error);
    
    let errorMessage = `An error occurred while processing your request via ${functionName}.`;
    
    // Prioritize the message directly on the error object if it exists
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    
    // Deep dive into Supabase error context to find the real cause
    // Supabase functions often return the real error details in a nested HTTP response body
    if (typeof error === 'object' && error !== null && 'context' in error) {
        try {
            // specific check for response object
            const response = (error as any).context;
            if (response instanceof Response) {
                 const text = await response.text();
                 try {
                     // Try to parse JSON error from the backend (e.g. { error: "Safety violation" })
                     const json = JSON.parse(text);
                     if (json.error) {
                        errorMessage = typeof json.error === 'string' ? json.error : JSON.stringify(json.error);
                     } else if (json.message) {
                        errorMessage = json.message;
                     }
                 } catch {
                     // If text is not JSON, use the raw text if it's not too long (e.g. HTML error page)
                     if (text && text.length < 200) errorMessage = text;
                 }
            }
        } catch (e) {
            // Ignore parsing errors, stick to default
        }
    }

    throw new Error(errorMessage);
  }

  return data as T;
};
