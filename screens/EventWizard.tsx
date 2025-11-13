import React, { useState } from 'react';
import { generateEventDescription, generateEventTitles, suggestVenues, VenueSuggestion } from '../services/aiService';

const WandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/></svg>
);

const EventWizard: React.FC = () => {
    const [step, setStep] = useState(1);
    const [eventName, setEventName] = useState('Tech Meetup');
    const [eventDate, setEventDate] = useState('2025-11-27T17:59');
    const [location, setLocation] = useState('Toronto, ON, Canada');
    const [description, setDescription] = useState('A gathering of tech enthusiasts and professionals to discuss the latest trends in AI and software development.');
    
    // State for description generation
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
    const [descError, setDescError] = useState<string | null>(null);

    // State for title generation
    const [isGeneratingTitles, setIsGeneratingTitles] = useState(false);
    const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
    const [titleError, setTitleError] = useState<string | null>(null);

    // State for venue suggestions
    const [isGeneratingVenues, setIsGeneratingVenues] = useState(false);
    const [venueSuggestions, setVenueSuggestions] = useState<VenueSuggestion[]>([]);
    const [venueError, setVenueError] = useState<string | null>(null);

    const totalSteps = 2;

    const handleGenerateDescription = async () => {
        setIsGeneratingDesc(true);
        setDescError(null);
        try {
            const result = await generateEventDescription({
                title: eventName,
                date: eventDate,
                location: location
            });
            setDescription(result.description);
        } catch (err) {
            setDescError(err instanceof Error ? err.message : 'Failed to generate description.');
        } finally {
            setIsGeneratingDesc(false);
        }
    };

    const handleGenerateTitles = async () => {
        setIsGeneratingTitles(true);
        setTitleError(null);
        setSuggestedTitles([]);
        try {
            const result = await generateEventTitles(eventName);
            setSuggestedTitles(result.titles);
        } catch (err) {
            setTitleError(err instanceof Error ? err.message : 'Failed to generate titles.');
        } finally {
            setIsGeneratingTitles(false);
        }
    };

    const handleSuggestVenues = async () => {
        setIsGeneratingVenues(true);
        setVenueError(null);
        setVenueSuggestions([]);
        try {
            const results = await suggestVenues(eventName, location);
            setVenueSuggestions(results);
        } catch (err) {
            setVenueError(err instanceof Error ? err.message : 'Failed to suggest venues.');
        } finally {
            setIsGeneratingVenues(false);
        }
    };

    const applyTitle = (title: string) => {
        setEventName(title);
        setSuggestedTitles([]);
    };


    return (
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-md max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">Create a New Event</h1>
            <p className="text-gray-500 mb-6">Step {step} of {totalSteps}</p>

            {step === 1 && (
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Event Details</h2>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">Event Name</label>
                            <button
                                type="button"
                                onClick={handleGenerateTitles}
                                disabled={!eventName || isGeneratingTitles}
                                className="flex items-center gap-2 text-sm font-semibold text-[#E87C4D] hover:text-opacity-80 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                {isGeneratingTitles ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <WandIcon />
                                        Suggest Titles
                                    </>
                                )}
                            </button>
                        </div>
                        <input type="text" id="eventName" value={eventName} onChange={e => setEventName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E87C4D] focus:border-[#E87C4D]" />
                        {titleError && <p className="text-red-600 text-sm mt-1">{titleError}</p>}
                        {suggestedTitles.length > 0 && (
                            <div className="mt-2 space-y-2">
                                {suggestedTitles.map((title, i) => (
                                    <button
                                        key={i}
                                        onClick={() => applyTitle(title)}
                                        className="w-full text-left p-2 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 transition-colors"
                                    >
                                        {title}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">Date & Time</label>
                            <input type="datetime-local" id="eventDate" value={eventDate} onChange={e => setEventDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E87C4D] focus:border-[#E87C4D]" />
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                            <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g., Virtual or a city and state" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E87C4D] focus:border-[#E87C4D]" />
                            <div className="mt-2">
                                <button
                                    type="button"
                                    onClick={handleSuggestVenues}
                                    disabled={!location.trim() || isGeneratingVenues}
                                    className="flex items-center gap-2 text-sm font-semibold text-[#E87C4D] hover:text-opacity-80 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isGeneratingVenues ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Suggesting Venues...
                                        </>
                                    ) : (
                                        <>
                                            <WandIcon />
                                            Suggest Venues with AI
                                        </>
                                    )}
                                </button>
                            </div>
                            {venueError && <p className="text-red-600 text-sm mt-1">{venueError}</p>}
                            {venueSuggestions.length > 0 && (
                                <div className="mt-2 space-y-2">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase">Venue Suggestions</h4>
                                    {venueSuggestions.map((venue, i) => (
                                        <div key={i} className="p-3 bg-orange-50/50 border border-orange-200/50 rounded-md">
                                            <div className="flex justify-between items-start gap-2">
                                                <div>
                                                    <p className="font-semibold text-brand-blue">{venue.name}</p>
                                                    <p className="text-sm text-gray-600 italic mt-1">{venue.reason}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setLocation(venue.name)}
                                                    className="text-sm bg-[#E87C4D] text-white font-semibold py-1 px-3 rounded-md hover:bg-opacity-90 flex-shrink-0"
                                                >
                                                    Use
                                                </button>
                                            </div>
                                            {venue.mapLink && (
                                                <a href={venue.mapLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
                                                    View on Map &rarr;
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                             <label htmlFor="eventDescription" className="block text-sm font-medium text-gray-700">Description</label>
                             <button 
                                type="button" 
                                onClick={handleGenerateDescription}
                                disabled={!eventName || !eventDate || !location || isGeneratingDesc}
                                className="flex items-center gap-2 text-sm font-semibold text-[#E87C4D] hover:text-opacity-80 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                             >
                                {isGeneratingDesc ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <WandIcon />
                                        Generate with AI
                                    </>
                                )}
                            </button>
                        </div>
                        <textarea id="eventDescription" value={description} onChange={e => setDescription(e.target.value)} rows={5} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E87C4D] focus:border-[#E87C4D]"></textarea>
                        {descError && <p className="text-red-600 text-sm mt-1">{descError}</p>}
                    </div>
                </div>
            )}
            
            {step === 2 && (
                 <div className="text-center">
                    <h2 className="text-xl font-semibold">Ready to Publish!</h2>
                    <p className="mt-2 text-gray-600">Review your event details and publish it to the community.</p>
                </div>
            )}


            <div className="mt-8 flex justify-between">
                <button 
                    onClick={() => setStep(s => s - 1)} 
                    disabled={step === 1}
                    className="bg-gray-200 text-gray-800 font-bold py-2 px-5 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                    Back
                </button>
                 {step < totalSteps ? (
                     <button 
                        onClick={() => setStep(s => s + 1)} 
                        className="bg-[#E87C4D] text-white font-bold py-2 px-5 rounded-lg hover:bg-opacity-90"
                    >
                        Next
                    </button>
                 ) : (
                    <button className="bg-green-500 text-white font-bold py-2 px-5 rounded-lg hover:bg-opacity-90">
                        Publish Event
                    </button>
                 )}
            </div>
        </div>
    );
};

export default EventWizard;