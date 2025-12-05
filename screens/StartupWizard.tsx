
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStartup } from '../hooks/useStartup';
import { enrichStartupProfile } from '../services/ai/investor';
import { EnrichedProfile } from '../services/ai/types';
import { 
  ChevronRight, ChevronLeft, Check, Sparkles, 
  UploadCloud, TrendingUp, Users, DollarSign, 
  Target, Shield, Globe, Briefcase, Layout, 
  Plus, Trash2, Lightbulb, MapPin, Award
} from 'lucide-react';

// --- TYPES ---

interface Founder {
  name: string;
  role: string;
  bio: string;
}

interface WizardState {
  // Basics
  name: string;
  website: string;
  pitch: string;
  logo: string | null;
  // Problem/Solution
  problem: string;
  solution: string;
  targetCustomers: string[];
  // Traction
  stage: string;
  tractionStatus: string;
  mau: string;
  revenue: string;
  growth: string;
  // Business Model
  businessModel: string[];
  pricing: string;
  competitors: string[];
  uvp: string;
  // Team
  teamSize: string;
  founders: Founder[];
  // Funding
  raising: boolean;
  raiseAmount: number;
  useOfFunds: string[];
  goals: { short: string; mid: string; major: string };
}

// --- UI COMPONENTS ---

const WizardCard: React.FC<{ children: React.ReactNode; className?: string; title?: string; subtitle?: string }> = ({ children, className = "", title, subtitle }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 transition-all duration-300 hover:shadow-md ${className}`}>
    {(title || subtitle) && (
      <div className="mb-6">
        {title && <h3 className="text-lg font-bold text-brand-blue">{title}</h3>}
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
    )}
    {children}
  </div>
);

const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <label className={`block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ${className}`}>
    {children}
  </label>
);

const WizardInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ElementType }> = ({ icon: Icon, className = "", ...props }) => (
  <div className="relative group">
    <input
      className={`w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent block p-3.5 transition-all outline-none placeholder:text-slate-400 ${Icon ? 'pl-10' : ''} ${className}`}
      {...props}
    />
    {Icon && (
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-brand-orange transition-colors" />
    )}
  </div>
);

const WizardTextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea
    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent block p-3.5 transition-all outline-none resize-none"
    {...props}
  />
);

const SelectChip: React.FC<{ label: string; selected: boolean; onClick: () => void; multi?: boolean }> = ({ label, selected, onClick, multi }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border flex items-center gap-2 ${
      selected
        ? 'bg-orange-50 border-brand-orange text-brand-orange shadow-sm ring-1 ring-brand-orange/20'
        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
    }`}
  >
    {selected && multi && <Check className="w-3.5 h-3.5" />}
    {label}
  </button>
);

const NavButton: React.FC<{ onClick: () => void; variant?: 'primary' | 'secondary'; disabled?: boolean; children: React.ReactNode }> = ({ onClick, variant = 'primary', disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
      variant === 'primary'
        ? 'bg-brand-orange text-white hover:bg-opacity-90 shadow-lg hover:shadow-brand-orange/20 hover:-translate-y-0.5'
        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
    }`}
  >
    {children}
  </button>
);

// --- SCREENS ---

const ScreenBasics = ({ data, update }: { data: WizardState; update: (k: keyof WizardState, v: any) => void }) => (
  <div className="animate-fade-in-up space-y-6">
    <div className="text-center lg:text-left mb-8">
      <h2 className="text-3xl font-extrabold text-brand-blue">Startup Basics</h2>
      <p className="text-slate-500 mt-2 text-lg">Tell us the core details about your company to get started.</p>
    </div>

    <WizardCard>
      <div className="space-y-6">
        <div>
          <Label>Startup Name</Label>
          <WizardInput 
            placeholder="e.g. Nexus AI" 
            value={data.name}
            onChange={(e) => update('name', e.target.value)}
            icon={Briefcase}
            autoFocus
          />
        </div>
        <div>
          <Label>Website URL</Label>
          <WizardInput 
            placeholder="https://..." 
            value={data.website}
            onChange={(e) => update('website', e.target.value)}
            icon={Globe}
          />
        </div>
        <div>
          <Label>One-line Pitch</Label>
          <WizardInput 
            placeholder="e.g. The operating system for remote work..." 
            value={data.pitch}
            onChange={(e) => update('pitch', e.target.value)}
            icon={Sparkles}
          />
        </div>
        <div>
          <Label>Logo</Label>
          <div className="flex items-center gap-4 p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-slate-200 text-slate-400 group-hover:text-brand-orange group-hover:border-orange-200 transition-all">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">Click to upload logo</p>
              <p className="text-xs text-slate-400">SVG, PNG, JPG (max 2MB)</p>
            </div>
          </div>
        </div>
      </div>
    </WizardCard>
  </div>
);

const ScreenAIAnalysis = ({ data, update, onNext }: { data: WizardState; update: (k: keyof WizardState, v: any) => void, onNext: () => void }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<EnrichedProfile | null>(null);

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        try {
            const result = await enrichStartupProfile(data.name, data.website, data.pitch);
            setAnalysisResult(result);
        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="animate-fade-in-up space-y-6">
            <div className="text-center lg:text-left mb-8">
                <h2 className="text-3xl font-extrabold text-brand-blue flex items-center gap-2">
                    <Sparkles className="text-brand-orange" /> AI Analysis
                </h2>
                <p className="text-slate-500 mt-2 text-lg">Let Gemini 3 refine your profile based on your input.</p>
            </div>

            <WizardCard className="bg-gradient-to-br from-slate-50 to-white">
                {!analysisResult && !isAnalyzing && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-brand-orange/10 text-brand-orange rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Refine with AI</h3>
                        <p className="text-slate-500 mb-6 max-w-md mx-auto">
                            We'll analyze your website or pitch to generate a professional tagline, solution summary, and mission statement.
                        </p>
                        <button 
                            onClick={handleAnalyze}
                            className="px-8 py-3 bg-brand-orange text-white font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-lg hover:shadow-brand-orange/20"
                        >
                            Start Analysis
                        </button>
                    </div>
                )}

                {isAnalyzing && (
                    <div className="text-center py-12">
                         <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                         <h3 className="text-xl font-bold text-slate-800">Analyzing Context...</h3>
                         <p className="text-slate-500 mt-2">Gemini is reading your website and structuring your profile.</p>
                    </div>
                )}

                {analysisResult && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                            <p className="text-sm text-blue-800 font-medium flex items-center gap-2">
                                <Check className="w-4 h-4" /> Analysis Complete. Review suggestions below.
                            </p>
                        </div>

                        <div className="grid gap-6">
                            {/* Tagline */}
                            <div className="p-4 bg-white border border-gray-200 rounded-xl hover:border-brand-orange/50 transition-all">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-bold text-slate-700 text-sm uppercase">Tagline</h4>
                                    <button 
                                        onClick={() => update('pitch', analysisResult.tagline)}
                                        className="text-xs font-bold text-brand-orange bg-orange-50 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors"
                                    >
                                        Use This
                                    </button>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold mb-1">Current</p>
                                        <p className="text-gray-600 bg-gray-50 p-2 rounded">{data.pitch || '(Empty)'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-brand-orange font-bold mb-1">AI Suggestion</p>
                                        <p className="text-gray-800 font-medium bg-orange-50/30 p-2 rounded border border-orange-100">{analysisResult.tagline}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Solution / Description */}
                            <div className="p-4 bg-white border border-gray-200 rounded-xl hover:border-brand-orange/50 transition-all">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-bold text-slate-700 text-sm uppercase">Solution Summary</h4>
                                    <button 
                                        onClick={() => update('solution', analysisResult.description)}
                                        className="text-xs font-bold text-brand-orange bg-orange-50 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors"
                                    >
                                        Use This
                                    </button>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                     <div>
                                        <p className="text-xs text-gray-400 font-bold mb-1">Current</p>
                                        <p className="text-gray-600 bg-gray-50 p-2 rounded min-h-[60px]">{data.solution || '(Empty)'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-brand-orange font-bold mb-1">AI Suggestion</p>
                                        <p className="text-gray-800 font-medium bg-orange-50/30 p-2 rounded border border-orange-100 min-h-[60px]">{analysisResult.description}</p>
                                    </div>
                                </div>
                            </div>

                             {/* UVP / Mission */}
                             <div className="p-4 bg-white border border-gray-200 rounded-xl hover:border-brand-orange/50 transition-all">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-bold text-slate-700 text-sm uppercase">Unique Value Prop</h4>
                                    <button 
                                        onClick={() => update('uvp', analysisResult.mission)}
                                        className="text-xs font-bold text-brand-orange bg-orange-50 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors"
                                    >
                                        Use This
                                    </button>
                                </div>
                                <div className="text-sm">
                                    <p className="text-xs text-brand-orange font-bold mb-1">AI Suggestion</p>
                                    <p className="text-gray-800 font-medium bg-orange-50/30 p-2 rounded border border-orange-100">{analysisResult.mission}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-end pt-4">
                             <button onClick={onNext} className="flex items-center gap-2 font-bold text-brand-blue hover:text-brand-orange transition-colors">
                                Continue to Problem & Solution <ChevronRight size={16} />
                             </button>
                        </div>
                    </div>
                )}
            </WizardCard>
        </div>
    );
};

const ScreenProblem = ({ data, update }: { data: WizardState; update: (k: keyof WizardState, v: any) => void }) => (
  <div className="animate-fade-in-up space-y-6">
    <div className="text-center lg:text-left mb-8">
      <h2 className="text-3xl font-extrabold text-brand-blue">Problem & Solution</h2>
      <p className="text-slate-500 mt-2 text-lg">What are you solving and who is it for?</p>
    </div>

    <WizardCard>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label className="mb-0">Problem Statement</Label>
            <button className="text-xs text-brand-orange font-bold flex items-center gap-1 hover:bg-orange-50 px-2 py-1 rounded-md transition-colors">
              <Sparkles size={12} /> Improve with Gemini
            </button>
          </div>
          <WizardTextArea 
            rows={3}
            placeholder="Describe the pain point your customers face..."
            value={data.problem}
            onChange={(e) => update('problem', e.target.value)}
          />
        </div>
        <div>
          <Label>Solution Summary</Label>
          <WizardTextArea 
            rows={3}
            placeholder="How does your product solve this problem?"
            value={data.solution}
            onChange={(e) => update('solution', e.target.value)}
          />
        </div>
      </div>
    </WizardCard>

    <WizardCard title="Target Customer">
      <div className="flex flex-wrap gap-3">
        {['Consumers', 'SMBs', 'Enterprises', 'Creators', 'Developers', 'Niche'].map((type) => (
          <SelectChip 
            key={type} 
            label={type} 
            selected={data.targetCustomers.includes(type)}
            onClick={() => {
              const current = data.targetCustomers;
              update('targetCustomers', current.includes(type) ? current.filter(c => c !== type) : [...current, type]);
            }}
            multi
          />
        ))}
      </div>
    </WizardCard>
  </div>
);

const ScreenTraction = ({ data, update }: { data: WizardState; update: (k: keyof WizardState, v: any) => void }) => (
  <div className="animate-fade-in-up space-y-6">
    <div className="text-center lg:text-left mb-8">
      <h2 className="text-3xl font-extrabold text-brand-blue">Stage & Traction</h2>
      <p className="text-slate-500 mt-2 text-lg">Show investors your momentum.</p>
    </div>

    <div className="space-y-6">
      <WizardCard title="Startup Stage">
        <div className="flex flex-wrap gap-3">
          {['Idea', 'MVP', 'Pre-Seed', 'Seed', 'Series A+', 'Growth'].map((s) => (
            <SelectChip 
              key={s} 
              label={s} 
              selected={data.stage === s}
              onClick={() => update('stage', s)}
            />
          ))}
        </div>
      </WizardCard>

      <WizardCard title="Traction Status">
        <div className="flex flex-wrap gap-3">
          {['Pre-launch', 'Early users', 'Paying customers', 'Growing revenue'].map((s) => (
            <SelectChip 
              key={s} 
              label={s} 
              selected={data.tractionStatus === s}
              onClick={() => update('tractionStatus', s)}
            />
          ))}
        </div>
      </WizardCard>

      <WizardCard title="Key Metrics">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
             <Label className="mb-1">Monthly Active Users</Label>
             <input 
               type="text" 
               className="w-full bg-transparent text-2xl font-bold text-slate-900 outline-none"
               placeholder="0"
               value={data.mau}
               onChange={(e) => update('mau', e.target.value)}
             />
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
             <Label className="mb-1">Monthly Revenue ($)</Label>
             <input 
               type="text" 
               className="w-full bg-transparent text-2xl font-bold text-slate-900 outline-none"
               placeholder="0"
               value={data.revenue}
               onChange={(e) => update('revenue', e.target.value)}
             />
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
             <Label className="mb-1">Growth Rate (%)</Label>
             <div className="flex items-center">
               <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
               <input 
                 type="text" 
                 className="w-full bg-transparent text-2xl font-bold text-slate-900 outline-none"
                 placeholder="0"
                 value={data.growth}
                 onChange={(e) => update('growth', e.target.value)}
               />
             </div>
          </div>
        </div>
      </WizardCard>
    </div>
  </div>
);

const ScreenBusiness = ({ data, update }: { data: WizardState; update: (k: keyof WizardState, v: any) => void }) => (
  <div className="animate-fade-in-up space-y-6">
    <div className="text-center lg:text-left mb-8">
      <h2 className="text-3xl font-extrabold text-brand-blue">Business Model</h2>
      <p className="text-slate-500 mt-2 text-lg">How do you make money and win the market?</p>
    </div>

    <WizardCard>
      <div className="space-y-6">
        <div>
          <Label>Model Type</Label>
          <div className="flex flex-wrap gap-3 mt-2">
            {['SaaS', 'Marketplace', 'Subscription', 'Usage-based', 'Ads', 'E-commerce'].map((model) => (
              <SelectChip 
                key={model} 
                label={model} 
                selected={data.businessModel.includes(model)}
                onClick={() => {
                  const current = data.businessModel;
                  update('businessModel', current.includes(model) ? current.filter(c => c !== model) : [...current, model]);
                }}
                multi
              />
            ))}
          </div>
        </div>

        <div>
          <Label>Pricing Model</Label>
          <WizardInput 
            placeholder="e.g. Freemium with $29/mo Pro tier"
            value={data.pricing}
            onChange={(e) => update('pricing', e.target.value)}
            icon={DollarSign}
          />
        </div>
      </div>
    </WizardCard>

    <WizardCard title="Competition">
       <div className="space-y-4">
          <div>
            <Label>Top 3 Competitors</Label>
            <div className="space-y-3">
              {[0, 1, 2].map(i => (
                <WizardInput 
                  key={i}
                  placeholder={`Competitor ${i + 1}`}
                  value={data.competitors[i] || ''}
                  onChange={(e) => {
                    const newComps = [...data.competitors];
                    newComps[i] = e.target.value;
                    update('competitors', newComps);
                  }}
                  icon={Shield}
                />
              ))}
            </div>
          </div>
          <div>
            <Label>Unique Value Proposition</Label>
            <WizardTextArea 
              rows={2}
              placeholder="Why do customers choose you over them?"
              value={data.uvp}
              onChange={(e) => update('uvp', e.target.value)}
            />
          </div>
       </div>
    </WizardCard>
  </div>
);

const ScreenTeam = ({ data, update }: { data: WizardState; update: (k: keyof WizardState, v: any) => void }) => (
  <div className="animate-fade-in-up space-y-6">
     <div className="text-center lg:text-left mb-8">
      <h2 className="text-3xl font-extrabold text-brand-blue">Founding Team</h2>
      <p className="text-slate-500 mt-2 text-lg">Who is building this vision?</p>
    </div>

    <WizardCard className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <Label className="mb-0">Team Size</Label>
      </div>
      <div className="flex flex-wrap gap-3">
        {['Solo', '2–5', '6–15', '16+'].map((s) => (
            <SelectChip 
              key={s} 
              label={s} 
              selected={data.teamSize === s}
              onClick={() => update('teamSize', s)}
            />
        ))}
      </div>
    </WizardCard>

    {data.founders.map((founder, index) => (
      <WizardCard key={index} className="relative group">
        {index > 0 && (
          <button 
            onClick={() => update('founders', data.founders.filter((_, i) => i !== index))}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <WizardInput 
                placeholder="Full Name"
                value={founder.name}
                onChange={(e) => {
                  const newFounders = [...data.founders];
                  newFounders[index].name = e.target.value;
                  update('founders', newFounders);
                }}
                icon={Users}
              />
            </div>
            <div>
              <Label>Role</Label>
               <div className="relative">
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent block p-3.5 appearance-none outline-none"
                    value={founder.role}
                    onChange={(e) => {
                      const newFounders = [...data.founders];
                      newFounders[index].role = e.target.value;
                      update('founders', newFounders);
                    }}
                  >
                    <option value="">Select Role</option>
                    <option value="CEO">CEO</option>
                    <option value="CTO">CTO</option>
                    <option value="COO">COO</option>
                    <option value="CMO">CMO</option>
                    <option value="Founder">Founder</option>
                  </select>
                  <ChevronRight className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
               </div>
            </div>
          </div>
          <div>
            <Label>Short Bio</Label>
            <WizardTextArea 
              rows={2}
              placeholder="Key experience, past exits, domain expertise..."
              value={founder.bio}
              onChange={(e) => {
                const newFounders = [...data.founders];
                newFounders[index].bio = e.target.value;
                update('founders', newFounders);
              }}
            />
          </div>
        </div>
      </WizardCard>
    ))}

    <button
      onClick={() => update('founders', [...data.founders, { name: '', role: '', bio: '' }])}
      className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-bold hover:border-brand-orange/50 hover:text-brand-orange hover:bg-orange-50/50 transition-all flex items-center justify-center gap-2"
    >
      <Plus className="w-5 h-5" /> Add Another Founder
    </button>
  </div>
);

const ScreenFunding = ({ data, update }: { data: WizardState; update: (k: keyof WizardState, v: any) => void }) => (
  <div className="animate-fade-in-up space-y-6">
    <div className="text-center lg:text-left mb-8">
      <h2 className="text-3xl font-extrabold text-brand-blue">Funding & Goals</h2>
      <p className="text-slate-500 mt-2 text-lg">What are your financial needs?</p>
    </div>

    <WizardCard>
      <div className="space-y-8">
        <div>
          <Label>Are you raising?</Label>
          <div className="flex gap-3 mt-2">
            <SelectChip label="Yes, Actively" selected={data.raising === true} onClick={() => update('raising', true)} />
            <SelectChip label="No / Not Now" selected={data.raising === false} onClick={() => update('raising', false)} />
          </div>
        </div>

        {data.raising && (
          <div className="animate-fade-in-up">
             <div className="flex justify-between items-center mb-4">
                <Label className="mb-0">Target Raise Amount</Label>
                <span className="text-2xl font-bold text-brand-orange">${(data.raiseAmount / 1000)}k</span>
             </div>
             <input 
               type="range" 
               min="50000" 
               max="5000000" 
               step="50000"
               value={data.raiseAmount}
               onChange={(e) => update('raiseAmount', parseInt(e.target.value))}
               className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-orange"
             />
             <div className="flex justify-between text-xs text-slate-400 mt-2 font-bold">
               <span>$50k</span>
               <span>$5M+</span>
             </div>
          </div>
        )}

        <div>
          <Label>Use of Funds</Label>
          <div className="flex flex-wrap gap-3 mt-2">
            {['Product', 'Engineering', 'Marketing', 'Sales', 'Operations', 'Legal'].map((use) => (
              <SelectChip 
                key={use} 
                label={use} 
                selected={data.useOfFunds.includes(use)}
                onClick={() => {
                  const current = data.useOfFunds;
                  update('useOfFunds', current.includes(use) ? current.filter(c => c !== use) : [...current, use]);
                }}
                multi
              />
            ))}
          </div>
        </div>

        <div>
          <Label>Top 3 Goals</Label>
          <div className="space-y-3 mt-2">
            <WizardInput 
              placeholder="Short-term goal (30 days)" 
              value={data.goals.short}
              onChange={(e) => update('goals', { ...data.goals, short: e.target.value })}
              icon={Target}
            />
             <WizardInput 
              placeholder="Mid-term goal (12 months)" 
              value={data.goals.mid}
              onChange={(e) => update('goals', { ...data.goals, mid: e.target.value })}
              icon={Target}
            />
             <WizardInput 
              placeholder="Major Milestone (Vision)" 
              value={data.goals.major}
              onChange={(e) => update('goals', { ...data.goals, major: e.target.value })}
              icon={Award}
            />
          </div>
        </div>
      </div>
    </WizardCard>
  </div>
);

const ScreenReview = ({ data, setStep }: { data: WizardState; setStep: (s: number) => void }) => {
  const sections = [
    { title: 'Basics', step: 1, content: [data.name, data.website] },
    { title: 'Problem & Solution', step: 3, content: [data.problem, data.solution] },
    { title: 'Stage & Traction', step: 4, content: [data.stage, data.tractionStatus] },
    { title: 'Business Model', step: 5, content: [data.businessModel.join(', '), data.pricing] },
    { title: 'Team', step: 6, content: [`${data.teamSize} Members`, data.founders[0]?.name] },
    { title: 'Funding', step: 7, content: [data.raising ? `Raising $${data.raiseAmount}` : 'Not raising'] },
  ];

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="text-center lg:text-left mb-8">
        <h2 className="text-3xl font-extrabold text-brand-blue">Review Profile</h2>
        <p className="text-slate-500 mt-2 text-lg">Confirm your details before finalizing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section, i) => (
          <WizardCard key={i} className="relative group hover:border-brand-orange/50">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-slate-800">{section.title}</h3>
              <button onClick={() => setStep(section.step)} className="text-xs font-bold text-brand-orange bg-orange-50 px-2 py-1 rounded hover:bg-orange-100 transition-colors">
                Edit
              </button>
            </div>
            <div className="space-y-1">
              {section.content.map((line, j) => (
                 <p key={j} className="text-sm text-slate-600 truncate">{line || <span className="text-slate-300 italic">Empty</span>}</p>
              ))}
            </div>
          </WizardCard>
        ))}
      </div>
    </div>
  );
};

const ScreenSuccess = ({ data }: { data: WizardState }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 animate-scale-in">
       <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping"></div>
          <Check size={48} className="text-green-600 relative z-10" />
       </div>
       
       <h2 className="text-4xl font-extrabold text-brand-blue mb-4">Profile Ready!</h2>
       <p className="text-slate-500 max-w-md mb-10 text-lg">
         We've compiled your profile for <strong>{data.name}</strong>. You're all set to start building decks and attracting investors.
       </p>

       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full max-w-md mb-10 text-left flex items-start gap-4">
          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-400 text-xl">
             {data.name.charAt(0) || 'S'}
          </div>
          <div>
             <h3 className="font-bold text-slate-900 text-lg">{data.name}</h3>
             <p className="text-sm text-slate-500 line-clamp-1">{data.pitch}</p>
          </div>
       </div>

       <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button onClick={() => navigate('/dashboard')} className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-50 transition-colors">
            Go to Dashboard
          </button>
          <button onClick={() => navigate('/pitch-decks/new')} className="flex-1 bg-brand-orange text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-brand-orange/20 hover:bg-opacity-90 transition-all flex items-center justify-center gap-2">
            <Layout size={20} />
            Generate Pitch Deck
          </button>
       </div>
    </div>
  );
}

// --- MAIN WIZARD COMPONENT ---

const StartupWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { profile, updateProfile } = useStartup();
  
  // Initial State
  const [wizardData, setWizardData] = useState<WizardState>({
    name: profile.name || '',
    website: profile.website || '',
    pitch: profile.tagline || '',
    logo: profile.logoUrl || null,
    problem: '',
    solution: '',
    targetCustomers: [],
    stage: profile.stage || 'Idea',
    tractionStatus: 'Pre-launch',
    mau: '',
    revenue: '',
    growth: '',
    businessModel: [],
    pricing: '',
    competitors: ['', '', ''],
    uvp: '',
    teamSize: profile.teamSize || 'Solo',
    founders: [{ name: '', role: '', bio: '' }],
    raising: false,
    raiseAmount: 500000,
    useOfFunds: [],
    goals: { short: '', mid: '', major: '' }
  });

  const totalSteps = 9;

  const updateData = (key: keyof WizardState, value: any) => {
    setWizardData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step === totalSteps - 1) {
        // Save to global context/DB on completion
        updateProfile({
            name: wizardData.name,
            website: wizardData.website,
            tagline: wizardData.pitch,
            stage: wizardData.stage,
            teamSize: wizardData.teamSize,
            // Map other fields if StartupProfile interface is extended
        });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => Math.min(s + 1, totalSteps));
  };

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => Math.max(s - 1, 1));
  };

  const renderScreen = () => {
    switch (step) {
      case 1: return <ScreenBasics data={wizardData} update={updateData} />;
      case 2: return <ScreenAIAnalysis data={wizardData} update={updateData} onNext={handleNext} />;
      case 3: return <ScreenProblem data={wizardData} update={updateData} />;
      case 4: return <ScreenTraction data={wizardData} update={updateData} />;
      case 5: return <ScreenBusiness data={wizardData} update={updateData} />;
      case 6: return <ScreenTeam data={wizardData} update={updateData} />;
      case 7: return <ScreenFunding data={wizardData} update={updateData} />;
      case 8: return <ScreenReview data={wizardData} setStep={setStep} />;
      case 9: return <ScreenSuccess data={wizardData} />;
      default: return <ScreenBasics data={wizardData} update={updateData} />;
    }
  };

  const getAIPreviewText = () => {
    switch(step) {
       case 1: return ["Market positioning statement", "Competitor analysis", "Investor intro blurb"];
       case 2: return ["Optimized Tagline", "Mission Statement", "Solution Draft"];
       case 3: return ["Refined Problem Statement", "Solution Benefit Analysis", "Customer Persona Profile"];
       case 4: return ["Growth Trajectory Chart", "Key Metric Highlights", "Stage-Gate Analysis"];
       case 5: return ["Revenue Model Diagram", "Pricing Tier Strategy", "Competitive Matrix"];
       case 6: return ["Team Strength Assessment", "Founder Bio Highlights", "Skill Gap Analysis"];
       case 7: return ["Funding Ask Slide", "Use of Funds Chart", "Milestone Roadmap"];
       default: return ["Complete Startup Profile", "Investor Pitch Deck", "One-Pager Summary"];
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-display text-slate-900 flex flex-col">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
           <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center text-white font-bold shadow-sm">S</div>
              <span className="font-bold text-lg tracking-tight text-brand-blue hidden sm:inline">StartupAI</span>
           </div>
           {step < totalSteps && (
             <div className="flex items-center gap-4">
               <span className="text-sm font-medium text-slate-500 hidden sm:inline">Step {step} of {totalSteps - 1}</span>
               <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-orange transition-all duration-500 ease-out" style={{ width: `${(step / (totalSteps - 1)) * 100}%` }}></div>
               </div>
             </div>
           )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left / Center Content */}
            <div className={`lg:col-span-${step === totalSteps ? '12' : '8'} w-full max-w-3xl mx-auto lg:mx-0`}>
               {renderScreen()}
            </div>

            {/* Right Sidebar (Desktop) */}
            {step < totalSteps && (
              <div className="hidden lg:block lg:col-span-4">
                 <div className="sticky top-24 space-y-6">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg ring-1 ring-slate-900/5">
                       <div className="flex items-center gap-2 mb-6 border-b border-slate-700/50 pb-4">
                          <Sparkles className="text-brand-orange" size={20} />
                          <span className="font-bold tracking-wide">AI Preview</span>
                       </div>
                       <p className="text-sm text-slate-300 mb-4 font-medium">Based on your inputs, our AI will generate:</p>
                       <ul className="space-y-4">
                          {getAIPreviewText().map((item, i) => (
                             <li key={i} className="flex items-start gap-3 text-sm">
                                <div className="mt-0.5 bg-green-500/20 p-1 rounded-full">
                                   <Check size={12} className="text-green-400" />
                                </div>
                                <span className="text-slate-100">{item}</span>
                             </li>
                          ))}
                       </ul>
                       <div className="mt-6 pt-4 border-t border-slate-700/50">
                          <div className="flex items-center justify-between text-xs text-slate-400">
                             <span>Gemini 3 Pro</span>
                             <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Active</span>
                          </div>
                       </div>
                    </div>

                    {/* Helper Tip Card */}
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                       <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                          <Lightbulb size={16} className="text-blue-600" /> Pro Tip
                       </h4>
                       <p className="text-sm text-blue-800 leading-relaxed">
                          Investors skim profiles. Keep your "One-line Pitch" under 140 characters and focus on the specific problem you solve.
                       </p>
                    </div>
                 </div>
              </div>
            )}
        </div>
      </div>

      {/* Footer Navigation (Sticky) */}
      {step < totalSteps && step !== 2 && (
        <div className="sticky bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200 p-4 z-40">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <NavButton onClick={handleBack} variant="secondary" disabled={step === 1}>
               <ChevronLeft size={18} /> Back
            </NavButton>
            <NavButton onClick={handleNext} variant="primary">
               {step === totalSteps - 1 ? 'Complete Profile' : 'Continue'} <ChevronRight size={18} />
            </NavButton>
          </div>
        </div>
      )}

    </div>
  );
};

export default StartupWizard;
