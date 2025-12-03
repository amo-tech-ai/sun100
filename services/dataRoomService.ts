
import { supabase } from '../lib/supabaseClient';
import { DataRoomFile, DataRoomAudit } from './ai/types';

// Helper type to map frontend categories to DB Enum
const mapCategoryToEnum = (cat: string): 'Financial' | 'Legal' | 'Pitch Deck' | 'Product' | 'Market' | 'Other' => {
    const valid = ['Financial', 'Legal', 'Pitch Deck', 'Product', 'Market', 'Other'];
    return valid.includes(cat) ? (cat as any) : 'Other';
};

const MOCK_FILES: DataRoomFile[] = [
    { id: '1', name: 'Pitch Deck v3.pdf', category: 'Pitch Deck', size: '2.4 MB', uploadDate: 'Oct 24, 2024' },
    { id: '2', name: 'Financial Model.xlsx', category: 'Financial', size: '1.1 MB', uploadDate: 'Oct 22, 2024' },
    { id: '3', name: 'Certificate of Incorporation.pdf', category: 'Legal', size: '0.5 MB', uploadDate: 'Sep 15, 2024' },
    { id: '4', name: 'Cap Table.csv', category: 'Financial', size: '0.2 MB', uploadDate: 'Oct 20, 2024' },
];

export const getDataRoomFiles = async (): Promise<DataRoomFile[]> => {
    // Mock Mode Check
    if (!(supabase as any).realtime) return MOCK_FILES;

    const { data: { user } } = await (supabase.auth as any).getUser();
    if (!user) return [];

    const { data: membership } = await supabase
        .from('team_members')
        .select('startup_id')
        .eq('user_id', user.id)
        .single();
        
    if (!membership) return [];

    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('startup_id', membership.startup_id)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map((f: any) => ({
        id: f.id,
        name: f.name,
        category: f.category, // Enum matches frontend type
        size: f.size_bytes ? `${(f.size_bytes / 1024 / 1024).toFixed(2)} MB` : '0 MB',
        uploadDate: new Date(f.created_at).toLocaleDateString()
    }));
};

export const uploadDataRoomFile = async (fileMeta: Omit<DataRoomFile, 'id' | 'uploadDate'>, fileBlob?: File): Promise<DataRoomFile> => {
    // Mock upload
    if (!(supabase as any).realtime) {
        await new Promise(r => setTimeout(r, 800)); // Simulate network
        return {
            id: `file-${Date.now()}`,
            name: fileMeta.name,
            category: fileMeta.category,
            size: fileMeta.size,
            uploadDate: new Date().toLocaleDateString()
        };
    }

    const { data: { user } } = await (supabase.auth as any).getUser();
    if (!user) throw new Error("User not authenticated");

    const { data: membership } = await supabase
        .from('team_members')
        .select('startup_id')
        .eq('user_id', user.id)
        .single();

    if (!membership) throw new Error("Startup not found");

    let storagePath = '';
    let sizeBytes = 0;

    // 1. Upload to Storage if blob exists
    if (fileBlob) {
        sizeBytes = fileBlob.size;
        const fileName = `${membership.startup_id}/${Date.now()}-${fileMeta.name}`;
        const { data: storageData, error: storageError } = await supabase.storage
            .from('data-room') // Ensure this bucket exists in Supabase
            .upload(fileName, fileBlob);

        if (storageError) throw storageError;
        storagePath = storageData.path;
    }

    // 2. Insert Metadata into 'documents' table
    const { data, error } = await supabase
        .from('documents')
        .insert({
            startup_id: membership.startup_id,
            name: fileMeta.name,
            category: mapCategoryToEnum(fileMeta.category),
            size_bytes: sizeBytes,
            storage_path: storagePath
        })
        .select()
        .single();

    if (error) throw error;

    return {
        id: data.id,
        name: data.name,
        category: data.category,
        size: `${(data.size_bytes / 1024 / 1024).toFixed(2)} MB`,
        uploadDate: new Date(data.created_at).toLocaleDateString()
    };
};

export const deleteDataRoomFile = async (id: string): Promise<void> => {
    if (!(supabase as any).realtime) return;
    
    // First get the file path to delete from storage
    const { data: fileRecord } = await supabase.from('documents').select('storage_path').eq('id', id).single();
    
    if (fileRecord?.storage_path) {
        await supabase.storage.from('data-room').remove([fileRecord.storage_path]);
    }

    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error) throw error;
};

export const saveDataRoomAudit = async (audit: DataRoomAudit): Promise<void> => {
    const { data: { user } } = await (supabase.auth as any).getUser();
    if (!user) return;

    const { data: membership } = await supabase
        .from('team_members')
        .select('startup_id')
        .eq('user_id', user.id)
        .single();

    if (!membership) return;

    // Upsert into dataroom_status
    const { error } = await supabase
        .from('dataroom_status')
        .upsert({
            startup_id: membership.startup_id,
            readiness_score: audit.score,
            status: audit.status,
            found_categories: audit.found_categories,
            missing_items: audit.missing_items,
            warnings: audit.warnings,
            recommendations: audit.recommendations,
            last_audited_at: new Date().toISOString()
        });

    if (error) throw error;
};

export const getDataRoomAudit = async (): Promise<DataRoomAudit | null> => {
    // Mock Mode Check
    if (!(supabase as any).realtime) return null;

    const { data: { user } } = await (supabase.auth as any).getUser();
    if (!user) return null;

    const { data: membership } = await supabase
        .from('team_members')
        .select('startup_id')
        .eq('user_id', user.id)
        .single();

    if (!membership) return null;

    const { data, error } = await supabase
        .from('dataroom_status')
        .select('*')
        .eq('startup_id', membership.startup_id)
        .single();

    if (error) {
        if (error.code !== 'PGRST116') console.error(error);
        return null;
    }
    
    if (!data) return null;

    return {
        score: data.readiness_score,
        status: data.status,
        found_categories: data.found_categories || [],
        missing_items: data.missing_items || [],
        warnings: data.warnings || [],
        recommendations: data.recommendations || []
    };
};
