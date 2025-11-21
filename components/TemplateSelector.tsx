
import React from 'react';
import { templates } from '../styles/templates';

interface TemplateSelectorProps {
    selectedTemplate: keyof typeof templates;
    setSelectedTemplate: (templateKey: keyof typeof templates) => void;
}

const CheckBadge = () => (
    <div className="absolute top-3 right-3 z-10 animate-scale-in">
        <div className="bg-brand-orange text-white rounded-full p-1 shadow-lg transform transition-transform scale-100 ring-2 ring-white">
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
    
    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    return { label, tag: 'Layout', color: 'bg-gray-50 text-gray-500' };
};

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplate, setSelectedTemplate }) => {
    const themeTemplates = Object.keys(templates) as string[];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <style>{`
                @keyframes scale-in {
                    from { transform: scale(0); }
                    to { transform: scale(1); }
                }
                .animate-scale-in { animation: scale-in 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
            `}</style>
            {themeTemplates.map((key) => {
                const isSelected = selectedTemplate === key;
                const meta = getThemeMeta(key);

                return (
                    <div 
                        key={key} 
                        className={`group cursor-pointer flex flex-col gap-3 transition-all duration-200 ease-out transform ${isSelected ? 'translate-y-[-4px]' : 'hover:translate-y-[-2px]'}`}
                        onClick={() => setSelectedTemplate(key)}
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={0}
                        onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') setSelectedTemplate(key) }}
                    >
                        {/* Card Container */}
                        <div className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all duration-200 bg-white ${
                            isSelected 
                                ? 'border-brand-orange shadow-xl ring-2 ring-brand-orange/20' 
                                : 'border-gray-100 shadow-sm group-hover:shadow-md group-hover:border-gray-300'
                        }`}>
                            
                            {isSelected && <CheckBadge />}

                            {/* Mini Slide Preview (Actual CSS Rendered) */}
                            <div className={`w-full h-full text-[5px] sm:text-[6px] leading-tight flex flex-col justify-center p-4 select-none ${templates[key].slide} overflow-hidden relative`}>
                                <div className={`absolute inset-0 pointer-events-none bg-white opacity-0 group-hover:opacity-5 transition-opacity`}></div>
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
                        <div className="flex justify-between items-center px-1">
                            <h3 className={`font-bold text-sm transition-colors ${isSelected ? 'text-brand-orange' : 'text-gray-700 group-hover:text-gray-900'}`}>
                                {meta.label}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${meta.color}`}>
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
    