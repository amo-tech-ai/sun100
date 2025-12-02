
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Investor } from '../services/vcService';

interface BadgeProps {
    children: React.ReactNode;
    color?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, color = 'blue' }) => {
    const colors: {[key: string]: string} = {
        blue: 'bg-blue-50 text-blue-700 border-blue-200',
        green: 'bg-green-50 text-green-700 border-green-200',
        purple: 'bg-purple-50 text-purple-700 border-purple-200',
        orange: 'bg-orange-50 text-orange-700 border-orange-200',
    };
    return (
        <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border ${colors[color] || colors.blue}`}>
            {children}
        </span>
    );
};

interface VCCardProps {
    investor: Investor;
    score?: number; // Optional prop to pass a real AI match score later
}

export const VCCard: React.FC<VCCardProps> = ({ investor, score }) => {
    
    // Generate a stable hypothetical score if one isn't provided
    const matchScore = score || useMemo(() => {
        // Deterministic pseudo-random score based on ID characters for demo consistency
        const seed = investor.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return 70 + (seed % 29); // Generates a score between 70 and 98
    }, [investor.id]);

    const formatCurrency = (value: number) => {
        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
        return value.toString();
    };

    const formatRange = (min?: number, max?: number) => {
        if (!min && !max) return 'Undisclosed';
        const minStr = min ? formatCurrency(min) : '0';
        const maxStr = max ? formatCurrency(max) : 'Unlimited';
        return `${minStr} - ${maxStr}`;
    };

    const scoreColor = matchScore >= 90 ? 'text-green-700 bg-green-50 border-green-200' : 
                       matchScore >= 80 ? 'text-blue-700 bg-blue-50 border-blue-200' : 
                       'text-yellow-700 bg-yellow-50 border-yellow-200';

    return (
        <Link to={`/directory/${investor.id}`} className="block group h-full">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg hover:border-brand-orange/30 transition-all duration-300 h-full flex flex-col relative overflow-hidden">
                
                {/* Header with Match Score */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center p-2 flex-shrink-0 group-hover:scale-105 transition-transform">
                            {investor.logo_url ? (
                                <img src={investor.logo_url} alt={investor.name} className="w-full h-full object-contain" />
                            ) : (
                                <span className="text-xl font-bold text-gray-400">{investor.name[0]}</span>
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-blue transition-colors line-clamp-1">
                                {investor.name}
                            </h3>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-1">
                                {investor.type.replace('_', ' ')} • {investor.geographies[0]}
                            </p>
                        </div>
                    </div>
                    
                    {/* Match Score Badge */}
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${scoreColor}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-bold">{matchScore}% Match</span>
                    </div>
                </div>
                
                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow leading-relaxed">
                    {investor.description}
                </p>
                
                {/* Check Size Range */}
                <div className="mb-5 flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded-md border border-gray-100">
                    <span className="text-gray-400">💰</span>
                    <span className="font-semibold">Check Size:</span>
                    <span>{formatRange(investor.min_check_size, investor.max_check_size)}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                    {investor.stages.slice(0, 2).map(stage => (
                        <Badge key={stage} color="green">{stage}</Badge>
                    ))}
                    {investor.specialties.slice(0, 2).map(spec => (
                        <Badge key={spec} color="blue">{spec}</Badge>
                    ))}
                    {investor.specialties.length > 2 && (
                        <span className="text-xs text-gray-400 py-0.5 px-1">+{investor.specialties.length - 2} more</span>
                    )}
                </div>
                
                {/* Footer */}
                <div className="pt-4 border-t border-gray-50 flex justify-end items-center text-xs text-gray-500 font-medium">
                    <span className="group-hover:translate-x-1 transition-transform text-brand-orange flex items-center gap-1">
                        View Full Profile <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </span>
                </div>
            </div>
        </Link>
    );
};
