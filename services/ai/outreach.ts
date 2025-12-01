
import { invokeEdgeFunction } from '../edgeFunctionService';
import { EmailDraft } from './types';
import { supabase } from '../../lib/supabaseClient';

interface ColdEmailParams {
    recipientName: string;
    companyName: string;
    context: string;
    tone: 'Professional' | 'Friendly' | 'Direct';
}

/**
 * Generates a personalized cold email using Gemini.
 */
export const generateColdEmail = async (params: ColdEmailParams): Promise<EmailDraft> => {
    // Mock Fallback
    if (!(supabase as any).realtime) {
        await new Promise(r => setTimeout(r, 1500));
        return {
            subject: `Quick question about ${params.companyName}`,
            body: `Hi ${params.recipientName},\n\nI've been following ${params.companyName} and noticed your recent growth. I wanted to reach out because...\n\n[AI Generated Content based on: ${params.context}]\n\nBest,\n[Your Name]`
        };
    }

    return invokeEdgeFunction<EmailDraft>('generate-cold-email', { ...params });
};
