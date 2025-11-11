import React from 'react';

const Privacy: React.FC = () => {
    return (
        <>
            <title>Privacy Policy - sun ai startup</title>
            <meta name="description" content="Read the Privacy Policy for the sun ai startup platform to understand how we handle your data." />
            <div className="bg-white p-6 md:p-10 rounded-lg shadow-md prose">
                <h1>Privacy Policy</h1>
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <h2>1. Information We Collect</h2>
                <p>We may collect personal information that you provide to us directly, such as your name, email address, and any business details you input into the wizard to generate a pitch deck.</p>

                <h2>2. How We Use Your Information</h2>
                <p>We use the information we collect to operate, maintain, and provide the features and functionality of the service. The business details you provide are sent to a third-party AI service (Google's Gemini API) to generate content.</p>

                <h2>3. Data Storage</h2>
                <p>Currently, all generated deck data is stored in your browser's session storage. This means it is temporary and will be deleted when you close your browser tab. We do not store your generated decks on our servers in this version.</p>

                <h2>4. Third-Party Services</h2>
                <p>We use Google's Gemini API to power our AI generation features. Your use of our service is also subject to Google's privacy policy.</p>

                <h2>5. Changes to This Policy</h2>
                <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
                
                <p><em>This is a placeholder document. Please consult with a legal professional to create a complete and compliant Privacy Policy for your application.</em></p>
            </div>
        </>
    );
};

export default Privacy;