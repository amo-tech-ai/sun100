
import React, { useEffect, useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useStartup } from '../hooks/useStartup';
import { getDecks } from '../services/deckService';
import { getEvents } from '../services/eventService';
import { getTasks } from '../services/crmService';

// New Enterprise Components
import { StatCard } from '../components/dashboard/StatCard';
import { 
    GrowthWidget, 
    ProductUsageWidget, 
    FundraisingWidget, 
    DocumentsWidget
} from '../components/dashboard/EnterpriseWidgets';
import { StartupCoachSidebar } from '../components/dashboard/StartupCoachSidebar';

const { Link } = ReactRouterDOM;

// Icons
const SearchIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const PlusIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const UserIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;

const Dashboard: React.FC = () => {
    const { profile } = useStartup();
    
    // We keep data fetching for validity, though the widgets use specific "Screen B" data for the redesign.
    const [deckCount, setDeckCount] = useState(0);
    const [eventCount, setEventCount] = useState(0);
    const [taskCount, setTaskCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [decks, events, taskList] = await Promise.all([
                    getDecks(),
                    getEvents(),
                    getTasks({ status: 'active' })
                ]);
                setDeckCount(decks.length);
                setEventCount(events.length);
                setTaskCount(taskList.length);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
            {/* 1. Global Top Bar */}
            <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-20 shadow-subtle">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Startup Command Center</h1>
                    <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-100 uppercase tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                        Fundraising Active
                    </span>
                </div>
                
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative hidden md:block">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 transition-all"
                        />
                    </div>
                    
                    {/* Actions */}
                    <Link to="/pitch-decks/new" className="hidden sm:flex items-center gap-1 bg-white border border-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <PlusIcon className="w-3 h-3" /> New Doc
                    </Link>
                    <button className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
                        Share
                    </button>
                    
                    <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-500">
                        <UserIcon className="w-4 h-4" />
                    </div>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row p-4 lg:p-6 gap-6 max-w-[1800px] mx-auto">
                {/* 2. Main Content Column */}
                <main className="flex-1 flex flex-col gap-6 min-w-0">
                    
                    {/* Top KPI Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard 
                            label="Monthly Revenue" 
                            value="$42,500" 
                            trend="12%" 
                            trendUp={true} 
                            sparklineData={[30, 35, 32, 38, 40, 42, 45]} 
                        />
                        <StatCard 
                            label="Monthly Spend" 
                            value="$18,200" 
                            trend="5%" 
                            trendUp={false} 
                            sparklineData={[15, 18, 16, 19, 18, 20, 18]} 
                        />
                        <StatCard 
                            label="Cash Available" 
                            value="$340,000" 
                            trend="Stable" 
                            trendUp={true} 
                            sparklineData={[350, 348, 345, 342, 340, 340, 340]} 
                        />
                        <StatCard 
                            label="Runway" 
                            value="14 Months" 
                            trend="-1 Mo" 
                            trendUp={false} 
                            sparklineData={[18, 17, 16, 15, 14, 14, 14]} 
                        />
                    </div>

                    {/* Growth & Usage Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="flex flex-col h-full">
                            <div className="flex items-center gap-2 mb-3">
                                <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                                <h3 className="text-sm font-bold text-slate-900">Growth & Usage</h3>
                            </div>
                            <GrowthWidget />
                        </div>
                        <div className="flex flex-col h-full">
                            <div className="h-8 mb-2"></div> {/* Spacer to align headers visually */}
                            <ProductUsageWidget />
                        </div>
                    </div>

                    {/* Fundraising Row */}
                    <div className="w-full">
                         <div className="flex items-center gap-2 mb-3">
                            <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                            <h3 className="text-sm font-bold text-slate-900">Fundraising</h3>
                            <Link to="/dashboard/funding-manager" className="ml-auto text-xs font-bold text-slate-500 hover:text-blue-600">View Pipeline</Link>
                        </div>
                        <FundraisingWidget />
                    </div>

                    {/* Documents Row */}
                    <div className="w-full">
                        <DocumentsWidget />
                    </div>

                </main>

                {/* 3. Right Sidebar (Intelligence) */}
                <aside className="w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-6 h-[calc(100vh-100px)] sticky top-24 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                    <StartupCoachSidebar />
                </aside>
            </div>
        </div>
    );
};

export default Dashboard;