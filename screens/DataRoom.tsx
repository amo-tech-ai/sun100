
import React, { useState } from 'react';
import { DataRoomAudit, DataRoomFile } from '../services/ai/types';
import { auditDataRoom } from '../services/ai/dataroom';
import { Link } from 'react-router-dom';

// Icons
const FolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>;
const FileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>;
const AlertIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;

const DataRoom: React.FC = () => {
    const [files, setFiles] = useState<DataRoomFile[]>([
        { id: '1', name: 'Pitch_Deck_v3.pdf', category: 'Uncategorized', size: '2.4 MB', uploadDate: '2024-08-20' },
        { id: '2', name: 'Cap_Table_Draft.xlsx', category: 'Financials', size: '45 KB', uploadDate: '2024-08-22' },
        { id: '3', name: 'Incorporation_Docs.pdf', category: 'Legal', size: '1.2 MB', uploadDate: '2024-08-15' }
    ]);
    const [auditResult, setAuditResult] = useState<DataRoomAudit | null>(null);
    const [isAuditing, setIsAuditing] = useState(false);

    // Mock Upload
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const newFile: DataRoomFile = {
                id: Date.now().toString(),
                name: e.target.files[0].name,
                category: 'Uncategorized',
                size: `${(e.target.files[0].size / 1024 / 1024).toFixed(2)} MB`,
                uploadDate: new Date().toISOString().split('T')[0]
            };
            setFiles([...files, newFile]);
        }
    };

    const handleAudit = async () => {
        setIsAuditing(true);
        try {
            const result = await auditDataRoom(files);
            setAuditResult(result);
        } catch (err) {
            console.error(err);
            alert("Audit failed. Please try again.");
        } finally {
            setIsAuditing(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 border-green-500 bg-green-50';
        if (score >= 50) return 'text-yellow-600 border-yellow-500 bg-yellow-50';
        return 'text-red-600 border-red-500 bg-red-50';
    };

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen bg-[#FBF8F5]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-brand-blue flex items-center gap-2">
                        <LockIcon /> Investor Data Room
                    </h1>
                    <p className="text-gray-500 text-sm">Securely organize documents for due diligence.</p>
                </div>
                <div className="flex gap-3">
                    <label className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-2">
                        <UploadIcon />
                        Upload File
                        <input type="file" className="hidden" onChange={handleFileUpload} />
                    </label>
                    <button 
                        onClick={handleAudit}
                        disabled={isAuditing}
                        className="bg-brand-orange text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {isAuditing ? 'Analyzing...' : 'Run AI Audit'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: File Manager */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between">
                        <h3 className="font-bold text-gray-700">Files ({files.length})</h3>
                        <span className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Drag & Drop Supported</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {files.length === 0 ? (
                            <div className="p-12 text-center text-gray-400">No files uploaded yet.</div>
                        ) : (
                            files.map(file => (
                                <div key={file.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                                            <FileIcon />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">{file.name}</p>
                                            <p className="text-xs text-gray-400">{file.size} • {file.uploadDate}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">{file.category}</span>
                                        <button 
                                            onClick={() => setFiles(files.filter(f => f.id !== file.id))}
                                            className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right: Audit Results */}
                <div className="lg:col-span-1 space-y-6">
                    {auditResult ? (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 animate-fade-in-up">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-gray-900">Readiness Score</h3>
                                <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold text-sm ${getScoreColor(auditResult.score)}`}>
                                    {auditResult.score}
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Missing Critical Items</h4>
                                    <ul className="space-y-2">
                                        {auditResult.missing_items.length > 0 ? auditResult.missing_items.map((item, i) => (
                                            <li key={i} className="text-sm text-red-700 bg-red-50 p-2 rounded flex items-start gap-2">
                                                <span className="mt-0.5"><AlertIcon /></span> {item}
                                            </li>
                                        )) : <p className="text-sm text-green-600">All critical items present!</p>}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">AI Recommendations</h4>
                                    <ul className="space-y-2">
                                        {auditResult.recommendations.map((rec, i) => (
                                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                                <span className="text-brand-orange mt-0.5">•</span> {rec}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
                            <h3 className="font-bold text-blue-900 mb-2">AI Due Diligence</h3>
                            <p className="text-sm text-blue-700 mb-4">Upload your documents and let Gemini 3 audit your data room for missing files and red flags.</p>
                            {!isAuditing && <div className="w-16 h-16 bg-white/50 rounded-full mx-auto flex items-center justify-center text-blue-300"><LockIcon /></div>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DataRoom;
