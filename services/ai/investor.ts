
import { OnePagerContent, MarketSizeAnalysis } from './types';
import { invokeEdgeFunction } from '../edgeFunctionService';

export const generateOnePager = async (startupProfile: any): Promise<OnePagerContent> => {
    return invokeEdgeFunction('generate-one-pager', {
        startupProfile,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'low', // Low thinking for summarization/extraction
            tools: [] // Uses Function Calling implicitly via schema on backend
        }
    });
};

export const generateMarketSizing = async (industry: string, location: string, businessModel: string): Promise<MarketSizeAnalysis> => {
    return invokeEdgeFunction('generate-market-sizing', {
        industry,
        location,
        businessModel,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'high', // High thinking for reasoning and search synthesis
            tools: ['googleSearch'] // Explicitly requires Google Search
        }
    });
};

export const generateInvestorUpdate = async (currentMetrics: any, previousMetrics: any, notes: string): Promise<{ content: string }> => {
    return invokeEdgeFunction('generate-investor-update', {
        currentMetrics,
        previousMetrics,
        notes,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'low' 
        }
    });
};
