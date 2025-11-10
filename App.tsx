import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from './screens/DashboardLayout';
import PublicLayout from './screens/PublicLayout';

// Public Screens
import Landing from './screens/Landing';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Terms from './screens/Terms';
import Privacy from './screens/Privacy';
import NotFound from './screens/NotFound';

// App Screens
import Dashboard from './screens/Dashboard';
import WizardSteps from './screens/WizardSteps';
import GeneratingScreen from './screens/GeneratingScreen';

// App Screens (Lazily loaded)
const DeckEditor = lazy(() => import('./screens/DeckEditor'));
const PresentationScreen = lazy(() => import('./screens/PresentationScreen'));

// Components
import ProtectedRoute from './components/ProtectedRoute';

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
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
          </Route>

          {/* --- Protected App Routes --- */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pitch-deck" element={<WizardSteps />} />
            <Route path="/pitch-deck/generating" element={<GeneratingScreen />} />
            <Route path="/dashboard/decks/:id/edit" element={<DeckEditor />} />
          </Route>

          {/* --- Full-screen Protected Route (No Layout) --- */}
          <Route
            path="/dashboard/decks/:id/present"
            element={
              <ProtectedRoute>
                <PresentationScreen />
              </ProtectedRoute>
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