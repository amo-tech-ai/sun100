import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Slide, Deck } from '../data/decks';
import { templates } from '../styles/templates';

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>
);

interface SlideOutlineProps {
    deckId: string;
    deckTitle: string;
    slides: Slide[];
    template: Deck['template'];
    selectedSlideId: string;
    onSlideSelect: (slide: Slide) => void;
    onTitleSave: (newTitle: string) => void;
    isCollapsed: boolean;
}

const SlideOutline: React.FC<SlideOutlineProps> = ({ deckId, deckTitle, slides, template, selectedSlideId, onSlideSelect, onTitleSave, isCollapsed }) => {
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
        <aside className={`flex-shrink-0 bg-white border-r border-gray-200 flex flex-col p-4 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-[320px]'}`}>
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
                    <div
                        key={slide.id}
                        onClick={() => onSlideSelect(slide)}
                        className={`p-2 rounded-md cursor-pointer border-2 transition-colors flex items-center gap-3 ${selectedSlideId === slide.id ? 'border-[#E87C4D] bg-orange-50' : 'border-transparent hover:border-gray-300'}`}
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
                ))}
            </div>
             <Link
                to={`/dashboard/decks/${deckId}/present`}
                state={{deck: {id: deckId, title: deckTitle, slides: slides, template: template}}}
                className={`mt-4 text-center bg-[#E87C4D] text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors duration-200 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
                {isCollapsed ? '' : 'Present'}
            </Link>
        </aside>
    );
};

export default SlideOutline;
