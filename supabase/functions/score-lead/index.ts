
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleGenAI, Type } from "npm:@google/genai";

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { lead_id } = await req.json();
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) throw new Error("API_KEY not set");

    // 1. Fetch Context
    const { data: lead } = await supabase.from('crm_contacts').select('*, crm_accounts(*)').eq('id', lead_id).single();
    const { data: enrichment } = await supabase.from('crm_lead_enrichment').select('*').eq('lead_id', lead_id).single();
    
    if (!lead) throw new Error("Lead not found");

    // 2. Build Context
    const context = {
        lead: { title: lead.title || lead.role, name: `${lead.first_name} ${lead.last_name}` },
        company: { 
            name: lead.crm_accounts?.name, 
            segment: lead.crm_accounts?.segment, 
            mrr: lead.crm_accounts?.mrr 
        },
        enrichment: enrichment ? {
            funding: enrichment.funding_history,
            hiring: enrichment.hiring_trends,
            news: enrichment.recent_news?.map((n:any) => n.title),
            market_score: enrichment.market_presence_score
        } : "Enrichment data missing"
    };

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Analyze this B2B lead to determine fit, intent, and risk.
      
      Target Profile (ICP): B2B SaaS companies, Series A+, Growing Engineering/Sales teams.
      
      Context:
      ${JSON.stringify(context, null, 2)}
      
      Reasoning Steps:
      1. Evaluate Industry/Size fit.
      2. Look for Growth Signals (Funding, Hiring).
      3. Identify Risks (Layoffs, bad news).
      4. Determine a confidence score (0-100).
    `;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            overall_score: { type: Type.INTEGER },
            confidence: { type: Type.NUMBER },
            status_band: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
            stage_recommendation: { type: Type.STRING },
            fit_breakdown: {
                type: Type.OBJECT,
                properties: {
                    industry_fit: { type: Type.INTEGER },
                    company_size_fit: { type: Type.INTEGER },
                    budget_fit: { type: Type.INTEGER },
                    problem_fit: { type: Type.INTEGER },
                    engagement_fit: { type: Type.INTEGER },
                    search_trend_score: { type: Type.INTEGER }
                }
            },
            risk_score: { type: Type.INTEGER },
            ai_findings: { type: Type.ARRAY, items: { type: Type.STRING } },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommended_next_actions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['overall_score', 'status_band', 'fit_breakdown']
    };

    const result = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 1024 },
        responseMimeType: "application/json",
        responseSchema: responseSchema
      }
    });

    const scoreData = JSON.parse(result.text!);

    // 3. Save Score
    const { data: savedScore, error: saveError } = await supabase
        .from('crm_lead_scores')
        .insert({
            lead_id: lead_id,
            overall_score: scoreData.overall_score,
            confidence: scoreData.confidence,
            status_band: scoreData.status_band,
            stage_recommendation: scoreData.stage_recommendation,
            industry_fit: scoreData.fit_breakdown.industry_fit,
            company_size_fit: scoreData.fit_breakdown.company_size_fit,
            budget_fit: scoreData.fit_breakdown.budget_fit,
            problem_fit: scoreData.fit_breakdown.problem_fit,
            engagement_fit: scoreData.fit_breakdown.engagement_fit,
            search_trend_score: scoreData.fit_breakdown.search_trend_score,
            risk_score: scoreData.risk_score,
            ai_findings: scoreData.ai_findings,
            risks: scoreData.risks,
            recommended_next_actions: scoreData.recommended_next_actions,
            model_version: "gemini-3-pro-preview"
        })
        .select()
        .single();

    if (saveError) throw saveError;

    return new Response(JSON.stringify(savedScore), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
