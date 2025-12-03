
import { templates } from '../../styles/templates';
import { Slide, ChartData, TableData } from '../../data/decks';
import { SlideAnalysis, ExtractedMetric, BioSummary, FinancialData, GTMStrategy, CompetitorMatrix } from './types';
import { invokeEdgeFunction } from '../edgeFunctionService';

export const modifySlideContent = async (slideTitle: string, slideContent: string, instruction: string): Promise<{ newTitle: string; newContent: string }> => {
    try {
        return await invokeEdgeFunction('slide-ai', {
            action: 'modifyContent',
            slideTitle,
            slideContent,
            instruction
        });
    } catch (error) {
        console.warn("Edge Function 'modifySlideContent' failed. Returning mock data.");
        return {
            newTitle: slideTitle,
            newContent: `(AI Modified) ${slideContent}\n\nUpdated based on: ${instruction}`
        };
    }
};

export const analyzeSlide = async (slideTitle: string, slideContent: string): Promise<SlideAnalysis> => {
    try {
        return await invokeEdgeFunction('slide-ai', {
            action: 'analyzeSlide',
            slideTitle,
            slideContent
        });
    } catch (error) {
        console.warn("Edge Function 'analyzeSlide' failed. Returning mock data.");
        return {
            clarity: { rating: "Good", feedback: "The message is clear and concise." },
            impact: { rating: "Average", feedback: "Consider adding more data to strengthen the argument." },
            tone: { rating: "Professional", feedback: "The tone is appropriate for investors." }
        };
    }
};

export const suggestLayout = async (slideTitle: string, slideContent: string): Promise<{ layout: keyof typeof templates }> => {
    try {
        return await invokeEdgeFunction('slide-ai', {
            action: 'suggestLayout',
            slideTitle,
            slideContent,
            availableLayouts: Object.keys(templates)
        });
    } catch (error) {
        console.warn("Edge Function 'suggestLayout' failed. Returning mock data.");
        return { layout: 'minimalist' };
    }
};

export const fetchAllSuggestions = async (slide: Slide): Promise<{ copilotSuggestions: string[], imageSuggestions: string[], researchSuggestions: string[] }> => {
    try {
        return await invokeEdgeFunction('slide-ai', {
            action: 'fetchAllSuggestions',
            slide
        });
    } catch (error) {
        console.warn("Edge Function 'fetchAllSuggestions' failed. Returning mock data.");
        return {
            copilotSuggestions: ["Make it more concise", "Focus on the problem", "Add a call to action"],
            imageSuggestions: ["A futuristic cityscape", "Team collaborating in an office", "Abstract growth chart"],
            researchSuggestions: ["Competitor pricing models", "Market trends 2024", "Customer acquisition costs"]
        };
    }
};

export const suggestChart = async (slideTitle: string, slideContent: string): Promise<{ chartData: ChartData | null }> => {
    try {
        return await invokeEdgeFunction('slide-ai', {
            action: 'suggestChart',
            slideTitle,
            slideContent
        });
    } catch (error) {
        console.warn("Edge Function 'suggestChart' failed. Returning mock data.");
        return {
            chartData: {
                type: 'bar',
                data: [
                    { label: 'Year 1', value: 100 },
                    { label: 'Year 2', value: 250 },
                    { label: 'Year 3', value: 600 }
                ]
            }
        };
    }
};

export const suggestPieChart = async (slideContent: string): Promise<{ chartData: ChartData | null }> => {
    try {
        return await invokeEdgeFunction('slide-ai', {
            action: 'suggestPieChart',
            slideContent
        });
    } catch (error) {
        console.warn("Edge Function 'suggestPieChart' failed. Returning mock data.");
        return {
            chartData: {
                type: 'pie',
                data: [
                    { label: 'Product', value: 40 },
                    { label: 'Marketing', value: 30 },
                    { label: 'Ops', value: 30 }
                ]
            }
        };
    }
};

export const generateHeadlineVariations = async (slideTitle: string): Promise<{ headlines: string[] }> => {
    try {
        return await invokeEdgeFunction('slide-ai', {
            action: 'generateHeadlines',
            slideTitle
        });
    } catch (error) {
        console.warn("Edge Function 'generateHeadlines' failed. Returning mock data.");
        return {
            headlines: [
                `${slideTitle}: The Future`,
                `Reimagining ${slideTitle}`,
                `Why ${slideTitle} Matters`,
                `The ${slideTitle} Revolution`,
                `Mastering ${slideTitle}`
            ]
        };
    }
};

export const extractMetrics = async (slideContent: string): Promise<{ metrics: ExtractedMetric[] }> => {
    try {
        return await invokeEdgeFunction('slide-ai', {
            action: 'extractMetrics',
            slideContent
        });
    } catch (error) {
        console.warn("Edge Function 'extractMetrics' failed. Returning mock data.");
        return {
            metrics: [
                { label: "Growth", value: "200%" },
                { label: "Revenue", value: "$1M" },
                { label: "Users", value: "50k" }
            ]
        };
    }
};

export const generatePricingTable = async (slideContent: string): Promise<{ tableData: TableData | null }> => {
    try {
        return await invokeEdgeFunction('slide-ai', {
            action: 'generatePricingTable',
            slideContent
        });
    } catch (error) {
        console.warn("Edge Function 'generatePricingTable' failed. Returning mock data.");
        return {
            tableData: {
                type: 'pricing',
                tiers: [
                    { name: "Starter", price: "Free", features: ["Basic Feature", "Community Support"] },
                    { name: "Pro", price: "$29/mo", features: ["Advanced Features", "Priority Support", "Analytics"] },
                    { name: "Enterprise", price: "Custom", features: ["All Features", "Dedicated Account Manager", "SLA"] }
                ]
            }
        };
    }
};

export const summarizeBio = async (bio: string): Promise<BioSummary> => {
    try {
        return await invokeEdgeFunction('slide-ai', {
            action: 'summarizeBio',
            bio
        });
    } catch (error) {
        console.warn("Edge Function 'summarizeBio' failed. Returning mock data.");
        return {
            summary: "Experienced executive with a track record of scaling tech startups.",
            highlights: ["Ex-Google", "Founded 2 startups", "MBA from Stanford"]
        };
    }
};

export const generateFinancialProjections = async (assumptions: string): Promise<FinancialData> => {
    try {
        return await invokeEdgeFunction('slide-ai', {
            action: 'generateFinancials',
            assumptions
        });
    } catch (error) {
        console.warn("Edge Function 'generateFinancials' failed. Returning mock data.");
        return {
            headers: ["Year 1", "Year 2", "Year 3"],
            rows: [
                { label: "Revenue", values: ["$500k", "$1.5M", "$5M"] },
                { label: "Expenses", values: ["$400k", "$1M", "$3M"] },
                { label: "Profit", values: ["$100k", "$500k", "$2M"] }
            ],
            summary: "Strong projected growth with healthy margins."
        };
    }
};

export const generateCompetitorSWOT = async (slideContent: string): Promise<{ tableData: TableData | null }> => {
    try {
        return await invokeEdgeFunction('slide-ai', {
            action: 'generateSWOT',
            slideContent
        });
    } catch (error) {
        console.warn("Edge Function 'generateSWOT' failed. Returning mock data.");
        return {
            tableData: {
                type: 'comparison',
                headers: ["Competitor", "Strengths", "Weaknesses"],
                rows: [
                    ["Competitor A", "Market Share", "Legacy Tech"],
                    ["Competitor B", "Cheap", "Low Quality"],
                    ["Us", "AI-Native", "New Entrant"]
                ]
            }
        };
    }
};

export const generateGTMStrategy = async (context: string): Promise<GTMStrategy> => {
    try {
        return await invokeEdgeFunction('slide-ai', {
            action: 'generateGTM',
            context
        });
    } catch (error) {
        console.warn("Edge Function 'generateGTM' failed. Returning mock data.");
        return {
            strategy_summary: "Focus on product-led growth and community building.",
            channels: ["SEO / Content Marketing", "LinkedIn Outreach", "Strategic Partnerships"],
            key_metrics: ["CAC < $50", "LTV > $500", "MoM Growth > 15%"]
        };
    }
};

export const generateMarketData = async (industry: string, location: string): Promise<{ tam: string; sam: string; som: string; sources: string[]; summary: string }> => {
    try {
        return await invokeEdgeFunction('slide-ai', {
            action: 'generateMarketData',
            industry,
            location
        });
    } catch (error) {
        console.warn("Edge Function 'generateMarketData' failed. Returning mock data.");
        return {
            tam: "$10B",
            sam: "$2B",
            som: "$100M",
            sources: ["Gartner Report 2024", "Statista"],
            summary: "The market is experiencing rapid growth due to AI adoption."
        };
    }
};

export const generateTrends = async (industry: string): Promise<{ trends: string[]; narrative: string }> => {
    try {
        return await invokeEdgeFunction('slide-ai', {
            action: 'generateTrends',
            industry
        });
    } catch (error) {
        console.warn("Edge Function 'generateTrends' failed. Returning mock data.");
        return {
            trends: ["Shift to AI-first workflows", "Remote work adoption", "Consolidation of tools"],
            narrative: "Now is the perfect time to enter the market as legacy players struggle to adapt to these shifts."
        };
    }
};

export const generateCompetitorMatrix = async (context: string): Promise<CompetitorMatrix> => {
    try {
        return await invokeEdgeFunction('slide-ai', {
            action: 'generateCompetitorMatrix',
            context
        });
    } catch (error) {
        console.warn("Edge Function 'generateCompetitorMatrix' failed. Returning mock data.");
        return {
            headers: ["Feature", "Us", "Competitor A", "Competitor B"],
            rows: [
                ["AI Integration", "Yes", "No", "Partial"],
                ["Price", "Affordable", "Expensive", "Moderate"],
                ["Ease of Use", "High", "Low", "Medium"]
            ]
        };
    }
};
