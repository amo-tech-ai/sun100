import React from 'react';
import { TableData } from '../data/decks';

interface TableProps {
    tableData: TableData;
}

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const Table: React.FC<TableProps> = ({ tableData }) => {
    if (!tableData) return null;

    if (tableData.type === 'pricing' && tableData.tiers) {
        const allFeatures = [...new Set(tableData.tiers.flatMap(tier => tier.features))];
        return (
            <div className="w-full h-full p-4 overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                            {tableData.tiers.map((tier, index) => (
                                <th key={index} scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <span className="block text-base font-bold text-[#E87C4D]">{tier.name}</span>
                                    <span className="block text-sm text-gray-800">{tier.price}</span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {allFeatures.map((feature, featureIndex) => (
                            <tr key={featureIndex} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{feature}</td>
                                {tableData.tiers!.map((tier, tierIndex) => (
                                    <td key={tierIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                        {tier.features.includes(feature) && (
                                            <div className="flex justify-center">
                                                <CheckIcon />
                                            </div>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (tableData.type === 'comparison' && tableData.headers && tableData.rows) {
        return (
             <div className="w-full h-full p-4 overflow-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                    <thead className="bg-brand-blue text-white">
                        <tr>
                            {tableData.headers.map((header, index) => (
                                <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-r border-gray-500 last:border-r-0">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tableData.rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50">
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className={`px-6 py-4 text-sm text-gray-700 border-r border-gray-200 last:border-r-0 ${cellIndex === 0 ? 'font-bold text-brand-blue' : ''}`}>
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return null;
};

export default React.memo(Table);