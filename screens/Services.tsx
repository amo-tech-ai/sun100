
import React from 'react';
import { Link } from 'react-router-dom';

// --- Icons (self-contained for simplicity) ---
const WebDesignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M2 12h20"/><path d="M7 12v2.5"/><path d="M12 12v7"/><path d="M17 12v4"/></svg>;
const BrandingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const MvpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m10 10.5 4 4"/><path d="m14 10.5-4 4"/></svg>;

const FastDeliveryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-2z"/><path d="M12 15V2l-4 4"/><path d="m16 6-4-4"/></svg>;
const AiPrecisionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 22v-2"/><path d="m20 12-2 0"/><path d="m4 12 2 0"/><path d="m18 6-1.5 1.5"/><path d="m6 18 1.5-1.5"/><path d="m18 18-1.5-1.5"/><path d="m6 6 1.5 1.5"/></svg>;
const ScalabilityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M14 2v4h4"/><path d="M16 11h6"/><path d="M19 8v6"/></svg>;
const ArrowRight = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;

const Services: React.FC = () => {
    return (
        <div className="bg-[#FBF8F5]">
            <title>AI-Powered Design & Development Services - Sun AI</title>
            <meta name="description" content="From branding to app development, Sun AI helps startups build fast, look sharp, and scale smart." />

            {/* --- Hero Section --- */}
            <section className="relative text-center py-20 md:py-32 overflow-hidden bg-brand-deep-blue text-white">
                 <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
                 <div className="absolute inset-0 bg-gradient-to-br from-transparent via-brand-pastel-teal/10 to-transparent"></div>
                 <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-6xl font-extrabold font-heading leading-tight mb-4 tracking-tight">
                        Bring Your Vision to Life with AI-Powered Design.
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-8">
                        From branding to app development, Sun AI helps startups build fast, look sharp, and scale smart.
                    </p>
                </div>
            </section>

             {/* --- Services Cards Grid --- */}
             <section className="py-20 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <WebDesignIcon />,
                                title: "Web Design",
                                desc: "Crafting beautiful, high-performance websites that convert visitors into customers.",
                                link: "/services/web-design"
                            },
                            {
                                icon: <BrandingIcon />,
                                title: "Logo & Branding",
                                desc: "Building memorable brand identities that tell your story and captivate your audience.",
                                link: "/services/logo-branding"
                            },
                            {
                                icon: <MvpIcon />,
                                title: "MVP Development",
                                desc: "Rapidly building and launching Minimum Viable Products to validate your idea and attract users.",
                                link: "/services/mvp-development"
                            },
                        ].map(service => (
                            <div key={service.title} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                <div className="text-brand-orange mb-4">{service.icon}</div>
                                <h3 className="text-2xl font-bold font-heading text-slate-800 mb-2">{service.title}</h3>
                                <p className="text-slate-600 mb-6">{service.desc}</p>
                                <Link to={service.link} className="font-bold text-brand-orange group-hover:underline flex items-center gap-2">
                                    Learn More <ArrowRight />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
             </section>

              {/* --- Highlights Section --- */}
             <section className="py-20 sm:py-24 bg-white/50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                         {[
                            { icon: <FastDeliveryIcon />, title: "Fast Delivery", desc: "Launch your project in weeks, not months, with our streamlined, AI-assisted workflows." },
                            { icon: <AiPrecisionIcon />, title: "AI Precision", desc: "Leverage the power of AI for data-driven design choices and hyper-efficient development." },
                            { icon: <ScalabilityIcon />, title: "Built to Scale", desc: "We build on modern, robust architectures that grow with your startup from day one." },
                         ].map(highlight => (
                             <div key={highlight.title} className="flex flex-col items-center">
                                 <div className="text-brand-orange mb-4">{highlight.icon}</div>
                                 <h3 className="text-xl font-bold font-heading text-slate-800">{highlight.title}</h3>
                                 <p className="text-slate-600 mt-2">{highlight.desc}</p>
                             </div>
                         ))}
                    </div>
                </div>
            </section>

            {/* --- CTA Footer --- */}
            <section className="py-20 sm:py-24">
                 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-800">Let’s build something remarkable together.</h2>
                    <div className="mt-8">
                         <Link
                            to="/dashboard"
                            className="inline-block bg-brand-orange text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-colors duration-200 shadow-lg"
                        >
                            Get Started
                        </Link>
                    </div>
                 </div>
            </section>
        </div>
    );
};

export default Services;
