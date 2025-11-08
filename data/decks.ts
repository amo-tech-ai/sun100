import { templates } from '../styles/templates';

// --- Type Definitions ---
export interface Slide {
  id: string;
  title: string;
  content: string; // Bullet points separated by newlines
  imageUrl?: string; // Can be a URL or an AI prompt
  template?: keyof typeof templates;
}

export interface Deck {
  id: string;
  title: string;
  template: keyof typeof templates;
  slides: Slide[];
}

// --- Mock Data ---
// This serves as a fallback if the AI generation fails or is bypassed.
export const mockDeck: Deck = {
  id: 'mock-deck-123',
  title: 'Project Sunspot Q3 Update',
  template: 'default',
  slides: [
    { id: 'slide-1', title: 'Welcome to Project Sunspot', content: 'Our Q3 achievements\nRoadmap for Q4\nKey challenges and solutions', imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop' },
    { id: 'slide-2', title: 'Key Metrics', content: 'User growth increased by 25%\nRevenue surpassed $1.2M\nCustomer satisfaction at 98%', imageUrl: 'upward trending business chart' },
    { id: 'slide-3', title: 'What\'s Next?', content: 'Launch new marketing campaign\nExpand into European market\nHire 5 new engineers', imageUrl: 'global map with pins in Europe' },
  ]
};