
import { supabase } from '../../lib/supabaseClient';
import { Task } from './types';
import { getContext, cleanPayload } from './utils';
import { mockTasks, setMockTasks } from './mocks';
import { sendTaskNotification } from './general';

export interface TaskOptions {
    accountId?: string;
    limit?: number;
    status?: 'all' | 'completed' | 'active';
    priority?: string;
}

export const getTasks = async (options: TaskOptions = {}): Promise<Task[]> => {
    const { isRealtime, startupId } = await getContext();
    const { accountId, limit, status, priority } = options;
    
    if (!isRealtime) {
        let filtered = accountId ? mockTasks.filter(t => t.accountId === accountId) : mockTasks;
        
        if (status === 'active') filtered = filtered.filter(t => !t.completed);
        else if (status === 'completed') filtered = filtered.filter(t => t.completed);
        
        if (priority) filtered = filtered.filter(t => t.priority === priority);
        
        // Sort by due date ascending
        filtered.sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());
        
        return limit ? filtered.slice(0, limit) : filtered;
    }
    
    if (!startupId) return [];

    let query = supabase
        .from('crm_tasks')
        .select('*, profiles:assigned_to(full_name)')
        .eq('startup_id', startupId)
        .order('due_date', { ascending: true });
        
    if (accountId) {
        query = query.eq('account_id', accountId);
    }
    
    if (status === 'active') {
        query = query.eq('completed', false);
    } else if (status === 'completed') {
        query = query.eq('completed', true);
    }
    
    if (priority) {
        query = query.eq('priority', priority);
    }

    if (limit) {
        query = query.limit(limit);
    }
    
    const { data, error } = await query;
    if (error) return [];

    return data.map((t: any) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        due: new Date(t.due_date).toLocaleDateString(),
        completed: t.completed,
        priority: t.priority || 'medium',
        tags: t.tags || [],
        assignee: t.profiles?.full_name || 'Unknown',
        assigneeId: t.assigned_to,
        accountId: t.account_id
    }));
};

export const addTask = async (task: Omit<Task, 'id'> & { accountId?: string, notify?: boolean }): Promise<void> => {
    const { isRealtime, startupId } = await getContext();

    if (!isRealtime || !startupId) {
        const newTask = { 
            ...task, 
            id: Math.random().toString(), 
            completed: false, 
            priority: task.priority || 'medium',
            tags: task.tags || [],
            assignee: task.assignee, 
            due: task.due 
        };
        mockTasks.push(newTask);
        if (task.notify) console.log(`[Mock] Sending email notification for task: ${task.title}`);
        return;
    }

    const assigneeId = task.assigneeId || (await (supabase.auth as any).getUser()).data.user?.id;

    const { error } = await supabase.from('crm_tasks').insert({
        startup_id: startupId,
        account_id: task.accountId,
        title: task.title,
        description: task.description,
        due_date: new Date(task.due).toISOString(),
        completed: task.completed,
        priority: task.priority || 'medium',
        tags: task.tags || [],
        assigned_to: assigneeId
    });

    if (error) throw error;

    if (task.notify && assigneeId) {
        sendTaskNotification(assigneeId, task);
    }
};

export const updateTask = async (id: string, updates: Partial<Omit<Task, 'id'>>): Promise<void> => {
    const { isRealtime } = await getContext();

    if (!isRealtime) {
        const idx = mockTasks.findIndex(t => t.id === id);
        if (idx >= 0) {
            const updated = [...mockTasks];
            updated[idx] = { ...updated[idx], ...updates };
            setMockTasks(updated);
        }
        return;
    }

    const payload = cleanPayload({
        due_date: updates.due ? new Date(updates.due).toISOString() : undefined,
        assigned_to: updates.assigneeId,
        account_id: updates.accountId,
        priority: updates.priority,
        tags: updates.tags,
        title: updates.title,
        description: updates.description,
        completed: updates.completed
    });

    const { error } = await supabase.from('crm_tasks').update(payload).eq('id', id);
    if (error) throw error;
};

export const deleteTask = async (id: string): Promise<void> => {
    const { isRealtime } = await getContext();
    if (!isRealtime) {
        const idx = mockTasks.findIndex(t => t.id === id);
        if (idx >= 0) {
            const updated = [...mockTasks];
            updated.splice(idx, 1);
            setMockTasks(updated);
        }
        return;
    }
    const { error } = await supabase.from('crm_tasks').delete().eq('id', id);
    if (error) throw error;
};

export const toggleTask = async (id: string, completed: boolean): Promise<void> => {
    const { isRealtime } = await getContext();
    if (!isRealtime) {
        const idx = mockTasks.findIndex(t => t.id === id);
        if (idx >= 0) {
             const updated = [...mockTasks];
             updated[idx].completed = completed;
             setMockTasks(updated);
        }
        return;
    }
    await supabase.from('crm_tasks').update({ completed }).eq('id', id);
};
