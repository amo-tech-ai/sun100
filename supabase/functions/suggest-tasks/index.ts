
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleGenAI, Type } from "npm:@google/genai";

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const suggestTasksFunctionDeclaration = {
    name: 'suggestTasks',
    description: 'Suggests prioritized tasks based on interaction history and account status.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            tasks: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "Actionable task title" },
                        reason: { type: Type.STRING, description: "Why this task is suggested" },
                        priority: { type: Type.STRING, enum: ['low', 'medium', 'high', 'urgent'] },
                        due_in_days: { type: Type.NUMBER, description: "Suggested due date offset in days" }
                    },
                    required: ['title', 'reason', 'priority', 'due_in_days']
                }
            }
        },
        required: ['tasks']
    }
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { account_id } = await req.json();
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) throw new Error("API_KEY not set");

    // 1. Fetch Account Context
    const { data: account } = await supabase
        .from('crm_accounts')
        .select('name, status, mrr, health_score, last_interaction_at, renewal_date')
        .eq('id', account_id)
        .single();

    if (!account) throw new Error("Account not found");

    // 2. Fetch Recent Interactions
    const { data: interactions } = await supabase
        .from('crm_interactions')
        .select('type, summary, date, sentiment')
        .eq('account_id', account_id)
        .order('date', { ascending: false })
        .limit(10);

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      Act as a proactive Customer Success Manager. Analyze this account and interaction history to suggest exactly 3 high-impact tasks.
      
      Account Context:
      - Name: ${account.name}
      - Status: ${account.status}
      - Health Score: ${account.health_score}/100
      - Renewal Date: ${account.renewal_date}
      
      Interaction History:
      ${JSON.stringify(interactions)}
      
      Thinking Process:
      1. **Risk Detection:** Is the health score low? Are there negative sentiments in recent interactions? If so, suggest immediate intervention.
      2. **Opportunity Spotting:** Is there high engagement or positive sentiment? Suggest an upsell or referral request.
      3. **Lifecycle Management:** Is the renewal date approaching (within 90 days)? Suggest renewal discussions.
      4. **Stagnation:** Has it been too long since the last interaction? Suggest a check-in.
      
      Generate 3 tasks that drive the relationship forward.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        tools: [{ functionDeclarations: [suggestTasksFunctionDeclaration] }]
      }
    });

    const call = response.functionCalls?.[0];

    if (call && call.name === 'suggestTasks') {
       return new Response(JSON.stringify({ tasks: call.args.tasks }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error("AI failed to suggest tasks.");

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
