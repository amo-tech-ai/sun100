import { supabase } from '../lib/supabaseClient';
import { Slide, ChartData, TableData, Deck } from '../data/decks';

// --- Type Definitions ---
export interface DeckGenerationResult {
    title: string;
    slides: {
        id: string;
        title: string;
        content: string;
        imageUrl?: string;
        type: Slide['type'];
    }[];
}

export interface SlideAnalysis {
    clarity: { rating: 'Good' | 'Average' | 'Needs Improvement'; feedback: string };
    impact: { rating: 'Good' | 'Average' | 'Needs Improvement'; feedback: string };
    tone: { rating: 'Good' | 'Average' | 'Needs Improvement'; feedback: string };
}

export interface ResearchResult {
    summary: string;
    sources: { uri: string; title: string }[];
}

export interface ExtractedMetric {
    label: string;
    value: string;
}

export interface BioSummary {
    summary: string;
    highlights: string[];
}


// This file now calls secure Supabase Edge Functions
const invokeFunction = async <T>(functionName: string, body: object): Promise<T> => {
    const { data, error } = await supabase.functions.invoke(functionName, { body });
    if (error) throw error;
    return data;
};

export const generateDeck = async (payload: { mode: 'text' | 'url', content: string | string[] }): Promise<{ deckId: string }> => {
    return invokeFunction<{ deckId: string }>('generate-deck', payload);
};

export const generateEventDescription = (details: { title: string; date: string; location: string }): Promise<{ description: string }> => {
    return invokeFunction('generate-event-description', details);
};

export const generateSlideImage = (slideTitle: string, slideContent: string, promptOverride?: string): Promise<{ base64Image: string }> => {
    return invokeFunction('generate-slide-image', { slideTitle, slideContent, promptOverride });
};

export const editSlideImage = (base64Data: string, mimeType: string, prompt: string): Promise<{ base64Image: string }> => {
    return invokeFunction('edit-slide-image', { base64Data, mimeType, prompt });
};

export const modifySlideContent = (title: string, content: string, instruction: string): Promise<{ newTitle: string; newContent: string }> => {
    return invokeFunction('modify-slide-content', { title, content, instruction });
};

export const analyzeSlide = (title: string, content: string): Promise<SlideAnalysis> => {
    return invokeFunction('analyze-slide', { title, content });
};

export const researchTopic = (query: string): Promise<ResearchResult> => {
    return invokeFunction('research-topic', { query });
};

export const suggestLayout = (title: string, content: string): Promise<{ layout: keyof import("../styles/templates").DeckTemplate }> => {
    return invokeFunction('suggest-layout', { title, content });
};

export const fetchAllSuggestions = (slide: Slide): Promise<{ copilotSuggestions: string[]; imageSuggestions: string[]; researchSuggestions: string[] }> => {
    return invokeFunction('fetch-all-suggestions', { slide });
};

export const suggestChart = (title: string, content: string): Promise<{ chartData: ChartData | null }> => {
    return invokeFunction('suggest-chart', { title, content });
};

export const suggestPieChart = (content: string): Promise<{ chartData: ChartData | null }> => {
    return invokeFunction('suggest-pie-chart', { content });
};

export const generateRoadmapSlide = (companyContext: string): Promise<{ slide: Slide }> => {
    return invokeFunction('generate-roadmap-slide', { companyContext });
};

export const generateHeadlineVariations = (currentTitle: string): Promise<{ headlines: string[] }> => {
    return invokeFunction('generate-headline-variations', { currentTitle });
};

export const extractMetrics = (content: string): Promise<{ metrics: ExtractedMetric[] }> => {
    return invokeFunction('extract-metrics', { content });
};

export const generatePricingTable = (productInfo: string): Promise<{ tableData: TableData }> => {
    return invokeFunction('generate-pricing-table', { productInfo });
};

export const summarizeBio = (bioText: string): Promise<BioSummary> => {
    return invokeFunction('summarize-bio', { bioText });
};