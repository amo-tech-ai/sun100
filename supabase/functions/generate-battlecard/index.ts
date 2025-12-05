
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI, Type } from "npm:@google/genai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const generateBattlecardFunctionDeclaration = {
    name: 'generateBattlecard',
    description: 'Generates a competitor battlecard analyzing strengths, weaknesses, and sales tactics.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            competitors: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING, description: "Competitor Name" },
                        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                        pricing_model: { type: Type.STRING },
                        kill_points: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key arguments to win against them." }
                    },
                    required: ['name', 'strengths', 'weaknesses', 'pricing_model', 'kill_points']
                }
            },
            our_advantages: { type: Type.ARRAY, items: { type: Type.STRING } },
            objection_handling: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        objection: { type: Type.STRING },
                        counter: { type: Type.STRING }
                    },
                    required: ['objection', 'counter']
                }
            }
        },
        required: ['competitors', 'our_advantages', 'objection_handling']
    }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { companyName, website } = await req.json();
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) throw new Error("API_KEY not set");

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      Create a sales battlecard for selling against competitors of ${companyName} (${website}).
      
      1. Identify 2-3 likely direct competitors.
      2. Analyze their strengths and weaknesses relative to a modern, AI-first solution.
      3. Suggest specific "kill points" or arguments to win deals against them.
      4. List common objections a prospect might have and how to counter them.
      
      Use Google Search to find real pricing and feature data.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }, { functionDeclarations: [generateBattlecardFunctionDeclaration] }]
      }
    });

    const call = response.functionCalls?.[0];
    
    if (call && call.name === 'generateBattlecard') {
       return new Response(JSON.stringify(call.args), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error("AI failed to generate battlecard.");

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
