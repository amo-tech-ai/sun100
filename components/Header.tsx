
import React from 'react';

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
);

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#E87C4D]" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM4.225 4.225a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM15.775 4.225a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zM17 10a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM8 10a2 2 0 114 0 2 2 0 01-4 0zM4.225 15.775a1 1 0 010-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zM10 17a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM14.364 14.364a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


interface HeaderProps {
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => (
    <header className="sticky top-0 z-30 bg-[#FBF8F5]/80 backdrop-blur-sm p-4 border-b border-gray-200 flex items-center justify-between lg:hidden" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0) + 1rem)', paddingBottom: '1rem' }}>
        <div className="flex items-center gap-2">
            <SunIcon />
            <span className="font-bold text-lg">StartupAI</span>
        </div>
        <button onClick={onMenuClick} aria-label="Open menu" className="p-2 -mr-2">
            <MenuIcon />
        </button>
    </header>
);

export default Header;
