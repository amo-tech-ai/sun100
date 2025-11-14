import React from 'react';
import { Link } from 'react-router-dom';

const mockPerks = [
    { id: 1, partner: "Amazon Web Services", offer: "$10,000 in AWS Credits", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
    { id: 2, partner: "Stripe", offer: "Fee-free processing on your first $20,000", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
    { id: 3, partner: "HubSpot for Startups", offer: "90% off HubSpot's Professional software", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/19/HubSpot_Logo.svg" },
];

const PerkCard: React.FC<typeof mockPerks[0]> = ({ id, partner, offer, logoUrl }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center flex flex-col">
        <div className="flex-grow flex items-center justify-center mb-4">
            <img src={logoUrl} alt={`${partner} logo`} className="max-h-12" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">{partner}</h3>
        <p className="text-gray-600 my-2">{offer}</p>
        <Link to={`/perks/${id}`} className="font-semibold text-[#E87C4D] hover:underline mt-auto">
            Claim Perk &rarr;
        </Link>
    </div>
);

const Perks: React.FC = () => {
    return (
        <div>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800">Community Perks</h1>
                <p className="text-xl text-gray-600 mt-4">Exclusive deals and credits from our partners to help your startup grow.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {mockPerks.map(perk => (
                    <PerkCard key={perk.id} {...perk} />
                ))}
            </div>
        </div>
    );
};

export default Perks;