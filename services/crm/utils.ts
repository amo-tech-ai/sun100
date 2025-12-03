
import { supabase, IS_MOCK_MODE } from '../../lib/supabaseClient';

/**
 * Checks if Supabase is connected and returns the startup_id for the current user.
 * Returns isRealtime: false if in mock mode or not authenticated.
 */
export const getContext = async (): Promise<{ isRealtime: boolean; startupId: string | null }> => {
    if (IS_MOCK_MODE) return { isRealtime: false, startupId: null };

    const { data: { user } } = await (supabase.auth as any).getUser();
    if (!user) return { isRealtime: true, startupId: null };

    const { data: membership } = await supabase
        .from('team_members')
        .select('startup_id')
        .eq('user_id', user.id)
        .maybeSingle();

    return { isRealtime: true, startupId: membership?.startup_id || null };
};

/**
 * Removes keys with undefined values from an object.
 */
export const cleanPayload = (payload: Record<string, any>) => {
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
    return payload;
};

/**
 * Exports data array to a CSV file download.
 */
export const exportToCSV = (data: any[], filename: string = 'export.csv') => {
    if (!data || !data.length) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(fieldName => {
            const value = row[fieldName]?.toString() || '';
            return `"${value.replace(/"/g, '""')}"`; // Escape double quotes
        }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};