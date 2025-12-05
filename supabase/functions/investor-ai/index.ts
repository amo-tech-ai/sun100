
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI, Type } from "npm:@google/genai";

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// --- Function Declarations ---

const generateOnePagerFunctionDeclaration = {
    name: 'generateOnePager',
    description: 'Synthesizes startup data into a dense, high-impact One-Pager format.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            headline: { type: Type.STRING },
            problem_summary: { type: Type.STRING },
            solution_summary: { type: Type.STRING },
            market_opportunity: { type: Type.STRING },
            traction_highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
            business_model: { type: Type.STRING },
            ask: { type: Type.STRING },
            contact_info: { type: Type.OBJECT, properties: { email: { type: Type.STRING }, website: { type: Type.STRING } } }
        },
        required: ["headline", "problem_summary", "solution_summary", "traction_highlights", "ask"]
    }
};

const generateMarketSizingFunctionDeclaration = {
    name: 'generateMarketSizing',
    description: 'Calculates TAM, SAM, and SOM based on industry data and logic.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            icp: { type: Type.STRING },
            beachhead: { type: Type.STRING },
            tam: { type: Type.OBJECT, properties: { value: { type: Type.STRING }, description: { type: Type.STRING }, sourceUrl: { type: Type.STRING } }, required: ['value', 'description'] },
            sam: { type: Type.OBJECT, properties: { value: { type: Type.STRING }, description: { type: Type.STRING }, sourceUrl: { type: Type.STRING } }, required: ['value', 'description'] },
            som: { type: Type.OBJECT, properties: { value: { type: Type.STRING }, description: { type: Type.STRING }, sourceUrl: { type: Type.STRING } }, required: ['value', 'description'] },
            methodology: { type: Type.STRING }
        },
        required: ['icp', 'beachhead', 'tam', 'sam', 'som', 'methodology']
    }
};

const generateInvestorUpdateFunctionDeclaration = {
    name: 'generateInvestorUpdate',
    description: 'Drafts a structured, metric-driven monthly investor update email.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            subject_line: { type: Type.STRING },
            status_emoji: { type: Type.STRING },
            status_summary: { type: Type.STRING },
            highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
            lowlights: { type: Type.ARRAY, items: { type: Type.STRING } },
            kpi_summary: { type: Type.STRING },
            ask: { type: Type.STRING }
        },
        required: ["subject_line", "status_emoji", "status_summary", "highlights", "lowlights", "kpi_summary", "ask"]
    }
};

const analyzeStartupStrategyFunctionDeclaration = {
    name: 'analyzeStartupStrategy',
    description: 'Performs a strategic analysis (SWOT, Investor Readiness) of a startup.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            investorReadinessScore: { type: Type.NUMBER },
            readinessReasoning: { type: Type.STRING },
            swot: {
                type: Type.OBJECT,
                properties: {
                    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                    opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                    threats: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['strengths', 'weaknesses', 'opportunities', 'threats']
            },
            marketTrends: { type: Type.ARRAY, items: { type: Type.STRING } },
            keyCompetitors: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['investorReadinessScore', 'readinessReasoning', 'swot', 'marketTrends', 'keyCompetitors']
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

const generateInvestmentMemoFunctionDeclaration = {
    name: 'generateInvestmentMemo',
    description: 'Generates a critical Investment Memo analyzing a startup\'s potential and risks.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            investment_thesis: { type: Type.STRING },
            key_risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            market_dynamics: { type: Type.STRING },
            competitor_analysis: { type: Type.STRING },
            team_assessment: { type: Type.STRING },
            verdict_score: { type: Type.NUMBER },
            verdict_summary: { type: Type.STRING }
        },
        required: ["investment_thesis", "key_risks", "market_dynamics", "competitor_analysis", "team_assessment", "verdict_score", "verdict_summary"]
    }
};

const generateFullGTMStrategyFunctionDeclaration = {
    name: 'generateFullGTMStrategy',
    description: 'Generates a comprehensive, multi-section GTM strategy document.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            executiveSummary: { type: Type.STRING },
            icp: {
                type: Type.OBJECT,
                properties: {
                    personaName: { type: Type.STRING },
                    painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                    motivations: { type: Type.ARRAY, items: { type: Type.STRING } },
                    role: { type: Type.STRING }
                },
                required: ['personaName', 'painPoints', 'motivations', 'role']
            },
            valueProposition: { type: Type.OBJECT, properties: { headline: { type: Type.STRING }, benefits: { type: Type.ARRAY, items: { type: Type.STRING } }, differentiators: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ['headline', 'benefits', 'differentiators'] },
            channels: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, type: { type: Type.STRING }, tactic: { type: Type.STRING }, priority: { type: Type.STRING } }, required: ['name', 'type', 'tactic', 'priority'] } },
            pricingStrategy: { type: Type.OBJECT, properties: { model: { type: Type.STRING }, recommendation: { type: Type.STRING }, tiers: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, price: { type: Type.STRING }, features: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ['name', 'price', 'features'] } } }, required: ['model', 'recommendation', 'tiers'] },
            launchRoadmap: { type: Type.OBJECT, properties: { phase1: { type: Type.OBJECT, properties: { name: {type: Type.STRING}, duration: {type: Type.STRING}, focus: {type: Type.STRING}, tasks: {type: Type.ARRAY, items: {type: Type.STRING}} } }, phase2: { type: Type.OBJECT, properties: { name: {type: Type.STRING}, duration: {type: Type.STRING}, focus: {type: Type.STRING}, tasks: {type: Type.ARRAY, items: {type: Type.STRING}} } }, phase3: { type: Type.OBJECT, properties: { name: {type: Type.STRING}, duration: {type: Type.STRING}, focus: {type: Type.STRING}, tasks: {type: Type.ARRAY, items: {type: Type.STRING}} } } }, required: ['phase1', 'phase2', 'phase3'] },
            risks: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { risk: { type: Type.STRING }, mitigation: { type: Type.STRING }, severity: { type: Type.STRING } }, required: ['risk', 'mitigation', 'severity'] } }
        },
        required: ['executiveSummary', 'icp', 'valueProposition', 'channels', 'pricingStrategy', 'launchRoadmap', 'risks']
    }
};

const analyzeInvestorFitFunctionDeclaration = {
    name: 'analyzeInvestorFit',
    description: 'Analyzes the compatibility between a startup and an investor.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            matchScore: { type: Type.NUMBER },
            status: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            alignment: {
                type: Type.OBJECT,
                properties: { stage: { type: Type.BOOLEAN }, check_size: { type: Type.BOOLEAN }, industry: { type: Type.BOOLEAN }, geo: { type: Type.BOOLEAN } },
                required: ['stage', 'check_size', 'industry', 'geo']
            },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendedAction: { type: Type.STRING }
        },
        required: ['matchScore', 'status', 'reasoning', 'alignment', 'strengths', 'risks', 'recommendedAction']
    }
};

const rankInvestorsFunctionDeclaration = {
    name: 'rankInvestors',
    description: 'Ranks a list of investors based on fit.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            matches: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: { investorId: { type: Type.STRING }, investorName: { type: Type.STRING }, matchScore: { type: Type.NUMBER }, reasoning: { type: Type.STRING } },
                    required: ['investorId', 'investorName', 'matchScore', 'reasoning']
                }
            }
        },
        required: ['matches']
    }
};

const auditDataRoomFunctionDeclaration = {
    name: 'auditDataRoom',
    description: 'Audits a list of filenames for due diligence readiness.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            score: { type: Type.NUMBER },
            status: { type: Type.STRING },
            found_categories: { type: Type.ARRAY, items: { type: Type.STRING } },
            missing_items: { type: Type.ARRAY, items: { type: Type.STRING } },
            warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['score', 'status', 'found_categories', 'missing_items', 'warnings', 'recommendations']
    }
};

const enrichStartupProfileFunctionDeclaration = {
    name: 'enrichStartupProfile',
    description: 'Generates professional startup profile content from a website URL or brief description.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            tagline: { type: Type.STRING, description: "A catchy, one-sentence value proposition." },
            description: { type: Type.STRING, description: "A concise 2-3 sentence company description." },
            industry: { type: Type.STRING, description: "The primary industry/sector." },
            mission: { type: Type.STRING, description: "A powerful mission statement." },
        },
        required: ['tagline', 'description', 'industry', 'mission']
    }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { action, ...params } = await req.json();
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) throw new Error("API_KEY not set");

    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-3-pro-preview';
    
    let prompt = '';
    let toolConfig = {};
    let targetFunction = '';

    switch (action) {
        case 'generateOnePager':
            prompt = `Generate a One-Pager for: ${JSON.stringify(params.startupProfile)}. Call 'generateOnePager'.`;
            toolConfig = { tools: [{ functionDeclarations: [generateOnePagerFunctionDeclaration] }] };
            targetFunction = 'generateOnePager';
            break;
        case 'generateMarketSizing':
            prompt = `Calculate TAM/SAM/SOM for ${params.industry} in ${params.location}. Business Model: ${params.businessModel}. Use Google Search for 2024/2025 data. Call 'generateMarketSizing'.`;
            toolConfig = { tools: [{ googleSearch: {} }, { functionDeclarations: [generateMarketSizingFunctionDeclaration] }] };
            targetFunction = 'generateMarketSizing';
            break;
        case 'generateInvestorUpdate':
            prompt = `Draft Investor Update. Current: ${JSON.stringify(params.currentMetrics)}. Previous: ${JSON.stringify(params.previousMetrics)}. Notes: ${params.notes}. Call 'generateInvestorUpdate'.`;
            toolConfig = { tools: [{ functionDeclarations: [generateInvestorUpdateFunctionDeclaration] }] };
            targetFunction = 'generateInvestorUpdate';
            break;
        case 'analyzeStartupStrategy':
            prompt = `Act as a Venture Capitalist. Analyze the viability of this startup based on the context provided: "${params.profileContext}". 
            
            Calculate a 'Viability Score' (mapped to investorReadinessScore 0-100) based on:
            1. Team (30%): Experience, exits, domain expertise.
            2. Market (30%): Size (TAM), growth trends, timing.
            3. Product (20%): Solution clarity, differentiators.
            4. Traction (20%): Revenue, users, growth rate vs stage.

            Provide a 'readinessReasoning' summary explaining this viability score.
            Perform a SWOT analysis.
            Use Google Search to validate market trends if needed.
            Call 'analyzeStartupStrategy'.`;
            toolConfig = { tools: [{ googleSearch: {} }, { functionDeclarations: [analyzeStartupStrategyFunctionDeclaration] }] };
            targetFunction = 'analyzeStartupStrategy';
            break;
        case 'generateFinancialForecast':
            prompt = `Project 3 years of financials based on: ${JSON.stringify(params.historicalMetrics)}. Call 'generateFinancials'.`;
            toolConfig = { tools: [{ functionDeclarations: [generateFinancialsFunctionDeclaration] }] };
            targetFunction = 'generateFinancials';
            break;
        case 'generateInvestmentMemo':
            prompt = `Write a VC Investment Memo for: ${JSON.stringify(params.startupProfile)}. Be critical. Call 'generateInvestmentMemo'.`;
            toolConfig = { tools: [{ googleSearch: {} }, { functionDeclarations: [generateInvestmentMemoFunctionDeclaration] }], thinkingConfig: { thinkingBudget: 2048 } };
            targetFunction = 'generateInvestmentMemo';
            break;
        case 'generateFullGTM':
            prompt = `Create a GTM Strategy for: ${JSON.stringify(params.input)}. Use Google Search for channel benchmarks. Call 'generateFullGTMStrategy'.`;
            toolConfig = { tools: [{ googleSearch: {} }, { functionDeclarations: [generateFullGTMStrategyFunctionDeclaration] }], thinkingConfig: { thinkingBudget: 4096 } };
            targetFunction = 'generateFullGTMStrategy';
            break;
        case 'askInvestorData':
            const chatPrompt = `You are a financial analyst. Context Metrics: ${JSON.stringify(params.metricsContext)}. User Query: ${params.query}. Answer the user using the metrics provided.`;
            const chatRes = await ai.models.generateContent({ model, contents: chatPrompt });
            return new Response(JSON.stringify({ response: chatRes.text }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        case 'matchInvestor':
            prompt = `Analyze fit between Startup: ${JSON.stringify(params.startup)} and Investor: ${JSON.stringify(params.investorProfile)}. Call 'analyzeInvestorFit'.`;
            toolConfig = { tools: [{ functionDeclarations: [analyzeInvestorFitFunctionDeclaration] }] };
            targetFunction = 'analyzeInvestorFit';
            break;
        case 'rankInvestors':
            prompt = `Rank these investors for the startup. Startup: ${JSON.stringify(params.startup)}. Investors: ${JSON.stringify(params.investors)}. Call 'rankInvestors'.`;
            toolConfig = { tools: [{ functionDeclarations: [rankInvestorsFunctionDeclaration] }] };
            targetFunction = 'rankInvestors';
            break;
        case 'auditDataRoom':
            prompt = `Audit this data room file list for a ${params.stage} round. Files: ${JSON.stringify(params.files)}. Identify missing items. Call 'auditDataRoom'.`;
            toolConfig = { tools: [{ functionDeclarations: [auditDataRoomFunctionDeclaration] }] };
            targetFunction = 'auditDataRoom';
            break;
        case 'enrichStartupProfile':
            prompt = `Analyze the startup "${params.name}" ${params.website ? `(${params.website})` : ''}. Initial Pitch: "${params.pitch}".
            Use Google Search to find more context if a website is provided or if the company is known.
            Generate a professional profile including a tagline, description, industry, and mission. 
            Call 'enrichStartupProfile'.`;
            toolConfig = { tools: [{ googleSearch: {} }, { functionDeclarations: [enrichStartupProfileFunctionDeclaration] }] };
            targetFunction = 'enrichStartupProfile';
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

    if (call && call.name === targetFunction) {
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
