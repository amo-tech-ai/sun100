
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import DashboardLayout from './screens/DashboardLayout';
import PublicLayout from './screens/PublicLayout';

// Public Screens
import Landing from './screens/Landing';
import Terms from './screens/Terms';
import Privacy from './screens/Privacy';
import NotFound from './screens/NotFound';

// App Screens
import Dashboard from './screens/Dashboard';
import WizardSteps from './screens/WizardSteps';
import GeneratingScreen from './screens/GeneratingScreen';
import PublishSuccessScreen from './screens/PublishSuccessScreen';
import Sitemap from './screens/Sitemap';

// Lazily loaded components
const DeckEditor = lazy(() => import('./screens/DeckEditor'));
const PresentationScreen = lazy(() => import('./screens/PresentationScreen'));

// --- Restored Public Screens ---
const About = lazy(() => import('./screens/About'));
const Perks = lazy(() => import('./screens/Perks'));
const PerkDetail = lazy(() => import('./screens/PerkDetail'));
const Events = lazy(() => import('./screens/Events'));
const EventDetail = lazy(() => import('./screens/EventDetail'));
const Jobs = lazy(() => import('./screens/Jobs'));
const JobDetail = lazy(() => import('./screens/JobDetail'));
const HowItWorks = lazy(() => import('./screens/HowItWorks'));
const Blogs = lazy(() => import('./screens/Blogs'));
const BlogDetail = lazy(() => import('./screens/BlogDetail'));
const Services = lazy(() => import('./screens/Services'));
const WebDesign = lazy(() => import('./screens/WebDesign'));
const LogoBranding = lazy(() => import('./screens/LogoBranding'));
const MvpDevelopment = lazy(() => import('./screens/MvpDevelopment'));
const Login = lazy(() => import('./screens/Login'));
const Signup = lazy(() => import('./screens/Signup'));
const BusinessModel = lazy(() => import('./screens/BusinessModel'));
const FounderProfile = lazy(() => import('./screens/FounderProfile'));


// --- Renamed SunAIStartupDeck Screens ---
const SunAIStartupDeckLayout = lazy(() => import('./screens/SponsorDeckLayout'));
const SunAIStartupDeckOverview = lazy(() => import('./screens/SponsorDeckOverview'));
const SunAIStartupDeckShowcase = lazy(() => import('./screens/SponsorDeckShowcase'));
const SunAIStartupDeckCategories = lazy(() => import('./screens/SponsorDeckCategories'));
const SunAIStartupDeckApply = lazy(() => import('./screens/SponsorDeckApply'));
const SunAIStartupDeckStories = lazy(() => import('./screens/SponsorDeckStories'));


// --- Restored App Screens ---
const StartupWizard = lazy(() => import('./screens/StartupWizard'));
const PitchDecks = lazy(() => import('./screens/PitchDecks'));
const MyEvents = lazy(() => import('./screens/MyEvents'));
const EventWizard = lazy(() => import('./screens/EventWizard'));
const VideoGenerator = lazy(() => import('./screens/VideoGenerator'));
const InvestorDashboard = lazy(() => import('./screens/InvestorDashboard'));
const DocBuilder = lazy(() => import('./screens/DocBuilder'));


// Loading fallback component
const LoadingSpinner: React.FC = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[#FBF8F5]">
    <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-[#E87C4D]"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* --- Public Routes --- */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/about" element={<About />} />
              <Route path="/perks" element={<Perks />} />
              <Route path="/perks/:id" element={<PerkDetail />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/business-model" element={<BusinessModel />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:id" element={<BlogDetail />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/web-design" element={<WebDesign />} />
              <Route path="/services/logo-branding" element={<LogoBranding />} />
              <Route path="/services/mvp-development" element={<MvpDevelopment />} />
              <Route path="/community/profile/:username" element={<FounderProfile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* SunAIStartupDeck routes now have their own nested layout for sub-navigation */}
              <Route path="/sunaistartup-deck" element={<SunAIStartupDeckLayout />}>
                <Route index element={<SunAIStartupDeckOverview />} />
                <Route path="showcase" element={<SunAIStartupDeckShowcase />} />
                <Route path="categories" element={<SunAIStartupDeckCategories />} />
                <Route path="apply" element={<SunAIStartupDeckApply />} />
                <Route path="stories" element={<SunAIStartupDeckStories />} />
              </Route>
            </Route>

            {/* --- App Routes (Protected) --- */}
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/startup-wizard" element={<StartupWizard />} />
              <Route path="/dashboard/my-events" element={<MyEvents />} />
              <Route path="/dashboard/events/new" element={<EventWizard />} />
              <Route path="/dashboard/video-generator" element={<VideoGenerator />} />
              <Route path="/dashboard/investor-docs" element={<InvestorDashboard />} />
              <Route path="/dashboard/investor-docs/new" element={<DocBuilder />} />
              <Route path="/dashboard/sitemap" element={<Sitemap />} />
              
              <Route path="/pitch-decks" element={<PitchDecks />} />
              <Route path="/pitch-decks/new" element={<WizardSteps />} />
              <Route path="/pitch-decks/generating" element={<GeneratingScreen />} />
              <Route path="/pitch-decks/:id/edit" element={<DeckEditor />} />
              <Route path="/pitch-decks/:id/publish-success" element={<PublishSuccessScreen />} />
            </Route>

            {/* --- Full-screen Route (Protected) --- */}
            <Route
              path="/pitch-decks/:id/present"
              element={<ProtectedRoute><PresentationScreen /></ProtectedRoute>}
            />

            {/* --- Fallback Route --- */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
