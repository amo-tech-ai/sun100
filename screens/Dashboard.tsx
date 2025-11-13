
import React from 'react';
import { Link } from 'react-router-dom';

// --- ICONS ---
const Wand2Icon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const CalendarIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const BriefcaseIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const GiftIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" x2="12" y1="22" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>;
const PresentationIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/></svg>;
const VideoIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect y="4" x="2" width="20" height="16" rx="2"/><path d="m22 8-6 4 6 4V8Z"/></svg>;


const ActionCard: React.FC<{ title: string; description: string; link: string; icon: React.ReactNode; }> = ({ title, description, link, icon }) => (
    <Link to={link} className="block bg-white p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:border-brand-orange/50 transform hover:-translate-y-1 transition-all duration-300">
        <div className="w-12 h-12 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-brand-blue">{title}</h3>
        <p className="text-gray-500 mt-2">{description}</p>
    </Link>
);


const Dashboard: React.FC = () => {
    return (
        <div className="space-y-12">
            {/* Header */}
            <header>
                <h1 className="text-3xl lg:text-4xl font-bold text-brand-blue">Welcome back, Founder!</h1>
                <p className="text-gray-500 mt-2 text-lg">What will you build today?</p>
            </header>

            {/* Quick Actions */}
            <section>
                <h2 className="text-2xl font-bold text-brand-blue mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ActionCard 
                        title="Create New Deck"
                        description="Use our AI wizard to generate a professional pitch deck in minutes."
                        link="/pitch-decks/new"
                        icon={<Wand2Icon />}
                    />
                    <ActionCard 
                        title="Manage Decks"
                        description="View, edit, and present all of your saved pitch decks."
                        link="/pitch-decks"
                        icon={<PresentationIcon />}
                    />
                     <ActionCard 
                        title="Generate Video"
                        description="Create stunning short videos from text prompts with our AI video tool."
                        link="/dashboard/video-generator"
                        icon={<VideoIcon />}
                    />
                </div>
            </section>
            
             {/* Community & Resources */}
            <section>
                <h2 className="text-2xl font-bold text-brand-blue mb-6">Community & Resources</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ActionCard 
                        title="My Events Dashboard"
                        description="Manage your created events, track bookings, and see analytics."
                        link="/dashboard/my-events"
                        icon={<CalendarIcon />}
                    />
                    <ActionCard 
                        title="Find a Job"
                        description="Explore career opportunities at top AI startups in our community."
                        link="/jobs"
                        icon={<BriefcaseIcon />}
                    />
                    <ActionCard 
                        title="Explore Perks"
                        description="Access exclusive deals and credits on essential startup software."
                        link="/perks"
                        icon={<GiftIcon />}
                    />
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
