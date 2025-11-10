import React from 'react';
import { useParams } from 'react-router-dom';

const JobDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold font-heading text-gray-800">Job Detail: {id}</h1>
            <p className="mt-4 text-lg text-gray-600">Details for this job are coming soon.</p>
        </div>
    );
};

export default JobDetail;
