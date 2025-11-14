import { ResearchResult } from './types';
import { invokeEdgeFunction } from '../edgeFunctionService';

export const researchTopic = async (query: string): Promise<ResearchResult> => {
    return invokeEdgeFunction('research-topic', { query });
};