
import React, { useState } from 'react';
import AICopilot from './AICopilot';
import ImageEditorPanel from './ImageEditorPanel';
import AnalysisPanel from './AnalysisPanel';
import ResearchResultPanel from './ResearchResultPanel';
import { useDeckEditor } from '../contexts/DeckEditorContext';

// Exporting the type so RightSidebar can use it
export type AITab = 'copilot' | 'image' | 'analysis' | 'research' | 'sync';

interface AIToolboxProps {
    activeTab: AITab;
}

const SyncPanel: React.FC = () => {
    const { handleCheckForUpdates, isSyncing, syncSuggestions, syncError, handleApplyUpdate } = useDeckEditor();
    const [url, setUrl] = useState('');
    
    return (
        <div className="p-4 h-full overflow-y-auto">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Website → Deck Sync</h3>
                <p className="text-sm text-gray-600 mb-4">Compare your deck against your live website to detect outdated information like pricing or features.</p>
                
                <div className="flex gap-2 mb-4">
                    <input 
                        type="url" 
                        placeholder="https://yourstartup.com" 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="flex-grow p-2 border border-gray-300 rounded-md text-sm"
                    />
                    <button 
                        onClick={() => handleCheckForUpdates(url)}
                        disabled={isSyncing || !url}
                        className="bg-[#E87C4D] text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-400"
                    >
                        {isSyncing ? 'Checking...' : 'Check'}
                    </button>
                </div>

                {syncError && <p className="text-red-600 text-sm mb-2">{syncError}</p>}

                {syncSuggestions.length > 0 ? (
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-500 uppercase">Updates Detected</h4>
                        {syncSuggestions.map((suggestion, i) => (
                            <div key={i} className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-semibold text-brand-blue bg-blue-50 px-2 py-1 rounded">{suggestion.slideTitle}</span>
                                    <button 
                                        onClick={() => handleApplyUpdate(suggestion)}
                                        className="text-xs bg-green-100 text-green-700 font-bold px-2 py-1 rounded hover:bg-green-200"
                                    >
                                        Apply
                                    </button>
                                </div>
                                <p className="text-sm text-gray-600 mb-1"><span className="font-semibold text-red-500">Old:</span> {suggestion.currentValue}</p>
                                <p className="text-sm text-gray-800 mb-2"><span className="font-semibold text-green-500">New:</span> {suggestion.newValue}</p>
                                <p className="text-xs text-gray-500 italic">Reason: {suggestion.reason}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    !isSyncing && <p className="text-sm text-gray-500 text-center italic">Enter a URL to check for updates.</p>
                )}
            </div>
        </div>
    );
};

const AIToolbox: React.FC<AIToolboxProps> = ({ activeTab }) => {
    const { selectedSlide } = useDeckEditor();

    const renderTabContent = () => {
        switch (activeTab) {
            case 'copilot':
                return <AICopilot />;
            case 'image':
                return <ImageEditorPanel />;
            case 'analysis':
                return <AnalysisPanel />;
            case 'research':
                return <ResearchResultPanel />;
            case 'sync':
                return <SyncPanel />;
            default:
                return null;
        }
    };
    
    return (
        <div className="w-full h-full bg-white flex flex-col">
            {/* Content Area - No internal tabs anymore */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default React.memo(AIToolbox);
