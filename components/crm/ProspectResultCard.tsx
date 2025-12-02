
import React from 'react';
import { Prospect } from '../../services/ai/types';
import { CDPIcons } from './CRMIcons';

interface ProspectResultCardProps {
    lead: Prospect;
    index: number;
    isAdded: boolean;
    isEnriching: boolean;
    isEnriched: boolean;
    onAdd: () => void;
    onEnrich: () => void;
    onEmail: () => void;
}

export const ProspectResultCard: React.FC<ProspectResultCardProps> = ({
    lead, index, isAdded, isEnriching, isEnriched, onAdd, onEnrich, onEmail
}) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-start">
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
                            <CDPIcons.Brain className="text-indigo-500 w-4 h-4"/>
                            <span className="text-xs font-bold text-indigo-800 uppercase tracking-wide">Gemini Intelligence</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <div className="flex items-center gap-1.5 mb-1">
                                    <CDPIcons.User className="w-3.5 h-3.5 text-indigo-400"/>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Leadership</p>
                                </div>
                                <p className="font-bold text-gray-900">{lead.ceoName} {lead.ceoLinkedin && <a href={lead.ceoLinkedin} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline text-xs font-normal ml-1">(LinkedIn)</a>}</p>
                            </div>
                            <div>
                                    <div className="flex items-center gap-1.5 mb-1">
                                    <span className="w-3.5 h-3.5 flex items-center justify-center text-indigo-400 font-bold">N</span>
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
                    onClick={onAdd}
                    disabled={isAdded}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-bold border transition-all flex items-center justify-center gap-2 ${isAdded ? 'bg-green-50 text-green-700 border-green-200' : 'bg-brand-blue text-white border-brand-blue hover:bg-opacity-90'}`}
                >
                    {isAdded ? <span className="flex items-center gap-1">✓ Added</span> : 'Add to CRM'}
                </button>
                
                {!isEnriched && (
                    <button
                        onClick={onEnrich}
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
                                <CDPIcons.Brain className="w-4 h-4" /> Enrich Data
                            </>
                        )}
                    </button>
                )}

                <button
                    onClick={onEmail}
                    className="w-full px-4 py-2 rounded-lg text-sm font-bold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                    <CDPIcons.Mail className="w-4 h-4" /> Draft Email
                </button>
            </div>
        </div>
    );
};
