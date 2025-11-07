import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { mockDeck, Deck, Slide } from '../data/decks';
import SlideOutline from '../components/SlideOutline';
import EditorPanel from '../components/EditorPanel';

// ICONS
const PanelLeftOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/></svg>
);
const PanelLeftCloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 15-3-3 3-3"/></svg>
);


const DeckEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const { generatedDeck } = location.state || {};

    const [deck, setDeck] = useState<Deck | null>(null);
    const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    useEffect(() => {
        const storedDeckJson = sessionStorage.getItem(`deck-${id}`);
        const storedDeck = storedDeckJson ? JSON.parse(storedDeckJson) : null;
        const initialDeck = generatedDeck || storedDeck || mockDeck;
        
        setDeck(initialDeck);
        if (initialDeck.slides.length > 0) {
            setSelectedSlide(initialDeck.slides[0]);
        }
    }, [id, generatedDeck]);

    useEffect(() => {
        if (deck) {
            sessionStorage.setItem(`deck-${deck.id}`, JSON.stringify(deck));
        }
    }, [deck]);

    const handleSlideSelect = useCallback((slide: Slide) => {
        setSelectedSlide(slide);
    }, []);

    const handleTitleSave = (newTitle: string) => {
        if (deck) {
            setDeck({ ...deck, title: newTitle });
        }
    };

    const handlePrevSlide = useCallback(() => {
        if (!deck || !selectedSlide) return;
        const currentIndex = deck.slides.findIndex(s => s.id === selectedSlide.id);
        if (currentIndex > 0) {
            setSelectedSlide(deck.slides[currentIndex - 1]);
        }
    }, [deck, selectedSlide]);

    const handleNextSlide = useCallback(() => {
        if (!deck || !selectedSlide) return;
        const currentIndex = deck.slides.findIndex(s => s.id === selectedSlide.id);
        if (currentIndex < deck.slides.length - 1) {
            setSelectedSlide(deck.slides[currentIndex + 1]);
        }
    }, [deck, selectedSlide]);
    
    const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                handleNextSlide();
            } else if (e.key === 'ArrowLeft') {
                handlePrevSlide();
            } else if ((e.metaKey || e.ctrlKey) && e.key === '[') {
                toggleSidebar();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleNextSlide, handlePrevSlide]);


    if (!deck || !selectedSlide) {
        return <div className="p-8">Loading deck...</div>;
    }
    
    const selectedSlideIndex = deck.slides.findIndex(s => s.id === selectedSlide.id);

    return (
        <div className="flex h-screen bg-[#FBF8F5] overflow-hidden text-gray-800">
             <SlideOutline
                deckId={deck.id}
                deckTitle={deck.title}
                slides={deck.slides}
                template={deck.template}
                selectedSlideId={selectedSlide.id}
                onSlideSelect={handleSlideSelect}
                onTitleSave={handleTitleSave}
                isCollapsed={isSidebarCollapsed}
            />
            <div className="flex-1 flex flex-col relative">
                 <button 
                    onClick={toggleSidebar}
                    className="absolute top-4 -left-4 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm hover:bg-gray-100 transition-all"
                    aria-label="Toggle sidebar"
                    aria-expanded={!isSidebarCollapsed}
                >
                    {isSidebarCollapsed ? <PanelLeftOpenIcon /> : <PanelLeftCloseIcon />}
                 </button>
                 <EditorPanel
                    deck={deck}
                    selectedSlide={selectedSlide}
                    selectedSlideIndex={selectedSlideIndex}
                    totalSlides={deck.slides.length}
                    // TODO: Replace with real state and handlers
                    isGeneratingImage={false}
                    isEditingImage={false}
                    imageError={null}
                    isCopilotLoading={false}
                    isAnalyzing={false}
                    analysisResult={null}
                    isResearching={false}
                    researchResult={null}
                    handleGenerateImage={async () => {}}
                    handleEditImage={async () => {}}
                    handleCopilotGenerate={async () => {}}
                    handleAnalyzeSlide={async () => {}}
                    handleResearch={async () => {}}
                    onPrevSlide={handlePrevSlide}
                    onNextSlide={handleNextSlide}
                />
            </div>
        </div>
    );
};

export default DeckEditor;