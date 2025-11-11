import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
    return (
        <>
            <title>Sun AI: AI Pitch Deck Engine</title>
            <meta name="description" content="Create investor-ready pitch decks in minutes. Sun AI is a guided wizard powered by generative AI that turns your business details into a stunning presentation." />
            <div className="text-center py-16">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight mb-4">
                    Create Investor-Ready Pitch Decks in Minutes
                </h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                    Sun AI is a guided wizard powered by generative AI. Turn your business details or website into a stunning, professional presentation that will captivate investors.
                </p>
                <Link
                    to="/dashboard"
                    className="inline-block bg-[#E87C4D] text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-opacity-90 transition-colors duration-200 shadow-xl"
                >
                    Start Creating For Free
                </Link>
                <div className="mt-12">
                    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-2xl p-4 border border-gray-200">
                        <img 
                            src="https://storage.googleapis.com/aistudio-hosting/docs/landing-placeholder.png" 
                            alt="Sun AI Pitch Deck Editor Screenshot" 
                            className="rounded-md"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Landing;