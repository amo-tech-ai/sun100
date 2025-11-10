import React from 'react';
import { NavLink } from 'react-router-dom';

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#E87C4D]" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM4.225 4.225a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM15.775 4.225a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zM17 10a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM8 10a2 2 0 114 0 2 2 0 01-4 0zM4.225 15.775a1 1 0 010-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zM10 17a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM14.364 14.364a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const ChevronsLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg>
);

const ChevronsRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/></svg>
);

const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
);

interface SidebarProps {
    isCollapsed: boolean;
    onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
    const navLinkClasses = "flex items-center px-4 py-3 text-gray-100 transition-colors duration-200 transform rounded-md hover:bg-gray-700";
    const activeNavLinkClasses = "bg-[#E87C4D]";

    return (
        <aside className={`bg-gray-800 text-white flex flex-col flex-shrink-0 h-full motion-safe:transition-width duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`} aria-expanded={!isCollapsed}>
            <div className={`flex items-center h-20 border-b border-gray-700 ${isCollapsed ? 'justify-center' : 'justify-center px-4'}`}>
                <SunIcon />
                <span className={`ml-2 text-2xl font-bold whitespace-nowrap overflow-hidden ${isCollapsed ? 'hidden' : 'block'}`}>Sun AI</span>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-2">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ""} ${isCollapsed ? 'justify-center' : ''}`}
                    title={isCollapsed ? "Dashboard" : undefined}
                    aria-label="Dashboard"
                >
                    <DashboardIcon />
                    <span className={`mx-4 font-medium whitespace-nowrap overflow-hidden ${isCollapsed ? 'hidden' : 'block'}`}>Dashboard</span>
                </NavLink>
                 {/* Add more links here later */}
            </nav>

            {onToggle && (
                <div className="p-2 border-t border-gray-700">
                    <button
                        onClick={onToggle}
                        className="w-full flex items-center justify-center p-3 text-gray-300 rounded-md hover:bg-gray-700"
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? <ChevronsRightIcon /> : <ChevronsLeftIcon />}
                        <span className="sr-only">{isCollapsed ? "Expand sidebar" : "Collapse sidebar"}</span>
                    </button>
                </div>
            )}
            
            <div className={`p-4 border-t border-gray-700 whitespace-nowrap overflow-hidden ${isCollapsed ? 'hidden' : 'block'}`}>
                <p className="text-sm text-gray-400">© 2024 Sun AI, Inc.</p>
            </div>
        </aside>
    );
};

export default Sidebar;
