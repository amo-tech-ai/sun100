
import React, { useState, useRef, useEffect } from 'react';
import { askInvestorData } from '../../services/ai/investor';
import { useTypewriter } from '../../hooks/useTypewriter';
import { MetricEntry } from '../../services/metricsService';
import { Deck } from '../../data/decks';
import { Customer } from '../../services/crm/types';

interface InvestorChatProps {
    metrics: MetricEntry[];
    pitchDecks?: Deck[];
    crmAccounts?: Customer[];
}

const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;

const ChatMessage: React.FC<{ role: 'user' | 'ai'; text: string }> = ({ role, text }) => {
    const { displayedText } = useTypewriter(role === 'ai' ? text : null, { speed: 10 });
    
    return (
        <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-3 animate-fade-in-up`}>
            <div 
                className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed shadow-sm ${
                    role === 'user' 
                    ? 'bg-brand-blue text-white rounded-br-none' 
                    : 'bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200'
                }`}
            >
                {role === 'ai' ? displayedText || text : text}
            </div>
        </div>
    );
};

export const InvestorChat: React.FC<InvestorChatProps> = ({ metrics, pitchDecks = [], crmAccounts = [] }) => {
    const [query, setQuery] = useState('');
    const [history, setHistory] = useState<{ role: 'user' | 'ai'; text: string }[]>([
        { role: 'ai', text: "Hi! I'm your AI Investment Analyst. Ask me about your metrics, decks, or pipeline status." }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const handleSend = async () => {
        if (!query.trim() || isLoading) return;
        
        const userQuery = query;
        setQuery('');
        setHistory(prev => [...prev, { role: 'user', text: userQuery }]);
        setIsLoading(true);

        try {
            // Pass richer context to the AI service
            const context = {
                metrics,
                decks: pitchDecks.map(d => ({ title: d.title, slideCount: d.slides.length, template: d.template })),
                crm: crmAccounts.map(c => ({ name: c.name, status: c.status, mrr: c.mrr, health: c.healthScore }))
            };
            
            const response = await askInvestorData(userQuery, context);
            setHistory(prev => [...prev, { role: 'ai', text: response }]);
        } catch (error) {
            setHistory(prev => [...prev, { role: 'ai', text: "Sorry, I encountered an error analyzing your data." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center gap-2">
                <div className="p-1.5 bg-brand-orange/10 rounded-md text-brand-orange">
                    <SparklesIcon />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 text-sm">Ask Your Data</h3>
                    <p className="text-xs text-gray-500">Gemini 3 • Decks, CRM & Finance</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30" ref={scrollRef}>
                {history.map((msg, i) => (
                    <ChatMessage key={i} role={msg.role} text={msg.text} />
                ))}
                {isLoading && (
                    <div className="flex justify-start mb-3">
                        <div className="bg-gray-100 p-3 rounded-xl rounded-bl-none flex gap-1 items-center border border-gray-200">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-3 border-t border-gray-100 bg-white">
                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="e.g. Is my Series A deck ready?"
                        className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange text-sm transition-all bg-gray-50 focus:bg-white"
                        disabled={isLoading}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!query.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-blue hover:text-brand-orange transition-colors disabled:opacity-50 rounded-lg hover:bg-gray-100"
                    >
                        <SendIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};
