
import { useState, useEffect } from 'react';
import { getCRMData, CRMStats, Customer, DealStage, Insight, Task } from '../services/crmService';
import { useToast } from '../contexts/ToastContext';

export const useCRM = () => {
    const { success, error: toastError } = useToast();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<CRMStats | null>(null);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [pipeline, setPipeline] = useState<DealStage[]>([]);
    const [insights, setInsights] = useState<Insight[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);

    const load = async () => {
        setLoading(true);
        try {
            const data = await getCRMData();
            setStats(data.stats);
            setCustomers(data.customers);
            setPipeline(data.pipeline);
            setInsights(data.insights);
            setTasks(data.tasks);
        } catch (error) {
            console.error("Error fetching CRM data:", error);
            toastError("Failed to load CRM data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    return { 
        loading, 
        stats, 
        customers, 
        pipeline, 
        insights, 
        tasks, 
        setInsights, 
        setTasks, 
        setCustomers,
        load, 
        success, 
        toastError 
    };
};
