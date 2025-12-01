
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Wand2Icon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const ArrowUpRightIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>;
const GiftIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" x2="12" y1="22" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>;
const CheckCircleIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>;
const BriefcaseIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const FilePlus2Icon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="12" x2="12" y1="18" y2="12"/><line x1="9" x2="15" y1="15" y2="15"/></svg>;

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

const mockRecentActivity = [
    { user: 'You', action: 'created a new deck', details: 'Sun AI Seed Round', time: '5m ago', icon: <FilePlus2Icon/> },
    { user: 'Admin', action: 'added a new perk', details: 'AWS Credits', time: '2h ago', icon: <GiftIcon/> },
    { user: 'You', action: 'completed a task', details: 'Update team slide', time: '1d ago', icon: <CheckCircleIcon/> },
    { user: 'Alex Chen', action: 'posted a new job', details: 'Senior AI Engineer', time: '2d ago', icon: <BriefcaseIcon/> },
];

export const PersonalizedFeed: React.FC = () => {
    const [activeTab, setActiveTab] = useState('insights');
    
    const tabs = [
        { id: 'insights', label: 'Insights', count: 3 },
        { id: 'tasks', label: 'Tasks', count: 2 },
        { id: 'activity', label: 'Activity', count: 5 },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="px-6 pt-6 pb-0 border-b border-gray-100 overflow-x-auto scrollbar-hide">
                <div className="flex space-x-6 min-w-max">
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
