
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
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) throw new Error("GEMINI_API_KEY not set");

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      Analyze this list of CRM accounts and generate 3 high-level strategic insights.
      Focus on churn risks (e.g. inactive high MRR accounts), upsell opportunities, or general health trends.
      
      Account Summary:
      ${JSON.stringify(accounts, null, 2)}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
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
