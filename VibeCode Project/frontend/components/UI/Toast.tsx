'use client';

import React, { useEffect, useState } from 'react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function Toast({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
  action,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const typeConfig = {
    success: {
      icon: '✓',
      bgColor: 'bg-ai-success',
      textColor: 'text-white',
      borderColor: 'border-ai-success',
    },
    error: {
      icon: '⚠',
      bgColor: 'bg-ai-error',
      textColor: 'text-white',
      borderColor: 'border-ai-error',
    },
    warning: {
      icon: '⚠',
      bgColor: 'bg-ai-warning',
      textColor: 'text-white',
      borderColor: 'border-ai-warning',
    },
    info: {
      icon: 'ℹ',
      bgColor: 'bg-ai-info',
      textColor: 'text-white',
      borderColor: 'border-ai-info',
    },
  };

  const config = typeConfig[type];

  return (
    <div
      className={`
        relative w-full max-w-sm bg-white rounded-ai-lg shadow-ai-xl border border-ai-gray-200
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${isLeaving ? 'translate-x-full opacity-0' : ''}
      `}
      role="alert"
      aria-live="polite"
    >
      {/* Progress bar */}
      {duration > 0 && (
        <div className="absolute top-0 left-0 w-full h-1 bg-ai-gray-200 rounded-t-ai-lg overflow-hidden">
          <div 
            className={`h-full ${config.bgColor} transition-all ease-linear`}
            style={{
              animation: `toast-progress ${duration}ms linear forwards`,
            }}
          />
        </div>
      )}

      <div className="p-ai-md">
        <div className="flex items-start space-x-ai-md">
          {/* Icon */}
          <div className={`flex-shrink-0 w-8 h-8 ${config.bgColor} rounded-ai-md flex items-center justify-center ${config.textColor}`}>
            <span className="text-sm font-bold">{config.icon}</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-ai-gray-900">
              {title}
            </h4>
            {message && (
              <p className="mt-1 text-sm text-ai-gray-600">
                {message}
              </p>
            )}
            
            {/* Action button */}
            {action && (
              <div className="mt-ai-sm">
                <button
                  onClick={action.onClick}
                  className={`text-sm font-medium ${config.textColor} hover:underline`}
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-ai-xs text-ai-gray-400 hover:text-ai-gray-600 hover:bg-ai-gray-100 rounded-ai-sm transition-all duration-ai-fast"
            aria-label="Close notification"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// Toast Container Component
export interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-ai-lg right-ai-lg z-ai-toast space-y-ai-md">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onClose}
        />
      ))}
    </div>
  );
}

// Toast Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: () => {},
    };
    
    setToasts(prev => [...prev, newToast]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (title: string, message?: string, options?: Partial<ToastProps>) => {
    return addToast({ type: 'success', title, message, ...options });
  };

  const error = (title: string, message?: string, options?: Partial<ToastProps>) => {
    return addToast({ type: 'error', title, message, ...options });
  };

  const warning = (title: string, message?: string, options?: Partial<ToastProps>) => {
    return addToast({ type: 'warning', title, message, ...options });
  };

  const info = (title: string, message?: string, options?: Partial<ToastProps>) => {
    return addToast({ type: 'info', title, message, ...options });
  };

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}

// Add CSS for progress bar animation
const toastStyles = `
  @keyframes toast-progress {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
`;

// Inject styles if not already present
if (typeof document !== 'undefined' && !document.getElementById('toast-styles')) {
  const style = document.createElement('style');
  style.id = 'toast-styles';
  style.textContent = toastStyles;
  document.head.appendChild(style);
}