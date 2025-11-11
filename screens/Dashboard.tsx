import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedCounter from '../components/AnimatedCounter';
import useOnScreen from '../hooks/useOnScreen';
import Chart from '../components/Chart';
import { ChartData } from '../data/decks';

// --- ICONS ---
// FIX: Updated all icons to accept props to fix potential issues where they are passed a className.
const SearchIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const BellIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
const SettingsIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1 0 2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
const DollarSignIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const CpuIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>;
const CalendarIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const BriefcaseIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const WandIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/></svg>;
const UsersIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const GiftIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" x2="12" y1="22" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>;
const ChevronRightIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6"/></svg>;
const PlusIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const PresentationIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/></svg>;


// --- SUB-COMPONENTS ---

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number; prefix?: string; suffix?: string; delay: number; }> = ({ icon, label, value, prefix, suffix, delay }) => {
    const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.1 });
    return (
        <div ref={ref} className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200/80 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: `${delay}ms`}}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{label}</p>
                    <p className="text-3xl font-bold text-brand-blue mt-1">
                        <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
                    </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center flex-shrink-0">
                    {icon}
                </div>
            </div>
        </div>
    );
};

const ActionCard: React.FC<{ icon: React.ReactNode; title: string; link: string; delay: number }> = ({ icon, title, link, delay }) => {
    const [ref, isVisible] = useOnScreen<HTMLAnchorElement>({ threshold: 0.1 });
    return (
        <Link to={link} ref={ref} className={`action-card bg-white p-6 rounded-lg shadow-sm border border-gray-200/80 flex flex-col items-center justify-center text-center transform transition-all duration-300 hover:shadow-xl hover:shadow-brand-orange/20 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: `${delay}ms`}}>
            <div className="w-12 h-12 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-3">
                {icon}
            </div>
            <p className="font-semibold text-brand-blue">{title}</p>
        </Link>
    );
};

const RadialChart: React.FC<{ percentage: number; label: string }> = ({ percentage, label }) => {
    const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.5 });
    const circumference = 2 * Math.PI * 45;
    const offset = isVisible ? circumference - (percentage / 100) * circumference : circumference;

    return (
        <div ref={ref} className="flex flex-col items-center justify-center">
            <svg width="120" height="120" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#F3F4F6" strokeWidth="10" />
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform="rotate(-90 50 50)"
                    style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                />
                <text x="50" y="50" textAnchor="middle" dy=".3em" fontSize="20" fontWeight="bold" fill="#00334F">{percentage}%</text>
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#F3B93C" />
                        <stop offset="100%" stopColor="#E97A41" />
                    </linearGradient>
                </defs>
            </svg>
            <p className="mt-2 font-semibold text-gray-600 text-sm">{label}</p>
        </div>
    );
};

// --- MAIN DASHBOARD COMPONENT ---

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('AI Insights');
  const tabs = ['AI Insights', 'Community News', 'Recommended Tools'];

  const barChartData: ChartData = {
    type: 'bar',
    data: [
        { label: 'Decks', value: 7 },
        { label: 'Events', value: 3 },
        { label: 'Jobs', value: 12 },
        { label: 'Perks', value: 5 },
    ]
  };
  
  return (
    <div className="space-y-8">
       <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
        
        .action-card {
            transform-style: preserve-3d;
        }
        .action-card:hover {
            transform: perspective(1000px) rotateX(5deg) rotateY(-5deg) scale(1.05);
        }
      `}</style>

      {/* 1. Header Bar */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-brand-blue">Founder Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, Alex!</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="relative flex-grow">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input type="search" placeholder="Search jobs, decks, events..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-orange" />
            </div>
            <button className="p-2 text-gray-500 hover:text-brand-blue" aria-label="Notifications"><BellIcon/></button>
            <button className="p-2 text-gray-500 hover:text-brand-blue" aria-label="Settings"><SettingsIcon/></button>
            <img src="https://storage.googleapis.com/aistudio-hosting/docs/team1.png" alt="User avatar" className="w-10 h-10 rounded-full"/>
        </div>
      </header>

      {/* 2. Overview Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/pitch-decks">
            <StatCard icon={<PresentationIcon />} label="Pitch Decks Generated" value={5} delay={100} />
          </Link>
          <Link to="/pitch-decks">
            <StatCard icon={<WandIcon />} label="Deck Edits (Week)" value={23} delay={200} />
          </Link>
          <StatCard icon={<DollarSignIcon />} label="Funding Matches Found" value={25000} prefix="$" delay={300} />
          <Link to="/jobs">
            <StatCard icon={<BriefcaseIcon />} label="New Job Matches" value={12} delay={400} />
          </Link>
          <Link to="/dashboard/my-events">
            <StatCard icon={<CalendarIcon />} label="Events Attended (Month)" value={3} delay={500} />
          </Link>
          <StatCard icon={<CpuIcon />} label="AI Tools Used (Week)" value={7} delay={600} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <main className="lg:col-span-2 space-y-8">
            {/* 3. Personalized Feed */}
            <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200/80">
                <div className="flex border-b border-gray-200 mb-4">
                    {tabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`py-2 px-4 font-semibold text-sm transition-colors ${activeTab === tab ? 'border-b-2 border-brand-orange text-brand-orange' : 'text-gray-500 hover:text-brand-blue'}`}>
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="space-y-4">
                    {/* Mock Content */}
                    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md">
                        <div>
                            <p className="font-semibold text-brand-blue">🎯 New Event: Medellín AI Summit 2025</p>
                            <p className="text-sm text-gray-500">Connect with leaders in the LATAM AI scene.</p>
                        </div>
                        <Link to="/events" className="text-sm font-bold text-brand-orange hover:underline flex items-center gap-1">Join <ChevronRightIcon/></Link>
                    </div>
                     <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md">
                        <div>
                            <p className="font-semibold text-brand-blue">💡 Tip: Use the AI Deck Wizard to refine your narrative.</p>
                            <p className="text-sm text-gray-500">Generate headline ideas for your Vision slide.</p>
                        </div>
                        <Link to="/pitch-decks/new" className="text-sm font-bold text-brand-orange hover:underline flex items-center gap-1">Try Now <ChevronRightIcon/></Link>
                    </div>
                </div>
            </section>
            
            {/* 4. AI Activity & Data Visualization */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200/80">
                     <h3 className="font-bold text-lg text-brand-blue mb-4">Pitch Deck Progress</h3>
                    <RadialChart percentage={75} label="Project Sunspot Q3 Update" />
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200/80">
                     <h3 className="font-bold text-lg text-brand-blue mb-4">AI Tool Usage</h3>
                    <Chart chartData={barChartData} />
                </div>
            </section>
        </main>

        <aside className="space-y-8">
            {/* 5. Quick Actions */}
            <section>
                 <h3 className="font-bold text-lg text-brand-blue mb-4">Quick Actions</h3>
                 <div className="grid grid-cols-2 gap-4">
                     <ActionCard icon={<WandIcon />} title="Create New Deck" link="/pitch-decks/new" delay={100} />
                     <ActionCard icon={<CalendarIcon />} title="Find AI Events" link="/events" delay={200} />
                     <ActionCard icon={<UsersIcon />} title="Join a Founder Circle" link="#" delay={300} />
                     <ActionCard icon={<GiftIcon />} title="Claim Startup Perks" link="/perks" delay={400} />
                 </div>
            </section>
            
            {/* 6. Bottom Insights Panel */}
            <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200/80 space-y-4">
                <h3 className="font-bold text-lg text-brand-blue">This Week's Insights</h3>
                <div className="p-3 bg-gray-50 rounded-md">
                    <p className="font-semibold text-sm text-brand-blue">Your startup has gained 35% visibility this week.</p>
                </div>
                 <div className="p-3 bg-gray-50 rounded-md">
                    <p className="font-semibold text-sm text-brand-blue">3 new investors viewed your pitch deck.</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                    <p className="font-semibold text-sm text-brand-blue">AI recommends attending the upcoming Funding Bootcamp.</p>
                </div>
            </section>
        </aside>
      </div>

      {/* 7. Mobile CTA Bar */}
      <div className="md:hidden sticky bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-4 border-t border-gray-200 flex justify-center">
        <Link to="/pitch-decks/new" className="w-full flex items-center justify-center gap-2 bg-brand-orange text-white font-bold py-3 px-6 rounded-lg shadow-lg">
            <PlusIcon />
            Create New Deck
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
