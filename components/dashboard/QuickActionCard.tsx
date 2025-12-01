
import React from 'react';
import { Link } from 'react-router-dom';

export const QuickActionCard: React.FC<{ title: string; link: string; icon: React.ReactNode; color?: string }> = ({ title, link, icon, color = "brand-orange" }) => (
    <Link to={link} className={`group block bg-white p-5 rounded-2xl border border-gray-200/60 shadow-sm text-left transition-all duration-300 hover:shadow-lg hover:border-${color}/30 hover:-translate-y-1`}>
        <div className={`w-12 h-12 rounded-xl bg-${color}/10 text-${color} flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110`}>
            {icon}
        </div>
        <h3 className={`text-sm font-bold text-brand-blue group-hover:text-${color} transition-colors`}>{title}</h3>
    </Link>
);
