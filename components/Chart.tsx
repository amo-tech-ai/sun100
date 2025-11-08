import React from 'react';
import { ChartData } from '../data/decks';

interface ChartProps {
    chartData: ChartData;
}

const BarChart: React.FC<{ data: { label: string; value: number }[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value), 0);
    const formatValue = (value: number) => {
        if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
        if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
        return value.toString();
    };

    return (
        <div className="w-full h-full flex flex-col justify-end space-y-2 p-4">
            <div className="flex-grow flex items-end justify-around gap-4 border-b border-gray-300 pb-2">
                {data.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end group">
                         <div 
                            className="text-sm font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ animation: `fadeIn 0.5s ease ${index * 0.1 + 0.5}s forwards`, opacity: 0 }}
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
                {data.map((item, index) => (
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
        </div>
    );
};


const PieChart: React.FC<{ data: { label: string; value: number }[] }> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return null;

    const colors = ['#E87C4D', '#FBBF77', '#6B7280', '#9CA3AF', '#374151', '#F9FAFB'];
    
    let cumulativePercent = 0;
    const gradientParts = data.map((item, i) => {
        const percent = (item.value / total) * 100;
        const part = `${colors[i % colors.length]} ${cumulativePercent}% ${cumulativePercent + percent}%`;
        cumulativePercent += percent;
        return part;
    });

    const pieStyle = {
        background: `conic-gradient(${gradientParts.join(', ')})`,
        animation: 'fadeIn 1s ease',
    };

    return (
        <div className="w-full h-full flex items-center justify-center gap-8 p-4">
            <div className="w-48 h-48 rounded-full" style={pieStyle}></div>
            <div className="flex flex-col gap-2">
                {data.map((item, i) => (
                    <div key={i} className="flex items-center gap-2" style={{ animation: `fadeIn 0.5s ease ${i * 0.1 + 0.5}s forwards`, opacity: 0 }}>
                        <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: colors[i % colors.length] }}></div>
                        <span className="text-sm font-medium text-gray-700">{item.label} ({item.value}%)</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


const Chart: React.FC<ChartProps> = ({ chartData }) => {
    if (!chartData || !chartData.data || chartData.data.length === 0) {
        return null;
    }

    const renderChart = () => {
        switch (chartData.type) {
            case 'bar':
                return <BarChart data={chartData.data} />;
            case 'pie':
                return <PieChart data={chartData.data} />;
            default:
                return null;
        }
    }

    return (
        <div className="w-full h-full">
            {renderChart()}
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

export default React.memo(Chart);