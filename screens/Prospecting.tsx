
import React, { useState } from 'react';
import { findLeads, enrichLead } from '../services/ai/prospecting';
import { Prospect } from '../services/ai/types';
import { createCustomer } from '../services/crmService';
import { useNavigate } from 'react-router-dom';
import { EmailComposeModal } from '../components/crm/EmailComposeModal';
import { ProspectSearchForm } from '../components/crm/ProspectSearchForm';
import { ProspectResultCard } from '../components/crm/ProspectResultCard';

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

                <ProspectSearchForm 
                    query={query}
                    setQuery={setQuery}
                    industry={industry}
                    setIndustry={setIndustry}
                    location={location}
                    setLocation={setLocation}
                    onSearch={handleSearch}
                    loading={loading}
                />

                {/* Results */}
                {leads.length > 0 && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">Found {leads.length} potential leads</h2>
                            <button onClick={() => navigate('/dashboard/crm')} className="text-sm font-bold text-brand-orange hover:underline">Go to CRM &rarr;</button>
                        </div>
                        
                        <div className="grid gap-4">
                            {leads.map((lead, i) => (
                                <ProspectResultCard 
                                    key={i}
                                    lead={lead}
                                    index={i}
                                    isAdded={addedLeads.has(lead.name)}
                                    isEnriching={enrichingLeadId === lead.name}
                                    isEnriched={!!lead.ceoName}
                                    onAdd={() => handleAddToCRM(lead)}
                                    onEnrich={() => handleEnrich(lead, i)}
                                    onEmail={() => handleOpenEmail(lead)}
                                />
                            ))}
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
