
import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Slide, Deck } from '../data/decks';
import { templates } from '../styles/templates';
import { useDeckEditor } from '../contexts/DeckEditorContext';
import TemplateSelector from './TemplateSelector';

const { Link } = ReactRouterDOM;

// Icons
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>;
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const LayersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const ShareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>;

interface SlideOutlineProps {
    isCollapsed: boolean;
}

const SlideOutlineItem: React.FC<{
    slide: Slide;
    index: number;
    isSelected: boolean;
    isCollapsed: boolean;
    template: Deck['template'];
    onSelect: (slide: Slide) => void;
}> = React.memo(({ slide, index, isSelected, isCollapsed, template, onSelect }) => {
    return (
        <div
            onClick={() => onSelect(slide)}
            className={`group flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50 border-transparent'} border`}
        >
            <span className={`text-xs font-bold text-gray-400 w-4 text-center ${isSelected ? 'text-blue-500' : ''}`}>{index + 1}</span>
            
            {!isCollapsed && (
                <div className="flex-1 min-w-0">
                     <div className={`w-full aspect-video rounded overflow-hidden border ${isSelected ? 'border-blue-300 shadow-sm' : 'border-gray-200'} bg-white relative`}>
                        <div className={`w-full h-full text-[4px] p-1 select-none ${templates[template]?.slide || templates.default.slide}`}>
                            <div className="font-bold truncate text-gray-900">{slide.title}</div>
                            <div className="h-px w-full bg-gray-100 my-0.5"></div>
                            <div className="space-y-0.5">
                                <div className="h-0.5 w-3/4 bg-gray-200 rounded-full"></div>
                                <div className="h-0.5 w-1/2 bg-gray-200 rounded-full"></div>
                            </div>
                        </div>
                     </div>
                     <p className={`text-xs font-medium mt-1.5 truncate ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                        {slide.title || 'Untitled Slide'}
                     </p>
                </div>
            )}
        </div>
    );
});

const SlideOutline: React.FC<SlideOutlineProps> = ({ isCollapsed }) => {
    const {
        deck,
        selectedSlide,
        handleSlideSelect,
        handleTitleSave,
        handleGenerateRoadmapSlide,
        isGeneratingRoadmap,
        handlePublishDeck,
        isPublishing,
        publishProgressMessage,
        handleTemplateChange,
        handleGenerateGTM,
        isGeneratingGTM
    } = useDeckEditor();

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState(deck?.title || '');

    const handleTitleSaveInternal = () => {
        if(deck && editedTitle.trim() && editedTitle.trim() !== deck.title) {
            handleTitleSave(editedTitle.trim());
        }
        setIsEditingTitle(false);
    };
    
    React.useEffect(() => {
        if(deck) setEditedTitle(deck.title);
    }, [deck?.title]);

    if (!deck || !selectedSlide) return null;

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className={`h-14 border-b border-gray-200 flex items-center px-4 flex-shrink-0 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                {!isCollapsed ? (
                     isEditingTitle ? (
                        <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            onBlur={handleTitleSaveInternal}
                            onKeyDown={(e) => e.key === 'Enter' && handleTitleSaveInternal()}
                            className="w-full text-sm font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded border border-brand-orange focus:outline-none"
                            autoFocus
                        />
                    ) : (
                        <div className="flex items-center gap-2 group w-full">
                            <h2 
                                className="text-sm font-bold text-gray-900 truncate cursor-pointer hover:text-brand-blue"
                                onClick={() => setIsEditingTitle(true)}
                            >
                                {deck.title}
                            </h2>
                            <button onClick={() => setIsEditingTitle(true)} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-gray-600">
                                <EditIcon />
                            </button>
                        </div>
                    )
                ) : (
                    <div className="w-8 h-8 bg-brand-orange/10 rounded-md flex items-center justify-center text-brand-orange font-bold text-xs">
                        {deck.title[0]}
                    </div>
                )}
            </div>

            {/* Slide List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {deck.slides.map((slide, index) => (
                    <SlideOutlineItem
                        key={slide.id}
                        slide={slide}
                        index={index}
                        isSelected={selectedSlide.id === slide.id}
                        isCollapsed={isCollapsed}
                        template={deck.template}
                        onSelect={handleSlideSelect}
                    />
                ))}
            </div>

            {/* Bottom Actions */}
            <div className={`border-t border-gray-200 bg-gray-50 p-4 flex-shrink-0 space-y-4 transition-opacity duration-200 ${isCollapsed ? 'opacity-0 pointer-events-none hidden' : 'opacity-100'}`}>
                
                {/* Themes */}
                <div>
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <LayersIcon /> Theme
                    </h3>
                    <TemplateSelector selectedTemplate={deck.template} setSelectedTemplate={handleTemplateChange} />
                </div>

                {/* AI Actions */}
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={handleGenerateRoadmapSlide}
                        disabled={isGeneratingRoadmap}
                        className="flex flex-col items-center justify-center p-2 bg-white border border-gray-200 rounded-lg hover:border-brand-orange/50 hover:shadow-sm transition-all text-xs font-medium text-gray-600 hover:text-brand-blue disabled:opacity-50"
                    >
                        {isGeneratingRoadmap ? <span className="animate-pulse">...</span> : <SparklesIcon />}
                        <span className="mt-1">Roadmap</span>
                    </button>
                    <button
                        onClick={handleGenerateGTM}
                        disabled={isGeneratingGTM}
                        className="flex flex-col items-center justify-center p-2 bg-white border border-gray-200 rounded-lg hover:border-brand-orange/50 hover:shadow-sm transition-all text-xs font-medium text-gray-600 hover:text-brand-blue disabled:opacity-50"
                    >
                        {isGeneratingGTM ? <span className="animate-pulse">...</span> : <SparklesIcon />}
                        <span className="mt-1">GTM Strat</span>
                    </button>
                </div>

                {/* Primary Actions */}
                <div className="flex gap-2">
                     <button
                        onClick={handlePublishDeck}
                        disabled={isPublishing}
                        className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-2 rounded-lg hover:bg-gray-50 transition-colors text-xs disabled:opacity-50"
                    >
                        {isPublishing ? (
                            <span className="animate-pulse">{publishProgressMessage}...</span>
                        ) : (
                            <><ShareIcon /> Publish</>
                        )}
                    </button>
                    <Link
                        to={`/pitch-decks/${deck.id}/present`}
                        className="flex-1 flex items-center justify-center gap-2 bg-brand-blue text-white font-bold py-2 rounded-lg hover:bg-opacity-90 transition-colors text-xs"
                    >
                        <PlayIcon /> Present
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SlideOutline;