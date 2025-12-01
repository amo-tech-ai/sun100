
import React from 'react';

type EmptyStateType = 'customers' | 'deals' | 'tasks' | 'search';

interface EmptyStateProps {
    title: string;
    description: string;
    action?: React.ReactNode;
    type?: EmptyStateType;
    compact?: boolean;
}

const Illustrations: Record<EmptyStateType, React.ReactNode> = {
    customers: (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="50" fill="#F3F4F6"/>
            <circle cx="60" cy="60" r="35" fill="#E5E7EB"/>
            <path d="M60 35C51.7157 35 45 41.7157 45 50C45 58.2843 51.7157 65 60 65C68.2843 65 75 58.2843 75 50C75 41.7157 68.2843 35 60 35Z" fill="#9CA3AF"/>
            <path d="M35 85C35 71.1929 46.1929 60 60 60C73.8071 60 85 71.1929 85 85V90H35V85Z" fill="#6B7280"/>
            <circle cx="85" cy="35" r="12" fill="#E87C4D"/>
            <path d="M81 35H89" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M85 31V39" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    ),
    deals: (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="30" y="20" width="60" height="80" rx="4" fill="#F3F4F6"/>
            <path d="M30 24C30 21.7909 31.7909 20 34 20H86C88.2091 20 90 21.7909 90 24V40H30V24Z" fill="#E5E7EB"/>
            <circle cx="60" cy="60" r="15" stroke="#9CA3AF" strokeWidth="3"/>
            <path d="M60 28H80" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
            <rect x="40" y="80" width="40" height="4" rx="2" fill="#D1D5DB"/>
            <rect x="40" y="90" width="25" height="4" rx="2" fill="#D1D5DB"/>
            <path d="M85 85L95 95" stroke="#E87C4D" strokeWidth="4" strokeLinecap="round"/>
            <path d="M95 85L85 95" stroke="#E87C4D" strokeWidth="4" strokeLinecap="round"/>
        </svg>
    ),
    tasks: (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="35" y="25" width="50" height="70" rx="4" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="2"/>
            <circle cx="45" cy="40" r="4" fill="#E87C4D"/>
            <rect x="55" y="38" width="20" height="4" rx="2" fill="#D1D5DB"/>
            <circle cx="45" cy="60" r="4" fill="#9CA3AF"/>
            <rect x="55" y="58" width="20" height="4" rx="2" fill="#E5E7EB"/>
            <circle cx="45" cy="80" r="4" fill="#9CA3AF"/>
            <rect x="55" y="78" width="20" height="4" rx="2" fill="#E5E7EB"/>
            <path d="M75 75L95 95" stroke="#E87C4D" strokeWidth="6" strokeLinecap="round" opacity="0.2"/>
        </svg>
    ),
    search: (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="55" cy="55" r="30" stroke="#E5E7EB" strokeWidth="4"/>
            <path d="M78 78L95 95" stroke="#E5E7EB" strokeWidth="4" strokeLinecap="round"/>
            <circle cx="55" cy="55" r="10" fill="#F3F4F6"/>
            <path d="M45 35Q55 25 65 35" stroke="#E87C4D" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    )
};

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action, type = 'generic', compact = false }) => {
    return (
        <div className={`flex flex-col items-center justify-center text-center p-6 ${compact ? 'py-8' : 'py-16'}`}>
            <div className={`mb-4 transition-transform hover:scale-105 duration-500 ${compact ? 'scale-75' : ''}`}>
                {Illustrations[type]}
            </div>
            <h3 className={`font-bold text-gray-900 ${compact ? 'text-sm' : 'text-lg'} mb-2`}>{title}</h3>
            <p className={`text-gray-500 ${compact ? 'text-xs' : 'text-sm'} max-w-xs mx-auto mb-6`}>{description}</p>
            {action && (
                <div className="mt-2">
                    {action}
                </div>
            )}
        </div>
    );
};
