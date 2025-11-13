
import { GoogleGenAI, GenerateContentResponse, Type, FunctionDeclaration, Modality } from '@google/genai';
import { Slide, ChartData, TableData, Deck } from '../data/decks';
import { templates } from '../styles/templates';

// This is a client-side implementation. In a production app, this key would be
// moved to a secure backend or Edge Function.
const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY is not set. AI features will not work.");
}
const ai = new GoogleGenAI({ apiKey });


// --- Type Definitions ---
export interface SlideAnalysis {
    clarity: { rating: 'Good' | 'Average' | 'Needs Improvement'; feedback: string };
    impact: { rating: 'Good' | 'Average' | 'Needs Improvement'; feedback: string };
    tone: { rating: 'Good' | 'Average' | 'Needs Improvement'; feedback: string };
}

export interface ResearchResult {
    summary: string;
    sources: { uri: string; title: string }[];
}

export interface ExtractedMetric {
    label: string;
    value: string;
}

export interface BioSummary {
    summary: string;
    highlights: string[];
}


// --- Mock/Stub Functions for when API key is missing ---
// Fix: Allow function to accept arguments so it doesn't cause type errors when used as a fallback.
const disabledAiService = <T>(defaultValue: T) => async (..._args: any[]): Promise<T> => {
    console.warn("AI service is disabled because API key is missing.");
    await new Promise(res => setTimeout(res, 500)); // Simulate network delay
    return defaultValue;
};

// Specific mock for generateDeck to ensure a valid, non-empty ID is always returned for the UI flow.
const mockGenerateDeck = async (payload: { mode: 'text' | 'url', content: string | string[] }): Promise<{ deckId: string }> => {
    console.warn("AI service is disabled. Simulating deck generation with payload:", payload);
    await new Promise(res => setTimeout(res, 1000));
    // In a real mock, you might even add this to sessionStorage to make polling succeed.
    return { deckId: `mock-deck-${Date.now()}` };
};


// --- Service Implementations ---
export const generateDeck = apiKey ? async (payload: { mode: 'text' | 'url', content: string | string[] }): Promise<{ deckId: string }> => {
    // In a real app, this would call a backend which creates the deck and returns an ID.
    // For now, we'll just simulate success.
    console.log("Simulating deck generation with payload:", payload);
    await new Promise(res => setTimeout(res, 1000));
    return { deckId: `new-deck-${Date.now()}` };
} : mockGenerateDeck;


export const generateEventDescription = apiKey ? async (details: { title: string; date: string; location: string }): Promise<{ description: string }> => {
    const model = 'gemini-2.5-pro';
    const prompt = `Write a compelling one-paragraph event description for an event titled "${details.title}" happening on ${details.date} at ${details.location}.`;
    const response = await ai.models.generateContent({ model, contents: prompt });
    return { description: response.text };
} : disabledAiService({ description: "AI is disabled. Please add a Gemini API key." });

// Fix: Implemented the function to match its usage in DeckEditor.tsx.
export const generateSlideImage = apiKey ? async (title: string, content: string, imagePrompt?: string): Promise<{ base64Image: string }> => {
  const model = 'gemini-2.5-flash-image';
  const finalPrompt = imagePrompt || `A visually appealing, professional image for a presentation slide titled "${title}". The slide content is about: "${content}". The image should be abstract and inspiring.`;

  const response = await ai.models.generateContent({
    model,
    contents: { parts: [{ text: finalPrompt }] },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });
  
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return { base64Image: part.inlineData.data };
    }
  }
  throw new Error("No image was generated.");
} : disabledAiService({ base64Image: '' });

// Fix: Implemented the function to match its usage in DeckEditor.tsx.
export const editSlideImage = apiKey ? async (base64Data: string, mimeType: string, prompt: string): Promise<{ base64Image: string }> => {
  const model = 'gemini-2.5-flash-image';
  
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return { base64Image: part.inlineData.data };
    }
  }
  throw new Error("No image was generated from edit.");
} : disabledAiService({ base64Image: '' });

// Fix: Implemented the function to match its usage in DeckEditor.tsx.
export const modifySlideContent = apiKey ? async (title: string, content: string, instruction: string): Promise<{ newTitle: string, newContent: string }> => {
  const model = 'gemini-2.5-pro';

  const schema = {
    type: Type.OBJECT,
    properties: {
      newTitle: {
        type: Type.STRING,
        description: 'The revised title for the slide. It can be the same as the original if no change is needed.'
      },
      newContent: {
        type: Type.STRING,
        description: 'The revised content for the slide, with bullet points separated by newlines.'
      }
    },
    required: ['newTitle', 'newContent']
  };

  const prompt = `You are an expert pitch deck copywriter. Your task is to modify the given slide title and content based on a specific instruction. Return the complete, revised slide, even if parts are unchanged.

  **Original Title:**
  ${title}

  **Original Content:**
  ${content}

  **Instruction:**
  "${instruction}"

  Now, provide the revised title and content in the required format.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });

    const jsonText = response.text.trim();
    if (jsonText.startsWith('```json')) {
        return JSON.parse(jsonText.replace('```json\n', '').replace('\n```', ''));
    }
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("Error modifying slide content with Gemini:", error);
    throw new Error("Failed to get suggestions from the AI. Please try again.");
  }
} : disabledAiService({ newTitle: 'AI Disabled', newContent: 'Please configure your API Key.' });

// Fix: Implemented the function to match its usage in DeckEditor.tsx and to return the correct type for SlideAnalysis.
export const analyzeSlide = apiKey ? async (title: string, content: string): Promise<SlideAnalysis> => {
  const model = 'gemini-2.5-flash';
  const schema = {
    type: Type.OBJECT,
    properties: {
      clarity: {
        type: Type.OBJECT,
        properties: {
          rating: { type: Type.STRING, enum: ['Good', 'Average', 'Needs Improvement'] },
          feedback: { type: Type.STRING }
        },
        required: ['rating', 'feedback']
      },
      impact: {
        type: Type.OBJECT,
        properties: {
          rating: { type: Type.STRING, enum: ['Good', 'Average', 'Needs Improvement'] },
          feedback: { type: Type.STRING }
        },
        required: ['rating', 'feedback']
      },
      tone: {
        type: Type.OBJECT,
        properties: {
          rating: { type: Type.STRING, enum: ['Good', 'Average', 'Needs Improvement'] },
          feedback: { type: Type.STRING }
        },
        required: ['rating', 'feedback']
      }
    },
    required: ['clarity', 'impact', 'tone']
  };

  const prompt = `Analyze the following presentation slide for clarity, impact, and tone. Provide a rating and concise feedback for each.
  Title: "${title}"
  Content: "${content}"`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema,
    },
  });
  return JSON.parse(response.text.trim()) as SlideAnalysis;
// FIX: Explicitly set generic type to prevent type widening of the 'rating' property.
} : disabledAiService<SlideAnalysis>({ clarity: { rating: 'Average', feedback: 'AI is disabled.'}, impact: { rating: 'Average', feedback: 'AI is disabled.'}, tone: { rating: 'Average', feedback: 'AI is disabled.'}});

// Fix: Implemented the function to match its usage in DeckEditor.tsx.
export const researchTopic = apiKey ? async (query: string): Promise<ResearchResult> => {
  const model = 'gemini-2.5-flash';
  const response = await ai.models.generateContent({
    model,
    contents: query,
    config: {
      tools: [{googleSearch: {}}],
    },
  });

  const summary = response.text;
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
    uri: chunk.web?.uri || '',
    title: chunk.web?.title || ''
  })).filter(source => source.uri) || [];
  
  return { summary, sources };
} : disabledAiService({ summary: 'AI is disabled.', sources: [] });

// Fix: Implemented the function to match its usage in DeckEditor.tsx.
export const suggestLayout = apiKey ? async (title: string, content: string): Promise<{ layout: keyof typeof templates }> => {
  const model = 'gemini-2.5-flash';
  const templateNames = Object.keys(templates).join(', ');

  const schema = {
    type: Type.OBJECT,
    properties: {
      layout: {
        type: Type.STRING,
        description: 'The recommended layout name.',
        enum: Object.keys(templates)
      }
    },
    required: ['layout']
  };

  const prompt = `Based on the slide content below, which layout is most appropriate?
  Available layouts: ${templateNames}.
  Title: "${title}"
  Content: "${content}"
  
  Choose the best layout. For example, if the content is very visual, 'minimalist' might be good. If it's data-heavy, 'professional' might be better.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema,
    },
  });
  const result = JSON.parse(response.text.trim());
  return { layout: result.layout as keyof typeof templates };
} : disabledAiService({ layout: 'default' });

// Fix: Implemented the function to match its usage in DeckEditor.tsx.
export const fetchAllSuggestions = apiKey ? async (slide: Slide): Promise<{ copilotSuggestions: string[], imageSuggestions: string[], researchSuggestions: string[] }> => {
  const model = 'gemini-2.5-flash';
  const schema = {
    type: Type.OBJECT,
    properties: {
      copilotSuggestions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "3 short, actionable suggestions for improving the slide's text content."
      },
      imageSuggestions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "3 creative prompts for generating a new image for this slide."
      },
      researchSuggestions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "3 relevant research queries a user might perform for this slide's topic."
      }
    },
    required: ['copilotSuggestions', 'imageSuggestions', 'researchSuggestions']
  };

  const prompt = `For a presentation slide titled "${slide.title}" with content "${slide.content}", generate 3 suggestions for each of the following categories: Copilot (text improvements), Image (new image prompts), and Research (related search queries).`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema,
    },
  });

  return JSON.parse(response.text.trim());
} : disabledAiService({ copilotSuggestions: [], imageSuggestions: [], researchSuggestions: [] });

// Fix: Implemented the function to match its usage in DeckEditor.tsx.
export const suggestChart = apiKey ? async (title: string, content: string): Promise<{ chartData: ChartData | null }> => {
  const model = 'gemini-2.5-flash';
  const schema = {
    type: Type.OBJECT,
    properties: {
      should_create_chart: { type: Type.BOOLEAN, description: 'True if the content contains quantifiable data suitable for a bar chart.' },
      chart_data: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            label: { type: Type.STRING },
            value: { type: Type.NUMBER }
          },
          required: ['label', 'value'],
        },
        description: 'An array of objects for the bar chart data.'
      }
    },
    required: ['should_create_chart'],
  };

  const prompt = `Analyze the slide content to determine if it can be represented as a bar chart. If so, extract the data.
  Title: "${title}"
  Content: "${content}"`;
  
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema,
    },
  });
  const result = JSON.parse(response.text.trim());

  if (result.should_create_chart && result.chart_data && result.chart_data.length > 0) {
    return { chartData: { type: 'bar', data: result.chart_data } };
  }
  return { chartData: null };
} : disabledAiService({ chartData: null });

// Fix: Implemented the function to match its usage in DeckEditor.tsx.
export const suggestPieChart = apiKey ? async (content: string): Promise<{ chartData: ChartData | null }> => {
  const model = 'gemini-2.5-flash';
  const schema = {
    type: Type.OBJECT,
    properties: {
      should_create_chart: { type: Type.BOOLEAN, description: 'True if the content represents a whole distribution or percentages.' },
      chart_data: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            label: { type: Type.STRING },
            value: { type: Type.NUMBER, description: 'The percentage value' }
          },
          required: ['label', 'value'],
        },
        description: 'An array of objects for the pie chart data. Values should sum to 100.'
      }
    },
     required: ['should_create_chart'],
  };

  const prompt = `Analyze this text to see if it can be represented as a pie chart (e.g., market share, budget allocation). Extract the data if possible. Content: "${content}"`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema,
    },
  });
  const result = JSON.parse(response.text.trim());

  if (result.should_create_chart && result.chart_data && result.chart_data.length > 0) {
    return { chartData: { type: 'pie', data: result.chart_data } };
  }
  return { chartData: null };
} : disabledAiService({ chartData: null });

// Fix: Implemented the function to match its usage in DeckEditor.tsx.
export const generateRoadmapSlide = apiKey ? async (companyContext: string): Promise<{ slide: Slide }> => {
  // This is a complex operation. In a real app, you might have a more dedicated prompt or function chain.
  // For now, we'll generate content and format it.
  const model = 'gemini-2.5-pro';
  const prompt = `Based on the company context "${companyContext}", create a 4-point product roadmap for the next 12 months. Each point should be a concise bullet. Format the response as bullet points separated by newlines.`;
  const response = await ai.models.generateContent({ model, contents: prompt });

  const newSlide: Slide = {
    id: `slide-${Date.now()}`,
    title: 'Our Roadmap',
    content: response.text,
    type: 'roadmap',
    template: 'professional'
  };
  return { slide: newSlide };
} : disabledAiService({ slide: { id: '', title: 'AI Disabled', content: '' } });

// Fix: Implemented the function to match its usage in DeckEditor.tsx.
export const generateHeadlineVariations = apiKey ? async (title: string): Promise<{ headlines: string[] }> => {
  const model = 'gemini-2.5-flash';
  const prompt = `Generate 5 alternative, more impactful headlines for a presentation slide titled: "${title}"`;
  const response = await ai.models.generateContent({ model, contents: prompt });
  const headlines = response.text.split('\n').map(h => h.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
  return { headlines };
} : disabledAiService({ headlines: [] });

// Fix: Implemented the function to match its usage in DeckEditor.tsx.
export const extractMetrics = apiKey ? async (content: string): Promise<{ metrics: ExtractedMetric[] }> => {
  const model = 'gemini-2.5-flash';
  const schema = {
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
          required: ['label', 'value'],
        }
      }
    },
    required: ['metrics']
  };
  const prompt = `Extract key metrics (e.g., revenue, user growth, KPIs) from the following text: "${content}"`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema,
    },
  });
  return JSON.parse(response.text.trim());
} : disabledAiService({ metrics: [] });

// Fix: Implemented the function to match its usage in DeckEditor.tsx and to return the correct type for TableData.
export const generatePricingTable = apiKey ? async (content: string): Promise<{ tableData: TableData }> => {
  const model = 'gemini-2.5-flash';
  const schema = {
    type: Type.OBJECT,
    properties: {
      tiers: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            price: { type: Type.STRING },
            features: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['name', 'price', 'features'],
        }
      }
    },
    required: ['tiers']
  };

  const prompt = `Create a pricing table structure from this text. The text describes our product tiers. Extract the tier name, price, and a list of features for each. Text: "${content}"`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema,
    },
  });
  const result = JSON.parse(response.text.trim());
  return { tableData: { type: 'pricing', tiers: result.tiers } };
// FIX: Explicitly set generic type to prevent type widening of the tableData 'type' property.
} : disabledAiService<{ tableData: TableData }>({ tableData: { type: 'pricing', tiers: [] } });

// Fix: Implemented the function to match its usage in FounderProfile.tsx and DeckEditor.tsx.
export const summarizeBio = apiKey ? async (bio: string): Promise<BioSummary> => {
  const model = 'gemini-2.5-flash';
  const schema = {
    type: Type.OBJECT,
    properties: {
      summary: { type: Type.STRING, description: "A concise, one-paragraph summary of the bio." },
      highlights: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-5 key achievements or skills as bullet points." }
    },
    required: ['summary', 'highlights']
  };
  const prompt = `Summarize the following founder biography and extract key highlights. Bio: "${bio}"`;
  
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema,
    },
  });
  return JSON.parse(response.text.trim());
} : disabledAiService({ summary: 'AI is disabled.', highlights: [] });
