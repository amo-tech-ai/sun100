import React from 'react';
import { templates, DeckTemplate } from '../styles/templates';

interface TemplateSelectorProps {
    selectedTemplate: keyof typeof templates;
    onSelectTemplate: (templateKey: keyof typeof templates) => void;
}

const TemplatePreview: React.FC<{ template: DeckTemplate, templateKey: string, isSelected: boolean, onSelect: () => void }> = ({ template, templateKey, isSelected, onSelect }) => {
    return (
        <button
            onClick={onSelect}
            className={`relative w-full aspect-[16/9] rounded-lg border-2 p-1.5 overflow-hidden transition-all duration-200 ${isSelected ? 'border-brand-orange ring-2 ring-brand-orange/50 shadow-lg' : 'border-gray-200 hover:border-gray-400'}`}
            aria-label={`Select ${templateKey} theme`}
            aria-pressed={isSelected}
        >
            <div className={`w-full h-full text-[4px] leading-tight flex flex-col justify-center ${template.slide}`}>
                <div className={`font-bold truncate ${template.title}`}>Title</div>
                <div className={`p-0 ${template.content}`}>
                    <li className="list-none">Bullet point 1</li>
                    <li className="list-none">Bullet point 2</li>
                </div>
            </div>
            {isSelected && (
                <div className="absolute top-1 right-1 bg-brand-orange text-white rounded-full p-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
            )}
        </button>
    );
};

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplate, onSelectTemplate }) => {
    const templateKeys = Object.keys(templates) as (keyof typeof templates)[];
    
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                {templateKeys.map(key => (
                    <div key={String(key)}>
                        <TemplatePreview
                            template={templates[key as keyof typeof templates]}
                            templateKey={String(key)}
                            isSelected={selectedTemplate === key}
                            onSelect={() => onSelectTemplate(key)}
                        />
                        <p className="text-center text-sm font-medium text-gray-600 mt-2 capitalize">{String(key).replace(/([A-Z])/g, ' $1').replace('vibrant', 'Vibrant ')}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TemplateSelector;