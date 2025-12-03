import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI, Type } from "npm:@google/genai";

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// --- Prompt Declarations ---
const rewriteSlideFunctionDeclaration = {
    name: 'rewriteSlide',
    description: 'Rewrites slide content to improve clarity, impact, and persuasion based on specific instructions.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            newTitle: { type: Type.STRING, description: 'The revised, punchier title.' },
            newContent: { type: Type.STRING, description: 'The rewritten content, formatted as clean bullet points.' },
        },
        required: ['newTitle', 'newContent'],
    }
};

const analyzeSlideContentFunctionDeclaration = {
    name: 'analyzeSlideContent',
    description: 'Acts as a VC associate to analyze a slide for clarity, impact, and tone.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            clarity: { type: Type.OBJECT, properties: { rating: { type: Type.STRING }, feedback: { type: Type.STRING } }, required: ['rating', 'feedback'] },
            impact: { type: Type.OBJECT, properties: { rating: { type: Type.STRING }, feedback: { type: Type.STRING } }, required: ['rating', 'feedback'] },
            tone: { type: Type.OBJECT, properties: { rating: { type: Type.STRING }, feedback: { type: Type.STRING } }, required: ['rating', 'feedback'] }
        },
        required: ['clarity', 'impact', 'tone']
    }
};

const chooseLayoutFunctionDeclaration = {
    name: 'chooseLayout',
    description: 'Selects the optimal visual layout template for a slide.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            layout: { type: Type.STRING }
        },
        required: ['layout']
    }
};

const generateAllSuggestionsFunctionDeclaration = {
    name: 'generateAllSuggestions',
    description: 'Generates a comprehensive set of improvement suggestions.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            copilotSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            imageSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            researchSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['copilotSuggestions', 'imageSuggestions', 'researchSuggestions']
    }
};

const suggestChartFunctionDeclaration = {
    name: 'suggestChart',
    description: 'Extracts numerical data from text and structures it for a bar chart.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            data: {
                type: Type.ARRAY,
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
    }
};

const suggestPieChartFunctionDeclaration = {
    name: 'suggestPieChart',
    description: 'Extracts percentage allocation data from text and structures it for a pie chart.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            data: {
                type: Type.ARRAY,
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
    }
};

const generateHeadlineVariationsFunctionDeclaration = {
    name: 'generateHeadlineVariations',
    description: 'Generates five compelling, high-impact headline variations for a slide.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            headlines: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['headlines']
    }
};

const extractMetricsFunctionDeclaration = {
    name: 'extractMetrics',
    description: 'Identifies and extracts key quantifiable business metrics.',
    parameters: {
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
    }
};

const generatePricingTableFunctionDeclaration = {
    name: 'generatePricingTable',
    description: 'Structures pricing and feature information into a comparison table format.',
    parameters: {
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
                    required: ['name', 'price', 'features']
                }
            }
        },
        required: ['tiers']
    }
};

const summarizeBioFunctionDeclaration = {
    name: 'summarizeBio',
    description: 'Summarizes a biography into a concise profile.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING },
            highlights: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['summary', 'highlights']
    }
};

const generateFinancialsFunctionDeclaration = {
    name: 'generateFinancials',
    description: 'Generates a 3-year financial projection table.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            headers: { type: Type.ARRAY, items: { type: Type.STRING } },
            rows: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        label: { type: Type.STRING },
                        values: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ['label', 'values']
                }
            },
            summary: { type: Type.STRING }
        },
        required: ['headers', 'rows', 'summary']
    }
};

const generateSWOTAnalysisFunctionDeclaration = {
    name: 'generateSWOTAnalysis',
    description: 'Generates a strategic SWOT analysis.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            headers: { type: Type.ARRAY, items: { type: Type.STRING } },
            rows: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.STRING } } }
        },
        required: ['headers', 'rows']
    }
};

const generateGTMStrategyFunctionDeclaration = {
    name: 'generateGTMStrategy',
    description: 'Generates a concise GTM strategy overview.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            strategy_summary: { type: Type.STRING },
            channels: { type: Type.ARRAY, items: { type: Type.STRING } },
            key_metrics: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['strategy_summary', 'channels', 'key_metrics']
    }
};

const createRoadmapContentFunctionDeclaration = {
    name: 'createRoadmapContent',
    description: 'Generates four strategic roadmap milestones.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            milestones: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['milestones']
    }
};

const generateDeckUpdateSuggestionsFunctionDeclaration = {
    name: 'generateDeckUpdateSuggestions',
    description: 'Identifies discrepancies between website content and a pitch deck.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            suggestions: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        slideTitle: { type: Type.STRING },
                        currentValue: { type: Type.STRING },
                        newValue: { type: Type.STRING },
                        reason: { type: Type.STRING }
                    },
                    required: ['slideTitle', 'currentValue', 'newValue', 'reason']
                }
            }
        },
        required: ['suggestions']
    }
};

const analyzeFundingGoalFunctionDeclaration = {
    name: 'analyzeFundingGoal',
    description: 'Analyzes a funding target.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            investorTypes: { type: Type.ARRAY, items: { type: Type.STRING } },
            strategicAdvice: { type: Type.STRING },
            nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['investorTypes', 'strategicAdvice', 'nextSteps']
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
    let responseType: any;

    switch (action) {
        case 'modifyContent':
            prompt = `Slide Title: "${params.slideTitle}"\nSlide Content: "${params.slideContent}"\nInstruction: ${params.instruction}\nRewrite content to be investor-ready. Call 'rewriteSlide'.`;
            toolConfig = { tools: [{ functionDeclarations: [rewriteSlideFunctionDeclaration] }] };
            break;
        case 'analyzeSlide':
            prompt = `Analyze this slide for Clarity, Impact, and Tone. Title: ${params.slideTitle} Content: ${params.slideContent}. Call 'analyzeSlideContent'.`;
            toolConfig = { tools: [{ functionDeclarations: [analyzeSlideContentFunctionDeclaration] }] };
            break;
        case 'suggestLayout':
            prompt = `Suggest layout. Title: ${params.slideTitle} Content: ${params.slideContent} Options: ${params.availableLayouts.join(', ')}. Call 'chooseLayout'.`;
            toolConfig = { tools: [{ functionDeclarations: [chooseLayoutFunctionDeclaration] }] };
            break;
        case 'fetchAllSuggestions':
            prompt = `Analyze slide "${params.slide.title}" for Copilot, Image, and Research suggestions. Call 'generateAllSuggestions'.`;
            toolConfig = { tools: [{ functionDeclarations: [generateAllSuggestionsFunctionDeclaration] }] };
            break;
        case 'suggestChart':
            prompt = `Analyze for bar chart data. Title: ${params.slideTitle} Content: ${params.slideContent}. Call 'suggestChart'.`;
            toolConfig = { tools: [{ functionDeclarations: [suggestChartFunctionDeclaration] }] };
            break;
        case 'suggestPieChart':
            prompt = `Analyze for pie chart data. Content: ${params.slideContent}. Call 'suggestPieChart'.`;
            toolConfig = { tools: [{ functionDeclarations: [suggestPieChartFunctionDeclaration] }] };
            break;
        case 'generateHeadlines':
            prompt = `Generate 5 headlines for: "${params.slideTitle}". Call 'generateHeadlineVariations'.`;
            toolConfig = { tools: [{ functionDeclarations: [generateHeadlineVariationsFunctionDeclaration] }] };
            break;
        case 'extractMetrics':
            prompt = `Extract metrics from: "${params.slideContent}". Call 'extractMetrics'.`;
            toolConfig = { tools: [{ functionDeclarations: [extractMetricsFunctionDeclaration] }] };
            break;
        case 'generatePricingTable':
            prompt = `Convert pricing text to table. Text: "${params.slideContent}". Call 'generatePricingTable'.`;
            toolConfig = { tools: [{ functionDeclarations: [generatePricingTableFunctionDeclaration] }] };
            break;
        case 'summarizeBio':
            prompt = `Summarize bio: "${params.bio}". Call 'summarizeBio'.`;
            toolConfig = { tools: [{ functionDeclarations: [summarizeBioFunctionDeclaration] }] };
            break;
        case 'generateFinancials':
            prompt = `Generate financial projections from assumptions: "${params.assumptions}". Call 'generateFinancials'.`;
            toolConfig = { tools: [{ functionDeclarations: [generateFinancialsFunctionDeclaration] }] };
            break;
        case 'generateSWOT':
            prompt = `Generate SWOT from: "${params.slideContent}". Call 'generateSWOTAnalysis'.`;
            toolConfig = { tools: [{ functionDeclarations: [generateSWOTAnalysisFunctionDeclaration] }] };
            break;
        case 'generateGTM':
            prompt = `Generate GTM summary for: "${params.context}". Call 'generateGTMStrategy'.`;
            toolConfig = { tools: [{ functionDeclarations: [generateGTMStrategyFunctionDeclaration] }] };
            break;
        case 'generateRoadmap':
             prompt = `Generate 4 strategic milestones for: "${params.context}". Call 'createRoadmapContent'.`;
             toolConfig = { tools: [{ functionDeclarations: [createRoadmapContentFunctionDeclaration] }] };
             break;
        case 'checkUpdates':
             const deckSummary = params.deck.slides.map((s: any) => `Slide: ${s.title}\nContent: ${s.content}`).join('\n\n');
             prompt = `Compare deck content with website ${params.url}. Call 'generateDeckUpdateSuggestions'.\nDeck:\n${deckSummary}`;
             toolConfig = { tools: [{ googleSearch: {} }, { functionDeclarations: [generateDeckUpdateSuggestionsFunctionDeclaration] }] };
             break;
        case 'analyzeFunding':
             prompt = `Analyze funding goal ${params.amount} for ${params.industry}. Call 'analyzeFundingGoal'.`;
             toolConfig = { tools: [{ functionDeclarations: [analyzeFundingGoalFunctionDeclaration] }] };
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
    
    // Special handling for roadmap to include image generation
    if (action === 'generateRoadmap' && call?.name === 'createRoadmapContent') {
        const milestones = call.args.milestones as string[];
        const content = milestones.join('\n');
        const imagePrompt = `A modern infographic timeline roadmap. Milestones: ${milestones.join(', ')}. Style: Clean, professional vector art, white background.`;
        
        const imageRes = await ai.models.generateContent({
             model: 'gemini-3-pro-image-preview',
             contents: { parts: [{ text: imagePrompt }] },
             config: { imageConfig: { aspectRatio: '16:9', imageSize: '2K' } }
        });
        
        let imageBase64 = '';
        if (imageRes.candidates && imageRes.candidates[0].content.parts) {
             for (const part of imageRes.candidates[0].content.parts) {
                 if (part.inlineData) {
                     imageBase64 = part.inlineData.data;
                     break;
                 }
             }
        }
        const imageUrl = imageBase64 ? `data:image/png;base64,${imageBase64}` : imagePrompt;
        
        return new Response(JSON.stringify({ 
            slide: {
                id: `slide-roadmap-${Date.now()}`,
                title: "Strategic Roadmap",
                content,
                imageUrl,
                type: 'roadmap',
                template: 'default'
            }
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (call) {
         return new Response(JSON.stringify(call.args), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
         });
    }

    throw new Error(`AI failed to perform action ${action}`);

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});