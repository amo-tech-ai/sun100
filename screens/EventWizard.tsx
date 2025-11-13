
import React, { useState } from 'react';
import { generateEventDescription } from '../services/geminiService';

const WandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/></svg>
);

const EventWizard: React.FC = () => {
    const [step, setStep] = useState(1);
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const totalSteps = 2;

    const handleGenerateDescription = async () => {
        setIsGenerating(true);
        setError(null);
        try {
            const result = await generateEventDescription({
                title: eventName,
                date: eventDate,
                location: location
            });
            setDescription(result.description);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate description.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-md max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">Create a New Event</h1>
            <p className="text-gray-500 mb-6">Step {step} of {totalSteps}</p>

            {step === 1 && (
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Event Details</h2>
                    <div>
                        <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">Event Name</label>
                        <input type="text" id="eventName" value={eventName} onChange={e => setEventName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E87C4D] focus:border-[#E87C4D]" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">Date & Time</label>
                            <input type="datetime-local" id="eventDate" value={eventDate} onChange={e => setEventDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E87C4D] focus:border-[#E87C4D]" />
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                            <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g., Virtual or a physical address" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E87C4D] focus:border-[#E87C4D]" />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                             <label htmlFor="eventDescription" className="block text-sm font-medium text-gray-700">Description</label>
                             <button 
                                type="button" 
                                onClick={handleGenerateDescription}
                                disabled={!eventName || !eventDate || !location || isGenerating}
                                className="flex items-center gap-2 text-sm font-semibold text-[#E87C4D] hover:text-opacity-80 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                             >
                                {isGenerating ? (
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
                        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
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
