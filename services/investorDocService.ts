
import { supabase } from '../lib/supabaseClient';
import { InvestorDoc } from './ai/types';

export const getInvestorDocs = async (): Promise<InvestorDoc[]> => {
    // Mock Mode Check
    if (!(supabase as any).realtime) return [];

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Get startup_id via team_members
    const { data: membership } = await supabase
        .from('team_members')
        .select('startup_id')
        .eq('user_id', user.id)
        .single();

    if (!membership) return [];

    const { data, error } = await supabase
        .from('investor_docs')
        .select('*')
        .eq('startup_id', membership.startup_id)
        .order('updated_at', { ascending: false });

    if (error) throw error;

    return data.map((doc: any) => ({
        id: doc.id,
        title: doc.title,
        type: doc.type,
        status: doc.status,
        lastUpdated: new Date(doc.updated_at).toLocaleDateString(),
        content: doc.content, // JSONB automatically parsed
        previewUrl: doc.preview_url
    }));
};

export const getInvestorDocById = async (id: string): Promise<InvestorDoc | null> => {
    if (!(supabase as any).realtime) return null;

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

    const { data: membership } = await supabase
        .from('team_members')
        .select('startup_id')
        .eq('user_id', user.id)
        .single();

    if (!membership) throw new Error("Startup profile not found");

    const payload = {
        // If update, use existing ID; if new, leave undefined for auto-gen
        ...(doc.id ? { id: doc.id } : {}),
        startup_id: membership.startup_id,
        title: doc.title,
        type: doc.type,
        status: doc.status,
        content: doc.content, // Postgres driver handles JSON object -> JSONB
        updated_at: new Date().toISOString(),
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
    if (!(supabase as any).realtime) return;
    const { error } = await supabase
        .from('investor_docs')
        .delete()
        .eq('id', id);

    if (error) throw error;
};
