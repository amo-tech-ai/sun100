
import { templates } from '../../styles/templates';
import { Slide, ChartData, TableData } from '../../data/decks';
import { SlideAnalysis, ExtractedMetric, BioSummary, FinancialData, GTMStrategy, CompetitorMatrix } from './types';
import { invokeEdgeFunction } from '../edgeFunctionService';

export const modifySlideContent = async (slideTitle: string, slideContent: string, instruction: string): Promise<{ newTitle: string; newContent: string }> => {
    return invokeEdgeFunction('slide-ai', {
        action: 'modifyContent',
        slideTitle,
        slideContent,
        instruction
    });
};

export const analyzeSlide = async (slideTitle: string, slideContent: string): Promise<SlideAnalysis> => {
    return invokeEdgeFunction('slide-ai', {
        action: 'analyzeSlide',
        slideTitle,
        slideContent
    });
};

export const suggestLayout = async (slideTitle: string, slideContent: string): Promise<{ layout: keyof typeof templates }> => {
    return invokeEdgeFunction('slide-ai', {
        action: 'suggestLayout',
        slideTitle,
        slideContent,
        availableLayouts: Object.keys(templates)
    });
};

export const fetchAllSuggestions = async (slide: Slide): Promise<{ copilotSuggestions: string[], imageSuggestions: string[], researchSuggestions: string[] }> => {
    return invokeEdgeFunction('slide-ai', {
        action: 'fetchAllSuggestions',
        slide
    });
};

export const suggestChart = async (slideTitle: string, slideContent: string): Promise<{ chartData: ChartData | null }> => {
    return invokeEdgeFunction('slide-ai', {
        action: 'suggestChart',
        slideTitle,
        slideContent
    });
};

export const suggestPieChart = async (slideContent: string): Promise<{ chartData: ChartData | null }> => {
    return invokeEdgeFunction('slide-ai', {
        action: 'suggestPieChart',
        slideContent
    });
};

export const generateHeadlineVariations = async (slideTitle: string): Promise<{ headlines: string[] }> => {
    return invokeEdgeFunction('slide-ai', {
        action: 'generateHeadlines',
        slideTitle
    });
};

export const extractMetrics = async (slideContent: string): Promise<{ metrics: ExtractedMetric[] }> => {
    return invokeEdgeFunction('slide-ai', {
        action: 'extractMetrics',
        slideContent
    });
};

export const generatePricingTable = async (slideContent: string): Promise<{ tableData: TableData | null }> => {
    return invokeEdgeFunction('slide-ai', {
        action: 'generatePricingTable',
        slideContent
    });
};

export const summarizeBio = async (bio: string): Promise<BioSummary> => {
    return invokeEdgeFunction('slide-ai', {
        action: 'summarizeBio',
        bio
    });
};

export const generateFinancialProjections = async (assumptions: string): Promise<FinancialData> => {
    return invokeEdgeFunction('slide-ai', {
        action: 'generateFinancials',
        assumptions
    });
};

export const generateCompetitorSWOT = async (slideContent: string): Promise<{ tableData: TableData | null }> => {
    return invokeEdgeFunction('slide-ai', {
        action: 'generateSWOT',
        slideContent
    });
};

export const generateGTMStrategy = async (context: string): Promise<GTMStrategy> => {
    return invokeEdgeFunction('slide-ai', {
        action: 'generateGTM',
        context
    });
};

export const generateMarketData = async (industry: string, location: string): Promise<{ tam: string; sam: string; som: string; sources: string[]; summary: string }> => {
    return invokeEdgeFunction('slide-ai', {
        action: 'generateMarketData',
        industry,
        location
    });
};

export const generateTrends = async (industry: string): Promise<{ trends: string[]; narrative: string }> => {
    return invokeEdgeFunction('slide-ai', {
        action: 'generateTrends',
        industry
    });
};

export const generateCompetitorMatrix = async (context: string): Promise<CompetitorMatrix> => {
    return invokeEdgeFunction('slide-ai', {
        action: 'generateCompetitorMatrix',
        context
    });
};