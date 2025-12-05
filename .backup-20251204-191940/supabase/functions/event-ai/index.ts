import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI, Type } from "npm:@google/genai";

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// --- Prompts ---
const generateEventDescriptionFunctionDeclaration = {
    name: 'generateEventDescription',
    description: 'Generates a persuasive, exciting event description.',
    parameters: {
        type: Type.OBJECT,
        properties: { description: { type: Type.STRING } },
        required: ['description']
    }
};

const generateEventTitlesFunctionDeclaration = {
    name: 'generateEventTitles',
    description: 'Generates 3 creative event titles.',
    parameters: {
        type: Type.OBJECT,
        properties: { titles: { type: Type.ARRAY, items: { type: Type.STRING } } },
        required: ['titles']
    }
};

const suggestVenuesFunctionDeclaration = {
    name: 'suggestVenues',
    description: 'Suggests specific real-world venues.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            venues: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: { name: { type: Type.STRING }, reason: { type: Type.STRING }, mapLink: { type: Type.STRING } },
                    required: ['name', 'reason']
                }
            }
        },
        required: ['venues']
    }
};

const generateSocialMediaCopyFunctionDeclaration = {
    name: 'generateSocialMediaCopy',
    description: "Generates platform-optimized promotional copy.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            twitter: { type: Type.STRING },
            linkedin: { type: Type.STRING },
            instagram: { type: Type.STRING }
        },
        required: ['twitter', 'linkedin', 'instagram']
    }
};

const structureAgendaFunctionDeclaration = {
    name: 'structureAgenda',
    description: 'Organizes unstructured event details into an agenda.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            schedule: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: { time: { type: Type.STRING }, topic: { type: Type.STRING }, speaker: { type: Type.STRING } },
                    required: ['time', 'topic']
                }
            }
        },
        required: ['schedule']
    }
};

const generateBudgetFunctionDeclaration = {
    name: 'generateBudget',
    description: 'Allocates a budget into realistic line items.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            total: { type: Type.NUMBER },
            perHead: { type: Type.NUMBER },
            items: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: { category: { type: Type.STRING }, amount: { type: Type.NUMBER }, notes: { type: Type.STRING } },
                    required: ['category', 'amount', 'notes']
                }
            }
        },
        required: ['total', 'perHead', 'items']
    }
};

const generateEmailSequenceFunctionDeclaration = {
    name: 'generateEmailSequence',
    description: 'Creates a comprehensive 3-email sequence.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            invitation: { type: Type.OBJECT, properties: { subject: { type: Type.STRING }, body: { type: Type.STRING } }, required: ['subject', 'body'] },
            reminder: { type: Type.OBJECT, properties: { subject: { type: Type.STRING }, body: { type: Type.STRING } }, required: ['subject', 'body'] },
            followUp: { type: Type.OBJECT, properties: { subject: { type: Type.STRING }, body: { type: Type.STRING } }, required: ['subject', 'body'] }
        },
        required: ['invitation', 'reminder', 'followUp']
    }
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
    const model = 'gemini-3-pro-preview';

    let prompt = '';
    let toolConfig = {};

    switch (action) {
        case 'generateDescription':
             prompt = `Generate event description for "${params.details.title}" in ${params.details.location} on ${params.details.date}. Call 'generateEventDescription'.`;
             toolConfig = { tools: [{ functionDeclarations: [generateEventDescriptionFunctionDeclaration] }] };
             break;
        case 'generateTitles':
             prompt = `Suggest 3 creative titles for: "${params.baseTitle}". Call 'generateEventTitles'.`;
             toolConfig = { tools: [{ functionDeclarations: [generateEventTitlesFunctionDeclaration] }] };
             break;
        case 'suggestVenues':
             prompt = `Suggest 3 venues for a "${params.eventType}" in ${params.city}. Call 'suggestVenues'.`;
             toolConfig = { tools: [{ googleMaps: {} }, { functionDeclarations: [suggestVenuesFunctionDeclaration] }] };
             break;
        case 'generateSocialCopy':
             prompt = `Create social media posts for: ${JSON.stringify(params.details)}. Call 'generateSocialMediaCopy'.`;
             toolConfig = { tools: [{ functionDeclarations: [generateSocialMediaCopyFunctionDeclaration] }] };
             break;
        case 'structureAgenda':
             prompt = `Structure this agenda for ${params.eventDate}: "${params.rawAgenda}". Call 'structureAgenda'.`;
             toolConfig = { tools: [{ functionDeclarations: [structureAgendaFunctionDeclaration] }] };
             break;
        case 'estimateBudget':
             prompt = `Create a budget for ${params.attendees} people with $${params.totalBudget}. Context: ${params.eventContext}. Call 'generateBudget'.`;
             toolConfig = { tools: [{ functionDeclarations: [generateBudgetFunctionDeclaration] }] };
             break;
        case 'generateEmailSequence':
             prompt = `Write 3 emails for: ${JSON.stringify(params.details)}. Call 'generateEmailSequence'.`;
             toolConfig = { tools: [{ functionDeclarations: [generateEmailSequenceFunctionDeclaration] }] };
             break;
        default:
             throw new Error(`Unknown action: ${action}`);
    }

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: toolConfig
    });

    const call = response.functionCalls?.[0];
    if (call) {
        return new Response(JSON.stringify(call.args), {
           headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    throw new Error("AI failed to perform action.");

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});