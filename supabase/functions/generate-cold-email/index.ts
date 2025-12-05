
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI, Type } from "npm:@google/genai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const generateColdEmailFunctionDeclaration = {
    name: 'generateColdEmail',
    description: 'Generates a cold email draft based on the recipient profile.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            subject: { type: Type.STRING, description: 'A catchy, short subject line (under 60 chars).' },
            body: { type: Type.STRING, description: 'The email body content.' }
        },
        required: ['subject', 'body']
    }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { recipientName, companyName, context, tone } = await req.json();
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) throw new Error("API_KEY not set");

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      Write a cold email to ${recipientName} at ${companyName}.
      Context/Goal: ${context}
      Tone: ${tone}
      
      Keep it concise (under 150 words). Focus on value proposition.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ functionDeclarations: [generateColdEmailFunctionDeclaration] }]
      }
    });

    const call = response.functionCalls?.[0];
    
    if (call && call.name === 'generateColdEmail') {
       return new Response(JSON.stringify(call.args), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error("AI failed to generate email.");

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
