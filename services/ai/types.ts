import { Deck, Slide, ChartData, TableData } from '../../data/decks';
import { templates } from '../../styles/templates';

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