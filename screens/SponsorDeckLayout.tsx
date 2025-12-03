
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const StartupDeckLayout: React.FC = () => {
    const navLinks = [
        { name: 'Overview', path: '/startup-deck' },
        { name: 'Showcase', path: '/startup-deck/showcase' },
        { name: 'Categories', path: '/startup-deck/categories' },
        { name: 'Stories', path: '/startup-deck/stories' },
        { name: 'Apply', path: '/startup-deck/apply' },
    ];

    return (
        <div>
            <div className="mb-8">
                <nav className="border-b border-gray-200">
                    <ul className="flex -mb-px space-x-8 overflow-x-auto">
                        {navLinks.map(link => (
                            <li key={link.name}>
                                <NavLink
                                    to={link.path}
                                    end={link.path === '/startup-deck'}
                                    className={({ isActive }) => 
                                        `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                            isActive 
                                            ? 'border-brand-orange text-brand-orange' 
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <Outlet />
        </div>
    );
};

export default StartupDeckLayout;
