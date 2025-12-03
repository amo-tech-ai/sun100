
import React, { forwardRef, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import useOnScreen from '../hooks/useOnScreen';
import AnimatedCounter from '../components/AnimatedCounter';


const Section = forwardRef<HTMLElement, { children: ReactNode, className?: string }>(({ children, className = '' }, ref) => (
    <section ref={ref} className={`py-20 sm:py-28 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
        </div>
    </section>
));
Section.displayName = 'Section';

const FeatureCard: React.FC<{ title: string, description: string, icon: React.ReactNode, delay: number }> = ({ title, description, icon, delay }) => {
    const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.1 });
    return (
        <div ref={ref} className={`bg-white/50 p-8 rounded-lg border border-gray-200/50 shadow-sm hover:shadow-xl hover:shadow-brand-orange/10 transform hover:-translate-y-1 transition-all duration-300 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: `${delay}ms`}}>
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-brand-orange/10 text-brand-orange mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-2 text-brand-blue">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};

const MetricCounter: React.FC<{ value: number; suffix: string; label: string }> = ({ value, suffix, label }) => (
    <div className="text-center">
        <p className="text-5xl md:text-6xl font-extrabold text-brand-mustard">
            <AnimatedCounter value={value} suffix={suffix} />
        </p>
        <p className="mt-2 text-lg font-semibold text-brand-blue">{label}</p>
    </div>
);

const SponsorLogoPlaceholder: React.FC<{delay: number}> = ({delay}) => {
    const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.1 });
    return (
        <div ref={ref} className={`aspect-[16/9] bg-gray-100 rounded-lg flex items-center justify-center p-4 transition-all duration-300 ease-in-out hover:shadow-lg hover:bg-white border border-transparent hover:border-gray-200 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: `${delay}ms`}}>
            <div className="w-3/4 h-1/4 bg-gray-200 rounded-md"></div>
        </div>
    );
};


const StartupDeckOverview: React.FC = () => {
    const [ecosystemRef, isEcosystemVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.3 });

    return (
        <div className="bg-brand-off-white">
             <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }

                @keyframes pulse-slow {
                    50% { opacity: 0.7; transform: scale(1.05); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                .bg-radial-gradient {
                    background-image: radial-gradient(circle, var(--tw-gradient-from), var(--tw-gradient-to));
                }
                
                @keyframes orbit {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-orbit { animation: orbit 20s linear infinite; }
                .orbit-item { transform-origin: 160px 160px; }

                @keyframes grow-width {
                    from { width: 0%; } to { width: 100%; }
                }
                .animate-grow-width { animation: grow-width 0.8s ease-out forwards; }
                
                @keyframes grow-height {
                    from { height: 0%; } to { height: 100%; }
                }
                .animate-grow-height { animation: grow-height 0.8s ease-out forwards; }
            `}</style>

            {/* Section 1: Hero */}
            <Section className="bg-white overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="text-center lg:text-left animate-fade-in-up">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-brand-blue mb-6">
                            Building the Future of AI, Together.
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 mb-8">
                            Join a curated network of industry leaders, innovators, and the brightest founders to shape the future of artificial intelligence in our ecosystem.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link to="/startup-deck/apply" className="inline-block bg-brand-blue text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-all duration-200 shadow-md">
                                Become a Sponsor
                            </Link>
                            <Link to="/startup-deck/showcase" className="inline-block bg-white text-brand-orange border-2 border-brand-orange font-bold py-3 px-8 rounded-lg text-lg hover:bg-brand-orange/5 transition-all duration-200">
                                Explore Our Partners
                            </Link>
                        </div>
                    </div>
                    <div className="relative h-96 flex items-center justify-center">
                        <div className="absolute inset-0 bg-radial-gradient from-brand-orange/5 to-transparent animate-pulse-slow"></div>
                        <div className="absolute w-80 h-80 animate-orbit">
                            <div className="orbit-item absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-brand-blue/5 rounded-full flex items-center justify-center p-2 shadow-sm animate-pulse-slow" style={{animationDelay: '0s'}}><span className="text-xs font-bold text-brand-blue">Founders</span></div>
                            <div className="orbit-item absolute bottom-0 left-0 w-20 h-20 bg-brand-mustard/5 rounded-full flex items-center justify-center p-2 shadow-sm animate-pulse-slow" style={{animationDelay: '1.5s'}}><span className="text-xs font-bold text-brand-mustard">Investors</span></div>
                            <div className="orbit-item absolute bottom-0 right-0 w-20 h-20 bg-brand-orange/5 rounded-full flex items-center justify-center p-2 shadow-sm animate-pulse-slow" style={{animationDelay: '3s'}}><span className="text-xs font-bold text-brand-orange">Sponsors</span></div>
                        </div>
                        <div className="w-40 h-40 rounded-full bg-white shadow-inner flex items-center justify-center font-bold text-brand-blue text-center text-xl">Startup<br/>AI</div>
                    </div>
                </div>
            </Section>

            {/* Section 2: Why Partner */}
            <Section>
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-brand-blue">Why Partner With StartupAI</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Gain unparalleled access to a pipeline of high-potential AI startups, co-create solutions to industry challenges, and position your brand at the forefront of innovation.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard title="Access Talent" description="Connect with elite founders and engineers building the next generation of AI technology." icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} delay={0} />
                    <FeatureCard title="Drive Innovation" description="Collaborate on targeted research, pilot programs, and challenges that solve real-world problems." icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.042 21.672L13.684 16.6s.435-.817.817-.817l9.11-9.11a2.828 2.828 0 1 0-4-4l-9.11 9.11s-.817.435-.817.817l-5.072 1.356a.5.5 0 0 0-.16.686l2.175 2.175a.5.5 0 0 0 .686-.16l1.356-5.072z"/><path d="m15 5 4 4"/></svg>} delay={200} />
                    <FeatureCard title="Build Your Brand" description="Elevate your company's profile as a key player and thought leader within the global AI ecosystem." icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>} delay={400} />
                </div>
            </Section>

            {/* Section 3: Ecosystem Flow */}
             <Section ref={ecosystemRef} className="bg-white">
                 <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-brand-blue">A Self-Reinforcing Growth Engine</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Our model creates a flywheel effect, where each part of the ecosystem strengthens the others, driving continuous value and growth for all participants.</p>
                </div>
                <div className="relative flex flex-col md:flex-row justify-center items-center gap-8 md:gap-0">
                    <div className="flex flex-col items-center text-center p-4 w-52 opacity-0" style={isEcosystemVisible ? {animation: 'fade-in-up 0.5s 0s forwards'} : {}}>
                        <div className="w-24 h-24 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-lg mx-auto shadow-lg">Founders</div>
                        <p className="text-sm text-gray-600 mt-2">Bring innovative ideas and technical talent.</p>
                    </div>
                    <div className="w-px md:w-32 h-16 md:h-px bg-brand-orange/50" style={isEcosystemVisible ? {animation: 'grow-width 0.8s 0.3s ease-out forwards', width: 0} : {width: 0}}></div>
                     <div className="flex flex-col items-center text-center p-4 w-52 opacity-0" style={isEcosystemVisible ? {animation: 'fade-in-up 0.5s 0.6s forwards'} : {}}>
                        <div className="w-24 h-24 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-lg mx-auto shadow-lg">Sponsors</div>
                        <p className="text-sm text-gray-600 mt-2">Provide resources, mentorship, and market access.</p>
                    </div>
                    <div className="w-px md:w-32 h-16 md:h-px bg-brand-mustard/50" style={isEcosystemVisible ? {animation: 'grow-width 0.8s 0.9s ease-out forwards', width: 0} : {width: 0}}></div>
                     <div className="flex flex-col items-center text-center p-4 w-52 opacity-0" style={isEcosystemVisible ? {animation: 'fade-in-up 0.5s 1.2s forwards'} : {}}>
                        <div className="w-24 h-24 rounded-full bg-brand-mustard text-white flex items-center justify-center font-bold text-lg mx-auto shadow-lg">Value</div>
                        <p className="text-sm text-gray-600 mt-2">Results in growth, solutions, and a stronger ecosystem.</p>
                    </div>
                </div>
            </Section>

            {/* Section 4: Data Storytelling */}
            <Section>
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="animate-fade-in-up">
                        <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mb-6">A Community of Impact</h2>
                        <p className="text-lg text-gray-600 mb-6">Our network isn't just about numbers; it's about the quality of connections and the tangible outcomes we create for our partners and founders.</p>
                        <ul className="space-y-4 text-lg text-gray-600">
                           <li className="flex items-start gap-3"><span className="text-brand-orange font-bold mt-1">&#10003;</span> <span>Connect with a pre-vetted pool of high-growth AI startups.</span></li>
                           <li className="flex items-start gap-3"><span className="text-brand-orange font-bold mt-1">&#10003;</span> <span>Influence the next wave of technology by mentoring top founders.</span></li>
                           <li className="flex items-start gap-3"><span className="text-brand-orange font-bold mt-1">&#10003;</span> <span>Achieve significant brand visibility across our events, content, and platform.</span></li>
                        </ul>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        <MetricCounter value={50} suffix="+" label="Active Sponsors" />
                        <MetricCounter value={2} suffix="M+" label="Founder Perks ($)" />
                        <MetricCounter value={80} suffix="+" label="Events Hosted" />
                    </div>
                </div>
            </Section>

            {/* Section 5: Featured Sponsors */}
            <Section className="bg-white">
                 <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-brand-blue">Our Esteemed Partners</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[...Array(8)].map((_, i) => <SponsorLogoPlaceholder key={i} delay={i * 100} />)}
                </div>
                <div className="text-center mt-12">
                     <Link to="/startup-deck/showcase" className="font-bold text-brand-orange text-lg hover:underline">
                        View All Sponsors &rarr;
                    </Link>
                </div>
            </Section>

            {/* Section 6: Final CTA */}
            <Section className="bg-brand-blue text-white">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold">Join the StartupAI Partner Network.</h2>
                    <p className="text-lg text-blue-200 mt-4 mb-8">
                       Position your company at the center of the AI revolution. Let's build the future, together.
                    </p>
                    <Link to="/startup-deck/apply" className="inline-block bg-brand-orange text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-all duration-200 shadow-xl">
                        Become a Sponsor
                    </Link>
                </div>
            </Section>
        </div>
    );
};

export default StartupDeckOverview;
