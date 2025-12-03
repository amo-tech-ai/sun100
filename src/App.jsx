
import React, { useState } from 'react';
import { 
  ChevronRight, ChevronLeft, Check, Sparkles, 
  UploadCloud, TrendingUp, Users, DollarSign, 
  Target, Shield, Globe, Briefcase, Layout
} from 'lucide-react';

// --- REUSABLE UI COMPONENTS ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 ${className}`}>
    {children}
  </div>
);

const Label = ({ children }) => (
  <label className="block text-sm font-medium text-slate-700 mb-2">
    {children}
  </label>
);

const Input = ({ placeholder, value, onChange, icon: Icon }) => (
  <div className="relative">
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent block p-3.5 transition-all outline-none ${Icon ? 'pl-10' : ''}`}
    />
    {Icon && <Icon className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />}
  </div>
);

const TextArea = ({ placeholder, value, onChange, rows = 4 }) => (
  <textarea
    value={value}
    onChange={onChange}
    rows={rows}
    placeholder={placeholder}
    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent block p-3.5 transition-all outline-none resize-none"
  />
);

const Chip = ({ label, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
      selected
        ? 'bg-primary-50 border-primary-500 text-primary-700 shadow-sm'
        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
    }`}
  >
    {label}
  </button>
);

// --- WIZARD SCREENS ---

// 1. Basics
const ScreenBasics = ({ data, updateData }) => (
  <div className="space-y-6 animate-fadeIn">
    <div className="text-center md:text-left">
      <h2 className="text-2xl font-bold text-slate-900">Startup Basics</h2>
      <p className="text-slate-500 mt-1">Tell us the core details about your company.</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <div className="space-y-5">
            <div>
              <Label>Startup Name</Label>
              <Input 
                value={data.name} 
                onChange={(e) => updateData('name', e.target.value)} 
                placeholder="e.g. Nexus AI" 
                icon={Briefcase}
              />
            </div>
            <div>
              <Label>Website URL</Label>
              <Input 
                value={data.website} 
                onChange={(e) => updateData('website', e.target.value)} 
                placeholder="https://..." 
                icon={Globe}
              />
            </div>
            <div>
              <Label>One-line Pitch</Label>
              <Input 
                value={data.pitch} 
                onChange={(e) => updateData('pitch', e.target.value)} 
                placeholder="e.g. The operating system for remote work..." 
                icon={Sparkles}
              />
            </div>
            <div>
              <Label>Logo</Label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300 text-slate-400">
                  <UploadCloud size={24} />
                </div>
                <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
                  Upload Image
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg sticky top-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-yellow-400" size={20} />
            <span className="font-semibold">AI Preview</span>
          </div>
          <p className="text-sm text-slate-300 mb-4">Based on your inputs, our AI will generate:</p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <Check size={16} className="mt-0.5 text-green-400" />
              <span>Market positioning statement</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="mt-0.5 text-green-400" />
              <span>Competitor analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="mt-0.5 text-green-400" />
              <span>Investor intro blurb</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// 2. Problem & Solution
const ScreenProblemSolution = ({ data, updateData }) => (
  <div className="space-y-6 animate-fadeIn">
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Problem & Solution</h2>
      <p className="text-slate-500 mt-1">Define the gap in the market and how you fill it.</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Problem Statement</Label>
                <button className="text-xs text-primary-600 font-medium flex items-center gap-1 hover:bg-primary-50 px-2 py-1 rounded-md transition-colors">
                  <Sparkles size={12} /> Improve with AI
                </button>
              </div>
              <TextArea 
                value={data.problem}
                onChange={(e) => updateData('problem', e.target.value)}
                placeholder="Describe the pain point your customers face..."
              />
            </div>
            <div>
              <Label>Solution Summary</Label>
              <TextArea 
                value={data.solution}
                onChange={(e) => updateData('solution', e.target.value)}
                placeholder="How does your product solve this problem?"
              />
            </div>
          </div>
        </Card>

        <Card>
          <Label>Target Customer</Label>
          <div className="flex flex-wrap gap-2 mt-3">
            {['Consumers', 'SMBs', 'Enterprises', 'Creators', 'Developers', 'Government'].map((type) => (
              <Chip 
                key={type} 
                label={type} 
                selected={data.targetCustomer.includes(type)}
                onClick={() => {
                  const current = data.targetCustomer;
                  updateData('targetCustomer', current.includes(type) 
                    ? current.filter(c => c !== type)
                    : [...current, type]
                  );
                }}
              />
            ))}
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1 hidden lg:block">
        <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6 sticky top-6">
          <h4 className="font-semibold text-primary-900 mb-2">Tip</h4>
          <p className="text-sm text-primary-700">
            Investors look for a "Hair on Fire" problem. Focus on the severity and frequency of the pain point.
          </p>
        </div>
      </div>
    </div>
  </div>
);

// 3. Stage & Traction
const ScreenTraction = ({ data, updateData }) => (
  <div className="space-y-6 animate-fadeIn">
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Stage & Traction</h2>
      <p className="text-slate-500 mt-1">Show investors your momentum.</p>
    </div>

    <Card>
      <div className="space-y-8">
        {/* Stage */}
        <div>
          <Label>Current Stage</Label>
          <div className="flex flex-wrap gap-2 mt-3">
            {['Idea', 'MVP', 'Pre-Seed', 'Seed', 'Series A', 'Growth'].map((stage) => (
              <Chip 
                key={stage} 
                label={stage} 
                selected={data.stage === stage}
                onClick={() => updateData('stage', stage)}
              />
            ))}
          </div>
        </div>

        {/* Traction */}
        <div>
          <Label>Traction Status</Label>
          <div className="flex flex-wrap gap-2 mt-3">
            {['Pre-launch', 'Early users', 'Paying customers', 'Scaling revenue'].map((status) => (
              <Chip 
                key={status} 
                label={status} 
                selected={data.tractionStatus === status}
                onClick={() => updateData('tractionStatus', status)}
              />
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div>
          <Label>Key Metrics (Monthly)</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase">Active Users</span>
              <input 
                type="text" 
                placeholder="0"
                className="block w-full bg-transparent border-none text-2xl font-bold text-slate-900 p-0 focus:ring-0 mt-1"
                value={data.metrics.users}
                onChange={(e) => updateData('metrics', {...data.metrics, users: e.target.value})}
              />
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase">Recurring Rev</span>
              <div className="flex items-center mt-1">
                <span className="text-lg text-slate-400 mr-1">$</span>
                <input 
                  type="text" 
                  placeholder="0"
                  className="block w-full bg-transparent border-none text-2xl font-bold text-slate-900 p-0 focus:ring-0"
                  value={data.metrics.revenue}
                  onChange={(e) => updateData('metrics', {...data.metrics, revenue: e.target.value})}
                />
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-xs font-semibold text-slate-500 uppercase">Growth Rate</span>
                <div className="flex items-center mt-1">
                  <input 
                    type="text" 
                    placeholder="0"
                    className="block w-16 bg-transparent border-none text-2xl font-bold text-slate-900 p-0 focus:ring-0"
                    value={data.metrics.growth}
                    onChange={(e) => updateData('metrics', {...data.metrics, growth: e.target.value})}
                  />
                  <span className="text-lg text-slate-400">%</span>
                </div>
              </div>
              {/* Simple chart viz */}
              <div className="absolute bottom-0 right-0 flex items-end gap-1 p-2 opacity-20">
                <div className="w-2 h-4 bg-primary-600 rounded-t-sm"></div>
                <div className="w-2 h-6 bg-primary-600 rounded-t-sm"></div>
                <div className="w-2 h-8 bg-primary-600 rounded-t-sm"></div>
                <div className="w-2 h-12 bg-primary-600 rounded-t-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
);

// 4. Business Model & Comp
const ScreenBusinessModel = ({ data, updateData }) => (
  <div className="space-y-6 animate-fadeIn">
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Business Model</h2>
      <p className="text-slate-500 mt-1">How do you make money and who are you up against?</p>
    </div>

    <Card>
      <div className="space-y-6">
        <div>
          <Label>Model Type</Label>
          <div className="flex flex-wrap gap-2 mt-3">
            {['SaaS', 'Marketplace', 'Subscription', 'Transactional', 'Ads', 'E-commerce', 'API'].map((model) => (
              <Chip 
                key={model} 
                label={model} 
                selected={data.businessModel.includes(model)}
                onClick={() => {
                  const current = data.businessModel;
                  updateData('businessModel', current.includes(model) 
                    ? current.filter(c => c !== model)
                    : [...current, model]
                  );
                }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Pricing Model</Label>
            <Input 
              placeholder="e.g. $29/user/month"
              value={data.pricing}
              onChange={(e) => updateData('pricing', e.target.value)}
              icon={DollarSign}
            />
          </div>
          <div>
            <Label>Key Differentiator</Label>
            <Input 
              placeholder="e.g. 10x faster processing"
              value={data.differentiator}
              onChange={(e) => updateData('differentiator', e.target.value)}
              icon={Shield}
            />
          </div>
        </div>

        <div>
          <Label>Top Competitors</Label>
          <div className="space-y-3 mt-3">
            {[0, 1, 2].map((i) => (
              <Input 
                key={i}
                placeholder={`Competitor ${i + 1}`}
                value={data.competitors[i] || ''}
                onChange={(e) => {
                  const newComps = [...data.competitors];
                  newComps[i] = e.target.value;
                  updateData('competitors', newComps);
                }}
                icon={Target}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  </div>
);

// 5. Team
const ScreenTeam = ({ data, updateData }) => (
  <div className="space-y-6 animate-fadeIn">
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Founding Team</h2>
        <p className="text-slate-500 mt-1">Who is building this?</p>
      </div>
      <div className="hidden md:block">
        <Chip label="Solo" selected={data.teamSize === 'Solo'} onClick={() => updateData('teamSize', 'Solo')} />
        <span className="mx-1"></span>
        <Chip label="2-5" selected={data.teamSize === '2-5'} onClick={() => updateData('teamSize', '2-5')} />
        <span className="mx-1"></span>
        <Chip label="6+" selected={data.teamSize === '6+'} onClick={() => updateData('teamSize', '6+')} />
      </div>
    </div>

    {data.teamMembers.map((member, index) => (
      <Card key={index} className="relative group">
        {index > 0 && (
          <button 
            onClick={() => {
              updateData('teamMembers', data.teamMembers.filter((_, i) => i !== index));
            }}
            className="absolute top-4 right-4 text-slate-400 hover:text-red-500"
          >
            Remove
          </button>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Full Name</Label>
            <Input 
              value={member.name}
              onChange={(e) => {
                const newTeam = [...data.teamMembers];
                newTeam[index].name = e.target.value;
                updateData('teamMembers', newTeam);
              }}
              placeholder="Jane Doe"
              icon={Users}
            />
          </div>
          <div>
            <Label>Role</Label>
            <Input 
              value={member.role}
              onChange={(e) => {
                const newTeam = [...data.teamMembers];
                newTeam[index].role = e.target.value;
                updateData('teamMembers', newTeam);
              }}
              placeholder="CEO & Co-Founder"
            />
          </div>
          <div className="md:col-span-2">
            <Label>Mini Bio</Label>
            <TextArea 
              rows={2}
              value={member.bio}
              onChange={(e) => {
                const newTeam = [...data.teamMembers];
                newTeam[index].bio = e.target.value;
                updateData('teamMembers', newTeam);
              }}
              placeholder="Ex-Google Engineer, 10y experience in..."
            />
          </div>
        </div>
      </Card>
    ))}

    <button
      onClick={() => updateData('teamMembers', [...data.teamMembers, { name: '', role: '', bio: '' }])}
      className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-medium hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-all flex items-center justify-center gap-2"
    >
      <div className="bg-slate-200 rounded-full p-1">
        <Users size={16} />
      </div>
      Add Another Founder
    </button>
  </div>
);

// 6. Funding
const ScreenFunding = ({ data, updateData }) => {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 3 }).format(val);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Funding & Goals</h2>
        <p className="text-slate-500 mt-1">What are your financial needs and strategic targets?</p>
      </div>

      <Card>
        <div className="space-y-8">
          <div>
            <Label>Are you currently raising?</Label>
            <div className="flex gap-4 mt-3">
              <Chip label="Yes, actively" selected={data.raising === true} onClick={() => updateData('raising', true)} />
              <Chip label="No / Not now" selected={data.raising === false} onClick={() => updateData('raising', false)} />
            </div>
          </div>

          {data.raising && (
            <div className="animate-slideDown">
              <div className="flex justify-between items-center mb-4">
                <Label>Target Raise Amount</Label>
                <span className="text-2xl font-bold text-primary-600">
                  {formatCurrency(data.raiseAmount)}
                </span>
              </div>
              <input 
                type="range" 
                min="50000" 
                max="5000000" 
                step="50000"
                value={data.raiseAmount}
                onChange={(e) => updateData('raiseAmount', Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                <span>$50k</span>
                <span>$5M+</span>
              </div>
            </div>
          )}

          <div>
            <Label>Use of Funds / Focus Areas</Label>
            <div className="flex flex-wrap gap-2 mt-3">
              {['Product Dev', 'Engineering', 'Marketing', 'Sales Team', 'Operations', 'Legal'].map((use) => (
                <Chip 
                  key={use} 
                  label={use} 
                  selected={data.useOfFunds.includes(use)}
                  onClick={() => {
                    const current = data.useOfFunds;
                    updateData('useOfFunds', current.includes(use) 
                      ? current.filter(c => c !== use)
                      : [...current, use]
                    );
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <Label>Top Strategic Goal (Next 12 Months)</Label>
            <Input 
              value={data.strategicGoal}
              onChange={(e) => updateData('strategicGoal', e.target.value)}
              placeholder="e.g. Reach $1M ARR and 10k users"
              icon={TrendingUp}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

// 7. Review
const ScreenReview = ({ data, setStep }) => (
  <div className="space-y-6 animate-fadeIn">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-slate-900">Review Profile</h2>
      <p className="text-slate-500 mt-1">Check your details before generating.</p>
    </div>

    <div className="space-y-4">
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-slate-800">Basics</h3>
          <button onClick={() => setStep(1)} className="text-sm text-primary-600 font-medium hover:underline">Edit</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="block text-slate-400 text-xs uppercase font-bold">Name</span>
            <span className="text-slate-900 font-medium">{data.name || 'Not set'}</span>
          </div>
          <div>
            <span className="block text-slate-400 text-xs uppercase font-bold">Website</span>
            <span className="text-slate-900 font-medium">{data.website || 'Not set'}</span>
          </div>
          <div className="md:col-span-2">
             <span className="block text-slate-400 text-xs uppercase font-bold">Pitch</span>
             <span className="text-slate-900">{data.pitch || 'Not set'}</span>
          </div>
        </div>
      </Card>

      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-slate-800">Market & Traction</h3>
          <button onClick={() => setStep(3)} className="text-sm text-primary-600 font-medium hover:underline">Edit</button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
           <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600">{data.stage}</span>
           <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600">{data.tractionStatus}</span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center border-t border-slate-100 pt-4">
           <div>
             <span className="block text-slate-400 text-xs">Users</span>
             <span className="font-bold text-slate-800">{data.metrics.users || '0'}</span>
           </div>
           <div>
             <span className="block text-slate-400 text-xs">Revenue</span>
             <span className="font-bold text-slate-800">${data.metrics.revenue || '0'}</span>
           </div>
           <div>
             <span className="block text-slate-400 text-xs">Growth</span>
             <span className="font-bold text-slate-800">{data.metrics.growth || '0'}%</span>
           </div>
        </div>
      </Card>
      
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-slate-800">Team ({data.teamMembers.length})</h3>
          <button onClick={() => setStep(5)} className="text-sm text-primary-600 font-medium hover:underline">Edit</button>
        </div>
        <div className="space-y-2">
          {data.teamMembers.map((m, i) => (
             <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                  {m.name.charAt(0) || 'U'}
                </div>
                <span className="font-medium">{m.name || 'Unknown'}</span>
                <span className="text-slate-400">-</span>
                <span className="text-slate-500">{m.role || 'Role not set'}</span>
             </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

// 8. Success
const ScreenSuccess = () => (
  <div className="flex flex-col items-center justify-center text-center py-10 animate-scaleIn">
    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 relative">
      <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping"></div>
      <Check size={48} className="text-green-600 relative z-10" />
    </div>
    
    <h2 className="text-3xl font-bold text-slate-900 mb-4">Profile Completed!</h2>
    <p className="text-slate-500 max-w-md mb-10 text-lg">
      Your startup profile has been successfully created. You can now use this data to generate pitch decks and docs.
    </p>

    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
      <button className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-50 transition-colors">
        Go to Dashboard
      </button>
      <button className="flex-1 bg-primary-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all flex items-center justify-center gap-2">
        <Layout size={20} />
        Generate Pitch Deck
      </button>
    </div>
  </div>
);

// --- MAIN APP ---

const App = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 7; // 8th is success

  // Central State
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    pitch: '',
    problem: '',
    solution: '',
    targetCustomer: [],
    stage: 'Idea',
    tractionStatus: 'Pre-launch',
    metrics: { users: '', revenue: '', growth: '' },
    businessModel: [],
    pricing: '',
    differentiator: '',
    competitors: ['', '', ''],
    teamSize: 'Solo',
    teamMembers: [{ name: '', role: '', bio: '' }],
    raising: false,
    raiseAmount: 500000,
    useOfFunds: [],
    strategicGoal: ''
  });

  const updateData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => Math.min(s + 1, 8));
  };

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => Math.max(s - 1, 1));
  };

  const renderScreen = () => {
    switch (step) {
      case 1: return <ScreenBasics data={formData} updateData={updateData} />;
      case 2: return <ScreenProblemSolution data={formData} updateData={updateData} />;
      case 3: return <ScreenTraction data={formData} updateData={updateData} />;
      case 4: return <ScreenBusinessModel data={formData} updateData={updateData} />;
      case 5: return <ScreenTeam data={formData} updateData={updateData} />;
      case 6: return <ScreenFunding data={formData} updateData={updateData} />;
      case 7: return <ScreenReview data={formData} setStep={setStep} />;
      case 8: return <ScreenSuccess />;
      default: return <ScreenBasics data={formData} updateData={updateData} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-slate-900 pb-20">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
              S
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">StartupAI</span>
          </div>
          {step <= totalSteps && (
            <div className="text-sm font-medium text-slate-500">
              Step {step} of {totalSteps}
            </div>
          )}
        </div>
        {/* Progress Bar */}
        {step <= totalSteps && (
          <div className="h-1 w-full bg-slate-100">
            <div 
              className="h-full bg-primary-600 transition-all duration-500 ease-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderScreen()}
      </main>

      {/* Footer Actions (Sticky) */}
      {step <= totalSteps && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 sm:p-6 z-40">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                step === 1 
                  ? 'opacity-0 pointer-events-none' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ChevronLeft size={20} /> Back
            </button>

            <button
              onClick={handleNext}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg shadow-primary-200 hover:shadow-xl flex items-center gap-2"
            >
              {step === totalSteps ? 'Complete Profile' : 'Continue'}
              {step !== totalSteps && <ChevronRight size={20} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
