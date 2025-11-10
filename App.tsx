
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from './screens/DashboardLayout';
import PublicLayout from './screens/PublicLayout';

// Public Screens
import Landing from './screens/Landing';
import Terms from './screens/Terms';
import Privacy from './screens/Privacy';
import NotFound from './screens/NotFound';
import Sitemap from './screens/Sitemap';
import About from './screens/About';
import Perks from './screens/Perks';
import PerkDetail from './screens/PerkDetail';
import Events from './screens/Events';
import EventDetail from './screens/EventDetail';
import Jobs from './screens/Jobs';
import JobDetail from './screens/JobDetail';
import HowItWorks from './screens/HowItWorks';
import Blogs from './screens/Blogs';
import BlogDetail from './screens/BlogDetail';
import Services from './screens/Services';
import WebDesign from './screens/WebDesign';
import LogoBranding from './screens/LogoBranding';
import MvpDevelopment from './screens/MvpDevelopment';
import Accelerators from './screens/Accelerators';
import AcceleratorDetail from './screens/AcceleratorDetail';

// App Screens
import Dashboard from './screens/Dashboard';
import WizardSteps from './screens/WizardSteps';
import GeneratingScreen from './screens/GeneratingScreen';

// App Screens (Lazily loaded)
const DeckEditor = lazy(() => import('./screens/DeckEditor'));
const PresentationScreen = lazy(() => import('./screens/PresentationScreen'));
const StartupWizard = lazy(() => import('./screens/StartupWizard'));
const PitchDecks = lazy(() => import('./screens/PitchDecks'));
const MyEvents = lazy(() => import('./screens/MyEvents'));


// Loading fallback component
const LoadingSpinner: React.FC = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[#FBF8F5]">
    <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-[#E87C4D]"></div>
  </div>
);

const App: React.FC = () => {
  return (
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
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/web-design" element={<WebDesign />} />
          <Route path="/services/logo-branding" element={<LogoBranding />} />
          <Route path="/services/mvp-development" element={<MvpDevelopment />} />
          <Route path="/accelerators" element={<Accelerators />} />
          <Route path="/accelerators/:id" element={<AcceleratorDetail />} />
          
          {/* Redirect auth pages to the dashboard for development */}
          <Route path="/login" element={<Navigate to="/dashboard" />} />
          <Route path="/signup" element={<Navigate to="/dashboard" />} />
        </Route>

        {/* --- App Routes (No longer protected for dev) --- */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* NEW: Dashboard expansion routes */}
          <Route path="/startup-wizard" element={<StartupWizard />} />
          <Route path="/pitch-decks" element={<PitchDecks />} />
          <Route path="/my-events" element={<MyEvents />} />

          {/* UPDATED: Pitch deck creation flow nested under pitch-decks */}
          <Route path="/pitch-decks/new" element={<WizardSteps />} />
          <Route path="/pitch-decks/generating" element={<GeneratingScreen />} />
          
          <Route path="/dashboard/decks/:id/edit" element={<DeckEditor />} />
          <Route path="/sitemap" element={<Sitemap />} />
        </Route>

        {/* --- Full-screen Route (No longer protected for dev) --- */}
        <Route
          path="/dashboard/decks/:id/present"
          element={
            <PresentationScreen />
          }
        />

        {/* --- Fallback Route --- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default App;
