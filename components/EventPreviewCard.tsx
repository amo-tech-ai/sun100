import React from 'react';
import type { EventFormData } from '../screens/EventWizard';

interface EventPreviewCardProps {
    eventData: EventFormData;
}

const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;

const EventPreviewCard: React.FC<EventPreviewCardProps> = ({ eventData }) => {
    const { title, type, description, startsAtDate, locationType, address, virtualLink } = eventData;
    const placeholderImage = 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop';
    
    const formattedDate = startsAtDate ? new Date(startsAtDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date TBD';
    const location = locationType === 'virtual' ? 'Virtual' : (address || 'Location TBD');

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group border border-gray-200/80">
            <div className="relative">
                <div className="h-40 w-full bg-gray-200 flex items-center justify-center">
                    <img src={placeholderImage} alt={title || "Event"} className="h-full w-full object-cover" />
                </div>
                <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-brand-orange border border-brand-orange/50">
                    {type || 'Category'}
                </div>
            </div>
            <div className="p-4 sm:p-5 flex-grow flex flex-col">
                <h2 className="text-lg font-bold font-heading text-gray-800 mb-2 truncate" title={title || 'Event Title'}>
                    {title || 'Event Title'}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span>📅 {formattedDate}</span>
                    <span>📍 {location}</span>
                </div>
                <p className="text-gray-600 flex-grow text-sm line-clamp-2">
                    {description || 'Your event description will appear here...'}
                </p>
                <div className="mt-4 flex justify-between items-center">
                    <span className="font-bold text-brand-orange group-hover:underline flex items-center gap-2 text-sm">
                        Learn More <ArrowRightIcon />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default EventPreviewCard;
