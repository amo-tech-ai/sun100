import React from 'react';
import { NavLink } from 'react-router-dom';

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#E87C4D]" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM4.225 4.225a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM15.775 4.225a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zM17 10a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM8 10a2 2 0 114 0 2 2 0 01-4 0zM4.225 15.775a1 1 0 010-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zM10 17a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM14.364 14.364a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const Sidebar: React.FC = () => {
    const navLinkClasses = "flex items-center px-4 py-3 mt-2 text-gray-100 transition-colors duration-200 transform rounded-md hover:bg-gray-700";
    const activeNavLinkClasses = "bg-[#E87C4D]";

    return (
        <aside className="w-64 bg-gray-800 text-white flex flex-col flex-shrink-0 h-full">
            <div className="flex items-center justify-center h-20 border-b border-gray-700">
                <SunIcon />
                <span className="ml-2 text-2xl font-bold">Sun AI</span>
            </div>
            <nav className="flex-1 px-4 py-4">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ""}`}
                >
                    <span className="mx-4 font-medium">Dashboard</span>
                </NavLink>
                 {/* Add more links here later */}
            </nav>
            <div className="p-4 border-t border-gray-700">
                <p className="text-sm text-gray-400">© 2024 Sun AI, Inc.</p>
            </div>
        </aside>
    );
};

export default Sidebar;
