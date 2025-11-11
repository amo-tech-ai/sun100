import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from './screens/DashboardLayout';
import PublicLayout from './screens/PublicLayout';

// Public Screens
import Landing from './screens/Landing';
// Login and Signup are no longer needed for dev flow
// import Login from './screens/Login';
// import Signup from './screens/Signup';
import Terms from './screens/Terms';
import Privacy from './screens/Privacy';
import NotFound from './screens/NotFound';
import Sitemap from './screens/Sitemap';

// App Screens
import Dashboard from './screens/Dashboard';
import WizardSteps from './screens/WizardSteps';
import GeneratingScreen from './screens/GeneratingScreen';
import PublishSuccessScreen from './screens/PublishSuccessScreen';

// App Screens (Lazily loaded)
const DeckEditor = lazy(() => import('./screens/DeckEditor'));
const PresentationScreen = lazy(() => import('./screens/PresentationScreen'));

// Components
// ProtectedRoute is disabled for development
// import ProtectedRoute from './components/ProtectedRoute';

// Loading fallback component
const LoadingSpinner: React.FC = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[#FBF8F5]">
    <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-[#E87C4D]"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* --- Public Routes --- */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            {/* Redirect auth pages to the dashboard for development */}
            <Route path="/login" element={<Navigate to="/dashboard" />} />
            <Route path="/signup" element={<Navigate to="/dashboard" />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
          </Route>

          {/* --- App Routes (No longer protected for dev) --- */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/new" element={<WizardSteps />} />
            <Route path="/dashboard/generating" element={<GeneratingScreen />} />
            <Route path="/dashboard/decks/:id/edit" element={<DeckEditor />} />
            <Route path="/dashboard/decks/:id/publish-success" element={<PublishSuccessScreen />} />
            <Route path="/dashboard/sitemap" element={<Sitemap />} />
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
    </BrowserRouter>
  );
};

export default App;