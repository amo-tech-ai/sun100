import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';

const { useParams, Link } = ReactRouterDOM;

const JobDetail: React.FC = () => {
    const { id } = useParams();
    return (
        <div className="bg-white p-8 md:p-12 rounded-lg shadow-md">
            <Link to="/jobs" className="text-[#E87C4D] hover:underline">&larr; Back to all jobs</Link>
            <h1 className="text-3xl font-bold text-gray-800 mt-4">AI Prompt Engineer</h1>
            <p className="text-lg text-gray-500 mt-2">Location: Remote &bull; Type: Full-time</p>
            <div className="prose prose-lg mt-6">
                 <p>This is placeholder content for job #{id}. We are looking for a creative and technical AI Prompt Engineer to help us build the next generation of AI-powered tools.</p>
                <h3>Responsibilities</h3>
                <ul>
                    <li>Design, test, and refine prompts for large language models.</li>
                    <li>Collaborate with product and engineering teams to create new AI features.</li>
                    <li>Analyze AI output to ensure quality, accuracy, and tone.</li>
                </ul>
                 <h3>Qualifications</h3>
                <ul>
                    <li>2+ years of experience working with LLMs like Gemini, GPT, or Claude.</li>
                    <li>Strong understanding of natural language processing and AI principles.</li>
                    <li>Excellent written and verbal communication skills.</li>
                </ul>
            </div>
             <button className="mt-8 inline-block bg-[#E87C4D] text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-colors duration-200">
                Apply Now
            </button>
        </div>
    );
};

export default JobDetail;