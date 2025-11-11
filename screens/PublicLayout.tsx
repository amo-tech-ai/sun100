import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#E87C4D]" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM4.225 4.225a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM15.775 4.225a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zM17 10a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM8 10a2 2 0 114 0 2 2 0 01-4 0zM4.225 15.775a1 1 0 010-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zM10 17a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM14.364 14.364a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const PublicLayout: React.FC = () => {
    const navLinks = [
        { name: 'About', path: '/about'},
        { name: 'Services', path: '/services'},
        { name: 'Blog', path: '/blogs'},
        { name: 'Events', path: '/events'},
        { name: 'How It Works', path: '/how-it-works'},
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#FBF8F5]">
            <header className="w-full bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link to="/" className="flex items-center gap-2">
                            <SunIcon />
                            <span className="font-bold text-2xl text-gray-800">Sun AI</span>
                        </Link>
                        <nav className="hidden md:flex items-center space-x-6">
                            {navLinks.map(link => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    className={({isActive}) => `text-sm font-semibold transition-colors ${isActive ? 'text-[#E87C4D]' : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </nav>
                        <div className="flex items-center">
                             <Link 
                                to="/dashboard"
                                className="inline-block bg-[#E87C4D] text-white font-bold py-2 px-5 rounded-lg hover:bg-opacity-90 transition-colors duration-200 shadow-md"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
            
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Outlet />
            </main>

            <footer className="w-full bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Sun AI. All rights reserved.</p>
                    <div className="mt-4 flex justify-center gap-6">
                        <Link to="/terms" className="text-sm hover:underline">Terms of Service</Link>
                        <Link to="/privacy" className="text-sm hover:underline">Privacy Policy</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;