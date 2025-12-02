
import React, { useState, useMemo } from 'react';
import { Task } from '../../services/crmService';

const ChevronLeftIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m15 18-6-6 6-6"/></svg>;
const ChevronRightIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6"/></svg>;
const CalendarClockIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="M20 14h-2"/><path d="M14 18h6"/><path d="M12 18v4"/></svg>;

interface MiniCalendarProps {
    tasks?: Task[];
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({ tasks = [] }) => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState<Date | null>(today);

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });

    // Filter tasks for the current month view to show dots
    const tasksInMonth = useMemo(() => {
        return tasks.filter(task => {
            const taskDate = new Date(task.due);
            return taskDate.getMonth() === currentMonth && taskDate.getFullYear() === currentYear && !task.completed;
        });
    }, [tasks, currentMonth, currentYear]);

    // Tasks for the selected date list below
    const selectedDayTasks = useMemo(() => {
        if (!selectedDate) return [];
        return tasks.filter(task => {
            const taskDate = new Date(task.due);
            return taskDate.getDate() === selectedDate.getDate() && 
                   taskDate.getMonth() === selectedDate.getMonth() && 
                   taskDate.getFullYear() === selectedDate.getFullYear() &&
                   !task.completed;
        });
    }, [tasks, selectedDate]);

    return (
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-sm text-brand-blue">{monthName} {currentYear}</h3>
                <div className="flex gap-1">
                    <button onClick={() => setCurrentMonth(m => m - 1)} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"><ChevronLeftIcon /></button>
                    <button onClick={() => setCurrentMonth(m => m + 1)} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"><ChevronRightIcon /></button>
                </div>
            </div>
            <div className="grid grid-cols-7 text-center text-[10px] text-gray-400 font-bold uppercase mb-3 tracking-wide">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <span key={day}>{day}</span>)}
            </div>
            <div className="grid grid-cols-7 text-center text-xs gap-y-3">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}
                {Array.from({ length: daysInMonth }).map((_, day) => {
                    const date = day + 1;
                    const dateObj = new Date(currentYear, currentMonth, date);
                    const isToday = date === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                    const isSelected = selectedDate && date === selectedDate.getDate() && currentMonth === selectedDate.getMonth();
                    
                    const hasTask = tasksInMonth.some(t => new Date(t.due).getDate() === date);

                    return (
                        <div key={date} className="flex flex-col items-center justify-center h-8 relative">
                             <button 
                                onClick={() => setSelectedDate(dateObj)}
                                className={`w-7 h-7 flex items-center justify-center rounded-full font-medium transition-all cursor-pointer ${isSelected ? 'bg-brand-blue text-white shadow-md scale-110' : isToday ? 'bg-blue-50 text-brand-blue font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                {date}
                            </button>
                            {hasTask && !isSelected && (
                                <div className="w-1 h-1 rounded-full bg-brand-orange absolute bottom-0"></div>
                            )}
                        </div>
                    );
                })}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-50 flex-1 overflow-y-auto min-h-[100px]">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">
                    {selectedDate ? selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric'}) : 'Select a date'}
                </h4>
                
                <div className="space-y-3">
                    {selectedDayTasks.length > 0 ? selectedDayTasks.map(task => (
                         <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                            <div className={`w-1 h-8 rounded-full ${task.priority === 'high' || task.priority === 'urgent' ? 'bg-red-500' : 'bg-brand-orange'}`}></div>
                            <div>
                                <p className="text-xs font-bold text-gray-800">{task.title}</p>
                                <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1 capitalize">
                                    <CalendarClockIcon className="w-3 h-3"/> {task.priority} Priority
                                </p>
                            </div>
                        </div>
                    )) : (
                        <p className="text-xs text-gray-400 italic text-center py-2">No tasks for this day.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
