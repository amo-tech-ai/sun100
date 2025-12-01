
import React from 'react';
import { Link } from 'react-router-dom';

const Wand2Icon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const VideoIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect y="4" x="2" width="20" height="16" rx="2"/><path d="m22 8-6 4 6 4V8Z"/></svg>;

export const MobileCtaBar: React.FC = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200 p-4 flex justify-around gap-3 md:hidden z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0) + 1rem)' }}>
        <Link to="/pitch-decks/new" className="flex-1 text-center bg-brand-orange text-white text-sm font-bold py-3 px-4 rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
            <Wand2Icon className="w-4 h-4"/> New Deck
        </Link>
        <Link to="/dashboard/video-generator" className="flex-1 text-center bg-gray-100 text-brand-blue text-sm font-bold py-3 px-4 rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2">
            <VideoIcon className="w-4 h-4"/> New Video
        </Link>
    </div>
);
