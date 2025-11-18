

import React, { useState } from 'react';
import {
    generateEventDescription,
    generateEventTitles,
    suggestVenues,
    generateSocialMediaCopy,
    structureAgenda,
    estimateBudget,
    generateEmailSequence,
} from '../services/ai/event';
import {
    VenueSuggestion,
    SocialMediaCopy,
    AgendaItem,
    BudgetEstimate,
    EmailSequence,
} from '../services/ai/types';

const WandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/></svg>
);

const ClipboardIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>;
const CheckIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 6 9 17l-5-5"/></svg>;
const CalculatorIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>;
const MailIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;


const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    return (
        <button onClick={handleCopy} className="text-gray-400 hover:text-brand-orange" aria-label="Copy text">
            {copied ? <CheckIcon className="text-green-500" /> : <ClipboardIcon />}
        </button>
    );
};


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

    // State for social media copy generation
    const [socialCopy, setSocialCopy] = useState<SocialMediaCopy | null>(null);
    const [isGeneratingSocial, setIsGeneratingSocial] = useState(false);
    const [socialError, setSocialError] = useState<string | null>(null);

    // State for agenda structuring
    const [rawAgenda, setRawAgenda] = useState('6pm: Doors Open & Networking\n6:30pm: Keynote by Alex Chen\n7:15pm: Panel Discussion - The Future of AI\n8:00pm: Q&A Session');
    const [structuredAgenda, setStructuredAgenda] = useState<AgendaItem[]>([]);
    const [isStructuringAgenda, setIsStructuringAgenda] = useState(false);
    const [agendaError, setAgendaError] = useState<string | null>(null);

    // State for budget
    const [totalBudget, setTotalBudget] = useState(1000);
    const [attendeeCount, setAttendeeCount] = useState(50);
    const [budgetEstimate, setBudgetEstimate] = useState<BudgetEstimate | null>(null);
    const [isEstimatingBudget, setIsEstimatingBudget] = useState(false);
    const [budgetError, setBudgetError] = useState<string | null>(null);

    // State for emails
    const [emailSequence, setEmailSequence] = useState<EmailSequence | null>(null);
    const [isGeneratingEmails, setIsGeneratingEmails] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [activeEmailTab, setActiveEmailTab] = useState<'invitation' | 'reminder' | 'followUp'>('invitation');


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

    const handleGenerateSocialCopy = async () => {
        setIsGeneratingSocial(true);
        setSocialError(null);
        setSocialCopy(null);
        try {
            const result = await generateSocialMediaCopy({
                title: eventName,
                description,
                date: eventDate,
                location
            });
            setSocialCopy(result);
        } catch (err) {
            setSocialError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsGeneratingSocial(false);
        }
    };

    const handleStructureAgenda = async () => {
        setIsStructuringAgenda(true);
        setAgendaError(null);
        setStructuredAgenda([]);
        try {
            const result = await structureAgenda(rawAgenda, eventDate);
            setStructuredAgenda(result.schedule);
        } catch (err) {
            setAgendaError(err instanceof Error ? err.message : "Failed to structure agenda.");
        } finally {
            setIsStructuringAgenda(false);
        }
    };

    const handleEstimateBudget = async () => {
        setIsEstimatingBudget(true);
        setBudgetError(null);
        setBudgetEstimate(null);
        try {
            const result = await estimateBudget(totalBudget, attendeeCount, `${eventName} - ${description}`);
            setBudgetEstimate(result);
        } catch (err) {
            setBudgetError(err instanceof Error ? err.message : "Failed to estimate budget.");
        } finally {
            setIsEstimatingBudget(false);
        }
    };

    const handleGenerateEmails = async () => {
        setIsGeneratingEmails(true);
        setEmailError(null);
        setEmailSequence(null);
        try {
            const result = await generateEmailSequence({
                title: eventName,
                description,
                date: eventDate,
                location
            });
            setEmailSequence(result);
        } catch (err) {
            setEmailError(err instanceof Error ? err.message : "Failed to generate emails.");
        } finally {
            setIsGeneratingEmails(false);
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
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24">
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
                        <input type="text" id="eventName" value={eventName} onChange={(e) => setEventName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E87C4D] focus:border-[#E87C4D]" />
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
                            <input type="datetime-local" id="eventDate" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E87C4D] focus:border-[#E87C4D]" />
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                            <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Virtual or a city and state" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E87C4D] focus:border-[#E87C4D]" />
                            <div className="mt-2">
                                <button
                                    type="button"
                                    onClick={handleSuggestVenues}
                                    disabled={!location.trim() || isGeneratingVenues}
                                    className="flex items-center gap-2 text-sm font-semibold text-[#E87C4D] hover:text-opacity-80 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isGeneratingVenues ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24">
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
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24">
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
                        <textarea id="eventDescription" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E87C4D] focus:border-[#E87C4D]"></textarea>
                        {descError && <p className="text-red-600 text-sm mt-1">{descError}</p>}
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="rawAgenda" className="block text-sm font-medium text-gray-700">Agenda / Schedule</label>
                            <button
                                type="button"
                                onClick={handleStructureAgenda}
                                disabled={!rawAgenda || isStructuringAgenda}
                                className="flex items-center gap-2 text-sm font-semibold text-[#E87C4D] hover:text-opacity-80 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                {isStructuringAgenda ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Structuring...
                                    </>
                                ) : (
                                    <> <WandIcon /> Structure with AI </>
                                )}
                            </button>
                        </div>
                        <textarea
                            id="rawAgenda"
                            value={rawAgenda}
                            onChange={(e) => setRawAgenda(e.target.value)}
                            rows={5}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E87C4D] focus:border-[#E87C4D]"
                            placeholder="e.g., 6pm: Doors Open, 6:30pm: Keynote by Alex Chen..."
                        />
                        {agendaError && <p className="text-red-600 text-sm mt-1">{agendaError}</p>}
                        {structuredAgenda.length > 0 && (
                            <div className="mt-4 space-y-3 border-t pt-4">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase">Structured Agenda Preview</h4>
                                <ul className="space-y-3">
                                    {structuredAgenda.map((item, i) => (
                                        <li key={i} className="flex items-start gap-4 p-3 bg-gray-50 rounded-md">
                                            <div className="font-semibold text-brand-orange w-20 flex-shrink-0">{item.time}</div>
                                            <div>
                                                <p className="font-semibold text-brand-blue">{item.topic}</p>
                                                {item.speaker && <p className="text-sm text-gray-500">Speaker: {item.speaker}</p>}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Budget Estimator Section */}
                    <div className="border-t border-gray-200 pt-6">
                        <div className="flex justify-between items-center mb-4">
                             <h3 className="text-lg font-semibold text-brand-blue">Logistics & Budget</h3>
                             <button
                                type="button"
                                onClick={handleEstimateBudget}
                                disabled={isEstimatingBudget}
                                className="flex items-center gap-2 text-sm font-semibold text-[#E87C4D] hover:text-opacity-80 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                {isEstimatingBudget ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Calculating...
                                    </>
                                ) : (
                                    <> <CalculatorIcon /> Estimate Costs </>
                                )}
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Total Budget ($)</label>
                                <input 
                                    type="number" 
                                    value={totalBudget} 
                                    onChange={(e) => setTotalBudget(parseFloat(e.target.value))}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E87C4D] focus:border-[#E87C4D]" 
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Attendees</label>
                                <input 
                                    type="number" 
                                    value={attendeeCount} 
                                    onChange={(e) => setAttendeeCount(parseInt(e.target.value, 10))}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E87C4D] focus:border-[#E87C4D]" 
                                />
                            </div>
                        </div>
                        {budgetError && <p className="text-red-600 text-sm mt-1">{budgetError}</p>}
                        {budgetEstimate && (
                             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="flex justify-between text-sm font-bold text-gray-700 mb-2 border-b pb-2">
                                    <span>Category</span>
                                    <span>Estimated Cost</span>
                                </div>
                                <ul className="space-y-2">
                                    {budgetEstimate.items.map((item, i) => (
                                        <li key={i} className="flex justify-between text-sm">
                                            <span>{item.category} <span className="text-xs text-gray-500 block font-normal">{item.notes}</span></span>
                                            <span className="font-medium">${item.amount.toLocaleString()}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex justify-between text-sm font-bold text-brand-blue mt-4 pt-2 border-t border-gray-300">
                                    <span>Total Estimated</span>
                                    <span>${budgetEstimate.total.toLocaleString()} <span className="text-xs font-normal text-gray-500">(${budgetEstimate.perHead}/head)</span></span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {step === 2 && (
                 <div className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold">Ready to Publish!</h2>
                        <p className="mt-2 text-gray-600">Review your event details and publish it to the community. You can also generate promotional materials.</p>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-brand-blue mb-4">Promote Your Event</h3>
                        <p className="text-sm text-gray-500 mb-4">Generate promotional copy for social media and email campaigns to help spread the word.</p>
                        
                        {/* Social Media Section */}
                        <div className="mb-8">
                            <button
                                type="button"
                                onClick={handleGenerateSocialCopy}
                                disabled={isGeneratingSocial}
                                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:bg-gray-200 mb-4"
                            >
                                {isGeneratingSocial ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating Posts...
                                    </>
                                ) : (
                                    <>
                                        <WandIcon />
                                        Generate Social Media Posts
                                    </>
                                )}
                            </button>
                            {socialError && <p className="text-red-600 text-sm mt-2">{socialError}</p>}
                            
                            {socialCopy && (
                                <div className="space-y-4">
                                    {Object.entries(socialCopy).map(([platform, text]) => (
                                        <div key={platform}>
                                            <label className="block text-sm font-semibold text-gray-700 capitalize mb-1">{platform}</label>
                                            <div className="relative">
                                                <textarea
                                                    readOnly
                                                    value={text}
                                                    rows={platform === 'linkedin' ? 4 : 3}
                                                    className="w-full p-2 pr-10 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-brand-orange focus:border-transparent transition text-sm"
                                                />
                                                <div className="absolute top-2 right-2">
                                                    <CopyButton textToCopy={text} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Email Campaign Section */}
                        <div>
                            <button
                                type="button"
                                onClick={handleGenerateEmails}
                                disabled={isGeneratingEmails}
                                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:bg-gray-200 mb-4"
                            >
                                {isGeneratingEmails ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating Emails...
                                    </>
                                ) : (
                                    <>
                                        <MailIcon />
                                        Generate Email Sequence
                                    </>
                                )}
                            </button>
                            {emailError && <p className="text-red-600 text-sm mt-2">{emailError}</p>}

                            {emailSequence && (
                                <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                                    <div className="flex border-b border-gray-200">
                                        {(['invitation', 'reminder', 'followUp'] as const).map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveEmailTab(tab)}
                                                className={`flex-1 py-2 text-sm font-medium capitalize ${activeEmailTab === tab ? 'bg-white text-brand-orange border-b-2 border-brand-orange' : 'text-gray-500 hover:bg-gray-100'}`}
                                            >
                                                {tab.replace(/([A-Z])/g, ' $1')}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="p-4">
                                        <div className="mb-3">
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subject Line</label>
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    readOnly 
                                                    value={emailSequence[activeEmailTab].subject} 
                                                    className="flex-grow p-2 border border-gray-300 rounded-md bg-white text-sm"
                                                />
                                                <CopyButton textToCopy={emailSequence[activeEmailTab].subject} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Body</label>
                                            <div className="relative">
                                                 <textarea 
                                                    readOnly 
                                                    value={emailSequence[activeEmailTab].body} 
                                                    rows={6}
                                                    className="w-full p-2 pr-10 border border-gray-300 rounded-md bg-white text-sm"
                                                />
                                                <div className="absolute top-2 right-2">
                                                    <CopyButton textToCopy={emailSequence[activeEmailTab].body} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
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
                        Review & Promote
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