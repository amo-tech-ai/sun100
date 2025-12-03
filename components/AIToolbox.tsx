
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

const AdvancedResearchButtons: React.FC = () => {
    const { 
        handleFetchMarketData, 
        isGeneratingMarketData, 
        marketDataError,
        handleFetchTrends,
        isGeneratingTrends,
        trendsError,
        selectedSlide,
        handleGenerateCompetitorMatrix,
        isGeneratingTable,
        tableError
    } = useDeckEditor();

    if (!selectedSlide) return null;

    const showMarket = selectedSlide.type === 'market';
    const showTrends = selectedSlide.type === 'vision' || selectedSlide.title.toLowerCase().includes('trends');
    const showCompetition = selectedSlide.type === 'competition';

    if (!showMarket && !showTrends && !showCompetition) return null;

    return (
        <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Smart Auto-Fill</h4>
            <div className="space-y-2">
                {showMarket && (
                    <button 
                        onClick={handleFetchMarketData} 
                        disabled={isGeneratingMarketData}
                        className="w-full text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                        {isGeneratingMarketData ? (
                            <>
                                <span className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full"></span>
                                Searching...
                            </>
                        ) : 'Generate TAM/SAM/SOM (Real-Time)'}
                    </button>
                )}
                {showTrends && (
                    <button 
                        onClick={handleFetchTrends} 
                        disabled={isGeneratingTrends}
                        className="w-full text-left px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                         {isGeneratingTrends ? (
                            <>
                                <span className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full"></span>
                                Searching...
                            </>
                        ) : 'Generate Industry Trends'}
                    </button>
                )}
                {showCompetition && (
                    <button 
                        onClick={handleGenerateCompetitorMatrix} 
                        disabled={isGeneratingTable}
                        className="w-full text-left px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                        {isGeneratingTable ? (
                            <>
                                <span className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full"></span>
                                Comparing...
                            </>
                        ) : 'Generate Competitor Matrix'}
                    </button>
                )}
            </div>
            {marketDataError && <p className="text-red-500 text-xs mt-1">{marketDataError}</p>}
            {trendsError && <p className="text-red-500 text-xs mt-1">{trendsError}</p>}
            {tableError && <p className="text-red-500 text-xs mt-1">{tableError}</p>}
        </div>
    );
};


const AIToolbox: React.FC<AIToolboxProps> = ({ activeTab }) => {
    const { selectedSlide } = useDeckEditor();

    const renderTabContent = () => {
        switch (activeTab) {
            case 'copilot':
                return (
                    <>
                        <AICopilot />
                        <AdvancedResearchButtons />
                    </>
                );
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