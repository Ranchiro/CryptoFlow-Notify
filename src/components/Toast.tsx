import React from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Toast: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center p-4 rounded-lg shadow-lg backdrop-blur-md border max-w-md transform transition-all duration-300 ${
            toast.type === 'success'
              ? 'bg-green-500/20 border-green-500/30 text-green-100'
              : toast.type === 'error'
              ? 'bg-red-500/20 border-red-500/30 text-red-100'
              : 'bg-blue-500/20 border-blue-500/30 text-blue-100'
          }`}
        >
          <div className="flex-shrink-0 mr-3">
            {toast.type === 'success' && <CheckCircle className="h-5 w-5" />}
            {toast.type === 'error' && <XCircle className="h-5 w-5" />}
            {toast.type === 'info' && <Info className="h-5 w-5" />}
          </div>
          <div className="flex-1 text-sm">{toast.message}</div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 ml-3 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;