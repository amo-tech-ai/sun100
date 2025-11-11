import React from 'react';
import { Link } from 'react-router-dom';

const Placeholder = ({ name }: { name: string }) => (
    <div className="py-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
        <span className="text-gray-400 font-medium text-lg">{name}</span>
    </div>
);

const SponsorDeckOverview: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800">Sponsor Deck</h1>
                <p className="text-lg text-gray-500">An overview of our sponsorship program.</p>
            </div>
            <Placeholder name="[Hero Placeholder]" />
            <div className="text-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <h2 className="text-xl font-semibold mb-4 text-gray-600">Internal Navigation</h2>
                <div className="flex justify-center gap-4 flex-wrap">
                    <Link to="/sponsor-deck/showcase" className="font-semibold text-[#E87C4D] hover:underline">Showcase</Link>
                    <Link to="/sponsor-deck/categories" className="font-semibold text-[#E87C4D] hover:underline">Categories</Link>
                    <Link to="/sponsor-deck/stories" className="font-semibold text-[#E87C4D] hover:underline">Success Stories</Link>
                    <Link to="/sponsor-deck/apply" className="font-semibold text-[#E87C4D] hover:underline">Apply to Sponsor</Link>
                </div>
            </div>
            <Placeholder name="[Section Placeholder 1]" />
            <Placeholder name="[Section Placeholder 2]" />
            <Placeholder name="[CTA Placeholder]" />
        </div>
    );
};

export default SponsorDeckOverview;
