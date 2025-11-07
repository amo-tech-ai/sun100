import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { mockDeck, Deck, Slide } from '../data/decks';
import SlideOutline from '../components/SlideOutline';
import EditorPanel from '../components/EditorPanel';
import { generateSlideImage, editSlideImage, modifySlideContent, analyzeSlide, SlideAnalysis, researchTopic, ResearchResult } from '../services/geminiService';

const DeckEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const { generatedDeck } = location.state || {};

    const [deck, setDeck] = useState<Deck | null>(null);
    const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);
    
    // Image-specific states
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [isEditingImage, setIsEditingImage] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);

    // AI Tool states
    const [isCopilotLoading, setIsCopilotLoading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<SlideAnalysis | null>(null);
    const [isResearching, setIsResearching] = useState(false);
    const [researchResult, setResearchResult] = useState<ResearchResult | null>(null);

    useEffect(() => {
        // Priority for loading deck: Navigation state > Session Storage > Mock Data
        const storedDeckJson = sessionStorage.getItem(`deck-${id}`);
        const storedDeck = storedDeckJson ? JSON.parse(storedDeckJson) : null;
        const initialDeck = generatedDeck || storedDeck || mockDeck;
        
        console.log(`Editing deck with id: ${id}`);
        setDeck(initialDeck);
        if (initialDeck.slides && initialDeck.slides.length > 0) {
            setSelectedSlide(initialDeck.slides[0]);
        }
    }, [id, generatedDeck]);

    // Persist deck to session storage on any change
    useEffect(() => {
        if (deck) {
            sessionStorage.setItem(`deck-${deck.id}`, JSON.stringify(deck));
        }
    }, [deck]);

    const handleSlideSelect = (slide: Slide) => {
        setSelectedSlide(slide);
        setAnalysisResult(null); // Clear previous analysis when changing slides
        setResearchResult(null); // Clear previous research results
        setImageError(null); // Clear image errors
    };

    const handleTitleSave = (newTitle: string) => {
        if (deck) {
            setDeck({ ...deck, title: newTitle });
        }
    };

    const handleGenerateImage = async () => {
        if (!selectedSlide || !selectedSlide.imageUrl || (selectedSlide.imageUrl.startsWith('http') || selectedSlide.imageUrl.startsWith('data:image')) || !deck) {
            return;
        }

        setIsGeneratingImage(true);
        setImageError(null);
        try {
            const base64Data = await generateSlideImage(selectedSlide.imageUrl);
            const newImageUrl = `data:image/png;base64,${base64Data}`;

            const updatedSlides = deck.slides.map(slide => 
                slide.id === selectedSlide.id ? { ...slide, imageUrl: newImageUrl } : slide
            );
            
            const updatedDeck = { ...deck, slides: updatedSlides };
            setDeck(updatedDeck);
            setSelectedSlide({ ...selectedSlide, imageUrl: newImageUrl });

        } catch (error) {
            console.error("Failed to generate image:", error);
            setImageError(error instanceof Error ? error.message : "An unknown error occurred during generation.");
        } finally {
            setIsGeneratingImage(false);
        }
    };
    
    const handleEditImage = async (prompt: string) => {
        if (!selectedSlide || !selectedSlide.imageUrl || !(selectedSlide.imageUrl.startsWith('http') || selectedSlide.imageUrl.startsWith('data:image')) || !deck) {
            return;
        }

        setIsEditingImage(true);
        setImageError(null);
        try {
            const match = selectedSlide.imageUrl.match(/^data:(image\/[a-z]+);base64,(.*)$/);
            if (!match || match.length < 3) {
                throw new Error("Invalid image format for editing.");
            }
            const mimeType = match[1];
            const base64ImageData = match[2];

            const newBase64Data = await editSlideImage(base64ImageData, mimeType, prompt);
            const newImageUrl = `data:image/png;base64,${newBase64Data}`;

            const updatedSlides = deck.slides.map(slide =>
                slide.id === selectedSlide.id ? { ...slide, imageUrl: newImageUrl } : slide
            );

            const updatedDeck = { ...deck, slides: updatedSlides };
            setDeck(updatedDeck);
            setSelectedSlide({ ...selectedSlide, imageUrl: newImageUrl });

        } catch (error) {
            console.error("Failed to edit image:", error);
            setImageError(error instanceof Error ? error.message : "An unknown error occurred during editing.");
        } finally {
            setIsEditingImage(false);
        }
    };

    const handleCopilotGenerate = async (prompt: string) => {
        if (!deck || !selectedSlide) return;

        setIsCopilotLoading(true);
        try {
            const { newTitle, newContent } = await modifySlideContent(
                selectedSlide.title,
                selectedSlide.content,
                prompt
            );

            const updatedSlide = { ...selectedSlide, title: newTitle, content: newContent };
            
            const updatedSlides = deck.slides.map(slide => 
                slide.id === selectedSlide.id ? updatedSlide : slide
            );

            const updatedDeck = { ...deck, slides: updatedSlides };
            setDeck(updatedDeck);
            setSelectedSlide(updatedSlide);

        } catch (error) {
            console.error("Failed to modify slide content:", error);
            alert(error instanceof Error ? error.message : "An unknown error occurred during modification.");
        } finally {
            setIsCopilotLoading(false);
        }
    };

    const handleAnalyzeSlide = async () => {
        if (!selectedSlide) return;
        setIsAnalyzing(true);
        setAnalysisResult(null);
        try {
            const result = await analyzeSlide(selectedSlide.title, selectedSlide.content);
            setAnalysisResult(result);
        } catch (error) {
            console.error("Failed to analyze slide:", error);
            alert(error instanceof Error ? error.message : "An unknown error occurred during analysis.");
        } finally {
            setIsAnalyzing(false);
        }
    };
    
    const handleResearch = async (query: string) => {
        setIsResearching(true);
        setResearchResult(null);
        try {
            const result = await researchTopic(query);
            setResearchResult(result);
        } catch (error) {
            console.error("Failed to research topic:", error);
            alert(error instanceof Error ? error.message : "An unknown error occurred during research.");
        } finally {
            setIsResearching(false);
        }
    };

    if (!deck || !selectedSlide) {
        return <div className="p-8">Loading deck...</div>;
    }

    return (
        <div className="flex h-full bg-[#FBF8F5] overflow-hidden">
            <SlideOutline
                deckId={deck.id}
                deckTitle={deck.title}
                slides={deck.slides}
                template={deck.template}
                selectedSlideId={selectedSlide.id}
                onSlideSelect={handleSlideSelect}
                onTitleSave={handleTitleSave}
            />
            <EditorPanel
                deck={deck}
                selectedSlide={selectedSlide}
                isGeneratingImage={isGeneratingImage}
                isEditingImage={isEditingImage}
                imageError={imageError}
                isCopilotLoading={isCopilotLoading}
                isAnalyzing={isAnalyzing}
                analysisResult={analysisResult}
                isResearching={isResearching}
                researchResult={researchResult}
                handleGenerateImage={handleGenerateImage}
                handleEditImage={handleEditImage}
                handleCopilotGenerate={handleCopilotGenerate}
                handleAnalyzeSlide={handleAnalyzeSlide}
                handleResearch={handleResearch}
            />
        </div>
    );
};

export default DeckEditor;
