
import React, { useState, useEffect } from 'react';
import AIToolbox, { AITab } from './AIToolbox';
import { useDeckEditor } from '../contexts/DeckEditorContext';

// Icons
const WandIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/></svg>;
const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>;
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>;
const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>;
const RefreshIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;

interface RightSidebarProps {
    isMobile?: boolean;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ isMobile = false }) => {
    // Initialize from localStorage (desktop only)
    const [isCollapsed, setIsCollapsed] = useState(() => {
        if (isMobile) return false;
        return localStorage.getItem('deckEditor_rightSidebarCollapsed') === 'true';
    });
    const [activeTab, setActiveTab] = useState<AITab>('copilot');
    const { selectedSlide } = useDeckEditor();

    // Persist to localStorage (desktop only)
    useEffect(() => {
        if (!isMobile) {
            localStorage.setItem('deckEditor_rightSidebarCollapsed', String(isCollapsed));
        }
    }, [isCollapsed, isMobile]);

    const tabs: { id: AITab; icon: React.ReactNode; label: string }[] = [
        { id: 'copilot', icon: <WandIcon />, label: 'Copilot' },
        { id: 'image', icon: <ImageIcon />, label: 'Visuals' },
        { id: 'analysis', icon: <ChartIcon />, label: 'Analysis' },
        { id: 'research', icon: <GlobeIcon />, label: 'Research' },
        { id: 'sync', icon: <RefreshIcon />, label: 'Sync' },
    ];

    const handleTabClick = (tabId: AITab) => {
        if (isCollapsed && !isMobile) {
            setIsCollapsed(false);
        }
        setActiveTab(tabId);
    };

    // Calculate width class based on mobile/desktop state
    const widthClass = isMobile ? 'w-full border-none' : `${isCollapsed ? 'w-14' : 'w-[340px]'} border-l border-gray-200`;

    return (
        <div className={`flex flex-col bg-white transition-all duration-300 ease-in-out h-full ${widthClass} flex-shrink-0 relative shadow-xl z-30`}>
            
            {/* Header Area */}
            <div className={`h-14 border-b border-gray-200 flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'justify-between px-4'} bg-white flex-shrink-0`}>
                {(!isCollapsed || isMobile) && (
                    <span className="font-bold text-sm text-gray-800 uppercase tracking-wide flex items-center gap-2">
                        {tabs.find(t => t.id === activeTab)?.icon}
                        {tabs.find(t => t.id === activeTab)?.label}
                    </span>
                )}
                {!isMobile && (
                    <button 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1.5 text-gray-400 hover:text-brand-blue hover:bg-gray-100 rounded-md transition-colors"
                        title={isCollapsed ? "Expand AI Tools" : "Collapse Sidebar"}
                    >
                        <div className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
                            <ChevronRightIcon />
                        </div>
                    </button>
                )}
            </div>

            {/* Main Body */}
            <div className="flex-1 flex overflow-hidden h-full">
                
                {/* Navigation Rail */}
                <div className={`flex flex-col items-center py-3 gap-1 bg-gray-50 border-r border-gray-100 transition-all duration-300 overflow-y-auto ${isCollapsed && !isMobile ? 'w-full' : 'w-14'}`}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            className={`p-2.5 rounded-lg transition-all group relative flex-shrink-0 ${activeTab === tab.id ? 'bg-white text-brand-orange shadow-sm border border-gray-200' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'}`}
                            title={tab.label}
                        >
                            {tab.icon}
                            {/* Tooltip for collapsed state */}
                            {isCollapsed && !isMobile && (
                                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-50 shadow-lg">
                                    {tab.label}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                {(!isCollapsed || isMobile) && (
                    <div className="flex-1 overflow-hidden bg-white relative">
                         <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
                             <AIToolbox activeTab={activeTab} />
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RightSidebar;
