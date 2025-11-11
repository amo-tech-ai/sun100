import React, { useState, useEffect } from 'react';
import EventPreviewCard from '../components/EventPreviewCard';

// --- Icons ---
const LightbulbIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 14c.2-1 .7-1.7 1.5-2.5C17.7 10.2 18 9 18 7c0-2.2-1.8-4-4-4S10 4.8 10 7c0 2 .3 3.2 1.5 4.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>;
const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>;
const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const TicketIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v1a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-1a3 3 0 0 1 0-6V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>;

const steps = ["Overview", "Details", "Media", "Tickets", "Review"];

export type EventFormData = {
    title: string;
    type: string;
    description: string;
    startsAtDate: string;
    startsAtTime: string;
    endsAtDate: string;
    endsAtTime: string;
    locationType: 'virtual' | 'in-person';
    virtualLink: string;
    venueName: string;
    address: string;
    coverImageName: string;
    ticketing: {
        access: 'free' | 'paid';
        price: number;
        quantity: number;
    };
};

const defaultEventData: EventFormData = {
    title: '',
    type: 'Tech & Innovation',
    description: '',
    startsAtDate: '',
    startsAtTime: '',
    endsAtDate: '',
    endsAtTime: '',
    locationType: 'virtual',
    virtualLink: '',
    venueName: '',
    address: '',
    coverImageName: '',
    ticketing: {
        access: 'free',
        price: 0,
        quantity: 100,
    }
};

const EventWizard: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [eventData, setEventData] = useState<EventFormData>(defaultEventData);

    useEffect(() => {
        const savedDraft = sessionStorage.getItem('eventDraft');
        if (savedDraft) {
            setEventData(JSON.parse(savedDraft));
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            sessionStorage.setItem('eventDraft', JSON.stringify(eventData));
        }, 500); // Debounce saving
        return () => clearTimeout(timer);
    }, [eventData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('ticketing.')) {
            const field = name.split('.')[1];
            setEventData(prev => ({
                ...prev,
                ticketing: { ...prev.ticketing, [field]: value }
            }));
        } else {
            setEventData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const canProceed = () => {
        switch (currentStep) {
            case 0: return eventData.title.trim() && eventData.type.trim() && eventData.description.trim();
            case 1: return eventData.startsAtDate && eventData.startsAtTime && eventData.endsAtDate && eventData.endsAtTime && (eventData.locationType === 'virtual' ? eventData.virtualLink.trim() : eventData.venueName.trim() && eventData.address.trim());
            case 2: return eventData.coverImageName.trim();
            case 3: return eventData.ticketing.access === 'free' || (eventData.ticketing.price > 0 && eventData.ticketing.quantity > 0);
            default: return true;
        }
    }

    const handleNext = () => {
        if (canProceed() && currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    
    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Overview
                return (
                     <div>
                        <h1 className="text-2xl font-bold font-heading mb-6">Event Overview</h1>
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">Event Title</label>
                                <input type="text" id="title" name="title" value={eventData.title} onChange={handleChange} placeholder="e.g., AI Founders & Investors Mixer" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E87C4D]" />
                            </div>
                             <div>
                                <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                                <select id="type" name="type" value={eventData.type} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E87C4D] bg-white">
                                    <option>Tech & Innovation</option>
                                    <option>Networking</option>
                                    <option>Workshop</option>
                                    <option>Masterclass</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                                <textarea id="description" name="description" value={eventData.description} onChange={handleChange} rows={5} placeholder="Tell attendees about your event..." className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E87C4D]"></textarea>
                            </div>
                        </form>
                    </div>
                );
            case 1: // Details
                 return (
                    <div>
                        <h1 className="text-2xl font-bold font-heading mb-6">Date, Time & Location</h1>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="startsAtDate" className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                                    <input type="date" id="startsAtDate" name="startsAtDate" value={eventData.startsAtDate} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label htmlFor="startsAtTime" className="block text-sm font-semibold text-gray-700 mb-1">Start Time</label>
                                    <input type="time" id="startsAtTime" name="startsAtTime" value={eventData.startsAtTime} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label htmlFor="endsAtDate" className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                                    <input type="date" id="endsAtDate" name="endsAtDate" value={eventData.endsAtDate} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label htmlFor="endsAtTime" className="block text-sm font-semibold text-gray-700 mb-1">End Time</label>
                                    <input type="time" id="endsAtTime" name="endsAtTime" value={eventData.endsAtTime} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 p-3 border rounded-md flex-1 cursor-pointer"><input type="radio" name="locationType" value="virtual" checked={eventData.locationType === 'virtual'} onChange={handleChange} className="form-radio" /><GlobeIcon /> Virtual</label>
                                    <label className="flex items-center gap-2 p-3 border rounded-md flex-1 cursor-pointer"><input type="radio" name="locationType" value="in-person" checked={eventData.locationType === 'in-person'} onChange={handleChange} className="form-radio" /><MapPinIcon /> In-Person</label>
                                </div>
                            </div>
                            {eventData.locationType === 'virtual' ? (
                                <div>
                                    <label htmlFor="virtualLink" className="block text-sm font-semibold text-gray-700 mb-1">Event Link</label>
                                    <input type="url" id="virtualLink" name="virtualLink" value={eventData.virtualLink} onChange={handleChange} placeholder="https://..." className="w-full p-3 border border-gray-300 rounded-md" />
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="venueName" className="block text-sm font-semibold text-gray-700 mb-1">Venue Name</label>
                                        <input type="text" id="venueName" name="venueName" value={eventData.venueName} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />
                                    </div>
                                    <div>
                                        <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-1">Full Address</label>
                                        <input type="text" id="address" name="address" value={eventData.address} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                );
            case 2: // Media
                return (
                     <div>
                        <h1 className="text-2xl font-bold font-heading mb-6">Event Media</h1>
                        <form className="space-y-6">
                             <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Cover Image</label>
                                 <div className="mt-1 flex justify-center px-6 pt-10 pb-12 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <p className="text-sm text-gray-600">Drag & drop or <button type="button" className="font-medium text-[#E87C4D] hover:underline">click to upload</button></p>
                                        <p className="text-xs text-gray-500">PNG, JPG up to 3MB. Recommended 1200x630px.</p>
                                        <input type="file" className="sr-only" onChange={(e) => setEventData(p => ({...p, coverImageName: e.target.files?.[0].name || ''}))} />
                                    </div>
                                </div>
                                {eventData.coverImageName && <p className="mt-2 text-sm text-gray-600">Uploaded: {eventData.coverImageName}</p>}
                            </div>
                        </form>
                    </div>
                );
            case 3: // Tickets
                 return (
                    <div>
                        <h1 className="text-2xl font-bold font-heading mb-6">Ticketing</h1>
                        <form className="space-y-6">
                             <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Ticket Access</label>
                                <div className="flex gap-4">
                                     <label className="flex items-center gap-2 p-3 border rounded-md flex-1 cursor-pointer"><input type="radio" name="ticketing.access" value="free" checked={eventData.ticketing.access === 'free'} onChange={handleChange} className="form-radio" />Free Event</label>
                                     <label className="flex items-center gap-2 p-3 border rounded-md flex-1 cursor-pointer"><input type="radio" name="ticketing.access" value="paid" checked={eventData.ticketing.access === 'paid'} onChange={handleChange} className="form-radio" />Paid Event</label>
                                </div>
                            </div>
                            {eventData.ticketing.access === 'paid' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-1">Price (USD)</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">$</div>
                                            <input type="number" id="price" name="ticketing.price" value={eventData.ticketing.price} onChange={handleChange} min="1" className="w-full p-3 pl-7 border border-gray-300 rounded-md" />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 mb-1">Ticket Quantity</label>
                                        <input type="number" id="quantity" name="ticketing.quantity" value={eventData.ticketing.quantity} onChange={handleChange} min="1" className="w-full p-3 border border-gray-300 rounded-md" />
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                );
            case 4: // Review
                return (
                    <div>
                        <h1 className="text-2xl font-bold font-heading mb-6">Review & Publish</h1>
                        <div className="space-y-4 text-gray-700 bg-gray-50 p-4 rounded-md">
                           <p><strong>Title:</strong> {eventData.title || '...'}</p>
                           <p><strong>Date:</strong> {eventData.startsAtDate ? new Date(eventData.startsAtDate).toLocaleDateString() : '...'}</p>
                           <p><strong>Location:</strong> {eventData.locationType === 'virtual' ? eventData.virtualLink : eventData.address}</p>
                           <p><strong>Tickets:</strong> {eventData.ticketing.access === 'free' ? 'Free' : `$${eventData.ticketing.price} - ${eventData.ticketing.quantity} available`}</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* --- Progress Header --- */}
            <div className="mb-8">
                <div className="flex items-start justify-between">
                    {steps.map((step, index) => (
                        <React.Fragment key={step}>
                            <div className="flex flex-col items-center text-center w-16 sm:w-20">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${index <= currentStep ? 'bg-[#E87C4D] border-[#E87C4D] text-white' : 'bg-white border-gray-300 text-gray-500'}`}>
                                    {index < currentStep ? '✓' : index + 1}
                                </div>
                                <p className={`mt-2 text-xs sm:text-sm font-semibold ${index <= currentStep ? 'text-gray-800' : 'text-gray-500'}`}>{step}</p>
                            </div>
                            {index < steps.length - 1 && <div className={`flex-1 h-0.5 mt-5 mx-1 sm:mx-2 ${index < currentStep ? 'bg-[#E87C4D]' : 'bg-gray-300'}`}></div>}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* --- Main Content --- */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* --- Form Section (2/3) --- */}
                <div className="w-full lg:w-2/3 bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-200/80">
                    {renderStepContent()}
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-4 pt-8 mt-8 border-t">
                        <button type="button" onClick={handleBack} disabled={currentStep === 0} className="w-full sm:w-auto bg-gray-200 text-gray-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 disabled:opacity-50">Back</button>
                        <button type="button" onClick={handleNext} disabled={!canProceed()} className="w-full sm:w-auto bg-[#E87C4D] text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {currentStep === steps.length - 1 ? 'Publish Event' : 'Next Step →'}
                        </button>
                    </div>
                </div>

                {/* --- Sidebar (1/3) --- */}
                <div className="w-full lg:w-1/3 space-y-6">
                    <div className="sticky top-28">
                        {/* Event Preview */}
                         <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200/80">
                            <div className="flex items-center gap-3 mb-3">
                                <EyeIcon />
                                <h3 className="font-bold text-lg">Live Preview</h3>
                            </div>
                            <EventPreviewCard eventData={eventData} />
                        </div>

                        {/* Pro Tips */}
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200/80 mt-6">
                            <div className="flex items-center gap-3 mb-3">
                                <LightbulbIcon className="text-yellow-500" />
                                <h3 className="font-bold text-lg">Pro Tips</h3>
                            </div>
                            <p className="text-gray-600 text-sm">A clear and compelling event title is the most important factor for attracting attendees. Make it exciting and informative!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventWizard;
