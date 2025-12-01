
import { supabase } from '../lib/supabaseClient';
import { DataRoomFile, DataRoomAudit } from './ai/types';

export const getDataRoomFiles = async (): Promise<DataRoomFile[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: startup } = await supabase
        .from('startups')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
    if (!startup) return [];

    const { data, error } = await supabase
        .from('data_room_files')
        .select('*')
        .eq('startup_id', startup.id)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map((f: any) => ({
        id: f.id,
        name: f.name,
        category: f.category,
        size: f.size,
        uploadDate: new Date(f.created_at).toLocaleDateString()
    }));
};

export const uploadDataRoomFile = async (fileMeta: Omit<DataRoomFile, 'id' | 'uploadDate'>, fileBlob?: File): Promise<DataRoomFile> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data: startup } = await supabase.from('startups').select('id').eq('user_id', user.id).single();
    if (!startup) throw new Error("Startup not found");

    let storagePath = '';

    // 1. Upload to Storage if blob exists
    if (fileBlob) {
        const fileName = `${startup.id}/${Date.now()}-${fileMeta.name}`;
        const { data: storageData, error: storageError } = await supabase.storage
            .from('data-room')
            .upload(fileName, fileBlob);

        if (storageError) throw storageError;
        storagePath = storageData.path;
    }

    // 2. Insert Metadata
    const { data, error } = await supabase
        .from('data_room_files')
        .insert({
            startup_id: startup.id,
            name: fileMeta.name,
            category: fileMeta.category,
            size: fileMeta.size,
            storage_path: storagePath
        })
        .select()
        .single();

    if (error) throw error;

    return {
        id: data.id,
        name: data.name,
        category: data.category,
        size: data.size,
        uploadDate: new Date(data.created_at).toLocaleDateString()
    };
};

export const deleteDataRoomFile = async (id: string): Promise<void> => {
    // First get the file path to delete from storage
    const { data: fileRecord } = await supabase.from('data_room_files').select('storage_path').eq('id', id).single();
    
    if (fileRecord?.storage_path) {
        await supabase.storage.from('data-room').remove([fileRecord.storage_path]);
    }

    const { error } = await supabase.from('data_room_files').delete().eq('id', id);
    if (error) throw error;
};

export const saveDataRoomAudit = async (audit: DataRoomAudit): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: startup } = await supabase.from('startups').select('id').eq('user_id', user.id).single();
    if (!startup) return;

    // We upsert based on startup_id if we only want one active audit per startup
    const { error } = await supabase
        .from('data_room_audits')
        .upsert({
            startup_id: startup.id,
            score: audit.score,
            status: audit.status,
            found_categories: audit.found_categories,
            missing_items: audit.missing_items,
            warnings: audit.warnings,
            recommendations: audit.recommendations,
            updated_at: new Date().toISOString()
        });

    if (error) throw error;
};

export const getDataRoomAudit = async (): Promise<DataRoomAudit | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: startup } = await supabase.from('startups').select('id').eq('user_id', user.id).single();
    if (!startup) return null;

    const { data, error } = await supabase
        .from('data_room_audits')
        .select('*')
        .eq('startup_id', startup.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) console.error(error);
    
    if (!data) return null;

    return {
        score: data.score,
        status: data.status,
        found_categories: data.found_categories || [],
        missing_items: data.missing_items || [],
        warnings: data.warnings || [],
        recommendations: data.recommendations || []
    };
};
