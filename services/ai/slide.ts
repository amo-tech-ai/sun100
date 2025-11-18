
import { templates } from '../../styles/templates';
import { Slide, ChartData, TableData } from '../../data/decks';
import { SlideAnalysis, ExtractedMetric, BioSummary } from './types';
import { invokeEdgeFunction } from '../edgeFunctionService';

export const modifySlideContent = async (slideTitle: string, slideContent: string, instruction: string): Promise<{ newTitle: string; newContent: string }> => {
    // For simple rewrites, we use 'low' thinking to prioritize speed/latency.
    return invokeEdgeFunction('modify-slide-content', { 
        slideTitle, 
        slideContent, 
        instruction,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'low'
        }
    });
};

export const analyzeSlide = async (slideTitle: string, slideContent: string): Promise<SlideAnalysis> => {
    // For analysis/feedback, we want the model to think deeply about the implications of the content.
    return invokeEdgeFunction('analyze-slide', { 
        slideTitle, 
        slideContent,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'high'
        }
    });
};

export const suggestLayout = async (slideTitle: string, slideContent: string): Promise<{ layout: keyof typeof templates }> => {
    const result = await invokeEdgeFunction<{ layout: string }>('suggest-layout', { 
        slideTitle, 
        slideContent,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'low' // Layout suggestions should be snappy
        }
    });
    if (Object.keys(templates).includes(result.layout)) {
        return { layout: result.layout as keyof typeof templates };
    }
    return { layout: 'default' }; // Fallback
};

export const fetchAllSuggestions = async (slide: Slide): Promise<{ copilotSuggestions: string[], imageSuggestions: string[], researchSuggestions: string[] }> => {
    // Fast suggestions use 'low' thinking for better UX responsiveness.
    return invokeEdgeFunction('fetch-all-suggestions', { 
        slide,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'low'
        }
    });
};

export const suggestChart = async (slideTitle: string, slideContent: string): Promise<{ chartData: ChartData | null }> => {
    return invokeEdgeFunction('suggest-chart', { 
        slideTitle, 
        slideContent,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'low' // Extraction task
        }
    });
};

export const suggestPieChart = async (slideContent: string): Promise<{ chartData: ChartData | null }> => {
    return invokeEdgeFunction('suggest-pie-chart', { 
        slideContent,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'low' // Extraction task
        }
    });
};

export const generateHeadlineVariations = async (slideTitle: string): Promise<{ headlines: string[] }> => {
    return invokeEdgeFunction('generate-headlines', { 
        slideTitle,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'high' // Creative task requires reasoning
        }
    });
};

export const extractMetrics = async (slideContent: string): Promise<{ metrics: ExtractedMetric[] }> => {
    return invokeEdgeFunction('extract-metrics', { 
        slideContent,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'low' // Extraction task
        }
    });
};

export const generatePricingTable = async (slideContent: string): Promise<{ tableData: TableData | null }> => {
    return invokeEdgeFunction('generate-pricing-table', { 
        slideContent,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'low' // Formatting task
        }
    });
};

export const summarizeBio = async (bio: string): Promise<BioSummary> => {
    return invokeEdgeFunction('summarize-bio', { 
        bio,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'high' // Synthesis requires reasoning
        }
    });
};
