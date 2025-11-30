
import React from 'react';
import { templates } from '../styles/templates';
import Chart from './Chart';
import Table from './Table';
import { useDeckEditor } from '../contexts/DeckEditorContext';

const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;

const EditorPanel: React.FC = () => {
    const { 
        deck, 
        selectedSlide,
        isGeneratingImage,
        handleGenerateImage,
        imageError,
        handleSuggestLayout,
        isSuggestingLayout,
        layoutError,
        handleSuggestChart,
        isSuggestingChart,
        chartError,
        handleSuggestPieChart,
        isSuggestingPieChart,
        pieChartError,
        handleGenerateTable,
        isGeneratingTable,
        tableError,
        handlePrevSlide,
        handleNextSlide,
        handleGenerateSWOT,
        isGeneratingSWOT,
        swotError
     } = useDeckEditor();

    if (!deck || !selectedSlide) {
        return null; // Or a loading state
    }

    const selectedSlideIndex = deck.slides.findIndex(s => s.id === selectedSlide.id);
    const totalSlides = deck.slides.length;
    
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

    // Helper to determine if we should stack Chart and Table (common in financials)
    const showStackedVisuals = selectedSlide.chartData && selectedSlide.tableData;

    return (
        <main className="flex-1 flex flex-col h-full bg-gray-50/50 relative">
            
            {/* Canvas Area - Centered and Scrollable */}
            <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center min-h-0">
                <div className="w-full max-w-5xl aspect-video bg-white rounded-lg shadow-xl transition-all duration-300 transform origin-center hover:shadow-2xl">
                    <div className={`w-full h-full shadow-inner rounded-lg overflow-hidden ${templateStyles.slide}`}>
                        {selectedSlide.imageUrl && isUrl(selectedSlide.imageUrl) && (
                            <div className={templateStyles.imageContainer}>
                                <img src={selectedSlide.imageUrl} alt={selectedSlide.title} className={templateStyles.image} />
                            </div>
                        )}
                        {selectedSlide.imageUrl && !isUrl(selectedSlide.imageUrl) && (
                            <div className={`${templateStyles.imageContainer} flex items-center justify-center bg-gray-100 border border-dashed border-gray-300 rounded-md`}>
                                {isGeneratingImage ? (
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-[#E87C4D]"></div>
                                        <p className="mt-4 text-gray-600">Generating image...</p>
                                    </div>
                                ) : (
                                    <div className="text-center p-4">
                                        <p className="text-gray-500 mb-2 italic">Image Prompt:</p>
                                        <p className="text-gray-700 font-medium mb-4">"{selectedSlide.imageUrl}"</p>
                                        <button
                                            onClick={handleGenerateImage}
                                            className="bg-[#E87C4D] text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-colors"
                                        >
                                            Generate Image
                                        </button>
                                        {imageError && (
                                            <p className="mt-2 text-sm text-red-600">{imageError}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        <div className={templateStyles.textContainer ?? ''}>
                            <h1 className={templateStyles.title}>{selectedSlide.title}</h1>
                            
                            <div className="flex-1 overflow-auto">
                                {showStackedVisuals ? (
                                    <div className="flex flex-col h-full gap-4">
                                        <div className="h-1/2"><Chart chartData={selectedSlide.chartData!} /></div>
                                        <div className="h-1/2"><Table tableData={selectedSlide.tableData!} /></div>
                                    </div>
                                ) : selectedSlide.chartData ? (
                                    <Chart chartData={selectedSlide.chartData} />
                                ) : selectedSlide.tableData ? (
                                    <Table tableData={selectedSlide.tableData} />
                                ) : (
                                    <ul className={templateStyles.content}>
                                        {selectedSlide.content.split('\n').map((point, i) => (
                                            point && <li key={i} className={templateStyles.bullet}>{renderWithMarkdown(point)}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation Bar - Fixed height at bottom of center panel */}
            <div className="h-16 border-t border-gray-200 bg-white flex items-center justify-between px-8 flex-shrink-0 z-10">
                 <div className="flex items-center gap-4">
                    <button onClick={handlePrevSlide} disabled={selectedSlideIndex === 0} className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100 disabled:opacity-50 transition-colors" aria-label="Previous slide"><ChevronLeftIcon /></button>
                    <span className="font-medium text-gray-600 text-sm">Slide {selectedSlideIndex + 1} of {totalSlides}</span>
                    <button onClick={handleNextSlide} disabled={selectedSlideIndex === totalSlides - 1} className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100 disabled:opacity-50 transition-colors" aria-label="Next slide"><ChevronRightIcon /></button>
                 </div>
                
                 <div className="flex items-center gap-2">
                    {selectedSlide.type === 'competition' && (
                         <div className="relative">
                            <button onClick={handleGenerateSWOT} disabled={isGeneratingSWOT || !!selectedSlide.tableData} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-1.5 px-3 text-sm rounded-lg hover:bg-gray-100 transition-colors disabled:bg-gray-200" title="Generate SWOT Table">
                                <span>SWOT</span>
                            </button>
                            {swotError && <p className="absolute bottom-full mb-1 text-xs text-red-600 bg-white p-1 rounded border">{swotError}</p>}
                        </div>
                    )}
                     <div className="relative">
                        <button onClick={handleGenerateTable} disabled={isGeneratingTable || !!selectedSlide.chartData || !!selectedSlide.tableData} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-1.5 px-3 text-sm rounded-lg hover:bg-gray-100 transition-colors disabled:bg-gray-200" title="Format as Pricing Table">
                           <span>Pricing Table</span>
                        </button>
                        {tableError && <p className="absolute bottom-full mb-1 text-xs text-red-600 bg-white p-1 rounded border">{tableError}</p>}
                    </div>
                    <div className="relative">
                        <button onClick={handleSuggestPieChart} disabled={isSuggestingPieChart || !!selectedSlide.chartData || !!selectedSlide.tableData} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-1.5 px-3 text-sm rounded-lg hover:bg-gray-100 transition-colors disabled:bg-gray-200" title="Suggest Allocation Chart">
                             <span>Pie Chart</span>
                        </button>
                        {pieChartError && <p className="absolute bottom-full mb-1 text-xs text-red-600 bg-white p-1 rounded border">{pieChartError}</p>}
                    </div>
                    <div className="relative">
                        <button onClick={handleSuggestChart} disabled={isSuggestingChart || !!selectedSlide.chartData || !!selectedSlide.tableData} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-1.5 px-3 text-sm rounded-lg hover:bg-gray-100 transition-colors disabled:bg-gray-200" title="Suggest Chart">
                           <span>Bar Chart</span>
                        </button>
                        {chartError && <p className="absolute bottom-full mb-1 text-xs text-red-600 bg-white p-1 rounded border">{chartError}</p>}
                    </div>
                    <div className="relative">
                        <button onClick={handleSuggestLayout} disabled={isSuggestingLayout} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-1.5 px-3 text-sm rounded-lg hover:bg-gray-100 transition-colors disabled:bg-gray-200" aria-label="Suggest layout with AI">
                            <span>Auto-Layout</span>
                        </button>
                        {layoutError && <p className="absolute bottom-full mb-1 text-xs text-red-600 bg-white p-1 rounded border">{layoutError}</p>}
                    </div>
                 </div>
            </div>
        </main>
    );
};

export default React.memo(EditorPanel);
