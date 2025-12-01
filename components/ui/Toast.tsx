
import React from 'react';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: number) => void;
}

const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const AlertCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircleIcon />,
    error: <AlertCircleIcon />,
    info: <InfoIcon />
  };

  const borderColors = {
    success: 'border-green-500',
    error: 'border-red-500',
    info: 'border-blue-500'
  };

  return (
    <div className={`flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-lg border-l-4 ${borderColors[toast.type]} animate-slide-in-right`} role="alert">
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8">
        {icons[toast.type]}
      </div>
      <div className="ml-3 text-sm font-normal text-gray-800">{toast.message}</div>
      <button 
        onClick={() => onClose(toast.id)}
        className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 items-center justify-center" 
        aria-label="Close"
      >
        <XIcon />
      </button>
      <style>{`
        @keyframes slide-in-right {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: ToastMessage[]; removeToast: (id: number) => void }> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
};
