
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

// Mobile Nav Icons
const LayersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;

const DeckEditorContent: React.FC = () => {
    // Initialize from localStorage
    const [isOutlineCollapsed, setIsOutlineCollapsed] = useState(() => {
        return localStorage.getItem('deckEditor_outlineCollapsed') === 'true';
    });
    // Mobile Tab State
    const [activeMobileTab, setActiveMobileTab] = useState<'slides' | 'editor' | 'ai'>('editor');
    
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
        <div className="flex flex-col h-full bg-white overflow-hidden font-sans text-slate-900">
            
            {/* --- MOBILE VIEW (Single Column with Bottom Nav) --- */}
            <div className="lg:hidden flex-1 flex flex-col overflow-hidden relative">
                {/* Content Panels (Only one active at a time) */}
                <div className={`flex-1 flex flex-col h-full overflow-hidden ${activeMobileTab === 'slides' ? 'block' : 'hidden'}`}>
                    <SlideOutline isCollapsed={false} />
                </div>
                <div className={`flex-1 flex flex-col h-full bg-[#F3F4F6] overflow-hidden ${activeMobileTab === 'editor' ? 'block' : 'hidden'}`}>
                    <EditorPanel />
                </div>
                <div className={`flex-1 flex flex-col h-full overflow-hidden ${activeMobileTab === 'ai' ? 'block' : 'hidden'}`}>
                    <RightSidebar isMobile={true} />
                </div>
            </div>

            {/* Mobile Bottom Navigation Bar - Enhanced */}
            <div className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200/80 flex justify-around items-center h-[60px] flex-shrink-0 z-50 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <button 
                    onClick={() => setActiveMobileTab('slides')} 
                    className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 active:scale-95 ${activeMobileTab === 'slides' ? 'text-brand-orange' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <div className={`p-1.5 rounded-xl transition-colors ${activeMobileTab === 'slides' ? 'bg-brand-orange/10' : ''}`}>
                        <LayersIcon />
                    </div>
                    <span className={`text-[10px] font-bold mt-0.5 ${activeMobileTab === 'slides' ? 'text-brand-orange' : ''}`}>Slides</span>
                </button>
                <button 
                    onClick={() => setActiveMobileTab('editor')} 
                    className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 active:scale-95 ${activeMobileTab === 'editor' ? 'text-brand-orange' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <div className={`p-1.5 rounded-xl transition-colors ${activeMobileTab === 'editor' ? 'bg-brand-orange/10' : ''}`}>
                        <EditIcon />
                    </div>
                    <span className={`text-[10px] font-bold mt-0.5 ${activeMobileTab === 'editor' ? 'text-brand-orange' : ''}`}>Editor</span>
                </button>
                <button 
                    onClick={() => setActiveMobileTab('ai')} 
                    className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 active:scale-95 ${activeMobileTab === 'ai' ? 'text-brand-orange' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <div className={`p-1.5 rounded-xl transition-colors ${activeMobileTab === 'ai' ? 'bg-brand-orange/10' : ''}`}>
                        <SparklesIcon />
                    </div>
                    <span className={`text-[10px] font-bold mt-0.5 ${activeMobileTab === 'ai' ? 'text-brand-orange' : ''}`}>AI Tools</span>
                </button>
            </div>


            {/* --- DESKTOP VIEW (3-Column Layout) --- */}
            <div className="hidden lg:flex h-full w-full">
                
                {/* 1. Center (Editor Canvas) - Visually First/Middle */}
                <div className="flex-1 flex flex-col h-full relative z-10 min-w-0 bg-gray-50/50 order-2">
                    <EditorPanel />
                </div>

                {/* 2. Slide Outline - Visually Second/Left */}
                <div className={`relative flex h-full border-r border-gray-200 bg-white z-20 transition-all duration-300 ease-in-out ${isOutlineCollapsed ? 'w-16' : 'w-[280px]'} flex-shrink-0 order-1 print:hidden`}>
                    <SlideOutline isCollapsed={isOutlineCollapsed} />
                    
                    {/* Toggle Button */}
                    <button
                        onClick={() => setIsOutlineCollapsed(!isOutlineCollapsed)}
                        className="absolute -right-3 top-4 z-30 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:shadow-md hover:text-brand-orange transition-all text-gray-400"
                        title={isOutlineCollapsed ? "Expand Outline" : "Collapse Outline"}
                    >
                        {isOutlineCollapsed ? <PanelLeftOpenIcon /> : <PanelLeftCloseIcon />}
                    </button>
                </div>

                {/* 3. AI Tools - Visually Third/Right */}
                <div className="print:hidden h-full order-3">
                    <RightSidebar />
                </div>
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
