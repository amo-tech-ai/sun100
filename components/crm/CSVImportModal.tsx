
import React, { useState, useRef } from 'react';
import { suggestCSVMapping } from '../../services/ai/crm';
import { createCustomer } from '../../services/crmService';

interface CSVImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
}

const XIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const UploadIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>;
const BrainIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>;

export const CSVImportModal: React.FC<CSVImportModalProps> = ({ isOpen, onClose, onComplete }) => {
    const [step, setStep] = useState<'upload' | 'map' | 'importing'>('upload');
    const [csvData, setCsvData] = useState<string[][]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [mapping, setMapping] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const text = await file.text();
        const rows = text.split('\n').map(row => row.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')));
        if (rows.length < 2) {
            alert("Invalid CSV format");
            return;
        }

        const headerRow = rows[0];
        setHeaders(headerRow);
        setCsvData(rows.slice(1).filter(r => r.length === headerRow.length)); // Filter empty/mismatched rows
        
        setLoading(true);
        try {
            const { mapping: aiMapping } = await suggestCSVMapping(headerRow);
            // Use type assertion if necessary based on service return type, but here we rely on inferred record
            setMapping(aiMapping as Record<string, string>);
            setStep('map');
        } catch (err) {
            console.error("Mapping failed", err);
            setStep('map');
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async () => {
        setStep('importing');
        let count = 0;
        try {
            for (const row of csvData) {
                const customerData: any = {
                    name: row[headers.indexOf(mapping.name)] || 'Unknown',
                    status: 'Lead',
                    segment: 'SMB',
                    mrr: 0,
                    renewalDate: '',
                    extended_info: {
                        // Add enriched fields here if mapped
                    }
                };
                
                // Optional fields
                if (mapping.email) customerData.email = row[headers.indexOf(mapping.email)];
                if (mapping.website) customerData.website = row[headers.indexOf(mapping.website)];
                
                await createCustomer(customerData);
                count++;
            }
            alert(`Successfully imported ${count} leads.`);
            onComplete();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Import failed partially.");
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">Import Leads from CSV</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                        <XIcon />
                    </button>
                </div>

                <div className="p-6">
                    {step === 'upload' && (
                        <div className="text-center py-8">
                            {loading ? (
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-brand-orange mb-4"></div>
                                    <p className="text-gray-600 font-medium">Analyzing CSV Structure...</p>
                                </div>
                            ) : (
                                <>
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-gray-300 rounded-xl p-10 cursor-pointer hover:bg-gray-50 hover:border-brand-orange transition-all group"
                                    >
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 group-hover:text-brand-orange group-hover:bg-orange-50 transition-colors">
                                            <UploadIcon />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800">Click to Upload CSV</h3>
                                        <p className="text-sm text-gray-500 mt-2">Supports .csv files. Rows will be mapped to CRM fields.</p>
                                    </div>
                                    <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileUpload} />
                                </>
                            )}
                        </div>
                    )}

                    {step === 'map' && (
                        <div className="space-y-4">
                            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 flex items-start gap-2">
                                <BrainIcon className="w-5 h-5 flex-shrink-0 mt-0.5"/>
                                <span>AI has suggested mappings based on your headers. Please verify correctly.</span>
                            </div>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                                {['name', 'email', 'website', 'role', 'linkedin', 'segment'].map(field => (
                                    <div key={field} className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-gray-700 capitalize w-1/3">{field}</label>
                                        <select 
                                            className="w-2/3 p-2 border border-gray-300 rounded-lg text-sm"
                                            value={mapping[field] || ''}
                                            onChange={e => setMapping({...mapping, [field]: e.target.value})}
                                        >
                                            <option value="">(Skip)</option>
                                            {headers.map(h => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={handleImport}
                                className="w-full bg-brand-orange text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors shadow-md"
                            >
                                Import {csvData.length} Leads
                            </button>
                        </div>
                    )}

                    {step === 'importing' && (
                         <div className="flex flex-col items-center justify-center py-12">
                             <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mb-6"></div>
                             <h3 className="text-xl font-bold text-gray-900">Importing Data...</h3>
                             <p className="text-gray-500 mt-2">Adding leads to your CRM.</p>
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
};
