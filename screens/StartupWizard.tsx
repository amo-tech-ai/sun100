import React, { useState } from 'react';

// --- Icons ---
const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>;
const LightbulbIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 14c.2-1 .7-1.7 1.5-2.5C17.7 10.2 18 9 18 7c0-2.2-1.8-4-4-4S10 4.8 10 7c0 2 .3 3.2 1.5 4.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>;
const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>;
const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>;
const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;

const steps = ["Company Basics", "About", "Traction", "Team", "What You Need"];

const StartupWizard: React.FC = () => {
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
                    <>
                        <h1 className="text-2xl font-bold font-heading mb-6">Company Basics</h1>
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="startup-name" className="block text-sm font-semibold text-gray-700 mb-1">Startup Name</label>
                                <input type="text" id="startup-name" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E87C4D]" />
                            </div>
                            <div>
                                <label htmlFor="website-url" className="block text-sm font-semibold text-gray-700 mb-1">Website URL</label>
                                <input type="url" id="website-url" placeholder="https://" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E87C4D]" />
                            </div>
                            <div>
                                <label htmlFor="tagline" className="block text-sm font-semibold text-gray-700 mb-1">Tagline</label>
                                <input type="text" id="tagline" placeholder="e.g., The best AI pitch deck generator for founders." className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E87C4D]" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Logo Upload</label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="text-sm text-gray-600">Drag & drop or click to upload</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Cover Image Upload</label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="text-sm text-gray-600">Recommended: 1200x630</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="year-founded" className="block text-sm font-semibold text-gray-700 mb-1">Year Founded</label>
                                <input type="number" id="year-founded" min="1980" max={new Date().getFullYear()} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E87C4D]" />
                            </div>
                        </form>
                    </>
                );
            case 1:
                return <div><h1 className="text-2xl font-bold font-heading mb-6">About</h1><p>About form fields go here...</p></div>;
            case 2:
                return <div><h1 className="text-2xl font-bold font-heading mb-6">Traction</h1><p>Traction form fields go here...</p></div>;
            case 3:
                return <div><h1 className="text-2xl font-bold font-heading mb-6">Team</h1><p>Team form fields go here...</p></div>;
            case 4:
                return <div><h1 className="text-2xl font-bold font-heading mb-6">What You Need</h1><p>Needs form fields go here...</p></div>;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* --- Progress Header --- */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <React.Fragment key={step}>
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors duration-300 ${index <= currentStep ? 'bg-[#E87C4D] border-[#E87C4D] text-white' : 'bg-white border-gray-300 text-gray-500'}`}>
                                    {index < currentStep ? '✓' : index + 1}
                                </div>
                                <p className={`mt-2 text-sm font-semibold transition-colors duration-300 ${index <= currentStep ? 'text-gray-800' : 'text-gray-500'}`}>{step}</p>
                            </div>
                            {index < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 transition-colors duration-300 ${index < currentStep ? 'bg-[#E87C4D]' : 'bg-gray-300'}`}></div>}
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
                        <button type="button" onClick={handleBack} disabled={currentStep === 0} className="bg-gray-200 text-gray-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                            Back
                        </button>
                        <button type="button" onClick={handleNext} className="bg-[#E87C4D] text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90">
                            {currentStep === steps.length - 1 ? 'Finish & Publish' : 'Next Step →'}
                        </button>
                    </div>
                </div>

                {/* --- Sidebar (1/3) --- */}
                <div className="w-full lg:w-1/3 space-y-6">
                    {/* Profile Strength */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200/80 text-center">
                        <h3 className="font-bold text-lg mb-4">Profile Strength</h3>
                        <div className="relative w-32 h-32 mx-auto">
                            <svg className="w-full h-full" viewBox="0 0 36 36" transform="rotate(-90)">
                                <path className="text-gray-200" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                                <path 
                                    className="text-[#E87C4D] transition-all duration-500" 
                                    strokeWidth="3" 
                                    strokeDasharray={`${(currentStep + 1) / steps.length * 100}, 100`} 
                                    fill="none" 
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                ></path>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">{Math.round((currentStep + 1) / steps.length * 100)}%</div>
                        </div>
                        <p className="text-sm text-gray-500 mt-4">Complete your profile to attract more investors.</p>
                    </div>

                    {/* Pro Tips */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200/80">
                        <div className="flex items-center gap-3 mb-3">
                            <LightbulbIcon className="text-yellow-500" />
                            <h3 className="font-bold text-lg">Pro Tips</h3>
                        </div>
                        <p className="text-gray-600 text-sm">A strong tagline clearly states your value proposition in a single sentence. Keep it concise and memorable.</p>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200/80">
                        <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                        <ul className="space-y-3">
                            <li><button className="flex items-center gap-3 text-gray-700 hover:text-[#E87C4D] font-semibold"><SparklesIcon className="w-5 h-5" /> Generate Deck from Profile</button></li>
                            <li><button className="flex items-center gap-3 text-gray-700 hover:text-[#E87C4D] font-semibold"><LinkedinIcon /> Import from LinkedIn</button></li>
                            <li><button className="flex items-center gap-3 text-gray-700 hover:text-[#E87C4D] font-semibold"><EyeIcon /> Preview Public Profile</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartupWizard;