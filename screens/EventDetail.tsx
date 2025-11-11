import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);


const EventDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const registrationKey = `event-registration-${id}`;

    const [isRegistered, setIsRegistered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    // Check registration status on mount
    useEffect(() => {
        const storedStatus = localStorage.getItem(registrationKey);
        if (storedStatus === 'true') {
            setIsRegistered(true);
        }
    }, [registrationKey]);

    const handleRegister = async () => {
        setIsLoading(true);
        setError(null);
        await new Promise(resolve => setTimeout(resolve, 1500));
        try {
            localStorage.setItem(registrationKey, 'true');
            setIsRegistered(true);
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000); // Hide after 3 seconds
        } catch (err) {
            setError("Failed to save registration. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnregister = async () => {
        setIsLoading(true);
        setError(null);
        await new Promise(resolve => setTimeout(resolve, 1500));
        try {
            localStorage.removeItem(registrationKey);
            setIsRegistered(false);
        } catch (err) {
            setError("Failed to unregister. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderActionArea = () => {
        if (showSuccessMessage) {
            return (
                 <div className="mt-8 p-4 bg-green-100 text-green-700 font-bold rounded-lg text-lg text-center transition-opacity duration-300">
                    Registration Confirmed! We'll see you there.
                </div>
            )
        }
        
        if (isRegistered) {
            return (
                <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                    <div className="inline-flex items-center bg-green-100 text-green-700 font-bold py-3 px-6 rounded-lg text-lg">
                        <CheckCircleIcon />
                        You are registered!
                    </div>
                    <button
                        onClick={handleUnregister}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors duration-200 disabled:bg-gray-200 disabled:cursor-not-allowed"
                    >
                         {isLoading ? 'Processing...' : 'Unregister'}
                    </button>
                </div>
            );
        }

        return (
             <button
                onClick={handleRegister}
                disabled={isLoading}
                className="mt-8 inline-flex items-center justify-center bg-[#E87C4D] text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Registering...
                    </>
                ) : (
                    'Register Now'
                )}
            </button>
        );
    };

    return (
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-md max-w-4xl mx-auto">
            <Link to="/events" className="text-[#E87C4D] hover:underline">&larr; Back to all events</Link>
            <h1 className="text-3xl font-bold text-gray-800 mt-4">Pitch Deck Masterclass: From Idea to Investment</h1>
            <p className="text-lg text-gray-500 mt-2">Date: September 15, 2024</p>
            <p className="text-lg text-gray-500">Location: Virtual</p>
            <div className="prose prose-lg mt-6">
                 <p>This is placeholder content for event #{id}. Join us for a deep-dive workshop on crafting a narrative that investors can't ignore.</p>
                <p>In this session, we will cover the 10 essential slides, how to tell a compelling story with data, and common mistakes to avoid when pitching.</p>
            </div>
            {renderActionArea()}
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default EventDetail;
