
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI, Type } from "npm:@google/genai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const findLeadsFunctionDeclaration = {
    name: 'findLeads',
    description: 'Finds potential B2B leads or companies based on search criteria.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            leads: {
                type: Type.ARRAY,
                description: 'A list of found companies matching the criteria.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING, description: 'Company name.' },
                        website: { type: Type.STRING, description: 'Company website URL.' },
                        description: { type: Type.STRING, description: 'Brief description of what they do.' },
                        location: { type: Type.STRING, description: 'Headquarters location.' },
                        industry: { type: Type.STRING, description: 'Primary industry.' },
                        fitScore: { type: Type.NUMBER, description: 'Match score (0-100) based on the user criteria.' },
                        reason: { type: Type.STRING, description: 'Why this company is a good match.' }
                    },
                    required: ['name', 'description', 'fitScore', 'reason']
                }
            }
        },
        required: ['leads']
    }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { criteria } = await req.json();
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) throw new Error("API_KEY not set");

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      Find 5-10 companies that match the following criteria:
      - Industry: ${criteria.industry}
      - Location: ${criteria.location}
      - Stage: ${criteria.stage || 'Any'}
      - Additional Keywords: ${criteria.keywords ? criteria.keywords.join(', ') : 'None'}
      
      Use Google Search to find real companies. Provide their website and a brief description.
      Calculate a 'fitScore' (0-100) based on how well they match the criteria.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }, { functionDeclarations: [findLeadsFunctionDeclaration] }]
      }
    });

    const call = response.functionCalls?.[0];
    
    if (call && call.name === 'findLeads') {
       return new Response(JSON.stringify(call.args), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error("AI failed to find leads.");

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
