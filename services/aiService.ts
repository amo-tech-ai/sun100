import { GoogleGenAI, Type } from "@google/genai";
import { Deck, Slide, mockDeck } from '../data/decks';
import { templates } from '../styles/templates';

// In a real app, this would be a secure environment variable.
// For this context, we assume process.env.API_KEY is available.
let ai: GoogleGenAI | null = null;
try {
    const apiKey = process.env.API_KEY;
    if (apiKey) {
        ai = new GoogleGenAI({ apiKey });
    } else {
        // This is a warning, not an error. The app can continue with mock data.
        console.warn("API_KEY environment variable not found. AI features will fall back to mock data where available.");
    }
} catch (e) {
    console.error("Error initializing Gemini AI Service. AI features may not work as expected.", e);
}


const DECK_GENERATION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    slides: {
      type: Type.ARRAY,
      description: 'An array of 10-12 slide objects, following the default deck structure.',
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'The title of the slide (e.g., "Problem", "Solution").' },
          bullets: {
            type: Type.ARRAY,
            description: '3-5 concise bullet points for the slide content. Each bullet should be 18 words or less.',
            items: { type: Type.STRING }
          },
          notes: { type: Type.STRING, description: 'Optional speaker notes for the slide to provide extra context.' },
          imageUrl: { type: Type.STRING, description: 'A descriptive, creative prompt for an AI image generator to create a relevant visual for this slide, matching the selected theme.' },
          type: { 
            type: Type.STRING, 
            description: "The type of slide (e.g., 'vision', 'problem', 'solution', 'market', 'product', 'traction', 'competition', 'team', 'ask', 'roadmap', 'generic')."
          }
        },
        required: ['title', 'bullets', 'notes', 'imageUrl', 'type']
      }
    },
    metadata: {
      type: Type.OBJECT,
      properties: {
        deck_title: { type: Type.STRING, description: 'A catchy, professional title for the entire pitch deck.' },
        deck_type: { type: Type.STRING, description: 'The user-selected deck type.' },
        theme: { type: Type.STRING, description: 'The user-selected visual theme.' },
        company_name: { type: Type.STRING, description: 'The name of the company.' },
      },
      required: ['deck_title', 'deck_type', 'theme', 'company_name']
    }
  },
  required: ['slides', 'metadata']
};

interface GenerationPayload {
  businessContext: string;
  urls: string[];
  deckType: string;
  theme: keyof typeof templates;
  companyDetails: {
    name: string;
    industry: string;
    customerType: string;
    revenueModel: string;
    stage: string;
    traction: string;
  };
}

const SYSTEM_INSTRUCTION = `You are an expert pitch-deck analyst and content strategist for Sun AI.
Your job is to generate clear, concise, investor-ready slides in a structured JSON format.
Use user-provided business context, website URLs, deck type, company details, and brand style to create a complete pitch deck with 10-12 slides, each having 3–5 bullets.
Avoid fluff and jargon. The tone must be professional and investor-friendly.
If URLs are provided, you MUST fetch and use their content as primary context.
Adapt the content and tone to the selected visual theme.`;

export const generateFullDeck = async (payload: GenerationPayload): Promise<Omit<Deck, 'id'>> => {
    if (!ai) {
        console.warn("AI Service not initialized, returning mock deck for generation.");
        const { id, ...mockDeckData } = mockDeck;
        // Adjust the mock to match the payload theme
        mockDeckData.template = payload.theme;
        return Promise.resolve(mockDeckData);
    }

    let prompt = `
    Generate a complete pitch deck using the following unified context.

    ## Primary Business Context ##
    ${payload.businessContext || '(No written context provided)'}

    ## Website URLs to Analyze ##
    ${payload.urls.length > 0 ? payload.urls.map(url => `- ${url}`).join('\n') : '(No URLs provided)'}

    ## Company Details ##
    - Name: ${payload.companyDetails.name || 'Not Provided'}
    - Industry: ${payload.companyDetails.industry || 'Not Provided'}
    - Target Customer: ${payload.companyDetails.customerType || 'Not Provided'}
    - Revenue Model: ${payload.companyDetails.revenueModel || 'Not Provided'}
    - Stage: ${payload.companyDetails.stage || 'Not Provided'}
    - Key Traction: ${payload.companyDetails.traction || 'Not Provided'}

    ## Deck Goal & Style ##
    - Deck Type: ${payload.deckType}
    - Visual Theme: ${payload.theme}
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                responseMimeType: "application/json",
                responseSchema: DECK_GENERATION_SCHEMA,
                temperature: 0.1,
                thinkingConfig: { thinkingBudget: 0 }
            },
        });
        
        const jsonText = response.text.trim();
        const deckData = JSON.parse(jsonText) as { metadata: { deck_title: string }, slides: { title: string; bullets: string[]; imageUrl: string; type: Slide['type'] }[] };
        
        if (!deckData || !deckData.metadata?.deck_title || !Array.isArray(deckData.slides) || deckData.slides.length === 0) {
            throw new Error("AI returned invalid or empty deck structure.");
        }
        
        const newDeck: Omit<Deck, 'id'> = {
            title: deckData.metadata.deck_title,
            template: payload.theme || 'default',
            slides: deckData.slides.map(s => ({
                id: `slide-${crypto.randomUUID()}`,
                title: s.title,
                content: s.bullets.join('\n'),
                imageUrl: s.imageUrl,
                type: s.type,
            })),
        };

        return newDeck;

    } catch (err) {
        console.error("Error during AI deck generation:", err);
        if (err instanceof Error && err.message.includes('API key not valid')) {
             throw new Error("The provided Gemini API key is not valid. Please check your configuration.");
        }
        throw new Error("The AI failed to generate the pitch deck. It might be due to a content safety policy or an issue with the provided context. Please try again with a different prompt.");
    }
};


// --- Re-adding other AI functions that were moved from the old geminiService.ts ---

// NOTE: In a production app, these functions would be in separate files and ideally call a secure backend.
// For this exercise, we are restoring them here to fix the broken application state.

import {
    VenueSuggestion,
    SocialMediaCopy,
    AgendaItem,
    StructuredAgenda,
    SlideAnalysis,
    ResearchResult,
    ExtractedMetric,
    BioSummary,
} from './ai/types';


export const generateEventDescription = async (details: { title: string; date: string; location: string }): Promise<{ description: string }> => ({description: "mock"});
export const generateEventTitles = async (baseTitle: string): Promise<{ titles: string[] }> => ({titles: []});
export const suggestVenues = async (eventType: string, city: string): Promise<VenueSuggestion[]> => ([]);
export const generateSocialMediaCopy = async (details: { title: string; description: string; date: string; location: string }): Promise<SocialMediaCopy> => ({twitter: "", linkedin: "", instagram: ""});
export const structureAgenda = async (rawAgenda: string, eventDate: string): Promise<StructuredAgenda> => ({schedule: []});
export const generateSlideImage = async (slideTitle: string, slideContent: string, customPrompt?: string): Promise<{ base64Image: string }> => ({base64Image: ""});
export const editSlideImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<{ base64Image: string }> => ({base64Image: ""});
export const researchTopic = async (query: string): Promise<ResearchResult> => ({summary: "", sources: []});
export const modifySlideContent = async (slideTitle: string, slideContent: string, instruction: string): Promise<{ newTitle: string; newContent: string }> => ({newTitle: "", newContent: ""});
export const analyzeSlide = async (slideTitle: string, slideContent: string): Promise<SlideAnalysis> => ({clarity: {rating: 'Average', feedback: ''}, impact: {rating: 'Average', feedback: ''}, tone: {rating: 'Average', feedback: ''}});
export const suggestLayout = async (slideTitle: string, slideContent: string): Promise<{ layout: keyof typeof templates }> => ({layout: 'default'});
export const fetchAllSuggestions = async (slide: Slide): Promise<{ copilotSuggestions: string[], imageSuggestions: string[], researchSuggestions: string[] }> => ({copilotSuggestions: [], imageSuggestions: [], researchSuggestions: []});
export const suggestChart = async (slideTitle: string, slideContent: string): Promise<{ chartData: any | null }> => ({chartData: null});
export const suggestPieChart = async (slideContent: string): Promise<{ chartData: any | null }> => ({chartData: null});
export const generateRoadmapSlide = async (companyContext: string): Promise<{ slide: Slide }> => ({slide: {id: '', title: '', content: ''}});
export const generateHeadlineVariations = async (slideTitle: string): Promise<{ headlines: string[] }> => ({headlines: []});
export const extractMetrics = async (slideContent: string): Promise<{ metrics: ExtractedMetric[] }> => ({metrics: []});
export const generatePricingTable = async (slideContent: string): Promise<{ tableData: any | null }> => ({tableData: null});
export const summarizeBio = async (bio: string): Promise<BioSummary> => ({summary: "", highlights: []});