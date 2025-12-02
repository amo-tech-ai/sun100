
import { supabase } from '../../lib/supabaseClient';
import { TeamMember, Customer, Task, DealStage } from './types';
import { getContext } from './utils';
import { mockCustomers, mockTasks, mockInsights } from './mocks';
import { getCustomers } from './customers';
import { getTasks } from './tasks';
import { getPipeline } from './deals';
import { generateCRMInsights } from '../ai/crm';

export const getTeamMembers = async (): Promise<TeamMember[]> => {
    const { isRealtime, startupId } = await getContext();
    if (!isRealtime || !startupId) return [{ userId: '1', name: 'Me', role: 'Owner' }];

    const { data, error } = await supabase
        .from('team_members')
        .select('user_id, role, profiles(full_name, avatar_url)')
        .eq('startup_id', startupId);

    if (error) {
        console.error("Error fetching team members:", error);
        return [];
    }

    return data.map((m: any) => ({
        userId: m.user_id,
        name: m.profiles?.full_name || 'Unknown',
        role: m.role,
        avatar: m.profiles?.avatar_url
    }));
};

export const sendEmail = async (to: string, subject: string, body: string): Promise<void> => {
    const { isRealtime } = await getContext();
    if (!isRealtime) {
        await new Promise(r => setTimeout(r, 1500));
        console.log('Mock email sent to', to);
        return;
    }

    const { error } = await supabase.functions.invoke('send-email', {
        body: { to, subject, body }
    });

    if (error) throw error;
};

export const sendTaskNotification = async (assigneeId: string, task: any) => {
    try {
         const { data: profile } = await supabase
            .from('profiles')
            .select('email, full_name')
            .eq('id', assigneeId)
            .single();
        
        if (profile?.email) {
            await sendEmail(
                profile.email,
                `Task Assigned: ${task.title}`,
                `You have been assigned a new task in the CRM.\n\nTask: ${task.title}\nDue: ${task.due}`
            );
        }
    } catch (e) {
        console.error("Failed to send task notification email", e);
    }
};

/**
 * Main aggregation function for the CRM Dashboard
 */
export const getCRMData = async () => {
    const { isRealtime } = await getContext();

    // Calculate stats dynamically even for mock to reflect changes
    const fetchAndAgg = async (customerLoader: () => Promise<Customer[]>, pipelineLoader: () => Promise<DealStage[]>, taskLoader: () => Promise<Task[]>) => {
        const [customers, pipeline, tasks] = await Promise.all([
            customerLoader(),
            pipelineLoader(),
            taskLoader()
        ]);

        const totalCustomers = customers.length;
        const activeAccounts = customers.filter(c => c.status === 'Active').length;
        const atRisk = customers.filter(c => c.healthScore < 50).length;
        const totalRevenue = customers.reduce((sum, c) => sum + c.mrr, 0);

        // Fetch AI insights separately or use defaults
        let insights = mockInsights;
        try {
            // Only fetch real AI insights if realtime, otherwise keep mock
            if (isRealtime) {
                const generated = await generateCRMInsights(customers);
                if (generated && generated.length > 0) insights = generated.map((i: any) => ({ ...i, id: Math.random().toString() }));
            }
        } catch (e) {
            console.warn("Failed to generate AI insights for CRM:", e);
        }

        return {
            customers,
            stats: {
                totalCustomers,
                activeAccounts,
                renewalRate: 95, 
                atRisk,
                totalRevenue
            },
            pipeline,
            insights,
            tasks
        };
    };

    if (!isRealtime) {
        return fetchAndAgg(
            () => Promise.resolve(mockCustomers), 
            () => getPipeline(), 
            () => Promise.resolve(mockTasks)
        );
    }

    return fetchAndAgg(getCustomers, getPipeline, getTasks);
};
