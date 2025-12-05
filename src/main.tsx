import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../index.css';

console.log("✅ main.tsx executing");

const rootElement = document.getElementById('root');
console.log("✅ Root element:", rootElement);

if (!rootElement) {
  console.error("❌ Could not find root element!");
  throw new Error("Could not find root element to mount to");
}

console.log("✅ Creating React root...");
const root = ReactDOM.createRoot(rootElement);
console.log("✅ Rendering App component...");

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log("✅ React render called");