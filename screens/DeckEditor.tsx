
import React, { useState, useEffect, useCallback } from 'react';
import SlideOutline from '../components/SlideOutline';
import EditorPanel from '../components/EditorPanel';
import { DeckEditorProvider, useDeckEditor } from '../contexts/DeckEditorContext';

// ICONS
const PanelLeftOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/></svg>
);
const PanelLeftCloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 15-3-3 3-3"/></svg>
);


// Internal component to use the context
const DeckEditorLayout: React.FC = () => {
    const { loading, deck, selectedSlide, handlePrevSlide, handleNextSlide } = useDeckEditor();
    
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        return localStorage.getItem('editorSidebarCollapsed') === 'true';
    });

    useEffect(() => {
        localStorage.setItem('editorSidebarCollapsed', String(isSidebarCollapsed));
    }, [isSidebarCollapsed]);

    const toggleSidebar = useCallback(() => {
        setIsSidebarCollapsed(isCollapsed => !isCollapsed);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') handleNextSlide();
            else if (e.key === 'ArrowLeft') handlePrevSlide();
            else if ((e.metaKey || e.ctrlKey) && e.key === '[') toggleSidebar();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNextSlide, handlePrevSlide, toggleSidebar]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#FBF8F5]">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-[#E87C4D]"></div>
            </div>
        );
    }
    
    if (!deck || !selectedSlide) {
         return (
            <div className="flex h-screen w-full items-center justify-center bg-[#FBF8F5] text-center">
                <div>
                    <h2 className="text-2xl font-bold text-brand-blue">Deck loaded, but no slide selected.</h2>
                    <p className="text-gray-600">Please select a slide from the outline to begin editing.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row h-full w-full bg-[#FBF8F5] text-gray-800">
            <div className="hidden lg:flex flex-shrink-0">
              <SlideOutline
                  isCollapsed={isSidebarCollapsed}
              />
            </div>
            <div className="flex-1 flex flex-col relative">
                <button 
                    onClick={toggleSidebar}
                    className="absolute top-4 -left-4 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm hover:bg-gray-100 transition-all hidden lg:flex"
                    aria-label="Toggle sidebar"
                    aria-expanded={!isSidebarCollapsed}
                >
                    {isSidebarCollapsed ? <PanelLeftOpenIcon /> : <PanelLeftCloseIcon />}
                </button>
                <EditorPanel />
            </div>
        </div>
    );
};

const DeckEditor: React.FC = () => {
    return (
        <DeckEditorProvider>
            <DeckEditorLayout />
        </DeckEditorProvider>
    );
};

export default DeckEditor;
