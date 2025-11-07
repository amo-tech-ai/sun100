
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import DashboardLayout from './screens/DashboardLayout';
import Dashboard from './screens/Dashboard';
import WizardSteps from './screens/WizardSteps';
import GeneratingScreen from './screens/GeneratingScreen';
import DeckEditor from './screens/DeckEditor';
import PresentationScreen from './screens/PresentationScreen';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="pitch-deck" element={<WizardSteps />} />
          <Route path="pitch-deck/generating" element={<GeneratingScreen />} />
          <Route path="dashboard/decks/:id/edit" element={<DeckEditor />} />
        </Route>
        <Route path="/dashboard/decks/:id/present" element={<PresentationScreen />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
