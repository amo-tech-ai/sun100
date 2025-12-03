
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
    
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    
    // Deep dive into Supabase error context to find the real cause (e.g. "API Key not set")
    if (typeof error === 'object' && error !== null && 'context' in error) {
        try {
            // specific check for response object
            const response = (error as any).context;
            if (response instanceof Response) {
                 const text = await response.text();
                 try {
                     const json = JSON.parse(text);
                     if (json.error) errorMessage = json.error;
                 } catch {
                     if (text) errorMessage = text;
                 }
            }
        } catch (e) {
            // Ignore parsing errors
        }
    }

    throw new Error(errorMessage);
  }

  return data as T;
};
