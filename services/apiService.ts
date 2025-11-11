import { Slide, ChartData, TableData, Deck } from '../data/decks';
import { templates } from "../styles/templates";

// --- Type Definitions (could be shared with backend) ---
export interface DeckGenerationResult {
    title: string;
    slides: {
        id: string;
        title: string;
        content: string;
        imageUrl?: string;
        type: Slide['type'];
    }[];
}

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

// --- MOCK API FUNCTIONS ---
// This file simulates a service that would make fetch/axios calls to your backend API.
// e.g., fetch('/api/ai/generate-deck', { method: 'POST', body: JSON.stringify({ companyDetails }) })

const simulateApiCall = <T>(mockData: T, delay: number = 1500): Promise<T> => {
    console.log(`Simulating API call (will resolve in ${delay}ms)...`);
    return new Promise(resolve => setTimeout(() => resolve(mockData), delay));
};


export const generateDeckFromText = async (companyDetails: string): Promise<DeckGenerationResult> => {
    // In a real app, this would be a POST request to your backend
    // with `companyDetails` in the body.
    const mockResponse: DeckGenerationResult = {
        title: `AI-Generated Deck for ${companyDetails.substring(0, 20)}...`,
        slides: [
            { id: 'gen-1', title: 'Vision', content: 'Our goal is to revolutionize the market.', type: 'vision', imageUrl: 'futuristic city skyline' },
            { id: 'gen-2', title: 'Problem', content: 'The current solutions are inefficient and costly.', type: 'problem', imageUrl: 'tangled wires' },
            { id: 'gen-3', title: 'Solution', content: 'Our new platform solves this with AI.', type: 'solution', imageUrl: 'glowing brain icon' },
            { id: 'gen-4', title: 'Market Size', content: 'The target market is a $50B industry.', type: 'market', imageUrl: 'graphs showing market growth' },
            { id: 'gen-5', title: 'Our Product', content: 'A SaaS platform with a mobile app.', type: 'product', imageUrl: 'app screenshot on a phone' },
            { id: 'gen-6', title: 'Traction', content: 'We have 1000+ users on our waitlist.', type: 'traction', imageUrl: 'hockey stick growth chart' },
            { id: 'gen-7', title: 'Competition', content: 'Our main competitors are Legacy Inc. and SlowMover Co.', type: 'competition', imageUrl: 'a 2x2 matrix comparing features' },
            { id: 'gen-8', title: 'Team', content: 'Our team consists of industry experts.', type: 'team', imageUrl: 'team headshots' },
            { id: 'gen-9', title: 'Roadmap', content: 'Q1: Launch. Q2: Scale. Q3: Global Domination.', type: 'roadmap', imageUrl: 'a timeline graphic' },
            { id: 'gen-10', title: 'The Ask', content: 'We are seeking $1M for 10% equity.', type: 'ask', imageUrl: 'a piggy bank with a dollar sign' },
        ]
    };
    return simulateApiCall(mockResponse, 3000);
};

export const generateDeckFromUrls = async (urls: string[]): Promise<DeckGenerationResult> => {
    // In a real app, this would be a POST request to your backend with `urls` in the body.
    const mockResponse: DeckGenerationResult = {
        title: `AI-Generated Deck from ${urls[0]}`,
        slides: [
            { id: 'gen-1', title: 'Vision', content: 'Our goal is to revolutionize the market.', type: 'vision', imageUrl: 'futuristic city skyline' },
            { id: 'gen-2', title: 'Problem', content: 'The current solutions are inefficient and costly.', type: 'problem', imageUrl: 'tangled wires' },
            { id: 'gen-3', title: 'Solution', content: 'Our new platform solves this with AI.', type: 'solution', imageUrl: 'glowing brain icon' },
            { id: 'gen-4', title: 'Market Size', content: 'The target market is a $50B industry.', type: 'market', imageUrl: 'graphs showing market growth' },
            { id: 'gen-5', title: 'Our Product', content: 'A SaaS platform with a mobile app.', type: 'product', imageUrl: 'app screenshot on a phone' },
            { id: 'gen-6', title: 'Traction', content: 'We have 1000+ users on our waitlist.', type: 'traction', imageUrl: 'hockey stick growth chart' },
        ]
    };
    return simulateApiCall(mockResponse, 4000);
};

export const generateSlideImage = async (slideTitle: string, slideContent: string, promptOverride?: string): Promise<string> => {
    // This is a placeholder for a base64 encoded image string
    // A real backend would return the base64 string from the Gemini API
    const mockBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    return simulateApiCall(mockBase64, 2500);
};

export const editSlideImage = async (base64Data: string, mimeType: string, prompt: string): Promise<string> => {
    const mockBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="; // Different mock for visual change
    return simulateApiCall(mockBase64, 2500);
};

export const modifySlideContent = async (title: string, content: string, instruction: string): Promise<{ newTitle: string; newContent: string }> => {
    const mockResponse = {
        newTitle: `Modified: ${title}`,
        newContent: `Based on your instruction ("${instruction}"), the AI has rewritten the content.\n- This is the first new point.\n- This is the second new point.`
    };
    return simulateApiCall(mockResponse);
};

export const analyzeSlide = async (title: string, content: string): Promise<SlideAnalysis> => {
    const mockResponse: SlideAnalysis = {
        clarity: { rating: 'Good', feedback: 'The slide is clear and to the point.' },
        impact: { rating: 'Average', feedback: 'Consider adding a stronger statistic to increase impact.' },
        tone: { rating: 'Good', feedback: 'The tone is professional and appropriate.' },
    };
    return simulateApiCall(mockResponse);
};

export const researchTopic = async (query: string): Promise<ResearchResult> => {
    const mockResponse: ResearchResult = {
        summary: `This is a summary for "${query}". According to web sources, the market is growing at 20% year-over-year.`,
        sources: [{ uri: 'https://www.google.com/search?q=' + query, title: 'Simulated Web Search Result' }]
    };
    return simulateApiCall(mockResponse);
};

export const suggestLayout = async (title: string, content: string): Promise<keyof typeof templates> => {
    return simulateApiCall('professional');
};

export const fetchAllSuggestions = async (slide: Slide): Promise<{ copilotSuggestions: string[]; imageSuggestions: string[]; researchSuggestions: string[] }> => {
    const mockResponse = {
        copilotSuggestions: ['Make it more concise', 'Add a real-world example', `Rewrite for a ${slide.type} slide`],
        imageSuggestions: [`A visual metaphor for ${slide.title}`, 'Abstract background', 'A person interacting with the product'],
        researchSuggestions: [`Statistics about ${slide.title}`, `Market trends for ${slide.type}`, `Competitors in ${slide.type}`]
    };
    return simulateApiCall(mockResponse, 800);
};

export const suggestChart = async (title: string, content: string): Promise<ChartData | null> => {
    const mockResponse: ChartData = {
        type: 'bar',
        data: [
            { label: 'Q1', value: 100 },
            { label: 'Q2', value: 150 },
            { label: 'Q3', value: 120 },
            { label: 'Q4', value: 200 },
        ]
    };
    return Math.random() > 0.3 ? simulateApiCall(mockResponse) : simulateApiCall(null);
};

export const suggestPieChart = async (content: string): Promise<ChartData | null> => {
    const mockResponse: ChartData = {
        type: 'pie',
        data: [
            { label: 'R&D', value: 40 },
            { label: 'Marketing', value: 30 },
            { label: 'Sales', value: 20 },
            { label: 'Admin', value: 10 },
        ]
    };
    return Math.random() > 0.3 ? simulateApiCall(mockResponse) : simulateApiCall(null);
};


export const generateRoadmapSlide = async (companyContext: string, template: keyof typeof templates): Promise<Slide> => {
    const mockResponse: Slide = {
        id: `slide-${Date.now()}`,
        title: 'AI-Generated Roadmap',
        content: 'Q1: Launch MVP\nQ2: Onboard 1000 users\nQ3: Secure Seed Funding',
        imageUrl: 'futuristic timeline graphic',
        template: template,
        type: 'roadmap',
    };
    return simulateApiCall(mockResponse);
};

export const generateHeadlineVariations = async (currentTitle: string): Promise<string[]> => {
    const mockResponse = [
        `Alternative 1 for ${currentTitle}`,
        `Alternative 2 for ${currentTitle}`,
        `Alternative 3 for ${currentTitle}`,
    ];
    return simulateApiCall(mockResponse);
};

export const extractMetrics = async (content: string): Promise<ExtractedMetric[]> => {
    const mockResponse: ExtractedMetric[] = [
        { label: 'User Growth', value: '50%' },
        { label: 'Revenue', value: '$10,000 MRR' },
    ];
    return simulateApiCall(mockResponse);
};

export const generatePricingTable = async (productInfo: string): Promise<TableData> => {
    const mockResponse: TableData = {
        type: 'pricing',
        tiers: [
            { name: 'Basic', price: '$10/mo', features: ['Feature A', 'Feature B'] },
            { name: 'Pro', price: '$25/mo', features: ['Feature A', 'Feature B', 'Feature C'] },
            { name: 'Enterprise', price: 'Contact Us', features: ['All Features', 'Support'] },
        ]
    };
    return simulateApiCall(mockResponse);
};

export const summarizeBio = async (bioText: string): Promise<BioSummary> => {
    const mockResponse: BioSummary = {
        summary: 'This is an AI-generated summary of the provided biography.',
        highlights: ['Key Highlight 1', 'Key Highlight 2', 'Key Highlight 3'],
    };
    return simulateApiCall(mockResponse);
};