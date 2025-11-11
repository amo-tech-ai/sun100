import React from 'react';

const Placeholder = ({ name }: { name: string }) => (
    <div className="py-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
        <span className="text-gray-400 font-medium text-lg">{name}</span>
    </div>
);

const SponsorDeckCategories: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800">Sponsor Categories</h1>
                <p className="text-lg text-gray-500">Placeholder page for category filters.</p>
            </div>
            <Placeholder name="[Hero Placeholder]" />
            <Placeholder name="[Section Placeholder 1]" />
            <Placeholder name="[Section Placeholder 2]" />
            <Placeholder name="[CTA Placeholder]" />
        </div>
    );
};

export default SponsorDeckCategories;
