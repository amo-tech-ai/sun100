
import { ResearchResult } from './types';
import { invokeEdgeFunction } from '../edgeFunctionService';

export const researchTopic = async (query: string): Promise<ResearchResult> => {
    return invokeEdgeFunction('research-topic', { 
        query,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'high' // Research synthesis requires deep reasoning
        }
    });
};
