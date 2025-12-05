export interface SocialLinks {
    linkedin: string;
    twitter: string;
    website: string;
}

export interface TeamMember {
    name: string;
    role: string;
    background: string;
}

export interface StartupDetails {
    name: string;
    logoUrl: string;
    tagline: string;
    description: string;
    website: string;
    fundingGoal: string;
    industry: string;
    stage: string;
    traction: string;
    businessModel: string;
    team: TeamMember[];
}

export interface UserProfile {
    username: string;
    name: string;
    title: string;
    avatarUrl: string;
    bio: string;
    socials: SocialLinks;
    startup: StartupDetails;
    lookingFor: string[];
    publicDecks: { id: string; title: string; imageUrl: string }[];
}
