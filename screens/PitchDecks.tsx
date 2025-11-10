import React from 'react';
import { Link } from 'react-router-dom';

// --- Icons ---
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>;
const LayoutTemplateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>;
const FilePlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg>;
const DollarSignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const FolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>;

const creationCards = [
    { icon: <SparklesIcon />, title: "AI Generate", desc: "Let our AI build your deck from a simple prompt.", path: "/pitch-decks/new" },
    { icon: <LayoutTemplateIcon />, title: "From Template Library", desc: "Choose from dozens of professionally designed templates.", path: "#" },
    { icon: <FilePlusIcon />, title: "Start from Scratch", desc: "Begin with a blank canvas and build your story.", path: "#" },
    { icon: <DollarSignIcon />, title: "Budget Deck", desc: "A quick, cost-effective deck for early-stage ideas.", path: "#" },
];

const templates = [
    { name: "Startup Pitch", color: "bg-blue-100" },
    { name: "Product Demo", color: "bg-green-100" },
    { name: "Sales Proposal", color: "bg-purple-100" },
    { name: "Quarterly Review", color: "bg-yellow-100" },
    { name: "Investor Update", color: "bg-red-100" },
    { name: "Team Intro", color: "bg-indigo-100" },
];

const PitchDecks: React.FC = () => {
    return (
        <div className="space-y-12">
            {/* --- Header --- */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold font-heading text-gray-800">My Pitch Decks</h1>
                <p className="mt-1 text-lg text-gray-600">You have 0 decks ready. Create a new one to get started.</p>
            </div>

            {/* --- Creation Hub --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {creationCards.map(card => (
                    <Link key={card.title} to={card.path} className="bg-white p-6 rounded-lg shadow-md border border-gray-200/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-center">
                        <div className="text-[#E87C4D] w-12 h-12 mx-auto bg-orange-50 rounded-lg flex items-center justify-center mb-4">{card.icon}</div>
                        <h3 className="font-bold text-gray-800">{card.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{card.desc}</p>
                    </Link>
                ))}
            </div>

            {/* --- My Presentations --- */}
            <div>
                <h2 className="text-2xl font-bold font-heading text-gray-800 mb-4">My Presentations</h2>
                <div className="bg-white p-12 rounded-lg shadow-md border-2 border-dashed border-gray-300 text-center">
                    <div className="text-gray-300 w-16 h-16 mx-auto mb-4"><FolderIcon /></div>
                    <h3 className="text-lg font-bold text-gray-800">Your presentations will appear here</h3>
                    <p className="text-gray-500 mt-1 mb-6">Create a new presentation using one of the options above.</p>
                    <Link 
                        to="/pitch-decks/new"
                        className="inline-block bg-[#E87C4D] text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                        Create First Deck
                    </Link>
                </div>
            </div>
            
            {/* --- Recommended Templates --- */}
            <div>
                 <h2 className="text-2xl font-bold font-heading text-gray-800 mb-4">Recommended Templates</h2>
                 <div className="flex space-x-6 overflow-x-auto pb-4 -mx-4 px-4">
                    {templates.map(template => (
                        <div key={template.name} className="flex-shrink-0 w-64">
                            <div className={`aspect-[4/3] ${template.color} rounded-lg mb-2 flex items-center justify-center font-bold text-gray-600`}>Template</div>
                            <h3 className="font-semibold text-gray-700">{template.name}</h3>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    );
};

export default PitchDecks;