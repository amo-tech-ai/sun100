import { GoogleGenAI } from '@google/genai';
import { Deck, Slide } from '../../data/decks';
import { generateDeckOutlineFunctionDeclaration, createRoadmapContentFunctionDeclaration } from './prompts';
import { generateSlideImage } from './image';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
};

export const generateFullDeck = async ({ text, urls }: { text?: string; urls?: string[] }): Promise<Omit<Deck, 'id'>> => {
    const contextParts: string[] = [];
    if (text?.trim()) {
        contextParts.push(`the following business description: "${text.trim()}"`);
    }
    if (urls && urls.length > 0) {
        contextParts.push(`information from these websites: ${urls.join(', ')}`);
    }
    if (contextParts.length === 0) {
        throw new Error("No context provided for deck generation.");
    }
    const context = `For context, use ${contextParts.join(' and ')}.`;

    const prompt = `Based on the provided context, generate a complete 10-slide pitch deck using the 'generateDeckOutline' function.
${context}
The deck should follow a standard pitch deck structure (Problem, Solution, Market, etc.). For each slide, provide a title, content, a descriptive image prompt, and a slide 'type'.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [generateDeckOutlineFunctionDeclaration] }],
            },
        });

        const functionCall = response.functionCalls?.[0];
        if (functionCall?.name === 'generateDeckOutline' && functionCall.args) {
            const deckData = functionCall.args;
            if (typeof deckData.title === 'string' && Array.isArray(deckData.slides)) {
                const newDeck: Omit<Deck, 'id'> = {
                    title: deckData.title,
                    template: 'default',
                    slides: (deckData.slides as Omit<Slide, 'id'>[]).map(s => ({ ...s, id: `slide-${uuidv4()}` })),
                };
                return newDeck;
            }
        }
        throw new Error("The AI did not generate a deck outline as expected.");
    } catch (error) {
        console.error("Error generating full deck:", error);
        throw new Error("Failed to generate the pitch deck. The AI model may be overloaded.");
    }
};

export const generateRoadmapSlide = async (companyContext: string): Promise<{ slide: Slide }> => {
    try {
        const textPrompt = `Based on the company context "${companyContext}", generate four key roadmap milestones using the 'createRoadmapContent' function.`;
        const textResponse = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: textPrompt,
            config: {
                tools: [{ functionDeclarations: [createRoadmapContentFunctionDeclaration] }],
            },
        });

        const functionCall = textResponse.functionCalls?.[0];
        if (!functionCall || functionCall.name !== 'createRoadmapContent' || !functionCall.args?.milestones) {
            throw new Error("AI did not generate roadmap milestones.");
        }
        
        const milestones = functionCall.args.milestones as string[];
        const imagePrompt = `A minimalist timeline roadmap with four nodes labeled: "${milestones.join('", "')}".`;

        const imageResponse = await generateSlideImage("Roadmap", milestones.join('\n'), imagePrompt);
        
        return {
            slide: {
                id: `slide-${uuidv4()}`,
                title: "Our Roadmap",
                content: milestones.join('\n'),
                imageUrl: `data:image/png;base64,${imageResponse.base64Image}`,
                type: 'roadmap',
            }
        };
    } catch (error) {
        console.error("Error generating roadmap slide:", error);
        throw new Error("Failed to generate roadmap slide.");
    }
};