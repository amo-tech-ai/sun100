import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Deck, Slide } from '../data/decks';
import SlideOutline from '../components/SlideOutline';
import EditorPanel from '../components/EditorPanel';
import { getDeckById, updateDeck, updateSlide } from '../services/deckService';
import {
    generateSlideImage,
    editSlideImage,
    modifySlideContent,
    analyzeSlide,
    researchTopic,
    suggestLayout,
    fetchAllSuggestions,
    suggestChart,
    generateRoadmapSlide,
    generateHeadlineVariations,
    extractMetrics,
    ExtractedMetric,
    generatePricingTable,
    summarizeBio,
    suggestPieChart,
    SlideAnalysis,
    ResearchResult,
} from '../services/aiService';


// --- CONTEXT DEFINITION ---

interface DeckEditorContextType {
    deck: Deck | null;
    selectedSlide: Slide | null;
    isGeneratingImage: boolean;
    isEditingImage: boolean;
    imageError: string | null;
    isCopilotLoading: boolean;
    isAnalyzing: boolean;
    analysisResult: SlideAnalysis | null;
    isResearching: boolean;
    researchResult: ResearchResult | null;
    isSuggestingLayout: boolean;
    layoutError: string | null;
    isSuggestingChart: boolean;
    chartError: string | null;
    isGeneratingRoadmap: boolean;
    headlineIdeas: string[];
    isGeneratingHeadlines: boolean;
    headlineError: string | null;
    extractedMetrics: ExtractedMetric[];
    isExtractingMetrics: boolean;
    metricError: string | null;
    isGeneratingTable: boolean;
    tableError: string | null;
    isSuggestingPieChart: boolean;
    pieChartError: string | null;
    copilotSuggestions: string[];
    imageSuggestions: string[];
    researchSuggestions: string[];
    areSuggestionsLoading: boolean;
    handleSlideSelect: (slide: Slide) => void;
    handleTitleSave: (newTitle: string) => void;
    handleGenerateRoadmapSlide: () => void;
    handleGenerateImage: () => void;
    handleEditImage: (prompt: string) => void;
    handleCopilotGenerate: (prompt: string, newTitle?: string) => void;
    handleAnalyzeSlide: () => void;
    handleResearch: (query: string) => void;
    handleSuggestLayout: () => void;
    handleSuggestChart: () => void;
    handleGenerateHeadlines: () => void;
    handleExtractMetrics: () => void;
    handleMarketResearch: () => void;
    handleGenerateTable: () => void;
    handleCompetitorResearch: () => void;
    handleSummarizeBio: () => void;
    handleSuggestPieChart: () => void;
    handleSocialProofSearch: () => void;
    handlePrevSlide: () => void;
    handleNextSlide: () => void;
}

const DeckEditorContext = createContext<DeckEditorContextType>(null!);
export const useDeckEditor = () => useContext(DeckEditorContext);


// ICONS
const PanelLeftOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/></svg>
);
const PanelLeftCloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 15-3-3 3-3"/></svg>
);


const DeckEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [deck, setDeck] = useState<Deck | null>(null);
    const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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
    const [headlineIdeas, setHeadlineIdeas] = useState<string[]>([]);
    const [isGeneratingHeadlines, setIsGeneratingHeadlines] = useState(false);
    const [headlineError, setHeadlineError] = useState<string | null>(null);
    const [extractedMetrics, setExtractedMetrics] = useState<ExtractedMetric[]>([]);
    const [isExtractingMetrics, setIsExtractingMetrics] = useState(false);
    const [metricError, setMetricError] = useState<string | null>(null);
    const [isGeneratingTable, setIsGeneratingTable] = useState(false);
    const [tableError, setTableError] = useState<string | null>(null);
    const [isSuggestingPieChart, setIsSuggestingPieChart] = useState(false);
    const [pieChartError, setPieChartError] = useState<string | null>(null);
    const [copilotSuggestions, setCopilotSuggestions] = useState<string[]>([]);
    const [imageSuggestions, setImageSuggestions] = useState<string[]>([]);
    const [researchSuggestions, setResearchSuggestions] = useState<string[]>([]);
    const [areSuggestionsLoading, setAreSuggestionsLoading] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishProgressMessage, setPublishProgressMessage] = useState('');
    const [publishError, setPublishError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchInitialDeck = async () => {
            setLoading(true);
            try {
                // 1. Try to load from sessionStorage
                const storedDeckJson = sessionStorage.getItem(`deck-${id}`);
                if (storedDeckJson) {
                    const storedDeck = JSON.parse(storedDeckJson);
                    setDeck(storedDeck);
                    if (storedDeck.slides && storedDeck.slides.length > 0) {
                        setSelectedSlide(storedDeck.slides[0]);
                    }
                    return; // Successfully loaded from session
                }

                // 2. If not found, fetch from the service
                const fetchedDeck = await getDeckById(id);
                if (fetchedDeck) {
                    setDeck(fetchedDeck);
                    if (fetchedDeck.slides && fetchedDeck.slides.length > 0) {
                        setSelectedSlide(fetchedDeck.slides[0]);
                    }
                } else {
                    navigate('/404');
                }
            } catch (err) {
                console.error("Error loading deck:", err);
                // Handle error display for the user
            } finally {
                setLoading(false);
            }
        };

        fetchInitialDeck();
    }, [id, navigate]);

    // Save deck to sessionStorage whenever it changes
    useEffect(() => {
        if (deck && id) {
            sessionStorage.setItem(`deck-${id}`, JSON.stringify(deck));
        }
    }, [deck, id]);

    useEffect(() => {
        if (!selectedSlide) return;

        const fetchSuggestionsForSlide = async () => {
            setAreSuggestionsLoading(true);
            setCopilotSuggestions([]);
            setImageSuggestions([]);
            setResearchSuggestions([]);
            
            try {
                const { copilotSuggestions, imageSuggestions, researchSuggestions } = await fetchAllSuggestions(selectedSlide);
                setCopilotSuggestions(copilotSuggestions);
                setImageSuggestions(imageSuggestions);
                setResearchSuggestions(researchSuggestions);
            } catch (err) {
                console.error("Failed to fetch AI suggestions:", err);
            } finally {
                setAreSuggestionsLoading(false);
            }
        };

        fetchSuggestionsForSlide();
    }, [selectedSlide]);

    const handleSlideSelect = useCallback((slide: Slide) => {
        setSelectedSlide(slide);
        setAnalysisResult(null);
        setResearchResult(null);
        setLayoutError(null);
        setChartError(null);
        setPieChartError(null);
        setMetricError(null);
        setHeadlineError(null);
        setHeadlineIdeas([]);
        setExtractedMetrics([]);
    }, []);

    const handleTitleSave = useCallback(async (newTitle: string) => {
        if (deck && deck.title !== newTitle) {
            try {
                await updateDeck(deck.id, { title: newTitle });
                setDeck(prev => prev ? { ...prev, title: newTitle } : null);
            } catch (err) {
                console.error("Failed to save title:", err);
            }
        }
    }, [deck]);

    const updateLocalSlideState = useCallback((slideId: string, updates: Partial<Slide>) => {
        setDeck(prevDeck => {
            if (!prevDeck) return null;
            const updatedSlides = prevDeck.slides.map(s => s.id === slideId ? { ...s, ...updates } : s);
            return { ...prevDeck, slides: updatedSlides };
        });
        setSelectedSlide(prevSlide => prevSlide && prevSlide.id === slideId ? { ...prevSlide, ...updates } : prevSlide);
    }, []);


    const handleGenerateRoadmapSlide = useCallback(async () => {
        if (!deck) return;
        setIsGeneratingRoadmap(true);
        try {
            const companyContext = deck.slides[0]?.content || deck.title;
            const { slide: newSlide } = await generateRoadmapSlide(companyContext);
            // This would need a backend function to add the slide to the deck and return the updated deck
            // For now, we optimistically update the UI. A real implementation would re-fetch or get the updated deck back.
            const updatedSlides = [...deck.slides, newSlide];
            const updatedDeck = { ...deck, slides: updatedSlides };
            setDeck(updatedDeck);
            handleSlideSelect(newSlide);
        } catch (err) {
            console.error("Failed to generate roadmap slide:", err);
        } finally {
            setIsGeneratingRoadmap(false);
        }
    }, [deck, handleSlideSelect]);

    const handleGenerateImage = useCallback(async () => {
        if (!selectedSlide) {
            setImageError("No slide selected to generate an image for.");
            return;
        }
        setIsGeneratingImage(true);
        setImageError(null);
        try {
            const imagePrompt = (typeof selectedSlide.imageUrl === 'string' && !selectedSlide.imageUrl.startsWith('data:image')) ? selectedSlide.imageUrl : undefined;
            const { base64Image } = await generateSlideImage(selectedSlide.title, selectedSlide.content, imagePrompt);
            const imageUrl = `data:image/png;base64,${base64Image}`;
            await updateSlide(selectedSlide.id, { imageUrl });
            updateLocalSlideState(selectedSlide.id, { imageUrl });
        } catch (err) {
            setImageError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsGeneratingImage(false);
        }
    }, [selectedSlide, updateLocalSlideState]);

    const handleEditImage = useCallback(async (prompt: string) => {
        if (!selectedSlide || !selectedSlide.imageUrl || !selectedSlide.imageUrl.startsWith('data:image')) {
            setImageError("No image selected to edit.");
            return;
        }
        setIsEditingImage(true);
        setImageError(null);
        try {
            const imageParts = selectedSlide.imageUrl.match(/^data:(image\/.+);base64,(.+)$/);
            if (!imageParts || imageParts.length !== 3) throw new Error("Invalid image format.");
            const mimeType = imageParts[1];
            const base64Data = imageParts[2];
            const { base64Image } = await editSlideImage(base64Data, mimeType, prompt);
            const imageUrl = `data:${mimeType};base64,${base64Image}`;
            await updateSlide(selectedSlide.id, { imageUrl });
            updateLocalSlideState(selectedSlide.id, { imageUrl });
        } catch (err) {
            setImageError(err instanceof Error ? err.message : "An unknown error occurred during image editing.");
        } finally {
            setIsEditingImage(false);
        }
    }, [selectedSlide, updateLocalSlideState]);

    const handleCopilotGenerate = useCallback(async (prompt: string, newTitle?: string) => {
        if (!selectedSlide) return;
        setIsCopilotLoading(true);
        try {
            const contentToUse = newTitle ? selectedSlide.content : prompt;
            const titleToUse = newTitle || selectedSlide.title;
            const instruction = newTitle ? `Set the title to "${newTitle}" and keep the content.` : prompt;
            
            const { newTitle: updatedTitle, newContent } = await modifySlideContent(titleToUse, contentToUse, instruction);
            const finalUpdates = { title: newTitle || updatedTitle, content: newContent, chartData: undefined, tableData: undefined };

            await updateSlide(selectedSlide.id, finalUpdates);
            updateLocalSlideState(selectedSlide.id, finalUpdates);
        } catch (err) {
            console.error("Copilot error:", err);
        } finally {
            setIsCopilotLoading(false);
        }
    }, [selectedSlide, updateLocalSlideState]);

    const handleAnalyzeSlide = useCallback(async () => {
        if (!selectedSlide) return;
        setIsAnalyzing(true);
        setAnalysisResult(null);
        try {
            const result = await analyzeSlide(selectedSlide.title, selectedSlide.content);
            setAnalysisResult(result);
        } catch (err) {
            console.error("Analysis error:", err);
        } finally {
            setIsAnalyzing(false);
        }
    }, [selectedSlide]);

    const handleResearch = useCallback(async (query: string) => {
        if (!query.trim()) return;
        setIsResearching(true);
        setResearchResult(null);
        try {
            const result = await researchTopic(query);
            setResearchResult(result);
        } catch (err) {
            console.error("Research error:", err);
        } finally {
            setIsResearching(false);
        }
    }, []);

    const handleSuggestLayout = useCallback(async () => {
        if (!selectedSlide) return;
        setIsSuggestingLayout(true);
        setLayoutError(null);
        try {
            const { layout: newLayout } = await suggestLayout(selectedSlide.title, selectedSlide.content);
            await updateSlide(selectedSlide.id, { template: newLayout });
            updateLocalSlideState(selectedSlide.id, { template: newLayout });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setLayoutError(errorMessage);
        } finally {
            setIsSuggestingLayout(false);
        }
    }, [selectedSlide, updateLocalSlideState]);
    
    const handleSuggestChart = useCallback(async () => {
        if (!selectedSlide) return;
        setIsSuggestingChart(true);
        setChartError(null);
        try {
            const { chartData } = await suggestChart(selectedSlide.title, selectedSlide.content);
            const updates = { content: chartData ? '' : selectedSlide.content, chartData: chartData ?? undefined, tableData: undefined };
            await updateSlide(selectedSlide.id, updates);
            updateLocalSlideState(selectedSlide.id, updates);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setChartError(errorMessage);
        } finally {
            setIsSuggestingChart(false);
        }
    }, [selectedSlide, updateLocalSlideState]);
    
    const handleGenerateHeadlines = useCallback(async () => {
        if (!selectedSlide) return;
        setIsGeneratingHeadlines(true);
        setHeadlineError(null);
        setHeadlineIdeas([]);
        try {
            const { headlines } = await generateHeadlineVariations(selectedSlide.title);
            setHeadlineIdeas(headlines);
        } catch (err) {
            setHeadlineError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsGeneratingHeadlines(false);
        }
    }, [selectedSlide]);

    const handleExtractMetrics = useCallback(async () => {
        if (!selectedSlide) return;
        setIsExtractingMetrics(true);
        setMetricError(null);
        setExtractedMetrics([]);
        try {
            const { metrics } = await extractMetrics(selectedSlide.content);
            setExtractedMetrics(metrics);
        } catch (err) {
            setMetricError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsExtractingMetrics(false);
        }
    }, [selectedSlide]);

    const handleMarketResearch = useCallback(async () => {
        if (!deck) return;
        const marketTopic = deck.title.replace("Pitch Deck", "").trim() || "the user's industry";
        const query = `Latest market size data (TAM, SAM, SOM) and key growth trends for ${marketTopic}`;
        handleResearch(query);
    }, [deck, handleResearch]);

    const handleGenerateTable = useCallback(async () => {
        if (!selectedSlide) return;
        setIsGeneratingTable(true);
        setTableError(null);
        try {
            const { tableData } = await generatePricingTable(selectedSlide.content);
            const updates = { content: '', tableData, chartData: undefined };
            await updateSlide(selectedSlide.id, updates);
            updateLocalSlideState(selectedSlide.id, updates);
        } catch (err) {
            setTableError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsGeneratingTable(false);
        }
    }, [selectedSlide, updateLocalSlideState]);
    
    const handleCompetitorResearch = useCallback(async () => {
        if (!selectedSlide) return;
        const competitors = selectedSlide.content.match(/\b[A-Z][a-z]*\b/g) || [];
        let query = "Key features of our product";
        if (competitors.length > 0) {
            query += ` vs competitors like ${competitors.join(', ')}`;
        }
        handleResearch(query);
    }, [selectedSlide, handleResearch]);

    const handleSummarizeBio = useCallback(async () => {
        if (!selectedSlide) return;
        setIsCopilotLoading(true);
        try {
            const { summary, highlights } = await summarizeBio(selectedSlide.content);
            const newContent = `${summary}\n\n**Key Highlights:**\n- ${highlights.join('\n- ')}`;
            await handleCopilotGenerate(`Replace the content with the following summary:\n${newContent}`);
        } catch (err) {
            console.error("Bio summarization error:", err);
        } finally {
            setIsCopilotLoading(false);
        }
    }, [selectedSlide, handleCopilotGenerate]);

    const handleSuggestPieChart = useCallback(async () => {
        if (!selectedSlide) return;
        setIsSuggestingPieChart(true);
        setPieChartError(null);
        try {
            const { chartData } = await suggestPieChart(selectedSlide.content);
            const updates = { content: chartData ? '' : selectedSlide.content, chartData: chartData ?? undefined, tableData: undefined };
            await updateSlide(selectedSlide.id, updates);
            updateLocalSlideState(selectedSlide.id, updates);
        } catch (err) {
            setPieChartError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsSuggestingPieChart(false);
        }
    }, [selectedSlide, updateLocalSlideState]);

     const handleSocialProofSearch = useCallback(() => {
        if (!selectedSlide) return;
        handleResearch(`quotes or testimonials about the problem of ${selectedSlide.title}`);
    }, [selectedSlide, handleResearch]);

    const handlePublishDeck = useCallback(async () => {
        if (!deck) return;

        setIsPublishing(true);
        setPublishError(null);

        try {
            setPublishProgressMessage('Validating');
            await new Promise(res => setTimeout(res, 500)); 
            if (!deck.title.trim()) {
                throw new Error("Deck must have a title to be published.");
            }
            if (deck.slides.length === 0) {
                throw new Error("Deck must have at least one slide to be published.");
            }
            
            const idempotencyKey = `publish-${deck.id}-${Date.now()}`;
            console.log('Using Idempotency Key:', idempotencyKey);

            setPublishProgressMessage('Saving');
            await new Promise(res => setTimeout(res, 1500));

            setPublishProgressMessage('Finalizing');
            await new Promise(res => setTimeout(res, 1000));

            navigate(`/pitch-decks/${deck.id}/publish-success`, { state: { deckTitle: deck.title } });

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during publishing.";
            setPublishError(errorMessage);
            alert(`Publish failed: ${errorMessage}`);
        } finally {
            setIsPublishing(false);
            setPublishProgressMessage('');
        }
    }, [deck, navigate]);

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

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') handleNextSlide();
            else if (e.key === 'ArrowLeft') handlePrevSlide();
            else if ((e.metaKey || e.ctrlKey) && e.key === '[') toggleSidebar();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNextSlide, handlePrevSlide, toggleSidebar]);

    if (loading || !deck || !selectedSlide) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#FBF8F5]">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-[#E87C4D]"></div>
            </div>
        );
    }
    
    const contextValue: DeckEditorContextType = {
        deck, selectedSlide, isGeneratingImage, isEditingImage, imageError, isCopilotLoading,
        isAnalyzing, analysisResult, isResearching, researchResult, isSuggestingLayout, layoutError,
        isSuggestingChart, chartError, isGeneratingRoadmap, headlineIdeas, isGeneratingHeadlines,
        headlineError, extractedMetrics, isExtractingMetrics, metricError, isGeneratingTable, tableError,
        isSuggestingPieChart, pieChartError, copilotSuggestions, imageSuggestions, researchSuggestions,
        areSuggestionsLoading, handleSlideSelect, handleTitleSave, handleGenerateRoadmapSlide,
        handleGenerateImage, handleEditImage, handleCopilotGenerate, handleAnalyzeSlide, handleResearch,
        handleSuggestLayout, handleSuggestChart, handleGenerateHeadlines, handleExtractMetrics,
        handleMarketResearch, handleGenerateTable, handleCompetitorResearch, handleSummarizeBio,
        handleSuggestPieChart, handleSocialProofSearch, handlePrevSlide, handleNextSlide
    };

    return (
        <DeckEditorContext.Provider value={contextValue}>
            <div className="flex flex-col lg:flex-row h-full w-full bg-[#FBF8F5] text-gray-800">
                <div className="hidden lg:flex flex-shrink-0">
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
                      onPublish={handlePublishDeck}
                      isPublishing={isPublishing}
                      publishProgressMessage={publishProgressMessage}
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
        </DeckEditorContext.Provider>
    );
};

export default DeckEditor;