
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { templates } from '../styles/templates';
import { FinancialSettings } from '../services/ai/deck';

interface WizardState {
  step: number;
  direction: 'forward' | 'back';
  businessContext: string;
  urls: string[];
  financials: FinancialSettings;
  useThinking: boolean;
  selectedTemplate: keyof typeof templates;
  
  // New Step 3 Fields
  startupType: string[];
  stage: string;
  primaryFocus: string[];
  teamSize: string;
  tractionStage: string;
  
  // New Field for Sales Deck support
  deckType: 'Investor Pitch' | 'Sales Deck';
  
  setStep: (step: number) => void;
  setDirection: (direction: 'forward' | 'back') => void;
  setBusinessContext: (context: string) => void;
  setUrls: (urls: string[]) => void;
  setFinancials: (financials: FinancialSettings) => void;
  updateFinancials: (field: keyof FinancialSettings, value: string) => void;
  setUseThinking: (useThinking: boolean) => void;
  setSelectedTemplate: (selectedTemplate: keyof typeof templates) => void;
  
  // New Setters Implementation
  setStartupType: (types: string[]) => void;
  setStage: (stage: string) => void;
  setPrimaryFocus: (focus: string[]) => void;
  setTeamSize: (size: string) => void;
  setTractionStage: (traction: string) => void;
  
  // New Setter for Deck Type
  setDeckType: (type: 'Investor Pitch' | 'Sales Deck') => void;
  
  resetWizard: () => void;
}

export const useWizardStore = create<WizardState>()(
  persist(
    (set) => ({
      step: 1,
      direction: 'forward',
      businessContext: 'StartupAI is a startup that uses generative AI to create pitch decks for early-stage companies. We leverage large language models to analyze business context and generate compelling narratives, financial projections, and slide designs automatically.',
      urls: [],
      financials: {
        industry: 'FinTech',
        revenueModel: 'Subscription',
        currentRevenue: '0',
        pricePoint: '',
        customerGrowthRate: '10',
        costStructure: { burnRate: '', marketingBudget: '' },
        timeHorizon: '36',
        currency: 'USD',
        fundingGoal: '500000'
      },
      useThinking: true,
      selectedTemplate: 'default',
      
      // Initial State for New Fields
      startupType: [],
      stage: 'Idea',
      primaryFocus: [],
      teamSize: '2–5',
      tractionStage: 'Pre-launch',
      
      deckType: 'Investor Pitch',

      setStep: (step) => set({ step }),
      setDirection: (direction) => set({ direction }),
      setBusinessContext: (businessContext) => set({ businessContext }),
      setUrls: (urls) => set({ urls }),
      setFinancials: (financials: FinancialSettings) => set({ financials }),
      updateFinancials: (field, value) => set((state) => ({
        financials: { ...state.financials, [field]: value }
      })),
      setUseThinking: (useThinking) => set({ useThinking }),
      setSelectedTemplate: (selectedTemplate) => set({ selectedTemplate }),
      
      // New Setters Implementation
      setStartupType: (types) => set({ startupType: types }),
      setStage: (stage) => set({ stage }),
      setPrimaryFocus: (focus) => set({ primaryFocus: focus }),
      setTeamSize: (size) => set({ teamSize: size }),
      setTractionStage: (traction) => set({ tractionStage: traction }),
      
      setDeckType: (type) => set({ deckType: type }),

      resetWizard: () => set({
        step: 1,
        direction: 'forward',
        businessContext: '',
        urls: [],
        financials: {
          industry: 'FinTech',
          revenueModel: 'Subscription',
          currentRevenue: '0',
          pricePoint: '',
          customerGrowthRate: '10',
          costStructure: { burnRate: '', marketingBudget: '' },
          timeHorizon: '36',
          currency: 'USD',
          fundingGoal: ''
        },
        useThinking: true,
        selectedTemplate: 'default',
        startupType: [],
        stage: 'Idea',
        primaryFocus: [],
        teamSize: '2–5',
        tractionStage: 'Pre-launch',
        deckType: 'Investor Pitch'
      })
    }),
    {
      name: 'pitch-deck-wizard-storage',
    }
  )
);
