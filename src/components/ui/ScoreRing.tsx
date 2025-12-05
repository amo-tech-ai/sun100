import React from 'react';

interface ScoreRingProps {
    score: number;
    size?: 'small' | 'large';
}

export const ScoreRing: React.FC<ScoreRingProps> = ({ score, size = 'large' }) => {
    const getColor = (val: number) => {
        if (val >= 80) return 'text-green-600 border-green-500 bg-green-50';
        if (val >= 60) return 'text-yellow-600 border-yellow-500 bg-yellow-50';
        return 'text-red-600 border-red-500 bg-red-50';
    };

    const dim = size === 'large' ? 'w-20 h-20 border-8 text-2xl' : 'w-12 h-12 border-4 text-sm';

    return (
        <div className={`${dim} rounded-full flex items-center justify-center flex-shrink-0 font-extrabold ${getColor(score)}`}>
            {score}
        </div>
    );
};
