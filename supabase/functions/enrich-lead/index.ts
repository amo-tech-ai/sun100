
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
    const { lead_id, force_refresh } = await req.json();
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) throw new Error("API_KEY not set");

    // 1. Fetch Lead Data (Join with Account)
    const { data: lead, error: leadError } = await supabase
      .from('crm_contacts')
      .select('*, crm_accounts(*)')
      .eq('id', lead_id)
      .single();

    if (leadError || !lead) throw new Error("Lead not found");

    // 2. Check Cache (if force_refresh is false)
    if (!force_refresh && lead.crm_accounts?.last_enriched_at) {
        const lastEnriched = new Date(lead.crm_accounts.last_enriched_at);
        const now = new Date();
        const diffDays = (now.getTime() - lastEnriched.getTime()) / (1000 * 3600 * 24);
        
        if (diffDays < 7) {
             const { data: existing } = await supabase
                .from('crm_lead_enrichment')
                .select('*')
                .eq('lead_id', lead_id)
                .single();
             if (existing) return new Response(JSON.stringify(existing), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
    }

    // 3. Call Gemini with Search Grounding
    const ai = new GoogleGenAI({ apiKey });
    const companyName = lead.crm_accounts?.name || lead.company_name || "";
    const domain = lead.crm_accounts?.domain || lead.crm_accounts?.website_url || "";
    const personName = `${lead.first_name} ${lead.last_name}`;
    
    if (!companyName) throw new Error("Company name is required for enrichment.");

    const prompt = `
      Research the company "${companyName}" ${domain ? `(${domain})` : ''} and the person "${personName}".
      
      Use Google Search to find:
      1. CEO Name and their LinkedIn URL.
      2. Company LinkedIn URL.
      3. Recent news (last 6 months).
      4. Funding history.
      5. Hiring trends (growing/shrinking).
      6. Assign a "Market Presence Score" (0-100) based on news/search volume.
      7. Write a concise summary of the company.
    `;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            ceo_name: { type: Type.STRING },
            ceo_linkedin: { type: Type.STRING },
            linkedin_company_url: { type: Type.STRING },
            recent_news: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: {type: Type.STRING}, url: {type: Type.STRING}, source: {type: Type.STRING}, published_at: {type: Type.STRING} } } },
            funding_history: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { round: {type: Type.STRING}, amount: {type: Type.STRING}, date: {type: Type.STRING}, investors: {type: Type.STRING} } } },
            hiring_trends: { type: Type.OBJECT, properties: { trend: { type: Type.STRING, enum: ['up', 'flat', 'down']}, roles: { type: Type.ARRAY, items: { type: Type.STRING }} } },
            market_presence_score: { type: Type.INTEGER },
            gemini_summary: { type: Type.STRING },
        },
        required: ['ceo_name', 'market_presence_score', 'gemini_summary']
    };

    const result = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: responseSchema
      }
    });

    const enrichmentData = JSON.parse(result.text!);

    // 4. Upsert Data
    const { data: savedEnrichment, error: saveError } = await supabase
        .from('crm_lead_enrichment')
        .upsert({
            lead_id: lead_id,
            company_id: lead.account_id,
            ...enrichmentData,
            updated_at: new Date().toISOString()
        })
        .select()
        .single();
    
    if (saveError) {
        console.error("Save Error:", saveError);
        throw saveError;
    }

    // Update Account Timestamp
    if (lead.account_id) {
        await supabase.from('crm_accounts').update({ last_enriched_at: new Date().toISOString() }).eq('id', lead.account_id);
    }

    return new Response(JSON.stringify(savedEnrichment), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
