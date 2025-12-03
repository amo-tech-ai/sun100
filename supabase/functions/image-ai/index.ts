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
    // Using Nano Banana Pro (Gemini 3 Pro Image) for high-fidelity generation and text rendering
    const model = 'gemini-3-pro-image-preview';
    const imageConfig = { aspectRatio: '16:9', imageSize: '2K' };

    let response;

    if (action === 'generate') {
         let prompt = params.customPrompt;
         
         if (!prompt) {
             // Infer visual concept from slide context if no prompt provided
             prompt = `Create a high-quality, professional presentation slide image.
            
            **Slide Context:**
            Title: "${params.slideTitle}"
            Content Summary: "${params.slideContent ? params.slideContent.substring(0, 300) : 'No content provided'}"
            
            **Visual Instructions:**
            1. Analyze the title and content to determine the slide's core concept (e.g., Growth, Team, Problem, Solution, Market).
            2. Generate a visual representation of this concept.
            3. **Style:** Modern, clean, corporate aesthetic. Use a color palette of Deep Blue, Orange (#E87C4D), and White.
            4. If the content implies data/metrics, create a stylized chart or graph.
            5. If the content implies people/team, generate professional avatars or a photorealistic team scene.
            6. If the content is abstract (e.g. "Vision"), use metaphorical imagery (e.g. horizon, lightbulb).
            7. Ensure high fidelity and crisp details. Any text rendered in the image must be legible and spelled correctly.`;
         } else {
             // Enhance user prompt with style guardrails
             if (!prompt.toLowerCase().includes('style')) {
                prompt = `${prompt} 
                Style: High-fidelity, professional pitch deck visual, modern, clean, vector-style or photorealistic as appropriate. Crisp details.`;
             }
         }

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
    
    if (!base64Image) throw new Error("No image generated. The model might have returned only text.");

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