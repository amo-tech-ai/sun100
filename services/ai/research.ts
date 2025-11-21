
import { ResearchResult } from './types';
import { invokeEdgeFunction } from '../edgeFunctionService';

export const researchTopic = async (query: string): Promise<ResearchResult> => {
    return invokeEdgeFunction('research-topic', { 
        query,
        config: {
            model: 'gemini-2.5-flash', // Use Flash for efficient Search Grounding
            tools: ['googleSearch']
        }
    });
};
