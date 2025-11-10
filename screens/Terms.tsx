import React from 'react';

const Terms: React.FC = () => {
    return (
        <>
            <title>Terms of Service - Sun AI</title>
            <meta name="description" content="Read the Terms of Service for using the Sun AI Pitch Deck Engine." />
            <div className="bg-white p-6 md:p-10 rounded-lg shadow-md prose max-w-4xl mx-auto">
                <h1>Terms of Service</h1>
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <h2>1. Introduction</h2>
                <p>Welcome to Sun AI ("we", "our", "us"). These Terms of Service govern your use of our web application. By accessing or using our service, you agree to be bound by these terms.</p>

                <h2>2. Use of Service</h2>
                <p>You agree to use our service in compliance with all applicable laws and regulations. You are responsible for any content you generate and its accuracy.</p>
                
                <h2>3. Intellectual Property</h2>
                <p>The service and its original content, features, and functionality are and will remain the exclusive property of Sun AI and its licensors. You retain ownership of the content you create.</p>

                <h2>4. Termination</h2>
                <p>We may terminate or suspend your access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

                <h2>5. Limitation of Liability</h2>
                <p>In no event shall Sun AI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages...</p>
                
                <p><em>This is a placeholder document. Please consult with a legal professional to create a complete and compliant Terms of Service for your application.</em></p>
            </div>
        </>
    );
};

export default Terms;