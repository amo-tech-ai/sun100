
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI, Type } from "npm:@google/genai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const generateCRMInsightsFunctionDeclaration = {
    name: 'generateCRMInsights',
    description: 'Generates strategic insights for a CRM dashboard.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            insights: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        type: { type: Type.STRING, enum: ['risk', 'opportunity', 'info'] },
                        message: { type: Type.STRING },
                        action: { type: Type.STRING }
                    },
                    required: ['type', 'message', 'action']
                }
            }
        },
        required: ['insights']
    }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { accounts } = await req.json();
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API_KEY not set");

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      Act as a Revenue Operations (RevOps) Analyst. Analyze this list of CRM accounts to generate exactly 3 high-level strategic insights.
      
      Data Summary:
      ${JSON.stringify(accounts, null, 2)}
      
      Thinking Process:
      1. **Segmentation Analysis:** Look for patterns across segments (Enterprise vs SMB). Is one segment underperforming or at risk?
      2. **Churn Prevention:** Identify clusters of accounts with low health scores or stalled interactions.
      3. **Revenue Optimization:** Identify opportunities for upsells based on MRR and health.
      
      Prioritize insights that drive immediate revenue impact or risk mitigation. Do not just list facts; provide analysis.
      
      Output exactly 3 insights:
      1. Highest Priority Risk
      2. Highest Priority Opportunity
      3. Key Info / Trend
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        tools: [{ functionDeclarations: [generateCRMInsightsFunctionDeclaration] }]
      }
    });

    const call = response.functionCalls?.[0];
    
    if (call && call.name === 'generateCRMInsights') {
       return new Response(JSON.stringify(call.args), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error("AI failed to generate structured insights.");

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
