
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleGenAI, Type } from "npm:@google/genai";

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const apiKey = Deno.env.get('GEMINI_API_KEY');

    if (!apiKey) throw new Error("GEMINI_API_KEY not set");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Authenticate User via JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error("Missing Authorization header");
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) throw new Error("Invalid User");

    // 2. Get Startup ID for User
    const { data: membership } = await supabase
      .from('team_members')
      .select('startup_id')
      .eq('user_id', user.id)
      .maybeSingle();
      
    if (!membership) throw new Error("User is not part of a startup");
    const startupId = membership.startup_id;

    // 3. Fetch Context from DB via RPC
    const userSupabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: context, error: ctxError } = await userSupabase.rpc('get_startup_context', { target_startup_id: startupId });
    
    if (ctxError) {
      console.error("RPC Error:", ctxError);
      throw new Error(`Context fetch failed: ${ctxError.message}`);
    }

    // 4. Setup Gemini 3
    const ai = new GoogleGenAI({ apiKey });
    
    const systemPrompt = `
      You are an expert Venture Partner and Startup Coach (AI).
      Your goal is to analyze raw startup data and synthesize it into strategic insights, alerts, and recommendations.
      
      **Startup Context:**
      ${JSON.stringify(context, null, 2)}

      **Objectives:**
      1. **Insights:** Identify positive momentum or concerning trends.
      2. **Alerts:** Flag urgent issues.
      3. **Recommendations:** Suggest concrete actions.
      4. **Match Score:** Estimate a 0-100 "Investor Readiness" score.

      **Deep Linking Rules:**
      For every insight or alert, you MUST provide a 'link' to the relevant internal tool based on the topic:
      - Financials, Burn Rate, Revenue -> '/dashboard/financial-overview'
      - Customers, Leads, Pipeline, Sales -> '/dashboard/crm'
      - Fundraising, Investors, Applications -> '/dashboard/funding-manager'
      - Pitch Deck, Slides -> '/pitch-decks'
      - Data Room, Documents -> '/dashboard/data-room'
      - Market Strategy -> '/dashboard/gtm-strategy'
      
      **Reasoning Rules:**
      - **Connect the Dots:** Explain *why* a metric matters.
      - **Be Direct:** Use executive-level language.
      - **External Validation:** Use Google Search to check current market conditions.
    `;

    // 5. Define Schema for Structured Output
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        insights: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, enum: ["positive", "negative", "neutral"] },
              category: { type: Type.STRING, enum: ["growth", "finance", "fundraising", "product"] },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              metric_highlight: { type: Type.STRING },
              link: { type: Type.STRING }
            },
            required: ["type", "category", "title", "description", "link"]
          }
        },
        alerts: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              severity: { type: Type.STRING, enum: ["high", "medium"] },
              message: { type: Type.STRING },
              subtext: { type: Type.STRING },
              link: { type: Type.STRING }
            },
            required: ["severity", "message", "link"]
          }
        },
        recommendations: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              action_id: { type: Type.STRING },
              label: { type: Type.STRING },
              reason: { type: Type.STRING }
            },
            required: ["label", "reason"]
          }
        },
        match_score: { type: Type.NUMBER }
      },
      required: ["insights", "alerts", "recommendations", "match_score"]
    };

    // 6. Call Gemini
    const result = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: systemPrompt,
      config: {
        thinkingConfig: { thinkingBudget: 2048 },
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: responseSchema
      }
    });

    const payload = JSON.parse(result.text!);

    // 7. Save Result to DB (Upsert)
    const { error: upsertError } = await supabase
      .from('ai_coach_insights')
      .upsert({
        startup_id: startupId,
        payload: payload,
        updated_at: new Date().toISOString()
      }, { onConflict: 'startup_id' });

    if (upsertError) {
      console.error("DB Upsert Error:", upsertError);
      throw upsertError;
    }

    return new Response(JSON.stringify(payload), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Edge Function Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
