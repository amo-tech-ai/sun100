
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
    // 1. Setup Context
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) throw new Error("GEMINI_API_KEY not set");

    // 2. Auth check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error("Missing Authorization header");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) throw new Error("Invalid User");

    // 3. Get Startup ID
    const { data: membership } = await supabaseClient
      .from('team_members')
      .select('startup_id')
      .eq('user_id', user.id)
      .single();
      
    if (!membership) throw new Error("User is not part of a startup");
    const startupId = membership.startup_id;

    // 4. Fetch Context from DB via RPC
    const { data: context, error: ctxError } = await supabaseClient.rpc('get_startup_context', { target_startup_id: startupId });
    if (ctxError) throw new Error(`Context fetch failed: ${ctxError.message}`);

    // 5. Setup Gemini 3
    const ai = new GoogleGenAI({ apiKey });
    
    const systemPrompt = `
      You are an expert Venture Partner and Startup Coach.
      Your goal is to analyze raw startup data and synthesize it into strategic insights.
      
      **Context Data:**
      ${JSON.stringify(context)}

      **Reasoning Rules:**
      1. **Connect the Dots:** Don't just report numbers. Explain *why* (e.g. 'Revenue up, but churn up -> Fix bucket').
      2. **Be Direct:** Executive-level language.
      3. **Prioritize:** Only report significant deviations.
      4. **External Context:** Use Google Search to check market trends against these metrics.
    `;

    // 6. Define Schema for Structured Output
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
              metric_highlight: { type: Type.STRING }
            },
            required: ["type", "category", "title", "description"]
          }
        },
        alerts: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              severity: { type: Type.STRING, enum: ["high", "medium"] },
              message: { type: Type.STRING },
              subtext: { type: Type.STRING }
            },
            required: ["severity", "message"]
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

    // 7. Call Gemini
    const result = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: systemPrompt,
      config: {
        thinkingConfig: { thinkingBudget: 2048 }, // Enable Thinking
        tools: [{ googleSearch: {} }],           // Enable Search Grounding
        responseMimeType: "application/json",
        responseSchema: responseSchema
      }
    });

    const payload = JSON.parse(result.text!);

    // 8. Save Result to DB
    const { error: upsertError } = await supabaseClient
      .from('ai_coach_insights')
      .upsert({
        startup_id: startupId,
        payload: payload,
        updated_at: new Date().toISOString()
      });

    if (upsertError) throw upsertError;

    return new Response(JSON.stringify(payload), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});