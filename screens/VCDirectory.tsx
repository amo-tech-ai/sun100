
import React, { useState, useEffect, useMemo } from 'react';
import { VCCard } from '../components/VCCard';
import { getInvestors, Investor } from '../services/vcService';
import { FilterPanel } from '../components/directory/FilterPanel';
import { MatchmakingModal } from '../components/directory/MatchmakingModal';

const SortDropdown = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => (
    <div className="relative inline-block text-left">
        <select 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-brand-orange focus:border-brand-orange sm:text-sm rounded-md shadow-sm"
        >
            <option value="recommended">Best Match</option>
            <option value="recent">Recently Updated</option>
            <option value="check_high">Check Size (High to Low)</option>
            <option value="check_low">Check Size (Low to High)</option>
        </select>
    </div>
);

const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;

const VCDirectory: React.FC = () => {
    const [investors, setInvestors] = useState<Investor[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedStages, setSelectedStages] = useState<string[]>([]);
    const [selectedGeos, setSelectedGeos] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('recommended');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);

    useEffect(() => {
        getInvestors().then(data => {
            setInvestors(data);
            setLoading(false);
        });
    }, []);

    const toggleFilter = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (value: string) => {
        setter(prev => prev.includes(value) ? prev.filter(p => p !== value) : [...prev, value]);
    };

    const resetFilters = () => {
        setSelectedTypes([]);
        setSelectedStages([]);
        setSelectedGeos([]);
        setSearchQuery('');
    };

    const filteredInvestors = useMemo(() => {
        const result = investors.filter(inv => {
            const matchesType = selectedTypes.length === 0 || selectedTypes.includes(inv.type);
            const matchesStage = selectedStages.length === 0 || inv.stages.some(s => selectedStages.includes(s));
            const matchesGeo = selectedGeos.length === 0 || inv.geographies.some(g => selectedGeos.includes(g));
            const matchesSearch = inv.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  inv.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesType && matchesStage && matchesGeo && matchesSearch;
        });

        // Simple sort logic
        if (sortBy === 'check_high') {
            result.sort((a, b) => (b.max_check_size || 0) - (a.max_check_size || 0));
        } else if (sortBy === 'check_low') {
            result.sort((a, b) => (a.min_check_size || 0) - (b.min_check_size || 0));
        }
        
        return result;
    }, [investors, selectedTypes, selectedStages, selectedGeos, searchQuery, sortBy]);

    return (
        <div className="min-h-screen bg-[#FBF8F5]">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Investor Directory</h1>
                            <p className="text-sm text-gray-500 mt-1">Connect with {investors.length}+ active investors and accelerators.</p>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto items-center">
                            <button
                                onClick={() => setIsMatchModalOpen(true)}
                                className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-orange to-red-500 text-white font-bold rounded-lg hover:shadow-md transition-all text-sm"
                            >
                                <SparklesIcon /> Match My Startup
                            </button>
                            <div className="relative flex-grow md:flex-grow-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                                <input 
                                    type="text" 
                                    placeholder="Search by name, industry..." 
                                    className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button 
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        aria-label="Clear search"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <button 
                                className="md:hidden px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Mobile Match Button */}
                <div className="md:hidden mb-6">
                    <button
                        onClick={() => setIsMatchModalOpen(true)}
                        className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-gradient-to-r from-brand-orange to-red-500 text-white font-bold rounded-lg shadow-md"
                    >
                        <SparklesIcon /> Match My Startup
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className={`w-full lg:w-64 flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="sticky top-28">
                            <FilterPanel 
                                selectedTypes={selectedTypes}
                                onTypeChange={toggleFilter(setSelectedTypes)}
                                selectedStages={selectedStages}
                                onStageChange={toggleFilter(setSelectedStages)}
                                selectedGeos={selectedGeos}
                                onGeoChange={toggleFilter(setSelectedGeos)}
                            />
                        </div>
                    </aside>

                    {/* Results Grid */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-sm text-gray-600 font-medium">Showing <span className="text-gray-900">{filteredInvestors.length}</span> investors</p>
                            <SortDropdown value={sortBy} onChange={setSortBy} />
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 h-72 animate-pulse">
                                        <div className="flex justify-between mb-4">
                                            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                            <div className="w-20 h-4 bg-gray-200 rounded"></div>
                                        </div>
                                        <div className="w-3/4 h-6 bg-gray-200 rounded mb-2"></div>
                                        <div className="w-full h-16 bg-gray-200 rounded mb-4"></div>
                                        <div className="flex gap-2">
                                            <div className="w-12 h-6 bg-gray-200 rounded"></div>
                                            <div className="w-12 h-6 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredInvestors.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredInvestors.map(investor => (
                                    <VCCard key={investor.id} investor={investor} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">No investors found</h3>
                                <p className="text-gray-500 mb-6">We couldn't find any matches for your current filters.</p>
                                <button onClick={resetFilters} className="px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-opacity-90 font-medium transition-colors">
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <MatchmakingModal 
                isOpen={isMatchModalOpen} 
                onClose={() => setIsMatchModalOpen(false)} 
            />
        </div>
    );
};

export default VCDirectory;
