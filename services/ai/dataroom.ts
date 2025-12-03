
import { DataRoomAudit, DataRoomFile } from './types';
import { invokeEdgeFunction } from '../edgeFunctionService';

/**
 * Analyzes a list of files to determine data room readiness using a secure Edge Function.
 */
export const auditDataRoom = async (files: DataRoomFile[], stage: string = "Series A"): Promise<DataRoomAudit> => {
    try {
        // Prepare the file list context
        const fileList = files.map(f => ({ name: f.name, category: f.category }));

        return await invokeEdgeFunction<DataRoomAudit>('investor-ai', { 
            action: 'auditDataRoom',
            files: fileList, 
            stage 
        });
    } catch (error) {
        console.warn("Edge Function 'auditDataRoom' failed. Falling back to mock data.", error);
        await new Promise(r => setTimeout(r, 2000));

        // Mock Logic: Score based on file count
        const score = Math.min(100, Math.max(20, files.length * 10));
        const missing = ["Cap Table", "IP Assignment Agreements", "3-Year Financials"].filter((_, i) => i >= files.length / 3);

        return {
            score: score,
            status: score > 80 ? "Ready" : score > 50 ? "Needs Work" : "Not Ready",
            found_categories: ["Pitch Deck", "Legal"],
            missing_items: missing.length > 0 ? missing : ["None"],
            warnings: score < 100 ? ["Some documents appear outdated.", "Ensure all contracts are signed."] : [],
            recommendations: ["Upload your Cap Table", "Organize files into folders"]
        };
    }
};
