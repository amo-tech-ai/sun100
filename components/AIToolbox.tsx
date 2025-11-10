import React, { useState, useEffect } from 'react';
import AICopilot from './AICopilot';
import ImageEditorPanel from './ImageEditorPanel';
import AnalysisPanel from './AnalysisPanel';
import ResearchResultPanel from './ResearchResultPanel';
import { useDeckEditor } from '../screens/DeckEditor';

type AITab = 'copilot' | 'image' | 'analysis' | 'research';

const AIToolbox: React.FC = () => {
    const { selectedSlide } = useDeckEditor();
    const [activeTab, setActiveTab] = useState<AITab>('copilot');

    const isUrl = (url: string | undefined): boolean => !!url && (url.startsWith('http') || url.startsWith('data:image'));
    const showImageTab = selectedSlide && isUrl(selectedSlide.imageUrl);

    useEffect(() => {
        if (activeTab === 'image' && !showImageTab) {
            setActiveTab('copilot');
        }
    }, [activeTab, showImageTab]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'copilot':
                return <AICopilot />;
            case 'image':
                return showImageTab ? <ImageEditorPanel /> : null;
            case 'analysis':
                return <AnalysisPanel />;
            case 'research':
                return <ResearchResultPanel />;
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

export default React.memo(AIToolbox);