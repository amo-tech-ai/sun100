
import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Deck, Slide, ChartData, TableData } from '../data/decks';
import { getDeckById, updateDeck, updateSlide } from '../services/deckService';
import { generateRoadmapSlide, checkForWebsiteUpdates } from '../services/ai/deck';
import { generateSlideImage, editSlideImage } from '../services/ai/image';
import { researchTopic } from '../services/ai/research';
import {
    modifySlideContent,
    analyzeSlide,
    suggestLayout,
    fetchAllSuggestions,
    suggestChart,
    generateHeadlineVariations,
    extractMetrics,
    generatePricingTable,
    summarizeBio,
    suggestPieChart,
    generateFinancialProjections,
    generateCompetitorSWOT,
    generateGTMStrategy
} from '../services/ai/slide';
import {
    ExtractedMetric,
    SlideAnalysis,
    ResearchResult,
    DeckUpdateSuggestion
} from '../services/ai/types';
import { templates } from '../styles/templates';

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
    isPublishing: boolean;
    publishProgressMessage: string;
    isGeneratingFinancials: boolean;
    financialError: string | null;
    loading: boolean;
    isSyncing: boolean;
    syncSuggestions: DeckUpdateSuggestion[];
    syncError: string | null;
    isGeneratingSWOT: boolean;
    swotError: string | null;
    isGeneratingGTM: boolean;
    copilotError: string | null;
    handleSlideSelect: (slide: Slide) => void;
    handleTitleSave: (newTitle: string) => void;
    handleGenerateRoadmapSlide: () => void;
    handleGenerateImage: () => void;
    handleEditImage: (prompt: string) => void;
    handleCopilotGenerate: (prompt: string, newTitle?: string) => void;
    handleAnalyzeSlide: () => void;
    handleResearch: (query: string) => void;
    handleApplyResearch: (researchSummary: string) => void;
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
    handleGenerateFinancials: (assumptions: string) => void;
    handlePublishDeck: () => void;
    handlePrevSlide: () => void;
    handleNextSlide: () => void;
    handleTemplateChange: (newTemplate: keyof typeof templates) => void;
    handleCheckForUpdates: (url: string) => void;
    handleApplyUpdate: (suggestion: DeckUpdateSuggestion) => void;
    handleGenerateSWOT: () => void;
    handleGenerateGTM: () => void;
}

const DeckEditorContext = createContext<DeckEditorContextType>(null!);

export const useDeckEditor = () => {
    const context = useContext(DeckEditorContext);
    if (!context) {
        throw new Error("useDeckEditor must be used within a DeckEditorProvider");
    }
    return context;
}

export const DeckEditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [deck, setDeck] = useState<Deck | null>(null);
    const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);
    const [loading, setLoading] = useState(true);
    
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
    const [isGeneratingFinancials, setIsGeneratingFinancials] = useState(false);
    const [financialError, setFinancialError] = useState<string | null>(null);
    const [copilotSuggestions, setCopilotSuggestions] = useState<string[]>([]);
    const [imageSuggestions, setImageSuggestions] = useState<string[]>([]);
    const [researchSuggestions, setResearchSuggestions] = useState<string[]>([]);
    const [areSuggestionsLoading, setAreSuggestionsLoading] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishProgressMessage, setPublishProgressMessage] = useState('');
    const [publishError, setPublishError] = useState<string | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncSuggestions, setSyncSuggestions] = useState<DeckUpdateSuggestion[]>([]);
    const [syncError, setSyncError] = useState<string | null>(null);
    const [isGeneratingSWOT, setIsGeneratingSWOT] = useState(false);
    const [swotError, setSwotError] = useState<string | null>(null);
    const [isGeneratingGTM, setIsGeneratingGTM] = useState(false);
    const [copilotError, setCopilotError] = useState<string | null>(null);


    useEffect(() => {
        if (!id) return;

        const fetchInitialDeck = async () => {
            setLoading(true);
            try {
                // Dual-loading strategy: Check sessionStorage first
                const sessionDeckJson = sessionStorage.getItem('newlyGeneratedDeck');
                if (sessionDeckJson) {
                    const sessionDeck = JSON.parse(sessionDeckJson);
                    if (sessionDeck.id === id) {
                        setDeck(sessionDeck);
                        setSelectedSlide(sessionDeck.slides[0] || null);
                        sessionStorage.removeItem('newlyGeneratedDeck'); // Clean up
                        setLoading(false);
                        return;
                    }
                }

                // Fallback to fetching from the database
                const fetchedDeck = await getDeckById(id);
                if (fetchedDeck) {
                    setDeck(fetchedDeck);
                    if (fetchedDeck.slides && fetchedDeck.slides.length > 0) {
                        setSelectedSlide(fetchedDeck.slides[0]);
                    } else {
                        setSelectedSlide(null);
                    }
                } else {
                    navigate('/404');
                }
            } catch (err) {
                console.error("Error loading deck:", err);
                navigate('/404'); // Or show an error page
            } finally {
                setLoading(false);
            }
        };

        fetchInitialDeck();
    }, [id, navigate]);

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
        setFinancialError(null);
        setSwotError(null);
        setCopilotError(null);
    }, []);

    const updateSlideStateAndPersist = useCallback(async (slideId: string, updates: Partial<Slide>) => {
        // Optimistic UI update
        setDeck(prevDeck => {
            if (!prevDeck) return null;
            const updatedSlides = prevDeck.slides.map(s => s.id === slideId ? { ...s, ...updates } : s);
            return { ...prevDeck, slides: updatedSlides };
        });
        setSelectedSlide(prevSlide => prevSlide && prevSlide.id === slideId ? { ...prevSlide, ...updates } : prevSlide);
        
        // Persist changes to the database
        try {
            await updateSlide(slideId, updates);
        } catch (error) {
            console.error("Failed to save slide changes:", error);
            // In a real app, you would show a toast notification here and potentially revert the state
        }
    }, []);

    const handleTitleSave = useCallback(async (newTitle: string) => {
        if (deck && deck.title !== newTitle) {
            setDeck(prev => prev ? { ...prev, title: newTitle } : null); // Optimistic update
            try {
                await updateDeck(deck.id, { title: newTitle });
            } catch (e) {
                console.error("Failed to update deck title:", e);
                // Revert or show error
            }
        }
    }, [deck]);

    const handleTemplateChange = useCallback(async (newTemplate: keyof typeof templates) => {
        if (deck && deck.template !== newTemplate) {
            setDeck(prev => prev ? { ...prev, template: newTemplate } : null); // Optimistic update
             try {
                await updateDeck(deck.id, { template: newTemplate });
            } catch (e) {
                console.error("Failed to update deck template:", e);
                // Revert or show error
            }
        }
    }, [deck]);

    const handleGenerateRoadmapSlide = useCallback(async () => {
        if (!deck) return;
        setIsGeneratingRoadmap(true);
        try {
            // Context Strategy:
            // 1. Base context is the deck title and vision (slide 0).
            // 2. If the user is currently on a slide that might contain strategy, add it.
            
            const visionContext = deck.slides[0]?.content || deck.title;
            let context = `Company Vision: ${visionContext}`;
            
            if (selectedSlide && selectedSlide.content) {
                 context += `\n\nStrategic Context from Current Slide: ${selectedSlide.content}`;
            }
            
            const { slide: newSlide } = await generateRoadmapSlide(context);
            
            // TODO: This needs a backend function to add a slide to a deck properly in the DB
            // For now, update local state only which might be lost on refresh if not persisted
            console.warn("Roadmap slide generated but persistence requires implementing addSlide backend function.");
            
            const updatedSlides = [...deck.slides, newSlide];
            setDeck({ ...deck, slides: updatedSlides });
            handleSlideSelect(newSlide);
        } catch (err) {
            console.error("Failed to generate roadmap slide:", err);
        } finally {
            setIsGeneratingRoadmap(false);
        }
    }, [deck, selectedSlide, handleSlideSelect]);

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
            await updateSlideStateAndPersist(selectedSlide.id, { imageUrl });
        } catch (err) {
            setImageError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsGeneratingImage(false);
        }
    }, [selectedSlide, updateSlideStateAndPersist]);

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
            await updateSlideStateAndPersist(selectedSlide.id, { imageUrl });
        } catch (err) {
            setImageError(err instanceof Error ? err.message : "An unknown error occurred during image editing.");
        } finally {
            setIsEditingImage(false);
        }
    }, [selectedSlide, updateSlideStateAndPersist]);

    const handleCopilotGenerate = useCallback(async (prompt: string, newTitle?: string) => {
        if (!selectedSlide) return;
        setIsCopilotLoading(true);
        setCopilotError(null);
        try {
            const instruction = newTitle ? `Set the title to "${newTitle}" and keep the content the same.` : prompt;
            const { newTitle: updatedTitle, newContent } = await modifySlideContent(
                selectedSlide.title,
                selectedSlide.content,
                instruction
            );
    
            const finalUpdates: Partial<Slide> = { 
                title: newTitle || updatedTitle, 
                content: newContent, 
                chartData: undefined, 
                tableData: undefined 
            };
    
            await updateSlideStateAndPersist(selectedSlide.id, finalUpdates);
        } catch (err) {
            console.error("Copilot error:", err);
            setCopilotError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsCopilotLoading(false);
        }
    }, [selectedSlide, updateSlideStateAndPersist]);

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

    const handleApplyResearch = useCallback(async (researchSummary: string) => {
        if (!selectedSlide) return;
        setIsCopilotLoading(true); // Reuse copilot loading state for content modification
        setCopilotError(null);
        try {
            const instruction = `Rewrite the slide content to incorporate the following market research findings. Structure it clearly (e.g., with sections for Market Size and Trends if applicable) and keep it concise for a presentation.\n\nResearch Insights:\n${researchSummary}`;
            const { newContent } = await modifySlideContent(selectedSlide.title, selectedSlide.content, instruction);
            await updateSlideStateAndPersist(selectedSlide.id, { content: newContent });
        } catch (err) {
            console.error("Failed to apply research:", err);
            setCopilotError(err instanceof Error ? err.message : "Failed to update slide with research data.");
        } finally {
            setIsCopilotLoading(false);
        }
    }, [selectedSlide, updateSlideStateAndPersist]);

    const handleSuggestLayout = useCallback(async () => {
        if (!selectedSlide) return;
        setIsSuggestingLayout(true);
        setLayoutError(null);
        try {
            const { layout: newLayout } = await suggestLayout(selectedSlide.title, selectedSlide.content);
            await updateSlideStateAndPersist(selectedSlide.id, { template: newLayout });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setLayoutError(errorMessage);
        } finally {
            setIsSuggestingLayout(false);
        }
    }, [selectedSlide, updateSlideStateAndPersist]);
    
    const handleSuggestChart = useCallback(async () => {
        if (!selectedSlide) return;
        setIsSuggestingChart(true);
        setChartError(null);
        try {
            const { chartData } = await suggestChart(selectedSlide.title, selectedSlide.content);
            const updates = { content: chartData ? '' : selectedSlide.content, chartData: chartData ?? undefined, tableData: undefined };
            await updateSlideStateAndPersist(selectedSlide.id, updates);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setChartError(errorMessage);
        } finally {
            setIsSuggestingChart(false);
        }
    }, [selectedSlide, updateSlideStateAndPersist]);
    
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

    const handleMarketResearch = useCallback(() => {
        if (!deck) return;
        const marketTopic = deck.title.replace(/pitch deck/i, "").trim() || "the user's industry";
        const query = `Perform a deep market analysis for ${marketTopic}. 1. Estimate TAM, SAM, and SOM with dollar values. 2. Identify 3 specific market growth trends (include CAGR if available). 3. Provide citations for all data points. Format the summary so it can be easily used in a pitch deck.`;
        handleResearch(query);
    }, [deck, handleResearch]);

    const handleGenerateTable = useCallback(async () => {
        if (!selectedSlide) return;
        setIsGeneratingTable(true);
        setTableError(null);
        try {
            const { tableData } = await generatePricingTable(selectedSlide.content);
            const updates = { content: '', tableData, chartData: undefined };
            await updateSlideStateAndPersist(selectedSlide.id, updates);
        } catch (err) {
            setTableError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsGeneratingTable(false);
        }
    }, [selectedSlide, updateSlideStateAndPersist]);
    
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
        setCopilotError(null);
        try {
            const { summary, highlights } = await summarizeBio(selectedSlide.content);
            const newContent = `${summary}\n\n**Key Highlights:**\n- ${highlights.join('\n- ')}`;
            await handleCopilotGenerate(`Replace the content with the following summary:\n${newContent}`);
        } catch (err) {
            console.error("Bio summarization error:", err);
            setCopilotError(err instanceof Error ? err.message : "Failed to summarize bio.");
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
            await updateSlideStateAndPersist(selectedSlide.id, updates);
        } catch (err) {
            setPieChartError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsSuggestingPieChart(false);
        }
    }, [selectedSlide, updateSlideStateAndPersist]);
    
    const handleGenerateFinancials = useCallback(async (assumptions: string) => {
        if (!selectedSlide) return;
        setIsGeneratingFinancials(true);
        setFinancialError(null);
        try {
            const financialData = await generateFinancialProjections(assumptions);
            
            // 1. Map to new 'financials' TableData structure
            const tableData: TableData = {
                type: 'financials',
                financials: {
                    headers: financialData.headers,
                    rows: financialData.rows
                }
            };

            // 2. Try to extract "Revenue" or "Sales" for a Chart
            let chartData: ChartData | undefined = undefined;
            const revenueRow = financialData.rows.find(r => 
                r.label.toLowerCase().includes('revenue') || r.label.toLowerCase().includes('sales')
            );

            if (revenueRow && financialData.headers.length === revenueRow.values.length) {
                const chartValues = revenueRow.values.map((val, index) => {
                    // Remove currency symbols, commas, 'M', 'K', spaces to parse number
                    const numericString = val.replace(/[^0-9.-]+/g, "");
                    return {
                        label: financialData.headers[index],
                        value: parseFloat(numericString) || 0
                    };
                });
                
                // Only create chart if we have valid numbers
                if (chartValues.some(d => d.value > 0)) {
                    chartData = {
                        type: 'bar',
                        data: chartValues
                    };
                }
            }
            
            // Update slide with both table and potential chart
            const updates = { 
                content: financialData.summary, 
                tableData, 
                chartData // Can be undefined if extraction failed
            };
            await updateSlideStateAndPersist(selectedSlide.id, updates);

        } catch (err) {
             setFinancialError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsGeneratingFinancials(false);
        }
    }, [selectedSlide, updateSlideStateAndPersist]);

     const handleSocialProofSearch = useCallback(() => {
        if (!selectedSlide) return;
        handleResearch(`quotes or testimonials about the problem of ${selectedSlide.title}`);
    }, [selectedSlide, handleResearch]);

    const handleCheckForUpdates = useCallback(async (url: string) => {
        if (!deck || !url.trim()) return;
        setIsSyncing(true);
        setSyncError(null);
        setSyncSuggestions([]);
        try {
            const suggestions = await checkForWebsiteUpdates(deck, url);
            setSyncSuggestions(suggestions);
        } catch (err) {
            setSyncError(err instanceof Error ? err.message : "Failed to check for updates.");
        } finally {
            setIsSyncing(false);
        }
    }, [deck]);

    const handleApplyUpdate = useCallback(async (suggestion: DeckUpdateSuggestion) => {
        if (!deck) return;
        
        // Find the slide to update based on the suggestion's title reference
        // This is a fuzzy match, ideally we'd have slide IDs
        const targetSlide = deck.slides.find(s => s.title === suggestion.slideTitle || s.content.includes(suggestion.currentValue));
        
        if (!targetSlide) {
            alert("Could not find the matching slide to update automatically. Please review manually.");
            return;
        }

        // Use AI to apply the specific update instruction
        // We pass the context to modifySlideContent
        setIsCopilotLoading(true); // Reuse copilot loading state
        setCopilotError(null);
        try {
            const instruction = `Update this slide based on new website data. Change "${suggestion.currentValue}" to "${suggestion.newValue}". Context: ${suggestion.reason}`;
            const { newContent } = await modifySlideContent(targetSlide.title, targetSlide.content, instruction);
            await updateSlideStateAndPersist(targetSlide.id, { content: newContent });
            
            // Remove the applied suggestion from the list
            setSyncSuggestions(prev => prev.filter(s => s !== suggestion));

        } catch (err) {
            console.error("Failed to apply update:", err);
            setCopilotError(err instanceof Error ? err.message : "Failed to apply update automatically.");
        } finally {
            setIsCopilotLoading(false);
        }
    }, [deck, updateSlideStateAndPersist]);

    const handleGenerateSWOT = useCallback(async () => {
        if (!selectedSlide) return;
        setIsGeneratingSWOT(true);
        setSwotError(null);
        try {
            const { tableData } = await generateCompetitorSWOT(selectedSlide.content);
            if (tableData) {
                const updates = { content: '', tableData, chartData: undefined };
                await updateSlideStateAndPersist(selectedSlide.id, updates);
            } else {
                setSwotError("AI could not generate SWOT analysis.");
            }
        } catch (err) {
            setSwotError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsGeneratingSWOT(false);
        }
    }, [selectedSlide, updateSlideStateAndPersist]);

    const handleGenerateGTM = useCallback(async () => {
        if (!deck) return;
        setIsGeneratingGTM(true);
        try {
            const context = deck.slides[0]?.content || deck.title;
            const strategy = await generateGTMStrategy(context);
            
            const newSlide: Slide = {
                id: `slide-${Date.now()}`, // simple ID gen
                title: "Go-To-Market Strategy",
                content: `${strategy.strategy_summary}\n\n**Key Channels:**\n- ${strategy.channels.join('\n- ')}\n\n**Success Metrics:**\n- ${strategy.key_metrics.join('\n- ')}`,
                template: 'default',
                type: 'market'
            };

            // Mocking persistence as per existing roadmap pattern
            const updatedSlides = [...deck.slides, newSlide];
            setDeck({ ...deck, slides: updatedSlides });
            handleSlideSelect(newSlide);
        } catch (err) {
            console.error("Failed to generate GTM slide:", err);
            alert("Failed to generate GTM slide");
        } finally {
            setIsGeneratingGTM(false);
        }
    }, [deck, handleSlideSelect]);


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

    const contextValue: DeckEditorContextType = {
        deck, selectedSlide, isGeneratingImage, isEditingImage, imageError, isCopilotLoading,
        isAnalyzing, analysisResult, isResearching, researchResult, isSuggestingLayout, layoutError,
        isSuggestingChart, chartError, isGeneratingRoadmap, headlineIdeas, isGeneratingHeadlines,
        headlineError, extractedMetrics, isExtractingMetrics, metricError, isGeneratingTable, tableError,
        isSuggestingPieChart, pieChartError, copilotSuggestions, imageSuggestions, researchSuggestions,
        areSuggestionsLoading, isPublishing, publishProgressMessage, loading, isGeneratingFinancials, financialError,
        isSyncing, syncSuggestions, syncError,
        isGeneratingSWOT, swotError, isGeneratingGTM,
        copilotError,
        handleSlideSelect, handleTitleSave, 
        handleGenerateRoadmapSlide, handleGenerateImage, handleEditImage, handleCopilotGenerate, 
        handleAnalyzeSlide, handleResearch, handleApplyResearch, handleSuggestLayout, handleSuggestChart, handleGenerateHeadlines, 
        handleExtractMetrics, handleMarketResearch, handleGenerateTable, handleCompetitorResearch, 
        handleSummarizeBio, handleSuggestPieChart, handleSocialProofSearch, handleGenerateFinancials, handlePublishDeck, 
        handlePrevSlide, handleNextSlide, handleTemplateChange,
        handleCheckForUpdates, handleApplyUpdate,
        handleGenerateSWOT, handleGenerateGTM
    };

    return (
        <DeckEditorContext.Provider value={contextValue}>
            {children}
        </DeckEditorContext.Provider>
    );
};
