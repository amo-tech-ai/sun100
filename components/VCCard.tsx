
import React from 'react';
import { Link } from 'react-router-dom';
import { Investor } from '../services/vcService';

const Badge = ({ children, color = 'blue' }: { children: React.ReactNode, color?: string }) => {
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

export const VCCard: React.FC<{ investor: Investor }> = ({ investor }) => {
    return (
        <Link to={`/directory/${investor.id}`} className="block group h-full">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg hover:border-brand-orange/30 transition-all duration-300 h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-brand-orange" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
                </div>

                <div className="flex items-start gap-4 mb-4">
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
                
                <p className="text-sm text-gray-600 line-clamp-2 mb-5 flex-grow leading-relaxed">
                    {investor.description}
                </p>
                
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
                
                <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-500 font-medium">
                    <span>
                       Avg Check: <span className="text-gray-900">{investor.min_check_size ? `$${(investor.min_check_size/1000).toFixed(0)}k+` : 'Undisclosed'}</span>
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform text-brand-orange">
                        View Profile &rarr;
                    </span>
                </div>
            </div>
        </Link>
    );
};
