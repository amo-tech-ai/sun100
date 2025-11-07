
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GeneratingScreen: React.FC = () => {
    const navigate = useNavigate();
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
        }, 500);
        
        // Simulate generation and navigate after a delay
        const timer = setTimeout(() => {
            navigate('/dashboard/decks/new-deck-123/edit');
        }, 5000);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
