import React from 'react';
import { ChartData } from '../data/decks';

interface ChartProps {
    chartData: ChartData;
}

const Chart: React.FC<ChartProps> = ({ chartData }) => {
    if (!chartData || chartData.type !== 'bar' || !chartData.data || chartData.data.length === 0) {
        return null;
    }

    const maxValue = Math.max(...chartData.data.map(d => d.value), 0);
    const formatValue = (value: number) => {
        if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
        if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
        return value.toString();
    };

    return (
        <div className="w-full h-full flex flex-col justify-end space-y-2 p-4">
            <div className="flex-grow flex items-end justify-around gap-4 border-b border-gray-300 pb-2">
                {chartData.data.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end group">
                         <div 
                            className="text-sm font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ animation: `fadeIn 0.5s ease ${index * 0.1 + 0.5}s forwards` }}
                        >
                            {formatValue(item.value)}
                        </div>
                        <div
                            className="w-full bg-[#E87C4D] rounded-t-md transition-all duration-500 ease-out"
                            style={{ 
                                height: `${(item.value / maxValue) * 100}%`,
                                animation: `growUp 0.5s ease-out ${index * 0.1}s forwards`,
                                transformOrigin: 'bottom'
                             }}
                        >
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-around gap-4">
                {chartData.data.map((item, index) => (
                    <div key={index} className="flex-1 text-center">
                        <p 
                            className="text-sm font-medium text-gray-600 truncate"
                            style={{ animation: `fadeIn 0.5s ease ${index * 0.1 + 0.3}s forwards`, opacity: 0 }}
                        >
                            {item.label}
                        </p>
                    </div>
                ))}
            </div>
             <style>{`
                @keyframes growUp {
                    from { transform: scaleY(0); }
                    to { transform: scaleY(1); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default Chart;