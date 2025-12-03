import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI, Type } from "npm:@google/genai";

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const generateDeckOutlineFunctionDeclaration = {
    name: 'generateDeckOutline',
    description: 'Generates a strategic, investor-ready 10-slide pitch deck outline tailored to the specific startup stage and industry.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: 'A professional, catchy title for the pitch deck.' },
            slides: {
                type: Type.ARRAY,
                description: 'An array of 10 slide objects forming a cohesive narrative arc.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: 'The headline of the slide.' },
                        content: { type: Type.STRING, description: 'The slide body content, concise and impact-oriented, with bullet points separated by newlines.' },
                        imageUrl: { type: Type.STRING, description: 'A highly detailed, style-specific image generation prompt for the slide visual.' },
                        type: { type: Type.STRING, description: "The specific category of the slide (e.g., 'problem', 'solution', 'traction')." }
                    },
                    required: ['title', 'content', 'imageUrl', 'type']
                }
            }
        },
        required: ['title', 'slides']
    }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { businessContext, companyDetails, deckType, theme } = await req.json();
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) throw new Error("API_KEY not set");

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
        You are a ruthless Venture Capital Analyst and expert storyteller. 
        Your goal is to create a ${deckType} that secures funding.
        
        **Startup Context:**
        ${businessContext}
        
        ${companyDetails ? `**Company Details:**
        Name: ${companyDetails.name}
        Industry: ${companyDetails.industry}
        Stage: ${companyDetails.stage}
        Revenue Model: ${companyDetails.revenueModel}
        Traction: ${companyDetails.traction}
        Team Size: ${companyDetails.teamSize}
        ` : ''}
        
        **Strategic Instructions:**
        1. **Actionable Insights Only:** Avoid generic fluff like "We are revolutionizing the world." Use concrete statements like "Reduces processing time by 40%."
        2. **Visual Logic:** Generate highly detailed image prompts that visualize the concept, avoiding generic stock photo descriptions.
        3. **Traction Focus:** For the 'Traction' slide, explicitly extract and highlight key metrics (Revenue, Users, Growth, CAC, LTV) from the context. If exact numbers aren't provided, suggest realistic placeholder metrics based on the ${companyDetails?.stage || 'Seed'} stage.
        4. **Narrative Flow:** Ensure the deck follows a logical arc: Hook -> Problem -> Solution -> Evidence (Traction) -> Market -> Ask.
        
        **Theme:** ${theme}
        
        Use the 'generateDeckOutline' function to return the structured data.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
            tools: [{ functionDeclarations: [generateDeckOutlineFunctionDeclaration] }],
            thinkingConfig: { thinkingBudget: 2048 }
        }
    });

    const functionCall = response.functionCalls?.[0];

    if (functionCall?.name === 'generateDeckOutline' && functionCall.args) {
         const generatedDeck = {
             id: `deck-${Date.now()}`,
             title: functionCall.args.title,
             template: theme,
             slides: (functionCall.args.slides as any[]).map((s, i) => ({
                 id: `slide-${Date.now()}-${i}`,
                 position: i,
                 ...s
             }))
         };
         
         return new Response(JSON.stringify({ generatedDeck }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
         });
    }
    
    throw new Error("AI failed to generate a valid deck structure.");

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});