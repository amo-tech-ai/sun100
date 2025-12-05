
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI, Type } from "npm:@google/genai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const analyzeDealScoreFunctionDeclaration = {
    name: 'analyzeDealScore',
    description: 'Scores a sales deal based on context and interaction history.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            score: { type: Type.NUMBER, description: '0-100 score representing probability of closing.' },
            reasoning: { type: Type.STRING, description: 'Explanation of the score based on signals.' }
        },
        required: ['score', 'reasoning']
    }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { deal, customer, interactions } = await req.json();
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API_KEY not set");

    const ai = new GoogleGenAI({ apiKey });

    // Summarize interactions for the prompt
    const recentInteractions = interactions && interactions.length > 0 
        ? interactions.slice(0, 5).map((i: any) => `- [${i.date}] ${i.type} (${i.sentiment || 'Neutral'}): ${i.summary}`).join('\n')
        : "No recent interactions logged.";

    // Context for Gemini
    const prompt = `
      Act as a Sales Operations Manager. Analyze this sales deal to predict the probability of closing (Deal Score).
      
      Deal Context:
      - Name: ${deal.name}
      - Value: ${deal.value}
      - Stage: ${deal.stage}
      
      Customer Health:
      - Name: ${customer.name}
      - Segment: ${customer.segment}
      - Health Score: ${customer.healthScore}
      
      Recent Interactions:
      ${recentInteractions}
      
      Scoring Logic:
      1. **Sentiment:** Positive recent interactions significantly boost the score. Negative or 'Ghosting' signals lower it.
      2. **Health:** High customer health implies higher likelihood of upsell/renewal.
      3. **Stage:** Later stages (Negotiation) naturally have higher probability, but adjust based on sentiment.
      
      Return a JSON with 'score' (0-100) and 'reasoning' (max 2 sentences).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ functionDeclarations: [analyzeDealScoreFunctionDeclaration] }]
      }
    });

    const call = response.functionCalls?.[0];
    
    if (call && call.name === 'analyzeDealScore') {
       return new Response(JSON.stringify(call.args), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error("AI failed to generate deal score.");

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
