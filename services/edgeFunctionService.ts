
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
    throw new Error(`An error occurred while processing your request via ${functionName}. Please try again.`);
  }

  return data as T;
};
