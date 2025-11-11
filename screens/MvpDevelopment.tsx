import React from 'react';
import { Link } from 'react-router-dom';

const MvpDevelopment: React.FC = () => {
    return (
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-md">
            <Link to="/services" className="text-[#E87C4D] hover:underline">&larr; Back to all services</Link>
            <div className="grid md:grid-cols-2 gap-8 items-center mt-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">MVP Development</h1>
                    <p className="text-lg text-gray-600 mt-4">
                        Have a great idea? We help you turn it into a reality. Our team specializes in rapidly building and launching Minimum Viable Products (MVPs) to help you test your core assumptions, gather user feedback, and find product-market fit faster.
                    </p>
                    <div className="prose mt-6">
                        <h3>Our Process:</h3>
                        <ul>
                            <li>Strategy & Scoping session</li>
                            <li>Rapid prototyping and design</li>
                            <li>Agile development sprints</li>
                            <li>Launch and user feedback analysis</li>
                        </ul>
                    </div>
                     <Link to="#" className="mt-8 inline-block bg-[#E87C4D] text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-colors duration-200">
                        Get a Quote
                    </Link>
                </div>
                 <div>
                    <img 
                        src="https://storage.googleapis.com/aistudio-hosting/docs/service-mvp.png"
                        alt="MVP development example"
                        className="rounded-lg shadow-lg"
                    />
                </div>
            </div>
        </div>
    );
};

export default MvpDevelopment;