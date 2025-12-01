
import React, { useState } from 'react';
import { findLeads, enrichLead } from '../services/ai/prospecting';
import { Prospect, EnrichedLeadData } from '../services/ai/types';
import { createCustomer } from '../services/crmService';
import { useNavigate } from 'react-router-dom';
import { EmailComposeModal } from '../components/crm/EmailComposeModal';

// Icons
const SearchIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const SparklesIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const PlusIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const CheckIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 6 9 17l-5-5"/></svg>;
const MailIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const BrainIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>;
const NewspaperIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>;
const UserCircleIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg>;

const Prospecting: React.FC = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [industry, setIndustry] = useState('');
    const [location, setLocation] = useState('');
    const [leads, setLeads] = useState<Prospect[]>([]);
    const [loading, setLoading] = useState(false);
    const [addedLeads, setAddedLeads] = useState<Set<string>>(new Set());
    const [enrichingLeadId, setEnrichingLeadId] = useState<string | null>(null);
    
    // Email State
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Prospect | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!industry && !query) return;
        
        setLoading(true);
        setLeads([]);
        try {
            // Parse natural language query or use explicit fields
            const results = await findLeads({
                industry: industry || query,
                location: location || 'Global',
                keywords: query ? [query] : []
            });
            setLeads(results);
        } catch (error) {
            console.error("Prospecting failed:", error);
            alert("Failed to find leads.");
        } finally {
            setLoading(false);
        }
    };

    const handleEnrich = async (lead: Prospect, index: number) => {
        setEnrichingLeadId(lead.name);
        try {
            const enrichedData = await enrichLead(lead.name, lead.website);
            
            // Update lead in state with enriched data
            const updatedLeads = [...leads];
            updatedLeads[index] = {
                ...lead,
                ceoName: enrichedData.ceoName,
                ceoLinkedin: enrichedData.ceoLinkedin,
                latestNews: enrichedData.latestNews,
                enrichedSummary: enrichedData.companySummary
            };
            setLeads(updatedLeads);
        } catch (error) {
            console.error("Enrichment failed:", error);
            alert("Failed to enrich lead data.");
        } finally {
            setEnrichingLeadId(null);
        }
    };

    const handleAddToCRM = async (lead: Prospect) => {
        try {
            await createCustomer({
                name: lead.name,
                logo: lead.name.charAt(0) || 'L',
                segment: 'SMB', // Default, could be inferred
                status: 'Lead',
                mrr: 0,
                renewalDate: 'N/A',
                // Pass enriched data to CRM
                ceoName: lead.ceoName,
                ceoLinkedin: lead.ceoLinkedin,
                latestNews: lead.latestNews,
                companySummary: lead.enrichedSummary
            });
            setAddedLeads(prev => new Set(prev).add(lead.name));
        } catch (error) {
            console.error("Failed to add lead:", error);
            alert("Failed to add lead to CRM.");
        }
    };

    const handleOpenEmail = (lead: Prospect) => {
        setSelectedLead(lead);
        setIsEmailModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#FBF8F5] p-8 font-display">
            <div className="max-w-5xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-brand-blue mb-2">AI Prospecting</h1>
                    <p className="text-gray-600">Find your perfect customer with Gemini Grounding.</p>
                </header>

                {/* Search Box */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-12">
                    <form onSubmit={handleSearch} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">I'm looking for...</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <SearchIcon className="text-gray-400" />
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
                                    <SparklesIcon className="text-brand-orange" />
                                    Find Leads
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Results */}
                {leads.length > 0 && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">Found {leads.length} potential leads</h2>
                            <button onClick={() => navigate('/dashboard/crm')} className="text-sm font-bold text-brand-orange hover:underline">Go to CRM &rarr;</button>
                        </div>
                        
                        <div className="grid gap-4">
                            {leads.map((lead, i) => {
                                const isAdded = addedLeads.has(lead.name);
                                const isEnriching = enrichingLeadId === lead.name;
                                const isEnriched = !!lead.ceoName;

                                return (
                                    <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-start">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xl font-bold text-gray-400 flex-shrink-0">
                                            {lead.name[0]}
                                        </div>
                                        <div className="flex-1 w-full">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900">{lead.name}</h3>
                                                    <a href={lead.website} target="_blank" rel="noreferrer" className="text-sm text-brand-orange hover:underline">{lead.website}</a>
                                                </div>
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full border ${lead.fitScore > 80 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                                    {lead.fitScore}% Match
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mt-2 text-sm leading-relaxed">{lead.description}</p>
                                            
                                            {isEnriched ? (
                                                <div className="mt-4 bg-gradient-to-br from-indigo-50 to-white p-4 rounded-xl border border-indigo-100 text-sm animate-fade-in">
                                                    <div className="flex items-center gap-2 mb-3 border-b border-indigo-100 pb-2">
                                                        <BrainIcon className="text-indigo-500 w-4 h-4"/>
                                                        <span className="text-xs font-bold text-indigo-800 uppercase tracking-wide">Gemini Intelligence</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div>
                                                            <div className="flex items-center gap-1.5 mb-1">
                                                                <UserCircleIcon className="w-3.5 h-3.5 text-indigo-400"/>
                                                                <p className="text-xs font-bold text-gray-500 uppercase">Leadership</p>
                                                            </div>
                                                            <p className="font-bold text-gray-900">{lead.ceoName} {lead.ceoLinkedin && <a href={lead.ceoLinkedin} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline text-xs font-normal ml-1">(LinkedIn)</a>}</p>
                                                        </div>
                                                        <div>
                                                             <div className="flex items-center gap-1.5 mb-1">
                                                                <NewspaperIcon className="w-3.5 h-3.5 text-indigo-400"/>
                                                                <p className="text-xs font-bold text-gray-500 uppercase">Latest Signal</p>
                                                            </div>
                                                             <p className="text-gray-800 italic text-xs line-clamp-2">"{lead.latestNews}"</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{lead.industry}</span>
                                                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{lead.location}</span>
                                                </div>
                                            )}

                                            <p className="mt-3 text-xs text-gray-500 italic">Why: {lead.reason}</p>
                                        </div>
                                        <div className="flex flex-col gap-2 min-w-[140px] w-full md:w-auto">
                                            <button 
                                                onClick={() => handleAddToCRM(lead)}
                                                disabled={isAdded}
                                                className={`w-full px-4 py-2 rounded-lg text-sm font-bold border transition-all flex items-center justify-center gap-2 ${isAdded ? 'bg-green-50 text-green-700 border-green-200' : 'bg-brand-blue text-white border-brand-blue hover:bg-opacity-90'}`}
                                            >
                                                {isAdded ? <><CheckIcon className="w-4 h-4"/> Added</> : 'Add to CRM'}
                                            </button>
                                            
                                            {!isEnriched && (
                                                <button
                                                    onClick={() => handleEnrich(lead, i)}
                                                    disabled={isEnriching}
                                                    className="w-full px-4 py-2 rounded-lg text-sm font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 flex items-center justify-center gap-2 transition-all"
                                                >
                                                    {isEnriching ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-indigo-700 border-t-transparent rounded-full animate-spin"></div>
                                                            Researching...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <BrainIcon className="w-4 h-4" /> Enrich Data
                                                        </>
                                                    )}
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleOpenEmail(lead)}
                                                className="w-full px-4 py-2 rounded-lg text-sm font-bold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                                            >
                                                <MailIcon className="w-4 h-4" /> Draft Email
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {selectedLead && (
                <EmailComposeModal
                    isOpen={isEmailModalOpen}
                    onClose={() => setIsEmailModalOpen(false)}
                    recipientName={selectedLead.ceoName || "Contact"}
                    companyName={selectedLead.name}
                />
            )}
        </div>
    );
};

export default Prospecting;
