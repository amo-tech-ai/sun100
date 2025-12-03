
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
    
    // Attempt to extract a more specific error message if available
    let errorMessage = `An error occurred while processing your request via ${functionName}.`;
    
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    
    // If the error object has a context or details (Supabase specific)
    if (typeof error === 'object' && error !== null && 'context' in error) {
        // Provide more info if available
        try {
            // Sometimes the response body is hidden in the error object
            const body = await (error as any).context?.json?.();
            if (body?.error) {
                errorMessage = body.error;
            }
        } catch (e) {
            // Ignore parsing errors
        }
    }

    throw new Error(errorMessage);
  }

  return data as T;
};
