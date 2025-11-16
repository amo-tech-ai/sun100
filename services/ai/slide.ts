import { templates } from '../../styles/templates';
import { Slide, ChartData, TableData } from '../../data/decks';
import { SlideAnalysis, ExtractedMetric, BioSummary } from './types';
import { invokeEdgeFunction } from '../edgeFunctionService';

export const modifySlideContent = async (slideTitle: string, slideContent: string, instruction: string): Promise<{ newTitle: string; newContent: string }> => {
    return invokeEdgeFunction('modify-slide-content', { slideTitle, slideContent, instruction });
};

export const analyzeSlide = async (slideTitle: string, slideContent: string): Promise<SlideAnalysis> => {
    return invokeEdgeFunction('analyze-slide', { slideTitle, slideContent });
};

export const suggestLayout = async (slideTitle: string, slideContent: string): Promise<{ layout: keyof typeof templates }> => {
    const result = await invokeEdgeFunction<{ layout: string }>('suggest-layout', { slideTitle, slideContent });
    if (Object.keys(templates).includes(result.layout)) {
        return { layout: result.layout as keyof typeof templates };
    }
    return { layout: 'default' }; // Fallback
};

export const fetchAllSuggestions = async (slide: Slide): Promise<{ copilotSuggestions: string[], imageSuggestions: string[], researchSuggestions: string[] }> => {
    return invokeEdgeFunction('fetch-all-suggestions', { slide });
};

export const suggestChart = async (slideTitle: string, slideContent: string): Promise<{ chartData: ChartData | null }> => {
    return invokeEdgeFunction('suggest-chart', { slideTitle, slideContent });
};

export const suggestPieChart = async (slideContent: string): Promise<{ chartData: ChartData | null }> => {
    return invokeEdgeFunction('suggest-pie-chart', { slideContent });
};

export const generateHeadlineVariations = async (slideTitle: string): Promise<{ headlines: string[] }> => {
    return invokeEdgeFunction('generate-headlines', { slideTitle });
};

export const extractMetrics = async (slideContent: string): Promise<{ metrics: ExtractedMetric[] }> => {
    return invokeEdgeFunction('extract-metrics', { slideContent });
};

export const generatePricingTable = async (slideContent: string): Promise<{ tableData: TableData | null }> => {
    return invokeEdgeFunction('generate-pricing-table', { slideContent });
};

export const summarizeBio = async (bio: string): Promise<BioSummary> => {
    return invokeEdgeFunction('summarize-bio', { bio });
};
