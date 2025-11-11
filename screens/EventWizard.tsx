import React, { useState } from 'react';

const EventWizard: React.FC = () => {
    const [step, setStep] = useState(1);
    const totalSteps = 3;

    return (
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-md max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">Create a New Event</h1>
            <p className="text-gray-500 mb-6">Step {step} of {totalSteps}</p>

            {step === 1 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Event Details</h2>
                    <div>
                        <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">Event Name</label>
                        <input type="text" id="eventName" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E87C4D] focus:border-[#E87C4D]" />
                    </div>
                    <div>
                        <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">Date & Time</label>
                        <input type="datetime-local" id="eventDate" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E87C4D] focus:border-[#E87C4D]" />
                    </div>
                </div>
            )}

            {step === 2 && (
                 <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Location & Tickets</h2>
                     <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                        <input type="text" id="location" placeholder="e.g., Virtual or a physical address" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E87C4D] focus:border-[#E87C4D]" />
                    </div>
                </div>
            )}
            
            {step === 3 && (
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
