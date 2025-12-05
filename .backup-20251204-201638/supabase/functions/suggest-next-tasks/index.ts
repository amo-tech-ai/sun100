
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
    // 1. Setup Clients
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) throw new Error("API_KEY not set");

    // 2. Get User Context
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error("Missing Authorization header");
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) throw new Error("Invalid User");

    // 3. Fetch Data Context
    // Get Startup ID
    const { data: membership } = await supabase.from('team_members').select('startup_id').eq('user_id', user.id).single();
    if (!membership) throw new Error("No startup found");
    const startupId = membership.startup_id;

    // Parallel Fetch
    const [profileRes, decksRes, crmRes, metricsRes] = await Promise.all([
        supabase.from('startups').select('*').eq('id', startupId).single(),
        supabase.from('decks').select('id, updated_at').eq('startup_id', startupId),
        supabase.from('crm_accounts').select('id, status, last_interaction_at').eq('startup_id', startupId),
        supabase.from('financial_metrics').select('*').eq('startup_id', startupId).order('month', { ascending: false }).limit(1).single()
    ]);

    const context = {
        profile: {
            stage: profileRes.data?.stage || 'Unknown',
            industry: profileRes.data?.industry || 'Unknown',
            completeness: [profileRes.data?.tagline, profileRes.data?.description].filter(Boolean).length / 2
        },
        assets: {
            deck_count: decksRes.data?.length || 0,
            last_deck_update: decksRes.data?.[0]?.updated_at
        },
        crm: {
            total_leads: crmRes.data?.length || 0,
            active_leads: crmRes.data?.filter((c: any) => c.status === 'Active').length || 0,
        },
        financials: {
            burn_rate: metricsRes.data?.burn_rate || 0,
            runway: metricsRes.data?.burn_rate > 0 ? (metricsRes.data?.cash_balance / metricsRes.data?.burn_rate).toFixed(1) : 'Unknown'
        }
    };

    // 4. Call Gemini 3
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      You are a Strategic Startup Advisor (AI Co-Founder). Analyze the following startup state deepy and suggest a prioritized roadmap.
      
      Startup Context:
      ${JSON.stringify(context, null, 2)}
      
      Thinking Process:
      1. **Gap Analysis:** Identify critical missing pieces (e.g. Seed stage but no deck? High burn but no leads?).
      2. **Stage Alignment:** Ensure tasks align with the '${context.profile.stage}' stage goals (e.g., Product-Market Fit vs. Scaling).
      3. **Leverage:** Identify high-leverage activities that move the needle on runway or revenue.
      4. **Automation:** Where can our AI agents (Prospecting, Battlecards, Docs) save time?
      
      Return a structured strategic plan.
    `;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            analysis_summary: { type: Type.STRING },
            core_tasks: { 
                type: Type.ARRAY, 
                items: { type: Type.OBJECT, properties: { title: {type: Type.STRING}, description: {type: Type.STRING}, priority: {type: Type.STRING, enum: ['High','Medium','Low']}, link: {type: Type.STRING} }, required: ['title', 'description', 'priority'] }
            },
            growth_tasks: { 
                type: Type.ARRAY, 
                items: { type: Type.OBJECT, properties: { title: {type: Type.STRING}, description: {type: Type.STRING}, priority: {type: Type.STRING, enum: ['High','Medium','Low']}, link: {type: Type.STRING} }, required: ['title', 'description', 'priority'] }
            },
            advanced_tasks: { 
                type: Type.ARRAY, 
                items: { type: Type.OBJECT, properties: { title: {type: Type.STRING}, description: {type: Type.STRING}, priority: {type: Type.STRING, enum: ['High','Medium','Low']}, link: {type: Type.STRING} }, required: ['title', 'description', 'priority'] }
            },
            ai_recommendations: {
                type: Type.ARRAY,
                items: { type: Type.OBJECT, properties: { title: {type: Type.STRING}, action_id: {type: Type.STRING, enum: ['auto-prospect', 'generate-battlecard', 'generate-update', 'analyze-deck']}, description: {type: Type.STRING} }, required: ['title', 'action_id', 'description'] }
            }
        },
        required: ['analysis_summary', 'core_tasks', 'growth_tasks', 'ai_recommendations']
    };

    const result = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: responseSchema
      }
    });

    const data = JSON.parse(result.text!);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
