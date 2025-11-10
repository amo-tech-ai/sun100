import React, { useState } from 'react';

// --- Icons ---
const LightbulbIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 14c.2-1 .7-1.7 1.5-2.5C17.7 10.2 18 9 18 7c0-2.2-1.8-4-4-4S10 4.8 10 7c0 2 .3 3.2 1.5 4.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>;
const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;

const steps = ["Overview", "Details", "Media", "Tickets", "Review"];

const EventWizard: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    
    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                     <div>
                        <h1 className="text-2xl font-bold font-heading mb-6">Event Overview</h1>
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="event-title" className="block text-sm font-semibold text-gray-700 mb-1">Event Title</label>
                                <input type="text" id="event-title" placeholder="e.g., AI Founders & Investors Mixer" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E87C4D]" />
                            </div>
                            <div>
                                <label htmlFor="event-description" className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                                <textarea id="event-description" rows={5} placeholder="Tell attendees about your event..." className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E87C4D]"></textarea>
                            </div>
                        </form>
                    </div>
                );
            // Add other cases for more steps here...
            default:
                return <div>Step {currentStep + 1}</div>
        }
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* --- Progress Header --- */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <React.Fragment key={step}>
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${index <= currentStep ? 'bg-[#E87C4D] border-[#E87C4D] text-white' : 'bg-white border-gray-300 text-gray-500'}`}>
                                    {index < currentStep ? '✓' : index + 1}
                                </div>
                                <p className={`mt-2 text-sm font-semibold ${index <= currentStep ? 'text-gray-800' : 'text-gray-500'}`}>{step}</p>
                            </div>
                            {index < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${index < currentStep ? 'bg-[#E87C4D]' : 'bg-gray-300'}`}></div>}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* --- Main Content --- */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* --- Form Section (2/3) --- */}
                <div className="w-full lg:w-2/3 bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-200/80">
                    {renderStepContent()}
                    <div className="flex justify-between pt-8 mt-8 border-t">
                        <button type="button" onClick={handleBack} disabled={currentStep === 0} className="bg-gray-200 text-gray-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 disabled:opacity-50">Back</button>
                        <button type="button" onClick={handleNext} className="bg-[#E87C4D] text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90">
                            {currentStep === steps.length - 1 ? 'Publish Event' : 'Next Step →'}
                        </button>
                    </div>
                </div>

                {/* --- Sidebar (1/3) --- */}
                <div className="w-full lg:w-1/3 space-y-6">
                    {/* Event Preview */}
                     <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200/80">
                        <div className="flex items-center gap-3 mb-3">
                            <EyeIcon />
                            <h3 className="font-bold text-lg">Live Preview</h3>
                        </div>
                        <div className="aspect-[4/3] bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                           <p>Your event card preview will appear here.</p>
                        </div>
                    </div>

                    {/* Pro Tips */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200/80">
                        <div className="flex items-center gap-3 mb-3">
                            <LightbulbIcon className="text-yellow-500" />
                            <h3 className="font-bold text-lg">Pro Tips</h3>
                        </div>
                        <p className="text-gray-600 text-sm">A clear and compelling event title is the most important factor for attracting attendees. Make it exciting and informative!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventWizard;
