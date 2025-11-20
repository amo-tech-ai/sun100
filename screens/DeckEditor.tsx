
import React, { useState, useEffect, useCallback } from 'react';
import SlideOutline from '../components/SlideOutline';
import EditorPanel from '../components/EditorPanel';
import { DeckEditorProvider, useDeckEditor } from '../contexts/DeckEditorContext';

// ICONS
const PanelLeftOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/></svg>
);
const PanelLeftCloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 15-3-3 3-3"/></svg>
);

const DeckEditorContent: React.FC = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const { deck, loading } = useDeckEditor();

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#FBF8F5]">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-[#E87C4D]"></div>
            </div>
        );
    }

    if (!deck) {
        return <div className="flex h-screen items-center justify-center text-gray-500">Deck not found</div>;
    }

    return (
        <div className="flex h-screen bg-[#FBF8F5] overflow-hidden">
            {/* Sidebar */}
            <div className="relative flex h-full z-20 shadow-xl">
                <SlideOutline isCollapsed={isSidebarCollapsed} />
                
                {/* Toggle Button */}
                <button
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="absolute -right-4 top-6 z-30 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:bg-gray-50 transition-colors text-gray-600"
                    title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    {isSidebarCollapsed ? <PanelLeftOpenIcon /> : <PanelLeftCloseIcon />}
                </button>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
                <EditorPanel />
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
