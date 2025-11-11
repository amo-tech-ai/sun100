import React from 'react';
import { Link } from 'react-router-dom';

const Services: React.FC = () => {
    return (
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-md prose max-w-4xl mx-auto">
            <h1>Our Services</h1>
            <p>This is a placeholder page for an overview of our agency service offerings.</p>
            <ul>
                <li><Link to="/services/web-design">Web Design</Link></li>
                <li><Link to="/services/logo-branding">Logo & Branding</Link></li>
                <li><Link to="/services/mvp-development">MVP Development</Link></li>
            </ul>
        </div>
    );
};

export default Services;
