
import { invokeEdgeFunction } from '../edgeFunctionService';
import { TaskAdvisorResponse } from './types';
import { supabase } from '../../lib/supabaseClient';

/**
 * Invokes the Gemini 3 Task Advisor to analyze startup state and suggest next steps.
 */
export const suggestNextTasks = async (): Promise<TaskAdvisorResponse> => {
    // Mock Fallback for local dev / review
    if (!(supabase as any).realtime) {
        await new Promise(r => setTimeout(r, 2500)); // Simulate thinking
        return {
            analysis_summary: "Your startup foundation is solid, but customer acquisition is lagging behind your burn rate.",
            core_tasks: [
                { title: "Refine Pitch Deck", description: "Your deck hasn't been updated in 2 weeks.", priority: 'Medium', link: '/pitch-decks' }
            ],
            growth_tasks: [
                { title: "Find 10 Leads", description: "Pipeline is thin. Find fintech leads.", priority: 'High', link: '/dashboard/prospecting' },
                { title: "Send 5 Emails", description: "You have drafted emails pending.", priority: 'Medium', link: '/dashboard/crm' }
            ],
            advanced_tasks: [
                { title: "Series A One-Pager", description: "Prepare for upcoming fundraising.", priority: 'Low', link: '/dashboard/investor-docs' }
            ],
            ai_recommendations: [
                { title: "Auto-Prospect 10 Leads", action_id: "auto-prospect", description: "Gemini can find 10 relevant leads instantly." },
                { title: "Analyze Competitors", action_id: "generate-battlecard", description: "Generate a battlecard for your top competitor." }
            ]
        };
    }

    return invokeEdgeFunction<TaskAdvisorResponse>('suggest-next-tasks');
};
