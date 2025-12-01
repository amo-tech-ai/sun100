
import React, { useState, useEffect } from 'react';
import { generateColdEmail } from '../../services/ai/outreach';
import { addInteraction, Customer, sendEmail } from '../../services/crmService';
import { useToast } from '../../contexts/ToastContext';

interface EmailComposeModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipientName: string;
    companyName: string;
    accountId?: string; // Optional: If provided, logs interaction to CRM
    customer?: Customer; // Optional: Full customer object for context
}

const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const ExternalLinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>;

export const EmailComposeModal: React.FC<EmailComposeModalProps> = ({ isOpen, onClose, recipientName, companyName, accountId, customer }) => {
    const { success, error: toastError } = useToast();
    const [step, setStep] = useState<'draft' | 'edit'>('draft');
    const [context, setContext] = useState('');
    const [tone, setTone] = useState<'Professional' | 'Friendly' | 'Direct'>('Professional');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSending, setIsSending] = useState(false);
    
    // Computed recipient name based on enriched data if available
    const effectiveRecipientName = customer?.ceoName || recipientName;

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            setStep('draft');
            setContext('');
            setSubject('');
            setBody('');
            
            // Auto-fill context if enriched data exists
            if (customer?.latestNews || customer?.companySummary) {
                let enrichedContext = '';
                if (customer.companySummary) enrichedContext += `Company focuses on: ${customer.companySummary}. `;
                if (customer.latestNews) enrichedContext += `Recent news: ${customer.latestNews}. `;
                if (enrichedContext) setContext(enrichedContext);
            }
        }
    }, [isOpen, customer]);

    const handleGenerate = async () => {
        if (!context) return;
        setIsGenerating(true);
        try {
            const draft = await generateColdEmail({ 
                recipientName: effectiveRecipientName, 
                companyName, 
                context, 
                tone 
            });
            setSubject(draft.subject);
            setBody(draft.body);
            setStep('edit');
        } catch (e) {
            console.error(e);
            toastError("Failed to generate email.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSend = async () => {
        setIsSending(true);
        try {
            // 1. Call send email service
            const toEmail = "prospect@example.com"; // In real app, use customer.email or input field
            await sendEmail(toEmail, subject, body);
            
            // 2. Log to CRM if accountId is present
            if (accountId) {
                await addInteraction(accountId, {
                    type: 'email',
                    summary: `Sent email: ${subject}`,
                    sentiment: 'Neutral'
                });
            }
            
            success("Email sent successfully!");
            onClose();
        } catch (e) {
            console.error(e);
            toastError("Failed to send email.");
        } finally {
            setIsSending(false);
        }
    };

    const handleOpenGmail = async () => {
        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoLink, '_blank');
        
        // Optionally log this interaction as well since the user likely sent it
        if (accountId) {
             try {
                await addInteraction(accountId, {
                    type: 'email',
                    summary: `Drafted in Gmail: ${subject}`,
                    sentiment: 'Neutral'
                });
                success("Opened in Gmail & logged interaction.");
            } catch(e) {
                console.error(e);
            }
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">Compose Email</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                        <XIcon />
                    </button>
                </div>

                <div className="p-6">
                    {step === 'draft' ? (
                        <div className="space-y-4">
                            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                                Drafting to: <span className="font-bold">{effectiveRecipientName}</span> at <span className="font-bold">{companyName}</span>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Goal / Context</label>
                                <textarea 
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                                    rows={4}
                                    placeholder="e.g. I noticed they are hiring engineers and want to pitch our recruiting tool."
                                    value={context}
                                    onChange={e => setContext(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tone</label>
                                <div className="flex gap-2">
                                    {['Professional', 'Friendly', 'Direct'].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setTone(t as any)}
                                            className={`px-3 py-2 rounded-lg text-sm border transition-colors ${tone === t ? 'bg-brand-orange text-white border-brand-orange' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button 
                                onClick={handleGenerate}
                                disabled={isGenerating || !context.trim()}
                                className="w-full bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isGenerating ? 'Writing...' : <><SparklesIcon /> AI Draft</>}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subject</label>
                                <input 
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm font-bold"
                                    value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Body</label>
                                <textarea 
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm h-64"
                                    value={body}
                                    onChange={e => setBody(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <button onClick={() => setStep('draft')} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Back</button>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={handleOpenGmail}
                                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                                    >
                                        <ExternalLinkIcon /> Gmail
                                    </button>
                                    <button 
                                        onClick={handleSend}
                                        disabled={isSending}
                                        className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isSending ? 'Sending...' : <><SendIcon /> Send & Log</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
