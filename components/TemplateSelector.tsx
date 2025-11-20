
import React from 'react';
import { templates } from '../styles/templates';

interface TemplateSelectorProps {
    selectedTemplate: keyof typeof templates;
    setSelectedTemplate: (templateKey: keyof typeof templates) => void;
}

const CheckBadge = () => (
    <div className="absolute top-3 right-3 z-10 animate-fade-in-up">
        <div className="bg-brand-orange text-white rounded-full p-1.5 shadow-lg transform transition-transform scale-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
        </div>
    </div>
);

const getThemeMeta = (key: string) => {
    // Map internal keys to pretty names and category tags
    const meta: Record<string, { label: string; tag: string; color: string }> = {
        default: { label: 'Classic Clean', tag: 'Universal', color: 'bg-gray-100 text-gray-600' },
        professional: { label: 'Enterprise Pro', tag: 'Corporate', color: 'bg-slate-100 text-slate-600' },
        minimalist: { label: 'Modern Minimal', tag: 'SaaS', color: 'bg-gray-100 text-gray-600' },
        startup: { label: 'Dark Mode', tag: 'Tech', color: 'bg-indigo-100 text-indigo-600' },
        vibrantCover: { label: 'Vibrant Bold', tag: 'Consumer', color: 'bg-purple-100 text-purple-600' },
        vibrantVision: { label: 'Vibrant Vision', tag: 'Creative', color: 'bg-purple-100 text-purple-600' },
        vibrantProblem: { label: 'Vibrant Impact', tag: 'Creative', color: 'bg-purple-100 text-purple-600' },
        vibrantSolutions: { label: 'Vibrant Features', tag: 'Creative', color: 'bg-purple-100 text-purple-600' },
        vibrantTimeline: { label: 'Vibrant Journey', tag: 'Creative', color: 'bg-purple-100 text-purple-600' },
    };
    
    if (meta[key]) return meta[key];
    
    // Fallback formatting
    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    return { label, tag: 'Layout', color: 'bg-gray-50 text-gray-500' };
};

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplate, setSelectedTemplate }) => {
    // Fixed: Explicitly type as string[] to satisfy getThemeMeta(string) parameter
    // while maintaining compatibility with setSelectedTemplate which accepts string | number via index signature
    const themeTemplates = Object.keys(templates) as string[];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {themeTemplates.map((key) => {
                const isSelected = selectedTemplate === key;
                const meta = getThemeMeta(key);

                return (
                    <div 
                        key={key} 
                        className={`group cursor-pointer flex flex-col gap-4 transition-all duration-300 ease-out transform ${isSelected ? 'scale-[1.02]' : 'hover:-translate-y-1 hover:scale-[1.01]'}`}
                        onClick={() => setSelectedTemplate(key)}
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={0}
                        onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') setSelectedTemplate(key) }}
                    >
                        {/* Card Container */}
                        <div className={`relative aspect-video rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                            isSelected 
                                ? 'border-brand-orange shadow-xl ring-4 ring-brand-orange/20' 
                                : 'border-transparent shadow-md group-hover:shadow-xl group-hover:border-gray-200'
                        }`}>
                            
                            {/* Selection Badge */}
                            {isSelected && <CheckBadge />}

                            {/* Hover Overlay */}
                            <div className={`absolute inset-0 bg-black/0 transition-colors duration-300 ${isSelected ? 'bg-black/0' : 'group-hover:bg-black/5'} z-10 pointer-events-none`} />

                            {/* Mini Slide Preview (Actual CSS Rendered) */}
                            <div className={`w-full h-full text-[5px] sm:text-[6px] leading-tight flex flex-col justify-center p-4 select-none bg-white ${templates[key].slide}`}>
                                <div className={`font-bold truncate mb-2 ${templates[key].title}`}>
                                    {meta.label}
                                </div>
                                <div className={`p-0 opacity-80 ${templates[key].content}`}>
                                    <div className="h-1.5 w-3/4 bg-current opacity-20 rounded-full mb-1.5"></div>
                                    <div className="h-1.5 w-1/2 bg-current opacity-20 rounded-full mb-1.5"></div>
                                    <div className="h-1.5 w-2/3 bg-current opacity-20 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Label & Meta */}
                        <div className="flex justify-between items-start px-1">
                            <div>
                                <h3 className={`font-bold text-lg transition-colors ${isSelected ? 'text-brand-orange' : 'text-gray-800 group-hover:text-brand-blue'}`}>
                                    {meta.label}
                                </h3>
                                <p className="text-xs text-gray-500 font-medium mt-0.5">
                                    Best for <span className="lowercase">{meta.tag}</span> pitches
                                </p>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${meta.color}`}>
                                {meta.tag}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TemplateSelector;
