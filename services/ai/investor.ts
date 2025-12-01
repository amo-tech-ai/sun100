
import { OnePagerContent, MarketSizeAnalysis, InvestorUpdateContent, StartupStrategicAnalysis, FinancialData, InvestmentMemoContent } from './types';
import { invokeEdgeFunction } from '../edgeFunctionService';

export const generateOnePager = async (startupProfile: any): Promise<OnePagerContent> => {
    return invokeEdgeFunction<OnePagerContent>('generate-one-pager', { startupProfile });
};

export const generateMarketSizing = async (industry: string, location: string, businessModel: string): Promise<MarketSizeAnalysis> => {
    return invokeEdgeFunction<MarketSizeAnalysis>('generate-market-sizing', { industry, location, businessModel });
};

export const generateInvestorUpdate = async (currentMetrics: any, previousMetrics: any, notes: string): Promise<InvestorUpdateContent> => {
    return invokeEdgeFunction<InvestorUpdateContent>('generate-investor-update', { currentMetrics, previousMetrics, notes });
};

export const analyzeStartupStrategy = async (profileContext: string): Promise<StartupStrategicAnalysis> => {
    return invokeEdgeFunction<StartupStrategicAnalysis>('analyze-startup-strategy', { profileContext });
};

export const generateFinancialForecast = async (historicalMetrics: any[]): Promise<FinancialData> => {
    return invokeEdgeFunction<FinancialData>('generate-financial-forecast', { historicalMetrics });
};

export const generateInvestmentMemo = async (startupProfile: any): Promise<InvestmentMemoContent> => {
    return invokeEdgeFunction<InvestmentMemoContent>('generate-investment-memo', { startupProfile });
};

export const askInvestorData = async (query: string, metricsContext: any[]): Promise<string> => {
    const result = await invokeEdgeFunction<{ response: string }>('ask-investor-data', { query, metricsContext });
    return result.response;
};
