
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateFullDeck } from '../services/ai/deck';
import { useAuth } from '../hooks/useAuth';
import { useTypewriter } from '../hooks/useTypewriter';

// Icons for different AI states
const BrainIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M9 13a3 3 0 1 1 5.997.129 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 9a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 18 18Z"/><path d="M12 5v13"/><path d="M9 13h6"/><path d="M12 18h6"/></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const PenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>;

const TypewriterStatus: React.FC<{ message: string }> = ({ message }) => {
    const { displayedText } = useTypewriter(message, { speed: 20 });
    return <p className="text-gray-600 mb-8 h-6 transition-all duration-300">{displayedText}</p>;
}

const GeneratingScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { generationPayload } = location.state || {};
    const { user } = useAuth();
    
    const [error, setError] = useState<string | null>(null);
    
    // Detailed AI Status State
    const [aiState, setAiState] = useState<'thinking' | 'searching' | 'drafting'>('thinking');
    const [statusMessage, setStatusMessage] = useState("Analyzing your business model...");

    // Check if deep reasoning is enabled (default to true if not specified for better UX demo)
    const isDeepReasoning = generationPayload?.config?.thinking_level === 'high' || true;

    useEffect(() => {
        if (!user || user.id === 'mock-user-id') {
            // Allow generation in review mode
        }

        if (!generationPayload || (!generationPayload.businessContext && generationPayload.urls.length === 0)) {
            setError("No generation context provided. Please go back and start the wizard again.");
            return;
        }

        // Simulate the Gemini 3 Thinking Process visually
        const statusSequence = async () => {
            if (isDeepReasoning) {
                setAiState('thinking');
                setStatusMessage("Gemini 3 is reasoning about your strategy...");
                await new Promise(r => setTimeout(r, 2500));
                
                setAiState('searching');
                setStatusMessage("Checking Google Search for market data...");
                await new Promise(r => setTimeout(r, 2000));
            }
            
            setAiState('drafting');
            setStatusMessage("Constructing your 10-slide deck on the secure backend...");
        };

        const performGeneration = async () => {
            try {
                // Start visual sequence
                statusSequence();

                // 1. Call the Backend to Generate & Persist the Deck
                // The Edge Function handles Gemini interaction and database insertion.
                const result = await generateFullDeck(generationPayload);
                
                if (!result || !result.deckId) {
                    throw new Error("Failed to retrieve deck ID from backend.");
                }

                // 2. Navigate
                // The DeckEditor will fetch the persisted deck using getDeckById
                navigate(`/pitch-decks/${result.deckId}/edit`);

            } catch (err) {
                console.error("Deck generation failed:", err);
                const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during generation.";
                setError(errorMessage);
            }
        };

        // Small delay to ensure UI renders before heavy lifting
        const timeoutId = setTimeout(performGeneration, 100);

        return () => clearTimeout(timeoutId);
    }, [generationPayload, navigate, user, isDeepReasoning]);

    if (error) {
        return (
             <div className="flex flex-col items-center justify-center h-full">
                <div className="bg-white p-12 rounded-lg shadow-xl text-center max-w-lg">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Generation Failed</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                        onClick={() => navigate('/pitch-decks/new')}
                        className="bg-[#E87C4D] text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="bg-white p-12 rounded-lg shadow-xl text-center max-w-md w-full transition-all duration-500">
                
                {/* Dynamic Icon Based on State */}
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-gray-50 rounded-full border-2 border-gray-100">
                    {aiState === 'thinking' && <BrainIcon />}
                    {aiState === 'searching' && <SearchIcon />}
                    {aiState === 'drafting' && <PenIcon />}
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    {aiState === 'thinking' ? 'Strategic Reasoning' : 
                     aiState === 'searching' ? 'Market Research' : 
                     'Drafting Content'}
                </h1>
                
                {/* Typewriter Effect for Status Message */}
                <TypewriterStatus message={statusMessage} />
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
                    <div 
                        className="bg-brand-orange h-2 rounded-full transition-all duration-[3000ms] ease-out"
                        style={{ 
                            width: aiState === 'thinking' ? '30%' : 
                                   aiState === 'searching' ? '60%' : '95%' 
                        }}
                    ></div>
                </div>

                {isDeepReasoning && (
                    <div className="mt-6 bg-indigo-50 border border-indigo-100 p-3 rounded-lg text-xs text-indigo-800 flex items-center justify-center gap-2">
                        <span className="font-bold">Gemini 3 Pro</span>
                        <span className="w-1 h-1 bg-indigo-300 rounded-full"></span>
                        <span>High Reasoning Active</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GeneratingScreen;
