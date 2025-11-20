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

  setStep: (step: number) => void;
  setDirection: (direction: 'forward' | 'back') => void;
  setBusinessContext: (context: string) => void;
  setUrls: (urls: string[]) => void;
  setFinancials: (financials: FinancialSettings) => void;
  updateFinancials: (field: keyof FinancialSettings, value: string) => void;
  setUseThinking: (useThinking: boolean) => void;
  setSelectedTemplate: (template: keyof typeof templates) => void;
  resetWizard: () => void;
}

export const useWizardStore = create<WizardState>()(
  persist(
    (set) => ({
      step: 1,
      direction: 'forward',
      businessContext: 'Sun AI is a startup that uses generative AI to create pitch decks for early-stage companies. We leverage large language models to analyze business context and generate compelling narratives, financial projections, and slide designs automatically.',
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

      setStep: (step) => set({ step }),
      setDirection: (direction) => set({ direction }),
      setBusinessContext: (businessContext) => set({ businessContext }),
      setUrls: (urls) => set({ urls }),
      setFinancials: (financials) => set({ financials }),
      updateFinancials: (field, value) => set((state) => ({
        financials: { ...state.financials, [field]: value }
      })),
      setUseThinking: (useThinking) => set({ useThinking }),
      setSelectedTemplate: (selectedTemplate) => set({ selectedTemplate }),
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
      })
    }),
    {
      name: 'pitch-deck-wizard-storage',
    }
  )
);