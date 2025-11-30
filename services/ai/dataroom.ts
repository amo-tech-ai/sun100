
import { GoogleGenAI } from "@google/genai";
import { DataRoomAudit, DataRoomFile } from './types';
import { auditDataRoomFunctionDeclaration } from './prompts';

/**
 * Analyzes a list of files to determine data room readiness.
 */
export const auditDataRoom = async (files: DataRoomFile[], stage: string = "Series A"): Promise<DataRoomAudit> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Prepare the file list context for the AI
    const fileContext = files.map(f => `- ${f.name} (${f.category})`).join('\n');

    const prompt = `
    You are a Venture Capital Due Diligence Officer auditing a startup's data room for a ${stage} round.
    
    **Task:**
    Review the list of files provided by the founder. Compare it against a standard ${stage} due diligence checklist.
    Identify what is missing, what looks good, and assign a readiness score.
    
    **Provided Files:**
    ${fileContext}
    
    **Reasoning:**
    Use 'Thinking' to deduce if a file might satisfy a requirement even if named uniquely (e.g. "Employee_Agreements.pdf" covers "IP Assignment").
    
    Call 'auditDataRoom' with the results.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [auditDataRoomFunctionDeclaration] }],
                thinkingConfig: { thinkingBudget: 2048 }
            }
        });

        const call = response.functionCalls?.[0];
        
        if (call && call.name === 'auditDataRoom' && call.args) {
            return call.args as unknown as DataRoomAudit;
        }
        
        throw new Error("AI did not return a valid audit.");
    } catch (error) {
        console.error("Error auditing data room:", error);
        throw new Error("Failed to audit data room.");
    }
};
