import React, { useState, useEffect, useCallback } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { getDeckById } from '../services/deckService';
import { Deck } from '../data/decks';
import { templates } from '../styles/templates';
import Chart from '../components/Chart';
import Table from '../components/Table';

const { useParams, useNavigate } = ReactRouterDOM;

const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;

const PresentationScreen: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [deck, setDeck] = useState<Deck | null>(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    // 1. Load Deck
    useEffect(() => {
        const fetchDeck = async () => {
            if (!id) return;
            try {
                const fetchedDeck = await getDeckById(id);
                setDeck(fetchedDeck);
            } catch (e) {
                console.error("Failed to load deck", e);
            } finally {
                setLoading(false);
            }
        };
        fetchDeck();
    }, [id]);

    // 2. Navigation Handlers
    const handleNext = useCallback(() => {
        if (!deck) return;
        if (currentSlideIndex < deck.slides.length - 1) {
            setCurrentSlideIndex(prev => prev + 1);
        }
    }, [deck, currentSlideIndex]);

    const handlePrev = useCallback(() => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(prev => prev - 1);
        }
    }, [currentSlideIndex]);

    const handleExit = useCallback(() => {
        if (id) navigate(`/pitch-decks/${id}/edit`);
        else navigate('/dashboard');
    }, [id, navigate]);

    // 3. Keyboard Controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Space') {
                handleNext();
            } else if (e.key === 'ArrowLeft') {
                handlePrev();
            } else if (e.key === 'Escape') {
                handleExit();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev, handleExit]);

    // 4. Image Pre-loading Logic
    useEffect(() => {
        if (!deck) return;

        const preloadImage = (index: number) => {
            if (index < 0 || index >= deck.slides.length) return;
            const slide = deck.slides[index];
            // Check if it's a URL (including data URI)
            if (slide.imageUrl && (slide.imageUrl.startsWith('http') || slide.imageUrl.startsWith('data:image'))) {
                const img = new Image();
                img.src = slide.imageUrl;
            }
        };

        // Preload next and previous slides
        preloadImage(currentSlideIndex + 1);
        preloadImage(currentSlideIndex - 1);

    }, [deck, currentSlideIndex]);

    // Rendering helpers
    const renderWithMarkdown = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-black">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-[#E87C4D]"></div>
            </div>
        );
    }

    if (!deck) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-black text-white">
                <p>Deck not found.</p>
                <button onClick={handleExit} className="ml-4 underline">Exit</button>
            </div>
        );
    }

    const currentSlide = deck.slides[currentSlideIndex];
    const templateStyles = templates[currentSlide.template || deck.template] || templates.default;
    const showStackedVisuals = currentSlide.chartData && currentSlide.tableData;

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-black flex flex-col">
            {/* Main Slide Display - Mobile Optimized */}
            <div className="flex-1 flex items-center justify-center p-3 sm:p-6 md:p-8">
                <div className={`w-[94%] sm:w-[92%] md:w-full max-w-[1600px] aspect-[4/3] sm:aspect-video shadow-2xl overflow-hidden rounded-[20px] sm:rounded-xl md:rounded-lg relative bg-white ${templateStyles.slide}`}>
                    
                    {/* Image Section */}
                    {currentSlide.imageUrl && (
                        <div className={templateStyles.imageContainer}>
                            <img src={currentSlide.imageUrl} alt={currentSlide.title} className={templateStyles.image} />
                        </div>
                    )}

                    {/* Content Section */}
                    <div className={templateStyles.textContainer ?? ''}>
                        <h1 className={`${templateStyles.title} text-xl sm:text-2xl md:text-4xl leading-tight`}>{currentSlide.title}</h1>
                        
                        <div className="flex-1 overflow-hidden relative">
                             {showStackedVisuals ? (
                                <div className="flex flex-col h-full gap-3 sm:gap-4">
                                    <div className="h-1/2"><Chart chartData={currentSlide.chartData!} /></div>
                                    <div className="h-1/2"><Table tableData={currentSlide.tableData!} /></div>
                                </div>
                            ) : currentSlide.chartData ? (
                                <Chart chartData={currentSlide.chartData} />
                            ) : currentSlide.tableData ? (
                                <Table tableData={currentSlide.tableData} />
                            ) : (
                                <ul className={`${templateStyles.content} text-[15px] sm:text-lg md:text-xl`}>
                                    {currentSlide.content.split('\n').map((point, i) => (
                                        point && <li key={i} className={`${templateStyles.bullet} leading-relaxed`}>{renderWithMarkdown(point)}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay Controls - Exit Button */}
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-50">
                <button 
                    onClick={handleExit} 
                    className="p-2.5 sm:p-2 bg-black/50 text-white rounded-full hover:bg-black/80 active:scale-95 transition-all backdrop-blur-sm" 
                    title="Exit Presentation (Esc)"
                >
                    <XIcon />
                </button>
            </div>

            {/* Bottom Navigation - Always visible on mobile, hover on desktop */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-4 flex justify-center items-center gap-4 sm:gap-4 opacity-100 sm:opacity-0 sm:hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/60 sm:from-black/50 to-transparent h-20 sm:h-24 pb-safe">
                <button 
                    onClick={handlePrev} 
                    disabled={currentSlideIndex === 0} 
                    className="p-3.5 sm:p-3 bg-white/15 text-white rounded-full hover:bg-white/25 active:scale-95 disabled:opacity-30 backdrop-blur-md transition-all shadow-lg"
                >
                    <ChevronLeftIcon />
                </button>
                <span className="text-white font-bold text-base sm:text-sm tabular-nums min-w-[4rem] text-center bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    {currentSlideIndex + 1} / {deck.slides.length}
                </span>
                <button 
                    onClick={handleNext} 
                    disabled={currentSlideIndex === deck.slides.length - 1} 
                    className="p-3.5 sm:p-3 bg-white/15 text-white rounded-full hover:bg-white/25 active:scale-95 disabled:opacity-30 backdrop-blur-md transition-all shadow-lg"
                >
                    <ChevronRightIcon />
                </button>
            </div>
        </div>
    );
};

export default PresentationScreen;