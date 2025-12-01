
import { Deck, Slide, ChartData, TableData } from '../../data/decks';
import { templates } from '../../styles/templates';

// Re-export specific types if needed by consumers
export type { Deck, Slide, ChartData, TableData };

// --- Slide & Deck Types ---
export interface SlideAnalysis {
    clarity: { rating: string; feedback: string };
    impact: { rating: string; feedback: string };
    tone: { rating: string; feedback: string };
}

export interface ExtractedMetric {
    label: string;
    value: string;
}

export interface BioSummary {
    summary: string;
    highlights: string[];
}

export interface FinancialData {
    headers: string[];
    rows: { label: string; values: string[] }[];
    summary: string;
}

export interface GTMStrategy {
    strategy_summary: string;
    channels: string[];
    key_metrics: string[];
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

// --- Research ---
export interface ResearchResult {
    summary: string;
    sources: { title: string; uri: string }[];
}

// --- Event Wizard ---
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

export interface BudgetEstimate {
    total: number;
    perHead: number;
    items: { category: string; amount: number; notes: string }[];
}

export interface EmailSequence {
    invitation: { subject: string; body: string };
    reminder: { subject: string; body: string };
    followUp: { subject: string; body: string };
}

// --- Investor Dashboard ---
export type InvestorDocType = 'one_pager' | 'update' | 'memo' | 'gtm_strategy';

export interface InvestorDoc {
    id: string;
    title: string;
    type: InvestorDocType;
    status: 'draft' | 'final';
    lastUpdated: string;
    content: any; // Can be specific content types below
    previewUrl?: string;
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
    status_emoji: string;
    status_summary: string;
    highlights: string[];
    lowlights: string[];
    kpi_summary: string;
    ask: string;
}

export interface InvestmentMemoContent {
    investment_thesis: string;
    key_risks: string[];
    market_dynamics: string;
    competitor_analysis: string;
    team_assessment: string;
    verdict_score: number;
    verdict_summary: string;
}

export interface MarketSizeAnalysis {
    icp: string;
    beachhead: string;
    tam: { value: string; description: string; sourceUrl?: string };
    sam: { value: string; description: string; sourceUrl?: string };
    som: { value: string; description: string; sourceUrl?: string };
    methodology: string;
}

export interface StartupStrategicAnalysis {
    investorReadinessScore: number;
    readinessReasoning: string;
    swot: {
        strengths: string[];
        weaknesses: string[];
        opportunities: string[];
        threats: string[];
    };
    marketTrends: string[];
    keyCompetitors: string[];
}

// --- Data Room ---
export interface DataRoomFile {
    id: string;
    name: string;
    category: string;
    size: string;
    uploadDate?: string;
}

export interface DataRoomAudit {
    score: number;
    status: string;
    found_categories: string[];
    missing_items: string[];
    warnings: string[];
    recommendations: string[];
}

// --- CRM & Prospecting ---
export interface AccountHealth {
    score: number;
    status: string;
    factors: string[];
    recommendation: string;
}

export interface CRMInsight {
    type: 'risk' | 'opportunity' | 'info';
    message: string;
    action: string;
}

export interface Prospect {
    name: string;
    website: string;
    description: string;
    fitScore: number;
    reason: string;
    location: string;
    industry: string;
    // Enriched fields
    ceoName?: string;
    ceoLinkedin?: string;
    latestNews?: string;
    enrichedSummary?: string;
}

export interface LeadSearchCriteria {
    industry: string;
    location: string;
    stage?: string;
    keywords?: string[];
}

export interface EnrichedLeadData {
    ceoName: string;
    ceoLinkedin: string;
    latestNews: string;
    companySummary: string;
}

export interface LeadEnrichmentResult {
    ceo_name: string;
    ceo_linkedin: string;
    linkedin_company_url: string;
    recent_news: { title: string; url: string; source: string; published_at: string }[];
    funding_history: { round: string; amount: string; date: string; investors: string }[];
    hiring_trends: { trend: 'up' | 'flat' | 'down'; roles: string[] };
    market_presence_score: number;
    search_trend_score: number;
    gemini_summary: string;
    evidence_links: { type: string; url: string; label: string }[];
}

export interface LeadScoreResult {
    overall_score: number;
    confidence: number;
    status_band: 'High' | 'Medium' | 'Low';
    stage_recommendation: string;
    fit_breakdown: {
        industry_fit: number;
        company_size_fit: number;
        budget_fit: number;
        problem_fit: number;
        engagement_fit: number;
        search_trend_score: number;
    };
    risk_score: number;
    ai_findings: string[];
    risks: string[];
    recommended_next_actions: string[];
}

export interface Battlecard {
    competitors: {
        name: string;
        strengths: string[];
        weaknesses: string[];
        pricing_model: string;
        kill_points: string[];
    }[];
    our_advantages: string[];
    objection_handling: { objection: string; counter: string }[];
}

// --- VC Matcher ---
export interface StartupProfile {
    name: string;
    industry: string;
    stage: string;
    location: string;
    fundingAsk: number;
    description: string;
    traction: string;
}

export interface VCMatchAnalysis {
    matchScore: number;
    status: string;
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

// --- GTM Strategy ---
export interface GTMInput {
    startupName: string;
    industry: string;
    description: string;
    targetAudience: string;
    stage: string;
}

export interface FullGTMStrategy {
    executiveSummary: string;
    icp: {
        personaName: string;
        painPoints: string[];
        motivations: string[];
        role: string;
    };
    valueProposition: {
        headline: string;
        benefits: string[];
        differentiators: string[];
    };
    channels: {
        name: string;
        type: 'Inbound' | 'Outbound' | 'Partnership' | 'Community';
        tactic: string;
        priority: 'High' | 'Medium' | 'Low';
    }[];
    pricingStrategy: {
        model: string;
        recommendation: string;
        tiers: {
            name: string;
            price: string;
            features: string[];
        }[];
    };
    launchRoadmap: {
        phase1: { name: string; duration: string; focus: string; tasks: string[] };
        phase2: { name: string; duration: string; focus: string; tasks: string[] };
        phase3: { name: string; duration: string; focus: string; tasks: string[] };
    };
    risks: {
        risk: string;
        mitigation: string;
        severity: 'High' | 'Medium' | 'Low';
    }[];
}

// --- Outreach ---
export interface EmailDraft {
    subject: string;
    body: string;
}
