
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// --- ICONS ---
const CalendarIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const TicketIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 9a3 3 0 0 1 0 6v1a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-1a3 3 0 0 1 0-6V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>;
const CheckSquareIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>;
const ChevronLeftIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m15 18-6-6 6-6"/></svg>;
const ChevronRightIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6"/></svg>;

// --- MOCK DATA ---
const revenueData = [34805, 56320, 45000, 51000, 48000, 58000, 62000, 55000];
const popularEvents = [
    { name: 'Music', percentage: 40, events: 20000 },
    { name: 'Sports', percentage: 35, events: 17500 },
    { name: 'Fashion', percentage: 15, events: 12500 },
];
const allEvents = [
    { title: "Champions League Screening Night", location: "SkyDome Stadium, Toronto, ON", date: "Apr 20, 2029", price: 30, category: "Sport", image: "https://images.unsplash.com/photo-1593321598482-f67f52c1032b?q=80&w=800" },
    { title: "Culinary Delights Festival", location: "Gourmet Plaza, San Francisco, CA", date: "Mar 3, 2029", price: 40, category: "Food & Culinary", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800" },
    { title: "Artistry Unveiled: Modern Art Expo", location: "Vogue Hall, Los Angeles, CA", date: "Mar 10, 2029", price: 110, category: "Fashion", image: "https://images.unsplash.com/photo-1501430654243-c934cec2e1c0?q=80&w=800" },
];
const recentBookings = [
    { id: 'INV10011', date: '2029/02/15 10:30 AM', name: 'Jackson Moore', event: 'Symphony Under the Stars', qty: 2, amount: 100, status: 'Confirmed' },
    { id: 'INV10012', date: '2029/02/16 01:45 PM', name: 'Alicia Smithson', event: 'Runway Revolution 2024', qty: 1, amount: 120, status: 'Pending' },
    { id: 'INV10013', date: '2029/02/17 01:15 PM', name: 'Marcus Rawless', event: 'Global Wellness Summit', qty: 3, amount: 240, status: 'Confirmed' },
    { id: 'INV10014', date: '2029/02/18 09:00 AM', name: 'Patrick Cooper', event: 'Champions League Screening Night', qty: 4, amount: 120, status: 'Cancelled' },
];
const recentActivity = [
    { action: "reviewed a refund request", user: "Admin Stefanus Weber", details: "for Invoice ID: 'INV1004'", time: "05:30 PM" },
    { action: "updated ticket prices for the event", user: "Wella McGrath", details: "'Runway Revolution 2024' under the category 'Fashion'", time: "02:00 PM" },
    { action: "canceled a booking with Invoice ID", user: "Patrick Cooper", details: "'INV10014'", time: "11:15 AM" },
    { action: "created a new event", user: "Andrew Shaw", details: "'Symphony Under the Stars' under the category 'Music'", time: "09:30 AM" },
];

// --- SUB-COMPONENTS ---

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; }> = ({ icon, label, value }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center flex-shrink-0">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-brand-blue">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        </div>
    </div>
);

const DonutChart: React.FC = () => {
    // Mock data for the donut chart
    const total = 2780;
    const soldOut = 1251;
    const fullyBooked = 834;
    const available = 695;
    
    const soldOutPercent = (soldOut / total) * 100;
    const fullyBookedPercent = (fullyBooked / total) * 100;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg text-brand-blue mb-4">Ticket Sales</h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative w-36 h-36">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e6e6e6" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#4F46E5" strokeWidth="3" strokeDasharray={`${fullyBookedPercent}, 100`} transform="rotate(-90 18 18)" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E87C4D" strokeWidth="3" strokeDasharray={`${soldOutPercent}, 100`} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xs text-gray-500">Total Ticket</span>
                        <span className="font-bold text-xl text-brand-blue">{total.toLocaleString()}</span>
                    </div>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#E87C4D]"></div>Sold Out: <span className="font-semibold">{soldOut.toLocaleString()} (45%)</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#4F46E5]"></div>Fully Booked: <span className="font-semibold">{fullyBooked.toLocaleString()} (30%)</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#e6e6e6]"></div>Available: <span className="font-semibold">{available.toLocaleString()} (25%)</span></div>
                </div>
            </div>
        </div>
    );
};

const RevenueChart: React.FC = () => {
    const maxRevenue = Math.max(...revenueData) * 1.2;
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-brand-blue">Sales Revenue</h3>
                <span className="text-sm font-semibold text-gray-500">Last 8 Months</span>
            </div>
            <div className="h-40 flex items-end gap-2">
                {revenueData.map((value, i) => (
                    <div key={i} className="flex-1 h-full flex items-end">
                        <div className="w-full bg-brand-orange/20 hover:bg-brand-orange/50 rounded-t-md transition-colors" style={{ height: `${(value/maxRevenue) * 100}%` }}></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const statusColors: { [key: string]: string } = {
    Confirmed: 'bg-green-100 text-green-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Cancelled: 'bg-red-100 text-red-700',
}

// --- MAIN DASHBOARD COMPONENT ---

const MyEvents: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-brand-blue">My Events</h1>
            <p className="text-gray-500 mt-1">Here is an overview of your events dashboard.</p>
        </div>
        <Link to="/dashboard/events/new" className="inline-block bg-brand-orange text-white font-bold py-2 px-5 rounded-lg hover:bg-opacity-90 transition-colors duration-200 shadow-md">
            + Create Event
        </Link>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <main className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={<CalendarIcon />} label="Upcoming Events" value={345} />
                <StatCard icon={<CheckSquareIcon />} label="Total Bookings" value={1798} />
                <StatCard icon={<TicketIcon />} label="Tickets Sold" value={1250} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="md:col-span-2"><DonutChart /></div>
                <div className="md:col-span-3"><RevenueChart /></div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg text-brand-blue mb-4">Popular Events</h3>
                {popularEvents.map(event => (
                    <div key={event.name} className="flex items-center gap-4 py-2">
                        <span className="w-1/4 font-semibold text-gray-600">{event.name}</span>
                        <div className="w-2/4 bg-gray-200 rounded-full h-2.5">
                            <div className="bg-brand-orange h-2.5 rounded-full" style={{width: `${event.percentage}%`}}></div>
                        </div>
                        <span className="w-1/4 text-right font-semibold text-gray-800">{event.events.toLocaleString()} Events</span>
                    </div>
                ))}
            </div>

            <div>
                <h3 className="font-bold text-lg text-brand-blue mb-4">All Events</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {allEvents.map(event => (
                        <div key={event.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
                            <img src={event.image} alt={event.title} className="w-full h-32 object-cover" />
                            <div className="p-4">
                                <span className="text-xs font-semibold bg-brand-orange/10 text-brand-orange py-1 px-2 rounded-md">{event.category}</span>
                                <h4 className="font-bold text-brand-blue mt-2">{event.title}</h4>
                                <p className="text-sm text-gray-500">{event.location}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-sm text-gray-500">{event.date}</span>
                                    <span className="font-bold text-lg text-brand-blue">${event.price}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg text-brand-blue mb-4">Recent Bookings</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase">
                            <tr>
                                <th className="py-2 px-4">Invoice ID</th>
                                <th className="py-2 px-4">Date</th>
                                <th className="py-2 px-4">Name</th>
                                <th className="py-2 px-4">Event</th>
                                <th className="py-2 px-4 text-right">Qty</th>
                                <th className="py-2 px-4 text-right">Amount</th>
                                <th className="py-2 px-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentBookings.map(booking => (
                                <tr key={booking.id} className="border-b border-gray-100">
                                    <td className="py-3 px-4 font-semibold text-gray-800">{booking.id}</td>
                                    <td className="py-3 px-4 text-gray-600">{booking.date}</td>
                                    <td className="py-3 px-4 text-gray-600">{booking.name}</td>
                                    <td className="py-3 px-4 text-gray-600">{booking.event}</td>
                                    <td className="py-3 px-4 text-right text-gray-600">{booking.qty}</td>
                                    <td className="py-3 px-4 text-right font-semibold text-gray-800">${booking.amount}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[booking.status]}`}>{booking.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>

        {/* Right Sidebar Column */}
        <aside className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg text-brand-blue mb-4">Upcoming Event</h3>
                <div className="rounded-lg overflow-hidden mb-4">
                    <img src="https://images.unsplash.com/photo-1578736641334-6493a52f461a?q=80&w=800" alt="Rhythm & Beats Music Festival" className="w-full h-40 object-cover" />
                </div>
                <h4 className="font-bold text-brand-blue">Rhythm & Beats Music Festival</h4>
                <p className="text-sm text-gray-500 mt-1">Sunset Park, Los Angeles, CA</p>
                <p className="text-sm text-gray-600 my-2">Immerse yourself in electrifying performances by top pop, rock, EDM, and hip-hop artists.</p>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Apr 20, 2029</span>
                    <Link to="#" className="font-bold text-brand-orange hover:underline">View Details</Link>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-brand-blue">March 2029</h3>
                    <div className="flex gap-2">
                        <button className="p-1.5 rounded-md hover:bg-gray-100"><ChevronLeftIcon /></button>
                        <button className="p-1.5 rounded-md hover:bg-gray-100"><ChevronRightIcon /></button>
                    </div>
                </div>
                <div className="grid grid-cols-7 text-center text-sm text-gray-500 font-semibold mb-2">
                    <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                </div>
                <div className="grid grid-cols-7 text-center text-sm">
                    {[...Array(31)].map((_, i) => <span key={i} className={`py-1.5 rounded-full ${i+1 === 14 ? 'bg-brand-orange text-white' : ''} ${[3,5,23].includes(i+1) ? 'font-bold text-brand-blue' : 'text-gray-700'}`}>{i+1}</span>)}
                </div>
                 <div className="border-t border-gray-100 mt-4 pt-4 space-y-3">
                    <div className="p-3 bg-brand-orange/10 rounded-lg">
                        <p className="font-semibold text-brand-blue text-sm">Panel Discussion</p>
                        <p className="text-xs text-gray-500">Technology &bull; 10:00 AM - 12:00 PM</p>
                    </div>
                     <div className="p-3">
                        <p className="font-semibold text-brand-blue text-sm">Live Concert</p>
                        <p className="text-xs text-gray-500">Echo Beats Festival &bull; 6:00 PM - 11:00 PM</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg text-brand-blue mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    {recentActivity.map((activity, i) => (
                        <div key={i} className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center flex-shrink-0 text-xs font-bold">{activity.user.split(' ').map(n => n[0]).join('')}</div>
                            <div>
                                <p className="text-sm text-gray-800"><span className="font-semibold">{activity.user}</span> {activity.action} {activity.details}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
      </div>
    </div>
  );
};

export default MyEvents;
