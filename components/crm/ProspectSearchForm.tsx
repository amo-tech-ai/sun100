
import React from 'react';
import { CDPIcons } from './CRMIcons';

interface ProspectSearchFormProps {
    query: string;
    setQuery: (val: string) => void;
    industry: string;
    setIndustry: (val: string) => void;
    location: string;
    setLocation: (val: string) => void;
    onSearch: (e: React.FormEvent) => void;
    loading: boolean;
}

export const ProspectSearchForm: React.FC<ProspectSearchFormProps> = ({
    query, setQuery, industry, setIndustry, location, setLocation, onSearch, loading
}) => {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-12">
            <form onSubmit={onSearch} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">I'm looking for...</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <CDPIcons.Search className="text-gray-400" />
                        </div>
                        <input 
                            type="text" 
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
                            placeholder="e.g. Series B SaaS companies in New York using Stripe"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="text-xs font-bold text-gray-400 uppercase">Or use filters</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Industry</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                            placeholder="Fintech, Healthtech..."
                            value={industry}
                            onChange={e => setIndustry(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                            placeholder="San Francisco, Remote..."
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-brand-blue text-white font-bold py-4 rounded-xl hover:bg-opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Searching the web...
                        </>
                    ) : (
                        <>
                            <CDPIcons.Sparkles className="text-brand-orange" />
                            Find Leads
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};
