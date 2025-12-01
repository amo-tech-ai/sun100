
import { templates } from '../../styles/templates';
import { Slide, ChartData, TableData } from '../../data/decks';
import { SlideAnalysis, ExtractedMetric, BioSummary, FinancialData, GTMStrategy } from './types';
import { handleAIError } from './utils';
import { invokeEdgeFunction } from '../edgeFunctionService';

export const modifySlideContent = async (slideTitle: string, slideContent: string, instruction: string): Promise<{ newTitle: string; newContent: string }> => {
    return invokeEdgeFunction<{ newTitle: string; newContent: string }>('modify-slide-content', {
        slideTitle,
        slideContent,
        instruction
    });
};

export const analyzeSlide = async (slideTitle: string, slideContent: string): Promise<SlideAnalysis> => {
    return invokeEdgeFunction<SlideAnalysis>('analyze-slide', {
        slideTitle,
        slideContent
    });
};

export const suggestLayout = async (slideTitle: string, slideContent: string): Promise<{ layout: keyof typeof templates }> => {
    const result = await invokeEdgeFunction<{ layout: string }>('suggest-layout', {
        slideTitle,
        slideContent,
        availableTemplates: Object.keys(templates)
    });
    
    // Type guard for template key
    if (result.layout && Object.keys(templates).includes(result.layout)) {
        return { layout: result.layout as keyof typeof templates };
    }
    return { layout: 'default' };
};

export const fetchAllSuggestions = async (slide: Slide): Promise<{ copilotSuggestions: string[], imageSuggestions: string[], researchSuggestions: string[] }> => {
    try {
        return await invokeEdgeFunction('fetch-all-suggestions', { slide });
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        return { copilotSuggestions: [], imageSuggestions: [], researchSuggestions: [] };
    }
};

export const suggestChart = async (slideTitle: string, slideContent: string): Promise<{ chartData: ChartData | null }> => {
    return invokeEdgeFunction<{ chartData: ChartData | null }>('suggest-chart', {
        slideTitle,
        slideContent
    });
};

export const suggestPieChart = async (slideContent: string): Promise<{ chartData: ChartData | null }> => {
    return invokeEdgeFunction<{ chartData: ChartData | null }>('suggest-pie-chart', {
        slideContent
    });
};

export const generateHeadlineVariations = async (slideTitle: string): Promise<{ headlines: string[] }> => {
    return invokeEdgeFunction<{ headlines: string[] }>('generate-headline-variations', {
        slideTitle
    });
};

export const extractMetrics = async (slideContent: string): Promise<{ metrics: ExtractedMetric[] }> => {
    return invokeEdgeFunction<{ metrics: ExtractedMetric[] }>('extract-metrics', {
        slideContent
    });
};

export const generatePricingTable = async (slideContent: string): Promise<{ tableData: TableData | null }> => {
    return invokeEdgeFunction<{ tableData: TableData | null }>('generate-pricing-table', {
        slideContent
    });
};

export const summarizeBio = async (bio: string): Promise<BioSummary> => {
    return invokeEdgeFunction<BioSummary>('summarize-bio', { bio });
};

export const generateFinancialProjections = async (assumptions: string): Promise<FinancialData> => {
    return invokeEdgeFunction<FinancialData>('generate-financial-projections', { assumptions });
};

export const generateCompetitorSWOT = async (slideContent: string): Promise<{ tableData: TableData | null }> => {
    return invokeEdgeFunction<{ tableData: TableData | null }>('generate-competitor-swot', {
        slideContent
    });
};

export const generateGTMStrategy = async (context: string): Promise<GTMStrategy> => {
    return invokeEdgeFunction<GTMStrategy>('generate-gtm-strategy-simple', {
        context
    });
};
