
import { Deck, Slide, ChartData, TableData } from '../../data/decks';
import { templates } from '../../styles/templates';

export { Deck, Slide, ChartData, TableData };

// This file contains shared TypeScript types used across the AI services.

export interface ExtractedMetric {
  label: string;
  value: string;
}

export interface BioSummary {
    summary: string;
    highlights: string[];
}

export interface SlideAnalysis {
    clarity: { rating: 'Good' | 'Average' | 'Needs Improvement'; feedback: string };
    impact: { rating: 'Good' | 'Average' | 'Needs Improvement'; feedback: string };
    tone: { rating: 'Good' | 'Average' | 'Needs Improvement'; feedback: string };
}

export interface ResearchResult {
    summary: string;
    sources: { title: string; uri: string }[];
}

export interface VenueSuggestion {
    name: string;
    reason: string;
    mapLink?: string;
}

export interface SocialMediaCopy {
    twitter: string;
    linkedin: string;
    instagram: string;
}

export interface AgendaItem {
    time: string;
    topic: string;
    speaker?: string;
}

export interface StructuredAgenda {
    schedule: AgendaItem[];
}

export interface FinancialData {
    headers: string[];
    rows: { label: string; values: string[] }[];
    summary: string;
}

export interface BudgetLineItem {
    category: string;
    amount: number;
    notes: string;
}

export interface BudgetEstimate {
    total: number;
    perHead: number;
    items: BudgetLineItem[];
}

export interface EmailDraft {
    subject: string;
    body: string;
}

export interface EmailSequence {
    invitation: EmailDraft;
    reminder: EmailDraft;
    followUp: EmailDraft;
}

export interface DeckUpdateSuggestion {
    slideTitle: string;
    currentValue: string;
    newValue: string;
    reason: string;
}

export interface FundingAnalysis {
    investorTypes: string[];
    strategicAdvice: string;
    nextSteps: string[];
}

export interface GTMStrategy {
    strategy_summary: string;
    channels: string[];
    key_metrics: string[];
}

// --- Investor Command Center Types ---

export type InvestorDocType = 'one_pager' | 'update' | 'memo' | 'gtm_strategy';

export interface InvestorDoc {
    id: string;
    title: string;
    type: InvestorDocType;
    status: 'draft' | 'final' | 'sent';
    lastUpdated: string;
    previewUrl?: string; // For thumbnail generation
}

export interface MarketSizeAnalysis {
  icp: string;
  beachhead: string;
  tam: { value: string; description: string; sourceUrl: string };
  sam: { value: string; description: string; sourceUrl: string };
  som: { value: string; description: string; sourceUrl: string };
  methodology: string;
}

export interface OnePagerContent {
    headline: string;
    problem_summary: string;
    solution_summary: string;
    market_opportunity: string;
    traction_highlights: string[];
    business_model: string;
    ask: string;
    contact_info: { email: string; website: string };
}

export interface InvestorUpdateContent {
    subject_line: string;
    status_emoji: '🟢' | '🟡' | '🔴';
    status_summary: string;
    highlights: string[];
    lowlights: string[];
    kpi_summary: string; // Markdown table or list
    ask: string;
}

// --- VC Matching Types ---

export interface StartupProfile {
    name: string;
    industry: string;
    stage: string;
    location: string;
    fundingAsk: number;
    description: string;
    traction?: string;
}

export interface VCMatchAnalysis {
    investorId: string;
    matchScore: number;
    status: 'High Fit' | 'Potential' | 'Low Fit';
    reasoning: string;
    alignment: {
        stage: boolean;
        check_size: boolean;
        industry: boolean;
        geo: boolean;
    };
    strengths: string[];
    risks: string[];
    recommendedAction: string;
}

export interface RankedInvestor {
    investorId: string;
    investorName: string;
    matchScore: number;
    reasoning: string;
}

export interface InvestorRanking {
    matches: RankedInvestor[];
}
