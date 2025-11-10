import { Slide } from '../data/decks';

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
