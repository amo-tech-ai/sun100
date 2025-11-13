import { supabase } from '../lib/supabaseClient';

/**
 * A generic helper function to invoke a Supabase Edge Function.
 * This abstracts the `supabase.functions.invoke` call and provides
 * consistent error handling and response typing.
 *
 * @template T The expected type of the data returned from the Edge Function.
 * @param {string} functionName The name of the Edge Function to invoke.
 * @param {Record<string, unknown>} [payload] The JSON body to send with the request.
 * @returns {Promise<T>} A promise that resolves with the data from the function.
 * @throws {Error} Throws a user-friendly error if the function invocation fails.
 */
export const invokeEdgeFunction = async <T>(
  functionName: string,
  payload?: Record<string, unknown>
): Promise<T> => {
  // Ensure Supabase client is available, especially in mock mode.
  if (!supabase || !(supabase as any).realtime) {
     console.warn(`Supabase not configured. Cannot invoke Edge Function "${functionName}".`);
     throw new Error("Cannot connect to the backend service because Supabase is not configured.");
  }

  const { data, error } = await supabase.functions.invoke(functionName, {
    body: payload,
  });

  if (error) {
    console.error(`Error invoking Edge Function "${functionName}":`, error);
    // Create a more generic, user-facing error to avoid exposing implementation details.
    throw new Error(`An error occurred while processing your request. Please try again.`);
  }

  return data as T;
};
