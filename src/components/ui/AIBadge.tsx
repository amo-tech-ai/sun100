import React from 'react';
import { Sparkles } from 'lucide-react';

export const AIBadge: React.FC = () => (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border border-purple-200 uppercase tracking-wide ml-2">
        <Sparkles className="w-2.5 h-2.5" /> AI
    </span>
);
