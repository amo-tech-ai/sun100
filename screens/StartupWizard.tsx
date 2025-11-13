import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// --- ICONS ---
const SunIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-orange" viewBox="0 0 20 20" fill="currentColor" {...props}><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM4.225 4.225a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM15.775 4.225a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zM17 10a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM8 10a2 2 0 114 0 2 2 0 01-4 0zM4.225 15.775a1 1 0 010-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zM10 17a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM14.364 14.364a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
const CheckCircle = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>;
const UploadCloudIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>;
const LightbulbIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 14c.2-1 .7-1.7 1.5-2.5C17.7 10.2 18 9 18 7c0-2.2-1.8-4-4-4S10 4.8 10 7c0 2 .3 3.2 1.5 4.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>;
const WandIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/></svg>;
const LinkedinIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
const EyeIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;

// --- FORM & UI COMPONENTS ---

const steps = [
  { id: 1, name: 'Company Basics' },
  { id: 2, name: 'Problem & Solution' },
  { id: 3, name: 'Market & Competition' },
  { id: 4, name: 'Team' },
  { id: 5, name: 'Review' },
];

const ProgressHeader: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const activeStepEl = scrollContainerRef.current?.querySelector(`[data-step-id="${currentStep}"]`);
        activeStepEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }, [currentStep]);

    return (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link to="/dashboard" className="flex items-center gap-2">
                        <SunIcon />
                        <span className="font-bold text-lg hidden sm:inline">sun ai startup</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-500 animate-pulse">Auto-saving...</span>
                        <button className="bg-brand-orange text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors">Preview</button>
                    </div>
                </div>
            </div>
            {/* Progress Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Desktop Progress Bar */}
                <div className="hidden lg:block relative pb-2">
                    <div className="absolute top-1/2 left-0 h-0.5 w-full bg-gray-200"></div>
                    <div className="absolute top-1/2 left-0 h-0.5 bg-brand-orange" style={{ width: `${progressPercentage}%` }}></div>
                    <div className="relative flex justify-between">
                        {steps.map(step => (
                            <div key={step.id} className="text-center">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto transition-colors ${step.id <= currentStep ? 'bg-brand-orange text-white' : 'bg-white border-2 border-gray-300 text-gray-400'}`}>
                                    {step.id < currentStep ? <CheckCircle className="w-4 h-4" /> : step.id}
                                </div>
                                <p className={`mt-2 text-xs font-semibold ${step.id <= currentStep ? 'text-brand-orange' : 'text-gray-500'}`}>{step.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
                 {/* Mobile Progress Chips */}
                 <div ref={scrollContainerRef} className="lg:hidden pb-4 flex space-x-4 overflow-x-auto scrollbar-hide">
                    {steps.map(step => (
                        <div key={step.id} data-step-id={step.id} className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${step.id === currentStep ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-600'}`}>
                           Step {step.id}: {step.name}
                        </div>
                    ))}
                </div>
            </div>
        </header>
    );
};

const FormCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-200">{children}</div>
);

const UploadZone: React.FC<{ title: string, description: string }> = ({ title, description }) => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-brand-orange hover:bg-orange-50/50 transition-colors">
        <UploadCloudIcon className="mx-auto h-10 w-10 text-gray-400" />
        <h4 className="mt-2 text-sm font-semibold text-brand-blue">{title}</h4>
        <p className="mt-1 text-xs text-gray-500">{description}</p>
    </div>
);

const StartupWizard: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    
    return (
        <div className="bg-gray-50 min-h-screen">
            <ProgressHeader currentStep={currentStep} />
            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <FormCard>
                             <h1 className="text-2xl font-bold text-brand-blue">Company Basics</h1>
                             <p className="text-gray-500 mt-1">Let’s start with the essential information about your company.</p>
                        </FormCard>

                        <FormCard>
                           <div className="space-y-6">
                                <div>
                                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
                                    <input type="text" id="companyName" placeholder="e.g., Sun AI Startup" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-orange focus:border-brand-orange" />
                                </div>
                                <div>
                                    <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website URL</label>
                                    <input type="url" id="website" placeholder="https://www.sunaistartup.com" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-orange focus:border-brand-orange" />
                                </div>
                                 <div>
                                    <label htmlFor="tagline" className="block text-sm font-medium text-gray-700">Company Tagline</label>
                                    <textarea id="tagline" rows={2} placeholder="e.g., Your AI-Powered Startup Hub for Growth." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-orange focus:border-brand-orange"></textarea>
                                    <p className="mt-1 text-xs text-gray-500">A short, memorable phrase. (Max 120 characters)</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <UploadZone title="Upload Logo" description="PNG, JPG, SVG up to 5MB. (400x400px recommended)" />
                                    <UploadZone title="Upload Cover Image" description="PNG, JPG up to 10MB. (1600x900px recommended)" />
                                </div>
                                <div>
                                    <label htmlFor="founded" className="block text-sm font-medium text-gray-700">Founded Year</label>
                                    <input type="number" id="founded" placeholder="2024" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-orange focus:border-brand-orange" />
                                </div>
                           </div>
                        </FormCard>
                    </div>

                    {/* Right Sidebar Column */}
                    <aside className="space-y-8 lg:sticky top-28 self-start">
                        <FormCard>
                            <h3 className="font-bold text-lg text-brand-blue mb-4">Profile Strength</h3>
                            <div className="flex items-center gap-6">
                                <div className="relative w-24 h-24">
                                    <svg className="w-full h-full" viewBox="0 0 36 36"><path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e6e6e6" strokeWidth="3" /><path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E87C4D" strokeWidth="3" strokeDasharray="30, 100" transform="rotate(-90 18 18)" /></svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-brand-orange">30%</div>
                                </div>
                                <p className="text-sm text-gray-600">Keep going! Add more details to strengthen your profile.</p>
                            </div>
                        </FormCard>
                        <FormCard>
                            <h3 className="font-bold text-lg text-brand-blue mb-4">Pro Tips</h3>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-start gap-3"><LightbulbIcon className="flex-shrink-0 mt-1 text-brand-mustard" /><span>Your tagline is your first impression. Use our AI tools to generate a few options.</span></li>
                                <li className="flex items-start gap-3"><LightbulbIcon className="flex-shrink-0 mt-1 text-brand-mustard" /><span>High-quality logos and cover images make your profile stand out to investors and talent.</span></li>
                            </ul>
                        </FormCard>
                        <FormCard>
                            <h3 className="font-bold text-lg text-brand-blue mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"><WandIcon /> Generate Pitch Deck</button>
                                <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"><LinkedinIcon /> Import from LinkedIn</button>
                                <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"><EyeIcon /> Preview Public Profile</button>
                            </div>
                        </FormCard>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default StartupWizard;
