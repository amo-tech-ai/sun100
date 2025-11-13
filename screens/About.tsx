
import React from 'react';

const TeamMember: React.FC<{ name: string; title: string; imageUrl: string; }> = ({ name, title, imageUrl }) => (
    <div className="text-center">
        <img src={imageUrl} alt={name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg" />
        <h3 className="text-xl font-bold text-gray-800">{name}</h3>
        <p className="text-gray-500">{title}</p>
    </div>
);

const About: React.FC = () => {
    return (
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800">Our Mission</h1>
                <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
                    To empower the next generation of founders by democratizing access to professional-grade presentation tools. We believe that a great idea deserves a great pitch, and we're building the AI-native platform to make that possible.
                </p>
            </div>

            <div className="border-t border-gray-200 my-12"></div>

            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Meet the Team</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    <TeamMember name="Alex Chen" title="Founder & CEO" imageUrl="https://picsum.photos/seed/sunai-t1/200" />
                    <TeamMember name="Samantha Rao" title="Chief Technology Officer" imageUrl="https://picsum.photos/seed/sunai-t2/200" />
                    <TeamMember name="David Kim" title="Head of Product & Design" imageUrl="https://picsum.photos/seed/sunai-t3/200" />
                </div>
            </div>
        </div>
    );
};

export default About;
