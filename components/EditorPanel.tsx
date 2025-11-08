import React from 'react';
import { Deck, Slide } from '../data/decks';
import { templates } from '../styles/templates';
import AIToolbox from './AIToolbox';
import { SlideAnalysis, ResearchResult } from '../services/geminiService';

const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;


interface EditorPanelProps {
    deck: Deck;
    selectedSlide: Slide;
    selectedSlideIndex: number;
    totalSlides: number;
    isGeneratingImage: boolean;
    isEditingImage: boolean;
    imageError: string | null;
    isCopilotLoading: boolean;
    isAnalyzing: boolean;
    analysisResult: SlideAnalysis | null;
    isResearching: boolean;
    researchResult: ResearchResult | null;
    handleGenerateImage: () => Promise<void>;
    handleEditImage: (prompt: string) => Promise<void>;
    handleCopilotGenerate: (prompt: string) => Promise<void>;
    handleAnalyzeSlide: () => Promise<void>;
    handleResearch: (query: string) => Promise<void>;
    onPrevSlide: () => void;
    onNextSlide: () => void;
}

const EditorPanel: React.FC<EditorPanelProps> = (props) => {
    const { deck, selectedSlide, selectedSlideIndex, totalSlides, onPrevSlide, onNextSlide } = props;
    const templateStyles = templates[deck.template] || templates.default;

    const isUrl = (str: string | undefined): boolean => {
        if (!str) return false;
        return str.startsWith('http') || str.startsWith('data:image');
    };

    return (
        <main className="flex-1 flex flex-col items-center p-8 overflow-y-auto">
            <div className="w-full max-w-4xl aspect-video bg-white rounded-lg shadow-lg">
                <div className={`w-full h-full shadow-lg rounded-lg overflow-hidden ${templateStyles.slide}`}>
                    {selectedSlide.imageUrl && isUrl(selectedSlide.imageUrl) && (
                        <div className={templateStyles.imageContainer}>
                            <img src={selectedSlide.imageUrl} alt={selectedSlide.title} className={templateStyles.image} />
                        </div>
                    )}
                    {selectedSlide.imageUrl && !isUrl(selectedSlide.imageUrl) && (
                        <div className={`${templateStyles.imageContainer} flex items-center justify-center bg-gray-100 border border-dashed border-gray-300 rounded-md`}>
                            {props.isGeneratingImage ? (
                                <div className="flex flex-col items-center justify-center text-center">
                                    <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-[#E87C4D]"></div>
                                    <p className="mt-4 text-gray-600">Generating image...</p>
                                </div>
                            ) : (
                                <div className="text-center p-4">
                                    <p className="text-gray-500 mb-2 italic">Image Prompt:</p>
                                    <p className="text-gray-700 font-medium mb-4">"{selectedSlide.imageUrl}"</p>
                                    <button
                                        onClick={props.handleGenerateImage}
                                        className="bg-[#E87C4D] text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-colors"
                                    >
                                        Generate Image
                                    </button>
                                    {props.imageError && (
                                        <p className="mt-2 text-sm text-red-600">{props.imageError}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    <div className={templateStyles.textContainer ?? ''}>
                        <h1 className={templateStyles.title}>{selectedSlide.title}</h1>
                        <ul className={templateStyles.content}>
                            {selectedSlide.content.split('\n').map((point, i) => (
                                <li key={i} className={templateStyles.bullet}>{point}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

             <div className="w-full max-w-4xl mt-4 flex items-center justify-center gap-4">
                <button 
                    onClick={onPrevSlide} 
                    disabled={selectedSlideIndex === 0}
                    className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous slide"
                >
                    <ChevronLeftIcon />
                </button>
                <span className="font-medium text-gray-600 text-sm">
                    Slide {selectedSlideIndex + 1} of {totalSlides}
                </span>
                 <button 
                    onClick={onNextSlide}
                    disabled={selectedSlideIndex === totalSlides - 1}
                    className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next slide"
                >
                    <ChevronRightIcon />
                </button>
            </div>

            <AIToolbox
                selectedSlide={selectedSlide}
                isUrl={isUrl}
                isCopilotLoading={props.isCopilotLoading}
                onCopilotGenerate={props.handleCopilotGenerate}
                isEditingImage={props.isEditingImage}
                imageError={props.imageError}
                onEditImage={props.handleEditImage}
                isAnalyzing={props.isAnalyzing}
                analysisResult={props.analysisResult}
                onAnalyzeSlide={props.handleAnalyzeSlide}
                isResearching={props.isResearching}
                researchResult={props.researchResult}
                onResearch={props.handleResearch}
            />
        </main>
    );
};

export default EditorPanel;