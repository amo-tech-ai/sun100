import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const DashboardLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });
  const location = useLocation();

  useEffect(() => {
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
  }, [location]);

  // Persist sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  // Keyboard shortcut (Cmd/Ctrl + B) to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'b') {
        event.preventDefault();
        handleToggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleToggleSidebar]);


  return (
    <div className="flex h-screen bg-slate-app-bg text-slate-900 font-sans">
      {/* --- Desktop Sidebar --- */}
      <div className="hidden lg:flex flex-shrink-0 z-20">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={handleToggleSidebar} />
      </div>

      {/* --- Mobile Sidebar (Drawer) --- */}
      <div className={`fixed inset-0 z-40 transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} aria-hidden="true"></div>
        <div className="relative z-10 w-64 bg-white h-full shadow-xl">
          <Sidebar isCollapsed={false} />
        </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* --- Mobile Header --- */}
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        
        {/* --- Main Content --- */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;