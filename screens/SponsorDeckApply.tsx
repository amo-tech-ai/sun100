
import React, { useState } from 'react';

const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>;

const SunAIStartupDeckApply: React.FC = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        website: '',
        contactName: '',
        email: '',
        tier: 'Silver',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            setSubmitted(true);
            window.scrollTo(0, 0);
        }, 1000);
    };

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto py-20 px-4 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <CheckIcon />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Received!</h2>
                <p className="text-gray-600 mb-8 text-lg">
                    Thank you for your interest in partnering with Sun AI. Our team will review your application and reach out within 2-3 business days.
                </p>
                <button 
                    onClick={() => setSubmitted(false)} 
                    className="text-brand-orange font-bold hover:underline"
                >
                    Submit another application
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-brand-blue mb-4">Apply to Sponsor</h1>
                <p className="text-lg text-gray-600">
                    Connect with the next generation of AI startups. Choose your partnership tier and let's grow together.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="space-y-8">
                    
                    {/* Company Info */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Company Details</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Company Name</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-shadow"
                                    placeholder="e.g. Acme Corp"
                                    value={formData.companyName}
                                    onChange={e => setFormData({...formData, companyName: e.target.value})}
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Website URL</label>
                                <input 
                                    required
                                    type="url" 
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-shadow"
                                    placeholder="https://acme.com"
                                    value={formData.website}
                                    onChange={e => setFormData({...formData, website: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Point of Contact</h3>
                         <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-shadow"
                                    placeholder="Jane Doe"
                                    value={formData.contactName}
                                    onChange={e => setFormData({...formData, contactName: e.target.value})}
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Work Email</label>
                                <input 
                                    required
                                    type="email" 
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-shadow"
                                    placeholder="jane@acme.com"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sponsorship Selection */}
                    <div>
                         <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Sponsorship Tier</h3>
                         <div className="grid md:grid-cols-3 gap-4">
                             {['Silver', 'Gold', 'Partner'].map(tier => (
                                 <label key={tier} className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${formData.tier === tier ? 'border-brand-orange bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                     <input 
                                        type="radio" 
                                        name="tier" 
                                        value={tier} 
                                        checked={formData.tier === tier}
                                        onChange={e => setFormData({...formData, tier: e.target.value})}
                                        className="absolute top-4 right-4 text-brand-orange focus:ring-brand-orange"
                                    />
                                    <span className={`block text-lg font-bold mb-1 ${formData.tier === tier ? 'text-brand-orange' : 'text-gray-700'}`}>{tier}</span>
                                    <span className="text-xs text-gray-500">
                                        {tier === 'Silver' && 'Logo placement & Perk listing'}
                                        {tier === 'Gold' && 'Dedicated email blast & Webinar'}
                                        {tier === 'Partner' && 'Full ecosystem integration'}
                                    </span>
                                 </label>
                             ))}
                         </div>
                    </div>

                     {/* Message */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Additional Details</h3>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Goal / Offer Description</label>
                        <textarea 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-shadow"
                            rows={4}
                            placeholder="Tell us about the perk or value you want to provide to our founders..."
                            value={formData.message}
                            onChange={e => setFormData({...formData, message: e.target.value})}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-brand-orange text-white font-bold text-lg py-4 rounded-xl hover:bg-opacity-90 shadow-lg transform transition hover:-translate-y-0.5"
                    >
                        Submit Application
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SunAIStartupDeckApply;
