
import React from 'react';

interface FilterPanelProps {
    selectedTypes: string[];
    onTypeChange: (val: string) => void;
    selectedStages: string[];
    onStageChange: (val: string) => void;
    selectedGeos: string[];
    onGeoChange: (val: string) => void;
}

const FilterSection = ({ title, options, selected, onChange }: { title: string, options: string[], selected: string[], onChange: (val: string) => void }) => (
    <div className="mb-6 last:mb-0">
        <h4 className="font-bold text-sm text-gray-900 mb-3 uppercase tracking-wider">{title}</h4>
        <div className="space-y-2">
            {options.map(opt => (
                <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-200 ${selected.includes(opt) ? 'bg-brand-orange border-brand-orange shadow-sm' : 'border-gray-300 bg-white group-hover:border-gray-400'}`}>
                        {selected.includes(opt) && <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                    </div>
                    <input type="checkbox" className="hidden" checked={selected.includes(opt)} onChange={() => onChange(opt)} />
                    <span className={`text-sm transition-colors ${selected.includes(opt) ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>{opt.replace('_', ' ')}</span>
                </label>
            ))}
        </div>
    </div>
);

export const FilterPanel: React.FC<FilterPanelProps> = ({
    selectedTypes, onTypeChange,
    selectedStages, onStageChange,
    selectedGeos, onGeoChange
}) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                    Filters
                </h3>
                {(selectedTypes.length > 0 || selectedStages.length > 0 || selectedGeos.length > 0) && (
                    <button 
                        onClick={() => { 
                            selectedTypes.forEach(t => onTypeChange(t)); // Hacky reset, better to pass reset fn
                            // In real app, pass a reset function
                        }} 
                        className="text-xs text-brand-orange font-semibold hover:underline"
                    >
                        Reset
                    </button>
                )}
            </div>
            
            <FilterSection 
                title="Investor Type" 
                options={['vc', 'accelerator', 'angel_group', 'corporate_vc']} 
                selected={selectedTypes} 
                onChange={onTypeChange} 
            />
            
            <div className="border-t border-gray-100 my-4"></div>

            <FilterSection 
                title="Stage" 
                options={['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Growth']} 
                selected={selectedStages} 
                onChange={onStageChange} 
            />

            <div className="border-t border-gray-100 my-4"></div>

            <FilterSection 
                title="Region" 
                options={['US', 'Europe', 'Global', 'APAC', 'China', 'India']} 
                selected={selectedGeos} 
                onChange={onGeoChange} 
            />
        </div>
    );
};
