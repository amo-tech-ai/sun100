
import React, { useState } from 'react';
import { InvestorDocType, OnePagerContent, InvestorUpdateContent, InvestmentMemoContent } from '../../services/ai/types';
import { useTypewriter } from '../../hooks/useTypewriter';

interface DocPreviewProps {
    type: InvestorDocType;
    content: OnePagerContent | InvestorUpdateContent | InvestmentMemoContent;
}

const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

const TypewriterText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
    const { displayedText } = useTypewriter(text, { speed: 5 });
    return <p className={className}>{displayedText}</p>;
};

export const DocPreview: React.FC<DocPreviewProps> = ({ type, content }) => {
    const [copied, setCopied] = useState(false);

    const handleCopyText = () => {
        let textToCopy = "";
        
        if (type === 'update') {
            const data = content as InvestorUpdateContent;
            textToCopy = `Subject: ${data.subject_line}\n\nStatus: ${data.status_emoji} ${data.status_summary}\n\nKPI Summary:\n${data.kpi_summary}\n\nHighlights:\n${data.highlights.map(h => `- ${h}`).join('\n')}\n\nLowlights:\n${data.lowlights.map(l => `- ${l}`).join('\n')}\n\nAsks:\n${data.ask}`;
        } else {
            textToCopy = JSON.stringify(content, null, 2);
        }

        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    if (type === 'one_pager') {
        const data = content as OnePagerContent;
        return (
            <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-200 min-h-[800px] print:shadow-none print:border-none print:p-0">
                <div className="space-y-6 font-sans">
                    <div className="border-b border-gray-200 pb-6">
                        <h1 className="text-3xl font-extrabold text-gray-900">{data.headline}</h1>
                        <div className="flex gap-4 mt-2 text-gray-500 print:text-sm">
                            <a href={`https://${data.contact_info.website}`} className="hover:text-brand-orange">{data.contact_info.website}</a>
                            <span>•</span>
                            <a href={`mailto:${data.contact_info.email}`} className="hover:text-brand-orange">{data.contact_info.email}</a>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-8 print:gap-6">
                        <div className="col-span-2 space-y-6">
                            <section>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Problem</h4>
                                <TypewriterText text={data.problem_summary} className="text-gray-800 leading-relaxed text-sm" />
                            </section>
                            <section>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Solution</h4>
                                <TypewriterText text={data.solution_summary} className="text-gray-800 leading-relaxed text-sm" />
                            </section>
                            <section>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Market</h4>
                                <TypewriterText text={data.market_opportunity} className="text-gray-800 leading-relaxed text-sm" />
                            </section>
                        </div>
                        <div className="col-span-1 bg-gray-50 p-6 rounded-lg h-fit print:bg-gray-50 print:border print:border-gray-200">
                            <section className="mb-6">
                                <h4 className="text-xs font-bold text-brand-orange uppercase tracking-wider mb-3">Traction</h4>
                                <ul className="space-y-2">
                                    {data.traction_highlights.map((t, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm font-bold text-gray-800">
                                            <span className="text-green-500">✓</span> {t}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                            <section className="mb-6">
                                <h4 className="text-xs font-bold text-brand-orange uppercase tracking-wider mb-2">Business Model</h4>
                                <p className="text-sm text-gray-600">{data.business_model}</p>
                            </section>
                            <section>
                                <h4 className="text-xs font-bold text-brand-orange uppercase tracking-wider mb-2">The Ask</h4>
                                <p className="text-lg font-bold text-brand-blue">{data.ask}</p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'update') {
        const data = content as InvestorUpdateContent;
        return (
            <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-200 min-h-[600px] print:shadow-none print:border-none print:p-0 relative group">
                
                <button 
                    onClick={handleCopyText}
                    className="absolute top-8 right-8 p-2 text-gray-400 hover:text-brand-orange bg-gray-50 hover:bg-orange-50 rounded-lg transition-all print:hidden flex items-center gap-2"
                    title="Copy email content to clipboard"
                >
                    {copied ? <span className="text-green-600 text-xs font-bold">Copied!</span> : <span className="text-xs font-medium">Copy Text</span>}
                    {copied ? <CheckIcon /> : <CopyIcon />}
                </button>

                <div className="max-w-2xl mx-auto font-sans text-gray-800">
                    <div className="mb-8 pb-6 border-b border-gray-200">
                        <p className="text-sm text-gray-500 mb-2">Subject Line:</p>
                        <h2 className="text-xl font-semibold">{data.subject_line}</h2>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-6 bg-gray-50 p-4 rounded-lg print:border print:border-gray-200">
                        <span className="text-2xl">{data.status_emoji}</span>
                        <p className="font-medium">{data.status_summary}</p>
                    </div>

                    <div className="mb-8">
                        <h3 className="font-bold text-lg mb-3">KPI Summary</h3>
                        <div className="whitespace-pre-wrap bg-slate-50 p-4 rounded-lg font-mono text-sm border border-slate-200">
                            {data.kpi_summary}
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="font-bold text-lg mb-3 text-green-700">Highlights</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            {data.highlights.map((h, i) => <li key={i}>{h}</li>)}
                        </ul>
                    </div>

                    <div className="mb-8">
                        <h3 className="font-bold text-lg mb-3 text-red-700">Lowlights</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            {data.lowlights.map((l, i) => <li key={i}>{l}</li>)}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-3 text-brand-orange">Asks</h3>
                        <TypewriterText text={data.ask} />
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'memo') {
        const data = content as InvestmentMemoContent;
        const scoreColor = data.verdict_score >= 75 ? 'text-green-600' : data.verdict_score >= 50 ? 'text-yellow-600' : 'text-red-600';
        return (
             <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-200 min-h-[800px] print:shadow-none print:border-none print:p-0">
                <div className="max-w-3xl mx-auto font-serif text-gray-900">
                    <div className="border-b-2 border-black pb-4 mb-8 flex justify-between items-end">
                        <div>
                            <h1 className="text-4xl font-bold uppercase tracking-tight">Investment Memo</h1>
                            <p className="text-gray-500 italic mt-1">Confidential • Internal Use Only</p>
                        </div>
                         <div className="text-right">
                            <div className={`text-4xl font-bold ${scoreColor}`}>{data.verdict_score}/100</div>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Confidence Score</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 border-l-4 border-gray-800 p-6 mb-8">
                        <h3 className="font-bold text-sm uppercase tracking-wide text-gray-500 mb-2">Verdict</h3>
                        <p className="text-lg font-medium leading-relaxed">{data.verdict_summary}</p>
                    </div>

                    <div className="space-y-8">
                        <section>
                            <h3 className="text-xl font-bold border-b border-gray-200 pb-2 mb-3">Investment Thesis</h3>
                            <TypewriterText text={data.investment_thesis} className="leading-relaxed" />
                        </section>

                        <div className="grid md:grid-cols-2 gap-8">
                             <section>
                                <h3 className="text-xl font-bold border-b border-gray-200 pb-2 mb-3">Market Dynamics</h3>
                                <p className="text-sm leading-relaxed">{data.market_dynamics}</p>
                            </section>
                             <section>
                                <h3 className="text-xl font-bold border-b border-gray-200 pb-2 mb-3">Competitor Analysis</h3>
                                <p className="text-sm leading-relaxed">{data.competitor_analysis}</p>
                            </section>
                        </div>

                         <section>
                            <h3 className="text-xl font-bold border-b border-gray-200 pb-2 mb-3">Team Assessment</h3>
                            <p className="leading-relaxed">{data.team_assessment}</p>
                        </section>

                        <section className="bg-red-50 p-6 rounded-lg border border-red-100">
                            <h3 className="text-xl font-bold text-red-800 mb-3 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                Key Risks
                            </h3>
                            <ul className="list-disc pl-5 space-y-2 text-red-900">
                                {data.key_risks.map((risk, i) => (
                                    <li key={i}>{risk}</li>
                                ))}
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        );
    }

    return <div>Unknown document type</div>;
};
