import React from 'react';
import { Deck, Slide } from '../data/decks';
import { templates } from '../styles/templates';
import AIToolbox from './AIToolbox';
import Chart from './Chart';
import Table from './Table';
import { SlideAnalysis, ResearchResult, ExtractedMetric } from '../services/geminiService';

const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;


interface EditorPanelProps {
    deck: Deck;
    selectedSlide: Slide;
    selectedSlideIndex: number;
    totalSlides: number;
    // Base AI props
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
    // Base AI handlers
    handleGenerateImage: () => Promise<void>;
    handleEditImage: (prompt: string) => Promise<void>;
    handleCopilotGenerate: (prompt: string, newTitle?: string) => Promise<void>;
    handleAnalyzeSlide: () => Promise<void>;
    handleResearch: (query: string) => Promise<void>;
    handleSuggestLayout: () => Promise<void>;
    handleSuggestChart: () => Promise<void>;
    onPrevSlide: () => void;
    onNextSlide: () => void;
    // New enhancement props
    headlineIdeas: string[];
    isGeneratingHeadlines: boolean;
    headlineError: string | null;
    handleGenerateHeadlines: () => void;
    extractedMetrics: ExtractedMetric[];
    isExtractingMetrics: boolean;
    metricError: string | null;
    handleExtractMetrics: () => void;
    handleMarketResearch: () => void;
    isGeneratingTable: boolean;
    tableError: string | null;
    handleGenerateTable: () => void;
    handleCompetitorResearch: () => void;
    handleSummarizeBio: () => void;
    isSuggestingPieChart: boolean;
    pieChartError: string | null;
    handleSuggestPieChart: () => void;
}

const EditorPanel: React.FC<EditorPanelProps> = (props) => {
    const { deck, selectedSlide, selectedSlideIndex, totalSlides, onPrevSlide, onNextSlide, isSuggestingLayout, layoutError, handleSuggestLayout, isSuggestingChart, chartError, handleSuggestChart, isSuggestingPieChart, pieChartError, handleSuggestPieChart } = props;
    const templateStyles = templates[selectedSlide.template || deck.template] || templates.default;

    const isUrl = (str: string | undefined): boolean => {
        if (!str) return false;
        return str.startsWith('http') || str.startsWith('data:image');
    };

    const renderWithMarkdown = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
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
                        ) : selectedSlide.tableData ? (
                            <Table tableData={selectedSlide.tableData} />
                        ) : (
                            <ul className={templateStyles.content}>
                                {selectedSlide.content.split('\n').map((point, i) => (
                                    <li key={i} className={templateStyles.bullet}>{renderWithMarkdown(point)}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

             <div className="w-full max-w-4xl mt-4 flex items-center justify-center gap-4">
                <button onClick={onPrevSlide} disabled={selectedSlideIndex === 0} className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100 disabled:opacity-50 transition-colors" aria-label="Previous slide"><ChevronLeftIcon /></button>
                <span className="font-medium text-gray-600 text-sm">Slide {selectedSlideIndex + 1} of {totalSlides}</span>
                <button onClick={onNextSlide} disabled={selectedSlideIndex === totalSlides - 1} className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100 disabled:opacity-50 transition-colors" aria-label="Next slide"><ChevronRightIcon /></button>
                
                 <div className="ml-auto flex items-center gap-2">
                    <div className="relative">
                        <button onClick={handleSuggestPieChart} disabled={isSuggestingPieChart || !!selectedSlide.chartData || !!selectedSlide.tableData} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors disabled:bg-gray-200" title="Suggest Allocation Chart">
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
                             <span>Allocation Chart</span>
                        </button>
                        {pieChartError && <p className="absolute top-full mt-1 text-xs text-red-600">{pieChartError}</p>}
                    </div>
                    <div className="relative">
                        <button onClick={handleSuggestChart} disabled={isSuggestingChart || !!selectedSlide.chartData || !!selectedSlide.tableData} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors disabled:bg-gray-200" title="Suggest Chart">
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                           <span>Suggest Chart</span>
                        </button>
                        {chartError && <p className="absolute top-full mt-1 text-xs text-red-600">{chartError}</p>}
                    </div>
                    <div className="relative">
                        <button onClick={handleSuggestLayout} disabled={isSuggestingLayout} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors disabled:bg-gray-200" aria-label="Suggest layout with AI">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                            <span>Auto-Layout</span>
                        </button>
                        {layoutError && <p className="absolute top-full mt-1 text-xs text-red-600">{layoutError}</p>}
                    </div>
                 </div>
            </div>

            <AIToolbox
                selectedSlide={selectedSlide}
                isUrl={isUrl}
                {...props}
            />
        </main>
    );
};

export default React.memo(EditorPanel);