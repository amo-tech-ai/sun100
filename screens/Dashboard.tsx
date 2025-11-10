import React from 'react';
import { Link } from 'react-router-dom';

// --- Icons ---
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const BookmarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>;
const FileTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>;
const PlusSquareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>;
const FolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const MessageSquareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const CalendarDaysIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>;


const metricCards = [
  { icon: <CalendarIcon />, label: "Events Registered", value: "0" },
  { icon: <BriefcaseIcon />, label: "Job Applications", value: "0" },
  { icon: <BookmarkIcon />, label: "Saved Opportunities", value: "0" },
  { icon: <FileTextIcon />, label: "Pitch Decks", value: "0" },
];

const quickActions = [
  { icon: <PlusSquareIcon />, label: "Generate Pitch Deck", path: "/pitch-decks/new" },
  { icon: <FolderIcon />, label: "My Decks", path: "/pitch-decks" },
  { icon: <UsersIcon />, label: "Find Mentors", path: "#" },
  { icon: <MessageSquareIcon />, label: "Join Chat", path: "#" },
  { icon: <UserIcon />, label: "Update Profile", path: "/startup-wizard" },
  { icon: <ClockIcon />, label: "Book Office Hours", path: "#" },
];


const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* --- Hero Header --- */}
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-200/80">
        <h1 className="text-2xl lg:text-3xl font-bold font-heading text-gray-800">Welcome back 👋</h1>
        <p className="mt-1 text-lg text-gray-600">Track your startup journey and stay connected.</p>
        
        <div className="mt-6">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-gray-700">Next Step: Complete AI Analysis</span>
                <span className="text-sm font-semibold text-[#E87C4D]">25%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-[#E87C4D] h-2.5 rounded-full" style={{ width: '25%' }}></div>
            </div>
        </div>
        
        <Link 
          to="/startup-wizard" 
          className="inline-block mt-6 bg-[#E87C4D] text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E87C4D]"
        >
            Continue Wizard
        </Link>
      </div>

      {/* --- Metrics Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map(card => (
          <div key={card.label} className="bg-white p-5 rounded-lg shadow-md border border-gray-200/80 flex items-start gap-4">
            <div className="text-[#E87C4D] mt-1">{card.icon}</div>
            <div>
              <p className="text-3xl font-bold font-heading text-gray-800">{card.value}</p>
              <p className="text-sm text-gray-500 font-semibold">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- Quick Actions --- */}
      <div>
        <h2 className="text-2xl font-bold font-heading text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map(action => (
            <Link 
              key={action.label} 
              to={action.path}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200/80 text-center flex flex-col items-center justify-center hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <div className="text-[#E87C4D] mb-2">{action.icon}</div>
              <span className="text-sm font-semibold text-gray-700">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
      
      {/* --- Dynamic Modules --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200/80 text-center flex flex-col items-center justify-center">
            <div className="text-gray-300 mb-4"><CalendarDaysIcon/></div>
            <h3 className="text-lg font-bold text-gray-800">No upcoming events yet</h3>
            <p className="text-gray-500 mt-1 mb-4">Register for an event to see it here.</p>
            <Link 
              to="/events" 
              className="inline-block bg-gray-100 text-gray-800 font-bold py-2 px-5 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Browse Events
            </Link>
        </div>
        {/* Recommended Jobs */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200/80 text-center flex flex-col items-center justify-center">
            <div className="text-gray-300 mb-4"><BriefcaseIcon/></div>
            <h3 className="text-lg font-bold text-gray-800">No recommended jobs</h3>
            <p className="text-gray-500 mt-1 mb-4">Complete your profile to get job suggestions.</p>
            <Link 
              to="/jobs" 
              className="inline-block bg-gray-100 text-gray-800 font-bold py-2 px-5 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Browse Jobs
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;