
import React from 'react';
import { templates } from '../styles/templates';
import Chart from './Chart';
import Table from './Table';
import { useDeckEditor } from '../contexts/DeckEditorContext';
import { Slide, Deck } from '../data/decks';

// Icons
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
const BarChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>;
const PieChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>;
const TableIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="3" x2="21" y1="15" y2="15"/><line x1="12" x2="12" y1="3" y2="21"/></svg>;
const LayoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>;
const MagicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const PrinterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>;


const ToolbarButton: React.FC<{
    onClick: () => void;
    disabled?: boolean;
    icon: React.ReactNode;
    label: string;
    loading?: boolean;
    error?: string | null;
}> = ({ onClick, disabled, icon, label, loading, error }) => (
    <div className="relative group flex-shrink-0">
        <button
            onClick={onClick}
            disabled={disabled}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            title={label}
        >
            {loading ? <span className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full" /> : icon}
            <span className="hidden xl:inline">{label}</span>
        </button>
        {error && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 p-2 bg-red-50 text-red-600 text-xs rounded shadow-lg border border-red-100 z-50 whitespace-normal">
                {error}
            </div>
        )}
    </div>
);

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

// Extract slide rendering for reuse in print loop
const SlideRenderer: React.FC<{ slide: Slide, templateKey: string, isGeneratingImage?: boolean, imageError?: string | null, onGenerateImage?: () => void }> = ({ slide, templateKey, isGeneratingImage, imageError, onGenerateImage }) => {
    const templateStyles = templates[slide.template || templateKey] || templates.default;
    const showStackedVisuals = slide.chartData && slide.tableData;

    return (
        <div className={`w-full h-full overflow-hidden rounded-sm ${templateStyles.slide}`}>
            {/* Image Logic */}
            {slide.imageUrl && isUrl(slide.imageUrl) && (
                <div className={templateStyles.imageContainer}>
                    <img src={slide.imageUrl} alt={slide.title} className={templateStyles.image} />
                </div>
            )}
            {slide.imageUrl && !isUrl(slide.imageUrl) && (
                <div className={`${templateStyles.imageContainer} flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg m-4 print:hidden`}>
                    {isGeneratingImage ? (
                        <div className="flex flex-col items-center justify-center text-center p-6">
                            <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-brand-orange mb-3"></div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Generating Visual...</p>
                        </div>
                    ) : (
                        <div className="text-center p-6 max-w-sm">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Image Prompt</p>
                            <p className="text-sm text-gray-600 mb-4 italic line-clamp-3">"{slide.imageUrl}"</p>
                            {onGenerateImage && (
                                <button
                                    onClick={onGenerateImage}
                                    className="bg-brand-blue text-white text-xs font-bold py-2 px-4 rounded-full hover:bg-opacity-90 transition-colors shadow-sm"
                                >
                                    Generate Image
                                </button>
                            )}
                            {imageError && <p className="mt-2 text-xs text-red-500 font-medium">{imageError}</p>}
                        </div>
                    )}
                </div>
            )}

            {/* Content Logic */}
            <div className={templateStyles.textContainer ?? ''}>
                <h1 className={templateStyles.title}>{slide.title}</h1>
                
                <div className="flex-1 overflow-auto custom-scrollbar">
                    {showStackedVisuals ? (
                        <div className="flex flex-col h-full gap-4">
                            <div className="h-1/2"><Chart chartData={slide.chartData!} /></div>
                            <div className="h-1/2"><Table tableData={slide.tableData!} /></div>
                        </div>
                    ) : slide.chartData ? (
                        <Chart chartData={slide.chartData} />
                    ) : slide.tableData ? (
                        <Table tableData={slide.tableData} />
                    ) : (
                        <ul className={templateStyles.content}>
                            {slide.content.split('\n').map((point, i) => (
                                point && <li key={i} className={templateStyles.bullet}>{renderWithMarkdown(point)}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

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
        return null;
    }

    const selectedSlideIndex = deck.slides.findIndex(s => s.id === selectedSlide.id);
    const totalSlides = deck.slides.length;

    const handlePrint = () => {
        window.print();
    };

    return (
        <main className="flex-1 flex flex-col h-full relative bg-[#F3F4F6]">
            
            {/* Top Toolbar */}
            <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0 z-20 shadow-sm print:hidden gap-4">
                
                {/* Left: Navigation */}
                <div className="flex items-center gap-2 flex-shrink-0">
                     <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                        <button onClick={handlePrevSlide} disabled={selectedSlideIndex === 0} className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-gray-600 disabled:opacity-30 transition-all" title="Previous Slide"><ChevronLeftIcon /></button>
                        <span className="text-xs font-semibold text-gray-500 w-12 sm:w-16 text-center tabular-nums">{selectedSlideIndex + 1} / {totalSlides}</span>
                        <button onClick={handleNextSlide} disabled={selectedSlideIndex === totalSlides - 1} className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-gray-600 disabled:opacity-30 transition-all" title="Next Slide"><ChevronRightIcon /></button>
                     </div>
                </div>

                {/* Center: Tools (Scrollable) */}
                <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-hide mask-linear-fade">
                    <div className="h-6 w-px bg-gray-200 mx-2 flex-shrink-0"></div>
                    
                    <ToolbarButton 
                        onClick={handleSuggestLayout} 
                        disabled={isSuggestingLayout} 
                        icon={<LayoutIcon />} 
                        label="Auto-Layout" 
                        loading={isSuggestingLayout}
                        error={layoutError}
                    />
                    
                    <div className="h-6 w-px bg-gray-200 mx-2 flex-shrink-0"></div>

                    <ToolbarButton 
                        onClick={handleSuggestChart} 
                        disabled={isSuggestingChart || !!selectedSlide.chartData} 
                        icon={<BarChartIcon />} 
                        label="Bar Chart" 
                        loading={isSuggestingChart}
                        error={chartError}
                    />
                    <ToolbarButton 
                        onClick={handleSuggestPieChart} 
                        disabled={isSuggestingPieChart || !!selectedSlide.chartData} 
                        icon={<PieChartIcon />} 
                        label="Pie Chart" 
                        loading={isSuggestingPieChart}
                        error={pieChartError}
                    />
                     <ToolbarButton 
                        onClick={handleGenerateTable} 
                        disabled={isGeneratingTable || !!selectedSlide.tableData} 
                        icon={<TableIcon />} 
                        label="Table" 
                        loading={isGeneratingTable}
                        error={tableError}
                    />
                    
                    {selectedSlide.type === 'competition' && (
                         <ToolbarButton 
                            onClick={handleGenerateSWOT} 
                            disabled={isGeneratingSWOT || !!selectedSlide.tableData} 
                            icon={<MagicIcon />} 
                            label="SWOT" 
                            loading={isGeneratingSWOT}
                            error={swotError}
                        />
                    )}
                </div>
                
                {/* Right: Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                     <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-brand-blue bg-blue-50 hover:bg-blue-100 transition-colors"
                        title="Export as PDF (via Print)"
                    >
                        <PrinterIcon />
                        <span className="hidden sm:inline">Print</span>
                    </button>
                </div>
            </div>
            
            {/* Canvas Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-center min-h-0 bg-[#F3F4F6] print:bg-white print:p-0 print:overflow-visible">
                {/* Standard Editor View */}
                <div className="w-full max-w-5xl aspect-video bg-white shadow-2xl rounded-sm transition-transform duration-200 ease-out transform origin-center hover:scale-[1.005] print:hidden">
                    <SlideRenderer 
                        slide={selectedSlide} 
                        templateKey={String(deck.template)} 
                        isGeneratingImage={isGeneratingImage} 
                        imageError={imageError}
                        onGenerateImage={handleGenerateImage}
                    />
                </div>

                {/* Print-Only View: Renders ALL slides vertically */}
                <div className="hidden print:block w-full">
                    {deck.slides.map((slide, index) => (
                        <div key={slide.id} className="w-full aspect-video bg-white mb-0 page-break-after-always border-none">
                             {/* We reuse the renderer but disable interactive elements/loading states for print */}
                            <SlideRenderer slide={slide} templateKey={String(deck.template)} />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default React.memo(EditorPanel);
