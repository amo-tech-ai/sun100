import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { mockDeck, Deck, Slide, ChartData, TableData } from '../data/decks';
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
    generateRoadmapSlide,
    generateHeadlineVariations,
    extractMetrics,
    ExtractedMetric,
    generatePricingTable,
    summarizeBio,
    suggestPieChart,
    SlideAnalysis,
    ResearchResult,
} from '../services/geminiService';


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
    const location = useLocation();
    const navigate = useNavigate();
    const { generatedDeck } = location.state || {};

    const [deck, setDeck] = useState<Deck | null>(null);
    const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);
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

    useEffect(() => {
        if (!selectedSlide) return;

        const fetchSuggestions = async () => {
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

        fetchSuggestions();
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

    const handleTitleSave = useCallback((newTitle: string) => {
        if (deck) {
            setDeck({ ...deck, title: newTitle });
        }
    }, [deck]);

    const updateSlide = useCallback((slideId: string, updates: Partial<Slide>) => {
        if (!deck) return;
        const updatedSlides = deck.slides.map(slide =>
            slide.id === slideId ? { ...slide, ...updates } : slide
        );
        const updatedDeck = { ...deck, slides: updatedSlides };
        setDeck(updatedDeck);
        setSelectedSlide(updatedSlides.find(s => s.id === slideId) || null);
    }, [deck]);

    const handleGenerateRoadmapSlide = useCallback(async () => {
        if (!deck) return;
        setIsGeneratingRoadmap(true);
        try {
            const companyContext = deck.slides[0]?.content || deck.title;
            const newSlide = await generateRoadmapSlide(companyContext, deck.template);
            
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
            const newBase64Data = await generateSlideImage(selectedSlide.title, selectedSlide.content, imagePrompt);
            updateSlide(selectedSlide.id, { imageUrl: `data:image/png;base64,${newBase64Data}` });
        } catch (err) {
            setImageError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsGeneratingImage(false);
        }
    }, [selectedSlide, updateSlide]);

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
            const newBase64Data = await editSlideImage(base64Data, mimeType, prompt);
            updateSlide(selectedSlide.id, { imageUrl: `data:${mimeType};base64,${newBase64Data}` });
        } catch (err) {
            setImageError(err instanceof Error ? err.message : "An unknown error occurred during image editing.");
        } finally {
            setIsEditingImage(false);
        }
    }, [selectedSlide, updateSlide]);

    const handleCopilotGenerate = useCallback(async (prompt: string, newTitle?: string) => {
        if (!selectedSlide) return;
        setIsCopilotLoading(true);
        try {
            const contentToUse = newTitle ? selectedSlide.content : prompt;
            const titleToUse = newTitle || selectedSlide.title;
            const instruction = newTitle ? `Set the title to "${newTitle}" and keep the content.` : prompt;
            
            const { newTitle: updatedTitle, newContent } = await modifySlideContent(titleToUse, contentToUse, instruction);
            const finalTitle = newTitle || updatedTitle;

            updateSlide(selectedSlide.id, { title: finalTitle, content: newContent, chartData: undefined, tableData: undefined });
        } catch (err) {
            console.error("Copilot error:", err);
        } finally {
            setIsCopilotLoading(false);
        }
    }, [selectedSlide, updateSlide]);

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
            const newLayout = await suggestLayout(selectedSlide.title, selectedSlide.content);
            updateSlide(selectedSlide.id, { template: newLayout });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setLayoutError(errorMessage);
        } finally {
            setIsSuggestingLayout(false);
        }
    }, [selectedSlide, updateSlide]);
    
    const handleSuggestChart = useCallback(async () => {
        if (!selectedSlide) return;
        setIsSuggestingChart(true);
        setChartError(null);
        try {
            const chartData = await suggestChart(selectedSlide.title, selectedSlide.content);
            updateSlide(selectedSlide.id, { content: chartData ? '' : selectedSlide.content, chartData: chartData ?? undefined, tableData: undefined });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setChartError(errorMessage);
        } finally {
            setIsSuggestingChart(false);
        }
    }, [selectedSlide, updateSlide]);
    
    const handleGenerateHeadlines = useCallback(async () => {
        if (!selectedSlide) return;
        setIsGeneratingHeadlines(true);
        setHeadlineError(null);
        setHeadlineIdeas([]);
        try {
            const ideas = await generateHeadlineVariations(selectedSlide.title);
            setHeadlineIdeas(ideas);
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
            const metrics = await extractMetrics(selectedSlide.content);
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
            const tableData = await generatePricingTable(selectedSlide.content);
            updateSlide(selectedSlide.id, { content: '', tableData, chartData: undefined });
        } catch (err) {
            setTableError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsGeneratingTable(false);
        }
    }, [selectedSlide, updateSlide]);
    
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
            const chartData = await suggestPieChart(selectedSlide.content);
            updateSlide(selectedSlide.id, { content: chartData ? '' : selectedSlide.content, chartData: chartData ?? undefined, tableData: undefined });
        } catch (err) {
            setPieChartError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsSuggestingPieChart(false);
        }
    }, [selectedSlide, updateSlide]);

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

    if (!deck || !selectedSlide) {
        return <div className="p-8">Loading deck...</div>;
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
        handleSuggestPieChart, handleSocialProofSearch
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
                    <EditorPanel
                        onPrevSlide={handlePrevSlide}
                        onNextSlide={handleNextSlide}
                    />
                </div>
            </div>
        </DeckEditorContext.Provider>
    );
};

export default DeckEditor;
