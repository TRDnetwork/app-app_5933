import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Icon mapping for different toast types
const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

// Color mapping for different toast types
const toastColors = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

// Icon color mapping
const iconColors = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
};

/**
 * Reusable Toast component for displaying temporary messages
 * Supports different types, auto-dismiss, and action buttons
 */
const Toast = ({
  id,
  type,
  title,
  message,
  duration = 4000,
  onClose,
  action,
}: ToastProps) => {
  const Icon = toastIcons[type];
  const colorClasses = toastColors[type];
  const iconColor = iconColors[type];

  // Auto-dismiss after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const toastContent = (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.5 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={`fixed top-4 right-4 max-w-md w-full bg-white rounded-lg shadow-lg border-l-4 ${colorClasses} overflow-hidden z-50`}
      role="alert"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">{title}</p>
            {message && <p className="mt-1 text-sm opacity-90">{message}</p>}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => onClose(id)}
              className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        {action && (
          <div className="mt-3 flex space-x-2">
            <button
              onClick={() => {
                action.onClick();
                onClose(id);
              }}
              className={`text-sm font-medium px-3 py-1.5 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                type === 'success'
                  ? 'bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-500'
                  : type === 'error'
                  ? 'bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-500'
                  : type === 'warning'
                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:ring-yellow-500'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200 focus:ring-blue-500'
              }`}
            >
              {action.label}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );

  // Use portal to render toast at the end of the document body
  if (typeof document !== 'undefined') {
    return createPortal(toastContent, document.body);
  }

  return toastContent;
};

Toast.displayName = 'Toast';

export default Toast;
---