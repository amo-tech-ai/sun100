import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

// --- ICONS ---
const CalendarDaysIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>;
const ClockIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const CheckCircleIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const AlertCircleIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>;
const CalendarClockIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h5"/><path d="M17.5 17.5 16 16.25V14"/><path d="M22 16a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"/></svg>;


// --- TYPES & MOCK DATA ---
interface Task {
    id: string;
    title: string;
    creationDate: string; // ISO String
    dueDate: string;      // ISO String
    status: 'upcoming' | 'completed' | 'overdue';
}

const mockTasks: Task[] = [
    { id: 't1', title: 'Finalize Q3 Pitch Deck', creationDate: '2024-08-10T10:00:00Z', dueDate: '2024-08-25T23:59:59Z', status: 'upcoming' },
    { id: 't2', title: 'Submit YC Application', creationDate: '2024-07-20T14:00:00Z', dueDate: '2024-08-05T23:59:59Z', status: 'overdue' },
    { id: 't3', title: 'Launch new landing page', creationDate: '2024-08-15T09:00:00Z', dueDate: '2024-09-01T23:59:59Z', status: 'upcoming' },
    { id: 't4', title: 'Complete financial projections', creationDate: '2024-08-01T11:00:00Z', dueDate: '2024-08-12T23:59:59Z', status: 'completed' },
    { id: 't5', title: 'Onboard first beta users', creationDate: '2024-08-18T18:00:00Z', dueDate: '2024-08-22T23:59:59Z', status: 'upcoming' },
];

type SortOrder = 'dueDate' | 'creationDate';

// --- HELPER FUNCTIONS ---
const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

const statusConfig = {
    upcoming: {
        label: 'Upcoming',
        icon: CalendarClockIcon,
        textColor: 'text-blue-600',
        bgColor: 'bg-blue-100',
        borderColor: 'border-blue-500',
    },
    completed: {
        label: 'Completed',
        icon: CheckCircleIcon,
        textColor: 'text-green-600',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-500',
    },
    overdue: {
        label: 'Overdue',
        icon: AlertCircleIcon,
        textColor: 'text-red-600',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-500',
    }
};


// --- SUB-COMPONENTS ---
const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
    const config = statusConfig[task.status];
    const Icon = config.icon;

    return (
        <div className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${config.borderColor} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4`}>
            <div>
                <h3 className="font-bold text-lg text-brand-blue">{task.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                    <span className="flex items-center gap-1.5"><CalendarDaysIcon /> Due: {formatDate(task.dueDate)}</span>
                    <span className="flex items-center gap-1.5"><ClockIcon /> Created: {formatDate(task.creationDate)}</span>
                </div>
            </div>
            <div className={`inline-flex items-center gap-2 font-semibold text-sm px-3 py-1 rounded-full ${config.bgColor} ${config.textColor}`}>
                <Icon />
                <span>{config.label}</span>
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---
const MyEvents: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(mockTasks);
    const [sortOrder, setSortOrder] = useState<SortOrder>('dueDate');

    const sortedTasks = useMemo(() => {
        return [...tasks].sort((a, b) => {
            if (sortOrder === 'dueDate') {
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(); // Ascending
            }
            if (sortOrder === 'creationDate') {
                return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime(); // Descending
            }
            return 0;
        });
    }, [tasks, sortOrder]);


    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">My Tasks</h1>
                 <Link
                    to="/dashboard/events/new"
                    className="inline-block bg-[#E87C4D] text-white font-bold py-2 px-5 rounded-lg hover:bg-opacity-90 transition-colors duration-200 shadow-md"
                >
                    + Create Task
                </Link>
            </div>

            {/* Sort Controls */}
            {tasks.length > 0 && (
                <div className="flex justify-end mb-4">
                    <div className="relative">
                         <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                            className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                            aria-label="Sort tasks by"
                        >
                            <option value="dueDate">Sort by Due Date</option>
                            <option value="creationDate">Sort by Creation Date</option>
                        </select>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                </div>
            )}
            

            {/* Task List or Empty State */}
            {sortedTasks.length > 0 ? (
                <div className="space-y-4">
                    {sortedTasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
            ) : (
                 <div className="bg-white p-6 md:p-8 rounded-lg shadow-md text-center">
                    <h2 className="text-xl font-semibold mb-2">No Tasks Yet</h2>
                    <p className="text-gray-600">
                        Click the "Create Task" button to add your first task.
                    </p>
                </div>
            )}
        </div>
    );
};

export default MyEvents;
