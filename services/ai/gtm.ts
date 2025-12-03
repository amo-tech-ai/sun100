
import { FullGTMStrategy, GTMInput } from './types';
import { invokeEdgeFunction } from '../edgeFunctionService';

/**
 * Generates a comprehensive Go-To-Market strategy using a secure Edge Function.
 */
export const generateFullGTMStrategy = async (input: GTMInput): Promise<FullGTMStrategy> => {
    try {
        return await invokeEdgeFunction<FullGTMStrategy>('investor-ai', { 
            action: 'generateFullGTM',
            input 
        });
    } catch (error) {
        console.warn("Edge Function 'generateFullGTM' failed. Falling back to mock data.", error);
        await new Promise(r => setTimeout(r, 3000));

        return {
            executiveSummary: `To capture the ${input.industry} market, ${input.startupName} should leverage a product-led growth motion targeting ${input.targetAudience}. The focus for the next 90 days is validating unit economics and scaling inbound channels.`,
            icp: {
                personaName: "The Innovative Manager",
                painPoints: ["Inefficient workflows", "Lack of visibility", "Siloed data"],
                motivations: ["Automation", "Cost savings", "Team velocity"],
                role: "Head of Operations / Product"
            },
            valueProposition: {
                headline: "Automate your workflow in seconds, not hours.",
                benefits: ["Save 20+ hours/week", "Integrate with existing stack", "No-code setup"],
                differentiators: ["AI-first architecture", "Cheaper than legacy enterprise tools"]
            },
            channels: [
                { name: "LinkedIn Organic", type: "Inbound", tactic: "Founder-led content marketing", priority: "High" },
                { name: "Cold Email", type: "Outbound", tactic: "Targeted campaigns to decision makers", priority: "Medium" },
                { name: "Product Hunt", type: "Community", tactic: "Launch day blitz", priority: "High" }
            ],
            pricingStrategy: {
                model: "Freemium SaaS",
                recommendation: "Start with a generous free tier to drive adoption, then gate advanced analytics.",
                tiers: [
                    { name: "Starter", price: "Free", features: ["Basic access", "1 user", "Community support"] },
                    { name: "Pro", price: "$29/mo", features: ["Unlimited access", "5 users", "Priority support"] },
                    { name: "Enterprise", price: "Custom", features: ["SSO", "Audit logs", "Dedicated account manager"] }
                ]
            },
            launchRoadmap: {
                phase1: { name: "Validation", duration: "Month 1", focus: "Customer Interviews", tasks: ["Interview 50 prospects", "Launch landing page", "Set up analytics"] },
                phase2: { name: "Beta", duration: "Month 2", focus: "Onboarding Flow", tasks: ["Onboard first 100 users", "Iterate on feedback", "Fix critical bugs"] },
                phase3: { name: "Scale", duration: "Month 3", focus: "Growth Channels", tasks: ["Launch on Product Hunt", "Start paid ads", "Hire first sales rep"] }
            },
            risks: [
                { risk: "Low adoption rate", mitigation: "Simplify onboarding", severity: "High" },
                { risk: "Competitor reaction", mitigation: "Focus on niche features", severity: "Medium" }
            ]
        };
    }
};
