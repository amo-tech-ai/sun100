import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PresentationScreen: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    return (
        <div className="bg-gray-900 text-white h-screen w-screen flex flex-col items-center justify-center relative p-4">
            <h1 className="text-4xl font-bold">Presentation Mode</h1>
            <p className="mt-4 text-lg">Deck ID: {id}</p>
            <p className="mt-2 text-gray-400">(This is a placeholder for the full-screen presentation.)</p>
            <button
                onClick={() => navigate(`/pitch-decks/${id}/edit`)}
                className="mt-8 bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
                Exit Presentation
            </button>
        </div>
    );
};

export default PresentationScreen;