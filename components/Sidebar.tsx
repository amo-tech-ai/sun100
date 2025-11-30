




import React from 'react';
import { NavLink, Link } from 'react-router-dom';

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
                    {!isCollapsed && <span className="font-bold text-xl">sun ai startup</span>}
                </Link>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
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
                 <NavLink
                    to="/pitch-decks"
                    className={({ isActive, isPending }) =>
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
                    to="/dashboard/investor-docs"
                    className={({ isActive }) => `flex items-center p-3 rounded-lg ${isActive ? activeLinkClass : inactiveLinkClass} ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <BriefcaseIcon />
                    {!isCollapsed && <span className="ml-3 font-semibold">Investor Docs</span>}
                </NavLink>
                <NavLink
                    to="/dashboard/data-room"
                    className={({ isActive }) => `flex items-center p-3 rounded-lg ${isActive ? activeLinkClass : inactiveLinkClass} ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <LockIcon />
                    {!isCollapsed && <span className="ml-3 font-semibold">Data Room</span>}
                </NavLink>
                <NavLink
                    to="/dashboard/gtm-strategy"
                    className={({ isActive }) => `flex items-center p-3 rounded-lg ${isActive ? activeLinkClass : inactiveLinkClass} ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <MapIcon />
                    {!isCollapsed && <span className="ml-3 font-semibold">GTM Strategy</span>}
                </NavLink>
                 <NavLink
                    to="/dashboard/my-events"
                    className={({ isActive }) => `flex items-center p-3 rounded-lg ${isActive ? activeLinkClass : inactiveLinkClass} ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <CalendarIcon />
                    {!isCollapsed && <span className="ml-3 font-semibold">My Events</span>}
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