import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const GeneratingScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { deckId } = location.state || {};
    
    const [dots, setDots] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const dotsInterval = setInterval(() => {
            setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
        }, 500);

        if (!deckId) {
            setError("No deck ID provided. Please go back and start the wizard again.");
            clearInterval(dotsInterval);
            return;
        }

        const pollForDeck = async () => {
            try {
                const { data, error } = await supabase
                    .from('slides')
                    .select('id')
                    .eq('deck_id', deckId)
                    .limit(1);

                if (error) {
                    // Don't throw, just log. We'll keep polling.
                    console.error('Polling error:', error);
                    return;
                }

                if (data && data.length > 0) {
                    // Success! Slides exist.
                    clearInterval(pollingInterval);
                    clearInterval(dotsInterval);
                    navigate(`/pitch-decks/${deckId}/edit`);
                }
            } catch (err) {
                // Catch unexpected errors
                setError(err instanceof Error ? err.message : "An unknown error occurred during polling.");
                clearInterval(pollingInterval);
                clearInterval(dotsInterval);
            }
        };

        const pollingInterval = setInterval(pollForDeck, 3000); // Poll every 3 seconds

        // Cleanup function
        return () => {
            clearInterval(dotsInterval);
            clearInterval(pollingInterval);
        };
    }, [deckId, navigate]);

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