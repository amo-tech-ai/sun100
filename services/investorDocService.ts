
import { supabase } from '../lib/supabaseClient';
import { InvestorDoc } from './ai/types';

export const getInvestorDocs = async (): Promise<InvestorDoc[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Get startup_id
    const { data: startup } = await supabase
        .from('startups')
        .select('id')
        .eq('user_id', user.id)
        .single();

    if (!startup) return [];

    const { data, error } = await supabase
        .from('investor_docs')
        .select('*')
        .eq('startup_id', startup.id)
        .order('updated_at', { ascending: false });

    if (error) throw error;

    // Map DB fields to Frontend Types if necessary (snake_case to camelCase)
    return data.map((doc: any) => ({
        id: doc.id,
        title: doc.title,
        type: doc.type,
        status: doc.status,
        lastUpdated: new Date(doc.updated_at).toLocaleDateString(),
        content: doc.content,
        previewUrl: doc.preview_url
    }));
};

export const getInvestorDocById = async (id: string): Promise<InvestorDoc | null> => {
    const { data, error } = await supabase
        .from('investor_docs')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    
    return {
        id: data.id,
        title: data.title,
        type: data.type,
        status: data.status,
        lastUpdated: new Date(data.updated_at).toLocaleDateString(),
        content: data.content,
        previewUrl: data.preview_url
    };
};

export const saveInvestorDoc = async (doc: Omit<InvestorDoc, 'id' | 'lastUpdated'> & { id?: string }): Promise<InvestorDoc> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data: startup } = await supabase
        .from('startups')
        .select('id')
        .eq('user_id', user.id)
        .single();

    if (!startup) throw new Error("Startup profile not found");

    const payload = {
        id: doc.id,
        startup_id: startup.id,
        title: doc.title,
        type: doc.type,
        status: doc.status,
        content: doc.content,
        updated_at: new Date().toISOString(),
        // Ensure created_at is set on insert
        ...(doc.id ? {} : { created_at: new Date().toISOString() }) 
    };

    const { data, error } = await supabase
        .from('investor_docs')
        .upsert(payload)
        .select()
        .single();

    if (error) throw error;

    return {
        id: data.id,
        title: data.title,
        type: data.type,
        status: data.status,
        lastUpdated: new Date(data.updated_at).toLocaleDateString(),
        content: data.content
    };
};

export const deleteInvestorDoc = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('investor_docs')
        .delete()
        .eq('id', id);

    if (error) throw error;
};
