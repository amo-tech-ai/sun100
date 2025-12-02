
import { supabase } from '../../lib/supabaseClient';
import { Interaction } from './types';
import { getContext } from './utils';

export const getInteractions = async (accountId: string): Promise<Interaction[]> => {
    const { isRealtime } = await getContext();
     if (!isRealtime) {
         return [
             { id: '1', type: 'email', summary: 'Sent renewal proposal', date: '2 days ago', sentiment: 'Neutral' },
             { id: '2', type: 'call', summary: 'Quarterly check-in with Jane. She is happy with the new feature set.', date: '1 week ago', sentiment: 'Positive' }
         ];
     }

     const { data, error } = await supabase
        .from('crm_interactions')
        .select('*')
        .eq('account_id', accountId)
        .order('date', { ascending: false });
    
    if (error) return [];
    
    return data.map((i: any) => ({
        id: i.id,
        type: i.type,
        summary: i.summary,
        date: new Date(i.date).toLocaleDateString(),
        sentiment: i.sentiment
    }));
};

export const addInteraction = async (accountId: string, interaction: Omit<Interaction, 'id' | 'date'>): Promise<void> => {
     const { isRealtime, startupId } = await getContext();
     if (!isRealtime || !startupId) {
         console.log("Mock adding interaction", interaction);
         return;
     }

     const timestamp = new Date().toISOString();

     const { error } = await supabase.from('crm_interactions').insert({
         startup_id: startupId,
         account_id: accountId,
         type: interaction.type,
         summary: interaction.summary,
         sentiment: interaction.sentiment,
         date: timestamp
     });

     if (error) throw error;

     // Update Account's timestamp
     await supabase.from('crm_accounts')
        .update({ last_interaction_at: timestamp })
        .eq('id', accountId);
};
