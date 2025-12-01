
import { supabase } from '../lib/supabaseClient';
import { DataRoomFile, DataRoomAudit } from './ai/types';

const STORAGE_KEY_FILES = 'sun_ai_dataroom_files';
const STORAGE_KEY_AUDIT = 'sun_ai_dataroom_audit';

const DEFAULT_FILES: DataRoomFile[] = [
    { id: '1', name: 'Pitch_Deck_v3.pdf', category: 'Uncategorized', size: '2.4 MB', uploadDate: '2024-08-20' },
    { id: '2', name: 'Cap_Table_Draft.xlsx', category: 'Financials', size: '45 KB', uploadDate: '2024-08-22' },
    { id: '3', name: 'Incorporation_Docs.pdf', category: 'Legal', size: '1.2 MB', uploadDate: '2024-08-15' }
];

const getLocalFiles = (): DataRoomFile[] => {
    const stored = localStorage.getItem(STORAGE_KEY_FILES);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(DEFAULT_FILES));
    return DEFAULT_FILES;
};

const getLocalAudit = (): DataRoomAudit | null => {
    const stored = localStorage.getItem(STORAGE_KEY_AUDIT);
    return stored ? JSON.parse(stored) : null;
};

export const getDataRoomFiles = async (): Promise<DataRoomFile[]> => {
    if ((supabase as any).realtime) {
        // Real backend logic would go here
        return [];
    }
    return new Promise(resolve => setTimeout(() => resolve(getLocalFiles()), 300));
};

export const uploadDataRoomFile = async (file: Omit<DataRoomFile, 'id' | 'uploadDate'>): Promise<DataRoomFile> => {
    const newFile: DataRoomFile = {
        ...file,
        id: `file-${Date.now()}`,
        uploadDate: new Date().toISOString().split('T')[0]
    };

    const files = getLocalFiles();
    const updated = [...files, newFile];
    localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(updated));
    
    return new Promise(resolve => setTimeout(() => resolve(newFile), 500));
};

export const deleteDataRoomFile = async (id: string): Promise<void> => {
    const files = getLocalFiles();
    const updated = files.filter(f => f.id !== id);
    localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(updated));
    return new Promise(resolve => setTimeout(() => resolve(), 300));
};

export const saveDataRoomAudit = async (audit: DataRoomAudit): Promise<void> => {
    localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(audit));
    return new Promise(resolve => setTimeout(() => resolve(), 300));
};

export const getDataRoomAudit = async (): Promise<DataRoomAudit | null> => {
    return new Promise(resolve => setTimeout(() => resolve(getLocalAudit()), 300));
};
