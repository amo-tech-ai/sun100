import React from 'react';
import { Deck, Slide } from '../data/decks';
import { templates } from '../styles/templates';
import AIToolbox from './AIToolbox';
import Chart from './Chart'; // Import the new Chart component
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
    isSuggestingLayout: boolean;
    layoutError: string | null;
    isSuggestingChart: boolean;
    chartError: string | null;
    areSuggestionsLoading: boolean;
    copilotSuggestions: string[];
    imageSuggestions: string[];
    researchSuggestions: string[];
    handleGenerateImage: () => Promise<void>;
    handleEditImage: (prompt: string) => Promise<void>;
    handleCopilotGenerate: (prompt: string) => Promise<void>;
    handleAnalyzeSlide: () => Promise<void>;
    handleResearch: (query: string) => Promise<void>;
    handleSuggestLayout: () => Promise<void>;
    handleSuggestChart: () => Promise<void>;
    onPrevSlide: () => void;
    onNextSlide: () => void;
}

const EditorPanel: React.FC<EditorPanelProps> = (props) => {
    const { deck, selectedSlide, selectedSlideIndex, totalSlides, onPrevSlide, onNextSlide, isSuggestingLayout, layoutError, handleSuggestLayout, isSuggestingChart, chartError, handleSuggestChart } = props;
    const templateStyles = templates[selectedSlide.template || deck.template] || templates.default;

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
                        {selectedSlide.chartData ? (
                            <Chart chartData={selectedSlide.chartData} />
                        ) : (
                            <ul className={templateStyles.content}>
                                {selectedSlide.content.split('\n').map((point, i) => (
                                    <li key={i} className={templateStyles.bullet}>{point}</li>
                                ))}
                            </ul>
                        )}
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
                 <div className="ml-auto flex items-center gap-2">
                    <div className="relative">
                        <button
                            onClick={handleSuggestChart}
                            disabled={isSuggestingChart || !!selectedSlide.chartData}
                            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:bg-gray-200 disabled:cursor-not-allowed"
                            aria-label="Suggest chart with AI"
                            title={selectedSlide.chartData ? 'Chart is already generated for this slide' : 'Suggest Chart'}
                        >
                             {isSuggestingChart ? (
                                <>
                                   <svg className="animate-spin h-5 w-5 text-[#E87C4D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                   <span>Analyzing...</span>
                                </>
                            ) : (
                                <>
                                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                                   <span>Suggest Chart</span>
                                </>
                            )}
                        </button>
                        {chartError && <p className="absolute top-full mt-1 text-xs text-red-600">{chartError}</p>}
                    </div>
                    <div className="relative">
                        <button
                            onClick={handleSuggestLayout}
                            disabled={isSuggestingLayout}
                            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:bg-gray-200 disabled:cursor-not-allowed"
                            aria-label="Suggest layout with AI"
                        >
                            {isSuggestingLayout ? (
                                <>
                                   <svg className="animate-spin h-5 w-5 text-[#E87C4D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                   <span>Thinking...</span>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                                    <span>Auto-Layout</span>
                                </>
                            )}
                        </button>
                        {layoutError && <p className="absolute top-full mt-1 text-xs text-red-600">{layoutError}</p>}
                    </div>
                 </div>
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
                areSuggestionsLoading={props.areSuggestionsLoading}
                copilotSuggestions={props.copilotSuggestions}
                imageSuggestions={props.imageSuggestions}
                researchSuggestions={props.researchSuggestions}
            />
        </main>
    );
};

export default React.memo(EditorPanel);
