
import React, { useState, useEffect } from 'react';
import SlideOutline from '../components/SlideOutline';
import EditorPanel from '../components/EditorPanel';
import RightSidebar from '../components/RightSidebar';
import { DeckEditorProvider, useDeckEditor } from '../contexts/DeckEditorContext';

// ICONS
const PanelLeftOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/></svg>
);
const PanelLeftCloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 15-3-3 3-3"/></svg>
);

const DeckEditorContent: React.FC = () => {
    // Initialize from localStorage with updated key
    const [isOutlineCollapsed, setIsOutlineCollapsed] = useState(() => {
        return localStorage.getItem('deckEditor_outlineCollapsed') === 'true';
    });
    const { deck, loading } = useDeckEditor();

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem('deckEditor_outlineCollapsed', String(isOutlineCollapsed));
    }, [isOutlineCollapsed]);

    if (loading) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-[#FBF8F5]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-brand-orange"></div>
                    <p className="text-gray-500 font-medium">Loading workspace...</p>
                </div>
            </div>
        );
    }

    if (!deck) {
        return <div className="flex h-full items-center justify-center text-gray-500">Deck not found</div>;
    }

    return (
        <div className="flex h-full bg-white overflow-hidden font-sans text-slate-900">
            
            {/* 1. Center (Editor Canvas) - Now Visually First (Left) */}
            <div className="flex-1 flex flex-col h-full relative z-10 min-w-0 bg-gray-50/50 order-1">
                <EditorPanel />
            </div>

            {/* 2. Slide Outline - Now Visually Second (Right) */}
            <div className={`relative flex h-full border-l border-gray-200 bg-white z-20 transition-all duration-300 ease-in-out ${isOutlineCollapsed ? 'w-16' : 'w-[280px]'} flex-shrink-0 order-2 print:hidden`}>
                <SlideOutline isCollapsed={isOutlineCollapsed} />
                
                {/* Toggle Button for Sidebar - Positioned on the Left edge to float over canvas */}
                <button
                    onClick={() => setIsOutlineCollapsed(!isOutlineCollapsed)}
                    className="absolute -left-3 top-4 z-30 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:shadow-md hover:text-brand-orange transition-all text-gray-400"
                    title={isOutlineCollapsed ? "Expand Outline" : "Collapse Outline"}
                >
                    {/* 
                        Logic:
                        - If collapsed (width 16), we want to Expand (arrow points Left <). Icon: PanelLeftCloseIcon.
                        - If expanded (width 280), we want to Collapse (arrow points Right >). Icon: PanelLeftOpenIcon.
                    */}
                    {isOutlineCollapsed ? <PanelLeftCloseIcon /> : <PanelLeftOpenIcon />}
                </button>
            </div>

            {/* 3. AI Tools - Visually Third (Far Right) */}
            <div className="print:hidden h-full order-3">
                <RightSidebar />
            </div>
        </div>
    );
};

const DeckEditor: React.FC = () => {
    return (
        <DeckEditorProvider>
            <DeckEditorContent />
        </DeckEditorProvider>
    );
};

export default DeckEditor;
