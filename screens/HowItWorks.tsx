import React from 'react';
import { Link } from 'react-router-dom';

const StepIcon: React.FC<{ icon: React.ReactNode; title: string; description: string; step: number; }> = ({ icon, title, description, step }) => (
    <div className="flex items-start">
        <div className="flex-shrink-0 flex flex-col items-center mr-6">
            <div className="w-16 h-16 rounded-full bg-orange-100 text-[#E87C4D] flex items-center justify-center">
                {icon}
            </div>
            {step < 3 && <div className="w-px h-24 bg-gray-300 mt-4"></div>}
        </div>
        <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{step}. {title}</h3>
            <p className="text-gray-600 text-lg">{description}</p>
        </div>
    </div>
);

const HowItWorks: React.FC = () => {
    return (
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-md">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800">How It Works</h1>
                <p className="text-xl text-gray-600 mt-4">Transform your idea into a professional pitch deck in three simple steps.</p>
            </div>

            <div className="space-y-8">
                <StepIcon
                    step={1}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z"/></svg>}
                    title="Provide Context"
                    description="Start by giving our AI the raw material. You can provide a brief business plan, paste in your website URLs, or simply describe your company. The more detail you provide, the more tailored your deck will be."
                />
                <StepIcon
                    step={2}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>}
                    title="AI Generates Your Draft"
                    description="Our intelligent agents analyze your input, identify key themes, and structure a compelling narrative. In seconds, a complete 10-slide pitch deck is generated, complete with titles, content, and suggestions for powerful visuals."
                />
                <StepIcon
                    step={3}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>}
                    title="Refine & Present"
                    description="Dive into our interactive editor. Use the AI Copilot to rewrite content, generate stunning images with a click, and analyze your slide's impact. When you're ready, enter our distraction-free presentation mode and share your vision with the world."
                />
            </div>
            <div className="text-center mt-16">
                 <Link
                    to="/dashboard"
                    className="inline-block bg-[#E87C4D] text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-opacity-90 transition-colors duration-200 shadow-xl"
                >
                    Get Started Now
                </Link>
            </div>
        </div>
    );
};

export default HowItWorks;