import React from 'react';
import { Link } from 'react-router-dom';

// Icons
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const FileTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>;
const ChevronRight = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
const CheckCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12"/></svg>;
const AlertCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>;

// 1. Growth / User Activity Card
export const GrowthWidget: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-subtle h-full">
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-sm font-semibold text-slate-500">User Activity</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600">MAU</span>
            </div>
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-slate-900">2,450</h2>
                <p className="text-xs text-slate-400 mt-1">Monthly Active Users</p>
            </div>
            
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                        <span className="text-slate-600">Activation Rate</span>
                        <span className="text-slate-900 font-bold">24%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className="bg-slate-900 h-1.5 rounded-full" style={{ width: '24%' }}></div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                        <span className="text-slate-600">Retention (W4)</span>
                        <span className="text-slate-900 font-bold">45%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className="bg-slate-900 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 2. Product Usage Card
export const ProductUsageWidget: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-subtle h-full">
             <div className="flex justify-between items-start mb-6">
                <h3 className="text-sm font-semibold text-slate-500">Product Usage</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600">NPS</span>
            </div>
             <div className="mb-6">
                <h2 className="text-3xl font-bold text-slate-900">68</h2>
                <p className="text-xs text-slate-400 mt-1">Net Promoter Score</p>
            </div>
            
            <div className="space-y-3">
                {[
                    { label: "Feature Adoption", value: "62% of users" },
                    { label: "Power Users", value: "128 active" },
                    { label: "Avg Session", value: "14m 20s" },
                ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                        <span className="text-xs font-medium text-slate-500">{item.label}</span>
                        <span className="text-sm font-bold text-slate-800">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 3. Fundraising Hero Card
export const FundraisingWidget: React.FC = () => {
    return (
        <div className="bg-slate-900 rounded-xl shadow-lg overflow-hidden text-white flex flex-col md:flex-row">
            <div className="p-8 flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-white/10 rounded-lg text-white"><span className="text-xl">◎</span></div>
                        <h3 className="text-lg font-bold">Funding Progress</h3>
                    </div>
                    <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full text-slate-300 border border-white/5">Series Seed</span>
                </div>
                
                <div className="mb-8">
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-4xl font-bold text-white">$850k</span>
                        <span className="text-lg text-slate-400 font-medium">/ $1.5M</span>
                    </div>
                    <p className="text-xs text-blue-400 font-bold mb-4">56% Committed</p>
                    <div className="w-full bg-slate-800 rounded-full h-3">
                        <div className="bg-blue-500 h-3 rounded-full relative" style={{ width: '56%' }}>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-400 rounded-full border-2 border-slate-900"></div>
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span>Goal: Q1 2025</span>
                    <Link to="/dashboard/funding-manager" className="text-white hover:text-blue-400 flex items-center gap-1">
                        View Pipeline <ChevronRight />
                    </Link>
                </div>
            </div>
            
            <div className="bg-slate-800 p-8 w-full md:w-72 border-l border-slate-700">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Pipeline</h4>
                <div className="space-y-5">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-300">Contacted</span>
                        <span className="text-sm font-bold text-white">42</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-300">Active Convos</span>
                        <span className="text-sm font-bold text-blue-400">8</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-300">Term Sheets</span>
                        <span className="text-sm font-bold text-green-400">1</span>
                    </div>
                </div>
                <button className="w-full mt-8 py-2 bg-white text-slate-900 font-bold text-xs rounded hover:bg-gray-100 transition-colors">
                    Update Status
                </button>
            </div>
        </div>
    );
};

// 4. Documents Row
export const DocumentsWidget: React.FC = () => {
    const docs = [
        { id: 1, name: "Pitch Deck_v5", updated: "2d ago", status: "Final", icon: "bg-blue-100 text-blue-600" },
        { id: 2, name: "One Pager", updated: "5d ago", status: "Final", icon: "bg-purple-100 text-purple-600" },
        { id: 3, name: "Financial Model 2025", updated: "12h ago", status: "Draft", icon: "bg-emerald-100 text-emerald-600" },
        { id: 4, name: "Oct Investor Update", updated: "1mo ago", status: "Sent", icon: "bg-orange-100 text-orange-600" },
    ];

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-gray-50/30">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <FileTextIcon /> Documents Workspace
                </h3>
                <Link to="/dashboard/investor-docs" className="text-xs font-semibold text-slate-500 hover:text-slate-800">Manage All</Link>
            </div>
            <div className="p-2">
                {docs.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${doc.icon}`}>
                                <FileTextIcon />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">{doc.name}</h4>
                                <p className="text-xs text-slate-500 font-medium">Updated {doc.updated}</p>
                            </div>
                        </div>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                            doc.status === 'Final' ? 'bg-green-50 text-green-700 border border-green-100' : 
                            doc.status === 'Sent' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                            'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                            {doc.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Right Sidebar Widgets

export const MarketSizingWidget = () => (
    <div className="bg-slate-900 p-5 rounded-xl text-white shadow-lg">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Market Sizing</h3>
            <span className="text-slate-500"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>
        </div>
        <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                <span className="text-xs font-medium text-slate-400">TAM</span>
                <span className="text-lg font-bold">$42.5B</span>
            </div>
            <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                <span className="text-xs font-medium text-slate-400">SAM</span>
                <span className="text-lg font-bold">$12.1B</span>
            </div>
            <div className="flex justify-between items-end pb-2">
                <span className="text-xs font-medium text-slate-400">SOM</span>
                <span className="text-lg font-bold text-white">$850M</span>
            </div>
        </div>
        <button className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 rounded transition-colors">
            Recalculate Size
        </button>
    </div>
);

export const RevenueForecastWidget = () => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle">
         <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Revenue Forecast</h3>
            <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-bold">Next 12m</span>
        </div>
        <div className="h-24 flex items-end gap-1">
             {/* Mock Chart Bars */}
             {[20, 25, 30, 35, 42, 48, 55, 65, 75, 82, 90, 100].map((h, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center gap-1">
                     <div 
                        className={`w-full rounded-t-sm ${i > 8 ? 'bg-blue-300 border-t-2 border-dashed border-blue-500' : 'bg-blue-500'}`} 
                        style={{ height: `${h}%`, opacity: i > 8 ? 0.5 : 1 }}
                     ></div>
                 </div>
             ))}
        </div>
        <div className="mt-2 w-full h-px bg-slate-100"></div>
    </div>
);

export const RiskRadarWidget = () => (
    <div className="bg-amber-50 p-5 rounded-xl border border-amber-100">
         <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertCircle /> Risk Radar
         </h3>
         <ul className="space-y-3">
             <li className="flex gap-3 items-start">
                 <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
                 <div>
                     <p className="text-xs font-bold text-slate-800">Low Runway Alert</p>
                     <p className="text-[10px] text-slate-600 leading-tight">Cash out date is in &lt;5 months at current burn.</p>
                 </div>
             </li>
             <li className="flex gap-3 items-start">
                 <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0"></div>
                 <div>
                     <p className="text-xs font-bold text-slate-800">Spending Efficiency</p>
                     <p className="text-[10px] text-slate-600 leading-tight">Marketing CAC increased by 15%.</p>
                 </div>
             </li>
         </ul>
    </div>
);

export const DataRoomWidget = () => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                    <path className="text-blue-600" strokeDasharray="72, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
                <span className="absolute text-xs font-bold text-slate-900">72%</span>
            </div>
            <div>
                <p className="text-xs font-bold text-slate-900">Data Room Ready</p>
                <p className="text-[10px] text-slate-500">3 documents missing</p>
            </div>
        </div>
        <Link to="/dashboard/data-room" className="px-3 py-1.5 border border-slate-200 text-xs font-bold text-slate-600 rounded hover:bg-slate-50">
            Fix
        </Link>
    </div>
);