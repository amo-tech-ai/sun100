
import { supabase } from '../../lib/supabaseClient';
import { Contact } from './types';
import { getContext, cleanPayload } from './utils';
import { mockContacts, setMockContacts } from './mocks';

export const getContacts = async (accountId: string): Promise<Contact[]> => {
    const { isRealtime, startupId } = await getContext();

    if (!isRealtime) {
        return mockContacts.filter(c => c.accountId === accountId);
    }
    
    if (!startupId) return [];

    const { data, error } = await supabase
        .from('crm_contacts')
        .select('*')
        .eq('account_id', accountId)
        .order('first_name', { ascending: true });
    
    if (error) throw error;

    return data.map((c: any) => ({
        id: c.id,
        accountId: c.account_id,
        firstName: c.first_name,
        lastName: c.last_name || '',
        email: c.email,
        role: c.role || '',
        linkedin: c.linkedin_url,
        isPrimary: false
    }));
};

export const createContact = async (contact: Omit<Contact, 'id'>): Promise<Contact> => {
    const { isRealtime, startupId } = await getContext();

    if (!isRealtime || !startupId) {
        const newContact = { ...contact, id: `contact-${Date.now()}` };
        mockContacts.push(newContact);
        return newContact;
    }

    const { data, error } = await supabase
        .from('crm_contacts')
        .insert({
            startup_id: startupId,
            account_id: contact.accountId,
            first_name: contact.firstName,
            last_name: contact.lastName,
            email: contact.email,
            role: contact.role,
            linkedin_url: contact.linkedin
        })
        .select()
        .single();

    if (error) throw error;

    return {
        id: data.id,
        accountId: data.account_id,
        firstName: data.first_name,
        lastName: data.last_name || '',
        email: data.email,
        role: data.role || '',
        linkedin: data.linkedin_url,
        isPrimary: false
    };
};

export const updateContact = async (contactId: string, updates: Partial<Contact>): Promise<void> => {
    const { isRealtime } = await getContext();
    if (!isRealtime) {
        const idx = mockContacts.findIndex(c => c.id === contactId);
        if (idx >= 0) {
            const updated = [...mockContacts];
            updated[idx] = { ...updated[idx], ...updates };
            setMockContacts(updated);
        }
        return;
    }

    const payload = cleanPayload({
        first_name: updates.firstName,
        last_name: updates.lastName,
        email: updates.email,
        role: updates.role,
        linkedin_url: updates.linkedin
    });

    const { error } = await supabase.from('crm_contacts').update(payload).eq('id', contactId);
    if (error) throw error;
};

export const deleteContact = async (id: string): Promise<void> => {
    const { isRealtime } = await getContext();
    if (!isRealtime) {
        setMockContacts(mockContacts.filter(c => c.id !== id));
        return;
    }
    const { error } = await supabase.from('crm_contacts').delete().eq('id', id);
    if (error) throw error;
};
