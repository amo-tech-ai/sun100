
import { FullGTMStrategy, GTMInput } from './types';
import { invokeEdgeFunction } from '../edgeFunctionService';

/**
 * Generates a comprehensive Go-To-Market strategy using a secure Edge Function.
 */
export const generateFullGTMStrategy = async (input: GTMInput): Promise<FullGTMStrategy> => {
    return invokeEdgeFunction<FullGTMStrategy>('investor-ai', { 
        action: 'generateFullGTM',
        input 
    });
};
