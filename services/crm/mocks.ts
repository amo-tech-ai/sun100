
import { Contact, Customer, Deal, Insight, Task } from './types';

export let mockCustomers: Customer[] = [
    { id: '1', name: 'Acme Corp', logo: 'A', segment: 'Enterprise', status: 'Active', mrr: 2500, healthScore: 92, lastInteraction: '2h ago', owner: 'Alex', renewalDate: '2024-12-01', tags: ['High Value', 'Reference'], lastEnrichedAt: '2024-08-20' },
    { id: '2', name: 'Globex Inc', logo: 'G', segment: 'Mid-Market', status: 'Active', mrr: 1200, healthScore: 78, lastInteraction: '1d ago', owner: 'Sarah', renewalDate: '2024-10-15', tags: ['Remote'] },
    { id: '3', name: 'Soylent Corp', logo: 'S', segment: 'SMB', status: 'Trial', mrr: 0, healthScore: 45, lastInteraction: '3d ago', owner: 'Mike', renewalDate: '2024-09-30', tags: ['Pilot'] },
    { id: '4', name: 'Initech', logo: 'I', segment: 'SMB', status: 'Churned', mrr: 0, healthScore: 12, lastInteraction: '2w ago', owner: 'Alex', renewalDate: '2024-01-01' },
    { id: '5', name: 'Umbrella Corp', logo: 'U', segment: 'Enterprise', status: 'Active', mrr: 5000, healthScore: 88, lastInteraction: '5h ago', owner: 'Sarah', renewalDate: '2025-03-01', lastEnrichedAt: '2024-08-25' },
    { id: '6', name: 'Stark Ind', logo: 'S', segment: 'Enterprise', status: 'Active', mrr: 10000, healthScore: 99, lastInteraction: '10m ago', owner: 'Tony', renewalDate: '2024-11-20', ceoName: 'Tony Stark', ceoLinkedin: 'https://linkedin.com/in/tonystark', latestNews: 'Launched new clean energy initiative.', tags: ['VIP', 'Energy'], lastEnrichedAt: 'Today' },
];

export let mockContacts: Contact[] = [
    { id: 'c1', accountId: '1', firstName: 'Alice', lastName: 'Smith', email: 'alice@acme.com', role: 'CTO', linkedin: 'https://linkedin.com/in/alicesmith', isPrimary: true },
    { id: 'c2', accountId: '1', firstName: 'Bob', lastName: 'Jones', email: 'bob@acme.com', role: 'VP Eng', isPrimary: false },
    { id: 'c3', accountId: '6', firstName: 'Pepper', lastName: 'Potts', email: 'pepper@stark.com', role: 'CEO', linkedin: 'https://linkedin.com/in/pepper', isPrimary: true },
];

export let mockTasks: Task[] = [
    { id: '1', title: 'Prepare Q3 Review for Acme', description: 'Focus on usage stats and upcoming renewal discussion.', due: 'Today', completed: false, priority: 'high', assignee: 'Me', accountId: '1', tags: ['review'] },
    { id: '2', title: 'Send contract to Stark Ind', description: 'Ensure the enterprise rider is included.', due: 'Tomorrow', completed: false, priority: 'urgent', assignee: 'Me', accountId: '6', tags: ['sales'] },
    { id: '3', title: 'Onboarding call with Soylent', description: 'Walk through the new dashboard features.', due: 'Sep 20', completed: true, priority: 'medium', assignee: 'Sarah', accountId: '3', tags: ['onboarding'] },
];

export let mockDeals: Deal[] = [
    { id: 'd1', name: 'Enterprise Contract', value: 120000, stage: 'Negotiation', probability: 80, expectedCloseDate: '2024-12-15', accountId: '1', customerName: 'Acme Corp', aiScore: 85, aiReasoning: 'Strong champion in place.' },
    { id: 'd2', name: 'Pilot Expansion', value: 45000, stage: 'Qualified', probability: 40, expectedCloseDate: '2025-01-20', accountId: '2', customerName: 'Globex Inc' },
    { id: 'd3', name: 'New Seat Licenses', value: 85000, stage: 'Proposal', probability: 60, expectedCloseDate: '2024-11-30', accountId: '5', customerName: 'Umbrella Corp', aiScore: 62, aiReasoning: 'Budget approval pending.' },
    { id: 'd4', name: 'API Integration', value: 12000, stage: 'Lead', probability: 20, expectedCloseDate: '2025-02-10', accountId: '6', customerName: 'Stark Ind' },
    { id: 'd5', name: 'Multi-Year Renewal', value: 95000, stage: 'Closed Won', probability: 100, expectedCloseDate: '2024-10-01', accountId: '1', customerName: 'Acme Corp' }
];

export const mockInsights: Insight[] = [
    { id: '1', type: 'risk', message: '3 accounts showing declining usage patterns this week.', action: 'View Report' },
    { id: '2', type: 'opportunity', message: 'Enterprise segment growing 15% faster than SMB.', action: 'Adjust Forecast' },
    { id: '3', type: 'info', message: 'Ideally, follow up with "Globex Inc" regarding renewal.', action: 'Draft Email' },
];

// Helpers to mutate mocks
export const setMockCustomers = (newCustomers: Customer[]) => { mockCustomers = newCustomers; };
export const setMockDeals = (newDeals: Deal[]) => { mockDeals = newDeals; };
export const setMockContacts = (newContacts: Contact[]) => { mockContacts = newContacts; };
export const setMockTasks = (newTasks: Task[]) => { mockTasks = newTasks; };
