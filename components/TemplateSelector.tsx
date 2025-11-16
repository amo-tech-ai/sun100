import React from 'react';
import { templates } from '../styles/templates';

interface TemplateSelectorProps {
    selectedTemplate: keyof typeof templates;
    setSelectedTemplate: (templateKey: keyof typeof templates) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplate, setSelectedTemplate }) => {
    const themeTemplates = Object.keys(templates) as (keyof typeof templates)[];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {themeTemplates.map((key) => (
                 <div key={key} className="group cursor-pointer relative" onClick={() => setSelectedTemplate(key)}>
                    <div className={`aspect-[16/9] w-full rounded-lg border-2 transition-all duration-200 ${selectedTemplate === key ? 'border-brand-orange shadow-md' : 'border-gray-300 hover:border-brand-orange/50'}`}>
                        <div className={`w-full h-full text-[4px] leading-tight flex flex-col justify-center p-1.5 ${templates[key].slide}`}>
                            <div className={`font-bold truncate ${templates[key].title}`}>Title</div>
                            <div className={`p-0 ${templates[key].content}`}>
                                <li className="list-none">Bullet point</li>
                            </div>
                        </div>
                    </div>
                    {selectedTemplate === key && (
                        <div className="absolute top-2 right-2 bg-brand-orange rounded-full h-5 w-5 flex items-center justify-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        </div>
                    )}
                    <p className="mt-2 text-center text-sm font-medium text-gray-700 capitalize">{String(key).replace(/([A-Z])/g, ' $1').replace('vibrant', 'Vibrant ')}</p>
                </div>
            ))}
        </div>
    );
};

export default TemplateSelector;
