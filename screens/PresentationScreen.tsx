import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { mockDeck, Deck } from '../data/decks';
import { templates } from '../styles/templates';

const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);


const PresentationScreen: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { deck: deckFromState } = location.state || {};
    
    const [deck, setDeck] = useState<Deck | null>(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    useEffect(() => {
        // Load deck with priority: Navigation state > Session Storage > Mock Data
        console.log(`Presenting deck with id: ${id}`);
        const storedDeckJson = sessionStorage.getItem(`deck-${id}`);
        const storedDeck = storedDeckJson ? JSON.parse(storedDeckJson) : null;
        const deckToLoad = deckFromState || storedDeck || mockDeck;
        setDeck(deckToLoad);
    }, [id, deckFromState]);

    const handlePrev = useCallback(() => {
        if (!deck) return;
        setCurrentSlideIndex(prev => (prev > 0 ? prev - 1 : prev));
    }, [deck]);

    const handleNext = useCallback(() => {
        if (!deck) return;
        setCurrentSlideIndex(prev => (prev < deck.slides.length - 1 ? prev + 1 : prev));
    }, [deck]);
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                handleNext();
            } else if (e.key === 'ArrowLeft') {
                handlePrev();
            } else if (e.key === 'Escape') {
                navigate(`/dashboard/decks/${id}/edit`);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleNext, handlePrev, navigate, id]);

    if (!deck) {
        return (
            <div className="bg-gray-900 text-white h-screen w-screen flex items-center justify-center">
                <p>Loading Presentation...</p>
            </div>
        );
    }
    
    const activeSlide = deck.slides[currentSlideIndex];
    const templateStyles = templates[deck.template];

    return (
        <div className="bg-gray-900 text-white h-screen w-screen flex flex-col items-center justify-center relative p-4 select-none">
            {/* Header Controls */}
            <div className="absolute top-4 right-4 z-20">
                <button
                    onClick={() => navigate(`/dashboard/decks/${id}/edit`)}
                    className="bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors text-sm opacity-80 hover:opacity-100"
                >
                    Exit (Esc)
                </button>
            </div>

            {/* Slide Content */}
            <div className="w-full h-full flex items-center justify-center p-16">
                 <div className="w-full max-w-6xl aspect-video bg-black rounded-lg shadow-2xl relative">
                     {/* The actual slide content */}
                    <div className={`w-full h-full shadow-lg rounded-lg overflow-hidden ${templateStyles.slide}`}>
                         {activeSlide.imageUrl && (
                            <div className={templateStyles.imageContainer}>
                                <img src={activeSlide.imageUrl} alt={activeSlide.title} className={templateStyles.image} />
                            </div>
                         )}
                         <div className={templateStyles.textContainer ?? ''}>
                            <h1 className={templateStyles.title}>{activeSlide.title}</h1>
                            <ul className={templateStyles.content}>
                                {activeSlide.content.split('\n').map((point, i) => (
                                    <li key={i} className={templateStyles.bullet}>{point}</li>
                                ))}
                            </ul>
                         </div>
                    </div>
                </div>
            </div>

            {/* Navigation Controls */}
            <div className="absolute inset-0 flex justify-between items-center z-10">
                <button 
                    onClick={handlePrev} 
                    disabled={currentSlideIndex === 0}
                    className="h-full w-1/6 text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-0 transition-all"
                    aria-label="Previous Slide"
                >
                    <ChevronLeftIcon />
                </button>
                <button 
                    onClick={handleNext} 
                    disabled={currentSlideIndex === deck.slides.length - 1}
                    className="h-full w-1/6 text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-0 transition-all flex justify-end"
                    aria-label="Next Slide"
                >
                    <ChevronRightIcon />
                </button>
            </div>

            {/* Footer Info */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-400 text-sm">
                {currentSlideIndex + 1} / {deck.slides.length}
            </div>
        </div>
    );
};

export default PresentationScreen;