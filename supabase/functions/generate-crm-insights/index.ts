
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
      Analyze this list of CRM accounts and generate exactly 3 highly specific, actionable strategic insights.
      
      You must look for individual accounts in the data provided to generate these insights. Do not give generic advice like "Contact at-risk customers". Be specific.

      Priorities:
      1. **Interaction Gaps**: Find an account with a low health score or old 'lastInteraction'.
         - Insight Type: "risk"
         - Message: Explain why (e.g., "Acme Corp hasn't been contacted in 2 weeks and health is low.")
         - Action: "Follow up with [Account Name]"
      
      2. **Upsell Candidates**: Find an account with a high health score (>80) and significant MRR.
         - Insight Type: "opportunity"
         - Message: Highlighting positive signal (e.g., "Stark Ind is showing strong usage patterns.")
         - Action: "Upsell [Account Name]"

      3. **Urgent Status**: Find 'Trial' or 'Lead' status accounts.
         - Insight Type: "info"
         - Message: Suggest a closing action.
         - Action: "Close [Account Name]" or "Review [Account Name]"

      Return exactly 3 insights in the requested JSON structure.
      
      Account Summary:
      ${JSON.stringify(accounts, null, 2)}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
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
