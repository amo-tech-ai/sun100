
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Sponsor {
    id: string;
    name: string;
    category: string;
    description: string;
    logoUrl: string;
    offer: string;
    tier: 'Partner' | 'Gold' | 'Silver';
}

const MOCK_SPONSORS: Sponsor[] = [
    {
        id: 'aws',
        name: 'Amazon Web Services',
        category: 'Cloud',
        description: 'Reliable, scalable, and inexpensive cloud computing services.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
        offer: '$10,000 in AWS Credits',
        tier: 'Partner'
    },
    {
        id: 'stripe',
        name: 'Stripe',
        category: 'Payments',
        description: 'Financial infrastructure platform for the internet.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
        offer: '$20,000 Fee-Free Processing',
        tier: 'Partner'
    },
    {
        id: 'hubspot',
        name: 'HubSpot',
        category: 'CRM',
        description: 'A leading CRM platform that provides software and support.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/19/HubSpot_Logo.svg',
        offer: '90% Off for Startups',
        tier: 'Gold'
    },
    {
        id: 'brex',
        name: 'Brex',
        category: 'Banking',
        description: 'The all-in-one finance for growing businesses.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Brex_Logo.svg',
        offer: '50,000 Points Bonus',
        tier: 'Gold'
    },
    {
        id: 'mercury',
        name: 'Mercury',
        category: 'Banking',
        description: 'Banking built for startups. FDIC-insured.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Mercury_Bank_logo.png', // Placeholder
        offer: '$500 Cash Bonus',
        tier: 'Silver'
    },
    {
        id: 'notion',
        name: 'Notion',
        category: 'Productivity',
        description: 'The all-in-one workspace for your notes, tasks, and wikis.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
        offer: '6 Months Free Plus Plan',
        tier: 'Silver'
    },
    {
        id: 'gcp',
        name: 'Google Cloud',
        category: 'Cloud',
        description: 'Build your startup with Google\'s world-class infrastructure.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg',
        offer: '$200,000 in Cloud Credits',
        tier: 'Partner'
    },
     {
        id: 'linear',
        name: 'Linear',
        category: 'Productivity',
        description: 'A better way to build products. Streamline issues, sprints, and product roadmaps.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Linear_logo.svg/1024px-Linear_logo.svg.png', // Placeholder, usually svg available
        offer: '6 Months Free',
        tier: 'Gold'
    }
];

const CATEGORIES = ['All', 'Cloud', 'Payments', 'Banking', 'CRM', 'Productivity'];

const SponsorCard: React.FC<{ sponsor: Sponsor }> = ({ sponsor }) => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group overflow-hidden">
        <div className="h-32 bg-gray-50 flex items-center justify-center p-6 border-b border-gray-100 relative">
            <img src={sponsor.logoUrl} alt={sponsor.name} className="max-h-12 max-w-[70%] object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500" />
            <div className={`absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                sponsor.tier === 'Partner' ? 'bg-brand-blue text-white' : 
                sponsor.tier === 'Gold' ? 'bg-yellow-100 text-yellow-700' : 
                'bg-gray-100 text-gray-600'
            }`}>
                {sponsor.tier}
            </div>
        </div>
        <div className="p-6 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-brand-orange transition-colors">{sponsor.name}</h3>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">{sponsor.category}</span>
            </div>
            <p className="text-sm text-gray-600 mb-4 flex-grow">{sponsor.description}</p>
            
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-100 mb-4">
                <p className="text-xs font-bold text-brand-orange uppercase tracking-wide mb-1">Exclusive Perk</p>
                <p className="font-bold text-gray-800 text-sm">{sponsor.offer}</p>
            </div>
            
            <button className="w-full py-2 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-lg hover:border-brand-orange hover:text-brand-orange transition-all text-sm">
                Claim Offer
            </button>
        </div>
    </div>
);

const SunAIStartupDeckShowcase: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredSponsors = selectedCategory === 'All' 
        ? MOCK_SPONSORS 
        : MOCK_SPONSORS.filter(s => s.category === selectedCategory);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-brand-blue mb-4">Ecosystem Partners</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Accelerate your growth with exclusive deals and tools from the world's leading technology companies.
                </p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                            selectedCategory === cat 
                            ? 'bg-brand-orange text-white shadow-md transform -translate-y-0.5' 
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredSponsors.map(sponsor => (
                    <SponsorCard key={sponsor.id} sponsor={sponsor} />
                ))}
            </div>
            
            {filteredSponsors.length === 0 && (
                 <div className="text-center py-12">
                    <p className="text-gray-500">No partners found in this category.</p>
                </div>
            )}

            {/* Bottom CTA */}
            <div className="mt-20 bg-gray-900 rounded-2xl p-12 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.05]"></div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-4">Become a Partner</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">Join our ecosystem and get your product in front of thousands of high-growth startups.</p>
                    <Link to="/sunaistartup-deck/apply" className="inline-block bg-white text-gray-900 font-bold py-3 px-8 rounded-xl hover:bg-gray-100 transition-colors">
                        Apply to Sponsor
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SunAIStartupDeckShowcase;
