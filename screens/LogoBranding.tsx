import React from 'react';
import { Link } from 'react-router-dom';

const LogoBranding: React.FC = () => {
    return (
        <div className="bg-white p-8 md:p-12 rounded-lg shadow-md">
            <Link to="/services" className="text-[#E87C4D] hover:underline">&larr; Back to all services</Link>
            <div className="grid md:grid-cols-2 gap-8 items-center mt-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Logo & Brand Identity</h1>
                    <p className="text-lg text-gray-600 mt-4">
                        A strong brand is your startup's foundation. We work with you to create a memorable brand identity that stands out in a crowded market. Our process goes beyond just a logo to build a complete visual system that communicates your values and resonates with your target audience.
                    </p>
                    <div className="prose mt-6">
                        <h3>What's Included:</h3>
                        <ul>
                            <li>Logo design (multiple concepts)</li>
                            <li>Color palette and typography selection</li>
                            <li>Brand style guide</li>
                            <li>Social media assets</li>
                        </ul>
                    </div>
                     <Link to="#" className="mt-8 inline-block bg-[#E87C4D] text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-colors duration-200">
                        Get a Quote
                    </Link>
                </div>
                 <div>
                    <img 
                        src="https://storage.googleapis.com/aistudio-hosting/docs/service-brand.png"
                        alt="Branding example"
                        className="rounded-lg shadow-lg"
                    />
                </div>
            </div>
        </div>
    );
};

export default LogoBranding;