
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateFullDeck } from '../services/ai/deck';
import { createDeck } from '../services/deckService';
import { useAuth } from '../hooks/useAuth';

const GeneratingScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { generationPayload } = location.state || {};
    const { user } = useAuth();
    
    const [dots, setDots] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Check if deep reasoning is enabled to show specific messaging
    const isDeepReasoning = generationPayload?.config?.thinking_level === 'high';

    useEffect(() => {
        const dotsInterval = setInterval(() => {
            setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
        }, 500);

        if (!user || user.id === 'mock-user-id') {
            // Allow generation in review mode for testing/demo purposes
            // In production, you might uncomment the error below
            // setError("You must be logged in to create a deck. Please log in and try again.");
            // clearInterval(dotsInterval);
            // return;
        }

        if (!generationPayload || (!generationPayload.businessContext && generationPayload.urls.length === 0)) {
            setError("No generation context provided. Please go back and start the wizard again.");
            clearInterval(dotsInterval);
            return;
        }

        const performGeneration = async () => {
            try {
                // 1. Generate the deck content using the AI service.
                const generatedDeckData = await generateFullDeck(generationPayload);
                
                // 2. Persist the new deck to the database.
                // If user is mock, we use a placeholder ID logic inside createDeck or fallback
                const newDeck = await createDeck(generatedDeckData, user?.id || 'mock-user-id');

                // 3. Save to sessionStorage as a fallback and for the editor to pick up immediately.
                sessionStorage.setItem('newlyGeneratedDeck', JSON.stringify(newDeck));

                // 4. Navigate to the editor with the new database ID.
                navigate(`/pitch-decks/${newDeck.id}/edit`);

            } catch (err) {
                console.error("Deck generation failed:", err);
                // Improved error handling to show a more useful message.
                const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during generation.";
                setError(errorMessage);
            }
        };

        const timeoutId = setTimeout(performGeneration, 1000); // Give a moment for the UI to render

        // Cleanup function
        return () => {
            clearInterval(dotsInterval);
            clearTimeout(timeoutId);
        };
    }, [generationPayload, navigate, user]);

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
            <div className="bg-white p-12 rounded-lg shadow-xl text-center max-w-md">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#E87C4D] mx-auto mb-6"></div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Generating Your Pitch Deck{dots}
                </h1>
                <p className="text-gray-600 mb-4">
                    Our AI is crafting your story. This might take a moment.
                </p>
                
                {isDeepReasoning && (
                    <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-lg text-sm text-indigo-800 flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M9 13a3 3 0 1 1 5.997.129 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 9a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 18 18Z"/><path d="M12 5v13"/><path d="M9 13h6"/><path d="M12 18h6"/>
                        </svg>
                        <span>Gemini 3 is <strong>thinking deeply</strong> about your strategy...</span>
                    </div>
                )}

                <p className="text-xs text-gray-500 mt-6">(We'll redirect you automatically when it's ready)</p>
            </div>
        </div>
    );
};

export default GeneratingScreen;
