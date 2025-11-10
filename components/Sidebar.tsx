import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';

// FIX: Completed the SunIcon SVG path which was truncated.
const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#E87C4D]" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM4.225 4.225a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM15.775 4.225a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zM17 10a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM8 10a2 2 0 114 0 2 2 0 01-4 0zM4.225 15.775a1 1 0 010-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zM10 17a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM14.364 14.364a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const PanelLeftCloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 15-3-3 3-3"/></svg>
);
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;


interface SidebarProps {
    isCollapsed: boolean;
    onToggle?: () => void;
}

const activeLinkClass = 'bg-orange-100 text-[#E87C4D]';
const inactiveLinkClass = 'text-gray-500 hover:bg-gray-100 hover:text-gray-800';

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        navigate('/login');
    };

    return (
        <aside className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className={`h-20 flex items-center border-b border-gray-200 ${isCollapsed ? 'justify-center' : 'px-6'}`}>
                <div className="flex items-center gap-2">
                    <SunIcon />
                    {!isCollapsed && <span className="font-bold text-xl">Sun AI</span>}
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => `flex items-center p-3 rounded-lg ${isActive ? activeLinkClass : inactiveLinkClass} ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <HomeIcon />
                    {!isCollapsed && <span className="ml-3 font-semibold">Dashboard</span>}
                </NavLink>
                <NavLink
                    to="/pitch-deck"
                    className={({ isActive }) => `flex items-center p-3 rounded-lg ${isActive ? activeLinkClass : inactiveLinkClass} ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <PlusIcon />
                    {!isCollapsed && <span className="ml-3 font-semibold">New Deck</span>}
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
                 <button
                    onClick={handleLogout}
                    className={`flex items-center w-full p-3 rounded-lg ${inactiveLinkClass} ${isCollapsed ? 'justify-center' : ''}`}
                    aria-label="Logout"
                >
                    <LogoutIcon />
                    {!isCollapsed && <span className="ml-3 font-semibold">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;