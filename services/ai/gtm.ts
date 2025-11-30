
import { GoogleGenAI } from "@google/genai";
import { FullGTMStrategy, GTMInput } from './types';
import { generateFullGTMStrategyFunctionDeclaration } from './prompts';

/**
 * Generates a comprehensive Go-To-Market strategy using Gemini 3 Pro with Thinking.
 */
export const generateFullGTMStrategy = async (input: GTMInput): Promise<FullGTMStrategy> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
    Act as a Chief Marketing Officer and Product Strategist. 
    Create a detailed Go-To-Market (GTM) strategy for the following startup.
    
    **Startup Context:**
    - Name: ${input.startupName}
    - Industry: ${input.industry}
    - Stage: ${input.stage}
    - Target Audience: ${input.targetAudience}
    - Description: ${input.description}
    
    **Task:**
    Use 'Thinking' to analyze the market, competitive landscape (infer based on industry), and best channels for this specific stage.
    Then, generate a structured strategy document containing:
    1. Executive Summary
    2. Ideal Customer Profile (ICP) Analysis
    3. Value Proposition
    4. Prioritized Marketing Channels (with tactics)
    5. Pricing Strategy Recommendation
    6. 90-Day Launch Roadmap (Phased)
    7. Risks & Mitigations
    
    Call 'generateFullGTMStrategy' with the complete structured data.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [generateFullGTMStrategyFunctionDeclaration] }],
                thinkingConfig: { thinkingBudget: 4096 } // High thinking budget for strategic depth
            }
        });

        const call = response.functionCalls?.[0];
        
        if (call && call.name === 'generateFullGTMStrategy' && call.args) {
            return call.args as unknown as FullGTMStrategy;
        }
        
        throw new Error("AI did not return a valid GTM strategy.");
    } catch (error) {
        console.error("Error generating GTM strategy:", error);
        throw new Error("Failed to generate strategy. Please try again.");
    }
};
