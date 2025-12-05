
import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';

const { NavLink, Link } = ReactRouterDOM;

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#E87C4D]" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM4.225 4.225a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM15.775 4.225a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zM17 10a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM8 10a2 2 0 114 0 2 2 0 01-4 0zM4.225 15.775a1 1 0 010-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zM10 17a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM14.364 14.364a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const PresentationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>;
const VideoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect y="4" x="2" width="20" height="16" rx="2"/><path d="m22 8-6 4 6 4V8Z"/></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const MapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const BarChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>;
const HeartHandshakeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.15-4.9"/><path d="M18 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" opacity="0"/></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;


const PanelLeftCloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 15-3-3 3-3"/></svg>
);

interface SidebarProps {
    isCollapsed: boolean;
    onToggle?: () => void;
}

const activeLinkClass = 'bg-orange-100 text-[#E87C4D]';
const inactiveLinkClass = 'text-gray-500 hover:bg-gray-100 hover:text-gray-800';

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
    return (
        <aside className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className={`h-20 flex items-center border-b border-gray-200 ${isCollapsed ? 'justify-center' : 'px-6'}`}>
                <Link to="/" className="flex items-center gap-2">
                    <SunIcon />
                    {!isCollapsed && <span className="font-bold text-xl">StartupAI</span>}
                </Link>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto scrollbar-hide">
                <Link
                    to="/"
                    className={`flex items-center p-3 rounded-lg ${inactiveLinkClass} ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <GlobeIcon />
                    {!isCollapsed && <span className="ml-3 font-semibold">Public Site</span>}
                </Link>
                 <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) => `flex items-center p-3 rounded-lg ${isActive ? activeLinkClass : inactiveLinkClass} ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <HomeIcon />
                    {!isCollapsed && <span className="ml-3 font-semibold">Dashboard</span>}
                </NavLink>
                
                {/* Intelligence Section */}
                {!isCollapsed && <p className="px-3 mt-4 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Intelligence</p>}
                <NavLink
                    to="/dashboard/prospecting"
                    className={({ isActive }) => `flex items-center p-3 rounded-lg ${isActive ? activeLinkClass : inactiveLinkClass} ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <SparklesIcon />
                    {!isCollapsed && <span className="ml-3 font-semibold">Prospecting (AI)</span>}
                </NavLink>
                <NavLink
                    to="/dashboard/crm"
                    className={({ isActive }) => `flex items-center p-3 rounded-lg ${isActive ? activeLinkClass : inactiveLinkClass} ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <HeartHandshakeIcon />
                    {!isCollapsed && <span className="ml-3 font-semibold">Customer CRM</span>}
                </NavLink>
                <NavLink
                    to="/dashboard/financial-overview"
                    className={({ isActive }) => `flex items-center p-3 rounded-lg ${isActive ? activeLinkClass : inactiveLinkClass} ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <BarChartIcon />
                    {!isCollapsed && <span className="ml-3 font-semibold">Financials</span>}
                </NavLink>
                <NavLink
                    to="/dashboard/market-size"
                    className={({ isActive }) => `flex items-center p-3 rounded-lg ${isActive ? activeLinkClass : inactiveLinkClass} ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <GlobeIcon />
                    {!isCollapsed && <span className="ml-3 font-semibold">Market Size</span>}
                </NavLink>
                <NavLink
                    to="/dashboard/gtm-strategy"
                    className={({ isActive }) => `flex items-center p-3 rounded-lg ${isActive ? activeLinkClass : inactiveLinkClass} ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <MapIcon />
                    {!isCollapsed && <span className="ml-3 font-semibold">GTM Strategy</span>}
                </NavLink>
                 <NavLink
                    to="/dashboard/investor-docs"
                    className={({ isActive }) => `flex items-center p-3 rounded-lg ${isActive ? activeLinkClass : inactiveLinkClass} ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <BriefcaseIcon />
                    {!isCollapsed && <span className="ml-3 font-semibold">Investor Docs</span>}
                </NavLink>
                
                 {/* Fundraising Section */}
                 {!isCollapsed && <p className="px-3 mt-4 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Fundraising</p>}
                 <NavLink
                    to="/pitch-decks"
                    className={({ isActive }) =>
                        `flex items-center p-3 rounded-lg ${isActive ? activeLinkClass : inactiveLinkClass} ${isCollapsed ? 'justify-center' : ''}`
                    }
                >
                    <PresentationIcon />
                    {!isCollapsed && <span className="ml-3 font-semibold">Pitch Decks</span>}
                </NavLink>
                <NavLink
                    to="/pitch-decks/new"
                    className={({ isActive }) => `flex items-center p-3 rounded-lg ${isActive ? activeLinkClass : inactiveLinkClass} ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <PlusIcon />
                    {!isCollapsed && <span className="ml-3 font-semibold">New Deck</span>}
                </NavLink>
                 <NavLink
                    to="/directory"
                    className={({ isActive }) => `flex items-center p-3 rounded-lg ${isActive ? activeLinkClass : inactiveLinkClass} ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <UsersIcon />
                    {!isCollapsed && <span className="ml-3 font-semibold">Investor Directory</span>}
                </NavLink>
                 <NavLink
                    to="/dashboard/funding-manager"
                    className={({ isActive }) => `flex items-center p-3 rounded-lg ${isActive ? activeLinkClass : inactiveLinkClass} ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <SendIcon />
                    {!isCollapsed && <span className="ml-3 font-semibold">Applications</span>}
                </NavLink>
                <NavLink
                    to="/dashboard/data-room"
                    className={({ isActive }) => `flex items-center p-3 rounded-lg ${isActive ? activeLinkClass : inactiveLinkClass} ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <LockIcon />
                    {!isCollapsed && <span className="ml-3 font-semibold">Data Room</span>}
                </NavLink>

                {/* Tools Section */}
                 {!isCollapsed && <p className="px-3 mt-4 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Tools & Team</p>}
                 <NavLink
                    to="/dashboard/my-events"
                    className={({ isActive }) => `flex items-center p-3 rounded-lg ${isActive ? activeLinkClass : inactiveLinkClass} ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <CalendarIcon />
                    {!isCollapsed && <span className="ml-3 font-semibold">My Events</span>}
                </NavLink>
                <NavLink
                    to="/dashboard/hiring"
                    className={({ isActive }) => `flex items-center p-3 rounded-lg ${isActive ? activeLinkClass : inactiveLinkClass} ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <BriefcaseIcon />
                    {!isCollapsed && <span className="ml-3 font-semibold">Hiring Manager</span>}
                </NavLink>
                <NavLink
                    to="/dashboard/video-generator"
                    className={({ isActive }) => `flex items-center p-3 rounded-lg ${isActive ? activeLinkClass : inactiveLinkClass} ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <VideoIcon />
                    {!isCollapsed && <span className="ml-3 font-semibold">Video Generator</span>}
                </NavLink>
                <NavLink
                    to="/dashboard/sitemap"
                    className={({ isActive }) => `flex items-center p-3 rounded-lg ${isActive ? activeLinkClass : inactiveLinkClass} ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <ListIcon />
                    {!isCollapsed && <span className="ml-3 font-semibold">Sitemap</span>}
                </NavLink>
            </nav>

            <div className="mt-auto p-4 border-t border-gray-200 space-y-2">
                 {!isCollapsed && (
                    <div className="flex justify-around text-xs text-gray-500 mb-2">
                        <Link to="/terms" className="hover:underline">Terms</Link>
                        <span>&bull;</span>
                        <Link to="/privacy" className="hover:underline">Privacy</Link>
                    </div>
                )}
                {onToggle && (
                    <button
                        onClick={onToggle}
                        className={`flex items-center w-full p-3 rounded-lg ${inactiveLinkClass} ${isCollapsed ? 'justify-center' : ''}`}
                        aria-label="Toggle sidebar"
                    >
                        <PanelLeftCloseIcon />
                        {!isCollapsed && <span className="ml-3 font-semibold">Collapse</span>}
                    </button>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
