import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedCounter from '../components/AnimatedCounter';

const Landing: React.FC = () => {
    return (
    <>
        <main className="pt-32 pb-16 md:pt-48 md:pb-24 px-4 sm:px-6 lg:px-8 relative">
            <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5">
                <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern height="80" id="grid" patternUnits="userSpaceOnUse" width="80">
                            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#d1d5db" strokeWidth="0.5"></path>
                        </pattern>
                    </defs>
                    <rect fill="url(#grid)" height="100%" width="100%"></rect>
                </svg>
            </div>
            <div className="max-w-5xl mx-auto text-center relative z-10">
                <div className="inline-block bg-primary/10 text-primary font-semibold py-1 px-4 rounded-full text-xs mb-6 border border-primary/20">
                    Investor-ready in minutes
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">From Idea to Investor-Ready. <span className="text-primary">Instantly.</span></h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg text-subtext-light dark:text-subtext-dark">
                    Sun AI is the intelligent platform that automates your pitch deck creation, so you can focus on building what matters.
                </p>
                <div className="mt-8">
                    <Link to="/dashboard" className="bg-primary text-white font-semibold py-3 px-8 rounded-lg text-lg hover:opacity-90 transition-opacity">Start Building for Free</Link>
                </div>
            </div>
            <div className="hidden lg:flex justify-center items-center mt-20 relative z-10 space-x-2">
                <div className="flex flex-col items-center space-y-2 p-4 animated-dot"><div className="w-20 h-20 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-full flex items-center justify-center shadow-sm"><span className="material-symbols-outlined text-subtext-light dark:text-subtext-dark text-3xl">lightbulb</span></div><span className="text-xs text-subtext-light dark:text-subtext-dark">Your Idea</span></div>
                <div className="h-px w-16 bg-border-light dark:bg-border-dark"></div>
                <div className="flex flex-col items-center space-y-2 p-4 animated-dot"><div className="w-20 h-20 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-full flex items-center justify-center shadow-sm"><span className="material-symbols-outlined text-subtext-light dark:text-subtext-dark text-3xl">query_stats</span></div><span className="text-xs text-subtext-light dark:text-subtext-dark">Market Data</span></div>
                <div className="h-px w-16 bg-border-light dark:bg-border-dark"></div>
                <div className="flex flex-col items-center space-y-2 p-4 animated-dot"><div className="w-28 h-28 bg-primary text-white rounded-full flex flex-col items-center justify-center shadow-lg"><span className="material-symbols-outlined text-4xl">auto_awesome</span><span className="font-bold">SUN AI</span></div></div>
                <div className="h-px w-16 bg-border-light dark:bg-border-dark"></div>
                <div className="flex flex-col items-center space-y-2 p-4 animated-dot"><div className="w-20 h-20 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-full flex items-center justify-center shadow-sm"><span className="material-symbols-outlined text-subtext-light dark:text-subtext-dark text-3xl">account_balance_wallet</span></div><span className="text-xs text-subtext-light dark:text-subtext-dark">Financials</span></div>
                <div className="h-px w-16 bg-border-light dark:bg-border-dark"></div>
                <div className="flex flex-col items-center space-y-2 p-4 animated-dot"><div className="w-20 h-20 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-full flex items-center justify-center shadow-sm"><span className="material-symbols-outlined text-subtext-light dark:text-subtext-dark text-3xl">stacks</span></div><span className="text-xs text-subtext-light dark:text-subtext-dark">Pitch Deck</span></div>
            </div>
        </main>
        <section className="py-16 md:py-24 bg-card-light dark:bg-card-dark border-y border-border-light dark:border-border-dark">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How It Works</h2>
                    <p className="mt-4 text-lg text-subtext-light dark:text-subtext-dark">A simple, powerful 3-step process to your perfect pitch.</p>
                </div>
                <div className="flex flex-col lg:flex-row items-center justify-center gap-0">
                    <div className="flex flex-col items-center text-center p-4 max-w-xs">
                        <div className="flex-shrink-0 w-24 h-24 bg-background-light dark:bg-background-dark rounded-full flex items-center justify-center mb-4 border border-border-light dark:border-border-dark shadow-sm">
                            <span className="material-symbols-outlined text-primary text-4xl">drive_file_rename_outline</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-xl">1. Enter Info</h3>
                            <p className="mt-2 text-subtext-light dark:text-subtext-dark">Describe your startup vision, market, and key details.</p>
                        </div>
                    </div>
                    <div className="text-subtext-light dark:text-subtext-dark opacity-50 mx-8 my-4 lg:my-0">
                        <svg className="w-12 h-12 lg:w-16 lg:h-16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 max-w-xs">
                        <div className="flex-shrink-0 w-24 h-24 bg-background-light dark:bg-background-dark rounded-full flex items-center justify-center mb-4 border border-border-light dark:border-border-dark shadow-sm">
                            <span className="material-symbols-outlined text-primary text-4xl">psychology</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-xl">2. AI Analyzes</h3>
                            <p className="mt-2 text-subtext-light dark:text-subtext-dark">Our AI processes your input and structures a narrative.</p>
                        </div>
                    </div>
                    <div className="text-subtext-light dark:text-subtext-dark opacity-50 mx-8 my-4 lg:my-0">
                        <svg className="w-12 h-12 lg:w-16 lg:h-16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 max-w-xs">
                        <div className="flex-shrink-0 w-24 h-24 bg-background-light dark:bg-background-dark rounded-full flex items-center justify-center mb-4 border border-border-light dark:border-border-dark shadow-sm">
                            <span className="material-symbols-outlined text-primary text-4xl">layers</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-xl">3. Generates Deck</h3>
                            <p className="mt-2 text-subtext-light dark:text-subtext-dark">Receive a complete, investor-ready pitch deck.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="max-w-md">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">AI Pitch Deck Wizard</h2>
                        <p className="mt-4 text-lg text-subtext-light dark:text-subtext-dark">Describe your startup, and Sun AI will generate a complete, investor-ready pitch deck for you.</p>
                        <div className="mt-8 bg-card-light dark:bg-card-dark p-6 rounded-lg border border-border-light dark:border-border-dark shadow-lg">
                            <label className="font-semibold text-sm text-subtext-light dark:text-subtext-dark" htmlFor="startup-idea">Your Startup Idea</label>
                            <textarea className="mt-2 w-full bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded-md focus:ring-primary focus:border-primary text-sm" id="startup-idea" placeholder="e.g. A platform that connects local farmers with urban consumers..." rows={4}></textarea>
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div>
                                    <label className="font-semibold text-sm text-subtext-light dark:text-subtext-dark" htmlFor="tone">Tone of Voice</label>
                                    <select className="mt-2 w-full bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded-md focus:ring-primary focus:border-primary text-sm" id="tone">
                                        <option>Professional</option>
                                        <option>Bold</option>
                                        <option>Friendly</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="font-semibold text-sm text-subtext-light dark:text-subtext-dark" htmlFor="style">Visual Style</label>
                                    <select className="mt-2 w-full bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded-md focus:ring-primary focus:border-primary text-sm" id="style">
                                        <option>Minimalist</option>
                                        <option>Modern</option>
                                        <option>Vibrant</option>
                                    </select>
                                </div>
                            </div>
                            <button className="mt-6 w-full bg-primary text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                                <span className="material-symbols-outlined text-xl">auto_awesome</span>
                                <span>Generate My Deck</span>
                            </button>
                        </div>
                    </div>
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-xl border border-border-light dark:border-border-dark">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold">Deck Outline</h3>
                            <span className="text-sm font-bold text-primary">6/10 Slides</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between bg-background-light dark:bg-background-dark p-3 rounded-md border border-border-light dark:border-border-dark opacity-50"><div className="flex items-center"><span className="material-symbols-outlined text-primary/50 text-2xl mr-3">lightbulb</span><p className="text-sm">Problem</p></div><span className="material-symbols-outlined text-primary/50 text-lg">check_circle</span></div>
                            <div className="flex items-center justify-between bg-background-light dark:bg-background-dark p-3 rounded-md border border-border-light dark:border-border-dark opacity-50"><div className="flex items-center"><span className="material-symbols-outlined text-primary/50 text-2xl mr-3">rocket_launch</span><p className="text-sm">Solution</p></div><span className="material-symbols-outlined text-primary/50 text-lg">check_circle</span></div>
                            <div className="flex items-center justify-between bg-background-light dark:bg-background-dark p-3 rounded-md border border-border-light dark:border-border-dark opacity-50"><div className="flex items-center"><span className="material-symbols-outlined text-primary/50 text-2xl mr-3">groups</span><p className="text-sm">Market</p></div><span className="material-symbols-outlined text-primary/50 text-lg">check_circle</span></div>
                            <div className="flex items-center justify-between bg-background-light dark:bg-background-dark p-3 rounded-md border border-primary"><div className="flex items-center"><span className="material-symbols-outlined text-primary text-2xl mr-3">insights</span><p className="text-sm font-semibold">Traction</p></div><div className="w-4 h-4 rounded-full border-2 border-primary animate-pulse"></div></div>
                            <div className="flex items-center justify-between bg-background-light dark:bg-background-dark p-3 rounded-md border border-border-light dark:border-border-dark"><div className="flex items-center"><span className="material-symbols-outlined text-subtext-light dark:text-subtext-dark text-2xl mr-3">payments</span><p className="text-sm text-subtext-light dark:text-subtext-dark">Monetization</p></div><span className="material-symbols-outlined text-subtext-light dark:text-subtext-dark text-lg opacity-50">radio_button_unchecked</span></div>
                            <div className="flex items-center justify-between bg-background-light dark:bg-background-dark p-3 rounded-md border border-border-light dark:border-border-dark"><div className="flex items-center"><span className="material-symbols-outlined text-subtext-light dark:text-subtext-dark text-2xl mr-3">diversity_3</span><p className="text-sm text-subtext-light dark:text-subtext-dark">Team</p></div><span className="material-symbols-outlined text-subtext-light dark:text-subtext-dark text-lg opacity-50">radio_button_unchecked</span></div>
                        </div>
                        <div className="mt-6">
                            <div className="w-full bg-background-light dark:bg-background-dark rounded-full h-2.5 border border-border-light dark:border-border-dark"><div className="bg-primary h-2.5 rounded-full" style={{ width: "60%" }}></div></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section className="bg-card-light dark:bg-card-dark py-16 md:py-24 border-y border-border-light dark:border-border-dark">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Data-Driven Success &amp; Social Proof</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-subtext-light dark:text-subtext-dark">The numbers speak for themselves. Join a community of founders who have successfully launched their ventures with Sun AI.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                    <div className="p-4 flex flex-col items-center">
                        <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                            <svg className="absolute inset-0" viewBox="0 0 100 100"><circle className="stroke-current text-border-light dark:text-border-dark" cx="50" cy="50" fill="transparent" r="45" strokeDasharray="282.74" strokeWidth="5"></circle><circle className="stroke-current text-primary transform -rotate-90 origin-center" cx="50" cy="50" fill="transparent" r="45" strokeDasharray="282.74" strokeDashoffset="70.685" strokeLinecap="round" strokeWidth="5"></circle></svg>
                            <span className="text-3xl font-bold"><AnimatedCounter value={75} />%</span>
                        </div>
                        <h3 className="font-semibold text-lg">Faster Deck Creation</h3>
                        <p className="mt-2 text-sm text-subtext-light dark:text-subtext-dark">Reduce weeks of work to mere minutes.</p>
                    </div>
                    <div className="p-4 flex flex-col items-center">
                        <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                            <svg className="absolute inset-0" viewBox="0 0 100 100"><circle className="stroke-current text-border-light dark:text-border-dark" cx="50" cy="50" fill="transparent" r="45" strokeDasharray="282.74" strokeWidth="5"></circle><circle className="stroke-current text-primary transform -rotate-90 origin-center" cx="50" cy="50" fill="transparent" r="45" strokeDasharray="282.74" strokeDashoffset="141.37" strokeLinecap="round" strokeWidth="5"></circle></svg>
                            <span className="text-3xl font-bold"><AnimatedCounter value={50} />%</span>
                        </div>
                        <h3 className="font-semibold text-lg">Increased Investor Meetings</h3>
                        <p className="mt-2 text-sm text-subtext-light dark:text-subtext-dark">Craft pitches that get noticed and secure calls.</p>
                    </div>
                    <div className="p-4 flex flex-col items-center">
                        <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                            <svg className="absolute inset-0" viewBox="0 0 100 100"><circle className="stroke-current text-border-light dark:text-border-dark" cx="50" cy="50" fill="transparent" r="45" strokeDasharray="282.74" strokeWidth="5"></circle><circle className="stroke-current text-primary transform -rotate-90 origin-center" cx="50" cy="50" fill="transparent" r="45" strokeDasharray="282.74" strokeDashoffset="28.274" strokeLinecap="round" strokeWidth="5"></circle></svg>
                            <span className="text-3xl font-bold"><AnimatedCounter value={90} />%</span>
                        </div>
                        <h3 className="font-semibold text-lg">User Satisfaction Rate</h3>
                        <p className="mt-2 text-sm text-subtext-light dark:text-subtext-dark">Founders love the speed and quality.</p>
                    </div>
                    <div className="p-4 flex flex-col items-center">
                        <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                            <svg className="absolute inset-0" viewBox="0 0 100 100"><circle className="stroke-current text-border-light dark:text-border-dark" cx="50" cy="50" fill="transparent" r="45" strokeDasharray="282.74" strokeWidth="5"></circle><circle className="stroke-current text-primary transform -rotate-90 origin-center" cx="50" cy="50" fill="transparent" r="45" strokeDasharray="282.74" strokeDashoffset="84.822" strokeLinecap="round" strokeWidth="5"></circle></svg>
                            <span className="text-3xl font-bold"><AnimatedCounter value={70} />%</span>
                        </div>
                        <h3 className="font-semibold text-lg">Cost Reduction</h3>
                        <p className="mt-2 text-sm text-subtext-light dark:text-subtext-dark">Save on expensive design agencies.</p>
                    </div>
                </div>
            </div>
        </section>
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">An Entire Startup Ecosystem, Unified by AI</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-subtext-light dark:text-subtext-dark">Go beyond presentations. Our platform is your launchpad for every stage of the startup journey.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="group bg-card-light dark:bg-card-dark p-6 rounded-lg border border-border-light dark:border-border-dark text-left transform hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-xl">
                        <div className="icon-wrapper relative w-12 h-12 flex items-center justify-center mb-4"><div className="icon-bg absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-lg opacity-0"></div><span className="material-symbols-outlined text-primary text-3xl relative">layers</span></div>
                        <h3 className="font-bold text-lg">AI Pitch Deck Wizard</h3>
                        <p className="mt-2 text-sm text-subtext-light dark:text-subtext-dark">Generate an investor-ready deck from a simple prompt in minutes.</p>
                    </div>
                    <div className="group bg-card-light dark:bg-card-dark p-6 rounded-lg border border-border-light dark:border-border-dark text-left transform hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-xl">
                        <div className="icon-wrapper relative w-12 h-12 flex items-center justify-center mb-4"><div className="icon-bg absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-lg opacity-0"></div><span className="material-symbols-outlined text-primary text-3xl relative">work</span></div>
                        <h3 className="font-bold text-lg">AI Jobs Board</h3>
                        <p className="mt-2 text-sm text-subtext-light dark:text-subtext-dark">Connect with top talent at a top AI startup with personalized matching.</p>
                    </div>
                    <div className="group bg-card-light dark:bg-card-dark p-6 rounded-lg border border-border-light dark:border-border-dark text-left transform hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-xl">
                        <div className="icon-wrapper relative w-12 h-12 flex items-center justify-center mb-4"><div className="icon-bg absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-lg opacity-0"></div><span className="material-symbols-outlined text-primary text-3xl relative">hub</span></div>
                        <h3 className="font-bold text-lg">Community Events</h3>
                        <p className="mt-2 text-sm text-subtext-light dark:text-subtext-dark">Access exclusive networking events, with AI-generated introductions.</p>
                    </div>
                    <div className="group bg-card-light dark:bg-card-dark p-6 rounded-lg border border-border-light dark:border-border-dark text-left transform hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-xl">
                        <div className="icon-wrapper relative w-12 h-12 flex items-center justify-center mb-4"><div className="icon-bg absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-lg opacity-0"></div><span className="material-symbols-outlined text-primary text-3xl relative">redeem</span></div>
                        <h3 className="font-bold text-lg">Exclusive Perks</h3>
                        <p className="mt-2 text-sm text-subtext-light dark:text-subtext-dark">Significant discounts on essential startup software and services.</p>
                    </div>
                </div>
            </div>
        </section>
        <section className="py-16 md:py-24 bg-card-light dark:bg-card-dark border-y border-border-light dark:border-border-dark">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Built for Founders, by Founders</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-background-light dark:bg-background-dark p-8 rounded-lg border border-border-light dark:border-border-dark">
                        <div className="flex items-center mb-4">
                            <div className="relative">
                                <img alt="Maria Rodriguez" className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCppGncG4NIlQhP-Mm6ydP25B3hbY93ccUrHDGiSO2teieVc19d4z-z4lIXv-SUmE3Y-VYlpDGUb_yEzMMpIiY9x_QVKR1r1W710kuqh4RB8G-EtR_POxU5_0JxRMRWHomvzmniYkzcRzF8xztKdrSWwdV2Qlk-ZhIo0ZdaW6TCv-9-whx1f42MsrFVPubntiFaUrwfayffzgHyxfPiC6FHovruULy2MAsMcK5el4cmhcqYjWdc7hTkVLprPJDAO_z41k_62V9aDSo" />
                                <div className="absolute inset-0 rounded-full ring-2 ring-primary/50 ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark"></div>
                            </div>
                            <div className="ml-4">
                                <p className="font-bold">Maria Rodriguez</p>
                                <p className="text-sm text-subtext-light dark:text-subtext-dark">Founder, InnovateHub</p>
                            </div>
                        </div>
                        <p className="text-text-light dark:text-text-dark italic relative pl-8 before:content-['“'] before:absolute before:left-0 before:top-0 before:text-5xl before:text-primary before:font-serif">Sun AI is my go-to. I found my co-founder at an event and used the AI Deck Wizard for our seed round. A game-changer.</p>
                    </div>
                    <div className="bg-background-light dark:bg-background-dark p-8 rounded-lg border border-border-light dark:border-border-dark">
                        <div className="flex items-center mb-4">
                            <div className="relative">
                                <img alt="Chen Wei" className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD91z1jOzow1ZHS1VbQbH3qwrYp3Kv0t9oXBZF0-AZ86pKCW88K-KSfltfWrQiQ8oECc8-7knImh8bbp1Z0HI9DUOOFJXDSb8jNJSzxJQWdgJkvHIYWCgoYtjPEMolrZPmkjOPkNyZB8ZNaVffFwyd78iiJHCiCLby_qUOiHBE_wNJkM987QZffxnd0_NiuNqzSLvTIgi2j6mHZlFlRI5lD1IaALbflk9iQyGr5H9QoICxTC58R0V-ONsa_vZnbEd-GYWiXhqMSZ5g" />
                                <div className="absolute inset-0 rounded-full ring-2 ring-primary/50 ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark"></div>
                            </div>
                            <div className="ml-4">
                                <p className="font-bold">Chen Wei</p>
                                <p className="text-sm text-subtext-light dark:text-subtext-dark">CEO, NextLayer</p>
                            </div>
                        </div>
                        <p className="text-text-light dark:text-text-dark italic relative pl-8 before:content-['“'] before:absolute before:left-0 before:top-0 before:text-5xl before:text-primary before:font-serif">It's the first platform that understands the entire founder journey, from pitching to product-market fit.</p>
                    </div>
                </div>
            </div>
        </section>
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to Build Your Masterpiece?</h2>
                <p className="mt-4 text-lg text-subtext-light dark:text-subtext-dark">Join hundreds of VCs, accelerating angles and AI startups</p>
                <div className="mt-8">
                    <Link to="/dashboard" className="bg-primary text-white font-semibold py-3 px-8 rounded-lg text-lg hover:opacity-90 transition-opacity">Start Your Free Trial</Link>
                </div>
            </div>
        </section>
    </>
    );
};

export default Landing;
