
import { DataRoomAudit, DataRoomFile } from './types';
import { invokeEdgeFunction } from '../edgeFunctionService';

/**
 * Analyzes a list of files to determine data room readiness using a secure Edge Function.
 */
export const auditDataRoom = async (files: DataRoomFile[], stage: string = "Series A"): Promise<DataRoomAudit> => {
    // Prepare the file list context
    const fileList = files.map(f => ({ name: f.name, category: f.category }));

    return invokeEdgeFunction<DataRoomAudit>('investor-ai', { 
        action: 'auditDataRoom',
        files: fileList, 
        stage 
    });
};
