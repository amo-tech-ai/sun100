import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const PublishSuccessScreen: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const { deckTitle } = location.state || { deckTitle: 'Your Deck' };
    const [publicUrl, setPublicUrl] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        // Generate a mock public URL
        setPublicUrl(`${window.location.origin}/public/deck/${id}`);
    }, [id]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(publicUrl).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl text-center max-w-2xl w-full">
                <CheckCircleIcon />
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-4 mb-2">
                    Successfully Published!
                </h1>
                <p className="text-gray-600 mb-6">
                    Your deck, <span className="font-semibold">{deckTitle}</span>, is now live.
                </p>

                <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between gap-4 mb-8 border border-gray-200">
                    <input 
                        type="text" 
                        value={publicUrl} 
                        readOnly 
                        className="bg-transparent w-full text-gray-700 focus:outline-none"
                        aria-label="Public URL"
                    />
                    <button
                        onClick={handleCopyLink}
                        className="bg-[#E87C4D] text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex-shrink-0"
                    >
                        {isCopied ? 'Copied!' : 'Copy Link'}
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/dashboard"
                        className="w-full sm:w-auto bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        View Dashboard
                    </Link>
                    <Link
                        to={`/dashboard/decks/${id}/edit`}
                        className="w-full sm:w-auto bg-[#E87C4D] text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                        Continue Editing
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PublishSuccessScreen;
