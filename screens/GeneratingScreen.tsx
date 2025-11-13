import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateFullDeck } from '../services/aiService';
import { createDeck } from '../services/deckService';
import { useAuth } from '../hooks/useAuth';

const GeneratingScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { textContext, urlContext, template } = location.state || {};
    const { user } = useAuth();
    
    const [dots, setDots] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const dotsInterval = setInterval(() => {
            setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
        }, 500);

        const hasText = textContext && textContext.trim().length > 0;
        const hasUrls = urlContext && urlContext.length > 0;

        if (!hasText && !hasUrls) {
            setError("No generation context provided. Please go back and start the wizard again.");
            clearInterval(dotsInterval);
            return;
        }

        if (!user) {
            setError("You must be logged in to create a deck. Please log in and try again.");
            clearInterval(dotsInterval);
            return;
        }

        const performGeneration = async () => {
            try {
                // 1. Generate the deck structure with AI, now with theme context
                const generatedDeckData = await generateFullDeck({ text: textContext, urls: urlContext, template });
                
                // 2. Persist the new deck to the database
                const newDeck = await createDeck(generatedDeckData, user.id);

                // 3. Navigate to the editor with the new database ID
                navigate(`/pitch-decks/${newDeck.id}/edit`);

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
    }, [textContext, urlContext, template, navigate, user]);

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