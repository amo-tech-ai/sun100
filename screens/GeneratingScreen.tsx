import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateDeckContent, generateDeckFromUrls, DeckGenerationResult } from '../services/geminiService';

const GeneratingScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { companyDetails, urls } = location.state || {};
    
    const [dots, setDots] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
        }, 500);

        const generateDeck = async () => {
            const hasUrls = urls && Array.isArray(urls) && urls.length > 0;
            const hasDetails = companyDetails && typeof companyDetails === 'string' && companyDetails.trim().length > 0;

            if (!hasUrls && !hasDetails) {
                setError("No company details or URLs provided. Please go back and fill out the wizard.");
                return;
            }

            try {
                let deckData: DeckGenerationResult;

                if (hasUrls) {
                    deckData = await generateDeckFromUrls(urls);
                } else {
                    deckData = await generateDeckContent(companyDetails);
                }
                
                // Construct a Deck object compatible with the editor
                const newDeck = {
                    id: `deck-${Date.now()}`,
                    title: deckData.title,
                    template: 'default', // default template for now
                    slides: deckData.slides,
                };

                // Persist the generated deck to session storage to prevent data loss on refresh
                sessionStorage.setItem(`deck-${newDeck.id}`, JSON.stringify(newDeck));
                
                navigate(`/dashboard/decks/${newDeck.id}/edit`, { state: { generatedDeck: newDeck } });
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred.");
            }
        };
        
        generateDeck();

        return () => {
            clearInterval(interval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (error) {
        return (
             <div className="flex flex-col items-center justify-center h-full">
                <div className="bg-white p-12 rounded-lg shadow-xl text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Generation Failed</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                        onClick={() => navigate('/pitch-deck')}
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
            </div>
        </div>
    );
};

export default GeneratingScreen;