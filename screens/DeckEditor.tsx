import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { mockDeck, Deck, Slide } from '../data/decks';

// Icons from screenshot
const DragHandleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="cursor-grab text-gray-400">
        <circle cx="8" cy="6" r="1.5" fill="currentColor"/>
        <circle cx="16" cy="6" r="1.5" fill="currentColor"/>
        <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
        <circle cx="16" cy="12" r="1.5" fill="currentColor"/>
        <circle cx="8" cy="18" r="1.5" fill="currentColor"/>
        <circle cx="16" cy="18" r="1.5" fill="currentColor"/>
    </svg>
);
const EditIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500"><path d="M17.2426 5.34315L18.6569 6.75736L7.94975 17.4645H6.53553V16.0503L17.2426 5.34315Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14.4142 8.17157L15.8284 9.58579" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const CopyIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500"><rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 16C4 17.1046 4.89543 18 6 18H16V16C16 14.8954 15.1046 14 14 14H6C4.89543 14 4 14.8954 4 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const DeleteIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-500"><path d="M4 7H20M10 11V17M14 11V17M5 7L6 19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19L19 7M9 7V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ChevronDownIcon = ({ className = "w-5 h-5" }) => <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const PlusIcon = () => <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const UndoIcon = () => <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 14L4 9L9 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 9H14.5C18.0899 9 21 11.9101 21 15.5C21 19.0899 18.0899 22 14.5 22H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const RedoIcon = () => <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 14L20 9L15 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 9H9.5C5.91015 9 3 11.9101 3 15.5C3 19.0899 5.91015 22 9.5 22H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const PaperclipIcon = () => <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.172 7.07107C16.3431 5.90001 18.2386 5.90001 19.4101 7.07107C20.5812 8.24212 20.5812 10.1376 19.4101 11.3086L12.7071 18.0117C11.9261 18.7927 10.6597 18.7927 9.87868 18.0117C9.09763 17.2306 9.09763 15.9643 9.87868 15.1832L16.5858 8.47612" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const SendIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 19L12 5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;


const DeckEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const { generatedDeck } = location.state || {};

    const [deck, setDeck] = useState<Deck | null>(null);

    useEffect(() => {
        // Priority for loading deck: Navigation state > Session Storage > Mock Data
        const storedDeckJson = sessionStorage.getItem(`deck-${id}`);
        const storedDeck = storedDeckJson ? JSON.parse(storedDeckJson) : null;
        const initialDeck = generatedDeck || storedDeck || mockDeck;
        
        console.log(`Editing deck with id: ${id}`);
        setDeck(initialDeck);
    }, [id, generatedDeck]);

    // Persist deck to session storage on any change
    useEffect(() => {
        if (deck) {
            sessionStorage.setItem(`deck-${deck.id}`, JSON.stringify(deck));
        }
    }, [deck]);

    const handleUpdateSlideTitle = (slideId: string, newTitle: string) => {
        if (!deck) return;
        const updatedSlides = deck.slides.map(s => s.id === slideId ? { ...s, title: newTitle } : s);
        setDeck({ ...deck, slides: updatedSlides });
    }
    
    const handleAddSlide = () => {
        if (!deck) return;
        const newSlide: Slide = {
            id: `slide-${Date.now()}`,
            title: 'New Slide',
            content: 'Your content here.'
        };
        setDeck({ ...deck, slides: [...deck.slides, newSlide]});
    }

    const handleDeleteSlide = (slideId: string) => {
        if (!deck) return;
        setDeck({...deck, slides: deck.slides.filter(s => s.id !== slideId)});
    }

    if (!deck) {
        return <div className="p-8">Loading deck...</div>;
    }

    return (
        <div className="flex h-screen bg-[#FBF8F5] overflow-hidden text-gray-800">
            {/* Left Panel */}
            <aside className="w-[380px] flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h1 className="text-lg font-bold text-gray-800">decktopus</h1>
                    <button className="text-sm font-medium text-gray-600 hover:text-gray-900">Need Help?</button>
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                        <button className="flex items-center justify-between w-full p-3 bg-white rounded-lg border border-gray-200 text-left shadow-sm">
                            <span className="font-semibold text-gray-700">Refine your presentation</span>
                            <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                        </button>
                        <div className="mt-6">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-pink-200 text-pink-700 font-bold flex items-center justify-center flex-shrink-0">S</div>
                                <div className="bg-white border border-gray-200 p-4 rounded-lg rounded-tl-none shadow-sm">
                                    <p className="text-sm text-gray-700">
                                        <span className="font-semibold">Event planning today is slow and messy.</span> Organizers use 6-10 different tools for registration, design, payments, and reports. It can take 3 days just to set up one event — and mistakes are common.
                                    </p>
                                    <p className="text-sm text-gray-700 mt-2">
                                        <span className="font-semibold">Solution:</span> EventOS is an AI-powered event management platform that lets anyone create and launch a professional event in under 3 minutes. The system uses automation and smart templates to handle everything — venue selection, ticket setup, sponsor management, and live analytics — all in one dashboard.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <textarea 
                            className="w-full p-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
                            rows={3}
                            placeholder="Craft the perfect presentation outline effortlessly"
                        />
                        <div className="absolute bottom-3 right-3 flex items-center gap-2">
                            <button className="p-1 text-gray-500 hover:text-gray-800"><PaperclipIcon /></button>
                            <button className="p-2 bg-gray-200 rounded-md hover:bg-gray-300">
                                <SendIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Right Panel */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white flex-shrink-0">
                     <div className="flex items-center gap-4">
                        <h2 className="text-lg font-bold text-gray-900">Presentation Outline</h2>
                        <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{deck.slides.length} Slides</span>
                        <div className="flex items-center gap-3">
                            <button><UndoIcon /></button>
                            <button><RedoIcon /></button>
                        </div>
                    </div>
                     <div className="flex items-center gap-3">
                        <button className="px-4 py-2 text-sm font-semibold border border-gray-300 rounded-md bg-white hover:bg-gray-50 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>
                            AI Image
                        </button>
                        <button className="px-4 py-2 text-sm font-semibold border border-gray-300 rounded-md bg-gray-200 text-gray-500 cursor-not-allowed">Selecting Layouts</button>
                        <button className="px-4 py-2 text-sm font-semibold text-purple-700 border border-purple-200 rounded-md bg-purple-50 hover:bg-purple-100">
                           Change Design
                        </button>
                    </div>
                </header>
                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="mb-6">
                        <label className="text-sm font-semibold text-gray-600 mb-2 block">Title</label>
                        <div className="flex items-center gap-3">
                             <input 
                                type="text" 
                                value={deck.title}
                                onChange={(e) => setDeck({...deck, title: e.target.value})}
                                className="flex-grow p-2 border border-gray-300 rounded-md"
                            />
                            <div className="flex items-center gap-1">
                                <div className="w-6 h-6 rounded-full bg-gray-700 border-2 border-white ring-1 ring-gray-700"></div>
                                <div className="w-6 h-6 rounded-full bg-purple-700 border-2 border-white ring-1 ring-purple-700"></div>
                                <div className="w-6 h-6 rounded-full bg-indigo-700 border-2 border-white ring-1 ring-indigo-700"></div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {deck.slides.map((slide, index) => (
                           <div key={slide.id} className="bg-white p-3 rounded-lg border border-gray-200 flex items-center gap-3 group shadow-sm">
                                <DragHandleIcon />
                                <span className="text-sm font-semibold text-gray-500">Slide {index + 1}</span>
                                <input 
                                    type="text"
                                    value={slide.title}
                                    onChange={(e) => handleUpdateSlideTitle(slide.id, e.target.value)}
                                    className="w-full p-1 bg-transparent focus:bg-gray-100 rounded"
                                />
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button title="Edit Content"><EditIcon /></button>
                                    <button title="Duplicate Slide"><CopyIcon /></button>
                                    <button onClick={() => handleDeleteSlide(slide.id)} title="Delete Slide"><DeleteIcon /></button>
                                    <button title="More Options"><ChevronDownIcon className="w-4 h-4 text-gray-500" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                     <button onClick={handleAddSlide} className="mt-4 w-full border-2 border-dashed border-gray-300 text-gray-500 font-semibold py-3 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition flex items-center justify-center">
                        <PlusIcon /> Add Slide
                    </button>
                </div>
            </main>
        </div>
    );
};

export default DeckEditor;
