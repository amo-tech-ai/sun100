
import { OnePagerContent, MarketSizeAnalysis, InvestorUpdateContent, StartupStrategicAnalysis, FinancialData, InvestmentMemoContent } from './types';
import { invokeEdgeFunction } from '../edgeFunctionService';

export const generateOnePager = async (startupProfile: any): Promise<OnePagerContent> => {
    return invokeEdgeFunction<OnePagerContent>('investor-ai', { 
        action: 'generateOnePager',
        startupProfile 
    });
};

export const generateMarketSizing = async (industry: string, location: string, businessModel: string): Promise<MarketSizeAnalysis> => {
    return invokeEdgeFunction<MarketSizeAnalysis>('investor-ai', { 
        action: 'generateMarketSizing',
        industry, 
        location, 
        businessModel 
    });
};

export const generateInvestorUpdate = async (currentMetrics: any, previousMetrics: any, notes: string): Promise<InvestorUpdateContent> => {
    return invokeEdgeFunction<InvestorUpdateContent>('investor-ai', { 
        action: 'generateInvestorUpdate',
        currentMetrics, 
        previousMetrics, 
        notes 
    });
};

export const analyzeStartupStrategy = async (profileContext: string): Promise<StartupStrategicAnalysis> => {
    return invokeEdgeFunction<StartupStrategicAnalysis>('investor-ai', { 
        action: 'analyzeStartupStrategy',
        profileContext 
    });
};

export const generateFinancialForecast = async (historicalMetrics: any[]): Promise<FinancialData> => {
    return invokeEdgeFunction<FinancialData>('investor-ai', { 
        action: 'generateFinancialForecast',
        historicalMetrics 
    });
};

export const generateInvestmentMemo = async (startupProfile: any): Promise<InvestmentMemoContent> => {
    return invokeEdgeFunction<InvestmentMemoContent>('investor-ai', { 
        action: 'generateInvestmentMemo',
        startupProfile 
    });
};

export const askInvestorData = async (query: string, metricsContext: any[]): Promise<string> => {
    const result = await invokeEdgeFunction<{ response: string }>('investor-ai', { 
        action: 'askInvestorData',
        query, 
        metricsContext 
    });
    return result.response;
};
