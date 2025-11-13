import { GoogleGenAI, GenerateContentResponse, Type, FunctionDeclaration, Modality } from '@google/genai';
import { Deck, Slide, ChartData, TableData } from '../data/decks';
import { templates } from '../styles/templates';

// The API key is retrieved from the environment variable `process.env.API_KEY`.
// This variable is assumed to be pre-configured in the execution environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// FIX: Implement a simple UUID generator to avoid external dependencies.
const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
};

// FIX: Define and export missing types used by DeckEditor and FounderProfile screens.
export interface ExtractedMetric {
  label: string;
  value: string;
}

export interface BioSummary {
    summary: string;
    highlights: string[];
}

export interface SlideAnalysis {
    clarity: { rating: 'Good' | 'Average' | 'Needs Improvement'; feedback: string };
    impact: { rating: 'Good' | 'Average' | 'Needs Improvement'; feedback: string };
    tone: { rating: 'Good' | 'Average' | 'Needs Improvement'; feedback: string };
}

export interface ResearchResult {
    summary: string;
    sources: { title: string; uri: string }[];
}

export interface VenueSuggestion {
    name: string;
    reason: string;
    mapLink?: string;
}

export interface SocialMediaCopy {
    twitter: string;
    linkedin: string;
    instagram: string;
}

export interface AgendaItem {
    time: string;
    topic: string;
    speaker?: string;
}

export interface StructuredAgenda {
    schedule: AgendaItem[];
}


// FIX: Implement and export the missing 'generateFullDeck' function.
export const generateFullDeck = async ({ text, urls }: { text?: string; urls?: string[] }): Promise<Deck> => {
    const model = 'gemini-2.5-pro';

    // Construct a comprehensive context string.
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
    
    const prompt = `Based on the provided business context, generate a complete 10-slide pitch deck for a startup.
${context}
The deck should follow a standard pitch deck structure (e.g., Problem, Solution, Market Size, Product, Traction, Team, Competition, Ask, etc.).
For each slide, provide a unique id, a short, impactful title, content with bullet points (each on a new line), and a suggested 'type' from this list: 'vision', 'problem', 'solution', 'market', 'product', 'traction', 'competition', 'team', 'ask', 'roadmap', 'generic'.
Also, suggest a descriptive prompt for an image that would visually represent the slide's content in the 'imageUrl' field.
Return the result as a single JSON object. Do not include markdown formatting like \`\`\`json.`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: 'A catchy title for the entire pitch deck.' },
            slides: {
                type: Type.ARRAY,
                description: 'An array of slide objects.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING, description: 'A unique identifier for the slide.' },
                        title: { type: Type.STRING, description: 'The title of the slide.' },
                        content: { type: Type.STRING, description: 'The content of the slide, with bullet points separated by newlines.' },
                        imageUrl: { type: Type.STRING, description: 'A descriptive prompt for an image to be generated for this slide.' },
                        type: { type: Type.STRING, description: "The type of slide (e.g., 'problem', 'solution')." }
                    },
                    required: ['id', 'title', 'content', 'imageUrl', 'type']
                }
            }
        },
        required: ['title', 'slides']
    };

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
            },
        });

        const deckData = JSON.parse(response.text);

        deckData.slides.forEach((slide: Slide) => {
            slide.id = `slide-${uuidv4()}`;
        });

        const newDeck: Deck = {
            id: `deck-${uuidv4()}`,
            title: deckData.title,
            template: 'default',
            slides: deckData.slides
        };
        return newDeck;

    } catch (error) {
        console.error("Error generating full deck:", error);
        throw new Error("Failed to generate the pitch deck. The AI model may be overloaded or the provided context is insufficient.");
    }
};

// FIX: Implement and export the missing 'generateSlideImage' function.
export const generateSlideImage = async (slideTitle: string, slideContent: string, customPrompt?: string): Promise<{ base64Image: string }> => {
    const model = 'gemini-2.5-flash-image';
    const text = customPrompt 
        ? customPrompt 
        : `Generate a visually appealing and professional image for a presentation slide. The slide title is "${slideTitle}" and the content is "${slideContent}". The image should be abstract or conceptual, suitable for a business presentation.`;
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: { parts: [{ text }] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
        if (imagePart?.inlineData?.data) {
            return { base64Image: imagePart.inlineData.data };
        }
        
        throw new Error("AI did not return an image.");
    } catch (error) {
        console.error("Error generating slide image:", error);
        throw new Error("Failed to generate image. Please try a different prompt.");
    }
};

// FIX: Implement and export the missing 'editSlideImage' function.
export const editSlideImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<{ base64Image: string }> => {
    const model = 'gemini-2.5-flash-image';
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: {
                parts: [
                    { inlineData: { data: base64ImageData, mimeType } },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
        if (imagePart?.inlineData?.data) {
            return { base64Image: imagePart.inlineData.data };
        }

        throw new Error("AI did not return an edited image.");
    } catch (error) {
        console.error("Error editing slide image:", error);
        throw new Error("Failed to edit image. The model may not have been able to apply the changes.");
    }
};

// FIX: Implement and export the missing 'modifySlideContent' function.
export const modifySlideContent = async (slideTitle: string, slideContent: string, instruction: string): Promise<{ newTitle: string; newContent: string }> => {
    const model = 'gemini-2.5-pro';
    const prompt = `Given the following slide content:
Title: "${slideTitle}"
Content:
${slideContent}

Apply this instruction: "${instruction}".

Return ONLY a JSON object with the new title and content. The content should have bullet points separated by newlines. Do not include markdown formatting.
Example format: {"newTitle": "New Title", "newContent": "Bullet 1\\nBullet 2"}`;
    
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            newTitle: { type: Type.STRING },
            newContent: { type: Type.STRING },
        },
        required: ['newTitle', 'newContent'],
    };

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema
            },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error modifying slide content:", error);
        throw new Error("Failed to modify content.");
    }
};

// FIX: Implement and export the missing 'analyzeSlide' function.
export const analyzeSlide = async (slideTitle: string, slideContent: string): Promise<SlideAnalysis> => {
    const model = 'gemini-2.5-pro';
    const prompt = `You are a pitch deck coach. Analyze the following slide for clarity, impact, and tone. For each category, provide a rating ('Good', 'Average', 'Needs Improvement') and brief, constructive feedback (one sentence).
Slide Title: "${slideTitle}"
Slide Content:
${slideContent}
Return a single JSON object with the analysis. Do not include markdown formatting.`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            clarity: {
                type: Type.OBJECT,
                properties: {
                    rating: { type: Type.STRING, description: "Rating: 'Good', 'Average', or 'Needs Improvement'." },
                    feedback: { type: Type.STRING }
                },
                required: ['rating', 'feedback']
            },
            impact: {
                type: Type.OBJECT,
                properties: {
                    rating: { type: Type.STRING, description: "Rating: 'Good', 'Average', or 'Needs Improvement'." },
                    feedback: { type: Type.STRING }
                },
                required: ['rating', 'feedback']
            },
            tone: {
                type: Type.OBJECT,
                properties: {
                    rating: { type: Type.STRING, description: "Rating: 'Good', 'Average', or 'Needs Improvement'." },
                    feedback: { type: Type.STRING }
                },
                required: ['rating', 'feedback']
            }
        },
        required: ['clarity', 'impact', 'tone']
    };

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema,
            },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error analyzing slide:", error);
        throw new Error("Failed to analyze slide.");
    }
};

// FIX: Implement and export the missing 'researchTopic' function.
export const researchTopic = async (query: string): Promise<ResearchResult> => {
    const model = 'gemini-2.5-flash';
    const prompt = `Provide a concise summary for the query: "${query}". Include a list of sources used.`;
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        
        const summary = response.text;
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources = groundingChunks
            .filter(chunk => chunk.web && chunk.web.uri)
            .map(chunk => ({
                title: chunk.web!.title || chunk.web!.uri!,
                uri: chunk.web!.uri!
            }));

        return { summary, sources };
    } catch (error) {
        console.error("Error researching topic:", error);
        throw new Error("Failed to perform research.");
    }
};

// FIX: Implement and export the missing 'suggestLayout' function.
export const suggestLayout = async (slideTitle: string, slideContent: string): Promise<{ layout: keyof typeof templates }> => {
    const model = 'gemini-2.5-flash';
    const templateKeys = Object.keys(templates).join(', ');
    const prompt = `Based on the slide content below, which layout template would be most effective?
Title: "${slideTitle}"
Content:
${slideContent}

Available templates: ${templateKeys}.
Respond with only the key of the best template (e.g., 'minimalist').`;
    
    try {
        const response = await ai.models.generateContent({ model, contents: prompt });
        const layout = response.text.trim() as keyof typeof templates;
        if (Object.keys(templates).includes(layout)) {
            return { layout };
        }
        return { layout: 'default' }; 
    } catch (error) {
        console.error("Error suggesting layout:", error);
        return { layout: 'default' };
    }
};

// FIX: Implement and export the missing 'fetchAllSuggestions' function.
export const fetchAllSuggestions = async (slide: Slide): Promise<{ copilotSuggestions: string[], imageSuggestions: string[], researchSuggestions: string[] }> => {
    const model = 'gemini-2.5-pro';
    const prompt = `For a presentation slide with title "${slide.title}" and content "${slide.content}", generate contextual suggestions.
Provide a JSON object with three arrays:
1. 'copilotSuggestions': 3 short, actionable prompts for an AI copilot to improve the slide content (e.g., "Make it more concise", "Add a statistic").
2. 'imageSuggestions': 3 creative prompts for an AI to generate a relevant image for this slide.
3. 'researchSuggestions': 3 Google search queries to find data or supporting evidence for this slide.`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            copilotSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            imageSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            researchSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['copilotSuggestions', 'imageSuggestions', 'researchSuggestions']
    };

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema,
            },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        return { copilotSuggestions: [], imageSuggestions: [], researchSuggestions: [] };
    }
};

// FIX: Implement and export the missing 'suggestChart' function.
export const suggestChart = async (slideTitle: string, slideContent: string): Promise<{ chartData: ChartData | null }> => {
    const model = 'gemini-2.5-pro';
    const prompt = `Analyze the text from a presentation slide (Title: "${slideTitle}", Content: "${slideContent}"). If the text contains quantitative data suitable for a bar chart (e.g., growth over time, comparison of metrics), extract it and format it as a JSON object for a bar chart. If no suitable data is found, return null for the 'data' field. The data should have 'label' and 'value' properties.`;
    
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            data: {
                type: Type.ARRAY,
                nullable: true,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        label: { type: Type.STRING },
                        value: { type: Type.NUMBER }
                    },
                    required: ['label', 'value']
                }
            }
        },
        required: ['data']
    };

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema,
            },
        });
        const result = JSON.parse(response.text);
        if (result.data && result.data.length > 0) {
            return { chartData: { type: 'bar', data: result.data } };
        }
        return { chartData: null };
    } catch (error) {
        console.error("Error suggesting chart:", error);
        throw new Error("Could not generate chart data from the slide content.");
    }
};

// FIX: Implement and export the missing 'suggestPieChart' function.
export const suggestPieChart = async (slideContent: string): Promise<{ chartData: ChartData | null }> => {
    const model = 'gemini-2.5-pro';
    const prompt = `Analyze the following slide content: "${slideContent}". If it describes a percentage-based allocation or composition (e.g., market share, budget breakdown), extract the data and format it as a JSON object for a pie chart. If no suitable data is found, return null for the 'data' field. The data should have 'label' and 'value' (as percentage number) properties.`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            data: {
                type: Type.ARRAY,
                nullable: true,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        label: { type: Type.STRING },
                        value: { type: Type.NUMBER }
                    },
                    required: ['label', 'value']
                }
            }
        },
        required: ['data']
    };

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema,
            },
        });
        const result = JSON.parse(response.text);
        if (result.data && result.data.length > 0) {
            return { chartData: { type: 'pie', data: result.data } };
        }
        return { chartData: null };
    } catch (error) {
        console.error("Error suggesting pie chart:", error);
        throw new Error("Could not generate pie chart data from the slide content.");
    }
};

// FIX: Implement and export the missing 'generateRoadmapSlide' function.
export const generateRoadmapSlide = async (companyContext: string): Promise<{ slide: Slide }> => {
    const model = 'gemini-2.5-pro';
    const prompt = `Based on the company context "${companyContext}", create a forward-looking roadmap slide. It should include key milestones for the next four quarters. Return a single JSON object for the slide with a title, content (milestones as bullet points separated by newlines), a suggested image prompt, and the type 'roadmap'.`;
    
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            imageUrl: { type: Type.STRING },
            type: { type: Type.STRING }
        },
        required: ['title', 'content', 'imageUrl', 'type']
    };
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema,
            },
        });
        const slideData = JSON.parse(response.text);
        return {
            slide: {
                id: `slide-${uuidv4()}`,
                ...slideData
            }
        };
    } catch (error) {
        console.error("Error generating roadmap slide:", error);
        throw new Error("Failed to generate roadmap slide.");
    }
};

// FIX: Implement and export the missing 'generateHeadlineVariations' function.
export const generateHeadlineVariations = async (slideTitle: string): Promise<{ headlines: string[] }> => {
    const model = 'gemini-2.5-flash';
    const prompt = `Generate 5 alternative, more impactful headlines for the presentation slide titled: "${slideTitle}". Return a JSON object with a "headlines" array.`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            headlines: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['headlines']
    };
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema
            },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error generating headlines:", error);
        throw new Error("Failed to generate headlines.");
    }
};

// FIX: Implement and export the missing 'extractMetrics' function.
export const extractMetrics = async (slideContent: string): Promise<{ metrics: ExtractedMetric[] }> => {
    const model = 'gemini-2.5-flash';
    const prompt = `From the text below, extract key business metrics (e.g., "User Growth", "Revenue", "ARR"). Return a JSON object with a "metrics" array, where each object has a "label" and a "value" (as a string). If no metrics are found, return an empty array.
Text: "${slideContent}"`;
    
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            metrics: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        label: { type: Type.STRING },
                        value: { type: Type.STRING }
                    },
                    required: ['label', 'value']
                }
            }
        },
        required: ['metrics']
    };
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema
            },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error extracting metrics:", error);
        throw new Error("Failed to extract metrics.");
    }
};

// FIX: Implement and export the missing 'generatePricingTable' function.
export const generatePricingTable = async (slideContent: string): Promise<{ tableData: TableData | null }> => {
    const model = 'gemini-2.5-pro';
    const prompt = `Based on the following description, create a pricing table with 3 tiers (e.g., Basic, Pro, Enterprise). For each tier, provide a name, price, and a list of key features.
Description: "${slideContent}"
Return a single JSON object. The root object should have a 'tiers' property which is an array. Each object in the array should have 'name', 'price', and 'features' (an array of strings). If you cannot create a pricing table, return null for 'tiers'.`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            tiers: {
                type: Type.ARRAY,
                nullable: true,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        price: { type: Type.STRING },
                        features: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ['name', 'price', 'features']
                }
            }
        },
        required: ['tiers']
    };

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema,
            },
        });
        const result = JSON.parse(response.text);
        if (result.tiers) {
            return { tableData: { type: 'pricing', tiers: result.tiers } };
        }
        return { tableData: null };
    } catch (error) {
        console.error("Error generating pricing table:", error);
        throw new Error("Failed to generate pricing table.");
    }
};

// FIX: Implement and export the missing 'summarizeBio' function.
export const summarizeBio = async (bio: string): Promise<BioSummary> => {
    const model = 'gemini-2.5-pro';
    const prompt = `Summarize the following professional biography into a single, concise paragraph. Also, extract 3-4 key highlights as bullet points.
Biography: "${bio}"
Return a single JSON object with 'summary' and 'highlights' (an array of strings). Do not use markdown.`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING },
            highlights: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['summary', 'highlights']
    };
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema
            },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error summarizing bio:", error);
        throw new Error("Failed to summarize biography.");
    }
};


const generateEventDescriptionFunctionDeclaration: FunctionDeclaration = {
    name: 'generateEventDescription',
    description: 'Generates a compelling one-paragraph event description.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            description: {
                type: Type.STRING,
                description: 'The generated event description text.'
            }
        },
        required: ['description']
    }
};

export const generateEventDescription = async (details: { title: string; date: string; location: string }): Promise<{ description: string }> => {
    const model = 'gemini-2.5-pro';
    const prompt = `You are a professional copywriter. Write a compelling one-paragraph event description for an event titled "${details.title}" happening on ${details.date} at ${details.location}. Call the 'generateEventDescription' function with your result.`;
    
    try {
        const response = await ai.models.generateContent({ 
            model, 
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [generateEventDescriptionFunctionDeclaration] }],
            }
        });

        const functionCall = response.functionCalls?.[0];
        if (functionCall?.name === 'generateEventDescription' && functionCall.args?.description != null) {
            // FIX: Explicitly cast the description to a string to handle cases where the AI might return a number.
            return { description: String(functionCall.args.description) };
        }
        
        // Fallback if function calling fails
        if (response.text) {
             return { description: response.text };
        }

        throw new Error("AI did not generate a description as expected.");
    } catch (error) {
        console.error("Error generating event description:", error);
        throw new Error("Failed to generate event description.");
    }
};

const generateEventTitlesFunctionDeclaration: FunctionDeclaration = {
    name: 'generateEventTitles',
    description: 'Generates 3 creative and engaging alternative titles for an event based on a user-provided base title.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            titles: {
                type: Type.ARRAY,
                description: 'An array of exactly 3 alternative event titles.',
                items: { type: Type.STRING }
            }
        },
        required: ['titles']
    }
};

export const generateEventTitles = async (baseTitle: string): Promise<{ titles: string[] }> => {
    const model = 'gemini-2.5-pro';
    const prompt = `You are a creative marketer. Based on the event title "${baseTitle}", generate 3 creative and engaging alternative titles. Call the 'generateEventTitles' function with your results.`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [generateEventTitlesFunctionDeclaration] }],
            },
        });

        const functionCall = response.functionCalls?.[0];

        if (functionCall?.name === 'generateEventTitles' && Array.isArray(functionCall.args?.titles)) {
            return { titles: functionCall.args.titles as string[] };
        }
        
        // Fallback if function calling fails
        if (response.text) {
             const titles = response.text.split('\n').map(t => t.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
             if (titles.length >= 3) return { titles: titles.slice(0, 3) };
        }

        throw new Error("The AI did not suggest titles as expected.");
    } catch (error) {
        console.error("Error generating event titles:", error);
        throw new Error("Failed to generate event titles.");
    }
};

export const suggestVenues = async (eventType: string, city: string): Promise<VenueSuggestion[]> => {
    const model = 'gemini-2.5-flash';
    const prompt = `You are an expert event planner. For an event of type "${eventType}" in "${city}", suggest 3 suitable venues. For each venue, provide its name and a brief, one-sentence reason why it's a good choice.
    Return your response as a valid JSON object with a single key "venues", which is an array of objects. Each object should have "name" and "reason" properties. Do not include any text outside of the JSON object. Do not use markdown backticks.`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                tools: [{ googleMaps: {} }],
            },
        });

        let venues: VenueSuggestion[] = [];
        try {
            const cleanText = response.text.replace(/```json\n?|\n?```/g, '').trim();
            const parsedResult = JSON.parse(cleanText);
            venues = parsedResult.venues || [];
        } catch (e) {
            console.error("Failed to parse AI response as JSON:", response.text, e);
            throw new Error("The AI returned an invalid format. Please try again.");
        }
        
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        
        if (venues.length > 0 && groundingChunks.length > 0) {
            venues = venues.map(venue => {
                const matchingChunk = groundingChunks.find(chunk => 
                    chunk.maps?.title && venue.name.toLowerCase().includes(chunk.maps.title.toLowerCase())
                );
                if (matchingChunk?.maps?.uri) {
                    return { ...venue, mapLink: matchingChunk.maps.uri };
                }
                return venue;
            });
        }
        
        return venues;

    } catch (error) {
        console.error("Error suggesting venues:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Failed to suggest venues. Please ensure the location is specific enough.");
    }
};

const generateSocialMediaCopyFunctionDeclaration: FunctionDeclaration = {
    name: 'generateSocialMediaCopy',
    description: "Generates tailored promotional copy for an event for Twitter, LinkedIn, and Instagram.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            twitter: {
                type: Type.STRING,
                description: 'A short, engaging post for Twitter, under 280 characters, including relevant hashtags.'
            },
            linkedin: {
                type: Type.STRING,
                description: 'A professional post for LinkedIn, suitable for a business audience, including professional hashtags.'
            },
            instagram: {
                type: Type.STRING,
                description: 'An engaging and visually-oriented caption for Instagram, including emojis and relevant hashtags.'
            }
        },
        required: ['twitter', 'linkedin', 'instagram']
    }
};

export const generateSocialMediaCopy = async (details: { title: string; description: string; date: string; location: string }): Promise<SocialMediaCopy> => {
    const model = 'gemini-2.5-pro';
    const prompt = `You are a social media marketing expert for a tech startup community. Based on the following event details, generate promotional copy tailored for Twitter, LinkedIn, and Instagram.

Event Title: "${details.title}"
Date: ${new Date(details.date).toLocaleString()}
Location: ${details.location}
Description: "${details.description}"

Call the 'generateSocialMediaCopy' function with the generated posts.`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [generateSocialMediaCopyFunctionDeclaration] }],
            },
        });

        const functionCall = response.functionCalls?.[0];

        if (functionCall?.name === 'generateSocialMediaCopy' && functionCall.args) {
            return functionCall.args as unknown as SocialMediaCopy;
        }

        throw new Error("The AI did not generate social media copy as expected.");
    } catch (error) {
        console.error("Error generating social media copy:", error);
        throw new Error("Failed to generate social media copy. Please try again.");
    }
};

const structureAgendaFunctionDeclaration: FunctionDeclaration = {
    name: 'structureAgenda',
    description: 'Formats a raw list of event topics or speakers into a structured, timed agenda.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            schedule: {
                type: Type.ARRAY,
                description: 'An array of agenda item objects.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        time: { type: Type.STRING, description: 'The start time of the agenda item (e.g., "6:00 PM").' },
                        topic: { type: Type.STRING, description: 'The title or description of the agenda item.' },
                        speaker: { type: Type.STRING, description: 'Optional: The name of the speaker for this item.' }
                    },
                    required: ['time', 'topic']
                }
            }
        },
        required: ['schedule']
    }
};

export const structureAgenda = async (rawAgenda: string, eventDate: string): Promise<StructuredAgenda> => {
    const model = 'gemini-2.5-pro';
    const prompt = `You are an expert event coordinator. Analyze the following raw text for an event schedule. The event is on ${new Date(eventDate).toLocaleDateString()}. Structure it into a timed agenda by calling the 'structureAgenda' function. Infer timings if they are relative (e.g., 'after the keynote').

Raw Agenda Text:
"${rawAgenda}"`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [structureAgendaFunctionDeclaration] }],
            },
        });

        const functionCall = response.functionCalls?.[0];

        if (functionCall?.name === 'structureAgenda' && functionCall.args?.schedule) {
            return { schedule: functionCall.args.schedule as AgendaItem[] };
        }

        throw new Error("The AI did not generate a structured agenda as expected.");
    } catch (error) {
        console.error("Error structuring agenda:", error);
        throw new Error("Failed to structure the event agenda. Please check the input text.");
    }
};