
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useOnScreen from '../hooks/useOnScreen';
import AnimatedCounter from '../components/AnimatedCounter';

// --- ICONS ---
const Wand2Icon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const PresentationIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/></svg>;
const VideoIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect y="4" x="2" width="20" height="16" rx="2"/><path d="m22 8-6 4 6 4V8Z"/></svg>;
const BriefcaseIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const GiftIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" x2="12" y1="22" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>;
const CheckCircleIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>;
const SearchIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const BellIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
const SettingsIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1 0 2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
const ChevronLeftIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m15 18-6-6 6-6"/></svg>;
const ChevronRightIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6"/></svg>;
const FilePlus2Icon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="12" x2="12" y1="18" y2="12"/><line x1="9" x2="15" y1="15" y2="15"/></svg>;
const LightbulbIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 14c.2-1 .7-1.7 1.5-2.5C17.7 10.2 18 9 18 7c0-2.2-1.8-4-4-4S10 4.8 10 7c0 2 .3 3.2 1.5 4.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>;
const TrendingUpIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
const UsersIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const FolderLockIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v2"/><path d="M20 13v-1a2 2 0 1 0-4 0v1"/><rect width="8" height="7" x="14" y="13" rx="1"/></svg>;
const ArrowUpRightIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>;
const CalendarClockIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="M20 14h-2"/><path d="M14 18h6"/><path d="M12 18v4"/></svg>;

// --- MOCK DATA ---
const mockInsights = [
    { type: 'AI Suggestion', title: 'Update Your Traction Slide', description: 'AI suggests adding your latest user growth metrics to improve credibility.', link: '/pitch-decks' },
    { type: 'New Perk Available', title: '90% off HubSpot for Startups', description: 'A new high-value perk has been added to the community portal.', link: '/perks/3' },
    { type: 'Upcoming Event', title: 'Founder Networking Night', description: 'Join our virtual networking event this Friday to connect with peers.', link: '/events/1' },
];
const mockTasks = [
    { title: 'Fix your "Problem" slide', deck: 'Sun AI Seed Deck', status: 'In Progress' },
    { title: 'Add market size data', deck: 'Q3 Product Update', status: 'To Do' },
    { title: 'Upload team member photos', deck: 'Sun AI Seed Deck', status: 'To Do' },
];
const mockUpcomingEvent = {
    title: "Rhythm & Beats Music Festival",
    image: "https://storage.googleapis.com/aistudio-hosting/event-placeholders/upcoming.jpg",
    date: "Apr 20, 2029",
    location: "Sunset Park, Los Angeles, CA",
    link: "/events/1"
};
const mockRecentActivity = [
    { user: 'You', action: 'created a new deck', details: 'Sun AI Seed Round', time: '5m ago', icon: <FilePlus2Icon/> },
    { user: 'Admin', action: 'added a new perk', details: 'AWS Credits', time: '2h ago', icon: <GiftIcon/> },
    { user: 'You', action: 'completed a task', details: 'Update team slide', time: '1d ago', icon: <CheckCircleIcon/> },
    { user: 'Alex Chen', action: 'posted a new job', details: 'Senior AI Engineer', time: '2d ago', icon: <BriefcaseIcon/> },
];

// --- SUB-COMPONENTS ---

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number; suffix?: string; trend?: string; trendUp?: boolean }> = ({ icon, label, value, suffix, trend, trendUp }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between gap-4 transition-all duration-300 hover:shadow-md h-full">
        <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-brand-orange/5 text-brand-orange flex items-center justify-center flex-shrink-0">
                {icon}
            </div>
            {trend && (
                 <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${trendUp ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'} flex items-center gap-1`}>
                    {trend} {trendUp ? <ArrowUpRightIcon className="w-3 h-3" /> : <ArrowUpRightIcon className="w-3 h-3 rotate-90" />}
                 </div>
            )}
        </div>
        <div>
            <p className="text-3xl font-extrabold text-brand-blue tracking-tight">
                <AnimatedCounter value={value} />{suffix}
            </p>
             <p className="text-sm font-medium text-gray-500 mt-1">{label}</p>
        </div>
    </div>
);

const QuickActionCard: React.FC<{ title: string; link: string; icon: React.ReactNode; color?: string }> = ({ title, link, icon, color = "brand-orange" }) => (
    <Link to={link} className={`group block bg-white p-5 rounded-2xl border border-gray-200/60 shadow-sm text-left transition-all duration-300 hover:shadow-lg hover:border-${color}/30 hover:-translate-y-1`}>
        <div className={`w-12 h-12 rounded-xl bg-${color}/10 text-${color} flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110`}>
            {icon}
        </div>
        <h3 className={`text-sm font-bold text-brand-blue group-hover:text-${color} transition-colors`}>{title}</h3>
    </Link>
);

const StartupHealthDonut: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-brand-blue">Startup Health</h3>
                <button className="text-xs font-semibold text-brand-orange hover:underline transition-colors">View Report</button>
            </div>
            
            <div className="flex items-center gap-8 flex-1">
                <div className="relative w-36 h-36 flex-shrink-0 mx-auto sm:mx-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        {/* Background Circle */}
                        <path
                            className="text-gray-50"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                        />
                        {/* Progress Circle */}
                        <path
                            className="text-brand-orange drop-shadow-sm"
                            strokeDasharray="75, 100"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-extrabold text-brand-blue">75%</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Score</span>
                    </div>
                </div>
                
                <div className="flex-1 space-y-5 hidden sm:block">
                    <div>
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                            <span className="text-gray-500">Brand Story</span>
                            <span className="text-brand-blue">80/100</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-emerald-500 h-2 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" style={{width: '80%'}}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                            <span className="text-gray-500">Traction</span>
                            <span className="text-brand-blue">40/100</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                             <div className="bg-amber-500 h-2 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.4)]" style={{width: '40%'}}></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-50">
                <div className="flex items-start gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                    <div className="bg-white p-1 rounded-full shadow-sm text-blue-600 mt-0.5">
                        <Wand2Icon className="w-3 h-3" />
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                        <span className="font-bold text-blue-700">AI Tip:</span> Add 'Monthly Active Users' to boost your Traction score.
                    </p>
                </div>
            </div>
        </div>
    );
};

const DeckPerformanceChart: React.FC = () => {
    const data = [
        { month: 'May', slides: 8, rewrites: 12, visuals: 5 },
        { month: 'Jun', slides: 10, rewrites: 15, visuals: 8 },
        { month: 'Jul', slides: 12, rewrites: 20, visuals: 10 },
        { month: 'Aug', slides: 15, rewrites: 25, visuals: 14 },
    ];
    const maxVal = Math.max(...data.flatMap(d => [d.slides, d.rewrites, d.visuals])) * 1.2;
    
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-brand-blue">Deck Activity</h3>
                <div className="flex gap-3 text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-brand-orange/30"></span> Drafts</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-brand-orange"></span> Visuals</span>
                </div>
            </div>

            <div className="flex-1 flex items-end gap-2 sm:gap-6 px-2 relative min-h-[160px]">
                {/* Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0 pb-6">
                    {[...Array(4)].map((_, i) => (
                         <div key={i} className="border-t border-dashed border-gray-100 w-full h-px"></div>
                    ))}
                </div>

                {data.map(d => (
                    <div key={d.month} className="flex-1 flex flex-col justify-end items-center gap-2 relative z-10 group cursor-default">
                        <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full">
                            <div className="w-3 sm:w-6 bg-brand-orange/30 rounded-t-sm transition-all duration-500 hover:opacity-80 group-hover:scale-y-105 origin-bottom" style={{ height: `${(d.slides/maxVal)*100}%` }}></div>
                            <div className="w-3 sm:w-6 bg-brand-orange rounded-t-sm transition-all duration-500 hover:opacity-80 group-hover:scale-y-105 origin-bottom shadow-[0_0_10px_rgba(232,124,77,0.2)]" style={{ height: `${(d.visuals/maxVal)*100}%` }}></div>
                        </div>
                        <p className="text-xs font-bold text-gray-400 group-hover:text-brand-blue transition-colors">{d.month}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


const PersonalizedFeed: React.FC = () => {
    const [activeTab, setActiveTab] = useState('insights');
    
    const tabs = [
        { id: 'insights', label: 'Insights', count: 3 },
        { id: 'tasks', label: 'Tasks', count: 2 },
        { id: 'activity', label: 'Activity', count: 5 },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="px-6 pt-6 pb-0 border-b border-gray-100">
                <div className="flex space-x-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                pb-4 text-sm font-bold relative transition-colors duration-200 flex items-center gap-2
                                ${activeTab === tab.id ? 'text-brand-blue' : 'text-gray-400 hover:text-gray-600'}
                            `}
                        >
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-500'}`}>
                                    {tab.count}
                                </span>
                            )}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-orange rounded-t-full"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-6 min-h-[320px]">
                {activeTab === 'insights' && (
                    <div className="space-y-4 animate-fade-in-up">
                        {mockInsights.map((item, i) => (
                            <div key={i} className="group flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md hover:border-gray-200 transition-all cursor-pointer">
                                <div className="w-10 h-10 bg-white border border-gray-200 text-brand-orange flex items-center justify-center rounded-full flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                                    <Wand2Icon className="w-5 h-5"/>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="font-bold text-brand-blue text-sm">{item.title}</p>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{item.type}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{item.description}</p>
                                    <Link to={item.link} className="text-xs font-bold text-brand-orange hover:text-brand-mustard mt-3 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Review Suggestion <ArrowUpRightIcon className="w-3 h-3"/>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'tasks' && (
                    <div className="space-y-3 animate-fade-in-up">
                        {mockTasks.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 hover:border-gray-300 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-4 h-4 rounded-full border-2 ${item.status === 'In Progress' ? 'border-blue-500' : 'border-gray-300'} flex items-center justify-center`}>
                                        {item.status === 'In Progress' && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                                    </div>
                                    <div>
                                        <p className="font-bold text-brand-blue text-sm group-hover:text-brand-orange transition-colors">{item.title}</p>
                                        <p className="text-xs text-gray-400 font-medium mt-0.5">{item.deck}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${item.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>
                                    {item.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'activity' && (
                    <div className="relative pl-2 animate-fade-in-up">
                        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-100"></div>
                        <div className="space-y-6">
                            {mockRecentActivity.map((activity, i) => (
                                <div key={i} className="relative flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-400 flex items-center justify-center flex-shrink-0 z-10 shadow-sm">
                                        <div className="scale-75">{activity.icon}</div>
                                    </div>
                                    <div className="pt-1">
                                        <p className="text-xs text-gray-800">
                                            <span className="font-bold text-brand-blue">{activity.user}</span> {activity.action} <span className="font-medium">{activity.details}</span>
                                        </p>
                                        <p className="text-[10px] text-gray-400 mt-0.5 font-medium">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const UpcomingEvent: React.FC = () => (
    <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 group h-full flex flex-col">
        <div className="relative rounded-xl overflow-hidden aspect-[16/9] flex-shrink-0">
            <img src={mockUpcomingEvent.image} alt={mockUpcomingEvent.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 text-white w-full">
                <div className="flex justify-between items-end">
                    <div>
                        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block border border-white/20">Networking</span>
                        <h4 className="font-bold text-lg leading-tight">{mockUpcomingEvent.title}</h4>
                    </div>
                    <div className="text-center bg-brand-orange rounded-lg p-2 min-w-[45px] shadow-lg">
                        <span className="block text-[10px] font-bold text-white uppercase">Apr</span>
                        <span className="block text-lg font-extrabold leading-none">20</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between">
             <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mb-4">
                <span className="opacity-75">📍</span> {mockUpcomingEvent.location}
            </p>
            <Link to={mockUpcomingEvent.link} className="block w-full py-2 text-center text-xs font-bold text-gray-700 bg-gray-50 rounded-lg hover:bg-brand-blue hover:text-white transition-all border border-gray-200 hover:border-brand-blue">
                View Details
            </Link>
        </div>
    </div>
);

const MiniCalendar: React.FC = () => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });

    return (
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
            <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-sm text-brand-blue">{monthName} {currentYear}</h3>
                <div className="flex gap-1">
                    <button onClick={() => setCurrentMonth(m => m - 1)} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"><ChevronLeftIcon /></button>
                    <button onClick={() => setCurrentMonth(m => m + 1)} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"><ChevronRightIcon /></button>
                </div>
            </div>
            <div className="grid grid-cols-7 text-center text-[10px] text-gray-400 font-bold uppercase mb-3 tracking-wide">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <span key={day}>{day}</span>)}
            </div>
            <div className="grid grid-cols-7 text-center text-xs gap-y-3">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}
                {Array.from({ length: daysInMonth }).map((_, day) => {
                    const date = day + 1;
                    const isToday = date === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                    return (
                        <div key={date} className="flex items-center justify-center">
                             <span className={`w-7 h-7 flex items-center justify-center rounded-full font-medium transition-all cursor-pointer ${isToday ? 'bg-brand-blue text-white shadow-md scale-110' : 'text-gray-600 hover:bg-gray-100'}`}>
                                {date}
                            </span>
                        </div>
                    );
                })}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-50 space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-1 h-8 bg-brand-orange rounded-full"></div>
                    <div>
                        <p className="text-xs font-bold text-gray-800">Team Sync</p>
                        <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1"><CalendarClockIcon className="w-3 h-3"/> 10:00 AM</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AiInsightsWidget: React.FC = () => (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-brand-blue to-slate-900 p-6 rounded-2xl shadow-lg text-white group h-full border border-slate-700/50">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-orange/20 rounded-full blur-3xl -mr-10 -mt-10 transition-all duration-1000 group-hover:bg-brand-orange/30"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-mustard/10 rounded-full blur-3xl -ml-10 -mb-10 transition-all duration-1000 group-hover:bg-brand-mustard/20"></div>
        
        <h3 className="font-bold text-base mb-6 flex items-center gap-2 relative z-10">
            <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                <Wand2Icon className="w-4 h-4 text-brand-mustard" />
            </div>
            <span>AI Strategic Review</span>
        </h3>
        
        <div className="space-y-3 relative z-10">
            <div className="p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer hover:border-brand-orange/30">
                <div className="flex gap-3">
                     <div className="mt-0.5 text-brand-mustard"><LightbulbIcon className="w-4 h-4" /></div>
                     <div>
                        <p className="text-xs text-gray-300 leading-relaxed">
                            <span className="font-bold text-white block mb-1">Opportunity Detected</span>
                            25% growth in "AI Tools" interest. Update your Market slide data.
                        </p>
                     </div>
                </div>
            </div>
             <div className="p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer hover:border-green-400/30">
                <div className="flex gap-3">
                     <div className="mt-0.5 text-green-400"><TrendingUpIcon className="w-4 h-4" /></div>
                     <div>
                        <p className="text-xs text-gray-300 leading-relaxed">
                            <span className="font-bold text-white block mb-1">High Engagement</span>
                            Your "Solution" slide has 40% higher retention. Add a CTA.
                        </p>
                     </div>
                </div>
            </div>
        </div>
        
        <button className="w-full mt-6 py-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg transition-colors backdrop-blur-sm">
            Generate Full Report
        </button>
    </div>
);


const MobileCtaBar: React.FC = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200 p-4 flex justify-around gap-3 md:hidden z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0) + 1rem)' }}>
        <Link to="/pitch-decks/new" className="flex-1 text-center bg-brand-orange text-white text-sm font-bold py-3 px-4 rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
            <Wand2Icon className="w-4 h-4"/> New Deck
        </Link>
        <Link to="/dashboard/video-generator" className="flex-1 text-center bg-gray-100 text-brand-blue text-sm font-bold py-3 px-4 rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2">
            <VideoIcon className="w-4 h-4"/> New Video
        </Link>
    </div>
);


// --- MAIN DASHBOARD COMPONENT ---

const Dashboard: React.FC = () => {
    const [ref, isVisible] = useOnScreen<HTMLElement>({ threshold: 0.1 });
    const animationClass = isVisible ? 'animate-fade-in-up' : 'opacity-0';
    
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className="w-full bg-[#FBF8F5] min-h-screen pb-24 lg:pb-12 font-display">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                 <style>{`
                    @keyframes fade-in-up {
                        from { opacity: 0; transform: translateY(1rem); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
                `}</style>

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-gray-200/50">
                    <div>
                        <p className="text-xs font-bold text-brand-orange uppercase tracking-widest mb-1">{todayDate}</p>
                        <h1 className="text-3xl lg:text-4xl font-extrabold text-brand-blue tracking-tight">{getGreeting()}, Founder.</h1>
                        <p className="text-gray-500 font-medium mt-1 text-sm lg:text-base">Your command center for growth and fundraising.</p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-grow md:w-64 group">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-brand-orange transition-colors"/>
                            <input 
                                type="search" 
                                placeholder="Search your startup..." 
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all text-sm font-medium placeholder-gray-400" 
                            />
                        </div>
                        <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-brand-blue hover:bg-gray-50 transition-colors shadow-sm hidden sm:block relative" aria-label="Notifications">
                            <BellIcon className="w-5 h-5"/>
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-brand-blue hover:bg-gray-50 transition-colors shadow-sm hidden sm:block" aria-label="Settings">
                            <SettingsIcon className="w-5 h-5"/>
                        </button>
                    </div>
                </header>

                {/* Quick Actions (Command Bar) */}
                <section ref={ref} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div className={`${animationClass}`} style={{animationDelay: '0ms'}}><QuickActionCard title="New Deck" link="/pitch-decks/new" icon={<Wand2Icon />} /></div>
                    <div className={`${animationClass}`} style={{animationDelay: '50ms'}}><QuickActionCard title="Investor Docs" link="/dashboard/investor-docs" icon={<BriefcaseIcon />} color="blue-600" /></div>
                    <div className={`${animationClass}`} style={{animationDelay: '100ms'}}><QuickActionCard title="Find Capital" link="/directory" icon={<UsersIcon />} color="green-600" /></div>
                    <div className={`${animationClass}`} style={{animationDelay: '150ms'}}><QuickActionCard title="Create Video" link="/dashboard/video-generator" icon={<VideoIcon />} color="purple-600" /></div>
                    <div className={`${animationClass}`} style={{animationDelay: '200ms'}}><QuickActionCard title="Data Room" link="/dashboard/data-room" icon={<FolderLockIcon />} color="amber-600" /></div>
                </section>
                
                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column (Operational) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Metrics */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard icon={<PresentationIcon />} label="Decks" value={12} trend="+2" trendUp={true} />
                            <StatCard icon={<BriefcaseIcon />} label="Investors" value={8} trend="+1" trendUp={true} />
                            <StatCard icon={<CheckCircleIcon />} label="Tasks" value={28} />
                            <StatCard icon={<UsersIcon />} label="Events" value={3} />
                        </div>
                        
                        {/* Analytics & Feed */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="h-80"><StartupHealthDonut /></div>
                            <div className="h-80"><DeckPerformanceChart /></div>
                        </div>
                        
                        {/* Personalized Feed */}
                        <div>
                            <PersonalizedFeed />
                        </div>
                    </div>

                    {/* Right Column (Strategic) */}
                    <aside className="lg:col-span-1 space-y-6">
                        <div className="h-auto"><AiInsightsWidget /></div>
                        <div className="h-auto"><UpcomingEvent /></div>
                        <div className="h-auto"><MiniCalendar /></div>
                    </aside>
                </div>
            </div>

            <MobileCtaBar />
        </div>
    );
};

export default Dashboard;
