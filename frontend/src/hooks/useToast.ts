import { useContext } from 'react';
import { ToastContext, ToastContextType } from '../contexts/ToastContext';

/**
 * Hook personnalisé pour accéder aux fonctionnalités de toast
 * @returns {ToastContextType} Contexte toast avec showToast et dismissToast
 */
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default useToast;
