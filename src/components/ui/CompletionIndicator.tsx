import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface CompletionIndicatorProps {
    filled: boolean;
}

export const CompletionIndicator: React.FC<CompletionIndicatorProps> = ({ filled }) => {
    if (!filled) return null;
    return (
        <span className="ml-2 text-green-500" title="Completed">
            <CheckCircle2 className="w-4 h-4" />
        </span>
    );
};
