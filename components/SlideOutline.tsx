import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Slide, Deck } from '../data/decks';
import { templates } from '../styles/templates';

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>
);
const RoadmapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" x2="8" y1="2" y2="18"/><line x1="16" x2="16" y1="6" y2="22"/></svg>
);
const PublishIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
);


interface SlideOutlineProps {
    deckId: string;
    deckTitle: string;
    slides: Slide[];
    template: Deck['template'];
    selectedSlideId: string;
    onSlideSelect: (slide: Slide) => void;
    onTitleSave: (newTitle: string) => void;
    onGenerateRoadmapSlide: () => void;
    isGeneratingRoadmap: boolean;
    isCollapsed: boolean;
    onPublish: () => void;
    isPublishing: boolean;
    publishProgressMessage: string;
}

interface SlideOutlineItemProps {
    slide: Slide;
    index: number;
    isSelected: boolean;
    isCollapsed: boolean;
    template: Deck['template'];
    onSelect: (slide: Slide) => void;
}

const SlideOutlineItem: React.FC<SlideOutlineItemProps> = React.memo(({ slide, index, isSelected, isCollapsed, template, onSelect }) => {
    const handleSelect = () => onSelect(slide);
    return (
        <div
            onClick={handleSelect}
            className={`p-2 rounded-md cursor-pointer border-2 transition-colors flex items-center ${isCollapsed ? '' : 'gap-3'} ${isSelected ? 'border-[#E87C4D] bg-orange-50' : 'border-transparent hover:border-gray-300'}`}
        >
            <span className={`text-sm font-medium text-gray-500 transition-all ${isCollapsed ? 'w-full text-center' : ''}`}>{index + 1}</span>
            {!isCollapsed && (
                <div className="w-full aspect-video bg-gray-200 rounded-sm overflow-hidden">
                    <div className={`w-full h-full text-[4px] p-1 ${templates[template]?.slide || templates.default.slide}`}>
                        <p className="font-bold truncate">{slide.title}</p>
                    </div>
                </div>
            )}
        </div>
    );
});
SlideOutlineItem.displayName = 'SlideOutlineItem';


const SlideOutline: React.FC<SlideOutlineProps> = ({ deckId, deckTitle, slides, template, selectedSlideId, onSlideSelect, onTitleSave, onGenerateRoadmapSlide, isGeneratingRoadmap, isCollapsed, onPublish, isPublishing, publishProgressMessage }) => {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState(deckTitle);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedTitle(e.target.value);
    };

    const handleTitleSaveInternal = () => {
        if(editedTitle.trim() !== deckTitle) {
            onTitleSave(editedTitle.trim());
        }
        setIsEditingTitle(false);
    };
    
    React.useEffect(() => {
        setEditedTitle(deckTitle);
    }, [deckTitle]);

    return (
        <aside className={`flex-shrink-0 bg-white border-r border-gray-200 flex flex-col p-4 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-[320px]'}`}>
            <div className={`mb-4 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                {isEditingTitle ? (
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={editedTitle}
                            onChange={handleTitleChange}
                            onBlur={handleTitleSaveInternal}
                            onKeyDown={(e) => e.key === 'Enter' && handleTitleSaveInternal()}
                            className="w-full text-lg font-bold p-1 border-b-2 border-[#E87C4D]"
                            autoFocus
                        />
                    </div>
                ) : (
                    <div className="flex items-center group">
                        <h2 className="text-lg font-bold text-gray-800 truncate">{deckTitle}</h2>
                        <button onClick={() => setIsEditingTitle(true)} className="ml-2 opacity-0 group-hover:opacity-100"><EditIcon /></button>
                    </div>
                )}
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 -mr-2 pr-2">
                {slides.map((slide, index) => (
                    <SlideOutlineItem
                        key={slide.id}
                        slide={slide}
                        index={index}
                        isSelected={selectedSlideId === slide.id}
                        isCollapsed={isCollapsed}
                        template={template}
                        onSelect={onSlideSelect}
                    />
                ))}
            </div>
            <div className={`mt-4 flex flex-col space-y-2 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <button
                    onClick={onGenerateRoadmapSlide}
                    disabled={isGeneratingRoadmap}
                    className="w-full text-center bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2 disabled:bg-gray-200 disabled:cursor-not-allowed"
                >
                    {isGeneratingRoadmap ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-[#E87C4D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Generating...</span>
                        </>
                    ) : (
                         <>
                            <RoadmapIcon />
                            <span>Generate Roadmap</span>
                        </>
                    )}
                </button>
                <button
                    onClick={onPublish}
                    disabled={isPublishing}
                    className="w-full text-center bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2 disabled:bg-gray-200 disabled:cursor-not-allowed"
                >
                    {isPublishing ? (
                        <>
                             <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-[#E87C4D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>{publishProgressMessage}...</span>
                        </>
                    ) : (
                        <>
                            <PublishIcon />
                            <span>Publish</span>
                        </>
                    )}
                </button>
                 <Link
                    to={`/dashboard/decks/${deckId}/present`}
                    state={{deck: {id: deckId, title: deckTitle, slides: slides, template: template}}}
                    className="block w-full text-center bg-[#E87C4D] text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors duration-200"
                >
                    Present
                </Link>
            </div>
        </aside>
    );
};

export default SlideOutline;
