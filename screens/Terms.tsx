import React from 'react';

const Terms: React.FC = () => {
    return (
        <div className="bg-white rounded-lg shadow-md prose lg:prose-lg max-w-none p-8 md:p-12">
            <title>Terms of Service - sun ai startup</title>
            <meta name="description" content="Read the Terms of Service for using the sun ai startup platform." />
            
            <h1>Terms of Service</h1>
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <h2>1. Introduction</h2>
            <p>Welcome to sun ai startup ("we", "our", "us"). These Terms of Service govern your use of our web application. By accessing or using our service, you agree to be bound by these terms.</p>

            <h2>2. Use of Service</h2>
            <p>You agree to use our service in compliance with all applicable laws and regulations. You are responsible for any content you generate and its accuracy.</p>
            
            <h2>3. Intellectual Property</h2>
            <p>The service and its original content, features, and functionality are and will remain the exclusive property of sun ai startup and its licensors. You retain ownership of the content you create.</p>

            <h2>4. Termination</h2>
            <p>We may terminate or suspend your access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

            <h2>5. Limitation of Liability</h2>
            <p>In no event shall sun ai startup, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages...</p>
            
            <p><em>This is a placeholder document. Please consult with a legal professional to create a complete and compliant Terms of Service for your application.</em></p>
        </div>
    );
};

export default Terms;
