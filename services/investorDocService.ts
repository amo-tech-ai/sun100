
import { supabase } from '../lib/supabaseClient';
import { InvestorDoc } from './ai/types';

const STORAGE_KEY = 'sun_ai_investor_docs';

const MOCK_DOCS: InvestorDoc[] = [
    { 
        id: 'doc-1', 
        title: 'Seed Round One-Pager', 
        type: 'one_pager', 
        status: 'final', 
        lastUpdated: 'Aug 28, 2024',
        content: {
            headline: "The Operating System for AI Startups",
            problem_summary: "Founders waste 40% of their time on non-core tasks like deck design and updates.",
            solution_summary: "Sun AI automates fundraising assets using Gemini 3, saving 100+ hours per round.",
            market_opportunity: "$45B Global Productivity Market with 12% CAGR.",
            traction_highlights: ["$12k MRR", "15% MoM Growth", "500+ Active Users"],
            business_model: "SaaS Subscription ($49/mo) + Marketplace Take Rate (15%)",
            ask: "$2M Seed Round for Product Expansion",
            contact_info: { email: "founders@sun.ai", website: "sun.ai" }
        }
    },
    { 
        id: 'doc-2', 
        title: 'August Investor Update', 
        type: 'update', 
        status: 'draft', 
        lastUpdated: 'Sep 01, 2024',
        content: {
            subject_line: "August Update: Key Hires & Product Velocity",
            status_emoji: "🟢",
            status_summary: "On track. We closed 3 key hires and shipped the new AI engine.",
            highlights: ["Hired Lead Engineer", "Shipped Gemini 3 Integration"],
            lowlights: ["Marketing spend efficiency dropped slightly"],
            kpi_summary: "**MRR:** $12k (+15%)\n**Runway:** 18 Months",
            ask: "Intros to Series A fintech investors."
        }
    }
];

// Helper to get data (Local or DB)
const getLocalData = (): InvestorDoc[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored).sort((a: InvestorDoc, b: InvestorDoc) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_DOCS));
    return MOCK_DOCS;
};

export const getInvestorDocs = async (): Promise<InvestorDoc[]> => {
    if ((supabase as any).realtime) {
        const { data, error } = await supabase
            .from('investor_docs')
            .select('*')
            .order('updated_at', { ascending: false });
        if (error) throw error;
        return data;
    }
    
    return new Promise(resolve => {
        setTimeout(() => resolve(getLocalData()), 300);
    });
};

export const getInvestorDocById = async (id: string): Promise<InvestorDoc | null> => {
    if ((supabase as any).realtime) {
        const { data, error } = await supabase.from('investor_docs').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    }
    const docs = getLocalData();
    return new Promise(resolve => {
        setTimeout(() => resolve(docs.find(d => d.id === id) || null), 300);
    });
};

export const saveInvestorDoc = async (doc: Omit<InvestorDoc, 'id' | 'lastUpdated'> & { id?: string }): Promise<InvestorDoc> => {
    const timestamp = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    if ((supabase as any).realtime) {
        const payload = { ...doc, last_generated_at: new Date().toISOString() };
        const { data, error } = await supabase.from('investor_docs').upsert(payload).select().single();
        if (error) throw error;
        return data;
    }

    const currentData = getLocalData();
    const existingIndex = currentData.findIndex(d => d.id === doc.id);
    
    const newDoc: InvestorDoc = { 
        ...doc, 
        id: doc.id || `doc-${Date.now()}`,
        lastUpdated: timestamp
    };

    if (existingIndex >= 0) {
        currentData[existingIndex] = newDoc;
    } else {
        currentData.unshift(newDoc);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
    return new Promise(resolve => setTimeout(() => resolve(newDoc), 500));
};

export const deleteInvestorDoc = async (id: string): Promise<void> => {
    if ((supabase as any).realtime) {
        const { error } = await supabase.from('investor_docs').delete().eq('id', id);
        if (error) throw error;
        return;
    }

    const currentData = getLocalData();
    const newData = currentData.filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    return new Promise(resolve => setTimeout(() => resolve(), 300));
};
