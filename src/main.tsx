import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import '../index.css';

// Context Providers - MUST be imported in correct order
import { AuthProvider } from './contexts/AuthContext';
import { StartupProvider } from './contexts/StartupContext';
import { ToastProvider } from './contexts/ToastContext';
import ErrorBoundary from './components/common/ErrorBoundary';

console.log("✅ main.tsx executing");

const rootElement = document.getElementById('root');
console.log("✅ Root element:", rootElement);

if (!rootElement) {
  console.error("❌ Could not find root element!");
  throw new Error("Could not find root element to mount to");
}

console.log("✅ Creating React root...");
const root = ReactDOM.createRoot(rootElement);
console.log("✅ Rendering App component with provider chain...");

// ✅ SINGLE SOURCE OF TRUTH: All providers defined here in correct order
// Order: ErrorBoundary → BrowserRouter → AuthProvider → StartupProvider → ToastProvider → App
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <StartupProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </StartupProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

console.log("✅ React render called with provider chain");