
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI, Type } from "npm:@google/genai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const analyzeAccountHealthFunctionDeclaration = {
    name: 'analyzeAccountHealth',
    description: 'Analyzes the health of a customer account based on interactions and data.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            score: { type: Type.NUMBER, description: '0-100 health score.' },
            status: { type: Type.STRING, description: "'Healthy', 'Neutral', or 'At Risk'." },
            factors: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Key factors influencing the score.' },
            recommendation: { type: Type.STRING, description: 'Actionable advice to improve health.' }
        },
        required: ['score', 'status', 'factors', 'recommendation']
    }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { account } = await req.json();
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) throw new Error("API_KEY not set");

    const ai = new GoogleGenAI({ apiKey });

    // Context for Gemini
    const prompt = `
      Analyze the health of this customer account.
      
      Account Data:
      - Name: ${account.name}
      - Segment: ${account.segment}
      - Status: ${account.status}
      - MRR: $${account.mrr}
      - Last Interaction: ${account.lastInteraction}
      
      Determine a health score (0-100), status, contributing factors, and a recommendation.
      For example, if status is 'Churned' or 'Trial' with low interaction, score should be low.
      If MRR is high and interaction is recent, score should be high.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ functionDeclarations: [analyzeAccountHealthFunctionDeclaration] }]
      }
    });

    const call = response.functionCalls?.[0];
    
    if (call && call.name === 'analyzeAccountHealth') {
       return new Response(JSON.stringify(call.args), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error("AI failed to generate structured health analysis.");

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
