import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-orange" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM4.225 4.225a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM15.775 4.225a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zM17 10a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM8 10a2 2 0 114 0 2 2 0 01-4 0zM4.225 15.775a1 1 0 010-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zM10 17a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM14.364 14.364a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const PublicLayout: React.FC = () => {
    const navLinks = [
        { name: 'About', path: '/about' },
        { name: 'Perks', path: '/perks' },
        { name: 'Events', path: '/events' },
        { name: 'Jobs', path: '/jobs' },
        { name: 'Blogs', path: '/blogs' },
    ];
    return (
        <div className="min-h-screen flex flex-col bg-[#FBF8F5] font-sans">
            <header className="w-full bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link to="/" className="flex items-center gap-2">
                            <SunIcon />
                            <span className="font-bold font-heading text-2xl text-gray-800">Sun AI</span>
                        </Link>
                        <nav className="hidden md:flex items-center gap-6">
                           {navLinks.map(link => (
                               <NavLink 
                                key={link.path}
                                to={link.path} 
                                className={({isActive}) => `font-semibold text-gray-600 hover:text-brand-orange transition-colors ${isActive ? 'text-brand-orange' : ''}`}
                               >
                                {link.name}
                               </NavLink>
                           ))}
                        </nav>
                        <div className="flex items-center">
                            <Link 
                                to="/dashboard"
                                className="inline-block bg-brand-orange text-white font-bold py-2 px-5 rounded-lg hover:bg-opacity-90 transition-colors duration-200"
                            >
                                Join Community
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
            
            <main className="flex-1 w-full">
                <Outlet />
            </main>

            <footer className="w-full bg-white border-t border-gray-200 mt-20">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-gray-600">
                        <div>
                            <h3 className="font-semibold font-heading text-gray-900">Community</h3>
                            <ul className="mt-4 space-y-2">
                                <li><Link to="/about" className="hover:text-brand-orange">About Us</Link></li>
                                <li><Link to="/how-it-works" className="hover:text-brand-orange">How It Works</Link></li>
                                <li><Link to="/blogs" className="hover:text-brand-orange">Blog</Link></li>
                                <li><Link to="/jobs" className="hover:text-brand-orange">Careers</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold font-heading text-gray-900">For Founders</h3>
                             <ul className="mt-4 space-y-2">
                                <li><Link to="/events" className="hover:text-brand-orange">Events</Link></li>
                                <li><Link to="/perks" className="hover:text-brand-orange">Perks & Credits</Link></li>
                                <li><Link to="/dashboard" className="hover:text-brand-orange">Submit Startup</Link></li>
                            </ul>
                        </div>
                         <div>
                            <h3 className="font-semibold font-heading text-gray-900">For Investors</h3>
                             <ul className="mt-4 space-y-2">
                                <li><Link to="/dashboard" className="hover:text-brand-orange">Founder Dashboard</Link></li>
                                <li><Link to="/dashboard" className="hover:text-brand-orange">AI Projects</Link></li>
                                <li><Link to="/dashboard" className="hover:text-brand-orange">Analytics</Link></li>
                            </ul>
                        </div>
                         <div>
                            <h3 className="font-semibold font-heading text-gray-900">Legal & Contact</h3>
                             <ul className="mt-4 space-y-2">
                                <li><a href="#" className="hover:text-brand-orange">Contact Us</a></li>
                                <li><a href="#" className="hover:text-brand-orange">Slack Community</a></li>
                                <li><Link to="/privacy" className="hover:text-brand-orange">Privacy Policy</Link></li>
                                <li><Link to="/terms" className="hover:text-brand-orange">Terms of Service</Link></li>
                            </ul>
                        </div>
                   </div>
                   <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
                        <p className="text-gray-500">&copy; {new Date().getFullYear()} Sun AI. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 sm:mt-0">
                            <a href="#" className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">LinkedIn</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                            </a>
                             <a href="#" className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Slack</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.685 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0 2.528 2.528 0 0 1 17.685 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.52-2.522 2.528 2.528 0 0 1 2.522 2.522 2.528 2.528 0 0 1-2.522 2.521h-2.52v-2.521zM15.165 17.685a2.528 2.528 0 0 1-2.52-2.52 2.528 2.528 0 0 1 2.52-2.523h6.313A2.528 2.528 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.52h-6.313z" /></svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-500">
                               <span className="sr-only">Newsletter</span>
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                            </a>
                        </div>
                   </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
