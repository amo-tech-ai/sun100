
import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';

const PublicLayout: React.FC = () => {
    const navLinks = [
        { name: 'About', path: '/about'},
        { name: 'How It Works', path: '/how-it-works'},
        { name: 'Business Model', path: '/business-model'},
        { name: 'Services', path: '/services'},
        { name: 'Blog', path: '/blogs'},
        { name: 'Events', path: '/events'},
        { name: 'Startup Deck', path: '/startup-deck'},
    ];

    return (
        <div className="min-h-screen flex flex-col bg-brand-off-white">
            <header className="relative z-20 py-6 px-4 sm:px-6 lg:px-8 bg-brand-off-white/80 backdrop-blur-sm border-b border-gray-200/50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link className="flex items-center space-x-2" to="/">
                        <span className="material-symbols-outlined text-brand-orange text-3xl">flare</span>
                        <span className="font-bold text-xl text-brand-blue">StartupAI</span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-8 text-sm text-gray-700">
                         {navLinks.map(link => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={({isActive}) => `transition-colors font-medium ${isActive ? 'text-brand-orange' : 'hover:text-brand-orange'}`}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </nav>
                    <Link to="/dashboard" className="bg-brand-orange text-white font-semibold py-2 px-5 rounded-lg text-sm hover:bg-opacity-90 transition-opacity">Get Started</Link>
                </div>
            </header>
            
            <main className="flex-1 w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <Outlet />
            </main>

            <footer className="bg-white dark:bg-card-dark border-t border-border-light dark:border-border-dark">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                        <div className="col-span-2 md:col-span-1">
                            <Link className="flex items-center space-x-2" to="/">
                                <span className="material-symbols-outlined text-brand-orange text-3xl">flare</span>
                                <span className="font-bold text-xl text-brand-blue">StartupAI</span>
                            </Link>
                        </div>
                        <div>
                            <h4 className="font-bold tracking-wider uppercase text-sm text-gray-800">Product</h4>
                            <ul className="mt-4 space-y-2 text-sm text-subtext-light dark:text-subtext-dark">
                                <li><Link className="hover:text-brand-orange" to="/pitch-decks/new">AI Pitch Deck Wizard</Link></li>
                                <li><Link className="hover:text-brand-orange" to="/how-it-works">How It Works</Link></li>
                                <li><Link className="hover:text-brand-orange" to="/jobs">AI Jobs</Link></li>
                                <li><Link className="hover:text-brand-orange" to="/events">Events</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold tracking-wider uppercase text-sm text-gray-800">Resources</h4>
                            <ul className="mt-4 space-y-2 text-sm text-subtext-light dark:text-subtext-dark">
                                <li><Link className="hover:text-brand-orange" to="/directory">Investor Directory</Link></li>
                                <li><Link className="hover:text-brand-orange" to="/blogs">Blog</Link></li>
                                <li><Link className="hover:text-brand-orange" to="#">Docs</Link></li>
                                <li><Link className="hover:text-brand-orange" to="#">API</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold tracking-wider uppercase text-sm text-gray-800">Community</h4>
                            <ul className="mt-4 space-y-2 text-sm text-subtext-light dark:text-subtext-dark">
                                <li><Link className="hover:text-brand-orange" to="/events">Events</Link></li>
                                <li><Link className="hover:text-brand-orange" to="#">Founders Circle</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold tracking-wider uppercase text-sm text-gray-800">Company</h4>
                            <ul className="mt-4 space-y-2 text-sm text-subtext-light dark:text-subtext-dark">
                                <li><Link className="hover:text-brand-orange" to="/about">About</Link></li>
                                <li><Link className="hover:text-brand-orange" to="#">Contact</Link></li>
                                <li><Link className="hover:text-brand-orange" to="#">Careers</Link></li>
                                <li><Link className="hover:text-brand-orange" to="/privacy">Privacy</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-border-light dark:border-border-dark text-center text-sm text-subtext-light dark:text-subtext-dark">
                        <p>© {new Date().getFullYear()} StartupAI. Empowering founders through intelligent design.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
