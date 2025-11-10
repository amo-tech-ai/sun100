import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { Slide } from '../data/decks';

// As per guidelines, API key must be from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Function Declarations ---

const getSuggestionsFunctionDeclaration: FunctionDeclaration = {
    name: 'getSuggestions',
    description: 'Generates three distinct suggestions for each category: improving slide content (copilot), image prompts, and research queries.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            copilotSuggestions: {
                type: Type.ARRAY,
                description: 'Three short, actionable prompts for the AI copilot to improve the slide.',
                items: { type: Type.STRING }
            },
            imageSuggestions: {
                type: Type.ARRAY,
                description: 'Three creative prompts to generate a relevant image for the slide.',
                items: { type: Type.STRING }
            },
            researchSuggestions: {
                type: Type.ARRAY,
                description: 'Three relevant web search queries to find data or context for the slide.',
                items: { type: Type.STRING }
            }
        },
        required: ['copilotSuggestions', 'imageSuggestions', 'researchSuggestions'],
    },
};

// --- API Functions ---

export const fetchAllSuggestions = async (slide: Slide): Promise<{ copilotSuggestions: string[]; imageSuggestions: string[]; researchSuggestions: string[] }> => {
    let prompt = `For a slide titled "${slide.title}" with content:\n${slide.content}\n\nGenerate 3 suggestions for each of the following categories: Copilot actions, image generation prompts, and research queries. The output must be a function call to 'getSuggestions'.`;

    // Add context-specific instructions based on the slide type
    switch (slide.type) {
        case 'solution':
            prompt += `\nSince this is a "solution" slide, Copilot suggestions should include "Rewrite to focus on benefits" and "Summarize into 3 core pillars". Image suggestions should include a prompt for a "How it Works" workflow diagram.`;
            break;
        case 'product':
             prompt += `\nSince this is a "product" slide, Copilot suggestions should include "Simplify technical language" and "Format as a numbered list".`;
            break;
        case 'traction':
             prompt += `\nSince this is a "traction" slide, Copilot suggestions should include "Highlight key metrics" and "Format as a testimonial".`;
            break;
         case 'competition':
             prompt += `\nSince this is a "competition" slide, Copilot suggestions should include "Create a 'Why We Win' summary", and Image suggestions should include a detailed prompt for a "2x2 competitive matrix diagram".`;
            break;
    }
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [getSuggestionsFunctionDeclaration] }],
            },
        });

        const functionCall = response.functionCalls?.[0];
        if (functionCall?.name === 'getSuggestions' && functionCall.args) {
            return functionCall.args as { copilotSuggestions: string[]; imageSuggestions: string[]; researchSuggestions: string[] };
        }
    } catch (error) {
        console.error("Error fetching suggestions:", error);
    }
    
    // Fallback in case of error or invalid response
    return {
        copilotSuggestions: ['Make it more concise', 'Add a statistic', 'Change the tone to be more formal'],
        imageSuggestions: ['A modern office space', 'Team collaborating on a project', 'Upward trending graph'],
        researchSuggestions: [`Market size for ${slide.title}`, `Competitors for ${slide.title}`, `Latest trends in ${slide.title}`]
    };
};
