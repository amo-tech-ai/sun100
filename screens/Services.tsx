import React from 'react';
import { Link } from 'react-router-dom';

const ServiceCard: React.FC<{ title: string; description: string; link: string; icon: React.ReactNode; }> = ({ title, description, link, icon }) => (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 flex flex-col">
        <div className="w-12 h-12 rounded-full bg-orange-100 text-[#E87C4D] flex items-center justify-center mb-4">
            {icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600 flex-grow mb-4">{description}</p>
        <Link to={link} className="font-semibold text-[#E87C4D] hover:underline self-start">
            Learn More &rarr;
        </Link>
    </div>
);

const Services: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800">Agency Services</h1>
                <p className="text-xl text-gray-600 mt-4">Beyond our AI tools, our expert team offers bespoke services to bring your vision to life.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ServiceCard
                    title="Web Design"
                    description="Crafting beautiful, high-performance websites that tell your story and convert visitors into customers."
                    link="/services/web-design"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/></svg>}
                />
                <ServiceCard
                    title="Logo & Branding"
                    description="Building a memorable brand identity, from the logo to a complete style guide that stands out in a crowded market."
                    link="/services/logo-branding"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>}
                />
                <ServiceCard
                    title="MVP Development"
                    description="Rapidly building and launching your Minimum Viable Product to test your idea, gather feedback, and find product-market fit."
                    link="/services/mvp-development"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>}
                />
            </div>
        </div>
    );
};

export default Services;
