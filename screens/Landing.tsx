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
             <div className="py-16">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8">Explore Our Platform</h2>
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <h3 className="text-xl font-semibold mb-3">How It Works</h3>
                            <p className="text-gray-600 mb-4">Learn about our intelligent, multi-step process for generating pitch decks.</p>
                            <Link to="/how-it-works" className="font-semibold text-[#E87C4D] hover:underline">Learn More &rarr;</Link>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <h3 className="text-xl font-semibold mb-3">Our Services</h3>
                            <p className="text-gray-600 mb-4">Beyond our AI tool, discover the bespoke services our agency offers.</p>
                            <Link to="/services" className="font-semibold text-[#E87C4D] hover:underline">View Services &rarr;</Link>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <h3 className="text-xl font-semibold mb-3">From the Blog</h3>
                            <p className="text-gray-600 mb-4">Read our latest insights on startups, AI, and presentation design.</p>
                            <Link to="/blogs" className="font-semibold text-[#E87C4D] hover:underline">Read Now &rarr;</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Landing;