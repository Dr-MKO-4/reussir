// src/contexts/ToastContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer, ToastType } from '../components/ui/Toast';

interface ToastData {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  isVisible: boolean;
}

interface ToastContextType {
  showToast: (options: {
    type: ToastType;
    title?: string;
    message: string;
    duration?: number;
  }) => string;
  hideToast: (id: string) => void;
  clearAllToasts: () => void;
  // Helpers pour les différents types
  success: (message: string, title?: string, duration?: number) => string;
  error: (message: string, title?: string, duration?: number) => string;
  warning: (message: string, title?: string, duration?: number) => string;
  info: (message: string, title?: string, duration?: number) => string;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: React.ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'top-right',
  maxToasts = 5
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const generateId = () => {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  };

  const showToast = useCallback((options: {
    type: ToastType;
    title?: string;
    message: string;
    duration?: number;
  }) => {
    const id = generateId();
    
    const newToast: ToastData = {
      id,
      type: options.type,
      title: options.title,
      message: options.message,
      duration: options.duration ?? 5000,
      isVisible: true
    };

    setToasts(prevToasts => {
      const updatedToasts = [newToast, ...prevToasts];
      
      // Limiter le nombre de toasts
      if (updatedToasts.length > maxToasts) {
        return updatedToasts.slice(0, maxToasts);
      }
      
      return updatedToasts;
    });

    return id;
  }, [maxToasts]);

  const hideToast = useCallback((id: string) => {
    setToasts(prevToasts => 
      prevToasts.map(toast => 
        toast.id === id ? { ...toast, isVisible: false } : toast
      )
    );

    // Supprimer complètement le toast après l'animation
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, 300);
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Helpers pour les différents types
  const success = useCallback((message: string, title?: string, duration?: number) => {
    return showToast({ type: 'success', message, title, duration });
  }, [showToast]);

  const error = useCallback((message: string, title?: string, duration?: number) => {
    return showToast({ type: 'error', message, title, duration });
  }, [showToast]);

  const warning = useCallback((message: string, title?: string, duration?: number) => {
    return showToast({ type: 'warning', message, title, duration });
  }, [showToast]);

  const info = useCallback((message: string, title?: string, duration?: number) => {
    return showToast({ type: 'info', message, title, duration });
  }, [showToast]);

  const value: ToastContextType = {
    showToast,
    hideToast,
    clearAllToasts,
    success,
    error,
    warning,
    info
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer 
        toasts={toasts}
        onClose={hideToast}
        position={position}
      />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};