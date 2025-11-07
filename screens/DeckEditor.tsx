import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { mockDeck, Deck, Slide } from '../data/decks';
import { templates } from '../styles/templates';
import AICopilot from '../components/AICopilot';
import AnalysisPanel from '../components/AnalysisPanel';
import ResearchResultPanel from '../components/ResearchResultPanel';

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>
);

const DeckEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const { generatedDeck } = location.state || {};

    const [deck, setDeck] = useState<Deck | null>(null);
    const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');

    useEffect(() => {
        const initialDeck = generatedDeck || mockDeck;
        console.log(`Editing deck with id: ${id}`);
        setDeck(initialDeck);
        if (initialDeck.slides && initialDeck.slides.length > 0) {
            setSelectedSlide(initialDeck.slides[0]);
        }
        setEditedTitle(initialDeck.title);
    }, [id, generatedDeck]);

    const handleSlideSelect = (slide: Slide) => {
        setSelectedSlide(slide);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedTitle(e.target.value);
    };

    const handleTitleSave = () => {
        if (deck) {
            setDeck({ ...deck, title: editedTitle });
            setIsEditingTitle(false);
        }
    };

    if (!deck || !selectedSlide) {
        return <div className="p-8">Loading deck...</div>;
    }

    const templateStyles = templates[deck.template] || templates.default;

    return (
        <div className="flex h-full bg-[#FBF8F5]">
            {/* Slide Thumbnail Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
                <div className="mb-4">
                    {isEditingTitle ? (
                        <div className="flex items-center">
                            <input 
                                type="text"
                                value={editedTitle}
                                onChange={handleTitleChange}
                                onBlur={handleTitleSave}
                                onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
                                className="w-full text-lg font-bold p-1 border-b-2 border-[#E87C4D]"
                                autoFocus
                            />
                        </div>
                    ) : (
                        <div className="flex items-center group">
                            <h2 className="text-lg font-bold text-gray-800 truncate">{deck.title}</h2>
                            <button onClick={() => setIsEditingTitle(true)} className="ml-2 opacity-0 group-hover:opacity-100"><EditIcon /></button>
                        </div>
                    )}
                </div>
                <div className="flex-1 overflow-y-auto space-y-2">
                    {deck.slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            onClick={() => handleSlideSelect(slide)}
                            className={`p-2 rounded-md cursor-pointer border-2 transition-colors ${selectedSlide.id === slide.id ? 'border-[#E87C4D]' : 'border-transparent hover:border-gray-300'}`}
                        >
                            <span className="text-sm text-gray-500">Slide {index + 1}</span>
                            <div className="w-full aspect-video bg-gray-200 rounded-sm mt-1 overflow-hidden">
                                <div className={`w-full h-full text-[4px] p-1 ${templates[deck.template].slide}`}>
                                    <p className="font-bold truncate">{slide.title}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                 <Link
                    to={`/dashboard/decks/${deck.id}/present`}
                    className="mt-4 text-center bg-[#E87C4D] text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors duration-200"
                >
                    Present
                </Link>
            </aside>

            {/* Main Slide Editor */}
            <main className="flex-1 p-8 flex flex-col items-center justify-center">
                 <div className="w-full max-w-4xl aspect-video bg-white rounded-lg shadow-lg">
                    {/* The actual slide content */}
                    <div className={`w-full h-full shadow-lg rounded-lg overflow-hidden ${templateStyles.slide}`}>
                         {selectedSlide.imageUrl && (
                            <div className={templateStyles.imageContainer}>
                                <img src={selectedSlide.imageUrl} alt={selectedSlide.title} className={templateStyles.image} />
                            </div>
                         )}
                         <h1 className={templateStyles.title}>{selectedSlide.title}</h1>
                         <ul className={templateStyles.content}>
                            {selectedSlide.content.split('\n').map((point, i) => (
                                <li key={i} className={templateStyles.bullet}>{point}</li>
                            ))}
                         </ul>
                    </div>
                </div>
            </main>

            {/* AI Panels */}
            <aside className="w-96 bg-white border-l border-gray-200 p-4 overflow-y-auto">
                <AICopilot />
                <AnalysisPanel />
                <ResearchResultPanel />
            </aside>
        </div>
    );
};

export default DeckEditor;