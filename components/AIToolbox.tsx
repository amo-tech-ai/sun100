import React, { useState, useEffect } from 'react';
import AICopilot from './AICopilot';
import ImageEditorPanel from './ImageEditorPanel';
import AnalysisPanel from './AnalysisPanel';
import ResearchResultPanel from './ResearchResultPanel';
import { Slide } from '../data/decks';
import { SlideAnalysis, ResearchResult } from '../services/geminiService';

interface AIToolboxProps {
    selectedSlide: Slide;
    isUrl: (url: string | undefined) => boolean;
    isCopilotLoading: boolean;
    onCopilotGenerate: (prompt: string) => void;
    isEditingImage: boolean;
    imageError: string | null;
    onEditImage: (prompt: string) => void;
    isAnalyzing: boolean;
    analysisResult: SlideAnalysis | null;
    onAnalyzeSlide: () => void;
    isResearching: boolean;
    researchResult: ResearchResult | null;
    onResearch: (query: string) => void;
    areSuggestionsLoading: boolean;
    copilotSuggestions: string[];
    imageSuggestions: string[];
    researchSuggestions: string[];
}

type AITab = 'copilot' | 'image' | 'analysis' | 'research';

const AIToolbox: React.FC<AIToolboxProps> = (props) => {
    const [activeTab, setActiveTab] = useState<AITab>('copilot');

    const showImageTab = props.selectedSlide.imageUrl && props.isUrl(props.selectedSlide.imageUrl);

    useEffect(() => {
        // If the image tab was active but is now hidden, switch to copilot
        if (activeTab === 'image' && !showImageTab) {
            setActiveTab('copilot');
        }
    }, [activeTab, showImageTab]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'copilot':
                return <AICopilot 
                    isLoading={props.isCopilotLoading} 
                    onGenerate={props.onCopilotGenerate}
                    suggestions={props.copilotSuggestions}
                    areSuggestionsLoading={props.areSuggestionsLoading}
                />;
            case 'image':
                return showImageTab ? <ImageEditorPanel 
                    onEdit={props.onEditImage} 
                    isLoading={props.isEditingImage} 
                    error={props.imageError} 
                    suggestions={props.imageSuggestions}
                    areSuggestionsLoading={props.areSuggestionsLoading}
                /> : null;
            case 'analysis':
                return <AnalysisPanel onAnalyze={props.onAnalyzeSlide} isLoading={props.isAnalyzing} analysis={props.analysisResult} />;
            case 'research':
                return <ResearchResultPanel 
                    onResearch={props.onResearch} 
                    isLoading={props.isResearching} 
                    result={props.researchResult} 
                    suggestions={props.researchSuggestions}
                    areSuggestionsLoading={props.areSuggestionsLoading}
                />;
            default:
                return null;
        }
    };
    
    const getTabClass = (tabName: AITab) => {
        return `py-2 px-4 font-medium text-sm cursor-pointer border-b-2 transition-colors ${
            activeTab === tabName
                ? 'border-[#E87C4D] text-[#E87C4D]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
        }`;
    };

    return (
        <div className="w-full mt-8 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex border-b border-gray-200 px-2">
                <button onClick={() => setActiveTab('copilot')} className={getTabClass('copilot')}>Copilot</button>
                {showImageTab && <button onClick={() => setActiveTab('image')} className={getTabClass('image')}>Image</button>}
                <button onClick={() => setActiveTab('analysis')} className={getTabClass('analysis')}>Analysis</button>
                <button onClick={() => setActiveTab('research')} className={getTabClass('research')}>Research</button>
            </div>
            <div>
                {renderTabContent()}
            </div>
        </div>
    );
};

export default AIToolbox;
