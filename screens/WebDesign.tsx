import React from 'react';
import { Link } from 'react-router-dom';

const WebDesign: React.FC = () => {
    return (
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-md">
            <Link to="/services" className="text-[#E87C4D] hover:underline">&larr; Back to all services</Link>
            <div className="grid md:grid-cols-2 gap-8 items-center mt-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Custom Web Design</h1>
                    <p className="text-lg text-gray-600 mt-4">
                        We design and build beautiful, high-performance websites that not only look great but are also engineered to convert. From landing pages to full e-commerce sites, our team works with you to create a digital presence that tells your story and achieves your business goals.
                    </p>
                    <div className="prose mt-6">
                        <h3>What's Included:</h3>
                        <ul>
                            <li>Responsive design for all devices</li>
                            <li>SEO best practices</li>
                            <li>Content Management System (CMS) integration</li>
                            <li>Performance optimization</li>
                        </ul>
                    </div>
                     <Link to="#" className="mt-8 inline-block bg-[#E87C4D] text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-colors duration-200">
                        Get a Quote
                    </Link>
                </div>
                 <div>
                    <img 
                        src="https://storage.googleapis.com/aistudio-hosting/docs/service-web.png"
                        alt="Web design example"
                        className="rounded-lg shadow-lg"
                    />
                </div>
            </div>
        </div>
    );
};

export default WebDesign;