
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

const generateSalesDeckFunctionDeclaration = {
    name: 'generateSalesDeck',
    description: 'Generates a persuasive sales presentation using the "Hook-Villain-Hero" narrative framework.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: 'The main title of the sales deck.' },
            slides: {
                type: Type.ARRAY,
                description: 'An array of slides following the sales narrative.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: 'The punchy headline for the slide.' },
                        content: { type: Type.STRING, description: 'Persuasive copy using sales psychology. Concise bullets.' },
                        imageUrl: { type: Type.STRING, description: 'Visual prompt for the slide (e.g. "A customer struggling with old tech").' },
                        type: { type: Type.STRING, enum: ['hook', 'villain', 'hero', 'proof', 'ask', 'generic'], description: 'The narrative role of this slide.' }
                    },
                    required: ['title', 'content', 'imageUrl', 'type']
                }
            }
        },
        required: ['title', 'slides']
    }
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { businessContext, companyDetails, deckType, theme } = await req.json();
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!apiKey) {
        console.error("Error: GEMINI_API_KEY is not set in Edge Function secrets.");
        throw new Error("Server configuration error: API Key missing.");
    }

    const ai = new GoogleGenAI({ apiKey });
    const isSalesDeck = deckType === 'Sales Deck';

    let prompt = '';
    let toolConfig = {};
    let targetFunction = '';

    if (isSalesDeck) {
        targetFunction = 'generateSalesDeck';
        toolConfig = { tools: [{ functionDeclarations: [generateSalesDeckFunctionDeclaration] }] };
        prompt = `
            You are a world-class Sales Engineer and Copywriter.
            Your goal is to create a persuasive Sales Deck that closes deals.
            
            **Product/Context:**
            ${businessContext}
            
            **Target Audience:** ${companyDetails?.targetAudience || 'Potential Customers'}
            
            **Structure (Hook-Villain-Hero):**
            1. **Hook:** Grab attention immediately.
            2. **Villain:** Personify the problem/pain point.
            3. **Hero:** Introduce the product as the savior.
            4. **Proof:** Case studies/metrics.
            5. **Ask:** Clear call to action.
            
            **Theme:** ${theme}
            
            Call 'generateSalesDeck' to return the structure.
        `;
    } else {
        targetFunction = 'generateDeckOutline';
        toolConfig = { 
            tools: [{ functionDeclarations: [generateDeckOutlineFunctionDeclaration] }],
            thinkingConfig: { thinkingBudget: 2048 } 
        };
        prompt = `
            You are a ruthless Venture Capital Analyst and expert storyteller. 
            Your goal is to create a ${deckType || 'Investor Pitch'} that secures funding.
            
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
            1. **Actionable Insights Only:** Avoid generic fluff. Use concrete statements.
            2. **Visual Logic:** Generate highly detailed image prompts.
            3. **Traction Focus:** Extract and highlight key metrics.
            4. **Narrative Flow:** Hook -> Problem -> Solution -> Evidence -> Market -> Ask.
            5. **Problem Slide:** Be specific about the pain point friction.
            6. **Solution Slide:** Map features directly to pain points.
            
            **Theme:** ${theme}
            
            Call 'generateDeckOutline' to return the structured data.
        `;
    }

    console.log(`Generating ${deckType} with model: gemini-3-pro-preview`);

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: toolConfig
    });

    const functionCall = response.functionCalls?.[0];

    if (functionCall?.name === targetFunction && functionCall.args) {
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
         
         console.log("Deck generated successfully");

         return new Response(JSON.stringify({ generatedDeck }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
         });
    }
    
    console.error("AI did not return a valid function call. Response:", JSON.stringify(response));
    throw new Error("AI failed to generate a valid deck structure.");

  } catch (error) {
    console.error("Edge Function Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
