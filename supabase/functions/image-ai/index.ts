import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI } from "npm:@google/genai";

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, ...params } = await req.json();
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) throw new Error("API_KEY not set");

    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-3-pro-image-preview';
    const imageConfig = { aspectRatio: '16:9', imageSize: '2K' };

    let response;

    if (action === 'generate') {
         const prompt = params.customPrompt || `Create a professional, high-fidelity infographic style presentation slide image titled "${params.slideTitle}".
        Context: ${params.slideContent.substring(0, 200)}...
        Style: Modern business infographic, clean vector art, legible text labels if applicable, professional color palette (Deep Blue, Orange, White).
        Ensure text rendering is crisp and accurate.`;

        response = await ai.models.generateContent({
            model,
            contents: { parts: [{ text: prompt }] },
            config: { imageConfig }
        });

    } else if (action === 'edit') {
        response = await ai.models.generateContent({
            model,
            contents: {
                parts: [
                    { inlineData: { mimeType: params.mimeType, data: params.imageBytes } },
                    { text: params.prompt }
                ]
            },
            config: { imageConfig }
        });
    } else {
        throw new Error(`Unknown action: ${action}`);
    }

    let base64Image = '';
    if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                base64Image = part.inlineData.data;
                break;
            }
        }
    }
    
    if (!base64Image) throw new Error("No image generated.");

    return new Response(JSON.stringify({ base64Image }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});