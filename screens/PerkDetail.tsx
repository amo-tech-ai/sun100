import React from 'react';
import { useParams, Link } from 'react-router-dom';

const PerkDetail: React.FC = () => {
    const { id } = useParams();
    return (
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-md max-w-4xl mx-auto">
             <Link to="/perks" className="text-[#E87C4D] hover:underline">&larr; Back to all perks</Link>
            <div className="flex items-center gap-6 mt-4">
                <img src="https://storage.googleapis.com/aistudio-hosting/docs/aws-logo.svg" alt="AWS logo" className="h-16"/>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Amazon Web Services</h1>
                    <p className="text-xl text-gray-600">$10,000 in AWS Credits</p>
                </div>
            </div>
            <div className="prose prose-lg mt-6">
                <p>This is placeholder content for perk #{id}. Eligible startups in the Sun AI community can receive up to $10,000 in AWS Activate credits to build and scale their business.</p>
                <h3>How to Claim</h3>
                <p>Click the button below and fill out the application form. You will need to provide your company details and your Sun AI community membership ID.</p>
            </div>
             <button className="mt-8 inline-block bg-[#E87C4D] text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-colors duration-200">
                Claim Perk
            </button>
        </div>
    );
};

export default PerkDetail;
