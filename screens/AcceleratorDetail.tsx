
import React from 'react';
import { useParams, Link } from 'react-router-dom';

const AcceleratorDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold font-heading text-gray-800">Accelerator Detail: {id}</h1>
            <p className="mt-4 text-lg text-gray-600">Details for this accelerator are coming soon.</p>
            <div className="mt-8">
                <Link to="/accelerators" className="text-brand-orange hover:underline">&larr; Back to Directory</Link>
            </div>
        </div>
    );
};

export default AcceleratorDetail;
