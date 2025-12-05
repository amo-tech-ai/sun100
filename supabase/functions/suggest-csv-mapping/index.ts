
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI, Type } from "npm:@google/genai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const suggestMappingFunctionDeclaration = {
    name: 'suggestMapping',
    description: 'Maps CSV headers to CRM fields.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            mapping: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "The CSV header corresponding to Customer/Company Name" },
                    email: { type: Type.STRING, description: "The CSV header corresponding to Email" },
                    website: { type: Type.STRING, description: "The CSV header corresponding to Website/Domain" },
                    role: { type: Type.STRING, description: "The CSV header corresponding to Job Title/Role" },
                    linkedin: { type: Type.STRING, description: "The CSV header corresponding to LinkedIn URL" },
                    segment: { type: Type.STRING, description: "The CSV header corresponding to Segment/Size" }
                },
                required: ['name']
            }
        },
        required: ['mapping']
    }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { headers } = await req.json();
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) throw new Error("API_KEY not set");

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      I have a CSV file with the following headers: ${JSON.stringify(headers)}.
      Map these headers to the following CRM fields: name (Company Name), email, website, role, linkedin, segment.
      If a field doesn't have a clear match, map it to null or omit it.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ functionDeclarations: [suggestMappingFunctionDeclaration] }]
      }
    });

    const call = response.functionCalls?.[0];
    
    if (call && call.name === 'suggestMapping') {
       return new Response(JSON.stringify(call.args), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error("AI failed to generate mapping.");

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
