
import React from 'react';
import { Link } from 'react-router-dom';

const LogoBranding: React.FC = () => (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold font-heading text-gray-800">Logo & Branding</h1>
        <p className="mt-4 text-lg text-gray-600">This is the logo and branding service detail page. Content is coming soon.</p>
         <div className="mt-8">
            <Link to="/services" className="text-brand-orange hover:underline">&larr; Back to Services</Link>
        </div>
    </div>
);

export default LogoBranding;
