import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateFullDeck } from '../services/aiService';

const GeneratingScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { mode, content } = location.state || {};
    
    const [dots, setDots] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const dotsInterval = setInterval(() => {
            setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
        }, 500);

        if (!mode || !content || (Array.isArray(content) && content.length === 0)) {
            setError("No generation context provided. Please go back and start the wizard again.");
            clearInterval(dotsInterval);
            return;
        }

        const performGeneration = async () => {
            try {
                // This new service function does the full AI call and returns a complete Deck object
                const generatedDeck = await generateFullDeck({ mode, content });
                
                // Save the full deck to session storage for persistence across reloads
                sessionStorage.setItem(`deck-${generatedDeck.id}`, JSON.stringify(generatedDeck));

                // Navigate to the editor for the new deck
                navigate(`/pitch-decks/${generatedDeck.id}/edit`);

            } catch (err) {
                console.error("Deck generation failed:", err);
                setError(err instanceof Error ? err.message : "An unknown error occurred during generation.");
            }
        };

        performGeneration();

        // Cleanup function
        return () => {
            clearInterval(dotsInterval);
        };
    }, [mode, content, navigate]);

    if (error) {
        return (
             <div className="flex flex-col items-center justify-center h-full">
                <div className="bg-white p-12 rounded-lg shadow-xl text-center">
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
            <div className="bg-white p-12 rounded-lg shadow-xl text-center">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#E87C4D] mx-auto mb-6"></div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Generating Your Pitch Deck{dots}
                </h1>
                <p className="text-gray-600">
                    Our AI is crafting your story. This might take a moment.
                </p>
                <p className="text-sm text-gray-500 mt-2">(We'll redirect you automatically when it's ready)</p>
            </div>
        </div>
    );
};

export default GeneratingScreen;
