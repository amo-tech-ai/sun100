
export interface Customer {
    id: string;
    name: string;
    logo: string;
    segment: 'Enterprise' | 'SMB' | 'Mid-Market';
    status: 'Active' | 'Churned' | 'Trial' | 'Lead';
    mrr: number;
    healthScore: number; // 0-100
    lastInteraction: string;
    owner: string;
    renewalDate: string;
    // Enriched Data Fields
    ceoName?: string;
    ceoLinkedin?: string;
    lastEnrichedAt?: string;
    latestNews?: string;
    companySummary?: string;
    tags?: string[];
    linkedDeckIds?: string[];
    fundingHistory?: { round: string; amount: string; date: string; investors: string }[];
    hiringTrends?: { trend: 'up' | 'flat' | 'down'; roles: string[] };
}

export interface Contact {
    id: string;
    accountId: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    linkedin?: string;
    isPrimary?: boolean;
}

export interface CRMStats {
    totalCustomers: number;
    activeAccounts: number;
    renewalRate: number;
    atRisk: number;
    totalRevenue: number;
}

export interface DealStage {
    id: string;
    name: string;
    count: number;
    value: number;
    color: string;
}

export interface Deal {
    id: string;
    name: string;
    value: number;
    stage: string;
    probability: number;
    expectedCloseDate: string;
    accountId?: string;
    customerName?: string;
    aiScore?: number;
    aiReasoning?: string;
}

export interface Insight {
    id: string;
    type: 'risk' | 'opportunity' | 'info';
    message: string;
    action?: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    due: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    tags?: string[];
    assignee: string;
    assigneeId?: string;
    accountId?: string;
    notify?: boolean;
}

export interface Interaction {
    id: string;
    type: 'email' | 'call' | 'meeting' | 'note';
    summary: string;
    date: string;
    sentiment?: 'Positive' | 'Neutral' | 'Negative';
    user_id?: string;
}

export interface TeamMember {
    userId: string;
    name: string;
    role: string;
    avatar?: string;
}
