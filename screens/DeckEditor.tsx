import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { mockDeck, Deck, Slide, ChartData } from '../data/decks';
import SlideOutline from '../components/SlideOutline';
import EditorPanel from '../components/EditorPanel';
import {
    generateSlideImage,
    editSlideImage,
    modifySlideContent,
    analyzeSlide,
    researchTopic,
    suggestLayout,
    fetchAllSuggestions,
    suggestChart,
    generateRoadmapSlide, // New import
    SlideAnalysis,
    ResearchResult,
} from '../services/geminiService';
import { templates } from '../styles/templates';


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

    // AI Tool States
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [isEditingImage, setIsEditingImage] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);
    const [isCopilotLoading, setIsCopilotLoading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<SlideAnalysis | null>(null);
    const [isResearching, setIsResearching] = useState(false);
    const [researchResult, setResearchResult] = useState<ResearchResult | null>(null);
    const [isSuggestingLayout, setIsSuggestingLayout] = useState(false);
    const [layoutError, setLayoutError] = useState<string | null>(null);
    const [isSuggestingChart, setIsSuggestingChart] = useState(false);
    const [chartError, setChartError] = useState<string | null>(null);
    const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);


    // AI Suggestion States
    const [copilotSuggestions, setCopilotSuggestions] = useState<string[]>([]);
    const [imageSuggestions, setImageSuggestions] = useState<string[]>([]);
    const [researchSuggestions, setResearchSuggestions] = useState<string[]>([]);
    const [areSuggestionsLoading, setAreSuggestionsLoading] = useState(false);

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

    // Fetch suggestions when the selected slide changes
    useEffect(() => {
        if (!selectedSlide) return;

        const fetchSuggestions = async () => {
            setAreSuggestionsLoading(true);
            setCopilotSuggestions([]);
            setImageSuggestions([]);
            setResearchSuggestions([]);
            
            try {
                // Use the new single function call
                const { copilotSuggestions, imageSuggestions, researchSuggestions } = await fetchAllSuggestions(
                    selectedSlide.title,
                    selectedSlide.content
                );
                setCopilotSuggestions(copilotSuggestions);
                setImageSuggestions(imageSuggestions);
                setResearchSuggestions(researchSuggestions);
            } catch (err) {
                console.error("Failed to fetch AI suggestions:", err);
                // Silently fail, don't show an error to the user for this feature
            } finally {
                setAreSuggestionsLoading(false);
            }
        };

        fetchSuggestions();
    }, [selectedSlide]);

    const handleSlideSelect = useCallback((slide: Slide) => {
        setSelectedSlide(slide);
        // Reset analysis and research when slide changes
        setAnalysisResult(null);
        setResearchResult(null);
        setLayoutError(null);
        setChartError(null);
    }, []);

    const handleTitleSave = useCallback((newTitle: string) => {
        if (deck) {
            setDeck({ ...deck, title: newTitle });
        }
    }, [deck]);

    const handlePrevSlide = useCallback(() => {
        if (!deck || !selectedSlide) return;
        const currentIndex = deck.slides.findIndex(s => s.id === selectedSlide.id);
        if (currentIndex > 0) {
            handleSlideSelect(deck.slides[currentIndex - 1]);
        }
    }, [deck, selectedSlide, handleSlideSelect]);

    const handleNextSlide = useCallback(() => {
        if (!deck || !selectedSlide) return;
        const currentIndex = deck.slides.findIndex(s => s.id === selectedSlide.id);
        if (currentIndex < deck.slides.length - 1) {
            handleSlideSelect(deck.slides[currentIndex + 1]);
        }
    }, [deck, selectedSlide, handleSlideSelect]);
    
    const toggleSidebar = useCallback(() => {
        setIsSidebarCollapsed(isCollapsed => !isCollapsed);
    }, []);

    const handleGenerateRoadmapSlide = useCallback(async () => {
        if (!deck) return;
        setIsGeneratingRoadmap(true);
        try {
            // Use the original company details from the first slide's content if available,
            // or a generic description of the deck's title.
            const companyContext = deck.slides[0]?.content || deck.title;
            const newSlide = await generateRoadmapSlide(companyContext, deck.template);
            
            const updatedSlides = [...deck.slides, newSlide];
            const updatedDeck = { ...deck, slides: updatedSlides };

            setDeck(updatedDeck);
            handleSlideSelect(newSlide);
        } catch (err) {
            console.error("Failed to generate roadmap slide:", err);
            // Optionally, set an error state to show in the UI.
        } finally {
            setIsGeneratingRoadmap(false);
        }
    }, [deck, handleSlideSelect]);

    // --- AI HANDLERS ---
    const handleGenerateImage = useCallback(async () => {
        if (!deck || !selectedSlide) {
            setImageError("No slide selected to generate an image for.");
            return;
        }
        setIsGeneratingImage(true);
        setImageError(null);
        try {
            const imagePrompt = (typeof selectedSlide.imageUrl === 'string' && !selectedSlide.imageUrl.startsWith('data:image')) ? selectedSlide.imageUrl : undefined;
            const newBase64Data = await generateSlideImage(selectedSlide.title, selectedSlide.content, imagePrompt);
            const newImageUrl = `data:image/png;base64,${newBase64Data}`;
            const updatedSlides = deck.slides.map(slide => 
                slide.id === selectedSlide.id ? { ...slide, imageUrl: newImageUrl } : slide
            );
            const updatedDeck = { ...deck, slides: updatedSlides };
            setDeck(updatedDeck);
            setSelectedSlide(updatedSlides.find(s => s.id === selectedSlide.id) || null);
        } catch (err) {
            setImageError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsGeneratingImage(false);
        }
    }, [deck, selectedSlide]);

    const handleEditImage = useCallback(async (prompt: string) => {
        if (!deck || !selectedSlide || !selectedSlide.imageUrl || !selectedSlide.imageUrl.startsWith('data:image')) {
            setImageError("No image selected to edit.");
            return;
        }
        setIsEditingImage(true);
        setImageError(null);
        try {
            const imageParts = selectedSlide.imageUrl.match(/^data:(image\/.+);base64,(.+)$/);
            if (!imageParts || imageParts.length !== 3) {
                throw new Error("Invalid image format.");
            }
            const mimeType = imageParts[1];
            const base64Data = imageParts[2];
            const newBase64Data = await editSlideImage(base64Data, mimeType, prompt);
            const newImageUrl = `data:${mimeType};base64,${newBase64Data}`;
            const updatedSlides = deck.slides.map(slide => 
                slide.id === selectedSlide.id ? { ...slide, imageUrl: newImageUrl } : slide
            );
            const updatedDeck = { ...deck, slides: updatedSlides };
            setDeck(updatedDeck);
            setSelectedSlide(updatedSlides.find(s => s.id === selectedSlide.id) || null);
        } catch (err) {
            setImageError(err instanceof Error ? err.message : "An unknown error occurred during image editing.");
        } finally {
            setIsEditingImage(false);
        }
    }, [deck, selectedSlide]);

    const handleCopilotGenerate = useCallback(async (prompt: string) => {
        if (!deck || !selectedSlide) return;
        setIsCopilotLoading(true);
        try {
            const { newTitle, newContent } = await modifySlideContent(selectedSlide.title, selectedSlide.content, prompt);
            const updatedSlides = deck.slides.map(slide =>
                slide.id === selectedSlide.id ? { ...slide, title: newTitle, content: newContent, chartData: undefined } : slide // Clear chart data on rewrite
            );
            const updatedDeck = { ...deck, slides: updatedSlides };
            setDeck(updatedDeck);
            setSelectedSlide(updatedSlides.find(s => s.id === selectedSlide.id) || null);
        } catch (err) {
            console.error("Copilot error:", err);
            // Optionally set an error state for the copilot UI
        } finally {
            setIsCopilotLoading(false);
        }
    }, [deck, selectedSlide]);

    const handleAnalyzeSlide = useCallback(async () => {
        if (!deck || !selectedSlide) return;
        setIsAnalyzing(true);
        setAnalysisResult(null);
        try {
            const result = await analyzeSlide(selectedSlide.title, selectedSlide.content);
            setAnalysisResult(result);
        } catch (err) {
            console.error("Analysis error:", err);
            // Optionally set an error state for the analysis UI
        } finally {
            setIsAnalyzing(false);
        }
    }, [deck, selectedSlide]);

    const handleResearch = useCallback(async (query: string) => {
        if (!query.trim()) return;
        setIsResearching(true);
        setResearchResult(null);
        try {
            const result = await researchTopic(query);
            setResearchResult(result);
        } catch (err) {
            console.error("Research error:", err);
            // Optionally set an error state for the research UI
        } finally {
            setIsResearching(false);
        }
    }, []);

    const handleSuggestLayout = useCallback(async () => {
        if (!deck || !selectedSlide) return;
        setIsSuggestingLayout(true);
        setLayoutError(null);
        try {
            const newLayout = await suggestLayout(selectedSlide.title, selectedSlide.content);
            const updatedSlides = deck.slides.map(slide =>
                slide.id === selectedSlide.id ? { ...slide, template: newLayout } : slide
            );
            const updatedDeck = { ...deck, slides: updatedSlides };
            setDeck(updatedDeck);
            setSelectedSlide(updatedSlides.find(s => s.id === selectedSlide.id) || null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            console.error("Layout suggestion error:", errorMessage);
            setLayoutError(errorMessage);
        } finally {
            setIsSuggestingLayout(false);
        }
    }, [deck, selectedSlide]);
    
    const handleSuggestChart = useCallback(async () => {
        if (!deck || !selectedSlide) return;
        setIsSuggestingChart(true);
        setChartError(null);
        try {
            const chartData = await suggestChart(selectedSlide.title, selectedSlide.content);
            const updatedSlides = deck.slides.map(slide =>
                slide.id === selectedSlide.id ? { ...slide, content: chartData ? '' : slide.content, chartData: chartData ?? undefined } : slide
            );
            const updatedDeck = { ...deck, slides: updatedSlides };
            setDeck(updatedDeck);
            setSelectedSlide(updatedSlides.find(s => s.id === selectedSlide.id) || null);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            console.error("Chart suggestion error:", errorMessage);
            setChartError(errorMessage);
        } finally {
            setIsSuggestingChart(false);
        }
    }, [deck, selectedSlide]);
    // --- END AI HANDLERS ---

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
    }, [handleNextSlide, handlePrevSlide, toggleSidebar]);


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
                onGenerateRoadmapSlide={handleGenerateRoadmapSlide}
                isGeneratingRoadmap={isGeneratingRoadmap}
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
                    isGeneratingImage={isGeneratingImage}
                    isEditingImage={isEditingImage}
                    imageError={imageError}
                    isCopilotLoading={isCopilotLoading}
                    isAnalyzing={isAnalyzing}
                    analysisResult={analysisResult}
                    isResearching={isResearching}
                    researchResult={researchResult}
                    isSuggestingLayout={isSuggestingLayout}
                    layoutError={layoutError}
                    isSuggestingChart={isSuggestingChart}
                    chartError={chartError}
                    areSuggestionsLoading={areSuggestionsLoading}
                    copilotSuggestions={copilotSuggestions}
                    imageSuggestions={imageSuggestions}
                    researchSuggestions={researchSuggestions}
                    handleGenerateImage={handleGenerateImage}
                    handleEditImage={handleEditImage}
                    handleCopilotGenerate={handleCopilotGenerate}
                    handleAnalyzeSlide={handleAnalyzeSlide}
                    handleResearch={handleResearch}
                    handleSuggestLayout={handleSuggestLayout}
                    handleSuggestChart={handleSuggestChart}
                    onPrevSlide={handlePrevSlide}
                    onNextSlide={handleNextSlide}
                />
            </div>
        </div>
    );
};

export default DeckEditor;